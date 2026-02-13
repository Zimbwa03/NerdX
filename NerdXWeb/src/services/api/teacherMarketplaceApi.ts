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
} from '../../types';

// ─── Helper: generate a UUID (browser-safe) ──────────────────────────────────
function uuid(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
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
      user_id: userId,
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
      await supabase.from('teacher_subjects').insert(subjectRows);
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
      await supabase.from('teacher_qualifications').insert(qualRows);
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
    const { data, error } = await supabase
      .from('teacher_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;
    return getTeacherProfile(data.id);
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
): Promise<PostComment | null> {
  try {
    const row = {
      id: uuid(),
      post_id: postId,
      user_id: userId,
      user_name: userName,
      content,
      created_at: new Date().toISOString(),
    };
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
