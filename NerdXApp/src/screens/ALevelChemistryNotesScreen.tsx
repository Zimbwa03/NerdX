// A Level Chemistry Notes Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Platform,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { aLevelChemistryTopics, ALevelChemistryTopic } from '../data/aLevelChemistry';
import { aLevelChemistryNotesApi } from '../services/api/aLevelChemistryNotesApi';

const ALevelChemistryNotesScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();

    const [selectedLevel, setSelectedLevel] = useState<'AS Level' | 'A2 Level'>('AS Level');

    const filteredTopics = aLevelChemistryTopics.filter(
        topic => topic.difficulty === selectedLevel
    );

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Physical Chemistry': return '#7B1FA2';
            case 'Inorganic Chemistry': return '#0288D1';
            case 'Organic Chemistry': return '#388E3C';
            case 'Analysis': return '#F57C00';
            default: return '#00897B';
        }
    };

    const handleTopicPress = (topic: ALevelChemistryTopic) => {
        // Check if notes are available
        const hasNotes = aLevelChemistryNotesApi.hasNotes(topic.name);
        
        if (hasNotes) {
            // Navigate to detailed notes screen
            navigation.navigate('TopicNotesDetail' as never, {
                subject: 'A Level Chemistry',
                topic: topic.name,
                isALevel: true,
                topicData: topic
            } as never);
        } else {
            Alert.alert(
                topic.name,
                `Notes for ${topic.name} are being prepared.\n\nCategory: ${topic.category}\n\nLearning Objectives:\n• ${topic.learningObjectives.slice(0, 3).join('\n• ')}`,
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00695C', '#00897B', '#26A69A']}
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
                    <Text style={styles.headerTitle}>A Level Chemistry Notes</Text>
                    <View style={styles.creditContainer}>
                        <Ionicons name="wallet-outline" size={16} color="#FFF" />
                        <Text style={styles.creditText}>{user?.credits || 0}</Text>
                    </View>
                </View>

                {/* Level Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, selectedLevel === 'AS Level' && styles.activeTab]}
                        onPress={() => setSelectedLevel('AS Level')}
                    >
                        <Ionicons
                            name="school-outline"
                            size={20}
                            color={selectedLevel === 'AS Level' ? '#FFF' : 'rgba(255,255,255,0.7)'}
                        />
                        <Text style={[
                            styles.tabText,
                            selectedLevel === 'AS Level' && styles.activeTabText
                        ]}>
                            AS Level
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedLevel === 'A2 Level' && styles.activeTab]}
                        onPress={() => setSelectedLevel('A2 Level')}
                    >
                        <Ionicons
                            name="rocket-outline"
                            size={20}
                            color={selectedLevel === 'A2 Level' ? '#FFF' : 'rgba(255,255,255,0.7)'}
                        />
                        <Text style={[
                            styles.tabText,
                            selectedLevel === 'A2 Level' && styles.activeTabText
                        ]}>
                            A2 Level
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.topicsContainer}>
                        <Text style={styles.sectionTitle}>{selectedLevel} Topics</Text>
                        <Text style={styles.sectionSubtitle}>
                            Detailed notes aligned with Cambridge/ZIMSEC syllabus
                        </Text>

                        {filteredTopics.map((topic) => (
                            <TouchableOpacity
                                key={topic.id}
                                style={styles.topicCard}
                                onPress={() => handleTopicPress(topic)}
                            >
                                <LinearGradient
                                    colors={['#FFFFFF', '#F8F9FA']}
                                    style={styles.topicCardGradient}
                                >
                                    <View style={styles.topicCardContent}>
                                        <View style={[
                                            styles.topicIcon,
                                            { backgroundColor: `${getCategoryColor(topic.category)}15` }
                                        ]}>
                                            <Ionicons
                                                name={
                                                    topic.category === 'Physical Chemistry' ? 'thermometer-outline' :
                                                        topic.category === 'Inorganic Chemistry' ? 'grid-outline' :
                                                            topic.category === 'Organic Chemistry' ? 'leaf-outline' :
                                                                'analytics-outline'
                                                }
                                                size={24}
                                                color={getCategoryColor(topic.category)}
                                            />
                                        </View>
                                        <View style={styles.topicInfo}>
                                            <Text style={styles.topicTitle}>{topic.name}</Text>
                                            <Text style={[styles.topicCategory, { color: getCategoryColor(topic.category) }]}>
                                                {topic.category}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={24}
                                            color={getCategoryColor(topic.category)}
                                        />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}

                        <View style={styles.comingSoon}>
                            <Ionicons name="construct-outline" size={32} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.comingSoonText}>
                                Detailed notes for each topic are being prepared
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    overlay: { flex: 1 },
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
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    creditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    creditText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
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
    activeTab: { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
    tabText: { fontSize: 14, fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' },
    activeTabText: { color: '#FFFFFF' },
    scrollContent: { paddingBottom: 40 },
    topicsContainer: { paddingHorizontal: 20 },
    sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5 },
    sectionSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 20 },
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
    topicCardGradient: { padding: 16, borderRadius: 16 },
    topicCardContent: { flexDirection: 'row', alignItems: 'center' },
    topicIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    topicInfo: { flex: 1 },
    topicTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
    topicCategory: { fontSize: 12, fontWeight: '500' },
    comingSoon: {
        alignItems: 'center',
        marginTop: 30,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
    },
    comingSoonText: {
        fontSize: 14,
        color: '#FFFFFF',
        marginTop: 12,
        textAlign: 'center',
    },
});

export default ALevelChemistryNotesScreen;
