// Newton's Laws Lab Screen - Physics Simulation
// Investigate all three of Newton's Laws

import React, { useState, useEffect, useRef } from 'react';
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
import Svg, { Rect, Circle, G, Line, Text as SvgText, Polygon, Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 48;

type Law = 1 | 2 | 3;

const NewtonsLawsLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('newtons-laws-lab')!;

    const [selectedLaw, setSelectedLaw] = useState<Law>(1);
    const [showQuiz, setShowQuiz] = useState(false);
    const [lawsExplored, setLawsExplored] = useState<Set<Law>>(new Set([1]));

    // Law 1 - Inertia
    const [hasFriction, setHasFriction] = useState(true);
    const [objectPosition, setObjectPosition] = useState(0);
    const [objectVelocity, setObjectVelocity] = useState(0);
    const [isMoving, setIsMoving] = useState(false);

    // Law 2 - F = ma
    const [force, setForce] = useState(10);
    const [mass, setMass] = useState(2);
    const acceleration = force / mass;

    // Law 3 - Action-Reaction
    const [pushStrength, setPushStrength] = useState(0);

    const animRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isMoving && selectedLaw === 1) {
            animRef.current = setInterval(() => {
                setObjectPosition(prev => {
                    const newPos = prev + objectVelocity;
                    if (hasFriction) {
                        setObjectVelocity(v => Math.max(0, v - 0.5));
                    }
                    if (newPos >= 100 || (hasFriction && objectVelocity <= 0)) {
                        setIsMoving(false);
                        clearInterval(animRef.current!);
                    }
                    return Math.min(100, newPos);
                });
            }, 100);
        }

        return () => {
            if (animRef.current) clearInterval(animRef.current);
        };
    }, [isMoving, hasFriction, objectVelocity, selectedLaw]);

    const handlePush = () => {
        setObjectVelocity(5);
        setIsMoving(true);
    };

    const handleReset = () => {
        setObjectPosition(0);
        setObjectVelocity(0);
        setIsMoving(false);
        setPushStrength(0);
    };

    const handleLawChange = (law: Law) => {
        setSelectedLaw(law);
        setLawsExplored(prev => new Set([...prev, law]));
        handleReset();
    };

    const canTakeQuiz = lawsExplored.size >= 3;

    const renderLaw1 = () => (
        <View style={styles.experimentArea}>
            <Text style={[styles.lawTitle, { color: themedColors.text.primary }]}>
                Newton's First Law (Inertia)
            </Text>
            <Text style={[styles.lawStatement, { color: themedColors.text.secondary }]}>
                An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an unbalanced force.
            </Text>

            <View style={[styles.trackArea, { backgroundColor: isDarkMode ? '#2a2a2a' : '#E8EAF6' }]}>
                <Svg width={CANVAS_WIDTH - 32} height={80}>
                    {/* Surface */}
                    <Rect x={0} y={50} width={CANVAS_WIDTH - 32} height={30} fill={hasFriction ? '#795548' : '#B3E5FC'} />
                    {hasFriction && (
                        <SvgText x={CANVAS_WIDTH / 2 - 50} y={70} fontSize={10} fill="#FFF">Rough Surface</SvgText>
                    )}
                    {!hasFriction && (
                        <SvgText x={CANVAS_WIDTH / 2 - 50} y={70} fontSize={10} fill="#0277BD">Frictionless Surface</SvgText>
                    )}

                    {/* Object */}
                    <G transform={`translate(${20 + objectPosition * 2}, 20)`}>
                        <Rect x={0} y={0} width={40} height={30} rx={5} fill="#3F51B5" />
                        <Circle cx={10} cy={35} r={8} fill="#1A237E" />
                        <Circle cx={30} cy={35} r={8} fill="#1A237E" />
                    </G>
                </Svg>

                <View style={styles.frictionToggle}>
                    <Text style={[styles.toggleLabel, { color: themedColors.text.secondary }]}>Friction:</Text>
                    <TouchableOpacity
                        style={[styles.toggleBtn, hasFriction && styles.toggleBtnActive]}
                        onPress={() => { setHasFriction(!hasFriction); handleReset(); }}
                    >
                        <Text style={{ color: hasFriction ? '#FFF' : themedColors.text.primary }}>
                            {hasFriction ? 'ON' : 'OFF'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.pushBtn}
                onPress={handlePush}
                disabled={isMoving}
            >
                <Ionicons name="hand-right" size={20} color="#FFF" />
                <Text style={styles.pushBtnText}>Push Object</Text>
            </TouchableOpacity>

            <View style={[styles.observationBox, { backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF' }]}>
                <Text style={[styles.observationText, { color: themedColors.text.primary }]}>
                    {hasFriction
                        ? '📝 With friction, the cart slows down and stops (friction is an unbalanced force).'
                        : '📝 Without friction, the cart would continue moving forever at constant velocity!'}
                </Text>
            </View>
        </View>
    );

    const renderLaw2 = () => (
        <View style={styles.experimentArea}>
            <Text style={[styles.lawTitle, { color: themedColors.text.primary }]}>
                Newton's Second Law (F = ma)
            </Text>
            <Text style={[styles.lawStatement, { color: themedColors.text.secondary }]}>
                Force equals mass times acceleration. The acceleration of an object depends on the net force and the object's mass.
            </Text>

            <View style={[styles.calculatorCard, { backgroundColor: isDarkMode ? '#2a2a2a' : '#E8F5E9' }]}>
                <View style={styles.equationDisplay}>
                    <Text style={[styles.equationText, { color: '#4CAF50' }]}>F = m × a</Text>
                </View>

                <View style={styles.sliderRow}>
                    <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                        Force (F): {force} N
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={50}
                        value={force}
                        onValueChange={val => setForce(Math.round(val))}
                        minimumTrackTintColor="#4CAF50"
                        thumbTintColor="#4CAF50"
                    />
                </View>

                <View style={styles.sliderRow}>
                    <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                        Mass (m): {mass} kg
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={20}
                        value={mass}
                        onValueChange={val => setMass(Math.round(val))}
                        minimumTrackTintColor="#2196F3"
                        thumbTintColor="#2196F3"
                    />
                </View>

                <View style={styles.resultDisplay}>
                    <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>Acceleration (a):</Text>
                    <Text style={[styles.resultValue, { color: '#FF5722' }]}>{acceleration.toFixed(2)} m/s²</Text>
                </View>
            </View>

            <View style={[styles.observationBox, { backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF' }]}>
                <Text style={[styles.observationText, { color: themedColors.text.primary }]}>
                    📝 {force > mass * 5
                        ? 'High force + low mass = high acceleration!'
                        : force < mass
                            ? 'Increasing mass with same force decreases acceleration.'
                            : 'Try adjusting force and mass to see how acceleration changes.'}
                </Text>
            </View>
        </View>
    );

    const renderLaw3 = () => (
        <View style={styles.experimentArea}>
            <Text style={[styles.lawTitle, { color: themedColors.text.primary }]}>
                Newton's Third Law (Action-Reaction)
            </Text>
            <Text style={[styles.lawStatement, { color: themedColors.text.secondary }]}>
                For every action, there is an equal and opposite reaction.
            </Text>

            <View style={[styles.trackArea, { backgroundColor: isDarkMode ? '#2a2a2a' : '#FFECB3' }]}>
                <Svg width={CANVAS_WIDTH - 32} height={120}>
                    {/* Ground */}
                    <Rect x={0} y={100} width={CANVAS_WIDTH - 32} height={20} fill="#5D4037" />

                    {/* Person */}
                    <G transform={`translate(${80 - pushStrength * 2}, 30)`}>
                        <Circle cx={20} cy={10} r={15} fill="#FFCCBC" />
                        <Rect x={10} y={25} width={20} height={35} fill="#3F51B5" />
                        <Line x1={30} y1={40} x2={50 + pushStrength} y2={35} stroke="#FFCCBC" strokeWidth={5} />
                        <Rect x={10} y={60} width={8} height={40} fill="#1A237E" />
                        <Rect x={22} y={60} width={8} height={40} fill="#1A237E" />
                    </G>

                    {/* Wall */}
                    <Rect x={CANVAS_WIDTH - 80} y={0} width={30} height={100} fill="#78909C" />

                    {/* Force arrows */}
                    {pushStrength > 0 && (
                        <>
                            {/* Action force (person on wall) */}
                            <Line x1={140} y1={50} x2={140 + pushStrength * 3} y2={50} stroke="#4CAF50" strokeWidth={4} />
                            <Polygon points={`${140 + pushStrength * 3},45 ${150 + pushStrength * 3},50 ${140 + pushStrength * 3},55`} fill="#4CAF50" />
                            <SvgText x={145} y={40} fontSize={10} fill="#4CAF50">Action</SvgText>

                            {/* Reaction force (wall on person) */}
                            <Line x1={140} y1={70} x2={140 - pushStrength * 3} y2={70} stroke="#F44336" strokeWidth={4} />
                            <Polygon points={`${140 - pushStrength * 3},65 ${130 - pushStrength * 3},70 ${140 - pushStrength * 3},75`} fill="#F44336" />
                            <SvgText x={100 - pushStrength * 2} y={85} fontSize={10} fill="#F44336">Reaction</SvgText>
                        </>
                    )}
                </Svg>
            </View>

            <View style={styles.sliderRow}>
                <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                    Push Strength: {pushStrength}
                </Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    value={pushStrength}
                    onValueChange={val => setPushStrength(Math.round(val))}
                    minimumTrackTintColor="#FF9800"
                    thumbTintColor="#FF9800"
                />
            </View>

            <View style={[styles.observationBox, { backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF' }]}>
                <Text style={[styles.observationText, { color: themedColors.text.primary }]}>
                    📝 The person pushes the wall (action force), and the wall pushes back equally hard (reaction force). The forces are equal in size but opposite in direction!
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            <SimulationHeader
                title={simulation.title}
                subject={simulation.subject}
                learningObjectives={simulation.learningObjectives}
                onBack={() => navigation.goBack()}
                xpReward={simulation.xpReward}
            />

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Law Selector */}
                <View style={styles.lawSelector}>
                    {([1, 2, 3] as Law[]).map((law) => (
                        <TouchableOpacity
                            key={law}
                            style={[
                                styles.lawBtn,
                                selectedLaw === law && styles.lawBtnActive,
                                { borderColor: selectedLaw === law ? '#009688' : themedColors.text.secondary + '40' }
                            ]}
                            onPress={() => handleLawChange(law)}
                        >
                            <Text style={[
                                styles.lawBtnText,
                                { color: selectedLaw === law ? '#009688' : themedColors.text.secondary }
                            ]}>
                                Law {law}
                            </Text>
                            {lawsExplored.has(law) && (
                                <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Experiment Area */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    {selectedLaw === 1 && renderLaw1()}
                    {selectedLaw === 2 && renderLaw2()}
                    {selectedLaw === 3 && renderLaw3()}
                </View>

                {/* Reset Button */}
                <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                    <Ionicons name="refresh" size={18} color="#FF9800" />
                    <Text style={styles.resetBtnText}>Reset Experiment</Text>
                </TouchableOpacity>

                {/* Quiz Button */}
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        !canTakeQuiz && styles.completeButtonDisabled
                    ]}
                    onPress={() => setShowQuiz(true)}
                    disabled={!canTakeQuiz}
                >
                    <Text style={styles.completeButtonText}>
                        {canTakeQuiz ? 'Take Knowledge Check' : `Explore ${3 - lawsExplored.size} more laws`}
                    </Text>
                    <Ionicons name={canTakeQuiz ? "arrow-forward" : "lock-closed"} size={20} color="#FFF" />
                </TouchableOpacity>
            </ScrollView>

            <KnowledgeCheck
                visible={showQuiz}
                simulation={simulation}
                onComplete={() => setShowQuiz(false)}
                onClose={() => setShowQuiz(false)}
            />
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
    lawSelector: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    lawBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        borderWidth: 2,
        gap: 6,
    },
    lawBtnActive: {
        backgroundColor: '#00968810',
    },
    lawBtnText: {
        fontSize: 13,
        fontWeight: '600',
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    experimentArea: {},
    lawTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    lawStatement: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 16,
        fontStyle: 'italic',
    },
    trackArea: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    frictionToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 12,
    },
    toggleLabel: {
        fontSize: 13,
    },
    toggleBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00000020',
    },
    toggleBtnActive: {
        backgroundColor: '#4CAF50',
    },
    pushBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        padding: 14,
        borderRadius: 10,
        gap: 8,
        marginBottom: 12,
    },
    pushBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    calculatorCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    equationDisplay: {
        alignItems: 'center',
        marginBottom: 16,
    },
    equationText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    sliderRow: {
        marginBottom: 12,
    },
    sliderLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    resultDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#00000010',
    },
    resultLabel: {
        fontSize: 16,
    },
    resultValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    observationBox: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00000010',
    },
    observationText: {
        fontSize: 12,
        lineHeight: 18,
    },
    resetBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF9800',
        padding: 12,
        borderRadius: 10,
        gap: 8,
        marginBottom: 12,
    },
    resetBtnText: {
        color: '#FF9800',
        fontSize: 14,
        fontWeight: '600',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009688',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    completeButtonDisabled: {
        backgroundColor: '#9E9E9E',
    },
    completeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NewtonsLawsLabScreen;
