// Osmosis Adventure Screen - Biology Simulation
// Investigate cell behavior in different solution concentrations

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Svg, { Circle, Ellipse, G, Rect, Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const CELL_VIEW_SIZE = width - 48;

type CellType = 'red-blood-cell' | 'plant-cell';
type SolutionType = 'hypotonic' | 'isotonic' | 'hypertonic';

interface Observation {
    concentration: number;
    solutionType: SolutionType;
    cellState: string;
    timestamp: number;
}

const OsmosisScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('osmosis-adventure')!;

    const [cellType, setCellType] = useState<CellType>('red-blood-cell');
    const [concentration, setConcentration] = useState(50); // 0-100% salt concentration
    const [observations, setObservations] = useState<Observation[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);

    const cellScaleAnim = useRef(new Animated.Value(1)).current;
    const waterFlowAnim = useRef(new Animated.Value(0)).current;

    // Determine solution type based on concentration
    const getSolutionType = (conc: number): SolutionType => {
        if (conc < 40) return 'hypotonic';
        if (conc > 60) return 'hypertonic';
        return 'isotonic';
    };

    const solutionType = getSolutionType(concentration);

    // Get cell state description
    const getCellState = (): string => {
        if (cellType === 'red-blood-cell') {
            switch (solutionType) {
                case 'hypotonic': return 'Swelling (Lysis risk)';
                case 'isotonic': return 'Normal';
                case 'hypertonic': return 'Shrinking (Crenation)';
            }
        } else {
            switch (solutionType) {
                case 'hypotonic': return 'Turgid';
                case 'isotonic': return 'Flaccid';
                case 'hypertonic': return 'Plasmolyzed';
            }
        }
    };

    // Calculate cell scale based on solution type
    const getCellScale = (): number => {
        switch (solutionType) {
            case 'hypotonic': return 1.3;
            case 'isotonic': return 1.0;
            case 'hypertonic': return 0.7;
        }
    };

    // Animate cell when concentration changes
    useEffect(() => {
        const targetScale = getCellScale();
        Animated.spring(cellScaleAnim, {
            toValue: targetScale,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();

        // Animate water flow
        if (solutionType !== 'isotonic') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(waterFlowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                    Animated.timing(waterFlowAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
                ])
            ).start();
        } else {
            waterFlowAnim.setValue(0);
        }
    }, [concentration, solutionType]);

    const handleRecordObservation = () => {
        const newObservation: Observation = {
            concentration,
            solutionType,
            cellState: getCellState(),
            timestamp: Date.now(),
        };
        setObservations([...observations, newObservation]);
    };

    const handleClearObservations = () => {
        setObservations([]);
    };

    const canTakeQuiz = observations.length >= 3 &&
        observations.some(o => o.solutionType === 'hypotonic') &&
        observations.some(o => o.solutionType === 'isotonic') &&
        observations.some(o => o.solutionType === 'hypertonic');

    const handleQuizComplete = (score: number, xpEarned: number) => {
        setShowQuiz(false);
        // Save progress
    };

    const renderWaterMolecules = () => {
        const molecules = [];
        const numMolecules = 15;

        for (let i = 0; i < numMolecules; i++) {
            const angle = (i / numMolecules) * Math.PI * 2;
            const radius = CELL_VIEW_SIZE / 2 - 40;
            const centerX = CELL_VIEW_SIZE / 2;
            const centerY = CELL_VIEW_SIZE / 2;

            // Position around the cell
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            molecules.push(
                <G key={`water-${i}`}>
                    <Circle cx={x} cy={y} r={5} fill="#2196F3" opacity={0.6} />
                    <Circle cx={x - 3} cy={y + 3} r={3} fill="#64B5F6" opacity={0.5} />
                    <Circle cx={x + 3} cy={y + 3} r={3} fill="#64B5F6" opacity={0.5} />
                </G>
            );
        }

        return molecules;
    };

    const renderRedBloodCell = () => {
        const centerX = CELL_VIEW_SIZE / 2;
        const centerY = CELL_VIEW_SIZE / 2;

        return (
            <G>
                {/* Cell membrane */}
                <Ellipse
                    cx={centerX}
                    cy={centerY}
                    rx={60}
                    ry={50}
                    fill="#F44336"
                    stroke="#D32F2F"
                    strokeWidth={3}
                />
                {/* Biconcave depression (characteristic RBC shape) */}
                <Ellipse
                    cx={centerX}
                    cy={centerY}
                    rx={25}
                    ry={20}
                    fill="#E57373"
                />
            </G>
        );
    };

    const renderPlantCell = () => {
        const centerX = CELL_VIEW_SIZE / 2;
        const centerY = CELL_VIEW_SIZE / 2;
        const scale = getCellScale();

        // Vacuole shrinks more dramatically in hypertonic
        const vacuoleScale = solutionType === 'hypertonic' ? 0.4 : scale;

        return (
            <G>
                {/* Cell Wall (rigid, doesn't change) */}
                <Rect
                    x={centerX - 70}
                    y={centerY - 60}
                    width={140}
                    height={120}
                    rx={10}
                    fill="none"
                    stroke="#8BC34A"
                    strokeWidth={4}
                />

                {/* Cell Membrane (shrinks away from wall in plasmolysis) */}
                <Rect
                    x={centerX - 65 + (solutionType === 'hypertonic' ? 15 : 0)}
                    y={centerY - 55 + (solutionType === 'hypertonic' ? 15 : 0)}
                    width={130 - (solutionType === 'hypertonic' ? 30 : 0)}
                    height={110 - (solutionType === 'hypertonic' ? 30 : 0)}
                    rx={8}
                    fill="#C5E1A5"
                    stroke="#7CB342"
                    strokeWidth={2}
                />

                {/* Vacuole */}
                <Ellipse
                    cx={centerX}
                    cy={centerY}
                    rx={45 * vacuoleScale}
                    ry={35 * vacuoleScale}
                    fill="#81D4FA"
                    opacity={0.6}
                />

                {/* Nucleus */}
                <Circle
                    cx={centerX + 30}
                    cy={centerY - 20}
                    r={15}
                    fill="#9C27B0"
                />
            </G>
        );
    };

    const getSolutionColor = (): string => {
        if (concentration < 30) return '#E3F2FD';
        if (concentration < 60) return '#BBDEFB';
        return '#90CAF9';
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
                {/* Cell Type Selector */}
                <View style={styles.selectorContainer}>
                    <TouchableOpacity
                        style={[
                            styles.selectorButton,
                            cellType === 'red-blood-cell' && styles.selectorActive,
                            { borderColor: cellType === 'red-blood-cell' ? '#F44336' : themedColors.text.secondary + '40' }
                        ]}
                        onPress={() => setCellType('red-blood-cell')}
                    >
                        <Text style={[styles.selectorText, { color: cellType === 'red-blood-cell' ? '#F44336' : themedColors.text.secondary }]}>
                            🩸 Red Blood Cell
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.selectorButton,
                            cellType === 'plant-cell' && styles.selectorActive,
                            { borderColor: cellType === 'plant-cell' ? '#4CAF50' : themedColors.text.secondary + '40' }
                        ]}
                        onPress={() => setCellType('plant-cell')}
                    >
                        <Text style={[
                            styles.selectorText,
                            { color: cellType === 'plant-cell' ? '#4CAF50' : themedColors.text.secondary }
                        ]}>
                            🌿 Plant Cell
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Cell View */}
                <View style={[styles.cellViewContainer, { backgroundColor: getSolutionColor() }]}>
                    <Svg width={CELL_VIEW_SIZE} height={CELL_VIEW_SIZE} viewBox={`0 0 ${CELL_VIEW_SIZE} ${CELL_VIEW_SIZE}`}>
                        {/* Water molecules around cell */}
                        {renderWaterMolecules()}

                        {/* Cell (animated scale) */}
                        <G transform={`translate(${CELL_VIEW_SIZE / 2}, ${CELL_VIEW_SIZE / 2}) scale(${getCellScale()}) translate(${-CELL_VIEW_SIZE / 2}, ${-CELL_VIEW_SIZE / 2})`}>
                            {cellType === 'red-blood-cell' ? renderRedBloodCell() : renderPlantCell()}
                        </G>

                        {/* Water flow arrows */}
                        {solutionType !== 'isotonic' && (
                            <G>
                                {Array.from({ length: 4 }).map((_, i) => {
                                    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
                                    const radius = 100;
                                    const centerX = CELL_VIEW_SIZE / 2;
                                    const centerY = CELL_VIEW_SIZE / 2;
                                    const x1 = centerX + Math.cos(angle) * (solutionType === 'hypotonic' ? radius + 30 : radius - 30);
                                    const y1 = centerY + Math.sin(angle) * (solutionType === 'hypotonic' ? radius + 30 : radius - 30);
                                    const x2 = centerX + Math.cos(angle) * (solutionType === 'hypotonic' ? radius - 10 : radius + 10);
                                    const y2 = centerY + Math.sin(angle) * (solutionType === 'hypotonic' ? radius - 10 : radius + 10);

                                    return (
                                        <Line
                                            key={`arrow-${i}`}
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke="#1976D2"
                                            strokeWidth={3}
                                            strokeLinecap="round"
                                        />
                                    );
                                })}
                            </G>
                        )}
                    </Svg>

                    {/* Solution type label */}
                    <View style={[styles.solutionBadge, { backgroundColor: getSolutionTypeColor(solutionType) }]}>
                        <Text style={styles.solutionBadgeText}>{solutionType.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Info Box */}
                <View style={[styles.infoBox, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Solution Type:</Text>
                        <Text style={[styles.infoValue, { color: getSolutionTypeColor(solutionType) }]}>
                            {solutionType.charAt(0).toUpperCase() + solutionType.slice(1)}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Cell State:</Text>
                        <Text style={[styles.infoValue, { color: themedColors.text.primary }]}>{getCellState()}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Water Movement:</Text>
                        <Text style={[styles.infoValue, { color: themedColors.text.primary }]}>
                            {solutionType === 'hypotonic' ? '→ Into cell' :
                                solutionType === 'hypertonic' ? '← Out of cell' :
                                    '↔ Balanced'}
                        </Text>
                    </View>
                </View>

                {/* Concentration Slider */}
                <View style={[styles.sliderContainer, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.sliderLabel, { color: themedColors.text.primary }]}>
                        Solution Concentration: {concentration}%
                    </Text>
                    <View style={styles.sliderRow}>
                        <Text style={[styles.sliderEndLabel, { color: themedColors.text.secondary }]}>Low (Hypotonic)</Text>
                        <Text style={[styles.sliderEndLabel, { color: themedColors.text.secondary }]}>High (Hypertonic)</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={concentration}
                        onValueChange={(val) => setConcentration(Math.round(val))}
                        minimumTrackTintColor="#1976D2"
                        maximumTrackTintColor={themedColors.text.secondary + '40'}
                        thumbTintColor="#1976D2"
                    />

                    <TouchableOpacity
                        style={styles.recordButton}
                        onPress={handleRecordObservation}
                    >
                        <Ionicons name="add-circle" size={20} color="#FFF" />
                        <Text style={styles.recordButtonText}>Record Observation</Text>
                    </TouchableOpacity>
                </View>

                {/* Observations Table */}
                <View style={[styles.observationsCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.observationsHeader}>
                        <Text style={[styles.observationsTitle, { color: themedColors.text.primary }]}>
                            📊 Observations ({observations.length})
                        </Text>
                        {observations.length > 0 && (
                            <TouchableOpacity onPress={handleClearObservations}>
                                <Text style={{ color: '#F44336', fontSize: 12 }}>Clear</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {observations.length === 0 ? (
                        <Text style={[styles.emptyText, { color: themedColors.text.secondary }]}>
                            Adjust the concentration and record observations to complete the experiment.
                        </Text>
                    ) : (
                        <View style={styles.tableContainer}>
                            <View style={[styles.tableHeader, { borderBottomColor: themedColors.text.secondary + '30' }]}>
                                <Text style={[styles.tableHeaderText, { color: themedColors.text.secondary, flex: 1 }]}>Conc.</Text>
                                <Text style={[styles.tableHeaderText, { color: themedColors.text.secondary, flex: 2 }]}>Solution</Text>
                                <Text style={[styles.tableHeaderText, { color: themedColors.text.secondary, flex: 2 }]}>Cell State</Text>
                            </View>
                            {observations.map((obs, index) => (
                                <View key={index} style={[styles.tableRow, { borderBottomColor: themedColors.text.secondary + '20' }]}>
                                    <Text style={[styles.tableCell, { color: themedColors.text.primary, flex: 1 }]}>{obs.concentration}%</Text>
                                    <Text style={[styles.tableCell, { color: getSolutionTypeColor(obs.solutionType), flex: 2 }]}>
                                        {obs.solutionType.charAt(0).toUpperCase() + obs.solutionType.slice(1)}
                                    </Text>
                                    <Text style={[styles.tableCell, { color: themedColors.text.primary, flex: 2 }]}>{obs.cellState}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {!canTakeQuiz && (
                        <Text style={[styles.hintText, { color: themedColors.text.secondary }]}>
                            💡 Record at least one observation for each solution type to unlock the quiz.
                        </Text>
                    )}
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
                        {canTakeQuiz ? 'Take Knowledge Check' : 'Complete All Observations First'}
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

const getSolutionTypeColor = (type: SolutionType): string => {
    switch (type) {
        case 'hypotonic': return '#4CAF50';
        case 'isotonic': return '#FF9800';
        case 'hypertonic': return '#F44336';
    }
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
    selectorContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    selectorButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
    },
    selectorActive: {
        backgroundColor: '#FFFFFF10',
    },
    selectorText: {
        fontSize: 14,
        fontWeight: '600',
    },
    cellViewContainer: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    solutionBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    solutionBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    infoBox: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    sliderContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    sliderLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    sliderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    sliderEndLabel: {
        fontSize: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    recordButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1976D2',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        gap: 8,
    },
    recordButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    observationsCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    observationsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    observationsTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 16,
    },
    tableContainer: {
        marginTop: 8,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: 8,
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    tableHeaderText: {
        fontSize: 11,
        fontWeight: '600',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    tableCell: {
        fontSize: 12,
    },
    hintText: {
        fontSize: 12,
        marginTop: 12,
        textAlign: 'center',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
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

export default OsmosisScreen;
