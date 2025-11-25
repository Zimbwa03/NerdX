import { database } from '../database'
import { synchronize } from '@nozbe/watermelondb/sync'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const API_URL = 'https://nerdx.onrender.com/api/mobile'

export class SyncService {
    static async sync() {
        try {
            const token = await AsyncStorage.getItem('userToken')
            if (!token) return

            await synchronize({
                database,
                pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
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
                    await axios.post(`${API_URL}/sync/push`, {
                        changes,
                        last_pulled_at: lastPulledAt,
                    }, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                },
                migrationsEnabledAtVersion: 1,
            })

            console.log('Sync completed successfully')
        } catch (error) {
            console.error('Sync failed:', error)
        }
    }
}
