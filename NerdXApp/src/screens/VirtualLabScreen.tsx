// Virtual Lab Screen - Simulation Selection Hub
// Refactored to serve as entry point for all 6 Phase 1 simulations

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { SimulationCard } from '../components/virtualLab';
import { PHASE1_SIMULATIONS, PHASE2_SIMULATIONS, getAllSimulations, SUBJECT_COLORS, Subject } from '../data/virtualLab';

const { width } = Dimensions.get('window');

type FilterOption = 'all' | Subject;

const VirtualLabScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const themedColors = useThemedColors();
    const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

    // Get all simulations from both phases
    const allSimulations = getAllSimulations();

    // Filter simulations based on active filter
    const filteredSimulations = activeFilter === 'all'
        ? allSimulations
        : allSimulations.filter(sim => sim.subject === activeFilter);

    // Calculate stats
    const totalXP = allSimulations.reduce((sum, sim) => sum + sim.xpReward, 0);
    const totalSimulations = allSimulations.length;

    // Determine if a simulation is locked
    const isSimulationLocked = (simulationId: string): boolean => {
        const hasPaidCredits = (user?.credit_breakdown?.purchased_credits ?? 0) > 0;
        if (hasPaidCredits) {
            return false; // All unlocked for paid users
        }
        
        const simulation = allSimulations.find(sim => sim.id === simulationId);
        if (simulation) {
            const subjectSims = allSimulations.filter(sim => sim.subject === simulation.subject);
            const subjectIndex = subjectSims.findIndex(sim => sim.id === simulationId);
            // First 3 simulators (indices 0, 1, 2) are free, rest are locked
            return subjectIndex >= 3;
        }
        return false;
    };

    const handleSimulationPress = (simulationId: string) => {
        if (isSimulationLocked(simulationId)) {
            Alert.alert(
                'Locked Simulation',
                'This simulation is locked. Purchase credits to unlock all simulations.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Buy Credits', 
                        onPress: () => navigation.navigate('Credits' as never)
                    }
                ]
            );
            return;
        }

        // Map simulation IDs to screen names
        const screenMap: Record<string, string> = {
            // Phase 1
            'cell-explorer': 'CellExplorer',
            'osmosis-adventure': 'Osmosis',
            'atom-builder': 'AtomBuilder',
            'equation-balancer': 'EquationBalancer',
            'circuit-builder': 'CircuitBuilder',
            'projectile-motion': 'ProjectileMotion',
            // Phase 2
            'food-test-lab': 'FoodTestLab',
            'photosynthesis-reactor': 'PhotosynthesisReactor',
            'enzyme-action-lab': 'EnzymeActionLab',
            'transpiration-tracker': 'TranspirationTracker',
            'heart-pump': 'HeartPump',
            'titration-master': 'TitrationMaster',
            'ph-scale-explorer': 'pHScaleExplorer',
            'electrolysis-simulator': 'ElectrolysisSimulator',
            'motion-grapher': 'MotionGrapher',
            'newtons-laws-lab': 'NewtonsLawsLab',
            'thermal-expansion': 'ThermalExpansion',
            'wave-properties': 'WaveProperties',
            // Mathematics Virtual Labs
            'differentiation-lab': 'DifferentiationLab',
            'integration-lab': 'IntegrationLab',
            'quadratic-explorer': 'QuadraticExplorer',
            'complex-numbers-lab': 'ComplexNumbersLab',
            'trig-functions-lab': 'TrigFunctionsLab',
            'vector-visualizer': 'VectorVisualizer',
            'matrix-sandbox': 'MatrixSandbox',
            'linear-programming-lab': 'LinearProgrammingLab',

            // New English Labs
            'eng-market-negotiation': 'MarketNegotiationScreen',
            'eng-job-interview': 'JobInterviewScreen',
            'eng-university-campus': 'UniversityCampusLifeScreen',
            'eng-medical-consultation': 'MedicalConsultationScreen',
            'eng-international-travel': 'InternationalTravelScreen',
            'eng-social-gatherings': 'SocialGatheringsScreen',
            'eng-banking-services': 'BankingServicesScreen',

            // New Math Labs
            'probability-simulator': 'ProbabilitySimulatorScreen',
            'statistics-explorer': 'StatisticsExplorerScreen',
            'logarithms-lab': 'LogarithmsLabScreen',
            'sequences-series-lab': 'SequencesSeriesLabScreen',
            'simultaneous-equations-lab': 'SimultaneousEquationsLabScreen',

            // Computer Science - Programming Lab
            'programming-lab': 'ProgrammingLabEditor',
        };

        const screenName = screenMap[simulationId];
        if (screenName) {
            navigation.navigate(screenName);
        } else {
            // Fallback to interactive screen for newly added simulations
            navigation.navigate('VirtualLabInteractive', { simulationId });
        }
    };

    const filterOptions: { key: FilterOption; label: string; color: string }[] = [
        { key: 'all', label: 'All', color: themedColors.primary.main },
        { key: 'biology', label: 'Biology', color: SUBJECT_COLORS.biology.primary },
        { key: 'chemistry', label: 'Chemistry', color: SUBJECT_COLORS.chemistry.primary },
        { key: 'physics', label: 'Physics', color: SUBJECT_COLORS.physics.primary },
        { key: 'mathematics', label: 'Math', color: SUBJECT_COLORS.mathematics.primary },
        { key: 'english', label: 'English', color: SUBJECT_COLORS.english.primary },
        { key: 'computer_science', label: 'Computer Science', color: SUBJECT_COLORS.computer_science.primary },
    ];

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={['#1976D2', '#1565C0']}
                style={styles.header}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTitle}>
                        <Text style={styles.title}>Virtual Lab</Text>
                        <Text style={styles.subtitle}>Interactive Science Simulations</Text>
                    </View>
                    <View style={styles.headerStats}>
                        <View style={styles.statBadge}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.statText}>{totalXP} XP</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{totalSimulations}</Text>
                        <Text style={styles.statLabel}>Simulations</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: '#FFFFFF30' }]} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>6</Text>
                        <Text style={styles.statLabel}>Subjects</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: '#FFFFFF30' }]} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>AI</Text>
                        <Text style={styles.statLabel}>Check-ups</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterContainer}
                    contentContainerStyle={styles.filterContent}
                >
                    {filterOptions.map((option) => (
                        <TouchableOpacity
                            key={option.key}
                            style={[
                                styles.filterTab,
                                activeFilter === option.key
                                    ? { backgroundColor: option.color }
                                    : { backgroundColor: themedColors.background.paper }
                            ]}
                            onPress={() => setActiveFilter(option.key)}
                        >
                            <Text style={[
                                styles.filterText,
                                { color: activeFilter === option.key ? '#FFF' : themedColors.text.secondary }
                            ]}>
                                {option.label}
                            </Text>
                            {activeFilter === option.key && option.key !== 'all' && (
                                <View style={styles.filterCount}>
                                    <Text style={styles.filterCountText}>
                                        {allSimulations.filter(s => s.subject === option.key).length}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Simulations Grid */}
                <View style={styles.simulationsGrid}>
                    {filteredSimulations.map((simulation) => (
                        <SimulationCard
                            key={simulation.id}
                            simulation={simulation}
                            isLocked={isSimulationLocked(simulation.id)}
                            onPress={() => handleSimulationPress(simulation.id)}
                        />
                    ))}
                </View>

                {/* Info Card */}
                <View style={[styles.infoCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.infoHeader}>
                        <Ionicons name="information-circle" size={24} color={themedColors.primary.main} />
                        <Text style={[styles.infoTitle, { color: themedColors.text.primary }]}>
                            About Virtual Lab
                        </Text>
                    </View>
                    <Text style={[styles.infoText, { color: themedColors.text.secondary }]}>
                        These interactive simulations are designed to help you understand key O-Level
                        science concepts through hands-on experimentation. Complete each simulation and take
                        the knowledge check quiz to earn XP!
                    </Text>

                    <View style={styles.featuresList}>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                            <Text style={[styles.featureText, { color: themedColors.text.primary }]}>
                                Interactive experiments
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                            <Text style={[styles.featureText, { color: themedColors.text.primary }]}>
                                Knowledge check quizzes
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                            <Text style={[styles.featureText, { color: themedColors.text.primary }]}>
                                XP rewards for completion
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                            <Text style={[styles.featureText, { color: themedColors.text.primary }]}>
                                Aligned with O-Level syllabus
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Update */}
                <View style={[styles.comingSoon, { backgroundColor: isDarkMode ? '#2a2a2a' : '#E8F5E9' }]}>
                    <Ionicons name="sparkles" size={24} color="#4CAF50" />
                    <View style={styles.comingSoonContent}>
                        <Text style={[styles.comingSoonTitle, { color: themedColors.text.primary }]}>
                            New simulations added
                        </Text>
                        <Text style={[styles.comingSoonText, { color: themedColors.text.secondary }]}>
                            You can now pick how many AI-generated questions to attempt after each simulation.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        flex: 1,
        marginLeft: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 14,
        color: '#FFFFFF90',
        marginTop: 2,
    },
    headerStats: {
        alignItems: 'flex-end',
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00000030',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },
    statText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#00000020',
        borderRadius: 12,
        paddingVertical: 12,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    statLabel: {
        fontSize: 11,
        color: '#FFFFFF80',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    filterContainer: {
        marginBottom: 16,
        marginHorizontal: -16,
    },
    filterContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        gap: 6,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    },
    filterCount: {
        backgroundColor: '#FFFFFF30',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    filterCountText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    simulationsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    infoCard: {
        padding: 20,
        borderRadius: 16,
        marginTop: 8,
        marginBottom: 16,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    infoText: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 16,
    },
    featuresList: {
        gap: 10,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureText: {
        fontSize: 14,
    },
    comingSoon: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    comingSoonContent: {
        flex: 1,
    },
    comingSoonTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    comingSoonText: {
        fontSize: 12,
        lineHeight: 18,
    },
});

export default VirtualLabScreen;
