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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { teacherApi, TeacherSession } from '../services/api/teacherApi';
import { mathApi } from '../services/api/mathApi';
import { useAuth } from '../context/AuthContext';
import { TypingIndicator } from '../components/TypingIndicator';
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
      const sessionData = await teacherApi.startSession(subject, gradeLevel, topic);
      if (sessionData) {
        setSession(sessionData);
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: sessionData.initial_message,
            timestamp: new Date(),
          },
        ]);
        // Update credits
        if (user) {
          const newCredits = (user.credits || 0) - 3; // Teacher mode start costs 3 credits
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to start Teacher Mode session'
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
        <Text style={styles.loadingText}>Starting Teacher Mode...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
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
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        renderItem={({ item: message }) => (
          <View
            style={[
              styles.messageRow,
              message.role === 'user' ? styles.userMessageRow : styles.assistantMessageRow,
            ]}
          >
            {message.role === 'assistant' && (
              <View style={styles.assistantAvatarSmall}>
                <Text style={styles.assistantAvatarSmallText}>👨‍🏫</Text>
              </View>
            )}
            <View style={{ maxWidth: '80%' }}>
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage,
                  { maxWidth: '100%' }
                ]}
              >
                {message.role === 'user' ? (
                  <LinearGradient
                    colors={Colors.gradients.primary}
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
                  <Ionicons name="volume-high-outline" size={20} color={Colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          sending ? (
            <View style={[styles.messageRow, styles.assistantMessageRow]}>
              <View style={styles.assistantAvatarSmall}>
                <Text style={styles.assistantAvatarSmallText}>👨‍🏫</Text>
              </View>
              <View style={[styles.messageBubble, styles.assistantMessage]}>
                <TypingIndicator />
              </View>
            </View>
          ) : null
        }
      />

      <View style={styles.inputContainer}>
        {/* Quick Ask Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickAskContainer}>
          {currentSubjectQuestions.map((q, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickAskButton}
              onPress={() => handleQuickAsk(q)}
              disabled={sending}
            >
              <Text style={styles.quickAskText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.notesButton}
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
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={handleImagePick}
            disabled={sending}
          >
            <Ionicons name="camera-outline" size={24} color={Colors.primary.main} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mediaButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={sending}
          >
            <Ionicons
              name={isRecording ? "stop-circle" : "mic-outline"}
              size={24}
              color={isRecording ? "#FFF" : Colors.primary.main}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask a question..."
            placeholderTextColor={Colors.text.hint}
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
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
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
});

export default TeacherModeScreen;
