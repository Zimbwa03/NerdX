import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ModelDownloadService, { DownloadProgress, ModelInfo } from '../services/ModelDownloadService';
import NetworkService from '../services/NetworkService';
import OfflineAIService from '../services/OfflineAIService';
import DownloadNotificationService from '../services/DownloadNotificationService';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';

const ModelDownloadScreen = ({ navigation }: any) => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState<DownloadProgress | null>(null);
    const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
    const [storageCheck, setStorageCheck] = useState<{ available: number; required: number; hasSpace: boolean } | null>(null);
    const [networkState, setNetworkState] = useState(NetworkService.getCurrentState());

    useEffect(() => {
        checkStatus();
        const unsubscribeNetwork = NetworkService.subscribe(setNetworkState);

        // Subscribe to download progress
        const unsubscribeProgress = ModelDownloadService.subscribeToProgress((p) => {
            setProgress(p);
            setIsDownloading(true);
        });

        // Listen for download completion
        const handleDownloadComplete = async () => {
            setIsDownloading(false);
            setProgress(null);
            await checkStatus();
            await OfflineAIService.initializeModel();
            await DownloadNotificationService.notifyDownloadComplete();
            Alert.alert('Success', 'Phi-3 AI model downloaded and ready for offline use!');
        };

        // Listen for custom event
        const listener = (event: Event) => {
            if ((event as CustomEvent).type === 'modelDownloadComplete') {
                handleDownloadComplete();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('modelDownloadComplete', listener);
        }

        return () => {
            unsubscribeNetwork();
            unsubscribeProgress();
            if (typeof window !== 'undefined') {
                window.removeEventListener('modelDownloadComplete', listener);
            }
        };
    }, []);

    const checkStatus = async () => {
        // Refresh network state
        await NetworkService.refresh();
        setNetworkState(NetworkService.getCurrentState());

        const info = await ModelDownloadService.getModelInfo();
        setModelInfo(info);

        const storage = await ModelDownloadService.checkStorageSpace();
        setStorageCheck(storage);

        const status = ModelDownloadService.getDownloadStatus();
        setIsDownloading(status.isDownloading);
    };

    const handleDownload = async () => {
        try {
            if (!storageCheck?.hasSpace) {
                Alert.alert(
                    'Insufficient Storage',
                    `You need ${(storageCheck?.required || 0) / 1000000000} GB of free space, but only have ${(storageCheck?.available || 0) / 1000000000} GB available.`
                );
                return;
            }

            if (!NetworkService.isOnline()) {
                Alert.alert('No Connection', 'Please connect to the internet to download the model.');
                return;
            }

            setIsDownloading(true);
            
            // Request notification permissions and notify start
            await DownloadNotificationService.requestPermissions();
            await DownloadNotificationService.notifyDownloadStarted();
            
            await ModelDownloadService.downloadModel();

            // Download completion is handled by event listener
        } catch (error: any) {
            setIsDownloading(false);
            Alert.alert('Download Failed', error.message || 'An unknown error occurred');
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Delete Model',
            'Are you sure you want to delete the offline AI model? You will need to download it again to use offline features.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ModelDownloadService.deleteModel();
                            checkStatus();
                            Alert.alert('Deleted', 'Model has been removed from device.');
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <View style={[styles.header, { backgroundColor: themedColors.background.paper, borderBottomColor: themedColors.border.light }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={themedColors.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: themedColors.text.primary }]}>Offline AI Model</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.2)' : '#EEF2FF' }]}>
                        <Ionicons name="hardware-chip-outline" size={48} color={themedColors.primary.main} />
                    </View>
                    <Text style={[styles.title, { color: themedColors.text.primary }]}>Microsoft Phi-3 Mini</Text>
                    <Text style={[styles.description, { color: themedColors.text.secondary }]}>
                        Download this powerful AI model to use NerdX features without an internet connection.
                        Perfect for studying on the go!
                    </Text>

                    <View style={[styles.infoRow, { borderTopColor: themedColors.border.light }]}>
                        <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Size:</Text>
                        <Text style={[styles.infoValue, { color: themedColors.text.primary }]}>~2.5 GB</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: themedColors.text.secondary }]}>Version:</Text>
                        <Text style={[styles.infoValue, { color: themedColors.text.primary }]}>1.0.0 (4-bit quantized)</Text>
                    </View>
                </View>

                {modelInfo ? (
                    <View style={[
                        styles.statusCard,
                        {
                            backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
                            borderColor: themedColors.success.main
                        }
                    ]}>
                        <View style={styles.statusHeader}>
                            <Ionicons name="checkmark-circle" size={24} color={themedColors.success.main} />
                            <Text style={[styles.statusTitle, { color: themedColors.success.dark }]}>Model Installed</Text>
                        </View>
                        <Text style={[styles.statusText, { color: themedColors.success.main }]}>
                            Downloaded on {new Date(modelInfo.downloadedAt).toLocaleDateString()}
                        </Text>
                        <TouchableOpacity style={[styles.deleteButton, { backgroundColor: themedColors.background.paper, borderColor: themedColors.error.main }]} onPress={handleDelete}>
                            <Text style={[styles.deleteButtonText, { color: themedColors.error.main }]}>Delete Model</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={[styles.actionContainer, { backgroundColor: themedColors.background.paper }]}>
                        {isDownloading ? (
                            <View style={styles.progressContainer}>
                                <Text style={[styles.progressText, { color: themedColors.text.primary }]}>Downloading... {progress ? `${progress.progress.toFixed(1)}%` : 'Starting'}</Text>
                                <View style={[styles.progressBarBg, { backgroundColor: themedColors.border.light }]}>
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            { width: `${progress?.progress || 0}%`, backgroundColor: themedColors.primary.main }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.progressDetail, { color: themedColors.text.secondary }]}>
                                    {progress ? `${formatBytes(progress.bytesWritten)} / ${formatBytes(progress.contentLength)}` : ''}
                                </Text>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => ModelDownloadService.cancelDownload()}>
                                    <Text style={[styles.cancelButtonText, { color: themedColors.error.main }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <View style={styles.requirementContainer}>
                                    <Text style={[styles.reqTitle, { color: themedColors.text.primary }]}>Requirements:</Text>
                                    <View style={styles.reqItem}>
                                        <Ionicons
                                            name={storageCheck === null ? "hourglass-outline" : (storageCheck.hasSpace ? "checkmark-circle-outline" : "alert-circle-outline")}
                                            size={20}
                                            color={storageCheck === null ? themedColors.text.secondary : (storageCheck.hasSpace ? themedColors.success.main : themedColors.error.main)}
                                        />
                                        <Text style={[styles.reqText, { color: themedColors.text.secondary }]}>
                                            Storage: {storageCheck === null
                                                ? 'Checking...'
                                                : storageCheck.available > 0
                                                    ? `${formatBytes(storageCheck.available)} available`
                                                    : 'Requires Dev Build to check'
                                            }
                                        </Text>
                                    </View>
                                    <View style={styles.reqItem}>
                                        <Ionicons
                                            name={networkState.isConnected ? "checkmark-circle-outline" : "alert-circle-outline"}
                                            size={20}
                                            color={networkState.isConnected ? themedColors.success.main : themedColors.error.main}
                                        />
                                        <Text style={[styles.reqText, { color: themedColors.text.secondary }]}>
                                            Network: {networkState.isConnected
                                                ? (networkState.connectionType === 'wifi' ? 'WiFi Connected' : 'Cellular Connected')
                                                : 'Offline - Connect to download'
                                            }
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.downloadButton,
                                        { backgroundColor: themedColors.primary.main },
                                        (!networkState.isConnected) && styles.disabledButton
                                    ]}
                                    onPress={handleDownload}
                                    disabled={!networkState.isConnected}
                                >
                                    <Ionicons name="download-outline" size={24} color="#FFF" />
                                    <Text style={styles.downloadButtonText}>Download Model</Text>
                                </TouchableOpacity>
                                <Text style={[styles.noteText, { color: themedColors.text.secondary }]}>
                                    Note: You can download using WiFi or Mobile Data.
                                </Text>
                            </>
                        )}
                    </View>
                )}
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
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    statusCard: {
        backgroundColor: '#ECFDF5',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#10B981',
        alignItems: 'center',
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#065F46',
    },
    statusText: {
        fontSize: 14,
        color: '#047857',
        marginBottom: 16,
    },
    deleteButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    deleteButtonText: {
        color: '#EF4444',
        fontWeight: '600',
    },
    actionContainer: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    requirementContainer: {
        marginBottom: 20,
    },
    reqTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    reqItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8,
    },
    reqText: {
        fontSize: 14,
        color: '#4B5563',
    },
    downloadButton: {
        backgroundColor: '#4F46E5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
    },
    downloadButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    noteText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 12,
    },
    progressContainer: {
        alignItems: 'center',
        width: '100%',
    },
    progressText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4F46E5',
    },
    progressDetail: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 16,
    },
    cancelButton: {
        padding: 8,
    },
    cancelButtonText: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default ModelDownloadScreen;
