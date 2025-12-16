// SpendingChart Component - Monthly spending visualization
// Animated bar chart using react-native-svg

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 180;
const BAR_WIDTH = 40;

interface MonthlyData {
    month: string;
    amount: number;
}

interface SpendingChartProps {
    data: MonthlyData[];
}

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
    const themedColors = useThemedColors();
    const animationValues = useRef(
        data.map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        // Animate bars on mount
        const animations = data.map((_, index) =>
            Animated.timing(animationValues[index], {
                toValue: 1,
                duration: 800,
                delay: index * 100,
                useNativeDriver: false,
            })
        );

        Animated.parallel(animations).start();
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: themedColors.text.secondary }]}>
                    No spending data available
                </Text>
            </View>
        );
    }

    const maxAmount = Math.max(...data.map(d => d.amount), 1);
    const barSpacing = (CHART_WIDTH - (data.length * BAR_WIDTH)) / (data.length + 1);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: themedColors.text.primary }]}>
                Monthly Spending
            </Text>

            <View style={styles.chartContainer}>
                <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                    {data.map((item, index) => {
                        const barHeight = (item.amount / maxAmount) * (CHART_HEIGHT - 40);
                        const x = barSpacing + index * (BAR_WIDTH + barSpacing);
                        const y = CHART_HEIGHT - barHeight - 20;

                        const animatedHeight = animationValues[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, barHeight],
                        });

                        return (
                            <React.Fragment key={index}>
                                {/* Bar */}
                                <AnimatedRect
                                    x={x}
                                    y={y}
                                    width={BAR_WIDTH}
                                    height={animatedHeight}
                                    fill={Colors.primary.main}
                                    rx={8}
                                    opacity={0.8}
                                />

                                {/* Month label */}
                                <SvgText
                                    x={x + BAR_WIDTH / 2}
                                    y={CHART_HEIGHT - 5}
                                    fontSize="11"
                                    fill={themedColors.text.secondary}
                                    textAnchor="middle"
                                >
                                    {item.month}
                                </SvgText>

                                {/* Amount label */}
                                {item.amount > 0 && (
                                    <SvgText
                                        x={x + BAR_WIDTH / 2}
                                        y={y - 5}
                                        fontSize="12"
                                        fill={Colors.primary.main}
                                        fontWeight="600"
                                        textAnchor="middle"
                                    >
                                        ${item.amount}
                                    </SvgText>
                                )}
                            </React.Fragment>
                        );
                    })}
                </Svg>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: Colors.primary.main }]} />
                    <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>
                        Total Spent (USD)
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background.paper,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    emptyContainer: {
        height: CHART_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
    },
});

export default SpendingChart;
