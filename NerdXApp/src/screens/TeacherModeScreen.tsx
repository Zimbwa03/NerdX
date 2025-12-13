// Teacher Mode Screen Component - Enhanced Chatbot Interface
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { teacherApi, TeacherSession, Attachment } from '../services/api/teacherApi';
import { mathApi } from '../services/api/mathApi';
import { useAuth } from '../context/AuthContext';
import { TypingIndicator } from '../components/TypingIndicator';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const TeacherModeScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { subject, gradeLevel, topic } = route.params as {
    subject: string;
    gradeLevel: string;
    topic?: string;
  };

  const [session, setSession] = useState<TeacherSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'camera' | 'search' | 'document'>('text');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    startSession();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const startSession = async () => {
    try {
      setLoading(true);
      console.log('Starting Teacher Mode session with:', { subject, gradeLevel, topic });

      const sessionData = await teacherApi.startSession(subject, gradeLevel, topic);
      console.log('Session data received:', sessionData);

      if (sessionData && sessionData.session_id) {
        setSession(sessionData);
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: sessionData.initial_message || 'Welcome to Teacher Mode! How can I help you learn today?',
            timestamp: new Date(),
          },
        ]);
        // Update credits
        if (user) {
          const newCredits = (user.credits || 0) - 3; // Teacher mode start costs 3 credits
          updateUser({ credits: newCredits });
        }
      } else {
        console.error('Invalid session data:', sessionData);
        Alert.alert(
          'Error',
          'Failed to start Teacher Mode session. Please try again.'
        );
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Teacher Mode error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to start Teacher Mode session'
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // --- Voice & Image Handlers ---

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(recording);
        setIsRecording(true);
      } else {
        Alert.alert('Permission Denied', 'Microphone permission is required.');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        // Transcribe
        setSending(true);
        try {
          const result = await mathApi.transcribeAudio(uri);
          setInputText(result.text);
        } catch (error) {
          Alert.alert('Error', 'Failed to transcribe audio.');
        } finally {
          setSending(false);
        }
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setSending(true);
        try {
          // Scan the image
          const scanResult = await mathApi.scanProblem(result.assets[0].uri);
          if (scanResult.success) {
            // Add the LaTeX/Text to input
            const newText = inputText ? `${inputText}\n\n${scanResult.latex}` : scanResult.latex;
            setInputText(newText);
          } else {
            Alert.alert('Scan Failed', 'Could not recognize equation.');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to scan image.');
        } finally {
          setSending(false);
        }
      }
    } catch (error) {
      console.error('Image pick error', error);
    }
  };

  const playResponse = async (text: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      // Get audio URL
      const audioUrl = await mathApi.speakText(text);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
    } catch (error) {
      console.error('TTS Error', error);
      Alert.alert('Error', 'Failed to play audio.');
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleSend = async () => {
    if (!inputText.trim() || !session || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setSending(true);

    try {
      const response = await teacherApi.sendMessage(session.session_id, userMessage.content);
      if (response) {
        if (response.session_ended) {
          Alert.alert('Session Ended', response.response, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
          return;
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        // Update credits (follow-up costs 1 credit)
        if (user) {
          const newCredits = (user.credits || 0) - 1;
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send message');
      // Remove user message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  };

  const handleGenerateNotes = async () => {
    if (!session || generatingNotes) return;

    Alert.alert(
      'Generate Notes',
      'Generate comprehensive PDF notes from this session? (Costs 1 credit)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            try {
              setGeneratingNotes(true);
              const notesData = await teacherApi.generateNotes(session.session_id);

              if (notesData && notesData.pdf_url) {
                // Download and Share PDF
                const fileUri = (FileSystem as any).documentDirectory + `notes_${session.session_id}.pdf`;
                const downloadRes = await FileSystem.downloadAsync(notesData.pdf_url, fileUri);

                if (downloadRes.status === 200) {
                  if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(downloadRes.uri);
                  } else {
                    Alert.alert('Success', 'Notes downloaded to ' + downloadRes.uri);
                  }

                  // Update credits
                  if (user) {
                    const newCredits = (user.credits || 0) - 1;
                    updateUser({ credits: newCredits });
                  }
                } else {
                  throw new Error('Failed to download PDF');
                }
              } else {
                throw new Error('No PDF URL returned');
              }
            } catch (error: any) {
              console.error('Note generation error:', error);
              Alert.alert('Error', error.message || 'Failed to generate notes');
            } finally {
              setGeneratingNotes(false);
            }
          },
        },
      ]
    );
  };

  const quickQuestions: { [key: string]: string[] } = {
    Biology: ['Explain Photosynthesis', 'What is a Cell?', 'Define Osmosis', 'Functions of the Heart'],
    Chemistry: ['Periodic Table trends', 'What is a Mole?', 'Acids and Bases', 'Bonding types'],
    Physics: ['Newton\'s Laws', 'Ohm\'s Law', 'Types of Energy', 'Reflection vs Refraction'],
    Mathematics: [
      'Algebra Basics', 'Pythagoras Theorem', 'Calculus Intro', 'Trigonometry Rules',
      'Matrices', 'Vectors', 'Circle Theorems', 'Probability', 'Statistics',
      'Sequences & Series', 'Mensuration', 'Transformations'
    ],
    'Combined Science': ['Scientific Method', 'Lab Safety', 'Units of Measurement'],
  };

  const currentSubjectQuestions = quickQuestions[subject] || quickQuestions['Combined Science'];

  const handleQuickAsk = (question: string) => {
    setInputText(question);
  };

  // ==================== Multimodal Handlers ====================

  const handleWebSearch = async () => {
    if (!session) return;

    Alert.prompt(
      '🌐 Science Search',
      'Search the web for accurate science information:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Search',
          onPress: async (query) => {
            if (!query?.trim()) return;

            try {
              setSending(true);
              const result = await teacherApi.searchWeb(query);

              if (result?.response) {
                const assistantMessage: Message = {
                  id: `search-${Date.now()}`,
                  role: 'assistant',
                  content: `🌐 **Science Search Results**\n\nQuery: "${query}"\n\n${result.response}`,
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Search failed');
            } finally {
              setSending(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleDocumentUpload = async () => {
    if (!session) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const file = result.assets[0];
      setSending(true);

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Add analyzing message
      setMessages((prev) => [...prev, {
        id: 'analyzing',
        role: 'assistant',
        content: `📄 **Analyzing Study Material**\n\nFile: ${file.name}\n\nExtracting key concepts...`,
        timestamp: new Date(),
      }]);

      const analysis = await teacherApi.analyzeDocument(
        base64,
        file.mimeType || 'application/pdf'
      );

      // Remove analyzing message and add result
      setMessages((prev) => prev.filter((msg) => msg.id !== 'analyzing'));

      if (analysis?.analysis) {
        const assistantMessage: Message = {
          id: `doc-${Date.now()}`,
          role: 'assistant',
          content: `📄 **Document Analysis**\n\n**File:** ${file.name}\n\n${analysis.analysis}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      setMessages((prev) => prev.filter((msg) => msg.id !== 'analyzing'));
      Alert.alert('Error', error.message || 'Failed to analyze document');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
        <ActivityIndicator size="large" color={themedColors.primary.main} />
        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Starting Teacher Mode...</Text>
      </View>
    );
  }

  // Show error state if session failed to initialize
  if (!session) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>😔</Text>
        <Text style={[styles.loadingText, { color: themedColors.text.primary, fontSize: 18, fontWeight: 'bold' }]}>
          Unable to start Teacher Mode
        </Text>
        <Text style={[styles.loadingText, { color: themedColors.text.secondary, textAlign: 'center', paddingHorizontal: 40 }]}>
          There was an issue connecting to the teacher. Please try again.
        </Text>
        <TouchableOpacity
          style={{ marginTop: 20, backgroundColor: themedColors.primary.main, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
          onPress={() => startSession()}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 12 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: themedColors.text.secondary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const markdownStyles = StyleSheet.create({
    body: {
      color: themedColors.text.primary,
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      color: themedColors.primary.main,
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    heading2: {
      color: themedColors.primary.main,
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 8,
    },
    strong: {
      fontWeight: 'bold',
      color: themedColors.secondary.main,
    },
    em: {
      fontStyle: 'italic',
      color: themedColors.text.secondary,
    },
    code_inline: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0',
      color: themedColors.secondary.main,
      borderRadius: 4,
      paddingHorizontal: 4,
    },
    code_block: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
      padding: 10,
      borderRadius: 8,
      marginVertical: 8,
      borderColor: themedColors.border.light,
      borderWidth: 1,
    },
    link: {
      color: themedColors.secondary.main,
      textDecorationLine: 'underline',
    },
    list_item: {
      marginVertical: 4,
      color: themedColors.text.primary,
    },
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themedColors.background.default }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={themedColors.background.default} />
      <LinearGradient
        colors={themedColors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={{ position: 'absolute', top: 50, left: 20, zIndex: 1 }} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={[styles.headerContent, { paddingTop: 20 }]}>
          <View style={styles.teacherAvatar}>
            <Text style={styles.teacherAvatarText}>👨‍🏫</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Teacher Mode</Text>
            <Text style={styles.headerSubtitle}>
              {subject} • {gradeLevel}
            </Text>
          </View>
          <View style={styles.creditsContainer}>
            <Text style={styles.credits}>{user?.credits || 0}</Text>
            <Text style={styles.creditsLabel}>credits</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        style={[styles.messagesContainer, { backgroundColor: themedColors.background.default }]}
        contentContainerStyle={styles.messagesContent}
        renderItem={({ item: message }) => (
          <View
            style={[
              styles.messageRow,
              message.role === 'user' ? styles.userMessageRow : styles.assistantMessageRow,
            ]}
          >
            {message.role === 'assistant' && (
              <View style={[styles.assistantAvatarSmall, { backgroundColor: themedColors.primary.light }]}>
                <Text style={styles.assistantAvatarSmallText}>👨‍🏫</Text>
              </View>
            )}
            <View style={{ maxWidth: '80%' }}>
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userMessage : [styles.assistantMessage, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light }],
                  { maxWidth: '100%' }
                ]}
              >
                {message.role === 'user' ? (
                  <LinearGradient
                    colors={themedColors.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.userMessageGradient}
                  >
                    <Text style={styles.userMessageText}>{message.content}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.markdownContainer}>
                    <Markdown style={markdownStyles}>
                      {message.content}
                    </Markdown>
                  </View>
                )}
              </View>
              {message.role === 'assistant' && (
                <TouchableOpacity
                  style={styles.speakerButton}
                  onPress={() => playResponse(message.content)}
                >
                  <Ionicons name="volume-high-outline" size={20} color={themedColors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          sending ? (
            <View style={[styles.messageRow, styles.assistantMessageRow]}>
              <View style={[styles.assistantAvatarSmall, { backgroundColor: themedColors.primary.light }]}>
                <Text style={styles.assistantAvatarSmallText}>👨‍🏫</Text>
              </View>
              <View style={[styles.messageBubble, styles.assistantMessage, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light }]}>
                <TypingIndicator />
              </View>
            </View>
          ) : null
        }
      />

      <View style={[styles.inputContainer, { backgroundColor: themedColors.background.paper, borderTopColor: themedColors.border.light }]}>
        {/* Quick Ask Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickAskContainer}>
          {currentSubjectQuestions.map((q, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickAskButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA', borderColor: themedColors.primary.main }]}
              onPress={() => handleQuickAsk(q)}
              disabled={sending}
            >
              <Text style={[styles.quickAskText, { color: themedColors.primary.main }]}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={[styles.notesButton, { backgroundColor: themedColors.success.main }]}
          onPress={handleGenerateNotes}
          disabled={generatingNotes}
        >
          {generatingNotes ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.notesButtonText}>📄 Generate Notes</Text>
          )}
        </TouchableOpacity>

        <View style={styles.inputRow}>
          {/* Mode Toggle Button - shows current active mode */}
          <TouchableOpacity
            style={[styles.modeToggleButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#F0F0F0' }]}
            onPress={() => {
              // Cycle through modes: text -> voice -> camera -> search -> document -> text
              const modes: ('text' | 'voice' | 'camera' | 'search' | 'document')[] = ['text', 'voice', 'camera', 'search', 'document'];
              const currentIndex = modes.indexOf(inputMode);
              const nextIndex = (currentIndex + 1) % modes.length;
              setInputMode(modes[nextIndex]);
            }}
            disabled={sending || isRecording}
          >
            <Ionicons
              name={
                inputMode === 'text' ? 'chatbubble-outline' :
                  inputMode === 'voice' ? 'mic-outline' :
                    inputMode === 'camera' ? 'camera-outline' :
                      inputMode === 'search' ? 'globe-outline' :
                        'document-attach-outline'
              }
              size={22}
              color={
                inputMode === 'voice' ? themedColors.error.main :
                  inputMode === 'search' ? themedColors.success.main :
                    inputMode === 'document' ? '#2196F3' :
                      themedColors.primary.main
              }
            />
          </TouchableOpacity>

          {/* Conditional Action Button based on mode */}
          {inputMode === 'voice' && (
            <TouchableOpacity
              style={[styles.actionModeButton, isRecording && { backgroundColor: themedColors.error.main }]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={sending}
            >
              <Ionicons
                name={isRecording ? "stop-circle" : "mic"}
                size={24}
                color={isRecording ? "#FFF" : themedColors.error.main}
              />
              <Text style={[styles.actionModeText, { color: isRecording ? '#FFF' : themedColors.error.main }]}>
                {isRecording ? 'Stop' : 'Tap to Speak'}
              </Text>
            </TouchableOpacity>
          )}

          {inputMode === 'camera' && (
            <TouchableOpacity
              style={styles.actionModeButton}
              onPress={handleImagePick}
              disabled={sending}
            >
              <Ionicons name="camera" size={24} color={themedColors.primary.main} />
              <Text style={[styles.actionModeText, { color: themedColors.primary.main }]}>Scan Image</Text>
            </TouchableOpacity>
          )}

          {inputMode === 'search' && (
            <TouchableOpacity
              style={styles.actionModeButton}
              onPress={handleWebSearch}
              disabled={sending}
            >
              <Ionicons name="globe" size={24} color={themedColors.success.main} />
              <Text style={[styles.actionModeText, { color: themedColors.success.main }]}>Web Search</Text>
            </TouchableOpacity>
          )}

          {inputMode === 'document' && (
            <TouchableOpacity
              style={styles.actionModeButton}
              onPress={handleDocumentUpload}
              disabled={sending}
            >
              <Ionicons name="document-attach" size={24} color="#2196F3" />
              <Text style={[styles.actionModeText, { color: '#2196F3' }]}>Upload PDF</Text>
            </TouchableOpacity>
          )}

          {/* Text Input - only show in text mode or when other modes aren't active */}
          {inputMode === 'text' && (
            <>
              <TextInput
                style={[styles.textInput, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA', borderColor: themedColors.border.light, color: themedColors.text.primary }]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask a question..."
                placeholderTextColor={themedColors.text.disabled}
                multiline
                maxLength={500}
                editable={!sending}
              />
              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!inputText.trim() || sending}
              >
                {sending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <LinearGradient
                    colors={(!inputText.trim() || sending) ? ['#E0E0E0', '#BDBDBD'] : themedColors.gradients.primary}
                    style={{ borderRadius: 24, flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
                  >
                    <Ionicons name="send" size={20} color="#FFF" />
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.default,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.text.secondary,
    fontSize: 16,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  teacherAvatarText: {
    fontSize: 28,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  creditsContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  credits: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  creditsLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  assistantMessageRow: {
    justifyContent: 'flex-start',
  },
  assistantAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  assistantAvatarSmallText: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  userMessage: {
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: Colors.background.paper,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  userMessageGradient: {
    padding: 12,
    paddingHorizontal: 16,
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  markdownContainer: {
    padding: 12,
    paddingHorizontal: 16,
  },
  inputContainer: {
    backgroundColor: Colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    padding: 12,
    paddingBottom: 24,
  },
  notesButton: {
    backgroundColor: Colors.success.main,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: Colors.success.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  notesButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: Colors.background.subtle,
    color: Colors.text.primary,
  },
  sendButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.text.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  quickAskContainer: {
    marginBottom: 12,
    maxHeight: 40,
  },
  quickAskButton: {
    backgroundColor: Colors.background.subtle,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  quickAskText: {
    color: Colors.primary.light,
    fontSize: 14,
    fontWeight: '500',
  },
  mediaButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: Colors.error.main,
    borderRadius: 20,
    padding: 10,
  },
  speakerButton: {
    padding: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: Colors.text.primary,
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    color: Colors.primary.light,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  heading2: {
    color: Colors.primary.light,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  strong: {
    fontWeight: 'bold',
    color: Colors.secondary.main,
  },
  em: {
    fontStyle: 'italic',
    color: Colors.text.secondary,
  },
  code_inline: {
    backgroundColor: Colors.background.subtle,
    color: Colors.secondary.light,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  code_block: {
    backgroundColor: Colors.background.subtle,
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    borderColor: Colors.border.light,
    borderWidth: 1,
  },
  link: {
    color: Colors.secondary.main,
    textDecorationLine: 'underline',
  },
  list_item: {
    marginVertical: 4,
  },
  modeToggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actionModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    gap: 8,
  },
  actionModeText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default TeacherModeScreen;
