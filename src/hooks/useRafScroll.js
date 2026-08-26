import { useEffect } from 'react';

/**
 * Passive scroll listener coalesced into one requestAnimationFrame.
 *
 * PERFORMANCE: every scroll-driven effect on the page goes through this so we
 * never stack listeners that each force layout. Pass a STABLE callback
 * (useCallback) — it re-subscribes when the identity changes.
 */
export default function useRafScroll(onScroll) {
  useEffect(() => {
    let queued = false;

    const handler = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        onScroll(window.scrollY);
      });
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [onScroll]);
}
