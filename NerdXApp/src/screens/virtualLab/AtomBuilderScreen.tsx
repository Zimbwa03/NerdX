// Atom Builder Screen - Chemistry Simulation
// Build atoms by adding protons, neutrons, and electrons

import React, { useState, useEffect } from 'react';
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
import Svg, { Circle, G, Text as SvgText, Ellipse } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById, ELEMENTS } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const ATOM_SIZE = width - 80;

const AtomBuilderScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('atom-builder')!;

    const [protons, setProtons] = useState(0);
    const [neutrons, setNeutrons] = useState(0);
    const [electrons, setElectrons] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [builtElements, setBuiltElements] = useState<number[]>([]);

    const atomicNumber = protons;
    const massNumber = protons + neutrons;

    // Find matching element
    const element = ELEMENTS.find(e => e.atomicNumber === protons);
    const elementName = element?.name || '???';
    const elementSymbol = element?.symbol || '?';

    // Calculate electron configuration (2, 8, 8 rule)
    const getElectronConfig = (): number[] => {
        const config: number[] = [];
        let remaining = electrons;
        const shellMax = [2, 8, 8, 18, 18, 32];

        for (let i = 0; i < shellMax.length && remaining > 0; i++) {
            const shellElectrons = Math.min(remaining, shellMax[i]);
            config.push(shellElectrons);
            remaining -= shellElectrons;
        }

        return config;
    };

    const electronConfig = getElectronConfig();

    // Check if atom is stable (neutral charge, valid element)
    const isNeutral = protons === electrons;
    const isValidElement = protons > 0 && protons <= 20;
    const isStable = isNeutral && isValidElement;

    // Track built elements
    useEffect(() => {
        if (isStable && element && !builtElements.includes(protons)) {
            setBuiltElements([...builtElements, protons]);
        }
    }, [isStable, protons]);

    const handleReset = () => {
        setProtons(0);
        setNeutrons(0);
        setElectrons(0);
    };

    const handleQuizComplete = (score: number, xpEarned: number) => {
        setShowQuiz(false);
    };

    // Need to build at least 3 different elements
    const canTakeQuiz = builtElements.length >= 3;

    const renderNucleus = () => {
        const particles: JSX.Element[] = [];
        const nucleusRadius = 40;
        const particleRadius = 6;
        const centerX = ATOM_SIZE / 2;
        const centerY = ATOM_SIZE / 2;

        // Add protons (red) and neutrons (grey) in nucleus
        const totalNucleons = protons + neutrons;

        for (let i = 0; i < Math.min(protons, 20); i++) {
            const angle = (i / totalNucleons) * Math.PI * 2;
            const r = Math.min(nucleusRadius - particleRadius, Math.sqrt(i) * 8);
            const x = centerX + Math.cos(angle) * r * (i % 3 === 0 ? 0.5 : 1);
            const y = centerY + Math.sin(angle) * r * (i % 3 === 0 ? 0.5 : 1);

            particles.push(
                <Circle
                    key={`proton-${i}`}
                    cx={x}
                    cy={y}
                    r={particleRadius}
                    fill="#F44336"
                    stroke="#D32F2F"
                    strokeWidth={1}
                />
            );
        }

        for (let i = 0; i < Math.min(neutrons, 20); i++) {
            const angle = ((i + protons) / totalNucleons) * Math.PI * 2 + 0.3;
            const r = Math.min(nucleusRadius - particleRadius, Math.sqrt(i + protons) * 7);
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;

            particles.push(
                <Circle
                    key={`neutron-${i}`}
                    cx={x}
                    cy={y}
                    r={particleRadius}
                    fill="#9E9E9E"
                    stroke="#757575"
                    strokeWidth={1}
                />
            );
        }

        return particles;
    };

    const renderElectronShells = () => {
        const shells: JSX.Element[] = [];
        const centerX = ATOM_SIZE / 2;
        const centerY = ATOM_SIZE / 2;
        const shellRadii = [70, 110, 150];

        // Draw shell orbits
        electronConfig.forEach((_, index) => {
            if (index < shellRadii.length) {
                shells.push(
                    <Circle
                        key={`orbit-${index}`}
                        cx={centerX}
                        cy={centerY}
                        r={shellRadii[index]}
                        fill="none"
                        stroke={themedColors.text.secondary + '40'}
                        strokeWidth={1}
                        strokeDasharray="5,5"
                    />
                );
            }
        });

        // Draw electrons
        electronConfig.forEach((shellElectrons, shellIndex) => {
            if (shellIndex < shellRadii.length) {
                const radius = shellRadii[shellIndex];
                for (let i = 0; i < shellElectrons; i++) {
                    const angle = (i / shellElectrons) * Math.PI * 2 - Math.PI / 2;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;

                    shells.push(
                        <Circle
                            key={`electron-${shellIndex}-${i}`}
                            cx={x}
                            cy={y}
                            r={8}
                            fill="#2196F3"
                            stroke="#1565C0"
                            strokeWidth={2}
                        />
                    );
                }
            }
        });

        return shells;
    };

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
                {/* Atom Display */}
                <View style={[styles.atomContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }]}>
                    <Svg width={ATOM_SIZE} height={ATOM_SIZE} viewBox={`0 0 ${ATOM_SIZE} ${ATOM_SIZE}`}>
                        {/* Nucleus background */}
                        <Circle
                            cx={ATOM_SIZE / 2}
                            cy={ATOM_SIZE / 2}
                            r={45}
                            fill={isDarkMode ? '#2a2a2a' : '#E0E0E0'}
                        />

                        {/* Electron shells and electrons */}
                        {renderElectronShells()}

                        {/* Nucleus with protons and neutrons */}
                        {renderNucleus()}

                        {/* Element symbol */}
                        {protons > 0 && (
                            <SvgText
                                x={ATOM_SIZE / 2}
                                y={ATOM_SIZE / 2 + 5}
                                textAnchor="middle"
                                fontSize={20}
                                fontWeight="bold"
                                fill={themedColors.text.primary}
                            >
                                {elementSymbol}
                            </SvgText>
                        )}
                    </Svg>

                    {/* Element Info Badge */}
                    {protons > 0 && (
                        <View style={[styles.elementBadge, { backgroundColor: isStable ? '#4CAF5020' : '#FF980020' }]}>
                            <Text style={[styles.elementSymbol, { color: isStable ? '#4CAF50' : '#FF9800' }]}>
                                {elementSymbol}
                            </Text>
                            <Text style={[styles.elementName, { color: isStable ? '#4CAF50' : '#FF9800' }]}>
                                {elementName}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Particle Info */}
                <View style={[styles.infoCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Atomic Number</Text>
                            <Text style={[styles.infoValue, { color: '#F44336' }]}>{atomicNumber}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Mass Number</Text>
                            <Text style={[styles.infoValue, { color: '#9C27B0' }]}>{massNumber}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Charge</Text>
                            <Text style={[styles.infoValue, { color: isNeutral ? '#4CAF50' : '#FF9800' }]}>
                                {protons - electrons > 0 ? `+${protons - electrons}` : protons - electrons}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.configRow, { borderTopColor: themedColors.text.secondary + '20' }]}>
                        <Text style={[styles.configLabel, { color: themedColors.text.secondary }]}>
                            Electron Configuration:
                        </Text>
                        <Text style={[styles.configValue, { color: '#2196F3' }]}>
                            {electronConfig.length > 0 ? electronConfig.join(', ') : '—'}
                        </Text>
                    </View>

                    {!isNeutral && protons > 0 && (
                        <View style={styles.warningBox}>
                            <Ionicons name="warning" size={16} color="#FF9800" />
                            <Text style={styles.warningText}>
                                Ion detected! Add {protons - electrons > 0 ? 'electrons' : 'protons'} for a neutral atom.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Particle Controls */}
                <View style={[styles.controlsCard, { backgroundColor: themedColors.background.paper }]}>
                    {/* Protons */}
                    <View style={styles.controlRow}>
                        <View style={styles.particleInfo}>
                            <View style={[styles.particleDot, { backgroundColor: '#F44336' }]} />
                            <Text style={[styles.particleName, { color: themedColors.text.primary }]}>Protons</Text>
                            <Text style={[styles.particleCharge, { color: themedColors.text.secondary }]}>(+)</Text>
                        </View>
                        <View style={styles.controlButtons}>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: themedColors.background.subtle }]}
                                onPress={() => setProtons(Math.max(0, protons - 1))}
                            >
                                <Ionicons name="remove" size={24} color={themedColors.text.primary} />
                            </TouchableOpacity>
                            <Text style={[styles.particleCount, { color: '#F44336' }]}>{protons}</Text>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: '#F44336' }]}
                                onPress={() => setProtons(Math.min(20, protons + 1))}
                            >
                                <Ionicons name="add" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Neutrons */}
                    <View style={styles.controlRow}>
                        <View style={styles.particleInfo}>
                            <View style={[styles.particleDot, { backgroundColor: '#9E9E9E' }]} />
                            <Text style={[styles.particleName, { color: themedColors.text.primary }]}>Neutrons</Text>
                            <Text style={[styles.particleCharge, { color: themedColors.text.secondary }]}>(0)</Text>
                        </View>
                        <View style={styles.controlButtons}>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: themedColors.background.subtle }]}
                                onPress={() => setNeutrons(Math.max(0, neutrons - 1))}
                            >
                                <Ionicons name="remove" size={24} color={themedColors.text.primary} />
                            </TouchableOpacity>
                            <Text style={[styles.particleCount, { color: '#9E9E9E' }]}>{neutrons}</Text>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: '#9E9E9E' }]}
                                onPress={() => setNeutrons(Math.min(30, neutrons + 1))}
                            >
                                <Ionicons name="add" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Electrons */}
                    <View style={styles.controlRow}>
                        <View style={styles.particleInfo}>
                            <View style={[styles.particleDot, { backgroundColor: '#2196F3' }]} />
                            <Text style={[styles.particleName, { color: themedColors.text.primary }]}>Electrons</Text>
                            <Text style={[styles.particleCharge, { color: themedColors.text.secondary }]}>(-)</Text>
                        </View>
                        <View style={styles.controlButtons}>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: themedColors.background.subtle }]}
                                onPress={() => setElectrons(Math.max(0, electrons - 1))}
                            >
                                <Ionicons name="remove" size={24} color={themedColors.text.primary} />
                            </TouchableOpacity>
                            <Text style={[styles.particleCount, { color: '#2196F3' }]}>{electrons}</Text>
                            <TouchableOpacity
                                style={[styles.controlBtn, { backgroundColor: '#2196F3' }]}
                                onPress={() => setElectrons(Math.min(20, electrons + 1))}
                            >
                                <Ionicons name="add" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Ionicons name="refresh" size={18} color="#FF9800" />
                        <Text style={styles.resetButtonText}>Reset Atom</Text>
                    </TouchableOpacity>
                </View>

                {/* Progress */}
                <View style={[styles.progressCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.progressTitle, { color: themedColors.text.primary }]}>
                        🧪 Elements Built: {builtElements.length}/20
                    </Text>
                    <View style={styles.elementChips}>
                        {ELEMENTS.slice(0, 10).map((el) => (
                            <View
                                key={el.atomicNumber}
                                style={[
                                    styles.elementChip,
                                    builtElements.includes(el.atomicNumber)
                                        ? { backgroundColor: '#4CAF5020', borderColor: '#4CAF50' }
                                        : { backgroundColor: themedColors.background.subtle, borderColor: 'transparent' }
                                ]}
                            >
                                <Text style={[
                                    styles.elementChipText,
                                    { color: builtElements.includes(el.atomicNumber) ? '#4CAF50' : themedColors.text.secondary }
                                ]}>
                                    {el.symbol}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Complete Button */}
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        !canTakeQuiz && styles.completeButtonDisabled
                    ]}
                    onPress={() => setShowQuiz(true)}
                    disabled={!canTakeQuiz}
                >
                    <Text style={styles.completeButtonText}>
                        {canTakeQuiz ? 'Take Knowledge Check' : `Build ${3 - builtElements.length} more elements`}
                    </Text>
                    <Ionicons name={canTakeQuiz ? "arrow-forward" : "lock-closed"} size={20} color="#FFF" />
                </TouchableOpacity>
            </ScrollView>

            {/* Knowledge Check */}
            <KnowledgeCheck
                visible={showQuiz}
                questions={simulation.quizQuestions}
                simulationTitle={simulation.title}
                xpReward={simulation.xpReward}
                onComplete={handleQuizComplete}
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
    atomContainer: {
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    elementBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    elementSymbol: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    elementName: {
        fontSize: 12,
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoItem: {
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 11,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    configRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    configLabel: {
        fontSize: 13,
    },
    configValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF980015',
        padding: 10,
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
    },
    warningText: {
        flex: 1,
        fontSize: 12,
        color: '#FF9800',
    },
    controlsCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    particleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    particleDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    particleName: {
        fontSize: 14,
        fontWeight: '600',
    },
    particleCharge: {
        fontSize: 12,
    },
    controlButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    controlBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    particleCount: {
        fontSize: 20,
        fontWeight: 'bold',
        minWidth: 30,
        textAlign: 'center',
    },
    resetButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF9800',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        gap: 6,
    },
    resetButtonText: {
        color: '#FF9800',
        fontSize: 14,
        fontWeight: '500',
    },
    progressCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    elementChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    elementChip: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    elementChipText: {
        fontSize: 14,
        fontWeight: '600',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF9800',
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

export default AtomBuilderScreen;
