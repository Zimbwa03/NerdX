// Geography Notes Screen – O-Level and A-Level ZIMSEC Geography
// Shows A-Level topics (Paper 1 / Paper 2) when opened from A-Level Geography; supports Climatology and other topic notes
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import { Card } from '../components/Card';
import { aLevelGeographyTopics, ALevelGeographyTopic, topicCounts, getTopicNotes as getALevelGeographyNotes } from '../data/aLevelGeography';
import { oLevelGeographyTopics, OLevelGeographyTopic } from '../data/oLevelGeography';

const geographyColors = {
    primary: ['#1B5E20', '#2E7D32', '#43A047'],
    paper1: ['#2E7D32', '#388E3C'],
    paper2: ['#558B2F', '#7CB342'],
    light: 'rgba(46, 125, 50, 0.1)',
};

const GeographyNotesScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const subjectId = (route.params as { subjectId?: string } | undefined)?.subjectId ?? 'geography';
    const isALevel = subjectId === 'a_level_geography';
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [selectedPaper, setSelectedPaper] = useState<'Paper 1' | 'Paper 2'>('Paper 1');
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    const filteredTopics = aLevelGeographyTopics.filter(t => t.paper === selectedPaper);

    const handleTopicPress = (topic: ALevelGeographyTopic) => {
        if (expandedTopic === topic.id) {
            setExpandedTopic(null);
        } else {
            setExpandedTopic(topic.id);
        }
    };

    const handleViewDetailedNotes = (topic: ALevelGeographyTopic) => {
        if (!topic.hasNotes) return;
        navigation.navigate('TopicNotesDetail' as never, {
            topic: topic.name,
            subject: 'A Level Geography',
            isALevel: true,
            topicData: topic,
            index: filteredTopics.indexOf(topic),
        } as never);
    };

    const getTopicIcon = (topicId: string): string => {
        const iconMap: Record<string, string> = {
            climatology: 'cloud',
            hydrology_and_fluvial_geomorphology: 'water',
            geomorphology: 'terrain',
            biogeography: 'leaf',
            population_geography: 'people',
            settlement_geography: 'business',
            agriculture_and_food_production: 'nutrition',
            industry_mining_and_energy: 'construct',
            environmental_management: 'leaf-outline',
        };
        return iconMap[topicId] || 'earth';
    };

    // O-Level: show topic list with detailed notes where available
    if (!isALevel) {
        const handleOLevelTopicPress = (topic: OLevelGeographyTopic) => {
            if (expandedTopic === topic.id) setExpandedTopic(null);
            else setExpandedTopic(topic.id);
        };
        const handleViewOLevelNotes = (topic: OLevelGeographyTopic) => {
            if (!topic.hasNotes) return;
            navigation.navigate('TopicNotesDetail' as never, {
                topic: topic.name,
                subject: 'Geography',
                isALevel: false,
                topicData: topic,
                index: oLevelGeographyTopics.indexOf(topic),
            } as never);
        };
        const getOLevelTopicIcon = (topicId: string): string => {
            const iconMap: Record<string, string> = {
                weather_and_climate: 'cloud',
                landforms_and_landscape_processes: 'terrain',
                ecosystems: 'leaf',
                natural_resources: 'earth',
                energy_and_power_development: 'flash',
                map_work_and_gis: 'map',
                minerals_and_mining: 'construct',
                environmental_management: 'leaf-outline',
                agriculture_and_land_reform: 'nutrition',
                industry: 'business',
                settlement_and_population: 'people',
                transport_and_trade: 'car',
            };
            return iconMap[topicId] || 'earth';
        };

        return (
            <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
                <StatusBar barStyle="light-content" />
                <LinearGradient colors={geographyColors.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Text style={styles.backButtonText}>← Back</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>Geography Notes</Text>
                            <Text style={styles.subtitle}>ZIMSEC O-Level Geography (Forms 1–4)</Text>
                        </View>
                        <View style={styles.headerIcon}>
                            <MaterialCommunityIcons name="earth" size={40} color="rgba(255,255,255,0.9)" />
                        </View>
                    </View>
                </LinearGradient>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.topicsContainer}>
                        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                            Topics
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: themedColors.text.secondary }]}>
                            Tap a topic to see description; open detailed notes where available
                        </Text>
                        {oLevelGeographyTopics.map((topic, index) => (
                            <View key={topic.id}>
                                <Card variant="elevated" onPress={() => handleOLevelTopicPress(topic)} style={styles.topicCard}>
                                    <View style={styles.topicHeader}>
                                        <View style={[styles.topicIcon, { backgroundColor: geographyColors.light }]}>
                                            <MaterialCommunityIcons name={getOLevelTopicIcon(topic.id) as any} size={24} color="#2E7D32" />
                                        </View>
                                        <View style={styles.topicTitleContainer}>
                                            <Text style={[styles.topicName, { color: themedColors.text.primary }]}>
                                                {index + 1}. {topic.name}
                                            </Text>
                                            <View style={styles.topicMetaRow}>
                                                {topic.hasNotes && (
                                                    <Text style={[styles.practicalBadge, { color: '#2E7D32' }]}>📖 Notes</Text>
                                                )}
                                            </View>
                                        </View>
                                        <Ionicons name={expandedTopic === topic.id ? 'chevron-up' : 'chevron-down'} size={24} color={themedColors.text.secondary} />
                                    </View>
                                </Card>
                                {expandedTopic === topic.id && (
                                    <View style={[styles.expandedContent, { backgroundColor: isDarkMode ? 'rgba(46, 125, 50, 0.05)' : 'rgba(46, 125, 50, 0.03)' }]}>
                                        <Text style={[styles.expandedDescription, { color: themedColors.text.primary }]}>
                                            {topic.description}
                                        </Text>
                                        {topic.hasNotes && (
                                            <TouchableOpacity
                                                style={[styles.detailButton, { backgroundColor: '#2E7D32' }]}
                                                onPress={() => handleViewOLevelNotes(topic)}
                                            >
                                                <Text style={styles.detailButtonText}>View Detailed Notes</Text>
                                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        );
    }

    // A-Level: Paper 1 / Paper 2 topics with detailed notes where available
    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={geographyColors.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Text style={styles.backButtonText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Geography Notes</Text>
                        <Text style={styles.subtitle}>A Level Physical & Human Geography</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <MaterialCommunityIcons name="earth" size={40} color="rgba(255,255,255,0.9)" />
                    </View>
                </View>
            </LinearGradient>

            <View style={[styles.tabContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <TouchableOpacity
                    style={[styles.tab, selectedPaper === 'Paper 1' && styles.tabActive]}
                    onPress={() => setSelectedPaper('Paper 1')}
                >
                    {selectedPaper === 'Paper 1' ? (
                        <LinearGradient colors={geographyColors.paper1} style={styles.tabGradient}>
                            <Text style={styles.tabTextActive}>Paper 1</Text>
                            <Text style={styles.tabSubtext}>Physical • {topicCounts.paper1} topics</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={[styles.tabText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }]}>Paper 1</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedPaper === 'Paper 2' && styles.tabActive]}
                    onPress={() => setSelectedPaper('Paper 2')}
                >
                    {selectedPaper === 'Paper 2' ? (
                        <LinearGradient colors={geographyColors.paper2} style={styles.tabGradient}>
                            <Text style={styles.tabTextActive}>Paper 2</Text>
                            <Text style={styles.tabSubtext}>Human • {topicCounts.paper2} topics</Text>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInactive}>
                            <Text style={[styles.tabText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }]}>Paper 2</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.topicsContainer}>
                    <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                        {selectedPaper} Topics
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: themedColors.text.secondary }]}>
                        Tap a topic to see description; open detailed notes where available
                    </Text>

                    {filteredTopics.map((topic, index) => (
                        <View key={topic.id}>
                            <Card variant="elevated" onPress={() => handleTopicPress(topic)} style={styles.topicCard}>
                                <View style={styles.topicHeader}>
                                    <View style={[styles.topicIcon, { backgroundColor: geographyColors.light }]}>
                                        <MaterialCommunityIcons name={getTopicIcon(topic.id) as any} size={24} color="#2E7D32" />
                                    </View>
                                    <View style={styles.topicTitleContainer}>
                                        <Text style={[styles.topicName, { color: themedColors.text.primary }]}>
                                            {index + 1}. {topic.name}
                                        </Text>
                                        <View style={styles.topicMetaRow}>
                                            <Text style={[styles.topicMeta, { color: themedColors.text.secondary }]}>{topic.paper}</Text>
                                            {topic.hasNotes && (
                                                <Text style={[styles.practicalBadge, { color: '#2E7D32' }]}>📖 Notes</Text>
                                            )}
                                            {topic.hasNotes && getALevelGeographyNotes(topic.name)?.videoUrl && (
                                                <Text style={[styles.practicalBadge, { color: '#2E7D32' }]}>🎬 Video</Text>
                                            )}
                                        </View>
                                    </View>
                                    <Ionicons name={expandedTopic === topic.id ? 'chevron-up' : 'chevron-down'} size={24} color={themedColors.text.secondary} />
                                </View>
                            </Card>

                            {expandedTopic === topic.id && (
                                <View style={[styles.expandedContent, { backgroundColor: isDarkMode ? 'rgba(46, 125, 50, 0.05)' : 'rgba(46, 125, 50, 0.03)' }]}>
                                    <Text style={[styles.expandedDescription, { color: themedColors.text.primary }]}>
                                        {topic.description}
                                    </Text>
                                    {topic.hasNotes && (
                                        <TouchableOpacity
                                            style={[styles.detailButton, { backgroundColor: '#2E7D32' }]}
                                            onPress={() => handleViewDetailedNotes(topic)}
                                        >
                                            <Text style={styles.detailButtonText}>View Detailed Notes</Text>
                                            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    backButton: { marginBottom: 8 },
    backButtonText: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '600' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
    headerIcon: {
        width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center', alignItems: 'center',
    },
    tabContainer: { flexDirection: 'row', marginHorizontal: 20, marginTop: 16, marginBottom: 8, borderRadius: 16, padding: 4 },
    tab: { flex: 1, borderRadius: 12, overflow: 'hidden' },
    tabActive: { elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
    tabGradient: { paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
    tabInactive: { paddingVertical: 12 },
    tabText: { fontSize: 15, fontWeight: '600' },
    tabTextActive: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
    tabSubtext: { fontSize: 11, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 },
    topicsContainer: { padding: 20 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    sectionSubtitle: { fontSize: 14, marginBottom: 16 },
    topicCard: { marginBottom: 8, borderColor: Colors.border.light, borderWidth: 1 },
    topicHeader: { flexDirection: 'row', alignItems: 'center', padding: 4, gap: 12 },
    topicIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    topicTitleContainer: { flex: 1 },
    topicName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    topicMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    topicMeta: { fontSize: 12 },
    practicalBadge: { fontSize: 12, fontWeight: '500' },
    expandedContent: {
        marginHorizontal: 4, marginBottom: 12, padding: 16, borderRadius: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0,
    },
    expandedDescription: { fontSize: 14, lineHeight: 22, marginBottom: 16, fontStyle: 'italic' },
    detailButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, marginTop: 12, gap: 8 },
    detailButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
    olevelContent: { padding: 20 },
    olevelText: { fontSize: 16, lineHeight: 24 },
});

export default GeographyNotesScreen;
