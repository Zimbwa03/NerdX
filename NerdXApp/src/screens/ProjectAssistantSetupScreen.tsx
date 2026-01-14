// Project Assistant Setup Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../services/api/projectApi';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';

const ProjectAssistantSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [loading, setLoading] = useState(false);

  const [projectTitle, setProjectTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [studentName, setStudentName] = useState(user?.name || '');
  const [studentSurname, setStudentSurname] = useState('');
  const [school, setSchool] = useState('');
  const [formLevel, setFormLevel] = useState('');

  const subjects = [
    'Computer Science',
    'Agriculture',
    'Mathematics',
    'Combined Science',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Geography',
    'History',
    'Other',
  ];

  const formLevels = ['Form 3', 'Form 4', 'Form 5', 'Form 6 Lower', 'Form 6 Upper'];

  const handleStart = async () => {
    if (!projectTitle.trim() || !subject || !studentName.trim() || !studentSurname.trim() || !school.trim() || !formLevel) {
      Alert.alert('Missing Information', 'Please fill in all required fields to start your project.');
      return;
    }



    try {
      setLoading(true);

      const newProject = await projectApi.createProject({
        title: projectTitle.trim(),
        subject,
        student_name: studentName.trim(),
        student_surname: studentSurname.trim(),
        school: school.trim(),
        form: formLevel,
      });

      if (newProject) {
        // No initial credit deduction
        // updateUser({ credits: (user?.credits || 0) - 5 });

        navigation.replace('ProjectAssistant' as never, {
          projectId: newProject.id,
          projectTitle: newProject.title,
          subject: newProject.subject,
        } as never);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4A148C', '#7B1FA2']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Project</Text>
        <Text style={styles.headerSubtitle}>Setup your AI Research Assistant</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Student Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={studentName}
              onChangeText={setStudentName}
              placeholder="Enter your first name"
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Surname *</Text>
            <TextInput
              style={styles.input}
              value={studentSurname}
              onChangeText={setStudentSurname}
              placeholder="Enter your surname"
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>School *</Text>
            <TextInput
              style={styles.input}
              value={school}
              onChangeText={setSchool}
              placeholder="e.g., Harare High School"
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Form Level *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {formLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[styles.chip, formLevel === level && styles.chipSelected]}
                  onPress={() => setFormLevel(level)}
                >
                  <Text style={[styles.chipText, formLevel === level && styles.chipTextSelected]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Project Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject *</Text>
            <View style={styles.subjectsContainer}>
              {subjects.map((subj) => (
                <TouchableOpacity
                  key={subj}
                  style={[styles.chip, subject === subj && styles.chipSelected]}
                  onPress={() => setSubject(subj)}
                >
                  <Text style={[styles.chipText, subject === subj && styles.chipTextSelected]}>
                    {subj}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Project Title *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={projectTitle}
              onChangeText={setProjectTitle}
              placeholder="e.g., Solar Water Heater for Rural Areas"
              placeholderTextColor="#9E9E9E"
              multiline
              maxLength={200}
            />
            <Text style={styles.helperText}>
              Give your project a descriptive title. You can change this later.
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color="#7B1FA2" />
            <Text style={styles.infoTitle}>About Project Assistant</Text>
          </View>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>1 Credit</Text> per 10 AI responses{'\n'}
            • Get comprehensive research, writing help, and guidance for all project stages.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.startButton,
            (!projectTitle.trim() || !subject || !studentName.trim() || !studentSurname.trim() || !school.trim() || !formLevel) && styles.startButtonDisabled,
          ]}
          onPress={handleStart}
          disabled={loading || !projectTitle.trim() || !subject || !studentName.trim() || !studentSurname.trim() || !school.trim() || !formLevel}
        >
          <LinearGradient
            colors={(!projectTitle.trim() || !subject) ? ['#BDBDBD', '#9E9E9E'] : ['#6A1B9A', '#8E24AA']}
            style={styles.startButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.startButtonText}>Create Project</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 6,
    marginLeft: 4,
  },
  chipsScroll: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#F3E5F5',
    borderColor: '#9C27B0',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextSelected: {
    color: '#7B1FA2',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F3E5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.1)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4A148C',
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
  startButton: {
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProjectAssistantSetupScreen;
