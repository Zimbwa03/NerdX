import { Model } from '@nozbe/watermelondb'
import { field, date, text, json } from '@nozbe/watermelondb/decorators'

export default class Question extends Model {
    static table = 'questions'

    @field('remote_id') remoteId!: string
    @field('subject') subject!: string
    @field('topic') topic!: string
    @field('subtopic') subtopic!: string
    @field('difficulty') difficulty!: string
    @text('question_text') questionText!: string
    @json('options', (raw) => raw) options!: string[]
    @text('correct_answer') correctAnswer!: string
    @text('explanation') explanation!: string
    @field('image_url') imageUrl!: string

    @date('created_at') createdAt!: number
}
