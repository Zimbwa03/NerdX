// Food Test Laboratory Screen - Biology Simulation
// Perform classic food tests to identify nutrients

import React, { useState } from 'react';
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
import Svg, { Rect, Ellipse, G, Circle, Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById, FOOD_TESTS, FOOD_SAMPLES, FoodTest } from '../../data/virtualLab';

const { width } = Dimensions.get('window');
const BEAKER_SIZE = width - 100;

type TestResult = 'none' | 'positive' | 'negative';

interface FoodTestResult {
    foodId: string;
    testId: string;
    result: TestResult;
    colorResult: string;
}

const FoodTestLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('food-test-lab')!;

    const [selectedFood, setSelectedFood] = useState<string | null>(null);
    const [selectedTest, setSelectedTest] = useState<string | null>(null);
    const [currentResult, setCurrentResult] = useState<FoodTestResult | null>(null);
    const [testResults, setTestResults] = useState<FoodTestResult[]>([]);
    const [isHeating, setIsHeating] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    const handlePerformTest = () => {
        if (!selectedFood || !selectedTest) return;

        const food = FOOD_SAMPLES.find(f => f.id === selectedFood);
        const test = FOOD_TESTS.find(t => t.id === selectedTest);

        if (!food || !test) return;

        // Determine if test is positive based on food nutrients
        let isPositive = false;
        if (test.id === 'benedicts' && food.nutrients.includes('sugar')) {
            isPositive = true;
        } else if (test.id === 'iodine' && food.nutrients.includes('starch')) {
            isPositive = true;
        } else if (test.id === 'biuret' && food.nutrients.includes('protein')) {
            isPositive = true;
        } else if (test.id === 'ethanol' && food.nutrients.includes('fat')) {
            isPositive = true;
        }

        // Benedict's test requires heating
        if (test.id === 'benedicts') {
            setIsHeating(true);
            setTimeout(() => {
                setIsHeating(false);
                completeTest(isPositive, test);
            }, 2000);
        } else {
            completeTest(isPositive, test);
        }
    };

    const completeTest = (isPositive: boolean, test: FoodTest) => {
        const result: FoodTestResult = {
            foodId: selectedFood!,
            testId: selectedTest!,
            result: isPositive ? 'positive' : 'negative',
            colorResult: isPositive ? getPositiveColor(test.id) : getNegativeColor(test.id),
        };

        setCurrentResult(result);

        // Add to results if not already recorded
        const existingIndex = testResults.findIndex(
            r => r.foodId === selectedFood && r.testId === selectedTest
        );
        if (existingIndex === -1) {
            setTestResults([...testResults, result]);
        }
    };

    const getPositiveColor = (testId: string): string => {
        switch (testId) {
            case 'benedicts': return '#E65100'; // Brick red
            case 'iodine': return '#1A237E'; // Blue-black
            case 'biuret': return '#7B1FA2'; // Purple
            case 'ethanol': return '#ECEFF1'; // Cloudy white
            default: return '#9E9E9E';
        }
    };

    const getNegativeColor = (testId: string): string => {
        switch (testId) {
            case 'benedicts': return '#2196F3'; // Blue
            case 'iodine': return '#795548'; // Brown
            case 'biuret': return '#2196F3'; // Blue
            case 'ethanol': return 'transparent'; // Clear
            default: return '#9E9E9E';
        }
    };

    const handleReset = () => {
        setSelectedFood(null);
        setSelectedTest(null);
        setCurrentResult(null);
    };

    const uniqueTestsCompleted = new Set(testResults.map(r => r.testId)).size;
    const canTakeQuiz = uniqueTestsCompleted >= 3;

    const renderBeaker = () => {
        const test = selectedTest ? FOOD_TESTS.find(t => t.id === selectedTest) : null;
        const liquidColor = currentResult
            ? currentResult.colorResult
            : test
                ? getNegativeColor(test.id)
                : '#E3F2FD';

        return (
            <View style={[styles.beakerContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }]}>
                <Svg width={BEAKER_SIZE} height={200} viewBox={`0 0 ${BEAKER_SIZE} 200`}>
                    {/* Bunsen burner flame for Benedict's test */}
                    {isHeating && (
                        <G>
                            <Ellipse cx={BEAKER_SIZE / 2} cy={185} rx={30} ry={10} fill="#FF9800" />
                            <Path
                                d={`M ${BEAKER_SIZE / 2 - 15} 180 Q ${BEAKER_SIZE / 2} 140 ${BEAKER_SIZE / 2 + 15} 180`}
                                fill="#FF5722"
                            />
                            <Path
                                d={`M ${BEAKER_SIZE / 2 - 8} 175 Q ${BEAKER_SIZE / 2} 150 ${BEAKER_SIZE / 2 + 8} 175`}
                                fill="#FFEB3B"
                            />
                        </G>
                    )}

                    {/* Beaker */}
                    <Rect
                        x={BEAKER_SIZE / 2 - 50}
                        y={50}
                        width={100}
                        height={120}
                        rx={5}
                        fill="transparent"
                        stroke={themedColors.text.primary}
                        strokeWidth={3}
                    />

                    {/* Liquid */}
                    <Rect
                        x={BEAKER_SIZE / 2 - 47}
                        y={70}
                        width={94}
                        height={97}
                        fill={liquidColor}
                        opacity={currentResult?.testId === 'ethanol' && currentResult.result === 'positive' ? 0.5 : 0.8}
                    />

                    {/* Bubbles for heating */}
                    {isHeating && (
                        <G>
                            <Circle cx={BEAKER_SIZE / 2 - 20} cy={140} r={5} fill="#FFFFFF50" />
                            <Circle cx={BEAKER_SIZE / 2 + 10} cy={130} r={4} fill="#FFFFFF50" />
                            <Circle cx={BEAKER_SIZE / 2} cy={120} r={6} fill="#FFFFFF50" />
                        </G>
                    )}
                </Svg>

                {/* Status label */}
                {isHeating && (
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>🔥 Heating...</Text>
                    </View>
                )}

                {currentResult && (
                    <View style={[
                        styles.resultBadge,
                        { backgroundColor: currentResult.result === 'positive' ? '#4CAF5020' : '#F4433620' }
                    ]}>
                        <Ionicons
                            name={currentResult.result === 'positive' ? "checkmark-circle" : "close-circle"}
                            size={20}
                            color={currentResult.result === 'positive' ? '#4CAF50' : '#F44336'}
                        />
                        <Text style={[
                            styles.resultText,
                            { color: currentResult.result === 'positive' ? '#4CAF50' : '#F44336' }
                        ]}>
                            {currentResult.result === 'positive'
                                ? FOOD_TESTS.find(t => t.id === currentResult.testId)?.positiveResult
                                : FOOD_TESTS.find(t => t.id === currentResult.testId)?.negativeResult
                            }
                        </Text>
                    </View>
                )}
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
                {/* Beaker Visualization */}
                {renderBeaker()}

                {/* Food Selection */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        🍽️ Select Food Sample
                    </Text>
                    <View style={styles.optionsGrid}>
                        {FOOD_SAMPLES.map((food) => (
                            <TouchableOpacity
                                key={food.id}
                                style={[
                                    styles.optionBtn,
                                    selectedFood === food.id && styles.optionBtnSelected,
                                    {
                                        backgroundColor: selectedFood === food.id
                                            ? '#4CAF5020'
                                            : themedColors.background.subtle,
                                        borderColor: selectedFood === food.id ? '#4CAF50' : 'transparent'
                                    }
                                ]}
                                onPress={() => {
                                    setSelectedFood(food.id);
                                    setCurrentResult(null);
                                }}
                            >
                                <Text style={[
                                    styles.optionText,
                                    { color: selectedFood === food.id ? '#4CAF50' : themedColors.text.primary }
                                ]}>
                                    {food.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Test Selection */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        🧪 Select Test
                    </Text>
                    <View style={styles.testsContainer}>
                        {FOOD_TESTS.map((test) => (
                            <TouchableOpacity
                                key={test.id}
                                style={[
                                    styles.testBtn,
                                    selectedTest === test.id && styles.testBtnSelected,
                                    { borderColor: selectedTest === test.id ? test.color : 'transparent' }
                                ]}
                                onPress={() => {
                                    setSelectedTest(test.id);
                                    setCurrentResult(null);
                                }}
                            >
                                <View style={[styles.testColorDot, { backgroundColor: test.color }]} />
                                <View style={styles.testInfo}>
                                    <Text style={[styles.testName, { color: themedColors.text.primary }]}>
                                        {test.name}
                                    </Text>
                                    <Text style={[styles.testDetects, { color: themedColors.text.secondary }]}>
                                        Detects: {test.detects}
                                    </Text>
                                </View>
                                {selectedTest === test.id && (
                                    <Ionicons name="checkmark-circle" size={20} color={test.color} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[
                            styles.testButton,
                            (!selectedFood || !selectedTest) && styles.testButtonDisabled
                        ]}
                        onPress={handlePerformTest}
                        disabled={!selectedFood || !selectedTest || isHeating}
                    >
                        <Ionicons name="flask" size={20} color="#FFF" />
                        <Text style={styles.testButtonText}>
                            {isHeating ? 'Heating...' : 'Perform Test'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Ionicons name="refresh" size={20} color="#FF9800" />
                    </TouchableOpacity>
                </View>

                {/* Results Summary */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>
                        📊 Results ({testResults.length} tests)
                    </Text>
                    {testResults.length === 0 ? (
                        <Text style={[styles.emptyText, { color: themedColors.text.secondary }]}>
                            Perform tests to record results
                        </Text>
                    ) : (
                        <View style={styles.resultsContainer}>
                            {testResults.slice(-6).map((result, index) => {
                                const food = FOOD_SAMPLES.find(f => f.id === result.foodId);
                                const test = FOOD_TESTS.find(t => t.id === result.testId);
                                return (
                                    <View key={index} style={styles.resultRow}>
                                        <Text style={[styles.resultFood, { color: themedColors.text.primary }]}>
                                            {food?.name}
                                        </Text>
                                        <Text style={[styles.resultTest, { color: themedColors.text.secondary }]}>
                                            {test?.name}
                                        </Text>
                                        <View style={[
                                            styles.resultIcon,
                                            { backgroundColor: result.result === 'positive' ? '#4CAF5020' : '#F4433620' }
                                        ]}>
                                            <Ionicons
                                                name={result.result === 'positive' ? "checkmark" : "close"}
                                                size={14}
                                                color={result.result === 'positive' ? '#4CAF50' : '#F44336'}
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
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
                        {canTakeQuiz ? 'Take Knowledge Check' : `Perform ${3 - uniqueTestsCompleted} more test types`}
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
    beakerContainer: {
        borderRadius: 16,
        alignItems: 'center',
        position: 'relative',
        marginBottom: 16,
        paddingVertical: 16,
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FF572220',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#FF5722',
        fontSize: 12,
        fontWeight: '600',
    },
    resultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 12,
        gap: 8,
    },
    resultText: {
        fontSize: 13,
        fontWeight: '500',
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
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 2,
    },
    optionBtnSelected: {},
    optionText: {
        fontSize: 13,
        fontWeight: '500',
    },
    testsContainer: {
        gap: 8,
    },
    testBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: '#00000005',
        gap: 12,
    },
    testBtnSelected: {
        backgroundColor: '#00000010',
    },
    testColorDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#00000020',
    },
    testInfo: {
        flex: 1,
    },
    testName: {
        fontSize: 14,
        fontWeight: '600',
    },
    testDetects: {
        fontSize: 11,
        marginTop: 2,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    testButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    testButtonDisabled: {
        backgroundColor: '#9E9E9E',
    },
    testButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resetButton: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF9800',
        borderRadius: 12,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 12,
    },
    resultsContainer: {
        gap: 6,
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#00000010',
    },
    resultFood: {
        flex: 2,
        fontSize: 12,
        fontWeight: '500',
    },
    resultTest: {
        flex: 2,
        fontSize: 11,
    },
    resultIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
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

export default FoodTestLabScreen;
