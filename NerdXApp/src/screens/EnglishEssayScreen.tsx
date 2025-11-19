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
  ImageBackground,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { englishApi, EssayResult } from '../services/api/englishApi';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

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
          <Text style={styles.headerTitle}>Essay Writing</Text>
          <View style={styles.creditContainer}>
            <Ionicons name="wallet-outline" size={16} color="#FFF" />
            <Text style={styles.creditText}>{user?.credits || 0}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!result && (
            <View style={styles.contentContainer}>
              <View style={styles.section}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                  style={styles.glassCard}
                >
                  <View style={styles.promptHeader}>
                    <Text style={styles.label}>Essay Prompt</Text>
                    <TouchableOpacity style={styles.generatePromptButton} onPress={handleGeneratePrompt}>
                      <LinearGradient
                        colors={Colors.gradients.secondary}
                        style={styles.smallGradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Ionicons name="shuffle" size={14} color="#FFF" style={{ marginRight: 4 }} />
                        <Text style={styles.generatePromptText}>Random</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.promptInput}
                    value={prompt}
                    onChangeText={setPrompt}
                    placeholder="Enter essay prompt or use random prompt..."
                    placeholderTextColor="#9E9E9E"
                    multiline
                    maxLength={500}
                  />
                </LinearGradient>
              </View>

              <View style={styles.section}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                  style={styles.glassCard}
                >
                  <View style={styles.promptHeader}>
                    <Text style={styles.label}>Your Essay</Text>
                    <Text style={styles.characterCount}>
                      {essayText.length} chars
                    </Text>
                  </View>
                  <TextInput
                    style={styles.essayInput}
                    value={essayText}
                    onChangeText={setEssayText}
                    placeholder="Write your essay here..."
                    placeholderTextColor="#9E9E9E"
                    multiline
                    textAlignVertical="top"
                    maxLength={5000}
                  />
                  <Text style={styles.characterHint}>
                    Minimum 100 characters required
                  </Text>
                </LinearGradient>
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
                <LinearGradient
                  colors={
                    !prompt.trim() || !essayText.trim() || essayText.length < 100 || submitting
                      ? ['#BDBDBD', '#9E9E9E']
                      : Colors.gradients.primary
                  }
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.submitButtonText}>Submit for Marking</Text>
                      <Text style={styles.costText}>(3 Credits)</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {result && (
            <View style={styles.resultContainer}>
              <View style={styles.scoreCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                  style={styles.glassCard}
                >
                  <Text style={styles.scoreLabel}>Overall Score</Text>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreValue}>{result.score}%</Text>
                  </View>

                  <View style={styles.feedbackSection}>
                    <Text style={styles.feedbackTitle}>Feedback</Text>
                    <Text style={styles.feedbackText}>{result.feedback}</Text>
                  </View>

                  {result.report_url && (
                    <TouchableOpacity style={styles.reportButton}>
                      <LinearGradient
                        colors={Colors.gradients.secondary}
                        style={styles.gradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.reportButtonText}>View Detailed Report</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.newEssayButton} onPress={handleNewEssay}>
                    <LinearGradient
                      colors={Colors.gradients.primary}
                      style={styles.gradientButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.newEssayButtonText}>Write New Essay</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
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
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  glassCard: {
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  generatePromptButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  smallGradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  generatePromptText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  promptInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#F5F7FA',
    color: Colors.text.primary,
  },
  essayInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 300,
    textAlignVertical: 'top',
    backgroundColor: '#F5F7FA',
    color: Colors.text.primary,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  characterHint: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 5,
    textAlign: 'right',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  costText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  resultContainer: {
    padding: 20,
  },
  scoreCard: {
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
    borderWidth: 4,
    borderColor: Colors.success,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.success,
  },
  feedbackSection: {
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.warning,
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  reportButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  reportButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newEssayButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  newEssayButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnglishEssayScreen;
