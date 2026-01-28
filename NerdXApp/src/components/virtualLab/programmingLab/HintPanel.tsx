// Stub: Hints panel - Part 6 curriculum will provide hints

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../../theme/useThemedStyles';

const HintPanel: React.FC = () => {
    const themedColors = useThemedColors();

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.paper }]}>
            <Ionicons name="bulb-outline" size={40} color={themedColors.warning?.main ?? '#FF9800'} />
            <Text style={[styles.title, { color: themedColors.text.primary }]}>Hints</Text>
            <Text style={[styles.subtitle, { color: themedColors.text.secondary }]}>
                Exercise hints will appear here when you open an exercise (Part 6).
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

export default HintPanel;
