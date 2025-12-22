// Equation Balancer Screen - Chemistry Simulation
// Balance chemical equations by adjusting coefficients

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
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById, CHEMICAL_EQUATIONS, ChemicalEquation } from '../../data/virtualLab';

const { width } = Dimensions.get('window');

const EquationBalancerScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('equation-balancer')!;

    const [currentLevel, setCurrentLevel] = useState(0);
    const [coefficients, setCoefficients] = useState<number[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const equations = CHEMICAL_EQUATIONS.filter(eq => eq.difficulty !== 'hard').slice(0, 6);
    const currentEquation = equations[currentLevel];

    // Initialize coefficients when equation changes
    useEffect(() => {
        if (currentEquation) {
            setCoefficients(new Array(currentEquation.correctCoefficients.length).fill(1));
        }
        setShowSuccess(false);
    }, [currentLevel]);

    // Parse atom counts from formula
    const parseAtoms = (formula: string): Record<string, number> => {
        const atoms: Record<string, number> = {};
        const regex = /([A-Z][a-z]?)(\d*)/g;
        let match;

        // Handle subscript characters
        const normalized = formula
            .replace(/₂/g, '2')
            .replace(/₃/g, '3')
            .replace(/₄/g, '4')
            .replace(/₅/g, '5')
            .replace(/₆/g, '6')
            .replace(/₇/g, '7')
            .replace(/₈/g, '8')
            .replace(/₀/g, '0');

        while ((match = regex.exec(normalized)) !== null) {
            const element = match[1];
            const count = match[2] ? parseInt(match[2]) : 1;
            atoms[element] = (atoms[element] || 0) + count;
        }

        return atoms;
    };

    // Calculate total atoms for each side
    const calculateSideAtoms = (formulas: string[], coeffs: number[]): Record<string, number> => {
        const totals: Record<string, number> = {};

        formulas.forEach((formula, index) => {
            const atoms = parseAtoms(formula);
            const coeff = coeffs[index] || 1;

            Object.entries(atoms).forEach(([element, count]) => {
                totals[element] = (totals[element] || 0) + (count * coeff);
            });
        });

        return totals;
    };

    const reactantCoeffs = coefficients.slice(0, currentEquation?.reactants.length || 0);
    const productCoeffs = coefficients.slice(currentEquation?.reactants.length || 0);

    const reactantAtoms = currentEquation ? calculateSideAtoms(currentEquation.reactants, reactantCoeffs) : {};
    const productAtoms = currentEquation ? calculateSideAtoms(currentEquation.products, productCoeffs) : {};

    // Check if balanced
    const isBalanced = (): boolean => {
        const elements = new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]);
        for (const element of elements) {
            if ((reactantAtoms[element] || 0) !== (productAtoms[element] || 0)) {
                return false;
            }
        }
        return currentEquation?.reactants.length > 0;
    };

    const handleCoefficientChange = (index: number, delta: number) => {
        const newCoeffs = [...coefficients];
        newCoeffs[index] = Math.max(1, Math.min(10, (newCoeffs[index] || 1) + delta));
        setCoefficients(newCoeffs);
    };

    const handleCheckBalance = () => {
        if (isBalanced()) {
            setShowSuccess(true);
            if (!completedLevels.includes(currentLevel)) {
                setCompletedLevels([...completedLevels, currentLevel]);
            }
        }
    };

    const handleNextLevel = () => {
        if (currentLevel < equations.length - 1) {
            setCurrentLevel(currentLevel + 1);
        }
    };

    const handleQuizComplete = () => {
        setShowQuiz(false);
    };

    const canTakeQuiz = completedLevels.length >= 3;

    const renderEquation = () => {
        if (!currentEquation) return null;

        const allFormulas = [...currentEquation.reactants, ...currentEquation.products];

        return (
            <View style={styles.equationContainer}>
                <View style={styles.equationSide}>
                    {currentEquation.reactants.map((formula, index) => (
                        <View key={`r-${index}`} style={styles.moleculeBox}>
                            {/* Coefficient control */}
                            <View style={styles.coefficientControl}>
                                <TouchableOpacity
                                    style={[styles.coeffBtn, { backgroundColor: themedColors.background.subtle }]}
                                    onPress={() => handleCoefficientChange(index, -1)}
                                >
                                    <Ionicons name="remove" size={18} color={themedColors.text.primary} />
                                </TouchableOpacity>
                                <Text style={[styles.coeffValue, { color: '#9C27B0' }]}>
                                    {coefficients[index] || 1}
                                </Text>
                                <TouchableOpacity
                                    style={[styles.coeffBtn, { backgroundColor: '#9C27B0' }]}
                                    onPress={() => handleCoefficientChange(index, 1)}
                                >
                                    <Ionicons name="add" size={18} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            {/* Formula */}
                            <Text style={[styles.formula, { color: themedColors.text.primary }]}>
                                {formula}
                            </Text>

                            {index < currentEquation.reactants.length - 1 && (
                                <Text style={[styles.plusSign, { color: themedColors.text.secondary }]}>+</Text>
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.arrowContainer}>
                    <Ionicons name="arrow-forward" size={28} color={themedColors.text.secondary} />
                </View>

                <View style={styles.equationSide}>
                    {currentEquation.products.map((formula, index) => {
                        const coeffIndex = currentEquation.reactants.length + index;
                        return (
                            <View key={`p-${index}`} style={styles.moleculeBox}>
                                {/* Coefficient control */}
                                <View style={styles.coefficientControl}>
                                    <TouchableOpacity
                                        style={[styles.coeffBtn, { backgroundColor: themedColors.background.subtle }]}
                                        onPress={() => handleCoefficientChange(coeffIndex, -1)}
                                    >
                                        <Ionicons name="remove" size={18} color={themedColors.text.primary} />
                                    </TouchableOpacity>
                                    <Text style={[styles.coeffValue, { color: '#9C27B0' }]}>
                                        {coefficients[coeffIndex] || 1}
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.coeffBtn, { backgroundColor: '#9C27B0' }]}
                                        onPress={() => handleCoefficientChange(coeffIndex, 1)}
                                    >
                                        <Ionicons name="add" size={18} color="#FFF" />
                                    </TouchableOpacity>
                                </View>

                                {/* Formula */}
                                <Text style={[styles.formula, { color: themedColors.text.primary }]}>
                                    {formula}
                                </Text>

                                {index < currentEquation.products.length - 1 && (
                                    <Text style={[styles.plusSign, { color: themedColors.text.secondary }]}>+</Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    const renderAtomCount = () => {
        const allElements = [...new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)])];

        return (
            <View style={[styles.atomCountCard, { backgroundColor: themedColors.background.paper }]}>
                <Text style={[styles.atomCountTitle, { color: themedColors.text.primary }]}>
                    Atom Count
                </Text>

                <View style={styles.atomTable}>
                    <View style={styles.atomTableHeader}>
                        <Text style={[styles.atomHeaderCell, { color: themedColors.text.secondary }]}>Element</Text>
                        <Text style={[styles.atomHeaderCell, { color: themedColors.text.secondary }]}>Reactants</Text>
                        <Text style={[styles.atomHeaderCell, { color: themedColors.text.secondary }]}>Products</Text>
                        <Text style={[styles.atomHeaderCell, { color: themedColors.text.secondary }]}>Status</Text>
                    </View>

                    {allElements.map((element) => {
                        const reactantCount = reactantAtoms[element] || 0;
                        const productCount = productAtoms[element] || 0;
                        const matched = reactantCount === productCount;

                        return (
                            <View key={element} style={styles.atomTableRow}>
                                <Text style={[styles.atomCell, { color: themedColors.text.primary, fontWeight: 'bold' }]}>
                                    {element}
                                </Text>
                                <Text style={[styles.atomCell, { color: themedColors.text.primary }]}>
                                    {reactantCount}
                                </Text>
                                <Text style={[styles.atomCell, { color: themedColors.text.primary }]}>
                                    {productCount}
                                </Text>
                                <View style={styles.atomCell}>
                                    <Ionicons
                                        name={matched ? "checkmark-circle" : "close-circle"}
                                        size={20}
                                        color={matched ? "#4CAF50" : "#F44336"}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
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
                {/* Level Indicator */}
                <View style={styles.levelContainer}>
                    <View style={styles.levelBadge}>
                        <Text style={[styles.levelText, { color: themedColors.text.primary }]}>
                            Level {currentLevel + 1}
                        </Text>
                        <Text style={[styles.difficultyText, { color: currentEquation?.difficulty === 'medium' ? '#FF9800' : '#4CAF50' }]}>
                            {currentEquation?.difficulty.toUpperCase()}
                        </Text>
                    </View>

                    <View style={styles.levelDots}>
                        {equations.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.levelDot,
                                    {
                                        backgroundColor: completedLevels.includes(index)
                                            ? '#4CAF50'
                                            : index === currentLevel
                                                ? '#9C27B0'
                                                : themedColors.text.secondary + '40'
                                    }
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Equation */}
                <View style={[styles.equationCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.instructionText, { color: themedColors.text.secondary }]}>
                        Adjust coefficients to balance the equation:
                    </Text>
                    {renderEquation()}
                </View>

                {/* Atom Count */}
                {renderAtomCount()}

                {/* Success Message */}
                {showSuccess && (
                    <View style={styles.successCard}>
                        <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
                        <Text style={styles.successText}>🎉 Balanced!</Text>
                        <Text style={styles.successSubtext}>
                            The law of conservation of mass is satisfied!
                        </Text>
                        {currentLevel < equations.length - 1 && (
                            <TouchableOpacity style={styles.nextLevelBtn} onPress={handleNextLevel}>
                                <Text style={styles.nextLevelBtnText}>Next Level</Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Check Button */}
                {!showSuccess && (
                    <TouchableOpacity
                        style={[styles.checkButton, isBalanced() && styles.checkButtonReady]}
                        onPress={handleCheckBalance}
                    >
                        <Ionicons name="scale" size={20} color="#FFF" />
                        <Text style={styles.checkButtonText}>Check Balance</Text>
                    </TouchableOpacity>
                )}

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
                        {canTakeQuiz ? 'Take Knowledge Check' : `Balance ${3 - completedLevels.length} more equations`}
                    </Text>
                    <Ionicons name={canTakeQuiz ? "arrow-forward" : "lock-closed"} size={20} color="#FFF" />
                </TouchableOpacity>
            </ScrollView>

            {/* Knowledge Check */}
            <KnowledgeCheck
                visible={showQuiz}
                simulation={simulation}
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
    levelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    levelText: {
        fontSize: 16,
        fontWeight: '600',
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        backgroundColor: '#00000010',
    },
    levelDots: {
        flexDirection: 'row',
        gap: 6,
    },
    levelDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    equationCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
    },
    instructionText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    equationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    equationSide: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    moleculeBox: {
        alignItems: 'center',
        marginHorizontal: 4,
    },
    coefficientControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    coeffBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coeffValue: {
        fontSize: 18,
        fontWeight: 'bold',
        minWidth: 24,
        textAlign: 'center',
    },
    formula: {
        fontSize: 20,
        fontWeight: '600',
    },
    plusSign: {
        fontSize: 18,
        marginHorizontal: 8,
    },
    arrowContainer: {
        marginHorizontal: 12,
        marginTop: 30,
    },
    atomCountCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    atomCountTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    atomTable: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    atomTableHeader: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#00000020',
    },
    atomHeaderCell: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    atomTableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#00000010',
    },
    atomCell: {
        flex: 1,
        fontSize: 14,
        textAlign: 'center',
        alignItems: 'center',
    },
    successCard: {
        backgroundColor: '#4CAF5015',
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 8,
    },
    successSubtext: {
        fontSize: 14,
        color: '#689F38',
        marginTop: 4,
        textAlign: 'center',
    },
    nextLevelBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
        gap: 8,
    },
    nextLevelBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    checkButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9C27B0',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    checkButtonReady: {
        backgroundColor: '#4CAF50',
    },
    checkButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9C27B0',
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

export default EquationBalancerScreen;
