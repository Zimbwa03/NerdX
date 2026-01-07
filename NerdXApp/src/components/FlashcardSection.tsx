// FlashcardSection Component
// Wrapper that handles flashcard customization and generation UI

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { useNotification } from '../context/NotificationContext';
import { FlashcardPlayer, Flashcard } from './FlashcardPlayer';
import { flashcardApi } from '../services/api/flashcardApi';
import { TopicNotes } from '../services/api/scienceNotesApi';

interface FlashcardSectionProps {
    subject: string;
    topic: string;
    notes: TopicNotes;
    accentColor?: string;
}

const FlashcardSection: React.FC<FlashcardSectionProps> = ({
    subject,
    topic,
    notes,
    accentColor = '#4CAF50',
}) => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const { showSuccess, showError } = useNotification();

    const [cardCount, setCardCount] = useState(20);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);

    // Convert notes to text for context
    const getNotesContent = useCallback((): string => {
        const parts: string[] = [];

        if (notes.summary) {
            parts.push(notes.summary);
        }

        notes.sections.forEach(section => {
            parts.push(`## ${section.title}\n${section.content}`);
        });

        if (notes.key_points?.length) {
            parts.push('## Key Points\n' + notes.key_points.join('\n'));
        }

        if (notes.exam_tips?.length) {
            parts.push('## Exam Tips\n' + notes.exam_tips.join('\n'));
        }

        return parts.join('\n\n');
    }, [notes]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedQuestions([]);

        try {
            const notesContent = getNotesContent();

            if (cardCount <= 100) {
                // Batch mode
                setIsStreaming(false);
                const cards = await flashcardApi.generateFlashcards(
                    subject,
                    topic,
                    cardCount,
                    notesContent
                );

                if (cards.length > 0) {
                    setFlashcards(cards);
                    setShowPlayer(true);
                    showSuccess(`✅ Generated ${cards.length} flashcards!`, 3000);
                } else {
                    showError('❌ Failed to generate flashcards. Please try again.', 4000);
                    Alert.alert(
                        'Generation Failed',
                        'Could not generate flashcards. Please try again.',
                        [{ text: 'OK' }]
                    );
                }
            } else {
                // Streaming mode - generate first card
                setIsStreaming(true);
                const firstCard = await flashcardApi.generateSingleFlashcard(
                    subject,
                    topic,
                    0,
                    notesContent,
                    []
                );

                if (firstCard) {
                    setFlashcards([firstCard]);
                    setGeneratedQuestions([firstCard.question]);
                    setShowPlayer(true);
                    showSuccess('✅ Flashcard generation started!', 3000);
                } else {
                    showError('❌ Failed to generate flashcards. Please try again.', 4000);
                    Alert.alert(
                        'Generation Failed',
                        'Could not generate flashcards. Please try again.',
                        [{ text: 'OK' }]
                    );
                }
            }
        } catch (error) {
            console.error('Flashcard generation error:', error);
            showError('❌ Failed to connect to the server. Please check your connection.', 5000);
            Alert.alert(
                'Error',
                'Failed to connect to the server. Please check your connection.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateNext = async (): Promise<Flashcard | null> => {
        try {
            const notesContent = getNotesContent();
            const nextCard = await flashcardApi.generateSingleFlashcard(
                subject,
                topic,
                flashcards.length,
                notesContent,
                generatedQuestions
            );

            if (nextCard) {
                setGeneratedQuestions(prev => [...prev, nextCard.question]);
            }

            return nextCard;
        } catch (error) {
            console.error('Generate next error:', error);
            return null;
        }
    };

    const handleComplete = () => {
        Alert.alert(
            '🎉 Well Done!',
            `You've completed all ${flashcards.length} flashcards! Would you like to review them again?`,
            [
                { text: 'Exit', onPress: () => setShowPlayer(false) },
                { text: 'Review Again', onPress: () => { } },
            ]
        );
    };

    const handleReset = () => {
        setShowPlayer(false);
        setFlashcards([]);
        setGeneratedQuestions([]);
    };

    if (showPlayer && flashcards.length > 0) {
        return (
            <View style={[styles.playerContainer, { backgroundColor: themedColors.background.paper }]}>
                {/* Player Header */}
                <View style={styles.playerHeader}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleReset}
                    >
                        <Ionicons name="close" size={24} color={themedColors.text.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.playerTitle, { color: themedColors.text.primary }]}>
                        {topic} Flashcards
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <FlashcardPlayer
                    flashcards={flashcards}
                    accentColor={accentColor}
                    onComplete={handleComplete}
                    isStreaming={isStreaming}
                    onGenerateNext={handleGenerateNext}
                    totalStreamingCards={cardCount}
                />
            </View>
        );
    }

    return (
        <View style={[styles.container, { borderColor: isDarkMode ? 'rgba(124, 77, 255, 0.5)' : 'rgba(124, 77, 255, 0.3)' }]}>
            <LinearGradient
                colors={isDarkMode
                    ? ['rgba(124, 77, 255, 0.15)', 'rgba(124, 77, 255, 0.05)']
                    : ['rgba(124, 77, 255, 0.1)', 'rgba(124, 77, 255, 0.02)']}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: `${accentColor}20` }]}>
                        <Ionicons name="albums" size={28} color={accentColor} />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={[styles.title, { color: themedColors.text.primary }]}>
                            AI Flashcards
                        </Text>
                        <Text style={[styles.subtitle, { color: themedColors.text.secondary }]}>
                            Test your knowledge with AI-generated study cards
                        </Text>
                    </View>
                </View>

                {/* Card Count Slider */}
                <View style={styles.sliderContainer}>
                    <View style={styles.sliderHeader}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                            Number of flashcards:
                        </Text>
                        <View style={[styles.countBadge, { backgroundColor: accentColor }]}>
                            <Text style={styles.countText}>{cardCount}</Text>
                        </View>
                    </View>

                    <Slider
                        style={styles.slider}
                        minimumValue={10}
                        maximumValue={200}
                        step={10}
                        value={cardCount}
                        onValueChange={setCardCount}
                        minimumTrackTintColor={accentColor}
                        maximumTrackTintColor={themedColors.background.subtle}
                        thumbTintColor={accentColor}
                    />

                    <View style={styles.sliderLabels}>
                        <Text style={[styles.sliderMinMax, { color: themedColors.text.secondary }]}>10</Text>
                        <Text style={[styles.sliderMinMax, { color: themedColors.text.secondary }]}>100</Text>
                        <Text style={[styles.sliderMinMax, { color: themedColors.text.secondary }]}>200</Text>
                    </View>
                </View>

                {/* Mode Indicator */}
                {cardCount > 100 && (
                    <View style={[styles.modeIndicator, { backgroundColor: isDarkMode ? 'rgba(255,152,0,0.2)' : 'rgba(255,152,0,0.1)' }]}>
                        <Ionicons name="flash" size={16} color="#FF9800" />
                        <Text style={[styles.modeText, { color: themedColors.text.primary }]}>
                            Streaming Mode: Cards will generate one at a time
                        </Text>
                    </View>
                )}

                {/* Generate Button */}
                <TouchableOpacity
                    style={[styles.generateButton, { backgroundColor: accentColor }]}
                    onPress={handleGenerate}
                    disabled={isGenerating}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[accentColor, isDarkMode ? '#1D1E33' : '#333']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.buttonGradient}
                    >
                        {isGenerating ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="sparkles" size={20} color="#FFF" />
                                <Text style={styles.generateButtonText}>
                                    Generate {cardCount} Flashcards
                                </Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                {/* Info */}
                <Text style={[styles.infoText, { color: themedColors.text.secondary }]}>
                    💡 Flashcards are generated based on the topic notes above
                </Text>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 2,
    },
    gradient: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
    sliderContainer: {
        marginBottom: 20,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sliderLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    countBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
    },
    countText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    sliderMinMax: {
        fontSize: 12,
    },
    modeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    modeText: {
        fontSize: 13,
        marginLeft: 8,
    },
    generateButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    generateButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    infoText: {
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    playerContainer: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    playerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FlashcardSection;
