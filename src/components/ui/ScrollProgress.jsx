import { motion, useScroll, useSpring } from 'framer-motion';

/* Thin gold bar at the very top that fills as you scroll down the page */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        transformOrigin: '0 50%',
        background: 'linear-gradient(90deg, #8A6D3B, #E0C26A, #FFF3D6)',
        boxShadow: '0 0 10px rgba(224, 194, 106, 0.7)',
        zIndex: 120,
        pointerEvents: 'none',
      }}
    />
  );
}
