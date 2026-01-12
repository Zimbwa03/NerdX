// A Level Biology Notes Screen
// Comprehensive notes for each ZIMSEC syllabus topic
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import { Card } from '../components/Card';
import { aLevelBiologyTopics, ALevelBiologyTopic, topicCounts } from '../data/aLevelBiology';

// Theme colors matching the main screen
const biologyColors = {
    primary: ['#059669', '#10B981', '#34D399'],
    lowerSixth: ['#10B981', '#059669'],
    upperSixth: ['#0891B2', '#06B6D4'],
    light: 'rgba(16, 185, 129, 0.1)',
};

const ALevelBiologyNotesScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [selectedLevel, setSelectedLevel] = useState<'Lower Sixth' | 'Upper Sixth'>('Lower Sixth');
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    // Filter topics by selected level
    const filteredTopics = aLevelBiologyTopics.filter(
        topic => topic.difficulty === selectedLevel
    );

    const handleTopicPress = (topic: ALevelBiologyTopic) => {
        if (expandedTopic === topic.id) {
            setExpandedTopic(null);
        } else {
            setExpandedTopic(topic.id);
        }
    };

    const handleViewDetailedNotes = (topic: ALevelBiologyTopic) => {
        // Navigate to detailed notes screen
        navigation.navigate('TopicNotesDetail' as never, {
            topic: topic.name,
            subject: 'Biology',
            isALevel: true,
            topicData: topic,
            index: filteredTopics.indexOf(topic)
        } as never);
    };

    // Get icon for topic
    const getTopicIcon = (topicId: string): string => {
        const iconMap: { [key: string]: string } = {
            'cell_structure': 'bacteria-outline',
            'biological_molecules': 'molecule',
            'enzymes': 'flask-outline',
            'cell_membranes': 'circle-double',
            'cell_division': 'reload',
            'nucleic_acids': 'dna',
            'transport_plants': 'leaf',
            'transport_mammals': 'heart-pulse',
            'gas_exchange': 'lungs',
            'infectious_diseases': 'virus',
            'immunity': 'shield-check',
            'smoking_health': 'smoking-off',
            'energy_respiration': 'lightning-bolt',
            'photosynthesis': 'white-balance-sunny',
            'homeostasis': 'scale-balance',
            'excretion': 'kidney',
            'nervous_coordination': 'brain',
            'hormonal_coordination': 'chemical-weapon',
            'meiosis_genetics': 'family-tree',
            'selection_evolution': 'chart-timeline-variant',
            'biodiversity_classification': 'pine-tree',
            'genetic_technology': 'scissors-cutting',
            'ecology': 'earth',
            'human_environment': 'factory',
            'reproduction': 'baby-carriage',
        };
        return iconMap[topicId] || 'leaf';
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={biologyColors.primary}
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
                        <Text style={styles.title}>Biology Notes</Text>
                        <Text style={styles.subtitle}>Comprehensive A Level study materials</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <MaterialCommunityIcons name="book-open-page-variant" size={40} color="rgba(255,255,255,0.9)" />
                    </View>
                </View>
            </LinearGradient>

            {/* Level Tabs */}
            <View style={[styles.tabContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <TouchableOpacity
                    style={[styles.tab, selectedLevel === 'Lower Sixth' && styles.tabActive]}
                    onPress={() => setSelectedLevel('Lower Sixth')}
                >
                    {selectedLevel === 'Lower Sixth' ? (
                        <LinearGradient colors={biologyColors.lowerSixth} style={styles.tabGradient}>
                            <Text style={styles.tabTextActive}>Lower Sixth</Text>
                            <Text style={styles.tabSubtext}>{topicCounts.lowerSixth} Topics</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={[styles.tabText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }]}>Lower Sixth</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedLevel === 'Upper Sixth' && styles.tabActive]}
                    onPress={() => setSelectedLevel('Upper Sixth')}
                >
                    {selectedLevel === 'Upper Sixth' ? (
                        <LinearGradient colors={biologyColors.upperSixth} style={styles.tabGradient}>
                            <Text style={styles.tabTextActive}>Upper Sixth</Text>
                            <Text style={styles.tabSubtext}>{topicCounts.upperSixth} Topics</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={[styles.tabText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }]}>Upper Sixth</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Topics with expandable content */}
                <View style={styles.topicsContainer}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                        {selectedLevel} Study Materials
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: themedColors.text.secondary }]}>
                        Tap a topic to see key concepts and learning objectives
                    </Text>

                    {filteredTopics.map((topic, index) => (
                        <View key={topic.id}>
                            <Card
                                variant="elevated"
                                onPress={() => handleTopicPress(topic)}
                                style={styles.topicCard}
                            >
                                <View style={styles.topicHeader}>
                                    <View style={[
                                        styles.topicIcon,
                                        {
                                            backgroundColor: selectedLevel === 'Lower Sixth'
                                                ? biologyColors.light
                                                : 'rgba(8, 145, 178, 0.1)'
                                        }
                                    ]}>
                                        <MaterialCommunityIcons
                                            name={getTopicIcon(topic.id) as any}
                                            size={24}
                                            color={selectedLevel === 'Lower Sixth' ? '#10B981' : '#0891B2'}
                                        />
                                    </View>
                                    <View style={styles.topicTitleContainer}>
                                        <Text style={[styles.topicName, { color: themedColors.text.primary }]}>
                                            {index + 1}. {topic.name}
                                        </Text>
                                        <View style={styles.topicMetaRow}>
                                            <Text style={[styles.topicMeta, { color: themedColors.text.secondary }]}>
                                                {topic.paperRelevance}
                                            </Text>
                                            {topic.practicalComponent && (
                                                <Text style={[styles.practicalBadge, { color: '#F59E0B' }]}>
                                                    🧪 Practical
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    <Ionicons
                                        name={expandedTopic === topic.id ? 'chevron-up' : 'chevron-down'}
                                        size={24}
                                        color={themedColors.text.secondary}
                                    />
                                </View>
                            </Card>

                            {/* Expanded Content */}
                            {expandedTopic === topic.id && (
                                <View style={[styles.expandedContent, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.03)' }]}>
                                    {/* Description */}
                                    <Text style={[styles.expandedDescription, { color: themedColors.text.primary }]}>
                                        {topic.description}
                                    </Text>

                                    {/* Learning Objectives */}
                                    <Text style={[styles.expandedSectionTitle, { color: themedColors.text.primary }]}>
                                        📚 Learning Objectives
                                    </Text>
                                    {topic.learningObjectives.map((obj, i) => (
                                        <View key={i} style={styles.objectiveRow}>
                                            <Text style={[styles.bulletPoint, { color: '#10B981' }]}>•</Text>
                                            <Text style={[styles.objectiveText, { color: themedColors.text.secondary }]}>
                                                {obj}
                                            </Text>
                                        </View>
                                    ))}

                                    {/* Key Terms */}
                                    {topic.keyTerms && topic.keyTerms.length > 0 && (
                                        <>
                                            <Text style={[styles.expandedSectionTitle, { color: themedColors.text.primary }]}>
                                                🔬 Key Terms
                                            </Text>
                                            <View style={styles.keyTermsContainer}>
                                                {topic.keyTerms.map((term, i) => (
                                                    <View key={i} style={[styles.keyTermBadge, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)' }]}>
                                                        <Text style={[styles.keyTermText, { color: '#10B981' }]}>
                                                            {term}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </>
                                    )}

                                    {/* View Detailed Notes Button */}
                                    <TouchableOpacity
                                        style={[styles.detailButton, { backgroundColor: selectedLevel === 'Lower Sixth' ? '#10B981' : '#0891B2' }]}
                                        onPress={() => handleViewDetailedNotes(topic)}
                                    >
                                        <Text style={styles.detailButtonText}>View Detailed Notes</Text>
                                        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
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
    topicsContainer: {
        padding: 20,
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
        marginBottom: 8,
        borderColor: Colors.border.light,
        borderWidth: 1,
    },
    topicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        gap: 12,
    },
    topicIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicTitleContainer: {
        flex: 1,
    },
    topicName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    topicMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    topicMeta: {
        fontSize: 12,
    },
    practicalBadge: {
        fontSize: 12,
        fontWeight: '500',
    },
    expandedContent: {
        marginHorizontal: 4,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    expandedDescription: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 16,
        fontStyle: 'italic',
    },
    expandedSectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 8,
    },
    objectiveRow: {
        flexDirection: 'row',
        marginBottom: 6,
        paddingRight: 8,
    },
    bulletPoint: {
        fontSize: 14,
        marginRight: 8,
        fontWeight: 'bold',
    },
    objectiveText: {
        fontSize: 13,
        lineHeight: 20,
        flex: 1,
    },
    keyTermsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    keyTermBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    keyTermText: {
        fontSize: 12,
        fontWeight: '500',
    },
    detailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
    },
    detailButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default ALevelBiologyNotesScreen;

