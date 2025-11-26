import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HybridAIService from '../services/HybridAIService';
import NetworkService from '../services/NetworkService';
import { useNavigation } from '@react-navigation/native';

const OfflineIndicator = () => {
    const navigation = useNavigation<any>();
    const [status, setStatus] = useState<'offline' | 'online' | 'unavailable'>('unavailable');
    const [isChecking, setIsChecking] = useState(false);

    const checkStatus = async () => {
        setIsChecking(true);
        try {
            const serviceStatus = await HybridAIService.getStatus();
            setStatus(serviceStatus.currentMode);
        } catch (error) {
            console.error('Error checking AI status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        checkStatus();

        // Subscribe to network changes to update status
        const unsubscribe = NetworkService.subscribe(() => {
            checkStatus();
        });

        // Poll status occasionally (e.g., every 30 seconds)
        const interval = setInterval(checkStatus, 30000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);

    const handlePress = () => {
        navigation.navigate('OfflineSettings');
    };

    if (status === 'unavailable') return null;

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View style={[
                styles.badge,
                status === 'offline' ? styles.offlineBadge : styles.onlineBadge
            ]}>
                <Ionicons
                    name={status === 'offline' ? "cloud-offline" : "cloud-done"}
                    size={12}
                    color="#FFFFFF"
                />
                <Text style={styles.text}>
                    {status === 'offline' ? 'Offline AI' : 'Online AI'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    offlineBadge: {
        backgroundColor: '#10B981', // Green for offline (good feature!)
    },
    onlineBadge: {
        backgroundColor: '#3B82F6', // Blue for online
    },
    text: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default OfflineIndicator;
