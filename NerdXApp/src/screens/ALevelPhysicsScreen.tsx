// A Level Physics Screen - Professional UI with all 24 topics
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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import { Card } from '../components/Card';
import { Icons, IconCircle } from '../components/Icons';
import { aLevelPhysicsTopics, ALevelPhysicsTopic } from '../data/aLevelPhysics';
import { quizApi } from '../services/api/quizApi';
import LoadingProgress from '../components/LoadingProgress';

const { width } = Dimensions.get('window');

const ALevelPhysicsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, updateUser } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [selectedLevel, setSelectedLevel] = useState<'AS Level' | 'A2 Level'>('AS Level');
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

    // Filter topics by selected level
    const filteredTopics = aLevelPhysicsTopics.filter(
        topic => topic.difficulty === selectedLevel
    );

    const handleTopicPress = async (topic: ALevelPhysicsTopic) => {
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
                `Start ${topic.name} quiz?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Start',
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

    const handlePhysicsNotes = () => {
        navigation.navigate('ALevelPhysicsNotes' as never);
    };

    const handleVirtualLab = () => {
        navigation.navigate('VirtualLab' as never);
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
                `Start A Level Physics ${selectedLevel} Exam?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Start',
                        onPress: async () => {
                            try {
                                setIsGeneratingQuestion(true);

                                const question = await quizApi.generateQuestion(
                                    'a_level_physics',
                                    undefined,
                                    'medium',
                                    'exam',
                                    selectedLevel
                                );

                                setIsGeneratingQuestion(false);

                                if (question) {
                                    navigation.navigate('Quiz' as never, {
                                        question,
                                        subject: { id: 'a_level_physics', name: 'A Level Physics' }
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

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            {/* Loading Overlay */}
            <LoadingProgress
                visible={isGeneratingQuestion}
                message="Generating your A Level Physics question..."
                estimatedTime={8}
            />

            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={['#1565C0', '#1976D2', '#2196F3']}
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
                        <Text style={styles.title}>A Level Physics</Text>
                        <Text style={styles.subtitle}>Master advanced physics concepts</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <Ionicons name="planet-outline" size={48} color="rgba(255,255,255,0.9)" />
                    </View>
                </View>
            </LinearGradient>

            {/* Level Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedLevel === 'AS Level' && styles.tabActive
                    ]}
                    onPress={() => setSelectedLevel('AS Level')}
                >
                    {selectedLevel === 'AS Level' ? (
                        <LinearGradient
                            colors={['#1976D2', '#1565C0']}
                            style={styles.tabGradient}
                        >
                            <Text style={styles.tabTextActive}>AS Level</Text>
                            <Text style={styles.tabSubtext}>Topics 1-11</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={styles.tabText}>AS Level</Text>
                            <Text style={styles.tabSubtextInactive}>Topics 1-11</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedLevel === 'A2 Level' && styles.tabActive
                    ]}
                    onPress={() => setSelectedLevel('A2 Level')}
                >
                    {selectedLevel === 'A2 Level' ? (
                        <LinearGradient
                            colors={['#7B1FA2', '#6A1B9A']}
                            style={styles.tabGradient}
                        >
                            <Text style={styles.tabTextActive}>A2 Level</Text>
                            <Text style={styles.tabSubtext}>Topics 12-24</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={styles.tabText}>A2 Level</Text>
                            <Text style={styles.tabSubtextInactive}>Topics 12-24</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Feature Buttons */}
                <View style={styles.featuresContainer}>
                    {/* Physics Notes */}
                    <Card variant="elevated" onPress={handlePhysicsNotes} style={styles.featureCard}>
                        <View style={styles.featureContent}>
                            <IconCircle
                                icon={<Ionicons name="book-outline" size={28} color="#1976D2" />}
                                size={56}
                                backgroundColor="rgba(25, 118, 210, 0.1)"
                            />
                            <View style={styles.featureInfo}>
                                <Text style={styles.featureTitle}>Physics Notes</Text>
                                <Text style={styles.featureSubtitle}>Comprehensive A Level notes</Text>
                            </View>
                            {Icons.arrowRight(24, Colors.text.secondary)}
                        </View>
                    </Card>

                    {/* Virtual Lab */}
                    <Card variant="elevated" onPress={handleVirtualLab} style={styles.featureCard}>
                        <View style={styles.featureContent}>
                            <IconCircle
                                icon={<Ionicons name="flask-outline" size={28} color="#00BCD4" />}
                                size={56}
                                backgroundColor="rgba(0, 188, 212, 0.1)"
                            />
                            <View style={styles.featureInfo}>
                                <Text style={styles.featureTitle}>Virtual Labs</Text>
                                <Text style={styles.featureSubtitle}>Interactive physics experiments</Text>
                            </View>
                            {Icons.arrowRight(24, Colors.text.secondary)}
                        </View>
                    </Card>

                    {/* Start Exam */}
                    <Card
                        variant="gradient"
                        gradientColors={selectedLevel === 'AS Level'
                            ? ['#1565C0', '#1976D2']
                            : ['#7B1FA2', '#6A1B9A']}
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
                        Tap a topic to practice MCQs
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
                                        backgroundColor: selectedLevel === 'AS Level'
                                            ? 'rgba(25, 118, 210, 0.1)'
                                            : 'rgba(123, 31, 162, 0.1)'
                                    }
                                ]}>
                                    <Text style={[
                                        styles.topicNumberText,
                                        { color: selectedLevel === 'AS Level' ? '#1976D2' : '#7B1FA2' }
                                    ]}>
                                        {selectedLevel === 'AS Level' ? index + 1 : index + 12}
                                    </Text>
                                </View>
                                <View style={styles.topicInfo}>
                                    <Text style={[styles.topicName, { color: themedColors.text.primary }]}>
                                        {topic.name}
                                    </Text>
                                    <Text style={[styles.topicDescription, { color: themedColors.text.secondary }]}>
                                        {topic.description}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={24}
                                    color={selectedLevel === 'AS Level' ? '#1976D2' : '#7B1FA2'}
                                />
                            </View>
                        </Card>
                    ))}
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
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
        color: 'rgba(0, 0, 0, 0.5)',
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
        color: 'rgba(0, 0, 0, 0.4)',
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
        color: Colors.text.primary,
        marginBottom: 4,
    },
    featureSubtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
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
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicNumberText: {
        fontSize: 18,
        fontWeight: 'bold',
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
    },
});

export default ALevelPhysicsScreen;
