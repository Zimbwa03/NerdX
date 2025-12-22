// Thermal Expansion Screen - Physics Simulation
// Observe expansion of solids, liquids, and gases

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
import Svg, { Rect, Circle, G, Ellipse, Path, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 48;

type MaterialState = 'solid' | 'liquid' | 'gas';

const ThermalExpansionScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('thermal-expansion')!;

    const [selectedState, setSelectedState] = useState<MaterialState>('solid');
    const [temperature, setTemperature] = useState(20); // Celsius
    const [showQuiz, setShowQuiz] = useState(false);
    const [experimentsRun, setExperimentsRun] = useState(0);

    // Calculate expansion based on temperature
    const getExpansion = (temp: number, state: MaterialState): number => {
        const baseTemp = 20;
        const tempDiff = temp - baseTemp;

        switch (state) {
            case 'solid':
                return 1 + (tempDiff * 0.001); // Small expansion
            case 'liquid':
                return 1 + (tempDiff * 0.003); // Medium expansion
            case 'gas':
                return 1 + (tempDiff * 0.01); // Large expansion
            default:
                return 1;
        }
    };

    const expansion = getExpansion(temperature, selectedState);
    const expansionPercent = ((expansion - 1) * 100).toFixed(2);

    // Ball and ring experiment for solid
    const ballRadius = 25 * expansion;
    const ringRadius = 27;
    const ballFitsRing = ballRadius < ringRadius;

    // Thermometer height for liquid
    const liquidHeight = 60 + (temperature * 0.8);

    // Particle speed for gas (animation)
    const particleSpeed = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(particleSpeed, {
            toValue: temperature / 100,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [temperature]);

    const handleExperiment = () => {
        setExperimentsRun(prev => Math.min(prev + 1, 4));
    };

    const canTakeQuiz = experimentsRun >= 2;

    const renderSolidExperiment = () => (
        <View style={styles.experimentArea}>
            <Text style={[styles.experimentTitle, { color: themedColors.text.primary }]}>
                🔵 Ball and Ring Experiment
            </Text>

            <Svg width={CANVAS_WIDTH} height={180} viewBox={`0 0 ${CANVAS_WIDTH} 180`}>
                {/* Stand */}
                <Rect x={CANVAS_WIDTH / 2 - 5} y={140} width={10} height={40} fill="#795548" />
                <Rect x={CANVAS_WIDTH / 2 - 40} y={175} width={80} height={5} fill="#795548" />

                {/* Ring */}
                <Circle cx={CANVAS_WIDTH / 2} cy={100} r={ringRadius} fill="transparent" stroke="#607D8B" strokeWidth={4} />
                <Circle cx={CANVAS_WIDTH / 2} cy={100} r={ringRadius - 4} fill="transparent" stroke="#607D8B" strokeWidth={2} />

                {/* Ball */}
                <Circle
                    cx={CANVAS_WIDTH / 2}
                    cy={60}
                    r={ballRadius}
                    fill={temperature > 50 ? '#F44336' : temperature > 30 ? '#FF9800' : '#2196F3'}
                />

                {/* Heat indicator */}
                {temperature > 50 && (
                    <G>
                        <Path d={`M ${CANVAS_WIDTH / 2 - 15} 85 Q ${CANVAS_WIDTH / 2 - 20} 95 ${CANVAS_WIDTH / 2 - 10} 100`} stroke="#FF5722" strokeWidth={2} fill="none" />
                        <Path d={`M ${CANVAS_WIDTH / 2 + 15} 85 Q ${CANVAS_WIDTH / 2 + 20} 95 ${CANVAS_WIDTH / 2 + 10} 100`} stroke="#FF5722" strokeWidth={2} fill="none" />
                    </G>
                )}
            </Svg>

            <View style={[
                styles.resultBox,
                { backgroundColor: ballFitsRing ? '#4CAF5020' : '#F4433620' }
            ]}>
                <Ionicons
                    name={ballFitsRing ? "checkmark-circle" : "close-circle"}
                    size={20}
                    color={ballFitsRing ? '#4CAF50' : '#F44336'}
                />
                <Text style={{ color: ballFitsRing ? '#4CAF50' : '#F44336', fontWeight: '600' }}>
                    Ball {ballFitsRing ? 'FITS' : 'DOES NOT FIT'} through ring
                </Text>
            </View>
        </View>
    );

    const renderLiquidExperiment = () => (
        <View style={styles.experimentArea}>
            <Text style={[styles.experimentTitle, { color: themedColors.text.primary }]}>
                🌡️ Mercury Thermometer
            </Text>

            <Svg width={CANVAS_WIDTH} height={200} viewBox={`0 0 ${CANVAS_WIDTH} 200`}>
                {/* Thermometer tube */}
                <Rect
                    x={CANVAS_WIDTH / 2 - 8}
                    y={20}
                    width={16}
                    height={140}
                    rx={8}
                    fill="#E0E0E0"
                    stroke="#BDBDBD"
                    strokeWidth={2}
                />

                {/* Mercury bulb */}
                <Circle cx={CANVAS_WIDTH / 2} cy={165} r={20} fill="#F44336" />

                {/* Mercury column */}
                <Rect
                    x={CANVAS_WIDTH / 2 - 5}
                    y={160 - liquidHeight}
                    width={10}
                    height={liquidHeight}
                    fill="#F44336"
                    rx={5}
                />

                {/* Scale markings */}
                {[0, 25, 50, 75, 100].map((temp, i) => (
                    <G key={temp}>
                        <Line
                            x1={CANVAS_WIDTH / 2 + 15}
                            y1={160 - (temp * 0.8) - 60}
                            x2={CANVAS_WIDTH / 2 + 25}
                            y2={160 - (temp * 0.8) - 60}
                            stroke={themedColors.text.secondary}
                            strokeWidth={1}
                        />
                        <SvgText
                            x={CANVAS_WIDTH / 2 + 30}
                            y={160 - (temp * 0.8) - 56}
                            fontSize={10}
                            fill={themedColors.text.secondary}
                        >
                            {temp}°C
                        </SvgText>
                    </G>
                ))}
            </Svg>

            <Text style={[styles.expansionText, { color: themedColors.text.secondary }]}>
                Liquid expands ~{(expansion * 100 - 100).toFixed(1)}% from 20°C
            </Text>
        </View>
    );

    const renderGasExperiment = () => {
        // Generate random particle positions
        const particles = Array.from({ length: 15 }, (_, i) => ({
            x: 50 + Math.random() * (CANVAS_WIDTH - 100),
            y: 30 + Math.random() * 140,
            speedFactor: 0.5 + Math.random() * 1.5,
        }));

        return (
            <View style={styles.experimentArea}>
                <Text style={[styles.experimentTitle, { color: themedColors.text.primary }]}>
                    💨 Gas in Syringe
                </Text>

                <Svg width={CANVAS_WIDTH} height={200} viewBox={`0 0 ${CANVAS_WIDTH} 200`}>
                    {/* Syringe body */}
                    <Rect
                        x={30}
                        y={50}
                        width={CANVAS_WIDTH * 0.5 * expansion}
                        height={100}
                        rx={5}
                        fill={isDarkMode ? '#333' : '#E3F2FD'}
                        stroke="#1976D2"
                        strokeWidth={2}
                    />

                    {/* Plunger */}
                    <Rect
                        x={30 + CANVAS_WIDTH * 0.5 * expansion - 10}
                        y={40}
                        width={20}
                        height={120}
                        rx={3}
                        fill="#1976D2"
                    />
                    <Rect
                        x={30 + CANVAS_WIDTH * 0.5 * expansion + 5}
                        y={90}
                        width={50}
                        height={20}
                        rx={3}
                        fill="#1565C0"
                    />

                    {/* Gas particles */}
                    {particles.map((p, i) => (
                        <Circle
                            key={i}
                            cx={Math.min(p.x * expansion, 30 + CANVAS_WIDTH * 0.5 * expansion - 30)}
                            cy={p.y}
                            r={temperature > 60 ? 6 : 4}
                            fill={temperature > 60 ? '#F44336' : temperature > 40 ? '#FF9800' : '#2196F3'}
                            opacity={0.8}
                        />
                    ))}
                </Svg>

                <Text style={[styles.expansionText, { color: themedColors.text.secondary }]}>
                    Gas volume expands ~{(expansion * 100 - 100).toFixed(0)}% from 20°C
                </Text>
                <Text style={[styles.noteText, { color: themedColors.text.secondary }]}>
                    Particles move faster and spread out more at higher temperatures
                </Text>
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
                {/* State Selector */}
                <View style={styles.stateSelector}>
                    {(['solid', 'liquid', 'gas'] as MaterialState[]).map((state) => (
                        <TouchableOpacity
                            key={state}
                            style={[
                                styles.stateBtn,
                                selectedState === state && styles.stateBtnActive,
                                { borderColor: selectedState === state ? '#FF5722' : themedColors.text.secondary + '40' }
                            ]}
                            onPress={() => setSelectedState(state)}
                        >
                            <Text style={[
                                styles.stateBtnText,
                                { color: selectedState === state ? '#FF5722' : themedColors.text.secondary }
                            ]}>
                                {state === 'solid' ? '🔵' : state === 'liquid' ? '💧' : '💨'} {state.charAt(0).toUpperCase() + state.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Experiment Visualization */}
                <View style={[styles.experimentCard, { backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }]}>
                    {selectedState === 'solid' && renderSolidExperiment()}
                    {selectedState === 'liquid' && renderLiquidExperiment()}
                    {selectedState === 'gas' && renderGasExperiment()}
                </View>

                {/* Temperature Control */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        🌡️ Temperature: {temperature}°C
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={temperature}
                        onValueChange={setTemperature}
                        minimumTrackTintColor="#F44336"
                        maximumTrackTintColor={themedColors.text.secondary + '40'}
                        thumbTintColor="#F44336"
                    />
                    <View style={styles.tempLabels}>
                        <Text style={[styles.tempLabel, { color: '#2196F3' }]}>0°C (Cold)</Text>
                        <Text style={[styles.tempLabel, { color: '#F44336' }]}>100°C (Hot)</Text>
                    </View>
                </View>

                {/* Info Card */}
                <View style={[styles.card, { backgroundColor: isDarkMode ? '#2a2a2a' : '#FFF3E0' }]}>
                    <Text style={[styles.infoTitle, { color: themedColors.text.primary }]}>
                        💡 Key Point
                    </Text>
                    <Text style={[styles.infoText, { color: themedColors.text.secondary }]}>
                        {selectedState === 'solid'
                            ? 'Solids expand the least because particles are tightly packed and can only vibrate in place.'
                            : selectedState === 'liquid'
                                ? 'Liquids expand more than solids as particles have more freedom to move apart.'
                                : 'Gases expand the most because particles are free to move and spread out significantly.'}
                    </Text>
                </View>

                {/* Record Button */}
                <TouchableOpacity style={styles.recordBtn} onPress={handleExperiment}>
                    <Ionicons name="add-circle" size={20} color="#FFF" />
                    <Text style={styles.recordBtnText}>Record Observation ({experimentsRun}/4)</Text>
                </TouchableOpacity>

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
                        {canTakeQuiz ? 'Take Knowledge Check' : `Record ${2 - experimentsRun} more observations`}
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
    stateSelector: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    stateBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
    },
    stateBtnActive: {
        backgroundColor: '#FF572210',
    },
    stateBtnText: {
        fontSize: 12,
        fontWeight: '600',
    },
    experimentCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    experimentArea: {
        alignItems: 'center',
    },
    experimentTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    resultBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
        marginTop: 12,
    },
    expansionText: {
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
    },
    noteText: {
        fontSize: 11,
        marginTop: 4,
        textAlign: 'center',
        fontStyle: 'italic',
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
    slider: {
        width: '100%',
        height: 40,
    },
    tempLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tempLabel: {
        fontSize: 11,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        lineHeight: 20,
    },
    recordBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF5722',
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    recordBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF5722',
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

export default ThermalExpansionScreen;
