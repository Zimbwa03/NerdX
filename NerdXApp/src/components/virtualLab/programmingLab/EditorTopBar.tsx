// Top bar for Programming Lab editor: language, file name, actions

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../../theme/useThemedStyles';
import type { ProgrammingLanguage } from '../../../types/programmingLabTypes';

const LANGUAGE_LABELS: Record<ProgrammingLanguage, string> = {
    python: 'Python',
    vbnet: 'VB.NET',
    java: 'Java',
};

export interface EditorTopBarProps {
    language: ProgrammingLanguage;
    fileName: string;
    onLanguageChange?: (language: ProgrammingLanguage) => void;
    onFileNew?: () => void;
    onFileSave?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onBack?: () => void;
}

const EditorTopBar: React.FC<EditorTopBarProps> = ({
    language,
    fileName,
    onLanguageChange,
    onFileNew,
    onFileSave,
    onUndo,
    onRedo,
    onBack,
}) => {
    const themedColors = useThemedColors();

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.paper, borderBottomColor: themedColors.border?.light ?? themedColors.text.secondary + '20' }]}>
            <View style={styles.row}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.iconButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="arrow-back" size={22} color={themedColors.text.primary} />
                    </TouchableOpacity>
                )}
                <View style={styles.titleArea}>
                    <Text style={[styles.fileName, { color: themedColors.text.primary }]} numberOfLines={1}>
                        {fileName}
                    </Text>
                    <Text style={[styles.languageLabel, { color: themedColors.text.secondary }]}>
                        {LANGUAGE_LABELS[language]}
                    </Text>
                </View>
                <View style={styles.actions}>
                    {onUndo && (
                        <TouchableOpacity onPress={onUndo} style={styles.iconButton}>
                            <Ionicons name="arrow-undo-outline" size={20} color={themedColors.text.primary} />
                        </TouchableOpacity>
                    )}
                    {onRedo && (
                        <TouchableOpacity onPress={onRedo} style={styles.iconButton}>
                            <Ionicons name="arrow-redo-outline" size={20} color={themedColors.text.primary} />
                        </TouchableOpacity>
                    )}
                    {onFileNew && (
                        <TouchableOpacity onPress={onFileNew} style={styles.iconButton}>
                            <Ionicons name="document-outline" size={20} color={themedColors.text.primary} />
                        </TouchableOpacity>
                    )}
                    {onFileSave && (
                        <TouchableOpacity onPress={onFileSave} style={styles.iconButton}>
                            <Ionicons name="save-outline" size={20} color={themedColors.text.primary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderBottomWidth: 1,
        paddingTop: Platform.OS === 'ios' ? 44 : 12,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleArea: {
        flex: 1,
        marginLeft: 8,
        minWidth: 0,
    },
    fileName: {
        fontSize: 15,
        fontWeight: '600',
    },
    languageLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    iconButton: {
        padding: 8,
    },
});

export default EditorTopBar;
