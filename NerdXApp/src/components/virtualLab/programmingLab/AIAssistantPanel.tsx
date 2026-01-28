import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../../theme/useThemedStyles';
import type { ProgrammingLanguage } from '../../../types/programmingLabTypes';
import { programmingLabAiApi, type AIRequestPayload } from '../../../services/api/programmingLabAiApi';

export interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
    metadata?: {
        codeSnippet?: string;
        type?: string;
    };
}

interface AIAssistantPanelProps {
    language: ProgrammingLanguage;
    code: string;
    userLevel: 'o-level' | 'a-level';
    exerciseId?: string;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
    language,
    code,
    userLevel,
    exerciseId,
}) => {
    const themedColors = useThemedColors();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const determineRequestType = (text: string): AIRequestPayload['type'] => {
        const lower = text.toLowerCase();
        if (lower.includes('error') || lower.includes('fix')) return 'debug';
        if (lower.includes('explain') || lower.startsWith('what is')) return 'explain';
        if (lower.includes('test')) return 'suggest-test';
        return 'general-question';
    };

    const handleSend = async () => {
        const trimmed = inputText.trim();
        if (!trimmed || isLoading) return;

        const userMessage: Message = {
            id: Math.random().toString(),
            sender: 'user',
            text: trimmed,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const reqType = determineRequestType(trimmed);
            const payload: AIRequestPayload = {
                type: reqType,
                code,
                language,
                userQuestion: trimmed,
                context: {
                    exerciseId,
                    userLevel,
                },
                conversationHistory: messages.map(m => ({
                    sender: m.sender,
                    text: m.text,
                })),
            };

            const resp = await programmingLabAiApi.ask(payload);

            const aiMessage: Message = {
                id: Math.random().toString(),
                sender: 'ai',
                text: resp.content,
                timestamp: new Date(),
                metadata: resp.codeSnippet ? { codeSnippet: resp.codeSnippet, type: resp.type } : undefined,
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err: any) {
            const aiMessage: Message = {
                id: Math.random().toString(),
                sender: 'ai',
                text: `Sorry, I couldn't process that. ${err?.message || ''}`.trim(),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyCode = (snippet: string) => {
        // For now, copy the suggestion into the input so user can paste/edit into the editor
        setInputText(snippet);
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.paper }]}>
            <ScrollView style={styles.chatHistory} contentContainerStyle={styles.chatContent}>
                {messages.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="sparkles-outline" size={32} color={themedColors.primary.main} />
                        <Text style={[styles.title, { color: themedColors.text.primary }]}>AI Programming Assistant</Text>
                        <Text style={[styles.subtitle, { color: themedColors.text.secondary }]}>
                            Ask questions about your code, request explanations, or debug errors.
                        </Text>
                        <View style={styles.quickRow}>
                            {['Explain this code', 'Help debug error', 'Suggest test cases'].map((label) => (
                                <TouchableOpacity
                                    key={label}
                                    style={[styles.quickButton, { borderColor: themedColors.primary.main }]}
                                    onPress={() => setInputText(label)}
                                >
                                    <Text style={[styles.quickButtonText, { color: themedColors.primary.main }]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : (
                    messages.map((m) => (
                        <View
                            key={m.id}
                            style={[
                                styles.messageRow,
                                m.sender === 'user' ? styles.userRow : styles.aiRow,
                            ]}
                        >
                            {m.sender === 'ai' && (
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>AI</Text>
                                </View>
                            )}
                            <View
                                style={[
                                    styles.bubble,
                                    { backgroundColor: m.sender === 'user' ? themedColors.primary.main : themedColors.background.subtle },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.messageText,
                                        { color: m.sender === 'user' ? '#FFFFFF' : themedColors.text.primary },
                                    ]}
                                >
                                    {m.text}
                                </Text>
                                {m.metadata?.codeSnippet && (
                                    <View style={styles.codeBlock}>
                                        <Text style={[styles.codeBlockLabel, { color: themedColors.text.secondary }]}>Suggested code:</Text>
                                        <ScrollView horizontal style={styles.codeScroll}>
                                            <Text style={[styles.codeBlockText, { color: themedColors.text.primary }]}>
                                                {m.metadata.codeSnippet}
                                            </Text>
                                        </ScrollView>
                                        <TouchableOpacity
                                            style={[styles.applyButton, { backgroundColor: themedColors.secondary.main }]}
                                            onPress={() => handleApplyCode(m.metadata!.codeSnippet!)}
                                        >
                                            <Text style={styles.applyCodeButtonText}>Copy to editor</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))
                )}
                {isLoading && (
                    <View style={styles.loadingRow}>
                        <ActivityIndicator size="small" color={themedColors.primary.main} />
                        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Thinking...</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.inputRow}>
                <TextInput
                    style={[styles.input, { color: themedColors.text.primary, borderColor: themedColors.border.light }]}
                    placeholder="Ask for help with your code..."
                    placeholderTextColor={themedColors.text.secondary}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    editable={!isLoading}
                />
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        { backgroundColor: inputText.trim() && !isLoading ? themedColors.primary.main : themedColors.background.subtle },
                    ]}
                    onPress={handleSend}
                    disabled={isLoading || !inputText.trim()}
                >
                    <Ionicons
                        name="send"
                        size={18}
                        color={inputText.trim() && !isLoading ? '#FFFFFF' : themedColors.text.secondary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
    chatHistory: {
        flex: 1,
    },
    chatContent: {
        paddingBottom: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 12,
    },
    quickRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 4,
    },
    quickButton: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
        margin: 4,
    },
    quickButtonText: {
        fontSize: 12,
    },
    messageRow: {
        flexDirection: 'row',
        marginVertical: 4,
        paddingHorizontal: 4,
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    aiRow: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4A5568',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        marginTop: 2,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    bubble: {
        maxWidth: '85%',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    messageText: {
        fontSize: 13,
        lineHeight: 18,
    },
    codeBlock: {
        marginTop: 8,
        borderRadius: 6,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    codeBlockLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 4,
    },
    codeScroll: {
        maxHeight: 120,
        marginBottom: 6,
    },
    codeBlockText: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 12,
    },
    applyButton: {
        alignSelf: 'flex-start',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#4A5568',
    },
    applyCodeButtonText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    loadingText: {
        fontSize: 12,
        marginLeft: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingTop: 4,
    },
    input: {
        flex: 1,
        minHeight: 36,
        maxHeight: 80,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 13,
    },
    sendButton: {
        marginLeft: 8,
        padding: 10,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AIAssistantPanel;
