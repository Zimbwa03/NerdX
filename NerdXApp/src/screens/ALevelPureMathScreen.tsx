// A Level Pure Mathematics Screen - ZIMSEC Syllabus (6042)
// Premium Modern UI with glass-morphism and professional polish
// Uses DeepSeek for AI-powered question generation
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    StatusBar,
    Dimensions,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { aLevelPureMathTopics, ALevelPureMathTopic, topicCounts } from '../data/aLevelPureMath';
import { quizApi } from '../services/api/quizApi';
import LoadingProgress from '../components/LoadingProgress';
import ExamSetupModal from '../components/ExamSetupModal';
import { ExamConfig, TimeInfo } from '../services/api/examApi';
import {
    ALevelTopicCard,
    ALevelFeatureCard,
    ALevelExamCard,
    ALevelInfoCard,
} from '../components/ALevelTopicCard';

const { width } = Dimensions.get('window');

// Premium color palette for Pure Mathematics
const pureMathTheme = {
    primary: '#8B5CF6',      // Violet
    secondary: '#A78BFA',    // Light violet
    tertiary: '#7C3AED',     // Deep violet
    accent: '#C4B5FD',       // Soft lavender
    gradient: {
        header: ['#7C3AED', '#8B5CF6', '#A78BFA'] as [string, string, string],
        lowerSixth: ['#8B5CF6', '#7C3AED'] as [string, string],
        upperSixth: ['#EC4899', '#DB2777'] as [string, string],
    },
    lowerSixthPrimary: '#8B5CF6',
    upperSixthPrimary: '#EC4899',
};

const ALevelPureMathScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, updateUser } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const pureMathThinkingSteps = [
        { emoji: '📥', label: 'Loading topic context' },
        { emoji: '🧠', label: 'Generating question' },
        { emoji: '📚', label: 'Selecting syllabus objectives' },
        { emoji: '🧮', label: 'Balancing difficulty' },
        { emoji: '📝', label: 'Drafting marking points' },
        { emoji: '🧩', label: 'Refining marking points' },
        { emoji: '🔍', label: 'Checking method and accuracy' },
        { emoji: '✅', label: 'Complete' },
    ];

    const [selectedLevel, setSelectedLevel] = useState<'Lower Sixth' | 'Upper Sixth'>('Lower Sixth');
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [examSetupModalVisible, setExamSetupModalVisible] = useState(false);

    // Filter topics by selected level
    const filteredTopics = aLevelPureMathTopics.filter(
        topic => topic.difficulty === selectedLevel
    );

    const currentPrimaryColor = selectedLevel === 'Lower Sixth'
        ? pureMathTheme.lowerSixthPrimary
        : pureMathTheme.upperSixthPrimary;

    const handleTopicPress = async (topic: ALevelPureMathTopic) => {
        try {
            // A-Level Pure Math topical questions cost 0.5 credit
            const creditCost = 0.5;
            if (!user || (user.credits || 0) < creditCost) {
                Alert.alert(
                    'Insufficient Credits',
                    `You need at least ${creditCost} credit to start a quiz. Please purchase credits first.`,
                    [{ text: 'OK' }]
                );
                return;
            }

            Alert.alert(
                '📐 Start Quiz',
                `${topic.name}\n\n${topic.description}`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Start Quiz',
                        onPress: async () => {
                            try {
                                setIsGeneratingQuestion(true);

                                const question = await quizApi.generateQuestion(
                                    'a_level_pure_math',
                                    topic.id,
                                    'medium',
                                    'topical',
                                    'Pure Mathematics'
                                );

                                setIsGeneratingQuestion(false);

                                if (question) {
                                    navigation.navigate('Quiz' as never, {
                                        question,
                                        subject: { id: 'a_level_pure_math', name: 'A Level Pure Mathematics' },
                                        topic: { id: topic.id, name: topic.name }
                                    } as never);
                                    // Update credits from server response
                                    const serverCredits = (question as any).credits_remaining;
                                    if (serverCredits !== undefined) {
                                        updateUser({ credits: serverCredits });
                                    }
                                }
                            } catch (error: any) {
                                setIsGeneratingQuestion(false);
                                Alert.alert('Error', error.response?.data?.message || 'Failed to start quiz');
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to start quiz');
        }
    };

    const handlePureMathNotes = () => {
        navigation.navigate('ALevelPureMathNotes' as never);
    };

    const handleFormulaSheet = () => {
        navigation.navigate('FormulaSheet' as never);
    };

    const handleAITutor = () => {
        navigation.navigate('TeacherModeSetup' as never, {
            preselectedSubject: 'A Level Pure Mathematics',
        } as never);
    };

    const handleStartExam = () => {
        // Open the exam setup modal
        setExamSetupModalVisible(true);
    };

    // Handle exam modal start
    const handleExamStart = async (config: ExamConfig, timeInfo: TimeInfo) => {
        setExamSetupModalVisible(false);
        // `ExamSessionScreen` creates the session; just pass config/time.
        navigation.navigate('ExamSession' as never, {
            examConfig: config,
            timeInfo,
        } as never);
    };

    // Get icon for topic based on id
    const getTopicIcon = (topicId: string): string => {
        const iconMap: { [key: string]: string } = {
            'polynomials': 'function-variant',
            'rational_functions': 'chart-line-variant',
            'indices_surds_logs': 'exponent',
            'quadratic_functions': 'chart-bell-curve',
            'functions': 'swap-horizontal',
            'coordinate_geometry': 'axis-arrow',
            'sequences_series': 'format-list-numbered',
            'binomial_theorem': 'vector-triangle',
            'trigonometry_basic': 'sine-wave',
            'differentiation_basic': 'slope-uphill',
            'applications_differentiation': 'chart-areaspline',
            'integration_basic': 'sigma',
            'further_trigonometry': 'cosine-wave',
            'hyperbolic_functions': 'math-integral',
            'further_differentiation': 'function',
            'further_integration': 'math-integral-box',
            'differential_equations': 'delta',
            'complex_numbers': 'alpha-i-circle',
            'matrices': 'grid',
            'vectors_3d': 'axis-x-rotate-counterclockwise',
            'summation_series': 'sigma',
            'numerical_methods': 'calculator-variant',
            'proof': 'check-decagram',
            'groups': 'set-center',
        };
        return iconMap[topicId] || 'math-compass';
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#0D0F1C' : '#F8F9FC' }]}>
            {/* Loading Overlay */}
            <LoadingProgress
                visible={isGeneratingQuestion}
                message="DeepSeek is generating your A Level Pure Mathematics question..."
                estimatedTime={10}
                stage="Thinking"
                steps={pureMathThinkingSteps}
            />

            <StatusBar barStyle="light-content" />

            {/* Premium Header with decorative elements */}
            <LinearGradient
                colors={pureMathTheme.gradient.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                {/* Decorative background shapes */}
                <View style={styles.headerDecoration}>
                    <View style={[styles.decorCircle, styles.decorCircle1]} />
                    <View style={[styles.decorCircle, styles.decorCircle2]} />
                    <View style={[styles.decorCircle, styles.decorCircle3]} />
                </View>

                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>

                        <Text style={styles.title}>Pure Mathematics</Text>
                        <View style={styles.subtitleRow}>
                            <View style={styles.syllabusTag}>
                                <Text style={styles.syllabusText}>ZIMSEC 6042</Text>
                            </View>
                            <Text style={styles.topicCount}>{topicCounts.total} Topics</Text>
                        </View>
                    </View>

                    <View style={styles.headerIcon}>
                        <MaterialCommunityIcons name="math-integral-box" size={42} color="rgba(255,255,255,0.95)" />
                    </View>
                </View>
            </LinearGradient>

            {/* Premium Level Tabs */}
            <View style={[
                styles.tabContainer,
                { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }
            ]}>
                <TouchableOpacity
                    style={[styles.tab, selectedLevel === 'Lower Sixth' && styles.tabActive]}
                    onPress={() => setSelectedLevel('Lower Sixth')}
                    activeOpacity={0.8}
                >
                    {selectedLevel === 'Lower Sixth' ? (
                        <LinearGradient
                            colors={pureMathTheme.gradient.lowerSixth}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.tabGradient}
                        >
                            <Text style={styles.tabTextActive}>Lower Sixth</Text>
                            <Text style={styles.tabSubtext}>Form 5 • {topicCounts.lowerSixth}</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={[styles.tabText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }]}>
                                Lower Sixth
                            </Text>
                            <Text style={[styles.tabSubtextInactive, { color: isDarkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }]}>
                                Form 5 • {topicCounts.lowerSixth}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, selectedLevel === 'Upper Sixth' && styles.tabActive]}
                    onPress={() => setSelectedLevel('Upper Sixth')}
                    activeOpacity={0.8}
                >
                    {selectedLevel === 'Upper Sixth' ? (
                        <LinearGradient
                            colors={pureMathTheme.gradient.upperSixth}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.tabGradient}
                        >
                            <Text style={styles.tabTextActive}>Upper Sixth</Text>
                            <Text style={styles.tabSubtext}>Form 6 • {topicCounts.upperSixth}</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={[styles.tabText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }]}>
                                Upper Sixth
                            </Text>
                            <Text style={[styles.tabSubtextInactive, { color: isDarkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }]}>
                                Form 6 • {topicCounts.upperSixth}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Feature Cards Section */}
                <View style={styles.section}>
                    <ALevelFeatureCard
                        title="Mathematics Notes"
                        subtitle="Comprehensive A Level notes with worked examples"
                        icon={<MaterialCommunityIcons name="book-open-page-variant" size={26} color="#8B5CF6" />}
                        iconBgColor="rgba(139, 92, 246, 0.12)"
                        onPress={handlePureMathNotes}
                        isDarkMode={isDarkMode}
                    />

                    <ALevelFeatureCard
                        title="AI Math Tutor"
                        subtitle="Interactive Socratic tutoring powered by DeepSeek"
                        icon={<Ionicons name="school-outline" size={26} color="#EC4899" />}
                        iconBgColor="rgba(236, 72, 153, 0.12)"
                        onPress={handleAITutor}
                        isDarkMode={isDarkMode}
                    />

                    <ALevelFeatureCard
                        title="Formula Sheet"
                        subtitle="Quick reference for all A Level formulas"
                        icon={<MaterialCommunityIcons name="math-compass" size={26} color="#06B6D4" />}
                        iconBgColor="rgba(6, 182, 212, 0.12)"
                        onPress={handleFormulaSheet}
                        isDarkMode={isDarkMode}
                    />

                    {/* Premium Exam Card */}
                    <ALevelExamCard
                        title={`Start ${selectedLevel} Exam`}
                        subtitle={`Mixed questions from all ${selectedLevel} topics`}
                        gradientColors={selectedLevel === 'Lower Sixth'
                            ? pureMathTheme.gradient.lowerSixth
                            : pureMathTheme.gradient.upperSixth}
                        icon={<MaterialCommunityIcons name="file-document-edit-outline" size={28} color="#FFFFFF" />}
                        onPress={handleStartExam}
                    />
                </View>

                {/* Topics Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
                            {selectedLevel} Topics
                        </Text>
                        <View style={[styles.aiPoweredBadge, { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)' }]}>
                            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#8B5CF6" />
                            <Text style={styles.aiPoweredText}>DeepSeek AI</Text>
                        </View>
                    </View>
                    <Text style={[styles.sectionSubtitle, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,46,0.5)' }]}>
                        Tap any topic to start practicing
                    </Text>

                    {filteredTopics.map((topic, index) => (
                        <ALevelTopicCard
                            key={topic.id}
                            title={topic.name}
                            description={topic.description}
                            icon={getTopicIcon(topic.id)}
                            primaryColor={currentPrimaryColor}
                            badges={[
                                {
                                    text: topic.paperRelevance,
                                    color: currentPrimaryColor,
                                    icon: 'file-document-outline'
                                },
                            ]}
                            objectives={topic.learningObjectives.length}
                            onPress={() => handleTopicPress(topic)}
                            index={index}
                            isDarkMode={isDarkMode}
                        />
                    ))}
                </View>

                {/* Info Card */}
                <View style={styles.section}>
                    <ALevelInfoCard
                        title="ZIMSEC A Level Pure Mathematics"
                        content={`Syllabus Code: 6042\nPaper 1 & 2 • 3 hours each • 120 marks\nQuestions generated using DeepSeek AI`}
                        gradientColors={isDarkMode
                            ? ['rgba(139, 92, 246, 0.08)', 'rgba(236, 72, 153, 0.05)']
                            : ['rgba(139, 92, 246, 0.06)', 'rgba(236, 72, 153, 0.04)']}
                        iconColor="#8B5CF6"
                        isDarkMode={isDarkMode}
                    />
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 32 }} />
            </ScrollView>

            {/* Exam Setup Modal */}
            <ExamSetupModal
                visible={examSetupModalVisible}
                onClose={() => setExamSetupModalVisible(false)}
                onStartExam={handleExamStart}
                initialSubject="pure_math"
                userCredits={user?.credits || 0}
                availableTopics={filteredTopics.map(t => t.name)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },

    // Header Styles
    header: {
        paddingTop: Platform.OS === 'ios' ? 56 : 44,
        paddingBottom: 28,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        overflow: 'hidden',
    },
    headerDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    decorCircle: {
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
    decorCircle1: {
        width: 180,
        height: 180,
        top: -60,
        right: -40,
    },
    decorCircle2: {
        width: 100,
        height: 100,
        bottom: -30,
        left: 20,
    },
    decorCircle3: {
        width: 60,
        height: 60,
        top: 40,
        left: -20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flex: 1,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 6,
    },
    backButtonText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        fontWeight: '600',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
        marginBottom: 8,
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    syllabusTag: {
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    syllabusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    topicCount: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
        fontWeight: '500',
    },
    headerIcon: {
        width: 68,
        height: 68,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },

    // Tab Styles
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 16,
        padding: 5,
    },
    tab: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    tabActive: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    tabGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 12,
    },
    tabInactive: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
    },
    tabTextActive: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.2,
    },
    tabSubtext: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.85)',
        marginTop: 2,
        fontWeight: '500',
    },
    tabSubtextInactive: {
        fontSize: 11,
        marginTop: 2,
    },

    // Section Styles
    section: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    sectionSubtitle: {
        fontSize: 13,
        marginBottom: 16,
    },
    aiPoweredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 4,
    },
    aiPoweredText: {
        color: '#8B5CF6',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default ALevelPureMathScreen;
