// Transpiration Tracker Screen - Biology Simulation
// Virtual potometer to measure transpiration rate

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
import Svg, { Rect, Circle, G, Line, Text as SvgText, Path, Ellipse } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 48;

const TranspirationTrackerScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('transpiration-tracker')!;

    const [temperature, setTemperature] = useState(25); // 15-40°C
    const [windSpeed, setWindSpeed] = useState(0); // 0-10 (scale)
    const [humidity, setHumidity] = useState(50); // 0-100%
    const [lightIntensity, setLightIntensity] = useState(50); // 0-100%

    const [bubblePosition, setBubblePosition] = useState(0); // 0-100 (position in capillary)
    const [isRunning, setIsRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [experimentsRun, setExperimentsRun] = useState(0);

    // Calculate transpiration rate
    const calculateRate = () => {
        // Base rate
        let rate = 1;

        // Temperature effect (increases with temp up to ~35°C)
        rate *= 1 + (temperature - 20) * 0.05;

        // Wind effect (increases transpiration)
        rate *= 1 + windSpeed * 0.1;

        // Humidity effect (decreases with high humidity)
        rate *= 1 - humidity * 0.008;

        // Light effect (stomata open in light)
        rate *= 0.2 + (lightIntensity * 0.008);

        return Math.max(0.1, Math.min(5, rate));
    };

    const rate = calculateRate();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && bubblePosition < 100) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
                setBubblePosition(prev => Math.min(100, prev + rate));
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isRunning, rate, bubblePosition]);

    const handleStartStop = () => {
        if (!isRunning) {
            setBubblePosition(0);
            setTimeElapsed(0);
            setExperimentsRun(prev => Math.min(5, prev + 1));
        }
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setBubblePosition(0);
        setTimeElapsed(0);
    };

    const waterUptake = (bubblePosition * 0.1).toFixed(1); // mm³
    const transpirationRate = timeElapsed > 0 ? ((bubblePosition * 0.1) / (timeElapsed * 0.5) * 60).toFixed(2) : '0.00';

    const canTakeQuiz = experimentsRun >= 3;

    const renderPotometer = () => (
        <View style={[styles.potometerContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#E8F5E9' }]}>
            <Svg width={CANVAS_WIDTH} height={220} viewBox={`0 0 ${CANVAS_WIDTH} 220`}>
                {/* Light source */}
                {lightIntensity > 20 && (
                    <G transform={`translate(${CANVAS_WIDTH - 60}, 10)`}>
                        <Circle cx={20} cy={20} r={15} fill={`rgba(255, 235, 59, ${lightIntensity / 100})`} />
                        {lightIntensity > 50 && (
                            <>
                                <Line x1={20} y1={40} x2={20} y2={55} stroke="#FFC107" strokeWidth={2} />
                                <Line x1={35} y1={35} x2={45} y2={45} stroke="#FFC107" strokeWidth={2} />
                                <Line x1={5} y1={35} x2={-5} y2={45} stroke="#FFC107" strokeWidth={2} />
                            </>
                        )}
                    </G>
                )}

                {/* Wind indicator */}
                {windSpeed > 0 && (
                    <G transform="translate(20, 80)">
                        {[...Array(Math.min(3, Math.ceil(windSpeed / 3)))].map((_, i) => (
                            <Path
                                key={i}
                                d={`M ${i * 15} 0 Q ${10 + i * 15} 5 ${i * 15} 10`}
                                stroke="#78909C"
                                strokeWidth={2}
                                fill="none"
                            />
                        ))}
                    </G>
                )}

                {/* Leafy shoot */}
                <G transform={`translate(${CANVAS_WIDTH / 2 - 30}, 20)`}>
                    {/* Stem */}
                    <Rect x={25} y={40} width={10} height={80} fill="#4CAF50" />

                    {/* Leaves */}
                    <Ellipse cx={10} cy={30} rx={20} ry={10} fill="#66BB6A" />
                    <Ellipse cx={50} cy={40} rx={18} ry={9} fill="#66BB6A" />
                    <Ellipse cx={5} cy={55} rx={16} ry={8} fill="#66BB6A" />
                    <Ellipse cx={55} cy={65} rx={17} ry={8} fill="#66BB6A" />
                    <Ellipse cx={30} cy={15} rx={15} ry={8} fill="#81C784" />

                    {/* Water loss arrows (stomata) */}
                    {rate > 1 && (
                        <>
                            <Line x1={10} y1={20} x2={0} y2={10} stroke="#90CAF9" strokeWidth={1} />
                            <Line x1={50} y1={30} x2={60} y2={20} stroke="#90CAF9" strokeWidth={1} />
                        </>
                    )}
                </G>

                {/* Potometer tube (horizontal capillary) */}
                <G transform={`translate(30, 150)`}>
                    {/* Main tube */}
                    <Rect x={0} y={0} width={CANVAS_WIDTH - 80} height={20} rx={5} fill="#E3F2FD" stroke="#90CAF9" strokeWidth={2} />

                    {/* Water in tube */}
                    <Rect x={3} y={3} width={CANVAS_WIDTH - 86} height={14} fill="#BBDEFB" />

                    {/* Air bubble */}
                    <Circle
                        cx={5 + bubblePosition * (CANVAS_WIDTH - 90) / 100}
                        cy={10}
                        r={6}
                        fill="#FFF"
                        stroke="#78909C"
                        strokeWidth={1}
                    />

                    {/* Scale markings */}
                    {[0, 25, 50, 75, 100].map((val) => (
                        <G key={val}>
                            <Line
                                x1={5 + val * (CANVAS_WIDTH - 90) / 100}
                                y1={20}
                                x2={5 + val * (CANVAS_WIDTH - 90) / 100}
                                y2={30}
                                stroke={themedColors.text.secondary}
                                strokeWidth={1}
                            />
                            <SvgText
                                x={5 + val * (CANVAS_WIDTH - 90) / 100}
                                y={42}
                                fontSize={8}
                                fill={themedColors.text.secondary}
                                textAnchor="middle"
                            >
                                {val / 10}mm
                            </SvgText>
                        </G>
                    ))}

                    {/* Reservoir */}
                    <Rect x={CANVAS_WIDTH - 85} y={-15} width={30} height={50} rx={5} fill="#BBDEFB" stroke="#90CAF9" strokeWidth={2} />
                    <SvgText x={CANVAS_WIDTH - 70} y={20} fontSize={8} fill="#1565C0" textAnchor="middle">H₂O</SvgText>
                </G>
            </Svg>

            {/* Readings */}
            <View style={styles.readingsRow}>
                <View style={styles.readingItem}>
                    <Text style={[styles.readingLabel, { color: themedColors.text.secondary }]}>Water Uptake</Text>
                    <Text style={[styles.readingValue, { color: '#2196F3' }]}>{waterUptake} mm³</Text>
                </View>
                <View style={styles.readingItem}>
                    <Text style={[styles.readingLabel, { color: themedColors.text.secondary }]}>Rate</Text>
                    <Text style={[styles.readingValue, { color: '#4CAF50' }]}>{transpirationRate} mm³/min</Text>
                </View>
                <View style={styles.readingItem}>
                    <Text style={[styles.readingLabel, { color: themedColors.text.secondary }]}>Time</Text>
                    <Text style={[styles.readingValue, { color: '#FF9800' }]}>{(timeElapsed * 0.5).toFixed(1)}s</Text>
                </View>
            </View>
        </View>
    );

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
                {/* Potometer Visualization */}
                {renderPotometer()}

                {/* Environmental Controls */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>🌍 Environmental Conditions</Text>

                    <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                        🌡️ Temperature: {temperature}°C
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={15}
                        maximumValue={40}
                        value={temperature}
                        onValueChange={val => setTemperature(Math.round(val))}
                        minimumTrackTintColor="#F44336"
                        thumbTintColor="#F44336"
                        disabled={isRunning}
                    />

                    <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                        💨 Wind Speed: {windSpeed === 0 ? 'Calm' : windSpeed < 5 ? 'Light' : 'Strong'}
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={10}
                        value={windSpeed}
                        onValueChange={val => setWindSpeed(Math.round(val))}
                        minimumTrackTintColor="#78909C"
                        thumbTintColor="#78909C"
                        disabled={isRunning}
                    />

                    <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                        💧 Humidity: {humidity}%
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={humidity}
                        onValueChange={val => setHumidity(Math.round(val))}
                        minimumTrackTintColor="#2196F3"
                        thumbTintColor="#2196F3"
                        disabled={isRunning}
                    />

                    <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                        ☀️ Light Intensity: {lightIntensity}%
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={lightIntensity}
                        onValueChange={val => setLightIntensity(Math.round(val))}
                        minimumTrackTintColor="#FFC107"
                        thumbTintColor="#FFC107"
                        disabled={isRunning}
                    />
                </View>

                {/* Rate Indicator */}
                <View style={[styles.rateCard, { backgroundColor: isDarkMode ? '#2a2a2a' : '#E3F2FD' }]}>
                    <Text style={[styles.rateLabel, { color: themedColors.text.secondary }]}>
                        Current Transpiration Rate Factor:
                    </Text>
                    <Text style={[styles.rateValue, { color: '#00BCD4' }]}>
                        {rate.toFixed(2)}x
                    </Text>
                </View>

                {/* Controls */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.startBtn, isRunning && styles.stopBtn]}
                        onPress={handleStartStop}
                    >
                        <Ionicons name={isRunning ? "stop" : "play"} size={20} color="#FFF" />
                        <Text style={styles.btnText}>{isRunning ? 'Stop' : 'Start'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                        <Ionicons name="refresh" size={20} color="#00BCD4" />
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
    potometerContainer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    readingsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    readingItem: {
        alignItems: 'center',
    },
    readingLabel: {
        fontSize: 10,
        marginBottom: 4,
    },
    readingValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    sliderLabel: {
        fontSize: 13,
        marginBottom: 4,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 8,
    },
    rateCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    rateLabel: {
        fontSize: 13,
    },
    rateValue: {
        fontSize: 20,
        fontWeight: 'bold',
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
        backgroundColor: '#00BCD4',
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
        borderColor: '#00BCD4',
        borderRadius: 12,
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

export default TranspirationTrackerScreen;
