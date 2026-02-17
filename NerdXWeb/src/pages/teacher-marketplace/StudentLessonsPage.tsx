import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  GraduationCap,
  Loader2,
  Receipt,
  Video,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStudentBookings, getTeacherProfile } from '../../services/api/teacherMarketplaceApi';
import { walletApi, type WalletTransaction } from '../../services/api/walletApi';
import type { LessonBooking } from '../../types';

interface BookingPaymentState {
  charge?: WalletTransaction;
  refund?: WalletTransaction;
}

type PaymentTone = 'paid' | 'refund' | 'waiting' | 'neutral';

function normalizeTime(time: string): string {
  if (!time) return '00:00:00';
  return time.split(':').length === 2 ? `${time}:00` : time;
}

function bookingStart(booking: LessonBooking): Date {
  return new Date(`${booking.date}T${normalizeTime(booking.start_time)}`);
}

function bookingTimestamp(booking: LessonBooking): number {
  const ts = bookingStart(booking).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

function formatBookingDate(booking: LessonBooking): string {
  const date = bookingStart(booking);
  if (Number.isNaN(date.getTime())) return booking.date;
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatBookingTime(booking: LessonBooking): string {
  return `${booking.start_time} - ${booking.end_time}`;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function normalizeExternalUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function buildPaymentMap(
  bookings: LessonBooking[],
  transactions: WalletTransaction[],
): Record<string, BookingPaymentState> {
  const map: Record<string, BookingPaymentState> = {};
  const bookingIds = new Set(bookings.map((booking) => booking.id));

  for (const tx of transactions) {
    if (!bookingIds.has(tx.reference)) continue;

    const current = map[tx.reference] ?? {};
    if (tx.type === 'lesson_payment') {
      if (!current.charge || tx.created_at > current.charge.created_at) {
        current.charge = tx;
      }
    }
    if (tx.type === 'refund') {
      if (!current.refund || tx.created_at > current.refund.created_at) {
        current.refund = tx;
      }
    }

    map[tx.reference] = current;
  }

  return map;
}

function getStatusMeta(status: LessonBooking['status']): { label: string; icon: ReactElement } {
  switch (status) {
    case 'confirmed':
      return { label: 'Confirmed', icon: <CheckCircle size={12} /> };
    case 'completed':
      return { label: 'Completed', icon: <CheckCircle size={12} /> };
    case 'cancelled':
      return { label: 'Cancelled', icon: <XCircle size={12} /> };
    case 'pending':
    default:
      return { label: 'Pending', icon: <AlertCircle size={12} /> };
  }
}

export function StudentLessonsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<LessonBooking[]>([]);
  const [teacherNames, setTeacherNames] = useState<Record<string, string>>({});
  const [paymentsByBooking, setPaymentsByBooking] = useState<Record<string, BookingPaymentState>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const loadStudentLessons = async () => {
      setLoading(true);
      setError('');

      try {
        const [fetchedBookings, transactions] = await Promise.all([
          getStudentBookings(user.id),
          walletApi.getTransactions(200),
        ]);

        if (cancelled) return;

        setBookings(fetchedBookings);
        setPaymentsByBooking(buildPaymentMap(fetchedBookings, transactions));

        const uniqueTeacherIds = [
          ...new Set(
            fetchedBookings
              .map((booking) => booking.teacher_id)
              .filter((teacherId): teacherId is string => Boolean(teacherId)),
          ),
        ];

        const teacherEntries = await Promise.all(
          uniqueTeacherIds.map(async (teacherId) => {
            const profile = await getTeacherProfile(teacherId);
            const teacherName = [profile?.full_name, profile?.surname].filter(Boolean).join(' ').trim();
            return [teacherId, teacherName || 'Teacher'] as const;
          }),
        );

        if (cancelled) return;

        setTeacherNames(Object.fromEntries(teacherEntries));
      } catch (loadError) {
        console.error('Failed to load student lessons:', loadError);
        if (!cancelled) {
          setError('Could not load your lessons right now. Please refresh and try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadStudentLessons();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const activeBookings = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === 'pending' || booking.status === 'confirmed')
        .sort((a, b) => bookingTimestamp(a) - bookingTimestamp(b)),
    [bookings],
  );

  const completedBookings = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === 'completed')
        .sort((a, b) => bookingTimestamp(b) - bookingTimestamp(a)),
    [bookings],
  );

  const cancelledBookings = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === 'cancelled')
        .sort((a, b) => bookingTimestamp(b) - bookingTimestamp(a)),
    [bookings],
  );

  const joinableLessonsCount = useMemo(
    () => activeBookings.filter((booking) => booking.status === 'confirmed' && Boolean(booking.room_id)).length,
    [activeBookings],
  );

  const chargedTotal = useMemo(
    () => Object.values(paymentsByBooking).reduce((sum, row) => sum + (row.charge?.amount ?? 0), 0),
    [paymentsByBooking],
  );

  const refundedTotal = useMemo(
    () => Object.values(paymentsByBooking).reduce((sum, row) => sum + (row.refund?.amount ?? 0), 0),
    [paymentsByBooking],
  );

  const netSpent = Math.max(0, chargedTotal - refundedTotal);

  const getPaymentMeta = (booking: LessonBooking): { label: string; tone: PaymentTone } => {
    const paymentState = paymentsByBooking[booking.id];

    if (paymentState?.refund) {
      return {
        label: `Refunded ${formatCurrency(paymentState.refund.amount)} to your wallet`,
        tone: 'refund',
      };
    }

    if (paymentState?.charge) {
      return {
        label: `Wallet charged ${formatCurrency(paymentState.charge.amount)}`,
        tone: 'paid',
      };
    }

    if (booking.status === 'pending' || booking.status === 'confirmed') {
      return {
        label: 'Wallet charge happens automatically when the lesson starts',
        tone: 'waiting',
      };
    }

    return {
      label: 'No wallet deduction recorded for this lesson',
      tone: 'neutral',
    };
  };

  const renderLessonAction = (booking: LessonBooking) => {
    if (booking.status === 'pending') {
      return (
        <span className="student-lessons-pill">
          <Clock size={12} /> Waiting for teacher confirmation
        </span>
      );
    }

    if (booking.status === 'confirmed' && !booking.room_id) {
      return (
        <span className="student-lessons-pill">
          <AlertCircle size={12} /> Classroom room not ready yet
        </span>
      );
    }

    if ((booking.status === 'confirmed' || booking.status === 'completed') && booking.room_id) {
      return (
        <button
          type="button"
          className="td-v2-btn td-v2-btn--join td-v2-btn--sm"
          onClick={() => navigate(`/app/classroom/${booking.id}`)}
        >
          <Video size={13} />
          {booking.status === 'completed' ? 'Open Classroom' : 'Join Lesson'}
        </button>
      );
    }

    if (booking.status === 'completed' && booking.meet_link) {
      return (
        <a
          href={normalizeExternalUrl(booking.meet_link)}
          target="_blank"
          rel="noreferrer"
          className="td-v2-btn td-v2-btn--outline td-v2-btn--sm"
        >
          <ExternalLink size={13} /> Open Recording
        </a>
      );
    }

    return null;
  };

  const renderBookingCard = (booking: LessonBooking) => {
    const paymentMeta = getPaymentMeta(booking);
    const statusMeta = getStatusMeta(booking.status);
    const teacherName = teacherNames[booking.teacher_id] || 'Teacher';

    const cardStatusClass =
      booking.status === 'pending'
        ? 'td-v2-booking-card--pending'
        : booking.status === 'confirmed'
          ? 'td-v2-booking-card--confirmed'
          : booking.status === 'completed'
            ? 'td-v2-booking-card--completed'
            : 'student-lessons-card--cancelled';

    return (
      <div key={booking.id} className={`td-v2-booking-card student-lessons-card ${cardStatusClass}`}>
        <div className="td-v2-booking-card__info">
          <span className="td-v2-booking-card__subject">
            <BookOpen size={14} /> {booking.subject}
          </span>
          <span className="td-v2-booking-card__time">
            <Calendar size={13} /> {formatBookingDate(booking)} &middot; {formatBookingTime(booking)}
          </span>
          <span className="student-lessons-card__teacher">
            <GraduationCap size={13} /> {teacherName}
          </span>
          <span className={`student-lessons-payment student-lessons-payment--${paymentMeta.tone}`}>
            <Receipt size={12} /> {paymentMeta.label}
          </span>
          {booking.notes && (
            <p className="student-lessons-card__notes">{booking.notes}</p>
          )}
        </div>

        <div className="td-v2-booking-card__actions student-lessons-card__actions">
          <span className={`student-lessons-status student-lessons-status--${booking.status}`}>
            {statusMeta.icon} {statusMeta.label}
          </span>
          {renderLessonAction(booking)}
        </div>
      </div>
    );
  };

  return (
    <div className="student-lessons-page marketplace-page">
      <div className="marketplace-hero student-lessons-hero">
        <Link to="/app" className="marketplace-hero__back">
          <ArrowLeft size={20} />
        </Link>
        <div className="marketplace-hero__content">
          <div className="marketplace-hero__icon">
            <Video size={32} />
          </div>
          <h1 className="marketplace-hero__title">My Online Lessons</h1>
          <p className="marketplace-hero__subtitle">
            See all booked lessons, join live classes, and track wallet deductions after each lecture.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="marketplace-loading">
          <Loader2 size={32} className="marketplace-loading__spinner" />
          <span>Loading your booked lessons...</span>
        </div>
      ) : error ? (
        <div className="marketplace-empty">
          <AlertCircle size={48} />
          <h3>Unable to Load Lessons</h3>
          <p>{error}</p>
          <button type="button" className="td-v2-btn td-v2-btn--outline" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          <section className="student-lessons-summary">
            <div className="student-lessons-summary__card">
              <Calendar size={18} />
              <div>
                <span>Booked Lessons</span>
                <strong>{bookings.length}</strong>
              </div>
            </div>
            <div className="student-lessons-summary__card">
              <Video size={18} />
              <div>
                <span>Ready To Join</span>
                <strong>{joinableLessonsCount}</strong>
              </div>
            </div>
            <div className="student-lessons-summary__card">
              <Wallet size={18} />
              <div>
                <span>Net Wallet Spent</span>
                <strong>{formatCurrency(netSpent)}</strong>
              </div>
            </div>
          </section>

          {bookings.length === 0 ? (
            <div className="marketplace-empty student-lessons-empty">
              <Calendar size={48} />
              <h3>No Lessons Booked Yet</h3>
              <p>Book a lesson with a teacher to start your live classroom journey.</p>
              <button type="button" className="td-v2-btn td-v2-btn--primary" onClick={() => navigate('/app/marketplace')}>
                Browse Teachers
              </button>
            </div>
          ) : (
            <div className="student-lessons-groups">
              <section className="student-lessons-group">
                <h2>
                  <Clock size={16} /> Upcoming & Pending ({activeBookings.length})
                </h2>
                {activeBookings.length > 0 ? (
                  activeBookings.map(renderBookingCard)
                ) : (
                  <p className="student-lessons-group__empty">No active bookings right now.</p>
                )}
              </section>

              <section className="student-lessons-group">
                <h2>
                  <CheckCircle size={16} /> Completed ({completedBookings.length})
                </h2>
                {completedBookings.length > 0 ? (
                  completedBookings.map(renderBookingCard)
                ) : (
                  <p className="student-lessons-group__empty">Completed lessons will appear here.</p>
                )}
              </section>

              {cancelledBookings.length > 0 && (
                <section className="student-lessons-group">
                  <h2>
                    <XCircle size={16} /> Cancelled ({cancelledBookings.length})
                  </h2>
                  {cancelledBookings.map(renderBookingCard)}
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
