// Virtual Programming Lab - Code Editor screen (Part 2)

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import type { CodeFile, ProgrammingLanguage, SyntaxError as SyntaxErrorType, ExecutionResult } from '../../types/programmingLabTypes';
import {
    EditorTopBar,
    FileTabBar,
    LineNumberDisplay,
    SyntaxHighlighter,
    ErrorHighlighter,
    ExecutionPanel,
    FloatingActionMenu,
    SidePanelTabs,
    AIAssistantPanel,
    HintPanel,
    DocumentationPanel,
} from '../../components/virtualLab/programmingLab';
import type { SidePanelTabId } from '../../components/virtualLab/programmingLab';
import { syntaxValidator } from '../../utils/programmingLab/syntaxValidator';
import { programmingLabApi } from '../../services/api/programmingLabApi';
import { gamificationService } from '../../services/GamificationService';
import { findExerciseById } from '../../data/virtualLab/programmingLab/curriculum';

type RouteParams = {
    exerciseId?: string;
    courseId?: string;
    language?: ProgrammingLanguage;
    userLevel?: 'o-level' | 'a-level';
};

const DEFAULT_PYTHON = '# Welcome to Programming Lab\nprint("Hello, World!")\n';

function createDefaultFile(language: ProgrammingLanguage): CodeFile {
    const ext = language === 'python' ? 'py' : language === 'vbnet' ? 'vb' : 'java';
    const name = language === 'python' ? 'main.py' : language === 'vbnet' ? 'Module1.vb' : 'Main.java';
    let content = DEFAULT_PYTHON;
    if (language === 'vbnet') {
        content = 'Module Module1\n    Sub Main()\n        Console.WriteLine("Hello, World!")\n    End Sub\nEnd Module\n';
    } else if (language === 'java') {
        content = 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n';
    }
    return {
        id: `file-${Date.now()}`,
        name,
        language,
        content,
        lastModified: new Date(),
        metadata: {},
    };
}

const ProgrammingLabEditorScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const params = (route.params || {}) as RouteParams;

    const initialExercise = findExerciseById(params.exerciseId);
    const language = (params.language ?? initialExercise?.language ?? 'python') as ProgrammingLanguage;

    const [files, setFiles] = useState<CodeFile[]>(() => {
        if (initialExercise) {
            const file = createDefaultFile(initialExercise.language);
            return [
                {
                    ...file,
                    content: initialExercise.starterCode ?? file.content,
                    metadata: {
                        exerciseId: initialExercise.id,
                        exerciseName: initialExercise.title,
                    },
                },
            ];
        }
        return [createDefaultFile(language)];
    });
    const [activeFileId, setActiveFileId] = useState<string>(files[0]?.id ?? '');
    const [syntaxErrors, setSyntaxErrors] = useState<SyntaxErrorType[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
    const [activeSideTab, setActiveSideTab] = useState<SidePanelTabId>('ai');
    const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
    const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activeFile = files.find((f) => f.id === activeFileId) ?? files[0];
    const code = activeFile?.content ?? '';
    const errorLines = new Set(syntaxErrors.map((e) => e.line));

    const runValidation = useCallback((content: string, lang: ProgrammingLanguage) => {
        const errors = syntaxValidator(content, lang);
        setSyntaxErrors(errors);
    }, []);

    const debouncedValidation = useCallback(
        (content: string, lang: ProgrammingLanguage) => {
            if (validationTimeoutRef.current) {
                clearTimeout(validationTimeoutRef.current);
            }
            validationTimeoutRef.current = setTimeout(() => {
                runValidation(content, lang);
                validationTimeoutRef.current = null;
            }, 400);
        },
        [runValidation],
    );

    useEffect(() => {
        return () => {
            if (validationTimeoutRef.current) {
                clearTimeout(validationTimeoutRef.current);
            }
        };
    }, []);

    const handleCodeChange = useCallback(
        (newCode: string) => {
            if (!activeFile) return;
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === activeFileId ? { ...f, content: newCode, lastModified: new Date() } : f,
                ),
            );
            debouncedValidation(newCode, activeFile.language);
            const lines = newCode.split('\n');
            const cursorLine = Math.min(cursorPosition.line, Math.max(1, lines.length));
            setCursorPosition((p) => ({ ...p, line: cursorLine }));
        },
        [activeFileId, activeFile, debouncedValidation, cursorPosition.line],
    );

    const handleRunCode = useCallback(async () => {
        if (!activeFile) {
            return;
        }
        try {
            setIsExecuting(true);
            setExecutionResult(null);

            const response = await programmingLabApi.executeCode({
                code,
                language: activeFile.language,
                input: [],
                timeoutSeconds: 5,
            });

            const result: ExecutionResult = {
                success: response.success,
                stdout: response.stdout,
                stderr: response.stderr,
                executionTime: response.executionTime,
                memoryUsed: response.memoryUsed,
            };

            setExecutionResult(result);

            // Simple curriculum-aware XP logging: award points when code runs successfully without stderr
            if (response.success && !response.stderr) {
                const exercise = activeFile.metadata.exerciseId
                    ? findExerciseById(activeFile.metadata.exerciseId)
                    : undefined;

                // Default XP if no exercise metadata is found
                const xp = exercise?.points ?? 50;

                // Fire and forget; do not block UI on gamification updates
                gamificationService.logLabCompleted(xp).catch(() => {
                    // Swallow errors – gamification is non-critical
                });
            }
        } catch (err: any) {
            setExecutionResult({
                success: false,
                stdout: '',
                stderr: err?.message || 'Failed to execute code. Please try again.',
                executionTime: 0,
                memoryUsed: 0,
            });
        } finally {
            setIsExecuting(false);
        }
    }, [activeFile, code]);

    const handleClearOutput = useCallback(() => {
        setExecutionResult(null);
    }, []);

    const handleNewFile = useCallback(() => {
        const lang = activeFile?.language ?? 'python';
        const newFile = createDefaultFile(lang);
        setFiles((prev) => [...prev, newFile]);
        setActiveFileId(newFile.id);
    }, [activeFile?.language]);

    const handleTabSelect = useCallback((fileId: string) => {
        setActiveFileId(fileId);
    }, []);

    const handleTabClose = useCallback(
        (fileId: string) => {
            if (files.length <= 1) return;
            const index = files.findIndex((f) => f.id === fileId);
            const nextFiles = files.filter((f) => f.id !== fileId);
            setFiles(nextFiles);
            if (activeFileId === fileId) {
                setActiveFileId(nextFiles[Math.max(0, index - 1)].id);
            }
        },
        [files, activeFileId],
    );

    const handleErrorClick = useCallback((_error: SyntaxErrorType) => {
        // Could scroll to line
    }, []);

    const lineCount = code.split('\n').length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <EditorTopBar
                    language={activeFile?.language ?? 'python'}
                    fileName={activeFile?.name ?? 'main.py'}
                    onBack={() => navigation.goBack()}
                    onFileNew={handleNewFile}
                    onUndo={() => {}}
                    onRedo={() => {}}
                />

                <View style={styles.mainRow}>
                    <View style={styles.editorColumn}>
                        <FileTabBar
                            files={files}
                            activeFileId={activeFileId}
                            onTabSelect={handleTabSelect}
                            onTabClose={handleTabClose}
                            onTabNew={handleNewFile}
                        />

                        <View style={[styles.editorWrapper, { backgroundColor: themedColors.background.subtle ?? '#1E1E1E' }]}>
                            <ScrollView
                                style={styles.editorScroll}
                                contentContainerStyle={[styles.editorScrollContent, { minHeight: Math.max(200, lineCount * 22) }]}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="handled"
                            >
                                <LineNumberDisplay
                                    lineCount={lineCount}
                                    currentLine={cursorPosition.line}
                                    breakpoints={new Set()}
                                    fontSize={14}
                                    scrollable={false}
                                />
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        {
                                            color: themedColors.text.primary,
                                            backgroundColor: 'transparent',
                                            fontSize: 14,
                                            minHeight: Math.max(200, lineCount * 22),
                                        },
                                    ]}
                                    value={code}
                                    onChangeText={handleCodeChange}
                                    multiline
                                    placeholder="Type your code..."
                                    placeholderTextColor={themedColors.text.secondary}
                                    spellCheck={false}
                                    autoCapitalize="none"
                                    onSelectionChange={(e) => {
                                        const { start } = e.nativeEvent.selection;
                                        const before = code.substring(0, start);
                                        const line = Math.max(1, before.split('\n').length);
                                        const lastNewLine = before.lastIndexOf('\n');
                                        const column = lastNewLine === -1 ? start + 1 : start - lastNewLine;
                                        setCursorPosition({ line, column });
                                    }}
                                />
                            </ScrollView>
                        </View>

                        <View style={styles.errorSection}>
                            <ErrorHighlighter errors={syntaxErrors} onErrorClick={handleErrorClick} />
                        </View>
                    </View>

                    <SidePanelTabs activeTab={activeSideTab} onTabChange={setActiveSideTab}>
                        {activeSideTab === 'ai' && (
                            <AIAssistantPanel
                                language={activeFile?.language ?? 'python'}
                                code={code}
                                userLevel={params.userLevel ?? 'a-level'}
                                exerciseId={params.exerciseId}
                            />
                        )}
                        {activeSideTab === 'hints' && <HintPanel />}
                        {activeSideTab === 'docs' && <DocumentationPanel />}
                    </SidePanelTabs>
                </View>

                <ExecutionPanel
                    isExecuting={isExecuting}
                    executionResult={executionResult}
                    onRun={handleRunCode}
                    onRunWithDebug={() => {}}
                    onStop={() => setIsExecuting(false)}
                    onClearOutput={handleClearOutput}
                />

                <FloatingActionMenu
                    actions={[
                        { id: 'run', label: 'Run', icon: 'play', onPress: handleRunCode },
                        { id: 'format', label: 'Format', icon: 'code', onPress: () => {} },
                        { id: 'ai-help', label: 'AI Help', icon: 'sparkles', onPress: () => setActiveSideTab('ai') },
                    ]}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    mainRow: {
        flex: 1,
        flexDirection: 'row',
        minHeight: 0,
    },
    editorColumn: {
        flex: 1,
        minWidth: 0,
    },
    editorWrapper: {
        flex: 1,
        minHeight: 200,
    },
    editorScroll: {
        flex: 1,
    },
    editorScrollContent: {
        flexDirection: 'row',
    },
    textInput: {
        flex: 1,
        padding: 8,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        textAlignVertical: 'top',
    },
    errorSection: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxHeight: 100,
    },
});

export default ProgrammingLabEditorScreen;
