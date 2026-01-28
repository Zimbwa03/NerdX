// Floating action buttons for Programming Lab editor

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../../theme/useThemedStyles';

export interface FloatingAction {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

export interface FloatingActionMenuProps {
    actions: FloatingAction[];
}

const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({ actions }) => {
    const themedColors = useThemedColors();
    const [expanded, setExpanded] = useState(false);

    if (actions.length === 0) return null;

    const primary = actions[0];
    const rest = actions.slice(1);

    return (
        <View style={styles.container} pointerEvents="box-none">
            {expanded && rest.length > 0 && (
                <View style={[styles.expandedRow, { backgroundColor: themedColors.background.paper }]}>
                    {rest.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            style={[styles.miniButton, { backgroundColor: themedColors.primary.main }]}
                            onPress={() => {
                                action.onPress();
                                setExpanded(false);
                            }}
                        >
                            <Ionicons name={action.icon} size={22} color="#FFF" />
                            <Text style={styles.miniLabel} numberOfLines={1}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: themedColors.primary.main }]}
                onPress={() => (rest.length > 0 ? setExpanded(!expanded) : primary.onPress())}
                activeOpacity={0.8}
            >
                <Ionicons name={primary.icon} size={26} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        right: 16,
        alignItems: 'flex-end',
    },
    expandedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    miniButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
    },
    miniLabel: {
        color: '#FFF',
        fontSize: 12,
        maxWidth: 80,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
    },
});

export default FloatingActionMenu;
