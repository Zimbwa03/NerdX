// Notification Context for managing app-wide notifications
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { NotificationType, Notification } from '../types/Notification';

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  hideNotification: () => void;
  currentNotification: Notification | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const hideNotification = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setCurrentNotification(null);
  }, [timeoutId]);

  const showNotification = useCallback((
    message: string,
    type: NotificationType = 'info',
    duration: number = 4000
  ) => {
    // Clear any existing notification
    hideNotification();

    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
    };

    setCurrentNotification(notification);

    // Auto-hide after duration
    const id = setTimeout(() => {
      hideNotification();
    }, duration);
    setTimeoutId(id);
  }, [hideNotification]);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showNotification(message, 'info', duration);
  }, [showNotification]);

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    currentNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

