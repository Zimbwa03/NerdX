// Logarithms Lab Screen - Mathematics Virtual Lab
// Interactive logarithm visualization with base slider

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
import Svg, { Path, Line, Circle, Text as SvgText, G, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 32;
const GRAPH_HEIGHT = 280;
const PADDING = 40;

const LogarithmsLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('logarithms-lab')!;

    const [base, setBase] = useState(2);
    const [showExponential, setShowExponential] = useState(true);
    const [xValue, setXValue] = useState(4);
    const [showQuiz, setShowQuiz] = useState(false);
    const [explorations, setExplorations] = useState(0);

    const canTakeQuiz = explorations >= 3;

    // Graph range
    const xMin = 0.1;
    const xMax = 10;
    const yMin = -3;
    const yMax = 4;

    const toSvgX = (x: number) => PADDING + ((x - xMin) / (xMax - xMin)) * (GRAPH_WIDTH - 2 * PADDING);
    const toSvgY = (y: number) => PADDING + (GRAPH_HEIGHT - 2 * PADDING) - ((y - yMin) / (yMax - yMin)) * (GRAPH_HEIGHT - 2 * PADDING);

    // Generate logarithm path
    const logPath = useMemo(() => {
        const points: string[] = [];
        for (let x = 0.1; x <= xMax; x += 0.05) {
            const y = Math.log(x) / Math.log(base);
            if (y >= yMin && y <= yMax) {
                points.push(`${points.length === 0 ? 'M' : 'L'} ${toSvgX(x)} ${toSvgY(y)}`);
            }
        }
        return points.join(' ');
    }, [base]);

    // Generate exponential path
    const expPath = useMemo(() => {
        const points: string[] = [];
        for (let x = yMin; x <= yMax; x += 0.05) {
            const y = Math.pow(base, x);
            if (y >= xMin && y <= xMax) {
                points.push(`${points.length === 0 ? 'M' : 'L'} ${toSvgX(y)} ${toSvgY(x)}`);
            }
        }
        return points.join(' ');
    }, [base]);

    const logValue = Math.log(xValue) / Math.log(base);

    const handleBaseChange = (val: number) => {
        setBase(Math.round(val * 10) / 10);
        setExplorations(prev => prev + 1);
    };

    const handleXChange = (val: number) => {
        setXValue(Math.round(val * 10) / 10);
        setExplorations(prev => prev + 1);
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
                {/* Equation Display */}
                <View style={[styles.equationCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.equationRow}>
                        <View style={styles.equationBox}>
                            <Text style={[styles.equationLabel, { color: themedColors.text.secondary }]}>
                                Logarithmic Form
                            </Text>
                            <Text style={[styles.equation, { color: '#26A69A' }]}>
                                log{base === Math.E ? 'ₑ' : `₍${base.toFixed(1)}₎`}({xValue.toFixed(1)}) = {logValue.toFixed(3)}
                            </Text>
                        </View>
                        <Text style={[styles.equalsSign, { color: themedColors.text.secondary }]}>⟺</Text>
                        <View style={styles.equationBox}>
                            <Text style={[styles.equationLabel, { color: themedColors.text.secondary }]}>
                                Exponential Form
                            </Text>
                            <Text style={[styles.equation, { color: '#FF7043' }]}>
                                {base.toFixed(1)}^{logValue.toFixed(3)} = {xValue.toFixed(1)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Graph */}
                <View style={[styles.graphCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.graphHint, { color: themedColors.text.secondary }]}>
                        💡 Logarithm and exponential are inverse functions (reflected over y=x)
                    </Text>
                    <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
                        {/* Grid */}
                        <G opacity={0.2}>
                            {Array.from({ length: 11 }, (_, i) => {
                                const x = PADDING + (i / 10) * (GRAPH_WIDTH - 2 * PADDING);
                                return (
                                    <Line key={`v${i}`} x1={x} y1={PADDING} x2={x} y2={GRAPH_HEIGHT - PADDING}
                                        stroke={themedColors.border.medium} strokeWidth={0.5} />
                                );
                            })}
                            {Array.from({ length: 8 }, (_, i) => {
                                const y = PADDING + (i / 7) * (GRAPH_HEIGHT - 2 * PADDING);
                                return (
                                    <Line key={`h${i}`} x1={PADDING} y1={y} x2={GRAPH_WIDTH - PADDING} y2={y}
                                        stroke={themedColors.border.medium} strokeWidth={0.5} />
                                );
                            })}
                        </G>

                        {/* Axes */}
                        <Line x1={PADDING} y1={toSvgY(0)} x2={GRAPH_WIDTH - PADDING} y2={toSvgY(0)}
                            stroke={themedColors.text.secondary} strokeWidth={1.5} />
                        <Line x1={toSvgX(1)} y1={PADDING} x2={toSvgX(1)} y2={GRAPH_HEIGHT - PADDING}
                            stroke={themedColors.text.secondary} strokeWidth={1.5} />

                        {/* y = x line (for reflection) */}
                        {showExponential && (
                            <Line
                                x1={toSvgX(0.1)} y1={toSvgY(0.1)}
                                x2={toSvgX(4)} y2={toSvgY(4)}
                                stroke="#9E9E9E"
                                strokeWidth={1}
                                strokeDasharray="5,5"
                            />
                        )}

                        {/* Exponential curve */}
                        {showExponential && (
                            <Path d={expPath} stroke="#FF7043" strokeWidth={2.5} fill="none" />
                        )}

                        {/* Logarithm curve */}
                        <Path d={logPath} stroke="#26A69A" strokeWidth={3} fill="none" />

                        {/* Point on log curve */}
                        <Circle
                            cx={toSvgX(xValue)}
                            cy={toSvgY(logValue)}
                            r={10}
                            fill="#26A69A"
                            stroke="#FFF"
                            strokeWidth={2}
                        />

                        {/* Point label */}
                        <SvgText
                            x={toSvgX(xValue) + 15}
                            y={toSvgY(logValue) - 10}
                            fontSize={11}
                            fill="#26A69A"
                            fontWeight="bold"
                        >
                            ({xValue.toFixed(1)}, {logValue.toFixed(2)})
                        </SvgText>

                        {/* Vertical dashed line */}
                        <Line
                            x1={toSvgX(xValue)} y1={toSvgY(0)}
                            x2={toSvgX(xValue)} y2={toSvgY(logValue)}
                            stroke="#26A69A"
                            strokeWidth={1}
                            strokeDasharray="4,2"
                        />

                        {/* Axis labels */}
                        <SvgText x={GRAPH_WIDTH - 25} y={toSvgY(0) - 8} fontSize={12} fill={themedColors.text.secondary}>x</SvgText>
                        <SvgText x={toSvgX(1) + 8} y={PADDING + 15} fontSize={12} fill={themedColors.text.secondary}>y</SvgText>

                        {/* Legend */}
                        <Rect x={GRAPH_WIDTH - 110} y={10} width={100} height={showExponential ? 55 : 30} rx={6} fill={`${themedColors.background.paper}EE`} />
                        <Line x1={GRAPH_WIDTH - 100} y1={25} x2={GRAPH_WIDTH - 80} y2={25} stroke="#26A69A" strokeWidth={3} />
                        <SvgText x={GRAPH_WIDTH - 75} y={29} fontSize={10} fill="#26A69A">log</SvgText>
                        {showExponential && (
                            <>
                                <Line x1={GRAPH_WIDTH - 100} y1={45} x2={GRAPH_WIDTH - 80} y2={45} stroke="#FF7043" strokeWidth={3} />
                                <SvgText x={GRAPH_WIDTH - 75} y={49} fontSize={10} fill="#FF7043">exp</SvgText>
                            </>
                        )}
                    </Svg>
                </View>

                {/* Sliders */}
                <View style={[styles.slidersCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.sliderRow}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                            Base: {base.toFixed(1)} {base === 10 ? '(common log)' : base === 2 ? '(binary log)' : ''}
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={1.5}
                            maximumValue={10}
                            step={0.1}
                            value={base}
                            onValueChange={handleBaseChange}
                            minimumTrackTintColor="#26A69A"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#26A69A"
                        />
                        <View style={styles.presetButtons}>
                            <TouchableOpacity
                                style={[styles.presetButton, base === 2 && styles.presetActive]}
                                onPress={() => { setBase(2); setExplorations(prev => prev + 1); }}
                            >
                                <Text style={[styles.presetText, { color: base === 2 ? '#FFF' : '#26A69A' }]}>2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.presetButton, Math.abs(base - 2.718) < 0.1 && styles.presetActive]}
                                onPress={() => { setBase(2.718); setExplorations(prev => prev + 1); }}
                            >
                                <Text style={[styles.presetText, { color: Math.abs(base - 2.718) < 0.1 ? '#FFF' : '#26A69A' }]}>e</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.presetButton, base === 10 && styles.presetActive]}
                                onPress={() => { setBase(10); setExplorations(prev => prev + 1); }}
                            >
                                <Text style={[styles.presetText, { color: base === 10 ? '#FFF' : '#26A69A' }]}>10</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.sliderRow}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                            x value: {xValue.toFixed(1)}
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0.5}
                            maximumValue={9}
                            step={0.1}
                            value={xValue}
                            onValueChange={handleXChange}
                            minimumTrackTintColor="#FF7043"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#FF7043"
                        />
                    </View>
                </View>

                {/* Toggle */}
                <TouchableOpacity
                    style={[styles.toggleButton, { backgroundColor: showExponential ? '#FF704320' : themedColors.background.paper }]}
                    onPress={() => setShowExponential(!showExponential)}
                >
                    <Ionicons
                        name={showExponential ? 'checkmark-circle' : 'ellipse-outline'}
                        size={22}
                        color={showExponential ? '#FF7043' : themedColors.text.secondary}
                    />
                    <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>
                        Show exponential function (inverse)
                    </Text>
                </TouchableOpacity>

                {/* Log Laws Card */}
                <View style={[styles.lawsCard, { backgroundColor: '#26A69A15' }]}>
                    <Text style={[styles.lawsTitle, { color: '#26A69A' }]}>
                        📐 Key Logarithm Laws
                    </Text>
                    <View style={styles.lawRow}>
                        <Text style={[styles.lawFormula, { color: themedColors.text.primary }]}>log(ab) = log(a) + log(b)</Text>
                        <Text style={[styles.lawName, { color: themedColors.text.secondary }]}>Product Rule</Text>
                    </View>
                    <View style={styles.lawRow}>
                        <Text style={[styles.lawFormula, { color: themedColors.text.primary }]}>log(a/b) = log(a) - log(b)</Text>
                        <Text style={[styles.lawName, { color: themedColors.text.secondary }]}>Quotient Rule</Text>
                    </View>
                    <View style={styles.lawRow}>
                        <Text style={[styles.lawFormula, { color: themedColors.text.primary }]}>log(aⁿ) = n·log(a)</Text>
                        <Text style={[styles.lawName, { color: themedColors.text.secondary }]}>Power Rule</Text>
                    </View>
                </View>

                {/* Knowledge Check */}
                <TouchableOpacity
                    style={[
                        styles.quizButton,
                        { backgroundColor: canTakeQuiz ? '#26A69A' : themedColors.background.subtle },
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
                        {canTakeQuiz ? 'Take Knowledge Check' : `Explore more (${explorations}/3)`}
                    </Text>
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
    equationCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
    equationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    equationBox: { flex: 1, alignItems: 'center' },
    equationLabel: { fontSize: 11, marginBottom: 4 },
    equation: { fontSize: 14, fontWeight: '600', fontFamily: 'monospace' },
    equalsSign: { fontSize: 18, marginHorizontal: 8 },
    graphCard: { borderRadius: 16, padding: 8, marginBottom: 16 },
    graphHint: { fontSize: 11, textAlign: 'center', marginBottom: 4 },
    slidersCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
    sliderRow: { marginBottom: 16 },
    sliderLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
    slider: { width: '100%', height: 40 },
    presetButtons: { flexDirection: 'row', gap: 10, marginTop: 8 },
    presetButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: '#26A69A' },
    presetActive: { backgroundColor: '#26A69A' },
    presetText: { fontWeight: '700', fontSize: 14 },
    toggleButton: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 16, gap: 10 },
    toggleText: { fontSize: 14, fontWeight: '500' },
    lawsCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
    lawsTitle: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
    lawRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    lawFormula: { fontSize: 14, fontFamily: 'monospace' },
    lawName: { fontSize: 11 },
    quizButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 10 },
    quizButtonText: { fontSize: 15, fontWeight: '600' },
});

export default LogarithmsLabScreen;
