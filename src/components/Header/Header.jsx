import { useEffect, useState } from 'react';
import './Header.scss';

/** Sticky nav. Highlights whichever section is currently on screen. */
export default function Header({ brand, nav }) {
  const [here, setHere] = useState(null);

  useEffect(() => {
    const targets = nav
      .map((item) => ({ href: item.href, el: document.querySelector(item.href) }))
      .filter((t) => t.el);
    if (!targets.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const hit = targets.find((t) => t.el === entry.target);
          if (!hit) return;
          setHere((prev) => {
            if (entry.isIntersecting) return hit.href;
            return prev === hit.href ? null : prev;
          });
        });
      },
      { threshold: 0.5 }
    );

    targets.forEach((t) => io.observe(t.el));
    return () => io.disconnect();
  }, [nav]);

  return (
    <nav>
      <a href="#top" className="brand">{brand}</a>
      <div className="nav-links">
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={here === item.href ? 'is-here' : undefined}
          >
            {item.label}
          </a>
        ))}
        <a href="#contact" className="nav-cta">Hire me</a>
      </div>
    </nav>
  );
}
