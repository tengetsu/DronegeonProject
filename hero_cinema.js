/* RusTrata | Hero image -> cinematic video -> Hero image.
   Page load: 20 s of original Hero, then play the entire supplied video once.
   Movie ended: transition back to the unfiltered original Hero, keep it for
   another 20 s and repeat. Audio stays muted for standards-compliant autoplay.
   Do not add loop to the video element: its ended event controls the cycle. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero-outer > .hero');
  const video = document.getElementById('hero-cinema-video');
  const image = hero?.querySelector('.hero-image');
  const layer = hero?.querySelector('.hero-cinema');
  if (!hero || !video || !image || !layer) return;

  // Match the exact portrait/landscape Hero image rectangle on touch devices.
  // The original image's CSS positions it near the top of the entire Hero,
  // while the login card increases the section's overall height.
  const touchStage = window.matchMedia('(pointer: coarse) and (max-width: 1000px)');
  function alignMovieWithHeroImage() {
    if (!touchStage.matches) {
      layer.style.removeProperty('top');
      layer.style.removeProperty('left');
      layer.style.removeProperty('right');
      layer.style.removeProperty('bottom');
      layer.style.removeProperty('width');
      layer.style.removeProperty('height');
      return;
    }
    const heroRect = hero.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    // Bounding boxes include page-scale transforms. Convert to the section's
    // own CSS coordinate system, including the 1920px-based tablet scaling.
    const scaleX = heroRect.width / (hero.offsetWidth || heroRect.width || 1);
    const scaleY = heroRect.height / (hero.offsetHeight || heroRect.height || 1);
    layer.style.left = `${(imageRect.left - heroRect.left) / scaleX}px`;
    layer.style.top = `${(imageRect.top - heroRect.top) / scaleY}px`;
    layer.style.width = `${imageRect.width / scaleX}px`;
    layer.style.height = `${imageRect.height / scaleY}px`;
    layer.style.right = 'auto';
    layer.style.bottom = 'auto';
  }
  alignMovieWithHeroImage();
  window.addEventListener('resize', alignMovieWithHeroImage, {passive:true});
  window.addEventListener('orientationchange', alignMovieWithHeroImage, {passive:true});
  if (window.ResizeObserver) {
    const movieObserver = new ResizeObserver(alignMovieWithHeroImage);
    movieObserver.observe(hero);
    movieObserver.observe(image);
  }
  image.addEventListener('load', alignMovieWithHeroImage, {once:true});

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
    alignMovieWithHeroImage();
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
