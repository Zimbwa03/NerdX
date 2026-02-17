// Project Assistant Screen - Professional Chat Interface with Deep Research
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  Modal,
  Keyboard,
  Clipboard,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import { projectApi, ProjectDetails, ResearchSession, ResearchStatus } from '../services/api/projectApi';
import { mathApi } from '../services/api/mathApi';
import { attachmentsApi } from '../services/api/attachmentsApi';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';
import { LoadingProgress } from '../components/LoadingProgress';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatCreditBalance } from '../utils/creditCalculator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image_url?: string; // User or assistant images
  image_urls?: string[]; // Multi-image user messages
  context_pack_id?: string;
}

// Compact inline loading progress for chat messages
const InlineLoadingProgress: React.FC<{
  steps: Array<{ emoji: string; label: string }>;
  message: string;
  isDarkMode: boolean;
  themedColors: any;
}> = ({ steps, message, isDarkMode, themedColors }) => {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const [ellipsis, setEllipsis] = React.useState('');
  const ellipsisIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const stepIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const finalStepIndex = Math.max(steps.length - 1, 0);
  const runningMaxIndex = Math.max(finalStepIndex - 1, 0);

  React.useEffect(() => {
    setActiveStepIndex(0);
    setEllipsis('');

    // Calculate step interval (shorter for compact display)
    const totalSteps = Math.max(runningMaxIndex + 1, 1);
    const stepIntervalMs = Math.max(600, Math.floor(8000 / totalSteps));

    stepIntervalRef.current = setInterval(() => {
      setActiveStepIndex((prev) => {
        const next = Math.min(prev + 1, runningMaxIndex);
        return next;
      });
    }, stepIntervalMs);

    ellipsisIntervalRef.current = setInterval(() => {
      setEllipsis((prev) => (prev.length >= 3 ? '' : `${prev}.`));
    }, 450);

    return () => {
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
      }
      if (ellipsisIntervalRef.current) {
        clearInterval(ellipsisIntervalRef.current);
      }
    };
  }, [steps, runningMaxIndex]);

  return (
    <View style={styles.inlineLoadingContainer}>
      <View style={[
        styles.inlineLoadingBubble,
        {
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#F0F0F0',
        }
      ]}>
        <Text style={[styles.inlineLoadingMessage, { color: themedColors.text.secondary }]}>
          {message}
          {ellipsis}
        </Text>
        <View style={styles.inlineStepsContainer}>
          {steps.slice(0, finalStepIndex + 1).map((step, index) => {
            const isActive = index === activeStepIndex;
            const isComplete = index < activeStepIndex;
            const isFinal = index === finalStepIndex;
            
            return (
              <View key={`inline-${step.label}-${index}`} style={styles.inlineStepRow}>
                <View
                  style={[
                    styles.inlineStepIndicator,
                    {
                      backgroundColor: isComplete
                        ? '#22C55E'
                        : isActive
                        ? themedColors.primary.main
                        : isDarkMode
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.08)',
                      borderColor: isComplete
                        ? '#86EFAC'
                        : isActive
                        ? themedColors.primary.light
                        : isDarkMode
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'rgba(0, 0, 0, 0.1)',
                    },
                  ]}
                >
                  <Text style={styles.inlineStepIndicatorText}>
                    {isComplete ? '✓' : index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.inlineStepText,
                    {
                      color: isActive
                        ? themedColors.text.primary
                        : themedColors.text.secondary,
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {step.emoji} {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const ProjectAssistantScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const insets = useSafeAreaInsets();
  const params = route.params as {
    projectId: number;
    projectTitle: string;
    subject: string;
  };

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  // Keep a "latest value" ref to avoid edge-cases where the last keystrokes
  // haven't flushed to state before Send is tapped (common on some Android keyboards).
  const latestInputTextRef = useRef<string>('');
  const [selectedImages, setSelectedImages] = useState<Array<{ uri: string; name?: string; mimeType?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [activeResearch, setActiveResearch] = useState<ResearchSession | null>(null);
  const [researchPolling, setResearchPolling] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'image_generation'>('chat');
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [imageGenerationMode, setImageGenerationMode] = useState(false);
  const [lastGeneratedImageUrl, setLastGeneratedImageUrl] = useState<string | null>(null);
  const [lastImagePrompt, setLastImagePrompt] = useState<string>('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('1:1');
  const [showAspectRatioModal, setShowAspectRatioModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Loading step definitions for different operations
  const chatThinkingSteps = [
    { emoji: '🧠', label: 'Understanding your request' },
    { emoji: '📚', label: 'Reviewing project context' },
    { emoji: '✍️', label: 'Crafting response' },
    { emoji: '🔍', label: 'Refining answer' },
    { emoji: '✅', label: 'Complete' },
  ];

  const imageGenerationSteps = [
    { emoji: '🎨', label: 'Enhancing your description' },
    { emoji: '✨', label: 'Crafting design prompt' },
    { emoji: '🖼️', label: 'Generating image' },
    { emoji: '🎯', label: 'Optimizing quality' },
    { emoji: '✅', label: 'Complete' },
  ];

  const documentGenerationSteps = [
    { emoji: '📄', label: 'Compiling sections' },
    { emoji: '🤖', label: 'Generating AI content' },
    { emoji: '📋', label: 'Formatting document' },
    { emoji: '🔍', label: 'Finalizing layout' },
    { emoji: '✅', label: 'Complete' },
  ];

  const researchSteps = [
    { emoji: '🔬', label: 'Analyzing topic' },
    { emoji: '🌐', label: 'Gathering sources' },
    { emoji: '📊', label: 'Processing data' },
    { emoji: '📝', label: 'Synthesizing findings' },
    { emoji: '✅', label: 'Complete' },
  ];

  const documentAnalysisSteps = [
    { emoji: '📄', label: 'Reading document' },
    { emoji: '🔍', label: 'Extracting content' },
    { emoji: '🧠', label: 'Analyzing structure' },
    { emoji: '📊', label: 'Summarizing key points' },
    { emoji: '✅', label: 'Complete' },
  ];

  const initialLoadingSteps = [
    { emoji: '📂', label: 'Loading project' },
    { emoji: '💬', label: 'Fetching chat history' },
    { emoji: '⚙️', label: 'Preparing interface' },
    { emoji: '✅', label: 'Ready' },
  ];

  useEffect(() => {
    initializeProject();

    // Keyboard listeners for Android
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const initializeProject = async () => {
    try {
      setLoading(true);

      // Check if user has sufficient credits before loading project
      const userCredits = formatCreditBalance(user?.credits);
      const requiredCredits = 1; // 1 credit per AI response
      
      if (userCredits < requiredCredits) {
        Alert.alert(
          'Insufficient Credits',
          `Project Assistant requires at least ${requiredCredits} credit to use. You currently have ${userCredits} credit${userCredits === 1 ? '' : 's'}.\n\nPlease purchase more credits to continue.`,
          [
            { text: 'OK', onPress: () => navigation.goBack() },
            {
              text: 'Buy Credits',
              onPress: () => {
                navigation.goBack();
                setTimeout(() => navigation.navigate('Credits' as never), 100);
              },
            },
          ]
        );
        setLoading(false);
        return;
      }

      // Get full project details
      const projectDetails = await projectApi.getProject(params.projectId);
      if (projectDetails) {
        setProject(projectDetails);

        // Load chat history
        const history = await projectApi.getChatHistory(params.projectId);
        if (history && history.length > 0) {
          const loadedMessages: Message[] = history.map((msg, index) => ({
            id: msg.id?.toString() || index.toString(),
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            image_url: (msg as any).image_url,
          }));
          setMessages(loadedMessages);
        } else {
          // Initial welcome message
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: `👋 Hi! I'm your AI Research Assistant for "${projectDetails.title}".\n\nI can help you with research, writing, ideas, and guidance for your ${projectDetails.subject} project.\n\nWhat would you like to work on today?`,
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load project details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const rawText = (latestInputTextRef.current ?? inputText) as string;
    const query = rawText.trim();
    const hasImages = selectedImages.length > 0;
    if ((!query && !hasImages) || !project || sending) return;

    // Check if user has sufficient credits before sending message
    const userCredits = formatCreditBalance(user?.credits);
    const requiredCredits = 1; // 1 credit per AI response
    
    if (userCredits < requiredCredits) {
      Alert.alert(
        'Insufficient Credits',
        `You need at least ${requiredCredits} credit to send a message. You currently have ${userCredits} credit${userCredits === 1 ? '' : 's'}.\n\nPlease purchase more credits to continue.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy Credits',
            onPress: () => navigation.navigate('Credits' as never),
          },
        ]
      );
      return;
    }
    
    // Check if image generation mode is active OR if the message implies image generation
    const isImageRequest = imageGenerationMode || (() => {
      const q = query.toLowerCase();
      const wantsGenerate = ['generate', 'create', 'make', 'design', 'draw'].some(k => q.includes(k));
      const mentionsVisual = ['image', 'flyer', 'poster', 'infographic', 'banner', 'logo', 'cover'].some(k => q.includes(k));
      return wantsGenerate && mentionsVisual;
    })();
    
    // Save prompt for potential regeneration
    if (isImageRequest) {
      setLastImagePrompt(query);
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
    setSending(true);

    try {
      let response: any = null;

      let contextPackId: string | undefined;
      if (hasImages) {
        const pack = await attachmentsApi.analyzeImages({
          images: selectedImages,
          prompt: query,
          chatId: `project:${project.id}`,
        });
        contextPackId = pack?.id;
      }

      // No need for progress message - LoadingProgress overlay will handle it

      // Use dedicated image generation endpoint when in explicit image mode
      if (imageGenerationMode && isImageRequest) {
        // Call the dedicated image generation endpoint with aspect ratio
        const imageResponse = await projectApi.generateImage(project.id, query, selectedAspectRatio);
        if (imageResponse) {
          response = imageResponse;
        }
        // Exit image generation mode after generating
        setImageGenerationMode(false);
      } else {
        // Regular chat with AI
        const chatResponse = await projectApi.sendMessage(project.id, query, contextPackId);
        if (chatResponse) {
          response = chatResponse;
        }
      }

      if (response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
          image_url: response.image_url,
          context_pack_id: response.context_pack_id || contextPackId,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Store last generated image URL and prompt for regeneration/download
        if (response.image_url) {
          setLastGeneratedImageUrl(response.image_url);
          setLastImagePrompt(query); // Store the prompt for regeneration
        }

        // Update credits if returned (backend manages batch deduction)
        if (response.credits_remaining !== undefined) {
          updateUser({ credits: response.credits_remaining });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to send message');
      // Remove failed message
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  };

  const handleGenerateDocument = async () => {
    if (!project) return;

    Alert.alert(
      'Generate PDF Document',
      'This will generate your complete project document as a PDF. Credits will be deducted by the system. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate & Download',
          onPress: async () => {
            try {
              setSending(true);

              const filePath = await projectApi.generateDocument(project.id);

              if (filePath) {
                Alert.alert(
                  '✅ PDF Generated!',
                  'Your project document has been generated and is ready to download/share.',
                  [{ text: 'OK' }]
                );
                // Credits are deducted by backend - refresh credit balance
                if (user) {
                  // Backend handles credit deduction, just refresh the balance
                  // The backend will return updated credits in response if available
                }
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to generate document. Please try again.');
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  };

  // ==================== Deep Research Handlers ====================

  const handleStartResearch = async () => {
    if (!project) return;

    Alert.prompt(
      '🔬 Deep Research',
      'Enter a research topic for your project (this uses AI to do comprehensive internet research):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Research',
          onPress: async (query) => {
            if (!query?.trim()) {
              Alert.alert('Error', 'Please enter a research topic');
              return;
            }

            try {
              setSending(true);
              setMessages((prev) => [...prev, {
                id: 'research-start',
                role: 'assistant',
                content: `🔬 **Starting Deep Research**\n\nTopic: "${query}"\n\nThis may take a few minutes as I analyze multiple sources...`,
                timestamp: new Date(),
              }]);

              const session = await projectApi.startResearch(project.id, query);

              if (session?.interaction_id) {
                setActiveResearch(session);
                pollResearchStatus(session.interaction_id);
              }
            } catch (error: any) {
              setResearchPolling(false);
              Alert.alert('Error', error.message || 'Failed to start research');
            } finally {
              setSending(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const pollResearchStatus = async (interactionId: string) => {
    if (!project) return;

    try {
      const status = await projectApi.checkResearchStatus(project.id, interactionId);

      if (status?.status === 'completed' && status.result) {
        // Research completed - add result to chat
        setMessages((prev) => [...prev, {
          id: `research-${Date.now()}`,
          role: 'assistant',
          content: `📊 **Research Complete**\n\n${status.result}`,
          timestamp: new Date(),
        }]);
        setActiveResearch(null);
        setResearchPolling(false);
      } else if (status?.status === 'failed') {
        Alert.alert('Research Failed', status.message || 'Unable to complete research');
        setActiveResearch(null);
        setResearchPolling(false);
      } else {
        // Still in progress - poll again after 5 seconds
        setTimeout(() => pollResearchStatus(interactionId), 5000);
      }
    } catch (error) {
      console.error('Research polling error:', error);
      setResearchPolling(false);
    }
  };

  const handleWebSearch = async () => {
    if (!project) return;

    Alert.prompt(
      '🌐 Web Search',
      'Enter a search query with Google-grounded factual results:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Search',
          onPress: async (query) => {
            if (!query?.trim()) return;

            try {
              setSending(true);
              const result = await projectApi.searchWeb(project.id, query);

              if (result?.response) {
                setMessages((prev) => [...prev, {
                  id: `search-${Date.now()}`,
                  role: 'assistant',
                  content: `🌐 **Search Results**\n\nQuery: "${query}"\n\n${result.response}`,
                  timestamp: new Date(),
                }]);
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

  // Download Submission Pack
  const handleDownloadSubmissionPack = async () => {
    if (!project) return;

    try {
      setSending(true);
      
      // Show generating message
      Alert.alert(
        '📥 Generating Submission Pack',
        'Creating your ZIMSEC project document. This may take a moment...',
        [{ text: 'OK' }]
      );

      const fileUri = await projectApi.downloadSubmissionPack(project.id);
      
      if (fileUri) {
        Alert.alert(
          '✅ Submission Pack Ready',
          'Your ZIMSEC project document has been generated and is ready for download.',
          [{ text: 'Great!' }]
        );
      } else {
        throw new Error('Failed to generate submission pack');
      }
    } catch (error: any) {
      console.error('Download submission pack error:', error);
      Alert.alert(
        '❌ Download Failed',
        error.message || 'Failed to generate submission pack. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSending(false);
    }
  };

  // View Submission Checklist
  const handleViewChecklist = async () => {
    if (!project) return;

    try {
      const checklist = await projectApi.getSubmissionChecklist(project.id);
      
      if (checklist) {
        const completionText = `Overall Completion: ${checklist.overall_completion}%\n\n` +
          `📄 Sections: ${Object.values(checklist.stages).reduce((acc, s) => acc + s.completed, 0)} completed\n` +
          `📷 Evidence: ${checklist.evidence_count} items\n` +
          `📚 References: ${checklist.references_count} citations\n` +
          `📓 Logbook: ${checklist.logbook_entries_count} entries`;
        
        Alert.alert(
          '📋 Submission Checklist',
          completionText,
          [
            { text: 'Download Pack', onPress: handleDownloadSubmissionPack },
            { text: 'Close' }
          ]
        );
      }
    } catch (error: any) {
      console.error('Get checklist error:', error);
      Alert.alert('Error', 'Failed to load checklist');
    }
  };

  const handleDocumentUpload = async () => {
    if (!project) return;

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

      const analysis = await projectApi.analyzeDocument(
        project.id,
        base64,
        file.mimeType || 'application/pdf'
      );

      if (analysis?.analysis) {
        setMessages((prev) => [...prev, {
          id: `doc-${Date.now()}`,
          role: 'assistant',
          content: `📄 **Document Analysis**\n\n**File:** ${file.name}\n\n${analysis.analysis}`,
          timestamp: new Date(),
        }]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to analyze document');
    } finally {
      setSending(false);
    }
  };

  // ==================== Image Scan Handler ====================
  const handleAttachImages = async () => {
    if (!project) return;

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to attach images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, 10 - selectedImages.length),
      });

      if (result.canceled || !result.assets?.length) return;

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
      setActiveMode('chat');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pick images');
    }
  };

  // ==================== Voice Recording Handler ====================
  // Using the exact same implementation as Teacher Mode
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
        { shouldPlay: true }
      );

      setSound(newSound);

      // Wait for playback to finish
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error: any) {
      showError('Unable to play audio');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
        <LoadingProgress
          visible={loading}
          message="Loading your project..."
          estimatedTime={3}
          stage="Initializing"
          steps={initialLoadingSteps}
        />
      </View>
    );
  }

  // Determine loading config for inline chat message
  const getLoadingConfig = () => {
    // Priority: Research > Image Generation > Regular Chat
    if (researchPolling) {
      return {
        steps: researchSteps,
        message: "DeepSeek is conducting deep research...",
      };
    }
    if (sending && imageGenerationMode) {
      return {
        steps: imageGenerationSteps,
        message: "Generating your professional educational image...",
      };
    }
    if (sending) {
      return {
        steps: chatThinkingSteps,
        message: "AI is thinking and crafting your response...",
      };
    }
    return null;
  };

  const loadingConfig = getLoadingConfig();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themedColors.background.default }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={themedColors.background.default} />
      <LinearGradient
        colors={themedColors.gradients.primary}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {project?.title || params.projectTitle}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1} ellipsizeMode="tail">
              {project?.subject || params.subject}
            </Text>
          </View>
          <TouchableOpacity style={styles.docButton} onPress={handleGenerateDocument}>
            <Ionicons name="document-text-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        ref={scrollViewRef}
        style={[styles.messagesContainer, { backgroundColor: themedColors.background.default }]}
        contentContainerStyle={styles.messagesContent}
      >
        <View style={styles.disclaimerContainer}>
          <Text style={[styles.disclaimerText, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#EFEFEF', color: themedColors.text.secondary }]}>
            AI can make mistakes. Please verify important information.
          </Text>
        </View>

        {messages.map((message, index) => (
          message.role === 'user' ? (
            // User Message - Bubble on Right (ChatGPT style)
            <View key={message.id} style={styles.userMessageRow}>
              <View style={styles.userMessageBubble}>
                <LinearGradient
                  colors={themedColors.gradients.primary}
                  style={styles.userBubbleGradient}
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
                  ) : null}
                  <Text style={styles.userMessageText}>{message.content}</Text>
                </LinearGradient>
              </View>
            </View>
          ) : (
            // Assistant Message - Full Width, Structured (ChatGPT style)
            <View key={message.id} style={styles.assistantMessageRow}>
              <View style={styles.assistantMessageFullWidth}>
                <View style={styles.assistantContentContainer}>
                  <Text style={[styles.assistantMessageText, { color: themedColors.text.primary }]}>{message.content}</Text>
                </View>

                {/* Assistant-generated (or user) image */}
                {message.image_url && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: message.image_url }}
                      style={styles.messageImage}
                      resizeMode="contain"
                    />
                    {/* Image Action Buttons */}
                    <View style={styles.imageActionButtons}>
                      <TouchableOpacity
                        style={[styles.imageActionButton, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)' }]}
                        onPress={async () => {
                          try {
                            // Download image
                            const downloadUri = FileSystem.documentDirectory + `nerdx_image_${Date.now()}.png`;
                            await FileSystem.downloadAsync(message.image_url!, downloadUri);
                            await Sharing.shareAsync(downloadUri);
                            showSuccess('Image ready to save');
                          } catch (error) {
                            showError('Failed to download image');
                          }
                        }}
                      >
                        <Ionicons name="download-outline" size={16} color="#10B981" />
                        <Text style={[styles.imageActionText, { color: '#10B981' }]}>Download</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.imageActionButton, { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)' }]}
                        onPress={() => {
                          // Regenerate with same prompt and aspect ratio
                          if (lastImagePrompt) {
                            setInputText(lastImagePrompt);
                            latestInputTextRef.current = lastImagePrompt;
                            setImageGenerationMode(true);
                            showInfo('Tap send to regenerate');
                          } else {
                            showWarning('No previous prompt to regenerate');
                          }
                        }}
                      >
                        <Ionicons name="refresh-outline" size={16} color={themedColors.primary.main} />
                        <Text style={[styles.imageActionText, { color: themedColors.primary.main }]}>Regenerate</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.imageActionButton, { backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' }]}
                        onPress={() => {
                          // Edit prompt
                          if (lastImagePrompt) {
                            setInputText(lastImagePrompt);
                            latestInputTextRef.current = lastImagePrompt;
                            setImageGenerationMode(true);
                            showInfo('Edit the prompt and send');
                          } else {
                            setImageGenerationMode(true);
                            showInfo('Enter a new image description');
                          }
                        }}
                      >
                        <Ionicons name="create-outline" size={16} color="#3B82F6" />
                        <Text style={[styles.imageActionText, { color: '#3B82F6' }]}>Edit Prompt</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.imageActionButton, { backgroundColor: isDarkMode ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.1)' }]}
                        onPress={() => {
                          // Show aspect ratio selection modal
                          setShowAspectRatioModal(true);
                        }}
                      >
                        <Ionicons name="resize-outline" size={16} color="#FB923C" />
                        <Text style={[styles.imageActionText, { color: '#FB923C' }]}>Aspect {selectedAspectRatio}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                
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
        ))}

        {/* Inline Loading Progress - Shows stages in chat */}
        {sending && loadingConfig && (
          <InlineLoadingProgress
            steps={loadingConfig.steps}
            message={loadingConfig.message}
            isDarkMode={isDarkMode}
            themedColors={themedColors}
          />
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { 
        backgroundColor: themedColors.background.paper, 
        borderTopColor: themedColors.border.light,
        paddingBottom: Math.max(16, insets.bottom + 12) // Ensure minimum 16px + safe area
      }]}>
        {/* Image Generation Mode Indicator */}
        {imageGenerationMode && (
          <View style={styles.imageModeIndicator}>
            <Ionicons name="sparkles" size={14} color="#10B981" />
            <Text style={styles.imageModeIndicatorText}>Image Generation Mode (💎 2 credits) • Ratio: {selectedAspectRatio}</Text>
            <TouchableOpacity onPress={() => setImageGenerationMode(false)}>
              <Ionicons name="close-circle" size={18} color="#10B981" />
            </TouchableOpacity>
          </View>
        )}

        {/* Selected images preview (ChatGPT-style, above the input) */}
        {selectedImages.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
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
              onPress={() => { setShowModeMenu(false); handleDocumentUpload(); }}
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
              onPress={() => { setShowModeMenu(false); handleAttachImages(); }}
            >
              <View style={[styles.modeMenuIcon, { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)' }]}>
                <Ionicons name="image-outline" size={22} color={themedColors.primary.main} />
              </View>
              <View style={styles.modeMenuTextContainer}>
                <Text style={[styles.modeMenuText, { color: isDarkMode ? '#B794F6' : '#7C3AED' }]}>Attach Images</Text>
                <Text style={[styles.modeMenuDesc, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#888' }]}>Attach up to 10 images</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeMenuItem,
                { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)' }
              ]}
              onPress={() => { 
                setShowModeMenu(false); 
                setImageGenerationMode(true);
                showInfo('Image Generation Mode activated. Describe the image you want to create.');
              }}
            >
              <View style={[styles.modeMenuIcon, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="sparkles" size={22} color="#10B981" />
              </View>
              <View style={styles.modeMenuTextContainer}>
                <Text style={[styles.modeMenuText, { color: isDarkMode ? '#6EE7B7' : '#059669' }]}>Generate Image</Text>
                <Text style={[styles.modeMenuDesc, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#888' }]}>Create posters, flyers, diagrams with AI (💎 2 credits per image)</Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', marginVertical: 8 }} />

            {/* Submission Pack Section */}
            <Text style={[
              styles.modeMenuHeader,
              { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#666', marginTop: 4 }
            ]}>Export</Text>

            <TouchableOpacity
              style={[
                styles.modeMenuItem,
                { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)' }
              ]}
              onPress={() => { setShowModeMenu(false); handleViewChecklist(); }}
            >
              <View style={[styles.modeMenuIcon, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="checkmark-done-outline" size={22} color="#10B981" />
              </View>
              <View style={styles.modeMenuTextContainer}>
                <Text style={[styles.modeMenuText, { color: isDarkMode ? '#6EE7B7' : '#059669' }]}>Submission Checklist</Text>
                <Text style={[styles.modeMenuDesc, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#888' }]}>View project completion status</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeMenuItem,
                { backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.08)' }
              ]}
              onPress={() => { setShowModeMenu(false); handleDownloadSubmissionPack(); }}
            >
              <View style={[styles.modeMenuIcon, { backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.15)' }]}>
                <Ionicons name="download-outline" size={22} color="#F59E0B" />
              </View>
              <View style={styles.modeMenuTextContainer}>
                <Text style={[styles.modeMenuText, { color: isDarkMode ? '#FCD34D' : '#D97706' }]}>Download Submission Pack</Text>
                <Text style={[styles.modeMenuDesc, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#888' }]}>Generate PDF for ZIMSEC submission</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={[
          styles.inputWrapper, 
          { 
            backgroundColor: imageGenerationMode 
              ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)') 
              : (isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA'),
            borderWidth: imageGenerationMode ? 1.5 : 0,
            borderColor: imageGenerationMode ? '#10B981' : 'transparent',
          }
        ]}>
          {/* Generate Image Button (left side) */}
          <TouchableOpacity
            style={[
              styles.imageGenButton,
              imageGenerationMode && styles.imageGenButtonActive
            ]}
            onPress={() => {
              setImageGenerationMode(!imageGenerationMode);
              if (!imageGenerationMode) {
                showInfo(`Image Generation Mode activated (Ratio: ${selectedAspectRatio})`);
              }
            }}
          >
            <Ionicons 
              name="sparkles" 
              size={20} 
              color={imageGenerationMode ? '#10B981' : themedColors.text.secondary} 
            />
          </TouchableOpacity>

          {/* Add Media Button (+ icon) */}
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => setShowModeMenu(!showModeMenu)}
          >
            <Ionicons name="add" size={24} color={themedColors.primary.main} />
          </TouchableOpacity>

          <TextInput
            style={[styles.textInput, { color: themedColors.text.primary }]}
            value={inputText}
            onChangeText={(text) => {
              latestInputTextRef.current = text;
              setInputText(text);
            }}
            placeholder={imageGenerationMode 
              ? "Describe the image you want to generate..." 
              : "Ask for help with your project..."}
            placeholderTextColor={imageGenerationMode ? '#10B981' : themedColors.text.secondary}
            multiline
            maxLength={1000}
            editable={!sending && !researchPolling && !isRecording}
          />

          {/* Inline Mic Button */}
          <TouchableOpacity
            style={[
              styles.micButton,
              isRecording && { backgroundColor: themedColors.error?.light || '#FFCDD2' }
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

          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            <LinearGradient
              colors={(!inputText.trim() || sending) ? ['#E0E0E0', '#BDBDBD'] : themedColors.gradients.primary}
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={[styles.creditsText, { color: themedColors.text.secondary }]}>
          Credits: {user?.credits || 0}
        </Text>
      </View>

      {/* Aspect Ratio Selection Modal */}
      <Modal
        visible={showAspectRatioModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAspectRatioModal(false)}
      >
        <View style={styles.aspectRatioModalOverlay}>
          <View style={[styles.aspectRatioModal, { backgroundColor: themedColors.background.paper }]}>
            <View style={styles.aspectRatioModalHeader}>
              <Text style={[styles.aspectRatioModalTitle, { color: themedColors.text.primary }]}>
                Select Aspect Ratio
              </Text>
              <TouchableOpacity onPress={() => setShowAspectRatioModal(false)}>
                <Ionicons name="close" size={24} color={themedColors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.aspectRatioOptions}>
              {[
                { ratio: '16:9', label: '16:9 (Landscape)', icon: '📺', description: 'Widescreen, perfect for posters and presentations' },
                { ratio: '9:16', label: '9:16 (Portrait)', icon: '📱', description: 'Vertical, ideal for social media stories' },
                { ratio: '1:1', label: '1:1 (Square)', icon: '⬜', description: 'Square format, great for social media posts' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.ratio}
                  style={[
                    styles.aspectRatioOption,
                    {
                      backgroundColor: selectedAspectRatio === option.ratio
                        ? themedColors.primary.main
                        : themedColors.background.subtle,
                      borderColor: selectedAspectRatio === option.ratio
                        ? themedColors.primary.main
                        : themedColors.border.main,
                    }
                  ]}
                  onPress={() => {
                    setSelectedAspectRatio(option.ratio);
                    setShowAspectRatioModal(false);
                    if (imageGenerationMode && inputText.trim()) {
                      showInfo(`Aspect ratio set to ${option.ratio}. Send to generate with new ratio.`);
                    }
                  }}
                >
                  <Text style={styles.aspectRatioIcon}>{option.icon}</Text>
                  <View style={styles.aspectRatioOptionText}>
                    <Text style={[
                      styles.aspectRatioOptionLabel,
                      { color: selectedAspectRatio === option.ratio ? '#FFF' : themedColors.text.primary }
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.aspectRatioOptionDesc,
                      { color: selectedAspectRatio === option.ratio ? 'rgba(255,255,255,0.8)' : themedColors.text.secondary }
                    ]}>
                      {option.description}
                    </Text>
                  </View>
                  {selectedAspectRatio === option.ratio && (
                    <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    flexShrink: 1,
    textAlign: 'center',
  },
  docButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    flexShrink: 0,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 20,
    paddingBottom: 10,
  },
  disclaimerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#9E9E9E',
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  assistantMessageWrapper: {
    justifyContent: 'flex-start',
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  userMessageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
    minWidth: 0,
  },
  assistantMessageRow: {
    width: '100%',
    marginBottom: 16,
  },
  assistantMessageFullWidth: {
    width: '100%',
    paddingHorizontal: 0,
  },
  assistantContentContainer: {
    paddingVertical: 12,
  },
  imageContainer: {
    paddingHorizontal: 0,
    paddingBottom: 12,
  },
  messageImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  avatarContainer: {
    marginRight: 8,
    marginBottom: 4,
  },
  avatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  userBubbleGradient: {
    padding: 12,
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    flexShrink: 1,
  },
  assistantMessageText: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 22,
    flexShrink: 1,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  assistantTimestamp: {
    color: '#9E9E9E',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F7FA',
    borderRadius: 24,
    padding: 4,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditsText: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 8,
  },
  toolbarContainer: {
    maxHeight: 0,
    height: 0,
    display: 'none', // Hide old toolbar
  },
  modeButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeMenuPopup: {
    position: 'absolute',
    bottom: 85,
    left: 16,
    right: 16,
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  modeMenuHeader: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
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
  modeMenuItemActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  modeMenuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  modeMenuDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  // Inline Loading Progress Styles
  inlineLoadingContainer: {
    marginBottom: 16,
    width: '100%',
  },
  inlineLoadingBubble: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    maxWidth: '85%',
  },
  inlineLoadingMessage: {
    fontSize: 13,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  inlineStepsContainer: {
    gap: 8,
  },
  inlineStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inlineStepIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  inlineStepIndicatorText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  inlineStepText: {
    fontSize: 12,
    flex: 1,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  toolbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  toolbarButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  // Image Generation Mode Styles
  imageModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
    gap: 8,
  },
  imageModeIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    flex: 1,
  },
  imageGenButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  imageGenButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  imageActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
    flexWrap: 'wrap',
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  imageActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  aspectRatioModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aspectRatioModal: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  aspectRatioModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  aspectRatioModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  aspectRatioOptions: {
    gap: 12,
  },
  aspectRatioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  aspectRatioIcon: {
    fontSize: 28,
  },
  aspectRatioOptionText: {
    flex: 1,
  },
  aspectRatioOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  aspectRatioOptionDesc: {
    fontSize: 12,
  },
});

export default ProjectAssistantScreen;
