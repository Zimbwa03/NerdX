import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
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
    { id: '1', term: "Savings Account", meaning: "For storing money and earning interest", icon: 'save' },
    { id: '2', term: "Current Account", meaning: "For daily transactions", icon: 'card' },
    { id: '3', term: "Interest Rate", meaning: "Percentage earned or paid on money", icon: 'trending-up' },
    { id: '4', term: "Balance", meaning: "Money currently in your account", icon: 'wallet' },
    { id: '5', term: "Transaction", meaning: "Any activity involving money", icon: 'swap-horizontal' },
];

const BankingServicesScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('eng-banking-services')!;

    const [leftItems, setLeftItems] = useState([...MATCHING_PAIRS].sort(() => Math.random() - 0.5));
    const [rightItems, setRightItems] = useState([...MATCHING_PAIRS].sort(() => Math.random() - 0.5));

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
                {/* Header Card */}
                <LinearGradient
                    colors={['#1A237E', '#3949AB']}
                    style={styles.headerCard}
                >
                    <Ionicons name="business" size={32} color="#FFF" />
                    <Text style={styles.headerTitle}>Financial Literacy</Text>
                    <Text style={styles.headerText}>Master the language of banking.</Text>
                </LinearGradient>

                {/* Game Area */}
                <View style={[styles.gameArea, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.column}>
                        <Text style={[styles.columnHeader, { color: themedColors.text.secondary }]}>Term</Text>
                        {leftItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.item,
                                    {
                                        backgroundColor: isMatched(item.id)
                                            ? '#E8EAF6'
                                            : selectedLeft === item.id ? '#C5CAE9' : themedColors.background.subtle,
                                        borderColor: isMatched(item.id) ? '#3F51B5' : selectedLeft === item.id ? '#3949AB' : 'transparent',
                                    }
                                ]}
                                onPress={() => handleMatch('left', item.id)}
                                disabled={isMatched(item.id)}
                            >
                                <Ionicons name={item.icon as any} size={20} color="#3F51B5" />
                                <Text style={[styles.itemText, { color: themedColors.text.primary }]}>{item.term}</Text>
                                {isMatched(item.id) && <Ionicons name="checkmark" size={16} color="#4CAF50" />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.column}>
                        <Text style={[styles.columnHeader, { color: themedColors.text.secondary }]}>Definition</Text>
                        {rightItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.item,
                                    {
                                        backgroundColor: isMatched(item.id)
                                            ? '#E8EAF6'
                                            : selectedRight === item.id ? '#C5CAE9' : themedColors.background.subtle,
                                        borderColor: isMatched(item.id) ? '#3F51B5' : selectedRight === item.id ? '#3949AB' : 'transparent',
                                    }
                                ]}
                                onPress={() => handleMatch('right', item.id)}
                                disabled={isMatched(item.id)}
                            >
                                <Text style={[styles.definitionText, { color: themedColors.text.primary }]}>{item.meaning}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Completion */}
                {matches.length === MATCHING_PAIRS.length && (
                    <View style={styles.successContainer}>
                        <Text style={[styles.successTitle, { color: themedColors.text.primary }]}>Analysis Complete</Text>
                        <TouchableOpacity style={styles.quizButton} onPress={() => setShowQuiz(true)}>
                            <Text style={styles.quizButtonText}>Verify Knowledge</Text>
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
    headerCard: { borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginTop: 8 },
    headerText: { color: '#C5CAE9', marginTop: 4 },
    gameArea: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 16 },
    column: { flex: 1, gap: 10 },
    columnHeader: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
    item: { padding: 12, borderRadius: 8, borderWidth: 1, minHeight: 70, justifyContent: 'center', gap: 8 },
    itemText: { fontWeight: '600', fontSize: 13 },
    definitionText: { fontSize: 12 },
    successContainer: { marginTop: 24, alignItems: 'center', gap: 12 },
    successTitle: { fontSize: 18, fontWeight: 'bold' },
    quizButton: { backgroundColor: '#3949AB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, gap: 8 },
    quizButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default BankingServicesScreen;
