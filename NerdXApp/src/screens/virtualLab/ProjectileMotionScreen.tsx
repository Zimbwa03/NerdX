// Projectile Motion Screen - Physics Simulation
// Launch projectiles and analyze trajectories

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Svg, { Circle, Line, Polyline, G, Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 48;
const CANVAS_HEIGHT = 250;
const GROUND_Y = CANVAS_HEIGHT - 30;
const LAUNCH_X = 40;
const LAUNCH_Y = GROUND_Y - 10;

interface TrajectoryPoint {
    x: number;
    y: number;
    t: number;
}

const ProjectileMotionScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('projectile-motion')!;

    const [angle, setAngle] = useState(45); // degrees
    const [velocity, setVelocity] = useState(30); // m/s
    const [gravity, setGravity] = useState(10); // m/s²
    const [isLaunched, setIsLaunched] = useState(false);
    const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
    const [currentPosition, setCurrentPosition] = useState({ x: LAUNCH_X, y: LAUNCH_Y });
    const [showQuiz, setShowQuiz] = useState(false);
    const [launches, setLaunches] = useState(0);

    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    // Convert degrees to radians
    const angleRad = (angle * Math.PI) / 180;

    // Calculate physics values
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);

    // Time of flight (until y = 0)
    const timeOfFlight = (2 * vy) / gravity;

    // Maximum height
    const maxHeight = (vy * vy) / (2 * gravity);

    // Range
    const range = vx * timeOfFlight;

    // Scale factors for visualization
    const SCALE = Math.min((CANVAS_WIDTH - 60) / range, (GROUND_Y - 40) / maxHeight) * 0.8 || 1;

    const calculateTrajectory = (): TrajectoryPoint[] => {
        const points: TrajectoryPoint[] = [];
        const dt = 0.05;

        for (let t = 0; t <= timeOfFlight; t += dt) {
            const x = vx * t;
            const y = vy * t - 0.5 * gravity * t * t;

            if (y >= 0) {
                points.push({
                    x: LAUNCH_X + x * SCALE,
                    y: LAUNCH_Y - y * SCALE,
                    t,
                });
            }
        }

        return points;
    };

    const launchProjectile = () => {
        if (isLaunched) return;

        setIsLaunched(true);
        const trajectoryPoints = calculateTrajectory();
        setTrajectory(trajectoryPoints);

        let pointIndex = 0;
        startTimeRef.current = Date.now();

        const animate = () => {
            if (pointIndex < trajectoryPoints.length) {
                setCurrentPosition(trajectoryPoints[pointIndex]);
                pointIndex++;
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // Animation complete
                setLaunches(prev => prev + 1);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    const resetLaunch = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        setIsLaunched(false);
        setCurrentPosition({ x: LAUNCH_X, y: LAUNCH_Y });
        setTrajectory([]);
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const canTakeQuiz = launches >= 3;

    const renderTrajectoryPath = () => {
        if (trajectory.length < 2) return null;

        const pathData = trajectory.map(p => `${p.x},${p.y}`).join(' ');

        return (
            <Polyline
                points={pathData}
                stroke="#4CAF50"
                strokeWidth={2}
                fill="none"
                strokeDasharray="5,3"
            />
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
                {/* Canvas */}
                <View style={[styles.canvasContainer, { backgroundColor: isDarkMode ? '#1a2a3a' : '#E3F2FD' }]}>
                    <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                        {/* Sky gradient background */}
                        <Rect x={0} y={0} width={CANVAS_WIDTH} height={GROUND_Y} fill="transparent" />

                        {/* Ground */}
                        <Rect x={0} y={GROUND_Y} width={CANVAS_WIDTH} height={30} fill="#8D6E63" />
                        <Line x1={0} y1={GROUND_Y} x2={CANVAS_WIDTH} y2={GROUND_Y} stroke="#5D4037" strokeWidth={2} />

                        {/* Grid lines */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <G key={`grid-${i}`}>
                                <Line
                                    x1={(i + 1) * CANVAS_WIDTH / 5}
                                    y1={0}
                                    x2={(i + 1) * CANVAS_WIDTH / 5}
                                    y2={GROUND_Y}
                                    stroke={themedColors.text.secondary + '20'}
                                    strokeWidth={1}
                                />
                                <Line
                                    x1={0}
                                    y1={i * GROUND_Y / 4}
                                    x2={CANVAS_WIDTH}
                                    y2={i * GROUND_Y / 4}
                                    stroke={themedColors.text.secondary + '20'}
                                    strokeWidth={1}
                                />
                            </G>
                        ))}

                        {/* Launcher */}
                        <G>
                            <Rect x={20} y={LAUNCH_Y - 20} width={40} height={30} fill="#795548" />
                            <Line
                                x1={LAUNCH_X}
                                y1={LAUNCH_Y}
                                x2={LAUNCH_X + 40 * Math.cos(angleRad)}
                                y2={LAUNCH_Y - 40 * Math.sin(angleRad)}
                                stroke="#607D8B"
                                strokeWidth={6}
                                strokeLinecap="round"
                            />
                            {/* Angle arc */}
                            <SvgText x={LAUNCH_X + 50} y={LAUNCH_Y - 5} fontSize={10} fill={themedColors.text.secondary}>
                                {angle}°
                            </SvgText>
                        </G>

                        {/* Trajectory path */}
                        {renderTrajectoryPath()}

                        {/* Max height marker */}
                        {isLaunched && maxHeight > 0 && (
                            <G>
                                <Line
                                    x1={LAUNCH_X + (range * SCALE) / 2}
                                    y1={LAUNCH_Y - maxHeight * SCALE}
                                    x2={LAUNCH_X + (range * SCALE) / 2 + 10}
                                    y2={LAUNCH_Y - maxHeight * SCALE}
                                    stroke="#FF9800"
                                    strokeWidth={2}
                                />
                                <SvgText
                                    x={LAUNCH_X + (range * SCALE) / 2 + 15}
                                    y={LAUNCH_Y - maxHeight * SCALE + 4}
                                    fontSize={9}
                                    fill="#FF9800"
                                >
                                    H_max
                                </SvgText>
                            </G>
                        )}

                        {/* Range marker */}
                        {isLaunched && range > 0 && (
                            <G>
                                <Line
                                    x1={LAUNCH_X + range * SCALE}
                                    y1={GROUND_Y}
                                    x2={LAUNCH_X + range * SCALE}
                                    y2={GROUND_Y - 15}
                                    stroke="#2196F3"
                                    strokeWidth={2}
                                />
                                <SvgText
                                    x={LAUNCH_X + range * SCALE - 10}
                                    y={GROUND_Y + 18}
                                    fontSize={9}
                                    fill="#2196F3"
                                >
                                    Range
                                </SvgText>
                            </G>
                        )}

                        {/* Projectile */}
                        <Circle
                            cx={currentPosition.x}
                            cy={currentPosition.y}
                            r={8}
                            fill="#F44336"
                            stroke="#B71C1C"
                            strokeWidth={2}
                        />
                    </Svg>
                </View>

                {/* Controls */}
                <View style={[styles.controlsCard, { backgroundColor: themedColors.background.paper }]}>
                    {/* Angle */}
                    <View style={styles.sliderRow}>
                        <View style={styles.sliderHeader}>
                            <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                                Launch Angle
                            </Text>
                            <Text style={[styles.sliderValue, { color: '#00BCD4' }]}>{angle}°</Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={10}
                            maximumValue={80}
                            value={angle}
                            onValueChange={(val) => {
                                if (!isLaunched) setAngle(Math.round(val));
                            }}
                            minimumTrackTintColor="#00BCD4"
                            maximumTrackTintColor={themedColors.text.secondary + '40'}
                            thumbTintColor="#00BCD4"
                            disabled={isLaunched}
                        />
                    </View>

                    {/* Velocity */}
                    <View style={styles.sliderRow}>
                        <View style={styles.sliderHeader}>
                            <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                                Initial Velocity
                            </Text>
                            <Text style={[styles.sliderValue, { color: '#4CAF50' }]}>{velocity} m/s</Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={10}
                            maximumValue={50}
                            value={velocity}
                            onValueChange={(val) => {
                                if (!isLaunched) setVelocity(Math.round(val));
                            }}
                            minimumTrackTintColor="#4CAF50"
                            maximumTrackTintColor={themedColors.text.secondary + '40'}
                            thumbTintColor="#4CAF50"
                            disabled={isLaunched}
                        />
                    </View>
                </View>

                {/* Launch/Reset Buttons */}
                <View style={styles.buttonRow}>
                    {!isLaunched ? (
                        <TouchableOpacity style={styles.launchButton} onPress={launchProjectile}>
                            <Ionicons name="rocket" size={24} color="#FFF" />
                            <Text style={styles.launchButtonText}>Launch!</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.resetButton} onPress={resetLaunch}>
                            <Ionicons name="refresh" size={24} color="#FFF" />
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Results */}
                <View style={[styles.resultsCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.resultsTitle, { color: themedColors.text.primary }]}>
                        📊 Calculations
                    </Text>

                    <View style={styles.resultsGrid}>
                        <View style={[styles.resultItem, { backgroundColor: isDarkMode ? '#1a2a3a' : '#E3F2FD' }]}>
                            <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>Max Height</Text>
                            <Text style={[styles.resultValue, { color: '#FF9800' }]}>
                                {maxHeight.toFixed(1)} m
                            </Text>
                        </View>
                        <View style={[styles.resultItem, { backgroundColor: isDarkMode ? '#1a2a3a' : '#E8F5E9' }]}>
                            <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>Range</Text>
                            <Text style={[styles.resultValue, { color: '#4CAF50' }]}>
                                {range.toFixed(1)} m
                            </Text>
                        </View>
                        <View style={[styles.resultItem, { backgroundColor: isDarkMode ? '#1a2a3a' : '#E1BEE7' }]}>
                            <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>Time of Flight</Text>
                            <Text style={[styles.resultValue, { color: '#9C27B0' }]}>
                                {timeOfFlight.toFixed(2)} s
                            </Text>
                        </View>
                        <View style={[styles.resultItem, { backgroundColor: isDarkMode ? '#1a2a3a' : '#FFEBEE' }]}>
                            <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>Vx (horizontal)</Text>
                            <Text style={[styles.resultValue, { color: '#F44336' }]}>
                                {vx.toFixed(1)} m/s
                            </Text>
                        </View>
                    </View>

                    {/* Key insight */}
                    <View style={[styles.insightBox, { backgroundColor: '#FFD70020' }]}>
                        <Ionicons name="bulb" size={18} color="#FFD700" />
                        <Text style={[styles.insightText, { color: themedColors.text.primary }]}>
                            {angle === 45
                                ? "✨ 45° gives maximum range!"
                                : angle < 45
                                    ? "Try increasing the angle towards 45° for more range"
                                    : "Try decreasing angle towards 45° for more range"}
                        </Text>
                    </View>
                </View>

                {/* Progress */}
                <View style={[styles.progressCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.progressTitle, { color: themedColors.text.primary }]}>
                        🚀 Launches: {launches}/3
                    </Text>
                    <View style={[styles.progressBar, { backgroundColor: themedColors.background.subtle }]}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${Math.min(100, (launches / 3) * 100)}%` }
                            ]}
                        />
                    </View>
                </View>

                {/* Complete Button */}
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        !canTakeQuiz && styles.completeButtonDisabled
                    ]}
                    onPress={() => setShowQuiz(true)}
                    disabled={!canTakeQuiz}
                >
                    <Text style={styles.completeButtonText}>
                        {canTakeQuiz ? 'Take Knowledge Check' : `Launch ${3 - launches} more times`}
                    </Text>
                    <Ionicons name={canTakeQuiz ? "arrow-forward" : "lock-closed"} size={20} color="#FFF" />
                </TouchableOpacity>
            </ScrollView>

            {/* Knowledge Check */}
            <KnowledgeCheck
                visible={showQuiz}
                simulation={simulation}
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
    canvasContainer: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    controlsCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    sliderRow: {
        marginBottom: 16,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    sliderLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    sliderValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    buttonRow: {
        marginBottom: 16,
    },
    launchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F44336',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    launchButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resetButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#607D8B',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    resetButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultsCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    resultsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    resultsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    resultItem: {
        width: '47%',
        padding: 12,
        borderRadius: 8,
    },
    resultLabel: {
        fontSize: 11,
        marginBottom: 4,
    },
    resultValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    insightBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 10,
    },
    insightText: {
        flex: 1,
        fontSize: 13,
    },
    progressCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#00BCD4',
        borderRadius: 4,
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00BCD4',
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

export default ProjectileMotionScreen;
