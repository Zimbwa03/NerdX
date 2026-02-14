import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LessonBooking } from '../../types';
import { Play, Calendar, Clock, Video, BookOpen, ArrowRight } from 'lucide-react';

interface QuickStartLessonProps {
  bookings: LessonBooking[];
  onConfirmBooking?: (bookingId: string) => Promise<void>;
  loading?: boolean;
}

export function QuickStartLesson({ bookings, onConfirmBooking, loading }: QuickStartLessonProps) {
  const navigate = useNavigate();

  const nextLesson = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const nowTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    return bookings
      .filter(b =>
        b.status === 'confirmed' &&
        (b.date > todayStr || (b.date === todayStr && b.start_time >= nowTime))
      )
      .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time))[0] || null;
  }, [bookings]);

  const pendingBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'pending').slice(0, 2);
  }, [bookings]);

  if (loading) {
    return (
      <div className="td-v2-quick-start td-v2-quick-start--loading">
        <div className="td-v2-skeleton td-v2-skeleton--quick" />
      </div>
    );
  }

  return (
    <div className="td-v2-quick-start">
      {nextLesson ? (
        <div className="td-v2-quick-start__card td-v2-quick-start__card--active">
          <div className="td-v2-quick-start__glow" />
          <div className="td-v2-quick-start__top">
            <div className="td-v2-quick-start__icon">
              <Play size={24} />
            </div>
            <div>
              <h3>Next Lesson</h3>
              <p className="td-v2-quick-start__subject">
                <BookOpen size={14} /> {nextLesson.subject}
              </p>
            </div>
          </div>
          <div className="td-v2-quick-start__details">
            <span><Calendar size={14} /> {nextLesson.date}</span>
            <span><Clock size={14} /> {nextLesson.start_time} - {nextLesson.end_time}</span>
          </div>
          {nextLesson.room_id ? (
            <button
              className="td-v2-btn td-v2-btn--start"
              onClick={() => navigate(`/app/classroom/${nextLesson.id}`)}
            >
              <Video size={18} /> Start Lesson Now
              <ArrowRight size={16} />
            </button>
          ) : (
            <p className="td-v2-quick-start__waiting">Room link will be available soon</p>
          )}
        </div>
      ) : (
        <div className="td-v2-quick-start__card td-v2-quick-start__card--empty">
          <div className="td-v2-quick-start__icon td-v2-quick-start__icon--muted">
            <Calendar size={24} />
          </div>
          <div>
            <h3>No Upcoming Lessons</h3>
            <p>Share your availability to attract more students!</p>
          </div>
        </div>
      )}

      {/* Pending booking alerts */}
      {pendingBookings.length > 0 && (
        <div className="td-v2-quick-start__pending">
          <h4>{pendingBookings.length} Pending Request{pendingBookings.length > 1 ? 's' : ''}</h4>
          {pendingBookings.map(b => (
            <div key={b.id} className="td-v2-quick-start__pending-item">
              <div className="td-v2-quick-start__pending-info">
                <span className="td-v2-quick-start__pending-subject">{b.subject}</span>
                <span className="td-v2-quick-start__pending-time">{b.date} at {b.start_time}</span>
              </div>
              {onConfirmBooking && (
                <button
                  className="td-v2-btn td-v2-btn--confirm-sm"
                  onClick={() => onConfirmBooking(b.id)}
                >
                  Confirm
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
