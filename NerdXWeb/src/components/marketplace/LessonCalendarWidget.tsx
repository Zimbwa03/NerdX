import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LessonBooking } from '../../types';
import { Calendar, Clock, Video, BookOpen, ChevronRight } from 'lucide-react';

interface LessonCalendarWidgetProps {
  bookings: LessonBooking[];
  loading?: boolean;
}

export function LessonCalendarWidget({ bookings, loading }: LessonCalendarWidgetProps) {
  const navigate = useNavigate();

  const weekDays = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const days: { date: Date; dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push({
        date: d,
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: d.toDateString() === now.toDateString(),
      });
    }
    return days;
  }, []);

  const upcomingBookings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings
      .filter(b => b.date >= today && (b.status === 'confirmed' || b.status === 'pending'))
      .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time))
      .slice(0, 5);
  }, [bookings]);

  // Map bookings to days for dot indicators
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, LessonBooking[]>();
    for (const b of bookings) {
      if (b.status === 'confirmed' || b.status === 'pending') {
        const existing = map.get(b.date) || [];
        existing.push(b);
        map.set(b.date, existing);
      }
    }
    return map;
  }, [bookings]);

  // Subject colors
  const subjectColorMap = useMemo(() => {
    const colors = ['#7C4DFF', '#00E5FF', '#FF6B6B', '#FFAB00', '#00E676', '#FF4081'];
    const subjects = [...new Set(bookings.map(b => b.subject))];
    const map = new Map<string, string>();
    subjects.forEach((s, i) => map.set(s, colors[i % colors.length]));
    return map;
  }, [bookings]);

  if (loading) {
    return (
      <div className="td-v2-calendar-widget">
        <div className="td-v2-calendar-widget__header">
          <Calendar size={18} />
          <h3>Upcoming Lessons</h3>
        </div>
        <div className="td-v2-skeleton td-v2-skeleton--calendar" />
      </div>
    );
  }

  return (
    <div className="td-v2-calendar-widget">
      <div className="td-v2-calendar-widget__header">
        <div className="td-v2-calendar-widget__title">
          <Calendar size={18} />
          <h3>This Week</h3>
        </div>
        <span className="td-v2-calendar-widget__count">
          {upcomingBookings.length} upcoming
        </span>
      </div>

      {/* Week day strip */}
      <div className="td-v2-calendar-strip">
        {weekDays.map(day => {
          const dayBookings = bookingsByDate.get(day.dateStr) || [];
          return (
            <div
              key={day.dateStr}
              className={`td-v2-calendar-day ${day.isToday ? 'td-v2-calendar-day--today' : ''} ${dayBookings.length > 0 ? 'td-v2-calendar-day--has-lessons' : ''}`}
            >
              <span className="td-v2-calendar-day__name">{day.dayName}</span>
              <span className="td-v2-calendar-day__num">{day.dayNum}</span>
              {dayBookings.length > 0 && (
                <div className="td-v2-calendar-day__dots">
                  {dayBookings.slice(0, 3).map((b, i) => (
                    <span
                      key={i}
                      className="td-v2-calendar-day__dot"
                      style={{ background: subjectColorMap.get(b.subject) || '#7C4DFF' }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming lessons list */}
      <div className="td-v2-calendar-lessons">
        {upcomingBookings.length === 0 ? (
          <div className="td-v2-calendar-empty">
            <BookOpen size={24} />
            <p>No upcoming lessons this week</p>
          </div>
        ) : (
          upcomingBookings.map(b => (
            <div key={b.id} className="td-v2-calendar-lesson">
              <div
                className="td-v2-calendar-lesson__bar"
                style={{ background: subjectColorMap.get(b.subject) || '#7C4DFF' }}
              />
              <div className="td-v2-calendar-lesson__info">
                <span className="td-v2-calendar-lesson__subject">{b.subject}</span>
                <span className="td-v2-calendar-lesson__time">
                  <Clock size={12} /> {b.date} &middot; {b.start_time} - {b.end_time}
                </span>
              </div>
              <div className="td-v2-calendar-lesson__actions">
                {b.status === 'confirmed' && b.room_id ? (
                  <button
                    className="td-v2-btn td-v2-btn--join"
                    onClick={() => navigate(`/app/classroom/${b.id}`)}
                  >
                    <Video size={14} /> Join
                  </button>
                ) : (
                  <span className={`td-v2-calendar-lesson__badge td-v2-calendar-lesson__badge--${b.status}`}>
                    {b.status}
                  </span>
                )}
                <ChevronRight size={14} className="td-v2-calendar-lesson__chevron" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
