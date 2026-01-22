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
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab/simulationsData';

const { width } = Dimensions.get('window');

const PRESENTATION_STEPS = [
    { id: '1', text: 'Greet the audience and introduce your topic', correctOrder: 1 },
    { id: '2', text: 'Outline the structure: "I will discuss three main points..."', correctOrder: 2 },
    { id: '3', text: 'Present your first point with supporting evidence', correctOrder: 3 },
    { id: '4', text: 'Use transitions: "Moving on to my second point..."', correctOrder: 4 },
    { id: '5', text: 'Summarize key findings and draw conclusions', correctOrder: 5 },
    { id: '6', text: 'Thank the audience and invite questions', correctOrder: 6 },
];

const UniversityCampusLifeScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('eng-university-campus')!;

    const [availableSteps, setAvailableSteps] = useState([...PRESENTATION_STEPS].sort(() => Math.random() - 0.5));
    const [selectedOrder, setSelectedOrder] = useState<typeof PRESENTATION_STEPS>([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [score, setScore] = useState(0);

    // Debate Section State
    const [currentDebateIndex, setCurrentDebateIndex] = useState(0);
    const [debateScore, setDebateScore] = useState(0);

    const DEBATE_SCENARIOS = [
        {
            situation: "Your classmate says: 'Climate change isn't real because it's cold today.'",
            options: [
                { text: "That's the stupidest thing I've ever heard.", score: 0, feedback: "Avoid insults in academic debates." },
                { text: "I understand why you might think that, but weather and climate are different things.", score: 10, feedback: "Great! You acknowledged their view before correcting politely." },
                { text: "You need to read a book.", score: 0, feedback: "Too aggressive." }
            ]
        },
        {
            situation: "You want to add to a point your professor just made.",
            options: [
                { text: "Building on that point, recent studies also show...", score: 10, feedback: "Excellent use of academic bridging language." },
                { text: "Also...", score: 5, feedback: "A bit too informal for a lecture hall." },
                { text: "I have something to say!", score: 0, feedback: "Disruptive." }
            ]
        }
    ];

    const handleStepSelect = (step: typeof PRESENTATION_STEPS[0]) => {
        if (showFeedback) return;
        const newAvailable = availableSteps.filter(s => s.id !== step.id);
        setAvailableSteps(newAvailable);
        setSelectedOrder([...selectedOrder, step]);
    };

    const handleUndo = () => {
        if (showFeedback || selectedOrder.length === 0) return;
        const lastStep = selectedOrder[selectedOrder.length - 1];
        setSelectedOrder(selectedOrder.slice(0, -1));
        setAvailableSteps([...availableSteps, lastStep]);
    };

    const checkOrder = () => {
        const correct = selectedOrder.every((step, index) => step.correctOrder === index + 1);
        setIsCorrect(correct);
        setShowFeedback(true);
        if (correct) setScore(prev => prev + 50);
    };

    const resetActivity = () => {
        setAvailableSteps([...PRESENTATION_STEPS].sort(() => Math.random() - 0.5));
        setSelectedOrder([]);
        setShowFeedback(false);
        setIsCorrect(false);
    };

    const handleDebateOption = (scoreToAdd: number, feedback: string) => {
        Alert.alert(scoreToAdd > 0 ? "Good Choice!" : "Try Again", feedback, [
            {
                text: "Next", onPress: () => {
                    setDebateScore(prev => prev + scoreToAdd);
                    if (currentDebateIndex < DEBATE_SCENARIOS.length - 1) {
                        setCurrentDebateIndex(prev => prev + 1);
                    }
                }
            }
        ]);
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
                {/* Introduction Card */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Ionicons name="school-outline" size={32} color="#9C27B0" style={styles.cardIcon} />
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        Academic Presentation Challenge
                    </Text>
                    <Text style={[styles.cardDescription, { color: themedColors.text.secondary }]}>
                        Arrange the steps of a formal university presentation in the logical order.
                    </Text>
                </View>

                {/* Sequencing Area */}
                <View style={styles.sequencingContainer}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.secondary }]}>
                        Your Presentation Structure:
                    </Text>

                    <View style={[styles.dropZone, { borderColor: themedColors.border.medium, backgroundColor: themedColors.background.subtle }]}>
                        {selectedOrder.length === 0 && (
                            <Text style={[styles.emptyText, { color: themedColors.text.tertiary }]}>
                                Tap steps below to add them here
                            </Text>
                        )}
                        {selectedOrder.map((step, index) => (
                            <View key={step.id} style={[styles.stepItem, { backgroundColor: '#9C27B0' }]}>
                                <Text style={styles.stepNumber}>{index + 1}</Text>
                                <Text style={styles.stepText}>{step.text}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Controls */}
                    <View style={styles.controls}>
                        <TouchableOpacity
                            style={[styles.controlButton, { backgroundColor: themedColors.background.paper }]}
                            onPress={handleUndo}
                            disabled={selectedOrder.length === 0 || showFeedback}
                        >
                            <Ionicons name="arrow-undo" size={20} color={selectedOrder.length === 0 ? '#ccc' : '#9C27B0'} />
                        </TouchableOpacity>

                        {selectedOrder.length === PRESENTATION_STEPS.length && !showFeedback && (
                            <TouchableOpacity
                                style={[styles.checkButton, { backgroundColor: '#4CAF50' }]}
                                onPress={checkOrder}
                            >
                                <Text style={styles.checkButtonText}>Check Order</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Feedback */}
                    {showFeedback && (
                        <View style={[
                            styles.feedbackCard,
                            { backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE' }
                        ]}>
                            <Ionicons
                                name={isCorrect ? "checkmark-circle" : "alert-circle"}
                                size={24}
                                color={isCorrect ? "#4CAF50" : "#F44336"}
                            />
                            <Text style={[
                                styles.feedbackText,
                                { color: isCorrect ? "#2E7D32" : "#C62828" }
                            ]}>
                                {isCorrect
                                    ? "Perfect! You've structured your presentation logically."
                                    : "Not quite right. Think about the flow: Introduction -> Body -> Conclusion."}
                            </Text>
                            {!isCorrect && (
                                <TouchableOpacity onPress={resetActivity}>
                                    <Text style={styles.tryAgainText}>Try Again</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Available Steps */}
                    {!showFeedback && (
                        <View style={styles.availableContainer}>
                            <Text style={[styles.sectionTitle, { color: themedColors.text.secondary }]}>
                                Available Steps:
                            </Text>
                            {availableSteps.map((step) => (
                                <TouchableOpacity
                                    key={step.id}
                                    style={[styles.stepOption, { backgroundColor: themedColors.background.paper }]}
                                    onPress={() => handleStepSelect(step)}
                                >
                                    <Ionicons name="add-circle-outline" size={24} color="#9C27B0" />
                                    <Text style={[styles.optionText, { color: themedColors.text.primary }]}>
                                        {step.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Debate Section (Only shows after success) */}
                {isCorrect && (
                    <View style={styles.debateSection}>
                        <View style={[styles.card, { backgroundColor: themedColors.background.paper, marginTop: 24 }]}>
                            <Ionicons name="chatbubbles-outline" size={32} color="#FF9800" style={styles.cardIcon} />
                            <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                                The Debate Corner
                            </Text>
                            {currentDebateIndex < DEBATE_SCENARIOS.length ? (
                                <>
                                    <Text style={[styles.scenarioText, { color: themedColors.text.primary }]}>
                                        {DEBATE_SCENARIOS[currentDebateIndex].situation}
                                    </Text>
                                    {DEBATE_SCENARIOS[currentDebateIndex].options.map((option, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[styles.debateOption, { borderColor: themedColors.border.medium }]}
                                            onPress={() => handleDebateOption(option.score, option.feedback)}
                                        >
                                            <Text style={[styles.debateOptionText, { color: themedColors.text.primary }]}>
                                                {option.text}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            ) : (
                                <View style={styles.completionContainer}>
                                    <Text style={[styles.completionText, { color: themedColors.text.primary }]}>
                                        Great work! You're ready for campus life.
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.quizButton}
                                        onPress={() => setShowQuiz(true)}
                                    >
                                        <Text style={styles.quizButtonText}>Take Final Knowledge Check</Text>
                                        <Ionicons name="arrow-forward" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>

            {showQuiz && (
                <KnowledgeCheck
                    simulation={simulation}
                    onClose={() => setShowQuiz(false)}
                    onComplete={() => {
                        setShowQuiz(false);
                        navigation.goBack();
                    }}
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
    card: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    cardIcon: {
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    sequencingContainer: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 8,
    },
    dropZone: {
        minHeight: 150,
        borderWidth: 2,
        borderRadius: 12,
        borderStyle: 'dashed',
        padding: 12,
        gap: 8,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 14,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 12,
    },
    stepNumber: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        width: 24,
    },
    stepText: {
        color: '#FFF',
        flex: 1,
        fontSize: 14,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    controlButton: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
    },
    checkButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    checkButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    availableContainer: {
        marginTop: 16,
        gap: 10,
    },
    stepOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    optionText: {
        fontSize: 14,
        flex: 1,
    },
    feedbackCard: {
        padding: 16,
        borderRadius: 12,
        marginVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
    },
    feedbackText: {
        flex: 1,
        fontSize: 14,
    },
    tryAgainText: {
        color: '#F44336',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginTop: 4,
    },
    debateSection: {
        marginTop: 10,
    },
    scenarioText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
    },
    debateOption: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
    },
    debateOptionText: {
        textAlign: 'center',
        fontSize: 14,
    },
    completionContainer: {
        alignItems: 'center',
        gap: 16,
    },
    completionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    quizButton: {
        backgroundColor: '#9C27B0',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
    },
    quizButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default UniversityCampusLifeScreen;
