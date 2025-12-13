// Cell Explorer Screen - Biology Simulation
// Interactive microscope to explore plant and animal cells

import React, { useState, useRef } from 'react';
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
import Svg, { Circle, Rect, Ellipse, G, Text as SvgText, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById, CELL_ORGANELLES } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const CELL_SIZE = width - 48;

type CellType = 'plant' | 'animal';
type Magnification = 100 | 400 | 1000;

interface Organelle {
    id: string;
    name: string;
    description: string;
    color: string;
}

const CellExplorerScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('cell-explorer')!;

    const [cellType, setCellType] = useState<CellType>('plant');
    const [magnification, setMagnification] = useState<Magnification>(400);
    const [selectedOrganelle, setSelectedOrganelle] = useState<Organelle | null>(null);
    const [labeledOrganelles, setLabeledOrganelles] = useState<string[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const organelles = CELL_ORGANELLES[cellType];
    const progress = (labeledOrganelles.length / organelles.length) * 100;

    const handleOrganellePress = (organelle: Organelle) => {
        setSelectedOrganelle(organelle);
        if (!labeledOrganelles.includes(organelle.id)) {
            setLabeledOrganelles([...labeledOrganelles, organelle.id]);
        }

        // Pulse animation
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const handleMagnificationChange = (mag: Magnification) => {
        setMagnification(mag);
        // Zoom animation
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
    };

    const handleComplete = () => {
        if (labeledOrganelles.length === organelles.length) {
            setShowQuiz(true);
        }
    };

    const handleQuizComplete = (score: number, xpEarned: number) => {
        setShowQuiz(false);
        setIsComplete(true);
        // In a real app, save progress to storage/backend here
    };

    const renderPlantCell = () => (
        <G>
            {/* Cell Wall */}
            <Rect
                x={20}
                y={20}
                width={CELL_SIZE - 40}
                height={CELL_SIZE - 40}
                rx={20}
                fill="#8BC34A"
                stroke="#558B2F"
                strokeWidth={4}
                onPress={() => handleOrganellePress(organelles.find(o => o.id === 'cell-wall')!)}
            />

            {/* Cell Membrane */}
            <Rect
                x={30}
                y={30}
                width={CELL_SIZE - 60}
                height={CELL_SIZE - 60}
                rx={16}
                fill="#FFEB3B"
                stroke="#FBC02D"
                strokeWidth={2}
                onPress={() => handleOrganellePress(organelles.find(o => o.id === 'cell-membrane')!)}
            />

            {/* Cytoplasm */}
            <Rect
                x={34}
                y={34}
                width={CELL_SIZE - 68}
                height={CELL_SIZE - 68}
                rx={14}
                fill="#E1BEE7"
                opacity={0.6}
                onPress={() => handleOrganellePress(organelles.find(o => o.id === 'cytoplasm')!)}
            />

            {/* Large Vacuole */}
            <Ellipse
                cx={CELL_SIZE / 2}
                cy={CELL_SIZE / 2}
                rx={80}
                ry={60}
                fill="#03A9F4"
                opacity={0.5}
                onPress={() => handleOrganellePress(organelles.find(o => o.id === 'vacuole')!)}
            />

            {/* Nucleus */}
            <Circle
                cx={CELL_SIZE / 2 - 50}
                cy={CELL_SIZE / 2 - 40}
                r={40}
                fill="#9C27B0"
                onPress={() => handleOrganellePress(organelles.find(o => o.id === 'nucleus')!)}
            />
            <Circle
                cx={CELL_SIZE / 2 - 50}
                cy={CELL_SIZE / 2 - 40}
                r={15}
                fill="#7B1FA2"
            />

            {/* Chloroplasts */}
            {[
                { x: CELL_SIZE / 2 + 70, y: CELL_SIZE / 2 - 60 },
                { x: CELL_SIZE / 2 + 50, y: CELL_SIZE / 2 + 80 },
                { x: CELL_SIZE / 2 - 100, y: CELL_SIZE / 2 + 70 },
                { x: CELL_SIZE / 2 + 90, y: CELL_SIZE / 2 + 20 },
            ].map((pos, i) => (
                <Ellipse
                    key={`chloroplast-${i}`}
                    cx={pos.x}
                    cy={pos.y}
                    rx={18}
                    ry={10}
                    fill="#4CAF50"
                    stroke="#388E3C"
                    strokeWidth={1}
                    onPress={() => handleOrganellePress(organelles.find(o => o.id === 'chloroplast')!)}
                />
            ))}

            {/* Mitochondria */}
            {[
                { x: CELL_SIZE / 2 - 80, y: CELL_SIZE / 2 - 100 },
                { x: CELL_SIZE / 2 + 100, y: CELL_SIZE / 2 - 20 },
            ].map((pos, i) => (
                <Ellipse
                    key={`mito-${i}`}
                    cx={pos.x}
                    cy={pos.y}
                    rx={15}
                    ry={8}
                    fill="#FF5722"
                    stroke="#E64A19"
                    strokeWidth={1}
                    onPress={() => handleOrganellePress(organelles.find(o => o.id === 'mitochondria')!)}
                />
            ))}

            {/* Ribosomes (small dots) */}
            {Array.from({ length: 20 }).map((_, i) => (
                <Circle
                    key={`ribosome-${i}`}
                    cx={60 + Math.random() * (CELL_SIZE - 120)}
                    cy={60 + Math.random() * (CELL_SIZE - 120)}
                    r={3}
                    fill="#795548"
                    onPress={() => handleOrganellePress(organelles.find(o => o.id === 'ribosome')!)}
                />
            ))}
        </G>
    );

    const renderAnimalCell = () => (
        <G>
            {/* Cell Membrane (irregular shape) */}
            <Ellipse
                cx={CELL_SIZE / 2}
                cy={CELL_SIZE / 2}
                rx={CELL_SIZE / 2 - 30}
                ry={CELL_SIZE / 2 - 50}
                fill="#FFEB3B"
                stroke="#FBC02D"
                strokeWidth={3}
                onPress={() => handleOrganellePress(organelles.find(o => o.id === 'cell-membrane')!)}
            />

            {/* Cytoplasm */}
            <Ellipse
                cx={CELL_SIZE / 2}
                cy={CELL_SIZE / 2}
                rx={CELL_SIZE / 2 - 36}
                ry={CELL_SIZE / 2 - 56}
                fill="#E1BEE7"
                opacity={0.6}
                onPress={() => handleOrganellePress(organelles.find(o => o.id === 'cytoplasm')!)}
            />

            {/* Nucleus */}
            <Circle
                cx={CELL_SIZE / 2 - 30}
                cy={CELL_SIZE / 2 - 20}
                r={50}
                fill="#9C27B0"
                onPress={() => handleOrganellePress(organelles.find(o => o.id === 'nucleus')!)}
            />
            <Circle
                cx={CELL_SIZE / 2 - 30}
                cy={CELL_SIZE / 2 - 20}
                r={18}
                fill="#7B1FA2"
            />

            {/* Mitochondria */}
            {[
                { x: CELL_SIZE / 2 + 60, y: CELL_SIZE / 2 - 40 },
                { x: CELL_SIZE / 2 + 40, y: CELL_SIZE / 2 + 50 },
                { x: CELL_SIZE / 2 - 80, y: CELL_SIZE / 2 + 40 },
                { x: CELL_SIZE / 2 + 80, y: CELL_SIZE / 2 + 10 },
            ].map((pos, i) => (
                <Ellipse
                    key={`mito-${i}`}
                    cx={pos.x}
                    cy={pos.y}
                    rx={18}
                    ry={10}
                    fill="#FF5722"
                    stroke="#E64A19"
                    strokeWidth={1}
                    onPress={() => handleOrganellePress(organelles.find(o => o.id === 'mitochondria')!)}
                />
            ))}

            {/* Small Vacuoles */}
            {[
                { x: CELL_SIZE / 2 + 90, y: CELL_SIZE / 2 - 60 },
                { x: CELL_SIZE / 2 - 60, y: CELL_SIZE / 2 + 70 },
            ].map((pos, i) => (
                <Circle
                    key={`vacuole-${i}`}
                    cx={pos.x}
                    cy={pos.y}
                    r={12}
                    fill="#03A9F4"
                    opacity={0.6}
                    onPress={() => handleOrganellePress(organelles.find(o => o.id === 'small-vacuole')!)}
                />
            ))}

            {/* Ribosomes */}
            {Array.from({ length: 25 }).map((_, i) => (
                <Circle
                    key={`ribosome-${i}`}
                    cx={80 + Math.random() * (CELL_SIZE - 160)}
                    cy={80 + Math.random() * (CELL_SIZE - 160)}
                    r={3}
                    fill="#795548"
                    onPress={() => handleOrganellePress(organelles.find(o => o.id === 'ribosome')!)}
                />
            ))}
        </G>
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
                {/* Cell Type Selector */}
                <View style={styles.selectorContainer}>
                    <TouchableOpacity
                        style={[
                            styles.selectorButton,
                            cellType === 'plant' && styles.selectorActive,
                            { borderColor: cellType === 'plant' ? '#4CAF50' : themedColors.text.secondary + '40' }
                        ]}
                        onPress={() => {
                            setCellType('plant');
                            setLabeledOrganelles([]);
                            setSelectedOrganelle(null);
                        }}
                    >
                        <Ionicons name="leaf" size={20} color={cellType === 'plant' ? '#4CAF50' : themedColors.text.secondary} />
                        <Text style={[styles.selectorText, { color: cellType === 'plant' ? '#4CAF50' : themedColors.text.secondary }]}>
                            Plant Cell
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.selectorButton,
                            cellType === 'animal' && styles.selectorActive,
                            { borderColor: cellType === 'animal' ? '#FF5722' : themedColors.text.secondary + '40' }
                        ]}
                        onPress={() => {
                            setCellType('animal');
                            setLabeledOrganelles([]);
                            setSelectedOrganelle(null);
                        }}
                    >
                        <Ionicons name="paw" size={20} color={cellType === 'animal' ? '#FF5722' : themedColors.text.secondary} />
                        <Text style={[styles.selectorText, { color: cellType === 'animal' ? '#FF5722' : themedColors.text.secondary }]}>
                            Animal Cell
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Microscope View */}
                <View style={[styles.microscopeContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#E8E8E8' }]}>
                    <View style={styles.microscopeFrame}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Svg width={CELL_SIZE} height={CELL_SIZE} viewBox={`0 0 ${CELL_SIZE} ${CELL_SIZE}`}>
                                <Rect x={0} y={0} width={CELL_SIZE} height={CELL_SIZE} fill={isDarkMode ? '#2a2a2a' : '#FAFAFA'} rx={8} />
                                {cellType === 'plant' ? renderPlantCell() : renderAnimalCell()}
                            </Svg>
                        </Animated.View>
                    </View>

                    {/* Magnification indicator */}
                    <View style={styles.magnificationBadge}>
                        <Text style={styles.magnificationText}>{magnification}x</Text>
                    </View>
                </View>

                {/* Magnification Controls */}
                <View style={styles.magnificationControls}>
                    <Text style={[styles.controlLabel, { color: themedColors.text.secondary }]}>Magnification</Text>
                    <View style={styles.magnificationButtons}>
                        {([100, 400, 1000] as Magnification[]).map((mag) => (
                            <TouchableOpacity
                                key={mag}
                                style={[
                                    styles.magButton,
                                    magnification === mag && styles.magButtonActive,
                                    { backgroundColor: magnification === mag ? '#1976D2' : themedColors.background.paper }
                                ]}
                                onPress={() => handleMagnificationChange(mag)}
                            >
                                <Text style={[
                                    styles.magButtonText,
                                    { color: magnification === mag ? '#FFF' : themedColors.text.primary }
                                ]}>
                                    {mag}x
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Selected Organelle Info */}
                {selectedOrganelle && (
                    <View style={[styles.infoCard, { backgroundColor: themedColors.background.paper }]}>
                        <View style={[styles.infoColorDot, { backgroundColor: selectedOrganelle.color }]} />
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoTitle, { color: themedColors.text.primary }]}>
                                {selectedOrganelle.name}
                            </Text>
                            <Text style={[styles.infoDescription, { color: themedColors.text.secondary }]}>
                                {selectedOrganelle.description}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Progress */}
                <View style={[styles.progressCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.progressHeader}>
                        <Text style={[styles.progressTitle, { color: themedColors.text.primary }]}>
                            Organelles Identified
                        </Text>
                        <Text style={[styles.progressCount, { color: themedColors.primary.main }]}>
                            {labeledOrganelles.length}/{organelles.length}
                        </Text>
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: themedColors.background.subtle }]}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>

                    {/* Organelle chips */}
                    <View style={styles.organelleChips}>
                        {organelles.map((organelle) => (
                            <TouchableOpacity
                                key={organelle.id}
                                style={[
                                    styles.organelleChip,
                                    labeledOrganelles.includes(organelle.id)
                                        ? { backgroundColor: organelle.color + '30', borderColor: organelle.color }
                                        : { backgroundColor: themedColors.background.subtle, borderColor: 'transparent' }
                                ]}
                                onPress={() => handleOrganellePress(organelle)}
                            >
                                <Text style={[
                                    styles.organelleChipText,
                                    { color: labeledOrganelles.includes(organelle.id) ? organelle.color : themedColors.text.secondary }
                                ]}>
                                    {organelle.name}
                                </Text>
                                {labeledOrganelles.includes(organelle.id) && (
                                    <Ionicons name="checkmark-circle" size={14} color={organelle.color} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Complete Button */}
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        progress < 100 && styles.completeButtonDisabled
                    ]}
                    onPress={handleComplete}
                    disabled={progress < 100}
                >
                    <Text style={styles.completeButtonText}>
                        {progress < 100 ? `Identify all organelles (${Math.round(progress)}%)` : 'Take Knowledge Check'}
                    </Text>
                    <Ionicons name={progress < 100 ? "lock-closed" : "arrow-forward"} size={20} color="#FFF" />
                </TouchableOpacity>
            </ScrollView>

            {/* Knowledge Check Quiz Modal */}
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
    selectorContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    selectorButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
        gap: 8,
    },
    selectorActive: {
        backgroundColor: '#FFFFFF10',
    },
    selectorText: {
        fontSize: 14,
        fontWeight: '600',
    },
    microscopeContainer: {
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
        position: 'relative',
    },
    microscopeFrame: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    magnificationBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#000000AA',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    magnificationText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    magnificationControls: {
        marginBottom: 16,
    },
    controlLabel: {
        fontSize: 12,
        marginBottom: 8,
    },
    magnificationButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    magButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    magButtonActive: {
        elevation: 2,
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    magButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoColorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 4,
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    progressCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressCount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        marginBottom: 12,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    organelleChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    organelleChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        gap: 4,
    },
    organelleChipText: {
        fontSize: 12,
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

export default CellExplorerScreen;
