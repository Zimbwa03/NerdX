import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SubjectBadge } from '../../components/marketplace/SubjectBadge';
import {
  getTeacherProfile,
  createBooking,
} from '../../services/api/teacherMarketplaceApi';
import { DAYS_OF_WEEK } from '../../data/marketplaceConstants';
import type { TeacherProfile, TeacherAvailability, DayOfWeek } from '../../types';
import {
  ArrowLeft, Calendar, Clock, BookOpen, User, CheckCircle,
  Loader2, ChevronRight
} from 'lucide-react';

export function BookLessonPage() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking steps
  const [bookingStep, setBookingStep] = useState<'subject' | 'time' | 'confirm' | 'done'>('subject');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | ''>('');
  const [selectedSlot, setSelectedSlot] = useState<TeacherAvailability | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      if (!teacherId) return;
      const profile = await getTeacherProfile(teacherId);
      if (profile) {
        setTeacher(profile);
      }
      setLoading(false);
    }
    load();
  }, [teacherId]);

  // Get next dates for a given day of week
  const getNextDates = (day: string): string[] => {
    const dayIndex = DAYS_OF_WEEK.indexOf(day as any);
    if (dayIndex === -1) return [];
    const jsDayIndex = (dayIndex + 1) % 7; // DAYS_OF_WEEK is Mon-Sun, JS is Sun-Sat
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 28 && dates.length < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i + 1);
      if (d.getDay() === jsDayIndex) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const availableDays = teacher?.availability
    ? [...new Set(teacher.availability.map((a) => a.day_of_week))]
    : [];

  const slotsForDay = teacher?.availability?.filter((a) => a.day_of_week === selectedDay) || [];
  const datesForDay = selectedDay ? getNextDates(selectedDay) : [];

  const handleSubmitBooking = async () => {
    if (!user || !teacherId || !selectedSlot || !selectedDate) return;
    setSubmitting(true);
    setError('');

    const booking = await createBooking(
      teacherId,
      user.id,
      selectedSubject,
      selectedDate,
      selectedSlot.start_time,
      selectedSlot.end_time,
      notes.trim() || undefined,
    );

    if (booking) {
      setBookingStep('done');
    } else {
      setError('Failed to create booking. Please try again.');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="tp-loading">
        <Loader2 size={32} className="marketplace-loading__spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="marketplace-empty">
        <User size={48} />
        <h3>Teacher Not Found</h3>
        <Link to="/app/marketplace" className="to-btn to-btn--primary">Back to Marketplace</Link>
      </div>
    );
  }

  if (bookingStep === 'done') {
    return (
      <div className="booking-page">
        <div className="booking-success">
          <div className="booking-success__icon"><CheckCircle size={64} /></div>
          <h1>Lesson Booked!</h1>
          <p>Your lesson with <strong>{teacher.full_name} {teacher.surname}</strong> has been booked.</p>
          <div className="booking-success__details">
            <div className="booking-success__detail">
              <BookOpen size={16} />
              <span>{selectedSubject}</span>
            </div>
            <div className="booking-success__detail">
              <Calendar size={16} />
              <span>{new Date(selectedDate).toLocaleDateString('en-ZW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="booking-success__detail">
              <Clock size={16} />
              <span>{selectedSlot?.start_time} - {selectedSlot?.end_time}</span>
            </div>
          </div>
          <p className="booking-success__note">
            The teacher will confirm your booking. Once confirmed, a <strong>Join Classroom</strong> button will appear on your dashboard to start the live lesson with video and an interactive whiteboard.
          </p>
          <div className="booking-success__actions">
            <button type="button" className="to-btn to-btn--primary" onClick={() => navigate('/app')}>
              Go to Dashboard
            </button>
            <button type="button" className="to-btn to-btn--outline" onClick={() => navigate('/app/marketplace')}>
              Find More Teachers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button
          type="button"
          className="booking-header__back"
          onClick={() => {
            if (bookingStep === 'confirm') setBookingStep('time');
            else if (bookingStep === 'time') setBookingStep('subject');
            else navigate(`/app/marketplace/teacher/${teacherId}`);
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="booking-header__title">Book a Lesson</h1>
          <p className="booking-header__subtitle">with {teacher.full_name} {teacher.surname}</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="booking-steps">
        <div className={`booking-steps__step${bookingStep === 'subject' ? ' booking-steps__step--active' : ''} ${['time', 'confirm'].includes(bookingStep) ? ' booking-steps__step--done' : ''}`}>
          <span>1</span> Subject
        </div>
        <ChevronRight size={14} />
        <div className={`booking-steps__step${bookingStep === 'time' ? ' booking-steps__step--active' : ''} ${bookingStep === 'confirm' ? ' booking-steps__step--done' : ''}`}>
          <span>2</span> Time
        </div>
        <ChevronRight size={14} />
        <div className={`booking-steps__step${bookingStep === 'confirm' ? ' booking-steps__step--active' : ''}`}>
          <span>3</span> Confirm
        </div>
      </div>

      {error && <div className="teacher-onboarding__error">{error}</div>}

      <div className="booking-body">
        {/* Step 1: Choose Subject */}
        {bookingStep === 'subject' && (
          <div className="booking-section">
            <h2><BookOpen size={18} /> Choose a Subject</h2>
            <p>Select the subject you want to learn from this teacher.</p>
            <div className="booking-subject-grid">
              {teacher.subjects?.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`booking-subject-option${selectedSubject === s.subject_name ? ' booking-subject-option--selected' : ''}`}
                  onClick={() => setSelectedSubject(s.subject_name)}
                >
                  <SubjectBadge subject={s.subject_name} level={s.academic_level} size="md" />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="to-btn to-btn--primary"
              disabled={!selectedSubject}
              onClick={() => setBookingStep('time')}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Choose Time */}
        {bookingStep === 'time' && (
          <div className="booking-section">
            <h2><Calendar size={18} /> Choose a Time</h2>
            <p>Select a day, time slot, and date for your lesson.</p>

            <div className="booking-subsection">
              <h3>Available Days</h3>
              <div className="booking-day-grid">
                {availableDays.length > 0 ? availableDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`booking-day-btn${selectedDay === day ? ' booking-day-btn--selected' : ''}`}
                    onClick={() => { setSelectedDay(day as DayOfWeek); setSelectedSlot(null); setSelectedDate(''); }}
                  >
                    {day}
                  </button>
                )) : (
                  <p className="booking-no-slots">No availability set. Contact the teacher directly.</p>
                )}
              </div>
            </div>

            {selectedDay && slotsForDay.length > 0 && (
              <div className="booking-subsection">
                <h3>Time Slots</h3>
                <div className="booking-slot-grid">
                  {slotsForDay.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      className={`booking-slot-btn${selectedSlot?.id === slot.id ? ' booking-slot-btn--selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <Clock size={14} />
                      {slot.start_time} - {slot.end_time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedSlot && datesForDay.length > 0 && (
              <div className="booking-subsection">
                <h3>Select Date</h3>
                <div className="booking-date-grid">
                  {datesForDay.map((date) => (
                    <button
                      key={date}
                      type="button"
                      className={`booking-date-btn${selectedDate === date ? ' booking-date-btn--selected' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {new Date(date).toLocaleDateString('en-ZW', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="to-btn to-btn--primary"
              disabled={!selectedSlot || !selectedDate}
              onClick={() => setBookingStep('confirm')}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {bookingStep === 'confirm' && (
          <div className="booking-section">
            <h2><CheckCircle size={18} /> Confirm Your Booking</h2>
            <div className="booking-summary">
              <div className="booking-summary__row">
                <span className="booking-summary__label"><User size={14} /> Teacher</span>
                <span className="booking-summary__value">{teacher.full_name} {teacher.surname}</span>
              </div>
              <div className="booking-summary__row">
                <span className="booking-summary__label"><BookOpen size={14} /> Subject</span>
                <span className="booking-summary__value">{selectedSubject}</span>
              </div>
              <div className="booking-summary__row">
                <span className="booking-summary__label"><Calendar size={14} /> Date</span>
                <span className="booking-summary__value">
                  {new Date(selectedDate).toLocaleDateString('en-ZW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="booking-summary__row">
                <span className="booking-summary__label"><Clock size={14} /> Time</span>
                <span className="booking-summary__value">{selectedSlot?.start_time} - {selectedSlot?.end_time}</span>
              </div>
            </div>
            <div className="booking-notes">
              <label>Notes for the Teacher (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific topics or questions you'd like to cover..."
                rows={3}
              />
            </div>
            <button
              type="button"
              className="to-btn to-btn--primary"
              onClick={handleSubmitBooking}
              disabled={submitting}
            >
              {submitting ? (
                <><Loader2 size={16} className="to-spinner" /> Booking...</>
              ) : (
                <><CheckCircle size={16} /> Confirm Booking</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
