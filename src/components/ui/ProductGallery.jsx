import { useCallback, useEffect, useRef, useState } from 'react';

/*
  Swipeable product gallery.
  - Native scroll-snap: smooth finger swipe on phones/tablets, trackpad on laptops.
  - Arrow buttons (desktop), dots and thumbnails all move the same track.
  - With only one image the dots, arrows and thumbnails are hidden, so a product
    without a size chart looks exactly like before.
  images: [{ src, alt, label? }]  (first = main image)
*/
export default function ProductGallery({ images, width = 1024, height = 1024 }) {
  const trackRef = useRef(null);
  const frame = useRef(0);
  const [index, setIndex] = useState(0);
  const count = images.length;
  const multi = count > 1;

  const goTo = useCallback((i) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(count - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    setIndex(next);
  }, [count]);

  /* Keep the dots / thumbnails in sync while the user swipes */
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = trackRef.current;
      if (!el || !el.clientWidth) return;
      setIndex(Math.round(el.scrollLeft / el.clientWidth));
    });
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  /* Back to the main image when another product is opened */
  const firstSrc = images[0]?.src;
  useEffect(() => {
    setIndex(0);
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  }, [firstSrc]);

  /* Keep the current slide in place if the window is resized / phone rotated */
  useEffect(() => {
    const onResize = () => {
      const el = trackRef.current;
      if (el) el.scrollLeft = index * el.clientWidth;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [index]);

  const onKeyDown = (e) => {
    if (!multi) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
  };

  return (
    <div className="pgallery">
      <div className="product-detail__image-wrap pgallery__frame">
        <div
          className="pgallery__track"
          ref={trackRef}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          tabIndex={multi ? 0 : -1}
          role="group"
          aria-roledescription="carousel"
          aria-label="Product images"
        >
          {images.map((img, i) => (
            <div className="pgallery__slide" key={img.src} aria-hidden={i !== index}>
              <img
                src={img.src}
                alt={img.alt}
                className="product-detail__image pgallery__img"
                width={width}
                height={height}
                decoding="async"
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable="false"
              />
            </div>
          ))}
        </div>

        {multi && (
          <>
            <button
              type="button"
              className="pgallery__arrow pgallery__arrow--prev"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              type="button"
              className="pgallery__arrow pgallery__arrow--next"
              onClick={() => goTo(index + 1)}
              disabled={index === count - 1}
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <div className="pgallery__dots" role="tablist" aria-label="Choose image">
              {images.map((img, i) => (
                <button
                  type="button"
                  key={img.src}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show image ${i + 1} of ${count}`}
                  className={`pgallery__dot ${i === index ? 'pgallery__dot--active' : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {multi && (
        <div className="pgallery__thumbs">
          {images.map((img, i) => (
            <button
              type="button"
              key={img.src}
              className={`pgallery__thumb ${i === index ? 'pgallery__thumb--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={img.label || `Image ${i + 1}`}
              aria-current={i === index}
            >
              <img src={img.src} alt="" loading="lazy" decoding="async" draggable="false" />
              {img.label && <span className="pgallery__thumb-label">{img.label}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
