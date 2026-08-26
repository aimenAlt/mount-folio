import { useCallback, useEffect, useState } from 'react';
import useRafScroll from '../../hooks/useRafScroll';
import './Header.scss';

/** Sticky nav. Highlights whichever section is currently on screen. */
export default function Header({ brand, nav }) {
  const [here, setHere] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const onScroll = useCallback((y) => {
    setScrolled(y > 8);
  }, []);
  useRafScroll(onScroll);

  useEffect(() => {
    const targets = nav
      .map((item) => ({ href: item.href, el: document.querySelector(item.href) }))
      .filter((t) => t.el);
    if (!targets.length) return undefined;

    const visible = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio);
          else visible.delete(entry.target);
        });
        let best = null;
        let bestRatio = -1;
        visible.forEach((ratio, el) => {
          if (ratio >= bestRatio) {
            bestRatio = ratio;
            best = el;
          }
        });
        if (!best) return;
        const hit = targets.find((t) => t.el === best);
        if (hit) setHere(hit.href);
      },
      {
        rootMargin: '-72px 0px -42% 0px',
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1]
      }
    );

    targets.forEach((t) => io.observe(t.el));
    return () => io.disconnect();
  }, [nav]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav className={scrolled || open ? 'is-scrolled' : undefined}>
      <a href="#top" className="brand" onClick={close}>{brand}</a>
      <div id="site-nav" className={`nav-links${open ? ' is-open' : ''}`}>
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={here === item.href ? 'is-here' : undefined}
            onClick={close}
          >
            {item.label}
          </a>
        ))}
      </div>
      <a href="#contact" className="nav-cta" onClick={close}>Hire me</a>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
    </nav>
  );
}
