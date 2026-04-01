import axios from 'axios';
import { API_BASE_URL } from './config';

const BASE = `${API_BASE_URL}/api/v2`;

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GroupSchool {
  id: number;
  group_id: string;
  name: string;
  logo_url: string | null;
  admin_email: string | null;
  phone: string | null;
  country: string;
}

export interface SubSchool {
  id: number;
  school_id: string;
  name: string;
  slug: string;
  group_id: string | null;
  campus_name: string | null;
  location: string | null;
  city: string | null;
  logo_url: string | null;
  unique_login_url: string | null;
  student_count?: number;
  teacher_count?: number;
}

export interface AcademicYear {
  id: number;
  sub_school_id: string;
  year_label: string;
  is_active: boolean;
  term_structure: unknown[];
  start_date: string | null;
  end_date: string | null;
}

export interface SchoolForm {
  id: number;
  sub_school_id: string;
  academic_year_id: number;
  form_number: number;
  label: string;
}

export interface SchoolClass {
  id: number;
  form_id: number;
  sub_school_id: string;
  class_name: string;
  display_name: string;
  capacity: number;
}

export interface SchoolSubject {
  id: number;
  sub_school_id: string;
  form_id: number | null;
  name: string;
  zimsec_code: string | null;
  description: string | null;
  is_compulsory: boolean;
}

export interface SchoolTeacher {
  id: number;
  sub_school_id: string;
  login_code: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  specialisation: string | null;
  qualification: string | null;
  status: string;
}

export interface SchoolStudent {
  id: number;
  sub_school_id: string;
  class_id: number;
  student_code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string | null;
  home_address: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  guardian_email: string | null;
  national_id: string | null;
  photo_url: string | null;
  status: string;
  enrolled_at: string | null;
}

export interface ClassSubjectAssignment {
  id: number;
  class_id: number;
  subject_id: number;
  teacher_id: number | null;
  subject?: SchoolSubject | null;
  teacher?: SchoolTeacher | null;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const schoolEcosystemApi = {
  // Group Schools
  async createGroupSchool(data: { name: string; admin_email?: string; phone?: string; logo_url?: string }) {
    const { data: res } = await axios.post(`${BASE}/group-schools`, data);
    return res;
  },

  async listGroupSubSchools(groupId: string) {
    const { data } = await axios.get(`${BASE}/group-schools/${groupId}/sub-schools`);
    return data as { sub_schools: SubSchool[]; total: number };
  },

  // Sub-Schools
  async createSubSchool(data: Record<string, unknown>) {
    const { data: res } = await axios.post(`${BASE}/sub-schools`, data);
    return res;
  },

  async getSubSchool(schoolId: string) {
    const { data } = await axios.get(`${BASE}/sub-schools/${schoolId}`);
    return data as SubSchool;
  },

  // Academic Years
  async createAcademicYear(token: string, schoolId: string, data: { year_label: string; is_active?: boolean; term_structure?: unknown[] }) {
    const { data: res } = await axios.post(`${BASE}/sub-schools/${schoolId}/academic-years`, data, { headers: authHeaders(token) });
    return res;
  },

  async listAcademicYears(token: string, schoolId: string) {
    const { data } = await axios.get(`${BASE}/sub-schools/${schoolId}/academic-years`, { headers: authHeaders(token) });
    return data as { academic_years: AcademicYear[] };
  },

  // Forms
  async createForm(token: string, schoolId: string, data: { form_number: number; academic_year_id: number; label?: string }) {
    const { data: res } = await axios.post(`${BASE}/sub-schools/${schoolId}/forms`, data, { headers: authHeaders(token) });
    return res;
  },

  async listForms(token: string, schoolId: string, academicYearId?: number) {
    const params = academicYearId ? `?academic_year_id=${academicYearId}` : '';
    const { data } = await axios.get(`${BASE}/sub-schools/${schoolId}/forms${params}`, { headers: authHeaders(token) });
    return data as { forms: SchoolForm[] };
  },

  // Classes
  async createClass(token: string, schoolId: string, data: { form_id: number; class_name: string; capacity?: number }) {
    const { data: res } = await axios.post(`${BASE}/sub-schools/${schoolId}/classes`, data, { headers: authHeaders(token) });
    return res;
  },

  async listClasses(token: string, schoolId: string, formId?: number) {
    const params = formId ? `?form_id=${formId}` : '';
    const { data } = await axios.get(`${BASE}/sub-schools/${schoolId}/classes${params}`, { headers: authHeaders(token) });
    return data as { classes: SchoolClass[] };
  },

  async listClassStudents(token: string, classId: number) {
    const { data } = await axios.get(`${BASE}/classes/${classId}/students`, { headers: authHeaders(token) });
    return data as { students: SchoolStudent[]; total: number };
  },

  async listClassSubjects(token: string, classId: number) {
    const { data } = await axios.get(`${BASE}/classes/${classId}/subjects`, { headers: authHeaders(token) });
    return data as { class_subjects: ClassSubjectAssignment[] };
  },

  // Subjects
  async createSubject(token: string, schoolId: string, data: { name: string; form_id?: number; zimsec_code?: string; is_compulsory?: boolean }) {
    const { data: res } = await axios.post(`${BASE}/sub-schools/${schoolId}/subjects`, data, { headers: authHeaders(token) });
    return res;
  },

  async listSubjects(token: string, schoolId: string, formId?: number) {
    const params = formId ? `?form_id=${formId}` : '';
    const { data } = await axios.get(`${BASE}/sub-schools/${schoolId}/subjects${params}`, { headers: authHeaders(token) });
    return data as { subjects: SchoolSubject[] };
  },

  // Teachers
  async registerTeacher(token: string, schoolId: string, data: Record<string, unknown>) {
    const { data: res } = await axios.post(`${BASE}/sub-schools/${schoolId}/teachers`, data, { headers: authHeaders(token) });
    return res;
  },

  async listTeachers(token: string, schoolId: string) {
    const { data } = await axios.get(`${BASE}/sub-schools/${schoolId}/teachers`, { headers: authHeaders(token) });
    return data as { teachers: SchoolTeacher[]; total: number };
  },

  async assignTeacher(token: string, schoolId: string, data: { class_id: number; subject_id: number; teacher_id: number; academic_year_id?: number }) {
    const { data: res } = await axios.post(`${BASE}/sub-schools/${schoolId}/teachers/assign`, data, { headers: authHeaders(token) });
    return res;
  },

  // Students
  async registerStudent(token: string, schoolId: string, data: Record<string, unknown>) {
    const { data: res } = await axios.post(`${BASE}/sub-schools/${schoolId}/students`, data, { headers: authHeaders(token) });
    return res;
  },

  async listStudents(token: string, schoolId: string, params?: { class_id?: number; form_id?: number; search?: string }) {
    const qp = new URLSearchParams();
    if (params?.class_id) qp.set('class_id', String(params.class_id));
    if (params?.form_id) qp.set('form_id', String(params.form_id));
    if (params?.search) qp.set('search', params.search);
    const qs = qp.toString() ? `?${qp.toString()}` : '';
    const { data } = await axios.get(`${BASE}/sub-schools/${schoolId}/students${qs}`, { headers: authHeaders(token) });
    return data as { students: SchoolStudent[]; total: number };
  },

  async getStudent(token: string, studentId: number) {
    const { data } = await axios.get(`${BASE}/students/${studentId}`, { headers: authHeaders(token) });
    return data;
  },

  async updateStudent(token: string, studentId: number, updates: Record<string, unknown>) {
    const { data } = await axios.patch(`${BASE}/students/${studentId}`, updates, { headers: authHeaders(token) });
    return data;
  },

  async transferStudent(token: string, studentId: number, newClassId: number) {
    const { data } = await axios.post(`${BASE}/students/${studentId}/transfer`, { new_class_id: newClassId }, { headers: authHeaders(token) });
    return data;
  },
};
