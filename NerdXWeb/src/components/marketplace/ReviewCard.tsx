import { StarRating } from './StarRating';
import type { TeacherReview } from '../../types';

interface ReviewCardProps {
  review: TeacherReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = (review.student_name || 'S')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const dateStr = new Date(review.created_at).toLocaleDateString('en-ZW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__avatar">{initials}</div>
        <div className="review-card__meta">
          <span className="review-card__name">{review.student_name || 'Student'}</span>
          <span className="review-card__date">{dateStr}</span>
        </div>
        <div className="review-card__rating">
          <StarRating rating={review.rating} size={13} />
        </div>
      </div>
      <p className="review-card__comment">{review.comment}</p>
    </div>
  );
}
