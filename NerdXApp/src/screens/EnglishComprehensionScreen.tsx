// English Comprehension Screen Component
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  ImageBackground,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { englishApi, ComprehensionData } from '../services/api/englishApi';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const EnglishComprehensionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [comprehension, setComprehension] = useState<ComprehensionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleGenerate = async () => {
    if ((user?.credits || 0) < 3) {
      Alert.alert(
        'Insufficient Credits',
        'Comprehension requires 3 credits. Please buy credits first.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      setSubmitted(false);
      setScore(null);
      setAnswers({});
      const data = await englishApi.generateComprehension();
      if (data) {
        setComprehension(data);
        // Update credits
        if (user) {
          const newCredits = (user.credits || 0) - 3;
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to generate comprehension');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!comprehension) return;

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < comprehension.questions.length) {
      Alert.alert(
        'Incomplete',
        `Please answer all ${comprehension.questions.length} questions before submitting.`
      );
      return;
    }

    setSubmitted(true);
    // Calculate score (simplified - in real app, compare with correct answers)
    const calculatedScore = Math.floor((answeredCount / comprehension.questions.length) * 100);
    setScore(calculatedScore);

    Alert.alert(
      'Answers Submitted',
      `You scored ${calculatedScore}%!\n\nReview your answers below.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/english_background.png')}
      style={styles.container}
      resizeMode="cover"
      onError={(error) => {
        console.warn('Failed to load background image:', error.nativeEvent.error);
      }}
    >
      <LinearGradient
        colors={[Colors.gradients.primary[0], 'rgba(255,255,255,0.8)']}
        style={styles.overlay}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comprehension</Text>
          <View style={styles.creditContainer}>
            <Ionicons name="wallet-outline" size={16} color="#FFF" />
            <Text style={styles.creditText}>{user?.credits || 0}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!comprehension && (
            <View style={styles.welcomeCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.glassCard}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="book-outline" size={48} color={Colors.primary} />
                </View>
                <Text style={styles.welcomeTitle}>Master Comprehension</Text>
                <Text style={styles.welcomeText}>
                  Practice with AI-generated passages tailored to the ZIMSEC syllabus.
                  Improve your reading and analytical skills.
                </Text>

                <TouchableOpacity
                  style={[styles.generateButton, loading && styles.generateButtonDisabled]}
                  onPress={handleGenerate}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#BDBDBD', '#9E9E9E'] : Colors.gradients.primary}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.generateButtonText}>Start Practice</Text>
                        <Text style={styles.costText}>(3 Credits)</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {comprehension && (
            <View style={styles.contentContainer}>
              <View style={styles.passageCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                  style={styles.glassCard}
                >
                  <Text style={styles.passageTitle}>Reading Passage</Text>
                  <Text style={styles.passage}>{comprehension.passage}</Text>
                </LinearGradient>
              </View>

              <Text style={styles.sectionTitle}>Questions</Text>
              {comprehension.questions.map((question, index) => (
                <View key={index} style={styles.questionCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                    style={styles.glassCard}
                  >
                    <View style={styles.questionHeader}>
                      <Text style={styles.questionNumber}>Q{index + 1}</Text>
                      <Text style={styles.questionMarks}>{question.marks} marks</Text>
                    </View>
                    <Text style={styles.questionText}>{question.question}</Text>
                    <TextInput
                      style={styles.answerInput}
                      value={answers[index] || ''}
                      onChangeText={(text) => setAnswers({ ...answers, [index]: text })}
                      placeholder="Type your answer here..."
                      placeholderTextColor="#9E9E9E"
                      multiline
                      editable={!submitted}
                    />
                    {submitted && (
                      <View style={styles.feedbackContainer}>
                        <Text style={styles.feedbackLabel}>Expected Answer:</Text>
                        <Text style={styles.feedbackText}>{question.answer}</Text>
                      </View>
                    )}
                  </LinearGradient>
                </View>
              ))}

              {!submitted && (
                <TouchableOpacity style={styles.actionButton} onPress={handleSubmit}>
                  <LinearGradient
                    colors={Colors.gradients.success}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.actionButtonText}>Submit Answers</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {submitted && score !== null && (
                <View style={styles.resultCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                    style={styles.glassCard}
                  >
                    <Text style={styles.resultTitle}>Practice Complete!</Text>
                    <View style={styles.scoreCircle}>
                      <Text style={styles.scoreValue}>{score}%</Text>
                      <Text style={styles.scoreLabel}>Score</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setComprehension(null);
                        setAnswers({});
                        setSubmitted(false);
                        setScore(null);
                      }}
                    >
                      <LinearGradient
                        colors={Colors.gradients.primary}
                        style={styles.gradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.actionButtonText}>New Practice</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  creditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  creditText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  welcomeCard: {
    margin: 20,
    marginTop: 40,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  glassCard: {
    padding: 20,
    borderRadius: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(98, 0, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  generateButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  costText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  contentContainer: {
    padding: 20,
  },
  passageCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  passageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 10,
  },
  passage: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 26,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 15,
    marginLeft: 5,
  },
  questionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  questionMarks: {
    fontSize: 12,
    color: Colors.text.secondary,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  questionText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 15,
    lineHeight: 22,
  },
  answerInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  feedbackContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.success,
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
    borderWidth: 4,
    borderColor: Colors.success,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.success,
  },
  scoreLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});

export default EnglishComprehensionScreen;
