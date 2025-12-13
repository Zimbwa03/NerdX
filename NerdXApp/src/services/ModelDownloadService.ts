// Model Download Service for Phi-3 model management
// Note: react-native-fs requires a development build and won't work in Expo Go
let RNFS: any = null;
try {
    RNFS = require('react-native-fs').default;
} catch (error) {
    console.warn('react-native-fs not available - model download features disabled (requires development build)');
}
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

// PRODUCTION CDN (Hugging Face Hub with CloudFront)
// Model hosted at: https://huggingface.co/ngoni2003/nerdx-phi3-mini
const PRODUCTION_CDN_URL = 'https://huggingface.co/ngoni2003/nerdx-phi3-mini/resolve/main';

// LOCAL TESTING (Optional - for development only)
// Uncomment and set to true if you want to test with a local server
// const LOCAL_SERVER_URL = 'http://192.168.1.100:8080';
// const USE_LOCAL_SERVER = false;

// Set to false for production (HTTPS), true only for local development
const USE_LOCAL_SERVER = false;

// Model file names (don't change these)
const MODEL_FILE_NAME = 'phi3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx';
const MODEL_DATA_FILE_NAME = 'phi3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx.data';

// Construct the URL based on environment
// For production, we use the Hugging Face CDN
const BASE_URL = PRODUCTION_CDN_URL;
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
        if (!RNFS) return '';
        return `${RNFS.DocumentDirectoryPath}/models/phi3-mini-4k-instruct.onnx`;
    }

    // Check if model is already downloaded (both files must exist)
    public async isModelDownloaded(): Promise<boolean> {
        if (!RNFS) return false; // RNFS not available in Expo Go
        try {
            const modelPath = this.getModelPath();
            const modelDataPath = this.getModelDataPath();

            // Check both files exist
            const mainExists = await RNFS.exists(modelPath);
            const dataExists = await RNFS.exists(modelDataPath);

            if (!mainExists || !dataExists) {
                console.log(`Model check: main=${mainExists}, data=${dataExists}`);
                return false;
            }

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
        if (!RNFS) return { available: 0, required: PHI3_MODEL_SIZE, hasSpace: false };
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

    // Download model with progress tracking - downloads BOTH files
    public async downloadModel(): Promise<void> {
        if (!RNFS) {
            throw new Error('Model download not available in Expo Go. Please use a development build.');
        }
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
        const modelDataPath = this.getModelDataPath();
        const modelDir = modelPath.substring(0, modelPath.lastIndexOf('/'));

        // Create models directory if it doesn't exist
        const dirExists = await RNFS.exists(modelDir);
        if (!dirExists) {
            await RNFS.mkdir(modelDir);
        }

        try {
            // Download both files sequentially
            // File 1: Main ONNX model file (smaller, ~20MB)
            console.log('📥 Starting download of main model file...');
            await this.downloadSingleFile(
                PHI3_MODEL_URL,
                modelPath,
                0,      // Start progress at 0%
                5       // This file is ~5% of total (small config file)
            );

            // File 2: ONNX Data file (larger, ~2.5GB)
            console.log('📥 Starting download of model data file...');
            await this.downloadSingleFile(
                PHI3_MODEL_DATA_URL,
                modelDataPath,
                5,      // Start progress at 5%
                100     // End at 100%
            );

            // Verify both files exist
            const mainExists = await RNFS.exists(modelPath);
            const dataExists = await RNFS.exists(modelDataPath);

            if (!mainExists || !dataExists) {
                throw new Error('Download verification failed: one or more files missing');
            }

            // Get combined file size
            const mainStat = await RNFS.stat(modelPath);
            const dataStat = await RNFS.stat(modelDataPath);
            const totalSize = parseInt(mainStat.size) + parseInt(dataStat.size);

            // Save model info
            const modelInfo: ModelInfo = {
                version: PHI3_MODEL_VERSION,
                size: totalSize,
                downloadedAt: new Date().toISOString(),
                modelPath: modelPath,
            };
            await AsyncStorage.setItem(STORAGE_KEYS.MODEL_INFO, JSON.stringify(modelInfo));
            await AsyncStorage.setItem(STORAGE_KEYS.MODEL_VERSION, PHI3_MODEL_VERSION);

            console.log('✅ Both model files downloaded successfully!');
            console.log(`   Main file: ${mainStat.size} bytes`);
            console.log(`   Data file: ${dataStat.size} bytes`);

        } catch (error) {
            // Clean up partial downloads on failure
            console.error('Download failed, cleaning up partial files:', error);
            await this.cleanupPartialDownload();
            throw error;
        }
    }

    // Helper method to download a single file with progress
    private async downloadSingleFile(
        url: string,
        filePath: string,
        progressStart: number,
        progressEnd: number
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const progressRange = progressEnd - progressStart;

            const download = RNFS.downloadFile({
                fromUrl: url,
                toFile: filePath,
                background: true,
                discretionary: false,
                cacheable: false,
                progressInterval: 500,
                progressDivider: 1,
                begin: (res) => {
                    console.log(`Download started: ${url}`);
                    console.log(`Expected size: ${res.contentLength} bytes`);
                    this.downloadJobId = res.jobId;
                },
                progress: (res) => {
                    // Calculate combined progress
                    const fileProgress = (res.bytesWritten / res.contentLength) * progressRange;
                    const overallProgress = progressStart + fileProgress;

                    const progress: DownloadProgress = {
                        bytesWritten: res.bytesWritten,
                        contentLength: res.contentLength,
                        progress: overallProgress,
                    };
                    this.notifyProgressListeners(progress);
                },
            });

            download.promise
                .then((result) => {
                    if (result.statusCode === 200) {
                        console.log(`✅ File downloaded: ${filePath} (${result.bytesWritten} bytes)`);
                        resolve();
                    } else {
                        reject(new Error(`Download failed with status code: ${result.statusCode}`));
                    }
                })
                .catch((error) => {
                    console.error('Download error:', error);
                    reject(error);
                });
        });
    }

    // Get model data file path
    private getModelDataPath(): string {
        if (!RNFS) return '';
        return `${RNFS.DocumentDirectoryPath}/models/phi3-mini-4k-instruct.onnx.data`;
    }

    // Clean up partial downloads
    private async cleanupPartialDownload(): Promise<void> {
        if (!RNFS) return;
        try {
            const modelPath = this.getModelPath();
            const modelDataPath = this.getModelDataPath();

            if (await RNFS.exists(modelPath)) {
                await RNFS.unlink(modelPath);
                console.log('Cleaned up partial model file');
            }
            if (await RNFS.exists(modelDataPath)) {
                await RNFS.unlink(modelDataPath);
                console.log('Cleaned up partial data file');
            }
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
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
        if (!RNFS) return;
        if (this.downloadJobId !== null) {
            await RNFS.stopDownload(this.downloadJobId);
            this.downloadJobId = null;

            // Clean up partial downloads (both files)
            await this.cleanupPartialDownload();
        }
    }

    // Delete downloaded model (both files)
    public async deleteModel(): Promise<void> {
        if (!RNFS) return;
        try {
            const modelPath = this.getModelPath();
            const modelDataPath = this.getModelDataPath();

            // Delete main model file
            if (await RNFS.exists(modelPath)) {
                await RNFS.unlink(modelPath);
                console.log('Deleted main model file');
            }

            // Delete data file
            if (await RNFS.exists(modelDataPath)) {
                await RNFS.unlink(modelDataPath);
                console.log('Deleted model data file');
            }

            // Clear model info
            await AsyncStorage.removeItem(STORAGE_KEYS.MODEL_INFO);
            await AsyncStorage.removeItem(STORAGE_KEYS.MODEL_VERSION);

            console.log('✅ Both model files deleted successfully');
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
