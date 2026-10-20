import { useRef, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import './GooeyNav.css';

/* ------------------------------------------------------------------
   Gooey Nav — from ReactBits (reactbits.dev, MIT).
   Changes from the original:
   - it is driven by the current page (activeIndex prop) instead of its own click state,
     so the gooey pill + bubbles play whenever the page/section changes, however you got there
   - items are router <Link>s (to="/products") instead of plain href links
   - timers are cleaned up on unmount; bubbles are skipped for "reduce motion"
   ------------------------------------------------------------------ */

export default function GooeyNav({
  items,
  activeIndex,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  label = 'Main navigation',
}) {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const timers = useRef([]);
  const prevIndex = useRef(null);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  const makeParticles = (element) => {
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, particleDistances, particleR);
      element.classList.remove('active');

      later(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => element.classList.add('active'));
        later(() => {
          try {
            element.removeChild(particle);
          } catch {
            /* already removed */
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element) => {
    if (!containerRef.current || !filterRef.current || !textRef.current || !element) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const activeLi = () => navRef.current?.querySelectorAll('li')[activeIndex];
  const labelKey = items.map((i) => i.label).join('|');

  // Move the pill to the active item; play the gooey burst when the page changes
  useLayoutEffect(() => {
    const li = activeLi();
    if (!li || activeIndex < 0) {
      prevIndex.current = activeIndex;
      return;
    }
    updateEffectPosition(li);

    const changed = prevIndex.current !== null && prevIndex.current !== activeIndex;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (changed && filterRef.current && textRef.current) {
      filterRef.current.querySelectorAll('.particle').forEach((p) => filterRef.current.removeChild(p));
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth; // restart the CSS animation
      textRef.current.classList.add('active');
      if (!reduce) makeParticles(filterRef.current);
      else filterRef.current.classList.add('active');
    } else {
      textRef.current?.classList.add('active');
      filterRef.current?.classList.add('active');
    }
    prevIndex.current = activeIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, labelKey]);

  // Keep the pill aligned if the nav resizes (window resize, language switch, fonts loading)
  useEffect(() => {
    if (!containerRef.current) return undefined;
    const ro = new ResizeObserver(() => updateEffectPosition(activeLi()));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, labelKey]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div className={`gooey-nav-container ${activeIndex < 0 ? 'gooey-nav--none' : ''}`} ref={containerRef}>
      <nav aria-label={label}>
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={item.to} className={activeIndex === index ? 'active' : ''}>
              <Link to={item.to} aria-current={activeIndex === index ? 'page' : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="gooey-nav-goo" x="-300%" y="-600%" width="700%" height="1300%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
          </filter>
        </defs>
      </svg>
      <span className="effect filter" ref={filterRef} aria-hidden="true" />
      <span className="effect text" ref={textRef} aria-hidden="true" />
    </div>
  );
}
