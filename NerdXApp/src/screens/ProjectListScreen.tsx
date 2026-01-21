// Project List Screen - View and Resume Projects
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    RefreshControl,
    StatusBar,
    Image,
    TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { projectApi, Project } from '../services/api/projectApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';
import { formatCreditBalance } from '../utils/creditCalculator';

const ProjectListScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            loadProjects();
        }, [])
    );

    const loadProjects = async () => {
        try {
            setLoading(true);
            const projectList = await projectApi.listProjects();
            setProjects(projectList);
            setFilteredProjects(projectList);
        } catch (error: any) {
            console.error('Failed to load projects:', error);
            // Don't show alert on initial load to avoid annoyance if offline
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadProjects();
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim() === '') {
            setFilteredProjects(projects);
        } else {
            const lowerText = text.toLowerCase();
            const filtered = projects.filter(
                (p) =>
                    p.title.toLowerCase().includes(lowerText) ||
                    p.subject.toLowerCase().includes(lowerText)
            );
            setFilteredProjects(filtered);
        }
    };

    const handleProjectPress = (project: Project) => {
        // Check if user has sufficient credits before opening project
        const userCredits = formatCreditBalance(user?.credits);
        const requiredCredits = 1; // 1 credit per AI response
        
        if (userCredits < requiredCredits) {
            Alert.alert(
                'Insufficient Credits',
                `Project Assistant requires at least ${requiredCredits} credit to use. You currently have ${userCredits} credit${userCredits === 1 ? '' : 's'}.\n\nPlease purchase more credits to continue.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Buy Credits',
                        onPress: () => navigation.navigate('Credits' as never),
                    },
                ]
            );
            return;
        }

        navigation.navigate('ProjectAssistant' as any, {
            projectId: project.id,
            projectTitle: project.title,
            subject: project.subject,
        } as any);
    };

    const handleNewProject = () => {
        // Check if user has sufficient credits before creating new project
        const userCredits = formatCreditBalance(user?.credits);
        const requiredCredits = 1; // 1 credit per AI response
        
        if (userCredits < requiredCredits) {
            Alert.alert(
                'Insufficient Credits',
                `Project Assistant requires at least ${requiredCredits} credit to start. You currently have ${userCredits} credit${userCredits === 1 ? '' : 's'}.\n\nPlease purchase more credits to continue.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Buy Credits',
                        onPress: () => navigation.navigate('Credits' as never),
                    },
                ]
            );
            return;
        }

        navigation.navigate('ProjectAssistantSetup' as any);
    };

    const handleDeleteProject = (project: Project) => {
        Alert.alert(
            'Delete Project',
            `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Optimistically remove from UI for better UX
                            const projectId = project.id;
                            const newProjects = projects.filter(p => p.id !== projectId);
                            setProjects(newProjects);
                            setFilteredProjects(newProjects.filter(p =>
                                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.subject.toLowerCase().includes(searchQuery.toLowerCase())
                            ));

                            // Attempt deletion on server
                            const success = await projectApi.deleteProject(project.id);

                            if (success) {
                                // Refresh to ensure we have the latest state
                                await loadProjects();
                                // Alert.alert('Success', 'Project deleted successfully');
                            } else {
                                // If deletion failed, restore the project in the list
                                await loadProjects();
                                Alert.alert('Error', 'Failed to delete project. Please try again.');
                            }
                        } catch (error: any) {
                            console.error('Delete project error:', error);
                            // Restore the project list in case of error
                            await loadProjects();
                            Alert.alert(
                                'Error',
                                error?.response?.data?.message || 'Failed to delete project. Please try again.'
                            );
                        }
                    }
                }
            ]
        );
    };

    const getStageColor = (stage: string) => {
        const colors: { [key: string]: string } = {
            'Selection': '#FF9800',
            'Investigation': '#2196F3',
            'Design': '#9C27B0',
            'Implementation': '#4CAF50',
            'Testing': '#F44336',
            'Documentation': '#00BCD4',
            'Evaluation': '#8BC34A',
        };
        return colors[stage] || '#757575';
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
                <ActivityIndicator size="large" color={themedColors.primary.main} />
                <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Loading your projects...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={themedColors.background.default} />
            <LinearGradient
                colors={themedColors.gradients.primary}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>My Projects</Text>
                        <Text style={styles.headerSubtitle}>
                            {projects.length} Active {projects.length === 1 ? 'Project' : 'Projects'}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Ionicons name="person-circle-outline" size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search projects..."
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.7)" />
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[themedColors.primary.main]} tintColor={themedColors.primary.main} />
                }
            >
                {projects.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#E1BEE7' }]}>
                            <Ionicons name="folder-open-outline" size={64} color={themedColors.text.disabled} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: themedColors.text.primary }]}>No Projects Yet</Text>
                        <Text style={[styles.emptyText, { color: themedColors.text.secondary }]}>
                            Start your first School-Based Project and get AI-powered guidance!
                        </Text>
                        <TouchableOpacity style={styles.createButton} onPress={handleNewProject}>
                            <LinearGradient
                                colors={themedColors.gradients.primary}
                                style={styles.createButtonGradient}
                            >
                                <Ionicons name="add" size={24} color="#FFF" />
                                <Text style={styles.createButtonText}>Create New Project</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    filteredProjects.map((project) => (
                        <TouchableOpacity
                            key={project.id}
                            style={[styles.projectCard, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light }]}
                            onPress={() => handleProjectPress(project)}
                            activeOpacity={0.9}
                        >
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F3E5F5' }]}>
                                    <Text style={[styles.projectIcon, { color: themedColors.primary.main }]}>
                                        {project.subject ? project.subject.charAt(0) : 'P'}
                                    </Text>
                                </View>
                                <View style={styles.headerTextContainer}>
                                    <Text style={[styles.projectTitle, { color: themedColors.text.primary }]} numberOfLines={1}>
                                        {project.title}
                                    </Text>
                                    <Text style={[styles.projectSubject, { color: themedColors.text.secondary }]}>{project.subject}</Text>
                                </View>
                                {project.completed && (
                                    <View style={styles.completedBadge}>
                                        <Ionicons name="checkmark" size={12} color="#FFF" />
                                    </View>
                                )}
                            </View>

                            <View style={[styles.cardFooter, { borderTopColor: themedColors.border.light }]}>
                                <View style={[styles.stageBadge, { backgroundColor: getStageColor(project.current_stage) + '20' }]}>
                                    <Text style={[styles.stageText, { color: getStageColor(project.current_stage) }]}>
                                        {project.current_stage}
                                    </Text>
                                </View>
                                <View style={styles.footerRight}>
                                    <View style={styles.dateContainer}>
                                        <Ionicons name="time-outline" size={14} color={themedColors.text.secondary} />
                                        <Text style={[styles.projectDate, { color: themedColors.text.secondary }]}>
                                            {new Date(project.updated_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteProject(project)}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#F44336" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {projects.length > 0 && (
                <TouchableOpacity style={styles.fab} onPress={handleNewProject} activeOpacity={0.8}>
                    <LinearGradient
                        colors={themedColors.gradients.primary}
                        style={styles.fabGradient}
                    >
                        <Ionicons name="add" size={32} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    loadingText: {
        marginTop: 16,
        color: '#666',
        fontSize: 16,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: '#6A1B9A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },
    profileButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E1BEE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 24,
        marginBottom: 32,
    },
    createButton: {
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#6A1B9A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    createButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    projectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3E5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    projectIcon: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7B1FA2',
    },
    headerTextContainer: {
        flex: 1,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    projectSubject: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    completedBadge: {
        backgroundColor: '#4CAF50',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    stageBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    stageText: {
        fontSize: 12,
        fontWeight: '600',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    projectDate: {
        fontSize: 12,
        color: '#9E9E9E',
        marginLeft: 4,
    },
    footerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    deleteButton: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        borderRadius: 28,
        elevation: 8,
        shadowColor: '#6A1B9A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    fabGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginTop: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
    },
});

export default ProjectListScreen;
