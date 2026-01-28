// Stub: Documentation panel - language docs (Part 6 or later)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../../theme/useThemedStyles';

const DocumentationPanel: React.FC = () => {
    const themedColors = useThemedColors();

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.paper }]}>
            <Ionicons name="book-outline" size={40} color={themedColors.primary.main} />
            <Text style={[styles.title, { color: themedColors.text.primary }]}>Documentation</Text>
            <Text style={[styles.subtitle, { color: themedColors.text.secondary }]}>
                Language reference and keyword docs coming soon.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
    },
    subtitle: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
});

export default DocumentationPanel;
