import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: 'blue' | 'cyan';
}

const COLORS = { blue: '110, 168, 255', cyan: '34, 211, 238' };
const LINK_DISTANCE = 140;
const MOUSE_RADIUS = 200;

/**
 * Interactive particle network drawn on a canvas: nodes drift, link up when close,
 * and reach toward the cursor. Pauses when off-screen or the tab is hidden;
 * draws a single still frame for visitors who prefer reduced motion.
 */
function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;

    function seed() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, Math.max(28, (width * height) / 16000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.6,
        hue: Math.random() > 0.7 ? 'cyan' : 'blue',
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (!reduce) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_RADIUS && dist > 1) {
            p.vx += (dx / dist) * 0.012;
            p.vy += (dy / dist) * 0.012;
          }
          p.vx *= 0.985;
          p.vy *= 0.985;
          const speed = Math.hypot(p.vx, p.vy);
          if (speed < 0.12) {
            p.vx += (Math.random() - 0.5) * 0.05;
            p.vy += (Math.random() - 0.5) * 0.05;
          }
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DISTANCE) {
            ctx!.strokeStyle = `rgba(${COLORS.blue}, ${(1 - d / LINK_DISTANCE) * 0.22})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < MOUSE_RADIUS) {
          ctx!.strokeStyle = `rgba(${COLORS.cyan}, ${(1 - md / MOUSE_RADIUS) * 0.45})`;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }
      }

      for (const p of particles) {
        ctx!.fillStyle = `rgba(${COLORS[p.hue]}, 0.85)`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop() {
      draw();
      frame = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduce) return;
      running = true;
      frame = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    seed();
    draw();

    const resize = new ResizeObserver(() => {
      seed();
      draw();
    });
    resize.observe(canvas);

    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()));
    visibility.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      stop();
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" />;
}

/** Layered animated hero background: rotating glow and an interactive particle network. */
export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
      {/* Rotating conic glow, anchored behind the terminal on large screens */}
      <div className="absolute top-[8%] right-[-10%] size-[720px] animate-[spin_24s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,rgb(37_99_235/0.0),rgb(37_99_235/0.4),rgb(34_211_238/0.32),rgb(167_139_250/0.3),rgb(37_99_235/0.0))] opacity-60 [mask-image:radial-gradient(circle,black_0%,transparent_68%)] lg:right-[2%]" />
      <div className="absolute top-[-20%] left-[-10%] size-[600px] animate-aurora-2 rounded-full bg-[radial-gradient(circle,rgb(37_99_235/0.3),transparent_65%)]" />

      <ParticleNetwork />
    </div>
  );
}
