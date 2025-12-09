// Subjects Screen Component - Professional UI/UX Design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { quizApi, Subject } from '../services/api/quizApi';
import { useTheme } from '../context/ThemeContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Modal, ModalOptionCard } from '../components/Modal';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

const SubjectsScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [mathModalVisible, setMathModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await quizApi.getSubjects();
      setSubjects(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectPress = (subject: Subject) => {
    const subjectId = subject.id.toLowerCase();
    if (subjectId === 'combined_science') {
      // Show modal for Combined Science
      setSelectedSubject(subject);
      setMathModalVisible(true);
    } else if (subjectId === 'mathematics' || subject.name.toLowerCase() === 'mathematics') {
      // Show modal for Mathematics
      setSelectedSubject(subject);
      setMathModalVisible(true);
    } else {
      navigation.navigate('Topics' as never, { subject } as never);
    }
  };

  const handleTeacherMode = () => {
    setMathModalVisible(false);
    if (selectedSubject) {
      navigation.navigate('TeacherModeSetup' as never, { subject: selectedSubject } as never);
    }
  };

  const handlePracticeMode = () => {
    setMathModalVisible(false);
    if (selectedSubject) {
      navigation.navigate('Topics' as never, { subject: selectedSubject } as never);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
        <ActivityIndicator size="large" color={themedColors.primary.main} />
        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Loading subjects...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={themedColors.background.default} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Professional Header */}
        <LinearGradient
          colors={themedColors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Choose a Subject</Text>
              <Text style={styles.subtitle}>Select a subject to start practicing</Text>
            </View>
            {Icons.quiz(32, '#FFFFFF')}
          </View>
        </LinearGradient>

        {/* Professional Subject Cards */}
        <View style={styles.subjectsContainer}>
          {subjects.map((subject) => {
            const subjectIcon = getSubjectIcon(subject.icon);
            const subjectColor = Colors.subjects[subject.id as keyof typeof Colors.subjects] || subject.color;

            return (
              <Card
                key={subject.id}
                variant="elevated"
                onPress={() => handleSubjectPress(subject)}
                style={[styles.subjectCard, { borderLeftColor: subjectColor }]}
              >
                <View style={styles.subjectContent}>
                  <IconCircle
                    icon={subjectIcon}
                    size={64}
                    backgroundColor={getSubjectIconBg(subject.id)}
                  />
                  <View style={styles.subjectInfo}>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    <Text style={styles.subjectDescription}>
                      Practice questions and improve your skills
                    </Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* Combined Science / Math Modal */}
      <Modal
        visible={mathModalVisible}
        onClose={() => setMathModalVisible(false)}
        title={selectedSubject?.id === 'combined_science' ? 'Combined Science' : 'Mathematics Hub'}
      >
        <Text style={styles.modalDescription}>
          {selectedSubject?.id === 'combined_science' ? 'Choose your learning mode:' : 'Select a learning tool:'}
        </Text>

        {selectedSubject?.id === 'combined_science' ? (
          <>
            <ModalOptionCard
              icon="👨‍🏫"
              title="Teacher Mode"
              description="Interactive AI teaching with personalized explanations"
              onPress={handleTeacherMode}
              color={Colors.subjects.science}
            />
            <ModalOptionCard
              icon="📝"
              title="Practice Mode"
              description="Practice questions by topic and test your knowledge"
              onPress={handlePracticeMode}
              color={Colors.primary.main}
            />
            <ModalOptionCard
              icon="📚"
              title="Notes"
              description="Comprehensive study notes for Biology, Chemistry, and Physics"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('ScienceNotes' as never);
              }}
              color={Colors.success.main}
            />
          </>
        ) : (
          <>
            <ModalOptionCard
              icon="📝"
              title="Topic Practice"
              description="Master specific topics with targeted questions"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('Topics' as never, { subject: selectedSubject } as never);
              }}
              color={Colors.subjects.mathematics}
            />
            <ModalOptionCard
              icon="📸"
              title="Scan & Solve"
              description="Snap a photo of any math problem to solve it instantly"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('MathSolver' as never);
              }}
              color={Colors.error.main}
            />
            <ModalOptionCard
              icon="👨‍🏫"
              title="AI Math Tutor"
              description="Get step-by-step help and explanations"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('TeacherModeSetup' as never, { subject: selectedSubject } as never);
              }}
              color={Colors.secondary.main}
            />
            <ModalOptionCard
              icon="📈"
              title="Graphing Tools"
              description="Visualize equations and solve graph problems"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('GraphPractice' as never);
              }}
              color={Colors.primary.main}
            />
            <ModalOptionCard
              icon="📐"
              title="Formula Sheet"
              description="Access essential formulas for quick reference"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('FormulaSheet' as never);
              }}
              color={Colors.info.main}
            />
            <ModalOptionCard
              icon="🎓"
              title="Past Papers"
              description="Practice with real exam papers under timed conditions"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('PastPaper' as never);
              }}
              color={Colors.warning.main}
            />
          </>
        )}
      </Modal>
    </View>
  );
};

const getSubjectIcon = (icon: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    calculate: Icons.mathematics(32, Colors.subjects.mathematics),
    science: Icons.science(32, Colors.subjects.science),
    'menu-book': Icons.english(32, Colors.subjects.english),
    healing: Icons.science(32, '#E91E63'),
  };
  return iconMap[icon] || Icons.quiz(32, Colors.primary.main);
};

const getSubjectIconBg = (subjectId: string): string => {
  const bgMap: { [key: string]: string } = {
    mathematics: Colors.iconBg.mathematics,
    combined_science: Colors.iconBg.science,
    english: Colors.iconBg.english,
  };
  return bgMap[subjectId] || Colors.iconBg.default;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.default,
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
    shadowColor: Colors.primary.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  subjectsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  subjectCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    backgroundColor: Colors.background.paper,
    borderColor: Colors.border.light,
    borderWidth: 1,
  },
  subjectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  subjectInfo: {
    flex: 1,
    marginLeft: 16,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  subjectDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  modalDescription: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 22,
  },
});

export default SubjectsScreen;
