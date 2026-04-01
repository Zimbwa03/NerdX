import axios from 'axios';
import { API_BASE_URL } from './config';

const BASE = `${API_BASE_URL}/api/v2`;

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TeacherProfile {
  id: number;
  login_code: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  specialisation: string | null;
  qualification: string | null;
  bio: string | null;
  sub_school_id: string;
}

export interface TeacherLoginResponse {
  token: string;
  teacher: TeacherProfile;
  school: {
    school_id: string;
    name: string;
    slug: string | null;
    logo_url: string | null;
  };
}

export interface TeacherClassInfo {
  class_subject_id: number;
  subject: { id: number; name: string; zimsec_code: string | null } | null;
  class: { id: number; display_name: string; form_id: number } | null;
  classroom: { id: number; name: string } | null;
  student_count: number;
}

export interface TeacherDashboardData {
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    photo_url: string | null;
    specialisation: string | null;
  };
  school: {
    school_id: string;
    name: string;
    slug: string | null;
    logo_url: string | null;
  } | null;
  total_classes: number;
  pending_submissions: number;
  upcoming_due: { title: string; due_date: string; assessment_id: number }[];
}

export interface ClassroomInfo {
  classroom: { id: number; name: string; class_subject_id: number };
  subject: { id: number; name: string; zimsec_code: string | null } | null;
  teacher: { id: number; first_name: string; last_name: string; photo_url: string | null } | null;
  class: { id: number; display_name: string } | null;
  student_count: number;
}

export interface ClassroomPost {
  id: number;
  classroom_id: number;
  teacher_id: number;
  post_type: string;
  title: string;
  content: string | null;
  attachments: unknown[];
  due_date: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Assessment {
  id: number;
  classroom_id: number;
  teacher_id: number;
  title: string;
  type: string;
  instructions: string | null;
  ai_marking_enabled: boolean;
  time_limit_mins: number | null;
  total_marks: number | null;
  due_date: string | null;
  release_date: string | null;
  is_released: boolean;
  results_released: boolean;
  created_at: string;
}

export interface AssessmentQuestion {
  id: number;
  assessment_id: number;
  question_number: number;
  question_text: string;
  question_type: string;
  options_json: { label: string; text: string }[] | null;
  correct_answer: string | null;
  marks: number;
  topic_tag: string | null;
  explanation: string | null;
}

export interface StudentSubmission {
  id: number;
  assessment_id: number;
  student_id: number;
  answers_json: Record<string, string> | null;
  status: string;
  ai_score: number | null;
  ai_total: number | null;
  ai_feedback_json: unknown[] | null;
  teacher_reviewed: boolean;
  teacher_score: number | null;
  teacher_feedback: string | null;
  final_score: number | null;
  final_total: number | null;
  submitted_at: string;
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    student_code: string;
    photo_url: string | null;
  };
}

export interface StudentPerformance {
  overall_accuracy: number;
  topics: { topic: string; accuracy: number; attempts: number; trend: string; weak_areas: string[] }[];
  weak_topics: { topic: string; accuracy: number }[];
  strong_topics: { topic: string; accuracy: number }[];
  assessment_history: unknown[];
  total_assessments: number;
}

export interface ClassAnalytics {
  class_average: number;
  total_students: number;
  students: {
    student_id: number;
    name: string;
    student_code: string;
    average_accuracy: number;
    badge: string;
    topics_assessed: number;
  }[];
  badge_distribution: Record<string, number>;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const teacherPortalApi = {
  // Auth
  async login(schoolId: string, loginCode: string): Promise<TeacherLoginResponse> {
    const { data } = await axios.post(`${BASE}/teachers/login`, { school_id: schoolId, login_code: loginCode });
    return data;
  },

  async getMe(token: string): Promise<TeacherProfile | null> {
    try {
      const { data } = await axios.get(`${BASE}/teachers/me`, { headers: authHeaders(token) });
      return data;
    } catch {
      return null;
    }
  },

  // Dashboard
  async getDashboard(token: string): Promise<TeacherDashboardData | null> {
    try {
      const { data } = await axios.get(`${BASE}/teachers/dashboard`, { headers: authHeaders(token) });
      return data;
    } catch {
      return null;
    }
  },

  async getMyClasses(token: string): Promise<{ classes: TeacherClassInfo[]; total: number }> {
    try {
      const { data } = await axios.get(`${BASE}/teachers/my-classes`, { headers: authHeaders(token) });
      return data;
    } catch {
      return { classes: [], total: 0 };
    }
  },

  // Classroom
  async getClassroom(token: string, classroomId: number): Promise<ClassroomInfo | null> {
    try {
      const { data } = await axios.get(`${BASE}/classrooms/${classroomId}`, { headers: authHeaders(token) });
      return data;
    } catch {
      return null;
    }
  },

  async getClassroomPosts(token: string, classroomId: number): Promise<ClassroomPost[]> {
    try {
      const { data } = await axios.get(`${BASE}/classrooms/${classroomId}/posts`, { headers: authHeaders(token) });
      return data.posts || [];
    } catch {
      return [];
    }
  },

  async createPost(token: string, classroomId: number, post: Record<string, unknown>) {
    const { data } = await axios.post(`${BASE}/classrooms/${classroomId}/posts`, post, { headers: authHeaders(token) });
    return data;
  },

  async updatePost(token: string, postId: number, updates: Record<string, unknown>) {
    const { data } = await axios.patch(`${BASE}/posts/${postId}`, updates, { headers: authHeaders(token) });
    return data;
  },

  async deletePost(token: string, postId: number) {
    await axios.delete(`${BASE}/posts/${postId}`, { headers: authHeaders(token) });
  },

  // Assessments
  async createAssessment(token: string, classroomId: number, assessment: Record<string, unknown>) {
    const { data } = await axios.post(`${BASE}/classrooms/${classroomId}/assessments`, assessment, { headers: authHeaders(token) });
    return data;
  },

  async listAssessments(token: string, classroomId: number): Promise<Assessment[]> {
    try {
      const { data } = await axios.get(`${BASE}/classrooms/${classroomId}/assessments`, { headers: authHeaders(token) });
      return data.assessments || [];
    } catch {
      return [];
    }
  },

  async getAssessment(token: string, assessmentId: number) {
    const { data } = await axios.get(`${BASE}/assessments/${assessmentId}`, { headers: authHeaders(token) });
    return data as { assessment: Assessment; questions: AssessmentQuestion[] };
  },

  async releaseAssessment(token: string, assessmentId: number) {
    const { data } = await axios.post(`${BASE}/assessments/${assessmentId}/release`, {}, { headers: authHeaders(token) });
    return data;
  },

  async releaseResults(token: string, assessmentId: number) {
    const { data } = await axios.post(`${BASE}/assessments/${assessmentId}/release-results`, {}, { headers: authHeaders(token) });
    return data;
  },

  // AI Exam Generation
  async generateExam(token: string, params: { subject: string; topic: string; question_type?: string; count?: number; difficulty?: string }) {
    const { data } = await axios.post(`${BASE}/assessments/generate`, params, { headers: authHeaders(token) });
    return data;
  },

  // Submissions
  async listSubmissions(token: string, assessmentId: number): Promise<StudentSubmission[]> {
    try {
      const { data } = await axios.get(`${BASE}/assessments/${assessmentId}/submissions`, { headers: authHeaders(token) });
      return data.submissions || [];
    } catch {
      return [];
    }
  },

  async reviewSubmission(token: string, submissionId: number, review: { teacher_score?: number; teacher_feedback?: string; final_score?: number; final_total?: number }) {
    const { data } = await axios.patch(`${BASE}/submissions/${submissionId}/review`, review, { headers: authHeaders(token) });
    return data;
  },

  // Student Performance
  async getStudentPerformance(token: string, studentId: number, subjectId: number): Promise<StudentPerformance | null> {
    try {
      const { data } = await axios.get(`${BASE}/students/${studentId}/performance/${subjectId}`, { headers: authHeaders(token) });
      return data;
    } catch {
      return null;
    }
  },

  // Class Analytics
  async getClassroomAnalytics(token: string, classroomId: number): Promise<ClassAnalytics | null> {
    try {
      const { data } = await axios.get(`${BASE}/classrooms/${classroomId}/analytics`, { headers: authHeaders(token) });
      return data;
    } catch {
      return null;
    }
  },
};
