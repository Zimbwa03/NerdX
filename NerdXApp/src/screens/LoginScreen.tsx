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

  return (
    <ImageBackground
      source={require('../../assets/images/login_background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
      onError={(error) => {
        console.warn('Failed to load background image:', error.nativeEvent.error);
      }}
    >
      <LinearGradient
        colors={['rgba(98, 0, 234, 0.4)', 'rgba(0, 0, 0, 0.8)']}
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
                <IconCircle
                  icon={Icons.quiz(48, Colors.primary.main)}
                  size={100}
                  backgroundColor="rgba(255, 255, 255, 0.9)"
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
                    secureTextEntry
                  />
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
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
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
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
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
    borderColor: Colors.border.light,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: Colors.background.paper,
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
    color: Colors.text.primary,
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
});

export default LoginScreen;
