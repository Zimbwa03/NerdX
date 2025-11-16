// Profile Screen Component - Professional UI/UX Design
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { userApi, UserProfile } from '../services/api/userApi';
import { useAuth } from '../context/AuthContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Colors from '../theme/colors';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone_number: '',
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Professional Header */}
      <LinearGradient
        colors={[Colors.secondary.main, Colors.secondary.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {Icons.profile(28, '#FFFFFF')}
            <Text style={styles.title}>Profile</Text>
          </View>
          {!editing && (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={styles.editButtonContainer}
            >
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Profile Content */}
      <View style={styles.profileContainer}>
        {/* Avatar Card */}
        <Card variant="elevated" style={styles.avatarCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[Colors.secondary.main, Colors.secondary.dark]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {profile?.name?.[0]?.toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
            <Text style={styles.nerdxId}>ID: {profile?.nerdx_id || user?.nerdx_id}</Text>
          </View>
        </Card>

        {/* Credits Card */}
        <Card variant="gradient" gradientColors={[Colors.success.main, Colors.success.dark]} style={styles.creditsCard}>
          <View style={styles.creditsContent}>
            <IconCircle
              icon={Icons.credits(28, '#FFFFFF')}
              size={56}
              backgroundColor="rgba(255, 255, 255, 0.2)"
            />
            <View style={styles.creditsInfo}>
              <Text style={styles.creditsLabel}>Available Credits</Text>
              <Text style={styles.creditsAmount}>{profile?.credits || user?.credits || 0}</Text>
            </View>
          </View>
        </Card>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Card variant="elevated" style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                editable={editing}
                placeholder="First Name"
                placeholderTextColor={Colors.text.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Surname</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.surname}
                onChangeText={(text) => setFormData({ ...formData, surname: text })}
                editable={editing}
                placeholder="Surname"
                placeholderTextColor={Colors.text.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                editable={editing}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
                placeholderTextColor={Colors.text.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.phone_number}
                onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                editable={editing}
                keyboardType="phone-pad"
                placeholder="Phone Number"
                placeholderTextColor={Colors.text.disabled}
              />
            </View>
          </Card>

          {/* Action Buttons */}
          {editing && (
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                variant="outline"
                fullWidth
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
                style={styles.cancelButton}
              />
              <Button
                title="Save Changes"
                variant="primary"
                fullWidth
                onPress={handleSave}
                disabled={saving}
                loading={saving}
                icon="checkmark-circle"
                iconPosition="left"
                style={styles.saveButton}
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.paper,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.text.secondary,
    fontSize: 16,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  editButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  editButton: {
    fontSize: 16,
    color: Colors.text.white,
    fontWeight: '600',
  },
  profileContainer: {
    padding: 20,
    paddingTop: 10,
  },
  avatarCard: {
    marginBottom: 20,
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  nerdxId: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontFamily: 'monospace',
  },
  creditsCard: {
    marginBottom: 20,
  },
  creditsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  creditsInfo: {
    marginLeft: 20,
    flex: 1,
  },
  creditsLabel: {
    fontSize: 14,
    color: Colors.text.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  creditsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  formSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
    marginLeft: 4,
  },
  formCard: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.background.default,
    color: Colors.text.primary,
  },
  inputDisabled: {
    backgroundColor: Colors.iconBg.default,
    color: Colors.text.secondary,
  },
  buttonContainer: {
    gap: 12,
  },
  cancelButton: {
    marginBottom: 8,
  },
  saveButton: {
    marginBottom: 8,
  },
});

export default ProfileScreen;
