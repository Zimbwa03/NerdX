// Project Gates Lab - Practical project gating + logic diagram simulation

import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

type GateType = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'NOT';

interface GateDefinition {
    id: string;
    title: string;
    description: string;
    effort: number;
    tasks: string[];
}

const GATES: GateDefinition[] = [
    {
        id: 'gate-discovery',
        title: 'Gate 1: Discovery',
        description: 'Define the problem, users, and success criteria.',
        effort: 10,
        tasks: ['Identify user pain points', 'List constraints', 'Define success metrics'],
    },
    {
        id: 'gate-design',
        title: 'Gate 2: Design',
        description: 'Create solution options, choose a direction, and plan tasks.',
        effort: 14,
        tasks: ['Sketch solution options', 'Pick the best trade-offs', 'Draft a task plan'],
    },
    {
        id: 'gate-build',
        title: 'Gate 3: Build',
        description: 'Implement the core system and validate the output.',
        effort: 20,
        tasks: ['Build the core features', 'Write tests or checks', 'Fix the first round of defects'],
    },
    {
        id: 'gate-launch',
        title: 'Gate 4: Launch',
        description: 'Review results and prepare for release.',
        effort: 12,
        tasks: ['Review quality checklist', 'Prepare release notes', 'Plan support and monitoring'],
    },
];

const ProjectGatesLabScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('project-gates-lab');

    const [gateTasks, setGateTasks] = useState<Record<string, boolean[]>>(() =>
        Object.fromEntries(GATES.map((gate) => [gate.id, gate.tasks.map(() => false)])),
    );
    const [enabledGates, setEnabledGates] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(GATES.map((gate) => [gate.id, false])),
    );
    const [selectedGate, setSelectedGate] = useState<GateType>('AND');
    const [inputA, setInputA] = useState(false);
    const [inputB, setInputB] = useState(false);
    const [teamSize, setTeamSize] = useState('3');
    const [declarationChecks, setDeclarationChecks] = useState({
        gates: false,
        logic: false,
        calculations: false,
    });
    const [declared, setDeclared] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    const totalEffort = useMemo(() => GATES.reduce((sum, gate) => sum + gate.effort, 0), []);
    const enabledEffort = useMemo(
        () => GATES.reduce((sum, gate) => (enabledGates[gate.id] ? sum + gate.effort : sum), 0),
        [enabledGates],
    );

    const readinessScore = Math.round((enabledEffort / totalEffort) * 100);
    const teamSizeValue = Math.max(1, parseInt(teamSize || '1', 10));
    const effortRemaining = Math.max(0, totalEffort - enabledEffort);
    const deliveryDays = Math.max(1, Math.ceil(effortRemaining / (teamSizeValue * 4)));

    const outputValue = useMemo(() => {
        switch (selectedGate) {
            case 'AND':
                return inputA && inputB;
            case 'OR':
                return inputA || inputB;
            case 'XOR':
                return Boolean(inputA) !== Boolean(inputB);
            case 'NAND':
                return !(inputA && inputB);
            case 'NOR':
                return !(inputA || inputB);
            case 'NOT':
                return !inputA;
            default:
                return false;
        }
    }, [selectedGate, inputA, inputB]);

    const truthTable = useMemo(() => {
        if (selectedGate === 'NOT') {
            return [
                { a: false, b: null, out: true },
                { a: true, b: null, out: false },
            ];
        }
        return [
            { a: false, b: false, out: computeGateOutput(selectedGate, false, false) },
            { a: false, b: true, out: computeGateOutput(selectedGate, false, true) },
            { a: true, b: false, out: computeGateOutput(selectedGate, true, false) },
            { a: true, b: true, out: computeGateOutput(selectedGate, true, true) },
        ];
    }, [selectedGate]);

    const gateProgress = useMemo(() => {
        const enabledCount = GATES.filter((gate) => enabledGates[gate.id]).length;
        return { enabledCount, total: GATES.length };
    }, [enabledGates]);

    const canDeclare = Object.values(declarationChecks).every(Boolean);

    if (!simulation) {
        return (
            <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
                <StatusBar barStyle="light-content" />
                <View style={styles.centered}>
                    <Text style={[styles.errorText, { color: themedColors.text.primary }]}>Simulation not found</Text>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backBtnText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            <SimulationHeader
                title={simulation.title}
                subject={simulation.subject}
                learningObjectives={simulation.learningObjectives}
                onBack={() => navigation.goBack()}
                xpReward={simulation.xpReward}
            />

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.topic, { color: themedColors.text.secondary }]}>{simulation.topic}</Text>
                    <Text style={[styles.desc, { color: themedColors.text.primary }]}>{simulation.description}</Text>
                    <View style={styles.metaRow}>
                        <Ionicons name="flag-outline" size={16} color={themedColors.text.secondary} />
                        <Text style={[styles.metaText, { color: themedColors.text.secondary }]}>
                            Gates enabled: {gateProgress.enabledCount}/{gateProgress.total}
                        </Text>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Project Gates Board</Text>
                    <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
                        Complete the tasks for each gate, then enable it. This mirrors real project reviews.
                    </Text>
                    {GATES.map((gate) => {
                        const tasks = gateTasks[gate.id] || [];
                        const isReady = tasks.every(Boolean);
                        const isEnabled = enabledGates[gate.id];
                        return (
                            <View key={gate.id} style={[styles.gateCard, { borderColor: themedColors.border.light }]}>
                                <View style={styles.gateHeader}>
                                    <View style={styles.gateHeaderText}>
                                        <Text style={[styles.gateTitle, { color: themedColors.text.primary }]}>{gate.title}</Text>
                                        <Text style={[styles.gateDesc, { color: themedColors.text.secondary }]}>{gate.description}</Text>
                                    </View>
                                    <View style={[styles.effortBadge, { borderColor: themedColors.primary.main }]}>
                                        <Text style={[styles.effortText, { color: themedColors.primary.main }]}>{gate.effort} pts</Text>
                                    </View>
                                </View>
                                <View style={styles.taskList}>
                                    {gate.tasks.map((task, index) => {
                                        const checked = tasks[index];
                                        return (
                                            <TouchableOpacity
                                                key={`${gate.id}-${index}`}
                                                style={styles.taskRow}
                                                onPress={() => {
                                                    setGateTasks((prev) => {
                                                        const next = { ...prev };
                                                        const arr = [...(next[gate.id] || [])];
                                                        arr[index] = !arr[index];
                                                        next[gate.id] = arr;
                                                        return next;
                                                    });
                                                }}
                                            >
                                                <Ionicons
                                                    name={checked ? 'checkmark-circle' : 'ellipse-outline'}
                                                    size={18}
                                                    color={checked ? themedColors.primary.main : themedColors.text.secondary}
                                                />
                                                <Text style={[styles.taskText, { color: themedColors.text.primary }]}>{task}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.enableButton,
                                        {
                                            backgroundColor: isEnabled
                                                ? '#2E7D32'
                                                : isReady
                                                ? themedColors.primary.main
                                                : '#9E9E9E',
                                        },
                                    ]}
                                    onPress={() => {
                                        if (!isReady) {
                                            Alert.alert('Gate not ready', 'Finish the tasks before enabling this gate.');
                                            return;
                                        }
                                        setEnabledGates((prev) => ({ ...prev, [gate.id]: true }));
                                    }}
                                >
                                    <Text style={styles.enableButtonText}>
                                        {isEnabled ? 'Gate Enabled' : 'Enable Gate'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>

                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Logic Diagram Builder</Text>
                    <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
                        Toggle inputs, choose a gate, and observe the output. This mirrors logic diagrams in exams.
                    </Text>

                    <View style={styles.logicControls}>
                        {(['AND', 'OR', 'XOR', 'NAND', 'NOR', 'NOT'] as GateType[]).map((gate) => (
                            <TouchableOpacity
                                key={gate}
                                style={[
                                    styles.gateChip,
                                    {
                                        borderColor: themedColors.border.light,
                                        backgroundColor: selectedGate === gate ? themedColors.primary.main : 'transparent',
                                    },
                                ]}
                                onPress={() => setSelectedGate(gate)}
                            >
                                <Text style={[styles.gateChipText, { color: selectedGate === gate ? '#fff' : themedColors.text.primary }]}>
                                    {gate}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.logicRow}>
                        <TouchableOpacity
                            style={[styles.inputToggle, { borderColor: themedColors.border.light }]}
                            onPress={() => setInputA((prev) => !prev)}
                        >
                            <Text style={[styles.inputLabel, { color: themedColors.text.secondary }]}>Input A</Text>
                            <Text style={[styles.inputValue, { color: themedColors.text.primary }]}>{inputA ? '1' : '0'}</Text>
                        </TouchableOpacity>
                        <View style={styles.logicDiagram}>
                            <View style={[styles.logicNode, { borderColor: themedColors.border.light }]}>
                                <Text style={[styles.logicNodeText, { color: themedColors.text.primary }]}>{selectedGate}</Text>
                            </View>
                            <View style={[styles.logicLine, { backgroundColor: themedColors.border.light }]} />
                            <View style={[styles.logicOutput, { backgroundColor: outputValue ? '#2E7D32' : '#C62828' }]}>
                                <Text style={styles.logicOutputText}>{outputValue ? '1' : '0'}</Text>
                            </View>
                        </View>
                        {selectedGate !== 'NOT' && (
                            <TouchableOpacity
                                style={[styles.inputToggle, { borderColor: themedColors.border.light }]}
                                onPress={() => setInputB((prev) => !prev)}
                            >
                                <Text style={[styles.inputLabel, { color: themedColors.text.secondary }]}>Input B</Text>
                                <Text style={[styles.inputValue, { color: themedColors.text.primary }]}>{inputB ? '1' : '0'}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.truthTable}>
                        <Text style={[styles.tableTitle, { color: themedColors.text.secondary }]}>Truth Table</Text>
                        {truthTable.map((row, index) => {
                            const isActive = row.a === inputA && (row.b === null || row.b === inputB);
                            return (
                                <View
                                    key={`${row.a}-${row.b}-${index}`}
                                    style={[
                                        styles.tableRow,
                                        {
                                            borderColor: themedColors.border.light,
                                            backgroundColor: isActive ? themedColors.background.subtle ?? '#E3F2FD' : 'transparent',
                                        },
                                    ]}
                                >
                                    <Text style={[styles.tableCell, { color: themedColors.text.primary }]}>A: {row.a ? '1' : '0'}</Text>
                                    <Text style={[styles.tableCell, { color: themedColors.text.primary }]}>
                                        B: {row.b === null ? '-' : row.b ? '1' : '0'}
                                    </Text>
                                    <Text style={[styles.tableCell, { color: themedColors.text.primary }]}>Out: {row.out ? '1' : '0'}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Project Calculations</Text>
                    <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
                        Adjust team size to estimate delivery speed and readiness.
                    </Text>
                    <View style={styles.calcRow}>
                        <View style={[styles.calcBox, { backgroundColor: themedColors.background.subtle ?? '#F7F7F7' }]}>
                            <Text style={[styles.calcLabel, { color: themedColors.text.secondary }]}>Team Size</Text>
                            <TextInput
                                style={[styles.calcInput, { borderColor: themedColors.border.light, color: themedColors.text.primary }]}
                                value={teamSize}
                                onChangeText={setTeamSize}
                                keyboardType="number-pad"
                            />
                        </View>
                        <View style={[styles.calcBox, { backgroundColor: themedColors.background.subtle ?? '#F7F7F7' }]}>
                            <Text style={[styles.calcLabel, { color: themedColors.text.secondary }]}>Readiness</Text>
                            <Text style={[styles.calcValue, { color: themedColors.primary.main }]}>{readinessScore}%</Text>
                        </View>
                        <View style={[styles.calcBox, { backgroundColor: themedColors.background.subtle ?? '#F7F7F7' }]}>
                            <Text style={[styles.calcLabel, { color: themedColors.text.secondary }]}>Days Remaining</Text>
                            <Text style={[styles.calcValue, { color: themedColors.text.primary }]}>{deliveryDays}</Text>
                        </View>
                    </View>
                    <Text style={[styles.calcHint, { color: themedColors.text.secondary }]}>
                        Formula: remaining effort / (team size x 4) = days
                    </Text>
                </View>

                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Declare Understanding</Text>
                    <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
                        Confirm you understand the gates, logic outputs, and calculations before the quiz.
                    </Text>
                    {[
                        { id: 'gates', label: 'I can explain project gates and when to enable them.' },
                        { id: 'logic', label: 'I can read a logic diagram and predict outputs.' },
                        { id: 'calculations', label: 'I can calculate readiness and delivery time.' },
                    ].map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.taskRow}
                            onPress={() =>
                                setDeclarationChecks((prev) => {
                                    const next = { ...prev, [item.id]: !prev[item.id as keyof typeof prev] };
                                    if (!Object.values(next).every(Boolean)) {
                                        setDeclared(false);
                                    }
                                    return next;
                                })
                            }
                        >
                            <Ionicons
                                name={declarationChecks[item.id as keyof typeof declarationChecks] ? 'checkmark-circle' : 'ellipse-outline'}
                                size={18}
                                color={declarationChecks[item.id as keyof typeof declarationChecks] ? themedColors.primary.main : themedColors.text.secondary}
                            />
                            <Text style={[styles.taskText, { color: themedColors.text.primary }]}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[
                            styles.declareButton,
                            { backgroundColor: canDeclare ? themedColors.primary.main : '#9E9E9E' },
                        ]}
                        onPress={() => {
                            if (!canDeclare) {
                                Alert.alert('Almost there', 'Tick all statements before declaring understanding.');
                                return;
                            }
                            setDeclared(true);
                        }}
                    >
                        <Text style={styles.declareButtonText}>{declared ? 'Understanding Declared' : 'Declare Understanding'}</Text>
                    </TouchableOpacity>
                    {declared && (
                        <View style={styles.declaredBadge}>
                            <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                            <Text style={styles.declaredText}>Great work. You can now take the knowledge check.</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.quizButton, { backgroundColor: declared ? themedColors.primary.main : '#9E9E9E' }]}
                    onPress={() => setShowQuiz(true)}
                    disabled={!declared}
                >
                    <Text style={styles.quizButtonText}>
                        {declared ? 'Take Knowledge Check' : 'Declare understanding to unlock quiz'}
                    </Text>
                    <Ionicons name={declared ? 'arrow-forward' : 'lock-closed'} size={20} color="#FFF" />
                </TouchableOpacity>
            </ScrollView>

            <KnowledgeCheck
                visible={showQuiz}
                simulation={simulation}
                onComplete={() => setShowQuiz(false)}
                onClose={() => setShowQuiz(false)}
            />
        </View>
    );
};

const computeGateOutput = (gate: GateType, a: boolean, b: boolean) => {
    switch (gate) {
        case 'AND':
            return a && b;
        case 'OR':
            return a || b;
        case 'XOR':
            return Boolean(a) !== Boolean(b);
        case 'NAND':
            return !(a && b);
        case 'NOR':
            return !(a || b);
        case 'NOT':
            return !a;
        default:
            return false;
    }
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
    card: { padding: 16, borderRadius: 16 },
    topic: { fontSize: 12, marginBottom: 6 },
    desc: { fontSize: 14, lineHeight: 20 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
    metaText: { fontSize: 12, fontWeight: '700' },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
    instruction: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
    gateCard: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
    gateHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 8 },
    gateHeaderText: { flex: 1 },
    gateTitle: { fontSize: 14, fontWeight: '700' },
    gateDesc: { fontSize: 12, marginTop: 4 },
    effortBadge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
    effortText: { fontSize: 11, fontWeight: '700' },
    taskList: { gap: 8, marginBottom: 10 },
    taskRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    taskText: { fontSize: 13, flex: 1 },
    enableButton: { borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
    enableButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    logicControls: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    gateChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
    gateChipText: { fontSize: 12, fontWeight: '700' },
    logicRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    inputToggle: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center', minWidth: 80 },
    inputLabel: { fontSize: 11 },
    inputValue: { fontSize: 18, fontWeight: '700', marginTop: 4 },
    logicDiagram: { flex: 1, alignItems: 'center', gap: 10 },
    logicNode: { paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderRadius: 12 },
    logicNodeText: { fontSize: 13, fontWeight: '700' },
    logicLine: { height: 2, width: '60%' },
    logicOutput: { borderRadius: 999, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    logicOutputText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    truthTable: { marginTop: 12, gap: 6 },
    tableTitle: { fontSize: 12, fontWeight: '700' },
    tableRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 8, padding: 8, gap: 12 },
    tableCell: { fontSize: 12, fontWeight: '600' },
    calcRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
    calcBox: { minWidth: 120, padding: 10, borderRadius: 10 },
    calcLabel: { fontSize: 11, marginBottom: 6 },
    calcValue: { fontSize: 16, fontWeight: '700' },
    calcInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, fontSize: 14 },
    calcHint: { marginTop: 8, fontSize: 12 },
    declareButton: { marginTop: 12, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
    declareButtonText: { color: '#fff', fontWeight: '700' },
    declaredBadge: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E8F5E9', padding: 10, borderRadius: 10 },
    declaredText: { color: '#2E7D32', fontSize: 12, fontWeight: '600', flex: 1 },
    quizButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
    quizButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    errorText: { fontSize: 16, marginBottom: 12 },
    backBtn: { backgroundColor: '#2E7D32', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
    backBtnText: { color: '#fff', fontWeight: '700' },
});

export default ProjectGatesLabScreen;
