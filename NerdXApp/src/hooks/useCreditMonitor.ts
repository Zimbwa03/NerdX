// Hook to monitor user credits and show warnings
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const useCreditMonitor = () => {
  const { user } = useAuth();
  const { showWarning, showError } = useNotification();
  const lastWarningRef = useRef<number>(0);

  useEffect(() => {
    if (!user) return;

    const credits = user.credits || 0;
    const now = Date.now();
    const timeSinceLastWarning = now - lastWarningRef.current;

    // Only show warning if it's been at least 30 seconds since last warning
    if (timeSinceLastWarning < 30000) return;

    // Critical: 0 credits
    if (credits === 0) {
      showError('🚫 You have 0 credits! Please top up to continue using features.', 6000);
      lastWarningRef.current = now;
      return;
    }

    // Very low: 1-3 credits
    if (credits >= 1 && credits <= 3) {
      showWarning(`⚠️ Very low credits! Only ${credits} credit${credits > 1 ? 's' : ''} remaining. Top up now!`, 5000);
      lastWarningRef.current = now;
      return;
    }

    // Low: 4-5 credits
    if (credits >= 4 && credits <= 5) {
      showWarning(`⚠️ Low credits! You have ${credits} credits remaining. Consider topping up soon.`, 4000);
      lastWarningRef.current = now;
      return;
    }
  }, [user?.credits, showWarning, showError]);
};

