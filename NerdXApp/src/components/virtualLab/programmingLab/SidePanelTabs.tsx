// Tab navigator for side panel: AI Assistant, Hints, Docs

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../../theme/useThemedStyles';

export type SidePanelTabId = 'ai' | 'hints' | 'docs';

export interface SidePanelTab {
    id: SidePanelTabId;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const TABS: SidePanelTab[] = [
    { id: 'ai', label: 'AI', icon: 'sparkles-outline' },
    { id: 'hints', label: 'Hints', icon: 'bulb-outline' },
    { id: 'docs', label: 'Docs', icon: 'book-outline' },
];

export interface SidePanelTabsProps {
    activeTab: SidePanelTabId;
    onTabChange: (tab: SidePanelTabId) => void;
    children: React.ReactNode;
}

const SidePanelTabs: React.FC<SidePanelTabsProps> = ({ activeTab, onTabChange, children }) => {
    const themedColors = useThemedColors();

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.paper }]}>
            <View style={[styles.tabBar, { borderBottomColor: themedColors.border?.light ?? themedColors.text.secondary + '20' }]}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[
                            styles.tab,
                            activeTab === tab.id && { borderBottomColor: themedColors.primary.main, borderBottomWidth: 2 },
                        ]}
                        onPress={() => onTabChange(tab.id)}
                    >
                        <Ionicons
                            name={tab.icon}
                            size={18}
                            color={activeTab === tab.id ? themedColors.primary.main : themedColors.text.secondary}
                        />
                        <Text
                            style={[
                                styles.tabLabel,
                                { color: activeTab === tab.id ? themedColors.primary.main : themedColors.text.secondary },
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: 160,
        maxWidth: 220,
    },
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 4,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    content: {
        flex: 1,
    },
});

export default SidePanelTabs;
export { TABS };
