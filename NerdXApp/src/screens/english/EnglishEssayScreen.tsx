import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Card, TextInput, Button, ActivityIndicator} from 'react-native-paper';
import {useTheme} from '../../theme/ThemeContext';
import {englishApi} from '../../services/api';

const EnglishEssayScreen = () => {
  const {theme} = useTheme();
  const [prompt, setPrompt] = useState('');
  const [essay, setEssay] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleSubmit = async () => {
    if (!prompt || !essay) {
      Alert.alert('Error', 'Please fill in both prompt and essay');
      return;
    }

    setSubmitting(true);
    try {
      const result = await englishApi.submitEssay({
        prompt,
        essay_text: essay,
      });
      setFeedback(result);
      Alert.alert('Success', `Your essay scored ${result.score} marks!`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit essay');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Essay Writing
          </Text>
          <TextInput
            label="Essay Prompt"
            value={prompt}
            onChangeText={setPrompt}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
          />
          <TextInput
            label="Your Essay"
            value={essay}
            onChangeText={setEssay}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={10}
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            style={styles.button}>
            Submit for Marking
          </Button>
        </Card.Content>
      </Card>

      {feedback && (
        <Card style={styles.feedbackCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Feedback
            </Text>
            <Text variant="headlineSmall" style={styles.score}>
              Score: {feedback.score}/50
            </Text>
            <Text variant="bodyLarge" style={styles.feedbackText}>
              {feedback.feedback}
            </Text>
            {feedback.report_url && (
              <Button
                mode="outlined"
                onPress={() => {}}
                style={styles.reportButton}>
                View Full Report
              </Button>
            )}
          </Card.Content>
        </Card>
      )}
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
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  feedbackCard: {
    elevation: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  score: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4CAF50',
  },
  feedbackText: {
    lineHeight: 24,
    marginBottom: 16,
  },
  reportButton: {
    marginTop: 8,
  },
});

export default EnglishEssayScreen;

