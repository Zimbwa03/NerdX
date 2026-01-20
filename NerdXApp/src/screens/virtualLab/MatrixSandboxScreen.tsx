// Matrix Sandbox Screen - Mathematics Virtual Lab
// 2D matrix transformations visualization

import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Line, G, Text as SvgText, Polygon, Path, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById, PRESET_MATRICES } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 32;
const CENTER = CANVAS_SIZE / 2;
const SCALE = 40;

type ShapeType = 'square' | 'triangle' | 'arrow';
type PresetKey = keyof typeof PRESET_MATRICES;

const MatrixSandboxScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('matrix-sandbox')!;

    // State for 2x2 matrix
    const [a, setA] = useState(1);
    const [b, setB] = useState(0);
    const [c, setC] = useState(0);
    const [d, setD] = useState(1);
    const [shapeType, setShapeType] = useState<ShapeType>('square');
    const [showOriginal, setShowOriginal] = useState(true);
    const [showGrid, setShowGrid] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [explorations, setExplorations] = useState(0);

    // Calculate determinant
    const determinant = a * d - b * c;

    // Original shape vertices
    const originalShape = useMemo(() => {
        switch (shapeType) {
            case 'square':
                return [
                    { x: 0, y: 0 },
                    { x: 1, y: 0 },
                    { x: 1, y: 1 },
                    { x: 0, y: 1 },
                ];
            case 'triangle':
                return [
                    { x: 0, y: 0 },
                    { x: 2, y: 0 },
                    { x: 1, y: 1.5 },
                ];
            case 'arrow':
                return [
                    { x: 0, y: 0 },
                    { x: 1.5, y: 0 },
                    { x: 1.5, y: -0.3 },
                    { x: 2, y: 0.25 },
                    { x: 1.5, y: 0.8 },
                    { x: 1.5, y: 0.5 },
                    { x: 0, y: 0.5 },
                ];
        }
    }, [shapeType]);

    // Transform vertices
    const transformedShape = useMemo(() => {
        return originalShape.map(({ x, y }) => ({
            x: a * x + b * y,
            y: c * x + d * y,
        }));
    }, [originalShape, a, b, c, d]);

    // Convert to SVG coordinates
    const toSvgX = (x: number) => CENTER + x * SCALE;
    const toSvgY = (y: number) => CENTER - y * SCALE;

    // Generate polygon points string
    const getPolygonPoints = (vertices: { x: number; y: number }[]) => {
        return vertices.map(v => `${toSvgX(v.x)},${toSvgY(v.y)}`).join(' ');
    };

    // Apply preset matrix
    const applyPreset = (preset: PresetKey) => {
        const matrix = PRESET_MATRICES[preset].matrix;
        setA(matrix[0][0]);
        setB(matrix[0][1]);
        setC(matrix[1][0]);
        setD(matrix[1][1]);
        setExplorations(prev => prev + 1);
    };

    // Track explorations
    useEffect(() => {
        const timer = setTimeout(() => {
            setExplorations(prev => Math.min(prev + 1, 5));
        }, 3000);
        return () => clearTimeout(timer);
    }, [a, b, c, d]);

    const canTakeQuiz = explorations >= 4;

    // Get transformation description
    const getTransformDescription = () => {
        if (a === 1 && b === 0 && c === 0 && d === 1) return 'Identity (No change)';
        if (a === 0 && b === -1 && c === 1 && d === 0) return 'Rotation 90° CCW';
        if (a === -1 && b === 0 && c === 0 && d === -1) return 'Rotation 180°';
        if (a === 0 && b === 1 && c === -1 && d === 0) return 'Rotation 90° CW';
        if (a === 1 && b === 0 && c === 0 && d === -1) return 'Reflect over x-axis';
        if (a === -1 && b === 0 && c === 0 && d === 1) return 'Reflect over y-axis';
        if (a === d && b === 0 && c === 0) return `Scale ${a}×`;
        if (b !== 0 || c !== 0) return 'Shear / Custom';
        return 'Custom transformation';
    };

    const presets: { key: PresetKey; label: string; color: string }[] = [
        { key: 'identity', label: 'Identity', color: '#607D8B' },
        { key: 'rotate90', label: 'Rot 90°', color: '#2979FF' },
        { key: 'rotate180', label: 'Rot 180°', color: '#7C4DFF' },
        { key: 'reflectX', label: 'Reflect X', color: '#00BCD4' },
        { key: 'reflectY', label: 'Reflect Y', color: '#00E5FF' },
        { key: 'scale2x', label: 'Scale 2×', color: '#00E676' },
        { key: 'shearRight', label: 'Shear', color: '#FF9100' },
    ];

    const shapes: { key: ShapeType; label: string }[] = [
        { key: 'square', label: '◻ Square' },
        { key: 'triangle', label: '△ Triangle' },
        { key: 'arrow', label: '→ Arrow' },
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
                {/* Matrix Display */}
                <View style={[styles.matrixCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.matrixHeader}>
                        <Text style={[styles.matrixTitle, { color: themedColors.text.primary }]}>
                            Transformation Matrix
                        </Text>
                        <View style={[styles.detBadge, { backgroundColor: determinant >= 0 ? '#00E67620' : '#FF525220' }]}>
                            <Text style={[styles.detText, { color: determinant >= 0 ? '#00E676' : '#FF5252' }]}>
                                det = {determinant.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.matrixGrid}>
                        <Text style={[styles.matrixBracket, { color: themedColors.text.primary }]}>[</Text>
                        <View style={styles.matrixInputs}>
                            <View style={styles.matrixRow}>
                                <TextInput
                                    style={[styles.matrixInput, { color: '#2979FF', borderColor: themedColors.border.medium }]}
                                    value={a.toString()}
                                    onChangeText={(t) => setA(parseFloat(t) || 0)}
                                    keyboardType="numeric"
                                    selectTextOnFocus
                                />
                                <TextInput
                                    style={[styles.matrixInput, { color: '#FF9100', borderColor: themedColors.border.medium }]}
                                    value={b.toString()}
                                    onChangeText={(t) => setB(parseFloat(t) || 0)}
                                    keyboardType="numeric"
                                    selectTextOnFocus
                                />
                            </View>
                            <View style={styles.matrixRow}>
                                <TextInput
                                    style={[styles.matrixInput, { color: '#00E5FF', borderColor: themedColors.border.medium }]}
                                    value={c.toString()}
                                    onChangeText={(t) => setC(parseFloat(t) || 0)}
                                    keyboardType="numeric"
                                    selectTextOnFocus
                                />
                                <TextInput
                                    style={[styles.matrixInput, { color: '#E040FB', borderColor: themedColors.border.medium }]}
                                    value={d.toString()}
                                    onChangeText={(t) => setD(parseFloat(t) || 0)}
                                    keyboardType="numeric"
                                    selectTextOnFocus
                                />
                            </View>
                        </View>
                        <Text style={[styles.matrixBracket, { color: themedColors.text.primary }]}>]</Text>
                    </View>
                    
                    <Text style={[styles.transformDesc, { color: themedColors.text.secondary }]}>
                        {getTransformDescription()}
                    </Text>
                </View>

                {/* Preset Buttons */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
                    {presets.map((preset) => (
                        <TouchableOpacity
                            key={preset.key}
                            style={[styles.presetButton, { backgroundColor: `${preset.color}20`, borderColor: preset.color }]}
                            onPress={() => applyPreset(preset.key)}
                        >
                            <Text style={[styles.presetText, { color: preset.color }]}>{preset.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Visualization Canvas */}
                <View style={[styles.canvasContainer, { backgroundColor: themedColors.background.paper }]}>
                    <Svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
                        {/* Grid */}
                        {showGrid && (
                            <G opacity={0.15}>
                                {Array.from({ length: 13 }, (_, i) => {
                                    const pos = (i - 6) * SCALE + CENTER;
                                    return (
                                        <G key={i}>
                                            <Line x1={pos} y1={0} x2={pos} y2={CANVAS_SIZE} stroke={themedColors.text.secondary} strokeWidth={0.5} />
                                            <Line x1={0} y1={pos} x2={CANVAS_SIZE} y2={pos} stroke={themedColors.text.secondary} strokeWidth={0.5} />
                                        </G>
                                    );
                                })}
                            </G>
                        )}

                        {/* Axes */}
                        <Line x1={0} y1={CENTER} x2={CANVAS_SIZE} y2={CENTER} stroke={themedColors.text.secondary} strokeWidth={1.5} />
                        <Line x1={CENTER} y1={0} x2={CENTER} y2={CANVAS_SIZE} stroke={themedColors.text.secondary} strokeWidth={1.5} />

                        {/* Axis labels */}
                        <SvgText x={CANVAS_SIZE - 15} y={CENTER - 8} fontSize={12} fill={themedColors.text.secondary}>x</SvgText>
                        <SvgText x={CENTER + 8} y={15} fontSize={12} fill={themedColors.text.secondary}>y</SvgText>

                        {/* Transformed basis vectors */}
                        <Line x1={CENTER} y1={CENTER} x2={toSvgX(a)} y2={toSvgY(c)} stroke="#2979FF" strokeWidth={2} strokeDasharray="4,4" />
                        <Line x1={CENTER} y1={CENTER} x2={toSvgX(b)} y2={toSvgY(d)} stroke="#FF9100" strokeWidth={2} strokeDasharray="4,4" />
                        <Circle cx={toSvgX(a)} cy={toSvgY(c)} r={4} fill="#2979FF" />
                        <Circle cx={toSvgX(b)} cy={toSvgY(d)} r={4} fill="#FF9100" />

                        {/* Original shape */}
                        {showOriginal && (
                            <Polygon
                                points={getPolygonPoints(originalShape)}
                                fill="#2979FF20"
                                stroke="#2979FF"
                                strokeWidth={2}
                                strokeDasharray="6,4"
                            />
                        )}

                        {/* Transformed shape */}
                        <Polygon
                            points={getPolygonPoints(transformedShape)}
                            fill="#00E67630"
                            stroke="#00E676"
                            strokeWidth={3}
                        />

                        {/* Origin */}
                        <Circle cx={CENTER} cy={CENTER} r={5} fill="#FF4081" />
                    </Svg>
                </View>

                {/* Shape Selector */}
                <View style={styles.shapeSelector}>
                    {shapes.map((shape) => (
                        <TouchableOpacity
                            key={shape.key}
                            style={[
                                styles.shapeButton,
                                {
                                    backgroundColor: shapeType === shape.key ? '#E040FB20' : themedColors.background.paper,
                                    borderColor: shapeType === shape.key ? '#E040FB' : 'transparent',
                                },
                            ]}
                            onPress={() => setShapeType(shape.key)}
                        >
                            <Text style={[styles.shapeText, { color: shapeType === shape.key ? '#E040FB' : themedColors.text.primary }]}>
                                {shape.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Toggle Controls */}
                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={[styles.toggleButton, { backgroundColor: showOriginal ? '#2979FF20' : themedColors.background.paper }]}
                        onPress={() => setShowOriginal(!showOriginal)}
                    >
                        <Ionicons name={showOriginal ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={showOriginal ? '#2979FF' : themedColors.text.secondary} />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>Original</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.toggleButton, { backgroundColor: showGrid ? '#00E5FF20' : themedColors.background.paper }]}
                        onPress={() => setShowGrid(!showGrid)}
                    >
                        <Ionicons name={showGrid ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={showGrid ? '#00E5FF' : themedColors.text.secondary} />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>Grid</Text>
                    </TouchableOpacity>
                </View>

                {/* Info Card */}
                <View style={[styles.infoCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.infoTitle, { color: themedColors.text.primary }]}>Matrix Properties</Text>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Determinant:</Text>
                        <Text style={[styles.infoValue, { color: determinant >= 0 ? '#00E676' : '#FF5252' }]}>
                            {determinant.toFixed(3)} {determinant < 0 ? '(flips orientation)' : ''}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Area Scale Factor:</Text>
                        <Text style={[styles.infoValue, { color: '#FFC400' }]}>|det| = {Math.abs(determinant).toFixed(3)}×</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Invertible:</Text>
                        <Text style={[styles.infoValue, { color: determinant !== 0 ? '#00E676' : '#FF5252' }]}>
                            {determinant !== 0 ? 'Yes' : 'No (singular matrix)'}
                        </Text>
                    </View>
                </View>

                {/* Insight */}
                <View style={[styles.insightCard, { backgroundColor: '#E040FB15' }]}>
                    <View style={styles.insightHeader}>
                        <Ionicons name="bulb" size={20} color="#E040FB" />
                        <Text style={[styles.insightTitle, { color: '#E040FB' }]}>Key Insight</Text>
                    </View>
                    <Text style={[styles.insightText, { color: themedColors.text.secondary }]}>
                        {determinant === 0
                            ? "When det = 0, the transformation collapses space to a line or point. The matrix is not invertible!"
                            : determinant < 0
                            ? "A negative determinant means the transformation flips orientation (like a reflection)."
                            : `The determinant ${determinant.toFixed(2)} tells us the transformed shape has ${Math.abs(determinant).toFixed(2)}× the original area.`
                        }
                    </Text>
                </View>

                {/* Knowledge Check */}
                <TouchableOpacity
                    style={[styles.quizButton, { backgroundColor: canTakeQuiz ? '#E040FB' : themedColors.background.subtle }]}
                    onPress={() => canTakeQuiz && setShowQuiz(true)}
                    disabled={!canTakeQuiz}
                >
                    <Ionicons name="school" size={24} color={canTakeQuiz ? '#FFF' : themedColors.text.disabled} />
                    <Text style={[styles.quizButtonText, { color: canTakeQuiz ? '#FFF' : themedColors.text.disabled }]}>
                        {canTakeQuiz ? 'Take Knowledge Check' : `Explore more (${explorations}/4)`}
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
    matrixCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    matrixHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    matrixTitle: { fontSize: 14, fontWeight: '600' },
    detBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    detText: { fontSize: 12, fontWeight: '600' },
    matrixGrid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    matrixBracket: { fontSize: 48, fontWeight: '200' },
    matrixInputs: { marginHorizontal: 8 },
    matrixRow: { flexDirection: 'row', gap: 12, marginVertical: 4 },
    matrixInput: { width: 60, height: 44, textAlign: 'center', fontSize: 18, fontWeight: 'bold', borderWidth: 1, borderRadius: 8, fontFamily: 'monospace' },
    transformDesc: { fontSize: 13, textAlign: 'center' },
    presetsScroll: { marginBottom: 16 },
    presetButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, marginRight: 8, borderWidth: 1 },
    presetText: { fontSize: 12, fontWeight: '600' },
    canvasContainer: { borderRadius: 16, padding: 8, marginBottom: 16, alignItems: 'center' },
    shapeSelector: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    shapeButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 2 },
    shapeText: { fontSize: 13, fontWeight: '500' },
    toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    toggleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, gap: 8 },
    toggleText: { fontSize: 13, fontWeight: '500' },
    infoCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    infoTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    infoLabel: { fontSize: 13 },
    infoValue: { fontSize: 13, fontWeight: '600' },
    insightCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    insightTitle: { fontSize: 14, fontWeight: '600' },
    insightText: { fontSize: 13, lineHeight: 20 },
    quizButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 10 },
    quizButtonText: { fontSize: 16, fontWeight: '600' },
});

export default MatrixSandboxScreen;
