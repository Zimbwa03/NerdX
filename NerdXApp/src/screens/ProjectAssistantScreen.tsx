// Project Assistant Screen - Professional Chat Interface with Deep Research
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { projectApi, ProjectDetails, ResearchSession, ResearchStatus } from '../services/api/projectApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ProjectAssistantScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const params = route.params as {
    projectId: number;
    projectTitle: string;
    subject: string;
  };

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [activeResearch, setActiveResearch] = useState<ResearchSession | null>(null);
  const [researchPolling, setResearchPolling] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'web_search' | 'deep_research'>('chat');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeProject();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const initializeProject = async () => {
    try {
      setLoading(true);

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
    if (!inputText.trim() || !project || sending) return;

    const query = inputText.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: activeMode === 'chat' ? query :
        activeMode === 'web_search' ? `🌐 Search: ${query}` :
          `🔬 Research: ${query}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setSending(true);

    try {
      let response: any = null;

      // Route to different API based on active mode
      if (activeMode === 'web_search') {
        // Use Web Search with Google grounding
        const result = await projectApi.searchWeb(project.id, query);
        if (result?.response) {
          response = { response: `🌐 **Search Results**\n\n${result.response}` };
        }
      } else if (activeMode === 'deep_research') {
        // Use Deep Research - show searching indicator
        setMessages((prev) => [...prev, {
          id: 'researching',
          role: 'assistant',
          content: '🔬 **Performing Deep Research...**\n\nThis may take a moment as I analyze multiple sources...',
          timestamp: new Date(),
        }]);

        const session = await projectApi.startResearch(project.id, query);

        if (session?.interaction_id) {
          setActiveResearch(session);
          setResearchPolling(true);
          pollResearchStatus(session.interaction_id);
          // Don't add response here - it will be added when polling completes
          setSending(false);
          return;
        } else {
          setMessages((prev) => prev.filter((msg) => msg.id !== 'researching'));
        }
      } else {
        // Regular chat with AI
        const chatResponse = await projectApi.sendMessage(project.id, query);
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
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update credits if returned
        if (response.credits_remaining !== undefined) {
          updateUser({ credits: response.credits_remaining });
        } else if (user) {
          // Fallback local deduction
          updateUser({ credits: (user.credits || 0) - 1 });
        }
      }
    } catch (error: any) {
      setMessages((prev) => prev.filter((msg) => msg.id !== 'researching'));
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
      'This will generate your complete project document as a PDF (3 credits). Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate & Download',
          onPress: async () => {
            try {
              setLoading(true);

              // Add a loading message
              setMessages((prev) => [...prev, {
                id: 'generating',
                role: 'assistant',
                content: '📄 Generating your project document... This may take a moment as I compile all sections with AI-powered content.',
                timestamp: new Date(),
              }]);

              const filePath = await projectApi.generateDocument(project.id);

              // Remove loading message
              setMessages((prev) => prev.filter((msg) => msg.id !== 'generating'));

              if (filePath) {
                Alert.alert(
                  '✅ PDF Generated!',
                  'Your project document has been generated and is ready to download/share.',
                  [{ text: 'OK' }]
                );
                // Update credits
                if (user) {
                  updateUser({ credits: (user.credits || 0) - 3 });
                }
              }
            } catch (error: any) {
              // Remove loading message
              setMessages((prev) => prev.filter((msg) => msg.id !== 'generating'));
              Alert.alert('Error', error.message || 'Failed to generate document. Please try again.');
            } finally {
              setLoading(false);
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
                setResearchPolling(true);
                pollResearchStatus(session.interaction_id);
              }
            } catch (error: any) {
              setMessages((prev) => prev.filter((msg) => msg.id !== 'research-start'));
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
        setMessages((prev) => prev.filter((msg) => msg.id !== 'research-start'));
        setMessages((prev) => [...prev, {
          id: `research-${Date.now()}`,
          role: 'assistant',
          content: `📊 **Research Complete**\n\n${status.result}`,
          timestamp: new Date(),
        }]);
        setActiveResearch(null);
        setResearchPolling(false);
      } else if (status?.status === 'failed') {
        setMessages((prev) => prev.filter((msg) => msg.id !== 'research-start'));
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

      setMessages((prev) => [...prev, {
        id: 'analyzing',
        role: 'assistant',
        content: `📄 **Analyzing Document**\n\nFile: ${file.name}\n\nProcessing with AI...`,
        timestamp: new Date(),
      }]);

      const analysis = await projectApi.analyzeDocument(
        project.id,
        base64,
        file.mimeType || 'application/pdf'
      );

      setMessages((prev) => prev.filter((msg) => msg.id !== 'analyzing'));

      if (analysis?.analysis) {
        setMessages((prev) => [...prev, {
          id: `doc-${Date.now()}`,
          role: 'assistant',
          content: `📄 **Document Analysis**\n\n**File:** ${file.name}\n\n${analysis.analysis}`,
          timestamp: new Date(),
        }]);
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
        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Loading project...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themedColors.background.default }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
            <Text style={styles.headerSubtitle}>{project?.subject || params.subject}</Text>
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
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
            ]}
          >
            {message.role === 'assistant' && (
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={themedColors.gradients.primary}
                  style={styles.avatarGradient}
                >
                  <Ionicons name="school" size={16} color="#FFF" />
                </LinearGradient>
              </View>
            )}

            <View
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : [styles.assistantBubble, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light }],
                message.role === 'user' ? { borderBottomRightRadius: 4 } : { borderBottomLeftRadius: 4 }
              ]}
            >
              {message.role === 'user' ? (
                <LinearGradient
                  colors={themedColors.gradients.primary}
                  style={styles.userBubbleGradient}
                >
                  <Text style={styles.userMessageText}>{message.content}</Text>
                </LinearGradient>
              ) : (
                <Text style={[styles.assistantMessageText, { color: themedColors.text.primary }]}>{message.content}</Text>
              )}
              <Text style={[
                styles.timestamp,
                message.role === 'user' ? styles.userTimestamp : [styles.assistantTimestamp, { color: themedColors.text.secondary }]
              ]}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}

        {sending && (
          <View style={styles.typingContainer}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={themedColors.gradients.primary}
                style={styles.avatarGradient}
              >
                <Ionicons name="school" size={16} color="#FFF" />
              </LinearGradient>
            </View>
            <View style={[styles.typingBubble, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light }]}>
              <ActivityIndicator size="small" color={themedColors.primary.main} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: themedColors.background.paper, borderTopColor: themedColors.border.light }]}>
        {/* AI Tools Toolbar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.toolbarContainer}
          contentContainerStyle={styles.toolbarContent}
        >
          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: isDarkMode ? 'rgba(103,80,164,0.15)' : '#EDE7F6' }]}
            onPress={handleStartResearch}
            disabled={sending || researchPolling}
          >
            <Ionicons name="flask-outline" size={18} color={themedColors.primary.main} />
            <Text style={[styles.toolbarButtonText, { color: themedColors.primary.main }]}>
              {researchPolling ? 'Researching...' : 'Deep Research'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: isDarkMode ? 'rgba(0,150,136,0.15)' : '#E0F2F1' }]}
            onPress={handleWebSearch}
            disabled={sending}
          >
            <Ionicons name="globe-outline" size={18} color={themedColors.success.main} />
            <Text style={[styles.toolbarButtonText, { color: themedColors.success.main }]}>Web Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: isDarkMode ? 'rgba(33,150,243,0.15)' : '#E3F2FD' }]}
            onPress={handleDocumentUpload}
            disabled={sending}
          >
            <Ionicons name="document-attach-outline" size={18} color="#2196F3" />
            <Text style={[styles.toolbarButtonText, { color: '#2196F3' }]}>Upload PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: isDarkMode ? 'rgba(255,152,0,0.15)' : '#FFF3E0' }]}
            onPress={handleGenerateDocument}
            disabled={sending}
          >
            <Ionicons name="download-outline" size={18} color="#FF9800" />
            <Text style={[styles.toolbarButtonText, { color: '#FF9800' }]}>Generate PDF</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA' }]}>
          <TextInput
            style={[styles.textInput, { color: themedColors.text.primary }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask for help with your project..."
            placeholderTextColor={themedColors.text.secondary}
            multiline
            maxLength={1000}
            editable={!sending}
          />
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
          Credits: {user?.credits || 0} {researchPolling && '• 🔬 Research in progress...'}
        </Text>
      </View>
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
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  docButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
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
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  assistantMessageText: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 22,
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
    maxHeight: 44,
    marginBottom: 12,
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
});

export default ProjectAssistantScreen;
