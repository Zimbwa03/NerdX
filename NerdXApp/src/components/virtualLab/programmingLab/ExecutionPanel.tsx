// Execution output panel for Programming Lab - Run, output, Clear

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../../theme/useThemedStyles';
import type { ExecutionResult } from '../../../types/programmingLabTypes';

export interface ExecutionPanelProps {
    isExecuting: boolean;
    executionResult: ExecutionResult | null;
    onRun?: () => void;
    onRunWithDebug?: () => void;
    onStop?: () => void;
    onClearOutput?: () => void;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
    isExecuting,
    executionResult,
    onRun,
    onRunWithDebug,
    onStop,
    onClearOutput,
}) => {
    const themedColors = useThemedColors();

    const hasOutput = executionResult && (executionResult.stdout || executionResult.stderr);

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.paper, borderTopColor: (themedColors as { border?: { light?: string } }).border?.light ?? themedColors.text.secondary + '20' }]}>
            <View style={[styles.toolbar, { borderBottomColor: (themedColors as { border?: { light?: string } }).border?.light ?? themedColors.text.secondary + '20' }]}>
                {onRun && (
                    <TouchableOpacity
                        style={[styles.runButton, { backgroundColor: themedColors.primary.main }]}
                        onPress={onRun}
                        disabled={isExecuting}
                    >
                        <Ionicons name="play" size={18} color="#FFF" />
                        <Text style={styles.runButtonText}>Run</Text>
                    </TouchableOpacity>
                )}
                {onRunWithDebug && (
                    <TouchableOpacity
                        style={[styles.secondaryButton, { borderColor: themedColors.primary.main }]}
                        onPress={onRunWithDebug}
                        disabled={isExecuting}
                    >
                        <Ionicons name="bug-outline" size={18} color={themedColors.primary.main} />
                        <Text style={[styles.secondaryButtonText, { color: themedColors.primary.main }]}>Debug</Text>
                    </TouchableOpacity>
                )}
                {isExecuting && onStop && (
                    <TouchableOpacity style={[styles.secondaryButton, { borderColor: (themedColors as { error?: { main?: string } }).error?.main ?? '#E74C3C' }]} onPress={onStop}>
                        <Ionicons name="stop" size={18} color={(themedColors as { error?: { main?: string } }).error?.main ?? '#E74C3C'} />
                        <Text style={[styles.secondaryButtonText, { color: (themedColors as { error?: { main?: string } }).error?.main ?? '#E74C3C' }]}>Stop</Text>
                    </TouchableOpacity>
                )}
                {onClearOutput && (
                    <TouchableOpacity style={styles.iconButton} onPress={onClearOutput}>
                        <Ionicons name="trash-outline" size={18} color={themedColors.text.secondary} />
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView
                style={[styles.outputArea, { backgroundColor: themedColors.background.subtle ?? '#1E1E1E' }]}
                contentContainerStyle={styles.outputContent}
                nestedScrollEnabled
            >
                {isExecuting && (
                    <Text style={[styles.outputText, { color: themedColors.text.secondary }]}>
                        Running...
                    </Text>
                )}
                {!isExecuting && !hasOutput && (
                    <Text style={[styles.placeholder, { color: themedColors.text.secondary }]}>
                        Output will appear here after you run your code.
                    </Text>
                )}
                {executionResult && (
                    <>
                        {executionResult.stdout ? (
                            <Text style={[styles.outputText, { color: '#D4D4D4' }]} selectable>
                                {executionResult.stdout}
                            </Text>
                        ) : null}
                        {executionResult.stderr ? (
                            <Text style={[styles.outputText, { color: '#E74C3C' }]} selectable>
                                {executionResult.stderr}
                            </Text>
                        ) : null}
                        {typeof executionResult.executionTime === 'number' && executionResult.executionTime >= 0 && (
                            <Text style={[styles.meta, { color: themedColors.text.secondary }]}>
                                Completed in {executionResult.executionTime} ms
                            </Text>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        maxHeight: 180,
    },
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
        gap: 8,
        borderBottomWidth: 1,
    },
    runButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    runButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        gap: 4,
    },
    secondaryButtonText: {
        fontSize: 13,
    },
    iconButton: {
        padding: 8,
        marginLeft: 'auto',
    },
    outputArea: {
        maxHeight: 140,
        padding: 8,
    },
    outputContent: {
        paddingBottom: 16,
    },
    outputText: {
        fontFamily: 'monospace',
        fontSize: 13,
        lineHeight: 20,
    },
    placeholder: {
        fontSize: 13,
        fontStyle: 'italic',
    },
    meta: {
        fontSize: 12,
        marginTop: 8,
    },
});

export default ExecutionPanel;
