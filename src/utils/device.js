/**
 * Device motion budget. Evaluated once at module load.
 *
 * A phone-class device gets a deliberately cheaper page: the ambient mesh
 * drops to roughly a quarter of the node pairs (the edge pass is O(n²), so
 * node count is the single biggest cost lever), the hero stack stops following
 * scroll, and nothing subscribes to mousemove.
 *
 * Orientation changes are handled by the resize path, which does not rebuild
 * anything — so re-evaluating these on the fly is unnecessary.
 */

export const COARSE = typeof window !== 'undefined'
  && window.matchMedia('(pointer: coarse)').matches;

export const SMALL = typeof window !== 'undefined'
  && window.matchMedia('(max-width: 820px)').matches;

/** True on phones and tablets: throttles every animation on the page. */
export const LOW_POWER = COARSE || SMALL;

/** Ambient-canvas budget, keyed off the device class. */
export const AMBIENT_CONF = LOW_POWER
  ? { density: 26000, maxNodes: 46, linkDist: 132, speed: 0.05, fps: 20, dprCap: 1 }
  : { density: 8200, maxNodes: 190, linkDist: 172, speed: 0.06, fps: 24, dprCap: 1.5 };
