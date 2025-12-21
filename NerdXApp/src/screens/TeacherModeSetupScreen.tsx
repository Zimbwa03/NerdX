// Teacher Mode Setup Screen - Enhanced Professional UI Design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

// O-Level Topics by Subject
const SUBJECT_TOPICS: Record<string, string[]> = {
  Mathematics: [
    'Real Numbers',
    'Fractions, Decimals & Percentages',
    'Ratio and Proportion',
    'Algebraic Expressions',
    'Quadratic Equations',
    'Linear Equations & Inequalities',
    'Indices and Logarithms',
    'Angles and Polygons',
    'Pythagoras Theorem',
    'Trigonometry',
    'Circle Theorems',
    'Statistics',
    'Probability',
    'Mensuration',
    'Sets',
    'Sequences and Series',
    'Matrices',
    'Vectors',
    'Coordinate Geometry',
    'Functions and Graphs',
  ],
  Biology: [
    'Cell Structure and Organisation',
    'Movement of Substances',
    'Enzymes',
    'Nutrition in Plants',
    'Nutrition in Humans',
    'Transport in Plants',
    'Transport in Humans',
    'Respiration',
    'Excretion',
    'Homeostasis',
    'Coordination and Response',
    'Reproduction in Plants',
    'Reproduction in Humans',
    'Inheritance',
  ],
  Chemistry: [
    'Particulate Nature of Matter',
    'Atomic Structure',
    'Chemical Bonding',
    'Stoichiometry',
    'Electricity and Chemistry',
    'Energy Changes',
    'Chemical Reactions',
    'Acids, Bases and Salts',
    'The Periodic Table',
    'Metals',
    'Air and Water',
    'Organic Chemistry',
  ],
  Physics: [
    'Measurements',
    'Kinematics',
    'Forces and Motion',
    'Pressure',
    'Energy, Work and Power',
    'Thermal Physics',
    'Waves',
    'Light',
    'Sound',
    'Electricity',
    'Magnetism and Electromagnetism',
    'Radioactivity',
  ],
};

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#667eea',
  Biology: '#4CAF50',
  Chemistry: '#FF9800',
  Physics: '#2196F3',
};

const SUBJECT_ICONS: Record<string, string> = {
  Mathematics: '📐',
  Biology: '🧬',
  Chemistry: '⚗️',
  Physics: '⚛️',
};

const TeacherModeSetupScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { subject, preselectedSubject, preselectedTopic } = route.params as {
    subject?: any;
    preselectedSubject?: string;
    preselectedTopic?: string;
  };

  const [selectedSubject, setSelectedSubject] = useState<string>(preselectedSubject || '');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>('Form 3-4 (O-Level)');
  const [selectedTopic, setSelectedTopic] = useState<string>(preselectedTopic || '');

  const subjects = ['Mathematics', 'Biology', 'Chemistry', 'Physics'];
  const gradeLevels = ['Form 1-2', 'Form 3-4 (O-Level)', 'A-Level'];

  // Get topics for selected subject
  const availableTopics = selectedSubject ? SUBJECT_TOPICS[selectedSubject] || [] : [];
  const subjectColor = selectedSubject ? SUBJECT_COLORS[selectedSubject] : Colors.secondary.main;

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={selectedSubject ? [subjectColor, subjectColor + '99'] : themedColors.gradients.secondary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarIcon}>
                {selectedSubject ? SUBJECT_ICONS[selectedSubject] : '👨‍🏫'}
              </Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>
                {selectedSubject ? `${selectedSubject} Tutor` : 'AI Teacher Mode'}
              </Text>
              <Text style={styles.subtitle}>
                {selectedSubject
                  ? `Interactive ${selectedSubject} tutoring session`
                  : 'Configure your personalized learning session'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Subject Selection with Horizontal Scroll */}
        <View style={[styles.section, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
            📚 Select Subject
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {subjects.map((subj) => (
              <TouchableOpacity
                key={subj}
                style={[
                  styles.subjectChip,
                  {
                    backgroundColor: selectedSubject === subj
                      ? SUBJECT_COLORS[subj]
                      : isDarkMode ? 'rgba(255,255,255,0.08)' : '#F5F7FA',
                    borderColor: selectedSubject === subj ? SUBJECT_COLORS[subj] : 'transparent',
                  },
                ]}
                onPress={() => {
                  setSelectedSubject(subj);
                  setSelectedTopic(''); // Reset topic when subject changes
                }}
              >
                <Text style={styles.subjectChipIcon}>{SUBJECT_ICONS[subj]}</Text>
                <Text
                  style={[
                    styles.subjectChipText,
                    {
                      color: selectedSubject === subj
                        ? '#FFFFFF'
                        : themedColors.text.secondary
                    },
                  ]}
                >
                  {subj}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Topic Selection - Only shows when subject is selected */}
        {selectedSubject && (
          <View style={[styles.section, { backgroundColor: themedColors.background.paper }]}>
            <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
              📖 Choose Topic
            </Text>
            <Text style={[styles.sectionDescription, { color: themedColors.text.secondary }]}>
              Slide to select a specific topic, or leave empty for general tutoring
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.topicsScroll}
              contentContainerStyle={styles.topicsScrollContent}
            >
              {/* General option */}
              <TouchableOpacity
                style={[
                  styles.topicChip,
                  {
                    backgroundColor: selectedTopic === ''
                      ? subjectColor
                      : isDarkMode ? 'rgba(255,255,255,0.08)' : '#F0F2F5',
                    borderColor: subjectColor,
                  },
                ]}
                onPress={() => setSelectedTopic('')}
              >
                <Text
                  style={[
                    styles.topicChipText,
                    { color: selectedTopic === '' ? '#FFFFFF' : themedColors.text.secondary },
                  ]}
                >
                  🎯 Any Topic
                </Text>
              </TouchableOpacity>

              {availableTopics.map((topic, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.topicChip,
                    {
                      backgroundColor: selectedTopic === topic
                        ? subjectColor
                        : isDarkMode ? 'rgba(255,255,255,0.08)' : '#F0F2F5',
                      borderColor: selectedTopic === topic ? subjectColor : 'rgba(255,255,255,0.1)',
                    },
                  ]}
                  onPress={() => setSelectedTopic(topic)}
                >
                  <Text
                    style={[
                      styles.topicChipText,
                      { color: selectedTopic === topic ? '#FFFFFF' : themedColors.text.primary },
                    ]}
                  >
                    {topic}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Grade Level Selection */}
        <View style={[styles.section, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
            📊 Grade Level
          </Text>
          <View style={styles.gradeLevelContainer}>
            {gradeLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.gradeLevelButton,
                  {
                    backgroundColor: selectedGradeLevel === level
                      ? subjectColor
                      : isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA',
                    borderColor: selectedGradeLevel === level ? subjectColor : themedColors.border.light,
                  },
                ]}
                onPress={() => setSelectedGradeLevel(level)}
              >
                <Text
                  style={[
                    styles.gradeLevelText,
                    {
                      color: selectedGradeLevel === level
                        ? '#FFFFFF'
                        : themedColors.text.secondary
                    },
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, {
          backgroundColor: isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)',
          borderLeftColor: subjectColor,
        }]}>
          <Text style={[styles.infoTitle, { color: subjectColor }]}>
            ✨ What You'll Get
          </Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Ionicons name="chatbubbles-outline" size={18} color={themedColors.text.secondary} />
              <Text style={[styles.infoItemText, { color: themedColors.text.secondary }]}>
                Interactive Socratic tutoring
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="analytics-outline" size={18} color={themedColors.text.secondary} />
              <Text style={[styles.infoItemText, { color: themedColors.text.secondary }]}>
                Step-by-step explanations
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="bar-chart-outline" size={18} color={themedColors.text.secondary} />
              <Text style={[styles.infoItemText, { color: themedColors.text.secondary }]}>
                {selectedSubject === 'Mathematics' ? 'Dynamic graph generation' : 'Visual diagrams'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="document-text-outline" size={18} color={themedColors.text.secondary} />
              <Text style={[styles.infoItemText, { color: themedColors.text.secondary }]}>
                Downloadable PDF notes
              </Text>
            </View>
          </View>
          <View style={styles.creditInfo}>
            <Text style={[styles.creditText, { color: themedColors.text.hint }]}>
              💎 Session: 3 credits • Follow-ups: 1 credit each
            </Text>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[
            styles.startButton,
            { backgroundColor: selectedSubject ? subjectColor : Colors.text.disabled },
            (!selectedSubject || !selectedGradeLevel) && styles.startButtonDisabled,
          ]}
          onPress={handleStart}
          disabled={!selectedSubject || !selectedGradeLevel}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={selectedSubject ? [subjectColor, subjectColor + 'CC'] : ['#999', '#777']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}
          >
            <Ionicons name="school-outline" size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>
              Start {selectedSubject || ''} Tutor
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  section: {
    padding: 20,
    backgroundColor: Colors.background.paper,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  horizontalScroll: {
    marginTop: 12,
  },
  horizontalScrollContent: {
    paddingRight: 8,
    gap: 12,
    flexDirection: 'row',
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    minWidth: 130,
  },
  subjectChipIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  subjectChipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  topicsScroll: {
    marginTop: 8,
  },
  topicsScrollContent: {
    paddingRight: 8,
    gap: 10,
    flexDirection: 'row',
  },
  topicChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  topicChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  gradeLevelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  gradeLevelButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  gradeLevelText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    borderRadius: 20,
    padding: 20,
    margin: 16,
    borderLeftWidth: 4,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  creditInfo: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  creditText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  startButton: {
    margin: 16,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  startButtonDisabled: {
    opacity: 0.5,
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
