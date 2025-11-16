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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api/authApi';
import { Icons, IconCircle, Icon } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Colors from '../theme/colors';

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[Colors.primary.main, Colors.primary.dark, Colors.primary.darker]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo/Icon Section */}
          <View style={styles.logoSection}>
            <IconCircle
              icon={Icons.quiz(48, '#FFFFFF')}
              size={100}
              backgroundColor="rgba(255, 255, 255, 0.2)"
            />
            <Text style={styles.title}>Welcome to NerdX</Text>
            <Text style={styles.subtitle}>Your learning companion</Text>
          </View>

          {/* Login Form Card */}
          <Card variant="elevated" style={styles.formCard}>
            <Text style={styles.formTitle}>Sign In</Text>
            <Text style={styles.formSubtitle}>Enter your credentials to continue</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  {Icons.profile(20, Colors.text.secondary)}
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email or Phone Number"
                  placeholderTextColor={Colors.text.disabled}
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
                  placeholderTextColor={Colors.text.disabled}
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
          </Card>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
    color: Colors.text.white,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text.white,
    opacity: 0.9,
  },
  formCard: {
    padding: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: Colors.background.default,
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
  linkTextBold: {
    color: Colors.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
