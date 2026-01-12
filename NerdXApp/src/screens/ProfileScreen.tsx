// Profile Screen Component - Modern UI ✨
// Matching Dashboard design with background, glassmorphism, and animations

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  ImageBackground,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { userApi, UserProfile } from '../services/api/userApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Colors from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import FloatingParticles from '../components/FloatingParticles';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const themedColors = useThemedColors();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        surname: profile.surname || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userApi.getProfile();
      setProfile(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await userApi.updateProfile(formData);
      if (updated) {
        setProfile(updated);
        updateUser({
          name: updated.name,
          surname: updated.surname,
          email: updated.email,
          phone_number: updated.phone_number,
        });
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
        <ActivityIndicator size="large" color={themedColors.primary.main} />
        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      {/* 🎨 Professional Background Image */}
      <ImageBackground
        source={require('../../assets/images/default_background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* ✨ Floating Particles Background */}
        <FloatingParticles count={15} />

        <StatusBar barStyle="light-content" backgroundColor="transparent" />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* ✨ Modern Transparent Header */}
          <View style={styles.modernHeader}>
            <View style={styles.topRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>

              <Text style={styles.headerTitle}>My Profile</Text>

              <View style={styles.rightSection}>
                {/* Theme Toggle */}
                <TouchableOpacity
                  onPress={toggleTheme}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.iconEmoji}>
                    {isDarkMode ? '☀️' : '🌙'}
                  </Text>
                </TouchableOpacity>

                {/* Edit Button */}
                {!editing && (
                  <TouchableOpacity
                    onPress={() => setEditing(true)}
                    style={styles.editButtonGlass}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.editText}>✏️ Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={styles.content}>
            {/* 🎨 Profile Card with Glassmorphism */}
            <View style={styles.profileCard}>
              <LinearGradient
                colors={['rgba(124, 77, 255, 0.15)', 'rgba(63, 29, 203, 0.15)']}
                style={styles.profileCardGradient}
              >
                <View style={styles.profileInfo}>
                  {/* Gradient Avatar */}
                  <LinearGradient
                    colors={[Colors.primary.main, Colors.primary.dark]}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.avatarInitial}>
                      {(formData.name || 'U')[0].toUpperCase()}
                    </Text>
                  </LinearGradient>

                  <View style={styles.nameSection}>
                    <Text style={styles.userName}>
                      {formData.name} {formData.surname}
                    </Text>
                    <View style={styles.idBadge}>
                      <Text style={styles.idText}>ID: {profile?.nerdx_id || user?.nerdx_id}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* 💎 Credits Card */}
            <TouchableOpacity
              style={styles.creditsCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Credits' as never)}
            >
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.2)']}
                style={styles.creditsGradient}
              >
                <View style={styles.creditsLeft}>
                  <Text style={styles.creditsLabel}>💎 Available Credits</Text>
                  <Text style={styles.creditsValue}>{profile?.credits || user?.credits || 0}</Text>
                </View>
                <View style={styles.topUpButton}>
                  <Text style={styles.topUpText}>+ Top Up</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* 📋 Form Section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>📋 Personal Information</Text>

              <View style={styles.formCard}>
                {/* First Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <View style={[styles.inputContainer, !editing && styles.inputDisabledContainer]}>
                    <TextInput
                      style={styles.input}
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      editable={editing}
                      placeholder="First Name"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    />
                  </View>
                </View>

                {/* Surname */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Surname</Text>
                  <View style={[styles.inputContainer, !editing && styles.inputDisabledContainer]}>
                    <TextInput
                      style={styles.input}
                      value={formData.surname}
                      onChangeText={(text) => setFormData({ ...formData, surname: text })}
                      editable={editing}
                      placeholder="Surname"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={[styles.inputContainer, !editing && styles.inputDisabledContainer]}>
                    <TextInput
                      style={styles.input}
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      editable={editing}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="Email"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    />
                  </View>
                </View>

                {/* Phone */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={[styles.inputContainer, !editing && styles.inputDisabledContainer]}>
                    <TextInput
                      style={styles.input}
                      value={formData.phone_number}
                      onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                      editable={editing}
                      keyboardType="phone-pad"
                      placeholder="Phone Number"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              {editing && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setEditing(false);
                      if (profile) {
                        setFormData({
                          name: profile.name || '',
                          surname: profile.surname || '',
                          email: profile.email || '',
                          phone_number: profile.phone_number || '',
                        });
                      }
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={saving}
                  >
                    <LinearGradient
                      colors={[Colors.primary.main, Colors.primary.dark]}
                      style={styles.saveButtonGradient}
                    >
                      {saving ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.saveButtonText}>✓ Save Changes</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  modernHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: Colors.primary.main,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconEmoji: {
    fontSize: 18,
  },
  editButtonGlass: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  profileCard: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileCardGradient: {
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nameSection: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  idText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  creditsCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  creditsGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  creditsLeft: {
    flex: 1,
  },
  creditsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  creditsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topUpButton: {
    backgroundColor: Colors.success.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  topUpText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  formSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  inputDisabledContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
