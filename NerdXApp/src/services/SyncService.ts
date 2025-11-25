import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from '../database'
import { getAuthToken } from './api/authApi' // Assuming this exists or I'll use storage directly
import axios from 'axios'
import { API_URL } from '../config' // Assuming config exists

export const sync = async () => {
    await synchronize({
        database,
        pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
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
        pushChanges: async ({ changes, lastPulledAt }) => {
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
