import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Card, Button, ActivityIndicator} from 'react-native-paper';
import {useTheme} from '../../theme/ThemeContext';
import {englishApi} from '../../services/api';

const EnglishComprehensionScreen = () => {
  const {theme} = useTheme();
  const [passage, setPassage] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await englishApi.generateComprehension();
      setPassage(result.passage);
      setQuestions(result.questions);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate comprehension');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            English Comprehension
          </Text>
          <Button
            mode="contained"
            onPress={handleGenerate}
            loading={loading}
            disabled={loading}
            style={styles.button}>
            Generate Comprehension Passage
          </Button>
        </Card.Content>
      </Card>

      {passage && (
        <Card style={styles.passageCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Passage
            </Text>
            <Text variant="bodyLarge" style={styles.passage}>
              {passage}
            </Text>
          </Card.Content>
        </Card>
      )}

      {questions.length > 0 && (
        <Card style={styles.questionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Questions
            </Text>
            {questions.map((q, index) => (
              <View key={index} style={styles.question}>
                <Text variant="titleSmall" style={styles.questionText}>
                  {index + 1}. {q.question}
                </Text>
              </View>
            ))}
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
  button: {
    marginTop: 8,
  },
  passageCard: {
    marginBottom: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  passage: {
    lineHeight: 24,
  },
  questionsCard: {
    elevation: 4,
  },
  question: {
    marginBottom: 16,
  },
  questionText: {
    lineHeight: 22,
  },
});

export default EnglishComprehensionScreen;

