// Science Notes Screen - Professional UI with Biology/Chemistry/Physics tabs
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    StatusBar,
    Dimensions,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { scienceNotesApi } from '../services/api/scienceNotesApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

const { width } = Dimensions.get('window');

type ScienceSubject = 'Biology' | 'Chemistry' | 'Physics';

const ScienceNotesScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [activeTab, setActiveTab] = useState<ScienceSubject>('Biology');
    const [topics, setTopics] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTopics();
    }, [activeTab]);

    const loadTopics = async () => {
        try {
            setLoading(true);
            const topicsList = await scienceNotesApi.getTopics(activeTab);
            setTopics(topicsList);
        } catch (error: any) {
            Alert.alert('Error', 'Failed to load topics');
        } finally {
            setLoading(false);
        }
    };

    const handleTopicPress = (topic: string) => {
        navigation.navigate('TopicNotesDetail' as never, {
            subject: activeTab,
            topic: topic,
        } as never);
    };

    const getSubjectColor = (subject: ScienceSubject) => {
        switch (subject) {
            case 'Biology':
                return '#4CAF50';
            case 'Chemistry':
                return '#FF9800';
            case 'Physics':
                return '#2196F3';
        }
    };

    const getSubjectIcon = (subject: ScienceSubject) => {
        switch (subject) {
            case 'Biology':
                return 'leaf-outline';
            case 'Chemistry':
                return 'flask-outline';
            case 'Physics':
                return 'planet-outline';
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1A237E', '#283593', '#3949AB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.overlay}
            >
                <StatusBar barStyle="light-content" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Science Notes</Text>
                    <View style={styles.creditContainer}>
                        <Ionicons name="wallet-outline" size={16} color="#FFF" />
                        <Text style={styles.creditText}>{user?.credits || 0}</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {(['Biology', 'Chemistry', 'Physics'] as ScienceSubject[]).map((subject) => (
                        <TouchableOpacity
                            key={subject}
                            style={[styles.tab, activeTab === subject && styles.activeTab]}
                            onPress={() => setActiveTab(subject)}
                        >
                            <Ionicons
                                name={getSubjectIcon(subject) as any}
                                size={20}
                                color={activeTab === subject ? '#FFF' : 'rgba(255,255,255,0.7)'}
                            />
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === subject && styles.activeTabText,
                                ]}
                            >
                                {subject}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Content */}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FFF" />
                            <Text style={styles.loadingText}>Loading topics...</Text>
                        </View>
                    ) : (
                        <View style={styles.topicsContainer}>
                            <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>{activeTab} Topics</Text>
                            <Text style={[styles.sectionSubtitle, { color: 'rgba(255,255,255,0.85)' }]}>
                                Detailed notes aligned with O-Level syllabus
                            </Text>

                            {topics.map((topic, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.topicCard}
                                    onPress={() => handleTopicPress(topic)}
                                >
                                    <LinearGradient
                                        colors={['#FFFFFF', '#F8F9FA']}
                                        style={styles.topicCardGradient}
                                    >
                                        <View style={styles.topicCardContent}>
                                            <View style={[styles.topicIcon, { backgroundColor: `${getSubjectColor(activeTab)}15` }]}>
                                                <Ionicons
                                                    name="book-outline"
                                                    size={24}
                                                    color={getSubjectColor(activeTab)}
                                                />
                                            </View>
                                            <View style={styles.topicInfo}>
                                                <Text style={[styles.topicTitle, { color: '#1A1A1A' }]}>{topic}</Text>
                                                <Text style={[styles.topicSubtitle, { color: '#666666' }]}>Tap to view notes</Text>
                                            </View>
                                            <Ionicons
                                                name="chevron-forward"
                                                size={24}
                                                color={getSubjectColor(activeTab)}
                                            />
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}

                            {topics.length === 0 && !loading && (
                                <View style={styles.emptyState}>
                                    <Ionicons name="document-text-outline" size={64} color="rgba(255,255,255,0.7)" />
                                    <Text style={[styles.emptyStateText, { color: '#FFFFFF' }]}>No notes available yet</Text>
                                    <Text style={[styles.emptyStateSubtext, { color: 'rgba(255,255,255,0.8)' }]}>
                                        Notes for {activeTab} topics are being prepared
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    creditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    creditText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    topicsContainer: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 20,
    },
    topicCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    topicCardGradient: {
        padding: 16,
        borderRadius: 16,
    },
    topicCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topicIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    topicInfo: {
        flex: 1,
    },
    topicTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    topicSubtitle: {
        fontSize: 13,
        color: Colors.text.secondary,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginTop: 8,
        textAlign: 'center',
    },
});

export default ScienceNotesScreen;
