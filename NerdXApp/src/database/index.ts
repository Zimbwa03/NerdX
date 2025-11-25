import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { schema } from './schema'
import User from './models/User'
import Question from './models/Question'
import Interaction from './models/Interaction'
import Project from './models/Project'

// Create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
    schema,
    // (You might want to comment out this line if you want to use JSI in development)
    // jsi: true, 
    onSetUpError: error => {
        // Database failed to load -- offer the user to reload the app or log out
        console.error('Database failed to load', error)
    }
})

// Then, make a Watermelon database from it!
export const database = new Database({
    adapter,
    modelClasses: [
        User,
        Question,
        Interaction,
        Project,
    ],
})
