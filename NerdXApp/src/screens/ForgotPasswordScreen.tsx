import React, { useState } from 'react';
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
    Image,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            // Use Supabase to send password reset email
            // The redirect URL should point to your app's deep link
            // For React Native, we use expo-linking format
            // Supabase will append access_token and other params to this URL
            const redirectUrl = Platform.select({
                ios: 'nerdx://reset-password',
                android: 'nerdx://reset-password',
                default: 'https://nerdx.app/reset-password', // Web fallback
            });

            const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
                redirectTo: redirectUrl,
            });

            if (error) {
                Alert.alert('Error', error.message || 'Failed to send reset email. Please try again.');
            } else {
                Alert.alert(
                    'Email Sent! ✅',
                    `We've sent a password reset link to ${email}.\n\nPlease check your email and click the link to reset your password.`,
                    [
                        { 
                            text: 'OK', 
                            onPress: () => navigation.goBack() 
                        }
                    ]
                );
            }
        } catch (err: any) {
            console.error('Reset password error:', err);
            Alert.alert('Error', err.message || 'An unexpected error occurred. Please try again.');
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
                                    <Ionicons name="key-outline" size={40} color="#667eea" />
                                </View>
                            </LinearGradient>
                            <Text style={styles.title}>Forgot Password?</Text>
                            <Text style={styles.subtitle}>Don't worry, it happens to the best of us.</Text>
                        </View>

                        {/* Form Card */}
                        <View style={styles.glassCard}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                                style={styles.glassGradient}
                            >
                                <Text style={styles.formTitle}>Reset Password</Text>
                                <Text style={styles.formSubtitle}>Enter your email address to receive a recovery link.</Text>

                                <View style={styles.form}>
                                    {/* Email Input */}
                                    <View style={styles.inputContainer}>
                                        <LinearGradient
                                            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                            style={styles.inputGradient}
                                        >
                                            <View style={styles.inputIcon}>
                                                <Ionicons name="mail-outline" size={22} color="rgba(255,255,255,0.7)" />
                                            </View>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Email Address"
                                                placeholderTextColor="rgba(255,255,255,0.5)"
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                        </LinearGradient>
                                    </View>

                                    {/* Send Button */}
                                    <TouchableOpacity
                                        style={styles.resetButton}
                                        onPress={handleResetPassword}
                                        disabled={isLoading}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#667eea', '#764ba2']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.resetGradient}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator color="#FFFFFF" size="small" />
                                            ) : (
                                                <>
                                                    <Text style={styles.resetText}>Send Reset Link</Text>
                                                    <Ionicons name="send" size={20} color="#FFFFFF" style={styles.resetIcon} />
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
        marginBottom: 24,
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

export default ForgotPasswordScreen;
