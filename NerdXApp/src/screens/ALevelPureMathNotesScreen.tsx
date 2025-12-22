// A Level Pure Mathematics Notes Screen
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
import { aLevelPureMathTopics, ALevelPureMathTopic, topicCounts } from '../data/aLevelPureMath';

// Theme colors matching the main screen
const pureMathColors = {
    primary: ['#7C3AED', '#8B5CF6', '#A78BFA'],
    lowerSixth: ['#8B5CF6', '#7C3AED'],
    upperSixth: ['#EC4899', '#DB2777'],
    light: 'rgba(139, 92, 246, 0.1)',
};

const ALevelPureMathNotesScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [selectedLevel, setSelectedLevel] = useState<'Lower Sixth' | 'Upper Sixth'>('Lower Sixth');
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    // Filter topics by selected level
    const filteredTopics = aLevelPureMathTopics.filter(
        topic => topic.difficulty === selectedLevel
    );

    const handleTopicPress = (topic: ALevelPureMathTopic) => {
        if (expandedTopic === topic.id) {
            setExpandedTopic(null);
        } else {
            setExpandedTopic(topic.id);
        }
    };

    const handleViewDetailedNotes = (topic: ALevelPureMathTopic) => {
        // Navigate to detailed notes screen
        navigation.navigate('MathNotesDetail' as never, { 
            topic: topic.name,
            isALevel: true,
            topicData: topic 
        } as never);
    };

    // Get icon for topic
    const getTopicIcon = (topicId: string): string => {
        const iconMap: { [key: string]: string } = {
            'polynomials': 'function-variant',
            'rational_functions': 'chart-line-variant',
            'indices_surds_logs': 'exponent',
            'quadratic_functions': 'chart-bell-curve',
            'functions': 'swap-horizontal',
            'coordinate_geometry': 'axis-arrow',
            'sequences_series': 'format-list-numbered',
            'binomial_theorem': 'vector-triangle',
            'trigonometry_basic': 'sine-wave',
            'differentiation_basic': 'slope-uphill',
            'applications_differentiation': 'chart-areaspline',
            'integration_basic': 'sigma',
            'further_trigonometry': 'cosine-wave',
            'hyperbolic_functions': 'math-integral',
            'further_differentiation': 'function',
            'further_integration': 'math-integral-box',
            'differential_equations': 'delta',
            'complex_numbers': 'alpha-i-circle',
            'matrices': 'grid',
            'vectors_3d': 'axis-x-rotate-counterclockwise',
            'summation_series': 'sigma',
            'numerical_methods': 'calculator-variant',
            'proof': 'check-decagram',
            'groups': 'set-center',
        };
        return iconMap[topicId] || 'math-compass';
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={pureMathColors.primary}
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
                        <Text style={styles.title}>Pure Math Notes</Text>
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
                        <LinearGradient colors={pureMathColors.lowerSixth} style={styles.tabGradient}>
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
                        <LinearGradient colors={pureMathColors.upperSixth} style={styles.tabGradient}>
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
                        Tap a topic to see key concepts and formulas
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
                                                ? pureMathColors.light
                                                : 'rgba(236, 72, 153, 0.1)'
                                        }
                                    ]}>
                                        <MaterialCommunityIcons
                                            name={getTopicIcon(topic.id) as any}
                                            size={24}
                                            color={selectedLevel === 'Lower Sixth' ? '#8B5CF6' : '#EC4899'}
                                        />
                                    </View>
                                    <View style={styles.topicTitleContainer}>
                                        <Text style={[styles.topicName, { color: themedColors.text.primary }]}>
                                            {index + 1}. {topic.name}
                                        </Text>
                                        <Text style={[styles.topicDescription, { color: themedColors.text.secondary }]}>
                                            {topic.paperRelevance} • {topic.learningObjectives.length} objectives
                                        </Text>
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
                                <View style={[styles.expandedContent, { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.03)' }]}>
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
                                            <Text style={[styles.bulletPoint, { color: '#8B5CF6' }]}>•</Text>
                                            <Text style={[styles.objectiveText, { color: themedColors.text.secondary }]}>
                                                {obj}
                                            </Text>
                                        </View>
                                    ))}

                                    {/* Key Formulas */}
                                    {topic.keyFormulas && topic.keyFormulas.length > 0 && (
                                        <>
                                            <Text style={[styles.expandedSectionTitle, { color: themedColors.text.primary }]}>
                                                📐 Key Formulas
                                            </Text>
                                            <View style={[styles.formulaBox, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }]}>
                                                {topic.keyFormulas.map((formula, i) => (
                                                    <Text key={i} style={[styles.formulaText, { color: themedColors.text.primary }]}>
                                                        {formula}
                                                    </Text>
                                                ))}
                                            </View>
                                        </>
                                    )}

                                    {/* View Detailed Notes Button */}
                                    <TouchableOpacity
                                        style={[styles.detailButton, { backgroundColor: selectedLevel === 'Lower Sixth' ? '#8B5CF6' : '#EC4899' }]}
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
    topicDescription: {
        fontSize: 12,
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
    formulaBox: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    formulaText: {
        fontSize: 13,
        lineHeight: 22,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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

export default ALevelPureMathNotesScreen;

