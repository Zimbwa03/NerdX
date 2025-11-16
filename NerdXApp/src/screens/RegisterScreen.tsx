// Register Screen Component - Professional UI/UX Design
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api/authApi';
import { Icons, IconCircle, Icon } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Colors from '../theme/colors';

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleRegister = async () => {
    // Validation
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
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: async () => {
              await login(response.user, response.token);
              // Navigation will be handled by auth state change
            },
          },
        ]);
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[Colors.secondary.main, Colors.secondary.dark]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo/Icon Section */}
          <View style={styles.logoSection}>
            <IconCircle
              icon={Icons.profile(48, '#FFFFFF')}
              size={100}
              backgroundColor="rgba(255, 255, 255, 0.2)"
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join NerdX Learning Platform</Text>
          </View>

          {/* Registration Form Card */}
          <Card variant="elevated" style={styles.formCard}>
            <Text style={styles.formTitle}>Sign Up</Text>
            <Text style={styles.formSubtitle}>Fill in your details to get started</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Icon name="person" size={20} color={Colors.text.secondary} library="ionicons" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor={Colors.text.disabled}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Icon name="person" size={20} color={Colors.text.secondary} library="ionicons" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Surname"
                  placeholderTextColor={Colors.text.disabled}
                  value={surname}
                  onChangeText={setSurname}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Icon name="mail" size={20} color={Colors.text.secondary} library="ionicons" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor={Colors.text.disabled}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Icon name="call" size={20} color={Colors.text.secondary} library="ionicons" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number (optional)"
                  placeholderTextColor={Colors.text.disabled}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Icon name="calendar" size={20} color={Colors.text.secondary} library="ionicons" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Date of Birth (DD/MM/YYYY)"
                  placeholderTextColor={Colors.text.disabled}
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  keyboardType="numeric"
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

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Icon name="lock-closed" size={20} color={Colors.text.secondary} library="ionicons" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={Colors.text.disabled}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <Button
                title="Create Account"
                variant="primary"
                size="large"
                fullWidth
                onPress={handleRegister}
                disabled={isLoading}
                loading={isLoading}
                icon="person-add"
                iconPosition="left"
                style={styles.registerButton}
              />

              <TouchableOpacity onPress={navigateToLogin} style={styles.linkContainer}>
                <Text style={styles.linkText}>Already have an account? </Text>
                <Text style={styles.linkTextBold}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
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
  registerButton: {
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
    color: Colors.secondary.main,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;
