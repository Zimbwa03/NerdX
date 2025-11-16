// Teacher Mode Setup Screen - Select subject, grade level, and topic
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const TeacherModeSetupScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { subject } = route.params as { subject: any };

  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const subjects = ['Biology', 'Chemistry', 'Physics'];
  const gradeLevels = ['Form 1-2', 'Form 3-4 (O-Level)', 'A-Level'];

  const handleStart = () => {
    if (!selectedSubject || !selectedGradeLevel) {
      Alert.alert('Error', 'Please select subject and grade level');
      return;
    }

    if ((user?.credits || 0) < 3) {
      Alert.alert(
        'Insufficient Credits',
        'Teacher Mode requires 3 credits to start. Please buy credits first.',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('TeacherMode' as never, {
      subject: selectedSubject,
      gradeLevel: selectedGradeLevel,
      topic: selectedTopic || undefined,
    } as never);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👨‍🏫 Teacher Mode Setup</Text>
        <Text style={styles.subtitle}>Configure your learning session</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Select Subject</Text>
        <View style={styles.optionsContainer}>
          {subjects.map((subj) => (
            <TouchableOpacity
              key={subj}
              style={[
                styles.optionButton,
                selectedSubject === subj && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedSubject(subj)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedSubject === subj && styles.optionTextSelected,
                ]}
              >
                {subj === 'Biology' && '🧬 '}
                {subj === 'Chemistry' && '⚗️ '}
                {subj === 'Physics' && '⚛️ '}
                {subj}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Select Grade Level</Text>
        <View style={styles.optionsContainer}>
          {gradeLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.optionButton,
                selectedGradeLevel === level && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedGradeLevel(level)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedGradeLevel === level && styles.optionTextSelected,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Topic (Optional)</Text>
        <Text style={styles.sectionDescription}>
          Leave empty to let the teacher suggest topics
        </Text>
        <TouchableOpacity
          style={styles.topicButton}
          onPress={() => {
            Alert.prompt(
              'Enter Topic',
              'Type a specific topic you want to learn about:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'OK',
                  onPress: (topic) => setSelectedTopic(topic || ''),
                },
              ],
              'plain-text'
            );
          }}
        >
          <Text style={styles.topicButtonText}>
            {selectedTopic || 'Tap to enter topic (optional)'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Teacher Mode Info</Text>
        <Text style={styles.infoText}>
          • Start session: 3 credits{'\n'}
          • Follow-up questions: 1 credit each{'\n'}
          • Generate notes: 1 credit{'\n'}
          • Interactive AI teaching{'\n'}
          • Personalized PDF notes
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          (!selectedSubject || !selectedGradeLevel) && styles.startButtonDisabled,
        ]}
        onPress={handleStart}
        disabled={!selectedSubject || !selectedGradeLevel}
      >
        <Text style={styles.startButtonText}>Start Teacher Mode</Text>
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
    backgroundColor: '#1976D2',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 15,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  optionButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  optionText: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#1976D2',
    fontWeight: '600',
  },
  topicButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  topicButtonText: {
    fontSize: 16,
    color: '#212121',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 15,
    margin: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#1976D2',
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

export default TeacherModeSetupScreen;
