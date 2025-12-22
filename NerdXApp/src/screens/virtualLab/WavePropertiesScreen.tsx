// Wave Properties Screen - Physics Simulation
// Explore transverse and longitudinal waves

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
import Svg, { Path, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const WAVE_WIDTH = width - 48;
const WAVE_HEIGHT = 150;

type WaveType = 'transverse' | 'longitudinal';

const WavePropertiesScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('wave-properties')!;

    const [waveType, setWaveType] = useState<WaveType>('transverse');
    const [wavelength, setWavelength] = useState(100); // pixels
    const [amplitude, setAmplitude] = useState(40); // pixels
    const [frequency, setFrequency] = useState(1); // Hz
    const [showQuiz, setShowQuiz] = useState(false);
    const [experimentsRun, setExperimentsRun] = useState(0);

    const phaseRef = useRef(0);
    const animationRef = useRef<number>();

    // Calculate wave speed (in arbitrary units for display)
    const waveSpeed = frequency * wavelength;
    const period = 1 / frequency;

    // Generate wave path for transverse wave
    const generateTransverseWavePath = (phase: number): string => {
        let path = `M 0 ${WAVE_HEIGHT / 2}`;
        for (let x = 0; x <= WAVE_WIDTH; x += 2) {
            const y = WAVE_HEIGHT / 2 - amplitude * Math.sin((2 * Math.PI * x / wavelength) + phase);
            path += ` L ${x} ${y}`;
        }
        return path;
    };

    // Generate particles for longitudinal wave
    const generateLongitudinalParticles = (phase: number): { x: number; compressed: boolean }[] => {
        const particles: { x: number; compressed: boolean }[] = [];
        const numParticles = 20;
        const spacing = WAVE_WIDTH / numParticles;

        for (let i = 0; i < numParticles; i++) {
            const baseX = i * spacing;
            const displacement = amplitude * 0.3 * Math.sin((2 * Math.PI * baseX / wavelength) + phase);
            const compressed = displacement < 0;
            particles.push({ x: baseX + displacement, compressed });
        }
        return particles;
    };

    const [wavePath, setWavePath] = useState(generateTransverseWavePath(0));
    const [longParticles, setLongParticles] = useState(generateLongitudinalParticles(0));

    useEffect(() => {
        const animate = () => {
            phaseRef.current += 0.05 * frequency;
            if (waveType === 'transverse') {
                setWavePath(generateTransverseWavePath(phaseRef.current));
            } else {
                setLongParticles(generateLongitudinalParticles(phaseRef.current));
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [frequency, wavelength, amplitude, waveType]);

    const handleExperiment = () => {
        setExperimentsRun(prev => Math.min(prev + 1, 5));
    };

    const canTakeQuiz = experimentsRun >= 3;

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
                {/* Wave Type Selector */}
                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[
                            styles.typeBtn,
                            waveType === 'transverse' && styles.typeBtnActive,
                            { borderColor: waveType === 'transverse' ? '#2196F3' : themedColors.text.secondary + '40' }
                        ]}
                        onPress={() => setWaveType('transverse')}
                    >
                        <Text style={[
                            styles.typeBtnText,
                            { color: waveType === 'transverse' ? '#2196F3' : themedColors.text.secondary }
                        ]}>
                            Transverse
                        </Text>
                        <Text style={[styles.typeExample, { color: themedColors.text.secondary }]}>
                            Light, Water
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeBtn,
                            waveType === 'longitudinal' && styles.typeBtnActive,
                            { borderColor: waveType === 'longitudinal' ? '#4CAF50' : themedColors.text.secondary + '40' }
                        ]}
                        onPress={() => setWaveType('longitudinal')}
                    >
                        <Text style={[
                            styles.typeBtnText,
                            { color: waveType === 'longitudinal' ? '#4CAF50' : themedColors.text.secondary }
                        ]}>
                            Longitudinal
                        </Text>
                        <Text style={[styles.typeExample, { color: themedColors.text.secondary }]}>
                            Sound
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Wave Visualization */}
                <View style={[styles.waveContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }]}>
                    <Svg width={WAVE_WIDTH} height={WAVE_HEIGHT} viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}>
                        {/* Axis */}
                        <Line x1={0} y1={WAVE_HEIGHT / 2} x2={WAVE_WIDTH} y2={WAVE_HEIGHT / 2} stroke={themedColors.text.secondary + '40'} strokeWidth={1} strokeDasharray="4,4" />

                        {waveType === 'transverse' ? (
                            <>
                                {/* Wave */}
                                <Path
                                    d={wavePath}
                                    stroke="#2196F3"
                                    strokeWidth={3}
                                    fill="none"
                                />

                                {/* Amplitude markers */}
                                <Line x1={wavelength / 4} y1={WAVE_HEIGHT / 2} x2={wavelength / 4} y2={WAVE_HEIGHT / 2 - amplitude} stroke="#FF5722" strokeWidth={2} />
                                <SvgText x={wavelength / 4 + 5} y={WAVE_HEIGHT / 2 - amplitude / 2} fontSize={10} fill="#FF5722">A</SvgText>

                                {/* Wavelength marker */}
                                <Line x1={0} y1={WAVE_HEIGHT - 20} x2={wavelength} y2={WAVE_HEIGHT - 20} stroke="#9C27B0" strokeWidth={2} />
                                <SvgText x={wavelength / 2} y={WAVE_HEIGHT - 8} fontSize={10} fill="#9C27B0" textAnchor="middle">λ</SvgText>
                            </>
                        ) : (
                            <>
                                {/* Longitudinal wave particles */}
                                {longParticles.map((particle, index) => (
                                    <Circle
                                        key={index}
                                        cx={particle.x}
                                        cy={WAVE_HEIGHT / 2}
                                        r={particle.compressed ? 8 : 6}
                                        fill={particle.compressed ? '#4CAF50' : '#81C784'}
                                    />
                                ))}

                                {/* Labels */}
                                <SvgText x={50} y={30} fontSize={10} fill="#4CAF50">Compression</SvgText>
                                <SvgText x={WAVE_WIDTH - 80} y={30} fontSize={10} fill="#81C784">Rarefaction</SvgText>
                            </>
                        )}
                    </Svg>

                    {/* Direction arrow */}
                    <View style={styles.directionLabel}>
                        <Text style={[styles.directionText, { color: themedColors.text.secondary }]}>
                            Wave direction →
                        </Text>
                    </View>
                </View>

                {/* Controls */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>⚙️ Wave Controls</Text>

                    <View style={styles.controlRow}>
                        <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>
                            Wavelength (λ): {wavelength}px
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={40}
                            maximumValue={200}
                            value={wavelength}
                            onValueChange={setWavelength}
                            minimumTrackTintColor="#9C27B0"
                            maximumTrackTintColor={themedColors.text.secondary + '40'}
                            thumbTintColor="#9C27B0"
                        />
                    </View>

                    <View style={styles.controlRow}>
                        <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>
                            Amplitude (A): {amplitude}px
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={10}
                            maximumValue={60}
                            value={amplitude}
                            onValueChange={setAmplitude}
                            minimumTrackTintColor="#FF5722"
                            maximumTrackTintColor={themedColors.text.secondary + '40'}
                            thumbTintColor="#FF5722"
                        />
                    </View>

                    <View style={styles.controlRow}>
                        <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>
                            Frequency (f): {frequency.toFixed(1)} Hz
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0.5}
                            maximumValue={3}
                            value={frequency}
                            onValueChange={setFrequency}
                            minimumTrackTintColor="#2196F3"
                            maximumTrackTintColor={themedColors.text.secondary + '40'}
                            thumbTintColor="#2196F3"
                        />
                    </View>
                </View>

                {/* Wave Equation */}
                <View style={[styles.card, { backgroundColor: isDarkMode ? '#2a2a2a' : '#E3F2FD' }]}>
                    <Text style={[styles.equationTitle, { color: themedColors.text.primary }]}>
                        📐 Wave Equation
                    </Text>
                    <View style={styles.equationBox}>
                        <Text style={[styles.equationText, { color: themedColors.primary.main }]}>
                            v = f × λ
                        </Text>
                    </View>
                    <Text style={[styles.equationResult, { color: themedColors.text.primary }]}>
                        Speed = {frequency.toFixed(1)} × {wavelength} = {waveSpeed.toFixed(0)} units/s
                    </Text>
                    <Text style={[styles.equationResult, { color: themedColors.text.secondary }]}>
                        Period (T) = 1/f = {period.toFixed(2)} s
                    </Text>
                </View>

                {/* Record Experiment */}
                <TouchableOpacity style={styles.experimentBtn} onPress={handleExperiment}>
                    <Ionicons name="add-circle" size={20} color="#FFF" />
                    <Text style={styles.experimentBtnText}>Record Observation ({experimentsRun}/5)</Text>
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
                        {canTakeQuiz ? 'Take Knowledge Check' : `Run ${3 - experimentsRun} more experiments`}
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
    typeSelector: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    typeBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
    },
    typeBtnActive: {
        backgroundColor: '#FFFFFF10',
    },
    typeBtnText: {
        fontSize: 14,
        fontWeight: '600',
    },
    typeExample: {
        fontSize: 11,
        marginTop: 4,
    },
    waveContainer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        position: 'relative',
    },
    directionLabel: {
        position: 'absolute',
        bottom: 10,
        right: 16,
    },
    directionText: {
        fontSize: 11,
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
    controlRow: {
        marginBottom: 16,
    },
    controlLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    equationTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    equationBox: {
        alignItems: 'center',
        marginBottom: 12,
    },
    equationText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    equationResult: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 4,
    },
    experimentBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1976D2',
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    experimentBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196F3',
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

export default WavePropertiesScreen;
