// Circuit Builder Screen - Physics Simulation
// Build and analyze electrical circuits

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
import Svg, { Circle, Line, Rect, G, Text as SvgText, Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 48;

interface CircuitComponent {
    id: string;
    type: 'cell' | 'bulb' | 'resistor' | 'switch';
    resistance?: number;
    voltage?: number;
}

type CircuitType = 'series' | 'parallel';

const CircuitBuilderScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('circuit-builder')!;

    const [circuitType, setCircuitType] = useState<CircuitType>('series');
    const [cellVoltage, setCellVoltage] = useState(6);
    const [resistance1, setResistance1] = useState(3);
    const [resistance2, setResistance2] = useState(6);
    const [switchOn, setSwitchOn] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [experimentsComplete, setExperimentsComplete] = useState(0);

    // Calculate circuit values
    const calculateCircuit = () => {
        if (!switchOn) {
            return { totalResistance: 0, current: 0, voltage1: 0, voltage2: 0 };
        }

        let totalResistance: number;
        let current: number;
        let voltage1: number;
        let voltage2: number;

        if (circuitType === 'series') {
            totalResistance = resistance1 + resistance2;
            current = cellVoltage / totalResistance;
            voltage1 = current * resistance1;
            voltage2 = current * resistance2;
        } else {
            // Parallel
            totalResistance = (resistance1 * resistance2) / (resistance1 + resistance2);
            current = cellVoltage / totalResistance;
            voltage1 = cellVoltage; // Same voltage across parallel components
            voltage2 = cellVoltage;
        }

        return {
            totalResistance: Math.round(totalResistance * 100) / 100,
            current: Math.round(current * 100) / 100,
            voltage1: Math.round(voltage1 * 100) / 100,
            voltage2: Math.round(voltage2 * 100) / 100,
        };
    };

    const circuitData = calculateCircuit();

    const renderSeriesCircuit = () => (
        <G>
            {/* Wires */}
            <Line x1={60} y1={100} x2={CANVAS_SIZE - 60} y2={100} stroke={switchOn ? "#FFD700" : "#666"} strokeWidth={3} />
            <Line x1={60} y1={100} x2={60} y2={200} stroke={switchOn ? "#FFD700" : "#666"} strokeWidth={3} />
            <Line x1={60} y1={200} x2={CANVAS_SIZE - 60} y2={200} stroke={switchOn ? "#FFD700" : "#666"} strokeWidth={3} />
            <Line x1={CANVAS_SIZE - 60} y1={100} x2={CANVAS_SIZE - 60} y2={200} stroke={switchOn ? "#FFD700" : "#666"} strokeWidth={3} />

            {/* Cell */}
            <G>
                <Rect x={CANVAS_SIZE / 2 - 20} y={80} width={40} height={40} fill={themedColors.background.paper} rx={4} />
                <Line x1={CANVAS_SIZE / 2 - 8} y1={92} x2={CANVAS_SIZE / 2 - 8} y2={108} stroke="#F44336" strokeWidth={4} />
                <Line x1={CANVAS_SIZE / 2 + 8} y1={88} x2={CANVAS_SIZE / 2 + 8} y2={112} stroke="#F44336" strokeWidth={2} />
                <SvgText x={CANVAS_SIZE / 2} y={75} textAnchor="middle" fontSize={10} fill={themedColors.text.secondary}>
                    {cellVoltage}V
                </SvgText>
            </G>

            {/* Switch */}
            <G onPress={() => setSwitchOn(!switchOn)}>
                <Circle cx={80} cy={150} r={8} fill={themedColors.background.paper} stroke="#666" strokeWidth={2} />
                {switchOn ? (
                    <Line x1={80} y1={142} x2={80} y2={158} stroke="#4CAF50" strokeWidth={3} />
                ) : (
                    <Line x1={80} y1={142} x2={95} y2={150} stroke="#F44336" strokeWidth={3} />
                )}
                <SvgText x={80} y={175} textAnchor="middle" fontSize={9} fill={themedColors.text.secondary}>
                    {switchOn ? 'ON' : 'OFF'}
                </SvgText>
            </G>

            {/* Resistor 1 */}
            <G>
                <Path
                    d={`M ${CANVAS_SIZE / 3 - 25} 200 l 10 -10 l 10 20 l 10 -20 l 10 20 l 10 -10`}
                    stroke="#FF9800"
                    strokeWidth={3}
                    fill="none"
                />
                <SvgText x={CANVAS_SIZE / 3} y={230} textAnchor="middle" fontSize={10} fill="#FF9800">
                    R1: {resistance1}Ω
                </SvgText>
            </G>

            {/* Resistor 2 */}
            <G>
                <Path
                    d={`M ${2 * CANVAS_SIZE / 3 - 25} 200 l 10 -10 l 10 20 l 10 -20 l 10 20 l 10 -10`}
                    stroke="#FF9800"
                    strokeWidth={3}
                    fill="none"
                />
                <SvgText x={2 * CANVAS_SIZE / 3} y={230} textAnchor="middle" fontSize={10} fill="#FF9800">
                    R2: {resistance2}Ω
                </SvgText>
            </G>

            {/* Bulb indicator */}
            <Circle
                cx={CANVAS_SIZE - 80}
                cy={150}
                r={15}
                fill={switchOn ? `rgba(255, 235, 59, ${circuitData.current / 2})` : '#666'}
                stroke={themedColors.text.primary}
                strokeWidth={2}
            />
        </G>
    );

    const renderParallelCircuit = () => (
        <G>
            {/* Main wires */}
            <Line x1={60} y1={100} x2={60} y2={220} stroke={switchOn ? "#FFD700" : "#666"} strokeWidth={3} />
            <Line x1={CANVAS_SIZE - 60} y1={100} x2={CANVAS_SIZE - 60} y2={220} stroke={switchOn ? "#FFD700" : "#666"} strokeWidth={3} />
            <Line x1={60} y1={100} x2={CANVAS_SIZE - 60} y2={100} stroke={switchOn ? "#FFD700" : "#666"} strokeWidth={3} />
            <Line x1={60} y1={220} x2={CANVAS_SIZE - 60} y2={220} stroke={switchOn ? "#FFD700" : "#666"} strokeWidth={3} />

            {/* Parallel branches */}
            <Line x1={100} y1={100} x2={100} y2={220} stroke={switchOn ? "#FFD700" : "#666"} strokeWidth={3} />
            <Line x1={CANVAS_SIZE - 100} y1={100} x2={CANVAS_SIZE - 100} y2={220} stroke={switchOn ? "#FFD700" : "#666"} strokeWidth={3} />

            {/* Cell */}
            <G>
                <Rect x={CANVAS_SIZE / 2 - 20} y={80} width={40} height={40} fill={themedColors.background.paper} rx={4} />
                <Line x1={CANVAS_SIZE / 2 - 8} y1={92} x2={CANVAS_SIZE / 2 - 8} y2={108} stroke="#F44336" strokeWidth={4} />
                <Line x1={CANVAS_SIZE / 2 + 8} y1={88} x2={CANVAS_SIZE / 2 + 8} y2={112} stroke="#F44336" strokeWidth={2} />
                <SvgText x={CANVAS_SIZE / 2} y={75} textAnchor="middle" fontSize={10} fill={themedColors.text.secondary}>
                    {cellVoltage}V
                </SvgText>
            </G>

            {/* Switch */}
            <G onPress={() => setSwitchOn(!switchOn)}>
                <Circle cx={80} cy={160} r={8} fill={themedColors.background.paper} stroke="#666" strokeWidth={2} />
                {switchOn ? (
                    <Line x1={80} y1={152} x2={80} y2={168} stroke="#4CAF50" strokeWidth={3} />
                ) : (
                    <Line x1={80} y1={152} x2={95} y2={160} stroke="#F44336" strokeWidth={3} />
                )}
            </G>

            {/* Resistor 1 (left branch) */}
            <G>
                <Path
                    d={`M 130 145 l 10 -10 l 10 20 l 10 -20 l 10 20 l 10 -10`}
                    stroke="#FF9800"
                    strokeWidth={3}
                    fill="none"
                />
                <SvgText x={155} y={180} textAnchor="middle" fontSize={10} fill="#FF9800">
                    R1: {resistance1}Ω
                </SvgText>
            </G>

            {/* Resistor 2 (right branch) */}
            <G>
                <Path
                    d={`M ${CANVAS_SIZE - 180} 145 l 10 -10 l 10 20 l 10 -20 l 10 20 l 10 -10`}
                    stroke="#FF9800"
                    strokeWidth={3}
                    fill="none"
                />
                <SvgText x={CANVAS_SIZE - 155} y={180} textAnchor="middle" fontSize={10} fill="#FF9800">
                    R2: {resistance2}Ω
                </SvgText>
            </G>

            {/* Bulb indicator */}
            <Circle
                cx={CANVAS_SIZE - 80}
                cy={160}
                r={15}
                fill={switchOn ? `rgba(255, 235, 59, ${Math.min(1, circuitData.current / 3)})` : '#666'}
                stroke={themedColors.text.primary}
                strokeWidth={2}
            />
        </G>
    );

    const handleRecordExperiment = () => {
        if (experimentsComplete < 4) {
            setExperimentsComplete(experimentsComplete + 1);
        }
    };

    const canTakeQuiz = experimentsComplete >= 2;

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
                {/* Circuit Type Selector */}
                <View style={styles.selectorContainer}>
                    <TouchableOpacity
                        style={[
                            styles.selectorButton,
                            circuitType === 'series' && styles.selectorActive,
                            { borderColor: circuitType === 'series' ? '#2196F3' : themedColors.text.secondary + '40' }
                        ]}
                        onPress={() => setCircuitType('series')}
                    >
                        <Ionicons name="git-commit" size={20} color={circuitType === 'series' ? '#2196F3' : themedColors.text.secondary} />
                        <Text style={[styles.selectorText, { color: circuitType === 'series' ? '#2196F3' : themedColors.text.secondary }]}>
                            Series
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.selectorButton,
                            circuitType === 'parallel' && styles.selectorActive,
                            { borderColor: circuitType === 'parallel' ? '#4CAF50' : themedColors.text.secondary + '40' }
                        ]}
                        onPress={() => setCircuitType('parallel')}
                    >
                        <Ionicons name="git-network" size={20} color={circuitType === 'parallel' ? '#4CAF50' : themedColors.text.secondary} />
                        <Text style={[styles.selectorText, { color: circuitType === 'parallel' ? '#4CAF50' : themedColors.text.secondary }]}>
                            Parallel
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Circuit Canvas */}
                <View style={[styles.canvasContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }]}>
                    <Svg width={CANVAS_SIZE} height={260} viewBox={`0 0 ${CANVAS_SIZE} 260`}>
                        {circuitType === 'series' ? renderSeriesCircuit() : renderParallelCircuit()}
                    </Svg>

                    {/* Switch toggle hint */}
                    <TouchableOpacity
                        style={[styles.switchHint, { backgroundColor: switchOn ? '#4CAF50' : '#F44336' }]}
                        onPress={() => setSwitchOn(!switchOn)}
                    >
                        <Text style={styles.switchHintText}>{switchOn ? 'ON' : 'OFF'} - Tap to toggle</Text>
                    </TouchableOpacity>
                </View>

                {/* Controls */}
                <View style={[styles.controlsCard, { backgroundColor: themedColors.background.paper }]}>
                    {/* Voltage Control */}
                    <View style={styles.controlRow}>
                        <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>Cell Voltage</Text>
                        <View style={styles.controlButtons}>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: themedColors.background.subtle }]}
                                onPress={() => setCellVoltage(Math.max(1, cellVoltage - 1))}
                            >
                                <Ionicons name="remove" size={20} color={themedColors.text.primary} />
                            </TouchableOpacity>
                            <Text style={[styles.controlValue, { color: '#F44336' }]}>{cellVoltage}V</Text>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: '#F44336' }]}
                                onPress={() => setCellVoltage(Math.min(12, cellVoltage + 1))}
                            >
                                <Ionicons name="add" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Resistance 1 */}
                    <View style={styles.controlRow}>
                        <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>Resistance 1</Text>
                        <View style={styles.controlButtons}>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: themedColors.background.subtle }]}
                                onPress={() => setResistance1(Math.max(1, resistance1 - 1))}
                            >
                                <Ionicons name="remove" size={20} color={themedColors.text.primary} />
                            </TouchableOpacity>
                            <Text style={[styles.controlValue, { color: '#FF9800' }]}>{resistance1}Ω</Text>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: '#FF9800' }]}
                                onPress={() => setResistance1(Math.min(20, resistance1 + 1))}
                            >
                                <Ionicons name="add" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Resistance 2 */}
                    <View style={styles.controlRow}>
                        <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>Resistance 2</Text>
                        <View style={styles.controlButtons}>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: themedColors.background.subtle }]}
                                onPress={() => setResistance2(Math.max(1, resistance2 - 1))}
                            >
                                <Ionicons name="remove" size={20} color={themedColors.text.primary} />
                            </TouchableOpacity>
                            <Text style={[styles.controlValue, { color: '#FF9800' }]}>{resistance2}Ω</Text>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: '#FF9800' }]}
                                onPress={() => setResistance2(Math.min(20, resistance2 + 1))}
                            >
                                <Ionicons name="add" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Readings */}
                <View style={[styles.readingsCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.readingsTitle, { color: themedColors.text.primary }]}>
                        📊 Circuit Readings
                    </Text>

                    <View style={styles.readingsGrid}>
                        <View style={styles.readingItem}>
                            <Text style={[styles.readingLabel, { color: themedColors.text.secondary }]}>Total R</Text>
                            <Text style={[styles.readingValue, { color: '#FF9800' }]}>
                                {switchOn ? circuitData.totalResistance : '—'} Ω
                            </Text>
                        </View>
                        <View style={styles.readingItem}>
                            <Text style={[styles.readingLabel, { color: themedColors.text.secondary }]}>Current (I)</Text>
                            <Text style={[styles.readingValue, { color: '#2196F3' }]}>
                                {switchOn ? circuitData.current : '—'} A
                            </Text>
                        </View>
                        <View style={styles.readingItem}>
                            <Text style={[styles.readingLabel, { color: themedColors.text.secondary }]}>V across R1</Text>
                            <Text style={[styles.readingValue, { color: '#4CAF50' }]}>
                                {switchOn ? circuitData.voltage1 : '—'} V
                            </Text>
                        </View>
                        <View style={styles.readingItem}>
                            <Text style={[styles.readingLabel, { color: themedColors.text.secondary }]}>V across R2</Text>
                            <Text style={[styles.readingValue, { color: '#4CAF50' }]}>
                                {switchOn ? circuitData.voltage2 : '—'} V
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.formulaBox, { backgroundColor: isDarkMode ? '#2a2a2a' : '#E3F2FD' }]}>
                        <Text style={[styles.formulaText, { color: themedColors.text.primary }]}>
                            ⚡ Ohm's Law: V = I × R
                        </Text>
                        <Text style={[styles.formulaCheck, { color: themedColors.text.secondary }]}>
                            {cellVoltage}V = {circuitData.current}A × {circuitData.totalResistance}Ω ✓
                        </Text>
                    </View>
                </View>

                {/* Record Button */}
                <TouchableOpacity style={styles.recordButton} onPress={handleRecordExperiment}>
                    <Ionicons name="add-circle" size={20} color="#FFF" />
                    <Text style={styles.recordButtonText}>Record Experiment ({experimentsComplete}/4)</Text>
                </TouchableOpacity>

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
                        {canTakeQuiz ? 'Take Knowledge Check' : 'Record more experiments'}
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
    selectorContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    selectorButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
        gap: 8,
    },
    selectorActive: {
        backgroundColor: '#FFFFFF10',
    },
    selectorText: {
        fontSize: 14,
        fontWeight: '600',
    },
    canvasContainer: {
        borderRadius: 16,
        marginBottom: 16,
        position: 'relative',
    },
    switchHint: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    switchHintText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
    },
    controlsCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    controlLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    controlButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    controlBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlValue: {
        fontSize: 18,
        fontWeight: 'bold',
        minWidth: 50,
        textAlign: 'center',
    },
    readingsCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    readingsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    readingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    readingItem: {
        width: '47%',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#00000008',
    },
    readingLabel: {
        fontSize: 11,
        marginBottom: 4,
    },
    readingValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    formulaBox: {
        padding: 12,
        borderRadius: 8,
    },
    formulaText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    formulaCheck: {
        fontSize: 12,
    },
    recordButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1976D2',
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    recordButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196F3',
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

export default CircuitBuilderScreen;
