import { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '../../store/LanguageContext';
import useUIStore from '../../store/uiStore';
import './LoadingScreen.css';

/* ─────────────────────────────────────────────
   PHASE DEFINITIONS
   ───────────────────────────────────────────── */
const PHASES = {
  CLOSED: 'closed',        // Door fully closed, brand visible
  ANTICIPATION: 'anticipation', // Subtle light pulse at center seam
  OPENING: 'opening',      // Both panels slide apart (left → left, right → right)
  REVEALING: 'revealing',  // Doors wide open — the hero lamp glides to its home spot
  FADE_OUT: 'fadeOut',     // Hand over to the homepage
};

/* Phase durations in ms */
const TIMINGS = {
  [PHASES.CLOSED]: 1500,
  [PHASES.ANTICIPATION]: 500,
  [PHASES.OPENING]: 3000,
  [PHASES.REVEALING]: 1500,
  [PHASES.FADE_OUT]: 800,
};

/* Detect reduced motion preference */
function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

/* ─────────────────────────────────────────────
   DOOR CRACKERS — small Diwali-style firecracker
   bursts that pop on the door faces as they slide.
   Layout is generated with a seeded PRNG so it is
   stable across renders (no layout jitter).
   ───────────────────────────────────────────── */
const CRACKER_COLORS = ['#FFD54A', '#FF9F2E', '#FF5E3A', '#FFF3C4', '#FF7BC0', '#7CFFB2'];
const CRACKERS_PER_DOOR = 8;
const SPARKS_PER_CRACKER = 14;
/* Time window (s) over which bursts are spread during the opening */
const CRACKER_WINDOW = 2.0;

function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function DoorCrackers({ side }) {
  const crackers = useMemo(() => {
    const rand = seededRandom(side === 'left' ? 1337 : 4242);
    return Array.from({ length: CRACKERS_PER_DOOR }, (_, i) => {
      const color = CRACKER_COLORS[Math.floor(rand() * CRACKER_COLORS.length)];
      const size = 0.7 + rand() * 0.6;
      const duration = 0.9 + rand() * 0.4;
      /* (i * 3) % N is a permutation → bursts hop around the door
         vertically instead of marching top-to-bottom */
      const band = ((i * 3) % CRACKERS_PER_DOOR) / CRACKERS_PER_DOOR;

      return {
        id: i,
        x: 12 + rand() * 76,
        y: 8 + band * 80 + rand() * 8,
        delay:
          (i / CRACKERS_PER_DOOR) * CRACKER_WINDOW +
          rand() * 0.25 +
          (side === 'right' ? 0.12 : 0),
        duration,
        color,
        size,
        sparks: Array.from({ length: SPARKS_PER_CRACKER }, (_, j) => ({
          id: j,
          angle: (360 / SPARKS_PER_CRACKER) * j + (rand() - 0.5) * 20,
          dist: (22 + rand() * 26) * size,
          life: duration * (0.8 + rand() * 0.3),
          color: rand() > 0.3 ? color : '#FFF6D8',
        })),
      };
    });
  }, [side]);

  return crackers.map((c) => (
    <div
      key={c.id}
      className="door-intro__cracker"
      style={{
        left: `${c.x.toFixed(1)}%`,
        top: `${c.y.toFixed(1)}%`,
        '--cracker-delay': `${c.delay.toFixed(2)}s`,
        '--cracker-duration': `${c.duration.toFixed(2)}s`,
        '--cracker-color': c.color,
        '--cracker-size': `${(16 * c.size).toFixed(1)}px`,
      }}
    >
      <span className="door-intro__cracker-flash" />
      <span className="door-intro__cracker-fall">
        {c.sparks.map((s) => (
          <span
            key={s.id}
            className="door-intro__cracker-spark"
            style={{
              '--spark-angle': `${s.angle.toFixed(1)}deg`,
              '--spark-dist': `${s.dist.toFixed(1)}px`,
              '--spark-life': `${s.life.toFixed(2)}s`,
              '--spark-color': s.color,
            }}
          />
        ))}
      </span>
    </div>
  ));
}

/* ─────────────────────────────────────────────
   MAIN LOADING SCREEN COMPONENT
   ───────────────────────────────────────────── */
const NEXT_PHASE = {
  [PHASES.CLOSED]: PHASES.ANTICIPATION,
  [PHASES.ANTICIPATION]: PHASES.OPENING,
  [PHASES.OPENING]: PHASES.REVEALING,
  [PHASES.REVEALING]: PHASES.FADE_OUT,
};

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState(PHASES.CLOSED);
  const { t } = useLanguage();
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  const doorsOpen = phase !== PHASES.CLOSED && phase !== PHASES.ANTICIPATION;

  /* Publish the current phase so the hero lamp can follow the doors */
  useEffect(() => {
    useUIStore.getState().setIntroPhase(phase);
  }, [phase]);

  /* Keep the page at the top while the doors are still closed / sliding,
     so the lamp's centred position stays accurate. Scrolling is released
     as soon as the doors are open so the site is usable straight away. */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollLocked = phase !== PHASES.REVEALING && phase !== PHASES.FADE_OUT;

  useEffect(() => {
    document.body.style.overflow = scrollLocked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [scrollLocked]);

  /* Phase timer: advance step by step, finish after the last phase */
  useEffect(() => {
    if (reducedMotion) {
      const id = setTimeout(onComplete, 100);
      return () => clearTimeout(id);
    }

    const id = setTimeout(() => {
      if (phase === PHASES.FADE_OUT) onComplete();
      else setPhase(NEXT_PHASE[phase]);
    }, TIMINGS[phase]);

    return () => clearTimeout(id);
  }, [phase, onComplete, reducedMotion]);

  /* Taps / double-taps are ignored on purpose, so the door-opening
     animation always plays through to the end. */

  return (
    <div
      className={`door-intro ${doorsOpen ? 'door-intro--passthrough' : ''}`}
      role="presentation"
      aria-label="Loading"
    >
      {/* ── Light leak along center seam (anticipation phase) ── */}
      <div
        className={`door-intro__light-leak ${
          phase === PHASES.ANTICIPATION ? 'door-intro__light-leak--visible' : ''
        }`}
      />

      {/* ── Container for sliding door panels ── */}
      <div className="door-intro__perspective">
        {/* ── LEFT DOOR PANEL ── */}
        <div
          className={`door-intro__panel door-intro__panel--left ${
            doorsOpen ? 'door-intro__panel--open' : ''
          }`}
        >
          {/*
            The door image left half.
            Using background-position to show the left 50% of the image.
          */}
          <div className="door-intro__panel-face door-intro__panel-face--left" />
          {/* Depth shadow that fades in while the door slides */}
          <div className="door-intro__panel-shadow" />
        </div>

        {/* ── RIGHT DOOR PANEL ── */}
        <div
          className={`door-intro__panel door-intro__panel--right ${
            doorsOpen ? 'door-intro__panel--open' : ''
          }`}
        >
          <div className="door-intro__panel-face door-intro__panel-face--right" />
          <div className="door-intro__panel-shadow" />

          {/* ── Brand board, attached to the right door ── */}
          <div className="door-intro__nameboard">
            <div className="door-intro__nameboard-inner">
              <img
                className="door-intro__nameboard-logo"
                src="/images/logo.webp"
                alt={t('loading.title')}
                width="640"
                height="573"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Center seam line where doors meet ── */}
      <div
        className={`door-intro__seam ${doorsOpen ? 'door-intro__seam--hidden' : ''}`}
      />

      {/* ── Firecracker bursts popping on the sliding doors ── */}
      <div
        className={`door-intro__crackers ${
          phase === PHASES.OPENING ? 'door-intro__crackers--active' : ''
        }`}
        aria-hidden="true"
      >
        <div
          className={`door-intro__cracker-half door-intro__cracker-half--left ${
            doorsOpen ? 'door-intro__cracker-half--open' : ''
          }`}
        >
          <DoorCrackers side="left" />
        </div>
        <div
          className={`door-intro__cracker-half door-intro__cracker-half--right ${
            doorsOpen ? 'door-intro__cracker-half--open' : ''
          }`}
        >
          <DoorCrackers side="right" />
        </div>
      </div>

      {/* ── Brief flash at the seam the moment the doors unlatch ── */}
      {phase === PHASES.OPENING && <div className="door-intro__flash" aria-hidden="true" />}
    </div>
  );
}
