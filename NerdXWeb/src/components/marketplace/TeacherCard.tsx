import { useNavigate } from 'react-router-dom';
import { User, Eye, CalendarPlus, ShieldCheck } from 'lucide-react';
import { StarRating } from './StarRating';
import { SubjectBadge } from './SubjectBadge';
import type { TeacherProfile } from '../../types';

interface TeacherCardProps {
  teacher: TeacherProfile;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  const navigate = useNavigate();

  const subjects = teacher.subjects || [];
  const displaySubjects = subjects.slice(0, 3);
  const extraCount = subjects.length - 3;

  const initials = `${(teacher.full_name || 'T')[0]}${(teacher.surname || '')[0] || ''}`.toUpperCase();

  return (
    <div className="teacher-card teacher-card--v2">
      {/* Image / Cover area */}
      <div className="teacher-card__cover">
        {teacher.profile_image_url ? (
          <img
            src={teacher.profile_image_url}
            alt={`${teacher.full_name} ${teacher.surname}`}
            className="teacher-card__cover-img"
          />
        ) : (
          <div className="teacher-card__cover-placeholder">
            <div className="teacher-card__cover-initials">{initials}</div>
          </div>
        )}
        {teacher.verification_status === 'approved' && (
          <span className="teacher-card__verified-badge" title="Verified Teacher">
            <ShieldCheck size={14} /> Verified
          </span>
        )}
      </div>

      {/* Info section */}
      <div className="teacher-card__body">
        <h3 className="teacher-card__name">
          {teacher.full_name} {teacher.surname}
        </h3>
        <div className="teacher-card__rating">
          <StarRating
            rating={teacher.average_rating || 0}
            size={14}
            showValue
            reviewCount={teacher.total_reviews}
          />
        </div>

        <p className="teacher-card__bio">
          {teacher.bio?.length > 100
            ? teacher.bio.slice(0, 100) + '...'
            : teacher.bio || 'Experienced educator'}
        </p>

        <div className="teacher-card__subjects">
          {displaySubjects.map((s) => (
            <SubjectBadge
              key={s.id}
              subject={s.subject_name}
              level={s.academic_level}
            />
          ))}
          {extraCount > 0 && (
            <span className="teacher-card__more">+{extraCount} more</span>
          )}
        </div>

        <div className="teacher-card__experience">
          {teacher.years_of_experience} yr{teacher.years_of_experience !== 1 ? 's' : ''} experience
        </div>

        {/* Action buttons */}
        <div className="teacher-card__actions">
          <button
            type="button"
            className="teacher-card__btn teacher-card__btn--profile"
            onClick={() => navigate(`/app/marketplace/teacher/${teacher.id}`)}
          >
            <Eye size={14} /> View Profile
          </button>
          <button
            type="button"
            className="teacher-card__btn teacher-card__btn--book"
            onClick={() => navigate(`/app/marketplace/book/${teacher.id}`)}
          >
            <CalendarPlus size={14} /> Book Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
