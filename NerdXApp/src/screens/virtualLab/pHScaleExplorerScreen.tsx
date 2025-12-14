// pH Scale Explorer Screen - Chemistry Simulation
// Test pH of various substances using universal indicator

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Rect, Line, Text as SvgText, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById, PH_SUBSTANCES, Substance } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const SCALE_WIDTH = width - 64;

// pH color gradient (0-14)
const PH_COLORS = [
    '#FF0000', // 0
    '#FF2200', // 1
    '#FF4400', // 2
    '#FF6600', // 3
    '#FF9900', // 4
    '#FFCC00', // 5
    '#DDDD00', // 6
    '#00CC00', // 7
    '#00DDAA', // 8
    '#00BBDD', // 9
    '#00AAFF', // 10
    '#0066FF', // 11
    '#0033FF', // 12
    '#6600FF', // 13
    '#9900FF', // 14
];

const getPHColor = (ph: number): string => {
    const index = Math.max(0, Math.min(14, Math.round(ph)));
    return PH_COLORS[index];
};

const PHScaleExplorerScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('ph-scale-explorer')!;

    const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(null);
    const [testedSubstances, setTestedSubstances] = useState<Set<string>>(new Set());
    const [showQuiz, setShowQuiz] = useState(false);

    const handleTestSubstance = (substance: Substance) => {
        setSelectedSubstance(substance);
        setTestedSubstances(prev => new Set([...prev, substance.id]));
    };

    const canTakeQuiz = testedSubstances.size >= 5;

    const renderPHScale = () => (
        <View style={[styles.scaleContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }]}>
            <Text style={[styles.scaleTitle, { color: themedColors.text.primary }]}>
                pH Scale
            </Text>

            <Svg width={SCALE_WIDTH} height={100} viewBox={`0 0 ${SCALE_WIDTH} 100`}>
                {/* pH gradient bar */}
                <Defs>
                    <LinearGradient id="phGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        {PH_COLORS.map((color, index) => (
                            <Stop key={index} offset={`${(index / 14) * 100}%`} stopColor={color} />
                        ))}
                    </LinearGradient>
                </Defs>

                <Rect
                    x={0}
                    y={30}
                    width={SCALE_WIDTH}
                    height={30}
                    rx={5}
                    fill="url(#phGradient)"
                />

                {/* Scale markers */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
                    <G key={num}>
                        <Line
                            x1={num * (SCALE_WIDTH / 14)}
                            y1={60}
                            x2={num * (SCALE_WIDTH / 14)}
                            y2={70}
                            stroke={themedColors.text.secondary}
                            strokeWidth={1}
                        />
                        <SvgText
                            x={num * (SCALE_WIDTH / 14)}
                            y={85}
                            textAnchor="middle"
                            fontSize={10}
                            fill={themedColors.text.secondary}
                        >
                            {num}
                        </SvgText>
                    </G>
                ))}

                {/* Selected substance marker */}
                {selectedSubstance && (
                    <G>
                        <Circle
                            cx={selectedSubstance.ph * (SCALE_WIDTH / 14)}
                            cy={45}
                            r={12}
                            fill={getPHColor(selectedSubstance.ph)}
                            stroke="#FFF"
                            strokeWidth={3}
                        />
                        <SvgText
                            x={selectedSubstance.ph * (SCALE_WIDTH / 14)}
                            y={20}
                            textAnchor="middle"
                            fontSize={12}
                            fontWeight="bold"
                            fill={themedColors.text.primary}
                        >
                            pH {selectedSubstance.ph}
                        </SvgText>
                    </G>
                )}
            </Svg>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FF0000' }]} />
                    <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>Strong Acid</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#00CC00' }]} />
                    <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>Neutral</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#6600FF' }]} />
                    <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>Strong Alkali</Text>
                </View>
            </View>
        </View>
    );

    const renderTestTube = () => {
        if (!selectedSubstance) return null;

        return (
            <View style={[styles.testTubeContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA' }]}>
                <Svg width={80} height={150} viewBox="0 0 80 150">
                    {/* Test tube */}
                    <Rect x={25} y={10} width={30} height={100} rx={2} fill="transparent" stroke={themedColors.text.primary} strokeWidth={2} />
                    <Circle cx={40} cy={110} r={15} fill="transparent" stroke={themedColors.text.primary} strokeWidth={2} />

                    {/* Liquid */}
                    <Rect x={27} y={30} width={26} height={78} fill={getPHColor(selectedSubstance.ph)} opacity={0.9} />
                    <Circle cx={40} cy={108} r={13} fill={getPHColor(selectedSubstance.ph)} opacity={0.9} />
                </Svg>

                <View style={styles.testResult}>
                    <Text style={[styles.substanceName, { color: themedColors.text.primary }]}>
                        {selectedSubstance.name}
                    </Text>
                    <View style={[styles.phBadge, { backgroundColor: getPHColor(selectedSubstance.ph) }]}>
                        <Text style={styles.phValue}>pH {selectedSubstance.ph}</Text>
                    </View>
                    <Text style={[styles.category, {
                        color: selectedSubstance.category === 'acid' ? '#F44336'
                            : selectedSubstance.category === 'neutral' ? '#4CAF50'
                                : '#2196F3'
                    }]}>
                        {selectedSubstance.category === 'acid' ? '🟥 Acidic'
                            : selectedSubstance.category === 'neutral' ? '🟩 Neutral'
                                : '🟦 Alkaline'}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            <SimulationHeader
                title={simulation.title}
                subject={simulation.subject}
                learningObjectives={simulation.learningObjectives}
                onBack={() => navigation.goBack()}
                xpReward={simulation.xpReward}
            />

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* pH Scale */}
                {renderPHScale()}

                {/* Test Tube Result */}
                {selectedSubstance && renderTestTube()}

                {/* Substances to Test */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        🧪 Test Substances ({testedSubstances.size}/{PH_SUBSTANCES.length})
                    </Text>

                    <View style={styles.substancesGrid}>
                        {PH_SUBSTANCES.map((substance) => {
                            const isTested = testedSubstances.has(substance.id);
                            const isSelected = selectedSubstance?.id === substance.id;

                            return (
                                <TouchableOpacity
                                    key={substance.id}
                                    style={[
                                        styles.substanceBtn,
                                        isSelected && styles.substanceBtnSelected,
                                        {
                                            backgroundColor: isSelected
                                                ? `${getPHColor(substance.ph)}20`
                                                : themedColors.background.subtle,
                                            borderColor: isSelected ? getPHColor(substance.ph) : 'transparent'
                                        }
                                    ]}
                                    onPress={() => handleTestSubstance(substance)}
                                >
                                    <Text style={[
                                        styles.substanceBtnText,
                                        { color: isSelected ? getPHColor(substance.ph) : themedColors.text.primary }
                                    ]}>
                                        {substance.name}
                                    </Text>
                                    {isTested && (
                                        <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* pH Facts */}
                <View style={[styles.card, { backgroundColor: isDarkMode ? '#2a2a2a' : '#E3F2FD' }]}>
                    <Text style={[styles.factTitle, { color: themedColors.text.primary }]}>
                        💡 pH Facts
                    </Text>
                    <View style={styles.factsList}>
                        <Text style={[styles.factItem, { color: themedColors.text.secondary }]}>
                            • pH stands for "potential of Hydrogen"
                        </Text>
                        <Text style={[styles.factItem, { color: themedColors.text.secondary }]}>
                            • pH 0-6 = Acidic (more H⁺ ions)
                        </Text>
                        <Text style={[styles.factItem, { color: themedColors.text.secondary }]}>
                            • pH 7 = Neutral (equal H⁺ and OH⁻)
                        </Text>
                        <Text style={[styles.factItem, { color: themedColors.text.secondary }]}>
                            • pH 8-14 = Alkaline (more OH⁻ ions)
                        </Text>
                        <Text style={[styles.factItem, { color: themedColors.text.secondary }]}>
                            • Each pH unit = 10× change in H⁺
                        </Text>
                    </View>
                </View>

                {/* Quiz Button */}
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        !canTakeQuiz && styles.completeButtonDisabled
                    ]}
                    onPress={() => setShowQuiz(true)}
                    disabled={!canTakeQuiz}
                >
                    <Text style={styles.completeButtonText}>
                        {canTakeQuiz ? 'Take Knowledge Check' : `Test ${5 - testedSubstances.size} more substances`}
                    </Text>
                    <Ionicons name={canTakeQuiz ? "arrow-forward" : "lock-closed"} size={20} color="#FFF" />
                </TouchableOpacity>
            </ScrollView>

            <KnowledgeCheck
                visible={showQuiz}
                questions={simulation.quizQuestions}
                simulationTitle={simulation.title}
                xpReward={simulation.xpReward}
                onComplete={() => setShowQuiz(false)}
                onClose={() => setShowQuiz(false)}
            />
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
    scaleContainer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    scaleTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 11,
    },
    testTubeContainer: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    testResult: {
        alignItems: 'center',
        gap: 8,
    },
    substanceName: {
        fontSize: 16,
        fontWeight: '600',
    },
    phBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    phValue: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    substancesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    substanceBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 2,
        gap: 6,
    },
    substanceBtnSelected: {},
    substanceBtnText: {
        fontSize: 12,
        fontWeight: '500',
    },
    factTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
    },
    factsList: {
        gap: 4,
    },
    factItem: {
        fontSize: 12,
        lineHeight: 18,
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#673AB7',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    completeButtonDisabled: {
        backgroundColor: '#9E9E9E',
    },
    completeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PHScaleExplorerScreen;
