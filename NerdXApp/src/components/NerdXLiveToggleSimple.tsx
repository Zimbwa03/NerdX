/**
 * NerdXLiveToggleSimple.tsx
 * Simplified version of the toggle button to avoid crashes
 */

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BUTTON_SIZE = 64;

interface NerdXLiveToggleSimpleProps {
    onAudioMode?: () => void;
    onVideoMode?: () => void;
}

export const NerdXLiveToggleSimple: React.FC<NerdXLiveToggleSimpleProps> = ({
    onAudioMode,
    onVideoMode,
}) => {
    const navigation = useNavigation<any>();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleAudioPress = () => {
        setIsExpanded(false);
        onAudioMode?.();
        try {
            if (navigation) {
                navigation.navigate('NerdXLiveAudio');
            }
        } catch (e) {
            console.error('Navigation error:', e);
        }
    };

    const handleVideoPress = () => {
        setIsExpanded(false);
        onVideoMode?.();
        try {
            if (navigation) {
                navigation.navigate('NerdXLiveVideo');
            }
        } catch (e) {
            console.error('Navigation error:', e);
        }
    };

    if (!isExpanded) {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity
                    style={styles.mainButton}
                    onPress={() => setIsExpanded(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="videocam" size={28} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.expandedContainer}>
                <TouchableOpacity
                    style={[styles.optionButton, styles.audioButton]}
                    onPress={handleAudioPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="mic" size={24} color="#4CAF50" />
                    <Text style={[styles.optionText, styles.audioText]}>Live Audio</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionButton, styles.videoButton]}
                    onPress={handleVideoPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="videocam" size={24} color="#FF5722" />
                    <Text style={[styles.optionText, styles.videoText]}>Live Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsExpanded(false)}
                >
                    <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 100,
        right: 16,
        zIndex: 9999,
        elevation: 9999,
        alignItems: 'flex-end',
    },
    mainButton: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: '#6C63FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 16,
        elevation: 20,
        borderWidth: 3,
        borderColor: '#fff',
    },
    expandedContainer: {
        flexDirection: 'row',
        backgroundColor: '#6C63FF',
        borderRadius: 32,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 15,
        borderWidth: 2,
        borderColor: '#fff',
    },
    optionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    audioButton: {
        // Left option
    },
    videoButton: {
        // Right option
    },
    optionText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
    },
    audioText: {
        color: '#4CAF50',
    },
    videoText: {
        color: '#FF5722',
    },
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});

export default NerdXLiveToggleSimple;

