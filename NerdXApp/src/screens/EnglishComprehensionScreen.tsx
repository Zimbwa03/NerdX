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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { englishApi, ComprehensionData } from '../services/api/englishApi';
import { useAuth } from '../context/AuthContext';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📖 Comprehension Practice</Text>
        <Text style={styles.subtitle}>Read and answer comprehension questions</Text>
        <Text style={styles.credits}>Credits: {user?.credits || 0}</Text>
      </View>

      {!comprehension && (
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Comprehension (3 credits)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {comprehension && (
        <View style={styles.comprehensionContainer}>
          <View style={styles.passageContainer}>
            <Text style={styles.passageTitle}>Reading Passage</Text>
            <Text style={styles.passage}>{comprehension.passage}</Text>
          </View>

          <View style={styles.questionsContainer}>
            <Text style={styles.questionsTitle}>Questions</Text>
            {comprehension.questions.map((question, index) => (
              <View key={index} style={styles.questionCard}>
                <Text style={styles.questionNumber}>Question {index + 1}</Text>
                <Text style={styles.questionText}>{question.question}</Text>
                <Text style={styles.questionMarks}>({question.marks} marks)</Text>
                <TextInput
                  style={styles.answerInput}
                  value={answers[index] || ''}
                  onChangeText={(text) => setAnswers({ ...answers, [index]: text })}
                  placeholder="Type your answer here..."
                  multiline
                  editable={!submitted}
                />
                {submitted && (
                  <View style={styles.answerDisplay}>
                    <Text style={styles.answerLabel}>Expected Answer:</Text>
                    <Text style={styles.expectedAnswer}>{question.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {!submitted && (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Answers</Text>
            </TouchableOpacity>
          )}

          {submitted && score !== null && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreTitle}>Your Score</Text>
              <Text style={styles.scoreValue}>{score}%</Text>
              <TouchableOpacity
                style={styles.newComprehensionButton}
                onPress={() => {
                  setComprehension(null);
                  setAnswers({});
                  setSubmitted(false);
                  setScore(null);
                }}
              >
                <Text style={styles.newComprehensionButtonText}>Generate New Comprehension</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FF9800',
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
    marginBottom: 5,
  },
  credits: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  section: {
    padding: 20,
  },
  generateButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  comprehensionContainer: {
    padding: 20,
  },
  passageContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  passageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 10,
  },
  passage: {
    fontSize: 16,
    color: '#212121',
    lineHeight: 24,
  },
  questionsContainer: {
    marginBottom: 20,
  },
  questionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 15,
    marginBottom: 15,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 16,
    color: '#212121',
    lineHeight: 22,
    marginBottom: 5,
  },
  questionMarks: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 10,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#FAFAFA',
  },
  answerDisplay: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 5,
  },
  expectedAnswer: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  newComprehensionButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  newComprehensionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnglishComprehensionScreen;
