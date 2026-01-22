// Probability Simulator Screen - Mathematics Virtual Lab
// Interactive dice rolling and coin flipping with live probability visualization

import React, { useState, useCallback, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getMathSimulationById } from '../../data/virtualLab/mathSimulationsData';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 64;
const CHART_HEIGHT = 200;
const BAR_WIDTH = 40;

const ProbabilitySimulatorScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getMathSimulationById('probability-simulator')!;

    const [mode, setMode] = useState<'dice' | 'coin'>('dice');
    const [diceResults, setDiceResults] = useState<number[]>([]);
    const [coinResults, setCoinResults] = useState<('heads' | 'tails')[]>([]);
    const [isRolling, setIsRolling] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [rollCount, setRollCount] = useState(0);
    const [currentDice, setCurrentDice] = useState(1);
    const [currentCoin, setCurrentCoin] = useState<'heads' | 'tails'>('heads');
    const [rollAnim] = useState(new Animated.Value(0));

    const canTakeQuiz = rollCount >= 20;

    // Calculate dice frequencies
    const getDiceFrequencies = useCallback(() => {
        const freq = [0, 0, 0, 0, 0, 0];
        diceResults.forEach(r => freq[r - 1]++);
        return freq;
    }, [diceResults]);

    // Calculate coin frequencies
    const getCoinFrequencies = useCallback(() => {
        const heads = coinResults.filter(r => r === 'heads').length;
        const tails = coinResults.length - heads;
        return { heads, tails };
    }, [coinResults]);

    const rollDice = () => {
        if (isRolling) return;
        setIsRolling(true);
        setRollCount(prev => prev + 1);

        // Animate the roll
        let rolls = 0;
        const maxRolls = 10;
        const interval = setInterval(() => {
            const randomValue = Math.floor(Math.random() * 6) + 1;
            setCurrentDice(randomValue);
            rolls++;

            if (rolls >= maxRolls) {
                clearInterval(interval);
                const finalValue = Math.floor(Math.random() * 6) + 1;
                setCurrentDice(finalValue);
                setDiceResults(prev => [...prev, finalValue]);
                setIsRolling(false);
            }
        }, 80);
    };

    const flipCoin = () => {
        if (isRolling) return;
        setIsRolling(true);
        setRollCount(prev => prev + 1);

        let flips = 0;
        const maxFlips = 8;
        const interval = setInterval(() => {
            setCurrentCoin(prev => prev === 'heads' ? 'tails' : 'heads');
            flips++;

            if (flips >= maxFlips) {
                clearInterval(interval);
                const finalValue: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
                setCurrentCoin(finalValue);
                setCoinResults(prev => [...prev, finalValue]);
                setIsRolling(false);
            }
        }, 100);
    };

    const rollMultiple = (count: number) => {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (mode === 'dice') {
                    const value = Math.floor(Math.random() * 6) + 1;
                    setDiceResults(prev => [...prev, value]);
                    setCurrentDice(value);
                } else {
                    const value: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
                    setCoinResults(prev => [...prev, value]);
                    setCurrentCoin(value);
                }
                setRollCount(prev => prev + 1);
            }, i * 30);
        }
    };

    const reset = () => {
        setDiceResults([]);
        setCoinResults([]);
        setRollCount(0);
    };

    const diceFreq = getDiceFrequencies();
    const coinFreq = getCoinFrequencies();
    const maxDiceFreq = Math.max(...diceFreq, 1);

    const getDiceFace = (value: number) => {
        const dots: { [key: number]: string } = {
            1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅'
        };
        return dots[value] || '⚀';
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            <SimulationHeader
                simulation={simulation}
                onBack={() => navigation.goBack()}
            />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Mode Selector */}
                <View style={[styles.modeSelector, { backgroundColor: themedColors.background.paper }]}>
                    <TouchableOpacity
                        style={[
                            styles.modeButton,
                            mode === 'dice' && styles.modeButtonActive,
                        ]}
                        onPress={() => setMode('dice')}
                    >
                        <Text style={styles.modeEmoji}>🎲</Text>
                        <Text style={[styles.modeText, { color: mode === 'dice' ? '#FFF' : themedColors.text.primary }]}>
                            Dice
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.modeButton,
                            mode === 'coin' && styles.modeButtonActive,
                        ]}
                        onPress={() => setMode('coin')}
                    >
                        <Text style={styles.modeEmoji}>🪙</Text>
                        <Text style={[styles.modeText, { color: mode === 'coin' ? '#FFF' : themedColors.text.primary }]}>
                            Coin
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Result Display */}
                <View style={[styles.resultCard, { backgroundColor: themedColors.background.paper }]}>
                    {mode === 'dice' ? (
                        <View style={styles.diceDisplay}>
                            <Text style={[styles.diceValue, { transform: [{ scale: isRolling ? 1.1 : 1 }] }]}>
                                {getDiceFace(currentDice)}
                            </Text>
                            <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>
                                Last Roll: {currentDice}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.coinDisplay}>
                            <View style={[
                                styles.coin,
                                { backgroundColor: currentCoin === 'heads' ? '#FFD700' : '#C0C0C0' }
                            ]}>
                                <Text style={styles.coinText}>
                                    {currentCoin === 'heads' ? 'H' : 'T'}
                                </Text>
                            </View>
                            <Text style={[styles.resultLabel, { color: themedColors.text.secondary }]}>
                                {currentCoin.charAt(0).toUpperCase() + currentCoin.slice(1)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.rollButton, isRolling && styles.rollButtonDisabled]}
                        onPress={mode === 'dice' ? rollDice : flipCoin}
                        disabled={isRolling}
                    >
                        <LinearGradient
                            colors={['#AB47BC', '#7B1FA2']}
                            style={styles.rollButtonGradient}
                        >
                            <Text style={styles.rollButtonText}>
                                {mode === 'dice' ? '🎲 Roll Once' : '🪙 Flip Once'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.multiRollRow}>
                        <TouchableOpacity
                            style={[styles.multiButton, { backgroundColor: themedColors.background.paper }]}
                            onPress={() => rollMultiple(10)}
                        >
                            <Text style={[styles.multiButtonText, { color: '#AB47BC' }]}>×10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.multiButton, { backgroundColor: themedColors.background.paper }]}
                            onPress={() => rollMultiple(50)}
                        >
                            <Text style={[styles.multiButtonText, { color: '#AB47BC' }]}>×50</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.multiButton, { backgroundColor: themedColors.background.paper }]}
                            onPress={() => rollMultiple(100)}
                        >
                            <Text style={[styles.multiButtonText, { color: '#AB47BC' }]}>×100</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.resetButton, { backgroundColor: '#FF525220' }]}
                            onPress={reset}
                        >
                            <Ionicons name="refresh" size={20} color="#FF5252" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Statistics Card */}
                <View style={[styles.statsCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.statsTitle, { color: themedColors.text.primary }]}>
                        📊 Statistics
                    </Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#AB47BC' }]}>
                                {mode === 'dice' ? diceResults.length : coinResults.length}
                            </Text>
                            <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>
                                Total Trials
                            </Text>
                        </View>
                        {mode === 'dice' ? (
                            <>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color: '#00E676' }]}>
                                        {diceResults.length > 0
                                            ? (diceResults.reduce((a, b) => a + b, 0) / diceResults.length).toFixed(2)
                                            : '—'}
                                    </Text>
                                    <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>
                                        Mean (Exp: 3.5)
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color: '#FFD700' }]}>
                                        {coinResults.length > 0
                                            ? `${((coinFreq.heads / coinResults.length) * 100).toFixed(1)}%`
                                            : '—'}
                                    </Text>
                                    <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>
                                        Heads %
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color: '#C0C0C0' }]}>
                                        {coinResults.length > 0
                                            ? `${((coinFreq.tails / coinResults.length) * 100).toFixed(1)}%`
                                            : '—'}
                                    </Text>
                                    <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>
                                        Tails %
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Frequency Chart */}
                <View style={[styles.chartCard, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.chartTitle, { color: themedColors.text.primary }]}>
                        Frequency Distribution
                    </Text>
                    <Text style={[styles.chartSubtitle, { color: themedColors.text.secondary }]}>
                        Watch how results approach theoretical probability!
                    </Text>

                    {mode === 'dice' ? (
                        <View style={styles.chartContainer}>
                            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                                {diceFreq.map((freq, idx) => {
                                    const barHeight = (freq / maxDiceFreq) * (CHART_HEIGHT - 40);
                                    const x = (idx * (CHART_WIDTH / 6)) + (CHART_WIDTH / 12) - (BAR_WIDTH / 2);
                                    const y = CHART_HEIGHT - 30 - barHeight;
                                    const theoretical = (1 / 6) * diceResults.length;

                                    return (
                                        <G key={idx}>
                                            {/* Theoretical line */}
                                            <Line
                                                x1={x}
                                                y1={CHART_HEIGHT - 30 - (theoretical / maxDiceFreq) * (CHART_HEIGHT - 40)}
                                                x2={x + BAR_WIDTH}
                                                y2={CHART_HEIGHT - 30 - (theoretical / maxDiceFreq) * (CHART_HEIGHT - 40)}
                                                stroke="#00E676"
                                                strokeWidth={2}
                                                strokeDasharray="4,2"
                                            />
                                            {/* Actual bar */}
                                            <Rect
                                                x={x}
                                                y={y}
                                                width={BAR_WIDTH}
                                                height={barHeight}
                                                fill={`hsl(${280 - idx * 10}, 70%, 50%)`}
                                                rx={4}
                                            />
                                            {/* Value label */}
                                            <SvgText
                                                x={x + BAR_WIDTH / 2}
                                                y={y - 5}
                                                textAnchor="middle"
                                                fontSize={10}
                                                fill={themedColors.text.secondary}
                                            >
                                                {freq}
                                            </SvgText>
                                            {/* Dice label */}
                                            <SvgText
                                                x={x + BAR_WIDTH / 2}
                                                y={CHART_HEIGHT - 10}
                                                textAnchor="middle"
                                                fontSize={16}
                                            >
                                                {getDiceFace(idx + 1)}
                                            </SvgText>
                                        </G>
                                    );
                                })}
                            </Svg>
                        </View>
                    ) : (
                        <View style={styles.coinChart}>
                            <View style={styles.coinBar}>
                                <View style={[
                                    styles.coinBarFill,
                                    {
                                        width: `${coinResults.length > 0 ? (coinFreq.heads / coinResults.length) * 100 : 50}%`,
                                        backgroundColor: '#FFD700'
                                    }
                                ]}>
                                    <Text style={styles.coinBarText}>Heads: {coinFreq.heads}</Text>
                                </View>
                                <View style={[
                                    styles.coinBarFill,
                                    {
                                        width: `${coinResults.length > 0 ? (coinFreq.tails / coinResults.length) * 100 : 50}%`,
                                        backgroundColor: '#C0C0C0'
                                    }
                                ]}>
                                    <Text style={[styles.coinBarText, { color: '#333' }]}>Tails: {coinFreq.tails}</Text>
                                </View>
                            </View>
                            <View style={styles.theoreticalLine}>
                                <View style={styles.theoreticalMarker} />
                                <Text style={[styles.theoreticalText, { color: '#00E676' }]}>
                                    50% Theoretical
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Law of Large Numbers Insight */}
                <View style={[styles.insightCard, { backgroundColor: '#AB47BC15' }]}>
                    <Ionicons name="bulb" size={24} color="#AB47BC" />
                    <View style={styles.insightContent}>
                        <Text style={[styles.insightTitle, { color: '#AB47BC' }]}>
                            Law of Large Numbers
                        </Text>
                        <Text style={[styles.insightText, { color: themedColors.text.secondary }]}>
                            As you increase trials, experimental probability gets closer to theoretical probability.
                            {mode === 'dice'
                                ? ' Each dice face should approach 16.67% (1/6).'
                                : ' Heads and tails should each approach 50%.'}
                        </Text>
                    </View>
                </View>

                {/* Knowledge Check Button */}
                <TouchableOpacity
                    style={[
                        styles.quizButton,
                        { backgroundColor: canTakeQuiz ? '#AB47BC' : themedColors.background.subtle },
                    ]}
                    onPress={() => canTakeQuiz && setShowQuiz(true)}
                    disabled={!canTakeQuiz}
                >
                    <Ionicons
                        name="school"
                        size={24}
                        color={canTakeQuiz ? '#FFF' : themedColors.text.disabled}
                    />
                    <Text
                        style={[
                            styles.quizButtonText,
                            { color: canTakeQuiz ? '#FFF' : themedColors.text.disabled },
                        ]}
                    >
                        {canTakeQuiz ? 'Take Knowledge Check' : `Run ${20 - rollCount} more trials to unlock`}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Knowledge Check Modal */}
            {showQuiz && (
                <KnowledgeCheck
                    simulation={simulation}
                    onClose={() => setShowQuiz(false)}
                    onComplete={() => setShowQuiz(false)}
                />
            )}
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
    modeSelector: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 6,
        marginBottom: 16,
    },
    modeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    modeButtonActive: {
        backgroundColor: '#AB47BC',
    },
    modeEmoji: {
        fontSize: 20,
    },
    modeText: {
        fontSize: 15,
        fontWeight: '600',
    },
    resultCard: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        marginBottom: 16,
    },
    diceDisplay: {
        alignItems: 'center',
    },
    diceValue: {
        fontSize: 80,
    },
    coinDisplay: {
        alignItems: 'center',
    },
    coin: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#87731050',
    },
    coinText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#5D4037',
    },
    resultLabel: {
        fontSize: 14,
        marginTop: 12,
    },
    actionButtons: {
        marginBottom: 16,
    },
    rollButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
    },
    rollButtonDisabled: {
        opacity: 0.6,
    },
    rollButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    rollButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    multiRollRow: {
        flexDirection: 'row',
        gap: 10,
    },
    multiButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    multiButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
    resetButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        justifyContent: 'center',
    },
    statsCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
        marginTop: 4,
        textAlign: 'center',
    },
    chartCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    chartSubtitle: {
        fontSize: 12,
        marginTop: 2,
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
    },
    coinChart: {
        marginTop: 8,
    },
    coinBar: {
        flexDirection: 'row',
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
    },
    coinBarFill: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinBarText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 13,
    },
    theoreticalLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        gap: 8,
    },
    theoreticalMarker: {
        width: 20,
        height: 3,
        backgroundColor: '#00E676',
    },
    theoreticalText: {
        fontSize: 12,
        fontWeight: '500',
    },
    insightCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        gap: 12,
    },
    insightContent: {
        flex: 1,
    },
    insightTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    insightText: {
        fontSize: 13,
        lineHeight: 18,
    },
    quizButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 10,
    },
    quizButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});

export default ProbabilitySimulatorScreen;
