// Offline Chat Screen - Free Limited Offline AI Assistant
// Similar to Teacher Mode but uses offline model for basic questions
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
import { useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { useNotification } from '../context/NotificationContext';
import { Colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import OfflineAIService from '../services/OfflineAIService';
import ModelDownloadService from '../services/ModelDownloadService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const OfflineChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const latestInputTextRef = useRef<string>('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [modelDownloaded, setModelDownloaded] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    checkModelStatus();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const checkModelStatus = async () => {
    try {
      setLoading(true);
      
      // Check if model is downloaded
      const isDownloaded = await ModelDownloadService.isModelDownloaded();
      setModelDownloaded(isDownloaded);

      if (!isDownloaded) {
        setLoading(false);
        return;
      }

      // Check if model is ready
      const status = await OfflineAIService.getModelStatus();
      if (status.isReady) {
        setModelReady(true);
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: `👋 **Welcome to Offline Chat!**\n\nI'm your free offline AI assistant. I can help you with:\n\n• 📚 Basic homework questions\n• 💡 Simple explanations\n• 🔢 Math problem solving\n• 📖 Study help\n\n**Note:** This is a limited free version. For advanced features, try Teacher Mode!\n\nWhat would you like to ask?`,
            timestamp: new Date(),
          },
        ]);
      } else if (!status.isLoading) {
        // Try to initialize
        const initialized = await OfflineAIService.initializeModel();
        if (initialized) {
          setModelReady(true);
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: `👋 **Welcome to Offline Chat!**\n\nI'm your free offline AI assistant. I can help you with:\n\n• 📚 Basic homework questions\n• 💡 Simple explanations\n• 🔢 Math problem solving\n• 📖 Study help\n\n**Note:** This is a limited free version. For advanced features, try Teacher Mode!\n\nWhat would you like to ask?`,
              timestamp: new Date(),
            },
          ]);
        } else {
          showError('Failed to initialize offline model. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Error checking model status:', error);
      showError('Failed to check model status');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const rawText = (latestInputTextRef.current ?? inputText) as string;
    const query = rawText.trim();
    
    if (!query || sending || !modelReady) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    latestInputTextRef.current = '';
    setSending(true);

    // Add typing indicator
    const typingId = 'typing-' + Date.now();
    setMessages((prev) => [...prev, {
      id: typingId,
      role: 'assistant',
      content: '...',
      timestamp: new Date(),
    }]);

    try {
      // Generate response using offline model
      const response = await OfflineAIService.generateResponse(query, {
        maxTokens: 256, // Limited for free version
        temperature: 0.7,
      });

      // Remove typing indicator and add response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== typingId);
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response || 'I apologize, but I couldn\'t generate a response. Please try rephrasing your question.',
          timestamp: new Date(),
        }];
      });
    } catch (error: any) {
      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== typingId));
      
      console.error('Error generating response:', error);
      const errorMessage = error.message || 'Failed to generate response. Please try again.';
      showError(errorMessage);
      
      // Add error message
      setMessages((prev) => [...prev, {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: `❌ **Error:** ${errorMessage}\n\nPlease make sure:\n• The model is properly downloaded\n• You have enough storage space\n• Try rephrasing your question`,
        timestamp: new Date(),
      }]);
    } finally {
      setSending(false);
    }
  };

  const quickQuestions = [
    'What is photosynthesis?',
    'Explain Newton\'s First Law',
    'How do I solve quadratic equations?',
    'What is the water cycle?',
    'Explain the periodic table',
    'What is a cell?',
  ];

  const handleQuickAsk = (question: string) => {
    latestInputTextRef.current = question;
    setInputText(question);
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
        <ActivityIndicator size="large" color={themedColors.primary.main} />
        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>
          Checking offline model...
        </Text>
      </View>
    );
  }

  if (!modelDownloaded) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
        <Ionicons name="cloud-download-outline" size={64} color={themedColors.text.secondary} />
        <Text style={[styles.loadingText, { color: themedColors.text.primary, fontSize: 20, fontWeight: 'bold', marginTop: 16 }]}>
          Model Not Downloaded
        </Text>
        <Text style={[styles.loadingText, { color: themedColors.text.secondary, textAlign: 'center', paddingHorizontal: 40, marginTop: 8 }]}>
          You need to download the offline AI model first to use this feature.
        </Text>
        <TouchableOpacity
          style={[styles.downloadButton, { backgroundColor: themedColors.primary.main, marginTop: 24 }]}
          onPress={() => navigation.navigate('ModelDownload' as never)}
        >
          <Ionicons name="download-outline" size={20} color="#FFF" />
          <Text style={styles.downloadButtonText}>Download Model</Text>
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

  if (!modelReady) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
        <ActivityIndicator size="large" color={themedColors.primary.main} />
        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>
          Initializing offline model...
        </Text>
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
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themedColors.background.default }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themedColors.background.default}
      />
      
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary.main, Colors.primary.dark]}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Offline Chat</Text>
              <View style={styles.offlineBadge}>
                <Ionicons name="cloud-offline-outline" size={14} color="#FFF" />
                <Text style={styles.offlineBadgeText}>OFFLINE</Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>Free • Limited • Basic Questions</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContent}
        renderItem={({ item }) => {
          const isUser = item.role === 'user';
          const isTyping = item.content === '...';

          if (isTyping) {
            return (
              <View style={styles.assistantMessageRow}>
                <View style={[styles.assistantMessageBubble, { backgroundColor: themedColors.background.paper }]}>
                  <ActivityIndicator size="small" color={themedColors.primary.main} />
                </View>
              </View>
            );
          }

          return (
            <View style={isUser ? styles.userMessageRow : styles.assistantMessageRow}>
              <View
                style={[
                  isUser ? styles.userMessageBubble : styles.assistantMessageBubble,
                  {
                    backgroundColor: isUser
                      ? themedColors.primary.main
                      : themedColors.background.paper,
                  },
                ]}
              >
                {isUser ? (
                  <Text style={styles.userMessageText}>{item.content}</Text>
                ) : (
                  <Markdown style={markdownStyles}>{item.content}</Markdown>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <View style={[styles.quickQuestionsContainer, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.quickQuestionsTitle, { color: themedColors.text.secondary }]}>
            Quick Questions:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestionsScroll}>
            {quickQuestions.map((q, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickQuestionButton, { backgroundColor: themedColors.primary.light }]}
                onPress={() => handleQuickAsk(q)}
              >
                <Text style={[styles.quickQuestionText, { color: themedColors.primary.main }]}>
                  {q}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: themedColors.background.paper, borderTopColor: themedColors.border.light }]}>
        <TextInput
          style={[styles.input, { color: themedColors.text.primary, backgroundColor: themedColors.background.default }]}
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            latestInputTextRef.current = text;
          }}
          placeholder="Ask a question..."
          placeholderTextColor={themedColors.text.secondary}
          multiline
          maxLength={500}
          editable={!sending && modelReady}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: sending || !modelReady ? themedColors.border.light : themedColors.primary.main },
          ]}
          onPress={handleSend}
          disabled={sending || !modelReady || !inputText.trim()}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name="send" size={20} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  offlineBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  assistantMessageRow: {
    width: '100%',
    marginBottom: 16,
  },
  userMessageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: 12,
    borderBottomRightRadius: 4,
  },
  assistantMessageBubble: {
    maxWidth: '85%',
    borderRadius: 20,
    padding: 12,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  quickQuestionsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  quickQuestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  quickQuestionsScroll: {
    flexDirection: 'row',
  },
  quickQuestionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  quickQuestionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OfflineChatScreen;
