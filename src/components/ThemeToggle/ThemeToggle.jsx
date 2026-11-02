import { useEffect, useState } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';
import { currentTheme, onThemeChange, setTheme } from '../../utils/theme';
import './ThemeToggle.scss';

/**
 * Dark / light switch. Where the knob sits and which icon is lit come from CSS
 * tokens, so the prerendered page shows the right state before hydration; this
 * component only tracks the scheme for its accessible name and the click.
 */
export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const sync = () => setLight(currentTheme() === 'light');
    sync();
    return onThemeChange(sync);
  }, []);

  const flip = () => {
    const next = currentTheme() === 'light' ? 'dark' : 'light';
    // Cross-fade the whole page where the browser can snapshot it; elsewhere
    // the swap is instant.
    if (document.startViewTransition && !reduced) {
      document.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={light}
      aria-label="Light theme"
      title={light ? 'Switch to dark' : 'Switch to light'}
      onClick={flip}
    >
      <span className="theme-knob" />
      <svg className="theme-icon theme-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8Z" />
      </svg>
      <svg className="theme-icon theme-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
      </svg>
    </button>
  );
}
