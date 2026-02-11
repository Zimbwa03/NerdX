// Topic Notes Detail Screen - Display detailed notes with diagrams
import React, { useState, useEffect, useMemo } from 'react';
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
    Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { scienceNotesApi, TopicNotes } from '../services/api/scienceNotesApi';
import { aLevelChemistryNotesApi } from '../services/api/aLevelChemistryNotesApi';
import { aLevelPhysicsNotesApi } from '../services/api/aLevelPhysicsNotesApi';
import { aLevelBiologyNotesApi } from '../services/api/aLevelBiologyNotesApi';
// Direct imports for instant synchronous loading
import { getTopicNotes as getScienceTopicNotes } from '../data/scienceNotes';
import { getTopicNotes as getALevelChemistryNotes } from '../data/aLevelChemistry';
import { getTopicNotes as getALevelPhysicsNotes } from '../data/aLevelPhysics';
import { getTopicNotes as getALevelBiologyNotes } from '../data/aLevelBiology';
import { getTopicNotes as getALevelGeographyNotes } from '../data/aLevelGeography';
import { getTopicNotes as getOLevelGeographyNotes } from '../data/oLevelGeography';
import { getTopicNotes as getAccountingTopicNotes } from '../data/accounting';
import { getTopicNotes as getBESTopicNotes } from '../data/businessEnterpriseSkills';
import { getTopicNotes as getHistoryTopicNotes } from '../data/history';
import { getTopicNotes as getCommerceTopicNotes } from '../data/commerce';
import { getTopicNotes as getCSTopicNotes } from '../data/computerScienceNotes';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import Markdown from 'react-native-markdown-display';
import MathRenderer from '../components/MathRenderer';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import AudioStreamPlayer from '../components/AudioStreamPlayer';
import VideoStreamPlayer from '../components/VideoStreamPlayer';
import FlashcardSection from '../components/FlashcardSection';
import ZoomableImageModal from '../components/ZoomableImageModal';

const { width } = Dimensions.get('window');
const HISTORY_TOPIC1_INFOGRAPHIC_URL = 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/History/Infographics/Topic%201.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9IaXN0b3J5L0luZm9ncmFwaGljcy9Ub3BpYyAxLnBuZyIsImlhdCI6MTc3MDgyODk1NywiZXhwIjo1MjcxMzI0OTU3fQ.eoO-e4gKM56_EXrEVnAMNfugQwukfgyF8VFWB5XbzQo';
const HISTORY_TOPIC1_PDF_URL = 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/History/Slides/History_Foundations_Form_1.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9IaXN0b3J5L1NsaWRlcy9IaXN0b3J5X0ZvdW5kYXRpb25zX0Zvcm1fMS5wZGYiLCJpYXQiOjE3NzA4Mjg4ODgsImV4cCI6NTI3MTMyNDg4OH0.39KxawsFJgkUNFuOLkIxVv85FcyctZo8jSLv8IvSRT0';

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

    // Optimize: Load notes synchronously on mount for instant display (local data, no network)
    const notes = React.useMemo(() => {
        try {
            // Check if this is A Level Chemistry
            if (isALevel && subject === 'A Level Chemistry') {
                return getALevelChemistryNotes(topic);
            }
            // Check if this is A Level Physics
            else if (isALevel && subject === 'A Level Physics') {
                return getALevelPhysicsNotes(topic);
            }
            // Check if this is A Level Biology (subject is 'Biology' but isALevel is true)
            else if (isALevel && subject === 'Biology') {
                return getALevelBiologyNotes(topic);
            }
            // Check if this is A Level Geography
            else if (isALevel && subject === 'A Level Geography') {
                return getALevelGeographyNotes(topic);
            }
            // O Level Geography (subject is 'Geography', isALevel is false)
            else if (!isALevel && subject === 'Geography') {
                return getOLevelGeographyNotes(topic);
            }
            // Principles of Accounting (O-Level 7112)
            else if (subject === 'Principles of Accounting' || subject === 'Accounting') {
                return getAccountingTopicNotes(topic);
            }
            // Business Enterprise and Skills (O-Level 4048)
            else if (subject === 'Business Enterprise and Skills' || subject === 'BES') {
                return getBESTopicNotes(topic);
            }
            // History (ZIMSEC O-Level)
            else if (subject === 'History') {
                return getHistoryTopicNotes(topic);
            }
            // Commerce (ZIMSEC O-Level Principles of Commerce)
            else if (subject === 'Commerce') {
                return getCommerceTopicNotes(topic);
            }
            // Computer Science (O-Level)
            else if (subject === 'Computer Science') {
                return getCSTopicNotes(topic);
            }
            else {
                // O Level science notes - synchronous access
                return getScienceTopicNotes(
                    subject as 'Biology' | 'Chemistry' | 'Physics',
                    topic
                );
            }
        } catch (error: any) {
            console.error('Error loading notes:', error);
            return null;
        }
    }, [subject, topic, isALevel]);

    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0])); // First section expanded by default
    const [infographicZoomVisible, setInfographicZoomVisible] = useState(false);
    const loading = notes === null; // Loading is false if notes exist (instant)
    const isHistoryForm1Topic1 = subject === 'History' && !isALevel && topic === 'Introduction to History';
    const historyTopic1PdfViewerUrl = useMemo(
        () => `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(HISTORY_TOPIC1_PDF_URL)}`,
        []
    );

    const openHistoryTopic1Pdf = async () => {
        try {
            const canOpen = await Linking.canOpenURL(HISTORY_TOPIC1_PDF_URL);
            if (canOpen) {
                await Linking.openURL(HISTORY_TOPIC1_PDF_URL);
            } else {
                Alert.alert('Cannot open PDF', 'Your device could not open the PDF. Try opening the link in a browser.');
            }
        } catch {
            Alert.alert('Error', 'Could not open the PDF. Please try again.');
        }
    };

    // Handle missing notes
    useEffect(() => {
        if (!notes) {
            // Small delay to ensure UI is ready, then show error
            const timer = setTimeout(() => {
                Alert.alert(
                    'Notes Not Available',
                    `Notes for ${topic} are being prepared. Please check back soon!`
                );
                navigation.goBack();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [notes, topic, navigation]);

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
        if (isALevel && subject === 'A Level Physics') {
            return '#1976D2'; // Blue for A Level Physics
        }
        if (isALevel && subject === 'Biology') {
            return '#10B981'; // Green for A Level Biology
        }
        if (isALevel && subject === 'A Level Geography') {
            return '#2E7D32'; // Green for A Level Geography
        }
        if (!isALevel && subject === 'Geography') {
            return '#2E7D32'; // Green for O Level Geography
        }
        if (subject === 'Principles of Accounting' || subject === 'Accounting') {
            return '#B8860B'; // Gold for Accounting
        }
        if (subject === 'Commerce') {
            return '#B8860B'; // Amber/gold for Commerce
        }
        if (subject === 'Business Enterprise and Skills' || subject === 'BES') {
            return '#6B4E9D'; // Purple for BES
        }
        if (subject === 'History') {
            return '#8B4513'; // Sienna for History
        }
        if (subject === 'Computer Science') {
            return '#0288D1'; // Blue for Computer Science
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

    // Determine if media (video/audio) should be locked for this topic.
    // NOTES themselves are always free – only media is premium.
    const getMediaLockStatus = () => {
        const hasPaidCredits = (user?.credit_breakdown?.purchased_credits ?? 0) > 0;
        const lowerSubject = (subject || '').toLowerCase();

        // Treat any Biology / Chemistry / Physics (O-Level or A-Level) as science subjects.
        const isScienceSubject =
            lowerSubject.includes('biology') ||
            lowerSubject.includes('chemistry') ||
            lowerSubject.includes('physics');

        const topicIndex = index ?? 0;

        // First two topics for each subject are always free.
        if (topicIndex < 2) {
            return false;
        }

        // Lock media for unpaid users on science subjects, while keeping notes free.
        return isScienceSubject && !hasPaidCredits;
    };

    const isMediaLocked = getMediaLockStatus();

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
        },
        table: {
            borderWidth: 1,
            borderColor: themedColors.border.light || '#e0e0e0',
            borderRadius: 4,
            marginVertical: 10,
        },
        tr: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: themedColors.border.light || '#e0e0e0',
        },
        th: {
            flex: 1,
            padding: 8,
            fontWeight: 'bold',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
            color: themedColors.text.primary,
            textAlign: 'center',
            borderRightWidth: 1,
            borderColor: themedColors.border.light || '#e0e0e0',
        },
        td: {
            flex: 1,
            padding: 8,
            color: themedColors.text.primary,
            textAlign: 'center',
            borderRightWidth: 1,
            borderColor: themedColors.border.light || '#e0e0e0',
        },
    };

    const resolveDiagramSource = (diagram: string | number) =>
        typeof diagram === 'string' ? { uri: diagram } : diagram;

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
                    {/* Video / Audio Media - Show players with lock overlay when locked */}
                    <>
                        {/* Video Player - Shows when topic has video lesson */}
                        {notes.videoUrl && notes.videoUrl.trim().length > 0 && (
                            <View style={styles.mediaContainer}>
                                {/* Render player if not locked */}
                                {!isMediaLocked ? (
                                    <VideoStreamPlayer
                                        videoUrl={notes.videoUrl}
                                        topicTitle={topic}
                                        accentColor={getSubjectColor()}
                                    />
                                ) : (
                                    /* Show locked placeholder with overlay */
                                    <View style={styles.lockedMediaPlaceholder}>
                                        <View style={styles.lockOverlay}>
                                            <LinearGradient
                                                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
                                                style={styles.lockOverlayGradient}
                                            >
                                                <View style={[styles.lockIconContainer, { backgroundColor: getSubjectColor() }]}>
                                                    <Ionicons name="lock-closed" size={48} color="#FFF" />
                                                </View>
                                                <Text style={styles.lockOverlayTitle}>Premium Video</Text>
                                                <Text style={styles.lockOverlayText}>
                                                    Unlock this video lesson by purchasing credits
                                                </Text>
                                                <TouchableOpacity
                                                    style={[styles.unlockButton, { backgroundColor: getSubjectColor() }]}
                                                    onPress={() => {
                                                        // Navigate to credits screen
                                                        navigation.navigate('Credits' as never);
                                                    }}
                                                >
                                                    <Text style={styles.unlockButtonText}>Unlock Now</Text>
                                                </TouchableOpacity>
                                            </LinearGradient>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Audio Player - Shows when topic has audio podcast */}
                        {notes.audioUrl && notes.audioUrl.trim().length > 0 && (
                            <View style={styles.mediaContainer}>
                                {/* Render player if not locked */}
                                {!isMediaLocked ? (
                                    <AudioStreamPlayer
                                        audioUrl={notes.audioUrl}
                                        topicTitle={topic}
                                        accentColor={getSubjectColor()}
                                    />
                                ) : (
                                    /* Show locked placeholder with overlay */
                                    <View style={styles.lockedMediaPlaceholder}>
                                        <View style={styles.lockOverlay}>
                                            <LinearGradient
                                                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
                                                style={styles.lockOverlayGradient}
                                            >
                                                <View style={[styles.lockIconContainer, { backgroundColor: getSubjectColor() }]}>
                                                    <Ionicons name="lock-closed" size={48} color="#FFF" />
                                                </View>
                                                <Text style={styles.lockOverlayTitle}>Premium Audio</Text>
                                                <Text style={styles.lockOverlayText}>
                                                    Unlock this audio lesson by purchasing credits
                                                </Text>
                                                <TouchableOpacity
                                                    style={[styles.unlockButton, { backgroundColor: getSubjectColor() }]}
                                                    onPress={() => {
                                                        // Navigate to credits screen
                                                        navigation.navigate('Credits' as never);
                                                    }}
                                                >
                                                    <Text style={styles.unlockButtonText}>Unlock Now</Text>
                                                </TouchableOpacity>
                                            </LinearGradient>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Fallback - Show something if no media */}
                        {!notes.videoUrl && !notes.audioUrl && (
                            <View style={styles.noMediaCard}>
                                <Text style={styles.noMediaTitle}>No Audio or Video</Text>
                                <Text style={styles.noMediaText}>
                                    This topic currently has written notes only. Audio and video content will be
                                    added soon.
                                </Text>
                            </View>
                        )}
                    </>

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
                                                            source={resolveDiagramSource(diagram)}
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

                    {isHistoryForm1Topic1 && (
                        <View style={styles.historyMediaBlock}>
                            <View
                                style={[
                                    styles.historyMediaCard,
                                    {
                                        backgroundColor: themedColors.background.default || '#FFFFFF',
                                        borderColor: themedColors.border.light || 'rgba(0,0,0,0.12)',
                                    },
                                ]}
                            >
                                <Text style={[styles.historyMediaTitle, { color: themedColors.text.primary }]}>
                                    Infographics Image for the Student
                                </Text>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => setInfographicZoomVisible(true)}
                                >
                                    <Image
                                        source={{ uri: HISTORY_TOPIC1_INFOGRAPHIC_URL }}
                                        style={styles.historyInfographicImage}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.infographicZoomButton, { backgroundColor: getSubjectColor() }]}
                                    onPress={() => setInfographicZoomVisible(true)}
                                >
                                    <Ionicons name="expand" size={20} color="#FFF" />
                                    <Text style={styles.infographicZoomButtonText}>Zoom</Text>
                                </TouchableOpacity>
                            </View>

                            <View
                                style={[
                                    styles.historyMediaCard,
                                    {
                                        backgroundColor: themedColors.background.default || '#FFFFFF',
                                        borderColor: themedColors.border.light || 'rgba(0,0,0,0.12)',
                                    },
                                ]}
                            >
                                <Text style={[styles.historyMediaTitle, { color: themedColors.text.primary }]}>
                                    History Foundations (Form 1) – PDF
                                </Text>
                                <View style={styles.historyPdfContainer}>
                                    <WebView
                                        source={{ uri: historyTopic1PdfViewerUrl }}
                                        style={styles.historyPdfWebView}
                                        originWhitelist={['*']}
                                        javaScriptEnabled
                                        domStorageEnabled
                                        mixedContentMode="always"
                                        thirdPartyCookiesEnabled
                                        setSupportMultipleWindows={false}
                                        startInLoadingState
                                        renderLoading={() => (
                                            <View style={styles.historyPdfLoading}>
                                                <ActivityIndicator size="large" color={getSubjectColor()} />
                                                <Text style={[styles.historyPdfLoadingText, { color: themedColors.text.secondary }]}>Loading PDF…</Text>
                                            </View>
                                        )}
                                        scalesPageToFit
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[styles.historyPdfOpenButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: getSubjectColor() }]}
                                    onPress={openHistoryTopic1Pdf}
                                >
                                    <Ionicons name="open-outline" size={20} color={getSubjectColor()} />
                                    <Text style={[styles.historyPdfOpenButtonText, { color: getSubjectColor() }]}>Open in browser</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* AI Flashcards Section - Science, Geography, Accounting, Commerce, BES, History, Computer Science (O & A-Level) */}
                    {(
                        (subject === 'Biology' || subject === 'Chemistry' || subject === 'Physics') ||
                        (isALevel && (subject === 'A Level Chemistry' || subject === 'A Level Physics' || subject === 'Biology')) ||
                        subject === 'Geography' || subject === 'A Level Geography' ||
                        subject === 'Principles of Accounting' || subject === 'Accounting' ||
                        subject === 'Commerce' ||
                        subject === 'Business Enterprise and Skills' || subject === 'BES' ||
                        subject === 'History' ||
                        subject === 'Computer Science'
                    ) && notes && (
                            <FlashcardSection
                                subject={isALevel && subject === 'Biology' ? 'A Level Biology' : subject}
                                topic={topic}
                                notes={notes}
                                accentColor={getSubjectColor()}
                            />
                        )}
                </ScrollView>
            </LinearGradient>

            {/* Zoom modal for History Topic 1 infographic */}
            {isHistoryForm1Topic1 && (
                <ZoomableImageModal
                    visible={infographicZoomVisible}
                    imageUrl={HISTORY_TOPIC1_INFOGRAPHIC_URL}
                    onClose={() => setInfographicZoomVisible(false)}
                />
            )}
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
    mediaContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    lockedMediaPlaceholder: {
        minHeight: 200,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#000',
        position: 'relative',
    },
    lockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        borderRadius: 16,
        overflow: 'hidden',
    },
    lockOverlayGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    lockIconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    lockOverlayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    lockOverlayText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    unlockButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    unlockButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noMediaCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    noMediaTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: Colors.text.primary,
    },
    noMediaText: {
        fontSize: 14,
        color: Colors.text.secondary,
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
    historyMediaBlock: {
        marginBottom: 16,
    },
    historyMediaCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
    },
    historyMediaTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 10,
    },
    historyInfographicImage: {
        width: '100%',
        height: 260,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    infographicZoomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    infographicZoomButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    historyPdfContainer: {
        width: '100%',
        height: 420,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        marginBottom: 12,
    },
    historyPdfWebView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    historyPdfLoading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        gap: 12,
    },
    historyPdfLoadingText: {
        fontSize: 14,
    },
    historyPdfOpenButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    historyPdfOpenButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});



export default TopicNotesDetailScreen;
