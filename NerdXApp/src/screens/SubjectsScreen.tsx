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

type HistoryFormLevel = 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';

const SubjectsScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [mathModalVisible, setMathModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [historyFormModalVisible, setHistoryFormModalVisible] = useState(false);
  const [historyAction, setHistoryAction] = useState<'notes' | 'practice'>('notes');
  const [selectedHistoryForm, setSelectedHistoryForm] = useState<HistoryFormLevel>('Form 1');
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
      // Go directly to practice mode (Teacher Mode is now in the dashboard)
      navigation.navigate('Topics' as never, { subject } as never);
    } else if (subjectId === 'accounting') {
      // Show modal for Principles of Accounting: Notes, Virtual Labs, Teacher Mode, Practice Mode
      setSelectedSubject(subject);
      setMathModalVisible(true);
    } else if (subjectId === 'business_enterprise_skills') {
      // Show modal for Business Enterprise and Skills: Notes, Virtual Labs, Teacher Mode, Practice Mode
      setSelectedSubject(subject);
      setMathModalVisible(true);
    } else if (subjectId === 'history') {
      // Show modal for History: Notes, Virtual Labs, Teacher Mode, Practice Mode (Essays only)
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

  const openHistoryFormSelector = (action: 'notes' | 'practice') => {
    setMathModalVisible(false);
    setHistoryAction(action);
    setSelectedHistoryForm('Form 1');
    setHistoryFormModalVisible(true);
  };

  const handleHistoryFormContinue = () => {
    setHistoryFormModalVisible(false);
    if (!selectedSubject || selectedSubject.id !== 'history') return;
    if (historyAction === 'notes') {
      navigation.navigate('HistoryNotes' as never, { formLevel: selectedHistoryForm } as never);
      return;
    }
    navigation.navigate('Topics' as never, {
      subject: selectedSubject,
      historyForm: selectedHistoryForm,
    } as never);
  };

  // Dynamic styles based on theme
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background.default,
    },
    scrollView: {
      flex: 1,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themedColors.background.default,
    },
    loadingText: {
      marginTop: 10,
      color: themedColors.text.secondary,
      fontSize: 16,
    },
    header: {
      paddingTop: 50,
      paddingBottom: 30,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      shadowColor: themedColors.primary.dark,
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
      backgroundColor: themedColors.background.paper,
      borderColor: themedColors.border.light,
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
      color: themedColors.text.primary,
      marginBottom: 6,
    },
    subjectDescription: {
      fontSize: 14,
      color: themedColors.text.secondary,
      lineHeight: 20,
    },
    modalDescription: {
      fontSize: 15,
      color: themedColors.text.secondary,
      marginBottom: 16,
      lineHeight: 22,
    },
  }), [themedColors]);

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

      {/* Combined Science / Principles of Accounting / Math Modal */}
      <Modal
        visible={mathModalVisible}
        onClose={() => setMathModalVisible(false)}
        title={
          selectedSubject?.id === 'combined_science'
            ? 'Combined Science'
            : selectedSubject?.id === 'accounting'
              ? 'Principles of Accounting'
              : selectedSubject?.id === 'business_enterprise_skills'
                ? 'Business Enterprise and Skills'
                : selectedSubject?.id === 'history'
                  ? 'History'
                  : 'Mathematics Hub'
        }
      >
        <Text style={styles.modalDescription}>
          {selectedSubject?.id === 'combined_science'
            ? 'Choose your learning mode:'
            : selectedSubject?.id === 'accounting'
              ? 'Choose your learning mode:'
              : selectedSubject?.id === 'business_enterprise_skills'
                ? 'Choose your learning mode:'
                : selectedSubject?.id === 'history'
                  ? 'Choose your learning mode:'
                  : 'Select a learning tool:'}
        </Text>

        {selectedSubject?.id === 'history' ? (
          <>
            <ModalOptionCard
              icon="📚"
              title="History Notes"
              description="Comprehensive study notes for ZIMSEC O-Level History"
              onPress={() => openHistoryFormSelector('notes')}
              color="#5D4037"
            />
            <ModalOptionCard
              icon="🔬"
              title="Virtual Labs"
              description="Interactive history simulations"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('VirtualLab' as never);
              }}
              color="#5D4037"
            />
            <ModalOptionCard
              icon="👨‍🏫"
              title="Teacher Mode"
              description="Interactive AI teaching for History"
              onPress={handleTeacherMode}
              color="#5D4037"
            />
            <ModalOptionCard
              icon="📝"
              title="Practice Mode"
              description="Paper 1 Essays (3-part ZIMSEC format) by topic"
              onPress={() => openHistoryFormSelector('practice')}
              color={Colors.primary.main}
            />
          </>
        ) : selectedSubject?.id === 'business_enterprise_skills' ? (
          <>
            <ModalOptionCard
              icon="📚"
              title="Business Enterprise Skills Notes"
              description="Comprehensive study notes for Business Enterprise and Skills (4048)"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('BESNotes' as never);
              }}
              color="#2E7D32"
            />
            <ModalOptionCard
              icon="🔬"
              title="Virtual Labs"
              description="Interactive business enterprise simulations"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('VirtualLab' as never);
              }}
              color="#2E7D32"
            />
            <ModalOptionCard
              icon="👨‍🏫"
              title="Teacher Mode"
              description="Interactive AI teaching for Business Enterprise and Skills"
              onPress={handleTeacherMode}
              color="#2E7D32"
            />
            <ModalOptionCard
              icon="📝"
              title="Practice Mode"
              description="Paper 1 MCQs and Paper 2 Essays by topic"
              onPress={handlePracticeMode}
              color={Colors.primary.main}
            />
          </>
        ) : selectedSubject?.id === 'accounting' ? (
          <>
            <ModalOptionCard
              icon="📚"
              title="Accounting Notes"
              description="Comprehensive study notes for Principles of Accounting (7112)"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('AccountingNotes' as never);
              }}
              color="#B8860B"
            />
            <ModalOptionCard
              icon="🔬"
              title="Virtual Labs"
              description="Interactive accounting simulations"
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('VirtualLab' as never);
              }}
              color="#B8860B"
            />
            <ModalOptionCard
              icon="👨‍🏫"
              title="Teacher Mode"
              description="Interactive AI teaching for Principles of Accounting"
              onPress={handleTeacherMode}
              color="#B8860B"
            />
            <ModalOptionCard
              icon="📝"
              title="Practice Mode"
              description="Paper 1 MCQs and topical questions by topic"
              onPress={handlePracticeMode}
              color={Colors.primary.main}
            />
          </>
        ) : selectedSubject?.id === 'combined_science' ? (
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
              icon="📸"
              title="Scan & Solve ⚡ OFFLINE"
              description="Snap a photo or type any math problem - works completely offline! No internet required."
              onPress={() => {
                setMathModalVisible(false);
                navigation.navigate('MathSolver' as never);
              }}
              color="#4CAF50"
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

      <Modal
        visible={historyFormModalVisible}
        onClose={() => setHistoryFormModalVisible(false)}
        title="Select History Form"
      >
        <Text style={styles.modalDescription}>
          Choose class level before opening History {historyAction === 'notes' ? 'Notes' : 'Practice'}.
        </Text>
        {(['Form 1', 'Form 2', 'Form 3', 'Form 4'] as HistoryFormLevel[]).map((form) => (
          <ModalOptionCard
            key={form}
            icon={selectedHistoryForm === form ? '✅' : '📘'}
            title={form}
            description={
              form === 'Form 1'
                ? 'Active now: syllabus-aligned topics and essay generation'
                : 'Planned next: form-specific topic streams'
            }
            onPress={() => setSelectedHistoryForm(form)}
            color={selectedHistoryForm === form ? '#5D4037' : '#8D6E63'}
          />
        ))}
        <ModalOptionCard
          icon="🚀"
          title={`Continue with ${selectedHistoryForm}`}
          description={`Open History ${historyAction === 'notes' ? 'Notes' : 'Practice'} for ${selectedHistoryForm}`}
          onPress={handleHistoryFormContinue}
          color={Colors.primary.main}
        />
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
    receipt: Icons.quiz(32, '#B8860B'),
    briefcase: Icons.projectAssistant(32, '#2E7D32'),
  };
  return iconMap[icon] || Icons.quiz(32, Colors.primary.main);
};

const getSubjectIconBg = (subjectId: string): string => {
  const bgMap: { [key: string]: string } = {
    mathematics: Colors.iconBg.mathematics,
    combined_science: Colors.iconBg.science,
    english: Colors.iconBg.english,
    accounting: 'rgba(184, 134, 11, 0.2)',
    business_enterprise_skills: 'rgba(46, 125, 50, 0.2)',
  };
  return bgMap[subjectId] || Colors.iconBg.default;
};



export default SubjectsScreen;
