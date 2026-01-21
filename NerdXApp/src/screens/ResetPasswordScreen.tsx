import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    StatusBar,
    AppState,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { supabase } from '../services/supabase';
import { authApi } from '../services/api/authApi';

const { width, height } = Dimensions.get('window');

// Session status types
type SessionStatus = 'loading' | 'ready' | 'error' | 'expired';

const ResetPasswordScreen: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const navigation = useNavigation();
    const route = useRoute();
    const hasVerifiedToken = useRef(false);
    
    // Get token_hash and type from route params (passed via deep link from Supabase email)
    // Supabase sends: token_hash, type (recovery), and sometimes access_token
    const tokenHash = route.params?.token_hash;
    const tokenType = route.params?.type;
    const accessToken = route.params?.access_token;
    const refreshToken = route.params?.refresh_token;

    useEffect(() => {
        console.log('🔑 ResetPasswordScreen mounted');
        console.log('🔑 Route params:', JSON.stringify(route.params));
        
        // Initialize session check
        initializeResetSession();
        
        // Handle app state changes (when app comes to foreground from email link)
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active' && !hasVerifiedToken.current) {
                initializeResetSession();
            }
        });

        // Check initial URL if app was opened from link
        Linking.getInitialURL().then((url) => {
            if (url) {
                console.log('🔑 Initial URL:', url);
                // Only process production deep links (nerdx://) or Supabase callbacks
                if (url.startsWith('nerdx://') || url.includes('supabase.co/auth/v1/callback')) {
                    handleDeepLinkUrl(url);
                } else {
                    console.log('🔑 Skipping dev URL, waiting for production deep link');
                }
            }
        });

        // Listen for URL changes (when link is clicked while app is open)
        const linkingSubscription = Linking.addEventListener('url', (event) => {
            console.log('🔑 URL event:', event.url);
            // Only process production deep links (nerdx://) or Supabase callbacks
            if (event.url.startsWith('nerdx://') || event.url.includes('supabase.co/auth/v1/callback')) {
                handleDeepLinkUrl(event.url);
            } else {
                console.log('🔑 Skipping dev URL, waiting for production deep link');
            }
        });

        return () => {
            subscription.remove();
            linkingSubscription.remove();
        };
    }, []);

    // Re-run verification when route params change
    useEffect(() => {
        if (tokenHash || accessToken) {
            console.log('🔑 Token params detected, verifying...');
            initializeResetSession();
        }
    }, [tokenHash, accessToken]);

    const handleDeepLinkUrl = async (url: string) => {
        try {
            console.log('🔑 Parsing deep link URL:', url);
            
            // Skip Expo dev URLs - only process production deep links
            if (url.startsWith('exp://') || (url.startsWith('http://') && !url.includes('supabase.co'))) {
                console.log('🔑 Skipping dev URL, waiting for production deep link');
                return;
            }
            
            // Only process if it's a production deep link (nerdx://) or Supabase callback
            if (!url.startsWith('nerdx://') && !url.includes('supabase.co/auth/v1/callback')) {
                console.log('🔑 Skipping non-production URL');
                return;
            }
            
            const parsed = Linking.parse(url);
            console.log('🔑 Parsed URL:', JSON.stringify(parsed));
            
            // Handle nerdx://reset-password (production password reset callback)
            if ((parsed.scheme === 'nerdx' && (parsed.path === 'reset-password' || parsed.hostname === 'reset-password')) ||
                (url.includes('supabase.co/auth/v1/callback') && parsed.queryParams?.type === 'recovery')) {
                const params = parsed.queryParams || {};
                
                // Extract Supabase token parameters
                const urlTokenHash = params.token_hash as string;
                const urlType = params.type as string;
                const urlAccessToken = params.access_token as string;
                const urlRefreshToken = params.refresh_token as string;
                
                console.log('🔑 URL params - token_hash:', urlTokenHash ? 'present' : 'missing', 
                           ', type:', urlType, 
                           ', access_token:', urlAccessToken ? 'present' : 'missing');
                
                // If we have token_hash, verify it with Supabase
                if (urlTokenHash && urlType === 'recovery') {
                    await verifyTokenHash(urlTokenHash, urlType);
                } 
                // If we have access_token directly (some Supabase versions), set session
                else if (urlAccessToken) {
                    await setSessionFromTokens(urlAccessToken, urlRefreshToken);
                }
            }
        } catch (error) {
            console.error('🔑 Error parsing deep link:', error);
            setSessionStatus('error');
            setErrorMessage('Invalid reset link format');
        }
    };

    const initializeResetSession = async () => {
        // Prevent duplicate verification
        if (hasVerifiedToken.current) {
            console.log('🔑 Token already verified, skipping');
            return;
        }
        
        setSessionStatus('loading');
        setErrorMessage(null);
        
        try {
            // First, check if we already have a valid session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (session?.user) {
                console.log('🔑 Existing session found for:', session.user.email);
                hasVerifiedToken.current = true;
                setUserEmail(session.user.email || null);
                setSessionStatus('ready');
                return;
            }
            
            // If we have token_hash from route params, verify it
            if (tokenHash && tokenType === 'recovery') {
                console.log('🔑 Verifying token_hash from route params');
                await verifyTokenHash(tokenHash, tokenType);
                return;
            }
            
            // If we have access_token from route params, set session
            if (accessToken) {
                console.log('🔑 Setting session from access_token');
                await setSessionFromTokens(accessToken, refreshToken);
                return;
            }
            
            // No tokens found - user may have navigated here manually
            console.log('🔑 No tokens found, checking for existing session...');
            if (sessionError) {
                console.error('🔑 Session error:', sessionError);
            }
            
            // Give a short delay to allow deep link params to propagate
            setTimeout(async () => {
                const { data: { session: delayedSession } } = await supabase.auth.getSession();
                if (delayedSession?.user) {
                    hasVerifiedToken.current = true;
                    setUserEmail(delayedSession.user.email || null);
                    setSessionStatus('ready');
                } else {
                    setSessionStatus('error');
                    setErrorMessage('No reset token found. Please use the link from your email or request a new reset link.');
                }
            }, 1000);
            
        } catch (error) {
            console.error('🔑 Error initializing reset session:', error);
            setSessionStatus('error');
            setErrorMessage('Failed to verify reset link. Please try again.');
        }
    };

    const verifyTokenHash = async (hash: string, type: string) => {
        try {
            console.log('🔑 Calling supabase.auth.verifyOtp with token_hash');
            
            const { data, error } = await supabase.auth.verifyOtp({
                token_hash: hash,
                type: type as 'recovery',
            });
            
            if (error) {
                console.error('🔑 OTP verification error:', error);
                hasVerifiedToken.current = true; // Mark as attempted
                
                if (error.message.includes('expired') || error.message.includes('invalid')) {
                    setSessionStatus('expired');
                    setErrorMessage('This reset link has expired. Please request a new one.');
                } else {
                    setSessionStatus('error');
                    setErrorMessage(error.message || 'Failed to verify reset link');
                }
                return;
            }
            
            if (data?.session?.user) {
                console.log('🔑 Token verified successfully for:', data.session.user.email);
                hasVerifiedToken.current = true;
                setUserEmail(data.session.user.email || null);
                setSessionStatus('ready');
            } else {
                console.log('🔑 No session returned from verification');
                setSessionStatus('error');
                setErrorMessage('Unable to verify reset link. Please request a new one.');
            }
        } catch (error: any) {
            console.error('🔑 Token verification exception:', error);
            hasVerifiedToken.current = true;
            setSessionStatus('error');
            setErrorMessage(error.message || 'Failed to verify reset link');
        }
    };

    const setSessionFromTokens = async (access: string, refresh?: string) => {
        try {
            console.log('🔑 Setting session from tokens');
            
            const { data, error } = await supabase.auth.setSession({
                access_token: access,
                refresh_token: refresh || '',
            });
            
            if (error) {
                console.error('🔑 Set session error:', error);
                hasVerifiedToken.current = true;
                setSessionStatus('error');
                setErrorMessage(error.message || 'Failed to establish session');
                return;
            }
            
            if (data?.session?.user) {
                console.log('🔑 Session set successfully for:', data.session.user.email);
                hasVerifiedToken.current = true;
                setUserEmail(data.session.user.email || null);
                setSessionStatus('ready');
            } else {
                setSessionStatus('error');
                setErrorMessage('Unable to establish session');
            }
        } catch (error: any) {
            console.error('🔑 Set session exception:', error);
            hasVerifiedToken.current = true;
            setSessionStatus('error');
            setErrorMessage(error.message || 'Failed to establish session');
        }
    };

    const validatePassword = (pwd: string): string | null => {
        if (!pwd) {
            return 'Password is required';
        }
        if (pwd.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])/.test(pwd)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*[A-Z])/.test(pwd)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/(?=.*\d)/.test(pwd)) {
            return 'Password must contain at least one number';
        }
        return null;
    };

    const handleRequestNewLink = () => {
        navigation.navigate('ForgotPassword' as never);
    };

    const handleResetPassword = async () => {
        // Check session status first
        if (sessionStatus !== 'ready') {
            Alert.alert('Error', 'Session not ready. Please use a valid reset link from your email.');
            return;
        }

        // Validate passwords
        if (!password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            Alert.alert('Invalid Password', passwordError);
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            console.log('🔑 Starting password reset...');
            
            // Get current session
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
                console.error('🔑 Session error:', sessionError);
                throw new Error('Session expired. Please request a new reset link.');
            }
            
            if (!sessionData?.session) {
                console.error('🔑 No session found');
                throw new Error('Session not found. Please request a new reset link.');
            }

            console.log('🔑 Updating password in Supabase...');
            
            // Update password in Supabase Auth
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                console.error('🔑 Supabase update error:', updateError);
                throw updateError;
            }

            console.log('🔑 Supabase password updated successfully');

            // Also update password in backend database (best effort)
            try {
                const email = sessionData.session.user.email || userEmail;
                if (email) {
                    console.log('🔑 Updating password in backend for:', email);
                    await authApi.resetPassword({
                        email: email,
                        new_password: password,
                    });
                    console.log('🔑 Backend password updated successfully');
                }
            } catch (backendError) {
                // Backend update is secondary - Supabase is the primary auth source
                console.warn('🔑 Backend password update failed (non-critical):', backendError);
            }

            // Success! Sign out and navigate to login
            console.log('🔑 Password reset complete, signing out...');
            await supabase.auth.signOut();
            
            Alert.alert(
                'Password Reset Successful',
                'Your password has been reset successfully. Please login with your new password.',
                [
                    {
                        text: 'Go to Login',
                        onPress: () => {
                            navigation.navigate('Login' as never);
                        }
                    }
                ]
            );
            
        } catch (err: any) {
            console.error('🔑 Password reset error:', err);
            
            let errorMsg = err.message || 'Failed to reset password.';
            
            // Handle specific error cases
            if (errorMsg.includes('expired') || errorMsg.includes('invalid')) {
                errorMsg = 'Your reset link has expired. Please request a new one.';
            }
            
            Alert.alert(
                'Reset Failed',
                errorMsg,
                [
                    {
                        text: 'Request New Link',
                        onPress: handleRequestNewLink
                    },
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Render loading state while verifying token
    const renderLoadingState = () => (
        <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.statusText}>Verifying your reset link...</Text>
            <Text style={styles.statusSubtext}>Please wait a moment</Text>
        </View>
    );

    // Render error state
    const renderErrorState = () => (
        <View style={styles.statusContainer}>
            <View style={styles.errorIconContainer}>
                <Ionicons name="alert-circle" size={60} color="#ef4444" />
            </View>
            <Text style={styles.errorTitle}>
                {sessionStatus === 'expired' ? 'Link Expired' : 'Invalid Link'}
            </Text>
            <Text style={styles.errorText}>
                {errorMessage || 'Unable to verify your reset link. Please request a new one.'}
            </Text>
            <TouchableOpacity
                style={styles.requestNewLinkButton}
                onPress={handleRequestNewLink}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.requestNewLinkGradient}
                >
                    <Text style={styles.requestNewLinkText}>Request New Link</Text>
                    <Ionicons name="mail" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    // Render the password reset form
    const renderResetForm = () => (
        <>
            {/* Logo Section */}
            <View style={styles.logoSection}>
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.logoGradient}
                >
                    <View style={styles.logoInner}>
                        <Ionicons name="lock-closed-outline" size={40} color="#667eea" />
                    </View>
                </LinearGradient>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    {userEmail ? `Enter a new password for ${userEmail}` : 'Enter your new password below'}
                </Text>
            </View>

            {/* Form Card */}
            <View style={styles.glassCard}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                    style={styles.glassGradient}
                >
                    <Text style={styles.formTitle}>New Password</Text>
                    <Text style={styles.formSubtitle}>Create a strong password for your account.</Text>

                    <View style={styles.form}>
                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                style={styles.inputGradient}
                            >
                                <View style={styles.inputIcon}>
                                    <Ionicons name="lock-closed-outline" size={22} color="rgba(255,255,255,0.7)" />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="New Password"
                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    editable={!isLoading}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons 
                                        name={showPassword ? "eye-outline" : "eye-off-outline"} 
                                        size={22} 
                                        color="rgba(255,255,255,0.7)" 
                                    />
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputContainer}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                style={styles.inputGradient}
                            >
                                <View style={styles.inputIcon}>
                                    <Ionicons name="lock-closed-outline" size={22} color="rgba(255,255,255,0.7)" />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    editable={!isLoading}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Ionicons 
                                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                                        size={22} 
                                        color="rgba(255,255,255,0.7)" 
                                    />
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>

                        {/* Password Requirements */}
                        <View style={styles.requirementsContainer}>
                            <Text style={styles.requirementsTitle}>Password must contain:</Text>
                            <Text style={[styles.requirement, password.length >= 8 && styles.requirementMet]}>
                                • At least 8 characters
                            </Text>
                            <Text style={[styles.requirement, /(?=.*[a-z])/.test(password) && styles.requirementMet]}>
                                • One lowercase letter
                            </Text>
                            <Text style={[styles.requirement, /(?=.*[A-Z])/.test(password) && styles.requirementMet]}>
                                • One uppercase letter
                            </Text>
                            <Text style={[styles.requirement, /(?=.*\d)/.test(password) && styles.requirementMet]}>
                                • One number
                            </Text>
                        </View>

                        {/* Reset Button */}
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={handleResetPassword}
                            disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={
                                    (isLoading || !password || !confirmPassword || password !== confirmPassword)
                                        ? ['rgba(102,126,234,0.5)', 'rgba(118,75,162,0.5)']
                                        : ['#667eea', '#764ba2']
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.resetGradient}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <>
                                        <Text style={styles.resetText}>Reset Password</Text>
                                        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.resetIcon} />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </>
    );

    // Determine what content to render based on session status
    const renderContent = () => {
        switch (sessionStatus) {
            case 'loading':
                return renderLoadingState();
            case 'error':
            case 'expired':
                return renderErrorState();
            case 'ready':
            default:
                return renderResetForm();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Animated Background Gradient */}
            <LinearGradient
                colors={['#0F0C29', '#302B63', '#24243E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.backgroundGradient}
            >
                {/* Decorative Circles */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
                <View style={styles.decorativeCircle3} />

                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.content}>
                        {/* Back Button */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {renderContent()}
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundGradient: {
        flex: 1,
    },
    decorativeCircle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(102, 126, 234, 0.15)',
        top: -100,
        right: -100,
    },
    decorativeCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(118, 75, 162, 0.1)',
        bottom: 100,
        left: -50,
    },
    decorativeCircle3: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(102, 126, 234, 0.08)',
        top: height * 0.4,
        right: -30,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 10,
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoGradient: {
        width: 80,
        height: 80,
        borderRadius: 24,
        padding: 2,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 10,
        marginBottom: 16,
    },
    logoInner: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 8,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    glassCard: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
    },
    glassGradient: {
        padding: 28,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 16,
        borderRadius: 14,
        overflow: 'hidden',
    },
    inputGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    inputIcon: {
        paddingLeft: 18,
        paddingRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#FFFFFF',
        paddingRight: 16,
    },
    eyeIcon: {
        paddingRight: 18,
        paddingLeft: 12,
    },
    requirementsContainer: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
    },
    requirementsTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 8,
    },
    requirement: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
    },
    requirementMet: {
        color: '#4ade80',
    },
    resetButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 8,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    resetGradient: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    resetIcon: {
        marginLeft: 8,
    },
    // Status/Loading styles
    statusContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 24,
        textAlign: 'center',
    },
    statusSubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 8,
        textAlign: 'center',
    },
    // Error styles
    errorIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 16,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 12,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 16,
    },
    requestNewLinkButton: {
        marginTop: 32,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    requestNewLinkGradient: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    requestNewLinkText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default ResetPasswordScreen;
