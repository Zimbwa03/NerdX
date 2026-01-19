// A Level Physics Screen - Premium Modern UI
// Professional design with glass-morphism effects
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
import { aLevelPhysicsTopics, ALevelPhysicsTopic } from '../data/aLevelPhysics';
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

// Premium color palette for Physics
const physicsTheme = {
    primary: '#1976D2',       // Blue
    secondary: '#2196F3',     // Light blue
    tertiary: '#1565C0',      // Deep blue
    accent: '#64B5F6',        // Soft blue
    gradient: {
        header: ['#1565C0', '#1976D2', '#2196F3'] as [string, string, string],
        asLevel: ['#1976D2', '#1565C0'] as [string, string],
        a2Level: ['#7B1FA2', '#6A1B9A'] as [string, string],
    },
    asLevelPrimary: '#1976D2',
    a2LevelPrimary: '#7B1FA2',
};

const ALevelPhysicsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, updateUser } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [selectedLevel, setSelectedLevel] = useState<'AS Level' | 'A2 Level'>('AS Level');
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [examSetupModalVisible, setExamSetupModalVisible] = useState(false);

    // Filter topics by selected level
    const filteredTopics = aLevelPhysicsTopics.filter(
        topic => topic.difficulty === selectedLevel
    );

    // Count topics per level
    const asLevelCount = aLevelPhysicsTopics.filter(t => t.difficulty === 'AS Level').length;
    const a2LevelCount = aLevelPhysicsTopics.filter(t => t.difficulty === 'A2 Level').length;

    const currentPrimaryColor = selectedLevel === 'AS Level'
        ? physicsTheme.asLevelPrimary
        : physicsTheme.a2LevelPrimary;

    // Get icon for topic
    const getTopicIcon = (topicId: string, index: number): string => {
        const iconMap: { [key: string]: string } = {
            'physical_quantities': 'ruler-square-compass',
            'kinematics': 'run-fast',
            'dynamics': 'arrow-right-bold',
            'forces': 'vector-combine',
            'work_energy_power': 'flash',
            'deformation': 'spring',
            'waves': 'sine-wave',
            'superposition': 'wave',
            'electricity': 'lightning-bolt',
            'dc_circuits': 'resistor',
            'particle_physics': 'atom',
            'gravitational_fields': 'earth',
            'ideal_gases': 'gas-cylinder',
            'thermodynamics': 'thermometer',
            'oscillations': 'sine-wave',
            'electric_fields': 'electromagnetic',
            'capacitance': 'capacitor',
            'magnetic_fields': 'magnet',
            'alternating_currents': 'current-ac',
            'quantum_physics': 'atom-variant',
            'nuclear_physics': 'radioactive',
            'medical_physics': 'medical-bag',
            'astronomy': 'telescope',
            'cosmology': 'orbit-variant',
        };
        return iconMap[topicId] || 'atom';
    };

    const handleTopicPress = async (topic: ALevelPhysicsTopic) => {
        try {
            // A-Level Physics topical questions cost 0.5 credit
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
                '🔬 Start Quiz',
                `${topic.name}\n\n${topic.description}`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Start Quiz',
                        onPress: async () => {
                            try {
                                setIsGeneratingQuestion(true);

                                const question = await quizApi.generateQuestion(
                                    'a_level_physics',
                                    topic.id,
                                    'medium',
                                    'topical',
                                    'Physics'
                                );

                                setIsGeneratingQuestion(false);

                                if (question) {
                                    navigation.navigate('Quiz' as never, {
                                        question,
                                        subject: { id: 'a_level_physics', name: 'A Level Physics' },
                                        topic: { id: topic.id, name: topic.name }
                                    } as never);
                                    // Backend deducts credits - update UI estimate (0.5 credit for topical)
                                    const newCredits = Math.max(0, (user.credits || 0) - creditCost);
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

    const handlePhysicsNotes = () => {
        navigation.navigate('ALevelPhysicsNotes' as never);
    };

    const handleVirtualLab = () => {
        navigation.navigate('VirtualLab' as never);
    };

    const handleAITutor = () => {
        navigation.navigate('TeacherModeSetup' as never, {
            preselectedSubject: 'A Level Physics',
        } as never);
    };

    const handleStartExam = () => {
        setExamSetupModalVisible(true);
    };

    const handleExamStart = async (config: ExamConfig, timeInfo: TimeInfo) => {
        setExamSetupModalVisible(false);
        // `ExamSessionScreen` creates the session; just pass config/time.
        navigation.navigate('ExamSession' as never, {
            examConfig: config,
            timeInfo,
        } as never);
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#0D0F1C' : '#F8F9FC' }]}>
            {/* Loading Overlay */}
            <LoadingProgress
                visible={isGeneratingQuestion}
                message="DeepSeek is generating your Physics question..."
                estimatedTime={8}
            />

            <StatusBar barStyle="light-content" />

            {/* Premium Header */}
            <LinearGradient
                colors={physicsTheme.gradient.header}
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

                        <Text style={styles.title}>A Level Physics</Text>
                        <View style={styles.subtitleRow}>
                            <View style={styles.syllabusTag}>
                                <Text style={styles.syllabusText}>CIE / ZIMSEC</Text>
                            </View>
                            <Text style={styles.topicCount}>{asLevelCount + a2LevelCount} Topics</Text>
                        </View>
                    </View>

                    <View style={styles.headerIcon}>
                        <Ionicons name="planet-outline" size={42} color="rgba(255,255,255,0.95)" />
                    </View>
                </View>
            </LinearGradient>

            {/* Premium Level Tabs */}
            <View style={[
                styles.tabContainer,
                { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }
            ]}>
                <TouchableOpacity
                    style={[styles.tab, selectedLevel === 'AS Level' && styles.tabActive]}
                    onPress={() => setSelectedLevel('AS Level')}
                    activeOpacity={0.8}
                >
                    {selectedLevel === 'AS Level' ? (
                        <LinearGradient
                            colors={physicsTheme.gradient.asLevel}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.tabGradient}
                        >
                            <Text style={styles.tabTextActive}>AS Level</Text>
                            <Text style={styles.tabSubtext}>Topics 1-{asLevelCount}</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={[styles.tabText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }]}>
                                AS Level
                            </Text>
                            <Text style={[styles.tabSubtextInactive, { color: isDarkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }]}>
                                Topics 1-{asLevelCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, selectedLevel === 'A2 Level' && styles.tabActive]}
                    onPress={() => setSelectedLevel('A2 Level')}
                    activeOpacity={0.8}
                >
                    {selectedLevel === 'A2 Level' ? (
                        <LinearGradient
                            colors={physicsTheme.gradient.a2Level}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.tabGradient}
                        >
                            <Text style={styles.tabTextActive}>A2 Level</Text>
                            <Text style={styles.tabSubtext}>Topics {asLevelCount + 1}-{asLevelCount + a2LevelCount}</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={[styles.tabText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }]}>
                                A2 Level
                            </Text>
                            <Text style={[styles.tabSubtextInactive, { color: isDarkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }]}>
                                Topics {asLevelCount + 1}-{asLevelCount + a2LevelCount}
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
                        title="Physics Notes"
                        subtitle="Comprehensive A Level notes with diagrams"
                        icon={<MaterialCommunityIcons name="book-open-page-variant" size={26} color="#1976D2" />}
                        iconBgColor="rgba(25, 118, 210, 0.12)"
                        onPress={handlePhysicsNotes}
                        isDarkMode={isDarkMode}
                    />

                    <ALevelFeatureCard
                        title="AI Physics Tutor"
                        subtitle="Interactive Socratic tutoring powered by DeepSeek"
                        icon={<Ionicons name="school-outline" size={26} color="#7B1FA2" />}
                        iconBgColor="rgba(123, 31, 162, 0.12)"
                        onPress={handleAITutor}
                        isDarkMode={isDarkMode}
                    />

                    <ALevelFeatureCard
                        title="Virtual Labs"
                        subtitle="Interactive physics experiments & simulations"
                        icon={<MaterialCommunityIcons name="flask" size={26} color="#00BCD4" />}
                        iconBgColor="rgba(0, 188, 212, 0.12)"
                        onPress={handleVirtualLab}
                        isDarkMode={isDarkMode}
                    />

                    {/* Premium Exam Card */}
                    <ALevelExamCard
                        title={`Start ${selectedLevel} Exam`}
                        subtitle={`Mixed questions from all ${selectedLevel} topics`}
                        gradientColors={selectedLevel === 'AS Level'
                            ? physicsTheme.gradient.asLevel
                            : physicsTheme.gradient.a2Level}
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
                        <View style={[
                            styles.aiPoweredBadge,
                            { backgroundColor: isDarkMode ? 'rgba(25, 118, 210, 0.15)' : 'rgba(25, 118, 210, 0.1)' }
                        ]}>
                            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#1976D2" />
                            <Text style={[styles.aiPoweredText, { color: '#1976D2' }]}>DeepSeek AI</Text>
                        </View>
                    </View>
                    <Text style={[styles.sectionSubtitle, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,46,0.5)' }]}>
                        Tap any topic to start practicing
                    </Text>

                    {filteredTopics.map((topic, index) => {
                        const globalIndex = selectedLevel === 'AS Level' ? index + 1 : index + asLevelCount + 1;

                        return (
                            <ALevelTopicCard
                                key={topic.id}
                                title={topic.name}
                                description={topic.description}
                                icon={getTopicIcon(topic.id, index)}
                                primaryColor={currentPrimaryColor}
                                badges={[
                                    {
                                        text: `Topic ${globalIndex}`,
                                        color: currentPrimaryColor,
                                        icon: 'numeric'
                                    },
                                ]}
                                onPress={() => handleTopicPress(topic)}
                                index={index}
                                isDarkMode={isDarkMode}
                            />
                        );
                    })}
                </View>

                {/* Info Card */}
                <View style={styles.section}>
                    <ALevelInfoCard
                        title="A Level Physics"
                        content={`Mechanics, Waves, Electricity, Fields & Modern Physics\nPaper 1 (MCQ), Paper 2 (Structured), Paper 3 (Practical)\nQuestions generated using DeepSeek AI`}
                        gradientColors={isDarkMode
                            ? ['rgba(25, 118, 210, 0.08)', 'rgba(123, 31, 162, 0.05)']
                            : ['rgba(25, 118, 210, 0.06)', 'rgba(123, 31, 162, 0.04)']}
                        iconColor="#1976D2"
                        isDarkMode={isDarkMode}
                    />
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 32 }} />
            </ScrollView>

            <ExamSetupModal
                visible={examSetupModalVisible}
                onClose={() => setExamSetupModalVisible(false)}
                onStartExam={handleExamStart}
                initialSubject="a_level_physics"
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
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default ALevelPhysicsScreen;
