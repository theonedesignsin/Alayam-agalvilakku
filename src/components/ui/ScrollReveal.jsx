import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/* ------------------------------------------------------------------
   Scroll Reveal — words fade in one by one as you scroll to them
   (the ReactBits "ScrollReveal" text effect, built on framer-motion).
   Opacity only on purpose: animating blur on every word made scrolling laggy.
   Splits on spaces, so Tamil text keeps its letters intact.
   ------------------------------------------------------------------ */

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity, display: 'inline-block', marginRight: '0.28em' }}>
      {word}
    </motion.span>
  );
}

export default function ScrollReveal({ children, as = 'p', className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.p;
  const text = String(children);
  const words = text.split(' ');

  // starts when the paragraph enters the lower part of the screen, finished by the middle
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'start 0.45'] });

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => {
        const start = (i / words.length) * 0.75;
        const end = start + 0.25;
        return <Word key={`${word}-${i}`} word={word} progress={scrollYProgress} range={[start, end]} />;
      })}
    </Tag>
  );
}
