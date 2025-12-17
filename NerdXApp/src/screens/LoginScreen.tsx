// Login Screen Component - Professional UI/UX Design
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api/authApi';
import { Icons, IconCircle, Icon } from '../components/Icons';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

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
        await login(response.user, response.token);
        // Navigation will be handled by auth state change
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
    setIsLoading(true);
    try {
      // Placeholder for Google Sign-In
      // In a real implementation, you would use expo-auth-session or similar
      Alert.alert(
        'Google Sign-In',
        'This feature will link with your Google account. Proceed?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setIsLoading(false) },
          {
            text: 'Sign In',
            onPress: async () => {
              try {
                // Mock user data that would come from Google/Supabase
                const mockUserInfo = {
                  email: 'google_user@gmail.com',
                  name: 'Google User',
                  given_name: 'Google',
                  family_name: 'User',
                  picture: 'https://via.placeholder.com/150'
                };

                const response = await authApi.socialLogin('google', mockUserInfo);

                if (response.success && response.token && response.user) {
                  await login(response.user, response.token);
                } else {
                  Alert.alert('Sign In Failed', response.message || 'Could not sign in with Google');
                }
              } catch (error) {
                Alert.alert('Error', 'An error occurred during Google Sign-In');
              } finally {
                setIsLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Google Sign-In failed');
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/default_background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.8)']}
        style={styles.gradientOverlay}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            {/* Logo/Icon Section */}
            <View style={styles.logoSection}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>NerdX</Text>
              <Text style={styles.subtitle}>Master Your Future</Text>
            </View>

            {/* Login Form Card */}
            <View style={styles.glassCard}>
              <Text style={styles.formTitle}>Welcome Back</Text>
              <Text style={styles.formSubtitle}>Sign in to continue learning</Text>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    {Icons.profile(20, Colors.text.secondary)}
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email or Phone Number"
                    placeholderTextColor={Colors.text.hint}
                    value={identifier}
                    onChangeText={setIdentifier}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Icon name="lock-closed" size={20} color={Colors.text.secondary} library="ionicons" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.text.hint}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.showHideButton}
                  >
                    <Icon
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color={Colors.text.secondary}
                      library="ionicons"
                    />
                  </TouchableOpacity>
                </View>

                <Button
                  title="Sign In"
                  variant="primary"
                  size="large"
                  fullWidth
                  onPress={handleLogin}
                  disabled={isLoading}
                  loading={isLoading}
                  icon="log-in"
                  iconPosition="left"
                  style={styles.loginButton}
                />

                <View style={styles.separatorContainer}>
                  <View style={styles.separatorLine} />
                  <Text style={styles.separatorText}>OR</Text>
                  <View style={styles.separatorLine} />
                </View>

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <View style={styles.googleIconContainer}>
                    <Icon name="logo-google" size={24} color="#EA4335" library="ionicons" />
                  </View>
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={navigateToRegister} style={styles.linkContainer}>
                  <Text style={styles.linkText}>Don't have an account? </Text>
                  <Text style={styles.linkTextBold}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 20,
    color: Colors.text.white,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 56,
  },
  inputIcon: {
    paddingLeft: 20,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#FFFFFF',
    paddingRight: 20,
  },
  loginButton: {
    marginTop: 12,
    marginBottom: 24,
    borderRadius: 16,
    height: 56,
    shadowColor: Colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  showHideButton: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: Colors.text.secondary,
    fontSize: 15,
  },
  linkTextBold: {
    color: Colors.primary.main,
    fontSize: 15,
    fontWeight: '700',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  separatorText: {
    color: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 56,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  googleIconContainer: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
