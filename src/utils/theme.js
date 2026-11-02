/**
 * Colour scheme. The visitor's OS setting decides until they use the nav
 * toggle; from then on their choice lives in localStorage and wins. The inline
 * script in index.html applies a stored choice before first paint, so this
 * module only deals with changes after load.
 */

const KEY = 'theme';
const EVENT = 'themechange';

/** Keep in step with --bg in each scheme and the inline script in index.html. */
const THEME_COLOR = { dark: '#1b1712', light: '#f0e9dd' };

function systemQuery() {
  return window.matchMedia('(prefers-color-scheme: light)');
}

/** The scheme on screen right now: an explicit choice, else the OS setting. */
export function currentTheme() {
  return document.documentElement.dataset.theme
    || (systemQuery().matches ? 'light' : 'dark');
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Storage blocked (private mode): the choice lasts for this page view.
  }
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.content = THEME_COLOR[theme];
  });
  window.dispatchEvent(new Event(EVENT));
}

/** Calls `fn` whenever the scheme on screen may have changed. Returns cleanup. */
export function onThemeChange(fn) {
  const query = systemQuery();
  query.addEventListener('change', fn);
  window.addEventListener(EVENT, fn);
  return () => {
    query.removeEventListener('change', fn);
    window.removeEventListener(EVENT, fn);
  };
}
