// Differentiation Lab Screen - Mathematics Virtual Lab
// Interactive tangent tracer to visualize derivatives

import React, { useState, useEffect, useMemo } from 'react';
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
import Svg, { Circle, Line, Path, G, Text as SvgText, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById, SAMPLE_FUNCTIONS } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 32;
const CANVAS_HEIGHT = 280;
const GRAPH_PADDING = 40;
const GRAPH_WIDTH = CANVAS_WIDTH - 2 * GRAPH_PADDING;
const GRAPH_HEIGHT = CANVAS_HEIGHT - 2 * GRAPH_PADDING;

// Math evaluation functions
const evaluateFunction = (x: number, funcType: string, funcIndex: number): number => {
    const funcs = SAMPLE_FUNCTIONS[funcType as keyof typeof SAMPLE_FUNCTIONS];
    if (!funcs || funcIndex >= funcs.length) return 0;
    
    const expr = funcs[funcIndex].expression;
    
    // Simple evaluation for our predefined functions
    switch (expr) {
        case 'x^2': return x * x;
        case 'x^3': return x * x * x;
        case 'x^2 - 4x + 3': return x * x - 4 * x + 3;
        case '0.5*x^2 + 2*x - 1': return 0.5 * x * x + 2 * x - 1;
        case 'sin(x)': return Math.sin(x);
        case 'cos(x)': return Math.cos(x);
        case '2*sin(x)': return 2 * Math.sin(x);
        case 'exp(x)': return Math.exp(x);
        case '2^x': return Math.pow(2, x);
        default: return x;
    }
};

const evaluateDerivative = (x: number, funcType: string, funcIndex: number): number => {
    const funcs = SAMPLE_FUNCTIONS[funcType as keyof typeof SAMPLE_FUNCTIONS];
    if (!funcs || funcIndex >= funcs.length) return 0;
    
    const derivative = funcs[funcIndex].derivative;
    
    switch (derivative) {
        case '2x': return 2 * x;
        case '3x^2': return 3 * x * x;
        case '2x - 4': return 2 * x - 4;
        case 'x + 2': return x + 2;
        case 'cos(x)': return Math.cos(x);
        case '-sin(x)': return -Math.sin(x);
        case '2*cos(x)': return 2 * Math.cos(x);
        case 'exp(x)': return Math.exp(x);
        case '2^x * ln(2)': return Math.pow(2, x) * Math.log(2);
        default: return 1;
    }
};

type FunctionType = 'polynomial' | 'trigonometric' | 'exponential';

const DifferentiationLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('differentiation-lab')!;

    // State
    const [functionType, setFunctionType] = useState<FunctionType>('polynomial');
    const [functionIndex, setFunctionIndex] = useState(0);
    const [xPosition, setXPosition] = useState(0);
    const [showTangent, setShowTangent] = useState(true);
    const [showDerivativeGraph, setShowDerivativeGraph] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [explorations, setExplorations] = useState(0);

    // Get current function details
    const currentFuncs = SAMPLE_FUNCTIONS[functionType];
    const currentFunc = currentFuncs[functionIndex];

    // Calculate x and y ranges based on function type
    const getRange = () => {
        switch (functionType) {
            case 'trigonometric':
                return { xMin: -2 * Math.PI, xMax: 2 * Math.PI, yMin: -3, yMax: 3 };
            case 'exponential':
                return { xMin: -3, xMax: 3, yMin: -1, yMax: 10 };
            default:
                return { xMin: -5, xMax: 5, yMin: -5, yMax: 10 };
        }
    };

    const range = getRange();

    // Convert graph coordinates to SVG coordinates
    const toSvgX = (x: number) => GRAPH_PADDING + ((x - range.xMin) / (range.xMax - range.xMin)) * GRAPH_WIDTH;
    const toSvgY = (y: number) => GRAPH_PADDING + GRAPH_HEIGHT - ((y - range.yMin) / (range.yMax - range.yMin)) * GRAPH_HEIGHT;

    // Calculate y value and derivative at current x
    const yValue = evaluateFunction(xPosition, functionType, functionIndex);
    const derivativeValue = evaluateDerivative(xPosition, functionType, functionIndex);

    // Generate path for main function
    const generateFunctionPath = useMemo(() => {
        const points: string[] = [];
        const step = (range.xMax - range.xMin) / 200;
        
        for (let x = range.xMin; x <= range.xMax; x += step) {
            const y = evaluateFunction(x, functionType, functionIndex);
            if (y >= range.yMin && y <= range.yMax) {
                const svgX = toSvgX(x);
                const svgY = toSvgY(y);
                points.push(`${points.length === 0 ? 'M' : 'L'} ${svgX} ${svgY}`);
            }
        }
        return points.join(' ');
    }, [functionType, functionIndex, range]);

    // Generate path for derivative function
    const generateDerivativePath = useMemo(() => {
        if (!showDerivativeGraph) return '';
        
        const points: string[] = [];
        const step = (range.xMax - range.xMin) / 200;
        const derivativeRange = { yMin: -5, yMax: 5 };
        
        for (let x = range.xMin; x <= range.xMax; x += step) {
            const y = evaluateDerivative(x, functionType, functionIndex);
            if (y >= derivativeRange.yMin && y <= derivativeRange.yMax) {
                const svgX = toSvgX(x);
                const svgY = toSvgY(Math.max(range.yMin, Math.min(range.yMax, y)));
                points.push(`${points.length === 0 ? 'M' : 'L'} ${svgX} ${svgY}`);
            }
        }
        return points.join(' ');
    }, [functionType, functionIndex, showDerivativeGraph, range]);

    // Tangent line calculation
    const tangentLength = 2; // Length on each side of point
    const tangentX1 = xPosition - tangentLength;
    const tangentY1 = yValue - derivativeValue * tangentLength;
    const tangentX2 = xPosition + tangentLength;
    const tangentY2 = yValue + derivativeValue * tangentLength;

    // Track exploration
    useEffect(() => {
        const timer = setTimeout(() => {
            setExplorations(prev => prev + 1);
        }, 2000);
        return () => clearTimeout(timer);
    }, [xPosition, functionType]);

    const canTakeQuiz = explorations >= 3;

    const functionTypes: { key: FunctionType; label: string; icon: string }[] = [
        { key: 'polynomial', label: 'Polynomial', icon: 'git-branch' },
        { key: 'trigonometric', label: 'Trig', icon: 'sync' },
        { key: 'exponential', label: 'Exponential', icon: 'trending-up' },
    ];

    // Speedometer component
    const renderSpeedometer = () => {
        const maxDerivative = 10;
        const normalizedValue = Math.min(Math.abs(derivativeValue), maxDerivative) / maxDerivative;
        const angle = -90 + normalizedValue * 180;
        const isPositive = derivativeValue >= 0;
        
        return (
            <View style={[styles.speedometerContainer, { backgroundColor: themedColors.background.paper }]}>
                <Text style={[styles.speedometerLabel, { color: themedColors.text.secondary }]}>
                    Slope (f'(x))
                </Text>
                <Svg width={120} height={70}>
                    {/* Background arc */}
                    <Path
                        d="M 10 60 A 50 50 0 0 1 110 60"
                        stroke={themedColors.border.light}
                        strokeWidth={8}
                        fill="none"
                    />
                    {/* Value arc */}
                    <Path
                        d={`M 60 60 L ${60 + 45 * Math.cos((angle * Math.PI) / 180)} ${60 + 45 * Math.sin((angle * Math.PI) / 180)}`}
                        stroke={isPositive ? '#00E676' : '#FF5252'}
                        strokeWidth={4}
                        strokeLinecap="round"
                    />
                    <Circle cx={60} cy={60} r={6} fill={isPositive ? '#00E676' : '#FF5252'} />
                </Svg>
                <Text style={[styles.speedometerValue, { color: isPositive ? '#00E676' : '#FF5252' }]}>
                    {derivativeValue.toFixed(2)}
                </Text>
                <Text style={[styles.slopeDirection, { color: themedColors.text.secondary }]}>
                    {derivativeValue > 0.1 ? '↗ Increasing' : derivativeValue < -0.1 ? '↘ Decreasing' : '→ Stationary'}
                </Text>
            </View>
        );
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
                {/* Function Type Selector */}
                <View style={styles.selectorRow}>
                    {functionTypes.map((ft) => (
                        <TouchableOpacity
                            key={ft.key}
                            style={[
                                styles.typeButton,
                                {
                                    backgroundColor: functionType === ft.key
                                        ? '#2979FF'
                                        : themedColors.background.paper,
                                },
                            ]}
                            onPress={() => {
                                setFunctionType(ft.key);
                                setFunctionIndex(0);
                                setXPosition(0);
                            }}
                        >
                            <Ionicons
                                name={ft.icon as any}
                                size={18}
                                color={functionType === ft.key ? '#FFF' : themedColors.text.secondary}
                            />
                            <Text
                                style={[
                                    styles.typeButtonText,
                                    { color: functionType === ft.key ? '#FFF' : themedColors.text.primary },
                                ]}
                            >
                                {ft.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Function Selector */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.funcSelector}
                    contentContainerStyle={styles.funcSelectorContent}
                >
                    {currentFuncs.map((func, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.funcButton,
                                {
                                    backgroundColor: functionIndex === idx
                                        ? '#2979FF20'
                                        : themedColors.background.paper,
                                    borderColor: functionIndex === idx ? '#2979FF' : 'transparent',
                                },
                            ]}
                            onPress={() => {
                                setFunctionIndex(idx);
                                setXPosition(0);
                            }}
                        >
                            <Text style={[styles.funcButtonText, { color: themedColors.text.primary }]}>
                                {func.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Main Graph Canvas */}
                <View style={[styles.canvasContainer, { backgroundColor: themedColors.background.paper }]}>
                    <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                        {/* Grid lines */}
                        <G>
                            {/* Vertical grid lines */}
                            {Array.from({ length: 11 }, (_, i) => {
                                const x = GRAPH_PADDING + (i / 10) * GRAPH_WIDTH;
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
                            {/* Horizontal grid lines */}
                            {Array.from({ length: 11 }, (_, i) => {
                                const y = GRAPH_PADDING + (i / 10) * GRAPH_HEIGHT;
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

                        {/* Derivative graph (orange dashed) */}
                        {showDerivativeGraph && generateDerivativePath && (
                            <Path
                                d={generateDerivativePath}
                                stroke="#FF9100"
                                strokeWidth={2}
                                strokeDasharray="6,4"
                                fill="none"
                            />
                        )}

                        {/* Main function graph (blue) */}
                        <Path
                            d={generateFunctionPath}
                            stroke="#2979FF"
                            strokeWidth={3}
                            fill="none"
                        />

                        {/* Tangent line (green) */}
                        {showTangent && (
                            <Line
                                x1={toSvgX(tangentX1)}
                                y1={toSvgY(tangentY1)}
                                x2={toSvgX(tangentX2)}
                                y2={toSvgY(tangentY2)}
                                stroke="#00E676"
                                strokeWidth={2}
                            />
                        )}

                        {/* Current point */}
                        <Circle
                            cx={toSvgX(xPosition)}
                            cy={toSvgY(yValue)}
                            r={8}
                            fill="#FF4081"
                            stroke="#FFF"
                            strokeWidth={2}
                        />

                        {/* Legend */}
                        <G>
                            <Rect x={CANVAS_WIDTH - 130} y={10} width={120} height={60} rx={6} fill={`${themedColors.background.default}CC`} />
                            <Circle cx={CANVAS_WIDTH - 115} cy={25} r={4} fill="#2979FF" />
                            <SvgText x={CANVAS_WIDTH - 105} y={29} fontSize={10} fill={themedColors.text.primary}>f(x)</SvgText>
                            <Line x1={CANVAS_WIDTH - 120} y1={42} x2={CANVAS_WIDTH - 110} y2={42} stroke="#FF9100" strokeWidth={2} strokeDasharray="4,2" />
                            <SvgText x={CANVAS_WIDTH - 105} y={46} fontSize={10} fill={themedColors.text.primary}>f'(x)</SvgText>
                            <Line x1={CANVAS_WIDTH - 120} y1={58} x2={CANVAS_WIDTH - 110} y2={58} stroke="#00E676" strokeWidth={2} />
                            <SvgText x={CANVAS_WIDTH - 105} y={62} fontSize={10} fill={themedColors.text.primary}>Tangent</SvgText>
                        </G>
                    </Svg>
                </View>

                {/* X Position Slider */}
                <View style={[styles.sliderContainer, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                        Move point along x-axis: x = {xPosition.toFixed(2)}
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={range.xMin + 0.5}
                        maximumValue={range.xMax - 0.5}
                        value={xPosition}
                        onValueChange={setXPosition}
                        minimumTrackTintColor="#2979FF"
                        maximumTrackTintColor={themedColors.border.medium}
                        thumbTintColor="#FF4081"
                    />
                </View>

                {/* Data Display Row */}
                <View style={styles.dataRow}>
                    {renderSpeedometer()}
                    
                    <View style={[styles.valuesContainer, { backgroundColor: themedColors.background.paper }]}>
                        <View style={styles.valueRow}>
                            <Text style={[styles.valueLabel, { color: themedColors.text.secondary }]}>x =</Text>
                            <Text style={[styles.valueText, { color: '#FF4081' }]}>{xPosition.toFixed(3)}</Text>
                        </View>
                        <View style={styles.valueRow}>
                            <Text style={[styles.valueLabel, { color: themedColors.text.secondary }]}>f(x) =</Text>
                            <Text style={[styles.valueText, { color: '#2979FF' }]}>{yValue.toFixed(3)}</Text>
                        </View>
                        <View style={styles.valueRow}>
                            <Text style={[styles.valueLabel, { color: themedColors.text.secondary }]}>f'(x) =</Text>
                            <Text style={[styles.valueText, { color: '#FF9100' }]}>{derivativeValue.toFixed(3)}</Text>
                        </View>
                    </View>
                </View>

                {/* Toggle Controls */}
                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            { backgroundColor: showTangent ? '#00E67620' : themedColors.background.paper },
                        ]}
                        onPress={() => setShowTangent(!showTangent)}
                    >
                        <Ionicons
                            name={showTangent ? 'checkmark-circle' : 'ellipse-outline'}
                            size={20}
                            color={showTangent ? '#00E676' : themedColors.text.secondary}
                        />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>
                            Show Tangent
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            { backgroundColor: showDerivativeGraph ? '#FF910020' : themedColors.background.paper },
                        ]}
                        onPress={() => setShowDerivativeGraph(!showDerivativeGraph)}
                    >
                        <Ionicons
                            name={showDerivativeGraph ? 'checkmark-circle' : 'ellipse-outline'}
                            size={20}
                            color={showDerivativeGraph ? '#FF9100' : themedColors.text.secondary}
                        />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>
                            Show f'(x) Graph
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Insights Card */}
                <View style={[styles.insightCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.insightHeader}>
                        <Ionicons name="bulb" size={20} color="#FFC400" />
                        <Text style={[styles.insightTitle, { color: themedColors.text.primary }]}>
                            Key Insight
                        </Text>
                    </View>
                    <Text style={[styles.insightText, { color: themedColors.text.secondary }]}>
                        {Math.abs(derivativeValue) < 0.1
                            ? "🎯 The derivative is near zero! This is a potential maximum, minimum, or inflection point."
                            : derivativeValue > 0
                            ? "📈 The derivative is positive, meaning f(x) is increasing at this point. The tangent line slopes upward."
                            : "📉 The derivative is negative, meaning f(x) is decreasing at this point. The tangent line slopes downward."
                        }
                    </Text>
                </View>

                {/* Knowledge Check Button */}
                <TouchableOpacity
                    style={[
                        styles.quizButton,
                        { backgroundColor: canTakeQuiz ? '#2979FF' : themedColors.background.subtle },
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
                        // Handle completion
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
    selectorRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 6,
    },
    typeButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
    funcSelector: {
        marginBottom: 16,
    },
    funcSelectorContent: {
        gap: 8,
    },
    funcButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 2,
    },
    funcButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    canvasContainer: {
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
    },
    sliderContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    sliderLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    dataRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    speedometerContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },
    speedometerLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    speedometerValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    slopeDirection: {
        fontSize: 11,
        marginTop: 4,
    },
    valuesContainer: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        justifyContent: 'center',
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    valueLabel: {
        fontSize: 14,
        fontWeight: '500',
        width: 50,
    },
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'monospace',
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
    insightCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    insightTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    insightText: {
        fontSize: 13,
        lineHeight: 20,
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

export default DifferentiationLabScreen;
