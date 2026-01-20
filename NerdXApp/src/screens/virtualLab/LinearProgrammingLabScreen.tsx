// Linear Programming Lab Screen - Mathematics Virtual Lab
// Visualize constraints, feasible regions, and optimization

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
import Svg, { Circle, Line, G, Text as SvgText, Polygon, Path, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 32;
const CANVAS_HEIGHT = 300;
const PADDING = 40;
const GRAPH_WIDTH = CANVAS_WIDTH - 2 * PADDING;
const GRAPH_HEIGHT = CANVAS_HEIGHT - 2 * PADDING;
const X_MAX = 10;
const Y_MAX = 10;

type ProblemType = 'maximize' | 'minimize';

interface Constraint {
    a: number;
    b: number;
    c: number;
    label: string;
    color: string;
}

const LinearProgrammingLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('linear-programming-lab')!;

    // Constraints: ax + by <= c
    const [constraints, setConstraints] = useState<Constraint[]>([
        { a: 1, b: 1, c: 6, label: 'x + y ≤ 6', color: '#2979FF' },
        { a: 2, b: 1, c: 8, label: '2x + y ≤ 8', color: '#FF9100' },
        { a: 0, b: 1, c: 4, label: 'y ≤ 4', color: '#00E676' },
    ]);

    // Objective function coefficients: maximize/minimize ax + by
    const [objA, setObjA] = useState(3);
    const [objB, setObjB] = useState(2);
    const [problemType, setProblemType] = useState<ProblemType>('maximize');
    const [objectiveValue, setObjectiveValue] = useState(12);
    const [showFeasible, setShowFeasible] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [explorations, setExplorations] = useState(0);

    // Convert graph coordinates to SVG
    const toSvgX = (x: number) => PADDING + (x / X_MAX) * GRAPH_WIDTH;
    const toSvgY = (y: number) => PADDING + GRAPH_HEIGHT - (y / Y_MAX) * GRAPH_HEIGHT;

    // Find intersection of two lines ax + by = c
    const findIntersection = (
        a1: number, b1: number, c1: number,
        a2: number, b2: number, c2: number
    ): { x: number; y: number } | null => {
        const det = a1 * b2 - a2 * b1;
        if (Math.abs(det) < 0.0001) return null;
        const x = (c1 * b2 - c2 * b1) / det;
        const y = (a1 * c2 - a2 * c1) / det;
        return { x, y };
    };

    // Find vertices of feasible region
    const feasibleVertices = useMemo(() => {
        const vertices: { x: number; y: number }[] = [];
        const allLines = [
            ...constraints.map(c => ({ a: c.a, b: c.b, c: c.c })),
            { a: 1, b: 0, c: 0 }, // x >= 0 (as x = 0)
            { a: 0, b: 1, c: 0 }, // y >= 0 (as y = 0)
        ];

        // Find all intersections
        for (let i = 0; i < allLines.length; i++) {
            for (let j = i + 1; j < allLines.length; j++) {
                const point = findIntersection(
                    allLines[i].a, allLines[i].b, allLines[i].c,
                    allLines[j].a, allLines[j].b, allLines[j].c
                );
                if (point && point.x >= -0.01 && point.y >= -0.01) {
                    // Check if point satisfies all constraints
                    let feasible = true;
                    for (const c of constraints) {
                        if (c.a * point.x + c.b * point.y > c.c + 0.01) {
                            feasible = false;
                            break;
                        }
                    }
                    if (feasible && point.x <= X_MAX && point.y <= Y_MAX) {
                        vertices.push(point);
                    }
                }
            }
        }

        // Sort vertices by angle from centroid for proper polygon
        if (vertices.length > 2) {
            const cx = vertices.reduce((s, v) => s + v.x, 0) / vertices.length;
            const cy = vertices.reduce((s, v) => s + v.y, 0) / vertices.length;
            vertices.sort((a, b) => 
                Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx)
            );
        }

        return vertices;
    }, [constraints]);

    // Find optimal point
    const optimalPoint = useMemo(() => {
        if (feasibleVertices.length === 0) return null;
        
        let best = feasibleVertices[0];
        let bestValue = objA * best.x + objB * best.y;

        for (const v of feasibleVertices) {
            const value = objA * v.x + objB * v.y;
            if (problemType === 'maximize' ? value > bestValue : value < bestValue) {
                bestValue = value;
                best = v;
            }
        }

        return { point: best, value: bestValue };
    }, [feasibleVertices, objA, objB, problemType]);

    // Generate constraint line path
    const getConstraintPath = (a: number, b: number, c: number) => {
        // ax + by = c
        const points: string[] = [];
        
        if (Math.abs(b) > 0.001) {
            // y = (c - ax) / b
            for (let x = 0; x <= X_MAX; x += 0.5) {
                const y = (c - a * x) / b;
                if (y >= 0 && y <= Y_MAX) {
                    points.push(`${points.length === 0 ? 'M' : 'L'} ${toSvgX(x)} ${toSvgY(y)}`);
                }
            }
        } else if (Math.abs(a) > 0.001) {
            // Vertical line x = c/a
            const x = c / a;
            if (x >= 0 && x <= X_MAX) {
                return `M ${toSvgX(x)} ${toSvgY(0)} L ${toSvgX(x)} ${toSvgY(Y_MAX)}`;
            }
        }
        
        return points.join(' ');
    };

    // Objective function line path
    const objectivePath = useMemo(() => {
        // objA * x + objB * y = objectiveValue
        if (Math.abs(objB) > 0.001) {
            const points: string[] = [];
            for (let x = -2; x <= X_MAX + 2; x += 0.5) {
                const y = (objectiveValue - objA * x) / objB;
                points.push(`${points.length === 0 ? 'M' : 'L'} ${toSvgX(x)} ${toSvgY(y)}`);
            }
            return points.join(' ');
        }
        return '';
    }, [objA, objB, objectiveValue]);

    // Feasible region polygon
    const feasiblePolygon = useMemo(() => {
        if (feasibleVertices.length < 3) return '';
        return feasibleVertices.map(v => `${toSvgX(v.x)},${toSvgY(v.y)}`).join(' ');
    }, [feasibleVertices]);

    // Track explorations
    useEffect(() => {
        const timer = setTimeout(() => {
            setExplorations(prev => Math.min(prev + 1, 5));
        }, 3000);
        return () => clearTimeout(timer);
    }, [objectiveValue, problemType]);

    const canTakeQuiz = explorations >= 3;

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
                {/* Problem Display */}
                <View style={[styles.problemCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.problemHeader}>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                { backgroundColor: problemType === 'maximize' ? '#00E67630' : themedColors.background.subtle },
                            ]}
                            onPress={() => setProblemType('maximize')}
                        >
                            <Text style={[styles.typeText, { color: problemType === 'maximize' ? '#00E676' : themedColors.text.secondary }]}>
                                Maximize
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                { backgroundColor: problemType === 'minimize' ? '#FF525230' : themedColors.background.subtle },
                            ]}
                            onPress={() => setProblemType('minimize')}
                        >
                            <Text style={[styles.typeText, { color: problemType === 'minimize' ? '#FF5252' : themedColors.text.secondary }]}>
                                Minimize
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={[styles.objectiveLabel, { color: themedColors.text.secondary }]}>
                        Objective Function:
                    </Text>
                    <Text style={[styles.objectiveText, { color: '#FFD740' }]}>
                        Z = {objA}x + {objB}y
                    </Text>
                    
                    {optimalPoint && (
                        <View style={[styles.optimalBadge, { backgroundColor: '#FFD74020' }]}>
                            <Text style={[styles.optimalLabel, { color: '#FFD740' }]}>
                                Optimal Solution:
                            </Text>
                            <Text style={[styles.optimalValue, { color: '#FFD740' }]}>
                                ({optimalPoint.point.x.toFixed(2)}, {optimalPoint.point.y.toFixed(2)}) → Z = {optimalPoint.value.toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Constraints List */}
                <View style={[styles.constraintsCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.constraintsTitle, { color: themedColors.text.primary }]}>
                        Constraints
                    </Text>
                    {constraints.map((c, idx) => (
                        <View key={idx} style={styles.constraintRow}>
                            <View style={[styles.constraintDot, { backgroundColor: c.color }]} />
                            <Text style={[styles.constraintText, { color: themedColors.text.primary }]}>
                                {c.label}
                            </Text>
                        </View>
                    ))}
                    <View style={styles.constraintRow}>
                        <View style={[styles.constraintDot, { backgroundColor: '#607D8B' }]} />
                        <Text style={[styles.constraintText, { color: themedColors.text.secondary }]}>
                            x ≥ 0, y ≥ 0 (Non-negativity)
                        </Text>
                    </View>
                </View>

                {/* Graph Canvas */}
                <View style={[styles.canvasContainer, { backgroundColor: themedColors.background.paper }]}>
                    <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                        {/* Grid */}
                        <G opacity={0.2}>
                            {Array.from({ length: 11 }, (_, i) => {
                                const x = PADDING + (i / 10) * GRAPH_WIDTH;
                                const y = PADDING + (i / 10) * GRAPH_HEIGHT;
                                return (
                                    <G key={i}>
                                        <Line x1={x} y1={PADDING} x2={x} y2={PADDING + GRAPH_HEIGHT} stroke={themedColors.text.secondary} strokeWidth={0.5} />
                                        <Line x1={PADDING} y1={y} x2={PADDING + GRAPH_WIDTH} y2={y} stroke={themedColors.text.secondary} strokeWidth={0.5} />
                                    </G>
                                );
                            })}
                        </G>

                        {/* Axes */}
                        <Line x1={PADDING} y1={PADDING + GRAPH_HEIGHT} x2={PADDING + GRAPH_WIDTH} y2={PADDING + GRAPH_HEIGHT} stroke={themedColors.text.secondary} strokeWidth={2} />
                        <Line x1={PADDING} y1={PADDING} x2={PADDING} y2={PADDING + GRAPH_HEIGHT} stroke={themedColors.text.secondary} strokeWidth={2} />

                        {/* Axis labels */}
                        <SvgText x={PADDING + GRAPH_WIDTH - 10} y={PADDING + GRAPH_HEIGHT + 20} fontSize={12} fill={themedColors.text.secondary}>x</SvgText>
                        <SvgText x={PADDING - 20} y={PADDING + 10} fontSize={12} fill={themedColors.text.secondary}>y</SvgText>
                        <SvgText x={PADDING + GRAPH_WIDTH + 5} y={PADDING + GRAPH_HEIGHT + 4} fontSize={10} fill={themedColors.text.secondary}>{X_MAX}</SvgText>
                        <SvgText x={PADDING - 15} y={PADDING + 4} fontSize={10} fill={themedColors.text.secondary}>{Y_MAX}</SvgText>

                        {/* Feasible region */}
                        {showFeasible && feasiblePolygon && (
                            <Polygon
                                points={feasiblePolygon}
                                fill="#00E67620"
                                stroke="#00E676"
                                strokeWidth={2}
                            />
                        )}

                        {/* Constraint lines */}
                        {constraints.map((c, idx) => (
                            <Path
                                key={idx}
                                d={getConstraintPath(c.a, c.b, c.c)}
                                stroke={c.color}
                                strokeWidth={2}
                                fill="none"
                            />
                        ))}

                        {/* Objective function line */}
                        <Path
                            d={objectivePath}
                            stroke="#FFD740"
                            strokeWidth={3}
                            fill="none"
                            strokeDasharray="8,4"
                        />

                        {/* Feasible vertices */}
                        {feasibleVertices.map((v, idx) => (
                            <Circle
                                key={idx}
                                cx={toSvgX(v.x)}
                                cy={toSvgY(v.y)}
                                r={6}
                                fill={optimalPoint && v.x === optimalPoint.point.x && v.y === optimalPoint.point.y ? '#FFD740' : '#00E676'}
                                stroke="#FFF"
                                strokeWidth={2}
                            />
                        ))}

                        {/* Optimal point highlight */}
                        {optimalPoint && (
                            <G>
                                <Circle
                                    cx={toSvgX(optimalPoint.point.x)}
                                    cy={toSvgY(optimalPoint.point.y)}
                                    r={12}
                                    fill="#FFD74040"
                                    stroke="#FFD740"
                                    strokeWidth={2}
                                />
                                <SvgText
                                    x={toSvgX(optimalPoint.point.x) + 15}
                                    y={toSvgY(optimalPoint.point.y) - 10}
                                    fontSize={11}
                                    fill="#FFD740"
                                    fontWeight="bold"
                                >
                                    Optimal
                                </SvgText>
                            </G>
                        )}
                    </Svg>
                </View>

                {/* Objective Line Slider */}
                <View style={[styles.sliderCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                        Drag objective line: Z = {objectiveValue.toFixed(1)}
                    </Text>
                    <Text style={[styles.sliderHint, { color: themedColors.text.secondary }]}>
                        Move the yellow dashed line to find the optimal point
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={30}
                        step={0.5}
                        value={objectiveValue}
                        onValueChange={setObjectiveValue}
                        minimumTrackTintColor="#FFD740"
                        maximumTrackTintColor={themedColors.border.medium}
                        thumbTintColor="#FFD740"
                    />
                </View>

                {/* Objective Coefficients */}
                <View style={[styles.coeffCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.coeffRow}>
                        <Text style={[styles.coeffLabel, { color: themedColors.text.secondary }]}>
                            Coefficient of x: {objA}
                        </Text>
                        <Slider
                            style={styles.coeffSlider}
                            minimumValue={1}
                            maximumValue={10}
                            step={1}
                            value={objA}
                            onValueChange={setObjA}
                            minimumTrackTintColor="#FFD740"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#FFD740"
                        />
                    </View>
                    <View style={styles.coeffRow}>
                        <Text style={[styles.coeffLabel, { color: themedColors.text.secondary }]}>
                            Coefficient of y: {objB}
                        </Text>
                        <Slider
                            style={styles.coeffSlider}
                            minimumValue={1}
                            maximumValue={10}
                            step={1}
                            value={objB}
                            onValueChange={setObjB}
                            minimumTrackTintColor="#FFD740"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#FFD740"
                        />
                    </View>
                </View>

                {/* Toggle */}
                <TouchableOpacity
                    style={[styles.toggleButton, { backgroundColor: showFeasible ? '#00E67620' : themedColors.background.paper }]}
                    onPress={() => setShowFeasible(!showFeasible)}
                >
                    <Ionicons name={showFeasible ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={showFeasible ? '#00E676' : themedColors.text.secondary} />
                    <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>Show Feasible Region</Text>
                </TouchableOpacity>

                {/* Insight */}
                <View style={[styles.insightCard, { backgroundColor: '#FFD74015' }]}>
                    <View style={styles.insightHeader}>
                        <Ionicons name="bulb" size={20} color="#FFD740" />
                        <Text style={[styles.insightTitle, { color: '#FFD740' }]}>Key Insight</Text>
                    </View>
                    <Text style={[styles.insightText, { color: themedColors.text.secondary }]}>
                        The optimal solution always occurs at a corner (vertex) of the feasible region! 
                        Move the objective line as far as possible in the desired direction while staying in the green region.
                    </Text>
                </View>

                {/* Knowledge Check */}
                <TouchableOpacity
                    style={[styles.quizButton, { backgroundColor: canTakeQuiz ? '#FFD740' : themedColors.background.subtle }]}
                    onPress={() => canTakeQuiz && setShowQuiz(true)}
                    disabled={!canTakeQuiz}
                >
                    <Ionicons name="school" size={24} color={canTakeQuiz ? '#000' : themedColors.text.disabled} />
                    <Text style={[styles.quizButtonText, { color: canTakeQuiz ? '#000' : themedColors.text.disabled }]}>
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
    problemCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    problemHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    typeButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    typeText: { fontSize: 14, fontWeight: '600' },
    objectiveLabel: { fontSize: 12, marginBottom: 4 },
    objectiveText: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    optimalBadge: { padding: 12, borderRadius: 10 },
    optimalLabel: { fontSize: 12, marginBottom: 4 },
    optimalValue: { fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' },
    constraintsCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    constraintsTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
    constraintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
    constraintDot: { width: 12, height: 12, borderRadius: 6 },
    constraintText: { fontSize: 13 },
    canvasContainer: { borderRadius: 16, padding: 8, marginBottom: 16 },
    sliderCard: { padding: 16, borderRadius: 12, marginBottom: 12 },
    sliderLabel: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
    sliderHint: { fontSize: 11, marginBottom: 8 },
    slider: { width: '100%', height: 40 },
    coeffCard: { padding: 16, borderRadius: 12, marginBottom: 16, backgroundColor: 'transparent' },
    coeffRow: { marginBottom: 8 },
    coeffLabel: { fontSize: 12, marginBottom: 2 },
    coeffSlider: { width: '100%', height: 36 },
    toggleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, gap: 8, marginBottom: 16 },
    toggleText: { fontSize: 13, fontWeight: '500' },
    insightCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    insightTitle: { fontSize: 14, fontWeight: '600' },
    insightText: { fontSize: 13, lineHeight: 20 },
    quizButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 10 },
    quizButtonText: { fontSize: 16, fontWeight: '600' },
});

export default LinearProgrammingLabScreen;
