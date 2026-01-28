import { Model } from '@nozbe/watermelondb'
import { field, text, date, json, readonly } from '@nozbe/watermelondb/decorators'

export default class Project extends Model {
    static table = 'projects'

    @text('remote_id') remoteId: string
    @text('title') title?: string  // Now optional - developed in chat
    @text('subject') subject: string
    @text('student_name') studentName?: string  // Optional - fetched from user profile
    @text('student_surname') studentSurname?: string  // Optional - fetched from user profile
    @text('school') school?: string
    @text('form') form?: string
    @text('level') level?: string  // O-Level or A-Level
    @text('current_stage') currentStage: string
    @field('completed') completed: boolean
    @json('project_data', (json) => json) projectData: any
    @readonly @date('created_at') createdAt: Date
    @readonly @date('updated_at') updatedAt: Date
    @field('synced') synced: boolean
}
