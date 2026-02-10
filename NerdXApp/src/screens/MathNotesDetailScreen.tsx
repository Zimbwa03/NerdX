import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { mathNotesApi } from '../services/api/mathNotesApi';
import { MathTopicNotes } from '../data/mathNotes/types';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import MathRenderer from '../components/MathRenderer';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';

const { width } = Dimensions.get('window');

const MathNotesDetailScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const { topic, isALevel } = route.params as { topic: string; isALevel?: boolean };

    const [notes, setNotes] = useState<MathTopicNotes | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

    useEffect(() => {
        loadNotes();
    }, [topic]);

    const loadNotes = async () => {
        try {
            setLoading(true);
            const notesData = await mathNotesApi.getTopicNotes(topic, isALevel ? 'A-Level' : 'O-Level');
            if (notesData) {
                setNotes(notesData);
            } else {
                Alert.alert('Notes Not Available', `Notes for ${topic} are being prepared.`);
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load math notes');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (index: number) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedSections(newExpanded);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.subjects.mathematics} />
                <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Preparing professional math notes...</Text>
            </View>
        );
    }

    if (!notes) return null;

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={[Colors.subjects.mathematics, Colors.primary.dark]}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerSubtitle}>Mathematics Notes</Text>
                    <Text style={styles.headerTitle} numberOfLines={1}>{notes.topic}</Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Summary Section */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="information-circle" size={24} color={Colors.subjects.mathematics} />
                        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Summary</Text>
                    </View>
                    <MathRenderer content={notes.summary} fontSize={16} />
                </View>

                {/* Main Content Sections */}
                {notes.sections.map((section, index) => (
                    <View key={index} style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                        <TouchableOpacity
                            style={styles.sectionHeader}
                            onPress={() => toggleSection(index)}
                        >
                            <View style={styles.titleRow}>
                                <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                                    {section.title}
                                </Text>
                            </View>
                            <Ionicons
                                name={expandedSections.has(index) ? "chevron-up" : "chevron-down"}
                                size={24}
                                color={themedColors.text.secondary}
                            />
                        </TouchableOpacity>

                        {expandedSections.has(index) && (
                            <View style={styles.sectionBody}>
                                <MathRenderer content={section.content} fontSize={16} />

                                {section.worked_examples && section.worked_examples.map((ex, exIdx) => (
                                    <View key={exIdx} style={[styles.exampleBox, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F9F9F9' }]}>
                                        <View style={styles.exampleHeader}>
                                            <Ionicons name="create-outline" size={20} color={Colors.secondary.main} />
                                            <Text style={[styles.exampleTitle, { color: Colors.secondary.main }]}>Worked Example</Text>
                                        </View>
                                        <MathRenderer content={ex.question} fontSize={16} />
                                        <View style={styles.stepsContainer}>
                                            {ex.steps.map((step, sIdx) => (
                                                <View key={sIdx} style={styles.stepRow}>
                                                    <View style={[styles.stepNumber, { backgroundColor: Colors.subjects.mathematics }]}>
                                                        <Text style={styles.stepNumberText}>{sIdx + 1}</Text>
                                                    </View>
                                                    <View style={styles.stepContent}>
                                                        <MathRenderer content={step} fontSize={15} />
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                        <View style={styles.answerBox}>
                                            <Text style={[styles.answerLabel, { color: themedColors.text.secondary }]}>Final Answer:</Text>
                                            <MathRenderer content={ex.final_answer} fontSize={16} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

                {/* Key Points */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper, borderLeftWidth: 4, borderLeftColor: Colors.success.main }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="checkmark-circle" size={24} color={Colors.success.main} />
                        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Key Points</Text>
                    </View>
                    {notes.key_points.map((point, i) => (
                        <View key={i} style={styles.pointRow}>
                            <Text style={{ color: Colors.success.main, marginRight: 10 }}>•</Text>
                            <View style={styles.pointContent}>
                                <MathRenderer content={point} fontSize={15} minHeight={24} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Exam Tips */}
                <View style={[styles.card, { backgroundColor: themedColors.background.paper, borderLeftWidth: 4, borderLeftColor: Colors.warning.main }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="bulb-outline" size={24} color={Colors.warning.main} />
                        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Exam Tips</Text>
                    </View>
                    {notes.exam_tips.map((tip, i) => (
                        <View key={i} style={styles.pointRow}>
                            <Ionicons name="star" size={12} color={Colors.warning.main} style={{ marginTop: 4, marginRight: 8 }} />
                            <View style={styles.pointContent}>
                                <MathRenderer content={tip} fontSize={15} minHeight={24} />
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 10, fontSize: 16 },
    header: { padding: 50, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 15 },
    headerContent: { flex: 1 },
    headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
    headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    scrollContent: { padding: 16 },
    card: { borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
    sectionBody: { marginTop: 10 },
    exampleBox: { padding: 16, borderRadius: 8, marginVertical: 12 },
    exampleHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    exampleTitle: { fontSize: 14, fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase' },
    stepsContainer: { marginTop: 12 },
    stepRow: { flexDirection: 'row', marginBottom: 12 },
    stepNumber: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
    stepNumberText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    stepContent: { flex: 1 },
    answerBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', flexDirection: 'row', alignItems: 'center' },
    answerLabel: { fontWeight: 'bold', marginRight: 8, fontSize: 14 },
    pointRow: { flexDirection: 'row', marginBottom: 8, paddingLeft: 10, alignItems: 'flex-start' },
    pointContent: { flex: 1 },
});

export default MathNotesDetailScreen;
