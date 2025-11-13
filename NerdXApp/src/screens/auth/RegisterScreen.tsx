import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {TextInput, Button, Text, Surface} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../theme/ThemeContext';
import {RegisterData} from '../../types';

const RegisterScreen = ({navigation}: any) => {
  const {register} = useAuth();
  const {theme} = useTheme();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name || !formData.surname || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.email && !formData.phone_number) {
      Alert.alert('Error', 'Please provide either email or phone number');
      return;
    }

    if (formData.password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      // Navigation handled by AppNavigator
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={[styles.surface, {backgroundColor: theme.colors.surface}]}>
          <Text
            variant="displaySmall"
            style={[styles.title, {color: theme.colors.primary}]}>
            Create Account
          </Text>

          <TextInput
            label="First Name *"
            value={formData.name}
            onChangeText={text => setFormData({...formData, name: text})}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Last Name *"
            value={formData.surname}
            onChangeText={text => setFormData({...formData, surname: text})}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={text => setFormData({...formData, email: text})}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Phone Number"
            value={formData.phone_number}
            onChangeText={text => setFormData({...formData, phone_number: text})}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />

          <TextInput
            label="Password *"
            value={formData.password}
            onChangeText={text => setFormData({...formData, password: text})}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />

          <TextInput
            label="Confirm Password *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}>
            Register
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}>
            Already have an account? Login
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 24,
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  linkButton: {
    marginTop: 16,
  },
});

export default RegisterScreen;

