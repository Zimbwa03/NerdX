// Teacher Mode Setup Screen - Professional UI Design
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
      <LinearGradient
        colors={['#4CAF50', '#388E3C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>👨‍🏫</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Teacher Mode Setup</Text>
            <Text style={styles.subtitle}>Configure your personalized learning session</Text>
          </View>
        </View>
      </LinearGradient>

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
        <Text style={styles.sectionTitle}>3. Specific Topic (Optional)</Text>
        <Text style={styles.sectionDescription}>
          Leave empty to let the AI teacher suggest topics for you
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarIcon: {
    fontSize: 32,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.95,
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionButtonSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 15,
    color: '#424242',
    fontWeight: '500',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  topicButton: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  topicButtonText: {
    fontSize: 15,
    color: '#424242',
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 18,
    margin: 20,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  startButtonDisabled: {
    backgroundColor: '#BDBDBD',
    shadowOpacity: 0,
    elevation: 0,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default TeacherModeSetupScreen;
