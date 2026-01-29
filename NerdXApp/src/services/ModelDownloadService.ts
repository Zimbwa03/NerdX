// Model Download Service for Phi-3 model management
// Uses expo-file-system as primary (works in all builds) with react-native-fs as enhanced option
import * as ExpoFileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetworkService from './NetworkService';

// Import react-native-fs - may be null in Expo Go
let RNFS: typeof import('react-native-fs') | null = null;
let RNFS_AVAILABLE = false;

try {
    RNFS = require('react-native-fs');
    RNFS_AVAILABLE = RNFS !== null && typeof RNFS.getFSInfo === 'function';
    if (RNFS_AVAILABLE) {
        console.log('✅ react-native-fs loaded successfully');
    }
} catch (e) {
    console.warn('react-native-fs not available');
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
type DownloadCompleteListener = () => void;

const STORAGE_KEYS = {
    MODEL_INFO: '@nerdx_phi3_model_info',
    MODEL_VERSION: '@nerdx_phi3_model_version',
    DOWNLOAD_STATE: '@nerdx_download_state', // Track download progress for resumption
};

// ============================================
// MODEL CONFIGURATION
// ============================================

// PRODUCTION CDN (Hugging Face Hub with CloudFront)
// Model hosted at: https://huggingface.co/ngoni2003/nerdx-phi3-mini
const HUGGING_FACE_REPO = 'ngoni2003/nerdx-phi3-mini';
const PRODUCTION_CDN_URL = `https://huggingface.co/${HUGGING_FACE_REPO}/resolve/main`;

// LOCAL TESTING (Optional - for development only)
// Uncomment and set to true if you want to test with a local server
// const LOCAL_SERVER_URL = 'http://192.168.1.100:8080';
// const USE_LOCAL_SERVER = false;

// Set to false for production (HTTPS), true only for local development
const USE_LOCAL_SERVER = false;

// Hugging Face recommends hitting /resolve/main with ?download=1 to force the binary
const HUGGING_FACE_DOWNLOAD_PARAM = '?download=1';

// Primary file names (match HF docs) with fallbacks to older naming
const MODEL_FILE_NAMES = [
    'phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx',   // preferred
    'phi3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx',    // fallback
];

const MODEL_DATA_FILE_NAMES = [
    'phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx.data', // preferred
    'phi3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx.data',  // fallback
];

// Construct URLs based on environment
const BASE_URL = PRODUCTION_CDN_URL;
const buildUrls = (fileNames: string[]) => fileNames.map(name => `${BASE_URL}/${name}${HUGGING_FACE_DOWNLOAD_PARAM}`);
const PHI3_MODEL_URLS = buildUrls(MODEL_FILE_NAMES);
const PHI3_MODEL_DATA_URLS = buildUrls(MODEL_DATA_FILE_NAMES);

// Model metadata
const PHI3_MODEL_VERSION = '1.0.0';
const PHI3_MODEL_SIZE = 2_720_000_000; // ~2.72 GB (both files combined)
const PHI3_MODEL_MIN_SIZE = Math.floor(PHI3_MODEL_SIZE * 0.9); // fail fast on obvious partials

class ModelDownloadService {
    private downloadJobId: number | null = null;
    private progressListeners: Set<DownloadProgressListener> = new Set();
    private completeListeners: Set<DownloadCompleteListener> = new Set();
    private isPaused: boolean = false;
    private progressPollInterval: NodeJS.Timeout | null = null;
    private currentDownloadInfo: { filePath: string; progressStart: number; progressEnd: number; totalSize: number; mainFileSize: number } | null = null;

    // Normalize directory so we always have exactly one trailing slash (RNFS vs Expo can differ)
    private static ensureTrailingSlash(dir: string): string {
        return dir.replace(/\/?$/, '/');
    }

    // Get model storage path (primary: used for download when this FS is active)
    private getModelPath(): string {
        if (RNFS_AVAILABLE && RNFS) {
            return `${RNFS.DocumentDirectoryPath}/models/phi3-mini-4k-instruct.onnx`;
        }
        const base = ModelDownloadService.ensureTrailingSlash(ExpoFileSystem.documentDirectory ?? '');
        return `${base}models/phi3-mini-4k-instruct.onnx`;
    }

    // Get model data path
    private getModelDataPath(): string {
        if (RNFS_AVAILABLE && RNFS) {
            return `${RNFS.DocumentDirectoryPath}/models/phi3-mini-4k-instruct.onnx.data`;
        }
        const base = ModelDownloadService.ensureTrailingSlash(ExpoFileSystem.documentDirectory ?? '');
        return `${base}models/phi3-mini-4k-instruct.onnx.data`;
    }

    // Path set for RNFS (so we can check both locations regardless of which FS is "primary")
    private getModelPathRNFS(): { main: string; data: string } {
        if (!RNFS || !RNFS.DocumentDirectoryPath) {
            return { main: '', data: '' };
        }
        const base = ModelDownloadService.ensureTrailingSlash(RNFS.DocumentDirectoryPath);
        return {
            main: `${base}models/phi3-mini-4k-instruct.onnx`,
            data: `${base}models/phi3-mini-4k-instruct.onnx.data`,
        };
    }

    // Path set for Expo (so we can check both locations)
    private getModelPathExpo(): { main: string; data: string } {
        const base = ModelDownloadService.ensureTrailingSlash(ExpoFileSystem.documentDirectory ?? '');
        return {
            main: `${base}models/phi3-mini-4k-instruct.onnx`,
            data: `${base}models/phi3-mini-4k-instruct.onnx.data`,
        };
    }

    // Returns the path where the main .onnx file actually exists (checks both RNFS and Expo locations).
    // Use this when loading the model so it works whether the model was downloaded with RNFS or Expo.
    public async getResolvedModelPath(): Promise<string | null> {
        try {
            if (RNFS_AVAILABLE && RNFS) {
                const { main, data } = this.getModelPathRNFS();
                if (main && data) {
                    const mainExists = await RNFS.exists(main);
                    const dataExists = await RNFS.exists(data);
                    if (mainExists && dataExists) {
                        console.log('Resolved model path (RNFS):', main);
                        return main;
                    }
                }
            }
            const { main, data } = this.getModelPathExpo();
            const mainInfo = await ExpoFileSystem.getInfoAsync(main);
            const dataInfo = await ExpoFileSystem.getInfoAsync(data);
            if (mainInfo.exists && dataInfo.exists) {
                console.log('Resolved model path (Expo):', main);
                return main;
            }
            return null;
        } catch (error) {
            console.error('Error resolving model path:', error);
            return null;
        }
    }

    // Check if model is already downloaded (both files must exist in EITHER location)
    public async isModelDownloaded(): Promise<boolean> {
        try {
            let mainExists = false;
            let dataExists = false;
            let mainPath = '';
            let dataPath = '';

            // Check RNFS location first if available
            if (RNFS_AVAILABLE && RNFS) {
                const rnfs = this.getModelPathRNFS();
                if (rnfs.main && rnfs.data) {
                    mainExists = await RNFS.exists(rnfs.main);
                    dataExists = await RNFS.exists(rnfs.data);
                    if (mainExists && dataExists) {
                        mainPath = rnfs.main;
                        dataPath = rnfs.data;
                    }
                }
            }

            // If not found in RNFS, check Expo location (same or different dir depending on build)
            if (!mainExists || !dataExists) {
                const expo = this.getModelPathExpo();
                const mainInfo = await ExpoFileSystem.getInfoAsync(expo.main);
                const dataInfo = await ExpoFileSystem.getInfoAsync(expo.data);
                mainExists = mainInfo.exists;
                dataExists = dataInfo.exists;
                if (mainExists && dataExists) {
                    mainPath = expo.main;
                    dataPath = expo.data;
                }
            }

            if (!mainExists || !dataExists) {
                console.log(`Model check: main=${mainExists}, data=${dataExists} (checked both RNFS and Expo paths)`);
                return false;
            }

            // Verify model info (version) so we don't treat old/invalid installs as ready
            const modelInfo = await this.getModelInfo();
            if (modelInfo === null || modelInfo.version !== PHI3_MODEL_VERSION) {
                return false;
            }

            // Basic size sanity check using the location we found
            const totalSize = await this.getSizeAtPaths(mainPath, dataPath);
            if (totalSize < PHI3_MODEL_MIN_SIZE) {
                console.warn(`Model files are too small: ${totalSize} bytes (expected >= ${PHI3_MODEL_MIN_SIZE})`);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error checking model download status:', error);
            return false;
        }
    }

    // Get combined file size at given main + data paths (RNFS or Expo)
    private async getSizeAtPaths(mainPath: string, dataPath: string): Promise<number> {
        try {
            if (RNFS_AVAILABLE && RNFS && (mainPath.startsWith('/') || !mainPath.startsWith('file:'))) {
                const mainExists = await RNFS.exists(mainPath);
                const dataExists = await RNFS.exists(dataPath);
                if (mainExists && dataExists) {
                    const mainStat = await RNFS.stat(mainPath);
                    const dataStat = await RNFS.stat(dataPath);
                    return Number(mainStat.size || 0) + Number(dataStat.size || 0);
                }
            }
            const mainInfo = await ExpoFileSystem.getInfoAsync(mainPath);
            const dataInfo = await ExpoFileSystem.getInfoAsync(dataPath);
            const mainSize = mainInfo.exists ? (mainInfo.size ?? 0) : 0;
            const dataSize = dataInfo.exists ? (dataInfo.size ?? 0) : 0;
            return mainSize + dataSize;
        } catch {
            return 0;
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

    // Notify download completion (for local notifications)
    private notifyDownloadComplete(): void {
        // This will be handled by the notification service
        // We emit a custom event that can be listened to
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('modelDownloadComplete'));
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
            await this.downloadWithFallbackUrls(
                PHI3_MODEL_URLS,
                modelPath,
                0,      // Start progress at 0%
                5       // This file is ~5% of total (small config file)
            );

            // File 2: ONNX Data file (larger, ~2.5GB)
            console.log('📥 Starting download of model data file...');
            await this.downloadWithFallbackUrls(
                PHI3_MODEL_DATA_URLS,
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
            // RNFS size is already a number, no need for parseInt
            const totalSize = Number(mainStat.size) + Number(dataStat.size);

            if (totalSize < PHI3_MODEL_MIN_SIZE) {
                throw new Error(
                    `Downloaded model size too small: ${totalSize} bytes (expected >= ${PHI3_MODEL_MIN_SIZE})`
                );
            }

            // Save model info
            const modelInfo: ModelInfo = {
                version: PHI3_MODEL_VERSION,
                size: totalSize,
                downloadedAt: new Date().toISOString(),
                modelPath: modelPath,
            };
            await AsyncStorage.setItem(STORAGE_KEYS.MODEL_INFO, JSON.stringify(modelInfo));
            await AsyncStorage.setItem(STORAGE_KEYS.MODEL_VERSION, PHI3_MODEL_VERSION);
            
            // Clear download state on success
            await this.saveDownloadState(null);

            console.log('✅ Both model files downloaded successfully with RNFS!');
            console.log(`   Main file: ${mainStat.size} bytes`);
            console.log(`   Data file: ${dataStat.size} bytes`);
            
            // Trigger notification (will be handled by caller)
            this.notifyDownloadComplete();

        } catch (error) {
            // Clean up partial downloads on failure
            console.error('Download failed, cleaning up partial files:', error);
            await this.cleanupPartialDownload();
            throw error;
        }
    }

    // Poll file size for progress updates (ExpoFS doesn't provide progress callbacks)
    private startProgressPolling(): void {
        this.stopProgressPolling(); // Clear any existing polling

        this.progressPollInterval = setInterval(async () => {
            if (!this.currentDownloadInfo) {
                return;
            }

            try {
                const fileInfo = await ExpoFileSystem.getInfoAsync(this.currentDownloadInfo.filePath);
                if (fileInfo.exists && fileInfo.size !== undefined) {
                    const currentSize = fileInfo.size;
                    const fileProgress = Math.min(currentSize / this.currentDownloadInfo.totalSize, 1);
                    const overallProgress = this.currentDownloadInfo.progressStart +
                        (fileProgress * (this.currentDownloadInfo.progressEnd - this.currentDownloadInfo.progressStart));

                    const totalBytesWritten = this.currentDownloadInfo.mainFileSize + currentSize;

                    const progress: DownloadProgress = {
                        bytesWritten: totalBytesWritten,
                        contentLength: PHI3_MODEL_SIZE,
                        progress: Math.min(overallProgress, 100),
                    };
                    this.notifyProgressListeners(progress);
                }
            } catch (error) {
                console.warn('Error polling file progress:', error);
            }
        }, 500); // Poll every 500ms for smooth progress updates
    }

    private stopProgressPolling(): void {
        if (this.progressPollInterval) {
            clearInterval(this.progressPollInterval);
            this.progressPollInterval = null;
        }
        this.currentDownloadInfo = null;
    }

    // Download using expo-file-system (with progress polling)
    private async downloadWithExpoFS(): Promise<void> {
        console.log('📥 Using expo-file-system for download...');

        const base = ModelDownloadService.ensureTrailingSlash(ExpoFileSystem.documentDirectory ?? '');
        const modelDir = `${base}models/`;
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

            // Try to get actual file size from server for accurate progress
            let actualMainSize = await this.getFileSizeFromServer(PHI3_MODEL_URLS[0]);
            if (!actualMainSize) {
                // Fallback to estimate if we can't get the size
                actualMainSize = PHI3_MODEL_SIZE * 0.05;
            }

            // Set up polling for main file
            this.currentDownloadInfo = {
                filePath: modelPath,
                progressStart: 0,
                progressEnd: 5,
                totalSize: actualMainSize,
                mainFileSize: 0,
            };
            this.startProgressPolling();

            const mainDownload = await this.downloadWithExpoFallback(PHI3_MODEL_URLS, modelPath);

            if (mainDownload.status !== 200) {
                this.stopProgressPolling();
                throw new Error(`Main file download failed with status: ${mainDownload.status}`);
            }

            // Get actual main file size
            const mainInfo = await ExpoFileSystem.getInfoAsync(modelPath);
            const verifiedMainSize = (mainInfo.exists && mainInfo.size) ? mainInfo.size : actualMainSize;

            this.stopProgressPolling();
            this.notifyProgressListeners({
                bytesWritten: verifiedMainSize,
                contentLength: PHI3_MODEL_SIZE,
                progress: 5
            });

            // Download data file (the large one, ~95% of total)
            console.log('📥 Downloading model data file with ExpoFS...');

            // Try to get actual data file size from server for accurate progress
            let actualDataSize = await this.getFileSizeFromServer(PHI3_MODEL_DATA_URLS[0]);
            if (!actualDataSize) {
                // Fallback to estimate if we can't get the size
                actualDataSize = PHI3_MODEL_SIZE - verifiedMainSize;
            }

            // Set up polling for data file
            this.currentDownloadInfo = {
                filePath: modelDataPath,
                progressStart: 5,
                progressEnd: 100,
                totalSize: actualDataSize,
                mainFileSize: verifiedMainSize,
            };
            this.startProgressPolling();

            const dataDownload = await this.downloadWithExpoFallback(PHI3_MODEL_DATA_URLS, modelDataPath);

            if (dataDownload.status !== 200) {
                this.stopProgressPolling();
                throw new Error(`Data file download failed with status: ${dataDownload.status}`);
            }

            this.stopProgressPolling();
            this.notifyProgressListeners({ bytesWritten: PHI3_MODEL_SIZE, contentLength: PHI3_MODEL_SIZE, progress: 100 });

            // Verify files (reuse mainInfo from earlier, get fresh dataInfo)
            const verifiedMainInfo = await ExpoFileSystem.getInfoAsync(modelPath);
            const dataInfo = await ExpoFileSystem.getInfoAsync(modelDataPath);

            if (!verifiedMainInfo.exists || !dataInfo.exists) {
                throw new Error('Download verification failed: files missing');
            }

            const totalSize = (verifiedMainInfo.exists ? (verifiedMainInfo.size || 0) : 0) + (dataInfo.exists ? (dataInfo.size || 0) : 0);
            if (totalSize < PHI3_MODEL_MIN_SIZE) {
                throw new Error(
                    `Downloaded model size too small: ${totalSize} bytes (expected >= ${PHI3_MODEL_MIN_SIZE})`
                );
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
            
            // Clear download state on success
            await this.saveDownloadState(null);

            console.log('✅ Model files downloaded successfully with ExpoFS!');
            
            // Trigger notification
            this.notifyDownloadComplete();

        } catch (error) {
            this.stopProgressPolling(); // Ensure polling stops on error
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
                progressInterval: 250, // More frequent updates (every 250ms instead of 500ms)
                progressDivider: 1,
                // Timeouts help avoid silent stalls on long downloads
                connectionTimeout: 15_000,
                readTimeout: 60_000,
                // Enable background download - continues even when app is in background
                background: true,
                discretionary: false, // Don't defer to WiFi - use current connection
                cacheable: false,
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

    // Try multiple Hugging Face URLs (preferred + fallback naming) before failing
    private async downloadWithFallbackUrls(
        urls: string[],
        filePath: string,
        progressStart: number,
        progressEnd: number
    ): Promise<void> {
        let lastError: Error | null = null;

        for (const url of urls) {
            try {
                await this.downloadSingleFile(url, filePath, progressStart, progressEnd);
                return;
            } catch (error: any) {
                console.warn(`Download attempt failed for ${url}:`, error?.message || error);
                lastError = error;
                // Clean up the partial file for the next attempt
                try {
                    if (RNFS_AVAILABLE && RNFS) {
                        if (await RNFS.exists(filePath)) {
                            await RNFS.unlink(filePath);
                        }
                    } else {
                        await ExpoFileSystem.deleteAsync(filePath, { idempotent: true });
                    }
                } catch (cleanupErr) {
                    console.warn('Cleanup after failed attempt failed:', cleanupErr);
                }
            }
        }

        throw lastError || new Error('All download URLs failed');
    }

    // Helper to get file size from server (for better progress tracking)
    private async getFileSizeFromServer(url: string): Promise<number | null> {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
                const contentLength = response.headers.get('content-length');
                if (contentLength) {
                    return parseInt(contentLength, 10);
                }
            }
        } catch (error) {
            console.warn('Could not get file size from server:', error);
        }
        return null;
    }

    // Expo-specific download with fallback URLs
    private async downloadWithExpoFallback(urls: string[], destination: string) {
        let lastError: Error | null = null;

        for (const url of urls) {
            try {
                const result = await ExpoFileSystem.downloadAsync(url, destination);
                if (result.status === 200) {
                    return result;
                }
                lastError = new Error(`Status ${result.status} from ${url}`);
            } catch (error: any) {
                console.warn(`Expo download attempt failed for ${url}:`, error?.message || error);
                lastError = error;
            }

            // Clean up partial downloads between attempts
            try {
                await ExpoFileSystem.deleteAsync(destination, { idempotent: true });
            } catch (cleanupErr) {
                console.warn('Cleanup after failed Expo attempt failed:', cleanupErr);
            }
        }

        throw lastError || new Error('All Expo download URLs failed');
    }

    // Get the current local model sizes (main + data)
    private async getLocalModelSizes(): Promise<{ mainSize: number; dataSize: number; totalSize: number }> {
        const modelPath = this.getModelPath();
        const modelDataPath = this.getModelDataPath();

        if (RNFS_AVAILABLE && RNFS) {
            const mainExists = await RNFS.exists(modelPath);
            const dataExists = await RNFS.exists(modelDataPath);
            const mainStat = mainExists ? await RNFS.stat(modelPath) : { size: 0 };
            const dataStat = dataExists ? await RNFS.stat(modelDataPath) : { size: 0 };
            const mainSize = Number(mainStat.size || 0);
            const dataSize = Number(dataStat.size || 0);
            return { mainSize, dataSize, totalSize: mainSize + dataSize };
        }

        const mainInfo = await ExpoFileSystem.getInfoAsync(modelPath);
        const dataInfo = await ExpoFileSystem.getInfoAsync(modelDataPath);
        const mainSize = mainInfo.exists ? mainInfo.size || 0 : 0;
        const dataSize = dataInfo.exists ? dataInfo.size || 0 : 0;
        return { mainSize, dataSize, totalSize: mainSize + dataSize };
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
        this.stopProgressPolling(); // Stop polling if active
        if (RNFS_AVAILABLE && RNFS && this.downloadJobId !== null) {
            await RNFS.stopDownload(this.downloadJobId);
            this.downloadJobId = null;
        }
        // Clean up partial downloads (both files)
        await this.cleanupPartialDownload();
        // Clear download state
        await this.saveDownloadState(null);
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

    // Download completion listeners
    public subscribeToComplete(listener: DownloadCompleteListener): () => void {
        this.completeListeners.add(listener);
        return () => {
            this.completeListeners.delete(listener);
        };
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
