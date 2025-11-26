// Network Service for detecting and monitoring connectivity
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export type ConnectionType = 'wifi' | 'cellular' | 'none' | 'unknown';
export type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'offline';

interface NetworkState {
    isConnected: boolean;
    connectionType: ConnectionType;
    connectionQuality: ConnectionQuality;
    isInternetReachable: boolean | null;
}

type NetworkChangeListener = (state: NetworkState) => void;

class NetworkService {
    private listeners: Set<NetworkChangeListener> = new Set();
    private currentState: NetworkState = {
        isConnected: false,
        connectionType: 'none',
        connectionQuality: 'offline',
        isInternetReachable: null,
    };

    constructor() {
        this.initialize();
    }

    private async initialize() {
        // Subscribe to network state updates
        NetInfo.addEventListener((state: NetInfoState) => {
            this.handleNetworkChange(state);
        });

        // Get initial state
        const state = await NetInfo.fetch();
        this.handleNetworkChange(state);
    }

    private handleNetworkChange(state: NetInfoState) {
        const networkState: NetworkState = {
            isConnected: state.isConnected ?? false,
            connectionType: this.getConnectionType(state),
            connectionQuality: this.assessConnectionQuality(state),
            isInternetReachable: state.isInternetReachable,
        };

        this.currentState = networkState;
        this.notifyListeners(networkState);
    }

    private getConnectionType(state: NetInfoState): ConnectionType {
        if (!state.isConnected) return 'none';

        switch (state.type) {
            case 'wifi':
                return 'wifi';
            case 'cellular':
                return 'cellular';
            default:
                return 'unknown';
        }
    }

    private assessConnectionQuality(state: NetInfoState): ConnectionQuality {
        if (!state.isConnected) return 'offline';

        // For cellular connections, check effective connection type
        if (state.type === 'cellular' && state.details) {
            const cellularDetails = state.details as any;
            const cellularGeneration = cellularDetails.cellularGeneration;

            if (cellularGeneration === '4g' || cellularGeneration === '5g') {
                return 'excellent';
            } else if (cellularGeneration === '3g') {
                return 'good';
            } else {
                return 'poor';
            }
        }

        // For WiFi, assume good quality
        if (state.type === 'wifi') {
            return 'excellent';
        }

        return 'good';
    }

    private notifyListeners(state: NetworkState) {
        this.listeners.forEach(listener => listener(state));
    }

    // Public API
    public getCurrentState(): NetworkState {
        return { ...this.currentState };
    }

    public isOnline(): boolean {
        return this.currentState.isConnected;
    }

    public isWiFi(): boolean {
        return this.currentState.connectionType === 'wifi';
    }

    public isCellular(): boolean {
        return this.currentState.connectionType === 'cellular';
    }

    public hasGoodConnection(): boolean {
        const quality = this.currentState.connectionQuality;
        return quality === 'excellent' || quality === 'good';
    }

    public canDownloadLargeFiles(): boolean {
        // Allow downloads on both WiFi and cellular
        return this.isOnline() && (this.isWiFi() || this.isCellular());
    }

    public subscribe(listener: NetworkChangeListener): () => void {
        this.listeners.add(listener);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }

    public async refresh(): Promise<NetworkState> {
        const state = await NetInfo.fetch();
        this.handleNetworkChange(state);
        return this.currentState;
    }
}

export default new NetworkService();
