// Market Negotiation Screen - English Virtual Lab
// Interactive dialogue-based marketplace negotiation simulation

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab/simulationsData';

const { width } = Dimensions.get('window');

interface DialogueOption {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
    culturalNote?: string;
}

interface DialogueStep {
    id: string;
    scenario: string;
    vendorMessage: string;
    vendorMood: 'neutral' | 'happy' | 'concerned' | 'pleased';
    options: DialogueOption[];
    vocabulary: { word: string; meaning: string }[];
}

const DIALOGUE_STEPS: DialogueStep[] = [
    {
        id: 'greeting',
        scenario: '🌅 You arrive at a vibrant African marketplace. A friendly vendor arranges fresh tomatoes on her stall.',
        vendorMessage: '*Smiles warmly* Good morning! Would you like some beautiful tomatoes today?',
        vendorMood: 'happy',
        options: [
            {
                id: 'a',
                text: 'How much?',
                isCorrect: false,
                feedback: 'This is too abrupt! In African markets, a warm greeting builds a positive relationship first.',
            },
            {
                id: 'b',
                text: 'Good morning, Mama! They look wonderful. How has business been today?',
                isCorrect: true,
                feedback: '🎉 Perfect! You started with a respectful greeting and showed genuine interest in the vendor.',
                culturalNote: 'Using "Mama" is a respectful term for an elder woman in many African cultures.',
            },
            {
                id: 'c',
                text: 'I don\'t want to buy anything.',
                isCorrect: false,
                feedback: 'Even if not buying, a polite acknowledgment maintains positive community relations.',
            },
        ],
        vocabulary: [
            { word: 'stall', meaning: 'a table or booth where goods are displayed for sale' },
            { word: 'vibrant', meaning: 'full of energy and activity' },
        ],
    },
    {
        id: 'inquiry',
        scenario: '🍅 The vendor is pleased with your greeting and shows you her best tomatoes.',
        vendorMessage: 'Ah, thank you for asking! Business is good today. These tomatoes are from my farm - very fresh! How many would you like?',
        vendorMood: 'pleased',
        options: [
            {
                id: 'a',
                text: 'I\'ll take 2 kilos. What\'s the price?',
                isCorrect: false,
                feedback: 'Good quantity specification, but asking the price first lets you negotiate better.',
            },
            {
                id: 'b',
                text: 'They look very fresh! Could you tell me the price per kilo, please?',
                isCorrect: true,
                feedback: '🎉 Excellent! You complimented the product and politely asked for pricing information.',
                culturalNote: 'Complimenting products before asking prices creates goodwill.',
            },
            {
                id: 'c',
                text: 'Just give me some.',
                isCorrect: false,
                feedback: 'Being specific about quantity and asking about price helps avoid misunderstandings.',
            },
        ],
        vocabulary: [
            { word: 'fresh', meaning: 'recently made, picked, or prepared' },
            { word: 'kilo', meaning: 'short for kilogram, a unit of weight (1000 grams)' },
        ],
    },
    {
        id: 'negotiation',
        scenario: '💰 The vendor tells you the tomatoes are 5,000 per kilo.',
        vendorMessage: 'For you, these beautiful tomatoes are 5,000 per kilo. They\'re the best in the market!',
        vendorMood: 'neutral',
        options: [
            {
                id: 'a',
                text: 'That\'s too expensive! I\'ll pay 2,000 only.',
                isCorrect: false,
                feedback: 'Starting too low can feel disrespectful. A more reasonable counter-offer works better.',
            },
            {
                id: 'b',
                text: 'I really love these tomatoes, but I was hoping for around 3,500. Would that work for you?',
                isCorrect: true,
                feedback: '🎉 Great negotiation! You showed appreciation while making a reasonable counter-offer politely.',
                culturalNote: 'Negotiation in African markets is expected and respectful when done politely.',
            },
            {
                id: 'c',
                text: 'Fine, I\'ll pay 5,000.',
                isCorrect: false,
                feedback: 'Accepting the first price is fine, but gentle negotiation is part of the market experience!',
            },
        ],
        vocabulary: [
            { word: 'negotiate', meaning: 'to discuss prices to reach an agreement' },
            { word: 'counter-offer', meaning: 'a response to an offer with a different price' },
        ],
    },
    {
        id: 'agreement',
        scenario: '🤝 The vendor considers your offer and proposes a middle ground.',
        vendorMessage: '*Thinking* Hmm, 3,500 is low, but because you are polite... let\'s say 4,000 and I\'ll add some extra tomatoes. Deal?',
        vendorMood: 'happy',
        options: [
            {
                id: 'a',
                text: 'Deal! Thank you so much, Mama. I appreciate your generosity.',
                isCorrect: true,
                feedback: '🎉 Wonderful! You accepted graciously and showed appreciation for the fair deal.',
                culturalNote: 'Expressing gratitude strengthens community bonds and ensures a warm welcome next time.',
            },
            {
                id: 'b',
                text: 'Make it 3,800 and we have a deal.',
                isCorrect: false,
                feedback: 'She already offered a good compromise. Pushing further may seem greedy.',
            },
            {
                id: 'c',
                text: 'OK.',
                isCorrect: false,
                feedback: 'A warmer response acknowledges the vendor\'s kindness in meeting you halfway.',
            },
        ],
        vocabulary: [
            { word: 'deal', meaning: 'an agreement between parties' },
            { word: 'generous', meaning: 'willing to give more than expected' },
        ],
    },
    {
        id: 'farewell',
        scenario: '👋 You\'ve completed your purchase. Time to say goodbye!',
        vendorMessage: '*Handing you the bag with extra tomatoes* Here you go! Come back again soon!',
        vendorMood: 'happy',
        options: [
            {
                id: 'a',
                text: '*Takes bag and walks away*',
                isCorrect: false,
                feedback: 'A proper farewell leaves a positive impression for future visits.',
            },
            {
                id: 'b',
                text: 'Thank you very much, Mama! May your business continue to prosper. See you next time!',
                isCorrect: true,
                feedback: '🎉 Perfect ending! You blessed her business and promised to return - building lasting relationships.',
                culturalNote: 'Wishing someone\'s business well is a meaningful blessing in African cultures.',
            },
            {
                id: 'c',
                text: 'Thanks. Bye.',
                isCorrect: false,
                feedback: 'A warmer farewell reflects the positive interaction you\'ve built.',
            },
        ],
        vocabulary: [
            { word: 'prosper', meaning: 'to succeed or do well financially' },
            { word: 'farewell', meaning: 'a goodbye or parting message' },
        ],
    },
];

const MarketNegotiationScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('eng-market-negotiation')!;

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showVocab, setShowVocab] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    const step = DIALOGUE_STEPS[currentStep];
    const isComplete = completedSteps.length === DIALOGUE_STEPS.length;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [currentStep]);

    const handleOptionSelect = (optionId: string) => {
        if (showFeedback) return;
        setSelectedOption(optionId);
        setShowFeedback(true);

        const option = step.options.find(o => o.id === optionId);
        if (option?.isCorrect) {
            setScore(prev => prev + 20);
        }
    };

    const handleNext = () => {
        if (!completedSteps.includes(step.id)) {
            setCompletedSteps([...completedSteps, step.id]);
        }

        if (currentStep < DIALOGUE_STEPS.length - 1) {
            fadeAnim.setValue(0);
            setCurrentStep(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        }
    };

    const getVendorEmoji = (mood: string) => {
        switch (mood) {
            case 'happy': return '😊';
            case 'pleased': return '😃';
            case 'concerned': return '😟';
            default: return '🙂';
        }
    };

    const getOptionStyle = (option: DialogueOption) => {
        if (!showFeedback) return {};
        if (selectedOption === option.id) {
            return option.isCorrect
                ? { borderColor: '#00E676', backgroundColor: '#00E67615' }
                : { borderColor: '#FF5252', backgroundColor: '#FF525215' };
        }
        if (option.isCorrect && selectedOption !== option.id) {
            return { borderColor: '#00E676', backgroundColor: '#00E67615' };
        }
        return { opacity: 0.5 };
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            <SimulationHeader
                simulation={simulation}
                onBack={() => navigation.goBack()}
            />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: themedColors.background.subtle }]}>
                        <LinearGradient
                            colors={['#9C27B0', '#CE93D8']}
                            style={[styles.progressFill, { width: `${((currentStep + 1) / DIALOGUE_STEPS.length) * 100}%` }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    </View>
                    <Text style={[styles.progressText, { color: themedColors.text.secondary }]}>
                        Step {currentStep + 1} of {DIALOGUE_STEPS.length}
                    </Text>
                </View>

                {/* Score Display */}
                <View style={[styles.scoreCard, { backgroundColor: '#9C27B015' }]}>
                    <Ionicons name="star" size={20} color="#9C27B0" />
                    <Text style={[styles.scoreText, { color: '#9C27B0' }]}>
                        Score: {score} / 100
                    </Text>
                </View>

                {/* Scenario Card */}
                <Animated.View style={[styles.scenarioCard, { backgroundColor: themedColors.background.paper, opacity: fadeAnim }]}>
                    <Text style={[styles.scenarioText, { color: themedColors.text.primary }]}>
                        {step.scenario}
                    </Text>
                </Animated.View>

                {/* Vendor Message */}
                <View style={[styles.vendorCard, { backgroundColor: '#E8F5E9' }]}>
                    <View style={styles.vendorHeader}>
                        <Text style={styles.vendorEmoji}>{getVendorEmoji(step.vendorMood)}</Text>
                        <Text style={[styles.vendorLabel, { color: '#2E7D32' }]}>Vendor</Text>
                    </View>
                    <Text style={[styles.vendorMessage, { color: '#1B5E20' }]}>
                        {step.vendorMessage}
                    </Text>
                </View>

                {/* Response Options */}
                <View style={styles.optionsContainer}>
                    <Text style={[styles.optionsLabel, { color: themedColors.text.secondary }]}>
                        Your Response:
                    </Text>
                    {step.options.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionButton,
                                { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.medium },
                                getOptionStyle(option),
                            ]}
                            onPress={() => handleOptionSelect(option.id)}
                            disabled={showFeedback}
                        >
                            <View style={[styles.optionLetter, { backgroundColor: '#9C27B015' }]}>
                                <Text style={[styles.optionLetterText, { color: '#9C27B0' }]}>
                                    {option.id.toUpperCase()}
                                </Text>
                            </View>
                            <Text style={[styles.optionText, { color: themedColors.text.primary }]}>
                                {option.text}
                            </Text>
                            {showFeedback && option.isCorrect && (
                                <Ionicons name="checkmark-circle" size={24} color="#00E676" />
                            )}
                            {showFeedback && selectedOption === option.id && !option.isCorrect && (
                                <Ionicons name="close-circle" size={24} color="#FF5252" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Feedback Card */}
                {showFeedback && (
                    <View style={[
                        styles.feedbackCard,
                        { backgroundColor: step.options.find(o => o.id === selectedOption)?.isCorrect ? '#00E67615' : '#FF525215' }
                    ]}>
                        <Text style={[styles.feedbackText, { color: themedColors.text.primary }]}>
                            {step.options.find(o => o.id === selectedOption)?.feedback}
                        </Text>
                        {step.options.find(o => o.id === selectedOption)?.culturalNote && (
                            <View style={styles.culturalNote}>
                                <Ionicons name="bulb" size={16} color="#FFC107" />
                                <Text style={[styles.culturalNoteText, { color: '#F57F17' }]}>
                                    {step.options.find(o => o.id === selectedOption)?.culturalNote}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Vocabulary Toggle */}
                <TouchableOpacity
                    style={[styles.vocabToggle, { backgroundColor: themedColors.background.paper }]}
                    onPress={() => setShowVocab(!showVocab)}
                >
                    <Ionicons name="book" size={20} color="#9C27B0" />
                    <Text style={[styles.vocabToggleText, { color: themedColors.text.primary }]}>
                        {showVocab ? 'Hide' : 'Show'} Vocabulary
                    </Text>
                    <Ionicons name={showVocab ? 'chevron-up' : 'chevron-down'} size={20} color={themedColors.text.secondary} />
                </TouchableOpacity>

                {showVocab && (
                    <View style={[styles.vocabCard, { backgroundColor: '#9C27B010' }]}>
                        {step.vocabulary.map((vocab, idx) => (
                            <View key={idx} style={styles.vocabItem}>
                                <Text style={[styles.vocabWord, { color: '#9C27B0' }]}>
                                    {vocab.word}
                                </Text>
                                <Text style={[styles.vocabMeaning, { color: themedColors.text.secondary }]}>
                                    {vocab.meaning}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Navigation Buttons */}
                {showFeedback && !isComplete && (
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                    >
                        <LinearGradient
                            colors={['#9C27B0', '#7B1FA2']}
                            style={styles.nextButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.nextButtonText}>Continue</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {isComplete && (
                    <View style={styles.completionCard}>
                        <LinearGradient
                            colors={['#9C27B0', '#7B1FA2']}
                            style={styles.completionGradient}
                        >
                            <Ionicons name="trophy" size={40} color="#FFD700" />
                            <Text style={styles.completionTitle}>Negotiation Complete!</Text>
                            <Text style={styles.completionScore}>Final Score: {score}/100</Text>
                            <Text style={styles.completionMessage}>
                                You've learned key phrases for marketplace negotiation in Africa!
                            </Text>
                            <TouchableOpacity
                                style={styles.quizButton}
                                onPress={() => setShowQuiz(true)}
                            >
                                <Ionicons name="school" size={20} color="#9C27B0" />
                                <Text style={styles.quizButtonText}>Take Knowledge Check</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}
            </ScrollView>

            {/* Knowledge Check Modal */}
            {showQuiz && (
                <KnowledgeCheck
                    simulation={simulation}
                    onClose={() => setShowQuiz(false)}
                    onComplete={() => setShowQuiz(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    progressContainer: {
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    scoreCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '600',
    },
    scenarioCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    scenarioText: {
        fontSize: 15,
        lineHeight: 22,
    },
    vendorCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    vendorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    vendorEmoji: {
        fontSize: 24,
    },
    vendorLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    vendorMessage: {
        fontSize: 15,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    optionsContainer: {
        marginBottom: 16,
    },
    optionsLabel: {
        fontSize: 13,
        marginBottom: 12,
        fontWeight: '500',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 2,
        gap: 12,
    },
    optionLetter: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionLetterText: {
        fontSize: 14,
        fontWeight: '700',
    },
    optionText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    feedbackCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    feedbackText: {
        fontSize: 14,
        lineHeight: 20,
    },
    culturalNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 12,
        gap: 8,
    },
    culturalNoteText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    vocabToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        gap: 10,
    },
    vocabToggleText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    vocabCard: {
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 16,
    },
    vocabItem: {
        marginBottom: 10,
    },
    vocabWord: {
        fontSize: 14,
        fontWeight: '600',
    },
    vocabMeaning: {
        fontSize: 13,
        marginTop: 2,
    },
    nextButton: {
        marginTop: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    nextButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 10,
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    completionCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 16,
    },
    completionGradient: {
        padding: 24,
        alignItems: 'center',
    },
    completionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
        marginTop: 12,
    },
    completionScore: {
        fontSize: 18,
        color: '#FFD700',
        marginTop: 8,
        fontWeight: '600',
    },
    completionMessage: {
        fontSize: 14,
        color: '#FFFFFFCC',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    quizButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 20,
        gap: 8,
    },
    quizButtonText: {
        color: '#9C27B0',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default MarketNegotiationScreen;
