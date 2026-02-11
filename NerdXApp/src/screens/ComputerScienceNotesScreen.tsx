// Computer Science Notes Screen - Professional UI with ZimSec/Cambridge board toggle
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { quizApi } from '../services/api/quizApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { computerScienceTopics } from '../data/computerScienceNotes';

const { width } = Dimensions.get('window');
const CS_BOARD_STORAGE_KEY = '@nerdx_cs_board';

const ComputerScienceNotesScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [csBoard, setCsBoard] = useState<'zimsec' | 'cambridge'>('zimsec');
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load persisted board preference
        AsyncStorage.getItem(CS_BOARD_STORAGE_KEY).then((v) => {
            if (v === 'cambridge' || v === 'zimsec') setCsBoard(v);
        });
    }, []);

    useEffect(() => {
        loadTopics();
    }, [csBoard]);

    const loadTopics = async () => {
        try {
            setLoading(true);
            const topicsList = await quizApi.getTopics('computer_science', undefined, csBoard);
            // Use local O-Level Computer Science topics if API returns none (e.g. offline or backend not configured)
            if (topicsList && topicsList.length > 0) {
                setTopics(topicsList);
            } else {
                setTopics(
                    computerScienceTopics.map((name, index) => ({
                        id: `cs-local-${index}`,
                        name,
                        subject: 'Computer Science',
                    }))
                );
            }
        } catch (error: any) {
            // Fallback to local notes when API fails (e.g. offline)
            setTopics(
                computerScienceTopics.map((name, index) => ({
                    id: `cs-local-${index}`,
                    name,
                    subject: 'Computer Science',
                }))
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBoardToggle = async (board: 'zimsec' | 'cambridge') => {
        setCsBoard(board);
        await AsyncStorage.setItem(CS_BOARD_STORAGE_KEY, board);
        loadTopics();
    };

    const handleTopicPress = (topic: any) => {
        // Navigate to topic notes detail screen
        navigation.navigate('TopicNotesDetail' as never, {
            subject: 'Computer Science',
            topic: topic.name,
            board: csBoard,
            index: topics.indexOf(topic),
        } as never);
    };

    const csColor = '#0288D1';

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#01579B', '#0277BD', '#0288D1']}
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
                    <Text style={styles.headerTitle}>Computer Science Notes</Text>
                    <View style={styles.creditContainer}>
                        <Ionicons name="wallet-outline" size={16} color="#FFF" />
                        <Text style={styles.creditText}>{user?.credits || 0}</Text>
                    </View>
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
                            <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
                                Computer Science Topics
                            </Text>
                            <Text style={[styles.sectionSubtitle, { color: 'rgba(255,255,255,0.85)' }]}>
                                Comprehensive notes aligned with O-Level Computer Science syllabus
                            </Text>

                            {topics.map((topic, index) => (
                                <TouchableOpacity
                                    key={topic.id || index}
                                    style={styles.topicCard}
                                    onPress={() => handleTopicPress(topic)}
                                >
                                    <LinearGradient
                                        colors={['#FFFFFF', '#F8F9FA']}
                                        style={styles.topicCardGradient}
                                    >
                                        <View style={styles.topicCardContent}>
                                            <View style={[styles.topicIcon, { backgroundColor: `${csColor}15` }]}>
                                                <Ionicons
                                                    name="hardware-chip-outline"
                                                    size={24}
                                                    color={csColor}
                                                />
                                            </View>
                                            <View style={styles.topicInfo}>
                                                <Text style={[styles.topicTitle, { color: '#1A1A1A' }]}>{topic.name}</Text>
                                                <Text style={[styles.topicSubtitle, { color: '#666666' }]}>Tap to view notes</Text>
                                            </View>
                                            <Ionicons
                                                name="chevron-forward"
                                                size={24}
                                                color={csColor}
                                            />
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}

                            {topics.length === 0 && !loading && (
                                <View style={styles.emptyState}>
                                    <Ionicons name="document-text-outline" size={64} color="rgba(255,255,255,0.7)" />
                                    <Text style={[styles.emptyStateText, { color: '#FFFFFF' }]}>No topics available</Text>
                                    <Text style={[styles.emptyStateSubtext, { color: 'rgba(255,255,255,0.8)' }]}>
                                        Topics are being loaded
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

export default ComputerScienceNotesScreen;
