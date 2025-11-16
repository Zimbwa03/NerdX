// Profile Screen Component
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
import { useNavigation } from '@react-navigation/native';
import { userApi, UserProfile } from '../services/api/userApi';
import { useAuth } from '../context/AuthContext';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        {!editing && (
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.nerdxId}>ID: {profile?.nerdx_id || user?.nerdx_id}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              editable={editing}
              placeholder="First Name"
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
            />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile?.credits || user?.credits || 0}</Text>
              <Text style={styles.statLabel}>Credits</Text>
            </View>
          </View>

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
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    color: '#757575',
  },
  header: {
    backgroundColor: '#1976D2',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  profileContainer: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nerdxId: {
    fontSize: 16,
    color: '#757575',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#757575',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    minWidth: 120,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#212121',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1976D2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
