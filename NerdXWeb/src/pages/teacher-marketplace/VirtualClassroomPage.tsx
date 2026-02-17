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
import { walletApi } from '../../services/api/walletApi';
import { supabase } from '../../services/supabase';
import type { LessonBooking, TeacherProfile } from '../../types';
import {
  ArrowLeft, BookOpen, Clock, User, Loader2,
  Video, PenTool, Minimize2, PhoneOff, AlertTriangle, WifiOff
} from 'lucide-react';

const LESSON_DURATION_SECONDS = 45 * 60;
const LESSON_WARNING_SECONDS = 40 * 60;
const TEACHER_NO_SHOW_GRACE_SECONDS = 10 * 60;

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
  const [lessonPaid, setLessonPaid] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [payingForLesson, setPayingForLesson] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showAutoEnd, setShowAutoEnd] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [noShowCancelled, setNoShowCancelled] = useState(false);
  const warningShownRef = useRef(false);
  const autoEndTriggeredRef = useRef(false);
  const participantCountRef = useRef(1);
  const noShowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noShowTriggeredRef = useRef(false);
  const jitsiApiRef = useRef<any>(null);
  const jitsiHandlersRef = useRef<{
    onVideoConferenceJoined?: () => void;
    onParticipantJoined?: () => void;
    onParticipantLeft?: () => void;
  } | null>(null);

  const clearNoShowTimer = useCallback(() => {
    if (noShowTimerRef.current) {
      clearTimeout(noShowTimerRef.current);
      noShowTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    participantCountRef.current = participantCount;
  }, [participantCount]);

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

  useEffect(() => {
    return () => {
      clearNoShowTimer();
      const api = jitsiApiRef.current;
      const handlers = jitsiHandlersRef.current;
      if (api && handlers) {
        if (handlers.onVideoConferenceJoined) api.removeListener?.('videoConferenceJoined', handlers.onVideoConferenceJoined);
        if (handlers.onParticipantJoined) api.removeListener?.('participantJoined', handlers.onParticipantJoined);
        if (handlers.onParticipantLeft) api.removeListener?.('participantLeft', handlers.onParticipantLeft);
      }
    };
  }, [clearNoShowTimer]);

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

  // ─── Pay for lesson when student joins ───────────────────────────────────────
  useEffect(() => {
    if (!booking || !user || lessonPaid || payingForLesson) return;

    // Only students pay, not teachers
    const isStudentUser = booking.student_id === user.id || booking.student_id === user.email;
    if (!isStudentUser) {
      setLessonPaid(true);
      return;
    }

    setPayingForLesson(true);
    walletApi.payForLesson(booking.id).then((result) => {
      if (result.success) {
        setLessonPaid(true);
      } else if (result.insufficient_funds) {
        setPaymentError(`Insufficient wallet balance. You need $0.50 but have $${(result.balance ?? 0).toFixed(2)}. Please top up your wallet.`);
      } else if (result.already_paid) {
        setLessonPaid(true);
      } else {
        setPaymentError(result.message || 'Payment failed. Please try again.');
      }
      setPayingForLesson(false);
    }).catch(() => {
      setPaymentError('Payment failed. Please check your connection.');
      setPayingForLesson(false);
    });
  }, [booking, user, lessonPaid, payingForLesson]);

  useEffect(() => {
    if (!booking || !user || !lessonPaid || !lessonActive || paymentError || noShowTriggeredRef.current) {
      clearNoShowTimer();
      return;
    }

    const isStudentUser = booking.student_id === user.id || booking.student_id === user.email;
    if (!isStudentUser) {
      clearNoShowTimer();
      return;
    }

    if (participantCount >= 2) {
      clearNoShowTimer();
      return;
    }

    const normalizedStartTime = booking.start_time?.split(':').length === 2
      ? `${booking.start_time}:00`
      : booking.start_time;
    const scheduledIso = `${booking.date}T${normalizedStartTime}`;
    const scheduledStart = new Date(scheduledIso);
    const now = new Date();
    const fallbackDeadline = now.getTime() + (TEACHER_NO_SHOW_GRACE_SECONDS * 1000);
    const deadline = Number.isNaN(scheduledStart.getTime())
      ? fallbackDeadline
      : (scheduledStart.getTime() + (TEACHER_NO_SHOW_GRACE_SECONDS * 1000));
    const delayMs = Math.max(0, deadline - now.getTime());

    noShowTimerRef.current = setTimeout(async () => {
      if (participantCountRef.current >= 2 || noShowTriggeredRef.current) return;
      noShowTriggeredRef.current = true;
      clearNoShowTimer();

      const cancelResult = await walletApi.cancelLesson(
        booking.id,
        'system',
        scheduledIso,
        booking.student_id,
      );

      setNoShowCancelled(true);
      if (cancelResult.success && cancelResult.refund?.success) {
        setPaymentError('Teacher did not join within 10 minutes. The lesson was cancelled and your wallet was refunded.');
      } else if (cancelResult.success) {
        setPaymentError('Teacher did not join within 10 minutes. The lesson was cancelled.');
      } else {
        setPaymentError('Teacher did not join within 10 minutes and auto-cancel could not be finalized. Please contact support.');
      }

      setLessonActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }, delayMs);

    return clearNoShowTimer;
  }, [booking, user, lessonPaid, lessonActive, paymentError, participantCount, clearNoShowTimer]);

  // ─── Lesson timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!booking || !lessonActive) return;
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        // 40-minute warning
        if (next >= LESSON_WARNING_SECONDS && !warningShownRef.current) {
          warningShownRef.current = true;
          setShowTimeWarning(true);
          setTimeout(() => setShowTimeWarning(false), 10000);
        }
        // 45-minute auto-end
        if (next >= LESSON_DURATION_SECONDS && !autoEndTriggeredRef.current) {
          autoEndTriggeredRef.current = true;
          setShowAutoEnd(true);
        }
        return next;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [booking, lessonActive]);

  // Auto-end lesson at 45 minutes
  useEffect(() => {
    if (showAutoEnd && booking) {
      const timer = setTimeout(() => {
        handleEndLesson();
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [showAutoEnd, booking]);

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

  // ─── Payment processing state ──────────────────────────────────────────────
  if (payingForLesson) {
    return (
      <div className="vc-loading">
        <Loader2 size={40} className="spin" />
        <span>Processing lesson payment...</span>
        <span className="vc-loading__sub">$0.50 will be deducted from your wallet</span>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="vc-error">
        <div className="vc-error__card">
          <AlertTriangle size={40} className="vc-error__icon" />
          <h2>{noShowCancelled ? 'Lesson Cancelled' : 'Payment Required'}</h2>
          <p>{paymentError}</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {!noShowCancelled && (
              <button type="button" className="to-btn to-btn--primary" onClick={() => navigate('/app/credits')}>
                Top Up Wallet
              </button>
            )}
            <button type="button" className="to-btn to-btn--outline" onClick={() => navigate('/app')}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>
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

      {/* 40-minute warning */}
      {showTimeWarning && (
        <div className="vc-offline-banner" style={{ background: 'rgba(245, 158, 11, 0.9)' }}>
          <Clock size={16} />
          <span>5 minutes remaining! Your lesson will auto-end at 45 minutes.</span>
          <button
            type="button"
            style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid white', color: 'white', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
            onClick={() => setShowTimeWarning(false)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Auto-end notification */}
      {showAutoEnd && (
        <div className="vc-offline-banner" style={{ background: 'rgba(239, 68, 68, 0.9)' }}>
          <Clock size={16} />
          <span>45-minute lesson completed! Ending in 15 seconds...</span>
          <button
            type="button"
            style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid white', color: 'white', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
            onClick={handleEndLesson}
          >
            End Now
          </button>
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
          <span className={`vc-topbar__timer${elapsed >= LESSON_WARNING_SECONDS ? ' vc-topbar__timer--long' : ''}`}>
            <Clock size={14} />
            {formatTime(elapsed)}
          </span>
          {elapsed < LESSON_DURATION_SECONDS && (
            <span style={{ fontSize: '11px', opacity: 0.6, marginLeft: '6px' }}>
              ({formatTime(LESSON_DURATION_SECONDS - elapsed)} left)
            </span>
          )}
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
                onApiReady={(externalApi: any) => {
                  const existingApi = jitsiApiRef.current;
                  const existingHandlers = jitsiHandlersRef.current;
                  if (existingApi && existingHandlers) {
                    if (existingHandlers.onVideoConferenceJoined) existingApi.removeListener?.('videoConferenceJoined', existingHandlers.onVideoConferenceJoined);
                    if (existingHandlers.onParticipantJoined) existingApi.removeListener?.('participantJoined', existingHandlers.onParticipantJoined);
                    if (existingHandlers.onParticipantLeft) existingApi.removeListener?.('participantLeft', existingHandlers.onParticipantLeft);
                  }

                  jitsiApiRef.current = externalApi;

                  const onVideoConferenceJoined = () => setParticipantCount(1);
                  const onParticipantJoined = () => setParticipantCount(prev => Math.max(1, prev + 1));
                  const onParticipantLeft = () => setParticipantCount(prev => Math.max(1, prev - 1));

                  jitsiHandlersRef.current = {
                    onVideoConferenceJoined,
                    onParticipantJoined,
                    onParticipantLeft,
                  };

                  externalApi.addListener?.('videoConferenceJoined', onVideoConferenceJoined);
                  externalApi.addListener?.('participantJoined', onParticipantJoined);
                  externalApi.addListener?.('participantLeft', onParticipantLeft);
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
