// English Essay Screen Component
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
import { englishApi, EssayResult } from '../services/api/englishApi';
import { useAuth } from '../context/AuthContext';

const EnglishEssayScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [essayText, setEssayText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<EssayResult | null>(null);

  const samplePrompts = [
    'Write an essay about the importance of education in Zimbabwe',
    'Describe a memorable event from your childhood',
    'Discuss the impact of technology on modern society',
    'Write about the benefits of reading',
    'Describe your ideal future career',
  ];

  const handleGeneratePrompt = () => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setPrompt(randomPrompt);
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || !essayText.trim()) {
      Alert.alert('Error', 'Please enter both prompt and essay text');
      return;
    }

    if (essayText.trim().length < 100) {
      Alert.alert('Error', 'Essay must be at least 100 characters long');
      return;
    }

    if ((user?.credits || 0) < 3) {
      Alert.alert(
        'Insufficient Credits',
        'Essay marking requires 3 credits. Please buy credits first.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setSubmitting(true);
      const essayResult = await englishApi.submitEssay(prompt.trim(), essayText.trim());
      if (essayResult) {
        setResult(essayResult);
        // Update credits
        if (user) {
          const newCredits = (user.credits || 0) - 3;
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit essay');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewEssay = () => {
    setPrompt('');
    setEssayText('');
    setResult(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✍️ Essay Writing</Text>
        <Text style={styles.subtitle}>Write and get your essay marked</Text>
        <Text style={styles.credits}>Credits: {user?.credits || 0}</Text>
      </View>

      {!result && (
        <View style={styles.essayContainer}>
          <View style={styles.section}>
            <View style={styles.promptHeader}>
              <Text style={styles.label}>Essay Prompt</Text>
              <TouchableOpacity style={styles.generatePromptButton} onPress={handleGeneratePrompt}>
                <Text style={styles.generatePromptText}>🎲 Random Prompt</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.promptInput}
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Enter essay prompt or use random prompt..."
              multiline
              maxLength={500}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>
              Your Essay ({essayText.length} characters)
            </Text>
            <Text style={styles.characterHint}>
              Minimum 100 characters required
            </Text>
            <TextInput
              style={styles.essayInput}
              value={essayText}
              onChangeText={setEssayText}
              placeholder="Write your essay here..."
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!prompt.trim() || !essayText.trim() || essayText.length < 100 || submitting) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!prompt.trim() || !essayText.trim() || essayText.length < 100 || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                Submit for Marking (3 credits)
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreValue}>{result.score}%</Text>
          </View>

          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Feedback</Text>
            <Text style={styles.feedbackText}>{result.feedback}</Text>
          </View>

          {result.report_url && (
            <TouchableOpacity style={styles.reportButton}>
              <Text style={styles.reportButtonText}>📄 View Detailed Report</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.newEssayButton} onPress={handleNewEssay}>
            <Text style={styles.newEssayButtonText}>Write New Essay</Text>
          </TouchableOpacity>
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
  essayContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  generatePromptButton: {
    backgroundColor: '#FF9800',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  generatePromptText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  promptInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#FAFAFA',
  },
  characterHint: {
    fontSize: 12,
    color: '#757575',
    marginTop: 5,
    marginBottom: 10,
  },
  essayInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 300,
    textAlignVertical: 'top',
    backgroundColor: '#FAFAFA',
  },
  submitButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 20,
  },
  scoreCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  feedbackCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 15,
  },
  feedbackText: {
    fontSize: 16,
    color: '#212121',
    lineHeight: 24,
  },
  reportButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  newEssayButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  newEssayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnglishEssayScreen;
