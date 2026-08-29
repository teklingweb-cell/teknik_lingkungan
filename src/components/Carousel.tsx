'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Auto-advancing horizontal carousel.
 *
 * Built on native overflow scrolling with scroll-snap rather than a transform
 * track: touch swiping, momentum and keyboard scrolling then come from the
 * browser for free, and auto-advance is just a smooth scrollTo. How many cards
 * are visible is decided in CSS (1 on a phone, 2 on a tablet, `perView` on a
 * desktop), so there are no JS breakpoints to keep in sync with the stylesheet.
 *
 * Auto-advance pauses while the pointer is over the track, while anything
 * inside has focus, and for a moment after any manual scroll, so it never
 * fights the reader.
 */
export default function Carousel({
  children,
  interval = 4000,
  label,
  perView = 3,
  className = '',
}: {
  children: React.ReactNode[];
  /** Milliseconds between automatic advances. */
  interval?: number;
  /** Accessible name for the carousel region. */
  label: string;
  /** Cards visible at once on a desktop viewport. */
  perView?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [paused, setPaused] = useState(false);

  // The page we intend to be on. Kept in a ref as well as state so a click
  // decides the next target itself instead of waiting for a scroll event to
  // report back — scroll events are coalesced with rendering, so a burst of
  // clicks (or a background tab) would otherwise all compute from a stale page.
  const pageRef = useRef(0);

  // Manual scrolling wins: any user scroll holds the timer off briefly so an
  // auto-advance can't yank the track out from under a half-finished swipe.
  const holdUntil = useRef(0);

  // Scroll events are coalesced, so one can arrive after a programmatic move
  // reporting an intermediate position. Ignore them briefly so a stale reading
  // can't overwrite the page we just navigated to.
  const ignoreScrollUntil = useRef(0);

  // Pixels scrolled per page. Derived from the cards rather than from
  // clientWidth: the track carries padding so its hover shadows aren't
  // clipped, and paging off clientWidth drifts a few pixels each page and
  // invents a phantom trailing page.
  const stepRef = useRef(1);

  /** Which page is in view, treating "scrolled to the end" as the last one. */
  const pageFrom = useCallback((track: HTMLDivElement, pages: number) => {
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) return pages - 1;
    return Math.min(pages - 1, Math.max(0, Math.round(track.scrollLeft / stepRef.current)));
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const first = track.firstElementChild as HTMLElement | null;
    const itemWidth = first?.getBoundingClientRect().width ?? 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;

    let pages = 1;
    if (itemWidth > 0) {
      const perView = Math.max(1, Math.round((track.clientWidth + gap) / (itemWidth + gap)));
      stepRef.current = Math.max(1, perView * (itemWidth + gap));
      pages = Math.max(1, Math.ceil(track.children.length / perView));
    }

    setPageCount(pages);
    const current = Math.min(pageFrom(track, pages), pages - 1);
    pageRef.current = current;
    setPage(current);
  }, [pageFrom]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure, children.length]);

  const animRef = useRef<number | null>(null);

  /**
   * Scroll to a page, animated by hand.
   *
   * `scrollTo({behavior:'smooth'})` is not reliable here: a mandatory
   * scroll-snap container can cancel an in-flight smooth scroll and re-snap to
   * where it started, leaving the carousel frozen. Writing scrollLeft each
   * frame always lands, and snapping is switched off for the duration so it
   * cannot fight the tween.
   */
  const goTo = useCallback((target: number) => {
    const track = trackRef.current;
    if (!track) return;

    if (animRef.current !== null) cancelAnimationFrame(animRef.current);

    pageRef.current = target;
    setPage(target);

    const from = track.scrollLeft;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const to = Math.max(0, Math.min(target * stepRef.current, maxScroll));
    const distance = to - from;
    if (Math.abs(distance) < 1) return;

    // Snapping is switched off for the whole of a programmatic scroll, instant
    // or animated. A mandatory snap container remembers the element it last
    // snapped to and re-applies it when the scroll position or layout changes,
    // which drags a backwards jump straight back to where it came from.
    track.classList.add('is-scrolling');
    ignoreScrollUntil.current = Date.now() + 400;
    const releaseSnap = () => {
      window.setTimeout(() => track.classList.remove('is-scrolling'), 160);
    };

    // requestAnimationFrame is frozen in a background tab, and an animation is
    // pointless under reduced-motion — in both cases land on the page directly
    // rather than starting a tween that would never finish.
    if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.scrollLeft = to;
      releaseSnap();
      return;
    }

    const started = performance.now();
    const duration = 420;

    const frame = (now: number) => {
      const p = Math.min(1, (now - started) / duration);
      // easeInOutQuad
      const eased = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      track.scrollLeft = from + distance * eased;

      if (p < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        animRef.current = null;
        releaseSnap();
      }
    };
    animRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(
    () => () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    },
    []
  );

  useEffect(() => {
    if (paused || pageCount < 2) return;

    const id = window.setInterval(() => {
      if (Date.now() < holdUntil.current) return;
      const track = trackRef.current;
      if (!track) return;
      goTo((pageRef.current + 1) % pageCount);
    }, interval);

    return () => window.clearInterval(id);
  }, [paused, pageCount, interval, goTo]);

  return (
    <div
      className={`carousel${className ? ' ' + className : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="carousel-track"
        ref={trackRef}
        style={{ ['--per-lg' as string]: perView }}
        onScroll={() => {
          const track = trackRef.current;
          if (!track) return;
          // Frames of our own scrolling are not a reader reaching for the
          // track; only a real swipe or wheel resets the page we think we
          // are on.
          if (track.classList.contains('is-scrolling')) return;
          if (Date.now() < ignoreScrollUntil.current) return;
          holdUntil.current = Date.now() + 1200;
          const current = pageFrom(track, pageCount);
          pageRef.current = current;
          setPage(current);
        }}
        onPointerDown={() => {
          holdUntil.current = Date.now() + 4000;
        }}
      >
        {children.map((child, i) => (
          <div className="carousel-item" key={i}>
            {child}
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-arrow"
            aria-label="Sebelumnya"
            onClick={() => goTo((pageRef.current - 1 + pageCount) % pageCount)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="carousel-dots">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                type="button"
                key={i}
                className={`carousel-dot${i === page ? ' active' : ''}`}
                aria-label={`Ke halaman ${i + 1}`}
                aria-current={i === page || undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="carousel-arrow"
            aria-label="Berikutnya"
            onClick={() => goTo((pageRef.current + 1) % pageCount)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
