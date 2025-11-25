import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'users',
            columns: [
                { name: 'nerdx_id', type: 'string', isIndexed: true },
                { name: 'username', type: 'string' },
                { name: 'full_name', type: 'string' },
                { name: 'email', type: 'string' },
                { name: 'credits', type: 'number' },
                { name: 'xp', type: 'number' },
                { name: 'streak_count', type: 'number' },
                { name: 'last_active', type: 'number' }, // timestamp
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'questions',
            columns: [
                { name: 'remote_id', type: 'string', isIndexed: true },
                { name: 'subject', type: 'string', isIndexed: true },
                { name: 'topic', type: 'string', isIndexed: true },
                { name: 'subtopic', type: 'string' },
                { name: 'difficulty', type: 'string' },
                { name: 'question_text', type: 'string' },
                { name: 'options', type: 'string' }, // JSON stringified
                { name: 'correct_answer', type: 'string' },
                { name: 'explanation', type: 'string' },
                { name: 'image_url', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'interactions',
            columns: [
                { name: 'user_id', type: 'string', isIndexed: true },
                { name: 'question_id', type: 'string', isIndexed: true },
                { name: 'skill_id', type: 'string', isIndexed: true },
                { name: 'subject', type: 'string' },
                { name: 'correct', type: 'boolean' },
                { name: 'confidence', type: 'string' },
                { name: 'time_spent', type: 'number' },
                { name: 'hints_used', type: 'number' },
                { name: 'session_id', type: 'string' },
                { name: 'timestamp', type: 'number' },
                { name: 'synced', type: 'boolean', isIndexed: true }, // Sync status
            ]
        }),
        tableSchema({
            name: 'sync_queue',
            columns: [
                { name: 'table_name', type: 'string' },
                { name: 'record_id', type: 'string' },
                { name: 'operation', type: 'string' }, // create, update, delete
                { name: 'status', type: 'string' }, // pending, syncing, failed
                { name: 'created_at', type: 'number' },
            ]
        }),
    ]
})
