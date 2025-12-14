// Enzyme Action Lab Screen - Biology Simulation
// Investigate pH and temperature effects on enzyme activity

import React, { useState, useEffect } from 'react';
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
import Svg, { Rect, Circle, G, Line, Text as SvgText, Path, Polyline, Ellipse } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 80;
const GRAPH_HEIGHT = 120;

const EnzymeActionLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('enzyme-action-lab')!;

    const [temperature, setTemperature] = useState(37); // 0-80°C
    const [pH, setPH] = useState(7); // 1-14
    const [isRunning, setIsRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [starchRemaining, setStarchRemaining] = useState(100);
    const [showQuiz, setShowQuiz] = useState(false);
    const [experimentsRun, setExperimentsRun] = useState(0);

    // Calculate enzyme activity based on temperature and pH
    const calculateActivity = () => {
        // Amylase optimum: 37°C, pH 7
        const tempOptimum = 37;
        const phOptimum = 7;

        // Temperature effect (bell curve)
        let tempFactor: number;
        if (temperature > 60) {
            tempFactor = 0; // Denatured
        } else {
            tempFactor = Math.exp(-Math.pow((temperature - tempOptimum), 2) / 200);
        }

        // pH effect (bell curve around optimum)
        const phFactor = Math.exp(-Math.pow((pH - phOptimum), 2) / 8);

        return tempFactor * phFactor * 10; // Max rate ~10
    };

    const activity = calculateActivity();
    const isDenaturated = temperature > 60;

    // Iodine test color based on starch remaining
    const getIodineColor = () => {
        if (starchRemaining > 80) return '#1A237E'; // Blue-black
        if (starchRemaining > 60) return '#283593';
        if (starchRemaining > 40) return '#3949AB';
        if (starchRemaining > 20) return '#5C6BC0';
        return '#795548'; // Brown (no starch)
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && starchRemaining > 0) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
                setStarchRemaining(prev => Math.max(0, prev - activity));
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isRunning, activity, starchRemaining]);

    const handleStartStop = () => {
        if (!isRunning) {
            setTimeElapsed(0);
            setStarchRemaining(100);
            setExperimentsRun(prev => Math.min(5, prev + 1));
        }
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeElapsed(0);
        setStarchRemaining(100);
    };

    const canTakeQuiz = experimentsRun >= 3;

    const renderActivityGraph = () => {
        // Generate temperature curve data
        const tempData: Array<{ x: number; y: number }> = [];
        for (let t = 0; t <= 80; t += 5) {
            const tempFactor = t > 60 ? 0 : Math.exp(-Math.pow((t - 37), 2) / 200);
            tempData.push({ x: t * (GRAPH_WIDTH / 80), y: GRAPH_HEIGHT - tempFactor * GRAPH_HEIGHT });
        }

        const pathD = tempData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

        return (
            <View style={[styles.graphContainer, { backgroundColor: isDarkMode ? '#2a2a2a' : '#FAFAFA' }]}>
                <Text style={[styles.graphTitle, { color: themedColors.text.primary }]}>
                    Temperature vs Activity
                </Text>
                <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}>
                    {/* Axes */}
                    <Line x1={0} y1={GRAPH_HEIGHT} x2={GRAPH_WIDTH} y2={GRAPH_HEIGHT} stroke={themedColors.text.secondary} strokeWidth={1} />
                    <Line x1={0} y1={0} x2={0} y2={GRAPH_HEIGHT} stroke={themedColors.text.secondary} strokeWidth={1} />

                    {/* Curve */}
                    <Path d={pathD} stroke="#4CAF50" strokeWidth={3} fill="none" />

                    {/* Optimum marker */}
                    <Line x1={37 * (GRAPH_WIDTH / 80)} y1={0} x2={37 * (GRAPH_WIDTH / 80)} y2={GRAPH_HEIGHT} stroke="#FF9800" strokeWidth={1} strokeDasharray="4,4" />
                    <SvgText x={37 * (GRAPH_WIDTH / 80)} y={12} fontSize={8} fill="#FF9800" textAnchor="middle">37°C</SvgText>

                    {/* Denaturation zone */}
                    <Rect x={60 * (GRAPH_WIDTH / 80)} y={0} width={GRAPH_WIDTH - 60 * (GRAPH_WIDTH / 80)} height={GRAPH_HEIGHT} fill="#F4433620" />
                    <SvgText x={70 * (GRAPH_WIDTH / 80)} y={GRAPH_HEIGHT / 2} fontSize={8} fill="#F44336">Denatured</SvgText>

                    {/* Current position */}
                    <Circle
                        cx={temperature * (GRAPH_WIDTH / 80)}
                        cy={GRAPH_HEIGHT - activity / 10 * GRAPH_HEIGHT}
                        r={6}
                        fill={isDenaturated ? '#F44336' : '#4CAF50'}
                    />
                </Svg>
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
                {/* Test Tube Visualization */}
                <View style={[styles.setupContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#E8EAF6' }]}>
                    <View style={styles.tubeRow}>
                        {/* Starch + Amylase tube */}
                        <View style={styles.tubeContainer}>
                            <Svg width={60} height={140}>
                                <Rect x={15} y={10} width={30} height={90} rx={2} fill="transparent" stroke={themedColors.text.primary} strokeWidth={2} />
                                <Ellipse cx={30} cy={100} rx={15} ry={8} fill="transparent" stroke={themedColors.text.primary} strokeWidth={2} />
                                {/* Solution */}
                                <Rect x={17} y={30} width={26} height={68} fill="#E1BEE7" />
                                <Ellipse cx={30} cy={98} rx={13} ry={6} fill="#E1BEE7" />
                            </Svg>
                            <Text style={[styles.tubeLabel, { color: themedColors.text.secondary }]}>Starch +</Text>
                            <Text style={[styles.tubeLabel, { color: themedColors.text.secondary }]}>Amylase</Text>
                        </View>

                        {/* Arrow */}
                        <Ionicons name="arrow-forward" size={24} color={themedColors.text.secondary} />

                        {/* Iodine test result */}
                        <View style={styles.tubeContainer}>
                            <Svg width={60} height={140}>
                                <Rect x={15} y={10} width={30} height={90} rx={2} fill="transparent" stroke={themedColors.text.primary} strokeWidth={2} />
                                <Ellipse cx={30} cy={100} rx={15} ry={8} fill="transparent" stroke={themedColors.text.primary} strokeWidth={2} />
                                {/* Solution with iodine */}
                                <Rect x={17} y={30} width={26} height={68} fill={getIodineColor()} opacity={0.8} />
                                <Ellipse cx={30} cy={98} rx={13} ry={6} fill={getIodineColor()} opacity={0.8} />
                            </Svg>
                            <Text style={[styles.tubeLabel, { color: themedColors.text.secondary }]}>Iodine</Text>
                            <Text style={[styles.tubeLabel, { color: themedColors.text.secondary }]}>Test</Text>
                        </View>
                    </View>

                    {/* Status */}
                    <View style={styles.statusRow}>
                        <Text style={[styles.statusText, { color: themedColors.text.primary }]}>
                            Starch: {starchRemaining.toFixed(0)}%
                        </Text>
                        <Text style={[styles.statusText, { color: themedColors.text.primary }]}>
                            Time: {timeElapsed}s
                        </Text>
                    </View>

                    {isDenaturated && (
                        <View style={styles.warningBanner}>
                            <Ionicons name="warning" size={16} color="#F44336" />
                            <Text style={styles.warningText}>Enzyme denatured! No activity.</Text>
                        </View>
                    )}
                </View>

                {/* Activity Graph */}
                {renderActivityGraph()}

                {/* Controls */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>
                        🌡️ Temperature: {temperature}°C
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={80}
                        value={temperature}
                        onValueChange={val => setTemperature(Math.round(val))}
                        minimumTrackTintColor={temperature > 60 ? '#F44336' : '#FF9800'}
                        thumbTintColor={temperature > 60 ? '#F44336' : '#FF9800'}
                        disabled={isRunning}
                    />

                    <Text style={[styles.controlLabel, { color: themedColors.text.primary, marginTop: 16 }]}>
                        ⚗️ pH: {pH}
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={14}
                        value={pH}
                        onValueChange={val => setPH(Math.round(val))}
                        minimumTrackTintColor={pH < 6 ? '#F44336' : pH > 8 ? '#2196F3' : '#4CAF50'}
                        thumbTintColor={pH < 6 ? '#F44336' : pH > 8 ? '#2196F3' : '#4CAF50'}
                        disabled={isRunning}
                    />
                    <View style={styles.phScale}>
                        <Text style={{ color: '#F44336', fontSize: 10 }}>Acidic</Text>
                        <Text style={{ color: '#4CAF50', fontSize: 10 }}>Neutral</Text>
                        <Text style={{ color: '#2196F3', fontSize: 10 }}>Alkaline</Text>
                    </View>
                </View>

                {/* Activity Display */}
                <View style={[styles.activityCard, { backgroundColor: isDenaturated ? '#FFEBEE' : '#E8F5E9' }]}>
                    <Text style={{ color: isDenaturated ? '#F44336' : '#4CAF50', fontSize: 14 }}>
                        Enzyme Activity: {isDenaturated ? '0 (Denatured)' : activity.toFixed(1)} units
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.startBtn, isRunning && styles.stopBtn]}
                        onPress={handleStartStop}
                    >
                        <Ionicons name={isRunning ? "stop" : "play"} size={20} color="#FFF" />
                        <Text style={styles.btnText}>{isRunning ? 'Stop' : 'Start'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                        <Ionicons name="refresh" size={20} color="#9C27B0" />
                    </TouchableOpacity>
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
                        {canTakeQuiz ? 'Take Knowledge Check' : `Run ${3 - experimentsRun} more experiments`}
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
    setupContainer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    tubeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    tubeContainer: {
        alignItems: 'center',
    },
    tubeLabel: {
        fontSize: 10,
        marginTop: 4,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 12,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: 8,
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
    },
    warningText: {
        color: '#F44336',
        fontSize: 12,
        fontWeight: '600',
    },
    graphContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    graphTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    controlLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    phScale: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    activityCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    startBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9C27B0',
        padding: 14,
        borderRadius: 12,
        gap: 8,
    },
    stopBtn: {
        backgroundColor: '#F44336',
    },
    btnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    resetBtn: {
        width: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#9C27B0',
        borderRadius: 12,
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9C27B0',
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

export default EnzymeActionLabScreen;
