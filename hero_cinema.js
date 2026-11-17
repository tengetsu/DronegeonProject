/* RusTrata | Hero image -> cinematic video -> Hero image.
   Page load: 20 s of original Hero, then play the entire supplied video once.
   Movie ended: transition back to the unfiltered original Hero, keep it for
   another 20 s and repeat. Audio stays muted for standards-compliant autoplay.
   Do not add loop to the video element: its ended event controls the cycle. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero-outer > .hero');
  const video = document.getElementById('hero-cinema-video');
  if (!hero || !video) return;

  const STILL_DURATION_MS = 20000;
  const FADE_DURATION_MS = 720;
  const START_WATCHDOG_MS = 12000;
  let nextTimer = null;
  let fadeTimer = null;
  let watchdog = null;
  let phase = 'image';

  function clearTimers() {
    if (nextTimer !== null) { clearTimeout(nextTimer); nextTimer = null; }
    if (fadeTimer !== null) { clearTimeout(fadeTimer); fadeTimer = null; }
    if (watchdog !== null) { clearTimeout(watchdog); watchdog = null; }
  }
  function scheduleNext() {
    phase = 'image';
    nextTimer = setTimeout(beginMovie, STILL_DURATION_MS);
  }
  function restoreHero() {
    if (phase === 'image' || phase === 'returning') return;
    clearTimers();
    phase = 'returning';
    hero.classList.remove('hero-cinema-active');
    video.pause();
    fadeTimer = setTimeout(() => {
      fadeTimer = null;
      try { video.currentTime = 0; } catch (_) { /* not yet seekable */ }
      scheduleNext();
    }, FADE_DURATION_MS);
  }
  function revealMovie() {
    if (phase !== 'starting') return;
    if (watchdog !== null) { clearTimeout(watchdog); watchdog = null; }
    phase = 'playing';
    hero.classList.add('hero-cinema-active');
  }
  function beginMovie() {
    nextTimer = null;
    if (phase !== 'image') return;
    phase = 'starting';
    // Autoplay with sound is blocked by modern browsers; keep it muted.
    video.muted = true;
    video.playsInline = true;
    try { video.currentTime = 0; } catch (_) { /* not seekable until loaded */ }
    watchdog = setTimeout(() => {
      if (phase === 'starting') restoreHero();
    }, START_WATCHDOG_MS);
    try {
      const playback = video.play();
      if (playback && typeof playback.catch === 'function') {
        playback.catch(() => {
          // If the browser disallows autoplay or there is a network failure,
          // show the original Hero and retry after the next still interval.
          if (phase === 'starting') restoreHero();
        });
      }
    } catch (_) {
      restoreHero();
    }
  }
  video.addEventListener('playing', revealMovie);
  video.addEventListener('ended', restoreHero);
  video.addEventListener('error', restoreHero);

  // The timer starts when the site script initializes, not when the video
  // downloads or finishes buffering. The film only becomes visible once ready.
  scheduleNext();

  // Development-only hooks for screenshot/timing verification.
  if (new URLSearchParams(location.search).has('hero_cinema_debug')) {
    window.__rustrataHeroCinemaTest = { beginMovie, restoreHero, getPhase: () => phase };
  }
})();
