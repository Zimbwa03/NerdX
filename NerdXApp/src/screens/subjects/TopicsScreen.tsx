import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Card, Button, ActivityIndicator} from 'react-native-paper';
import {useTheme} from '../../theme/ThemeContext';
import {quizApi} from '../../services/api';
import {Topic} from '../../types';

const TopicsScreen = ({route, navigation}: any) => {
  const {theme} = useTheme();
  const subject = route.params?.subject || '';
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, [subject]);

  const loadTopics = async () => {
    try {
      const data = await quizApi.getTopics(subject);
      setTopics(data);
    } catch (error) {
      console.error('Failed to load topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (type: 'topical' | 'exam', topicId?: string) => {
    navigation.navigate('Quiz', {
      subject,
      topic: topicId,
      type,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        {subject.charAt(0).toUpperCase() + subject.slice(1).replace('_', ' ')}
      </Text>

      <Button
        mode="contained"
        onPress={() => handleStartQuiz('exam')}
        style={styles.examButton}
        icon="school">
        Start Full Exam
      </Button>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Topics
      </Text>

      {topics.length > 0 ? (
        topics.map(topic => (
          <TouchableOpacity
            key={topic.id}
            onPress={() => handleStartQuiz('topical', topic.id)}>
            <Card style={styles.topicCard}>
              <Card.Content>
                <Text variant="titleMedium">{topic.name}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noTopics}>No topics available</Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  examButton: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  topicCard: {
    marginBottom: 12,
    elevation: 2,
  },
  noTopics: {
    textAlign: 'center',
    marginTop: 32,
    opacity: 0.6,
  },
});

export default TopicsScreen;

