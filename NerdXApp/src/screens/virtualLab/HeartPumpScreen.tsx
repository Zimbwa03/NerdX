// Heart Pump Simulator Screen - Biology Simulation
// Interactive heart model with blood flow visualization

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
import Svg, { Path, Circle, G, Rect, Ellipse, Text as SvgText, Polygon } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const HEART_SIZE = width - 64;

const HeartPumpScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('heart-pump')!;

    const [heartRate, setHeartRate] = useState(72); // bpm
    const [isExercising, setIsExercising] = useState(false);
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [partsIdentified, setPartsIdentified] = useState<Set<string>>(new Set());
    const [showQuiz, setShowQuiz] = useState(false);

    const beatAnim = useRef(new Animated.Value(1)).current;

    // Heart beat animation
    useEffect(() => {
        const beatDuration = 60000 / heartRate; // ms per beat

        const animate = () => {
            Animated.sequence([
                Animated.timing(beatAnim, {
                    toValue: 1.05,
                    duration: beatDuration * 0.15,
                    useNativeDriver: true,
                }),
                Animated.timing(beatAnim, {
                    toValue: 0.95,
                    duration: beatDuration * 0.15,
                    useNativeDriver: true,
                }),
                Animated.timing(beatAnim, {
                    toValue: 1,
                    duration: beatDuration * 0.7,
                    useNativeDriver: true,
                }),
            ]).start(() => animate());
        };

        animate();

        return () => beatAnim.stopAnimation();
    }, [heartRate]);

    // Exercise mode increases heart rate
    useEffect(() => {
        if (isExercising) {
            setHeartRate(prev => Math.min(180, prev + 40));
        } else {
            setHeartRate(72);
        }
    }, [isExercising]);

    const heartParts: Record<string, { name: string; description: string; color: string }> = {
        'right-atrium': {
            name: 'Right Atrium',
            description: 'Receives deoxygenated blood from the body via the vena cava.',
            color: '#1565C0',
        },
        'right-ventricle': {
            name: 'Right Ventricle',
            description: 'Pumps deoxygenated blood to the lungs via the pulmonary artery.',
            color: '#1976D2',
        },
        'left-atrium': {
            name: 'Left Atrium',
            description: 'Receives oxygenated blood from the lungs via the pulmonary vein.',
            color: '#C62828',
        },
        'left-ventricle': {
            name: 'Left Ventricle',
            description: 'Pumps oxygenated blood to the body via the aorta. Has the thickest wall.',
            color: '#D32F2F',
        },
        'aorta': {
            name: 'Aorta',
            description: 'The largest artery. Carries oxygenated blood from the left ventricle to the body.',
            color: '#F44336',
        },
        'pulmonary-artery': {
            name: 'Pulmonary Artery',
            description: 'Carries deoxygenated blood from the right ventricle to the lungs.',
            color: '#2196F3',
        },
    };

    const handlePartPress = (partId: string) => {
        setSelectedPart(partId);
        setPartsIdentified(prev => new Set([...prev, partId]));
    };

    const canTakeQuiz = partsIdentified.size >= 4;

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
                {/* Heart Rate Display */}
                <View style={[styles.rateCard, { backgroundColor: '#F4433620' }]}>
                    <Ionicons name="heart" size={24} color="#F44336" />
                    <Text style={styles.rateValue}>{heartRate}</Text>
                    <Text style={styles.rateLabel}>BPM</Text>
                </View>

                {/* Heart Diagram */}
                <Animated.View
                    style={[
                        styles.heartContainer,
                        {
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA',
                            transform: [{ scale: beatAnim }]
                        }
                    ]}
                >
                    <Svg width={HEART_SIZE} height={HEART_SIZE * 0.9} viewBox="0 0 300 270">
                        {/* Blood vessels */}
                        {/* Vena Cava (right side) */}
                        <Rect x={200} y={0} width={25} height={60} fill="#1565C0" />
                        <SvgText x={225} y={40} fontSize={8} fill={themedColors.text.secondary}>Vena Cava</SvgText>

                        {/* Pulmonary Artery */}
                        <G onPress={() => handlePartPress('pulmonary-artery')}>
                            <Path d="M 180 50 Q 190 30 220 25" stroke="#2196F3" strokeWidth={15} fill="none" />
                            <SvgText x={195} y={15} fontSize={8} fill={themedColors.text.secondary}>Pulmonary Artery</SvgText>
                        </G>

                        {/* Aorta */}
                        <G onPress={() => handlePartPress('aorta')}>
                            <Path d="M 120 50 Q 100 20 60 30 Q 30 40 30 80" stroke="#F44336" strokeWidth={18} fill="none" />
                            <SvgText x={50} y={25} fontSize={9} fill="#F44336">Aorta</SvgText>
                        </G>

                        {/* Pulmonary Vein */}
                        <Rect x={50} y={50} width={20} height={40} fill="#D32F2F" />
                        <SvgText x={10} y={75} fontSize={8} fill={themedColors.text.secondary}>Pulmonary Vein</SvgText>

                        {/* Heart Chambers */}
                        {/* Right Atrium */}
                        <G onPress={() => handlePartPress('right-atrium')}>
                            <Ellipse
                                cx={195} cy={100} rx={45} ry={40}
                                fill={selectedPart === 'right-atrium' ? '#1565C0' : '#1976D2'}
                                stroke={partsIdentified.has('right-atrium') ? '#4CAF50' : 'transparent'}
                                strokeWidth={3}
                            />
                            <SvgText x={175} y={105} fontSize={10} fill="#FFF">Right</SvgText>
                            <SvgText x={175} y={117} fontSize={10} fill="#FFF">Atrium</SvgText>
                        </G>

                        {/* Left Atrium */}
                        <G onPress={() => handlePartPress('left-atrium')}>
                            <Ellipse
                                cx={105} cy={100} rx={45} ry={40}
                                fill={selectedPart === 'left-atrium' ? '#C62828' : '#D32F2F'}
                                stroke={partsIdentified.has('left-atrium') ? '#4CAF50' : 'transparent'}
                                strokeWidth={3}
                            />
                            <SvgText x={85} y={105} fontSize={10} fill="#FFF">Left</SvgText>
                            <SvgText x={85} y={117} fontSize={10} fill="#FFF">Atrium</SvgText>
                        </G>

                        {/* Right Ventricle */}
                        <G onPress={() => handlePartPress('right-ventricle')}>
                            <Path
                                d="M 150 130 Q 200 140 210 180 Q 215 230 150 260 L 150 130"
                                fill={selectedPart === 'right-ventricle' ? '#1565C0' : '#1976D2'}
                                stroke={partsIdentified.has('right-ventricle') ? '#4CAF50' : 'transparent'}
                                strokeWidth={3}
                            />
                            <SvgText x={165} y={200} fontSize={10} fill="#FFF">Right</SvgText>
                            <SvgText x={160} y={212} fontSize={10} fill="#FFF">Ventricle</SvgText>
                        </G>

                        {/* Left Ventricle (thicker wall) */}
                        <G onPress={() => handlePartPress('left-ventricle')}>
                            <Path
                                d="M 150 130 Q 100 140 85 180 Q 80 230 150 260 L 150 130"
                                fill={selectedPart === 'left-ventricle' ? '#B71C1C' : '#D32F2F'}
                                stroke={partsIdentified.has('left-ventricle') ? '#4CAF50' : 'transparent'}
                                strokeWidth={3}
                            />
                            <SvgText x={100} y={195} fontSize={10} fill="#FFF">Left</SvgText>
                            <SvgText x={95} y={207} fontSize={10} fill="#FFF">Ventricle</SvgText>
                        </G>

                        {/* Blood flow arrows */}
                        <Polygon points="150,145 145,155 155,155" fill="#FFF" />
                        <Polygon points="195,130 190,140 200,140" fill="#FFF" />
                        <Polygon points="105,130 100,140 110,140" fill="#FFF" />
                    </Svg>

                    <View style={styles.legendRow}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#D32F2F' }]} />
                            <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>Oxygenated</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#1976D2' }]} />
                            <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>Deoxygenated</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Part Info */}
                {selectedPart && (
                    <View style={[styles.infoCard, { backgroundColor: heartParts[selectedPart].color + '20', borderColor: heartParts[selectedPart].color }]}>
                        <Text style={[styles.infoTitle, { color: heartParts[selectedPart].color }]}>
                            {heartParts[selectedPart].name}
                        </Text>
                        <Text style={[styles.infoText, { color: themedColors.text.primary }]}>
                            {heartParts[selectedPart].description}
                        </Text>
                    </View>
                )}

                {/* Heart Rate Control */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        Heart Rate: {heartRate} BPM
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={40}
                        maximumValue={180}
                        value={heartRate}
                        onValueChange={val => {
                            if (!isExercising) setHeartRate(Math.round(val));
                        }}
                        minimumTrackTintColor="#F44336"
                        maximumTrackTintColor={themedColors.text.secondary + '40'}
                        thumbTintColor="#F44336"
                        disabled={isExercising}
                    />

                    <TouchableOpacity
                        style={[styles.exerciseBtn, isExercising && styles.exerciseBtnActive]}
                        onPress={() => setIsExercising(!isExercising)}
                    >
                        <Ionicons name={isExercising ? "pause" : "fitness"} size={20} color="#FFF" />
                        <Text style={styles.exerciseBtnText}>
                            {isExercising ? 'Stop Exercise' : 'Simulate Exercise'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Progress */}
                <View style={[styles.progressCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.progressText, { color: themedColors.text.primary }]}>
                        Parts identified: {partsIdentified.size}/6
                    </Text>
                    <Text style={[styles.progressHint, { color: themedColors.text.secondary }]}>
                        Tap on heart chambers and blood vessels to learn about them
                    </Text>
                </View>

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
                        {canTakeQuiz ? 'Take Knowledge Check' : `Identify ${4 - partsIdentified.size} more parts`}
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
    rateCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    rateValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#F44336',
    },
    rateLabel: {
        fontSize: 16,
        color: '#F44336',
    },
    heartContainer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginTop: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 12,
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 2,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    exerciseBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 10,
        marginTop: 12,
        gap: 8,
    },
    exerciseBtnActive: {
        backgroundColor: '#FF9800',
    },
    exerciseBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    progressCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressHint: {
        fontSize: 12,
        marginTop: 4,
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F44336',
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

export default HeartPumpScreen;
