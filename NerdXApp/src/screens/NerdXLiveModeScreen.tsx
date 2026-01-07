/**
 * NerdXLiveModeScreen.tsx
 * Screen for selecting Audio or Video mode for NerdX Live tutoring
 * Accessed from Dashboard button
 */

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NerdXLiveModeScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [selectedMode, setSelectedMode] = useState<'audio' | 'video' | null>(null);

    const handleAudioSelect = () => {
        navigation.navigate('NerdXLiveAudio');
    };

    const handleVideoSelect = () => {
        navigation.navigate('NerdXLiveVideo');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                    <Text style={styles.title}>NerdX Live</Text>
                    
                    <View style={styles.placeholder} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="sparkles" size={64} color="#6C63FF" />
                    </View>
                    
                    <Text style={styles.mainTitle}>Choose Your Tutoring Mode</Text>
                    <Text style={styles.subtitle}>
                        Select how you want to interact with your AI tutor
                    </Text>

                    {/* Mode Selection Cards */}
                    <View style={styles.cardsContainer}>
                        {/* Audio Mode Card */}
                        <TouchableOpacity
                            style={[
                                styles.modeCard,
                                selectedMode === 'audio' && styles.modeCardSelected,
                            ]}
                            onPress={handleAudioSelect}
                            onPressIn={() => setSelectedMode('audio')}
                            onPressOut={() => setSelectedMode(null)}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#4CAF50', '#45a049']}
                                style={styles.cardGradient}
                            >
                                <View style={styles.cardIconContainer}>
                                    <Ionicons name="mic" size={48} color="#fff" />
                                </View>
                                <Text style={styles.cardTitle}>Live Audio</Text>
                                <Text style={styles.cardDescription}>
                                    Voice-to-voice tutoring{'\n'}
                                    Perfect for questions and explanations
                                </Text>
                                <View style={styles.cardFeatures}>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                        <Text style={styles.featureText}>Real-time conversation</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                        <Text style={styles.featureText}>Natural speech</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Video Mode Card */}
                        <TouchableOpacity
                            style={[
                                styles.modeCard,
                                selectedMode === 'video' && styles.modeCardSelected,
                            ]}
                            onPress={handleVideoSelect}
                            onPressIn={() => setSelectedMode('video')}
                            onPressOut={() => setSelectedMode(null)}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#FF5722', '#E64A19']}
                                style={styles.cardGradient}
                            >
                                <View style={styles.cardIconContainer}>
                                    <Ionicons name="videocam" size={48} color="#fff" />
                                </View>
                                <Text style={styles.cardTitle}>Live Video</Text>
                                <Text style={styles.cardDescription}>
                                    Camera + Voice tutoring{'\n'}
                                    AI can see what you're working on
                                </Text>
                                <View style={styles.cardFeatures}>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                        <Text style={styles.featureText}>See your work in real-time</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                        <Text style={styles.featureText}>Perfect for homework help</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Info Box */}
                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={20} color="#6C63FF" />
                        <Text style={styles.infoText}>
                            Tap a mode to start your tutoring session
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    placeholder: {
        width: 44,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(108, 99, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    mainTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
    cardsContainer: {
        width: '100%',
        gap: 20,
    },
    modeCard: {
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    modeCardSelected: {
        transform: [{ scale: 0.98 }],
    },
    cardGradient: {
        padding: 24,
        borderRadius: 24,
    },
    cardIconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    cardDescription: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    cardFeatures: {
        gap: 8,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        color: '#fff',
        fontSize: 14,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(108, 99, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 32,
        gap: 8,
    },
    infoText: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
});

export default NerdXLiveModeScreen;

