// TypeScript type definitions for NerdX Web App

export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  nerdx_id?: string;
  name: string;
  surname: string;
  email?: string;
  phone_number?: string;
  credits: number;
  credit_breakdown?: {
    total: number;
    free_credits: number;
    purchased_credits: number;
    welcome_bonus_claimed: boolean;
  };
  role: UserRole;
  is_teacher?: boolean;
  teacher_profile_id?: string;
}

// ─── Teacher Marketplace Types ───────────────────────────────────────────────

export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type AcademicLevel = 'O-Level' | 'A-Level';
export type FormLevel = 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4' | 'Form 5' | 'Form 6';
export type Curriculum = 'ZIMSEC' | 'Cambridge';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TeacherProfile {
  id: string;
  user_id: string;
  full_name: string;
  surname: string;
  email: string;
  phone?: string;
  whatsapp: string;
  date_of_birth?: string;
  bio: string;
  experience_description: string;
  years_of_experience: number;
  profile_image_url?: string;
  intro_video_url?: string;
  verification_status: VerificationStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  subjects?: TeacherSubject[];
  qualifications?: TeacherQualification[];
  availability?: TeacherAvailability[];
  reviews?: TeacherReview[];
  posts?: TeacherPost[];
  average_rating?: number;
  total_reviews?: number;
}

export interface TeacherSubject {
  id: string;
  teacher_id: string;
  subject_name: string;
  academic_level: AcademicLevel;
  form_levels: FormLevel[];
  curriculum: Curriculum;
}

export interface TeacherQualification {
  id: string;
  teacher_id: string;
  title: string;
  institution: string;
  certificate_url?: string;
  year: number;
  qualification_type: 'ZIMSEC' | 'Cambridge' | 'Diploma' | 'Degree' | 'Other';
}

export interface TeacherAvailability {
  id: string;
  teacher_id: string;
  day_of_week: DayOfWeek;
  start_time: string; // HH:mm format
  end_time: string;   // HH:mm format
}

export interface TeacherReview {
  id: string;
  teacher_id: string;
  student_id: string;
  student_name?: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
}

export interface LessonBooking {
  id: string;
  teacher_id: string;
  student_id: string;
  subject: string;
  date: string;       // YYYY-MM-DD
  start_time: string;  // HH:mm
  end_time: string;    // HH:mm
  status: BookingStatus;
  meet_link?: string;
  room_id?: string;    // shared room for Jitsi + tldraw
  notes?: string;
  created_at: string;
  // Joined data
  teacher?: TeacherProfile;
}

export interface TeacherSearchFilters {
  query?: string;
  subject?: string;
  academic_level?: AcademicLevel;
  form_level?: FormLevel;
  min_rating?: number;
  day_of_week?: DayOfWeek;
  curriculum?: Curriculum;
}

// ─── Teacher Social Feed Types ──────────────────────────────────────────────

export type PostType = 'text' | 'tip' | 'image' | 'video' | 'resource';

export interface TeacherPost {
  id: string;
  teacher_id: string;
  content: string;
  post_type: PostType;
  media_url?: string | null;
  subject_tag?: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  // Enriched client-side
  teacher_name?: string;
  teacher_image?: string;
  comments?: PostComment[];
  user_has_liked?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

// ─── Teacher Dashboard Analytics Types ────────────────────────────────────────

export interface TeacherDashboardStats {
  id: string;
  teacher_id: string;
  total_lessons_completed: number;
  total_hours_taught: number;
  total_students: number;
  completion_rate: number;
  avg_session_duration_min: number;
  this_month_lessons: number;
  this_month_hours: number;
  last_updated: string;
}

export type AttendanceStatus = 'attended' | 'missed' | 'late';

export interface LessonAttendance {
  id: string;
  booking_id: string;
  teacher_id: string;
  student_id: string;
  student_name?: string;
  subject: string;
  date: string;
  status: AttendanceStatus;
  duration_minutes: number;
  teacher_notes?: string;
  created_at: string;
}

export interface WeeklyLessonData {
  day: string;        // e.g. "Mon", "Tue"
  date: string;       // YYYY-MM-DD
  lessons: number;
}

export interface MonthlyRatingData {
  month: string;      // e.g. "Jan", "Feb"
  avgRating: number;
  reviewCount: number;
}

export interface SubjectDistribution {
  subject: string;
  count: number;
  percentage: number;
}

export interface EngagementData {
  week: string;       // e.g. "Week 1"
  bookings: number;
  completed: number;
}

export interface ActivityItem {
  id: string;
  type: 'booking' | 'lesson_completed' | 'review' | 'comment' | 'post';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface FeedbackItem {
  id: string;
  type: 'review' | 'comment';
  studentName: string;
  content: string;
  rating?: number;
  timestamp: string;
  postTitle?: string;
}

export interface TeacherOnboardingData {
  // Step 1: Personal Details
  full_name: string;
  surname: string;
  date_of_birth: string;
  whatsapp: string;
  email: string;
  phone?: string;
  // Step 2: Qualifications
  qualifications: Omit<TeacherQualification, 'id' | 'teacher_id'>[];
  // Step 3: Experience & Skills
  years_of_experience: number;
  experience_description: string;
  subjects: Omit<TeacherSubject, 'id' | 'teacher_id'>[];
  // Step 4: Profile Media
  bio: string;
  profile_image?: File;
  intro_video?: File;
}
