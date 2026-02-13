import { useNavigate } from 'react-router-dom';
import { User, ChevronRight } from 'lucide-react';
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

  return (
    <div
      className="teacher-card"
      onClick={() => navigate(`/app/marketplace/teacher/${teacher.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/app/marketplace/teacher/${teacher.id}`)}
    >
      <div className="teacher-card__header">
        <div className="teacher-card__avatar">
          {teacher.profile_image_url ? (
            <img
              src={teacher.profile_image_url}
              alt={`${teacher.full_name} ${teacher.surname}`}
              className="teacher-card__avatar-img"
            />
          ) : (
            <div className="teacher-card__avatar-placeholder">
              <User size={32} />
            </div>
          )}
          {teacher.verification_status === 'approved' && (
            <span className="teacher-card__verified" title="Verified Teacher">✓</span>
          )}
        </div>
        <div className="teacher-card__info">
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
        </div>
      </div>

      <p className="teacher-card__bio">
        {teacher.bio?.length > 120
          ? teacher.bio.slice(0, 120) + '...'
          : teacher.bio}
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

      <div className="teacher-card__footer">
        <span className="teacher-card__experience">
          {teacher.years_of_experience} yr{teacher.years_of_experience !== 1 ? 's' : ''} experience
        </span>
        <span className="teacher-card__view">
          View Profile <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
}
