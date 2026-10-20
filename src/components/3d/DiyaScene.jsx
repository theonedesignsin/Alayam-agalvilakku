import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { TOUCH } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import DiyaLamp from './DiyaLamp';

const CAMERA = { position: [0, 2.3, 5.8], fov: 36 };
const TARGET = [0.55, 0.55, 0]; // nudged so the lamp and its glow sit inside the canvas

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/* Drag-to-rotate (mouse and touch) + slow auto-rotate (three's own OrbitControls, no extra library) */
function Controls({ enabled, autoRotate, touch }) {
  const camera = useThree((state) => state.camera);
  const domElement = useThree((state) => state.gl.domElement);

  const controls = useMemo(() => {
    const instance = new OrbitControls(camera, domElement);
    instance.target.set(...TARGET);
    instance.enablePan = false;
    instance.enableZoom = false; // keep page scrolling when the pointer is over the lamp
    instance.enableDamping = true;
    instance.autoRotateSpeed = 1.2;
    instance.minPolarAngle = 0.25;
    instance.maxPolarAngle = 1.55;
    return instance;
  }, [camera, domElement]);

  useEffect(() => () => controls.dispose(), [controls]);

  useEffect(() => {
    controls.enabled = enabled;
    controls.autoRotate = autoRotate;

    if (touch) {
      /* Phones: swipe left/right to spin the lamp with one finger, while a vertical
         swipe still scrolls the page. Vertical tilt is locked so the lamp only turns
         around, never flips, and the two-finger gesture is left to the browser. */
      controls.update();
      const polar = controls.getPolarAngle();
      controls.minPolarAngle = polar;
      controls.maxPolarAngle = polar;
      controls.touches = { ONE: TOUCH.ROTATE, TWO: null };
      domElement.style.touchAction = 'pan-y';
    } else {
      domElement.style.touchAction = enabled ? 'none' : 'pan-y';
    }
  }, [controls, enabled, autoRotate, touch, domElement]);

  useFrame(() => controls.update());

  return null;
}

export default function DiyaScene({ className = '', lit = true }) {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(true);

  /* Evaluated once */
  const [env] = useState(() => ({
    webGL: isWebGLAvailable(),
    touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));

  /* Stop rendering while the hero is scrolled out of view */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!env.webGL) {
    return <div className={`diya-fallback ${className}`} aria-hidden="true" />;
  }

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative', touchAction: 'pan-y' }}
      aria-hidden="true"
    >
      <Canvas
        camera={CAMERA}
        frameloop={inView ? 'always' : 'never'}
        /* measure layout size (ignores the intro's CSS scale) and don't re-measure on every scroll */
        resize={{ offsetSize: true, scroll: false }}
        dpr={[1, env.touch ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', cursor: 'grab' }}
      >
        <hemisphereLight args={['#ffd9a8', '#3a1406', 0.9]} />
        <directionalLight position={[-3, 5, 4]} intensity={1.4} color="#ffe3bd" />
        <DiyaLamp reduce={env.reduce} lit={lit} />
        {/* mouse: drag any direction; phones: swipe sideways to turn the lamp, swipe up/down to scroll */}
        <Controls enabled touch={env.touch} autoRotate={!env.reduce} />
      </Canvas>
    </div>
  );
}
