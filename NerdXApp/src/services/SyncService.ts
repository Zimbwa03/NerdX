// Sync Service - handles WatermelonDB sync with backend
// Note: WatermelonDB requires native modules and won't work in Expo Go

import { database, isWatermelonAvailable } from '../database'
import { getAuthToken } from './api/authApi'
import axios from 'axios'
import { API_URL } from '../config'

// Dynamic import for synchronize to prevent crash in Expo Go
let synchronize: any = null;

try {
    synchronize = require('@nozbe/watermelondb/sync').synchronize;
} catch (error) {
    console.warn('WatermelonDB sync not available in Expo Go');
}

export const sync = async () => {
    // Check if WatermelonDB is available
    if (!isWatermelonAvailable || !synchronize || !database) {
        console.warn('⚠️ Sync skipped - WatermelonDB not available (requires development build)');
        return;
    }

    await synchronize({
        database,
        pullChanges: async ({ lastPulledAt, schemaVersion, migration }: any) => {
            const token = await getAuthToken()
            const response = await axios.get(`${API_URL}/sync/pull`, {
                params: {
                    last_pulled_at: lastPulledAt,
                    schema_version: schemaVersion,
                    migration,
                },
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            const { changes, timestamp } = response.data.data
            return { changes, timestamp }
        },
        pushChanges: async ({ changes, lastPulledAt }: any) => {
            const token = await getAuthToken()
            const response = await axios.post(`${API_URL}/sync/push`, {
                changes,
                last_pulled_at: lastPulledAt,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
        },
        migrationsEnabledAtVersion: 1,
    })
}
