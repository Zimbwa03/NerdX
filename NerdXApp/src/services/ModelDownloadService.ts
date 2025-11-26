// Model Download Service for Phi-3 model management
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetworkService from './NetworkService';

export interface DownloadProgress {
    bytesWritten: number;
    contentLength: number;
    progress: number; // 0-100
}

export interface ModelInfo {
    version: string;
    size: number;
    downloadedAt: string;
    modelPath: string;
}

type DownloadProgressListener = (progress: DownloadProgress) => void;

const STORAGE_KEYS = {
    MODEL_INFO: '@nerdx_phi3_model_info',
    MODEL_VERSION: '@nerdx_phi3_model_version',
};

// ============================================
// MODEL CONFIGURATION
// ============================================

// STEP 1: For LOCAL TESTING - Replace YOUR_COMPUTER_IP with your actual IP address
// Example: const LOCAL_SERVER_URL = 'http://192.168.1.100:8080';
const LOCAL_SERVER_URL = 'http://10.13.2.167:8080';

// STEP 2: For PRODUCTION - Replace with your CDN URL
const PRODUCTION_CDN_URL = 'https://your-cdn.com/models/phi3';

// STEP 3: Set this to true for local testing, false for production
const USE_LOCAL_SERVER = true;

// Model file names (don't change these)
const MODEL_FILE_NAME = 'phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx';
const MODEL_DATA_FILE_NAME = 'phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx.data';

// Construct the URL based on environment
const BASE_URL = USE_LOCAL_SERVER ? LOCAL_SERVER_URL : PRODUCTION_CDN_URL;
const PHI3_MODEL_URL = `${BASE_URL}/${MODEL_FILE_NAME}`;
const PHI3_MODEL_DATA_URL = `${BASE_URL}/${MODEL_DATA_FILE_NAME}`;

// Model metadata
const PHI3_MODEL_VERSION = '1.0.0';
const PHI3_MODEL_SIZE = 2_720_000_000; // ~2.72 GB (both files combined)

class ModelDownloadService {
    private downloadJobId: number | null = null;
    private progressListeners: Set<DownloadProgressListener> = new Set();
    private isPaused: boolean = false;

    // Get model storage path
    private getModelPath(): string {
        return `${RNFS.DocumentDirectoryPath}/models/phi3-mini-4k-instruct.onnx`;
    }

    // Check if model is already downloaded
    public async isModelDownloaded(): Promise<boolean> {
        try {
            const modelPath = this.getModelPath();
            const exists = await RNFS.exists(modelPath);

            if (!exists) return false;

            // Verify model info
            const modelInfo = await this.getModelInfo();
            return modelInfo !== null && modelInfo.version === PHI3_MODEL_VERSION;
        } catch (error) {
            console.error('Error checking model download status:', error);
            return false;
        }
    }

    // Get model information
    public async getModelInfo(): Promise<ModelInfo | null> {
        try {
            const infoJson = await AsyncStorage.getItem(STORAGE_KEYS.MODEL_INFO);
            if (!infoJson) return null;
            return JSON.parse(infoJson);
        } catch (error) {
            console.error('Error getting model info:', error);
            return null;
        }
    }

    // Check available storage space
    public async checkStorageSpace(): Promise<{ available: number; required: number; hasSpace: boolean }> {
        try {
            const freeSpace = await RNFS.getFSInfo();
            const availableSpace = freeSpace.freeSpace;
            const requiredSpace = PHI3_MODEL_SIZE;

            return {
                available: availableSpace,
                required: requiredSpace,
                hasSpace: availableSpace > requiredSpace * 1.2, // 20% buffer
            };
        } catch (error) {
            console.error('Error checking storage space:', error);
            return { available: 0, required: PHI3_MODEL_SIZE, hasSpace: false };
        }
    }

    // Download model with progress tracking
    public async downloadModel(): Promise<void> {
        // Check network connectivity
        if (!NetworkService.canDownloadLargeFiles()) {
            throw new Error('No network connection available for download');
        }

        // Check storage space
        const storageCheck = await this.checkStorageSpace();
        if (!storageCheck.hasSpace) {
            const availableGB = (storageCheck.available / 1_000_000_000).toFixed(2);
            const requiredGB = (storageCheck.required / 1_000_000_000).toFixed(2);
            throw new Error(
                `Insufficient storage space. Available: ${availableGB}GB, Required: ${requiredGB}GB`
            );
        }

        const modelPath = this.getModelPath();
        const modelDir = modelPath.substring(0, modelPath.lastIndexOf('/'));

        // Create models directory if it doesn't exist
        const dirExists = await RNFS.exists(modelDir);
        if (!dirExists) {
            await RNFS.mkdir(modelDir);
        }

        // Start download
        return new Promise((resolve, reject) => {
            const download = RNFS.downloadFile({
                fromUrl: PHI3_MODEL_URL,
                toFile: modelPath,
                background: true,
                discretionary: false, // Don't wait for optimal conditions
                cacheable: false,
                progressInterval: 500,
                progressDivider: 1,
                begin: (res) => {
                    console.log('Download started:', res);
                    this.downloadJobId = res.jobId;
                },
                progress: (res) => {
                    const progress: DownloadProgress = {
                        bytesWritten: res.bytesWritten,
                        contentLength: res.contentLength,
                        progress: (res.bytesWritten / res.contentLength) * 100,
                    };
                    this.notifyProgressListeners(progress);
                },
            });

            download.promise
                .then(async (result) => {
                    if (result.statusCode === 200) {
                        // Save model info
                        const modelInfo: ModelInfo = {
                            version: PHI3_MODEL_VERSION,
                            size: result.bytesWritten,
                            downloadedAt: new Date().toISOString(),
                            modelPath: modelPath,
                        };
                        await AsyncStorage.setItem(STORAGE_KEYS.MODEL_INFO, JSON.stringify(modelInfo));
                        await AsyncStorage.setItem(STORAGE_KEYS.MODEL_VERSION, PHI3_MODEL_VERSION);

                        console.log('✅ Model downloaded successfully');
                        resolve();
                    } else {
                        throw new Error(`Download failed with status code: ${result.statusCode}`);
                    }
                })
                .catch((error) => {
                    console.error('Download error:', error);
                    reject(error);
                });
        });
    }

    // Pause download (if supported)
    public async pauseDownload(): Promise<void> {
        if (this.downloadJobId !== null) {
            this.isPaused = true;
            // Note: react-native-fs doesn't support pause/resume natively
            // We would need to implement this with custom logic
            console.warn('Pause/resume not fully implemented in this version');
        }
    }

    // Resume download (if supported)
    public async resumeDownload(): Promise<void> {
        if (this.isPaused) {
            this.isPaused = false;
            // Would need custom implementation
            console.warn('Pause/resume not fully implemented in this version');
        }
    }

    // Cancel download
    public async cancelDownload(): Promise<void> {
        if (this.downloadJobId !== null) {
            await RNFS.stopDownload(this.downloadJobId);
            this.downloadJobId = null;

            // Clean up partial download
            const modelPath = this.getModelPath();
            const exists = await RNFS.exists(modelPath);
            if (exists) {
                await RNFS.unlink(modelPath);
            }
        }
    }

    // Delete downloaded model
    public async deleteModel(): Promise<void> {
        try {
            const modelPath = this.getModelPath();
            const exists = await RNFS.exists(modelPath);

            if (exists) {
                await RNFS.unlink(modelPath);
            }

            // Clear model info
            await AsyncStorage.removeItem(STORAGE_KEYS.MODEL_INFO);
            await AsyncStorage.removeItem(STORAGE_KEYS.MODEL_VERSION);

            console.log('Model deleted successfully');
        } catch (error) {
            console.error('Error deleting model:', error);
            throw error;
        }
    }

    // Progress listeners
    public subscribeToProgress(listener: DownloadProgressListener): () => void {
        this.progressListeners.add(listener);
        return () => {
            this.progressListeners.delete(listener);
        };
    }

    private notifyProgressListeners(progress: DownloadProgress) {
        this.progressListeners.forEach(listener => listener(progress));
    }

    // Get download status
    public getDownloadStatus(): {
        isDownloading: boolean;
        isPaused: boolean;
    } {
        return {
            isDownloading: this.downloadJobId !== null,
            isPaused: this.isPaused,
        };
    }
}

export default new ModelDownloadService();
