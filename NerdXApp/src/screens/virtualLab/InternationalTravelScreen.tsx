import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab/simulationsData';

const AIRPORT_STEPS = [
    { id: '1', text: 'Approach check-in counter with passport and ticket', icon: 'person' },
    { id: '2', text: 'Present documents and answer check-in agent\'s questions', icon: 'card' },
    { id: '3', text: 'Confirm seat preference and receive boarding pass', icon: 'ticket' },
    { id: '4', text: 'Proceed to security and follow instructions', icon: 'shield-checkmark' },
    { id: '5', text: 'Find your departure gate on the information screens', icon: 'tv' },
    { id: '6', text: 'Board the flight when your zone is called', icon: 'airplane' },
];

const InternationalTravelScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('eng-international-travel')!;

    const [availableSteps, setAvailableSteps] = useState([...AIRPORT_STEPS].sort(() => Math.random() - 0.5));
    const [selectedOrder, setSelectedOrder] = useState<typeof AIRPORT_STEPS>([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    const handleStepSelect = (step: typeof AIRPORT_STEPS[0]) => {
        if (showFeedback) return;
        setAvailableSteps(prev => prev.filter(s => s.id !== step.id));
        setSelectedOrder(prev => [...prev, step]);
    };

    const handleUndo = () => {
        if (showFeedback || selectedOrder.length === 0) return;
        const lastStep = selectedOrder[selectedOrder.length - 1];
        setSelectedOrder(prev => prev.slice(0, -1));
        setAvailableSteps(prev => [...prev, lastStep]);
    };

    const checkOrder = () => {
        const correct = selectedOrder.every((step, index) => step.id === AIRPORT_STEPS[index].id);
        setIsCorrect(correct);
        setShowFeedback(true);
    };

    const resetActivity = () => {
        setAvailableSteps([...AIRPORT_STEPS].sort(() => Math.random() - 0.5));
        setSelectedOrder([]);
        setShowFeedback(false);
        setIsCorrect(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            <SimulationHeader simulation={simulation} onBack={() => navigation.goBack()} />

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Intro Card */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Ionicons name="airplane-outline" size={32} color="#2196F3" style={styles.cardIcon} />
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Airport Check-in Procedure</Text>
                    <Text style={[styles.cardDescription, { color: themedColors.text.secondary }]}>
                        Arrange the steps in the correct order to successfully board your flight.
                    </Text>
                </View>

                {/* Timeline Visualization */}
                <View style={styles.timelineContainer}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.secondary }]}>Your Journey:</Text>
                    <View style={[styles.timeline, { backgroundColor: themedColors.background.subtle, borderColor: themedColors.border.medium }]}>
                        {selectedOrder.length === 0 && (
                            <Text style={[styles.emptyText, { color: themedColors.text.tertiary }]}>Starting Point...</Text>
                        )}
                        {selectedOrder.map((step, index) => (
                            <View key={step.id} style={styles.timelineItem}>
                                <View style={[styles.stepNumberBadge, { backgroundColor: '#2196F3' }]}>
                                    <Text style={styles.stepNumber}>{index + 1}</Text>
                                </View>
                                <View style={[styles.stepCard, { backgroundColor: themedColors.background.paper }]}>
                                    <Ionicons name={step.icon as any} size={20} color="#2196F3" />
                                    <Text style={[styles.stepText, { color: themedColors.text.primary }]}>{step.text}</Text>
                                </View>
                                {index < selectedOrder.length - 1 && (
                                    <View style={[styles.connector, { backgroundColor: '#2196F3' }]} />
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: themedColors.background.paper }]}
                        onPress={handleUndo}
                        disabled={selectedOrder.length === 0 || showFeedback}
                    >
                        <Ionicons name="arrow-undo" size={24} color={selectedOrder.length === 0 ? '#ccc' : '#2196F3'} />
                    </TouchableOpacity>

                    {selectedOrder.length === AIRPORT_STEPS.length && !showFeedback && (
                        <TouchableOpacity style={[styles.checkButton, { backgroundColor: '#4CAF50' }]} onPress={checkOrder}>
                            <Text style={styles.checkButtonText}>Verify Check-in</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Feedback */}
                {showFeedback && (
                    <View style={[styles.feedbackCard, { backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE' }]}>
                        <Ionicons name={isCorrect ? "checkmark-circle" : "alert-circle"} size={32} color={isCorrect ? "#4CAF50" : "#F44336"} />
                        <Text style={[styles.feedbackText, { color: isCorrect ? "#2E7D32" : "#C62828" }]}>
                            {isCorrect ? "Boarding successful! Have a safe flight." : "Incorrect sequence. You might miss your flight!"}
                        </Text>
                        {isCorrect ? (
                            <TouchableOpacity style={styles.quizButton} onPress={() => setShowQuiz(true)}>
                                <Text style={styles.quizButtonText}>Confirm with Quiz</Text>
                                <Ionicons name="arrow-forward" size={16} color="#FFF" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={resetActivity}>
                                <Text style={styles.tryAgainText}>Reset Procedure</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Available Steps Pool */}
                {!showFeedback && (
                    <View style={styles.poolContainer}>
                        <Text style={[styles.sectionTitle, { color: themedColors.text.secondary }]}>Next Actions:</Text>
                        <View style={styles.poolGrid}>
                            {availableSteps.map((step) => (
                                <TouchableOpacity
                                    key={step.id}
                                    style={[styles.poolItem, { backgroundColor: themedColors.background.paper }]}
                                    onPress={() => handleStepSelect(step)}
                                >
                                    <Ionicons name={step.icon as any} size={24} color="#2196F3" />
                                    <Text style={[styles.poolText, { color: themedColors.text.primary }]}>{step.text}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>

            {showQuiz && (
                <KnowledgeCheck simulation={simulation} onClose={() => setShowQuiz(false)} onComplete={() => navigation.goBack()} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
    contentContainer: { padding: 16, paddingBottom: 40 },
    card: { padding: 20, borderRadius: 16, marginBottom: 20, alignItems: 'center' },
    cardIcon: { marginBottom: 12 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    cardDescription: { textAlign: 'center', lineHeight: 20 },
    timelineContainer: { marginBottom: 16 },
    sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' },
    timeline: { minHeight: 100, borderWidth: 1, borderRadius: 12, padding: 16, borderStyle: 'dashed' },
    emptyText: { textAlign: 'center', marginTop: 30 },
    timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, position: 'relative' },
    connector: { position: 'absolute', left: 15, top: 32, width: 2, height: 20, zIndex: -1 },
    stepNumberBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    stepNumber: { color: '#FFF', fontWeight: 'bold' },
    stepCard: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, gap: 12, elevation: 1 },
    stepText: { fontSize: 13, flex: 1 },
    controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    controlButton: { padding: 12, borderRadius: 8 },
    checkButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
    checkButtonText: { color: '#FFF', fontWeight: 'bold' },
    feedbackCard: { padding: 20, borderRadius: 12, alignItems: 'center', gap: 12 },
    feedbackText: { fontSize: 16, fontWeight: '500', textAlign: 'center' },
    tryAgainText: { color: '#F44336', fontWeight: 'bold', textDecorationLine: 'underline', marginTop: 8 },
    quizButton: { backgroundColor: '#2196F3', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, gap: 8, marginTop: 8 },
    quizButtonText: { color: '#FFF', fontWeight: 'bold' },
    poolContainer: { gap: 10 },
    poolGrid: { gap: 10 },
    poolItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, gap: 12, borderWidth: 1, borderColor: '#eee' },
    poolText: { flex: 1, fontSize: 14 },
});

export default InternationalTravelScreen;
