// Topic Notes Detail Screen - Display detailed notes with diagrams
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
    Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { scienceNotesApi, TopicNotes } from '../services/api/scienceNotesApi';
import { aLevelChemistryNotesApi } from '../services/api/aLevelChemistryNotesApi';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import Markdown from 'react-native-markdown-display';
import MathRenderer from '../components/MathRenderer';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import AudioStreamPlayer from '../components/AudioStreamPlayer';
import VideoStreamPlayer from '../components/VideoStreamPlayer';
import FlashcardSection from '../components/FlashcardSection';

const { width } = Dimensions.get('window');

const TopicNotesDetailScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const { subject, topic, isALevel, index } = route.params as {
        subject: string;
        topic: string;
        isALevel?: boolean;
        index?: number;
    };

    const [notes, setNotes] = useState<TopicNotes | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0])); // First section expanded by default

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            setLoading(true);
            let notesData = null;

            const hasPaidCredits = (user?.credit_breakdown?.purchased_credits ?? 0) > 0;
            const isScienceSubject = ['Biology', 'Chemistry', 'Physics'].includes(subject);
            if (isScienceSubject && !hasPaidCredits && (index ?? 0) >= 2) {
                setLoading(false);
                Alert.alert(
                    'Locked Topic',
                    'This topic is locked. Purchase credits to unlock all topics.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
                return;
            }

            // Check if this is A Level Chemistry
            if (isALevel && subject === 'A Level Chemistry') {
                notesData = await aLevelChemistryNotesApi.getTopicNotes(topic);
            } else {
                // O Level science notes
                notesData = await scienceNotesApi.getTopicNotes(
                    subject as 'Biology' | 'Chemistry' | 'Physics',
                    topic
                );
            }

            if (notesData) {
                setNotes(notesData);
            } else {
                Alert.alert(
                    'Notes Not Available',
                    `Notes for ${topic} are being prepared. Please check back soon!`
                );
                navigation.goBack();
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to load notes');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (index: number) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedSections(newExpanded);
    };

    const getSubjectColor = () => {
        if (isALevel && subject === 'A Level Chemistry') {
            return '#00897B'; // Teal for A Level Chemistry
        }
        switch (subject) {
            case 'Biology':
                return '#4CAF50';
            case 'Chemistry':
                return '#FF9800';
            case 'Physics':
                return '#2196F3';
            default:
                return themedColors.primary.main;
        }
    };

    const markdownStyles = {
        body: {
            fontSize: 15,
            color: themedColors.text.primary,
            lineHeight: 24,
        },
        heading1: {
            fontSize: 20,
            fontWeight: 'bold' as const,
            color: themedColors.text.primary,
            marginTop: 16,
            marginBottom: 8,
        },
        heading2: {
            fontSize: 18,
            fontWeight: 'bold' as const,
            color: themedColors.text.primary,
            marginTop: 12,
            marginBottom: 6,
        },
        strong: {
            fontWeight: 'bold' as const,
            color: themedColors.text.primary,
        },
        em: {
            fontStyle: 'italic' as const,
            color: themedColors.text.primary,
        },
        bullet_list: {
            marginVertical: 8,
        },
        ordered_list: {
            marginVertical: 8,
        },
        list_item: {
            marginBottom: 4,
            color: themedColors.text.primary,
        },
        paragraph: {
            color: themedColors.text.primary,
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={getSubjectColor()} />
                <Text style={styles.loadingText}>Loading notes...</Text>
            </View>
        );
    }

    if (!notes) {
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <LinearGradient
                colors={isDarkMode ? [themedColors.background.default, themedColors.background.paper] : [getSubjectColor(), '#FFFFFF']}
                style={styles.overlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <StatusBar barStyle="light-content" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerSubject}>{subject}</Text>
                        <Text style={styles.headerTitle} numberOfLines={1}>{topic}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="bookmark-outline" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Video Player - Shows when topic has video lesson */}
                    {notes.videoUrl && notes.videoUrl.trim().length > 0 && (
                        <VideoStreamPlayer
                            videoUrl={notes.videoUrl}
                            topicTitle={topic}
                            accentColor={getSubjectColor()}
                        />
                    )}

                    {/* Audio Player - Shows when topic has audio podcast */}
                    {notes.audioUrl && notes.audioUrl.trim().length > 0 && (
                        <AudioStreamPlayer
                            audioUrl={notes.audioUrl}
                            topicTitle={topic}
                            accentColor={getSubjectColor()}
                        />
                    )}

                    {/* Fallback - Show something if no media */}
                    {!notes.videoUrl && !notes.audioUrl && (
                        <View style={{ backgroundColor: 'red', padding: 20, marginBottom: 16 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>NO MEDIA FOUND</Text>
                            <Text style={{ color: 'white' }}>This topic has no video or audio content.</Text>
                        </View>
                    )}

                    {/* Summary Card */}
                    {notes.summary && (
                        <View style={styles.summaryCard}>
                            <LinearGradient
                                colors={isDarkMode ? [themedColors.background.paper, themedColors.background.paper] : ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                                style={styles.cardGradient}
                            >
                                <View style={styles.summaryHeader}>
                                    <Ionicons name="information-circle" size={24} color={getSubjectColor()} />
                                    <Text style={[styles.summaryTitle, { color: themedColors.text.primary }]}>Overview</Text>
                                </View>
                                <Text style={[styles.summaryText, { color: themedColors.text.secondary }]}>{notes.summary}</Text>
                            </LinearGradient>
                        </View>
                    )}

                    {/* Sections */}
                    {notes.sections.map((section, index) => (
                        <View key={index} style={styles.sectionCard}>
                            <LinearGradient
                                colors={isDarkMode ? [themedColors.background.paper, themedColors.background.paper] : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                                style={styles.cardGradient}
                            >
                                <TouchableOpacity
                                    style={styles.sectionHeader}
                                    onPress={() => toggleSection(index)}
                                >
                                    <View style={[styles.sectionNumber, { backgroundColor: getSubjectColor() }]}>
                                        <Text style={styles.sectionNumberText}>{index + 1}</Text>
                                    </View>
                                    <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>{section.title}</Text>
                                    <Ionicons
                                        name={expandedSections.has(index) ? 'chevron-up' : 'chevron-down'}
                                        size={24}
                                        color={themedColors.text.secondary}
                                    />
                                </TouchableOpacity>

                                {expandedSections.has(index) && (
                                    <View style={styles.sectionContent}>
                                        {/* Use MathRenderer for content with LaTeX, Markdown otherwise */}
                                        {section.content.includes('$') ? (
                                            <MathRenderer content={section.content} fontSize={16} minHeight={50} />
                                        ) : (
                                            <Markdown style={markdownStyles}>{section.content}</Markdown>
                                        )}

                                        {/* Diagrams */}
                                        {section.diagrams && section.diagrams.length > 0 && (
                                            <View style={styles.diagramsContainer}>
                                                {section.diagrams.map((diagram, dIndex) => (
                                                    <View key={dIndex} style={[styles.diagramCard, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#FFF' }]}>
                                                        <Image
                                                            source={{ uri: diagram }}
                                                            style={styles.diagramImage}
                                                            resizeMode="contain"
                                                        />
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                )}
                            </LinearGradient>
                        </View>
                    ))}

                    {/* Key Points */}
                    {notes.key_points && notes.key_points.length > 0 && (
                        <View style={[styles.keyPointsCard, { borderColor: isDarkMode ? 'rgba(76, 175, 80, 0.5)' : 'rgba(76, 175, 80, 0.3)' }]}>
                            <LinearGradient
                                colors={isDarkMode ? ['rgba(76, 175, 80, 0.15)', 'rgba(76, 175, 80, 0.05)'] : ['rgba(76, 175, 80, 0.1)', 'rgba(76, 175, 80, 0.05)']}
                                style={styles.cardGradient}
                            >
                                <View style={styles.keyPointsHeader}>
                                    <Ionicons name="bulb" size={24} color={getSubjectColor()} />
                                    <Text style={[styles.keyPointsTitle, { color: themedColors.text.primary }]}>Key Points</Text>
                                </View>
                                {notes.key_points.map((point, index) => (
                                    <View key={index} style={styles.keyPointItem}>
                                        <View style={[styles.keyPointBullet, { backgroundColor: getSubjectColor() }]}>
                                            <Text style={styles.keyPointBulletText}>✓</Text>
                                        </View>
                                        <Text style={[styles.keyPointText, { color: themedColors.text.primary }]}>{point}</Text>
                                    </View>
                                ))}
                            </LinearGradient>
                        </View>
                    )}

                    {/* Exam Tips */}
                    {notes.exam_tips && notes.exam_tips.length > 0 && (
                        <View style={[styles.examTipsCard, { borderColor: isDarkMode ? 'rgba(255, 152, 0, 0.5)' : 'rgba(255, 152, 0, 0.3)' }]}>
                            <LinearGradient
                                colors={isDarkMode ? ['rgba(255, 152, 0, 0.15)', 'rgba(255, 152, 0, 0.05)'] : ['rgba(255, 152, 0, 0.1)', 'rgba(255, 152, 0, 0.05)']}
                                style={styles.cardGradient}
                            >
                                <View style={styles.examTipsHeader}>
                                    <Ionicons name="school" size={24} color={themedColors.warning.main} />
                                    <Text style={[styles.examTipsTitle, { color: themedColors.text.primary }]}>Exam Tips</Text>
                                </View>
                                {notes.exam_tips.map((tip, index) => (
                                    <View key={index} style={styles.examTipItem}>
                                        <View style={[styles.examTipNumber, { backgroundColor: themedColors.warning.main }]}>
                                            <Text style={styles.examTipNumberText}>{index + 1}</Text>
                                        </View>
                                        <Text style={[styles.examTipText, { color: themedColors.text.primary }]}>{tip}</Text>
                                    </View>
                                ))}
                            </LinearGradient>
                        </View>
                    )}

                    {/* AI Flashcards Section - All Science topics */}
                    {(subject === 'Biology' || subject === 'Chemistry' || subject === 'Physics') && notes && (
                        <FlashcardSection
                            subject={subject}
                            topic={topic}
                            notes={notes}
                            accentColor={getSubjectColor()}
                        />
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.text.secondary,
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
    headerTitleContainer: {
        flex: 1,
        marginHorizontal: 12,
    },
    headerSubject: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerActions: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    summaryCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardGradient: {
        padding: 16,
        borderRadius: 16,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginLeft: 10,
    },
    summaryText: {
        fontSize: 15,
        color: Colors.text.secondary,
        lineHeight: 24,
    },
    sectionCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    sectionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionNumberText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.text.primary,
    },
    sectionContent: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    diagramsContainer: {
        marginTop: 16,
    },
    diagramCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    diagramImage: {
        width: '100%',
        height: 250,
        borderRadius: 8,
    },
    keyPointsCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'rgba(76, 175, 80, 0.3)',
    },
    keyPointsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    keyPointsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginLeft: 10,
    },
    keyPointItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    keyPointBullet: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    keyPointBulletText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    keyPointText: {
        flex: 1,
        fontSize: 15,
        color: Colors.text.primary,
        lineHeight: 22,
    },
    examTipsCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 152, 0, 0.3)',
    },
    examTipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    examTipsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginLeft: 10,
    },
    examTipItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    examTipNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.warning.main,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    examTipNumberText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    examTipText: {
        flex: 1,
        fontSize: 15,
        color: Colors.text.primary,
        lineHeight: 22,
    },
});



export default TopicNotesDetailScreen;
