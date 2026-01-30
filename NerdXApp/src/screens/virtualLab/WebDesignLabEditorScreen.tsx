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
    TouchableOpacity,
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
import LearningPathStrip from '../../components/virtualLab/LearningPathStrip';

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

const DEFAULT_CSS = `body {
  font-family: Arial, sans-serif;
  margin: 24px;
  background: #f5f7fb;
  color: #1c1c1c;
}

h1 {
  color: #1565c0;
}
`;

const DEFAULT_JS = `// Optional: add interactivity
console.log('Web Design Lab ready');
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
        {
            id: `web-file-${Date.now()}-css`,
            name: 'styles.css',
            language: 'css',
            content: DEFAULT_CSS,
            lastModified: new Date(),
            metadata: { board: params.board },
        },
        {
            id: `web-file-${Date.now()}-js`,
            name: 'script.js',
            language: 'js',
            content: DEFAULT_JS,
            lastModified: new Date(),
            metadata: { board: params.board },
        },
    ]);
    const [activeFileId, setActiveFileId] = useState<string>(files[0]?.id ?? '');
    const [templatesVisible, setTemplatesVisible] = useState(false);
    const [aiVisible, setAiVisible] = useState(false);
    const [newFileVisible, setNewFileVisible] = useState(false);
    const [previewMode, setPreviewMode] = useState<'responsive' | 'mobile' | 'tablet' | 'desktop'>('responsive');
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

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
        setNewFileVisible(true);
    }, []);

    const handleTabSelect = useCallback((fileId: string) => {
        setActiveFileId(fileId);
    }, []);

    const handleTabClose = useCallback(
        (fileId: string) => {
            if (files.length <= 1) return;
            const index = files.findIndex((f) => f.id === fileId);
            const nextFiles = files.filter((f) => f.id !== fileId);
            const hasHtml = nextFiles.some((f) => f.language === 'html');
            if (!hasHtml) {
                return;
            }
            setFiles(nextFiles);
            if (activeFileId === fileId) {
                setActiveFileId(nextFiles[Math.max(0, index - 1)].id);
            }
        },
        [files, activeFileId],
    );

    const handleCreateFile = useCallback(
        (language: WebFile['language']) => {
            const suffix =
                language === 'html'
                    ? '.html'
                    : language === 'css'
                    ? '.css'
                    : '.js';
            const baseName =
                language === 'html'
                    ? `page-${files.filter((f) => f.language === 'html').length + 1}`
                    : language === 'css'
                    ? `styles-${files.filter((f) => f.language === 'css').length + 1}`
                    : `script-${files.filter((f) => f.language === 'js').length + 1}`;
            const content = language === 'html' ? DEFAULT_HTML : language === 'css' ? DEFAULT_CSS : DEFAULT_JS;
            const newId = `web-file-${Date.now()}-${language}`;
            const newFile: WebFile = {
                id: newId,
                name: `${baseName}${suffix}`,
                language,
                content,
                lastModified: new Date(),
                metadata: { board: params.board },
            };
            setFiles((prev) => [...prev, newFile]);
            setActiveFileId(newId);
            setNewFileVisible(false);
        },
        [files, params.board],
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
            setFiles((prev) => {
                const next = [...prev, newFile];

                if (template.css) {
                    const cssIndex = next.findIndex((f) => f.language === 'css' && f.name === 'styles.css');
                    const cssFile: WebFile = {
                        id: cssIndex >= 0 ? next[cssIndex].id : `web-file-${Date.now()}-css`,
                        name: 'styles.css',
                        language: 'css',
                        content: template.css,
                        lastModified: new Date(),
                        metadata: { board: params.board, templateId: template.id, templateTitle: template.title },
                    };
                    if (cssIndex >= 0) {
                        next[cssIndex] = cssFile;
                    } else {
                        next.push(cssFile);
                    }
                }

                if (template.js) {
                    const jsIndex = next.findIndex((f) => f.language === 'js' && f.name === 'script.js');
                    const jsFile: WebFile = {
                        id: jsIndex >= 0 ? next[jsIndex].id : `web-file-${Date.now()}-js`,
                        name: 'script.js',
                        language: 'js',
                        content: template.js,
                        lastModified: new Date(),
                        metadata: { board: params.board, templateId: template.id, templateTitle: template.title },
                    };
                    if (jsIndex >= 0) {
                        next[jsIndex] = jsFile;
                    } else {
                        next.push(jsFile);
                    }
                }

                return next;
            });
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

    const htmlFile = useMemo(() => {
        if (activeFile?.language === 'html') return activeFile;
        return files.find((f) => f.language === 'html') ?? activeFile;
    }, [activeFile, files]);

    const cssContent = useMemo(
        () => files.filter((f) => f.language === 'css').map((f) => f.content).join('\n\n'),
        [files],
    );
    const jsContent = useMemo(
        () => files.filter((f) => f.language === 'js').map((f) => f.content).join('\n\n'),
        [files],
    );

    const availablePreviewWidth = Math.max(260, isWideLayout ? width / 2 - 36 : width - 32);
    const previewTargetWidth = previewMode === 'mobile' ? 360 : previewMode === 'tablet' ? 720 : 1024;
    const previewFrameWidth = previewMode === 'responsive' ? '100%' : Math.min(availablePreviewWidth, previewTargetWidth);

    const quickSnippets = useMemo(() => {
        if (activeFile?.language === 'css') {
            return [
                { id: 'card', label: 'Card', snippet: '.card { padding: 16px; border-radius: 12px; background: #fff; }' },
                { id: 'grid', label: 'Grid', snippet: '.grid { display: grid; gap: 16px; grid-template-columns: repeat(2, 1fr); }' },
                { id: 'button', label: 'Button', snippet: '.btn { background: #1976d2; color: white; padding: 10px 16px; border-radius: 999px; }' },
            ];
        }
        if (activeFile?.language === 'js') {
            return [
                { id: 'query', label: 'Query', snippet: "const button = document.querySelector('button');" },
                { id: 'event', label: 'Event', snippet: "button?.addEventListener('click', () => alert('Clicked'));"},
                { id: 'toggle', label: 'Toggle', snippet: "document.body.classList.toggle('dark');" },
            ];
        }
        return [
            { id: 'section', label: 'Section', snippet: '<section>\\n  <h2>Section title</h2>\\n  <p>Describe this section.</p>\\n</section>' },
            { id: 'card', label: 'Card', snippet: '<div class=\"card\">\\n  <h3>Card title</h3>\\n  <p>Card description.</p>\\n</div>' },
            { id: 'button', label: 'Button', snippet: '<button class=\"btn\">Primary Action</button>' },
        ];
    }, [activeFile?.language]);

    const handleInsertSnippet = useCallback(
        (snippet: string) => {
            if (!activeFile) return;
            const next = code ? `${code}\\n\\n${snippet}` : snippet;
            handleCodeChange(next);
        },
        [activeFile, code, handleCodeChange],
    );

    const toggleStep = useCallback((stepId: string) => {
        setCompletedSteps((prev) =>
            prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId],
        );
    }, []);

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

    const aiLanguageLabel =
        activeFile?.language === 'css' ? 'CSS' : activeFile?.language === 'js' ? 'JavaScript' : 'HTML';

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

                <LearningPathStrip
                    title="Web Design Learning Path"
                    subtitle="Build structure, style, then refine for presentation."
                    steps={[
                        { id: 'structure', title: 'Structure', description: 'Create semantic HTML sections.' },
                        { id: 'style', title: 'Style', description: 'Apply colors, spacing, and layout.' },
                        { id: 'polish', title: 'Polish', description: 'Preview on devices and refine.' },
                    ]}
                    completedSteps={completedSteps}
                    onToggleStep={toggleStep}
                    accentColor={colors.primary.main}
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

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.snippetRow}
                            contentContainerStyle={styles.snippetContent}
                        >
                            {quickSnippets.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.snippetButton, { borderColor: colors.border.light }]}
                                    onPress={() => handleInsertSnippet(item.snippet)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.snippetText, { color: colors.text.primary }]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

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

                    <View
                        style={[
                            styles.previewColumn,
                            !isWideLayout && [styles.previewColumnStacked, { borderTopColor: colors.border.light }],
                        ]}
                    >
                        <View style={styles.previewHeader}>
                            <Text style={[styles.previewTitle, { color: colors.text.secondary }]}>Preview</Text>
                            <View style={styles.previewModeRow}>
                                {(['responsive', 'mobile', 'tablet', 'desktop'] as const).map((mode) => (
                                    <TouchableOpacity
                                        key={mode}
                                        style={[
                                            styles.previewModeButton,
                                            {
                                                borderColor: colors.border.light,
                                                backgroundColor: previewMode === mode ? colors.primary.main : 'transparent',
                                            },
                                        ]}
                                        onPress={() => setPreviewMode(mode)}
                                    >
                                        <Text
                                            style={[
                                                styles.previewModeText,
                                                { color: previewMode === mode ? '#fff' : colors.text.secondary },
                                            ]}
                                        >
                                            {mode === 'responsive'
                                                ? 'Responsive'
                                                : mode === 'mobile'
                                                ? 'Mobile'
                                                : mode === 'tablet'
                                                ? 'Tablet'
                                                : 'Desktop'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={[styles.previewFrame, previewMode !== 'responsive' && { width: previewFrameWidth }]}>
                            <WebDesignPreview
                                htmlContent={htmlFile?.content ?? ''}
                                cssContent={cssContent}
                                jsContent={jsContent}
                                enableJavaScript={Boolean(jsContent && jsContent.trim())}
                            />
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

                <Modal visible={newFileVisible} onClose={() => setNewFileVisible(false)} title="Add File">
                    <ModalOptionCard
                        icon="HTML"
                        title="HTML Page"
                        description="Add a new page to design a second layout."
                        onPress={() => handleCreateFile('html')}
                    />
                    <ModalOptionCard
                        icon="CSS"
                        title="CSS Stylesheet"
                        description="Create a new stylesheet for layouts and themes."
                        onPress={() => handleCreateFile('css')}
                    />
                    <ModalOptionCard
                        icon="JS"
                        title="JavaScript File"
                        description="Add interactivity to your page."
                        onPress={() => handleCreateFile('js')}
                    />
                </Modal>

                <Modal visible={aiVisible} onClose={() => setAiVisible(false)} title="AI Web Design Tutor">
                    <View style={{ height: 420 }}>
                        <AIAssistantPanel
                            language={aiLanguageLabel}
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
    previewHeader: {
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 4,
        gap: 8,
    },
    previewTitle: {
        fontSize: 13,
        fontWeight: '500',
    },
    previewModeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    previewModeButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
    },
    previewModeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    previewFrame: {
        flex: 1,
        alignSelf: 'center',
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
    snippetRow: {
        paddingVertical: 6,
        borderBottomWidth: 1,
    },
    snippetContent: {
        paddingHorizontal: 12,
        gap: 8,
    },
    snippetButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
    },
    snippetText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default WebDesignLabEditorScreen;

