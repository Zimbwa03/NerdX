import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
    static table = 'users'

    @field('nerdx_id') nerdxId!: string
    @field('username') username!: string
    @field('full_name') fullName!: string
    @field('email') email!: string
    @field('credits') credits!: number
    @field('xp') xp!: number
    @field('streak_count') streakCount!: number

    @date('last_active') lastActive!: number
    @readonly @date('created_at') createdAt!: number
    @readonly @date('updated_at') updatedAt!: number
}
