// Integration Lab Screen - Mathematics Virtual Lab
// Visualize area under curves using Riemann sums

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import Svg, { Rect, Line, Path, G, Text as SvgText, Circle } from 'react-native-svg';
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

type SumType = 'left' | 'right' | 'midpoint';
type FunctionType = 'quadratic' | 'sine' | 'linear';

// Function definitions
const functions = {
    quadratic: {
        f: (x: number) => x * x,
        integral: (a: number, b: number) => (b * b * b - a * a * a) / 3,
        label: 'f(x) = x²',
        integralLabel: '∫x² dx = x³/3',
    },
    sine: {
        f: (x: number) => Math.sin(x) + 1.5, // Shifted up to be positive
        integral: (a: number, b: number) => -Math.cos(b) + Math.cos(a) + 1.5 * (b - a),
        label: 'f(x) = sin(x) + 1.5',
        integralLabel: '∫(sin(x)+1.5)dx',
    },
    linear: {
        f: (x: number) => 0.5 * x + 2,
        integral: (a: number, b: number) => 0.25 * (b * b - a * a) + 2 * (b - a),
        label: 'f(x) = 0.5x + 2',
        integralLabel: '∫(0.5x+2)dx',
    },
};

const IntegrationLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('integration-lab')!;

    // State
    const [functionType, setFunctionType] = useState<FunctionType>('quadratic');
    const [numRectangles, setNumRectangles] = useState(5);
    const [sumType, setSumType] = useState<SumType>('left');
    const [lowerBound, setLowerBound] = useState(0);
    const [upperBound, setUpperBound] = useState(3);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [explorations, setExplorations] = useState(0);

    const animationProgress = useRef(new Animated.Value(0)).current;

    // Graph range
    const xMin = -1;
    const xMax = 5;
    const yMin = -0.5;
    const yMax = 10;

    // Convert coordinates
    const toSvgX = (x: number) => GRAPH_PADDING + ((x - xMin) / (xMax - xMin)) * GRAPH_WIDTH;
    const toSvgY = (y: number) => GRAPH_PADDING + GRAPH_HEIGHT - ((y - yMin) / (yMax - yMin)) * GRAPH_HEIGHT;
    const svgHeight = (h: number) => (h / (yMax - yMin)) * GRAPH_HEIGHT;

    const currentFunc = functions[functionType];

    // Calculate Riemann sum
    const calculateRiemannSum = useMemo(() => {
        const deltaX = (upperBound - lowerBound) / numRectangles;
        let sum = 0;
        const rectangles: { x: number; height: number; sampleX: number }[] = [];

        for (let i = 0; i < numRectangles; i++) {
            let sampleX: number;
            switch (sumType) {
                case 'left':
                    sampleX = lowerBound + i * deltaX;
                    break;
                case 'right':
                    sampleX = lowerBound + (i + 1) * deltaX;
                    break;
                case 'midpoint':
                    sampleX = lowerBound + (i + 0.5) * deltaX;
                    break;
            }
            
            const height = currentFunc.f(sampleX);
            sum += height * deltaX;
            rectangles.push({
                x: lowerBound + i * deltaX,
                height: Math.max(0, height),
                sampleX,
            });
        }

        return { sum, rectangles, deltaX };
    }, [functionType, numRectangles, sumType, lowerBound, upperBound]);

    // Calculate exact integral
    const exactIntegral = useMemo(() => {
        return currentFunc.integral(lowerBound, upperBound);
    }, [functionType, lowerBound, upperBound]);

    // Error calculation
    const error = Math.abs(calculateRiemannSum.sum - exactIntegral);
    const errorPercent = exactIntegral !== 0 ? (error / exactIntegral) * 100 : 0;

    // Generate function path
    const generatePath = useMemo(() => {
        const points: string[] = [];
        const step = (xMax - xMin) / 200;
        
        for (let x = xMin; x <= xMax; x += step) {
            const y = currentFunc.f(x);
            if (y >= yMin && y <= yMax) {
                const svgX = toSvgX(x);
                const svgY = toSvgY(y);
                points.push(`${points.length === 0 ? 'M' : 'L'} ${svgX} ${svgY}`);
            }
        }
        return points.join(' ');
    }, [functionType]);

    // Animation for limit demonstration
    const animateLimit = () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setNumRectangles(2);
        
        let n = 2;
        const interval = setInterval(() => {
            n = Math.min(n + 3, 100);
            setNumRectangles(n);
            
            if (n >= 100) {
                clearInterval(interval);
                setIsAnimating(false);
                setExplorations(prev => prev + 1);
            }
        }, 100);
    };

    // Track explorations
    useEffect(() => {
        const timer = setTimeout(() => {
            setExplorations(prev => prev + 1);
        }, 3000);
        return () => clearTimeout(timer);
    }, [numRectangles, sumType, functionType]);

    const canTakeQuiz = explorations >= 3;

    const sumTypes: { key: SumType; label: string; color: string }[] = [
        { key: 'left', label: 'Left Sum', color: '#FF5252' },
        { key: 'midpoint', label: 'Midpoint', color: '#00E676' },
        { key: 'right', label: 'Right Sum', color: '#2979FF' },
    ];

    const functionTypes: { key: FunctionType; label: string }[] = [
        { key: 'quadratic', label: 'x²' },
        { key: 'linear', label: '0.5x + 2' },
        { key: 'sine', label: 'sin(x) + 1.5' },
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
                {/* Function Selector */}
                <View style={styles.selectorRow}>
                    {functionTypes.map((ft) => (
                        <TouchableOpacity
                            key={ft.key}
                            style={[
                                styles.funcTypeButton,
                                {
                                    backgroundColor: functionType === ft.key
                                        ? '#7C4DFF'
                                        : themedColors.background.paper,
                                },
                            ]}
                            onPress={() => setFunctionType(ft.key)}
                        >
                            <Text
                                style={[
                                    styles.funcTypeText,
                                    { color: functionType === ft.key ? '#FFF' : themedColors.text.primary },
                                ]}
                            >
                                {ft.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sum Type Selector */}
                <View style={styles.sumTypeRow}>
                    {sumTypes.map((st) => (
                        <TouchableOpacity
                            key={st.key}
                            style={[
                                styles.sumTypeButton,
                                {
                                    backgroundColor: sumType === st.key
                                        ? `${st.color}20`
                                        : themedColors.background.paper,
                                    borderColor: sumType === st.key ? st.color : 'transparent',
                                },
                            ]}
                            onPress={() => setSumType(st.key)}
                        >
                            <View style={[styles.sumTypeIndicator, { backgroundColor: st.color }]} />
                            <Text
                                style={[
                                    styles.sumTypeText,
                                    { color: sumType === st.key ? st.color : themedColors.text.primary },
                                ]}
                            >
                                {st.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Main Graph Canvas */}
                <View style={[styles.canvasContainer, { backgroundColor: themedColors.background.paper }]}>
                    <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                        {/* Grid */}
                        <G opacity={0.3}>
                            {Array.from({ length: 7 }, (_, i) => {
                                const x = GRAPH_PADDING + (i / 6) * GRAPH_WIDTH;
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

                        {/* Riemann rectangles */}
                        {calculateRiemannSum.rectangles.map((rect, idx) => {
                            const rectWidth = (calculateRiemannSum.deltaX / (xMax - xMin)) * GRAPH_WIDTH;
                            const rectHeight = svgHeight(rect.height);
                            
                            return (
                                <G key={idx}>
                                    <Rect
                                        x={toSvgX(rect.x)}
                                        y={toSvgY(rect.height)}
                                        width={rectWidth}
                                        height={rectHeight}
                                        fill={sumTypes.find(s => s.key === sumType)?.color || '#2979FF'}
                                        fillOpacity={0.3}
                                        stroke={sumTypes.find(s => s.key === sumType)?.color}
                                        strokeWidth={1}
                                    />
                                    {/* Sample point */}
                                    <Circle
                                        cx={toSvgX(rect.sampleX)}
                                        cy={toSvgY(rect.height)}
                                        r={4}
                                        fill={sumTypes.find(s => s.key === sumType)?.color}
                                    />
                                </G>
                            );
                        })}

                        {/* Integration bounds */}
                        <Line
                            x1={toSvgX(lowerBound)}
                            y1={GRAPH_PADDING}
                            x2={toSvgX(lowerBound)}
                            y2={GRAPH_PADDING + GRAPH_HEIGHT}
                            stroke="#FF4081"
                            strokeWidth={2}
                            strokeDasharray="5,3"
                        />
                        <Line
                            x1={toSvgX(upperBound)}
                            y1={GRAPH_PADDING}
                            x2={toSvgX(upperBound)}
                            y2={GRAPH_PADDING + GRAPH_HEIGHT}
                            stroke="#FF4081"
                            strokeWidth={2}
                            strokeDasharray="5,3"
                        />

                        {/* Function curve */}
                        <Path
                            d={generatePath}
                            stroke="#7C4DFF"
                            strokeWidth={3}
                            fill="none"
                        />

                        {/* Bound labels */}
                        <SvgText
                            x={toSvgX(lowerBound)}
                            y={GRAPH_PADDING + GRAPH_HEIGHT + 15}
                            textAnchor="middle"
                            fontSize={12}
                            fill="#FF4081"
                            fontWeight="bold"
                        >
                            a={lowerBound}
                        </SvgText>
                        <SvgText
                            x={toSvgX(upperBound)}
                            y={GRAPH_PADDING + GRAPH_HEIGHT + 15}
                            textAnchor="middle"
                            fontSize={12}
                            fill="#FF4081"
                            fontWeight="bold"
                        >
                            b={upperBound}
                        </SvgText>

                        {/* Function label */}
                        <SvgText
                            x={CANVAS_WIDTH - GRAPH_PADDING - 10}
                            y={GRAPH_PADDING + 20}
                            textAnchor="end"
                            fontSize={14}
                            fill="#7C4DFF"
                            fontWeight="bold"
                        >
                            {currentFunc.label}
                        </SvgText>
                    </Svg>
                </View>

                {/* Number of Rectangles Slider */}
                <View style={[styles.sliderContainer, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.sliderHeader}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                            Number of Rectangles: {numRectangles}
                        </Text>
                        <TouchableOpacity
                            style={[styles.animateButton, isAnimating && styles.animateButtonActive]}
                            onPress={animateLimit}
                            disabled={isAnimating}
                        >
                            <Ionicons name="play" size={16} color="#FFF" />
                            <Text style={styles.animateButtonText}>
                                {isAnimating ? 'Running...' : 'Animate Limit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={100}
                        step={1}
                        value={numRectangles}
                        onValueChange={setNumRectangles}
                        minimumTrackTintColor="#7C4DFF"
                        maximumTrackTintColor={themedColors.border.medium}
                        thumbTintColor="#7C4DFF"
                    />
                </View>

                {/* Bounds Sliders */}
                <View style={[styles.boundsContainer, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.boundSlider}>
                        <Text style={[styles.boundLabel, { color: themedColors.text.secondary }]}>
                            Lower bound (a): {lowerBound.toFixed(1)}
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={upperBound - 0.5}
                            step={0.1}
                            value={lowerBound}
                            onValueChange={setLowerBound}
                            minimumTrackTintColor="#FF4081"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#FF4081"
                        />
                    </View>
                    <View style={styles.boundSlider}>
                        <Text style={[styles.boundLabel, { color: themedColors.text.secondary }]}>
                            Upper bound (b): {upperBound.toFixed(1)}
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={lowerBound + 0.5}
                            maximumValue={4}
                            step={0.1}
                            value={upperBound}
                            onValueChange={setUpperBound}
                            minimumTrackTintColor="#FF4081"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#FF4081"
                        />
                    </View>
                </View>

                {/* Results Display */}
                <View style={styles.resultsRow}>
                    <View style={[styles.resultCard, { backgroundColor: themedColors.background.paper }]}>
                        <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>
                            Riemann Sum
                        </Text>
                        <Text style={[styles.resultValue, { color: '#7C4DFF' }]}>
                            {calculateRiemannSum.sum.toFixed(4)}
                        </Text>
                    </View>
                    <View style={[styles.resultCard, { backgroundColor: themedColors.background.paper }]}>
                        <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>
                            Exact Integral
                        </Text>
                        <Text style={[styles.resultValue, { color: '#00E676' }]}>
                            {exactIntegral.toFixed(4)}
                        </Text>
                    </View>
                    <View style={[styles.resultCard, { backgroundColor: themedColors.background.paper }]}>
                        <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>
                            Error %
                        </Text>
                        <Text style={[styles.resultValue, { color: errorPercent < 5 ? '#00E676' : '#FF5252' }]}>
                            {errorPercent.toFixed(2)}%
                        </Text>
                    </View>
                </View>

                {/* Insight Card */}
                <View style={[styles.insightCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.insightHeader}>
                        <Ionicons name="bulb" size={20} color="#FFC400" />
                        <Text style={[styles.insightTitle, { color: themedColors.text.primary }]}>
                            Key Insight
                        </Text>
                    </View>
                    <Text style={[styles.insightText, { color: themedColors.text.secondary }]}>
                        {numRectangles <= 5
                            ? "🔢 With few rectangles, the approximation is rough. Notice the gaps between rectangles and the actual curve."
                            : numRectangles <= 20
                            ? "📊 As you add more rectangles, the gaps become smaller and the sum approaches the true area."
                            : numRectangles <= 50
                            ? "🎯 Getting closer! The Riemann sum is converging to the definite integral."
                            : "✨ With many rectangles, the sum virtually equals the integral! This is the Fundamental Theorem of Calculus in action."
                        }
                    </Text>
                </View>

                {/* Formula Display */}
                <View style={[styles.formulaCard, { backgroundColor: '#7C4DFF15' }]}>
                    <Text style={[styles.formulaTitle, { color: '#7C4DFF' }]}>
                        Formula
                    </Text>
                    <Text style={[styles.formulaText, { color: themedColors.text.primary }]}>
                        ∫ₐᵇ f(x)dx = lim(n→∞) Σᵢ₌₁ⁿ f(xᵢ*)Δx
                    </Text>
                    <Text style={[styles.formulaExplanation, { color: themedColors.text.secondary }]}>
                        As n → ∞, Riemann sum → Definite integral
                    </Text>
                </View>

                {/* Knowledge Check Button */}
                <TouchableOpacity
                    style={[
                        styles.quizButton,
                        { backgroundColor: canTakeQuiz ? '#7C4DFF' : themedColors.background.subtle },
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
    selectorRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    funcTypeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    funcTypeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    sumTypeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    sumTypeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 2,
        gap: 6,
    },
    sumTypeIndicator: {
        width: 12,
        height: 12,
        borderRadius: 3,
    },
    sumTypeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    canvasContainer: {
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
    },
    sliderContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sliderLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    animateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7C4DFF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        gap: 4,
    },
    animateButtonActive: {
        backgroundColor: '#5E35B1',
    },
    animateButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    boundsContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    boundSlider: {
        marginBottom: 8,
    },
    boundLabel: {
        fontSize: 13,
        marginBottom: 4,
    },
    resultsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    resultCard: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    resultLabel: {
        fontSize: 11,
        marginBottom: 4,
    },
    resultValue: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'monospace',
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
    formulaCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    formulaTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    formulaText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 8,
    },
    formulaExplanation: {
        fontSize: 12,
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

export default IntegrationLabScreen;
