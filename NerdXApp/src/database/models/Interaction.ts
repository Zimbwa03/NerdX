import { Model } from '@nozbe/watermelondb'
import { field, date, text, json } from '@nozbe/watermelondb/decorators'

export default class Interaction extends Model {
    static table = 'interactions'

    @field('user_id') userId: string
    @field('question_id') questionId: string
    @field('skill_id') skillId: string
    @field('subject') subject: string
    @field('correct') correct: boolean
    @field('confidence') confidence: string
    @field('time_spent') timeSpent: number
    @field('hints_used') hintsUsed: number
    @field('session_id') sessionId: string

    @date('timestamp') timestamp: number
    @field('synced') synced: boolean
}
