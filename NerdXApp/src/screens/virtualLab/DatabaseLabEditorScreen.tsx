// Virtual Database Lab - SQL editor and execution (ZIMSEC / Cambridge aligned)

import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    useWindowDimensions,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemedColors } from '../../theme/useThemedStyles';
import EditorTopBar from '../../components/virtualLab/programmingLab/EditorTopBar';
import LineNumberDisplay from '../../components/virtualLab/programmingLab/LineNumberDisplay';
import { FloatingActionMenu, AIAssistantPanel } from '../../components/virtualLab/programmingLab';
import { Modal, ModalOptionCard } from '../../components/Modal';
import { databaseLabApi, type DatabaseLabExecuteResult } from '../../services/api/databaseLabApi';
import { DATABASE_LAB_TEMPLATES } from '../../data/virtualLab/databaseLab/templates';
import { gamificationService } from '../../services/GamificationService';

const DEFAULT_SQL = `-- Database Lab: Write SQL and tap Run
-- Example: create a table and query it

CREATE TABLE example (
  id INTEGER PRIMARY KEY,
  name TEXT
);

INSERT INTO example (id, name) VALUES (1, 'First');
INSERT INTO example (id, name) VALUES (2, 'Second');

SELECT * FROM example;
`;

const DatabaseLabEditorScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const colors = useThemedColors();
    const { width } = useWindowDimensions();

    const [sql, setSql] = useState(DEFAULT_SQL);
    const [result, setResult] = useState<DatabaseLabExecuteResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [templatesVisible, setTemplatesVisible] = useState(false);
    const [aiVisible, setAiVisible] = useState(false);

    const lineCount = Math.max(1, sql.split('\n').length);
    const isWideLayout = width >= 900;

    const handleRun = useCallback(async () => {
        const trimmed = sql.trim();
        if (!trimmed) return;
        setIsRunning(true);
        setResult(null);
        try {
            const data = await databaseLabApi.executeSql(trimmed);
            setResult(data);
            if (!data.error) {
                gamificationService.logLabCompleted(80).catch(() => {});
            }
        } catch (e: any) {
            setResult({ error: e?.message || 'Failed to run SQL. Check your connection.' });
        } finally {
            setIsRunning(false);
        }
    }, [sql]);

    const handleApplyTemplate = useCallback(async (templateId: string) => {
        const t = DATABASE_LAB_TEMPLATES.find((x) => x.id === templateId);
        if (t) {
            setSql(t.sql);
            setTemplatesVisible(false);
            // Auto-run the template SQL to show results immediately
            const trimmed = t.sql.trim();
            if (trimmed) {
                setIsRunning(true);
                setResult(null);
                try {
                    const data = await databaseLabApi.executeSql(trimmed);
                    setResult(data);
                    if (!data.error) {
                        gamificationService.logLabCompleted(80).catch(() => {});
                    }
                } catch (e: any) {
                    setResult({ error: e?.message || 'Failed to run SQL. Check your connection.' });
                } finally {
                    setIsRunning(false);
                }
            }
        }
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                <EditorTopBar
                    language="python"
                    fileName="SQL"
                    onBack={() => navigation.goBack()}
                    onUndo={() => {}}
                    onRedo={() => {}}
                />

                <View style={[styles.titleRow, { borderBottomColor: colors.border?.light ?? colors.text.secondary + '20' }]}>
                    <Text style={[styles.labTitle, { color: colors.text.primary }]}>Database Lab</Text>
                    <Text style={[styles.hint, { color: colors.text.secondary }]}>
                        Create tables, run SELECT, INSERT, UPDATE, DELETE
                    </Text>
                </View>

                <View style={[styles.mainRow, isWideLayout && styles.mainRowWide]}>
                    <View style={styles.editorColumn}>
                        <View style={[styles.editorLabel, { backgroundColor: colors.background.subtle ?? '#1E1E1E' }]}>
                            <Text style={[styles.editorLabelText, { color: colors.text.secondary }]}>SQL</Text>
                        </View>
                        <View style={[styles.editorWrapper, { backgroundColor: colors.background.subtle ?? '#1E1E1E' }]}>
                            <ScrollView
                                style={styles.editorScroll}
                                contentContainerStyle={[styles.editorScrollContent, { minHeight: Math.max(200, lineCount * 22) }]}
                                showsVerticalScrollIndicator
                                keyboardShouldPersistTaps="handled"
                            >
                                <LineNumberDisplay
                                    lineCount={lineCount}
                                    currentLine={1}
                                    breakpoints={new Set()}
                                    fontSize={14}
                                    scrollable={false}
                                />
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        {
                                            color: colors.text.primary,
                                            backgroundColor: 'transparent',
                                            fontSize: 14,
                                            minHeight: Math.max(200, lineCount * 22),
                                        },
                                    ]}
                                    value={sql}
                                    onChangeText={setSql}
                                    multiline
                                    placeholder="Write your SQL here..."
                                    placeholderTextColor={colors.text.secondary}
                                    spellCheck={false}
                                    autoCapitalize="none"
                                />
                            </ScrollView>
                        </View>
                    </View>

                    <View style={[styles.resultsColumn, !isWideLayout && styles.resultsColumnStacked]}>
                        <Text style={[styles.resultsTitle, { color: colors.text.secondary }]}>Results</Text>
                        <View style={[styles.resultsPanel, { backgroundColor: colors.background.paper ?? colors.background.default, borderColor: colors.border?.light ?? colors.text.secondary + '30' }]}>
                            {isRunning && (
                                <View style={styles.resultsLoading}>
                                    <ActivityIndicator size="large" color={colors.primary.main} />
                                    <Text style={[styles.resultsLoadingText, { color: colors.text.secondary }]}>Running SQL...</Text>
                                </View>
                            )}
                            {!isRunning && result?.error && (
                                <Text style={[styles.errorText, { color: colors.error?.main ?? '#d32f2f' }]}>{result.error}</Text>
                            )}
                            {!isRunning && result?.message && !result.error && (
                                <Text style={[styles.messageText, { color: colors.text.primary }]}>{result.message}</Text>
                            )}
                            {!isRunning && result?.columns && result?.rows && result.rows.length >= 0 && (
                                <ScrollView horizontal style={styles.tableScroll} showsHorizontalScrollIndicator>
                                    <View style={styles.table}>
                                        <View style={[styles.tableHeaderRow, { borderBottomColor: colors.border?.light ?? colors.text.secondary + '40' }]}>
                                            {result.columns.map((col, i) => (
                                                <Text key={i} style={[styles.tableHeaderCell, { color: colors.text.primary }]} numberOfLines={1}>
                                                    {col}
                                                </Text>
                                            ))}
                                        </View>
                                        {result.rows.map((row, ri) => (
                                            <View
                                                key={ri}
                                                style={[
                                                    styles.tableRow,
                                                    { borderBottomColor: colors.border?.light ?? colors.text.secondary + '20' },
                                                ]}
                                            >
                                                {row.map((cell, ci) => (
                                                    <Text
                                                        key={ci}
                                                        style={[styles.tableCell, { color: colors.text.primary }]}
                                                        numberOfLines={1}
                                                    >
                                                        {cell != null ? String(cell) : 'NULL'}
                                                    </Text>
                                                ))}
                                            </View>
                                        ))}
                                        {result.rows.length === 0 && (
                                            <Text style={[styles.emptyRows, { color: colors.text.secondary }]}>0 rows</Text>
                                        )}
                                    </View>
                                </ScrollView>
                            )}
                            {!isRunning && !result && (
                                <Text style={[styles.placeholderResult, { color: colors.text.secondary }]}>
                                    Tap Run to execute your SQL. Results will appear here.
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                <FloatingActionMenu
                    actions={[
                        { id: 'run', label: 'Run', icon: 'play', onPress: handleRun },
                        { id: 'templates', label: 'Templates', icon: 'list', onPress: () => setTemplatesVisible(true) },
                        { id: 'ai-help', label: 'AI Help', icon: 'sparkles', onPress: () => setAiVisible(true) },
                    ]}
                />

                <Modal visible={templatesVisible} onClose={() => setTemplatesVisible(false)} title="Sample schemas">
                    {DATABASE_LAB_TEMPLATES.map((t) => (
                        <ModalOptionCard
                            key={t.id}
                            icon="server-outline"
                            title={t.title}
                            description={t.description}
                            onPress={() => handleApplyTemplate(t.id)}
                        />
                    ))}
                </Modal>

                <Modal visible={aiVisible} onClose={() => setAiVisible(false)} title="AI Database Tutor">
                    <View style={{ height: 420 }}>
                        <AIAssistantPanel
                            language="SQL"
                            code={sql}
                            userLevel="a-level"
                            lab="database"
                        />
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    flex: { flex: 1 },
    titleRow: {
        flexDirection: 'column',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    labTitle: { fontSize: 18, fontWeight: '600' },
    hint: { fontSize: 12, marginTop: 4 },
    mainRow: { flex: 1, flexDirection: 'column' },
    mainRowWide: { flexDirection: 'row' },
    editorColumn: { flex: 1, minWidth: 0 },
    editorLabel: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    editorLabelText: { fontSize: 12, fontWeight: '600' },
    editorWrapper: { flex: 1, minHeight: 200 },
    editorScroll: { flex: 1 },
    editorScrollContent: { flexDirection: 'row' },
    textInput: {
        flex: 1,
        padding: 8,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        textAlignVertical: 'top',
    },
    resultsColumn: { flex: 1, minHeight: 220 },
    resultsColumnStacked: { borderTopWidth: 1 },
    resultsTitle: {
        fontSize: 13,
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 4,
        fontWeight: '500',
    },
    resultsPanel: {
        flex: 1,
        marginHorizontal: 12,
        marginBottom: 12,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 120,
    },
    resultsLoading: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
    resultsLoadingText: { marginTop: 8, fontSize: 13 },
    errorText: { fontSize: 14 },
    messageText: { fontSize: 14 },
    placeholderResult: { fontSize: 13 },
    tableScroll: { flex: 1 },
    table: { minWidth: 200 },
    tableHeaderRow: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    tableHeaderCell: {
        fontSize: 13,
        fontWeight: '600',
        minWidth: 80,
        marginRight: 12,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    tableCell: {
        fontSize: 13,
        minWidth: 80,
        marginRight: 12,
    },
    emptyRows: { fontSize: 13, padding: 8 },
});

export default DatabaseLabEditorScreen;
