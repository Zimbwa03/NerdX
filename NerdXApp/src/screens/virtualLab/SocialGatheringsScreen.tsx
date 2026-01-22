import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab/simulationsData';

const MATCHING_PAIRS = [
    { id: '1', phrase: "Hi, I'm Tendai. Nice to meet you!", function: "Self-introduction", icon: 'person-add' },
    { id: '2', phrase: "That sounds interesting! How did you get into that?", function: "Showing genuine interest", icon: 'ear' },
    { id: '3', phrase: "I love football too! Do you support a local team?", function: "Finding common ground", icon: 'football' },
    { id: '4', phrase: "It was great chatting. We should grab coffee sometime!", function: "Suggesting future plans", icon: 'calendar' },
];

const SocialGatheringsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('eng-social-gatherings')!;

    const [leftItems] = useState([...MATCHING_PAIRS].sort(() => Math.random() - 0.5));
    const [rightItems] = useState([...MATCHING_PAIRS].sort(() => Math.random() - 0.5));

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [matches, setMatches] = useState<string[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);

    const handleMatch = (side: 'left' | 'right', id: string) => {
        if (matches.includes(id)) return;

        if (side === 'left') {
            setSelectedLeft(id);
            if (selectedRight) checkMatch(id, selectedRight);
        } else {
            setSelectedRight(id);
            if (selectedLeft) checkMatch(selectedLeft, id);
        }
    };

    const checkMatch = (leftId: string, rightId: string) => {
        if (leftId === rightId) {
            setMatches(prev => [...prev, leftId]);
            setSelectedLeft(null);
            setSelectedRight(null);
        } else {
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
            <SimulationHeader simulation={simulation} onBack={() => navigation.goBack()} />

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Intro */}
                <View style={[styles.illustrationCard, { backgroundColor: '#9C27B0' }]}>
                    <View style={styles.partyIconContainer}>
                        <Ionicons name="people" size={40} color="#FFF" />
                        <Ionicons name="musical-notes" size={24} color="#FFF" style={styles.musicIcon} />
                    </View>
                    <Text style={styles.illustrationTitle}>Mastering Small Talk</Text>
                    <Text style={styles.illustrationText}>Connect the conversation phrase to its social function.</Text>
                </View>

                {/* Game Area */}
                <View style={styles.gameArea}>
                    <View style={styles.column}>
                        <Text style={[styles.columnHeader, { color: themedColors.text.secondary }]}>Phrases</Text>
                        {leftItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: isMatched(item.id)
                                            ? '#E0F2F1'
                                            : selectedLeft === item.id ? '#F3E5F5' : themedColors.background.paper,
                                        borderColor: isMatched(item.id) ? '#4DB6AC' : selectedLeft === item.id ? '#9C27B0' : 'transparent',
                                        opacity: isMatched(item.id) ? 0.6 : 1
                                    }
                                ]}
                                onPress={() => handleMatch('left', item.id)}
                                disabled={isMatched(item.id)}
                            >
                                <View style={styles.speechBubble}>
                                    <Text style={[styles.speechText, { color: themedColors.text.primary }]}>"{item.phrase}"</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.column}>
                        <Text style={[styles.columnHeader, { color: themedColors.text.secondary }]}>Social Function</Text>
                        {rightItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: isMatched(item.id)
                                            ? '#E0F2F1'
                                            : selectedRight === item.id ? '#F3E5F5' : themedColors.background.paper,
                                        borderColor: isMatched(item.id) ? '#4DB6AC' : selectedRight === item.id ? '#9C27B0' : 'transparent',
                                        opacity: isMatched(item.id) ? 0.6 : 1
                                    }
                                ]}
                                onPress={() => handleMatch('right', item.id)}
                                disabled={isMatched(item.id)}
                            >
                                <Ionicons name={item.icon as any} size={24} color={isMatched(item.id) ? '#009688' : '#9C27B0'} />
                                <Text style={[styles.functionText, { color: themedColors.text.primary }]}>{item.function}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Completion */}
                {matches.length === MATCHING_PAIRS.length && (
                    <View style={styles.completionContainer}>
                        <Text style={[styles.congratsText, { color: themedColors.text.primary }]}>
                            🎉 You're ready to mingle!
                        </Text>
                        <TouchableOpacity style={styles.quizButton} onPress={() => setShowQuiz(true)}>
                            <Text style={styles.quizButtonText}>Test Your Social Skills</Text>
                            <Ionicons name="arrow-forward" size={16} color="#FFF" />
                        </TouchableOpacity>
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
    illustrationCard: { borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
    partyIconContainer: { flexDirection: 'row', marginBottom: 16 },
    musicIcon: { position: 'absolute', right: -20, top: -10 },
    illustrationTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
    illustrationText: { color: '#F3E5F5', textAlign: 'center' },
    gameArea: { flexDirection: 'row', gap: 12 },
    column: { flex: 1, gap: 12 },
    columnHeader: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', marginBottom: 4 },
    card: { padding: 16, borderRadius: 12, minHeight: 100, justifyContent: 'center', alignItems: 'center', borderWidth: 2, gap: 8 },
    speechBubble: { padding: 8, borderRadius: 8 },
    speechText: { fontSize: 13, textAlign: 'center', fontStyle: 'italic' },
    functionText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
    completionContainer: { marginTop: 32, alignItems: 'center', gap: 16 },
    congratsText: { fontSize: 18, fontWeight: 'bold' },
    quizButton: { backgroundColor: '#9C27B0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, gap: 8 },
    quizButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default SocialGatheringsScreen;
