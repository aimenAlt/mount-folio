import { useCallback, useRef } from 'react';
import useRafScroll from '../../hooks/useRafScroll';
import './ScrollRail.scss';

/** Left-edge progress rail. Same gold as the beams rising through the hero. */
export default function ScrollRail() {
  const fillRef = useRef(null);

  const onScroll = useCallback((y) => {
    const fill = fillRef.current;
    if (!fill) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.height = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
  }, []);

  useRafScroll(onScroll);

  return (
    <div className="rail" aria-hidden="true">
      <div className="rail-fill" ref={fillRef} />
    </div>
  );
}
