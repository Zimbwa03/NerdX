import { Model } from '@nozbe/watermelondb'
import { field, text, date, json, readonly } from '@nozbe/watermelondb/decorators'

export default class Project extends Model {
    static table = 'projects'

    @text('remote_id') remoteId!: string
    @text('title') title!: string
    @text('subject') subject!: string
    @text('student_name') studentName!: string
    @text('student_surname') studentSurname!: string
    @text('school') school!: string
    @text('form') form!: string
    @text('current_stage') currentStage!: string
    @field('completed') completed!: boolean
    @json('project_data', (json) => json) projectData!: any
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date
    @field('synced') synced!: boolean
}
