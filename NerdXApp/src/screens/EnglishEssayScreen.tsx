// ZIMSEC Essay Writing Screen - Professional UI
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
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  englishApi,
  FreeResponseTopic,
  GuidedCompositionPrompt,
  EssayMarkingResult,
} from '../services/api/englishApi';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

type EssayType = 'free_response' | 'guided' | null;

const EnglishEssayScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();

  // State management
  const [essayType, setEssayType] = useState<EssayType>(null);
  const [loading, setLoading] = useState(false);

  // Free Response state
  const [freeTopics, setFreeTopics] = useState<FreeResponseTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<FreeResponseTopic | null>(null);

  // Guided Composition state
  const [guidedPrompt, setGuidedPrompt] = useState<GuidedCompositionPrompt | null>(null);

  // Essay writing state
  const [studentName, setStudentName] = useState('');
  const [studentSurname, setStudentSurname] = useState('');
  const [essayText, setEssayText] = useState('');

  // Results state
  const [submitted, setSubmitted] = useState(false);
  const [markingResult, setMarkingResult] = useState<EssayMarkingResult | null>(null);

  // Handle essay type selection
  const handleSelectEssayType = async (type: 'free_response' | 'guided') => {
    setLoading(true);
    try {
      if (type === 'free_response') {
        const topics = await englishApi.getFreeResponseTopics();
        setFreeTopics(topics);
        setEssayType('free_response');
      } else {
        const prompt = await englishApi.getGuidedComposition();
        if (prompt) {
          setGuidedPrompt(prompt);
          setEssayType('guided');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load essay prompts');
    } finally {
      setLoading(false);
    }
  };

  // Handle topic selection
  const handleSelectTopic = (topic: FreeResponseTopic) => {
    setSelectedTopic(topic);
  };

  // Handle essay submission
  const handleSubmit = async () => {
    // Validation
    if (!studentName.trim() || !studentSurname.trim()) {
      Alert.alert('Missing Information', 'Please enter your name and surname');
      return;
    }

    if (!essayText.trim() || essayText.trim().length < 100) {
      Alert.alert('Essay Too Short', 'Your essay must be at least 100 characters long');
      return;
    }

    // Check credits
    if ((user?.credits || 0) < 3) {
      Alert.alert(
        'Insufficient Credits',
        'Essay marking requires 3 credits. Please buy credits first.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      const result = await englishApi.submitEssayForMarking(
        essayType as 'free_response' | 'guided',
        studentName.trim(),
        studentSurname.trim(),
        essayText.trim(),
        essayType === 'free_response' ? selectedTopic! : undefined,
        essayType === 'guided' ? guidedPrompt! : undefined
      );

      if (result) {
        setMarkingResult(result);
        setSubmitted(true);

        // Update credits
        if (user) {
          const newCredits = (user.credits || 0) - 3;
          updateUser({ credits: newCredits });
        }

        Alert.alert(
          'Marking Complete!',
          `Score: ${result.score}/${result.max_score}\n\n${result.teacher_comment}`,
          [{ text: 'View Feedback' }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to mark essay');
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!markingResult?.pdf_report) return;

    try {
      const fileName = `Essay_${studentName}_${studentSurname}_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Decode base64 and write to file
      await FileSystem.writeAsStringAsync(fileUri, markingResult.pdf_report, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Download Essay Report',
        });
      } else {
        Alert.alert('Success', `Report saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download report');
    }
  };

  // Reset to start
  const handleReset = () => {
    setEssayType(null);
    setFreeTopics([]);
    setSelectedTopic(null);
    setGuidedPrompt(null);
    setStudentName('');
    setStudentSurname('');
    setEssayText('');
    setSubmitted(false);
    setMarkingResult(null);
  };

  // Word count
  const wordCount = essayText.trim().split(/\s+/).filter(w => w.length > 0).length;

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
          {/* Initial Selection Screen */}
          {!essayType && (
            <View style={styles.welcomeCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.glassCard}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="create-outline" size={48} color={Colors.primary} />
                </View>
                <Text style={styles.welcomeTitle}>ZIMSEC Essay Writing</Text>
                <Text style={styles.welcomeText}>
                  Choose your composition type and get professional marking with detailed feedback.
                </Text>

                <TouchableOpacity
                  style={[styles.typeButton, loading && styles.typeButtonDisabled]}
                  onPress={() => handleSelectEssayType('free_response')}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#BDBDBD', '#9E9E9E'] : Colors.gradients.primary}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Ionicons name="list-outline" size={24} color="#FFF" style={{ marginRight: 10 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.typeButtonTitle}>Free Response</Text>
                          <Text style={styles.typeButtonSubtitle}>Choose from 7 topics • 30 marks</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#FFF" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeButton, loading && styles.typeButtonDisabled]}
                  onPress={() => handleSelectEssayType('guided')}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#BDBDBD', '#9E9E9E'] : Colors.gradients.success}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Ionicons name="document-text-outline" size={24} color="#FFF" style={{ marginRight: 10 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.typeButtonTitle}>Guided Composition</Text>
                          <Text style={styles.typeButtonSubtitle}>Letter, Speech, Report • 20 marks</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#FFF" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.infoBox}>
                  <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
                  <Text style={styles.infoText}>Essay marking costs 3 credits</Text>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Free Response Topic Selection */}
          {essayType === 'free_response' && !selectedTopic && (
            <View style={styles.contentContainer}>
              <TouchableOpacity onPress={handleReset} style={styles.backToSelectionButton}>
                <Ionicons name="arrow-back" size={20} color={Colors.primary} />
                <Text style={styles.backToSelectionText}>Change Essay Type</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Select Your Topic</Text>
              <Text style={styles.sectionSubtitle}>Choose 1 of 7 topics (350-450 words)</Text>

              {freeTopics.map((topic, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.topicCard}
                  onPress={() => handleSelectTopic(topic)}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                    style={styles.glassCard}
                  >
                    <View style={styles.topicHeader}>
                      <View style={styles.topicNumber}>
                        <Text style={styles.topicNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.topicBadge}>
                        <Text style={styles.topicBadgeText}>{topic.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <Text style={styles.topicDescription}>{topic.description}</Text>
                    <View style={styles.topicFooter}>
                      <Ionicons name="text-outline" size={16} color={Colors.text.secondary} />
                      <Text style={styles.topicLength}>{topic.suggested_length}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Guided Composition Display */}
          {essayType === 'guided' && guidedPrompt && !selectedTopic && (
            <View style={styles.contentContainer}>
              <TouchableOpacity onPress={handleReset} style={styles.backToSelectionButton}>
                <Ionicons name="arrow-back" size={20} color={Colors.primary} />
                <Text style={styles.backToSelectionText}>Change Essay Type</Text>
              </TouchableOpacity>

              <View style={styles.promptCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                  style={styles.glassCard}
                >
                  <View style={styles.promptHeader}>
                    <Ionicons name="document-text" size={32} color={Colors.success} />
                    <View style={styles.promptBadge}>
                      <Text style={styles.promptBadgeText}>{guidedPrompt.format.replace('_', ' ')}</Text>
                    </View>
                  </View>
                  <Text style={styles.promptTitle}>{guidedPrompt.title}</Text>
                  <Text style={styles.promptContext}>{guidedPrompt.context}</Text>

                  <Text style={styles.keyPointsTitle}>Key Points to Cover:</Text>
                  {guidedPrompt.key_points.map((point, index) => (
                    <View key={index} style={styles.keyPointItem}>
                      <View style={styles.keyPointBullet}>
                        <Text style={styles.keyPointBulletText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.keyPointText}>{point}</Text>
                    </View>
                  ))}

                  {guidedPrompt.format_requirements && (
                    <View style={styles.requirementsBox}>
                      <Ionicons name="alert-circle-outline" size={18} color={Colors.warning} />
                      <Text style={styles.requirementsText}>{guidedPrompt.format_requirements}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.startWritingButton}
                    onPress={() => setSelectedTopic({} as FreeResponseTopic)} // Dummy to trigger writing mode
                  >
                    <LinearGradient
                      colors={Colors.gradients.success}
                      style={styles.gradientButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.startWritingButtonText}>Start Writing</Text>
                      <Ionicons name="create-outline" size={20} color="#FFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Essay Writing Screen */}
          {(selectedTopic || (essayType === 'guided' && guidedPrompt)) && !submitted && (
            <View style={styles.contentContainer}>
              <TouchableOpacity
                onPress={() => setSelectedTopic(null)}
                style={styles.backToSelectionButton}
              >
                <Ionicons name="arrow-back" size={20} color={Colors.primary} />
                <Text style={styles.backToSelectionText}>Change Topic</Text>
              </TouchableOpacity>

              {/* Student Information */}
              <View style={styles.infoCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                  style={styles.glassCard}
                >
                  <Text style={styles.infoCardTitle}>Student Information</Text>
                  <View style={styles.inputRow}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Name</Text>
                      <TextInput
                        style={styles.nameInput}
                        value={studentName}
                        onChangeText={setStudentName}
                        placeholder="First name"
                        placeholderTextColor="#9E9E9E"
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Surname</Text>
                      <TextInput
                        style={styles.nameInput}
                        value={studentSurname}
                        onChangeText={setStudentSurname}
                        placeholder="Last name"
                        placeholderTextColor="#9E9E9E"
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Topic Display */}
              <View style={styles.selectedTopicCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                  style={styles.glassCard}
                >
                  <Text style={styles.selectedTopicLabel}>
                    {essayType === 'free_response' ? 'Your Topic' : 'Your Task'}
                  </Text>
                  <Text style={styles.selectedTopicTitle}>
                    {essayType === 'free_response' ? selectedTopic?.title : guidedPrompt?.title}
                  </Text>
                  <Text style={styles.selectedTopicDescription}>
                    {essayType === 'free_response' ? selectedTopic?.description : guidedPrompt?.context}
                  </Text>
                </LinearGradient>
              </View>

              {/* Essay Input */}
              <View style={styles.essayCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                  style={styles.glassCard}
                >
                  <View style={styles.essayHeader}>
                    <Text style={styles.essayTitle}>Write Your Essay</Text>
                    <View style={styles.wordCountBadge}>
                      <Ionicons name="text-outline" size={14} color={Colors.primary} />
                      <Text style={styles.wordCountText}>{wordCount} words</Text>
                    </View>
                  </View>
                  <TextInput
                    style={styles.essayInput}
                    value={essayText}
                    onChangeText={setEssayText}
                    placeholder="Start writing your essay here..."
                    placeholderTextColor="#9E9E9E"
                    multiline
                    textAlignVertical="top"
                  />
                  <Text style={styles.essayHint}>
                    Recommended: {essayType === 'free_response' ? selectedTopic?.suggested_length : guidedPrompt?.suggested_length}
                  </Text>
                </LinearGradient>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ['#BDBDBD', '#9E9E9E'] : Colors.gradients.primary}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>Submit for Marking</Text>
                      <Text style={styles.submitCostText}>(3 Credits)</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Marking Results Screen */}
          {submitted && markingResult && (
            <View style={styles.contentContainer}>
              {/* Score Card */}
              <View style={styles.resultCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                  style={styles.glassCard}
                >
                  <Text style={styles.resultTitle}>Marking Complete!</Text>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreValue}>{markingResult.score}</Text>
                    <Text style={styles.scoreMax}>/ {markingResult.max_score}</Text>
                  </View>
                  <Text style={styles.scorePercentage}>
                    {Math.round((markingResult.score / markingResult.max_score) * 100)}%
                  </Text>

                  {/* Teacher Comment */}
                  <View style={styles.teacherCommentBox}>
                    <Ionicons name="chatbox-ellipses" size={24} color={Colors.error} />
                    <Text style={styles.teacherComment}>{markingResult.teacher_comment}</Text>
                  </View>

                  {/* Breakdown */}
                  <View style={styles.breakdownContainer}>
                    <Text style={styles.breakdownTitle}>Mark Breakdown</Text>
                    {Object.entries(markingResult.breakdown).map(([key, value]) => (
                      <View key={key} style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>
                          {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                        </Text>
                        <Text style={styles.breakdownValue}>{value} marks</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </View>

              {/* Corrections */}
              {markingResult.corrections && markingResult.corrections.length > 0 && (
                <View style={styles.correctionsCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                    style={styles.glassCard}
                  >
                    <View style={styles.correctionsHeader}>
                      <Ionicons name="checkmark-circle" size={24} color={Colors.error} />
                      <Text style={styles.correctionsTitle}>Corrections ({markingResult.corrections.length})</Text>
                    </View>

                    {markingResult.corrections.slice(0, 10).map((correction, index) => (
                      <View key={index} style={styles.correctionItem}>
                        <View style={styles.correctionNumber}>
                          <Text style={styles.correctionNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.correctionContent}>
                          <View style={styles.correctionRow}>
                            <Text style={styles.correctionLabel}>Wrong:</Text>
                            <Text style={styles.correctionWrong}>{correction.wrong}</Text>
                          </View>
                          <View style={styles.correctionRow}>
                            <Text style={styles.correctionLabel}>Correct:</Text>
                            <Text style={styles.correctionCorrect}>{correction.correct}</Text>
                          </View>
                          <View style={styles.correctionTypeRow}>
                            <View style={styles.correctionTypeBadge}>
                              <Text style={styles.correctionTypeText}>{correction.type}</Text>
                            </View>
                            <Text style={styles.correctionExplanation}>{correction.explanation}</Text>
                          </View>
                        </View>
                      </View>
                    ))}

                    {markingResult.corrections.length > 10 && (
                      <Text style={styles.moreCorrectionsText}>
                        +{markingResult.corrections.length - 10} more corrections in PDF report
                      </Text>
                    )}
                  </LinearGradient>
                </View>
              )}

              {/* Detailed Feedback */}
              <View style={styles.feedbackCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                  style={styles.glassCard}
                >
                  <Text style={styles.feedbackTitle}>Detailed Feedback</Text>
                  <Text style={styles.feedbackText}>{markingResult.detailed_feedback}</Text>
                </LinearGradient>
              </View>

              {/* Corrected Essay */}
              <View style={styles.correctedEssayCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                  style={styles.glassCard}
                >
                  <Text style={styles.correctedEssayTitle}>Corrected Version</Text>
                  <ScrollView style={styles.correctedEssayScroll} nestedScrollEnabled>
                    <Text style={styles.correctedEssayText}>{markingResult.corrected_essay}</Text>
                  </ScrollView>
                </LinearGradient>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
                <LinearGradient
                  colors={Colors.gradients.success}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="download-outline" size={20} color="#FFF" />
                  <Text style={styles.downloadButtonText}>Download PDF Report</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.newEssayButton} onPress={handleReset}>
                <LinearGradient
                  colors={Colors.gradients.primary}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.newEssayButtonText}>Write New Essay</Text>
                </LinearGradient>
              </TouchableOpacity>
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
  typeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  typeButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  typeButtonSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(98, 0, 234, 0.1)',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
  },
  backToSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  backToSelectionText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  topicCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicNumberText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  topicBadge: {
    backgroundColor: 'rgba(98, 0, 234, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topicBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  topicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicLength: {
    marginLeft: 6,
    fontSize: 13,
    color: Colors.text.secondary,
  },
  promptCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
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
    marginBottom: 15,
  },
  promptBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  promptBadgeText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  promptContext: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  keyPointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  keyPointItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  keyPointBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  keyPointBulletText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  keyPointText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  requirementsBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 20,
  },
  requirementsText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 13,
    color: Colors.warning,
    lineHeight: 20,
  },
  startWritingButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startWritingButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  nameInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  selectedTopicCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedTopicLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  selectedTopicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  selectedTopicDescription: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  essayCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  essayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  essayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  wordCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(98, 0, 234, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  wordCountText: {
    marginLeft: 5,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  essayInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 300,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  essayHint: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitCostText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  resultCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
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
    backgroundColor: 'rgba(98, 0, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  scoreMax: {
    fontSize: 20,
    color: Colors.text.secondary,
  },
  scorePercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  teacherCommentBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  teacherComment: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.error,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  breakdownContainer: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 15,
    borderRadius: 12,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  breakdownLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  correctionsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  correctionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  correctionsTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  correctionItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  correctionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  correctionNumberText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  correctionContent: {
    flex: 1,
  },
  correctionRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  correctionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.text.secondary,
    width: 70,
  },
  correctionWrong: {
    flex: 1,
    fontSize: 13,
    color: Colors.error,
    textDecorationLine: 'line-through',
  },
  correctionCorrect: {
    flex: 1,
    fontSize: 13,
    color: Colors.success,
    fontWeight: '600',
  },
  correctionTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  correctionTypeBadge: {
    backgroundColor: 'rgba(98, 0, 234, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  correctionTypeText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  correctionExplanation: {
    flex: 1,
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  moreCorrectionsText: {
    fontSize: 13,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 10,
  },
  feedbackCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  correctedEssayCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  correctedEssayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  correctedEssayScroll: {
    maxHeight: 300,
  },
  correctedEssayText: {
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  downloadButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 3,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  newEssayButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  newEssayButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnglishEssayScreen;
