import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {TextInput, Button, Text, Surface} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../theme/ThemeContext';

const OTPVerificationScreen = ({route, navigation}: any) => {
  const {theme} = useTheme();
  const phone_number = route.params?.phone_number || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // OTP verification logic here
      // await authApi.verifyOTP(phone_number, otp);
      Alert.alert('Success', 'OTP verified successfully');
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={[styles.surface, {backgroundColor: theme.colors.surface}]}>
        <Text variant="headlineSmall" style={styles.title}>
          Verify OTP
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Enter the 6-digit code sent to {phone_number}
        </Text>

        <TextInput
          label="OTP"
          value={otp}
          onChangeText={setOtp}
          mode="outlined"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={6}
        />

        <Button
          mode="contained"
          onPress={handleVerify}
          loading={loading}
          disabled={loading}
          style={styles.button}>
          Verify
        </Button>

        <Button mode="text" onPress={() => {}} style={styles.linkButton}>
          Resend OTP
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  linkButton: {
    marginTop: 16,
  },
});

export default OTPVerificationScreen;

