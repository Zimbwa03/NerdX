// Sequences & Series Lab Screen - Mathematics Virtual Lab
// Interactive arithmetic and geometric sequence visualization

import React, { useState, useMemo } from 'react';
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
import Slider from '@react-native-community/slider';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 32;
const CHART_HEIGHT = 200;

const SequencesSeriesLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('sequences-series-lab')!;

    const [mode, setMode] = useState<'arithmetic' | 'geometric'>('arithmetic');
    const [firstTerm, setFirstTerm] = useState(2);
    const [commonDiff, setCommonDiff] = useState(3);
    const [commonRatio, setCommonRatio] = useState(2);
    const [numTerms, setNumTerms] = useState(8);
    const [showQuiz, setShowQuiz] = useState(false);

    // Generate sequence
    const sequence = useMemo(() => {
        const seq: number[] = [];
        for (let i = 0; i < numTerms; i++) {
            if (mode === 'arithmetic') {
                seq.push(firstTerm + i * commonDiff);
            } else {
                seq.push(firstTerm * Math.pow(commonRatio, i));
            }
        }
        return seq;
    }, [mode, firstTerm, commonDiff, commonRatio, numTerms]);

    // Calculate sum
    const sum = useMemo(() => {
        if (mode === 'arithmetic') {
            return (numTerms / 2) * (2 * firstTerm + (numTerms - 1) * commonDiff);
        } else {
            if (commonRatio === 1) return firstTerm * numTerms;
            return firstTerm * (1 - Math.pow(commonRatio, numTerms)) / (1 - commonRatio);
        }
    }, [mode, firstTerm, commonDiff, commonRatio, numTerms]);

    // Infinite sum (geometric only)
    const infiniteSum = useMemo(() => {
        if (mode === 'geometric' && Math.abs(commonRatio) < 1) {
            return firstTerm / (1 - commonRatio);
        }
        return null;
    }, [mode, firstTerm, commonRatio]);

    const maxVal = Math.max(...sequence.map(Math.abs), 1);
    const minVal = Math.min(...sequence, 0);

    // Chart helpers
    const getBarHeight = (val: number) => {
        const range = maxVal - minVal || 1;
        return ((val - minVal) / range) * (CHART_HEIGHT - 50);
    };

    const getNthTermFormula = () => {
        if (mode === 'arithmetic') {
            return `Tₙ = ${firstTerm} + (n-1)×${commonDiff}`;
        }
        return `Tₙ = ${firstTerm} × ${commonRatio}ⁿ⁻¹`;
    };

    const getSumFormula = () => {
        if (mode === 'arithmetic') {
            return `Sₙ = n/2 × (2a + (n-1)d)`;
        }
        return `Sₙ = a(1 - rⁿ)/(1 - r)`;
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
                {/* Mode Selector */}
                <View style={[styles.modeSelector, { backgroundColor: themedColors.background.paper }]}>
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'arithmetic' && styles.modeActive]}
                        onPress={() => setMode('arithmetic')}
                    >
                        <Text style={[styles.modeText, { color: mode === 'arithmetic' ? '#FFF' : themedColors.text.primary }]}>
                            Arithmetic
                        </Text>
                        <Text style={[styles.modeSubtext, { color: mode === 'arithmetic' ? '#FFFFFFAA' : themedColors.text.secondary }]}>
                            +d each term
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'geometric' && styles.modeActiveGeo]}
                        onPress={() => setMode('geometric')}
                    >
                        <Text style={[styles.modeText, { color: mode === 'geometric' ? '#FFF' : themedColors.text.primary }]}>
                            Geometric
                        </Text>
                        <Text style={[styles.modeSubtext, { color: mode === 'geometric' ? '#FFFFFFAA' : themedColors.text.secondary }]}>
                            ×r each term
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Sequence Display */}
                <View style={[styles.sequenceCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        Sequence Terms
                    </Text>
                    <View style={styles.termsContainer}>
                        {sequence.slice(0, 10).map((term, idx) => (
                            <View key={idx} style={styles.termWrapper}>
                                <Text style={[styles.termIndex, { color: themedColors.text.secondary }]}>T{idx + 1}</Text>
                                <View style={[styles.termBox, { backgroundColor: mode === 'arithmetic' ? '#42A5F520' : '#AB47BC20' }]}>
                                    <Text style={[styles.termValue, { color: mode === 'arithmetic' ? '#42A5F5' : '#AB47BC' }]}>
                                        {term > 1000 ? term.toExponential(1) : Number.isInteger(term) ? term : term.toFixed(2)}
                                    </Text>
                                </View>
                                {idx < Math.min(sequence.length - 1, 9) && (
                                    <Text style={[styles.arrowText, { color: themedColors.text.disabled }]}>
                                        {mode === 'arithmetic' ? `+${commonDiff}` : `×${commonRatio}`}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Bar Chart */}
                <View style={[styles.chartCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        Visual Representation
                    </Text>
                    <Svg width={CHART_WIDTH - 32} height={CHART_HEIGHT}>
                        {sequence.slice(0, 10).map((val, idx) => {
                            const barWidth = (CHART_WIDTH - 60) / Math.min(numTerms, 10) - 4;
                            const x = 10 + idx * (barWidth + 4);
                            const barH = getBarHeight(val);
                            const y = CHART_HEIGHT - 25 - barH;

                            return (
                                <G key={idx}>
                                    <Rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={barH}
                                        rx={4}
                                        fill={mode === 'arithmetic' ? '#42A5F5' : '#AB47BC'}
                                        opacity={0.8}
                                    />
                                    <SvgText
                                        x={x + barWidth / 2}
                                        y={CHART_HEIGHT - 8}
                                        textAnchor="middle"
                                        fontSize={10}
                                        fill={themedColors.text.secondary}
                                    >
                                        {idx + 1}
                                    </SvgText>
                                </G>
                            );
                        })}
                    </Svg>
                </View>

                {/* Controls */}
                <View style={[styles.controlsCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.controlRow}>
                        <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>
                            First term (a): {firstTerm}
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-5}
                            maximumValue={10}
                            step={1}
                            value={firstTerm}
                            onValueChange={setFirstTerm}
                            minimumTrackTintColor={mode === 'arithmetic' ? '#42A5F5' : '#AB47BC'}
                            thumbTintColor={mode === 'arithmetic' ? '#42A5F5' : '#AB47BC'}
                        />
                    </View>

                    {mode === 'arithmetic' ? (
                        <View style={styles.controlRow}>
                            <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>
                                Common difference (d): {commonDiff}
                            </Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={-5}
                                maximumValue={10}
                                step={1}
                                value={commonDiff}
                                onValueChange={setCommonDiff}
                                minimumTrackTintColor="#42A5F5"
                                thumbTintColor="#42A5F5"
                            />
                        </View>
                    ) : (
                        <View style={styles.controlRow}>
                            <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>
                                Common ratio (r): {commonRatio.toFixed(1)}
                            </Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0.2}
                                maximumValue={3}
                                step={0.1}
                                value={commonRatio}
                                onValueChange={(val) => setCommonRatio(Math.round(val * 10) / 10)}
                                minimumTrackTintColor="#AB47BC"
                                thumbTintColor="#AB47BC"
                            />
                        </View>
                    )}

                    <View style={styles.controlRow}>
                        <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>
                            Number of terms (n): {numTerms}
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={3}
                            maximumValue={15}
                            step={1}
                            value={numTerms}
                            onValueChange={setNumTerms}
                            minimumTrackTintColor="#FF9800"
                            thumbTintColor="#FF9800"
                        />
                    </View>
                </View>

                {/* Formulas & Results */}
                <View style={[styles.resultsCard, { backgroundColor: mode === 'arithmetic' ? '#42A5F515' : '#AB47BC15' }]}>
                    <View style={styles.resultRow}>
                        <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>nth term formula:</Text>
                        <Text style={[styles.resultFormula, { color: mode === 'arithmetic' ? '#42A5F5' : '#AB47BC' }]}>
                            {getNthTermFormula()}
                        </Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>Sum formula:</Text>
                        <Text style={[styles.resultFormula, { color: mode === 'arithmetic' ? '#42A5F5' : '#AB47BC' }]}>
                            {getSumFormula()}
                        </Text>
                    </View>
                    <View style={[styles.sumBox, { backgroundColor: themedColors.background.paper }]}>
                        <Text style={[styles.sumLabel, { color: themedColors.text.secondary }]}>
                            Sum of {numTerms} terms (S{numTerms})
                        </Text>
                        <Text style={[styles.sumValue, { color: mode === 'arithmetic' ? '#42A5F5' : '#AB47BC' }]}>
                            {Math.abs(sum) > 10000 ? sum.toExponential(2) : sum.toFixed(2)}
                        </Text>
                    </View>

                    {infiniteSum !== null && (
                        <View style={[styles.sumBox, { backgroundColor: '#00E67620' }]}>
                            <Text style={[styles.sumLabel, { color: '#00C853' }]}>
                                Infinite sum (S∞) — converges since |r| &lt; 1
                            </Text>
                            <Text style={[styles.sumValue, { color: '#00C853' }]}>
                                {infiniteSum.toFixed(3)}
                            </Text>
                        </View>
                    )}

                    {mode === 'geometric' && Math.abs(commonRatio) >= 1 && (
                        <View style={[styles.warningBox]}>
                            <Ionicons name="warning" size={18} color="#FF5252" />
                            <Text style={styles.warningText}>
                                Series diverges (|r| ≥ 1)
                            </Text>
                        </View>
                    )}
                </View>

                {/* Knowledge Check */}
                <TouchableOpacity
                    style={styles.quizButton}
                    onPress={() => setShowQuiz(true)}
                >
                    <LinearGradient
                        colors={mode === 'arithmetic' ? ['#42A5F5', '#1E88E5'] : ['#AB47BC', '#8E24AA']}
                        style={styles.quizGradient}
                    >
                        <Ionicons name="school" size={24} color="#FFF" />
                        <Text style={styles.quizButtonText}>Take Knowledge Check</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>

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
    container: { flex: 1 },
    content: { flex: 1 },
    contentContainer: { padding: 16, paddingBottom: 40 },
    modeSelector: { flexDirection: 'row', borderRadius: 16, padding: 6, marginBottom: 16 },
    modeButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    modeActive: { backgroundColor: '#42A5F5' },
    modeActiveGeo: { backgroundColor: '#AB47BC' },
    modeText: { fontSize: 15, fontWeight: '600' },
    modeSubtext: { fontSize: 11, marginTop: 2 },
    sequenceCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
    cardTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
    termsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
    termWrapper: { alignItems: 'center' },
    termIndex: { fontSize: 10, marginBottom: 2 },
    termBox: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
    termValue: { fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
    arrowText: { fontSize: 9, marginTop: 2, fontStyle: 'italic' },
    chartCard: { padding: 16, borderRadius: 16, marginBottom: 16, alignItems: 'center' },
    controlsCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
    controlRow: { marginBottom: 14 },
    controlLabel: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
    slider: { width: '100%', height: 36 },
    resultsCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
    resultRow: { marginBottom: 10 },
    resultLabel: { fontSize: 12, marginBottom: 2 },
    resultFormula: { fontSize: 16, fontWeight: '600', fontFamily: 'monospace' },
    sumBox: { padding: 12, borderRadius: 12, marginTop: 10, alignItems: 'center' },
    sumLabel: { fontSize: 12, marginBottom: 4 },
    sumValue: { fontSize: 28, fontWeight: '700' },
    warningBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, backgroundColor: '#FF525220', padding: 10, borderRadius: 10 },
    warningText: { color: '#FF5252', fontSize: 13, fontWeight: '500' },
    quizButton: { borderRadius: 16, overflow: 'hidden' },
    quizGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 10 },
    quizButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default SequencesSeriesLabScreen;
