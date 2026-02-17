'use client';

import { useEffect, useCallback, useRef, memo } from 'react';
import { useThemeStore } from '@/store/use-theme-store';

/* ── 3 aurora orbs (reduced from 5 — GPU-composited CSS animations) ── */
const orbs = [
  {
    size: 'w-[500px] h-[500px] md:w-[700px] md:h-[700px]',
    color: 'bg-[#39ace7]',
    blur: 'blur-[100px]',
    pos: { top: '-18%', right: '-12%' } as React.CSSProperties,
    opacity: 0.2,
    parallax: 40,
    dur: '14s',
    delay: '0s',
  },
  {
    size: 'w-[420px] h-[420px] md:w-[620px] md:h-[620px]',
    color: 'bg-[#9bd4e4]',
    blur: 'blur-[80px]',
    pos: { bottom: '-20%', left: '-8%' } as React.CSSProperties,
    opacity: 0.25,
    parallax: 55,
    dur: '18s',
    delay: '2s',
  },
  {
    size: 'w-[320px] h-[320px] md:w-[480px] md:h-[480px]',
    color: 'bg-[#cadeef]',
    blur: 'blur-[80px]',
    pos: { top: '8%', right: '8%' } as React.CSSProperties,
    opacity: 0.3,
    parallax: 35,
    dur: '20s',
    delay: '4s',
  },
];

/* ── 8 sparkles (reduced from 15 — pure CSS) ── */
const sparkles = [
  { size: 3, x: 12, y: 8, dur: '7s', delay: '0.3s' },
  { size: 4.5, x: 85, y: 15, dur: '9s', delay: '1.2s' },
  { size: 5, x: 42, y: 72, dur: '6s', delay: '2.5s' },
  { size: 3, x: 68, y: 35, dur: '11s', delay: '0.8s' },
  { size: 4, x: 25, y: 55, dur: '8s', delay: '3.1s' },
  { size: 3.5, x: 90, y: 80, dur: '10s', delay: '1.7s' },
  { size: 5, x: 8, y: 65, dur: '12s', delay: '0.5s' },
  { size: 3, x: 73, y: 48, dur: '6.5s', delay: '2.8s' },
];

function LoginBackgroundBase() {
  const isDark = useThemeStore((s) => s.theme === 'dark');
  const ref = useRef<HTMLDivElement>(null);

  /* Set CSS custom properties on mouse move — zero React re-renders */
  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', `${(e.clientX / window.innerWidth) * 2 - 1}`);
    el.style.setProperty('--my', `${(e.clientY / window.innerHeight) * 2 - 1}`);
    el.style.setProperty('--sx', `${(e.clientX / window.innerWidth) * 100}%`);
    el.style.setProperty('--sy', `${(e.clientY / window.innerHeight) * 100}%`);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [onMove]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={
        {
          '--mx': '0',
          '--my': '0',
          '--sx': '50%',
          '--sy': '50%',
          contain: 'layout style paint',
        } as React.CSSProperties
      }
    >
      {/* ── Base gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--accent)] to-[var(--secondary)] transition-colors duration-700" />

      {/* ── Cursor spotlight — CSS-driven, no JS animation loop ── */}
      <div
        className="absolute h-[500px] w-[500px] rounded-full"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(57,172,231,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(57,172,231,0.10) 0%, transparent 70%)',
          left: 'var(--sx)',
          top: 'var(--sy)',
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.15s ease-out, top 0.15s ease-out',
          willChange: 'left, top',
        }}
      />

      {/* ── Aurora orbs — CSS parallax wrapper + CSS keyframe float ── */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            ...orb.pos,
            transform: `translate(calc(var(--mx) * ${orb.parallax}px), calc(var(--my) * ${orb.parallax}px))`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <div
            className={`rounded-full ${orb.size} ${orb.color} ${orb.blur} animate-orb-float`}
            style={
              {
                '--orb-opacity': orb.opacity,
                animationDuration: orb.dur,
                animationDelay: orb.delay,
                willChange: 'transform, opacity',
              } as React.CSSProperties
            }
          />
        </div>
      ))}

      {/* ── Sparkles — pure CSS ── */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#39ace7] animate-sparkle-pulse"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDuration: s.dur,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* ── Sweeping beam — CSS ── */}
      <div
        className="absolute h-[200%] w-[60px] opacity-[0.04] animate-beam-sweep"
        style={{
          background: 'linear-gradient(90deg, transparent, #39ace7, transparent)',
          top: '-50%',
        }}
      />

      {/* ── Bottom waves — CSS animated (no path morphing) ── */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            className="animate-wave-drift"
            d="M0,64 C360,100 720,20 1080,64 C1260,86 1380,50 1440,64 L1440,100 L0,100 Z"
            fill="#cadeef"
            fillOpacity="0.35"
          />
          <path
            className="animate-wave-drift-alt"
            d="M0,80 C480,55 960,95 1440,70 L1440,100 L0,100 Z"
            fill="#9bd4e4"
            fillOpacity="0.2"
          />
        </svg>
      </div>

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, transparent 30%, rgba(12,25,41,0.7) 100%)'
            : 'radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.6) 100%)',
        }}
      />
    </div>
  );
}

export const LoginBackground = memo(LoginBackgroundBase);
