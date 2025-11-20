// Project Assistant Screen Component - Database-backed Chat Interface
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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { projectApi, ProjectDetails, ChatMessage } from '../services/api/projectApi';
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
    projectId?: number;
    projectTitle?: string;
    subject?: string;
    studentName?: string;
    studentSurname?: string;
    school?: string;
    form?: string;
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

      // Check if we're resuming an existing project or creating a new one
      if (params.projectId) {
        // Resume existing project
        await resumeExistingProject(params.projectId);
      } else {
        // Create new project
        await createNewProject();
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to initialize project'
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    // Create the project in the database
    const newProject = await projectApi.createProject({
      title: params.projectTitle!,
      subject: params.subject!,
      student_name: params.studentName!,
      student_surname: params.studentSurname!,
      school: params.school!,
      form: params.form!,
    });

    if (!newProject) {
      throw new Error('Failed to create project');
    }

    // Get full project details
    const projectDetails = await projectApi.getProject(newProject.id);
    if (projectDetails) {
      setProject(projectDetails);

      // Add initial welcome message
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `🎓 Welcome to Project Assistant!\n\nI'm here to help you with your ${params.subject} project: "${params.projectTitle}"\n\nI'll guide you through each stage of your ZIMSEC project. What would you like to work on first?`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const resumeExistingProject = async (projectId: number) => {
    // Get project details
    const projectDetails = await projectApi.getProject(projectId);
    if (!projectDetails) {
      throw new Error('Project not found');
    }

    setProject(projectDetails);

    // Load chat history
    const chatHistory = await projectApi.getChatHistory(projectId);

    if (chatHistory && chatHistory.length > 0) {
      // Convert chat history to messages
      const loadedMessages: Message[] = chatHistory.map((msg, index) => ({
        id: msg.id?.toString() || index.toString(),
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(loadedMessages);
    } else {
      // No chat history, add welcome message
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `🎓 Welcome back to your project: "${projectDetails.title}"\n\nLet's continue working on your ${projectDetails.subject} project. What would you like to work on?`,
          timestamp: new Date(),
        },
      ]);
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

        // Update credits (follow-up costs 1 credit)
        if (user) {
          const newCredits = (user.credits || 0) - 1;
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send message');
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
                  'Project document generated successfully!',
                  [{ text: 'OK' }]
                );
                // Update credits
                if (user) {
                  const newCredits = (user.credits || 0) - 3;
                  updateUser({ credits: newCredits });
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
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={styles.loadingText}>Setting up your project...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎓 Project Assistant</Text>
        <Text style={styles.headerSubtitle}>
          {project?.title || params.projectTitle}
        </Text>
        <View style={styles.headerRow}>
          <Text style={styles.credits}>Credits: {user?.credits || 0}</Text>
          <TouchableOpacity
            style={styles.documentButton}
            onPress={handleGenerateDocument}
          >
            <Text style={styles.documentButtonText}>📄 Generate Doc</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}
        {sending && (
          <View style={[styles.messageBubble, styles.assistantMessage]}>
            <ActivityIndicator size="small" color="#9C27B0" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask for help with your project..."
            multiline
            maxLength={1000}
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
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    color: '#757575',
  },
  header: {
    backgroundColor: '#9C27B0',
    padding: 15,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  credits: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  documentButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  documentButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContent: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#9C27B0',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#212121',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    minHeight: 40,
  },
  sendButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProjectAssistantScreen;
