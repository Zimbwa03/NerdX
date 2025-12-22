// A Level Pure Mathematics Screen - ZIMSEC Syllabus (6042)
// Professional UI with all 24 topics organized by Lower/Upper Sixth
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
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import { Card } from '../components/Card';
import { Icons, IconCircle } from '../components/Icons';
import { aLevelPureMathTopics, ALevelPureMathTopic, topicCounts } from '../data/aLevelPureMath';
import { quizApi } from '../services/api/quizApi';
import LoadingProgress from '../components/LoadingProgress';

const { width } = Dimensions.get('window');

// Theme colors for Pure Mathematics (Purple/Violet theme)
const pureMathColors = {
    primary: ['#7C3AED', '#8B5CF6', '#A78BFA'], // Violet gradient
    secondary: ['#6D28D9', '#7C3AED'], // Darker violet
    lowerSixth: ['#8B5CF6', '#7C3AED'], // Purple
    upperSixth: ['#EC4899', '#DB2777'], // Pink/Magenta for contrast
    accent: '#A78BFA',
    light: 'rgba(139, 92, 246, 0.1)',
};

const ALevelPureMathScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, updateUser } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [selectedLevel, setSelectedLevel] = useState<'Lower Sixth' | 'Upper Sixth'>('Lower Sixth');
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

    // Filter topics by selected level
    const filteredTopics = aLevelPureMathTopics.filter(
        topic => topic.difficulty === selectedLevel
    );

    const handleTopicPress = async (topic: ALevelPureMathTopic) => {
        try {
            if (!user || (user.credits || 0) < 1) {
                Alert.alert(
                    'Insufficient Credits',
                    'You need at least 1 credit to start a quiz. Please buy credits first.',
                    [{ text: 'OK' }]
                );
                return;
            }

            Alert.alert(
                'Start Quiz',
                `Start ${topic.name} quiz?\n\n📚 ${topic.description}`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Start',
                        onPress: async () => {
                            try {
                                setIsGeneratingQuestion(true);

                                // Use DeepSeek for mathematics (not Gemini)
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
                                    const newCredits = (user.credits || 0) - 1;
                                    updateUser({ credits: newCredits });
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

    const handleStartExam = async () => {
        try {
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
                `Start A Level Pure Mathematics ${selectedLevel} Exam?\n\nThis will test you on mixed topics from ${selectedLevel}.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Start',
                        onPress: async () => {
                            try {
                                setIsGeneratingQuestion(true);

                                const question = await quizApi.generateQuestion(
                                    'a_level_pure_math',
                                    undefined,
                                    'medium',
                                    'exam',
                                    selectedLevel
                                );

                                setIsGeneratingQuestion(false);

                                if (question) {
                                    navigation.navigate('Quiz' as never, {
                                        question,
                                        subject: { id: 'a_level_pure_math', name: 'A Level Pure Mathematics' }
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
        } catch (error) {
            Alert.alert('Error', 'Failed to start exam');
        }
    };

    // Get icon for topic based on name
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
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            {/* Loading Overlay */}
            <LoadingProgress
                visible={isGeneratingQuestion}
                message="DeepSeek is generating your A Level Pure Mathematics question..."
                estimatedTime={10}
            />

            <StatusBar barStyle="light-content" />

            {/* Header with Purple Gradient */}
            <LinearGradient
                colors={pureMathColors.primary}
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
                        <Text style={styles.title}>A Level Pure Math</Text>
                        <Text style={styles.subtitle}>ZIMSEC Syllabus 6042 • {topicCounts.total} Topics</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <MaterialCommunityIcons name="math-integral-box" size={48} color="rgba(255,255,255,0.9)" />
                    </View>
                </View>
            </LinearGradient>

            {/* Level Tabs - Lower Sixth / Upper Sixth */}
            <View style={[styles.tabContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedLevel === 'Lower Sixth' && styles.tabActive
                    ]}
                    onPress={() => setSelectedLevel('Lower Sixth')}
                >
                    {selectedLevel === 'Lower Sixth' ? (
                        <LinearGradient
                            colors={pureMathColors.lowerSixth}
                            style={styles.tabGradient}
                        >
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
                    style={[
                        styles.tab,
                        selectedLevel === 'Upper Sixth' && styles.tabActive
                    ]}
                    onPress={() => setSelectedLevel('Upper Sixth')}
                >
                    {selectedLevel === 'Upper Sixth' ? (
                        <LinearGradient
                            colors={pureMathColors.upperSixth}
                            style={styles.tabGradient}
                        >
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
                    {/* Pure Math Notes */}
                    <Card variant="elevated" onPress={handlePureMathNotes} style={styles.featureCard}>
                        <View style={styles.featureContent}>
                            <IconCircle
                                icon={<MaterialCommunityIcons name="book-open-page-variant" size={28} color="#8B5CF6" />}
                                size={56}
                                backgroundColor={pureMathColors.light}
                            />
                            <View style={styles.featureInfo}>
                                <Text style={[styles.featureTitle, { color: themedColors.text.primary }]}>Mathematics Notes</Text>
                                <Text style={[styles.featureSubtitle, { color: themedColors.text.secondary }]}>Comprehensive A Level notes with examples</Text>
                            </View>
                            {Icons.arrowRight(24, Colors.text.secondary)}
                        </View>
                    </Card>

                    {/* AI Math Tutor */}
                    <Card variant="elevated" onPress={handleAITutor} style={styles.featureCard}>
                        <View style={styles.featureContent}>
                            <IconCircle
                                icon={<Ionicons name="school-outline" size={28} color="#EC4899" />}
                                size={56}
                                backgroundColor="rgba(236, 72, 153, 0.1)"
                            />
                            <View style={styles.featureInfo}>
                                <Text style={[styles.featureTitle, { color: themedColors.text.primary }]}>AI Math Tutor</Text>
                                <Text style={[styles.featureSubtitle, { color: themedColors.text.secondary }]}>Interactive Socratic tutoring with DeepSeek</Text>
                            </View>
                            {Icons.arrowRight(24, Colors.text.secondary)}
                        </View>
                    </Card>

                    {/* Formula Sheet */}
                    <Card variant="elevated" onPress={handleFormulaSheet} style={styles.featureCard}>
                        <View style={styles.featureContent}>
                            <IconCircle
                                icon={<MaterialCommunityIcons name="math-compass" size={28} color="#06B6D4" />}
                                size={56}
                                backgroundColor="rgba(6, 182, 212, 0.1)"
                            />
                            <View style={styles.featureInfo}>
                                <Text style={[styles.featureTitle, { color: themedColors.text.primary }]}>Formula Sheet</Text>
                                <Text style={[styles.featureSubtitle, { color: themedColors.text.secondary }]}>Quick reference for all A Level formulas</Text>
                            </View>
                            {Icons.arrowRight(24, Colors.text.secondary)}
                        </View>
                    </Card>

                    {/* Start Exam */}
                    <Card
                        variant="gradient"
                        gradientColors={selectedLevel === 'Lower Sixth'
                            ? pureMathColors.lowerSixth
                            : pureMathColors.upperSixth}
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
                                <Text style={styles.examSubtitle}>Mixed questions from all {selectedLevel} topics</Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Topics List */}
                <View style={styles.topicsContainer}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                        {selectedLevel} Topics
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: themedColors.text.secondary }]}>
                        Tap a topic to practice • Powered by DeepSeek AI
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
                                            ? pureMathColors.light
                                            : 'rgba(236, 72, 153, 0.1)'
                                    }
                                ]}>
                                    <MaterialCommunityIcons
                                        name={getTopicIcon(topic.id) as any}
                                        size={24}
                                        color={selectedLevel === 'Lower Sixth' ? '#8B5CF6' : '#EC4899'}
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
                                        <View style={[styles.badge, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                                            <Text style={[styles.badgeText, { color: '#8B5CF6' }]}>
                                                {topic.paperRelevance}
                                            </Text>
                                        </View>
                                        <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                                            <Text style={[styles.badgeText, { color: '#10B981' }]}>
                                                {topic.learningObjectives.length} objectives
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={24}
                                    color={selectedLevel === 'Lower Sixth' ? '#8B5CF6' : '#EC4899'}
                                />
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Bottom Info Card */}
                <View style={styles.infoContainer}>
                    <LinearGradient
                        colors={['rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.infoCard}
                    >
                        <MaterialCommunityIcons name="information-outline" size={24} color="#8B5CF6" />
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoTitle, { color: themedColors.text.primary }]}>
                                ZIMSEC A Level Pure Mathematics
                            </Text>
                            <Text style={[styles.infoText, { color: themedColors.text.secondary }]}>
                                Syllabus Code: 6042{'\n'}
                                Paper 1 & 2 • 3 hours each • 120 marks{'\n'}
                                Questions generated using DeepSeek AI
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 40 }} />
            </ScrollView>
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
});

export default ALevelPureMathScreen;

