// Statistics Explorer Screen - Mathematics Virtual Lab
// Interactive mean, median, mode, and standard deviation visualization

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 64;
const CHART_HEIGHT = 180;

const StatisticsExplorerScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('statistics-explorer')!;

    const [dataPoints, setDataPoints] = useState<number[]>([4, 7, 2, 9, 4, 5, 8]);
    const [inputValue, setInputValue] = useState('');
    const [showQuiz, setShowQuiz] = useState(false);
    const [highlightMeasure, setHighlightMeasure] = useState<'mean' | 'median' | 'mode' | 'none'>('none');

    // Calculate statistics
    const stats = useMemo(() => {
        if (dataPoints.length === 0) return null;

        const sorted = [...dataPoints].sort((a, b) => a - b);
        const sum = dataPoints.reduce((a, b) => a + b, 0);
        const mean = sum / dataPoints.length;

        // Median
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];

        // Mode
        const freq: { [key: number]: number } = {};
        let maxFreq = 0;
        dataPoints.forEach(n => {
            freq[n] = (freq[n] || 0) + 1;
            maxFreq = Math.max(maxFreq, freq[n]);
        });
        const modes = Object.keys(freq)
            .filter(k => freq[Number(k)] === maxFreq)
            .map(Number);

        // Standard deviation
        const variance = dataPoints.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / dataPoints.length;
        const stdDev = Math.sqrt(variance);

        // Range
        const range = sorted[sorted.length - 1] - sorted[0];

        return { sorted, mean, median, modes, stdDev, variance, range, min: sorted[0], max: sorted[sorted.length - 1] };
    }, [dataPoints]);

    const addDataPoint = () => {
        const value = parseFloat(inputValue);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setDataPoints([...dataPoints, value]);
            setInputValue('');
        }
    };

    const removeDataPoint = (index: number) => {
        setDataPoints(dataPoints.filter((_, i) => i !== index));
    };

    const resetToDefault = () => {
        setDataPoints([4, 7, 2, 9, 4, 5, 8]);
    };

    const addRandomOutlier = () => {
        const outlier = Math.random() > 0.5 ? 95 + Math.floor(Math.random() * 5) : Math.floor(Math.random() * 3);
        setDataPoints([...dataPoints, outlier]);
    };

    const canTakeQuiz = dataPoints.length >= 5;

    // Chart calculations
    const chartData = useMemo(() => {
        if (!stats || dataPoints.length === 0) return [];
        const range = stats.max - stats.min || 1;
        return dataPoints.map((value, index) => ({
            value,
            x: 30 + (index / (dataPoints.length - 1 || 1)) * (CHART_WIDTH - 60),
            y: CHART_HEIGHT - 30 - ((value - stats.min) / range) * (CHART_HEIGHT - 60),
        }));
    }, [dataPoints, stats]);

    if (!stats) return null;

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
                {/* Data Input Section */}
                <View style={[styles.inputSection, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                        📊 Your Data Set
                    </Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: themedColors.background.subtle,
                                color: themedColors.text.primary,
                            }]}
                            value={inputValue}
                            onChangeText={setInputValue}
                            placeholder="Add value (0-100)"
                            placeholderTextColor={themedColors.text.disabled}
                            keyboardType="numeric"
                            onSubmitEditing={addDataPoint}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addDataPoint}>
                            <LinearGradient
                                colors={['#66BB6A', '#43A047']}
                                style={styles.addButtonGradient}
                            >
                                <Ionicons name="add" size={24} color="#FFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dataPointsContainer}>
                        {dataPoints.map((point, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.dataPoint,
                                    highlightMeasure === 'mode' && stats.modes.includes(point) && styles.dataPointHighlighted,
                                ]}
                                onPress={() => removeDataPoint(idx)}
                            >
                                <Text style={styles.dataPointText}>{point}</Text>
                                <Ionicons name="close" size={12} color="#FFF" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={[styles.quickButton, { backgroundColor: '#FF525220' }]}
                            onPress={addRandomOutlier}
                        >
                            <Text style={[styles.quickButtonText, { color: '#FF5252' }]}>
                                Add Outlier
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.quickButton, { backgroundColor: '#2196F320' }]}
                            onPress={resetToDefault}
                        >
                            <Text style={[styles.quickButtonText, { color: '#2196F3' }]}>
                                Reset
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Visualization Chart */}
                <View style={[styles.chartCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.chartTitle, { color: themedColors.text.primary }]}>
                        Data Visualization
                    </Text>
                    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                        {/* Mean line */}
                        {highlightMeasure === 'mean' && (
                            <Line
                                x1={30}
                                y1={CHART_HEIGHT - 30 - ((stats.mean - stats.min) / (stats.max - stats.min || 1)) * (CHART_HEIGHT - 60)}
                                x2={CHART_WIDTH - 30}
                                y2={CHART_HEIGHT - 30 - ((stats.mean - stats.min) / (stats.max - stats.min || 1)) * (CHART_HEIGHT - 60)}
                                stroke="#FF9800"
                                strokeWidth={2}
                                strokeDasharray="6,3"
                            />
                        )}

                        {/* Median line */}
                        {highlightMeasure === 'median' && (
                            <Line
                                x1={30}
                                y1={CHART_HEIGHT - 30 - ((stats.median - stats.min) / (stats.max - stats.min || 1)) * (CHART_HEIGHT - 60)}
                                x2={CHART_WIDTH - 30}
                                y2={CHART_HEIGHT - 30 - ((stats.median - stats.min) / (stats.max - stats.min || 1)) * (CHART_HEIGHT - 60)}
                                stroke="#4CAF50"
                                strokeWidth={2}
                                strokeDasharray="6,3"
                            />
                        )}

                        {/* Data points */}
                        {chartData.map((point, idx) => (
                            <G key={idx}>
                                <Circle
                                    cx={point.x}
                                    cy={point.y}
                                    r={10}
                                    fill={
                                        highlightMeasure === 'mode' && stats.modes.includes(point.value)
                                            ? '#E91E63'
                                            : '#66BB6A'
                                    }
                                    stroke="#FFF"
                                    strokeWidth={2}
                                />
                                <SvgText
                                    x={point.x}
                                    y={point.y + 4}
                                    textAnchor="middle"
                                    fontSize={9}
                                    fill="#FFF"
                                    fontWeight="bold"
                                >
                                    {point.value}
                                </SvgText>
                            </G>
                        ))}
                    </Svg>
                </View>

                {/* Statistics Cards */}
                <View style={styles.statsGrid}>
                    <TouchableOpacity
                        style={[
                            styles.statCard,
                            { backgroundColor: highlightMeasure === 'mean' ? '#FF980030' : themedColors.background.paper }
                        ]}
                        onPress={() => setHighlightMeasure(highlightMeasure === 'mean' ? 'none' : 'mean')}
                    >
                        <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>Mean</Text>
                        <Text style={[styles.statValue, { color: '#FF9800' }]}>
                            {stats.mean.toFixed(2)}
                        </Text>
                        <Text style={[styles.statFormula, { color: themedColors.text.disabled }]}>
                            Σx ÷ n
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.statCard,
                            { backgroundColor: highlightMeasure === 'median' ? '#4CAF5030' : themedColors.background.paper }
                        ]}
                        onPress={() => setHighlightMeasure(highlightMeasure === 'median' ? 'none' : 'median')}
                    >
                        <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>Median</Text>
                        <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                            {stats.median.toFixed(2)}
                        </Text>
                        <Text style={[styles.statFormula, { color: themedColors.text.disabled }]}>
                            Middle value
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.statCard,
                            { backgroundColor: highlightMeasure === 'mode' ? '#E91E6330' : themedColors.background.paper }
                        ]}
                        onPress={() => setHighlightMeasure(highlightMeasure === 'mode' ? 'none' : 'mode')}
                    >
                        <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>Mode</Text>
                        <Text style={[styles.statValue, { color: '#E91E63' }]}>
                            {stats.modes.length <= 3 ? stats.modes.join(', ') : `${stats.modes.length} values`}
                        </Text>
                        <Text style={[styles.statFormula, { color: themedColors.text.disabled }]}>
                            Most frequent
                        </Text>
                    </TouchableOpacity>

                    <View style={[styles.statCard, { backgroundColor: themedColors.background.paper }]}>
                        <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>Std Dev</Text>
                        <Text style={[styles.statValue, { color: '#2196F3' }]}>
                            {stats.stdDev.toFixed(2)}
                        </Text>
                        <Text style={[styles.statFormula, { color: themedColors.text.disabled }]}>
                            √(Σ(x-μ)²/n)
                        </Text>
                    </View>
                </View>

                {/* Additional Stats */}
                <View style={[styles.additionalStats, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.additionalRow}>
                        <Text style={[styles.additionalLabel, { color: themedColors.text.secondary }]}>Range:</Text>
                        <Text style={[styles.additionalValue, { color: themedColors.text.primary }]}>{stats.range}</Text>
                    </View>
                    <View style={styles.additionalRow}>
                        <Text style={[styles.additionalLabel, { color: themedColors.text.secondary }]}>Variance:</Text>
                        <Text style={[styles.additionalValue, { color: themedColors.text.primary }]}>{stats.variance.toFixed(2)}</Text>
                    </View>
                    <View style={styles.additionalRow}>
                        <Text style={[styles.additionalLabel, { color: themedColors.text.secondary }]}>Count (n):</Text>
                        <Text style={[styles.additionalValue, { color: themedColors.text.primary }]}>{dataPoints.length}</Text>
                    </View>
                    <View style={styles.additionalRow}>
                        <Text style={[styles.additionalLabel, { color: themedColors.text.secondary }]}>Sum (Σx):</Text>
                        <Text style={[styles.additionalValue, { color: themedColors.text.primary }]}>{dataPoints.reduce((a, b) => a + b, 0)}</Text>
                    </View>
                </View>

                {/* Insight Card */}
                <View style={[styles.insightCard, { backgroundColor: '#66BB6A15' }]}>
                    <Ionicons name="bulb" size={24} color="#66BB6A" />
                    <View style={styles.insightContent}>
                        <Text style={[styles.insightTitle, { color: '#66BB6A' }]}>
                            Understanding Outliers
                        </Text>
                        <Text style={[styles.insightText, { color: themedColors.text.secondary }]}>
                            Try adding an outlier (very high or low value) and watch how it affects the mean vs. median.
                            The median is more resistant to outliers!
                        </Text>
                    </View>
                </View>

                {/* Knowledge Check */}
                <TouchableOpacity
                    style={[
                        styles.quizButton,
                        { backgroundColor: canTakeQuiz ? '#66BB6A' : themedColors.background.subtle },
                    ]}
                    onPress={() => canTakeQuiz && setShowQuiz(true)}
                    disabled={!canTakeQuiz}
                >
                    <Ionicons
                        name="school"
                        size={24}
                        color={canTakeQuiz ? '#FFF' : themedColors.text.disabled}
                    />
                    <Text
                        style={[
                            styles.quizButtonText,
                            { color: canTakeQuiz ? '#FFF' : themedColors.text.disabled },
                        ]}
                    >
                        Take Knowledge Check
                    </Text>
                </TouchableOpacity>
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
    inputSection: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    addButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    addButtonGradient: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dataPointsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    dataPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#66BB6A',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    dataPointHighlighted: {
        backgroundColor: '#E91E63',
    },
    dataPointText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    quickActions: {
        flexDirection: 'row',
        gap: 10,
    },
    quickButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    quickButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
    chartCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    statCard: {
        width: (width - 48 - 10) / 2,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    statFormula: {
        fontSize: 10,
        marginTop: 4,
        fontFamily: 'monospace',
    },
    additionalStats: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    additionalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    additionalLabel: {
        fontSize: 13,
    },
    additionalValue: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'monospace',
    },
    insightCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        gap: 12,
    },
    insightContent: {
        flex: 1,
    },
    insightTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    insightText: {
        fontSize: 13,
        lineHeight: 18,
    },
    quizButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 10,
    },
    quizButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});

export default StatisticsExplorerScreen;
