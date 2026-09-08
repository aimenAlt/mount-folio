import { useEffect, useState } from 'react';
import { LOW_POWER } from '../utils/device';

/**
 * Phone-class device flag, reported after mount. The page is prerendered, so
 * the first client render has to agree with the server markup — the real value
 * lands on the next paint instead.
 */
export default function useLowPower() {
  const [low, setLow] = useState(false);

  useEffect(() => {
    setLow(LOW_POWER);
  }, []);

  return low;
}
