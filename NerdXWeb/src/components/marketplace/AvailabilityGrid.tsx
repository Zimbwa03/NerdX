import type { TeacherAvailability } from '../../types';
import { DAYS_OF_WEEK } from '../../data/marketplaceConstants';

interface AvailabilityGridProps {
  availability: TeacherAvailability[];
  compact?: boolean;
}

export function AvailabilityGrid({ availability, compact = false }: AvailabilityGridProps) {
  const grouped: Record<string, TeacherAvailability[]> = {};
  for (const slot of availability) {
    if (!grouped[slot.day_of_week]) grouped[slot.day_of_week] = [];
    grouped[slot.day_of_week].push(slot);
  }

  if (availability.length === 0) {
    return (
      <div className="availability-grid availability-grid--empty">
        <p>No availability set yet.</p>
      </div>
    );
  }

  return (
    <div className={`availability-grid${compact ? ' availability-grid--compact' : ''}`}>
      {DAYS_OF_WEEK.map((day) => {
        const slots = grouped[day] || [];
        const hasSlots = slots.length > 0;

        return (
          <div
            key={day}
            className={`availability-grid__day${hasSlots ? ' availability-grid__day--available' : ''}`}
          >
            <span className="availability-grid__day-name">
              {compact ? day.slice(0, 3) : day}
            </span>
            {hasSlots ? (
              <div className="availability-grid__slots">
                {slots.map((s) => (
                  <span key={s.id} className="availability-grid__slot">
                    {s.start_time} - {s.end_time}
                  </span>
                ))}
              </div>
            ) : (
              <span className="availability-grid__none">—</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
