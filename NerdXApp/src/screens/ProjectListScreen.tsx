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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { projectApi, Project } from '../services/api/projectApi';
import { useAuth } from '../context/AuthContext';

const ProjectListScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
        } catch (error: any) {
            Alert.alert('Error', 'Failed to load projects');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadProjects();
    };

    const handleProjectPress = (project: Project) => {
        navigation.navigate('ProjectAssistant' as never, {
            projectId: project.id,
            projectTitle: project.title,
            subject: project.subject,
        } as never);
    };

    const handleNewProject = () => {
        navigation.navigate('ProjectAssistantSetup' as never);
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

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#9C27B0" />
                <Text style={styles.loadingText}>Loading projects...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📚 My Projects</Text>
                <Text style={styles.headerSubtitle}>
                    {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#9C27B0']} />
                }
            >
                {projects.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.emptyTitle}>No Projects Yet</Text>
                        <Text style={styles.emptyText}>
                            Start your first ZIMSEC project and get AI-powered guidance!
                        </Text>
                    </View>
                ) : (
                    projects.map((project) => (
                        <TouchableOpacity
                            key={project.id}
                            style={styles.projectCard}
                            onPress={() => handleProjectPress(project)}
                        >
                            <View style={styles.projectHeader}>
                                <Text style={styles.projectTitle} numberOfLines={2}>
                                    {project.title}
                                </Text>
                                {project.completed && (
                                    <View style={styles.completedBadge}>
                                        <Text style={styles.completedText}>✓</Text>
                                    </View>
                                )}
                            </View>

                            <Text style={styles.projectSubject}>{project.subject}</Text>

                            <View style={styles.projectFooter}>
                                <View style={[styles.stageBadge, { backgroundColor: getStageColor(project.current_stage) }]}>
                                    <Text style={styles.stageText}>{project.current_stage}</Text>
                                </View>
                                <Text style={styles.projectDate}>
                                    Updated: {new Date(project.updated_at).toLocaleDateString()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={handleNewProject}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        marginTop: 10,
        color: '#757575',
    },
    header: {
        backgroundColor: '#9C27B0',
        padding: 20,
        paddingTop: 50,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 15,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    projectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212121',
        flex: 1,
        marginRight: 10,
    },
    completedBadge: {
        backgroundColor: '#4CAF50',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    projectSubject: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 12,
    },
    projectFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stageBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    stageText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    projectDate: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#9C27B0',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
});

export default ProjectListScreen;
