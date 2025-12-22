// Photosynthesis Reactor Screen - Biology Simulation
// Multi-variable photosynthesis investigation

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
import Svg, { Rect, Circle, G, Line, Text as SvgText, Path, Ellipse } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 48;

const PhotosynthesisReactorScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('photosynthesis-reactor')!;

    const [lightIntensity, setLightIntensity] = useState(50); // 0-100%
    const [co2Level, setCo2Level] = useState(50); // 0-100%
    const [temperature, setTemperature] = useState(25); // 10-45°C
    const [bubbleCount, setBubbleCount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [experimentsRun, setExperimentsRun] = useState(0);

    // Calculate rate based on limiting factor
    const calculateRate = () => {
        // Rate is limited by the lowest factor
        const lightFactor = lightIntensity / 100;
        const co2Factor = co2Level / 100;
        // Temperature has an optimum around 30°C
        const tempFactor = temperature <= 30
            ? temperature / 30
            : Math.max(0, 1 - (temperature - 30) / 15);

        const limitingFactor = Math.min(lightFactor, co2Factor, tempFactor);
        return Math.round(limitingFactor * 30); // bubbles per interval
    };

    const bubbleRate = calculateRate();

    // Determine limiting factor
    const getLimitingFactor = () => {
        const lightFactor = lightIntensity / 100;
        const co2Factor = co2Level / 100;
        const tempFactor = temperature <= 30
            ? temperature / 30
            : Math.max(0, 1 - (temperature - 30) / 15);

        if (lightFactor <= co2Factor && lightFactor <= tempFactor) return 'Light intensity';
        if (co2Factor <= lightFactor && co2Factor <= tempFactor) return 'CO₂ concentration';
        return 'Temperature';
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setBubbleCount(prev => prev + bubbleRate);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, bubbleRate]);

    const handleStartStop = () => {
        if (!isRunning) {
            setBubbleCount(0);
            setExperimentsRun(prev => Math.min(5, prev + 1));
        }
        setIsRunning(!isRunning);
    };

    const canTakeQuiz = experimentsRun >= 3;

    const renderSetup = () => (
        <View style={[styles.setupContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#F1F8E9' }]}>
            <Svg width={CANVAS_WIDTH} height={200} viewBox={`0 0 ${CANVAS_WIDTH} 200`}>
                {/* Light source */}
                <G transform={`translate(${CANVAS_WIDTH / 2 - 30}, 5)`}>
                    <Ellipse cx={30} cy={15} rx={25} ry={15} fill={`rgba(255, 235, 59, ${lightIntensity / 100})`} />
                    <Circle cx={30} cy={15} r={8} fill="#FFEB3B" />
                    {lightIntensity > 30 && (
                        <>
                            <Line x1={30} y1={35} x2={30} y2={50} stroke="#FFC107" strokeWidth={2} />
                            <Line x1={10} y1={30} x2={0} y2={45} stroke="#FFC107" strokeWidth={2} />
                            <Line x1={50} y1={30} x2={60} y2={45} stroke="#FFC107" strokeWidth={2} />
                        </>
                    )}
                </G>

                {/* Beaker with pondweed */}
                <G transform={`translate(${CANVAS_WIDTH / 2 - 50}, 60)`}>
                    {/* Beaker */}
                    <Rect x={0} y={0} width={100} height={120} rx={5} fill="#E3F2FD" stroke="#90CAF9" strokeWidth={2} />

                    {/* Water */}
                    <Rect x={3} y={10} width={94} height={107} fill="#BBDEFB" opacity={0.5} />

                    {/* Pondweed (Elodea) */}
                    <Path d="M 50 110 Q 45 90 50 70 Q 55 50 50 30" stroke="#4CAF50" strokeWidth={4} fill="none" />
                    <Ellipse cx={48} cy={40} rx={8} ry={5} fill="#66BB6A" />
                    <Ellipse cx={52} cy={55} rx={7} ry={4} fill="#66BB6A" />
                    <Ellipse cx={48} cy={70} rx={8} ry={5} fill="#66BB6A" />
                    <Ellipse cx={52} cy={85} rx={7} ry={4} fill="#66BB6A" />

                    {/* Bubbles (oxygen) */}
                    {isRunning && bubbleRate > 0 && (
                        <>
                            <Circle cx={50} cy={25} r={4} fill="#E3F2FD" opacity={0.8} />
                            <Circle cx={55} cy={35} r={3} fill="#E3F2FD" opacity={0.8} />
                            <Circle cx={48} cy={18} r={3} fill="#E3F2FD" opacity={0.8} />
                            {bubbleRate > 10 && <Circle cx={52} cy={12} r={4} fill="#E3F2FD" opacity={0.8} />}
                            {bubbleRate > 20 && <Circle cx={46} cy={8} r={3} fill="#E3F2FD" opacity={0.8} />}
                        </>
                    )}
                </G>

                {/* CO2 indicator */}
                <SvgText x={20} y={100} fontSize={10} fill="#4CAF50">CO₂</SvgText>
                <Rect x={20} y={105} width={8} height={60 * (co2Level / 100)} fill="#81C784" transform={`translate(0, ${60 - 60 * (co2Level / 100)})`} />

                {/* Bubble counter */}
                <G transform={`translate(${CANVAS_WIDTH - 60}, 80)`}>
                    <Rect x={0} y={0} width={50} height={60} rx={5} fill="#37474F" />
                    <SvgText x={25} y={25} fontSize={9} fill="#FFF" textAnchor="middle">COUNT</SvgText>
                    <SvgText x={25} y={45} fontSize={16} fill="#4CAF50" textAnchor="middle" fontWeight="bold">{bubbleCount}</SvgText>
                </G>
            </Svg>

            {/* Rate display */}
            <View style={styles.rateDisplay}>
                <Text style={[styles.rateLabel, { color: themedColors.text.secondary }]}>Rate:</Text>
                <Text style={[styles.rateValue, { color: '#4CAF50' }]}>{bubbleRate} bubbles/min</Text>
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
                {/* Setup Visualization */}
                {renderSetup()}

                {/* Variable Controls */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>☀️ Light Intensity: {lightIntensity}%</Text>
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

                    <Text style={[styles.cardTitle, { color: themedColors.text.primary, marginTop: 12 }]}>🌫️ CO₂ Level: {co2Level}%</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={co2Level}
                        onValueChange={val => setCo2Level(Math.round(val))}
                        minimumTrackTintColor="#4CAF50"
                        thumbTintColor="#4CAF50"
                        disabled={isRunning}
                    />

                    <Text style={[styles.cardTitle, { color: themedColors.text.primary, marginTop: 12 }]}>🌡️ Temperature: {temperature}°C</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={10}
                        maximumValue={45}
                        value={temperature}
                        onValueChange={val => setTemperature(Math.round(val))}
                        minimumTrackTintColor="#F44336"
                        thumbTintColor="#F44336"
                        disabled={isRunning}
                    />
                    {temperature > 40 && (
                        <Text style={styles.warningText}>⚠️ Enzymes denaturing!</Text>
                    )}
                </View>

                {/* Limiting Factor Display */}
                <View style={[styles.limitingCard, { backgroundColor: isDarkMode ? '#2a2a2a' : '#FFF8E1' }]}>
                    <Text style={[styles.limitingLabel, { color: themedColors.text.secondary }]}>
                        Limiting Factor:
                    </Text>
                    <Text style={[styles.limitingValue, { color: '#FF9800' }]}>
                        {getLimitingFactor()}
                    </Text>
                </View>

                {/* Start/Stop Button */}
                <TouchableOpacity
                    style={[styles.startBtn, isRunning && styles.stopBtn]}
                    onPress={handleStartStop}
                >
                    <Ionicons name={isRunning ? "stop" : "play"} size={20} color="#FFF" />
                    <Text style={styles.startBtnText}>{isRunning ? 'Stop Experiment' : 'Start Counting'}</Text>
                </TouchableOpacity>

                {/* Equation */}
                <View style={[styles.equationCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.equationTitle, { color: themedColors.text.primary }]}>Photosynthesis Equation</Text>
                    <Text style={[styles.equation, { color: '#4CAF50' }]}>
                        6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂
                    </Text>
                    <Text style={[styles.equationNote, { color: themedColors.text.secondary }]}>
                        light + chlorophyll
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
    setupContainer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    rateDisplay: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    rateLabel: {
        fontSize: 14,
    },
    rateValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    warningText: {
        color: '#F44336',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    limitingCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    limitingLabel: {
        fontSize: 14,
    },
    limitingValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    startBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    stopBtn: {
        backgroundColor: '#F44336',
    },
    startBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    equationCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    equationTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    equation: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    equationNote: {
        fontSize: 11,
        fontStyle: 'italic',
        marginTop: 4,
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
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

export default PhotosynthesisReactorScreen;
