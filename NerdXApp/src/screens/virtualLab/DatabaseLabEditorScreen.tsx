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
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemedColors } from '../../theme/useThemedStyles';
import EditorTopBar from '../../components/virtualLab/programmingLab/EditorTopBar';
import LineNumberDisplay from '../../components/virtualLab/programmingLab/LineNumberDisplay';
import { FloatingActionMenu, AIAssistantPanel } from '../../components/virtualLab/programmingLab';
import { Modal, ModalOptionCard } from '../../components/Modal';
import { databaseLabApi, type DatabaseLabExecuteResult } from '../../services/api/databaseLabApi';
import { DATABASE_LAB_TEMPLATES } from '../../data/virtualLab/databaseLab/templates';
import { DATABASE_LAB_EXERCISES, type DatabaseLabExercise } from '../../data/virtualLab/databaseLab/exercises';
import { gamificationService } from '../../services/GamificationService';
import LearningPathStrip from '../../components/virtualLab/LearningPathStrip';

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

interface QueryHistoryItem {
    id: string;
    sql: string;
    status: 'success' | 'error';
    timestamp: Date;
    rowsAffected?: number;
}

const DatabaseLabEditorScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const colors = useThemedColors();
    const { width } = useWindowDimensions();

    const [sql, setSql] = useState(DEFAULT_SQL);
    const [result, setResult] = useState<DatabaseLabExecuteResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [templatesVisible, setTemplatesVisible] = useState(false);
    const [aiVisible, setAiVisible] = useState(false);
    const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState(
        DATABASE_LAB_EXERCISES[0]?.id ?? '',
    );
    const [hintIndex, setHintIndex] = useState(0);
    const [autoCheckResult, setAutoCheckResult] = useState<{ status: 'pass' | 'fail'; message: string } | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const lineCount = Math.max(1, sql.split('\n').length);
    const isWideLayout = width >= 900;

    const selectedExercise = DATABASE_LAB_EXERCISES.find((ex) => ex.id === selectedExerciseId);

    const addHistoryItem = useCallback((statement: string, outcome: DatabaseLabExecuteResult) => {
        const item: QueryHistoryItem = {
            id: `hist-${Date.now()}`,
            sql: statement.trim(),
            status: outcome.error ? 'error' : 'success',
            timestamp: new Date(),
            rowsAffected: outcome.rowsAffected ?? (outcome.rows ? outcome.rows.length : undefined),
        };
        setQueryHistory((prev) => [item, ...prev].slice(0, 6));
    }, []);

    const handleRun = useCallback(async () => {
        const trimmed = sql.trim();
        if (!trimmed) return;
        setIsRunning(true);
        setResult(null);
        setAutoCheckResult(null);
        try {
            const data = await databaseLabApi.executeSql(trimmed);
            setResult(data);
            addHistoryItem(trimmed, data);
            if (!data.error) {
                gamificationService.logLabCompleted(80).catch(() => {});
            }
        } catch (e: any) {
            const errorResult = { error: e?.message || 'Failed to run SQL. Check your connection.' };
            setResult(errorResult);
            addHistoryItem(trimmed, errorResult);
        } finally {
            setIsRunning(false);
        }
    }, [addHistoryItem, sql]);

    const handleApplyTemplate = useCallback(async (templateId: string) => {
        const t = DATABASE_LAB_TEMPLATES.find((x) => x.id === templateId);
        if (t) {
            setSql(t.sql);
            setTemplatesVisible(false);
            setAutoCheckResult(null);
            // Auto-run the template SQL to show results immediately
            const trimmed = t.sql.trim();
            if (trimmed) {
                setIsRunning(true);
                setResult(null);
                try {
                    const data = await databaseLabApi.executeSql(trimmed);
                    setResult(data);
                    addHistoryItem(trimmed, data);
                    if (!data.error) {
                        gamificationService.logLabCompleted(80).catch(() => {});
                    }
                } catch (e: any) {
                    const errorResult = { error: e?.message || 'Failed to run SQL. Check your connection.' };
                    setResult(errorResult);
                    addHistoryItem(trimmed, errorResult);
                } finally {
                    setIsRunning(false);
                }
            }
        }
    }, [addHistoryItem]);

    const toggleStep = useCallback((stepId: string) => {
        setCompletedSteps((prev) =>
            prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId],
        );
    }, []);

    const quickSnippets = [
        { id: 'select', label: 'SELECT', snippet: 'SELECT * FROM table_name;' },
        { id: 'where', label: 'WHERE', snippet: 'SELECT * FROM table_name WHERE condition;' },
        { id: 'join', label: 'JOIN', snippet: 'SELECT * FROM a JOIN b ON a.id = b.a_id;' },
        { id: 'group', label: 'GROUP BY', snippet: 'SELECT column, COUNT(*) FROM table_name GROUP BY column;' },
        { id: 'update', label: 'UPDATE', snippet: 'UPDATE table_name SET column = value WHERE condition;' },
    ];

    const handleInsertSnippet = useCallback(
        (snippet: string) => {
            const next = sql ? `${sql}\n\n${snippet}` : snippet;
            setSql(next);
            setAutoCheckResult(null);
        },
        [sql],
    );

    const handleSqlChange = useCallback((text: string) => {
        setSql(text);
        setAutoCheckResult(null);
    }, []);

    const handleLoadExercise = useCallback((exercise: DatabaseLabExercise) => {
        setSql(exercise.starterSql);
        setHintIndex(0);
        setAutoCheckResult(null);
    }, []);

    const normalizeValue = (value: any) => {
        if (value === null || value === undefined) return 'NULL';
        if (typeof value === 'number') return Number.isFinite(value) ? String(Number(value.toFixed(6))) : String(value);
        return String(value).trim().toLowerCase();
    };

    const normalizeRow = (row: any[]) => row.map(normalizeValue);

    const compareRows = (expected: any[][], actual: any[][], orderMatters: boolean) => {
        const expectedRows = expected.map(normalizeRow);
        const actualRows = actual.map(normalizeRow);
        if (!orderMatters) {
            const sortKey = (row: string[]) => row.join('|');
            expectedRows.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
            actualRows.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
        }
        if (expectedRows.length !== actualRows.length) {
            return { equal: false, message: `Expected ${expectedRows.length} rows but got ${actualRows.length}.` };
        }
        for (let i = 0; i < expectedRows.length; i += 1) {
            const exp = expectedRows[i];
            const act = actualRows[i];
            if (exp.length !== act.length) {
                return { equal: false, message: 'Column count does not match expected output.' };
            }
            for (let j = 0; j < exp.length; j += 1) {
                if (exp[j] !== act[j]) {
                    return { equal: false, message: 'Row values do not match expected output.' };
                }
            }
        }
        return { equal: true, message: 'Results match expected output.' };
    };

    const evaluateExerciseResult = (exercise: DatabaseLabExercise, data: DatabaseLabExecuteResult) => {
        if (data.error) {
            return { status: 'fail' as const, message: data.error };
        }
        if (!data.columns || !data.rows) {
            return { status: 'fail' as const, message: 'No result rows returned. Make sure your query is a SELECT.' };
        }
        if (exercise.expected.columns) {
            const expectedCols = exercise.expected.columns.map((c) => c.toLowerCase());
            const actualCols = data.columns.map((c) => c.toLowerCase());
            if (expectedCols.length !== actualCols.length) {
                return { status: 'fail' as const, message: 'Column count does not match expected output.' };
            }
            for (let i = 0; i < expectedCols.length; i += 1) {
                if (expectedCols[i] !== actualCols[i]) {
                    return { status: 'fail' as const, message: 'Column names do not match expected output.' };
                }
            }
        }
        if (exercise.expected.rowCount !== undefined && data.rows.length !== exercise.expected.rowCount) {
            return {
                status: 'fail' as const,
                message: `Expected ${exercise.expected.rowCount} rows but got ${data.rows.length}.`,
            };
        }
        if (exercise.expected.rows) {
            const comparison = compareRows(
                exercise.expected.rows,
                data.rows,
                exercise.expected.orderMatters ?? false,
            );
            if (!comparison.equal) {
                return { status: 'fail' as const, message: comparison.message };
            }
        }
        return { status: 'pass' as const, message: 'Great job! Your query matches the expected output.' };
    };

    const handleAutoCheck = useCallback(async () => {
        if (!selectedExercise) return;
        const trimmed = sql.trim();
        if (!trimmed) return;
        setIsChecking(true);
        setAutoCheckResult(null);
        try {
            const combinedSql = `${selectedExercise.setupSql}\n${trimmed}`;
            const data = await databaseLabApi.executeSql(combinedSql);
            setResult(data);
            addHistoryItem(trimmed, data);
            const evaluation = evaluateExerciseResult(selectedExercise, data);
            setAutoCheckResult(evaluation);
        } catch (e: any) {
            const message = e?.message || 'Failed to check SQL. Check your connection.';
            setAutoCheckResult({ status: 'fail', message });
        } finally {
            setIsChecking(false);
        }
    }, [addHistoryItem, selectedExercise, sql]);

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

                <LearningPathStrip
                    title="Database Learning Path"
                    subtitle="Design schema, query data, and analyze results."
                    steps={[
                        { id: 'model', title: 'Model', description: 'Define tables and keys.' },
                        { id: 'query', title: 'Query', description: 'Write SELECT and filters.' },
                        { id: 'refine', title: 'Refine', description: 'Join tables and clean results.' },
                    ]}
                    completedSteps={completedSteps}
                    onToggleStep={toggleStep}
                    accentColor={colors.primary.main}
                />

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
                                    onChangeText={handleSqlChange}
                                    multiline
                                    placeholder="Write your SQL here..."
                                    placeholderTextColor={colors.text.secondary}
                                    spellCheck={false}
                                    autoCapitalize="none"
                                />
                            </ScrollView>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.resultsColumn,
                            !isWideLayout && [styles.resultsColumnStacked, { borderTopColor: colors.border?.light ?? colors.text.secondary + '20' }],
                        ]}
                    >
                        <View style={styles.exercisePanel}>
                            <Text style={[styles.utilityTitle, { color: colors.text.secondary }]}>Exercises</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exerciseRow}>
                                {DATABASE_LAB_EXERCISES.map((exercise) => {
                                    const isActive = exercise.id === selectedExerciseId;
                                    return (
                                        <TouchableOpacity
                                            key={exercise.id}
                                            style={[
                                                styles.exerciseChip,
                                                {
                                                    borderColor: colors.border?.light ?? colors.text.secondary + '30',
                                                    backgroundColor: isActive ? colors.primary.main : 'transparent',
                                                },
                                            ]}
                                            onPress={() => {
                                                setSelectedExerciseId(exercise.id);
                                                setHintIndex(0);
                                                setAutoCheckResult(null);
                                            }}
                                        >
                                            <Text style={[styles.exerciseChipText, { color: isActive ? '#fff' : colors.text.primary }]}>
                                                {exercise.title}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            {selectedExercise && (
                                <View style={[styles.exerciseDetail, { borderColor: colors.border?.light ?? colors.text.secondary + '20' }]}>
                                    <View style={styles.exerciseHeader}>
                                        <View style={styles.exerciseHeaderText}>
                                            <Text style={[styles.exerciseTitle, { color: colors.text.primary }]}>
                                                {selectedExercise.title}
                                            </Text>
                                            <Text style={[styles.exerciseDesc, { color: colors.text.secondary }]}>
                                                {selectedExercise.description}
                                            </Text>
                                        </View>
                                        <View style={[styles.exerciseBadge, { borderColor: colors.primary.main }]}>
                                            <Text style={[styles.exerciseBadgeText, { color: colors.primary.main }]}>
                                                {selectedExercise.difficulty.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.exercisePrompt, { color: colors.text.primary }]}>
                                        {selectedExercise.prompt}
                                    </Text>
                                    <View style={styles.exerciseButtons}>
                                        <TouchableOpacity
                                            style={[styles.exerciseButton, { backgroundColor: colors.primary.main }]}
                                            onPress={() => handleLoadExercise(selectedExercise)}
                                        >
                                            <Text style={styles.exerciseButtonText}>Load Starter</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.exerciseButton,
                                                { backgroundColor: isChecking ? '#9E9E9E' : '#2E7D32' },
                                            ]}
                                            onPress={handleAutoCheck}
                                            disabled={isChecking}
                                        >
                                            <Text style={styles.exerciseButtonText}>
                                                {isChecking ? 'Checking...' : 'Auto-check'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.hintPanel}>
                                        <Text style={[styles.hintTitle, { color: colors.text.secondary }]}>Hints</Text>
                                        {selectedExercise.hints.slice(0, hintIndex).map((hint, index) => (
                                            <View key={`${selectedExercise.id}-hint-${index}`} style={styles.hintRow}>
                                                <Text style={[styles.hintText, { color: colors.text.primary }]}>{hint}</Text>
                                            </View>
                                        ))}
                                        {hintIndex < selectedExercise.hints.length && (
                                            <TouchableOpacity
                                                style={[styles.hintButton, { borderColor: colors.border?.light ?? colors.text.secondary + '30' }]}
                                                onPress={() => setHintIndex((prev) => Math.min(prev + 1, selectedExercise.hints.length))}
                                            >
                                                <Text style={[styles.hintButtonText, { color: colors.text.primary }]}>Show next hint</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {autoCheckResult && (
                                        <View
                                            style={[
                                                styles.autoCheckResult,
                                                { backgroundColor: autoCheckResult.status === 'pass' ? '#E8F5E9' : '#FFEBEE' },
                                            ]}
                                        >
                                            <Ionicons
                                                name={autoCheckResult.status === 'pass' ? 'checkmark-circle' : 'close-circle'}
                                                size={18}
                                                color={autoCheckResult.status === 'pass' ? '#2E7D32' : '#C62828'}
                                            />
                                            <Text
                                                style={[
                                                    styles.autoCheckText,
                                                    { color: autoCheckResult.status === 'pass' ? '#2E7D32' : '#C62828' },
                                                ]}
                                            >
                                                {autoCheckResult.message}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>

                        <View style={styles.utilityPanel}>
                            <Text style={[styles.utilityTitle, { color: colors.text.secondary }]}>Quick Inserts</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.utilityRow}>
                                {quickSnippets.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.utilityButton, { borderColor: colors.border?.light ?? colors.text.secondary + '30' }]}
                                        onPress={() => handleInsertSnippet(item.snippet)}
                                    >
                                        <Text style={[styles.utilityButtonText, { color: colors.text.primary }]}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {queryHistory.length > 0 && (
                            <View style={styles.historyPanel}>
                                <Text style={[styles.utilityTitle, { color: colors.text.secondary }]}>Query History</Text>
                                {queryHistory.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.historyItem,
                                            {
                                                borderColor: colors.border?.light ?? colors.text.secondary + '20',
                                                backgroundColor:
                                                    item.status === 'success' ? '#E8F5E9' : '#FFEBEE',
                                            },
                                        ]}
                                        onPress={() => setSql(item.sql)}
                                    >
                                        <Text style={[styles.historySql, { color: colors.text.primary }]} numberOfLines={2}>
                                            {item.sql.replace(/\s+/g, ' ')}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.historyMeta,
                                                { color: item.status === 'success' ? '#2E7D32' : '#C62828' },
                                            ]}
                                        >
                                            {item.status === 'success' ? 'Success' : 'Error'}
                                            {item.rowsAffected !== undefined ? ` • ${item.rowsAffected} rows` : ''}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

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
    exercisePanel: {
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 6,
        gap: 8,
    },
    exerciseRow: {
        gap: 8,
        paddingVertical: 4,
    },
    exerciseChip: {
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    exerciseChipText: {
        fontSize: 11,
        fontWeight: '700',
    },
    exerciseDetail: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        gap: 8,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    exerciseHeaderText: {
        flex: 1,
    },
    exerciseTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    exerciseDesc: {
        fontSize: 11,
        marginTop: 4,
    },
    exerciseBadge: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
    },
    exerciseBadgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    exercisePrompt: {
        fontSize: 12,
        lineHeight: 18,
    },
    exerciseButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    exerciseButton: {
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    exerciseButtonText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    hintPanel: {
        gap: 6,
    },
    hintTitle: {
        fontSize: 11,
        fontWeight: '700',
    },
    hintRow: {
        paddingVertical: 2,
    },
    hintText: {
        fontSize: 11,
        lineHeight: 16,
    },
    hintButton: {
        borderWidth: 1,
        borderRadius: 999,
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
    },
    hintButtonText: {
        fontSize: 11,
        fontWeight: '600',
    },
    autoCheckResult: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        borderRadius: 10,
    },
    autoCheckText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
    },
    utilityPanel: {
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    utilityTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
    },
    utilityRow: {
        gap: 8,
        paddingBottom: 6,
    },
    utilityButton: {
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    utilityButtonText: {
        fontSize: 11,
        fontWeight: '600',
    },
    historyPanel: {
        paddingHorizontal: 12,
        paddingTop: 4,
        gap: 8,
    },
    historyItem: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    historySql: {
        fontSize: 12,
        fontWeight: '600',
    },
    historyMeta: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '600',
    },
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
