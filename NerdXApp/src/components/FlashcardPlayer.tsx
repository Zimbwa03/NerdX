// FlashcardPlayer Component - Interactive AI-Generated Flashcard Display
// Features: Flip animation, navigation, shuffle, progress tracking

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 280;

// Types
export interface Flashcard {
    id: number;
    question: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'difficult';
    category: string;
    hint?: string | null;
}

interface FlashcardPlayerProps {
    flashcards: Flashcard[];
    accentColor?: string;
    onComplete?: () => void;
    isStreaming?: boolean;
    onGenerateNext?: () => Promise<Flashcard | null>;
    totalStreamingCards?: number;
}

const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
        case 'easy':
            return '#4CAF50';
        case 'medium':
            return '#FF9800';
        case 'difficult':
            return '#F44336';
        default:
            return '#7C4DFF';
    }
};

export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({
    flashcards: initialFlashcards,
    accentColor = '#4CAF50',
    onComplete,
    isStreaming = false,
    onGenerateNext,
    totalStreamingCards = 0,
}) => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());

    const flipAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(1)).current;

    // Update flashcards when prop changes
    useEffect(() => {
        setFlashcards(initialFlashcards);
    }, [initialFlashcards]);

    const currentCard = flashcards[currentIndex];
    const totalCards = isStreaming ? totalStreamingCards : flashcards.length;

    // Flip animation
    const flipCard = () => {
        Animated.spring(flipAnimation, {
            toValue: isFlipped ? 0 : 1,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
        setIsFlipped(!isFlipped);
        setShowHint(false);
    };

    // Card scale animation for navigation
    const animateCardChange = (callback: () => void) => {
        Animated.sequence([
            Animated.timing(scaleAnimation, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Reset flip state
        flipAnimation.setValue(0);
        setIsFlipped(false);
        setShowHint(false);

        callback();
    };

    const goToNext = async () => {
        if (currentIndex < flashcards.length - 1) {
            animateCardChange(() => setCurrentIndex(currentIndex + 1));
        } else if (isStreaming && onGenerateNext && currentIndex < totalStreamingCards - 1) {
            // Generate next card in streaming mode
            setIsGenerating(true);
            try {
                const newCard = await onGenerateNext();
                if (newCard) {
                    setFlashcards([...flashcards, newCard]);
                    animateCardChange(() => setCurrentIndex(currentIndex + 1));
                }
            } finally {
                setIsGenerating(false);
            }
        } else if (onComplete) {
            onComplete();
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            animateCardChange(() => setCurrentIndex(currentIndex - 1));
        }
    };

    const shuffleCards = () => {
        const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setCurrentIndex(0);
        setIsShuffled(!isShuffled);
        flipAnimation.setValue(0);
        setIsFlipped(false);
    };

    const toggleMastered = () => {
        const newMastered = new Set(masteredCards);
        if (newMastered.has(currentCard.id)) {
            newMastered.delete(currentCard.id);
        } else {
            newMastered.add(currentCard.id);
        }
        setMasteredCards(newMastered);
    };

    // Card flip interpolations
    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontStyle = {
        transform: [
            { perspective: 1000 },
            { rotateY: frontInterpolate },
            { scale: scaleAnimation },
        ],
    };

    const backStyle = {
        transform: [
            { perspective: 1000 },
            { rotateY: backInterpolate },
            { scale: scaleAnimation },
        ],
    };

    if (!currentCard) {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: themedColors.background.paper }]}>
                <Ionicons name="albums-outline" size={48} color={themedColors.text.secondary} />
                <Text style={[styles.emptyText, { color: themedColors.text.secondary }]}>
                    No flashcards available
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={[styles.progressText, { color: themedColors.text.primary }]}>
                        Card {currentIndex + 1} / {totalCards}
                    </Text>
                    <View style={[styles.progressBar, { backgroundColor: themedColors.background.subtle }]}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    backgroundColor: accentColor,
                                    width: `${((currentIndex + 1) / totalCards) * 100}%`,
                                },
                            ]}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.shuffleButton, { backgroundColor: isShuffled ? accentColor : themedColors.background.subtle }]}
                    onPress={shuffleCards}
                >
                    <Ionicons name="shuffle" size={20} color={isShuffled ? '#FFF' : themedColors.text.primary} />
                </TouchableOpacity>
            </View>

            {/* Mastered count */}
            <View style={styles.masteredContainer}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={[styles.masteredText, { color: themedColors.text.secondary }]}>
                    {masteredCards.size} mastered
                </Text>
            </View>

            {/* Flashcard */}
            <TouchableOpacity
                activeOpacity={0.95}
                onPress={flipCard}
                style={styles.cardContainer}
            >
                {/* Front of card (Question) */}
                <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
                    <LinearGradient
                        colors={isDarkMode ? ['#2D2F45', '#1D1E33'] : ['#FFFFFF', '#F5F5F5']}
                        style={styles.cardGradient}
                    >
                        {/* Difficulty badge */}
                        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(currentCard.difficulty) }]}>
                            <Text style={styles.difficultyText}>{currentCard.difficulty.toUpperCase()}</Text>
                        </View>

                        {/* Category */}
                        <Text style={[styles.categoryText, { color: accentColor }]}>
                            {currentCard.category}
                        </Text>

                        {/* Question */}
                        <ScrollView
                            style={styles.contentScroll}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.contentContainer}
                            nestedScrollEnabled={true}
                        >
                            <Text style={[styles.questionText, { color: themedColors.text.primary }]}>
                                {currentCard.question}
                            </Text>
                        </ScrollView>

                        {/* Hint button */}
                        {currentCard.hint && (
                            <TouchableOpacity
                                style={[styles.hintButton, { borderColor: accentColor }]}
                                onPress={(e) => {
                                    e.stopPropagation?.();
                                    setShowHint(!showHint);
                                }}
                            >
                                <Ionicons name="bulb-outline" size={16} color={accentColor} />
                                <Text style={[styles.hintButtonText, { color: accentColor }]}>
                                    {showHint ? 'Hide Hint' : 'Show Hint'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {showHint && currentCard.hint && (
                            <View style={[styles.hintBox, { backgroundColor: `${accentColor}20` }]}>
                                <Text style={[styles.hintText, { color: themedColors.text.primary }]}>
                                    💡 {currentCard.hint}
                                </Text>
                            </View>
                        )}

                        {/* Tap to flip */}
                        <Text style={[styles.flipHint, { color: themedColors.text.secondary }]}>
                            TAP TO FLIP
                        </Text>
                    </LinearGradient>
                </Animated.View>

                {/* Back of card (Answer) */}
                <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
                    <LinearGradient
                        colors={[accentColor, isDarkMode ? '#1D1E33' : '#FFFFFF']}
                        style={styles.cardGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.answerLabel}>ANSWER</Text>

                        <ScrollView
                            style={styles.contentScroll}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.contentContainer}
                            nestedScrollEnabled={true}
                        >
                            <Text style={[styles.answerText, { color: isDarkMode ? '#FFF' : themedColors.text.primary }]}>
                                {currentCard.answer}
                            </Text>
                        </ScrollView>

                        {/* Mastered button */}
                        <TouchableOpacity
                            style={[
                                styles.masteredButton,
                                masteredCards.has(currentCard.id) && styles.masteredButtonActive
                            ]}
                            onPress={(e) => {
                                e.stopPropagation?.();
                                toggleMastered();
                            }}
                        >
                            <Ionicons
                                name={masteredCards.has(currentCard.id) ? "checkmark-circle" : "checkmark-circle-outline"}
                                size={20}
                                color={masteredCards.has(currentCard.id) ? '#4CAF50' : '#FFF'}
                            />
                            <Text style={styles.masteredButtonText}>
                                {masteredCards.has(currentCard.id) ? 'Mastered!' : 'Mark as Mastered'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.flipHintBack}>TAP TO FLIP BACK</Text>
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>

            {/* Navigation */}
            <View style={styles.navigation}>
                <TouchableOpacity
                    style={[
                        styles.navButton,
                        { backgroundColor: themedColors.background.paper },
                        currentIndex === 0 && styles.navButtonDisabled
                    ]}
                    onPress={goToPrevious}
                    disabled={currentIndex === 0}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={currentIndex === 0 ? themedColors.text.disabled : themedColors.text.primary}
                    />
                    <Text style={[
                        styles.navButtonText,
                        { color: currentIndex === 0 ? themedColors.text.disabled : themedColors.text.primary }
                    ]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                {/* Progress dots */}
                <View style={styles.dotsContainer}>
                    {flashcards.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, idx) => {
                        const actualIdx = Math.max(0, currentIndex - 2) + idx;
                        return (
                            <View
                                key={actualIdx}
                                style={[
                                    styles.dot,
                                    {
                                        backgroundColor: actualIdx === currentIndex
                                            ? accentColor
                                            : themedColors.background.subtle,
                                        transform: [{ scale: actualIdx === currentIndex ? 1.3 : 1 }],
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[
                        styles.navButton,
                        { backgroundColor: accentColor },
                    ]}
                    onPress={goToNext}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <>
                            <Text style={styles.navButtonTextRight}>
                                {currentIndex === flashcards.length - 1 && !isStreaming
                                    ? 'Finish'
                                    : isStreaming && currentIndex === flashcards.length - 1
                                        ? 'Generate'
                                        : 'Next'}
                            </Text>
                            <Ionicons name="chevron-forward" size={24} color="#FFF" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    progressContainer: {
        flex: 1,
        marginRight: 12,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    shuffleButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    masteredContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    masteredText: {
        fontSize: 13,
        marginLeft: 6,
    },
    cardContainer: {
        height: CARD_HEIGHT,
        marginBottom: 20,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        position: 'absolute',
        backfaceVisibility: 'hidden',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    cardFront: {
        zIndex: 1,
    },
    cardBack: {
        zIndex: 0,
    },
    cardGradient: {
        flex: 1,
        padding: 20,
        borderRadius: 20,
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    difficultyText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    contentScroll: {
        flex: 1,
        maxHeight: 140,
    },
    contentContainer: {
        flexGrow: 1,
        paddingVertical: 4,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 26,
        textAlign: 'center',
    },
    hintButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        marginTop: 12,
    },
    hintButtonText: {
        fontSize: 12,
        marginLeft: 6,
        fontWeight: '500',
    },
    hintBox: {
        padding: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    hintText: {
        fontSize: 13,
        fontStyle: 'italic',
    },
    flipHint: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 12,
        letterSpacing: 2,
    },
    answerLabel: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 16,
        textAlign: 'center',
    },
    answerText: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    masteredButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 12,
    },
    masteredButtonActive: {
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
    },
    masteredButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
    flipHintBack: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 12,
        letterSpacing: 2,
    },
    navigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        minWidth: 100,
        justifyContent: 'center',
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    navButtonTextRight: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
        marginRight: 4,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
});

export default FlashcardPlayer;
