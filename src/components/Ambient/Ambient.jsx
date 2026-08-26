import { useEffect, useRef } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';
import './Ambient.scss';

/**
 * Ambient background: a slowly drifting mesh of nodes and the edges between
 * them — a dependency graph that never stops rearranging itself. Tuned to be
 * felt, not watched.
 *
 * PERFORMANCE: one canvas, capped at ~24fps, device pixel ratio capped at 1.5,
 * paused when the tab is hidden. Edges batch into two colour paths bucketed by
 * alpha, so a frame costs ~8 stroke calls instead of one per edge.
 */

const CONF = {
  density: 8200,   // one node per N css pixels
  maxNodes: 190,
  linkDist: 172,
  speed: 0.06,     // deliberately glacial
  fps: 24
};

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

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(CONF.maxNodes, Math.round((w * h) / CONF.density));
      nodes = [];
      for (let i = 0; i < target; i += 1) {
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

    resize();
    window.addEventListener('resize', resize, { passive: true });

    if (reduced) {
      draw(0);
      return () => window.removeEventListener('resize', resize);
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
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return <canvas id="ambient" ref={canvasRef} aria-hidden="true" />;
}
