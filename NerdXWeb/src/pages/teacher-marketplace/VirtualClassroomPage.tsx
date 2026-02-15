import { useState, useEffect, useRef, useCallback, Component, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Tldraw } from 'tldraw';
import { useSyncDemo } from '@tldraw/sync';
import 'tldraw/tldraw.css';
import {
  getBookingById,
  getTeacherProfile,
  getTeacherProfileByUserId,
  completeLesson,
} from '../../services/api/teacherMarketplaceApi';
import { supabase } from '../../services/supabase';
import type { LessonBooking, TeacherProfile } from '../../types';
import {
  ArrowLeft, BookOpen, Clock, User, Loader2,
  Video, PenTool, Minimize2, PhoneOff, AlertTriangle, WifiOff
} from 'lucide-react';

// ─── Error Boundary ────────────────────────────────────────────────────────────
// Catches runtime errors in Jitsi or tldraw so the whole page doesn't crash

interface ErrorBoundaryProps {
  fallbackLabel: string;
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  errorMsg: string;
}

class PanelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message || 'Unknown error' };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="vc-panel-error">
          <AlertTriangle size={28} />
          <p>{this.props.fallbackLabel} failed to load</p>
          <span className="vc-panel-error__detail">{this.state.errorMsg}</span>
          <button
            className="to-btn to-btn--outline to-btn--sm"
            onClick={() => this.setState({ hasError: false, errorMsg: '' })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Synced Whiteboard Wrapper ─────────────────────────────────────────────────
// Uses tldraw's demo sync server for real-time collaboration.
// Both teacher and student see the same canvas in real-time.

function SyncedWhiteboard({ roomId }: { roomId: string }) {
  const store = useSyncDemo({ roomId: `nerdx-classroom-${roomId}` });
  return <Tldraw store={store} />;
}

// ─── View Mode ─────────────────────────────────────────────────────────────────

type ViewMode = 'split' | 'whiteboard' | 'video';

// ─── Main Component ────────────────────────────────────────────────────────────

export function VirtualClassroomPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<LessonBooking | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [elapsed, setElapsed] = useState(0);
  const [lessonActive, setLessonActive] = useState(true);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Network status ──────────────────────────────────────────────────────────
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // ─── Warn before closing tab during active lesson ────────────────────────────
  useEffect(() => {
    if (!lessonActive || !booking) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [lessonActive, booking]);

  // ─── Load booking data ───────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      if (!bookingId) {
        setError('No booking ID provided.');
        setLoading(false);
        return;
      }

      try {
        const bk = await getBookingById(bookingId);
        if (!bk) {
          setError('Booking not found. It may have been deleted.');
          setLoading(false);
          return;
        }

        // Allow both confirmed and completed (for rejoining if page was refreshed)
        if (bk.status !== 'confirmed' && bk.status !== 'completed') {
          const statusMessages: Record<string, string> = {
            pending: 'This lesson has not been confirmed by the teacher yet. Please wait for confirmation.',
            cancelled: 'This lesson has been cancelled.',
          };
          setError(statusMessages[bk.status] || 'This lesson is not available.');
          setLoading(false);
          return;
        }

        if (!bk.room_id) {
          setError('No classroom room has been assigned to this booking. Please contact support.');
          setLoading(false);
          return;
        }

        // Fetch teacher profile for display and access validation
        const tp = await getTeacherProfile(bk.teacher_id);
        if (tp) setTeacher(tp);

        // Validate: user must be either the student or the teacher
        if (user) {
          const isStudent = bk.student_id === user.id || bk.student_id === user.email;

          // Resolve Supabase Auth UUID (user.id may be email, tp.user_id is Supabase UUID)
          let supabaseUid: string | null = null;
          try {
            const { data: authData } = await supabase.auth.getUser();
            supabaseUid = authData?.user?.id || null;
          } catch {
            // Supabase session may not be ready
          }

          // Broad teacher match: check user_id (with both app ID and Supabase UUID), email, and teacher_profile_id
          let isTeacherUser = false;
          if (tp) {
            isTeacherUser =
              tp.user_id === user.id ||
              (!!supabaseUid && tp.user_id === supabaseUid) ||
              (!!tp.email && !!user.email && tp.email.toLowerCase() === user.email.toLowerCase()) ||
              (user.teacher_profile_id != null && tp.id === user.teacher_profile_id);
          }

          // Fallback: if teacher profile fetch failed or match failed, check if user owns a profile matching this booking's teacher
          if (!isTeacherUser && (user.role === 'teacher' || user.is_teacher)) {
            try {
              const ownProfile = await getTeacherProfileByUserId(user.id);
              if (ownProfile && ownProfile.id === bk.teacher_id) {
                isTeacherUser = true;
                if (!tp) setTeacher(ownProfile);
              }
            } catch {
              // Best-effort fallback
            }
          }

          if (!isStudent && !isTeacherUser) {
            setError('You do not have access to this classroom.');
            setLoading(false);
            return;
          }
        }

        setBooking(bk);
        setLoading(false);
      } catch (err) {
        console.error('[Classroom] Load error:', err);
        setError('Failed to load classroom. Please check your connection and try again.');
        setLoading(false);
      }
    }
    load();
  }, [bookingId, user]);

  // ─── Lesson timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!booking || !lessonActive) return;
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [booking, lessonActive]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ─── End lesson ──────────────────────────────────────────────────────────────
  const handleEndLesson = useCallback(async () => {
    if (!booking) return;
    setLessonActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      await completeLesson(booking.id);
    } catch {
      // Best-effort -- lesson still navigates away
    }
    navigate('/app');
  }, [booking, navigate]);

  const handleLeaveClick = () => {
    if (elapsed > 30) {
      // Only show confirm if lesson has been active for more than 30 seconds
      setShowLeaveConfirm(true);
    } else {
      navigate('/app');
    }
  };

  // ─── Derived state ──────────────────────────────────────────────────────────
  // teacher.user_id may be a Supabase Auth UUID or an app-level ID, so check broadly
  const isTeacher = user && teacher && (
    teacher.user_id === user.id ||
    (!!teacher.email && !!user.email && teacher.email.toLowerCase() === user.email.toLowerCase()) ||
    (user.teacher_profile_id != null && teacher.id === user.teacher_profile_id) ||
    (user.role === 'teacher' || user.is_teacher)
  );

  // ─── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="vc-loading">
        <Loader2 size={40} className="spin" />
        <span>Setting up your classroom...</span>
        <span className="vc-loading__sub">Preparing video and whiteboard</span>
      </div>
    );
  }

  // ─── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="vc-error">
        <div className="vc-error__card">
          <AlertTriangle size={40} className="vc-error__icon" />
          <h2>Cannot Join Classroom</h2>
          <p>{error}</p>
          <button type="button" className="to-btn to-btn--primary" onClick={() => navigate('/app')}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!booking || !booking.room_id) return null;

  const displayName = user
    ? `${user.name} ${user.surname || ''}`.trim()
    : 'Participant';

  // Secure room name: prefix with nerdx to avoid collisions on public Jitsi
  const jitsiRoomName = `NerdX_${booking.room_id}`;

  return (
    <div className={`virtual-classroom virtual-classroom--${viewMode}`}>
      {/* Offline banner */}
      {!isOnline && (
        <div className="vc-offline-banner">
          <WifiOff size={16} />
          <span>You appear to be offline. Video and whiteboard require an internet connection.</span>
        </div>
      )}

      {/* Leave confirmation modal */}
      {showLeaveConfirm && (
        <div className="vc-modal-overlay" onClick={() => setShowLeaveConfirm(false)}>
          <div className="vc-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Leave Classroom?</h3>
            <p>Are you sure you want to end this lesson? The whiteboard content will be lost.</p>
            <div className="vc-modal__actions">
              <button
                type="button"
                className="vc-end-btn"
                onClick={handleEndLesson}
              >
                <PhoneOff size={14} /> End Lesson
              </button>
              <button
                type="button"
                className="to-btn to-btn--outline"
                onClick={() => setShowLeaveConfirm(false)}
              >
                Continue Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="vc-topbar">
        <div className="vc-topbar__left">
          <button
            type="button"
            className="vc-topbar__back"
            onClick={handleLeaveClick}
            title="Leave classroom"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="vc-topbar__info">
            <span className="vc-topbar__subject">
              <BookOpen size={14} />
              {booking.subject}
            </span>
            <span className="vc-topbar__with">
              <User size={12} />
              {isTeacher
                ? 'Teaching a student'
                : `with ${teacher?.full_name || 'Teacher'} ${teacher?.surname || ''}`
              }
            </span>
          </div>
        </div>

        <div className="vc-topbar__center">
          <span className={`vc-topbar__timer${elapsed >= 3600 ? ' vc-topbar__timer--long' : ''}`}>
            <Clock size={14} />
            {formatTime(elapsed)}
          </span>
          <span className="vc-topbar__live">LIVE</span>
        </div>

        <div className="vc-topbar__right">
          {/* View mode toggles */}
          <div className="vc-view-toggles">
            <button
              type="button"
              className={`vc-view-btn${viewMode === 'split' ? ' vc-view-btn--active' : ''}`}
              onClick={() => setViewMode('split')}
              title="Split view"
            >
              <Minimize2 size={15} />
            </button>
            <button
              type="button"
              className={`vc-view-btn${viewMode === 'video' ? ' vc-view-btn--active' : ''}`}
              onClick={() => setViewMode('video')}
              title="Video fullscreen"
            >
              <Video size={15} />
            </button>
            <button
              type="button"
              className={`vc-view-btn${viewMode === 'whiteboard' ? ' vc-view-btn--active' : ''}`}
              onClick={() => setViewMode('whiteboard')}
              title="Whiteboard fullscreen"
            >
              <PenTool size={15} />
            </button>
          </div>

          <button
            type="button"
            className="vc-end-btn"
            onClick={() => setShowLeaveConfirm(true)}
          >
            <PhoneOff size={16} />
            <span>End Lesson</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="vc-main">
        {/* Video panel */}
        {viewMode !== 'whiteboard' && (
          <div className="vc-video-panel">
            <PanelErrorBoundary fallbackLabel="Video call">
              <JitsiMeeting
                domain="meet.jit.si"
                roomName={jitsiRoomName}
                configOverwrite={{
                  startWithAudioMuted: true,
                  startWithVideoMuted: false,
                  prejoinPageEnabled: false,
                  disableModeratorIndicator: true,
                  enableEmailInStats: false,
                  toolbarButtons: [
                    'microphone',
                    'camera',
                    'desktop',
                    'chat',
                    'raisehand',
                    'tileview',
                    'fullscreen',
                    'settings',
                  ],
                  disableDeepLinking: true,
                  hideConferenceSubject: true,
                  hideConferenceTimer: true,
                  enableNoisyMicDetection: true,
                  enableClosePage: false,
                  disableInviteFunctions: true,
                  requireDisplayName: false,
                  resolution: 720,
                  constraints: {
                    video: { height: { ideal: 720, max: 720, min: 180 } },
                  },
                  p2p: { enabled: true },
                }}
                interfaceConfigOverwrite={{
                  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                  SHOW_JITSI_WATERMARK: false,
                  SHOW_WATERMARK_FOR_GUESTS: false,
                  SHOW_BRAND_WATERMARK: false,
                  DEFAULT_BACKGROUND: '#0d0d1a',
                  TOOLBAR_ALWAYS_VISIBLE: false,
                  MOBILE_APP_PROMO: false,
                  HIDE_INVITE_MORE_HEADER: true,
                  DISABLE_FOCUS_INDICATOR: true,
                }}
                userInfo={{
                  displayName: displayName,
                  email: user?.email || '',
                }}
                onReadyToClose={handleEndLesson}
                getIFrameRef={(iframeRef) => {
                  iframeRef.style.height = '100%';
                  iframeRef.style.width = '100%';
                  iframeRef.style.border = 'none';
                  iframeRef.style.borderRadius = '12px';
                }}
              />
            </PanelErrorBoundary>
          </div>
        )}

        {/* Whiteboard panel -- real-time synced */}
        {viewMode !== 'video' && (
          <div className="vc-whiteboard-panel">
            <div className="vc-whiteboard-container">
              <PanelErrorBoundary fallbackLabel="Whiteboard">
                <SyncedWhiteboard roomId={booking.room_id} />
              </PanelErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
