// Electrolysis Simulator Screen - Chemistry Simulation
// Perform electrolysis and observe electrode reactions

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

interface Electrolyte {
    id: string;
    name: string;
    formula: string;
    cathodeProduct: string;
    anodeProduct: string;
    cathodeHalfEq: string;
    anodeHalfEq: string;
    cathodeColor: string;
    anodeColor: string;
}

const ELECTROLYTES: Electrolyte[] = [
    {
        id: 'water',
        name: 'Dilute Sulfuric Acid',
        formula: 'H₂SO₄(aq)',
        cathodeProduct: 'Hydrogen (H₂)',
        anodeProduct: 'Oxygen (O₂)',
        cathodeHalfEq: '2H⁺ + 2e⁻ → H₂',
        anodeHalfEq: '4OH⁻ → O₂ + 2H₂O + 4e⁻',
        cathodeColor: '#E3F2FD',
        anodeColor: '#E3F2FD',
    },
    {
        id: 'nacl',
        name: 'Concentrated Sodium Chloride',
        formula: 'NaCl(conc)',
        cathodeProduct: 'Hydrogen (H₂)',
        anodeProduct: 'Chlorine (Cl₂)',
        cathodeHalfEq: '2H⁺ + 2e⁻ → H₂',
        anodeHalfEq: '2Cl⁻ → Cl₂ + 2e⁻',
        cathodeColor: '#E3F2FD',
        anodeColor: '#DCEDC8',
    },
    {
        id: 'cuso4',
        name: 'Copper(II) Sulfate',
        formula: 'CuSO₄(aq)',
        cathodeProduct: 'Copper (Cu)',
        anodeProduct: 'Oxygen (O₂)',
        cathodeHalfEq: 'Cu²⁺ + 2e⁻ → Cu',
        anodeHalfEq: '4OH⁻ → O₂ + 2H₂O + 4e⁻',
        cathodeColor: '#FFCCBC',
        anodeColor: '#E3F2FD',
    },
];

const ElectrolysisSimulatorScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('electrolysis-simulator')!;

    const [selectedElectrolyte, setSelectedElectrolyte] = useState(ELECTROLYTES[0]);
    const [voltage, setVoltage] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [bubbleCount, setBubbleCount] = useState({ cathode: 0, anode: 0 });
    const [showQuiz, setShowQuiz] = useState(false);
    const [experimentsRun, setExperimentsRun] = useState(0);

    const bubbleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isRunning && voltage > 0) {
            const interval = setInterval(() => {
                setBubbleCount(prev => ({
                    cathode: prev.cathode + Math.floor(voltage / 3),
                    anode: prev.anode + Math.floor(voltage / 4),
                }));
            }, 500);

            Animated.loop(
                Animated.timing(bubbleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();

            return () => clearInterval(interval);
        }
    }, [isRunning, voltage]);

    const handleStart = () => {
        setIsRunning(true);
        if (experimentsRun < 5) {
            setExperimentsRun(prev => prev + 1);
        }
    };

    const handleStop = () => {
        setIsRunning(false);
        bubbleAnim.stopAnimation();
    };

    const handleReset = () => {
        setIsRunning(false);
        setBubbleCount({ cathode: 0, anode: 0 });
        setVoltage(0);
    };

    const canTakeQuiz = experimentsRun >= 2;

    const renderElectrolysisCell = () => (
        <View style={[styles.cellContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }]}>
            <Svg width={CANVAS_WIDTH} height={220} viewBox={`0 0 ${CANVAS_WIDTH} 220`}>
                {/* Battery/Power source */}
                <Rect x={CANVAS_WIDTH / 2 - 40} y={5} width={80} height={30} rx={5} fill="#37474F" />
                <Text fontSize={10} fill="#FFF" x={CANVAS_WIDTH / 2 - 15} y={25}>DC Power</Text>
                <SvgText x={CANVAS_WIDTH / 2 - 35} y={22} fontSize={14} fill="#F44336" fontWeight="bold">−</SvgText>
                <SvgText x={CANVAS_WIDTH / 2 + 30} y={22} fontSize={14} fill="#4CAF50" fontWeight="bold">+</SvgText>

                {/* Wires */}
                <Line x1={CANVAS_WIDTH / 2 - 40} y1={20} x2={60} y2={20} stroke="#F44336" strokeWidth={3} />
                <Line x1={60} y1={20} x2={60} y2={70} stroke="#F44336" strokeWidth={3} />
                <Line x1={CANVAS_WIDTH / 2 + 40} y1={20} x2={CANVAS_WIDTH - 60} y2={20} stroke="#4CAF50" strokeWidth={3} />
                <Line x1={CANVAS_WIDTH - 60} y1={20} x2={CANVAS_WIDTH - 60} y2={70} stroke="#4CAF50" strokeWidth={3} />

                {/* Beaker */}
                <Path
                    d={`M 30 70 L 30 200 Q 30 210 40 210 L ${CANVAS_WIDTH - 40} 210 Q ${CANVAS_WIDTH - 30} 210 ${CANVAS_WIDTH - 30} 200 L ${CANVAS_WIDTH - 30} 70`}
                    fill="#E3F2FD"
                    stroke="#90CAF9"
                    strokeWidth={3}
                />

                {/* Electrolyte solution */}
                <Rect x={33} y={90} width={CANVAS_WIDTH - 66} height={117} fill="#BBDEFB" opacity={0.6} />

                {/* Cathode (negative) */}
                <Rect x={50} y={70} width={20} height={120} fill="#616161" />
                <SvgText x={45} y={205} fontSize={12} fill="#F44336">Cathode (−)</SvgText>

                {/* Anode (positive) */}
                <Rect x={CANVAS_WIDTH - 70} y={70} width={20} height={120} fill="#616161" />
                <SvgText x={CANVAS_WIDTH - 85} y={205} fontSize={12} fill="#4CAF50">Anode (+)</SvgText>

                {/* Bubbles at cathode */}
                {isRunning && voltage > 0 && (
                    <G>
                        <Circle cx={60} cy={140} r={4} fill={selectedElectrolyte.cathodeColor} opacity={0.8} />
                        <Circle cx={55} cy={120} r={3} fill={selectedElectrolyte.cathodeColor} opacity={0.8} />
                        <Circle cx={65} cy={130} r={5} fill={selectedElectrolyte.cathodeColor} opacity={0.8} />
                        <Circle cx={58} cy={105} r={3} fill={selectedElectrolyte.cathodeColor} opacity={0.8} />
                    </G>
                )}

                {/* Bubbles at anode */}
                {isRunning && voltage > 0 && (
                    <G>
                        <Circle cx={CANVAS_WIDTH - 60} cy={145} r={4} fill={selectedElectrolyte.anodeColor} opacity={0.8} />
                        <Circle cx={CANVAS_WIDTH - 55} cy={125} r={3} fill={selectedElectrolyte.anodeColor} opacity={0.8} />
                        <Circle cx={CANVAS_WIDTH - 65} cy={135} r={5} fill={selectedElectrolyte.anodeColor} opacity={0.8} />
                        <Circle cx={CANVAS_WIDTH - 58} cy={110} r={3} fill={selectedElectrolyte.anodeColor} opacity={0.8} />
                    </G>
                )}

                {/* Copper deposit (for CuSO4) */}
                {isRunning && selectedElectrolyte.id === 'cuso4' && (
                    <Rect x={50} y={170} width={20} height={20} fill="#E65100" opacity={0.7} />
                )}

                {/* Solution label */}
                <SvgText x={CANVAS_WIDTH / 2} y={150} fontSize={11} fill="#1565C0" textAnchor="middle">
                    {selectedElectrolyte.formula}
                </SvgText>
            </Svg>

            {/* Voltage display */}
            <View style={styles.voltageDisplay}>
                <Ionicons name="flash" size={18} color="#FF9800" />
                <Text style={styles.voltageText}>{voltage}V</Text>
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
                {/* Electrolysis Cell */}
                {renderElectrolysisCell()}

                {/* Electrolyte Selection */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        🧪 Select Electrolyte
                    </Text>
                    <View style={styles.electrolyteOptions}>
                        {ELECTROLYTES.map((elec) => (
                            <TouchableOpacity
                                key={elec.id}
                                style={[
                                    styles.electrolyteBtn,
                                    selectedElectrolyte.id === elec.id && styles.electrolyteBtnActive,
                                    { borderColor: selectedElectrolyte.id === elec.id ? '#FF9800' : 'transparent' }
                                ]}
                                onPress={() => { setSelectedElectrolyte(elec); handleReset(); }}
                                disabled={isRunning}
                            >
                                <Text style={[
                                    styles.electrolyteName,
                                    { color: selectedElectrolyte.id === elec.id ? '#FF9800' : themedColors.text.primary }
                                ]}>
                                    {elec.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Voltage Control */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        ⚡ Voltage: {voltage}V
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={12}
                        value={voltage}
                        onValueChange={val => setVoltage(Math.round(val))}
                        minimumTrackTintColor="#FF9800"
                        thumbTintColor="#FF9800"
                        disabled={isRunning}
                    />

                    <View style={styles.controlRow}>
                        <TouchableOpacity
                            style={[styles.startBtn, isRunning && styles.stopBtn]}
                            onPress={isRunning ? handleStop : handleStart}
                            disabled={voltage === 0 && !isRunning}
                        >
                            <Ionicons name={isRunning ? "stop" : "play"} size={20} color="#FFF" />
                            <Text style={styles.btnText}>{isRunning ? 'Stop' : 'Start'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                            <Ionicons name="refresh" size={20} color="#607D8B" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Products Display */}
                <View style={[styles.card, { backgroundColor: isDarkMode ? '#2a2a2a' : '#E8F5E9' }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        🔬 Electrode Products
                    </Text>

                    <View style={styles.productsRow}>
                        <View style={styles.productCard}>
                            <Text style={[styles.productLabel, { color: '#F44336' }]}>Cathode (−)</Text>
                            <Text style={[styles.productName, { color: themedColors.text.primary }]}>
                                {selectedElectrolyte.cathodeProduct}
                            </Text>
                            <Text style={[styles.halfEq, { color: themedColors.text.secondary }]}>
                                {selectedElectrolyte.cathodeHalfEq}
                            </Text>
                        </View>

                        <View style={styles.productCard}>
                            <Text style={[styles.productLabel, { color: '#4CAF50' }]}>Anode (+)</Text>
                            <Text style={[styles.productName, { color: themedColors.text.primary }]}>
                                {selectedElectrolyte.anodeProduct}
                            </Text>
                            <Text style={[styles.halfEq, { color: themedColors.text.secondary }]}>
                                {selectedElectrolyte.anodeHalfEq}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Key Points */}
                <View style={[styles.infoCard, { backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF3E0' }]}>
                    <Text style={[styles.infoTitle, { color: themedColors.text.primary }]}>💡 Remember</Text>
                    <Text style={[styles.infoText, { color: themedColors.text.secondary }]}>
                        • Cations (+) go to cathode (−){'\n'}
                        • Anions (−) go to anode (+){'\n'}
                        • Cathode: Reduction (gain e⁻){'\n'}
                        • Anode: Oxidation (lose e⁻)
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
    cellContainer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        position: 'relative',
    },
    voltageDisplay: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF980020',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },
    voltageText: {
        color: '#FF9800',
        fontSize: 14,
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
        marginBottom: 12,
    },
    electrolyteOptions: {
        gap: 8,
    },
    electrolyteBtn: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 2,
        backgroundColor: '#00000005',
    },
    electrolyteBtnActive: {
        backgroundColor: '#FF980010',
    },
    electrolyteName: {
        fontSize: 13,
        fontWeight: '500',
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 12,
    },
    controlRow: {
        flexDirection: 'row',
        gap: 12,
    },
    startBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 10,
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
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#607D8B',
        borderRadius: 10,
    },
    productsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    productCard: {
        flex: 1,
        padding: 12,
        backgroundColor: '#00000010',
        borderRadius: 8,
    },
    productLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
    },
    productName: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 4,
    },
    halfEq: {
        fontSize: 11,
        fontStyle: 'italic',
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
        backgroundColor: '#FF9800',
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

export default ElectrolysisSimulatorScreen;
