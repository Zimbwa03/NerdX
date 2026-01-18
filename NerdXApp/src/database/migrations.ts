import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations'

export const migrations = schemaMigrations({
    migrations: [
        {
            // Migrate from version 1 to version 2
            toVersion: 2,
            steps: [
                // Add 'level' column to projects table
                addColumns({
                    table: 'projects',
                    columns: [
                        { name: 'level', type: 'string', isOptional: true },
                    ],
                }),
            ],
        },
    ],
})

