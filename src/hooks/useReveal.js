import { useEffect, useRef, useState } from 'react';

/**
 * Adds a reveal-on-enter flag the first time an element scrolls into view.
 * Returns [ref, shown] — spread the flag onto a class name.
 * Under prefers-reduced-motion it reports shown immediately.
 */
export default function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, shown];
}
