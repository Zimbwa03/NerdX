import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Card, Button, TextInput, ActivityIndicator, RadioButton} from 'react-native-paper';
import {useTheme} from '../../theme/ThemeContext';
import {quizApi} from '../../services/api';
import {Question} from '../../types';

const QuizScreen = ({route, navigation}: any) => {
  const {theme} = useTheme();
  const {subject, topic, type} = route.params;
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    setLoading(true);
    try {
      const data = await quizApi.generateQuestion({
        subject,
        topic,
        type,
      });
      setQuestion(data);
      setAnswer('');
      setSelectedOption('');
      setFeedback(null);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load question');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!question) return;

    const finalAnswer = question.question_type === 'multiple_choice' 
      ? selectedOption 
      : answer;

    if (!finalAnswer) {
      Alert.alert('Error', 'Please provide an answer');
      return;
    }

    setSubmitting(true);
    try {
      const result = await quizApi.submitAnswer({
        question_id: question.id,
        answer: finalAnswer,
      });

      setFeedback(result);
      
      if (result.correct) {
        Alert.alert('Correct!', `You earned ${result.points_earned} points!`);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.questionCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.questionText}>
            {question.question_text}
          </Text>

          {question.question_type === 'multiple_choice' && question.options && (
            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <View key={index} style={styles.option}>
                  <RadioButton
                    value={option}
                    status={selectedOption === option ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedOption(option)}
                  />
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              ))}
            </View>
          )}

          {question.question_type === 'short_answer' && (
            <TextInput
              label="Your Answer"
              value={answer}
              onChangeText={setAnswer}
              mode="outlined"
              style={styles.input}
              multiline
            />
          )}

          {feedback && (
            <View style={styles.feedback}>
              <Text
                variant="titleMedium"
                style={[
                  styles.feedbackText,
                  {color: feedback.correct ? theme.colors.success : theme.colors.error},
                ]}>
                {feedback.correct ? '✓ Correct!' : '✗ Incorrect'}
              </Text>
              {feedback.solution && (
                <Text style={styles.solution}>{feedback.solution}</Text>
              )}
            </View>
          )}

          <View style={styles.actions}>
            {!feedback && (
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting}
                style={styles.submitButton}>
                Submit Answer
              </Button>
            )}
            {feedback && (
              <Button
                mode="contained"
                onPress={loadQuestion}
                style={styles.nextButton}>
                Next Question
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionCard: {
    elevation: 4,
  },
  questionText: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginVertical: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
  },
  input: {
    marginVertical: 16,
  },
  feedback: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  feedbackText: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  solution: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    marginTop: 24,
  },
  submitButton: {
    paddingVertical: 4,
  },
  nextButton: {
    paddingVertical: 4,
  },
});

export default QuizScreen;

