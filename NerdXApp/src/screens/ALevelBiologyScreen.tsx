// A Level Biology Screen - ZIMSEC Syllabus (6030)
// Premium Modern UI with glass-morphism and professional polish
// Supports MCQ, Structured Questions, and Essay question types
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
    Modal as RNModal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { useNotification } from '../context/NotificationContext';
import {
    aLevelBiologyTopics,
    ALevelBiologyTopic,
    biologyQuestionTypes,
    BiologyQuestionType,
    BiologyQuestionTypeInfo,
    topicCounts
} from '../data/aLevelBiology';
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

// Premium color palette for Biology
const biologyTheme = {
    primary: '#10B981',       // Emerald
    secondary: '#34D399',     // Light emerald  
    tertiary: '#059669',      // Deep emerald
    accent: '#6EE7B7',        // Soft mint
    gradient: {
        header: ['#059669', '#10B981', '#34D399'] as [string, string, string],
        lowerSixth: ['#10B981', '#059669'] as [string, string],
        upperSixth: ['#0891B2', '#06B6D4'] as [string, string],
    },
    lowerSixthPrimary: '#10B981',
    upperSixthPrimary: '#0891B2',
};

const ALevelBiologyScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, updateUser } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const { showSuccess, showError, showWarning } = useNotification();

    const [selectedLevel, setSelectedLevel] = useState<'Lower Sixth' | 'Upper Sixth'>('Lower Sixth');
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    // Question type modal state
    const [questionTypeModalVisible, setQuestionTypeModalVisible] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<ALevelBiologyTopic | null>(null);
    const [selectedQuestionType, setSelectedQuestionType] = useState<BiologyQuestionTypeInfo | null>(null);

    // Exam setup modal state
    const [examSetupModalVisible, setExamSetupModalVisible] = useState(false);

    // Filter topics by selected level
    const filteredTopics = aLevelBiologyTopics.filter(
        topic => topic.difficulty === selectedLevel
    );

    const currentPrimaryColor = selectedLevel === 'Lower Sixth'
        ? biologyTheme.lowerSixthPrimary
        : biologyTheme.upperSixthPrimary;

    const handleTopicPress = async (topic: ALevelBiologyTopic) => {
        // Always show the question type selection modal for each new topic
        // This ensures users explicitly choose MCQ, Structured, or Essay for each topic
        setSelectedTopic(topic);
        setQuestionTypeModalVisible(true);
    };

    const handleQuestionTypeSelect = async (questionType: BiologyQuestionType) => {
        setQuestionTypeModalVisible(false);
        const questionTypeInfo = biologyQuestionTypes.find(t => t.id === questionType) || { id: questionType, name: questionType, description: '', icon: '', color: '#10B981', marks: '', timeGuide: '' };
        setSelectedQuestionType(questionTypeInfo);

        // If a topic was already selected, generate question first before navigating
        if (selectedTopic) {
            await startQuestion(selectedTopic, questionType);
        }
    };

    const startQuestion = async (topic: ALevelBiologyTopic, questionType: BiologyQuestionType) => {
        try {
            // A-Level Biology: MCQ = 0.25 credit, Structured/Essay = 0.5 credit
            const creditCost = questionType === 'mcq' ? 0.25 : 0.5;
            const currentCredits = user?.credits || 0;
            if (currentCredits < creditCost) {
                showError(`❌ Insufficient credits! You need at least ${creditCost} credit${creditCost === 0.25 ? '' : 's'}. Please top up your credits.`, 5000);
                return;
            }

            if (currentCredits <= 5 && currentCredits > 0) {
                showWarning(`⚠️ Low credits! You have ${currentCredits} credits remaining.`, 4000);
            }

            setLoadingMessage(getLoadingMessage(questionType));
            setIsGeneratingQuestion(true);

            const question = await quizApi.generateQuestion(
                'a_level_biology',
                topic.id,
                'medium',
                'topical',
                'Biology',
                questionType,  // Pass questionType (mcq, structured, essay)
                undefined,     // questionFormat (not needed for A-Level Biology)
                questionType   // Also pass as question_type for backend
            );

            setIsGeneratingQuestion(false);

            if (question) {
                // Backend deducts credits - update UI estimate based on question type
                const newCredits = Math.max(0, (user?.credits || 0) - creditCost);
                updateUser({ credits: newCredits });

                const costText = creditCost === 0.25 ? '0.25 credit' : '0.5 credit';
                showSuccess(`✅ ${questionType.toUpperCase()} question generated! (-${costText}) ${newCredits} credits remaining.`, 3000);

                if (newCredits <= 3 && newCredits > 0) {
                    setTimeout(() => {
                        showWarning(`⚠️ Running low on credits! Only ${newCredits} credits left.`, 5000);
                    }, 3500);
                }

                navigation.navigate('Quiz' as never, {
                    question,
                    subject: { id: 'a_level_biology', name: 'A Level Biology' },
                    topic: { id: topic.id, name: topic.name },
                    questionType: questionType
                } as never);
            } else {
                showError('❌ Failed to generate question. Please try again.', 4000);
            }
        } catch (error: any) {
            setIsGeneratingQuestion(false);
            const errorMessage = error.response?.data?.message || 'Failed to generate question';
            showError(`❌ ${errorMessage}`, 5000);
            Alert.alert('Error', errorMessage);
        }
    };

    const getLoadingMessage = (type: BiologyQuestionType): string => {
        switch (type) {
            case 'mcq':
                return 'Preparing your Multiple Choice question...';
            case 'structured':
                return 'Preparing your Structured question...';
            case 'essay':
                return 'Preparing your Essay question...';
            default:
                return 'Preparing your A Level Biology question...';
        }
    };

    const handleBiologyNotes = () => {
        navigation.navigate('ALevelBiologyNotes' as never);
    };

    const handleAITutor = () => {
        navigation.navigate('TeacherModeSetup' as never, {
            preselectedSubject: 'A Level Biology',
        } as never);
    };

    const handleVirtualLab = () => {
        navigation.navigate('VirtualLab' as never);
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

    // Get icon for topic
    const getTopicIcon = (topicId: string): string => {
        const iconMap: { [key: string]: string } = {
            'cell_structure': 'bacteria-outline',
            'biological_molecules': 'molecule',
            'enzymes': 'flask-outline',
            'cell_membranes': 'circle-double',
            'cell_division': 'reload',
            'nucleic_acids': 'dna',
            'transport_plants': 'leaf',
            'transport_mammals': 'heart-pulse',
            'gas_exchange': 'lungs',
            'infectious_diseases': 'virus',
            'immunity': 'shield-check',
            'smoking_health': 'smoking-off',
            'energy_respiration': 'lightning-bolt',
            'photosynthesis': 'white-balance-sunny',
            'homeostasis': 'scale-balance',
            'excretion': 'kidney',
            'nervous_coordination': 'brain',
            'hormonal_coordination': 'chemical-weapon',
            'meiosis_genetics': 'family-tree',
            'selection_evolution': 'chart-timeline-variant',
            'biodiversity_classification': 'pine-tree',
            'genetic_technology': 'scissors-cutting',
            'ecology': 'earth',
            'human_environment': 'factory',
            'reproduction': 'baby-carriage',
        };
        return iconMap[topicId] || 'leaf';
    };

    // Premium Question Type Selection Modal
    const renderQuestionTypeModal = () => (
        <RNModal
            visible={questionTypeModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
                setQuestionTypeModalVisible(false);
                setSelectedTopic(null);
            }}
        >
            <View style={styles.modalOverlay}>
                <View style={[
                    styles.modalContent,
                    { backgroundColor: isDarkMode ? '#1A1C2E' : '#FFFFFF' }
                ]}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <View>
                            <Text style={[
                                styles.modalTitle,
                                { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }
                            ]}>
                                Choose Question Type
                            </Text>
                            <Text style={[
                                styles.modalSubtitle,
                                { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,46,0.5)' }
                            ]}>
                                Select how you want to be tested
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setQuestionTypeModalVisible(false);
                                setSelectedTopic(null);
                            }}
                            style={[
                                styles.closeButton,
                                { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }
                            ]}
                        >
                            <Ionicons
                                name="close"
                                size={20}
                                color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Topic Info */}
                    {selectedTopic && (
                        <View style={[
                            styles.topicInfoBox,
                            { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)' }
                        ]}>
                            <View style={[styles.topicInfoIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                                <MaterialCommunityIcons
                                    name={getTopicIcon(selectedTopic.id) as any}
                                    size={22}
                                    color="#10B981"
                                />
                            </View>
                            <View style={styles.topicInfoText}>
                                <Text style={[
                                    styles.topicInfoTitle,
                                    { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }
                                ]}>
                                    {selectedTopic.name}
                                </Text>
                                <Text style={[
                                    styles.topicInfoLevel,
                                    { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,46,0.5)' }
                                ]}>
                                    {selectedTopic.difficulty} • {selectedTopic.paperRelevance}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Question Type Options */}
                    <View style={styles.questionTypeList}>
                        {biologyQuestionTypes.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.questionTypeCard,
                                    {
                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        borderColor: `${type.color}40`,
                                    }
                                ]}
                                onPress={() => handleQuestionTypeSelect(type.id)}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[`${type.color}20`, `${type.color}08`]}
                                    style={styles.questionTypeIcon}
                                >
                                    <MaterialCommunityIcons
                                        name={type.icon as any}
                                        size={26}
                                        color={type.color}
                                    />
                                </LinearGradient>
                                <View style={styles.questionTypeInfo}>
                                    <Text style={[
                                        styles.questionTypeName,
                                        { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }
                                    ]}>
                                        {type.name}
                                    </Text>
                                    <Text style={[
                                        styles.questionTypeDesc,
                                        { color: isDarkMode ? 'rgba(255,255,255,0.55)' : 'rgba(26,26,46,0.55)' }
                                    ]}>
                                        {type.description}
                                    </Text>
                                    <View style={styles.questionTypeMeta}>
                                        <View style={[styles.metaBadge, { backgroundColor: `${type.color}15` }]}>
                                            <Text style={[styles.metaBadgeText, { color: type.color }]}>
                                                {type.marks}
                                            </Text>
                                        </View>
                                        <Text style={[
                                            styles.questionTypeTime,
                                            { color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,46,0.4)' }
                                        ]}>
                                            {type.timeGuide}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.questionTypeArrow, { backgroundColor: `${type.color}12` }]}>
                                    <Ionicons name="chevron-forward" size={18} color={type.color} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </RNModal>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#0D0F1C' : '#F8F9FC' }]}>
            {/* Loading Overlay */}
            <LoadingProgress
                visible={isGeneratingQuestion}
                message={loadingMessage}
                estimatedTime={7}
            />

            <StatusBar barStyle="light-content" />

            {/* Premium Header */}
            <LinearGradient
                colors={biologyTheme.gradient.header}
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

                        <Text style={styles.title}>A Level Biology</Text>
                        <View style={styles.subtitleRow}>
                            <View style={styles.syllabusTag}>
                                <Text style={styles.syllabusText}>ZIMSEC 6030</Text>
                            </View>
                            <Text style={styles.topicCount}>{topicCounts.total} Topics</Text>
                        </View>
                    </View>

                    <View style={styles.headerIcon}>
                        <MaterialCommunityIcons name="dna" size={42} color="rgba(255,255,255,0.95)" />
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
                            colors={biologyTheme.gradient.lowerSixth}
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
                            colors={biologyTheme.gradient.upperSixth}
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
                        title="Biology Notes"
                        subtitle="Comprehensive A Level notes with diagrams"
                        icon={<MaterialCommunityIcons name="book-open-page-variant" size={26} color="#10B981" />}
                        iconBgColor="rgba(16, 185, 129, 0.12)"
                        onPress={handleBiologyNotes}
                        isDarkMode={isDarkMode}
                    />

                    <ALevelFeatureCard
                        title="AI Biology Tutor"
                        subtitle="Interactive Socratic tutoring powered by DeepSeek"
                        icon={<Ionicons name="school-outline" size={26} color="#0891B2" />}
                        iconBgColor="rgba(8, 145, 178, 0.12)"
                        onPress={handleAITutor}
                        isDarkMode={isDarkMode}
                    />

                    <ALevelFeatureCard
                        title="Virtual Labs"
                        subtitle="Interactive biology experiments & simulations"
                        icon={<MaterialCommunityIcons name="flask" size={26} color="#F59E0B" />}
                        iconBgColor="rgba(245, 158, 11, 0.12)"
                        onPress={handleVirtualLab}
                        isDarkMode={isDarkMode}
                    />

                    {/* Premium Exam Card */}
                    <ALevelExamCard
                        title={`Start ${selectedLevel} Exam`}
                        subtitle="MCQ + Structured + Essay from all topics"
                        gradientColors={selectedLevel === 'Lower Sixth'
                            ? biologyTheme.gradient.lowerSixth
                            : biologyTheme.gradient.upperSixth}
                        icon={<MaterialCommunityIcons name="file-document-edit-outline" size={28} color="#FFFFFF" />}
                        onPress={handleStartExam}
                    />
                </View>

                {/* Question Type Legend */}
                <View style={styles.legendContainer}>
                    <Text style={[
                        styles.legendTitle,
                        { color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,46,0.7)' }
                    ]}>
                        Tap any topic to choose question type:
                    </Text>
                    <View style={styles.legendItems}>
                        {biologyQuestionTypes.map((type) => (
                            <View key={type.id} style={[styles.legendItem, { backgroundColor: `${type.color}12` }]}>
                                <View style={[styles.legendDot, { backgroundColor: type.color }]} />
                                <Text style={[styles.legendText, { color: type.color }]}>
                                    {type.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Topics Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
                            {selectedLevel} Topics
                        </Text>
                        <View style={[
                            styles.aiPoweredBadge,
                            { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)' }
                        ]}>
                            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#10B981" />
                            <Text style={[styles.aiPoweredText, { color: '#10B981' }]}>DeepSeek AI</Text>
                        </View>
                    </View>
                    <Text style={[styles.sectionSubtitle, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,46,0.5)' }]}>
                        Tap a topic to choose MCQ, Structured, or Essay question.
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
                                ...(topic.practicalComponent ? [{
                                    text: 'Practical',
                                    color: '#F59E0B',
                                    icon: 'flask-outline'
                                }] : [])
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
                        title="ZIMSEC A Level Biology"
                        content={`Syllabus Code: 6030\nPaper 1 (MCQ), Paper 2 (Structured), Paper 3 (Practical)\nQuestions generated using DeepSeek AI`}
                        gradientColors={isDarkMode
                            ? ['rgba(16, 185, 129, 0.08)', 'rgba(8, 145, 178, 0.05)']
                            : ['rgba(16, 185, 129, 0.06)', 'rgba(8, 145, 178, 0.04)']}
                        iconColor="#10B981"
                        isDarkMode={isDarkMode}
                    />
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 32 }} />
            </ScrollView>

            {/* Question Type Selection Modal */}
            {renderQuestionTypeModal()}

            {/* Exam Setup Modal */}
            <ExamSetupModal
                visible={examSetupModalVisible}
                onClose={() => setExamSetupModalVisible(false)}
                onStartExam={handleExamStart}
                initialSubject="a_level_biology"
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

    // Legend Styles
    legendContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    legendTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 10,
    },
    legendItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 12,
        fontWeight: '600',
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
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    modalSubtitle: {
        fontSize: 13,
        marginTop: 4,
    },
    closeButton: {
        padding: 8,
        borderRadius: 12,
    },
    topicInfoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        marginBottom: 20,
        gap: 12,
    },
    topicInfoIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicInfoText: {
        flex: 1,
    },
    topicInfoTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    topicInfoLevel: {
        fontSize: 12,
        marginTop: 2,
    },
    questionTypeList: {
        gap: 12,
    },
    questionTypeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        gap: 14,
    },
    questionTypeIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionTypeInfo: {
        flex: 1,
    },
    questionTypeName: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    questionTypeDesc: {
        fontSize: 12.5,
        marginTop: 3,
        lineHeight: 17,
    },
    questionTypeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 10,
    },
    metaBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    metaBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    questionTypeTime: {
        fontSize: 11,
        fontWeight: '500',
    },
    questionTypeArrow: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ALevelBiologyScreen;
