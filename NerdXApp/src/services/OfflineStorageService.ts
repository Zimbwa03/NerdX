// Offline Storage Service for Project Assistant
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CachedProject {
    id: number;
    title: string;
    subject: string;
    current_stage: string;
    project_data: any;
    updated_at: string;
}

interface CachedMessage {
    id: string;
    project_id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    synced: boolean;
}

const STORAGE_KEYS = {
    PROJECTS: '@nerdx_projects',
    MESSAGES: '@nerdx_messages_',
    PENDING_MESSAGES: '@nerdx_pending_messages',
};

class OfflineStorageService {
    // Cache projects
    async cacheProjects(projects: CachedProject[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        } catch (error) {
            console.error('Error caching projects:', error);
        }
    }

    async getCachedProjects(): Promise<CachedProject[]> {
        try {
            const cached = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
            return cached ? JSON.parse(cached) : [];
        } catch (error) {
            console.error('Error getting cached projects:', error);
            return [];
        }
    }

    // Cache messages for a specific project
    async cacheMessages(projectId: number, messages: CachedMessage[]): Promise<void> {
        try {
            const key = `${STORAGE_KEYS.MESSAGES}${projectId}`;
            await AsyncStorage.setItem(key, JSON.stringify(messages));
        } catch (error) {
            console.error('Error caching messages:', error);
        }
    }

    async getCachedMessages(projectId: number): Promise<CachedMessage[]> {
        try {
            const key = `${STORAGE_KEYS.MESSAGES}${projectId}`;
            const cached = await AsyncStorage.getItem(key);
            return cached ? JSON.parse(cached) : [];
        } catch (error) {
            console.error('Error getting cached messages:', error);
            return [];
        }
    }

    // Queue messages for syncing when online
    async queueMessage(message: CachedMessage): Promise<void> {
        try {
            const pending = await this.getPendingMessages();
            pending.push(message);
            await AsyncStorage.setItem(STORAGE_KEYS.PENDING_MESSAGES, JSON.stringify(pending));
        } catch (error) {
            console.error('Error queuing message:', error);
        }
    }

    async getPendingMessages(): Promise<CachedMessage[]> {
        try {
            const cached = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_MESSAGES);
            return cached ? JSON.parse(cached) : [];
        } catch (error) {
            console.error('Error getting pending messages:', error);
            return [];
        }
    }

    async clearPendingMessages(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_MESSAGES);
        } catch (error) {
            console.error('Error clearing pending messages:', error);
        }
    }

    // Clear all cached data
    async clearAllCache(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const nerdxKeys = keys.filter(key => key.startsWith('@nerdx_'));
            await AsyncStorage.multiRemove(nerdxKeys);
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
}

export default new OfflineStorageService();
