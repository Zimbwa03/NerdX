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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const ProjectAssistantSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [projectTitle, setProjectTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [studentName, setStudentName] = useState('');
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

  const handleStart = () => {
    if (!projectTitle.trim() || !subject || !studentName.trim() || !studentSurname.trim() || !school.trim() || !formLevel) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if ((user?.credits || 0) < 3) {
      Alert.alert(
        'Insufficient Credits',
        'Project Assistant requires 3 credits to start. Please buy credits first.',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('ProjectAssistant' as never, {
      projectTitle: projectTitle.trim(),
      subject,
      studentName: studentName.trim(),
      studentSurname: studentSurname.trim(),
      school: school.trim(),
      form: formLevel,
    } as never);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎓 Project Assistant Setup</Text>
        <Text style={styles.subtitle}>Get help with your ZIMSEC School-Based Project</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Student Name *</Text>
        <TextInput
          style={styles.input}
          value={studentName}
          onChangeText={setStudentName}
          placeholder="First Name"
          maxLength={50}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Student Surname *</Text>
        <TextInput
          style={styles.input}
          value={studentSurname}
          onChangeText={setStudentSurname}
          placeholder="Last Name"
          maxLength={50}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>School *</Text>
        <TextInput
          style={styles.input}
          value={school}
          onChangeText={setSchool}
          placeholder="e.g., Harare High School"
          maxLength={100}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Form Level *</Text>
        <View style={styles.subjectsContainer}>
          {formLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.subjectButton, formLevel === level && styles.subjectButtonSelected]}
              onPress={() => setFormLevel(level)}
            >
              <Text
                style={[
                  styles.subjectText,
                  formLevel === level && styles.subjectTextSelected,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Project Title *</Text>
        <TextInput
          style={styles.input}
          value={projectTitle}
          onChangeText={setProjectTitle}
          placeholder="e.g., Solar Water Heater for Rural Areas"
          multiline
          maxLength={200}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Subject *</Text>
        <View style={styles.subjectsContainer}>
          {subjects.map((subj) => (
            <TouchableOpacity
              key={subj}
              style={[styles.subjectButton, subject === subj && styles.subjectButtonSelected]}
              onPress={() => setSubject(subj)}
            >
              <Text
                style={[
                  styles.subjectText,
                  subject === subj && styles.subjectTextSelected,
                ]}
              >
                {subj}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Project Assistant Info</Text>
        <Text style={styles.infoText}>
          • Start session: 3 credits{'\n'}
          • Follow-up questions: 1 credit each{'\n'}
          • Get research help{'\n'}
          • Write project sections{'\n'}
          • Generate final document{'\n'}
          • Complete ZIMSEC project guidance
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          (!projectTitle.trim() || !subject || !studentName.trim() || !studentSurname.trim() || !school.trim() || !formLevel) && styles.startButtonDisabled,
        ]}
        onPress={handleStart}
        disabled={!projectTitle.trim() || !subject || !studentName.trim() || !studentSurname.trim() || !school.trim() || !formLevel}
      >
        <Text style={styles.startButtonText}>Create Project</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#9C27B0',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subjectButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  subjectButtonSelected: {
    backgroundColor: '#E1BEE7',
    borderColor: '#9C27B0',
  },
  subjectText: {
    fontSize: 14,
    color: '#212121',
  },
  subjectTextSelected: {
    color: '#9C27B0',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    padding: 15,
    margin: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9C27B0',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 8,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProjectAssistantSetupScreen;
