// WatermelonDB Database initialization
// Note: WatermelonDB requires native modules and won't work in Expo Go
// This file provides a safe fallback when running in Expo Go

let database: any = null;
let isWatermelonAvailable = false;

try {
    // Try to import WatermelonDB - will fail in Expo Go
    const { Database } = require('@nozbe/watermelondb');
    const SQLiteAdapter = require('@nozbe/watermelondb/adapters/sqlite').default;
    const { schema } = require('./schema');
    const User = require('./models/User').default;
    const Question = require('./models/Question').default;
    const Interaction = require('./models/Interaction').default;
    const Project = require('./models/Project').default;

    // Create the adapter to the underlying database:
    const adapter = new SQLiteAdapter({
        schema,
        onSetUpError: (error: any) => {
            console.error('Database failed to load', error);
        }
    });

    // Make a Watermelon database from it!
    database = new Database({
        adapter,
        modelClasses: [
            User,
            Question,
            Interaction,
            Project,
        ],
    });

    isWatermelonAvailable = true;
    console.log('✅ WatermelonDB initialized successfully');
} catch (error) {
    console.warn('⚠️ WatermelonDB not available - offline sync disabled (requires development build)');
    isWatermelonAvailable = false;
    database = null;
}

export { database, isWatermelonAvailable };
