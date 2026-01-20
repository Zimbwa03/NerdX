// Complex Numbers Lab Screen - Mathematics Virtual Lab
// Argand diagram with rotations and Euler's identity visualization

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import Svg, { Circle, Line, Path, G, Text as SvgText, Polygon } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 32;
const CENTER = CANVAS_SIZE / 2;
const SCALE = 40; // pixels per unit

const ComplexNumbersLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('complex-numbers-lab')!;

    // State
    const [realPart, setRealPart] = useState(3);
    const [imagPart, setImagPart] = useState(2);
    const [showPolar, setShowPolar] = useState(true);
    const [showUnitCircle, setShowUnitCircle] = useState(true);
    const [rotationHistory, setRotationHistory] = useState<{ real: number; imag: number }[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [eulerAngle, setEulerAngle] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [explorations, setExplorations] = useState(0);

    const animationRef = useRef<number>();

    // Calculations
    const modulus = Math.sqrt(realPart * realPart + imagPart * imagPart);
    const argument = Math.atan2(imagPart, realPart);
    const argumentDegrees = (argument * 180) / Math.PI;

    // Convert to SVG coordinates
    const toSvgX = (x: number) => CENTER + x * SCALE;
    const toSvgY = (y: number) => CENTER - y * SCALE;

    // Multiply by i (rotate 90° counterclockwise)
    const multiplyByI = () => {
        const newReal = -imagPart;
        const newImag = realPart;
        setRotationHistory(prev => [...prev, { real: realPart, imag: imagPart }]);
        setRealPart(newReal);
        setImagPart(newImag);
        setExplorations(prev => prev + 1);
    };

    // Multiply by -1 (rotate 180°)
    const multiplyByNegOne = () => {
        setRotationHistory(prev => [...prev, { real: realPart, imag: imagPart }]);
        setRealPart(-realPart);
        setImagPart(-imagPart);
        setExplorations(prev => prev + 1);
    };

    // Complex conjugate
    const conjugate = () => {
        setRotationHistory(prev => [...prev, { real: realPart, imag: imagPart }]);
        setImagPart(-imagPart);
        setExplorations(prev => prev + 1);
    };

    // Reset to initial
    const resetComplex = () => {
        setRealPart(3);
        setImagPart(2);
        setRotationHistory([]);
    };

    // Euler's formula animation: e^(iθ) = cos(θ) + i·sin(θ)
    const animateEuler = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setEulerAngle(0);
        
        let angle = 0;
        const animate = () => {
            angle += 0.05;
            setEulerAngle(angle);
            
            if (angle < Math.PI * 2 + 0.1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
                setExplorations(prev => prev + 1);
            }
        };
        
        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Generate unit circle path
    const unitCirclePath = useMemo(() => {
        const points: string[] = [];
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
            const x = toSvgX(Math.cos(angle));
            const y = toSvgY(Math.sin(angle));
            points.push(`${points.length === 0 ? 'M' : 'L'} ${x} ${y}`);
        }
        return points.join(' ') + ' Z';
    }, []);

    // Generate Euler spiral path
    const eulerPath = useMemo(() => {
        if (eulerAngle === 0) return '';
        const points: string[] = [];
        for (let angle = 0; angle <= eulerAngle; angle += 0.1) {
            const x = toSvgX(Math.cos(angle));
            const y = toSvgY(Math.sin(angle));
            points.push(`${points.length === 0 ? 'M' : 'L'} ${x} ${y}`);
        }
        return points.join(' ');
    }, [eulerAngle]);

    const canTakeQuiz = explorations >= 4;

    // Arrow head for vectors
    const getArrowHead = (x: number, y: number, angle: number, size: number = 8) => {
        const x1 = x - size * Math.cos(angle - Math.PI / 6);
        const y1 = y + size * Math.sin(angle - Math.PI / 6);
        const x2 = x - size * Math.cos(angle + Math.PI / 6);
        const y2 = y + size * Math.sin(angle + Math.PI / 6);
        return `${x},${y} ${x1},${y1} ${x2},${y2}`;
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
                {/* Complex Number Display */}
                <View style={[styles.displayCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.displayRow}>
                        <View style={styles.displayItem}>
                            <Text style={[styles.displayLabel, { color: themedColors.text.secondary }]}>
                                Rectangular Form
                            </Text>
                            <Text style={[styles.displayValue, { color: '#FF4081' }]}>
                                z = {realPart.toFixed(2)} {imagPart >= 0 ? '+' : '-'} {Math.abs(imagPart).toFixed(2)}i
                            </Text>
                        </View>
                        <View style={styles.displayItem}>
                            <Text style={[styles.displayLabel, { color: themedColors.text.secondary }]}>
                                Polar Form
                            </Text>
                            <Text style={[styles.displayValue, { color: '#00E5FF' }]}>
                                {modulus.toFixed(2)}∠{argumentDegrees.toFixed(1)}°
                            </Text>
                        </View>
                    </View>
                    <View style={styles.displayRow}>
                        <View style={styles.displayItem}>
                            <Text style={[styles.displayLabel, { color: themedColors.text.secondary }]}>
                                Modulus |z|
                            </Text>
                            <Text style={[styles.displayValue, { color: '#00E676' }]}>
                                {modulus.toFixed(3)}
                            </Text>
                        </View>
                        <View style={styles.displayItem}>
                            <Text style={[styles.displayLabel, { color: themedColors.text.secondary }]}>
                                Argument (arg z)
                            </Text>
                            <Text style={[styles.displayValue, { color: '#FFC400' }]}>
                                {argument.toFixed(3)} rad
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Argand Diagram */}
                <View style={[styles.canvasContainer, { backgroundColor: themedColors.background.paper }]}>
                    <Svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
                        {/* Grid */}
                        <G opacity={0.2}>
                            {Array.from({ length: 11 }, (_, i) => {
                                const pos = (i - 5) * SCALE + CENTER;
                                return (
                                    <G key={i}>
                                        <Line x1={pos} y1={0} x2={pos} y2={CANVAS_SIZE} stroke={themedColors.text.secondary} strokeWidth={0.5} />
                                        <Line x1={0} y1={pos} x2={CANVAS_SIZE} y2={pos} stroke={themedColors.text.secondary} strokeWidth={0.5} />
                                    </G>
                                );
                            })}
                        </G>

                        {/* Axes */}
                        <Line x1={0} y1={CENTER} x2={CANVAS_SIZE} y2={CENTER} stroke={themedColors.text.secondary} strokeWidth={2} />
                        <Line x1={CENTER} y1={0} x2={CENTER} y2={CANVAS_SIZE} stroke={themedColors.text.secondary} strokeWidth={2} />
                        
                        {/* Axis labels */}
                        <SvgText x={CANVAS_SIZE - 20} y={CENTER - 10} fontSize={14} fill={themedColors.text.primary} fontWeight="bold">Re</SvgText>
                        <SvgText x={CENTER + 10} y={20} fontSize={14} fill={themedColors.text.primary} fontWeight="bold">Im</SvgText>

                        {/* Unit circle */}
                        {showUnitCircle && (
                            <Path d={unitCirclePath} stroke="#00E5FF" strokeWidth={1.5} fill="none" strokeDasharray="6,4" />
                        )}

                        {/* Euler animation path */}
                        {eulerAngle > 0 && (
                            <>
                                <Path d={eulerPath} stroke="#FF4081" strokeWidth={3} fill="none" />
                                <Circle
                                    cx={toSvgX(Math.cos(eulerAngle))}
                                    cy={toSvgY(Math.sin(eulerAngle))}
                                    r={8}
                                    fill="#FF4081"
                                />
                            </>
                        )}

                        {/* Rotation history trail */}
                        {rotationHistory.map((point, idx) => (
                            <G key={idx} opacity={0.3 + (idx / rotationHistory.length) * 0.3}>
                                <Circle
                                    cx={toSvgX(point.real)}
                                    cy={toSvgY(point.imag)}
                                    r={5}
                                    fill="#7C4DFF"
                                />
                            </G>
                        ))}

                        {/* Modulus line (from origin to point) */}
                        {showPolar && (
                            <Line
                                x1={CENTER}
                                y1={CENTER}
                                x2={toSvgX(realPart)}
                                y2={toSvgY(imagPart)}
                                stroke="#00E676"
                                strokeWidth={2}
                                strokeDasharray="4,2"
                            />
                        )}

                        {/* Real component */}
                        <Line
                            x1={CENTER}
                            y1={CENTER}
                            x2={toSvgX(realPart)}
                            y2={CENTER}
                            stroke="#2979FF"
                            strokeWidth={2}
                        />

                        {/* Imaginary component */}
                        <Line
                            x1={toSvgX(realPart)}
                            y1={CENTER}
                            x2={toSvgX(realPart)}
                            y2={toSvgY(imagPart)}
                            stroke="#FF9100"
                            strokeWidth={2}
                        />

                        {/* Complex number vector */}
                        <Line
                            x1={CENTER}
                            y1={CENTER}
                            x2={toSvgX(realPart)}
                            y2={toSvgY(imagPart)}
                            stroke="#FF4081"
                            strokeWidth={3}
                        />
                        <Polygon
                            points={getArrowHead(toSvgX(realPart), toSvgY(imagPart), -argument)}
                            fill="#FF4081"
                        />

                        {/* Complex number point */}
                        <Circle
                            cx={toSvgX(realPart)}
                            cy={toSvgY(imagPart)}
                            r={10}
                            fill="#FF4081"
                            stroke="#FFF"
                            strokeWidth={2}
                        />

                        {/* Point label */}
                        <SvgText
                            x={toSvgX(realPart) + 15}
                            y={toSvgY(imagPart) - 10}
                            fontSize={12}
                            fill="#FF4081"
                            fontWeight="bold"
                        >
                            z
                        </SvgText>

                        {/* Special points */}
                        <Circle cx={toSvgX(1)} cy={CENTER} r={4} fill="#00E5FF" />
                        <SvgText x={toSvgX(1) - 3} y={CENTER + 15} fontSize={10} fill="#00E5FF">1</SvgText>
                        
                        <Circle cx={CENTER} cy={toSvgY(1)} r={4} fill="#00E5FF" />
                        <SvgText x={CENTER + 8} y={toSvgY(1) + 4} fontSize={10} fill="#00E5FF">i</SvgText>
                        
                        <Circle cx={toSvgX(-1)} cy={CENTER} r={4} fill="#00E5FF" />
                        <SvgText x={toSvgX(-1) - 8} y={CENTER + 15} fontSize={10} fill="#00E5FF">-1</SvgText>
                    </Svg>
                </View>

                {/* Control Sliders */}
                <View style={[styles.slidersCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.sliderRow}>
                        <Text style={[styles.sliderLabel, { color: '#2979FF' }]}>
                            Real Part: {realPart.toFixed(1)}
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-4}
                            maximumValue={4}
                            step={0.1}
                            value={realPart}
                            onValueChange={setRealPart}
                            minimumTrackTintColor="#2979FF"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#2979FF"
                        />
                    </View>
                    <View style={styles.sliderRow}>
                        <Text style={[styles.sliderLabel, { color: '#FF9100' }]}>
                            Imaginary Part: {imagPart.toFixed(1)}i
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-4}
                            maximumValue={4}
                            step={0.1}
                            value={imagPart}
                            onValueChange={setImagPart}
                            minimumTrackTintColor="#FF9100"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#FF9100"
                        />
                    </View>
                </View>

                {/* Operation Buttons */}
                <View style={styles.operationsRow}>
                    <TouchableOpacity
                        style={[styles.operationButton, { backgroundColor: '#7C4DFF' }]}
                        onPress={multiplyByI}
                    >
                        <Text style={styles.operationText}>× i</Text>
                        <Text style={styles.operationSubtext}>Rotate 90°</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.operationButton, { backgroundColor: '#FF5252' }]}
                        onPress={multiplyByNegOne}
                    >
                        <Text style={styles.operationText}>× (-1)</Text>
                        <Text style={styles.operationSubtext}>Rotate 180°</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.operationButton, { backgroundColor: '#00BCD4' }]}
                        onPress={conjugate}
                    >
                        <Text style={styles.operationText}>z*</Text>
                        <Text style={styles.operationSubtext}>Conjugate</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.operationButton, { backgroundColor: '#607D8B' }]}
                        onPress={resetComplex}
                    >
                        <Ionicons name="refresh" size={20} color="#FFF" />
                        <Text style={styles.operationSubtext}>Reset</Text>
                    </TouchableOpacity>
                </View>

                {/* Euler's Formula Section */}
                <View style={[styles.eulerCard, { backgroundColor: '#FF408115' }]}>
                    <View style={styles.eulerHeader}>
                        <Text style={[styles.eulerTitle, { color: '#FF4081' }]}>
                            Euler's Formula
                        </Text>
                        <TouchableOpacity
                            style={[styles.eulerButton, isAnimating && styles.eulerButtonActive]}
                            onPress={animateEuler}
                            disabled={isAnimating}
                        >
                            <Ionicons name="play" size={16} color="#FFF" />
                            <Text style={styles.eulerButtonText}>
                                {isAnimating ? 'Playing...' : 'Animate'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.eulerFormula, { color: themedColors.text.primary }]}>
                        e^(iθ) = cos(θ) + i·sin(θ)
                    </Text>
                    <Text style={[styles.eulerIdentity, { color: '#FFC400' }]}>
                        ✨ e^(iπ) + 1 = 0 (Euler's Identity)
                    </Text>
                    {eulerAngle > 0 && (
                        <Text style={[styles.eulerAngle, { color: themedColors.text.secondary }]}>
                            Current: e^(i·{eulerAngle.toFixed(2)}) = {Math.cos(eulerAngle).toFixed(2)} + {Math.sin(eulerAngle).toFixed(2)}i
                        </Text>
                    )}
                </View>

                {/* Toggle Controls */}
                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            { backgroundColor: showPolar ? '#00E67620' : themedColors.background.paper },
                        ]}
                        onPress={() => setShowPolar(!showPolar)}
                    >
                        <Ionicons
                            name={showPolar ? 'checkmark-circle' : 'ellipse-outline'}
                            size={20}
                            color={showPolar ? '#00E676' : themedColors.text.secondary}
                        />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>
                            Polar Form
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            { backgroundColor: showUnitCircle ? '#00E5FF20' : themedColors.background.paper },
                        ]}
                        onPress={() => setShowUnitCircle(!showUnitCircle)}
                    >
                        <Ionicons
                            name={showUnitCircle ? 'checkmark-circle' : 'ellipse-outline'}
                            size={20}
                            color={showUnitCircle ? '#00E5FF' : themedColors.text.secondary}
                        />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>
                            Unit Circle
                        </Text>
                    </TouchableOpacity>
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
                        Multiplying by i rotates a complex number 90° counterclockwise! Since i² = -1, 
                        multiplying by i twice (i × i) rotates 180°, which is the same as multiplying by -1.
                    </Text>
                </View>

                {/* Knowledge Check Button */}
                <TouchableOpacity
                    style={[
                        styles.quizButton,
                        { backgroundColor: canTakeQuiz ? '#FF4081' : themedColors.background.subtle },
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
                        {canTakeQuiz ? 'Take Knowledge Check' : `Explore more (${explorations}/4)`}
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
    displayCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    displayRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    displayItem: {
        flex: 1,
    },
    displayLabel: {
        fontSize: 11,
        marginBottom: 4,
    },
    displayValue: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'monospace',
    },
    canvasContainer: {
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
        alignItems: 'center',
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
    operationsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    operationButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    operationText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    operationSubtext: {
        color: '#FFFFFF90',
        fontSize: 10,
        marginTop: 2,
    },
    eulerCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    eulerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    eulerTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    eulerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF4081',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        gap: 4,
    },
    eulerButtonActive: {
        backgroundColor: '#C2185B',
    },
    eulerButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    eulerFormula: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 8,
    },
    eulerIdentity: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 8,
    },
    eulerAngle: {
        fontSize: 12,
        textAlign: 'center',
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

export default ComplexNumbersLabScreen;
