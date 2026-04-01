import { useState, useEffect, type MutableRefObject } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { teacherApi } from '../../../services/api/teacherApi';
import type { TeacherChatMessage } from '../teacherChatTypes';
import { getErrorMessage } from '../teacherChatUtils';

type UpdateUser = (userData: { credits?: number }) => void;

interface UseTeacherChatSessionArgs {
  subject: string | undefined;
  gradeLevel: string | undefined;
  topic: string | undefined;
  navigate: NavigateFunction;
  updateUser: UpdateUser;
  creditsRef: MutableRefObject<number>;
  onResetUi: () => void;
  /** Increment to retry `startSession` after a failure without full page reload. */
  retryKey: number;
}

interface UseTeacherChatSessionResult {
  sessionId: string | null;
  messages: TeacherChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<TeacherChatMessage[]>>;
  starting: boolean;
  bootstrapError: string | null;
}

/**
 * Starts (or restarts) a Teacher Mode session when subject / grade / topic change.
 * Does not depend on `user?.id` so auth hydration cannot wipe an active chat.
 */
export function useTeacherChatSession({
  subject,
  gradeLevel,
  topic,
  navigate,
  updateUser,
  creditsRef,
  onResetUi,
  retryKey,
}: UseTeacherChatSessionArgs): UseTeacherChatSessionResult {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TeacherChatMessage[]>([]);
  const [starting, setStarting] = useState(true);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  useEffect(() => {
    if (!subject || !gradeLevel) {
      navigate('/app/teacher', { replace: true });
      return;
    }

    onResetUi();
    setSessionId(null);
    setMessages([]);
    setBootstrapError(null);
    setStarting(true);

    let cancelled = false;

    (async () => {
      try {
        const credits = creditsRef.current;
        if (credits <= 0) {
          setBootstrapError('You need credits to use Teacher Mode. Please top up.');
          setStarting(false);
          return;
        }

        const session = await teacherApi.startSession(subject, gradeLevel, topic);
        if (cancelled) return;

        if (session?.session_id) {
          setSessionId(session.session_id);
          setMessages([
            {
              id: '0',
              role: 'assistant',
              content: session.initial_message || 'Welcome to Teacher Mode. How can I help you learn today?',
            },
          ]);
          if (session.credits_remaining !== undefined) {
            updateUser({ credits: session.credits_remaining });
          }
        } else {
          setBootstrapError('Failed to start session. Please try again.');
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setBootstrapError(getErrorMessage(err, 'Failed to start session.'));
        }
      } finally {
        if (!cancelled) {
          setStarting(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // creditsRef: stable ref, read .current only inside async (omit from deps).
  }, [subject, gradeLevel, topic, navigate, updateUser, onResetUi, retryKey]);

  return { sessionId, messages, setMessages, starting, bootstrapError };
}
