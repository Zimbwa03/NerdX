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
  Image,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import MathRenderer from '../components/MathRenderer';
import { shouldRenderMathText, toMathLatex } from '../utils/mathText';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { teacherApi, TeacherSession, Attachment } from '../services/api/teacherApi';
import { mathApi } from '../services/api/mathApi';
import { API_BASE_URL } from '../services/api/config';
import { useAuth } from '../context/AuthContext';
import { TypingIndicator } from '../components/TypingIndicator';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { useNotification } from '../context/NotificationContext';
import { Colors } from '../theme/colors';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { VideoStreamPlayer } from '../components/VideoStreamPlayer';
import ZoomableImageModal from '../components/ZoomableImageModal';
import { attachmentsApi } from '../services/api/attachmentsApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  graph_url?: string;
  video_url?: string;
  image_url?: string; // User-sent images
  image_urls?: string[]; // Multi-image user messages
  context_pack_id?: string;
}

const TeacherModeScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const insets = useSafeAreaInsets();
  const { subject, gradeLevel, topic, formLevel } = route.params as {
    subject: string;
    gradeLevel: string;
    topic?: string;
    formLevel?: string;
  };
  const effectiveGradeLevel = formLevel || gradeLevel;
  const isMathSubject = (subject || '').toLowerCase().includes('math');

  const [session, setSession] = useState<TeacherSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  // On some Android keyboards, the last few keystrokes may not have flushed
  // to React state when the user taps "Send". Keep a ref with the latest value
  // to ensure we always send the full text.
  const latestInputTextRef = useRef<string>('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [activeMode, setActiveMode] = useState<'chat'>('chat');
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ uri: string, base64?: string } | null>(null);
  const [showQuickAskButtons, setShowQuickAskButtons] = useState(true); // Hide after first message or when typing
  const [selectedImages, setSelectedImages] = useState<Array<{ uri: string; name?: string; mimeType?: string }>>([]);

  // Zoom Modal State
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

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
      if ((user?.credits || 0) <= 0) {
        showError('❌ You have 0 credits. Please top up to use Teacher Mode.', 6000);
        Alert.alert(
          'Insufficient Credits',
          'Teacher Mode requires credits to start. Please buy credits first.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }
      console.log('Starting Teacher Mode session with:', { subject, gradeLevel: effectiveGradeLevel, topic, formLevel });

      const sessionData = await teacherApi.startSession(subject, effectiveGradeLevel, topic);
      console.log('Session data received:', sessionData);

      if (sessionData && sessionData.session_id) {
        if (user && sessionData.credits_remaining !== undefined) {
          updateUser({ credits: sessionData.credits_remaining });
        }
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
        // No initial credit deduction
        // if (user) {
        //   const newCredits = (user.credits || 0) - 3; // Teacher mode start costs 3 credits
        //   updateUser({ credits: newCredits });
        //   showSuccess(`✅ Teacher Mode started! ${newCredits} credits remaining.`, 3000);

        //   if (newCredits <= 3 && newCredits > 0) {
        //     setTimeout(() => {
        //       showWarning(`⚠️ Running low on credits! Only ${newCredits} credits left.`, 5000);
        //     }, 3500);
        //   }
        // }
      } else {
        console.error('Invalid session data:', sessionData);
        showError('❌ Failed to start Teacher Mode session. Please try again.', 5000);
        Alert.alert(
          'Error',
          'Failed to start Teacher Mode session. Please try again.'
        );
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Teacher Mode error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start Teacher Mode session';
      showError(`❌ ${errorMessage}`, 5000);
      Alert.alert(
        'Error',
        errorMessage
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
          latestInputTextRef.current = result.text || '';
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

  const handleAttachImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, 10 - selectedImages.length),
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const next = [...selectedImages];
      for (const asset of result.assets) {
        if (!asset.uri) continue;
        if (next.length >= 10) break;
        next.push({
          uri: asset.uri,
          name: (asset as any).fileName || undefined,
          mimeType: (asset as any).mimeType || 'image/jpeg',
        });
      }

      if (next.length > 10) {
        Alert.alert('Limit reached', 'You can attach up to 10 images.');
      }

      setSelectedImages(next.slice(0, 10));
    } catch (error) {
      console.error('Image pick error', error);
    }
  };

  const playResponse = async (text: string) => {
    try {
      // Stop and unload any existing sound
      if (sound) {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch (e) {
          // Ignore errors when stopping/unloading
        }
      }

      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Get audio URL
      const audioUrl = await mathApi.speakText(text);

      if (!audioUrl) {
        throw new Error('No audio URL returned');
      }

      // Create and play the sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        {
          shouldPlay: true,
          isMuted: false,
          volume: 1.0,
          rate: 1.0,
        }
      );

      // Set up playback status listener
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            // Audio finished playing
            newSound.unloadAsync().catch(console.error);
          } else if (status.error) {
            console.error('Playback error:', status.error);
            Alert.alert('Playback Error', 'Failed to play audio. Please try again.');
          }
        }
      });

      setSound(newSound);
    } catch (error: any) {
      console.error('TTS Error', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to play audio.';
      Alert.alert('Error', errorMessage);
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
    const rawText = (latestInputTextRef.current ?? inputText) as string;
    const query = rawText.trim();
    const hasImages = selectedImages.length > 0;
    if ((!query && !hasImages) || !session || sending) return;
    if ((user?.credits || 0) <= 0) {
      showError('❌ You have 0 credits. Please top up to continue Teacher Mode.', 6000);
      Alert.alert(
        'Insufficient Credits',
        'Teacher Mode requires credits to continue. Please buy credits first.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query || '📷 (images)',
      timestamp: new Date(),
      image_urls: hasImages ? selectedImages.map((i) => i.uri) : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    latestInputTextRef.current = '';
    setSelectedImages([]);
    setShowQuickAskButtons(false); // Hide buttons after sending first message
    setSending(true);

    try {
      let response: any;

      let contextPackId: string | undefined;
      if (hasImages) {
        // 1) Analyze + create Context Pack
        const pack = await attachmentsApi.analyzeImages({
          images: selectedImages,
          prompt: query,
          chatId: session.session_id,
        });
        contextPackId = pack?.id;
      }

      // 2) Regular chat using Context Pack grounding (if present)
      response = await teacherApi.sendMessage(session.session_id, query, contextPackId);

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
          graph_url: response.graph_url,
          video_url: response.video_url,
          context_pack_id: response.context_pack_id || contextPackId,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        // Update credits from server response
        if (user && response.credits_remaining !== undefined) {
          updateUser({ credits: response.credits_remaining });
        }
      }
    } catch (error: any) {
      setMessages((prev) => prev.filter((msg) => msg.id !== 'researching'));
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      Alert.alert('Error', errorMessage);
      if (error.response?.status === 402) {
        showError(`❌ ${errorMessage}`, 6000);
        navigation.goBack();
      } else {
        // Remove user message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      }
    } finally {
      setSending(false);
    }
  };



  const quickQuestions: { [key: string]: string[] } = {
    Biology: ['Explain Photosynthesis', 'What is a Cell?', 'Define Osmosis', 'Functions of the Heart'],
    Chemistry: ['Periodic Table trends', 'What is a Mole?', 'Acids and Bases', 'Bonding types'],
    Physics: ['Newton\'s Laws', 'Ohm\'s Law', 'Types of Energy', 'Reflection vs Refraction'],
    'O Level Mathematics': [
      'Algebra Basics', 'Pythagoras Theorem', 'Trigonometry Rules',
      'Matrices', 'Vectors', 'Circle Theorems', 'Probability', 'Statistics',
      'Sequences & Series', 'Mensuration', 'Transformations'
    ],
    'Pure Mathematics': [
      'Differentiation', 'Integration', 'Trigonometry Identities',
      'Complex Numbers', 'Vector Geometry', 'Sequences & Series',
      'Binomial Expansion', 'Functions', 'Coordinate Geometry'
    ],
    'Combined Science': ['Scientific Method', 'Lab Safety', 'Units of Measurement'],
  };

  const currentSubjectQuestions = quickQuestions[subject] || quickQuestions['Combined Science'];

  const handleQuickAsk = (question: string) => {
    latestInputTextRef.current = question;
    setInputText(question);
    setShowQuickAskButtons(false); // Hide buttons when user selects a quick ask
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

  const getRenderPlan = (text: string) => {
    const displayMatches = [...text.matchAll(/\$\$([\s\S]+?)\$\$/g)].map((match) => match[1]);
    const inlineMatches = [...text.matchAll(/\$([^$\n]+?)\$/g)].map((match) => match[1]);
    const hasLatexSegments = displayMatches.length > 0 || inlineMatches.length > 0;
    const hasMathSegments = inlineMatches.some((segment) => {
      const trimmed = segment.trim();
      if (!trimmed) return false;
      if (/^\d+(\.\d+)?$/.test(trimmed)) return false;
      return /[=^_\\]|\\[a-zA-Z]+|[+\-*/]/.test(trimmed) || /[a-zA-Z]/.test(trimmed);
    }) || displayMatches.length > 0;
    const hasMathSignals = shouldRenderMathText(text) || /\\[a-zA-Z]+/.test(text);
    const shouldUseMath = hasMathSignals || (hasLatexSegments && hasMathSegments);
    const markdownContent = shouldUseMath ? text : text.replace(/\$/g, '\\$');
    return {
      shouldUseMath,
      mathContent: toMathLatex(text, shouldUseMath),
      markdownContent,
    };
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themedColors.background.default }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={themedColors.background.default} />
      <LinearGradient
        colors={themedColors?.gradients?.primary || ['#7C4DFF', '#3F1DCB']}
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
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">Teacher Mode</Text>
            <Text style={styles.headerSubtitle} numberOfLines={2} ellipsizeMode="tail">
              {subject} • {effectiveGradeLevel}
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
          message.role === 'user' ? (
            // User Message - Bubble on Right (ChatGPT style)
            <View style={styles.userMessageRow}>
              <View style={styles.userMessageBubble}>
                <LinearGradient
                  colors={themedColors?.gradients?.primary || ['#7C4DFF', '#3F1DCB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.userMessageGradient}
                >
                  {message.image_urls?.length ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      {message.image_urls.slice(0, 10).map((uri, idx) => (
                        <Image
                          key={`${message.id}-img-${idx}`}
                          source={{ uri }}
                          style={{ width: 96, height: 96, borderRadius: 12 }}
                          resizeMode="cover"
                        />
                      ))}
                    </View>
                  ) : (
                    message.image_url ? (
                      <Image
                        source={{ uri: message.image_url }}
                        style={{ width: '100%', height: 150, borderRadius: 12, marginBottom: 8 }}
                        resizeMode="cover"
                      />
                    ) : null
                  )}
                  <Text style={styles.userMessageText}>{message.content}</Text>
                </LinearGradient>
              </View>
            </View>
          ) : (
            // Assistant Message - Full Width, Structured (ChatGPT style)
            <View style={styles.assistantMessageRow}>
              <View style={styles.assistantMessageFullWidth}>
                <View style={styles.markdownContainer}>
                  {(() => {
                    const renderPlan = getRenderPlan(message.content);
                    return renderPlan.shouldUseMath ? (
                      <MathRenderer
                        content={renderPlan.mathContent}
                        fontSize={16}
                        minHeight={50}
                      />
                    ) : (
                      <Markdown style={markdownStyles}>
                        {renderPlan.markdownContent}
                      </Markdown>
                    );
                  })()}
                  {message.graph_url && (
                    <View style={styles.graphContainer}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          setZoomImage(`${API_BASE_URL}${message.graph_url}`);
                          setZoomVisible(true);
                        }}
                      >
                        <Image
                          source={{ uri: `${API_BASE_URL}${message.graph_url}` }}
                          style={styles.graphImage}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Text style={styles.graphCaption}>Mathematical Graph</Text>
                    </View>
                  )}
                  {message.video_url && (
                    <View style={{ marginTop: 12, height: 220, width: '100%', borderRadius: 12, overflow: 'hidden' }}>
                      <VideoStreamPlayer
                        videoUrl={`${API_BASE_URL}${message.video_url}`}
                        topicTitle="Explanation"
                        accentColor={themedColors.primary.main}
                      />
                    </View>
                  )}
                </View>
                
                {/* Interaction Buttons Row (ChatGPT style) */}
                <View style={styles.interactionButtonsRow}>
                  <TouchableOpacity
                    style={styles.interactionButton}
                    onPress={() => {
                      Clipboard.setString(message.content);
                      showSuccess('Copied to clipboard');
                    }}
                  >
                    <Ionicons name="copy-outline" size={18} color={themedColors.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.interactionButton}
                    onPress={() => showInfo('Feedback recorded')}
                  >
                    <Ionicons name="thumbs-up-outline" size={18} color={themedColors.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.interactionButton}
                    onPress={() => showInfo('Feedback recorded')}
                  >
                    <Ionicons name="thumbs-down-outline" size={18} color={themedColors.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.interactionButton}
                    onPress={() => playResponse(message.content)}
                  >
                    <Ionicons name="volume-high-outline" size={18} color={themedColors.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.interactionButton}
                    onPress={async () => {
                      try {
                        await Sharing.shareAsync({
                          message: message.content,
                          title: 'Share Response',
                        });
                      } catch (error) {
                        showError('Unable to share');
                      }
                    }}
                  >
                    <Ionicons name="share-outline" size={18} color={themedColors.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.interactionButton}
                    onPress={() => showInfo('More options')}
                  >
                    <Ionicons name="ellipsis-horizontal-outline" size={18} color={themedColors.text.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        )}
        ListFooterComponent={
          sending ? (
            <View style={styles.assistantMessageRow}>
              <View style={styles.assistantMessageFullWidth}>
                <View style={styles.markdownContainer}>
                  <TypingIndicator />
                </View>
              </View>
            </View>
          ) : null
        }
      />

      <View style={[styles.inputContainer, { 
        backgroundColor: themedColors.background.paper, 
        borderTopColor: themedColors.border.light,
        paddingBottom: Math.max(24, insets.bottom + 12) // Ensure minimum 24px + safe area
      }]}>
        {/* Selected images preview (ChatGPT-style, above the input) */}
        {selectedImages.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 10 }}
          >
            {selectedImages.map((img, idx) => (
              <View key={`${img.uri}-${idx}`} style={{ marginRight: 10 }}>
                <Image
                  source={{ uri: img.uri }}
                  style={{ width: 72, height: 72, borderRadius: 14 }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => setSelectedImages((prev) => prev.filter((_, i) => i !== idx))}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Quick Ask Buttons - Only show initially */}
        {showQuickAskButtons && (
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
        )}


        {/* Media Selection Popup - Premium Glass Design */}
        {showModeMenu && (
          <View style={[
            styles.modeMenuPopup,
            {
              backgroundColor: isDarkMode ? 'rgba(30, 30, 50, 0.98)' : '#FFFFFF',
              borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(0, 0, 0, 0.08)',
            }
          ]}>
            {/* Header */}
            <Text style={[
              styles.modeMenuHeader,
              { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#666' }
            ]}>Add Content</Text>

            <TouchableOpacity
              style={[
                styles.modeMenuItem,
                { backgroundColor: isDarkMode ? 'rgba(33, 150, 243, 0.15)' : 'rgba(33, 150, 243, 0.08)' }
              ]}
              onPress={() => { handleDocumentUpload(); setShowModeMenu(false); }}
            >
              <View style={[styles.modeMenuIcon, { backgroundColor: isDarkMode ? 'rgba(33, 150, 243, 0.25)' : 'rgba(33, 150, 243, 0.15)' }]}>
                <Ionicons name="document-attach-outline" size={22} color="#2196F3" />
              </View>
              <View style={styles.modeMenuTextContainer}>
                <Text style={[styles.modeMenuText, { color: isDarkMode ? '#64B5F6' : '#1976D2' }]}>Upload Document</Text>
                <Text style={[styles.modeMenuDesc, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#888' }]}>Analyze PDFs and study materials</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeMenuItem,
                { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)' }
              ]}
              onPress={() => { handleAttachImages(); setShowModeMenu(false); }}
            >
              <View style={[styles.modeMenuIcon, { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)' }]}>
                <Ionicons name="image-outline" size={22} color={themedColors.primary.main} />
              </View>
              <View style={styles.modeMenuTextContainer}>
                <Text style={[styles.modeMenuText, { color: isDarkMode ? '#B794F6' : '#7C3AED' }]}>Attach Images</Text>
                <Text style={[styles.modeMenuDesc, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#888' }]}>Attach up to 10 images</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Row - Always visible */}
        <View style={styles.inputRow}>
          {/* Add Media Button (+ icon) */}
          <TouchableOpacity
            style={[styles.modeToggleButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#F0F0F0' }]}
            onPress={() => setShowModeMenu(!showModeMenu)}
            disabled={sending}
          >
            <Ionicons name="add" size={24} color={themedColors.primary.main} />
          </TouchableOpacity>

          {/* Input Container with TextInput and Mic */}
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA',
              borderColor: themedColors.border.light,
            }
          ]}>
            <TextInput
              style={[
                styles.textInputInline,
                { color: themedColors.text.primary }
              ]}
              value={inputText}
              onChangeText={(text) => {
                latestInputTextRef.current = text;
                setInputText(text);
                if (text.trim().length > 0) {
                  setShowQuickAskButtons(false); // Hide buttons when user starts typing
                }
              }}
              placeholder="Ask a question..."
              placeholderTextColor={themedColors.text.disabled}
              multiline
              maxLength={500}
              editable={!sending && !isRecording}
            />

            {/* Inline Mic Button */}
            <TouchableOpacity
              style={[
                styles.micButton,
                isRecording && { backgroundColor: themedColors.error.light || '#FFCDD2' }
              ]}
              onPress={() => isRecording ? stopRecording() : startRecording()}
              disabled={sending}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic-outline"}
                size={20}
                color={isRecording ? themedColors.error.main : themedColors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <LinearGradient
                colors={
                  (!inputText.trim() || sending) ? ['#E0E0E0', '#BDBDBD'] :
                    (themedColors?.gradients?.primary || ['#7C4DFF', '#3F1DCB'])
                }
                style={{ borderRadius: 24, flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
              >
                <Ionicons name="send" size={20} color="#FFF" />
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Zoom Modal */}
      <ZoomableImageModal
        visible={zoomVisible}
        imageUrl={zoomImage}
        onClose={() => setZoomVisible(false)}
      />
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
    minWidth: 0,
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
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    flexShrink: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    flexShrink: 1,
  },
  creditsContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 10,
    flexShrink: 0,
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  assistantMessageRow: {
    width: '100%',
    marginBottom: 16,
  },
  userMessageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
    minWidth: 0,
  },
  assistantMessageFullWidth: {
    width: '100%',
    paddingHorizontal: 16,
    minWidth: 0,
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
  userMessageGradient: {
    padding: 12,
    paddingHorizontal: 16,
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    flexShrink: 1,
  },
  markdownContainer: {
    padding: 0,
    paddingVertical: 12,
  },
  interactionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  interactionButton: {
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: Colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    padding: 12,
    paddingBottom: 24, // Base padding, will be overridden with safe area insets
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
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  textInputInline: {
    flex: 1,
    fontSize: 16,
    maxHeight: 80,
    paddingVertical: 6,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
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
    minHeight: 40,
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
  graphContainer: {
    marginTop: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  graphImage: {
    width: '100%',
    maxWidth: 340,
    height: 180,
    borderRadius: 4,
  },
  graphCaption: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  modeToggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(103,80,164,0.4)',
    backgroundColor: 'rgba(103,80,164,0.1)',
  },
  modeMenuPopup: {
    position: 'absolute',
    bottom: 75,
    left: 12,
    right: 12,
    borderRadius: 16,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    zIndex: 100,
  },
  modeMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
  },
  modeMenuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeMenuTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  modeMenuHeader: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  modeMenuItemActive: {
    backgroundColor: 'rgba(103,80,164,0.1)',
  },
  modeMenuText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  modeMenuDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    marginRight: 8,
  },
  modeChipText: {
    fontSize: 12,
    fontWeight: '600' as const,
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
    borderWidth: 1.5,
    borderColor: 'rgba(103,80,164,0.4)',
    backgroundColor: 'rgba(103,80,164,0.1)',
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
  modeMenuPopup: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    maxWidth: 320,
    borderRadius: 20,
    padding: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    borderWidth: 1,
    zIndex: 100,
  },
  modeMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 12,
  },
  modeMenuItemActive: {
    backgroundColor: 'rgba(103,80,164,0.1)',
  },
  modeMenuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
  modeMenuDesc: {
    fontSize: 12,
    color: '#999',
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    marginRight: 8,
  },
  modeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TeacherModeScreen;
