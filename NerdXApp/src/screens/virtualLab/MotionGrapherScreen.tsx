// Motion Grapher Screen - Physics Simulation
// Create and interpret distance-time and velocity-time graphs

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Line, Rect, Circle, Text as SvgText, G, Path, Polyline } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 80;
const GRAPH_HEIGHT = 150;

type GraphType = 'distance-time' | 'velocity-time';

interface DataPoint {
    x: number;
    y: number;
}

const MotionGrapherScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('motion-grapher')!;

    const [graphType, setGraphType] = useState<GraphType>('distance-time');
    const [velocity, setVelocity] = useState(0); // -5 to 5 m/s
    const [distance, setDistance] = useState(0);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [distanceData, setDistanceData] = useState<DataPoint[]>([{ x: 0, y: 0 }]);
    const [velocityData, setVelocityData] = useState<DataPoint[]>([{ x: 0, y: 0 }]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [experimentsRun, setExperimentsRun] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning && time < 10) {
            intervalRef.current = setInterval(() => {
                setTime(prev => {
                    const newTime = Math.min(10, prev + 0.5);
                    return newTime;
                });
                setDistance(prev => Math.max(0, Math.min(100, prev + velocity * 0.5)));

                // Record data points
                setDistanceData(prev => [...prev, { x: time + 0.5, y: distance + velocity * 0.5 }]);
                setVelocityData(prev => [...prev, { x: time + 0.5, y: velocity }]);
            }, 500);
        } else if (time >= 10) {
            setIsRunning(false);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, time, velocity, distance]);

    const handleReset = () => {
        setTime(0);
        setDistance(0);
        setVelocity(0);
        setIsRunning(false);
        setDistanceData([{ x: 0, y: 0 }]);
        setVelocityData([{ x: 0, y: 0 }]);
        if (experimentsRun < 5) {
            setExperimentsRun(prev => prev + 1);
        }
    };

    const handleVelocityChange = (delta: number) => {
        setVelocity(prev => Math.max(-5, Math.min(5, prev + delta)));
    };

    // Convert data to SVG path
    const getGraphPath = (data: DataPoint[], maxY: number): string => {
        if (data.length === 0) return '';

        const scaleX = GRAPH_WIDTH / 10; // 10 seconds max
        const scaleY = GRAPH_HEIGHT / maxY;

        let path = `M ${data[0].x * scaleX} ${GRAPH_HEIGHT - data[0].y * scaleY}`;
        data.forEach((point, i) => {
            if (i > 0) {
                path += ` L ${point.x * scaleX} ${GRAPH_HEIGHT - Math.max(0, point.y) * scaleY}`;
            }
        });
        return path;
    };

    const canTakeQuiz = experimentsRun >= 2;

    const renderGraph = () => {
        const data = graphType === 'distance-time' ? distanceData : velocityData;
        const maxY = graphType === 'distance-time' ? 100 : 10;
        const yLabel = graphType === 'distance-time' ? 'Distance (m)' : 'Velocity (m/s)';
        const graphColor = graphType === 'distance-time' ? '#2196F3' : '#4CAF50';

        return (
            <View style={[styles.graphContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA' }]}>
                <Text style={[styles.graphTitle, { color: themedColors.text.primary }]}>
                    {graphType === 'distance-time' ? '📊 Distance-Time Graph' : '📈 Velocity-Time Graph'}
                </Text>

                <View style={styles.graphWrapper}>
                    <Text style={[styles.yLabel, { color: themedColors.text.secondary }]}>{yLabel}</Text>

                    <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}>
                        {/* Grid */}
                        {[0, 25, 50, 75, 100].map((pct) => (
                            <Line
                                key={pct}
                                x1={0}
                                y1={GRAPH_HEIGHT * (1 - pct / 100)}
                                x2={GRAPH_WIDTH}
                                y2={GRAPH_HEIGHT * (1 - pct / 100)}
                                stroke={themedColors.text.secondary + '20'}
                                strokeWidth={1}
                            />
                        ))}
                        {[0, 2, 4, 6, 8, 10].map((sec) => (
                            <Line
                                key={sec}
                                x1={sec * (GRAPH_WIDTH / 10)}
                                y1={0}
                                x2={sec * (GRAPH_WIDTH / 10)}
                                y2={GRAPH_HEIGHT}
                                stroke={themedColors.text.secondary + '20'}
                                strokeWidth={1}
                            />
                        ))}

                        {/* Axes */}
                        <Line x1={0} y1={GRAPH_HEIGHT} x2={GRAPH_WIDTH} y2={GRAPH_HEIGHT} stroke={themedColors.text.primary} strokeWidth={2} />
                        <Line x1={0} y1={0} x2={0} y2={GRAPH_HEIGHT} stroke={themedColors.text.primary} strokeWidth={2} />

                        {/* Graph line */}
                        <Path
                            d={getGraphPath(data, maxY)}
                            stroke={graphColor}
                            strokeWidth={3}
                            fill="none"
                        />

                        {/* Current point */}
                        {data.length > 0 && (
                            <Circle
                                cx={data[data.length - 1].x * (GRAPH_WIDTH / 10)}
                                cy={GRAPH_HEIGHT - Math.max(0, data[data.length - 1].y) * (GRAPH_HEIGHT / maxY)}
                                r={6}
                                fill={graphColor}
                            />
                        )}
                    </Svg>

                    <Text style={[styles.xLabel, { color: themedColors.text.secondary }]}>Time (s)</Text>
                </View>

                {/* Graph type selector */}
                <View style={styles.graphTypeRow}>
                    <TouchableOpacity
                        style={[styles.graphTypeBtn, graphType === 'distance-time' && styles.graphTypeBtnActive]}
                        onPress={() => setGraphType('distance-time')}
                    >
                        <Text style={{ color: graphType === 'distance-time' ? '#2196F3' : themedColors.text.secondary }}>
                            d-t Graph
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.graphTypeBtn, graphType === 'velocity-time' && styles.graphTypeBtnActive]}
                        onPress={() => setGraphType('velocity-time')}
                    >
                        <Text style={{ color: graphType === 'velocity-time' ? '#4CAF50' : themedColors.text.secondary }}>
                            v-t Graph
                        </Text>
                    </TouchableOpacity>
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
                {/* Object visualization */}
                <View style={[styles.trackContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#E8EAF6' }]}>
                    <View style={styles.track}>
                        <View
                            style={[
                                styles.object,
                                { left: `${distance}%` }
                            ]}
                        >
                            <Text style={styles.objectIcon}>🚗</Text>
                        </View>
                    </View>
                    <View style={styles.trackLabels}>
                        <Text style={[styles.trackLabel, { color: themedColors.text.secondary }]}>0m</Text>
                        <Text style={[styles.trackLabel, { color: themedColors.text.secondary }]}>50m</Text>
                        <Text style={[styles.trackLabel, { color: themedColors.text.secondary }]}>100m</Text>
                    </View>
                </View>

                {/* Controls */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>Time</Text>
                            <Text style={[styles.statValue, { color: '#2196F3' }]}>{time.toFixed(1)}s</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>Distance</Text>
                            <Text style={[styles.statValue, { color: '#4CAF50' }]}>{distance.toFixed(1)}m</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>Velocity</Text>
                            <Text style={[styles.statValue, { color: velocity >= 0 ? '#FF9800' : '#F44336' }]}>{velocity}m/s</Text>
                        </View>
                    </View>

                    <Text style={[styles.controlTitle, { color: themedColors.text.primary }]}>Velocity Control</Text>
                    <View style={styles.velocityControls}>
                        <TouchableOpacity
                            style={[styles.velocityBtn, { backgroundColor: '#F44336' }]}
                            onPress={() => handleVelocityChange(-1)}
                            disabled={isRunning}
                        >
                            <Ionicons name="remove" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.velocityDisplay}>
                            <Text style={[styles.velocityValue, { color: velocity >= 0 ? '#4CAF50' : '#F44336' }]}>
                                {velocity > 0 ? '+' : ''}{velocity} m/s
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.velocityBtn, { backgroundColor: '#4CAF50' }]}
                            onPress={() => handleVelocityChange(1)}
                            disabled={isRunning}
                        >
                            <Ionicons name="add" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.playBtn, isRunning && styles.pauseBtn]}
                            onPress={() => setIsRunning(!isRunning)}
                            disabled={time >= 10}
                        >
                            <Ionicons name={isRunning ? "pause" : "play"} size={20} color="#FFF" />
                            <Text style={styles.playBtnText}>{isRunning ? 'Pause' : 'Start'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                            <Ionicons name="refresh" size={20} color="#FF9800" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Graph */}
                {renderGraph()}

                {/* Info */}
                <View style={[styles.infoCard, { backgroundColor: isDarkMode ? '#2a2a2a' : '#E3F2FD' }]}>
                    <Text style={[styles.infoTitle, { color: themedColors.text.primary }]}>💡 Key Points</Text>
                    <Text style={[styles.infoText, { color: themedColors.text.secondary }]}>
                        • Gradient of d-t graph = speed{'\n'}
                        • Area under v-t graph = distance{'\n'}
                        • Horizontal line on d-t = stationary{'\n'}
                        • Horizontal line on v-t = constant velocity
                    </Text>
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
                        {canTakeQuiz ? 'Take Knowledge Check' : `Run ${2 - experimentsRun} more experiments`}
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
    trackContainer: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
    },
    track: {
        height: 50,
        backgroundColor: '#455A64',
        borderRadius: 8,
        position: 'relative',
        marginBottom: 8,
    },
    object: {
        position: 'absolute',
        top: 5,
        transform: [{ translateX: -15 }],
    },
    objectIcon: {
        fontSize: 30,
    },
    trackLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    trackLabel: {
        fontSize: 10,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#00000010',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 11,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    controlTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    velocityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 16,
    },
    velocityBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    velocityDisplay: {
        width: 100,
        alignItems: 'center',
    },
    velocityValue: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    playBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 10,
        gap: 8,
    },
    pauseBtn: {
        backgroundColor: '#FF9800',
    },
    playBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    resetBtn: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF9800',
        borderRadius: 10,
    },
    graphContainer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    graphTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    graphWrapper: {
        alignItems: 'center',
    },
    yLabel: {
        position: 'absolute',
        left: -40,
        top: 60,
        transform: [{ rotate: '-90deg' }],
        fontSize: 10,
    },
    xLabel: {
        fontSize: 10,
        marginTop: 8,
    },
    graphTypeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginTop: 16,
    },
    graphTypeBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00000020',
    },
    graphTypeBtnActive: {
        backgroundColor: '#00000010',
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        lineHeight: 20,
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
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

export default MotionGrapherScreen;
