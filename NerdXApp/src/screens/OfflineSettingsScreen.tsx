import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HybridAIService, { AIServiceConfig } from '../services/HybridAIService';
import OfflineAIService from '../services/OfflineAIService';

const OfflineSettingsScreen = ({ navigation }: any) => {
    const [config, setConfig] = useState<AIServiceConfig>(HybridAIService.getConfig());
    const [modelStatus, setModelStatus] = useState<{ isReady: boolean; modelInfo: any } | null>(null);

    useEffect(() => {
        loadStatus();
        // Refresh config when screen focuses
        const unsubscribe = navigation.addListener('focus', () => {
            setConfig(HybridAIService.getConfig());
            loadStatus();
        });

        return unsubscribe;
    }, [navigation]);

    const loadStatus = async () => {
        const status = await OfflineAIService.getModelStatus();
        setModelStatus({
            isReady: status.isReady,
            modelInfo: status.modelInfo,
        });
    };

    const updateConfig = (key: keyof AIServiceConfig, value: boolean) => {
        const newConfig = { ...config, [key]: value };

        // Logic checks
        if (key === 'offlineOnly' && value) {
            newConfig.onlineOnly = false;
        }
        if (key === 'onlineOnly' && value) {
            newConfig.offlineOnly = false;
        }

        setConfig(newConfig);
        HybridAIService.setConfig(newConfig);
    };

    const handleManageModel = () => {
        navigation.navigate('ModelDownload');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Offline AI Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Status Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>AI Model Status</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.statusIcon}>
                            <Ionicons
                                name={modelStatus?.isReady ? "checkmark-circle" : "alert-circle"}
                                size={24}
                                color={modelStatus?.isReady ? "#10B981" : "#F59E0B"}
                            />
                        </View>
                        <View style={styles.statusInfo}>
                            <Text style={styles.statusLabel}>
                                {modelStatus?.isReady ? 'Phi-3 Model Ready' : 'Model Not Ready'}
                            </Text>
                            <Text style={styles.statusSubtext}>
                                {modelStatus?.isReady
                                    ? 'You can use AI features offline.'
                                    : 'Download the model to enable offline AI.'}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.manageButton} onPress={handleManageModel}>
                        <Text style={styles.manageButtonText}>Manage Model</Text>
                        <Ionicons name="chevron-forward" size={20} color="#4F46E5" />
                    </TouchableOpacity>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Preferences</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Prefer Offline AI</Text>
                            <Text style={styles.settingDescription}>
                                Use offline model even when internet is available (saves data).
                            </Text>
                        </View>
                        <Switch
                            value={config.preferOffline}
                            onValueChange={(val) => updateConfig('preferOffline', val)}
                            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                            thumbColor={config.preferOffline ? '#4F46E5' : '#F3F4F6'}
                            disabled={!modelStatus?.isReady}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Offline Only Mode</Text>
                            <Text style={styles.settingDescription}>
                                Never use internet for AI features.
                            </Text>
                        </View>
                        <Switch
                            value={config.offlineOnly}
                            onValueChange={(val) => updateConfig('offlineOnly', val)}
                            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                            thumbColor={config.offlineOnly ? '#4F46E5' : '#F3F4F6'}
                            disabled={!modelStatus?.isReady}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Online Only Mode</Text>
                            <Text style={styles.settingDescription}>
                                Always use internet (higher quality, uses data).
                            </Text>
                        </View>
                        <Switch
                            value={config.onlineOnly}
                            onValueChange={(val) => updateConfig('onlineOnly', val)}
                            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                            thumbColor={config.onlineOnly ? '#4F46E5' : '#F3F4F6'}
                        />
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
                    <Text style={styles.infoText}>
                        Offline AI uses the Microsoft Phi-3 Mini model running directly on your device.
                        It provides fast responses without using data, but may be less capable than the online cloud model for very complex tasks.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginLeft: 8,
    },
    content: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusIcon: {
        marginRight: 12,
    },
    statusInfo: {
        flex: 1,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
    statusSubtext: {
        fontSize: 14,
        color: '#6B7280',
    },
    manageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#EEF2FF',
        borderRadius: 8,
    },
    manageButtonText: {
        color: '#4F46E5',
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 16,
        marginBottom: 1,
        borderRadius: 8, // If standalone
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 20,
    },
});

export default OfflineSettingsScreen;
