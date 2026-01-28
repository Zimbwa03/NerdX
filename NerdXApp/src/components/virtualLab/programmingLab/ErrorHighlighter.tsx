// Error list panel for Programming Lab - syntax errors and warnings

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SyntaxError as SyntaxErrorType } from '../../../types/programmingLabTypes';
import { useThemedColors } from '../../../theme/useThemedStyles';

export interface ErrorHighlighterProps {
    errors: SyntaxErrorType[];
    onErrorClick?: (error: SyntaxErrorType) => void;
}

const ErrorHighlighter: React.FC<ErrorHighlighterProps> = ({ errors, onErrorClick }) => {
    const themedColors = useThemedColors();

    if (errors.length === 0) {
        return (
            <View style={[styles.noErrors, { backgroundColor: themedColors.background.subtle }]}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={[styles.noErrorsText, { color: themedColors.text.secondary }]}>
                    No errors detected
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.errorList, { backgroundColor: themedColors.background.paper }]}
            contentContainerStyle={styles.errorListContent}
            nestedScrollEnabled
        >
            {errors.map((error, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.errorItem,
                        { borderColor: themedColors.border?.light ?? themedColors.text.secondary + '30' },
                        error.severity === 'error' && styles.errorItemError,
                        error.severity === 'warning' && styles.errorItemWarning,
                    ]}
                    onPress={() => onErrorClick?.(error)}
                    activeOpacity={0.7}
                >
                    <View style={styles.errorIconAndMessage}>
                        <View style={styles.errorIcon}>
                            {error.severity === 'error' ? (
                                <Ionicons name="close-circle" size={18} color="#E74C3C" />
                            ) : (
                                <Ionicons name="warning" size={18} color="#FF9800" />
                            )}
                        </View>
                        <View style={styles.errorTextContainer}>
                            <Text style={[styles.errorLine, { color: themedColors.text.secondary }]}>
                                Line {error.line}
                            </Text>
                            <Text style={[styles.errorMessage, { color: themedColors.text.primary }]}>
                                {error.message}
                            </Text>
                            {error.suggestions && error.suggestions.length > 0 && (
                                <TouchableOpacity style={styles.suggestionButton}>
                                    <Text style={[styles.suggestionText, { color: themedColors.primary.main }]}>
                                        Suggestion: {error.suggestions[0]}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    noErrors: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 8,
        borderRadius: 8,
    },
    noErrorsText: {
        fontSize: 13,
    },
    errorList: {
        maxHeight: 120,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
    },
    errorListContent: {
        padding: 8,
        gap: 6,
    },
    errorItem: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 8,
        borderLeftWidth: 3,
    },
    errorItemError: {
        borderLeftColor: '#E74C3C',
        backgroundColor: 'rgba(231, 76, 60, 0.08)',
    },
    errorItemWarning: {
        borderLeftColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.08)',
    },
    errorIconAndMessage: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        flex: 1,
    },
    errorIcon: {
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorTextContainer: {
        flex: 1,
    },
    errorLine: {
        fontSize: 12,
        marginBottom: 2,
    },
    errorMessage: {
        fontSize: 13,
    },
    suggestionButton: {
        marginTop: 6,
    },
    suggestionText: {
        fontSize: 12,
    },
});

export default ErrorHighlighter;
