import { useEffect, useRef } from 'react';
import useUIStore from '../../store/uiStore';

/* ------------------------------------------------------------------
   Hero crackers — gentle festival fireworks drawn on a canvas that sits
   behind the lamp and the text. Rockets rise, burst into glowing sparks
   (some of which crackle into tiny pops), then fade.

   Kept light on purpose: starts only after the door intro is over, pauses
   when the hero is off-screen or the tab is hidden, caps the spark count,
   and is skipped entirely for visitors who prefer reduced motion.
   ------------------------------------------------------------------ */

const COLORS = [
  [255, 215, 120], // gold
  [232, 168, 56], // amber
  [255, 130, 60], // orange
  [255, 85, 85], // red
  [255, 240, 215], // warm white
  [255, 175, 95], // saffron
];

const GRAVITY = 110; // px / s²
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

export default function HeroFireworks() {
  const canvasRef = useRef(null);
  const isLoading = useUIStore((state) => state.isLoading);

  useEffect(() => {
    if (isLoading) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const small = () => w < 700;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const rockets = [];
    const sparks = [];
    const flashes = [];
    let raf = 0;
    let last = 0;
    let untilLaunch = 0.6; // first rocket shortly after start
    let visible = true;

    const spark = (x, y, vx, vy, color, life, size, crackle = false) => {
      if (sparks.length > (small() ? 220 : 420)) return;
      sparks.push({ x, y, vx, vy, color, life, max: life, size, crackle });
    };

    const launch = () => {
      const x = rand(w * 0.08, w * 0.92);
      const targetY = rand(h * 0.14, h * 0.5);
      rockets.push({
        x,
        y: h + 10,
        vx: rand(-18, 18),
        vy: -Math.max(320, (h - targetY) * 1.25),
        targetY,
        color: pick(COLORS),
      });
    };

    const burst = (x, y, color) => {
      const kind = Math.random();
      const count = Math.round((small() ? 36 : 60) * rand(0.85, 1.25));
      const speed = rand(150, 250) * (small() ? 0.7 : 1);
      flashes.push({ x, y, life: 0.35, max: 0.35, color });

      for (let i = 0; i < count; i += 1) {
        const a = (i / count) * Math.PI * 2 + rand(-0.05, 0.05);
        // ring bursts keep one speed; peony bursts vary it for a fuller ball
        const s = kind < 0.35 ? speed : speed * rand(0.35, 1);
        const c = kind > 0.8 && i % 2 ? pick(COLORS) : color;
        spark(x, y, Math.cos(a) * s, Math.sin(a) * s, c, rand(1.1, 1.9), rand(1.8, 3.2), Math.random() < 0.25);
      }
    };

    const step = (now) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05);
      last = now;

      untilLaunch -= dt;
      if (untilLaunch <= 0) {
        launch();
        if (Math.random() < 0.3) launch(); // sometimes two at once
        untilLaunch = rand(1.3, 3.2);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      // rockets
      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const r = rockets[i];
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        r.vy += GRAVITY * 0.6 * dt;
        spark(r.x, r.y, rand(-12, 12), rand(10, 40), [255, 200, 110], rand(0.25, 0.45), 1.2);
        ctx.fillStyle = 'rgba(255, 235, 190, 0.95)';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.targetY || r.vy > -40) {
          burst(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // soft flash at the moment of a burst
      for (let i = flashes.length - 1; i >= 0; i -= 1) {
        const f = flashes[i];
        f.life -= dt;
        if (f.life <= 0) {
          flashes.splice(i, 1);
          continue;
        }
        const k = f.life / f.max;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 90);
        g.addColorStop(0, `rgba(${f.color[0]}, ${f.color[1]}, ${f.color[2]}, ${0.38 * k})`);
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(f.x - 90, f.y - 90, 180, 180);
      }

      // sparks
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const p = sparks[i];
        p.life -= dt;
        if (p.life <= 0) {
          if (p.crackle) {
            // tiny pops, like a cracker going off
            for (let n = 0; n < 3; n += 1) {
              spark(p.x, p.y, rand(-60, 60), rand(-60, 60), [255, 235, 190], rand(0.25, 0.5), 1);
            }
          }
          sparks.splice(i, 1);
          continue;
        }
        p.vx *= 1 - 1.2 * dt;
        p.vy = p.vy * (1 - 1.2 * dt) + GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const a = Math.min(1, p.life / p.max) ** 1.4;
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.5 + a * 0.5), 0, Math.PI * 2);
        ctx.fill();
        if (p.size > 1.6) {
          ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${a * 0.12})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const update = () => (visible && !document.hidden ? start() : stop());

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', update);
    update();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('resize', resize);
    };
  }, [isLoading]);

  return <canvas ref={canvasRef} className="hero__fireworks" aria-hidden="true" />;
}
