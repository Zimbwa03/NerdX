import React, { useState, useEffect } from 'react';
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

const ResetPasswordScreen: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    
    // Get token/hash from route params (passed via deep link)
    const resetToken = route.params?.token || route.params?.access_token || route.params?.hash;

    useEffect(() => {
        // Check for Supabase session from email link when component mounts
        checkResetSession();
        
        // Handle app state changes (when app comes to foreground from email link)
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                checkResetSession();
            }
        });

        // Check initial URL if app was opened from link
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLinkUrl(url);
            }
        });

        // Listen for URL changes (when link is clicked while app is open)
        const linkingSubscription = Linking.addEventListener('url', (event) => {
            handleDeepLinkUrl(event.url);
        });

        return () => {
            subscription.remove();
            linkingSubscription.remove();
        };
    }, []);

    const handleDeepLinkUrl = (url: string) => {
        try {
            const parsed = Linking.parse(url);
            if (parsed.path === 'reset-password' || parsed.hostname === 'reset-password') {
                // Extract token from URL params
                const params = parsed.queryParams || {};
                const token = params.access_token || params.token;
                if (token) {
                    console.log('Reset password token received from deep link');
                    // Token is available via route params or Supabase session
                }
            }
        } catch (error) {
            console.error('Error parsing deep link:', error);
        }
    };

    const checkResetSession = async () => {
        try {
            // Check if Supabase has a reset session (created when user clicks email link)
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error);
            } else if (session?.user) {
                // User is authenticated via reset link, ready to reset password
                console.log('Reset session found for user:', session.user.email);
                // Supabase session is ready, we can proceed with password reset
            }
        } catch (error) {
            console.error('Error checking reset session:', error);
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

    const handleResetPassword = async () => {
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
            // First, try using Supabase auth to update password
            // If user came from email link, Supabase session should be active
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionData?.session) {
                // User has valid session from reset link
                const { error: updateError } = await supabase.auth.updateUser({
                    password: password
                });

                if (updateError) {
                    throw updateError;
                }

                // Also update password in our backend database
                try {
                    const userEmail = sessionData.session.user.email;
                    if (userEmail) {
                        await authApi.resetPassword({
                            email: userEmail,
                            new_password: password,
                        });
                    }
                } catch (backendError) {
                    console.warn('Backend password update failed, but Supabase update succeeded:', backendError);
                    // Continue anyway - Supabase update is primary
                }

                // Success!
                Alert.alert(
                    'Password Reset Successful',
                    'Your password has been reset. Please login with your new password.',
                    [
                        {
                            text: 'Go to Login',
                            onPress: () => {
                                // Clear Supabase session and navigate to login
                                supabase.auth.signOut();
                                navigation.navigate('Login' as never);
                            }
                        }
                    ]
                );
            } else {
                // No session - try backend API directly (fallback)
                if (!resetToken) {
                    throw new Error('Reset link has expired or is invalid. Please request a new reset link.');
                }

                // Use backend API to reset password
                const response = await authApi.resetPassword({
                    token: resetToken,
                    new_password: password,
                });

                if (response.success) {
                    Alert.alert(
                        'Password Reset Successful',
                        'Your password has been reset. Please login with your new password.',
                        [
                            {
                                text: 'Go to Login',
                                onPress: () => {
                                    navigation.navigate('Login' as never);
                                }
                            }
                        ]
                    );
                } else {
                    throw new Error(response.message || 'Password reset failed');
                }
            }
        } catch (err: any) {
            console.error('Password reset error:', err);
            Alert.alert(
                'Reset Failed',
                err.message || 'Failed to reset password. Please try requesting a new reset link.',
                [
                    {
                        text: 'Request New Link',
                        onPress: () => navigation.navigate('ForgotPassword' as never)
                    },
                    { text: 'Cancel' }
                ]
            );
        } finally {
            setIsLoading(false);
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
                            <Text style={styles.subtitle}>Enter your new password below</Text>
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
});

export default ResetPasswordScreen;
