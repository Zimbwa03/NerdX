// File tabs for multi-file editor in Programming Lab

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../../theme/useThemedStyles';
import type { CodeFile } from '../../../types/programmingLabTypes';

export interface FileTabBarProps {
    files: CodeFile[];
    activeFileId: string;
    onTabSelect: (fileId: string) => void;
    onTabClose: (fileId: string) => void;
    onTabNew?: () => void;
}

const FileTabBar: React.FC<FileTabBarProps> = ({
    files,
    activeFileId,
    onTabSelect,
    onTabClose,
    onTabNew,
}) => {
    const themedColors = useThemedColors();

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.subtle, borderBottomColor: themedColors.border?.light ?? themedColors.text.secondary + '20' }]}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsContent}
            >
                {files.map((file) => {
                    const isActive = file.id === activeFileId;
                    return (
                        <TouchableOpacity
                            key={file.id}
                            style={[
                                styles.tab,
                                { borderColor: themedColors.border?.light ?? themedColors.text.secondary + '30' },
                                isActive && { backgroundColor: themedColors.background.paper, borderBottomColor: 'transparent' },
                            ]}
                            onPress={() => onTabSelect(file.id)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.tabLabel,
                                    { color: isActive ? themedColors.text.primary : themedColors.text.secondary },
                                ]}
                                numberOfLines={1}
                            >
                                {file.name}
                            </Text>
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onTabClose(file.id);
                                }}
                                style={styles.closeButton}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Ionicons name="close" size={16} color={themedColors.text.secondary} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                })}
                {onTabNew && (
                    <TouchableOpacity onPress={onTabNew} style={styles.newTab}>
                        <Ionicons name="add" size={22} color={themedColors.primary.main} />
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tabsContent: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 4,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 2,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        maxWidth: 140,
    },
    tabLabel: {
        fontSize: 13,
        marginRight: 6,
    },
    closeButton: {
        padding: 2,
    },
    newTab: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FileTabBar;
