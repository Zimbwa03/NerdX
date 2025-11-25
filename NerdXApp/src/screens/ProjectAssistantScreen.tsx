// Project Assistant Screen - Professional Chat Interface
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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { projectApi, ProjectDetails } from '../services/api/projectApi';
import { useAuth } from '../context/AuthContext';

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
      const response = await projectApi.sendMessage(project.id, userMessage.content);

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
      Alert.alert('Error', error.response?.data?.message || 'Failed to send message');
      // Remove failed message
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  };

  const handleGenerateDocument = async () => {
    if (!project) return;

    Alert.alert(
      'Generate Document',
      'This will generate your final project document (3 credits). Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            try {
              setLoading(true);
              const documentUrl = await projectApi.generateDocument(project.id);
              if (documentUrl) {
                Alert.alert(
                  'Success',
                  'Project document generated successfully! Check your email.',
                  [{ text: 'OK' }]
                );
                // Update credits
                if (user) {
                  updateUser({ credits: (user.credits || 0) - 3 });
                }
              }
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to generate document');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6A1B9A" />
        <Text style={styles.loadingText}>Loading project...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4A148C', '#7B1FA2']}
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
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
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
                  colors={['#7B1FA2', '#9C27B0']}
                  style={styles.avatarGradient}
                >
                  <Ionicons name="school" size={16} color="#FFF" />
                </LinearGradient>
              </View>
            )}

            <View
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                message.role === 'user' ? { borderBottomRightRadius: 4 } : { borderBottomLeftRadius: 4 }
              ]}
            >
              {message.role === 'user' ? (
                <LinearGradient
                  colors={['#6A1B9A', '#8E24AA']}
                  style={styles.userBubbleGradient}
                >
                  <Text style={styles.userMessageText}>{message.content}</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.assistantMessageText}>{message.content}</Text>
              )}
              <Text style={[
                styles.timestamp,
                message.role === 'user' ? styles.userTimestamp : styles.assistantTimestamp
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
                colors={['#7B1FA2', '#9C27B0']}
                style={styles.avatarGradient}
              >
                <Ionicons name="school" size={16} color="#FFF" />
              </LinearGradient>
            </View>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color="#7B1FA2" />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask for help with your project..."
            placeholderTextColor="#9E9E9E"
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
              colors={(!inputText.trim() || sending) ? ['#E0E0E0', '#BDBDBD'] : ['#6A1B9A', '#8E24AA']}
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={styles.creditsText}>
          Credits: {user?.credits || 0}
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
});

export default ProjectAssistantScreen;
