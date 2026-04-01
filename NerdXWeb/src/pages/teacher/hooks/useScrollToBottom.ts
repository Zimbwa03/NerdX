import { useEffect, useRef, type RefObject } from 'react';

/**
 * After new messages, scrolls the chat column to the bottom only if content overflows.
 * Uses `behavior: 'auto'` for snappy updates. Short threads stay flush under the header.
 */
export function useScrollToBottom(messagesLength: number, sending: boolean): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => {
      // Pin to bottom only when content overflows. Using `scrollHeight` alone leaves a huge
      // empty band above messages when the thread is shorter than the viewport.
      const maxTop = Math.max(0, el.scrollHeight - el.clientHeight);
      el.scrollTo({ top: maxTop, behavior: 'auto' });
    });
  }, [messagesLength, sending]);

  return ref;
}
