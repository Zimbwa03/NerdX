// Login Screen Component - Premium UI/UX Design
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
  ImageBackground,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api/authApi';
import { Icons, IconCircle, Icon } from '../components/Icons';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();
  const { isReady: isGoogleReady, signIn: signInWithGoogle } = useGoogleAuth();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login({
        identifier,
        password,
      });

      if (response.success && response.token && response.user) {
        await login(response.user, response.token, response.notifications);
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register' as never);
  };

  const handleGoogleSignIn = async () => {
    if (!isGoogleReady) {
      Alert.alert(
        'Google Sign-In unavailable',
        'Google client IDs are missing. Please set EXPO_PUBLIC_GOOGLE_* env vars.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      
      if (!googleUser || !googleUser.email) {
        throw new Error('Failed to get user information from Google');
      }

      console.log('🔑 Google user data:', googleUser);
      
      const response = await authApi.socialLogin('google', googleUser);

      if (response.success && response.token && response.user) {
        console.log('✅ Social login successful, logging in user...');
        await login(response.user, response.token, response.notifications);
        // Navigation will happen automatically via AppNavigator when isAuthenticated becomes true
      } else {
        Alert.alert('Sign In Failed', response.message || 'Could not sign in with Google');
      }
    } catch (error: any) {
      console.error('❌ Google Sign-In error:', error);
      Alert.alert('Error', error?.message || 'Google Sign-In failed');
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
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.logoGradient}
              >
                <View style={styles.logoInner}>
                  <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </LinearGradient>
              <Text style={styles.title}>NerdX</Text>
              <Text style={styles.subtitle}>Master Your Future</Text>
            </View>

            {/* Login Form Card */}
            <View style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.glassGradient}
              >
                <Text style={styles.formTitle}>Welcome Back</Text>
                <Text style={styles.formSubtitle}>Sign in to continue learning</Text>

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
                        placeholder="Email or Phone Number"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={identifier}
                        onChangeText={setIdentifier}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </LinearGradient>
                  </View>

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
                        placeholder="Password"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.showHideButton}
                      >
                        <Ionicons
                          name={showPassword ? "eye-outline" : "eye-off-outline"}
                          size={22}
                          color="rgba(255,255,255,0.7)"
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>

                  {/* Forgot Password */}
                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => navigation.navigate('ForgotPassword' as never)}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  {/* Sign In Button */}
                  <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.signInGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <>
                          <Text style={styles.signInText}>Sign In</Text>
                          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.signInIcon} />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Separator */}
                  <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                    <Text style={styles.separatorText}>OR</Text>
                    <View style={styles.separatorLine} />
                  </View>

                  {/* Google Sign In */}
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: 'https://www.google.com/favicon.ico' }}
                      style={styles.googleIcon}
                    />
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
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
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    padding: 2,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  logoInner: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontWeight: '500',
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
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 28,
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
  showHideButton: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  signInButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  signInGradient: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signInIcon: {
    marginLeft: 8,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  separatorText: {
    color: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 20,
  },
  signUpText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
  },
  signUpLink: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default LoginScreen;
