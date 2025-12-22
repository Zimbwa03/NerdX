// A Level Biology Screen - ZIMSEC Syllabus (6030)
// Professional UI with 24 topics organized by Lower/Upper Sixth
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
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import { Card } from '../components/Card';
import { Icons, IconCircle } from '../components/Icons';
import { 
    aLevelBiologyTopics, 
    ALevelBiologyTopic, 
    biologyQuestionTypes,
    BiologyQuestionType,
    topicCounts 
} from '../data/aLevelBiology';
import { quizApi } from '../services/api/quizApi';
import LoadingProgress from '../components/LoadingProgress';

const { width } = Dimensions.get('window');

// Theme colors for Biology (Green/Emerald theme)
const biologyColors = {
    primary: ['#059669', '#10B981', '#34D399'], // Emerald gradient
    secondary: ['#047857', '#059669'], // Darker emerald
    lowerSixth: ['#10B981', '#059669'], // Green
    upperSixth: ['#0891B2', '#06B6D4'], // Cyan for contrast
    accent: '#34D399',
    light: 'rgba(16, 185, 129, 0.1)',
};

const ALevelBiologyScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, updateUser } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [selectedLevel, setSelectedLevel] = useState<'Lower Sixth' | 'Upper Sixth'>('Lower Sixth');
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    
    // Question type modal state
    const [questionTypeModalVisible, setQuestionTypeModalVisible] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<ALevelBiologyTopic | null>(null);

    // Filter topics by selected level
    const filteredTopics = aLevelBiologyTopics.filter(
        topic => topic.difficulty === selectedLevel
    );

    const handleTopicPress = (topic: ALevelBiologyTopic) => {
        setSelectedTopic(topic);
        setQuestionTypeModalVisible(true);
    };

    const handleQuestionTypeSelect = async (questionType: BiologyQuestionType) => {
        setQuestionTypeModalVisible(false);
        
        if (!selectedTopic) return;
        
        if (!user || (user.credits || 0) < 1) {
            Alert.alert(
                'Insufficient Credits',
                'You need at least 1 credit to start a quiz. Please buy credits first.',
                [{ text: 'OK' }]
            );
            return;
        }

        const typeInfo = biologyQuestionTypes.find(t => t.id === questionType);
        const typeName = typeInfo?.name || questionType;

        Alert.alert(
            `Start ${typeName}`,
            `Topic: ${selectedTopic.name}\n\n📚 ${selectedTopic.description}\n\n⏱ ${typeInfo?.timeGuide || ''}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Start',
                    onPress: () => startQuestion(selectedTopic, questionType),
                },
            ]
        );
    };

    const startQuestion = async (topic: ALevelBiologyTopic, questionType: BiologyQuestionType) => {
        try {
            setLoadingMessage(getLoadingMessage(questionType));
            setIsGeneratingQuestion(true);

            const question = await quizApi.generateQuestion(
                'a_level_biology',
                topic.id,
                'medium',
                'topical',
                'Biology',
                questionType // Pass question type to API
            );

            setIsGeneratingQuestion(false);

            if (question) {
                navigation.navigate('Quiz' as never, {
                    question,
                    subject: { id: 'a_level_biology', name: 'A Level Biology' },
                    topic: { id: topic.id, name: topic.name },
                    questionType: questionType
                } as never);
                const newCredits = (user?.credits || 0) - 1;
                updateUser({ credits: newCredits });
            }
        } catch (error: any) {
            setIsGeneratingQuestion(false);
            Alert.alert('Error', error.response?.data?.message || 'Failed to generate question');
        }
    };

    const getLoadingMessage = (type: BiologyQuestionType): string => {
        switch (type) {
            case 'mcq':
                return 'DeepSeek is generating your Multiple Choice question...';
            case 'structured':
                return 'DeepSeek is preparing a detailed Structured question...';
            case 'essay':
                return 'DeepSeek is crafting your Essay question...';
            default:
                return 'Generating your A Level Biology question...';
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

    const handleStartExam = async () => {
        if (!user || (user.credits || 0) < 1) {
            Alert.alert(
                'Insufficient Credits',
                'You need at least 1 credit to start an exam.',
                [{ text: 'OK' }]
            );
            return;
        }

        Alert.alert(
            'Start Exam',
            `Start A Level Biology ${selectedLevel} Exam?\n\nThis exam will include mixed MCQs, Structured Questions, and Essay prompts from ${selectedLevel} topics.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Start',
                    onPress: async () => {
                        try {
                            setLoadingMessage('DeepSeek is preparing your A Level Biology exam...');
                            setIsGeneratingQuestion(true);

                            const question = await quizApi.generateQuestion(
                                'a_level_biology',
                                undefined,
                                'medium',
                                'exam',
                                selectedLevel
                            );

                            setIsGeneratingQuestion(false);

                            if (question) {
                                navigation.navigate('Quiz' as never, {
                                    question,
                                    subject: { id: 'a_level_biology', name: 'A Level Biology' }
                                } as never);
                                const newCredits = (user.credits || 0) - 1;
                                updateUser({ credits: newCredits });
                            }
                        } catch (error: any) {
                            setIsGeneratingQuestion(false);
                            Alert.alert('Error', error.response?.data?.message || 'Failed to start exam');
                        }
                    },
                },
            ]
        );
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

    // Question Type Selection Modal
    const renderQuestionTypeModal = () => (
        <RNModal
            visible={questionTypeModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setQuestionTypeModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: themedColors.background.paper }]}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: themedColors.text.primary }]}>
                            Choose Question Type
                        </Text>
                        <TouchableOpacity
                            onPress={() => setQuestionTypeModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color={themedColors.text.secondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Topic Info */}
                    {selectedTopic && (
                        <View style={[styles.topicInfoBox, { backgroundColor: biologyColors.light }]}>
                            <MaterialCommunityIcons
                                name={getTopicIcon(selectedTopic.id) as any}
                                size={24}
                                color="#10B981"
                            />
                            <View style={styles.topicInfoText}>
                                <Text style={[styles.topicInfoTitle, { color: themedColors.text.primary }]}>
                                    {selectedTopic.name}
                                </Text>
                                <Text style={[styles.topicInfoLevel, { color: themedColors.text.secondary }]}>
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
                                style={[styles.questionTypeCard, { borderColor: type.color }]}
                                onPress={() => handleQuestionTypeSelect(type.id)}
                            >
                                <View style={[styles.questionTypeIcon, { backgroundColor: `${type.color}20` }]}>
                                    <MaterialCommunityIcons
                                        name={type.icon as any}
                                        size={28}
                                        color={type.color}
                                    />
                                </View>
                                <View style={styles.questionTypeInfo}>
                                    <Text style={[styles.questionTypeName, { color: themedColors.text.primary }]}>
                                        {type.name}
                                    </Text>
                                    <Text style={[styles.questionTypeDesc, { color: themedColors.text.secondary }]}>
                                        {type.description}
                                    </Text>
                                    <View style={styles.questionTypeMeta}>
                                        <Text style={[styles.questionTypeMarks, { color: type.color }]}>
                                            {type.marks}
                                        </Text>
                                        <Text style={[styles.questionTypeTime, { color: themedColors.text.secondary }]}>
                                            {type.timeGuide}
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color={type.color} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </RNModal>
    );

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            {/* Loading Overlay */}
            <LoadingProgress
                visible={isGeneratingQuestion}
                message={loadingMessage}
                estimatedTime={12}
            />

            <StatusBar barStyle="light-content" />

            {/* Header with Green Gradient */}
            <LinearGradient
                colors={biologyColors.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Text style={styles.backButtonText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>A Level Biology</Text>
                        <Text style={styles.subtitle}>ZIMSEC Syllabus 6030 • {topicCounts.total} Topics</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <MaterialCommunityIcons name="dna" size={48} color="rgba(255,255,255,0.9)" />
                    </View>
                </View>
            </LinearGradient>

            {/* Level Tabs */}
            <View style={[styles.tabContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <TouchableOpacity
                    style={[styles.tab, selectedLevel === 'Lower Sixth' && styles.tabActive]}
                    onPress={() => setSelectedLevel('Lower Sixth')}
                >
                    {selectedLevel === 'Lower Sixth' ? (
                        <LinearGradient colors={biologyColors.lowerSixth} style={styles.tabGradient}>
                            <Text style={styles.tabTextActive}>Lower Sixth</Text>
                            <Text style={styles.tabSubtext}>Form 5 • {topicCounts.lowerSixth} Topics</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={[styles.tabText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }]}>Lower Sixth</Text>
                            <Text style={[styles.tabSubtextInactive, { color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }]}>Form 5 • {topicCounts.lowerSixth} Topics</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedLevel === 'Upper Sixth' && styles.tabActive]}
                    onPress={() => setSelectedLevel('Upper Sixth')}
                >
                    {selectedLevel === 'Upper Sixth' ? (
                        <LinearGradient colors={biologyColors.upperSixth} style={styles.tabGradient}>
                            <Text style={styles.tabTextActive}>Upper Sixth</Text>
                            <Text style={styles.tabSubtext}>Form 6 • {topicCounts.upperSixth} Topics</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={[styles.tabText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }]}>Upper Sixth</Text>
                            <Text style={[styles.tabSubtextInactive, { color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }]}>Form 6 • {topicCounts.upperSixth} Topics</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Feature Buttons */}
                <View style={styles.featuresContainer}>
                    {/* Biology Notes */}
                    <Card variant="elevated" onPress={handleBiologyNotes} style={styles.featureCard}>
                        <View style={styles.featureContent}>
                            <IconCircle
                                icon={<MaterialCommunityIcons name="book-open-page-variant" size={28} color="#10B981" />}
                                size={56}
                                backgroundColor={biologyColors.light}
                            />
                            <View style={styles.featureInfo}>
                                <Text style={[styles.featureTitle, { color: themedColors.text.primary }]}>Biology Notes</Text>
                                <Text style={[styles.featureSubtitle, { color: themedColors.text.secondary }]}>Comprehensive A Level notes with diagrams</Text>
                            </View>
                            {Icons.arrowRight(24, Colors.text.secondary)}
                        </View>
                    </Card>

                    {/* AI Biology Tutor */}
                    <Card variant="elevated" onPress={handleAITutor} style={styles.featureCard}>
                        <View style={styles.featureContent}>
                            <IconCircle
                                icon={<Ionicons name="school-outline" size={28} color="#0891B2" />}
                                size={56}
                                backgroundColor="rgba(8, 145, 178, 0.1)"
                            />
                            <View style={styles.featureInfo}>
                                <Text style={[styles.featureTitle, { color: themedColors.text.primary }]}>AI Biology Tutor</Text>
                                <Text style={[styles.featureSubtitle, { color: themedColors.text.secondary }]}>Interactive Socratic tutoring with DeepSeek</Text>
                            </View>
                            {Icons.arrowRight(24, Colors.text.secondary)}
                        </View>
                    </Card>

                    {/* Virtual Lab */}
                    <Card variant="elevated" onPress={handleVirtualLab} style={styles.featureCard}>
                        <View style={styles.featureContent}>
                            <IconCircle
                                icon={<MaterialCommunityIcons name="flask" size={28} color="#F59E0B" />}
                                size={56}
                                backgroundColor="rgba(245, 158, 11, 0.1)"
                            />
                            <View style={styles.featureInfo}>
                                <Text style={[styles.featureTitle, { color: themedColors.text.primary }]}>Virtual Labs</Text>
                                <Text style={[styles.featureSubtitle, { color: themedColors.text.secondary }]}>Interactive biology experiments</Text>
                            </View>
                            {Icons.arrowRight(24, Colors.text.secondary)}
                        </View>
                    </Card>

                    {/* Start Exam */}
                    <Card
                        variant="gradient"
                        gradientColors={selectedLevel === 'Lower Sixth'
                            ? biologyColors.lowerSixth
                            : biologyColors.upperSixth}
                        onPress={handleStartExam}
                        style={styles.examCard}
                    >
                        <View style={styles.examContent}>
                            <IconCircle
                                icon={Icons.quiz(32, '#FFFFFF')}
                                size={64}
                                backgroundColor="rgba(255, 255, 255, 0.2)"
                            />
                            <View style={styles.examInfo}>
                                <Text style={styles.examTitle}>Start {selectedLevel} Exam</Text>
                                <Text style={styles.examSubtitle}>MCQ + Structured + Essay from all topics</Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Question Type Legend */}
                <View style={styles.legendContainer}>
                    <Text style={[styles.legendTitle, { color: themedColors.text.primary }]}>
                        Tap any topic to choose:
                    </Text>
                    <View style={styles.legendItems}>
                        {biologyQuestionTypes.map((type) => (
                            <View key={type.id} style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: type.color }]} />
                                <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>
                                    {type.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Topics List */}
                <View style={styles.topicsContainer}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                        {selectedLevel} Topics
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: themedColors.text.secondary }]}>
                        Tap a topic to select question type • Powered by DeepSeek AI
                    </Text>

                    {filteredTopics.map((topic, index) => (
                        <Card
                            key={topic.id}
                            variant="elevated"
                            onPress={() => handleTopicPress(topic)}
                            style={styles.topicCard}
                        >
                            <View style={styles.topicContent}>
                                <View style={[
                                    styles.topicNumber,
                                    {
                                        backgroundColor: selectedLevel === 'Lower Sixth'
                                            ? biologyColors.light
                                            : 'rgba(8, 145, 178, 0.1)'
                                    }
                                ]}>
                                    <MaterialCommunityIcons
                                        name={getTopicIcon(topic.id) as any}
                                        size={24}
                                        color={selectedLevel === 'Lower Sixth' ? '#10B981' : '#0891B2'}
                                    />
                                </View>
                                <View style={styles.topicInfo}>
                                    <Text style={[styles.topicName, { color: themedColors.text.primary }]}>
                                        {topic.name}
                                    </Text>
                                    <Text style={[styles.topicDescription, { color: themedColors.text.secondary }]} numberOfLines={2}>
                                        {topic.description}
                                    </Text>
                                    <View style={styles.topicBadges}>
                                        <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                                            <Text style={[styles.badgeText, { color: '#10B981' }]}>
                                                {topic.paperRelevance}
                                            </Text>
                                        </View>
                                        {topic.practicalComponent && (
                                            <View style={[styles.badge, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                                                <Text style={[styles.badgeText, { color: '#F59E0B' }]}>
                                                    🧪 Practical
                                                </Text>
                                            </View>
                                        )}
                                        <View style={[styles.badge, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                                            <Text style={[styles.badgeText, { color: '#3B82F6' }]}>
                                                {topic.learningObjectives.length} objectives
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={24}
                                    color={selectedLevel === 'Lower Sixth' ? '#10B981' : '#0891B2'}
                                />
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Bottom Info Card */}
                <View style={styles.infoContainer}>
                    <LinearGradient
                        colors={['rgba(16, 185, 129, 0.1)', 'rgba(8, 145, 178, 0.1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.infoCard}
                    >
                        <MaterialCommunityIcons name="information-outline" size={24} color="#10B981" />
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoTitle, { color: themedColors.text.primary }]}>
                                ZIMSEC A Level Biology
                            </Text>
                            <Text style={[styles.infoText, { color: themedColors.text.secondary }]}>
                                Syllabus Code: 6030{'\n'}
                                Paper 1 (MCQ), Paper 2 (Structured), Paper 3 (Practical){'\n'}
                                Questions generated using DeepSeek AI
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Question Type Selection Modal */}
            {renderQuestionTypeModal()}
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
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        marginBottom: 8,
    },
    backButtonText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
    },
    headerIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 16,
        padding: 4,
    },
    tab: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    tabActive: {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    tabGradient: {
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    tabInactive: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
    },
    tabTextActive: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    tabSubtext: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    tabSubtextInactive: {
        fontSize: 11,
        marginTop: 2,
    },
    featuresContainer: {
        padding: 20,
        paddingTop: 10,
    },
    featureCard: {
        marginBottom: 12,
        borderColor: Colors.border.light,
        borderWidth: 1,
    },
    featureContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        gap: 16,
    },
    featureInfo: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    featureSubtitle: {
        fontSize: 14,
    },
    examCard: {
        marginTop: 8,
        marginBottom: 12,
    },
    examContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    examInfo: {
        marginLeft: 20,
        flex: 1,
    },
    examTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    examSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.85)',
    },
    legendContainer: {
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    legendTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    legendItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 12,
    },
    topicsContainer: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        marginBottom: 16,
    },
    topicCard: {
        marginBottom: 12,
        borderColor: Colors.border.light,
        borderWidth: 1,
    },
    topicContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        gap: 12,
    },
    topicNumber: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicInfo: {
        flex: 1,
    },
    topicName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    topicDescription: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 6,
    },
    topicBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    infoContainer: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        alignItems: 'flex-start',
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        lineHeight: 20,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    topicInfoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    topicInfoText: {
        flex: 1,
    },
    topicInfoTitle: {
        fontSize: 16,
        fontWeight: '600',
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
        borderWidth: 2,
        backgroundColor: 'transparent',
        gap: 12,
    },
    questionTypeIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionTypeInfo: {
        flex: 1,
    },
    questionTypeName: {
        fontSize: 18,
        fontWeight: '600',
    },
    questionTypeDesc: {
        fontSize: 13,
        marginTop: 2,
    },
    questionTypeMeta: {
        flexDirection: 'row',
        marginTop: 6,
        gap: 12,
    },
    questionTypeMarks: {
        fontSize: 12,
        fontWeight: '600',
    },
    questionTypeTime: {
        fontSize: 12,
    },
});

export default ALevelBiologyScreen;

