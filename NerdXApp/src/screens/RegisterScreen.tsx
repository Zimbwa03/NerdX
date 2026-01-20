// Register Screen Component - Premium UI/UX Design (Matching Login Screen)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api/authApi';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const { width, height } = Dimensions.get('window');

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();
  const { isReady: isGoogleReady, signIn: signInWithGoogle } = useGoogleAuth();

  // Auto-format date of birth as DD/MM/YYYY
  const formatDateOfBirth = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');

    // Format with slashes
    let formatted = '';
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += '/' + cleaned.substring(2, 4);
    }
    if (cleaned.length > 4) {
      formatted += '/' + cleaned.substring(4, 8);
    }

    setDateOfBirth(formatted);
  };

  const handleRegister = async () => {
    if (!name || !surname || !password) {
      Alert.alert('Error', 'Name, surname, and password are required');
      return;
    }

    if (!email && !phoneNumber) {
      Alert.alert('Error', 'Email or phone number is required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const registerData = {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim().toLowerCase() || undefined,
        phone_number: phoneNumber.trim() || undefined,
        password,
        date_of_birth: dateOfBirth || undefined,
      };

      const response = await authApi.register(registerData);

      if (response.success && response.token && response.user) {
        // If there's an immediate message (unlikely for verified email flow, but possible if auto-confirm is on)
        if (!response.message) {
          // Pass credentials for Supabase Auth (dual-auth for notifications)
          const supabaseCredentials = email.trim() 
            ? { email: email.trim().toLowerCase(), password }
            : undefined;
          await login(response.user, response.token, undefined, supabaseCredentials);
        } else {
          // Navigate to new Verification Screen if verification is needed
          navigation.navigate('EmailVerification' as never);
        }
      } else if (response.success && response.message) {
        // Specifically for cases where user is created but no token (needs email verification)
        navigation.navigate('EmailVerification' as never);
      } else {
        Alert.alert('Registration Failed', response.message || 'Failed to create account');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.goBack();
  };

  const handleGoogleSignIn = async () => {
    if (!isGoogleReady) {
      Alert.alert(
        'Google Sign-Up unavailable',
        'Google client IDs are missing. Please set EXPO_PUBLIC_GOOGLE_* env vars.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      const response = await authApi.socialLogin('google', googleUser);

      if (response.success && response.token && response.user) {
        await login(response.user, response.token);
      } else {
        Alert.alert('Sign Up Failed', response.message || 'Could not sign up with Google');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Google Sign-Up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Gradient - Matching Login */}
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join NerdX Learning Platform</Text>
            </View>

            {/* Registration Form Card */}
            <View style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.glassGradient}
              >
                <Text style={styles.formTitle}>Sign Up</Text>
                <Text style={styles.formSubtitle}>Fill in your details to get started</Text>

                <View style={styles.form}>
                  {/* Name Row */}
                  <View style={styles.inputRow}>
                    <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                        style={styles.inputGradient}
                      >
                        <View style={styles.inputIcon}>
                          <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.7)" />
                        </View>
                        <TextInput
                          style={styles.input}
                          placeholder="First Name"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          value={name}
                          onChangeText={setName}
                          autoCapitalize="words"
                        />
                      </LinearGradient>
                    </View>
                    <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                        style={styles.inputGradient}
                      >
                        <View style={styles.inputIcon}>
                          <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.7)" />
                        </View>
                        <TextInput
                          style={styles.input}
                          placeholder="Surname"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          value={surname}
                          onChangeText={setSurname}
                          autoCapitalize="words"
                        />
                      </LinearGradient>
                    </View>
                  </View>

                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.inputGradient}
                    >
                      <View style={styles.inputIcon}>
                        <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.7)" />
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

                  {/* Phone Input */}
                  <View style={styles.inputContainer}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.inputGradient}
                    >
                      <View style={styles.inputIcon}>
                        <Ionicons name="call-outline" size={20} color="rgba(255,255,255,0.7)" />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Phone Number (optional)"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                      />
                    </LinearGradient>
                  </View>

                  {/* Date of Birth Input */}
                  <View style={styles.inputContainer}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.inputGradient}
                    >
                      <View style={styles.inputIcon}>
                        <Ionicons name="calendar-outline" size={20} color="rgba(255,255,255,0.7)" />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Date of Birth (DD/MM/YYYY)"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={dateOfBirth}
                        onChangeText={formatDateOfBirth}
                        keyboardType="number-pad"
                        maxLength={10}
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
                        <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.7)" />
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
                          size={20}
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
                        <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.7)" />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.showHideButton}
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                          size={20}
                          color="rgba(255,255,255,0.7)"
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>

                  {/* Create Account Button */}
                  <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={handleRegister}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.signUpGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <>
                          <Text style={styles.signUpText}>Create Account</Text>
                          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.signUpIcon} />
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

                  {/* Google Sign Up */}
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

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    top: height * 0.5,
    right: -30,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 18,
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
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
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
    padding: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  inputContainer: {
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#FFFFFF',
    paddingRight: 14,
  },
  showHideButton: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
  },
  signUpButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 6,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  signUpGradient: {
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signUpIcon: {
    marginLeft: 8,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    height: 54,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  signInText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
  },
  signInLink: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default RegisterScreen;
