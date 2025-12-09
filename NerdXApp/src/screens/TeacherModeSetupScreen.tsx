// Teacher Mode Setup Screen - Professional UI Design
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';

const TeacherModeSetupScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { subject, preselectedSubject } = route.params as { subject?: any; preselectedSubject?: string };

  const [selectedSubject, setSelectedSubject] = useState<string>(preselectedSubject || '');
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

    navigation.navigate('TeacherMode' as any, {
      subject: selectedSubject,
      gradeLevel: selectedGradeLevel,
      topic: selectedTopic || undefined,
    } as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={themedColors.background.default} />
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={themedColors.gradients.secondary}
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

        <View style={[styles.section, { backgroundColor: themedColors.background.paper, borderBottomColor: themedColors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>1. Select Subject</Text>
          <View style={styles.optionsContainer}>
            {subjects.map((subj) => (
              <TouchableOpacity
                key={subj}
                style={[
                  styles.optionButton,
                  { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA', borderColor: themedColors.border.light },
                  selectedSubject === subj && { backgroundColor: isDarkMode ? 'rgba(0, 229, 255, 0.2)' : 'rgba(0, 229, 255, 0.1)', borderColor: themedColors.secondary.main },
                ]}
                onPress={() => setSelectedSubject(subj)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: themedColors.text.secondary },
                    selectedSubject === subj && { color: themedColors.secondary.main, fontWeight: '700' },
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

        <View style={[styles.section, { backgroundColor: themedColors.background.paper, borderBottomColor: themedColors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>2. Select Grade Level</Text>
          <View style={styles.optionsContainer}>
            {gradeLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.optionButton,
                  { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA', borderColor: themedColors.border.light },
                  selectedGradeLevel === level && { backgroundColor: isDarkMode ? 'rgba(0, 229, 255, 0.2)' : 'rgba(0, 229, 255, 0.1)', borderColor: themedColors.secondary.main },
                ]}
                onPress={() => setSelectedGradeLevel(level)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: themedColors.text.secondary },
                    selectedGradeLevel === level && { color: themedColors.secondary.main, fontWeight: '700' },
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: themedColors.background.paper, borderBottomColor: themedColors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>3. Specific Topic (Optional)</Text>
          <Text style={[styles.sectionDescription, { color: themedColors.text.secondary }]}>
            Leave empty to let the AI teacher suggest topics for you
          </Text>
          <TouchableOpacity
            style={[styles.topicButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA', borderColor: themedColors.border.light }]}
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
            <Text style={[styles.topicButtonText, { color: themedColors.text.primary }]}>
              {selectedTopic || 'Tap to enter topic (optional)'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.infoBox, { backgroundColor: isDarkMode ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0, 230, 118, 0.1)' }]}>
          <Text style={[styles.infoTitle, { color: themedColors.success.main }]}>💡 Teacher Mode Info</Text>
          <Text style={[styles.infoText, { color: themedColors.text.secondary }]}>
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
            { backgroundColor: themedColors.success.main }
          ]}
          onPress={handleStart}
          disabled={!selectedSubject || !selectedGradeLevel}
        >
          <Text style={styles.startButtonText}>Start Teacher Mode</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    backgroundColor: Colors.background.paper,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
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
    backgroundColor: Colors.background.subtle,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)', // Cyan tint
    borderColor: Colors.secondary.main,
    shadowColor: Colors.secondary.main,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 15,
    color: Colors.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.secondary.main,
    fontWeight: '700',
  },
  topicButton: {
    backgroundColor: Colors.background.subtle,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  topicButtonText: {
    fontSize: 15,
    color: Colors.text.primary,
  },
  infoBox: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)', // Green tint
    borderRadius: 12,
    padding: 18,
    margin: 20,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success.main,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.success.main,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: Colors.success.main,
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: Colors.success.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  startButtonDisabled: {
    backgroundColor: Colors.text.disabled,
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
