// Learning Preferences Screen - Study goals, subjects, and notifications
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    ImageBackground,
    RefreshControl,
    TextInput,
    Switch,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import Colors from '../theme/colors';
import FloatingParticles from '../components/FloatingParticles';
import { accountApi, UserPreferences } from '../services/api/accountApi';

const SUBJECTS = [
    { id: 'mathematics', name: 'Mathematics', icon: '📐' },
    { id: 'physics', name: 'Physics', icon: '⚡' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
    { id: 'biology', name: 'Biology', icon: '🧬' },
    { id: 'english', name: 'English', icon: '📝' },
    { id: 'history', name: 'History', icon: '📜' },
    { id: 'geography', name: 'Geography', icon: '🌍' },
    { id: 'accounting', name: 'Accounting', icon: '💰' },
    { id: 'economics', name: 'Economics', icon: '📊' },
    { id: 'commerce', name: 'Commerce', icon: '🏪' },
];

const DIFFICULTY_OPTIONS = [
    { id: 'easy', name: 'Easy', icon: '🌱', desc: 'Start with basics' },
    { id: 'medium', name: 'Medium', icon: '📚', desc: 'Balanced challenge' },
    { id: 'hard', name: 'Hard', icon: '🔥', desc: 'Maximum challenge' },
    { id: 'adaptive', name: 'Adaptive', icon: '🎯', desc: 'AI adjusts to you' },
];

const LearningPreferencesScreen: React.FC = () => {
    const navigation = useNavigation();
    const themedColors = useThemedColors();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Local state for editing
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [examLevel, setExamLevel] = useState<'O Level' | 'A Level'>('O Level');
    const [dailyGoal, setDailyGoal] = useState(10);
    const [studyTimeGoal, setStudyTimeGoal] = useState(30);
    const [difficulty, setDifficulty] = useState<string>('adaptive');
    const [schoolName, setSchoolName] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [notificationReminders, setNotificationReminders] = useState(true);
    const [notificationAchievements, setNotificationAchievements] = useState(true);
    const [notificationTips, setNotificationTips] = useState(true);

    const loadData = useCallback(async () => {
        try {
            const data = await accountApi.getPreferences();
            if (data) {
                setPreferences(data);
                setSelectedSubjects(data.preferred_subjects || []);
                setExamLevel(data.exam_level || 'O Level');
                setDailyGoal(data.daily_question_goal || 10);
                setStudyTimeGoal(data.study_time_goal_minutes || 30);
                setDifficulty(data.difficulty_preference || 'adaptive');
                setSchoolName(data.school_name || '');
                setGradeLevel(data.grade_level || '');
                setNotificationReminders(data.notification_reminders ?? true);
                setNotificationAchievements(data.notification_achievements ?? true);
                setNotificationTips(data.notification_tips ?? true);
            }
        } catch (error) {
            console.error('Failed to load preferences:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
        setHasChanges(false);
    };

    const toggleSubject = (subjectId: string) => {
        setSelectedSubjects(prev => {
            if (prev.includes(subjectId)) {
                return prev.filter(s => s !== subjectId);
            } else {
                return [...prev, subjectId];
            }
        });
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await accountApi.updatePreferences({
                preferred_subjects: selectedSubjects,
                exam_level: examLevel,
                daily_question_goal: dailyGoal,
                study_time_goal_minutes: studyTimeGoal,
                difficulty_preference: difficulty as any,
                school_name: schoolName || null,
                grade_level: gradeLevel || null,
                notification_reminders: notificationReminders,
                notification_achievements: notificationAchievements,
                notification_tips: notificationTips,
            });
            Alert.alert('Success', 'Preferences saved successfully');
            setHasChanges(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: themedColors.background.default }]}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>
                    Loading preferences...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <ImageBackground
                source={require('../../assets/images/default_background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <FloatingParticles count={10} />
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary.main]} />
                    }
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Learning Preferences</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Exam Level */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📚 Exam Level</Text>
                        <View style={styles.examLevelContainer}>
                            <TouchableOpacity
                                style={[styles.examLevelButton, examLevel === 'O Level' && styles.examLevelActive]}
                                onPress={() => { setExamLevel('O Level'); setHasChanges(true); }}
                            >
                                <Text style={[styles.examLevelText, examLevel === 'O Level' && styles.examLevelTextActive]}>
                                    O Level
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.examLevelButton, examLevel === 'A Level' && styles.examLevelActive]}
                                onPress={() => { setExamLevel('A Level'); setHasChanges(true); }}
                            >
                                <Text style={[styles.examLevelText, examLevel === 'A Level' && styles.examLevelTextActive]}>
                                    A Level
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Preferred Subjects */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎯 Preferred Subjects</Text>
                        <Text style={styles.sectionSubtitle}>Select subjects you want to focus on</Text>
                        <View style={styles.subjectsGrid}>
                            {SUBJECTS.map(subject => (
                                <TouchableOpacity
                                    key={subject.id}
                                    style={[
                                        styles.subjectChip,
                                        selectedSubjects.includes(subject.id) && styles.subjectChipActive
                                    ]}
                                    onPress={() => toggleSubject(subject.id)}
                                >
                                    <Text style={styles.subjectIcon}>{subject.icon}</Text>
                                    <Text style={[
                                        styles.subjectText,
                                        selectedSubjects.includes(subject.id) && styles.subjectTextActive
                                    ]}>
                                        {subject.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Daily Goals */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎯 Daily Goals</Text>
                        
                        <View style={styles.goalRow}>
                            <View style={styles.goalInfo}>
                                <Text style={styles.goalLabel}>Questions per day</Text>
                                <Text style={styles.goalDesc}>How many questions you aim to answer</Text>
                            </View>
                            <View style={styles.goalControls}>
                                <TouchableOpacity
                                    style={styles.goalButton}
                                    onPress={() => { setDailyGoal(Math.max(5, dailyGoal - 5)); setHasChanges(true); }}
                                >
                                    <Text style={styles.goalButtonText}>−</Text>
                                </TouchableOpacity>
                                <Text style={styles.goalValue}>{dailyGoal}</Text>
                                <TouchableOpacity
                                    style={styles.goalButton}
                                    onPress={() => { setDailyGoal(Math.min(100, dailyGoal + 5)); setHasChanges(true); }}
                                >
                                    <Text style={styles.goalButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.goalRow}>
                            <View style={styles.goalInfo}>
                                <Text style={styles.goalLabel}>Study time (minutes)</Text>
                                <Text style={styles.goalDesc}>Target daily study duration</Text>
                            </View>
                            <View style={styles.goalControls}>
                                <TouchableOpacity
                                    style={styles.goalButton}
                                    onPress={() => { setStudyTimeGoal(Math.max(10, studyTimeGoal - 10)); setHasChanges(true); }}
                                >
                                    <Text style={styles.goalButtonText}>−</Text>
                                </TouchableOpacity>
                                <Text style={styles.goalValue}>{studyTimeGoal}</Text>
                                <TouchableOpacity
                                    style={styles.goalButton}
                                    onPress={() => { setStudyTimeGoal(Math.min(180, studyTimeGoal + 10)); setHasChanges(true); }}
                                >
                                    <Text style={styles.goalButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Difficulty Preference */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>⚡ Difficulty Preference</Text>
                        <View style={styles.difficultyGrid}>
                            {DIFFICULTY_OPTIONS.map(option => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.difficultyCard,
                                        difficulty === option.id && styles.difficultyCardActive
                                    ]}
                                    onPress={() => { setDifficulty(option.id); setHasChanges(true); }}
                                >
                                    <Text style={styles.difficultyIcon}>{option.icon}</Text>
                                    <Text style={[
                                        styles.difficultyName,
                                        difficulty === option.id && styles.difficultyNameActive
                                    ]}>
                                        {option.name}
                                    </Text>
                                    <Text style={styles.difficultyDesc}>{option.desc}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Academic Profile */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🏫 Academic Profile</Text>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>School Name (Optional)</Text>
                            <TextInput
                                style={styles.textInput}
                                value={schoolName}
                                onChangeText={(text) => { setSchoolName(text); setHasChanges(true); }}
                                placeholder="Enter your school name"
                                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Grade/Form (Optional)</Text>
                            <TextInput
                                style={styles.textInput}
                                value={gradeLevel}
                                onChangeText={(text) => { setGradeLevel(text); setHasChanges(true); }}
                                placeholder="e.g., Form 4"
                                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                            />
                        </View>
                    </View>

                    {/* Notifications */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🔔 Notifications</Text>
                        
                        <View style={styles.notificationRow}>
                            <View style={styles.notificationInfo}>
                                <Text style={styles.notificationLabel}>Study Reminders</Text>
                                <Text style={styles.notificationDesc}>Daily reminders to study</Text>
                            </View>
                            <Switch
                                value={notificationReminders}
                                onValueChange={(val) => { setNotificationReminders(val); setHasChanges(true); }}
                                trackColor={{ false: 'rgba(255,255,255,0.2)', true: Colors.primary.main + '60' }}
                                thumbColor={notificationReminders ? Colors.primary.main : '#f4f3f4'}
                            />
                        </View>

                        <View style={styles.notificationRow}>
                            <View style={styles.notificationInfo}>
                                <Text style={styles.notificationLabel}>Achievements</Text>
                                <Text style={styles.notificationDesc}>Notify when you earn badges</Text>
                            </View>
                            <Switch
                                value={notificationAchievements}
                                onValueChange={(val) => { setNotificationAchievements(val); setHasChanges(true); }}
                                trackColor={{ false: 'rgba(255,255,255,0.2)', true: Colors.primary.main + '60' }}
                                thumbColor={notificationAchievements ? Colors.primary.main : '#f4f3f4'}
                            />
                        </View>

                        <View style={styles.notificationRow}>
                            <View style={styles.notificationInfo}>
                                <Text style={styles.notificationLabel}>Learning Tips</Text>
                                <Text style={styles.notificationDesc}>Helpful study tips and tricks</Text>
                            </View>
                            <Switch
                                value={notificationTips}
                                onValueChange={(val) => { setNotificationTips(val); setHasChanges(true); }}
                                trackColor={{ false: 'rgba(255,255,255,0.2)', true: Colors.primary.main + '60' }}
                                thumbColor={notificationTips ? Colors.primary.main : '#f4f3f4'}
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    {hasChanges && (
                        <TouchableOpacity
                            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    )}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1, width: '100%', height: '100%' },
    scrollView: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 16 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: { fontSize: 24, color: '#FFFFFF' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
    section: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 12,
    },
    examLevelContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    examLevelButton: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    examLevelActive: {
        backgroundColor: 'rgba(124, 77, 255, 0.2)',
        borderColor: Colors.primary.main,
    },
    examLevelText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
    },
    examLevelTextActive: {
        color: '#FFFFFF',
    },
    subjectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    subjectChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    subjectChipActive: {
        backgroundColor: 'rgba(124, 77, 255, 0.25)',
        borderColor: Colors.primary.main,
    },
    subjectIcon: { fontSize: 16, marginRight: 6 },
    subjectText: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' },
    subjectTextActive: { color: '#FFFFFF', fontWeight: '600' },
    goalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
    },
    goalInfo: { flex: 1 },
    goalLabel: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    goalDesc: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', marginTop: 2 },
    goalControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    goalButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalButtonText: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
    goalValue: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', minWidth: 40, textAlign: 'center' },
    difficultyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    difficultyCard: {
        width: '48%',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    difficultyCardActive: {
        backgroundColor: 'rgba(124, 77, 255, 0.2)',
        borderColor: Colors.primary.main,
    },
    difficultyIcon: { fontSize: 28, marginBottom: 8 },
    difficultyName: { fontSize: 15, fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)' },
    difficultyNameActive: { color: '#FFFFFF' },
    difficultyDesc: { fontSize: 11, color: 'rgba(255, 255, 255, 0.5)', marginTop: 4, textAlign: 'center' },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8 },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    notificationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
    },
    notificationInfo: { flex: 1 },
    notificationLabel: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    notificationDesc: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', marginTop: 2 },
    saveButton: {
        marginHorizontal: 20,
        backgroundColor: Colors.primary.main,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    saveButtonDisabled: { opacity: 0.6 },
    saveButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});

export default LearningPreferencesScreen;
