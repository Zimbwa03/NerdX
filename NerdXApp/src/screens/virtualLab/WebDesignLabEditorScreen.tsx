import React, { useCallback, useMemo, useState } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemedColors } from '../../theme/useThemedStyles';
import type { WebFile } from '../../types/webDesignLabTypes';
import { WEB_DESIGN_TEMPLATES } from '../../data/virtualLab/webDesignLab/templates';
import EditorTopBar from '../../components/virtualLab/programmingLab/EditorTopBar';
import FileTabBar from '../../components/virtualLab/programmingLab/FileTabBar';
import LineNumberDisplay from '../../components/virtualLab/programmingLab/LineNumberDisplay';
import WebDesignPreview from '../../components/virtualLab/webDesign/WebDesignPreview';
import { FloatingActionMenu, AIAssistantPanel } from '../../components/virtualLab/programmingLab';
import { Modal, ModalOptionCard } from '../../components/Modal';
import { gamificationService } from '../../services/GamificationService';

type RouteParams = {
    board?: 'zimsec' | 'cambridge';
    userLevel?: 'o-level' | 'a-level';
};

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Web Design Lab Page</title>
</head>
<body>
  <h1>Welcome to Web Design Lab</h1>
  <p>Edit this HTML to see the changes in the preview.</p>
</body>
</html>
`;

const WebDesignLabEditorScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const colors = useThemedColors();
    const { width } = useWindowDimensions();
    const params = (route.params || {}) as RouteParams;

    const [files, setFiles] = useState<WebFile[]>(() => [
        {
            id: `web-file-${Date.now()}`,
            name: 'index.html',
            language: 'html',
            content: DEFAULT_HTML,
            lastModified: new Date(),
            metadata: { board: params.board },
        },
    ]);
    const [activeFileId, setActiveFileId] = useState<string>(files[0]?.id ?? '');
    const [templatesVisible, setTemplatesVisible] = useState(false);
    const [aiVisible, setAiVisible] = useState(false);

    const activeFile = files.find((f) => f.id === activeFileId) ?? files[0];
    const code = activeFile?.content ?? '';
    const lineCount = code.split('\n').length;
    const isWideLayout = width >= 900;

    const handleCodeChange = useCallback(
        (newCode: string) => {
            if (!activeFile) return;
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === activeFile.id ? { ...f, content: newCode, lastModified: new Date() } : f,
                ),
            );
        },
        [activeFile],
    );

    const handleNewFile = useCallback(() => {
        const newId = `web-file-${Date.now()}`;
        const newFile: WebFile = {
            id: newId,
            name: `page-${files.length + 1}.html`,
            language: 'html',
            content: DEFAULT_HTML,
            lastModified: new Date(),
            metadata: { board: params.board },
        };
        setFiles((prev) => [...prev, newFile]);
        setActiveFileId(newId);
    }, [files.length, params.board]);

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

    const handleApplyTemplate = useCallback(
        (templateId: string) => {
            const template = WEB_DESIGN_TEMPLATES.find((t) => t.id === templateId);
            if (!template) return;

            const newId = `web-file-${Date.now()}`;
            const newFile: WebFile = {
                id: newId,
                name: template.title.replace(/\s+/g, '-').toLowerCase() + '.html',
                language: 'html',
                content: template.code,
                lastModified: new Date(),
                metadata: {
                    templateId: template.id,
                    templateTitle: template.title,
                    board: params.board,
                },
            };
            setFiles((prev) => [...prev, newFile]);
            setActiveFileId(newId);
            setTemplatesVisible(false);
        },
        [params.board],
    );

    const templateOptions = useMemo(
        () =>
            WEB_DESIGN_TEMPLATES.filter((t) => {
                if (!params.board || t.board === 'both' || !t.board) return true;
                return t.board === params.board;
            }),
        [params.board],
    );

    const handleRun = useCallback(() => {
        // For Web Design, the preview updates live. Run is used as a
        // \"checkpoint\" action that can trigger gamification rewards.
        if (!code.trim()) {
            return;
        }
        gamificationService.logLabCompleted(80).catch(() => {
            // Non-critical – ignore errors so the editor remains responsive.
        });
    }, [code]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <EditorTopBar
                    language="python" // label not used for HTML; show generic label
                    fileName={activeFile?.name ?? 'index.html'}
                    onBack={() => navigation.goBack()}
                    onFileNew={handleNewFile}
                    onUndo={() => {}}
                    onRedo={() => {}}
                />

                <View style={[styles.boardBadgeRow, { borderBottomColor: colors.border.light }]}>
                    <Text style={[styles.labTitle, { color: colors.text.primary }]}>Web Design Lab</Text>
                    {params.board && (
                        <Text
                            style={[
                                styles.boardBadge,
                                {
                                    borderColor: colors.primary.main,
                                    color: colors.primary.main,
                                },
                            ]}
                        >
                            {params.board === 'zimsec' ? 'ZIMSEC' : 'Cambridge'}
                        </Text>
                    )}
                </View>

                <View style={[styles.mainRow, isWideLayout && styles.mainRowWide]}>
                    <View style={styles.editorColumn}>
                        <FileTabBar
                            files={files}
                            activeFileId={activeFileId}
                            onTabSelect={handleTabSelect}
                            onTabClose={handleTabClose}
                            onTabNew={handleNewFile}
                        />

                        <View
                            style={[
                                styles.editorWrapper,
                                { backgroundColor: colors.background.subtle ?? '#1E1E1E' },
                            ]}
                        >
                            <ScrollView
                                style={styles.editorScroll}
                                contentContainerStyle={[
                                    styles.editorScrollContent,
                                    { minHeight: Math.max(200, lineCount * 22) },
                                ]}
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
                                    value={code}
                                    onChangeText={handleCodeChange}
                                    multiline
                                    placeholder="Type your HTML here..."
                                    placeholderTextColor={colors.text.secondary}
                                    spellCheck={false}
                                    autoCapitalize="none"
                                />
                            </ScrollView>
                        </View>
                    </View>

                    <View style={[styles.previewColumn, !isWideLayout && styles.previewColumnStacked]}>
                        <Text style={[styles.previewTitle, { color: colors.text.secondary }]}>Preview</Text>
                        <WebDesignPreview htmlContent={code} />
                    </View>
                </View>

                <FloatingActionMenu
                    actions={[
                        { id: 'run', label: 'Run', icon: 'play', onPress: handleRun },
                        { id: 'templates', label: 'Templates', icon: 'list', onPress: () => setTemplatesVisible(true) },
                        { id: 'ai-help', label: 'AI Help', icon: 'sparkles', onPress: () => setAiVisible(true) },
                    ]}
                />

                <Modal visible={templatesVisible} onClose={() => setTemplatesVisible(false)} title="Web Templates">
                    {templateOptions.map((template) => (
                        <ModalOptionCard
                            key={template.id}
                            icon="🧪"
                            title={template.title}
                            description={template.description}
                            onPress={() => handleApplyTemplate(template.id)}
                        />
                    ))}
                    {templateOptions.length === 0 && (
                        <Text style={{ color: colors.text.secondary }}>
                            No templates available for this board yet.
                        </Text>
                    )}
                </Modal>

                <Modal visible={aiVisible} onClose={() => setAiVisible(false)} title="AI Web Design Tutor">
                    <View style={{ height: 420 }}>
                        <AIAssistantPanel
                            language="HTML"
                            code={code}
                            userLevel={params.userLevel}
                            lab="web-design"
                            board={params.board}
                        />
                    </View>
                </Modal>
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
    boardBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    labTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    boardBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        fontSize: 12,
        fontWeight: '600',
    },
    mainRow: {
        flex: 1,
        flexDirection: 'column',
    },
    mainRowWide: {
        flexDirection: 'row',
    },
    editorColumn: {
        flex: 1,
        minWidth: 0,
    },
    previewColumn: {
        flex: 1,
        minHeight: 220,
    },
    previewColumnStacked: {
        borderTopWidth: 1,
    },
    previewTitle: {
        fontSize: 13,
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 4,
        fontWeight: '500',
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
});

export default WebDesignLabEditorScreen;

