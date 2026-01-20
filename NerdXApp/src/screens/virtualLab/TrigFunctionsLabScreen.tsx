// Trigonometry Functions Lab Screen - Mathematics Virtual Lab
// Unit circle linked to sine/cosine wave visualization

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import Svg, { Circle, Line, Path, G, Text as SvgText, Rect, Polygon } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 32;
const CANVAS_HEIGHT = 250;

// Unit circle dimensions
const CIRCLE_SIZE = 160;
const CIRCLE_CENTER_X = CIRCLE_SIZE / 2 + 20;
const CIRCLE_CENTER_Y = CANVAS_HEIGHT / 2;
const CIRCLE_RADIUS = 60;

// Wave dimensions
const WAVE_START_X = CIRCLE_SIZE + 40;
const WAVE_WIDTH = CANVAS_WIDTH - WAVE_START_X - 20;
const WAVE_CENTER_Y = CANVAS_HEIGHT / 2;
const WAVE_AMPLITUDE = 60;

const TrigFunctionsLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('trig-functions-lab')!;

    // State
    const [angle, setAngle] = useState(Math.PI / 4); // radians
    const [showSine, setShowSine] = useState(true);
    const [showCosine, setShowCosine] = useState(true);
    const [showTriangle, setShowTriangle] = useState(true);
    const [amplitude, setAmplitude] = useState(1);
    const [period, setPeriod] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [explorations, setExplorations] = useState(0);

    const animationRef = useRef<number>();

    // Calculations
    const sinValue = Math.sin(angle);
    const cosValue = Math.cos(angle);
    const angleDegrees = (angle * 180) / Math.PI;

    // Point on unit circle
    const pointX = CIRCLE_CENTER_X + CIRCLE_RADIUS * cosValue;
    const pointY = CIRCLE_CENTER_Y - CIRCLE_RADIUS * sinValue;

    // Generate sine wave path
    const generateSinePath = useMemo(() => {
        const points: string[] = [];
        const step = WAVE_WIDTH / 100;
        
        for (let i = 0; i <= 100; i++) {
            const x = WAVE_START_X + i * step;
            const waveAngle = (i / 100) * 2 * Math.PI * period;
            const y = WAVE_CENTER_Y - amplitude * WAVE_AMPLITUDE * Math.sin(waveAngle);
            points.push(`${points.length === 0 ? 'M' : 'L'} ${x} ${y}`);
        }
        return points.join(' ');
    }, [amplitude, period]);

    // Generate cosine wave path
    const generateCosinePath = useMemo(() => {
        const points: string[] = [];
        const step = WAVE_WIDTH / 100;
        
        for (let i = 0; i <= 100; i++) {
            const x = WAVE_START_X + i * step;
            const waveAngle = (i / 100) * 2 * Math.PI * period;
            const y = WAVE_CENTER_Y - amplitude * WAVE_AMPLITUDE * Math.cos(waveAngle);
            points.push(`${points.length === 0 ? 'M' : 'L'} ${x} ${y}`);
        }
        return points.join(' ');
    }, [amplitude, period]);

    // Current angle position on wave
    const currentWaveX = WAVE_START_X + (angle / (2 * Math.PI)) * WAVE_WIDTH;

    // Animation
    const toggleAnimation = () => {
        if (isAnimating) {
            setIsAnimating(false);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        } else {
            setIsAnimating(true);
            const animate = () => {
                setAngle(prev => (prev + 0.03) % (2 * Math.PI));
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Track explorations
    useEffect(() => {
        const timer = setTimeout(() => {
            setExplorations(prev => Math.min(prev + 1, 4));
        }, 3000);
        return () => clearTimeout(timer);
    }, [angle, amplitude, period]);

    const canTakeQuiz = explorations >= 3;

    // Special angles
    const specialAngles = [
        { angle: 0, label: '0°' },
        { angle: Math.PI / 6, label: '30°' },
        { angle: Math.PI / 4, label: '45°' },
        { angle: Math.PI / 3, label: '60°' },
        { angle: Math.PI / 2, label: '90°' },
        { angle: Math.PI, label: '180°' },
        { angle: 3 * Math.PI / 2, label: '270°' },
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
                {/* Values Display */}
                <View style={[styles.valuesCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.valueRow}>
                        <View style={styles.valueItem}>
                            <Text style={[styles.valueLabel, { color: themedColors.text.secondary }]}>Angle</Text>
                            <Text style={[styles.valueText, { color: '#FFC400' }]}>
                                {angleDegrees.toFixed(1)}° ({angle.toFixed(2)} rad)
                            </Text>
                        </View>
                    </View>
                    <View style={styles.valueRow}>
                        <View style={styles.valueItem}>
                            <Text style={[styles.valueLabel, { color: themedColors.text.secondary }]}>sin(θ)</Text>
                            <Text style={[styles.valueText, { color: '#FF5252' }]}>{sinValue.toFixed(4)}</Text>
                        </View>
                        <View style={styles.valueItem}>
                            <Text style={[styles.valueLabel, { color: themedColors.text.secondary }]}>cos(θ)</Text>
                            <Text style={[styles.valueText, { color: '#2979FF' }]}>{cosValue.toFixed(4)}</Text>
                        </View>
                        <View style={styles.valueItem}>
                            <Text style={[styles.valueLabel, { color: themedColors.text.secondary }]}>tan(θ)</Text>
                            <Text style={[styles.valueText, { color: '#00E676' }]}>
                                {Math.abs(cosValue) < 0.01 ? '∞' : (sinValue / cosValue).toFixed(4)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Main Visualization */}
                <View style={[styles.canvasContainer, { backgroundColor: themedColors.background.paper }]}>
                    <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                        {/* Unit Circle */}
                        <G>
                            {/* Circle */}
                            <Circle
                                cx={CIRCLE_CENTER_X}
                                cy={CIRCLE_CENTER_Y}
                                r={CIRCLE_RADIUS}
                                stroke="#00E5FF"
                                strokeWidth={2}
                                fill="none"
                            />
                            
                            {/* Axes */}
                            <Line
                                x1={CIRCLE_CENTER_X - CIRCLE_RADIUS - 10}
                                y1={CIRCLE_CENTER_Y}
                                x2={CIRCLE_CENTER_X + CIRCLE_RADIUS + 10}
                                y2={CIRCLE_CENTER_Y}
                                stroke={themedColors.text.secondary}
                                strokeWidth={1}
                            />
                            <Line
                                x1={CIRCLE_CENTER_X}
                                y1={CIRCLE_CENTER_Y - CIRCLE_RADIUS - 10}
                                x2={CIRCLE_CENTER_X}
                                y2={CIRCLE_CENTER_Y + CIRCLE_RADIUS + 10}
                                stroke={themedColors.text.secondary}
                                strokeWidth={1}
                            />

                            {/* Right triangle */}
                            {showTriangle && (
                                <>
                                    {/* Horizontal (cos) */}
                                    <Line
                                        x1={CIRCLE_CENTER_X}
                                        y1={CIRCLE_CENTER_Y}
                                        x2={pointX}
                                        y2={CIRCLE_CENTER_Y}
                                        stroke="#2979FF"
                                        strokeWidth={3}
                                    />
                                    {/* Vertical (sin) */}
                                    <Line
                                        x1={pointX}
                                        y1={CIRCLE_CENTER_Y}
                                        x2={pointX}
                                        y2={pointY}
                                        stroke="#FF5252"
                                        strokeWidth={3}
                                    />
                                    {/* Hypotenuse */}
                                    <Line
                                        x1={CIRCLE_CENTER_X}
                                        y1={CIRCLE_CENTER_Y}
                                        x2={pointX}
                                        y2={pointY}
                                        stroke="#FFC400"
                                        strokeWidth={2}
                                    />
                                    {/* Right angle marker */}
                                    <Rect
                                        x={pointX - (cosValue >= 0 ? 8 : 0)}
                                        y={CIRCLE_CENTER_Y - (sinValue >= 0 ? 8 : 0)}
                                        width={8}
                                        height={8}
                                        fill="none"
                                        stroke={themedColors.text.secondary}
                                        strokeWidth={1}
                                    />
                                </>
                            )}

                            {/* Angle arc */}
                            <Path
                                d={`M ${CIRCLE_CENTER_X + 20} ${CIRCLE_CENTER_Y} A 20 20 0 ${angle > Math.PI ? 1 : 0} 0 ${CIRCLE_CENTER_X + 20 * Math.cos(angle)} ${CIRCLE_CENTER_Y - 20 * Math.sin(angle)}`}
                                stroke="#FFC400"
                                strokeWidth={2}
                                fill="none"
                            />

                            {/* Point on circle */}
                            <Circle cx={pointX} cy={pointY} r={8} fill="#FF4081" stroke="#FFF" strokeWidth={2} />

                            {/* Labels */}
                            <SvgText x={CIRCLE_CENTER_X + CIRCLE_RADIUS + 5} y={CIRCLE_CENTER_Y + 4} fontSize={10} fill={themedColors.text.secondary}>1</SvgText>
                            <SvgText x={CIRCLE_CENTER_X + 3} y={CIRCLE_CENTER_Y - CIRCLE_RADIUS - 5} fontSize={10} fill={themedColors.text.secondary}>1</SvgText>
                        </G>

                        {/* Wave Graph */}
                        <G>
                            {/* Horizontal axis */}
                            <Line
                                x1={WAVE_START_X}
                                y1={WAVE_CENTER_Y}
                                x2={WAVE_START_X + WAVE_WIDTH}
                                y2={WAVE_CENTER_Y}
                                stroke={themedColors.text.secondary}
                                strokeWidth={1}
                            />

                            {/* Wave grid lines */}
                            {[0.25, 0.5, 0.75, 1].map((frac, idx) => (
                                <Line
                                    key={idx}
                                    x1={WAVE_START_X + frac * WAVE_WIDTH}
                                    y1={WAVE_CENTER_Y - WAVE_AMPLITUDE - 10}
                                    x2={WAVE_START_X + frac * WAVE_WIDTH}
                                    y2={WAVE_CENTER_Y + WAVE_AMPLITUDE + 10}
                                    stroke={themedColors.border.light}
                                    strokeWidth={0.5}
                                    strokeDasharray="4,4"
                                />
                            ))}

                            {/* Sine wave */}
                            {showSine && (
                                <Path d={generateSinePath} stroke="#FF5252" strokeWidth={2} fill="none" />
                            )}

                            {/* Cosine wave */}
                            {showCosine && (
                                <Path d={generateCosinePath} stroke="#2979FF" strokeWidth={2} fill="none" />
                            )}

                            {/* Current position markers */}
                            {currentWaveX <= WAVE_START_X + WAVE_WIDTH && (
                                <>
                                    {/* Vertical line at current angle */}
                                    <Line
                                        x1={currentWaveX}
                                        y1={WAVE_CENTER_Y - WAVE_AMPLITUDE - 5}
                                        x2={currentWaveX}
                                        y2={WAVE_CENTER_Y + WAVE_AMPLITUDE + 5}
                                        stroke="#FFC400"
                                        strokeWidth={1}
                                        strokeDasharray="4,2"
                                    />
                                    {/* Sin point */}
                                    {showSine && (
                                        <Circle
                                            cx={currentWaveX}
                                            cy={WAVE_CENTER_Y - amplitude * WAVE_AMPLITUDE * sinValue}
                                            r={6}
                                            fill="#FF5252"
                                        />
                                    )}
                                    {/* Cos point */}
                                    {showCosine && (
                                        <Circle
                                            cx={currentWaveX}
                                            cy={WAVE_CENTER_Y - amplitude * WAVE_AMPLITUDE * cosValue}
                                            r={6}
                                            fill="#2979FF"
                                        />
                                    )}
                                </>
                            )}

                            {/* Wave labels */}
                            <SvgText x={WAVE_START_X + WAVE_WIDTH - 30} y={20} fontSize={10} fill="#FF5252">sin</SvgText>
                            <SvgText x={WAVE_START_X + WAVE_WIDTH - 30} y={35} fontSize={10} fill="#2979FF">cos</SvgText>
                        </G>

                        {/* Connection lines */}
                        {showSine && (
                            <Line
                                x1={pointX}
                                y1={pointY}
                                x2={currentWaveX <= WAVE_START_X + WAVE_WIDTH ? currentWaveX : WAVE_START_X}
                                y2={WAVE_CENTER_Y - amplitude * WAVE_AMPLITUDE * sinValue}
                                stroke="#FF5252"
                                strokeWidth={1}
                                strokeDasharray="4,4"
                                opacity={0.5}
                            />
                        )}
                    </Svg>
                </View>

                {/* Angle Slider */}
                <View style={[styles.sliderCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.sliderHeader}>
                        <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                            Angle: {angleDegrees.toFixed(0)}°
                        </Text>
                        <TouchableOpacity
                            style={[styles.animateButton, isAnimating && styles.animateButtonActive]}
                            onPress={toggleAnimation}
                        >
                            <Ionicons name={isAnimating ? 'pause' : 'play'} size={16} color="#FFF" />
                            <Text style={styles.animateButtonText}>
                                {isAnimating ? 'Pause' : 'Animate'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={2 * Math.PI}
                        value={angle}
                        onValueChange={setAngle}
                        minimumTrackTintColor="#FFC400"
                        maximumTrackTintColor={themedColors.border.medium}
                        thumbTintColor="#FFC400"
                        disabled={isAnimating}
                    />
                    
                    {/* Special angles */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialAngles}>
                        {specialAngles.map((sa, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.specialAngleButton,
                                    { backgroundColor: Math.abs(angle - sa.angle) < 0.1 ? '#FFC40030' : themedColors.background.subtle },
                                ]}
                                onPress={() => setAngle(sa.angle)}
                            >
                                <Text style={[styles.specialAngleText, { color: themedColors.text.primary }]}>
                                    {sa.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Wave Controls */}
                <View style={[styles.waveControls, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.controlRow}>
                        <Text style={[styles.controlLabel, { color: themedColors.text.secondary }]}>
                            Amplitude: {amplitude.toFixed(1)}
                        </Text>
                        <Slider
                            style={styles.controlSlider}
                            minimumValue={0.5}
                            maximumValue={2}
                            step={0.1}
                            value={amplitude}
                            onValueChange={setAmplitude}
                            minimumTrackTintColor="#00E5FF"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#00E5FF"
                        />
                    </View>
                    <View style={styles.controlRow}>
                        <Text style={[styles.controlLabel, { color: themedColors.text.secondary }]}>
                            Periods: {period.toFixed(1)}
                        </Text>
                        <Slider
                            style={styles.controlSlider}
                            minimumValue={0.5}
                            maximumValue={3}
                            step={0.5}
                            value={period}
                            onValueChange={setPeriod}
                            minimumTrackTintColor="#00E5FF"
                            maximumTrackTintColor={themedColors.border.medium}
                            thumbTintColor="#00E5FF"
                        />
                    </View>
                </View>

                {/* Toggle Controls */}
                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={[styles.toggleButton, { backgroundColor: showSine ? '#FF525220' : themedColors.background.paper }]}
                        onPress={() => setShowSine(!showSine)}
                    >
                        <Ionicons name={showSine ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={showSine ? '#FF5252' : themedColors.text.secondary} />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>Sine</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.toggleButton, { backgroundColor: showCosine ? '#2979FF20' : themedColors.background.paper }]}
                        onPress={() => setShowCosine(!showCosine)}
                    >
                        <Ionicons name={showCosine ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={showCosine ? '#2979FF' : themedColors.text.secondary} />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>Cosine</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.toggleButton, { backgroundColor: showTriangle ? '#FFC40020' : themedColors.background.paper }]}
                        onPress={() => setShowTriangle(!showTriangle)}
                    >
                        <Ionicons name={showTriangle ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={showTriangle ? '#FFC400' : themedColors.text.secondary} />
                        <Text style={[styles.toggleText, { color: themedColors.text.primary }]}>Triangle</Text>
                    </TouchableOpacity>
                </View>

                {/* Pythagorean Identity */}
                <View style={[styles.identityCard, { backgroundColor: '#00E67615' }]}>
                    <Text style={[styles.identityTitle, { color: '#00E676' }]}>
                        Pythagorean Identity
                    </Text>
                    <Text style={[styles.identityFormula, { color: themedColors.text.primary }]}>
                        sin²θ + cos²θ = 1
                    </Text>
                    <Text style={[styles.identityValue, { color: themedColors.text.secondary }]}>
                        {sinValue.toFixed(4)}² + {cosValue.toFixed(4)}² = {(sinValue * sinValue + cosValue * cosValue).toFixed(4)}
                    </Text>
                </View>

                {/* Knowledge Check Button */}
                <TouchableOpacity
                    style={[styles.quizButton, { backgroundColor: canTakeQuiz ? '#00BCD4' : themedColors.background.subtle }]}
                    onPress={() => canTakeQuiz && setShowQuiz(true)}
                    disabled={!canTakeQuiz}
                >
                    <Ionicons name="school" size={24} color={canTakeQuiz ? '#FFF' : themedColors.text.disabled} />
                    <Text style={[styles.quizButtonText, { color: canTakeQuiz ? '#FFF' : themedColors.text.disabled }]}>
                        {canTakeQuiz ? 'Take Knowledge Check' : `Explore more (${explorations}/3)`}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Knowledge Check Modal */}
            {showQuiz && (
                <KnowledgeCheck
                    simulation={simulation}
                    onClose={() => setShowQuiz(false)}
                    onComplete={(score) => setShowQuiz(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
    contentContainer: { padding: 16, paddingBottom: 40 },
    valuesCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    valueRow: { flexDirection: 'row', marginBottom: 8 },
    valueItem: { flex: 1 },
    valueLabel: { fontSize: 11, marginBottom: 2 },
    valueText: { fontSize: 14, fontWeight: '600', fontFamily: 'monospace' },
    canvasContainer: { borderRadius: 16, padding: 8, marginBottom: 16 },
    sliderCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
    sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    sliderLabel: { fontSize: 14, fontWeight: '500' },
    animateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00BCD4', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, gap: 4 },
    animateButtonActive: { backgroundColor: '#0097A7' },
    animateButtonText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
    slider: { width: '100%', height: 40 },
    specialAngles: { marginTop: 8 },
    specialAngleButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, marginRight: 8 },
    specialAngleText: { fontSize: 12, fontWeight: '500' },
    waveControls: { padding: 16, borderRadius: 12, marginBottom: 16 },
    controlRow: { marginBottom: 8 },
    controlLabel: { fontSize: 12, marginBottom: 4 },
    controlSlider: { width: '100%', height: 36 },
    toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    toggleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, gap: 6 },
    toggleText: { fontSize: 12, fontWeight: '500' },
    identityCard: { padding: 16, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
    identityTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    identityFormula: { fontSize: 20, fontWeight: '500', marginBottom: 8 },
    identityValue: { fontSize: 12, fontFamily: 'monospace' },
    quizButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 10 },
    quizButtonText: { fontSize: 16, fontWeight: '600' },
});

export default TrigFunctionsLabScreen;
