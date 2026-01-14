// Teacher Mode History Screen - Premium UI
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    StatusBar,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { teacherApi, TeacherHistoryItem } from '../services/api/teacherApi';
import { Colors } from '../theme/colors';

const TeacherHistoryScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [history, setHistory] = useState<TeacherHistoryItem[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<TeacherHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        try {
            setLoading(true);
            const data = await teacherApi.getHistory();

            // If empty, add some mock data for demonstration if user has no history
            // Remove this block in production when backend is fully ready
            if (!data || data.length === 0) {
                const mockData: TeacherHistoryItem[] = [
                    {
                        session_id: 'mock-1',
                        subject: 'Biology',
                        grade_level: 'Form 3-4 (O-Level)',
                        topic: 'Cell Structure',
                        last_message: 'The mitochondria is the powerhouse of the cell.',
                        updated_at: new Date().toISOString(),
                    },
                    {
                        session_id: 'mock-2',
                        subject: 'O Level Mathematics',
                        grade_level: 'Form 3-4 (O-Level)',
                        topic: 'Quadratic Equations',
                        last_message: 'To solve x² + 5x + 6 = 0, we can factorize it.',
                        updated_at: new Date(Date.now() - 86400000).toISOString(),
                    },
                ];
                setHistory(mockData);
                setFilteredHistory(mockData);
            } else {
                setHistory(data);
                setFilteredHistory(data);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
            Alert.alert('Error', 'Failed to load history.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim() === '') {
            setFilteredHistory(history);
        } else {
            const lowerText = text.toLowerCase();
            const filtered = history.filter(
                (item) =>
                    item.subject.toLowerCase().includes(lowerText) ||
                    (item.topic && item.topic.toLowerCase().includes(lowerText)) ||
                    (item.last_message && item.last_message.toLowerCase().includes(lowerText))
            );
            setFilteredHistory(filtered);
        }
    };

    const handleDelete = (item: TeacherHistoryItem) => {
        Alert.alert(
            'Delete Session',
            'Are you sure you want to delete this session logs?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Optimistic update
                            const newHistory = history.filter(h => h.session_id !== item.session_id);
                            setHistory(newHistory);
                            setFilteredHistory(newHistory.filter(
                                (h) =>
                                    h.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    (h.topic && h.topic.toLowerCase().includes(searchQuery.toLowerCase()))
                            ));

                            await teacherApi.deleteSession(item.session_id);
                        } catch (error) {
                            console.error('Delete failed', error);
                            Alert.alert('Error', 'Failed to delete session');
                            loadHistory(); // Revert on failure
                        }
                    }
                }
            ]
        );
    };

    const handlePress = (item: TeacherHistoryItem) => {
        // Navigate to TeacherMode and perhaps restore session 
        // For now, simpler to just start a new session with same params
        navigation.navigate('TeacherMode' as never, {
            subject: item.subject,
            gradeLevel: item.grade_level,
            topic: item.topic,
        } as never);
    };

    const getSubjectColor = (subject: string) => {
        const colors: { [key: string]: string } = {
            'O Level Mathematics': '#667eea',
            'Pure Mathematics': '#5A67D8',
            'Biology': '#4CAF50',
            'Chemistry': '#FF9800',
            'Physics': '#2196F3',
        };
        return colors[subject] || '#9C27B0';
    };

    const renderItem = ({ item }: { item: TeacherHistoryItem }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light }]}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: getSubjectColor(item.subject) + '20' }]}>
                    <Text style={styles.iconText}>
                        {item.subject === 'O Level Mathematics' ? '📐' :
                            item.subject === 'Pure Mathematics' ? '∫' :
                                item.subject === 'Biology' ? '🧬' :
                                    item.subject === 'Chemistry' ? '⚗️' :
                                        item.subject === 'Physics' ? '⚛️' : '🎓'}
                    </Text>
                </View>
                <View style={styles.headerText}>
                    <Text style={[styles.subjectText, { color: themedColors.text.primary }]}>{item.subject}</Text>
                    <Text style={[styles.dateText, { color: themedColors.text.secondary }]}>
                        {new Date(item.updated_at).toLocaleDateString()} • {new Date(item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={themedColors.error.main} />
                </TouchableOpacity>
            </View>

            {item.topic && (
                <View style={[styles.topicBadge, { backgroundColor: getSubjectColor(item.subject) + '15' }]}>
                    <Text style={[styles.topicText, { color: getSubjectColor(item.subject) }]}>
                        {item.topic}
                    </Text>
                </View>
            )}

            {item.last_message && (
                <Text style={[styles.previewText, { color: themedColors.text.secondary }]} numberOfLines={2}>
                    {item.last_message}
                </Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={themedColors.background.default} />

            {/* Header */}
            <LinearGradient
                colors={themedColors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Session History</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search sessions..."
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

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={themedColors.primary.main} />
                </View>
            ) : (
                <FlatList
                    data={filteredHistory}
                    keyExtractor={(item) => item.session_id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="time-outline" size={64} color={themedColors.text.disabled} />
                            <Text style={[styles.emptyText, { color: themedColors.text.secondary }]}>
                                No history found
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
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
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconText: {
        fontSize: 22,
    },
    headerText: {
        flex: 1,
    },
    subjectText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    dateText: {
        fontSize: 12,
    },
    deleteButton: {
        padding: 8,
    },
    topicBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
    },
    topicText: {
        fontSize: 12,
        fontWeight: '600',
    },
    previewText: {
        fontSize: 14,
        lineHeight: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
    },
});

export default TeacherHistoryScreen;
