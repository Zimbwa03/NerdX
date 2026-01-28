// Line numbers column for Programming Lab editor

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemedColors } from '../../../theme/useThemedStyles';

export interface LineNumberDisplayProps {
    lineCount: number;
    currentLine?: number;
    breakpoints?: Set<number>;
    onLineClick?: (line: number) => void;
    fontSize?: number;
    /** When false, render a View instead of ScrollView so parent ScrollView can scroll both. */
    scrollable?: boolean;
}

const LineNumberDisplay: React.FC<LineNumberDisplayProps> = ({
    lineCount,
    currentLine = 1,
    breakpoints,
    fontSize = 14,
    scrollable = true,
}) => {
    const themedColors = useThemedColors();
    const lineNumbers = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);
    const width = String(Math.max(1, lineCount)).length * 10 + 16;

    const content = (
        <>
            {lineNumbers.map((num) => (
                    <View key={num} style={styles.lineRow}>
                        {breakpoints?.has(num) && (
                            <View style={[styles.breakpoint, { backgroundColor: themedColors.primary.main }]} />
                        )}
                        <Text
                            style={[
                                styles.lineNumber,
                                { fontSize, color: themedColors.text.secondary },
                                num === currentLine && { color: themedColors.primary.main, fontWeight: '600' },
                            ]}
                        >
                            {num}
                        </Text>
                    </View>
                ))}
        </>
    );

    return (
        <View style={[styles.container, { width, backgroundColor: themedColors.background.subtle ?? themedColors.background.paper, borderRightColor: themedColors.border?.light ?? themedColors.text.secondary + '20' }]}>
            {scrollable ? (
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {content}
                </ScrollView>
            ) : (
                <View style={[styles.content, { paddingBottom: 16 }]}>{content}</View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingRight: 8,
        borderRightWidth: 1,
        alignItems: 'flex-end',
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingBottom: 16,
    },
    lineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
        justifyContent: 'flex-end',
    },
    breakpoint: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    lineNumber: {
        minWidth: 24,
        textAlign: 'right',
    },
});

export default LineNumberDisplay;
