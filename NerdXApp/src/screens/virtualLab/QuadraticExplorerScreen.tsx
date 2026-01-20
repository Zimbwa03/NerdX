// Quadratic Explorer Screen - Mathematics Virtual Lab
// Interactive parabola with draggable vertex

import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Svg, { Circle, Line, Path, G, Text as SvgText, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 32;
const CANVAS_HEIGHT = 300;
const GRAPH_PADDING = 40;
const GRAPH_WIDTH = CANVAS_WIDTH - 2 * GRAPH_PADDING;
const GRAPH_HEIGHT = CANVAS_HEIGHT - 2 * GRAPH_PADDING;

const QuadraticExplorerScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('quadratic-explorer')!;

    // State for vertex form: y = a(x - h)² + k
    const [a, setA] = useState(1);
    const [h, setH] = useState(0);
    const [k, setK] = useState(0);
    const [showRoots, setShowRoots] = useState(true);
    const [showAxis, setShowAxis] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [explorations, setExplorations] = useState(0);

    // Graph range
    const xMin = -6;
    const xMax = 6;
    const yMin = -6;
    const yMax = 10;

    // Convert coordinates
    const toSvgX = (x: number) => GRAPH_PADDING + ((x - xMin) / (xMax - xMin)) * GRAPH_WIDTH;
    const toSvgY = (y: number) => GRAPH_PADDING + GRAPH_HEIGHT - ((y - yMin) / (yMax - yMin)) * GRAPH_HEIGHT;
    const fromSvgX = (svgX: number) => xMin + ((svgX - GRAPH_PADDING) / GRAPH_WIDTH) * (xMax - xMin);
    const fromSvgY = (svgY: number) => yMax - ((svgY - GRAPH_PADDING) / GRAPH_HEIGHT) * (yMax - yMin);

    // Calculate standard form coefficients: y = ax² + bx + c
    const b = -2 * a * h;
    const c = a * h * h + k;

    // Calculate discriminant and roots
    const discriminant = b * b - 4 * a * c;
    const roots = useMemo(() => {
        if (discriminant < 0) return [];
        if (discriminant === 0) return [-b / (2 * a)];
        const sqrtD = Math.sqrt(discriminant);
        return [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
    }, [a, b, c, discriminant]);

    // Generate parabola path
    const generatePath = useMemo(() => {
        const points: string[] = [];
        const step = (xMax - xMin) / 200;
        
        for (let x = xMin; x <= xMax; x += step) {
            const y = a * Math.pow(x - h, 2) + k;
            if (y >= yMin && y <= yMax) {
                const svgX = toSvgX(x);
                const svgY = toSvgY(y);
                points.push(`${points.length === 0 ? 'M' : 'L'} ${svgX} ${svgY}`);
            }
        }
        return points.join(' ');
    }, [a, h, k]);

    // Vertex drag handler
    const panResponder = useMemo(() => 
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                const newH = Math.max(xMin + 1, Math.min(xMax - 1, fromSvgX(gestureState.moveX - 16)));
                const newK = Math.max(yMin + 1, Math.min(yMax - 1, fromSvgY(gestureState.moveY - 200)));
                setH(Math.round(newH * 10) / 10);
                setK(Math.round(newK * 10) / 10);
            },
        }), 
    []);

    // Track explorations
    useEffect(() => {
        const timer = setTimeout(() => {
            setExplorations(prev => prev + 1);
        }, 2000);
        return () => clearTimeout(timer);
    }, [a, h, k]);

    const canTakeQuiz = explorations >= 3;

    // Determine root nature description
    const getRootNature = () => {
        if (discriminant > 0) return { text: 'Two distinct real roots', color: '#00E676' };
        if (discriminant === 0) return { text: 'One repeated root', color: '#FFC400' };
        return { text: 'No real roots (complex)', color: '#FF5252' };
    };

    const rootNature = getRootNature();

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
                    <Text style={[styles.equationLabel, { color: themedColors.text.secondary }]}>
                        Vertex Form
                    </Text>
                    <Text style={[styles.equationText, { color: '#00E676' }]}>
                        y = {a >= 0 ? '' : '-'}{Math.abs(a) !== 1 ? Math.abs(a) : ''}(x {h >= 0 ? '-' : '+'} {Math.abs(h)})² {k >= 0 ? '+' : '-'} {Math.abs(k)}
                    </Text>
                    <Text style={[styles.equationLabel, { color: themedColors.text.secondary, marginTop: 8 }]}>
                        Standard Form
                    </Text>
                    <Text style={[styles.equationText, { color: '#2979FF' }]}>
                        y = {a}x² {b >= 0 ? '+' : '-'} {Math.abs(b).toFixed(1)}x {c >= 0 ? '+' : '-'} {Math.abs(c).toFixed(1)}
                    </Text>
                </View>

                {/* Main Graph Canvas */}
                <View style={[styles.canvasContainer, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.canvasHint, { color: themedColors.text.secondary }]}>
                        💡 Drag the pink vertex to move the parabola!
                    </Text>
                    <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                        {/* Grid */}
                        <G opacity={0.3}>
                            {Array.from({ length: 13 }, (_, i) => {
                                const x = GRAPH_PADDING + (i / 12) * GRAPH_WIDTH;
                                return (
                                    <Line
                                        key={`v${i}`}
                                        x1={x}
                                        y1={GRAPH_PADDING}
                                        x2={x}
                                        y2={GRAPH_PADDING + GRAPH_HEIGHT}
                                        stroke={themedColors.border.light}
                                        strokeWidth={0.5}
                                    />
                                );
                            })}
                            {Array.from({ length: 17 }, (_, i) => {
                                const y = GRAPH_PADDING + (i / 16) * GRAPH_HEIGHT;
                                return (
                                    <Line
                                        key={`h${i}`}
                                        x1={GRAPH_PADDING}
                                        y1={y}
                                        x2={GRAPH_PADDING + GRAPH_WIDTH}
                                        y2={y}
                                        stroke={themedColors.border.light}
                                        strokeWidth={0.5}
                                    />
                                );
                            })}
                        </G>

                        {/* Axes */}
                        <Line
                            x1={GRAPH_PADDING}
                            y1={toSvgY(0)}
                            x2={GRAPH_PADDING + GRAPH_WIDTH}
                            y2={toSvgY(0)}
                            stroke={themedColors.text.secondary}
                            strokeWidth={1.5}
                        />
                        <Line
                            x1={toSvgX(0)}
                            y1={GRAPH_PADDING}
                            x2={toSvgX(0)}
                            y2={GRAPH_PADDING + GRAPH_HEIGHT}
                            stroke={themedColors.text.secondary}
                            strokeWidth={1.5}
                        />

                        {/* Axis of symmetry */}
                        {showAxis && (
                            <Line
                                x1={toSvgX(h)}
                                y1={GRAPH_PADDING}
                                x2={toSvgX(h)}
                                y2={GRAPH_PADDING + GRAPH_HEIGHT}
                                stroke="#FFC400"
                                strokeWidth={2}
                                strokeDasharray="8,4"
                            />
                        )}

                        {/* Parabola */}
                        <Path
                            d={generatePath}
                            stroke="#00E676"
                            strokeWidth={3}
                            fill="none"
                        />

                        {/* Roots */}
                        {showRoots && roots.map((root, idx) => (
                            <G key={idx}>
                                <Circle
                                    cx={toSvgX(root)}
                                    cy={toSvgY(0)}
                                    r={8}
                                    fill="#2979FF"
                                    stroke="#FFF"
                                    strokeWidth={2}
                                />
                                <SvgText
                                    x={toSvgX(root)}
                                    y={toSvgY(0) + 20}
                                    textAnchor="middle"
                                    fontSize={10}
                                    fill="#2979FF"
                                    fontWeight="bold"
                                >
                                    x={root.toFixed(2)}
                                </SvgText>
                            </G>
                        ))}

                        {/* Vertex (draggable) */}
                        <Circle
                            cx={toSvgX(h)}
                            cy={toSvgY(k)}
                            r={14}
                            fill="#FF4081"
                            stroke="#FFF"
                            strokeWidth={3}
                        />
                        <SvgText
                            x={toSvgX(h)}
                            y={toSvgY(k) - 20}
                            textAnchor="middle"
                            fontSize={11}
                            fill="#FF4081"
                            fontWeight="bold"
                        >
                            V({h.toFixed(1)}, {k.toFixed(1)})
                        </SvgText>

                        {/* Axis label */}
                        {showAxis && (
                            <SvgText
                                x={toSvgX(h) + 10}
                                y={GRAPH_PADDING + 15}
                                fontSize={10}
                                fill="#FFC400"
                            >
                                x = {h.toFixed(1)}
                            </SvgText>
                        )}
                    </Svg>
                    
                    {/* Invisible touch area for dragging vertex */}
                    <View
                        {...panResponder.panHandlers}
                        style={[
                            styles.dragArea,
                            {
                                left: toSvgX(h) - 30,
                                top: toSvgY(k) - 30 + 25, // Account for hint text
                            },
                        ]}
                    />
                </View>

                {/* Coefficient Sliders */}
                <View style={[styles.slidersCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.sliderRow}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                            a = {a.toFixed(1)} {a > 0 ? '(opens up)' : a < 0 ? '(opens down)' : '(flat)'}
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-3}
                            maximumValue={3}
                            step={0.1}
                            value={a}
                            onValueChange={(val) => setA(Math.round(val * 10) / 10)}
                            minimumTrackTintColor="#00E676"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#00E676"
                        />
                    </View>

                    <View style={styles.sliderRow}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                            h = {h.toFixed(1)} (horizontal shift)
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-4}
                            maximumValue={4}
                            step={0.1}
                            value={h}
                            onValueChange={(val) => setH(Math.round(val * 10) / 10)}
                            minimumTrackTintColor="#FF4081"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#FF4081"
                        />
                    </View>

                    <View style={styles.sliderRow}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                            k = {k.toFixed(1)} (vertical shift)
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-4}
                            maximumValue={6}
                            step={0.1}
                            value={k}
                            onValueChange={(val) => setK(Math.round(val * 10) / 10)}
                            minimumTrackTintColor="#FF4081"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#FF4081"
                        />
                    </View>
                </View>

                {/* Toggle Controls */}
                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            { backgroundColor: showRoots ? '#2979FF20' : themedColors.background.paper },
                        ]}
                        onPress={() => setShowRoots(!showRoots)}
                    >
                        <Ionicons
                            name={showRoots ? 'checkmark-circle' : 'ellipse-outline'}
                            size={20}
                            color={showRoots ? '#2979FF' : themedColors.text.secondary}
                        />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>
                            Show Roots
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            { backgroundColor: showAxis ? '#FFC40020' : themedColors.background.paper },
                        ]}
                        onPress={() => setShowAxis(!showAxis)}
                    >
                        <Ionicons
                            name={showAxis ? 'checkmark-circle' : 'ellipse-outline'}
                            size={20}
                            color={showAxis ? '#FFC400' : themedColors.text.secondary}
                        />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>
                            Axis of Symmetry
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Discriminant Card */}
                <View style={[styles.discriminantCard, { backgroundColor: `${rootNature.color}15` }]}>
                    <View style={styles.discriminantHeader}>
                        <Text style={[styles.discriminantLabel, { color: themedColors.text.secondary }]}>
                            Discriminant (b² - 4ac)
                        </Text>
                        <Text style={[styles.discriminantValue, { color: rootNature.color }]}>
                            = {discriminant.toFixed(2)}
                        </Text>
                    </View>
                    <Text style={[styles.discriminantNature, { color: rootNature.color }]}>
                        {rootNature.text}
                    </Text>
                    {roots.length > 0 && (
                        <Text style={[styles.rootsText, { color: themedColors.text.primary }]}>
                            Roots: {roots.map(r => r.toFixed(2)).join(', ')}
                        </Text>
                    )}
                </View>

                {/* Key Properties */}
                <View style={[styles.propertiesCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.propertiesTitle, { color: themedColors.text.primary }]}>
                        Key Properties
                    </Text>
                    <View style={styles.propertyRow}>
                        <Text style={[styles.propertyLabel, { color: themedColors.text.secondary }]}>Vertex:</Text>
                        <Text style={[styles.propertyValue, { color: '#FF4081' }]}>({h.toFixed(1)}, {k.toFixed(1)})</Text>
                    </View>
                    <View style={styles.propertyRow}>
                        <Text style={[styles.propertyLabel, { color: themedColors.text.secondary }]}>Axis of Symmetry:</Text>
                        <Text style={[styles.propertyValue, { color: '#FFC400' }]}>x = {h.toFixed(1)}</Text>
                    </View>
                    <View style={styles.propertyRow}>
                        <Text style={[styles.propertyLabel, { color: themedColors.text.secondary }]}>Direction:</Text>
                        <Text style={[styles.propertyValue, { color: '#00E676' }]}>
                            {a > 0 ? 'Opens Upward (minimum)' : a < 0 ? 'Opens Downward (maximum)' : 'Flat line'}
                        </Text>
                    </View>
                    <View style={styles.propertyRow}>
                        <Text style={[styles.propertyLabel, { color: themedColors.text.secondary }]}>Y-intercept:</Text>
                        <Text style={[styles.propertyValue, { color: '#2979FF' }]}>
                            (0, {c.toFixed(2)})
                        </Text>
                    </View>
                </View>

                {/* Knowledge Check Button */}
                <TouchableOpacity
                    style={[
                        styles.quizButton,
                        { backgroundColor: canTakeQuiz ? '#00E676' : themedColors.background.subtle },
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

            {/* Knowledge Check Modal */}
            {showQuiz && (
                <KnowledgeCheck
                    simulation={simulation}
                    onClose={() => setShowQuiz(false)}
                    onComplete={(score) => {
                        setShowQuiz(false);
                    }}
                />
            )}
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
    equationCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    equationLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    equationText: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'monospace',
    },
    canvasContainer: {
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
        position: 'relative',
    },
    canvasHint: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 4,
    },
    dragArea: {
        position: 'absolute',
        width: 60,
        height: 60,
    },
    slidersCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    sliderRow: {
        marginBottom: 12,
    },
    sliderLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    toggleRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    toggleText: {
        fontSize: 13,
        fontWeight: '500',
    },
    discriminantCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    discriminantHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 8,
    },
    discriminantLabel: {
        fontSize: 13,
    },
    discriminantValue: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    discriminantNature: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    rootsText: {
        fontSize: 13,
        fontFamily: 'monospace',
    },
    propertiesCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    propertiesTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    propertyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    propertyLabel: {
        fontSize: 13,
    },
    propertyValue: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'monospace',
    },
    quizButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 10,
    },
    quizButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default QuadraticExplorerScreen;
