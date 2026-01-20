// Vector Visualizer Screen - Mathematics Virtual Lab
// 2D vector operations: addition, subtraction, dot product

import React, { useState, useMemo, useEffect } from 'react';
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
import Svg, { Circle, Line, G, Text as SvgText, Polygon, Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 32;
const CENTER = CANVAS_SIZE / 2;
const SCALE = 30; // pixels per unit

type Operation = 'add' | 'subtract' | 'dot_product' | 'none';

const VectorVisualizerScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('vector-visualizer')!;

    // State
    const [v1x, setV1x] = useState(3);
    const [v1y, setV1y] = useState(2);
    const [v2x, setV2x] = useState(1);
    const [v2y, setV2y] = useState(3);
    const [operation, setOperation] = useState<Operation>('add');
    const [showMagnitude, setShowMagnitude] = useState(true);
    const [showParallelogram, setShowParallelogram] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [explorations, setExplorations] = useState(0);

    // Calculations
    const magnitude1 = Math.sqrt(v1x * v1x + v1y * v1y);
    const magnitude2 = Math.sqrt(v2x * v2x + v2y * v2y);
    const angle1 = (Math.atan2(v1y, v1x) * 180) / Math.PI;
    const angle2 = (Math.atan2(v2y, v2x) * 180) / Math.PI;
    
    // Result based on operation
    const result = useMemo(() => {
        switch (operation) {
            case 'add':
                return { x: v1x + v2x, y: v1y + v2y };
            case 'subtract':
                return { x: v1x - v2x, y: v1y - v2y };
            default:
                return null;
        }
    }, [operation, v1x, v1y, v2x, v2y]);

    const dotProduct = v1x * v2x + v1y * v2y;
    const angleBetween = Math.acos(dotProduct / (magnitude1 * magnitude2)) * 180 / Math.PI;

    const resultMagnitude = result ? Math.sqrt(result.x * result.x + result.y * result.y) : 0;

    // SVG coordinate conversion
    const toSvgX = (x: number) => CENTER + x * SCALE;
    const toSvgY = (y: number) => CENTER - y * SCALE;

    // Arrow head
    const getArrowHead = (x: number, y: number, angle: number, size: number = 10, color: string) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = x - size * Math.cos(rad - Math.PI / 6);
        const y1 = y + size * Math.sin(rad - Math.PI / 6);
        const x2 = x - size * Math.cos(rad + Math.PI / 6);
        const y2 = y + size * Math.sin(rad + Math.PI / 6);
        return (
            <Polygon points={`${x},${y} ${x1},${y1} ${x2},${y2}`} fill={color} />
        );
    };

    // Track explorations
    useEffect(() => {
        const timer = setTimeout(() => {
            setExplorations(prev => Math.min(prev + 1, 4));
        }, 2500);
        return () => clearTimeout(timer);
    }, [v1x, v1y, v2x, v2y, operation]);

    const canTakeQuiz = explorations >= 3;

    const operations: { key: Operation; label: string; icon: string; color: string }[] = [
        { key: 'add', label: 'a + b', icon: 'add-circle', color: '#00E676' },
        { key: 'subtract', label: 'a - b', icon: 'remove-circle', color: '#FF5252' },
        { key: 'dot_product', label: 'a · b', icon: 'radio-button-on', color: '#FFC400' },
        { key: 'none', label: 'None', icon: 'close-circle', color: '#607D8B' },
    ];

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
                {/* Vector Display */}
                <View style={[styles.displayCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.vectorRow}>
                        <View style={[styles.vectorBadge, { backgroundColor: '#2979FF20' }]}>
                            <Text style={[styles.vectorLabel, { color: '#2979FF' }]}>Vector a</Text>
                            <Text style={[styles.vectorValue, { color: '#2979FF' }]}>
                                ({v1x.toFixed(1)}, {v1y.toFixed(1)})
                            </Text>
                            {showMagnitude && (
                                <Text style={[styles.vectorMag, { color: themedColors.text.secondary }]}>
                                    |a| = {magnitude1.toFixed(2)}
                                </Text>
                            )}
                        </View>
                        <View style={[styles.vectorBadge, { backgroundColor: '#FF910020' }]}>
                            <Text style={[styles.vectorLabel, { color: '#FF9100' }]}>Vector b</Text>
                            <Text style={[styles.vectorValue, { color: '#FF9100' }]}>
                                ({v2x.toFixed(1)}, {v2y.toFixed(1)})
                            </Text>
                            {showMagnitude && (
                                <Text style={[styles.vectorMag, { color: themedColors.text.secondary }]}>
                                    |b| = {magnitude2.toFixed(2)}
                                </Text>
                            )}
                        </View>
                    </View>
                    {result && (
                        <View style={[styles.resultBadge, { backgroundColor: '#00E67620' }]}>
                            <Text style={[styles.resultLabel, { color: '#00E676' }]}>
                                Result ({operation === 'add' ? 'a + b' : 'a - b'})
                            </Text>
                            <Text style={[styles.resultValue, { color: '#00E676' }]}>
                                ({result.x.toFixed(1)}, {result.y.toFixed(1)}) | Magnitude: {resultMagnitude.toFixed(2)}
                            </Text>
                        </View>
                    )}
                    {operation === 'dot_product' && (
                        <View style={[styles.resultBadge, { backgroundColor: '#FFC40020' }]}>
                            <Text style={[styles.resultLabel, { color: '#FFC400' }]}>Dot Product (a · b)</Text>
                            <Text style={[styles.resultValue, { color: '#FFC400' }]}>
                                {dotProduct.toFixed(2)} | Angle: {isNaN(angleBetween) ? '0' : angleBetween.toFixed(1)}°
                            </Text>
                        </View>
                    )}
                </View>

                {/* Vector Canvas */}
                <View style={[styles.canvasContainer, { backgroundColor: themedColors.background.paper }]}>
                    <Svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
                        {/* Grid */}
                        <G opacity={0.2}>
                            {Array.from({ length: 17 }, (_, i) => {
                                const pos = (i - 8) * SCALE + CENTER;
                                return (
                                    <G key={i}>
                                        <Line x1={pos} y1={0} x2={pos} y2={CANVAS_SIZE} stroke={themedColors.text.secondary} strokeWidth={0.5} />
                                        <Line x1={0} y1={pos} x2={CANVAS_SIZE} y2={pos} stroke={themedColors.text.secondary} strokeWidth={0.5} />
                                    </G>
                                );
                            })}
                        </G>

                        {/* Axes */}
                        <Line x1={0} y1={CENTER} x2={CANVAS_SIZE} y2={CENTER} stroke={themedColors.text.secondary} strokeWidth={1.5} />
                        <Line x1={CENTER} y1={0} x2={CENTER} y2={CANVAS_SIZE} stroke={themedColors.text.secondary} strokeWidth={1.5} />

                        {/* Parallelogram for addition */}
                        {showParallelogram && operation === 'add' && (
                            <Path
                                d={`M ${CENTER} ${CENTER} L ${toSvgX(v1x)} ${toSvgY(v1y)} L ${toSvgX(v1x + v2x)} ${toSvgY(v1y + v2y)} L ${toSvgX(v2x)} ${toSvgY(v2y)} Z`}
                                fill="#00E67615"
                                stroke="#00E676"
                                strokeWidth={1}
                                strokeDasharray="4,4"
                            />
                        )}

                        {/* Vector a (blue) */}
                        <Line
                            x1={CENTER}
                            y1={CENTER}
                            x2={toSvgX(v1x)}
                            y2={toSvgY(v1y)}
                            stroke="#2979FF"
                            strokeWidth={3}
                        />
                        {getArrowHead(toSvgX(v1x), toSvgY(v1y), -angle1, 12, '#2979FF')}
                        <SvgText
                            x={toSvgX(v1x / 2) + 10}
                            y={toSvgY(v1y / 2) - 5}
                            fontSize={14}
                            fill="#2979FF"
                            fontWeight="bold"
                        >
                            a
                        </SvgText>

                        {/* Vector b (orange) */}
                        <Line
                            x1={CENTER}
                            y1={CENTER}
                            x2={toSvgX(v2x)}
                            y2={toSvgY(v2y)}
                            stroke="#FF9100"
                            strokeWidth={3}
                        />
                        {getArrowHead(toSvgX(v2x), toSvgY(v2y), -angle2, 12, '#FF9100')}
                        <SvgText
                            x={toSvgX(v2x / 2) - 15}
                            y={toSvgY(v2y / 2) - 5}
                            fontSize={14}
                            fill="#FF9100"
                            fontWeight="bold"
                        >
                            b
                        </SvgText>

                        {/* Result vector (green) */}
                        {result && (operation === 'add' || operation === 'subtract') && (
                            <>
                                <Line
                                    x1={CENTER}
                                    y1={CENTER}
                                    x2={toSvgX(result.x)}
                                    y2={toSvgY(result.y)}
                                    stroke="#00E676"
                                    strokeWidth={4}
                                />
                                {getArrowHead(
                                    toSvgX(result.x),
                                    toSvgY(result.y),
                                    -(Math.atan2(result.y, result.x) * 180) / Math.PI,
                                    14,
                                    '#00E676'
                                )}
                                <Circle cx={toSvgX(result.x)} cy={toSvgY(result.y)} r={6} fill="#00E676" stroke="#FFF" strokeWidth={2} />
                            </>
                        )}

                        {/* Projection line for dot product */}
                        {operation === 'dot_product' && (
                            <G>
                                {/* Projection of a onto b */}
                                <Line
                                    x1={CENTER}
                                    y1={CENTER}
                                    x2={toSvgX((dotProduct / (magnitude2 * magnitude2)) * v2x)}
                                    y2={toSvgY((dotProduct / (magnitude2 * magnitude2)) * v2y)}
                                    stroke="#FFC400"
                                    strokeWidth={4}
                                />
                                <Line
                                    x1={toSvgX(v1x)}
                                    y1={toSvgY(v1y)}
                                    x2={toSvgX((dotProduct / (magnitude2 * magnitude2)) * v2x)}
                                    y2={toSvgY((dotProduct / (magnitude2 * magnitude2)) * v2y)}
                                    stroke="#FFC400"
                                    strokeWidth={1}
                                    strokeDasharray="4,4"
                                />
                            </G>
                        )}

                        {/* Vector tips */}
                        <Circle cx={toSvgX(v1x)} cy={toSvgY(v1y)} r={8} fill="#2979FF" stroke="#FFF" strokeWidth={2} />
                        <Circle cx={toSvgX(v2x)} cy={toSvgY(v2y)} r={8} fill="#FF9100" stroke="#FFF" strokeWidth={2} />
                    </Svg>
                </View>

                {/* Operation Selector */}
                <View style={styles.operationRow}>
                    {operations.map((op) => (
                        <TouchableOpacity
                            key={op.key}
                            style={[
                                styles.operationButton,
                                {
                                    backgroundColor: operation === op.key ? `${op.color}30` : themedColors.background.paper,
                                    borderColor: operation === op.key ? op.color : 'transparent',
                                },
                            ]}
                            onPress={() => setOperation(op.key)}
                        >
                            <Ionicons name={op.icon as any} size={20} color={operation === op.key ? op.color : themedColors.text.secondary} />
                            <Text style={[styles.operationText, { color: operation === op.key ? op.color : themedColors.text.primary }]}>
                                {op.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Vector Controls */}
                <View style={[styles.controlsCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.controlsTitle, { color: '#2979FF' }]}>Vector a</Text>
                    <View style={styles.sliderGroup}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.secondary }]}>x: {v1x.toFixed(1)}</Text>
                        <Slider style={styles.slider} minimumValue={-5} maximumValue={5} step={0.5} value={v1x} onValueChange={setV1x} minimumTrackTintColor="#2979FF" thumbTintColor="#2979FF" maximumTrackTintColor={themedColors.border.medium} />
                    </View>
                    <View style={styles.sliderGroup}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.secondary }]}>y: {v1y.toFixed(1)}</Text>
                        <Slider style={styles.slider} minimumValue={-5} maximumValue={5} step={0.5} value={v1y} onValueChange={setV1y} minimumTrackTintColor="#2979FF" thumbTintColor="#2979FF" maximumTrackTintColor={themedColors.border.medium} />
                    </View>

                    <Text style={[styles.controlsTitle, { color: '#FF9100', marginTop: 16 }]}>Vector b</Text>
                    <View style={styles.sliderGroup}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.secondary }]}>x: {v2x.toFixed(1)}</Text>
                        <Slider style={styles.slider} minimumValue={-5} maximumValue={5} step={0.5} value={v2x} onValueChange={setV2x} minimumTrackTintColor="#FF9100" thumbTintColor="#FF9100" maximumTrackTintColor={themedColors.border.medium} />
                    </View>
                    <View style={styles.sliderGroup}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.secondary }]}>y: {v2y.toFixed(1)}</Text>
                        <Slider style={styles.slider} minimumValue={-5} maximumValue={5} step={0.5} value={v2y} onValueChange={setV2y} minimumTrackTintColor="#FF9100" thumbTintColor="#FF9100" maximumTrackTintColor={themedColors.border.medium} />
                    </View>
                </View>

                {/* Toggle Controls */}
                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={[styles.toggleButton, { backgroundColor: showMagnitude ? '#7C4DFF20' : themedColors.background.paper }]}
                        onPress={() => setShowMagnitude(!showMagnitude)}
                    >
                        <Ionicons name={showMagnitude ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={showMagnitude ? '#7C4DFF' : themedColors.text.secondary} />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>Magnitude</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.toggleButton, { backgroundColor: showParallelogram ? '#00E67620' : themedColors.background.paper }]}
                        onPress={() => setShowParallelogram(!showParallelogram)}
                    >
                        <Ionicons name={showParallelogram ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={showParallelogram ? '#00E676' : themedColors.text.secondary} />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>Parallelogram</Text>
                    </TouchableOpacity>
                </View>

                {/* Insight Card */}
                <View style={[styles.insightCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.insightHeader}>
                        <Ionicons name="bulb" size={20} color="#FFC400" />
                        <Text style={[styles.insightTitle, { color: themedColors.text.primary }]}>Key Insight</Text>
                    </View>
                    <Text style={[styles.insightText, { color: themedColors.text.secondary }]}>
                        {operation === 'add' 
                            ? "Vector addition uses the parallelogram rule: place vectors tail-to-tail, and the diagonal from the origin is the sum!"
                            : operation === 'subtract'
                            ? "Subtracting b from a is the same as adding the negative of b. The result points from b's tip to a's tip."
                            : operation === 'dot_product'
                            ? `The dot product a·b = |a||b|cos(θ). When perpendicular, the dot product is zero! Current: ${dotProduct.toFixed(2)}`
                            : "Select an operation to see how vectors combine geometrically."}
                    </Text>
                </View>

                {/* Knowledge Check */}
                <TouchableOpacity
                    style={[styles.quizButton, { backgroundColor: canTakeQuiz ? '#FF9100' : themedColors.background.subtle }]}
                    onPress={() => canTakeQuiz && setShowQuiz(true)}
                    disabled={!canTakeQuiz}
                >
                    <Ionicons name="school" size={24} color={canTakeQuiz ? '#FFF' : themedColors.text.disabled} />
                    <Text style={[styles.quizButtonText, { color: canTakeQuiz ? '#FFF' : themedColors.text.disabled }]}>
                        {canTakeQuiz ? 'Take Knowledge Check' : `Explore more (${explorations}/3)`}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {showQuiz && (
                <KnowledgeCheck simulation={simulation} onClose={() => setShowQuiz(false)} onComplete={() => setShowQuiz(false)} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
    contentContainer: { padding: 16, paddingBottom: 40 },
    displayCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    vectorRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    vectorBadge: { flex: 1, padding: 12, borderRadius: 10 },
    vectorLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    vectorValue: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
    vectorMag: { fontSize: 11, marginTop: 4 },
    resultBadge: { padding: 12, borderRadius: 10 },
    resultLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    resultValue: { fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' },
    canvasContainer: { borderRadius: 16, padding: 8, marginBottom: 16, alignItems: 'center' },
    operationRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    operationButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 2, gap: 4 },
    operationText: { fontSize: 12, fontWeight: '600' },
    controlsCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    controlsTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    sliderGroup: { marginBottom: 8 },
    sliderLabel: { fontSize: 12, marginBottom: 2 },
    slider: { width: '100%', height: 36 },
    toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    toggleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, gap: 8 },
    toggleText: { fontSize: 13, fontWeight: '500' },
    insightCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    insightTitle: { fontSize: 14, fontWeight: '600' },
    insightText: { fontSize: 13, lineHeight: 20 },
    quizButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 10 },
    quizButtonText: { fontSize: 16, fontWeight: '600' },
});

export default VectorVisualizerScreen;
