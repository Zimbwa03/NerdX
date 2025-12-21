// Model Download Service for Phi-3 model management
// Uses expo-file-system as primary (works in all builds) with react-native-fs as enhanced option
import * as ExpoFileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetworkService from './NetworkService';

// Try to import react-native-fs for enhanced download features (background downloads, progress)
let RNFS: any = null;
let RNFS_AVAILABLE = false;
try {
    RNFS = require('react-native-fs').default;
    if (RNFS && typeof RNFS.getFSInfo === 'function') {
        RNFS_AVAILABLE = true;
        console.log('✅ react-native-fs loaded successfully');
    }
} catch (error) {
    console.warn('react-native-fs not available - using expo-file-system fallback');
}

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
        if (RNFS_AVAILABLE && RNFS) {
            return `${RNFS.DocumentDirectoryPath}/models/phi3-mini-4k-instruct.onnx`;
        }
        return `${ExpoFileSystem.documentDirectory}models/phi3-mini-4k-instruct.onnx`;
    }

    // Get model data path
    private getModelDataPath(): string {
        if (RNFS_AVAILABLE && RNFS) {
            return `${RNFS.DocumentDirectoryPath}/models/phi3-mini-4k-instruct.onnx.data`;
        }
        return `${ExpoFileSystem.documentDirectory}models/phi3-mini-4k-instruct.onnx.data`;
    }

    // Check if model is already downloaded (both files must exist)
    public async isModelDownloaded(): Promise<boolean> {
        try {
            const modelPath = this.getModelPath();
            const modelDataPath = this.getModelDataPath();

            let mainExists = false;
            let dataExists = false;

            if (RNFS_AVAILABLE && RNFS) {
                mainExists = await RNFS.exists(modelPath);
                dataExists = await RNFS.exists(modelDataPath);
            } else {
                const mainInfo = await ExpoFileSystem.getInfoAsync(modelPath);
                const dataInfo = await ExpoFileSystem.getInfoAsync(modelDataPath);
                mainExists = mainInfo.exists;
                dataExists = dataInfo.exists;
            }

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
        console.log('📊 Checking storage space...');
        console.log(`   RNFS_AVAILABLE: ${RNFS_AVAILABLE}`);

        try {
            // Try react-native-fs first (better accuracy on native builds)
            if (RNFS_AVAILABLE && RNFS) {
                try {
                    const freeSpace = await RNFS.getFSInfo();
                    console.log('   RNFS.getFSInfo result:', freeSpace);
                    const availableSpace = freeSpace?.freeSpace || 0;
                    if (availableSpace > 0) {
                        return {
                            available: availableSpace,
                            required: PHI3_MODEL_SIZE,
                            hasSpace: availableSpace > PHI3_MODEL_SIZE * 1.2,
                        };
                    }
                } catch (rnfsError) {
                    console.warn('   RNFS.getFSInfo failed:', rnfsError);
                }
            }

            // Use expo-file-system (works in all builds including Expo Go)
            console.log('   Trying expo-file-system...');
            const freeSpace = await ExpoFileSystem.getFreeDiskStorageAsync();
            console.log('   ExpoFileSystem.getFreeDiskStorageAsync result:', freeSpace);

            if (freeSpace !== null && freeSpace !== undefined && freeSpace > 0) {
                return {
                    available: freeSpace,
                    required: PHI3_MODEL_SIZE,
                    hasSpace: freeSpace > PHI3_MODEL_SIZE * 1.2,
                };
            }

            // If we still don't have storage info, return a large placeholder to allow download attempt
            console.warn('   Could not determine storage space, allowing download attempt');
            return { available: 10_000_000_000, required: PHI3_MODEL_SIZE, hasSpace: true };
        } catch (error) {
            console.error('Error checking storage space:', error);
            // Return a permissive value to allow download attempt - download will fail if no space
            return { available: 10_000_000_000, required: PHI3_MODEL_SIZE, hasSpace: true };
        }
    }

    // Download model with progress tracking - downloads BOTH files
    public async downloadModel(): Promise<void> {
        console.log('📥 Starting model download...');
        console.log(`   RNFS_AVAILABLE: ${RNFS_AVAILABLE}`);

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

        // Use RNFS if available, otherwise fall back to expo-file-system
        if (RNFS_AVAILABLE && RNFS) {
            await this.downloadWithRNFS();
        } else {
            await this.downloadWithExpoFS();
        }
    }

    // Download using react-native-fs (with progress tracking)
    private async downloadWithRNFS(): Promise<void> {
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

            console.log('✅ Both model files downloaded successfully with RNFS!');
            console.log(`   Main file: ${mainStat.size} bytes`);
            console.log(`   Data file: ${dataStat.size} bytes`);

        } catch (error) {
            // Clean up partial downloads on failure
            console.error('Download failed, cleaning up partial files:', error);
            await this.cleanupPartialDownload();
            throw error;
        }
    }

    // Download using expo-file-system (fallback, basic progress)
    private async downloadWithExpoFS(): Promise<void> {
        console.log('📥 Using expo-file-system for download...');

        const modelDir = `${ExpoFileSystem.documentDirectory}models/`;
        const modelPath = `${modelDir}phi3-mini-4k-instruct.onnx`;
        const modelDataPath = `${modelDir}phi3-mini-4k-instruct.onnx.data`;

        // Create models directory
        const dirInfo = await ExpoFileSystem.getInfoAsync(modelDir);
        if (!dirInfo.exists) {
            await ExpoFileSystem.makeDirectoryAsync(modelDir, { intermediates: true });
        }

        try {
            // Download main model file
            console.log('📥 Downloading main model file with ExpoFS...');
            this.notifyProgressListeners({ bytesWritten: 0, contentLength: PHI3_MODEL_SIZE, progress: 0 });

            const mainDownload = await ExpoFileSystem.downloadAsync(
                PHI3_MODEL_URL,
                modelPath
            );

            if (mainDownload.status !== 200) {
                throw new Error(`Main file download failed with status: ${mainDownload.status}`);
            }

            this.notifyProgressListeners({ bytesWritten: PHI3_MODEL_SIZE * 0.05, contentLength: PHI3_MODEL_SIZE, progress: 5 });

            // Download data file
            console.log('📥 Downloading model data file with ExpoFS...');
            const dataDownload = await ExpoFileSystem.downloadAsync(
                PHI3_MODEL_DATA_URL,
                modelDataPath
            );

            if (dataDownload.status !== 200) {
                throw new Error(`Data file download failed with status: ${dataDownload.status}`);
            }

            this.notifyProgressListeners({ bytesWritten: PHI3_MODEL_SIZE, contentLength: PHI3_MODEL_SIZE, progress: 100 });

            // Verify files
            const mainInfo = await ExpoFileSystem.getInfoAsync(modelPath);
            const dataInfo = await ExpoFileSystem.getInfoAsync(modelDataPath);

            if (!mainInfo.exists || !dataInfo.exists) {
                throw new Error('Download verification failed: files missing');
            }

            // Save model info
            const modelInfo: ModelInfo = {
                version: PHI3_MODEL_VERSION,
                size: (mainInfo.size || 0) + (dataInfo.size || 0),
                downloadedAt: new Date().toISOString(),
                modelPath: modelPath,
            };
            await AsyncStorage.setItem(STORAGE_KEYS.MODEL_INFO, JSON.stringify(modelInfo));
            await AsyncStorage.setItem(STORAGE_KEYS.MODEL_VERSION, PHI3_MODEL_VERSION);

            console.log('✅ Model files downloaded successfully with ExpoFS!');

        } catch (error) {
            console.error('ExpoFS download failed:', error);
            // Clean up
            try {
                await ExpoFileSystem.deleteAsync(modelPath, { idempotent: true });
                await ExpoFileSystem.deleteAsync(modelDataPath, { idempotent: true });
            } catch (cleanupError) {
                console.warn('Cleanup failed:', cleanupError);
            }
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
                begin: (res: { contentLength: number; jobId: number }) => {
                    console.log(`Download started: ${url} `);
                    console.log(`Expected size: ${res.contentLength} bytes`);
                    this.downloadJobId = res.jobId;
                },
                progress: (res: { bytesWritten: number; contentLength: number }) => {
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
                .then((result: { statusCode: number; bytesWritten: number }) => {
                    if (result.statusCode === 200) {
                        console.log(`✅ File downloaded: ${filePath} (${result.bytesWritten} bytes)`);
                        resolve();
                    } else {
                        reject(new Error(`Download failed with status code: ${result.statusCode} `));
                    }
                })
                .catch((error: Error) => {
                    console.error('Download error:', error);
                    reject(error);
                });
        });
    }

    // Clean up partial downloads
    private async cleanupPartialDownload(): Promise<void> {
        try {
            const modelPath = this.getModelPath();
            const modelDataPath = this.getModelDataPath();

            if (RNFS_AVAILABLE && RNFS) {
                if (await RNFS.exists(modelPath)) {
                    await RNFS.unlink(modelPath);
                    console.log('Cleaned up partial model file');
                }
                if (await RNFS.exists(modelDataPath)) {
                    await RNFS.unlink(modelDataPath);
                    console.log('Cleaned up partial data file');
                }
            } else {
                await ExpoFileSystem.deleteAsync(modelPath, { idempotent: true });
                await ExpoFileSystem.deleteAsync(modelDataPath, { idempotent: true });
                console.log('Cleaned up partial files with ExpoFS');
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
        if (RNFS_AVAILABLE && RNFS && this.downloadJobId !== null) {
            await RNFS.stopDownload(this.downloadJobId);
            this.downloadJobId = null;
        }
        // Clean up partial downloads (both files)
        await this.cleanupPartialDownload();
    }

    // Delete downloaded model (both files)
    public async deleteModel(): Promise<void> {
        try {
            const modelPath = this.getModelPath();
            const modelDataPath = this.getModelDataPath();

            if (RNFS_AVAILABLE && RNFS) {
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
            } else {
                // Use ExpoFS
                await ExpoFileSystem.deleteAsync(modelPath, { idempotent: true });
                await ExpoFileSystem.deleteAsync(modelDataPath, { idempotent: true });
                console.log('Deleted model files with ExpoFS');
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
