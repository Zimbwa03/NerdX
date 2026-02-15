// Teacher Marketplace API – Supabase CRUD operations
import { supabase } from '../supabase';
import type {
  TeacherProfile,
  TeacherSubject,
  TeacherQualification,
  TeacherAvailability,
  TeacherReview,
  LessonBooking,
  TeacherSearchFilters,
  TeacherOnboardingData,
  TeacherPost,
  PostComment,
  PostType,
  TeacherDashboardStats,
  LessonAttendance,
  WeeklyLessonData,
  MonthlyRatingData,
  SubjectDistribution,
  EngagementData,
  ActivityItem,
  FeedbackItem,
} from '../../types';

// ─── Helper: generate a UUID (browser-safe) ──────────────────────────────────
function uuid(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Get the effective user ID for Supabase operations.
 * Prefers the Supabase Auth UUID (required for RLS policies) and
 * falls back to the provided application-level user ID.
 */
async function getEffectiveUserId(fallbackId: string): Promise<string> {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id || fallbackId;
  } catch {
    return fallbackId;
  }
}

// ─── File Uploads ─────────────────────────────────────────────────────────────

export async function uploadTeacherFile(
  bucket: 'teacher-certificates' | 'teacher-profiles' | 'teacher-videos',
  file: File,
  teacherId: string,
): Promise<string | null> {
  try {
    const ext = file.name.split('.').pop() || 'bin';
    const path = `${teacherId}/${uuid()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      console.error('[Marketplace] Upload error:', error.message);
      return null;
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData?.publicUrl ?? null;
  } catch (err) {
    console.error('[Marketplace] Upload exception:', err);
    return null;
  }
}

// ─── Teacher Profile CRUD ─────────────────────────────────────────────────────

export async function createTeacherProfile(
  userId: string,
  data: TeacherOnboardingData,
): Promise<TeacherProfile | null> {
  try {
    const profileId = uuid();

    // Resolve the effective user ID (Supabase Auth UUID for RLS, fallback to app ID)
    const effectiveUserId = await getEffectiveUserId(userId);

    // 1. Upload media files if present
    let profileImageUrl: string | null = null;
    let introVideoUrl: string | null = null;

    if (data.profile_image) {
      profileImageUrl = await uploadTeacherFile('teacher-profiles', data.profile_image, profileId);
    }
    if (data.intro_video) {
      introVideoUrl = await uploadTeacherFile('teacher-videos', data.intro_video, profileId);
    }

    // 2. Insert teacher profile
    const profileRow = {
      id: profileId,
      user_id: effectiveUserId,
      full_name: data.full_name,
      surname: data.surname,
      email: data.email,
      phone: data.phone || null,
      whatsapp: data.whatsapp,
      date_of_birth: data.date_of_birth || null,
      bio: data.bio,
      experience_description: data.experience_description,
      years_of_experience: data.years_of_experience,
      profile_image_url: profileImageUrl,
      intro_video_url: introVideoUrl,
      verification_status: 'pending' as const,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase
      .from('teacher_profiles')
      .insert(profileRow);

    if (profileError) {
      console.error('[Marketplace] Profile insert error:', profileError.message);
      return null;
    }

    // 3. Insert subjects
    if (data.subjects.length > 0) {
      const subjectRows = data.subjects.map((s) => ({
        id: uuid(),
        teacher_id: profileId,
        subject_name: s.subject_name,
        academic_level: s.academic_level,
        form_levels: s.form_levels,
        curriculum: s.curriculum,
      }));
      const { error: subjectError } = await supabase.from('teacher_subjects').insert(subjectRows);
      if (subjectError) {
        console.error('[Marketplace] Subject insert error:', subjectError.message);
        // Profile was created – continue, but log the error
      }
    }

    // 4. Insert qualifications
    if (data.qualifications.length > 0) {
      const qualRows: Array<Record<string, unknown>> = [];
      for (const q of data.qualifications) {
        let certUrl: string | null = null;
        if (q.certificate_url) {
          // certificate_url here is actually a data-URL or already-uploaded URL
          certUrl = q.certificate_url;
        }
        qualRows.push({
          id: uuid(),
          teacher_id: profileId,
          title: q.title,
          institution: q.institution,
          certificate_url: certUrl,
          year: q.year,
          qualification_type: q.qualification_type,
        });
      }
      const { error: qualError } = await supabase.from('teacher_qualifications').insert(qualRows);
      if (qualError) {
        console.error('[Marketplace] Qualification insert error:', qualError.message);
        // Profile was created – continue, but log the error
      }
    }

    return { ...profileRow, subjects: [], qualifications: [], reviews: [], average_rating: 0, total_reviews: 0 } as unknown as TeacherProfile;
  } catch (err) {
    console.error('[Marketplace] createTeacherProfile exception:', err);
    return null;
  }
}

export async function getTeacherProfile(teacherId: string): Promise<TeacherProfile | null> {
  try {
    const { data, error } = await supabase
      .from('teacher_profiles')
      .select('*')
      .eq('id', teacherId)
      .single();

    if (error || !data) return null;

    // Fetch related data
    const [subjectsRes, qualsRes, availRes, reviewsRes] = await Promise.all([
      supabase.from('teacher_subjects').select('*').eq('teacher_id', teacherId),
      supabase.from('teacher_qualifications').select('*').eq('teacher_id', teacherId),
      supabase.from('teacher_availability').select('*').eq('teacher_id', teacherId),
      supabase.from('teacher_reviews').select('*').eq('teacher_id', teacherId).order('created_at', { ascending: false }),
    ]);

    const reviews = (reviewsRes.data || []) as TeacherReview[];
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      ...data,
      subjects: (subjectsRes.data || []) as TeacherSubject[],
      qualifications: (qualsRes.data || []) as TeacherQualification[],
      availability: (availRes.data || []) as TeacherAvailability[],
      reviews,
      average_rating: Math.round(avgRating * 10) / 10,
      total_reviews: reviews.length,
    } as TeacherProfile;
  } catch (err) {
    console.error('[Marketplace] getTeacherProfile exception:', err);
    return null;
  }
}

export async function getTeacherProfileByUserId(userId: string): Promise<TeacherProfile | null> {
  try {
    // Try with Supabase Auth UUID first (matches how profiles are now created)
    const effectiveUserId = await getEffectiveUserId(userId);

    const { data, error } = await supabase
      .from('teacher_profiles')
      .select('*')
      .eq('user_id', effectiveUserId)
      .single();

    if (!error && data) return getTeacherProfile(data.id);

    // Fallback: try with the original app-level user ID (for older profiles)
    if (effectiveUserId !== userId) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!fallbackError && fallbackData) return getTeacherProfile(fallbackData.id);
    }

    return null;
  } catch {
    return null;
  }
}

export async function updateTeacherProfile(
  teacherId: string,
  updates: Partial<Pick<TeacherProfile, 'bio' | 'experience_description' | 'years_of_experience' | 'phone' | 'whatsapp' | 'profile_image_url' | 'intro_video_url' | 'is_active'>>,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('teacher_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', teacherId);
    return !error;
  } catch {
    return false;
  }
}

// ─── Search & Discovery ───────────────────────────────────────────────────────

export async function searchTeachers(
  filters: TeacherSearchFilters = {},
): Promise<TeacherProfile[]> {
  try {
    // Start with approved, active teachers
    let query = supabase
      .from('teacher_profiles')
      .select('*')
      .eq('verification_status', 'approved')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Text search on name/bio
    if (filters.query) {
      query = query.or(
        `full_name.ilike.%${filters.query}%,surname.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`,
      );
    }

    const { data: profiles, error } = await query;
    if (error || !profiles) return [];

    // Enrich each profile with subjects and reviews
    const enriched: TeacherProfile[] = [];

    for (const p of profiles) {
      const [subRes, revRes] = await Promise.all([
        supabase.from('teacher_subjects').select('*').eq('teacher_id', p.id),
        supabase.from('teacher_reviews').select('*').eq('teacher_id', p.id),
      ]);

      const subjects = (subRes.data || []) as TeacherSubject[];
      const reviews = (revRes.data || []) as TeacherReview[];
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Apply subject filter
      if (filters.subject) {
        const hasSubject = subjects.some((s) => s.subject_name === filters.subject);
        if (!hasSubject) continue;
      }

      // Apply academic level filter
      if (filters.academic_level) {
        const hasLevel = subjects.some((s) => s.academic_level === filters.academic_level);
        if (!hasLevel) continue;
      }

      // Apply form level filter
      if (filters.form_level) {
        const hasForm = subjects.some((s) => s.form_levels?.includes(filters.form_level!));
        if (!hasForm) continue;
      }

      // Apply min rating filter
      if (filters.min_rating && avgRating < filters.min_rating) continue;

      enriched.push({
        ...p,
        subjects,
        reviews,
        average_rating: Math.round(avgRating * 10) / 10,
        total_reviews: reviews.length,
      } as TeacherProfile);
    }

    return enriched;
  } catch (err) {
    console.error('[Marketplace] searchTeachers exception:', err);
    return [];
  }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getTeacherReviews(teacherId: string): Promise<TeacherReview[]> {
  try {
    const { data, error } = await supabase
      .from('teacher_reviews')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    return error ? [] : (data as TeacherReview[]);
  } catch {
    return [];
  }
}

export async function submitReview(
  teacherId: string,
  studentId: string,
  studentName: string,
  rating: number,
  comment: string,
): Promise<boolean> {
  try {
    const { error } = await supabase.from('teacher_reviews').insert({
      id: uuid(),
      teacher_id: teacherId,
      student_id: studentId,
      student_name: studentName,
      rating,
      comment,
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function createBooking(
  teacherId: string,
  studentId: string,
  subject: string,
  date: string,
  startTime: string,
  endTime: string,
  notes?: string,
): Promise<LessonBooking | null> {
  try {
    const row = {
      id: uuid(),
      teacher_id: teacherId,
      student_id: studentId,
      subject,
      date,
      start_time: startTime,
      end_time: endTime,
      status: 'pending' as const,
      notes: notes || null,
      meet_link: null,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('lesson_bookings').insert(row);
    if (error) return null;
    return row as unknown as LessonBooking;
  } catch {
    return null;
  }
}

export async function getStudentBookings(studentId: string): Promise<LessonBooking[]> {
  try {
    const { data, error } = await supabase
      .from('lesson_bookings')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: true });
    return error ? [] : (data as LessonBooking[]);
  } catch {
    return [];
  }
}

export async function getTeacherBookings(teacherId: string): Promise<LessonBooking[]> {
  try {
    const { data, error } = await supabase
      .from('lesson_bookings')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('date', { ascending: true });
    return error ? [] : (data as LessonBooking[]);
  } catch {
    return [];
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: LessonBooking['status'],
  meetLink?: string,
): Promise<boolean> {
  try {
    const updates: Record<string, unknown> = { status };
    if (meetLink) updates.meet_link = meetLink;
    // Auto-generate a room_id when confirming a booking (used for Jitsi + tldraw)
    if (status === 'confirmed') {
      const shortId = bookingId.slice(0, 8);
      const rand = Math.random().toString(36).slice(2, 8);
      updates.room_id = `nerdx-${shortId}-${rand}`;
    }
    const { error } = await supabase
      .from('lesson_bookings')
      .update(updates)
      .eq('id', bookingId);
    return !error;
  } catch {
    return false;
  }
}

export async function getBookingById(bookingId: string): Promise<LessonBooking | null> {
  try {
    const { data, error } = await supabase
      .from('lesson_bookings')
      .select('*')
      .eq('id', bookingId)
      .single();
    if (error || !data) return null;
    return data as LessonBooking;
  } catch {
    return null;
  }
}

export async function completeLesson(bookingId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('lesson_bookings')
      .update({ status: 'completed' })
      .eq('id', bookingId);
    return !error;
  } catch {
    return false;
  }
}

// ─── Availability ─────────────────────────────────────────────────────────────

export async function setTeacherAvailability(
  teacherId: string,
  slots: Omit<TeacherAvailability, 'id' | 'teacher_id'>[],
): Promise<boolean> {
  try {
    // Remove existing slots
    await supabase.from('teacher_availability').delete().eq('teacher_id', teacherId);
    // Insert new
    if (slots.length > 0) {
      const rows = slots.map((s) => ({
        id: uuid(),
        teacher_id: teacherId,
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
      }));
      const { error } = await supabase.from('teacher_availability').insert(rows);
      return !error;
    }
    return true;
  } catch {
    return false;
  }
}

export async function getTeacherAvailability(teacherId: string): Promise<TeacherAvailability[]> {
  try {
    const { data, error } = await supabase
      .from('teacher_availability')
      .select('*')
      .eq('teacher_id', teacherId);
    return error ? [] : (data as TeacherAvailability[]);
  } catch {
    return [];
  }
}

// ─── Teacher Social Feed (Posts) ──────────────────────────────────────────────

export async function createPost(
  teacherId: string,
  content: string,
  postType: PostType,
  mediaUrl?: string | null,
  subjectTag?: string | null,
): Promise<TeacherPost | null> {
  try {
    const row = {
      id: uuid(),
      teacher_id: teacherId,
      content,
      post_type: postType,
      media_url: mediaUrl || null,
      subject_tag: subjectTag || null,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('teacher_posts').insert(row);
    if (error) {
      console.error('[Feed] createPost error:', error.message);
      return null;
    }
    return row as TeacherPost;
  } catch (err) {
    console.error('[Feed] createPost exception:', err);
    return null;
  }
}

export async function getTeacherPosts(
  teacherId: string,
  currentUserId?: string,
): Promise<TeacherPost[]> {
  try {
    const { data, error } = await supabase
      .from('teacher_posts')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    // Fetch teacher info for display
    const { data: teacher } = await supabase
      .from('teacher_profiles')
      .select('full_name, profile_image_url')
      .eq('id', teacherId)
      .single();

    // Enrich posts with like status for current user
    const posts: TeacherPost[] = [];
    for (const p of data) {
      let userHasLiked = false;
      if (currentUserId) {
        const { data: likeData } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', p.id)
          .eq('user_id', currentUserId)
          .maybeSingle();
        userHasLiked = !!likeData;
      }
      posts.push({
        ...p,
        teacher_name: teacher?.full_name || 'Teacher',
        teacher_image: teacher?.profile_image_url || undefined,
        user_has_liked: userHasLiked,
      } as TeacherPost);
    }

    return posts;
  } catch (err) {
    console.error('[Feed] getTeacherPosts exception:', err);
    return [];
  }
}

/**
 * Fetch all teachers' posts globally, paginated, ordered by newest first.
 * Joins teacher name & image for each post.
 */
export async function getAllPosts(
  page: number = 1,
  limit: number = 10,
  currentUserId?: string,
): Promise<TeacherPost[]> {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('teacher_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error || !data || data.length === 0) return [];

    // Collect unique teacher IDs
    const teacherIds = [...new Set(data.map((p: any) => p.teacher_id))];

    // Batch fetch teacher info
    const { data: teacherProfiles } = await supabase
      .from('teacher_profiles')
      .select('id, full_name, profile_image_url')
      .in('id', teacherIds);

    const teacherMap = new Map<string, { name: string; image?: string }>();
    if (teacherProfiles) {
      for (const tp of teacherProfiles) {
        teacherMap.set(tp.id, {
          name: tp.full_name || 'Teacher',
          image: tp.profile_image_url || undefined,
        });
      }
    }

    // Enrich posts
    const posts: TeacherPost[] = [];
    for (const p of data) {
      let userHasLiked = false;
      if (currentUserId) {
        const { data: likeData } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', p.id)
          .eq('user_id', currentUserId)
          .maybeSingle();
        userHasLiked = !!likeData;
      }
      const info = teacherMap.get(p.teacher_id);
      posts.push({
        ...p,
        teacher_name: info?.name || 'Teacher',
        teacher_image: info?.image || undefined,
        user_has_liked: userHasLiked,
      } as TeacherPost);
    }

    return posts;
  } catch (err) {
    console.error('[Feed] getAllPosts exception:', err);
    return [];
  }
}

export async function deletePost(postId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('teacher_posts')
      .delete()
      .eq('id', postId);
    return !error;
  } catch {
    return false;
  }
}

export async function toggleLike(
  postId: string,
  userId: string,
): Promise<{ liked: boolean; newCount: number }> {
  try {
    // Check if already liked
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      // Unlike – remove like and decrement
      await supabase.from('post_likes').delete().eq('id', existing.id);
      // Decrement likes_count
      const { data: post } = await supabase
        .from('teacher_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();
      const newCount = Math.max(0, (post?.likes_count || 1) - 1);
      await supabase.from('teacher_posts').update({ likes_count: newCount }).eq('id', postId);
      return { liked: false, newCount };
    } else {
      // Like – insert and increment
      await supabase.from('post_likes').insert({
        id: uuid(),
        post_id: postId,
        user_id: userId,
        created_at: new Date().toISOString(),
      });
      const { data: post } = await supabase
        .from('teacher_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();
      const newCount = (post?.likes_count || 0) + 1;
      await supabase.from('teacher_posts').update({ likes_count: newCount }).eq('id', postId);
      return { liked: true, newCount };
    }
  } catch (err) {
    console.error('[Feed] toggleLike exception:', err);
    return { liked: false, newCount: 0 };
  }
}

// ─── Post Comments ────────────────────────────────────────────────────────────

export async function getPostComments(postId: string): Promise<PostComment[]> {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    return error ? [] : (data as PostComment[]);
  } catch {
    return [];
  }
}

export async function addComment(
  postId: string,
  userId: string,
  userName: string,
  content: string,
  parentId?: string | null,
): Promise<PostComment | null> {
  try {
    const row: Record<string, unknown> = {
      id: uuid(),
      post_id: postId,
      user_id: userId,
      user_name: userName,
      content,
      created_at: new Date().toISOString(),
    };
    if (parentId) row.parent_id = parentId;
    const { error } = await supabase.from('post_comments').insert(row);
    if (error) {
      console.error('[Feed] addComment error:', error.message);
      return null;
    }
    // Increment comments_count on the post
    const { data: post } = await supabase
      .from('teacher_posts')
      .select('comments_count')
      .eq('id', postId)
      .single();
    const newCount = (post?.comments_count || 0) + 1;
    await supabase.from('teacher_posts').update({ comments_count: newCount }).eq('id', postId);

    return row as PostComment;
  } catch (err) {
    console.error('[Feed] addComment exception:', err);
    return null;
  }
}

export async function deleteComment(commentId: string, postId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId);
    if (error) return false;

    // Decrement comments_count on the post
    const { data: post } = await supabase
      .from('teacher_posts')
      .select('comments_count')
      .eq('id', postId)
      .single();
    const newCount = Math.max(0, (post?.comments_count || 1) - 1);
    await supabase.from('teacher_posts').update({ comments_count: newCount }).eq('id', postId);

    return true;
  } catch {
    return false;
  }
}

// ─── Teacher Dashboard Analytics API ──────────────────────────────────────────

/**
 * Get or compute aggregated dashboard stats for a teacher.
 * If no cached stats exist, computes from lesson_bookings and inserts a row.
 */
export async function getTeacherDashboardStats(teacherId: string): Promise<TeacherDashboardStats | null> {
  try {
    // Try to get existing stats
    const { data: existing } = await supabase
      .from('teacher_dashboard_stats')
      .select('*')
      .eq('teacher_id', teacherId)
      .single();

    // Get all bookings for this teacher to compute/refresh stats
    const { data: allBookings } = await supabase
      .from('lesson_bookings')
      .select('*')
      .eq('teacher_id', teacherId);

    const bookings = (allBookings || []) as LessonBooking[];
    const completed = bookings.filter(b => b.status === 'completed');
    const confirmed = bookings.filter(b => b.status === 'confirmed');
    const uniqueStudents = new Set(bookings.map(b => b.student_id));

    // Calculate hours (assuming 1-hour default per lesson if no time calc possible)
    const totalHours = completed.reduce((sum, b) => {
      const start = b.start_time?.split(':').map(Number) || [0, 0];
      const end = b.end_time?.split(':').map(Number) || [1, 0];
      const hours = (end[0] - start[0]) + (end[1] - start[1]) / 60;
      return sum + Math.max(hours, 0.5);
    }, 0);

    const completionRate = bookings.length > 0
      ? (completed.length / (completed.length + confirmed.length || 1)) * 100
      : 0;

    const avgDuration = completed.length > 0 ? (totalHours * 60) / completed.length : 0;

    // This month stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const thisMonthCompleted = completed.filter(b => b.date >= monthStart);
    const thisMonthHours = thisMonthCompleted.reduce((sum, b) => {
      const start = b.start_time?.split(':').map(Number) || [0, 0];
      const end = b.end_time?.split(':').map(Number) || [1, 0];
      const hours = (end[0] - start[0]) + (end[1] - start[1]) / 60;
      return sum + Math.max(hours, 0.5);
    }, 0);

    const stats: Omit<TeacherDashboardStats, 'id'> = {
      teacher_id: teacherId,
      total_lessons_completed: completed.length,
      total_hours_taught: Math.round(totalHours * 100) / 100,
      total_students: uniqueStudents.size,
      completion_rate: Math.round(completionRate * 10) / 10,
      avg_session_duration_min: Math.round(avgDuration * 10) / 10,
      this_month_lessons: thisMonthCompleted.length,
      this_month_hours: Math.round(thisMonthHours * 100) / 100,
      last_updated: new Date().toISOString(),
    };

    if (existing) {
      // Update existing stats
      await supabase
        .from('teacher_dashboard_stats')
        .update(stats)
        .eq('teacher_id', teacherId);
      return { ...existing, ...stats } as TeacherDashboardStats;
    } else {
      // Insert new stats
      const newRow = { id: uuid(), ...stats };
      await supabase.from('teacher_dashboard_stats').insert(newRow);
      return newRow as TeacherDashboardStats;
    }
  } catch (err) {
    console.error('[Dashboard] getTeacherDashboardStats error:', err);
    return null;
  }
}

/**
 * Get lesson history with attendance for a teacher.
 */
export async function getLessonHistory(
  teacherId: string,
  limit: number = 20,
): Promise<(LessonBooking & { attendance?: LessonAttendance })[]> {
  try {
    const { data: bookingsData, error } = await supabase
      .from('lesson_bookings')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error || !bookingsData) return [];

    // Fetch attendance records for these bookings
    const bookingIds = bookingsData.map((b: LessonBooking) => b.id);
    const { data: attendanceData } = await supabase
      .from('lesson_attendance')
      .select('*')
      .in('booking_id', bookingIds);

    const attendanceMap = new Map<string, LessonAttendance>();
    if (attendanceData) {
      for (const a of attendanceData) {
        attendanceMap.set(a.booking_id, a as LessonAttendance);
      }
    }

    return bookingsData.map((b: LessonBooking) => ({
      ...b,
      attendance: attendanceMap.get(b.id),
    }));
  } catch (err) {
    console.error('[Dashboard] getLessonHistory error:', err);
    return [];
  }
}

/**
 * Record attendance for a lesson.
 */
export async function recordLessonAttendance(
  bookingId: string,
  data: {
    teacher_id: string;
    student_id: string;
    student_name?: string;
    subject: string;
    date: string;
    status: 'attended' | 'missed' | 'late';
    duration_minutes: number;
    teacher_notes?: string;
  },
): Promise<LessonAttendance | null> {
  try {
    const row = {
      id: uuid(),
      booking_id: bookingId,
      ...data,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('lesson_attendance').insert(row);
    if (error) {
      console.error('[Dashboard] recordLessonAttendance error:', error.message);
      return null;
    }
    return row as LessonAttendance;
  } catch (err) {
    console.error('[Dashboard] recordLessonAttendance exception:', err);
    return null;
  }
}

/**
 * Get a unified feedback feed combining reviews and post comments for a teacher.
 */
export async function getStudentFeedbackFeed(
  teacherId: string,
  limit: number = 20,
): Promise<FeedbackItem[]> {
  try {
    // Fetch reviews
    const { data: reviews } = await supabase
      .from('teacher_reviews')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Fetch post comments via teacher's posts
    const { data: posts } = await supabase
      .from('teacher_posts')
      .select('id, content')
      .eq('teacher_id', teacherId);

    const postIds = (posts || []).map((p: { id: string }) => p.id);
    let comments: PostComment[] = [];
    if (postIds.length > 0) {
      const { data: commentsData } = await supabase
        .from('post_comments')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: false })
        .limit(limit);
      comments = (commentsData || []) as PostComment[];
    }

    // Convert to unified feed items
    const feedItems: FeedbackItem[] = [];

    for (const r of (reviews || []) as TeacherReview[]) {
      feedItems.push({
        id: r.id,
        type: 'review',
        studentName: r.student_name || 'Student',
        content: r.comment,
        rating: r.rating,
        timestamp: r.created_at,
      });
    }

    for (const c of comments) {
      const post = posts?.find((p: { id: string; content: string }) => p.id === c.post_id);
      feedItems.push({
        id: c.id,
        type: 'comment',
        studentName: c.user_name || 'Student',
        content: c.content,
        timestamp: c.created_at,
        postTitle: post?.content?.slice(0, 50) || 'Post',
      });
    }

    // Sort by timestamp descending
    feedItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return feedItems.slice(0, limit);
  } catch (err) {
    console.error('[Dashboard] getStudentFeedbackFeed error:', err);
    return [];
  }
}

/**
 * Get weekly lesson data for charts (past 4 weeks).
 */
export async function getWeeklyLessonData(teacherId: string): Promise<{ weekly: WeeklyLessonData[]; engagement: EngagementData[]; subjects: SubjectDistribution[] }> {
  try {
    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    const startDate = fourWeeksAgo.toISOString().split('T')[0];

    const { data: bookings } = await supabase
      .from('lesson_bookings')
      .select('*')
      .eq('teacher_id', teacherId)
      .gte('date', startDate)
      .order('date', { ascending: true });

    const bks = (bookings || []) as LessonBooking[];

    // Weekly lesson data (per day for current week)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekly: WeeklyLessonData[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const count = bks.filter(b => b.date === dateStr && (b.status === 'completed' || b.status === 'confirmed')).length;
      weekly.push({ day: dayNames[d.getDay()], date: dateStr, lessons: count });
    }

    // Engagement data (per week for past 4 weeks)
    const engagement: EngagementData[] = [];
    for (let w = 0; w < 4; w++) {
      const wStart = new Date(now.getTime() - (3 - w) * 7 * 24 * 60 * 60 * 1000);
      const wEnd = new Date(wStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const wStartStr = wStart.toISOString().split('T')[0];
      const wEndStr = wEnd.toISOString().split('T')[0];
      const weekBookings = bks.filter(b => b.date >= wStartStr && b.date < wEndStr);
      engagement.push({
        week: `Week ${w + 1}`,
        bookings: weekBookings.length,
        completed: weekBookings.filter(b => b.status === 'completed').length,
      });
    }

    // Subject distribution
    const subjectCounts = new Map<string, number>();
    for (const b of bks) {
      subjectCounts.set(b.subject, (subjectCounts.get(b.subject) || 0) + 1);
    }
    const totalSubjectLessons = bks.length || 1;
    const subjects: SubjectDistribution[] = Array.from(subjectCounts.entries()).map(([subject, count]) => ({
      subject,
      count,
      percentage: Math.round((count / totalSubjectLessons) * 100),
    }));

    return { weekly, engagement, subjects };
  } catch (err) {
    console.error('[Dashboard] getWeeklyLessonData error:', err);
    return { weekly: [], engagement: [], subjects: [] };
  }
}

/**
 * Get monthly average rating trend (last 6 months).
 */
export async function getMonthlyRatingTrend(teacherId: string): Promise<MonthlyRatingData[]> {
  try {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startDate = sixMonthsAgo.toISOString();

    const { data: reviews } = await supabase
      .from('teacher_reviews')
      .select('*')
      .eq('teacher_id', teacherId)
      .gte('created_at', startDate)
      .order('created_at', { ascending: true });

    const revs = (reviews || []) as TeacherReview[];
    const result: MonthlyRatingData[] = [];

    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      const monthStr = monthDate.toISOString().split('T')[0];
      const monthEndStr = monthEnd.toISOString().split('T')[0];

      const monthReviews = revs.filter(r => {
        const d = r.created_at.split('T')[0];
        return d >= monthStr && d <= monthEndStr;
      });

      const avgRating = monthReviews.length > 0
        ? monthReviews.reduce((sum, r) => sum + r.rating, 0) / monthReviews.length
        : 0;

      result.push({
        month: monthNames[monthDate.getMonth()],
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: monthReviews.length,
      });
    }

    return result;
  } catch (err) {
    console.error('[Dashboard] getMonthlyRatingTrend error:', err);
    return [];
  }
}

/**
 * Get recent activity timeline for the teacher dashboard.
 */
export async function getTeacherActivityTimeline(teacherId: string, limit: number = 15): Promise<ActivityItem[]> {
  try {
    const items: ActivityItem[] = [];

    // Fetch recent bookings
    const { data: recentBookings } = await supabase
      .from('lesson_bookings')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })
      .limit(limit);

    for (const b of (recentBookings || []) as LessonBooking[]) {
      if (b.status === 'completed') {
        items.push({
          id: `lesson-${b.id}`,
          type: 'lesson_completed',
          title: 'Lesson Completed',
          description: `${b.subject} lesson on ${b.date}`,
          timestamp: b.created_at,
        });
      } else if (b.status === 'pending' || b.status === 'confirmed') {
        items.push({
          id: `booking-${b.id}`,
          type: 'booking',
          title: b.status === 'confirmed' ? 'Booking Confirmed' : 'New Booking Request',
          description: `${b.subject} on ${b.date} at ${b.start_time}`,
          timestamp: b.created_at,
        });
      }
    }

    // Fetch recent reviews
    const { data: recentReviews } = await supabase
      .from('teacher_reviews')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })
      .limit(5);

    for (const r of (recentReviews || []) as TeacherReview[]) {
      items.push({
        id: `review-${r.id}`,
        type: 'review',
        title: 'New Review',
        description: `${r.student_name || 'A student'} gave you ${r.rating} stars`,
        timestamp: r.created_at,
        metadata: { rating: r.rating },
      });
    }

    // Fetch recent post comments
    const { data: posts } = await supabase
      .from('teacher_posts')
      .select('id, content')
      .eq('teacher_id', teacherId);

    if (posts && posts.length > 0) {
      const postIds = posts.map((p: { id: string }) => p.id);
      const { data: recentComments } = await supabase
        .from('post_comments')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: false })
        .limit(5);

      for (const c of (recentComments || []) as PostComment[]) {
        items.push({
          id: `comment-${c.id}`,
          type: 'comment',
          title: 'New Comment',
          description: `${c.user_name} commented on your post`,
          timestamp: c.created_at,
        });
      }
    }

    // Sort by timestamp descending
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return items.slice(0, limit);
  } catch (err) {
    console.error('[Dashboard] getTeacherActivityTimeline error:', err);
    return [];
  }
}
