import { useEffect, useRef } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';
import { AMBIENT_CONF as CONF, LOW_POWER } from '../../utils/device';
import './Ambient.scss';

/**
 * Ambient background: a slowly drifting mesh of nodes and the edges between
 * them — a dependency graph that never stops rearranging itself. Tuned to be
 * felt, not watched.
 *
 * PERFORMANCE: one canvas, capped fps, device pixel ratio capped, paused when
 * the tab is hidden. Edges batch into two colour paths bucketed by alpha, so a
 * frame costs ~8 stroke calls instead of one per edge. The canvas is promoted
 * to its own compositor layer in CSS so scrolling never repaints it.
 */
export default function Ambient() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let nodes = [];
    const goldPath = [];
    const coolPath = [];
    let dpr = 1;
    let w = 0;
    let h = 0;

    /* Mobile address bars change innerHeight constantly while scrolling.
       Resizing the backing store on every one of those events is what made the
       mesh go fuzzy (CSS stretch over a stale bitmap) and pop (nodes
       regenerated). So: lock the drawing surface, size it in CSS pixels
       explicitly, and only rebuild when the width really changes. */
    let lockedW = 0;
    /* Seeded from the tallest the viewport can ever get, so the surface already
       covers the page when the address bar hides. */
    let lockedH = LOW_POWER
      ? Math.max(window.innerHeight, window.screen ? window.screen.height : 0)
      : 0;

    function build(count) {
      nodes = [];
      for (let i = 0; i < count; i += 1) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          a: Math.random() * Math.PI * 2,
          r: 1.4 + Math.random() * 2.2,
          gold: Math.random() < 0.42,
          turn: (Math.random() - 0.5) * 0.00022
        });
      }
    }

    function resize(force) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Ignore pure height changes from browser chrome.
      if (!force && vw === lockedW && vh <= lockedH) return;

      lockedW = vw;
      lockedH = Math.max(lockedH, vh);
      w = lockedW;
      h = lockedH;

      dpr = Math.min(window.devicePixelRatio || 1, CONF.dprCap);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      build(Math.min(CONF.maxNodes, Math.round((w * h) / CONF.density)));
    }

    // Groups edges into 4 alpha buckets so near-identical lines share one
    // stroke call. Keeps the distance fade, cuts style churn by ~10x.
    function strokeBatch(flat, rgbPrefix, scale) {
      for (let bucket = 1; bucket <= 4; bucket += 1) {
        const lo = (bucket - 1) / 4;
        const hi = bucket / 4;
        let started = false;
        for (let i = 0; i < flat.length; i += 5) {
          const t = flat[i + 4];
          if (t < lo || t >= hi) continue;
          if (!started) { ctx.beginPath(); started = true; }
          ctx.moveTo(flat[i], flat[i + 1]);
          ctx.lineTo(flat[i + 2], flat[i + 3]);
        }
        if (started) {
          ctx.strokeStyle = rgbPrefix + (((lo + hi) / 2) * scale).toFixed(3) + ')';
          ctx.stroke();
        }
      }
    }

    function draw(dt) {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      for (const n of nodes) {
        n.a += n.turn * dt;
        n.x += Math.cos(n.a) * CONF.speed * dt * 0.06;
        n.y += Math.sin(n.a) * CONF.speed * dt * 0.06;
        if (n.x < -40) n.x = w + 40;
        if (n.x > w + 40) n.x = -40;
        if (n.y < -40) n.y = h + 40;
        if (n.y > h + 40) n.y = -40;
      }

      const max2 = CONF.linkDist * CONF.linkDist;
      goldPath.length = 0;
      coolPath.length = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let k = i + 1; k < nodes.length; k += 1) {
          const b = nodes[k];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > max2) continue;
          const t = 1 - Math.sqrt(d2) / CONF.linkDist;
          (a.gold && b.gold ? goldPath : coolPath).push(a.x, a.y, b.x, b.y, t);
        }
      }
      strokeBatch(goldPath, 'rgba(226, 168, 66, ', 0.80);
      strokeBatch(coolPath, 'rgba(156, 182, 202, ', 0.46);

      for (const n of nodes) {
        ctx.fillStyle = n.gold
          ? 'rgba(238, 180, 78, 0.95)'
          : 'rgba(160, 208, 222, 0.72)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resize(true);

    const onResize = () => {
      if (window.innerWidth !== lockedW) { // real resize, not browser chrome
        lockedH = 0;
        resize(true);
      }
    };
    const onOrientation = () => { lockedH = 0; resize(true); };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onOrientation, { passive: true });

    if (reduced) {
      draw(0);
      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('orientationchange', onOrientation);
      };
    }

    const frameMs = 1000 / CONF.fps;
    let last = performance.now();
    let acc = 0;
    let raf = requestAnimationFrame(loop);

    function loop(now) {
      const dt = Math.min(now - last, 60);
      last = now;
      acc += dt;
      if (acc >= frameMs) {
        draw(acc);
        acc = 0;
      }
      raf = requestAnimationFrame(loop);
    }

    function onVisibility() {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrientation);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return <canvas id="ambient" ref={canvasRef} aria-hidden="true" />;
}
