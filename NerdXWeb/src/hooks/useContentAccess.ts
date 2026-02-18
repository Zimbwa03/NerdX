import { useMemo } from 'react';
import type { User } from '../types';

export function useContentAccess(user: User | null) {
  const hasPaidCredits = (user?.credit_breakdown?.purchased_credits ?? 0) > 0;

  const isSchoolStudentActive = useMemo(() => {
    if (user?.user_type !== 'school_student') return false;
    if (!user.subscription_expires_at) return false;
    return new Date(user.subscription_expires_at) > new Date();
  }, [user?.user_type, user?.subscription_expires_at]);

  const hasFullAccess = hasPaidCredits || isSchoolStudentActive;

  const isVideoLocked = (topicIndex: number): boolean => {
    if (hasFullAccess) return false;
    return topicIndex >= 2;
  };

  const isLabLocked = (labIndex: number): boolean => {
    if (hasFullAccess) return false;
    return labIndex >= 3;
  };

  return { hasFullAccess, hasPaidCredits, isVideoLocked, isLabLocked, isSchoolStudentActive };
}
