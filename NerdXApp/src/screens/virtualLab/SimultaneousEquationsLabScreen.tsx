// Simultaneous Equations Lab Screen - Mathematics Virtual Lab
// Interactive graphical solver for systems of linear equations

import React, { useState, useMemo } from 'react';
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
import Slider from '@react-native-community/slider';
import Svg, { Path, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 32;
const GRAPH_HEIGHT = 300;
const PADDING = 20;

const SimultaneousEquationsLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('simultaneous-equations-lab')!;

    // Equation 1: y = m1*x + c1
    const [m1, setM1] = useState(2);
    const [c1, setC1] = useState(1);

    // Equation 2: y = m2*x + c2
    const [m2, setM2] = useState(-1);
    const [c2, setC2] = useState(4);

    const [showQuiz, setShowQuiz] = useState(false);

    // Grid range
    const xMin = -10, xMax = 10;
    const yMin = -10, yMax = 10;

    // Coordinate transforms
    const toSvgX = (x: number) => PADDING + ((x - xMin) / (xMax - xMin)) * (GRAPH_WIDTH - 2 * PADDING);
    const toSvgY = (y: number) => PADDING + (GRAPH_HEIGHT - 2 * PADDING) - ((y - yMin) / (yMax - yMin)) * (GRAPH_HEIGHT - 2 * PADDING);

    // Calculate intersection
    const intersection = useMemo(() => {
        // m1*x + c1 = m2*x + c2
        // (m1 - m2)x = c2 - c1
        // x = (c2 - c1) / (m1 - m2)
        if (m1 === m2) return null; // Parallel lines
        const x = (c2 - c1) / (m1 - m2);
        const y = m1 * x + c1;
        return { x, y };
    }, [m1, c1, m2, c2]);

    // Line paths
    const getLinePath = (m: number, c: number) => {
        const xStart = xMin;
        const yStart = m * xStart + c;
        const xEnd = xMax;
        const yEnd = m * xEnd + c;
        return `M ${toSvgX(xStart)} ${toSvgY(yStart)} L ${toSvgX(xEnd)} ${toSvgY(yEnd)}`;
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
                {/* Graph View */}
                <View style={[styles.graphCard, { backgroundColor: themedColors.background.paper }]}>
                    <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
                        {/* Grid Axes */}
                        <Line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} stroke={themedColors.text.disabled} strokeWidth={2} />
                        <Line x1={toSvgX(0)} y1={toSvgY(yMin)} x2={toSvgX(0)} y2={toSvgY(yMax)} stroke={themedColors.text.disabled} strokeWidth={2} />

                        {/* Ticks */}
                        {[-5, 5].map(tick => (
                            <G key={`tick-${tick}`}>
                                <Line x1={toSvgX(tick)} y1={toSvgY(-0.5)} x2={toSvgX(tick)} y2={toSvgY(0.5)} stroke={themedColors.text.disabled} />
                                <Line x1={toSvgX(-0.5)} y1={toSvgY(tick)} x2={toSvgX(0.5)} y2={toSvgY(tick)} stroke={themedColors.text.disabled} />
                            </G>
                        ))}

                        {/* Line 1 */}
                        <Path d={getLinePath(m1, c1)} stroke="#2196F3" strokeWidth={3} />

                        {/* Line 2 */}
                        <Path d={getLinePath(m2, c2)} stroke="#FF9800" strokeWidth={3} />

                        {/* Intersection Point */}
                        {intersection && (
                            <G>
                                <Circle cx={toSvgX(intersection.x)} cy={toSvgY(intersection.y)} r={6} fill="#E91E63" stroke="#FFF" strokeWidth={2} />
                                <SvgText x={toSvgX(intersection.x) + 10} y={toSvgY(intersection.y) - 10} fill="#E91E63" fontSize={12} fontWeight="bold">
                                    ({intersection.x.toFixed(1)}, {intersection.y.toFixed(1)})
                                </SvgText>
                            </G>
                        )}
                    </Svg>
                </View>

                {/* Solution Display */}
                <View style={[styles.solutionCard, { backgroundColor: intersection ? '#E91E6320' : themedColors.background.subtle }]}>
                    {!intersection ? (
                        <View style={styles.noSolution}>
                            <Ionicons name="alert-circle" size={24} color="#FF5252" />
                            <Text style={[styles.solutionText, { color: '#FF5252' }]}>
                                Parallel Lines - No Intersection
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.solutionContent}>
                            <Text style={[styles.solutionLabel, { color: '#E91E63' }]}>Intersection Point (Solution):</Text>
                            <Text style={styles.solutionValues}>
                                x = {intersection.x.toFixed(2)}, y = {intersection.y.toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Controls - Line 1 */}
                <View style={[styles.controlsSection, { backgroundColor: '#2196F315', borderColor: '#2196F3' }]}>
                    <Text style={[styles.sectionTitle, { color: '#2196F3' }]}>
                        Line 1: y = {m1}x + {c1}
                    </Text>
                    <View style={styles.controlRow}>
                        <Text style={[styles.label, { color: themedColors.text.secondary }]}>Gradient (m): {m1}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-5}
                            maximumValue={5}
                            step={0.5}
                            value={m1}
                            onValueChange={setM1}
                            minimumTrackTintColor="#2196F3"
                            thumbTintColor="#2196F3"
                        />
                    </View>
                    <View style={styles.controlRow}>
                        <Text style={[styles.label, { color: themedColors.text.secondary }]}>Y-intercept (c): {c1}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-8}
                            maximumValue={8}
                            step={1}
                            value={c1}
                            onValueChange={setC1}
                            minimumTrackTintColor="#2196F3"
                            thumbTintColor="#2196F3"
                        />
                    </View>
                </View>

                {/* Controls - Line 2 */}
                <View style={[styles.controlsSection, { backgroundColor: '#FF980015', borderColor: '#FF9800' }]}>
                    <Text style={[styles.sectionTitle, { color: '#FF9800' }]}>
                        Line 2: y = {m2}x + {c2}
                    </Text>
                    <View style={styles.controlRow}>
                        <Text style={[styles.label, { color: themedColors.text.secondary }]}>Gradient (m): {m2}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-5}
                            maximumValue={5}
                            step={0.5}
                            value={m2}
                            onValueChange={setM2}
                            minimumTrackTintColor="#FF9800"
                            thumbTintColor="#FF9800"
                        />
                    </View>
                    <View style={styles.controlRow}>
                        <Text style={[styles.label, { color: themedColors.text.secondary }]}>Y-intercept (c): {c2}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-8}
                            maximumValue={8}
                            step={1}
                            value={c2}
                            onValueChange={setC2}
                            minimumTrackTintColor="#FF9800"
                            thumbTintColor="#FF9800"
                        />
                    </View>
                </View>

                {/* Explanation */}
                <View style={[styles.infoCard, { backgroundColor: themedColors.background.paper }]}>
                    <Ionicons name="bulb" size={24} color={themedColors.text.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoTitle, { color: themedColors.text.primary }]}>How it works</Text>
                        <Text style={[styles.infoText, { color: themedColors.text.secondary }]}>
                            Simultaneous equations are solved where the two lines cross.
                            If the gradients (m) are the same, the lines are parallel and never cross (unless they are the same line).
                        </Text>
                    </View>
                </View>

                {/* Knowledge Check */}
                <TouchableOpacity
                    style={styles.quizButton}
                    onPress={() => setShowQuiz(true)}
                >
                    <LinearGradient
                        colors={['#E91E63', '#C2185B']}
                        style={styles.quizGradient}
                    >
                        <Ionicons name="school" size={24} color="#FFF" />
                        <Text style={styles.quizButtonText}>Take Knowledge Check</Text>
                    </LinearGradient>
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
    graphCard: { borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 16, height: 320, padding: 10 },
    solutionCard: { padding: 16, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
    solutionContent: { alignItems: 'center' },
    solutionLabel: { fontSize: 13, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase' },
    solutionValues: { fontSize: 18, fontWeight: '700', color: '#E91E63' },
    noSolution: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    solutionText: { fontSize: 15, fontWeight: '600' },
    controlsSection: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    controlRow: { marginBottom: 12 },
    label: { fontSize: 12, marginBottom: 4 },
    slider: { width: '100%', height: 40 },
    infoCard: { flexDirection: 'row', padding: 16, borderRadius: 16, marginBottom: 20, gap: 12 },
    infoContent: { flex: 1 },
    infoTitle: { fontWeight: '600', marginBottom: 4 },
    infoText: { fontSize: 13, lineHeight: 18 },
    quizButton: { borderRadius: 16, overflow: 'hidden' },
    quizGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 10 },
    quizButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default SimultaneousEquationsLabScreen;
