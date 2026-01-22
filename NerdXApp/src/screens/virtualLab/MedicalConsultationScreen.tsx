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

const MATCHING_PAIRS = [
    { id: '1', term: "I've been experiencing...", definition: "Describing symptom duration", color: '#E91E63' },
    { id: '2', term: "Could you explain what this medication does?", definition: "Understanding prescriptions", color: '#2196F3' },
    { id: '3', term: "Are there any side effects?", definition: "Asking about precautions", color: '#FF9800' },
    { id: '4', term: "So I should take this twice daily?", definition: "Confirming instructions", color: '#4CAF50' },
    { id: '5', term: "I'm allergic to penicillin", definition: "Sharing medical history", color: '#9C27B0' },
];

const MedicalConsultationScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('eng-medical-consultation')!;

    const [leftSide, setLeftSide] = useState(MATCHING_PAIRS.map(p => ({ id: p.id, text: p.term, color: p.color })).sort(() => Math.random() - 0.5));
    const [rightSide, setRightSide] = useState(MATCHING_PAIRS.map(p => ({ id: p.id, text: p.definition, color: p.color })).sort(() => Math.random() - 0.5));

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [matches, setMatches] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);

    // Doctor Consultation Section
    const [dialogueStage, setDialogueStage] = useState(0);
    const [consultationComplete, setConsultationComplete] = useState(false);

    const handleMatch = (side: 'left' | 'right', id: string) => {
        if (matches.includes(id)) return;

        if (side === 'left') {
            setSelectedLeft(id);
            if (selectedRight) {
                checkMatch(id, selectedRight);
            }
        } else {
            setSelectedRight(id);
            if (selectedLeft) {
                checkMatch(selectedLeft, id);
            }
        }
    };

    const checkMatch = (leftId: string, rightId: string) => {
        if (leftId === rightId) {
            setMatches([...matches, leftId]);
            setScore(prev => prev + 20);
            setSelectedLeft(null);
            setSelectedRight(null);

            // Trigger haptic or success sound here if available
        } else {
            // Error feedback
            setTimeout(() => {
                setSelectedLeft(null);
                setSelectedRight(null);
            }, 500);
        }
    };

    const isMatched = (id: string) => matches.includes(id);

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
                    <Ionicons name="medkit-outline" size={32} color="#F44336" style={styles.cardIcon} />
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        Doctor's Office Communication
                    </Text>
                    <Text style={[styles.cardDescription, { color: themedColors.text.secondary }]}>
                        Match the patient's phrase to the correct medical communication purpose.
                    </Text>
                </View>

                {/* Matching Game */}
                <View style={styles.gameContainer}>
                    <View style={styles.column}>
                        <Text style={[styles.columnHeader, { color: themedColors.text.secondary }]}>Patient Says</Text>
                        {leftSide.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.matchCard,
                                    {
                                        backgroundColor: isMatched(item.id)
                                            ? item.color + '20'
                                            : (selectedLeft === item.id ? themedColors.primary.main : themedColors.background.paper),
                                        borderColor: isMatched(item.id) ? item.color : themedColors.border.medium
                                    }
                                ]}
                                onPress={() => handleMatch('left', item.id)}
                                disabled={isMatched(item.id)}
                            >
                                <Text style={[
                                    styles.matchText,
                                    { color: selectedLeft === item.id && !isMatched(item.id) ? '#FFF' : themedColors.text.primary }
                                ]}>
                                    {item.text}
                                </Text>
                                {isMatched(item.id) && <Ionicons name="checkmark-circle" size={20} color={item.color} />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.column}>
                        <Text style={[styles.columnHeader, { color: themedColors.text.secondary }]}>Purpose</Text>
                        {rightSide.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.matchCard,
                                    {
                                        backgroundColor: isMatched(item.id)
                                            ? item.color + '20'
                                            : (selectedRight === item.id ? themedColors.primary.main : themedColors.background.paper),
                                        borderColor: isMatched(item.id) ? item.color : themedColors.border.medium
                                    }
                                ]}
                                onPress={() => handleMatch('right', item.id)}
                                disabled={isMatched(item.id)}
                            >
                                <Text style={[
                                    styles.matchText,
                                    { color: selectedRight === item.id && !isMatched(item.id) ? '#FFF' : themedColors.text.primary }
                                ]}>
                                    {item.text}
                                </Text>
                                {isMatched(item.id) && <Ionicons name="checkmark-circle" size={20} color={item.color} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Success & Next Steps */}
                {matches.length === MATCHING_PAIRS.length && (
                    <Animated.View style={[styles.successContainer, { opacity: 1 }]}>
                        <LinearGradient
                            colors={['#4CAF50', '#2E7D32']}
                            style={styles.successGradient}
                        >
                            <Ionicons name="fitness" size={40} color="#FFF" />
                            <Text style={styles.successTitle}>Communication Clear!</Text>
                            <Text style={styles.successText}>
                                You've mastered the key phrases for advocating for your health.
                            </Text>

                            <TouchableOpacity
                                style={styles.quizButton}
                                onPress={() => setShowQuiz(true)}
                            >
                                <Text style={styles.quizButtonText}>Start Consultation Quiz</Text>
                                <Ionicons name="arrow-forward" size={20} color="#4CAF50" />
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
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
        marginBottom: 20,
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
    gameContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    column: {
        flex: 1,
        gap: 10,
    },
    columnHeader: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    matchCard: {
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        minHeight: 80,
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    matchText: {
        fontSize: 13,
        lineHeight: 18,
    },
    successContainer: {
        marginTop: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    successGradient: {
        padding: 24,
        alignItems: 'center',
        gap: 12,
    },
    successTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    successText: {
        color: '#FFFFFFCC',
        textAlign: 'center',
        marginBottom: 8,
    },
    quizButton: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
    },
    quizButtonText: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default MedicalConsultationScreen;
