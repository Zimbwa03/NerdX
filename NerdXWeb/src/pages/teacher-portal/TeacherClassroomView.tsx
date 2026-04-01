import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeacherAuth } from '../../context/TeacherAuthContext';
import {
  teacherPortalApi,
  type ClassroomInfo,
  type ClassroomPost,
  type Assessment,
} from '../../services/api/teacherPortalApi';
import {
  ArrowLeft, Users, BookOpen, FileText, Plus, Bell, Clock, CheckCircle,
  Loader2, ChevronRight, GraduationCap, BarChart3, Send, Megaphone,
  ClipboardList, PenTool,
} from 'lucide-react';

type TabId = 'feed' | 'students' | 'assessments' | 'analytics';

const POST_TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  announcement: { icon: Megaphone, color: '#3b82f6', label: 'Announcement' },
  homework: { icon: ClipboardList, color: '#f59e0b', label: 'Homework' },
  assignment: { icon: FileText, color: '#10B981', label: 'Assignment' },
  test: { icon: PenTool, color: '#ef4444', label: 'Test' },
  material: { icon: BookOpen, color: '#22c55e', label: 'Material' },
  resource: { icon: BookOpen, color: '#06b6d4', label: 'Resource' },
};

export function TeacherClassroomView() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { token, school } = useTeacherAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabId>('feed');
  const [classroom, setClassroom] = useState<ClassroomInfo | null>(null);
  const [posts, setPosts] = useState<ClassroomPost[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [students, setStudents] = useState<{ id: number; first_name: string; last_name: string; student_code: string; photo_url: string | null; status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostType, setNewPostType] = useState('announcement');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostDue, setNewPostDue] = useState('');
  const [posting, setPosting] = useState(false);

  const crId = Number(classroomId);

  const loadClassroom = useCallback(async () => {
    if (!token || !crId) return;
    setLoading(true);
    const [crData, postsData, assessData] = await Promise.all([
      teacherPortalApi.getClassroom(token, crId),
      teacherPortalApi.getClassroomPosts(token, crId),
      teacherPortalApi.listAssessments(token, crId),
    ]);
    if (crData) setClassroom(crData);
    setPosts(postsData);
    setAssessments(assessData);
    setLoading(false);
  }, [token, crId]);

  useEffect(() => { loadClassroom(); }, [loadClassroom]);

  const loadStudents = useCallback(async () => {
    if (!token || !classroom?.class) return;
    const { students: s } = await (await import('../../services/api/schoolEcosystemApi')).schoolEcosystemApi.listClassStudents(token, classroom.class.id);
    setStudents(s as typeof students);
  }, [token, classroom]);

  useEffect(() => {
    if (activeTab === 'students' && students.length === 0 && classroom?.class) {
      loadStudents();
    }
  }, [activeTab, students.length, classroom, loadStudents]);

  const handleCreatePost = async () => {
    if (!token || !newPostTitle.trim()) return;
    setPosting(true);
    await teacherPortalApi.createPost(token, crId, {
      post_type: newPostType,
      title: newPostTitle.trim(),
      content: newPostContent.trim() || null,
      due_date: newPostDue || null,
    });
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostDue('');
    setShowNewPost(false);
    setPosting(false);
    const updated = await teacherPortalApi.getClassroomPosts(token, crId);
    setPosts(updated);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'grid', placeItems: 'center' }}>
        <Loader2 size={32} color="#22c55e" className="animate-spin" />
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: typeof Bell }[] = [
    { id: 'feed', label: 'Feed', icon: Megaphone },
    { id: 'students', label: `Students (${classroom?.student_count || 0})`, icon: Users },
    { id: 'assessments', label: 'Assessments', icon: ClipboardList },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px' }}>
        <button onClick={() => navigate(`/school/${school?.school_id}/teacher/dashboard`)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 12, padding: 0 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {classroom?.teacher?.photo_url ? (
              <img src={classroom.teacher.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <GraduationCap size={26} color="#fff" />
            )}
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>
              {classroom?.classroom?.name || 'Classroom'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>
              {classroom?.class?.display_name} · {classroom?.subject?.name} · {classroom?.student_count} students
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none', border: 'none', padding: '14px 16px', cursor: 'pointer',
              color: activeTab === tab.id ? '#22c55e' : 'rgba(255,255,255,0.5)',
              borderBottom: activeTab === tab.id ? '2px solid #22c55e' : '2px solid transparent',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
            }}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>Classroom Feed</h2>
              <button onClick={() => setShowNewPost(!showNewPost)} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: 10, padding: '10px 18px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={16} /> New Post
              </button>
            </div>

            {showNewPost && (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  {Object.entries(POST_TYPE_CONFIG).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => setNewPostType(type)}
                      style={{
                        background: newPostType === type ? `${config.color}25` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${newPostType === type ? config.color : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 8, padding: '6px 14px', color: newPostType === type ? config.color : 'rgba(255,255,255,0.6)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <config.icon size={12} /> {config.label}
                    </button>
                  ))}
                </div>
                <input
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Post title..."
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 14, marginBottom: 12, outline: 'none', boxSizing: 'border-box' }}
                />
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Content (optional)..."
                  rows={4}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 14, marginBottom: 12, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
                {(newPostType === 'homework' || newPostType === 'assignment' || newPostType === 'test') && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Due Date</label>
                    <input
                      type="datetime-local"
                      value={newPostDue}
                      onChange={(e) => setNewPostDue(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 13, outline: 'none' }}
                    />
                  </div>
                )}
                <button onClick={handleCreatePost} disabled={posting || !newPostTitle.trim()} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: 10, padding: '10px 20px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: posting || !newPostTitle.trim() ? 0.5 : 1 }}>
                  <Send size={14} /> {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            )}

            {posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                No posts yet. Create your first announcement or homework.
              </div>
            ) : (
              posts.map((post) => {
                const config = POST_TYPE_CONFIG[post.post_type] || POST_TYPE_CONFIG.announcement;
                const Icon = config.icon;
                return (
                  <div key={post.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18, marginBottom: 12, borderLeft: `3px solid ${config.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Icon size={14} color={config.color} />
                      <span style={{ color: config.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{config.label}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginLeft: 'auto' }}>
                        {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>{post.title}</h3>
                    {post.content && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{post.content}</p>}
                    {post.due_date && (
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontSize: 12 }}>
                        <Clock size={12} /> Due: {new Date(post.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Student Roster</h2>
            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>
                <Loader2 size={24} className="animate-spin" style={{ marginBottom: 8 }} />
                <p>Loading students...</p>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                {students.map((st, i) => (
                  <div
                    key={st.id}
                    onClick={() => navigate(`/school/${school?.school_id}/teacher/classroom/${crId}/student/${st.id}`)}
                    style={{
                      padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                      borderBottom: i < students.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {st.photo_url ? (
                        <img src={st.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Users size={16} color="rgba(255,255,255,0.5)" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{st.first_name} {st.last_name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{st.student_code}</div>
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: st.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: st.status === 'active' ? '#22c55e' : '#ef4444' }}>
                      {st.status}
                    </span>
                    <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>Assessments</h2>
              <button style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: 10, padding: '10px 18px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={16} /> Create Assessment
              </button>
            </div>

            {assessments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No assessments yet.</div>
            ) : (
              assessments.map((a) => (
                <div key={a.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18, marginBottom: 12, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>{a.title}</h3>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{a.type}</span>
                        {a.total_marks && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{a.total_marks} marks</span>}
                        {a.time_limit_mins && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{a.time_limit_mins} min</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {a.is_released ? (
                        <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle size={12} /> Released
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>Draft</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <BarChart3 size={40} color="rgba(255,255,255,0.3)" style={{ marginBottom: 12 }} />
            <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Class Analytics</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Analytics will appear once students complete assessments.</p>
          </div>
        )}
      </div>
    </div>
  );
}
