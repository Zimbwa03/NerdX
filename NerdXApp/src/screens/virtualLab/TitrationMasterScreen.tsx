// Titration Master Screen - Chemistry Simulation
// Perform precise acid-base titrations

import React, { useState } from 'react';
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
import Svg, { Rect, Circle, G, Line, Text as SvgText, Path, Ellipse } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 48;

type Indicator = 'phenolphthalein' | 'methyl-orange';

const TitrationMasterScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('titration-master')!;

    const [indicator, setIndicator] = useState<Indicator>('phenolphthalein');
    const [titrantAdded, setTitrantAdded] = useState(0); // mL
    const [titreValues, setTitreValues] = useState<number[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);

    // Endpoint is at 25mL for this simulation
    const ENDPOINT = 25;
    const atEndpoint = titrantAdded >= ENDPOINT && titrantAdded <= ENDPOINT + 1;
    const pastEndpoint = titrantAdded > ENDPOINT + 1;

    // Get solution color based on indicator and titrant
    const getSolutionColor = () => {
        if (indicator === 'phenolphthalein') {
            if (titrantAdded < ENDPOINT) return '#FFEBEE'; // Colorless with slight pink tinge
            if (atEndpoint) return '#F48FB1'; // Pale pink at endpoint
            return '#EC407A'; // Deep pink past endpoint
        } else {
            if (titrantAdded < ENDPOINT) return '#F44336'; // Red in acid
            if (atEndpoint) return '#FF9800'; // Orange at endpoint
            return '#FFEB3B'; // Yellow in alkali
        }
    };

    const handleAddDrop = () => {
        if (titrantAdded < 50) {
            setTitrantAdded(prev => Math.min(50, prev + 0.5));
        }
    };

    const handleAddBulk = () => {
        if (titrantAdded < 50) {
            setTitrantAdded(prev => Math.min(50, prev + 5));
        }
    };

    const handleRecordTitre = () => {
        if (titrantAdded > 0 && titreValues.length < 3) {
            setTitreValues(prev => [...prev, titrantAdded]);
            setTitrantAdded(0);
        }
    };

    const handleReset = () => {
        setTitrantAdded(0);
    };

    const averageTitre = titreValues.length > 0
        ? (titreValues.reduce((a, b) => a + b, 0) / titreValues.length).toFixed(2)
        : '0.00';

    const canTakeQuiz = titreValues.length >= 2;

    const renderApparatus = () => (
        <View style={[styles.apparatusContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }]}>
            <Svg width={CANVAS_WIDTH} height={280} viewBox={`0 0 ${CANVAS_WIDTH} 280`}>
                {/* Stand */}
                <Rect x={CANVAS_WIDTH / 2 - 5} y={0} width={10} height={270} fill="#5D4037" />
                <Rect x={CANVAS_WIDTH / 2 - 60} y={0} width={120} height={10} fill="#5D4037" />
                <Rect x={CANVAS_WIDTH / 2 - 40} y={265} width={80} height={10} fill="#5D4037" />

                {/* Burette */}
                <G transform={`translate(${CANVAS_WIDTH / 2 + 20}, 20)`}>
                    <Rect x={0} y={0} width={20} height={150} rx={2} fill="#E3F2FD" stroke="#90CAF9" strokeWidth={1} />
                    {/* NaOH label */}
                    <SvgText x={10} y={20} fontSize={8} fill="#1565C0" textAnchor="middle">NaOH</SvgText>
                    {/* Liquid level */}
                    <Rect x={2} y={5 + titrantAdded * 2.8} width={16} height={140 - titrantAdded * 2.8} fill="#BBDEFB" />
                    {/* Scale markings */}
                    {[0, 10, 20, 30, 40, 50].map((val) => (
                        <G key={val}>
                            <Line x1={20} y1={5 + val * 2.8} x2={30} y2={5 + val * 2.8} stroke={themedColors.text.secondary} strokeWidth={1} />
                            <SvgText x={35} y={9 + val * 2.8} fontSize={7} fill={themedColors.text.secondary}>{val}</SvgText>
                        </G>
                    ))}
                    {/* Tap */}
                    <Rect x={5} y={150} width={10} height={15} fill="#37474F" />
                    {/* Nozzle */}
                    <Rect x={8} y={165} width={4} height={25} fill="#37474F" />
                </G>

                {/* Conical flask */}
                <G transform={`translate(${CANVAS_WIDTH / 2 - 45}, 195)`}>
                    <Path
                        d="M 20 0 L 0 60 L 60 60 L 40 0 Z"
                        fill="transparent"
                        stroke="#90CAF9"
                        strokeWidth={2}
                    />
                    {/* Solution */}
                    <Path
                        d="M 18 5 L 5 55 L 55 55 L 42 5 Z"
                        fill={getSolutionColor()}
                        opacity={0.8}
                    />
                    {/* HCl label */}
                    <SvgText x={30} y={35} fontSize={9} fill="#424242" textAnchor="middle">HCl</SvgText>
                </G>

                {/* White tile */}
                <Rect x={CANVAS_WIDTH / 2 - 50} y={258} width={70} height={8} fill="#ECEFF1" stroke="#B0BEC5" strokeWidth={1} />

                {/* Burette reading */}
                <SvgText x={CANVAS_WIDTH / 2 + 70} y={180} fontSize={12} fill={themedColors.text.primary}>
                    Reading: {titrantAdded.toFixed(1)} mL
                </SvgText>
            </Svg>

            {/* Endpoint indicator */}
            {atEndpoint && (
                <View style={styles.endpointBadge}>
                    <Text style={styles.endpointText}>🎯 End point reached!</Text>
                </View>
            )}
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
                {/* Apparatus */}
                {renderApparatus()}

                {/* Indicator Selection */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        🎨 Select Indicator
                    </Text>
                    <View style={styles.indicatorRow}>
                        <TouchableOpacity
                            style={[
                                styles.indicatorBtn,
                                indicator === 'phenolphthalein' && styles.indicatorBtnActive,
                            ]}
                            onPress={() => { setIndicator('phenolphthalein'); handleReset(); }}
                        >
                            <View style={[styles.colorDot, { backgroundColor: '#EC407A' }]} />
                            <Text style={{ color: indicator === 'phenolphthalein' ? '#E91E63' : themedColors.text.secondary }}>
                                Phenolphthalein
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.indicatorBtn,
                                indicator === 'methyl-orange' && styles.indicatorBtnActive,
                            ]}
                            onPress={() => { setIndicator('methyl-orange'); handleReset(); }}
                        >
                            <View style={[styles.colorDot, { backgroundColor: '#FF9800' }]} />
                            <Text style={{ color: indicator === 'methyl-orange' ? '#FF9800' : themedColors.text.secondary }}>
                                Methyl Orange
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Controls */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        🧪 Add Titrant
                    </Text>
                    <View style={styles.controlsRow}>
                        <TouchableOpacity style={styles.dropBtn} onPress={handleAddDrop}>
                            <Text style={styles.dropBtnText}>+0.5 mL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bulkBtn} onPress={handleAddBulk}>
                            <Text style={styles.bulkBtnText}>+5 mL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                            <Ionicons name="refresh" size={18} color="#607D8B" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.recordBtn, !atEndpoint && styles.recordBtnDisabled]}
                        onPress={handleRecordTitre}
                        disabled={!atEndpoint || titreValues.length >= 3}
                    >
                        <Ionicons name="save" size={18} color="#FFF" />
                        <Text style={styles.recordBtnText}>Record Titre Value</Text>
                    </TouchableOpacity>
                </View>

                {/* Results Table */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        📊 Titre Values
                    </Text>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableHeader, { color: themedColors.text.secondary }]}>Trial</Text>
                        <Text style={[styles.tableHeader, { color: themedColors.text.secondary }]}>Titre (mL)</Text>
                    </View>
                    {[1, 2, 3].map((trial) => (
                        <View key={trial} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { color: themedColors.text.primary }]}>{trial}</Text>
                            <Text style={[styles.tableCell, { color: themedColors.text.primary }]}>
                                {titreValues[trial - 1]?.toFixed(2) || '---'}
                            </Text>
                        </View>
                    ))}
                    <View style={[styles.tableRow, styles.averageRow]}>
                        <Text style={[styles.tableCell, { color: '#E91E63', fontWeight: 'bold' }]}>Average</Text>
                        <Text style={[styles.tableCell, { color: '#E91E63', fontWeight: 'bold' }]}>
                            {averageTitre} mL
                        </Text>
                    </View>
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
                        {canTakeQuiz ? 'Take Knowledge Check' : `Record ${2 - titreValues.length} more titre values`}
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
    apparatusContainer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        position: 'relative',
    },
    endpointBadge: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: '#4CAF5020',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    endpointText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: '600',
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
    indicatorRow: {
        flexDirection: 'row',
        gap: 12,
    },
    indicatorBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00000020',
        gap: 8,
    },
    indicatorBtnActive: {
        backgroundColor: '#00000010',
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    controlsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    dropBtn: {
        flex: 1,
        padding: 14,
        backgroundColor: '#E91E63',
        borderRadius: 8,
        alignItems: 'center',
    },
    dropBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    bulkBtn: {
        flex: 1,
        padding: 14,
        backgroundColor: '#9C27B0',
        borderRadius: 8,
        alignItems: 'center',
    },
    bulkBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    resetBtn: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#607D8B',
        borderRadius: 8,
    },
    recordBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 10,
        gap: 8,
    },
    recordBtnDisabled: {
        backgroundColor: '#9E9E9E',
    },
    recordBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#00000010',
    },
    averageRow: {
        backgroundColor: '#E91E6310',
        borderRadius: 6,
        marginTop: 8,
    },
    tableHeader: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    tableCell: {
        flex: 1,
        fontSize: 14,
        textAlign: 'center',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E91E63',
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

export default TitrationMasterScreen;
