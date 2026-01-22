// Job Interview Screen - English Virtual Lab
// Interactive professional interview simulation with STAR method

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab/simulationsData';

const { width } = Dimensions.get('window');

interface InterviewOption {
    id: string;
    text: string;
    quality: 'excellent' | 'good' | 'poor';
    feedback: string;
    tip?: string;
}

interface InterviewStep {
    id: string;
    phase: string;
    interviewer: string;
    question: string;
    skillFocus: string;
    options: InterviewOption[];
}

const INTERVIEW_STEPS: InterviewStep[] = [
    {
        id: 'introduction',
        phase: 'Opening',
        interviewer: 'Ms. Nkosi - HR Manager',
        question: 'Good morning! Thank you for coming in today. Let\'s start with you telling me a bit about yourself.',
        skillFocus: 'Self-Introduction',
        options: [
            {
                id: 'a',
                text: 'I\'m Tendai, 25 years old, from Harare. I like football and music.',
                quality: 'poor',
                feedback: 'Personal details aren\'t relevant here. Focus on professional background and what you bring to the role.',
            },
            {
                id: 'b',
                text: 'Thank you for this opportunity. I\'m a marketing graduate with 3 years of experience in digital campaigns. I\'m passionate about data-driven marketing and have increased engagement by 40% at my current role.',
                quality: 'excellent',
                feedback: '🎉 Excellent! You thanked them, stated relevant experience, showed passion, and gave a quantified achievement.',
                tip: 'Always start with gratitude, mention relevant experience, and include a specific achievement.',
            },
            {
                id: 'c',
                text: 'I studied marketing at university and I\'m looking for a new job.',
                quality: 'good',
                feedback: 'This is okay but lacks specific achievements or passion. Add what makes you unique!',
            },
        ],
    },
    {
        id: 'strengths',
        phase: 'Strengths Discussion',
        interviewer: 'Ms. Nkosi - HR Manager',
        question: 'What would you say are your greatest strengths?',
        skillFocus: 'Self-Awareness',
        options: [
            {
                id: 'a',
                text: 'I\'m a perfectionist and I work too hard.',
                quality: 'poor',
                feedback: 'These are disguised weaknesses, not genuine strengths. Interviewers see through this approach.',
            },
            {
                id: 'b',
                text: 'My greatest strength is analytical thinking. For example, at my previous job, I analyzed customer data to identify a 25% drop in retention. I proposed a loyalty program that recovered 60% of those customers within 6 months.',
                quality: 'excellent',
                feedback: '🎉 Perfect! You named a specific strength and backed it up with a concrete, quantified example.',
                tip: 'Always provide evidence! Specific examples make your strengths believable and memorable.',
            },
            {
                id: 'c',
                text: 'I\'m good at working with people and solving problems.',
                quality: 'good',
                feedback: 'Good strengths to mention, but without examples they sound generic. Make them specific!',
            },
        ],
    },
    {
        id: 'star',
        phase: 'Behavioral Question',
        interviewer: 'Ms. Nkosi - HR Manager',
        question: 'Tell me about a time when you faced a significant challenge at work. How did you handle it?',
        skillFocus: 'STAR Method',
        options: [
            {
                id: 'a',
                text: 'I\'m very good at handling challenges. I never give up when things get difficult.',
                quality: 'poor',
                feedback: 'This is vague and doesn\'t tell a story. Use the STAR method for behavioral questions!',
            },
            {
                id: 'b',
                text: 'SITUATION: Our main client threatened to leave due to delivery delays. TASK: I was asked to save the relationship. ACTION: I personally called the client, apologized, created a recovery plan, and offered compensation. RESULT: They not only stayed but increased their contract by 15%.',
                quality: 'excellent',
                feedback: '🎉 Masterful use of STAR! You clearly structured your response: Situation, Task, Action, Result.',
                tip: 'STAR = Situation, Task, Action, Result. This structure makes your answers clear and compelling.',
            },
            {
                id: 'c',
                text: 'Once we had an angry client and I helped calm them down. It worked out in the end.',
                quality: 'good',
                feedback: 'Good start but lacks detail. What specifically did you do? What was the outcome?',
            },
        ],
    },
    {
        id: 'weakness',
        phase: 'Self-Reflection',
        interviewer: 'Ms. Nkosi - HR Manager',
        question: 'What would you consider your biggest weakness?',
        skillFocus: 'Growth Mindset',
        options: [
            {
                id: 'a',
                text: 'I don\'t really have any weaknesses. I\'m pretty good at everything.',
                quality: 'poor',
                feedback: 'This shows lack of self-awareness. Everyone has areas for improvement!',
            },
            {
                id: 'b',
                text: 'I tend to overthink presentations, which sometimes slows me down. To address this, I now set strict deadlines for myself and get early feedback from colleagues, which has improved my efficiency significantly.',
                quality: 'excellent',
                feedback: '🎉 Honest and growth-focused! You acknowledged a real weakness and actively work to improve it.',
                tip: 'Choose a genuine weakness that isn\'t critical to the role, then explain how you\'re improving.',
            },
            {
                id: 'c',
                text: 'I sometimes work too hard and forget to take breaks.',
                quality: 'good',
                feedback: 'This is a common "safe" answer but interviewers prefer genuine self-reflection.',
            },
        ],
    },
    {
        id: 'questions',
        phase: 'Closing',
        interviewer: 'Ms. Nkosi - HR Manager',
        question: 'Do you have any questions for us?',
        skillFocus: 'Engagement & Interest',
        options: [
            {
                id: 'a',
                text: 'No, I think you\'ve covered everything. Thank you.',
                quality: 'poor',
                feedback: 'Always ask questions! It shows genuine interest and helps you evaluate the opportunity.',
            },
            {
                id: 'b',
                text: 'Yes! I\'d love to know more about the team I\'d be working with, and what success looks like in this role after the first year. I\'m also curious about opportunities for professional development.',
                quality: 'excellent',
                feedback: '🎉 Excellent questions! They show you\'re thinking ahead and care about growth and contribution.',
                tip: 'Prepare 2-3 thoughtful questions that show interest in the role, team, and growth opportunities.',
            },
            {
                id: 'c',
                text: 'What\'s the salary for this position?',
                quality: 'good',
                feedback: 'Salary is important, but save it for later rounds. Show interest in the role first.',
            },
        ],
    },
];

const JobInterviewScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const simulation = getSimulationById('eng-job-interview')!;

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    const step = INTERVIEW_STEPS[currentStep];
    const isComplete = completedSteps.length === INTERVIEW_STEPS.length;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [currentStep]);

    const getScoreForQuality = (quality: string): number => {
        switch (quality) {
            case 'excellent': return 20;
            case 'good': return 12;
            default: return 5;
        }
    };

    const handleOptionSelect = (optionId: string) => {
        if (showFeedback) return;
        setSelectedOption(optionId);
        setShowFeedback(true);

        const option = step.options.find(o => o.id === optionId);
        if (option) {
            setTotalScore(prev => prev + getScoreForQuality(option.quality));
        }
    };

    const handleNext = () => {
        if (!completedSteps.includes(step.id)) {
            setCompletedSteps([...completedSteps, step.id]);
        }

        if (currentStep < INTERVIEW_STEPS.length - 1) {
            fadeAnim.setValue(0);
            setCurrentStep(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        }
    };

    const getQualityColor = (quality: string) => {
        switch (quality) {
            case 'excellent': return '#00E676';
            case 'good': return '#FFC107';
            default: return '#FF5252';
        }
    };

    const getQualityIcon = (quality: string) => {
        switch (quality) {
            case 'excellent': return 'checkmark-circle';
            case 'good': return 'alert-circle';
            default: return 'close-circle';
        }
    };

    const getPerformanceRating = () => {
        const maxScore = INTERVIEW_STEPS.length * 20;
        const percentage = (totalScore / maxScore) * 100;
        if (percentage >= 80) return { text: 'Outstanding Candidate! 🌟', color: '#00E676' };
        if (percentage >= 60) return { text: 'Good Performance! 👍', color: '#FFC107' };
        return { text: 'Needs Practice 📚', color: '#FF5252' };
    };

    const getOptionStyle = (option: InterviewOption) => {
        if (!showFeedback) return {};
        const color = getQualityColor(option.quality);
        if (selectedOption === option.id) {
            return { borderColor: color, backgroundColor: `${color}15` };
        }
        return { opacity: 0.5 };
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            <SimulationHeader
                simulation={simulation}
                onBack={() => navigation.goBack()}
            />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    {INTERVIEW_STEPS.map((s, idx) => (
                        <View key={s.id} style={styles.progressStep}>
                            <View
                                style={[
                                    styles.progressDot,
                                    {
                                        backgroundColor: idx <= currentStep ? '#9C27B0' : themedColors.border.medium,
                                    },
                                ]}
                            >
                                {completedSteps.includes(s.id) && (
                                    <Ionicons name="checkmark" size={12} color="#FFF" />
                                )}
                            </View>
                            {idx < INTERVIEW_STEPS.length - 1 && (
                                <View
                                    style={[
                                        styles.progressLine,
                                        { backgroundColor: idx < currentStep ? '#9C27B0' : themedColors.border.light },
                                    ]}
                                />
                            )}
                        </View>
                    ))}
                </View>

                {/* Phase Badge */}
                <View style={[styles.phaseBadge, { backgroundColor: '#9C27B020' }]}>
                    <Ionicons name="briefcase" size={16} color="#9C27B0" />
                    <Text style={[styles.phaseText, { color: '#9C27B0' }]}>
                        {step.phase}
                    </Text>
                    <Text style={[styles.skillText, { color: themedColors.text.secondary }]}>
                        • {step.skillFocus}
                    </Text>
                </View>

                {/* Interviewer Card */}
                <Animated.View style={[styles.interviewerCard, { backgroundColor: themedColors.background.paper, opacity: fadeAnim }]}>
                    <View style={styles.interviewerHeader}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#7B1FA2', '#9C27B0']}
                                style={styles.avatar}
                            >
                                <Text style={styles.avatarText}>MN</Text>
                            </LinearGradient>
                            <View style={styles.onlineIndicator} />
                        </View>
                        <View style={styles.interviewerInfo}>
                            <Text style={[styles.interviewerName, { color: themedColors.text.primary }]}>
                                {step.interviewer}
                            </Text>
                            <Text style={[styles.interviewerRole, { color: themedColors.text.secondary }]}>
                                ABC Corporation
                            </Text>
                        </View>
                    </View>
                    <View style={styles.questionBubble}>
                        <Text style={[styles.questionText, { color: themedColors.text.primary }]}>
                            {step.question}
                        </Text>
                    </View>
                </Animated.View>

                {/* Response Options */}
                <Text style={[styles.responseLabel, { color: themedColors.text.secondary }]}>
                    Choose your response:
                </Text>

                {step.options.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[
                            styles.optionCard,
                            { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light },
                            getOptionStyle(option),
                        ]}
                        onPress={() => handleOptionSelect(option.id)}
                        disabled={showFeedback}
                    >
                        <Text style={[styles.optionText, { color: themedColors.text.primary }]}>
                            "{option.text}"
                        </Text>
                        {showFeedback && selectedOption === option.id && (
                            <View style={[styles.qualityBadge, { backgroundColor: `${getQualityColor(option.quality)}20` }]}>
                                <Ionicons
                                    name={getQualityIcon(option.quality)}
                                    size={16}
                                    color={getQualityColor(option.quality)}
                                />
                                <Text style={[styles.qualityText, { color: getQualityColor(option.quality) }]}>
                                    {option.quality.charAt(0).toUpperCase() + option.quality.slice(1)}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}

                {/* Feedback Panel */}
                {showFeedback && (
                    <View style={[styles.feedbackPanel, { backgroundColor: themedColors.background.paper }]}>
                        <View style={styles.feedbackHeader}>
                            <Ionicons
                                name={getQualityIcon(step.options.find(o => o.id === selectedOption)?.quality || 'poor')}
                                size={24}
                                color={getQualityColor(step.options.find(o => o.id === selectedOption)?.quality || 'poor')}
                            />
                            <Text style={[styles.feedbackTitle, { color: themedColors.text.primary }]}>
                                Feedback
                            </Text>
                        </View>
                        <Text style={[styles.feedbackText, { color: themedColors.text.secondary }]}>
                            {step.options.find(o => o.id === selectedOption)?.feedback}
                        </Text>
                        {step.options.find(o => o.id === selectedOption)?.tip && (
                            <View style={styles.tipContainer}>
                                <Ionicons name="bulb" size={18} color="#FFC107" />
                                <Text style={[styles.tipText, { color: '#F57F17' }]}>
                                    💡 Pro Tip: {step.options.find(o => o.id === selectedOption)?.tip}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Continue Button */}
                {showFeedback && !isComplete && (
                    <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                        <LinearGradient
                            colors={['#9C27B0', '#7B1FA2']}
                            style={styles.continueGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.continueText}>Next Question</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Completion Card */}
                {isComplete && (
                    <View style={styles.completionCard}>
                        <LinearGradient
                            colors={['#7B1FA2', '#9C27B0']}
                            style={styles.completionGradient}
                        >
                            <Ionicons name="ribbon" size={50} color="#FFD700" />
                            <Text style={styles.completionTitle}>Interview Complete!</Text>
                            <Text style={[styles.performanceText, { color: getPerformanceRating().color }]}>
                                {getPerformanceRating().text}
                            </Text>
                            <View style={styles.scoreRow}>
                                <Text style={styles.scoreLabelWhite}>Your Score:</Text>
                                <Text style={styles.scoreValue}>{totalScore}/100</Text>
                            </View>
                            <Text style={styles.completionMessage}>
                                You've practiced key interview skills including self-introduction, STAR method responses, and asking thoughtful questions!
                            </Text>
                            <TouchableOpacity
                                style={styles.quizStartButton}
                                onPress={() => setShowQuiz(true)}
                            >
                                <Ionicons name="school" size={20} color="#9C27B0" />
                                <Text style={styles.quizStartText}>Take Knowledge Check</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}
            </ScrollView>

            {/* Knowledge Check Modal */}
            {showQuiz && (
                <KnowledgeCheck
                    simulation={simulation}
                    onClose={() => setShowQuiz(false)}
                    onComplete={() => setShowQuiz(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    progressStep: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressLine: {
        width: 30,
        height: 3,
        marginHorizontal: 4,
        borderRadius: 2,
    },
    phaseBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 16,
        gap: 6,
    },
    phaseText: {
        fontSize: 13,
        fontWeight: '600',
    },
    skillText: {
        fontSize: 12,
    },
    interviewerCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },
    interviewerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#00E676',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    interviewerInfo: {
        marginLeft: 12,
    },
    interviewerName: {
        fontSize: 15,
        fontWeight: '600',
    },
    interviewerRole: {
        fontSize: 12,
        marginTop: 2,
    },
    questionBubble: {
        backgroundColor: '#F3E5F520',
        padding: 14,
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#9C27B0',
    },
    questionText: {
        fontSize: 15,
        lineHeight: 22,
    },
    responseLabel: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 12,
    },
    optionCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
    },
    optionText: {
        fontSize: 14,
        lineHeight: 21,
        fontStyle: 'italic',
    },
    qualityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 12,
        gap: 6,
    },
    qualityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    feedbackPanel: {
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    feedbackTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    feedbackText: {
        fontSize: 14,
        lineHeight: 20,
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 12,
        gap: 8,
        backgroundColor: '#FFF8E1',
        padding: 12,
        borderRadius: 10,
    },
    tipText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    continueButton: {
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    continueGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 10,
    },
    continueText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    completionCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 20,
    },
    completionGradient: {
        padding: 28,
        alignItems: 'center',
    },
    completionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFF',
        marginTop: 12,
    },
    performanceText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 8,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
    },
    scoreLabelWhite: {
        color: '#FFFFFFAA',
        fontSize: 14,
    },
    scoreValue: {
        color: '#FFD700',
        fontSize: 22,
        fontWeight: '700',
    },
    completionMessage: {
        fontSize: 13,
        color: '#FFFFFFCC',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 20,
    },
    quizStartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 25,
        marginTop: 24,
        gap: 8,
    },
    quizStartText: {
        color: '#9C27B0',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default JobInterviewScreen;
