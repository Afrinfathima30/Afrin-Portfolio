/**
 * walkthrough.js — Portfolio Coordinator
 * Handles: preloader, hero morph, scroll section tracking.
 * The actual walking character is in three-character.js (Three.js GLTF).
 */
(function () {
  'use strict';

  const SECTIONS = [
    { id: 'hero',         speech: "Hi! I'm Afrin Fathima 👋 Java Full Stack Developer & Capgemini National Winner!" },
    { id: 'stats',        speech: "9.4 CGPA ✦ 3 Internships ✦ 4 Hackathons ✦ National Winner! 🏆" },
    { id: 'about',        speech: "Final-year B.Tech IT at MSACE Chennai — building impactful software! 💻" },
    { id: 'skills',       speech: "Java ∙ Spring Boot ∙ React.js ∙ MySQL ∙ MongoDB — my core superpowers ⚡" },
    { id: 'process',      speech: "Discover → Architect → Build → Deploy — my 4-step engineering flow 🔄" },
    { id: 'projects',     speech: "D-Cure, Rural Portal & Alumni Hub — real products I shipped! 🚀" },
    { id: 'experience',   speech: "Kaar Tech → Cognizant → CodeAlpha — my professional journey 💼" },
    { id: 'achievements', speech: "National Winner — Capgemini Tech4Positive 2026! 🥇" },
    { id: 'contact',      speech: "Let's connect & build something amazing together! ✉️" }
  ];

  let heroTransformed = false;

  /* ─── Preloader ─────────────────────────────────────────── */
  function initPreloader() {
    const preloader = document.getElementById('preloader-screen');
    if (!preloader) return;

    const bar       = document.getElementById('preloader-progress-bar');
    const pct       = document.getElementById('preloader-percent');
    const statusEl  = document.getElementById('preloader-status-text');
    const enterBtn  = document.getElementById('preloader-enter-btn');
    const skipBtn   = document.getElementById('preloader-skip-btn');

    const logs = [
      "Booting Afrin's Developer Space...",
      "Loading Java Full Stack modules...",
      "Initialising 3D character engine...",
      "Loading Capgemini Winner showcase...",
      "Afrin Fathima is ready to guide you! ✨"
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 9) + 4;
      if (progress > 100) progress = 100;
      if (bar) bar.style.width = `${progress}%`;
      if (pct) pct.innerText = `${progress}%`;
      const logIdx = Math.min(Math.floor((progress / 100) * logs.length), logs.length - 1);
      if (statusEl) statusEl.innerText = logs[logIdx];
      if (progress >= 100) {
        clearInterval(interval);
        if (enterBtn) enterBtn.classList.remove('hidden');
        setTimeout(() => {
          if (!preloader.classList.contains('preloader-hidden')) dismissPreloader();
        }, 900);
      }
    }, 50);

    enterBtn && enterBtn.addEventListener('click', dismissPreloader);
    skipBtn  && skipBtn.addEventListener('click', () => { clearInterval(interval); dismissPreloader(); });
  }

  function dismissPreloader() {
    const preloader = document.getElementById('preloader-screen');
    if (!preloader || preloader.classList.contains('preloader-hidden')) return;
    preloader.classList.add('preloader-fade-out');
    setTimeout(() => {
      preloader.classList.add('preloader-hidden');
      preloader.style.display = 'none';
      triggerHeroOpening();
    }, 700);
  }

  /* ─── Hero Sitting → Standing ───────────────────────────── */
  function triggerHeroOpening() {
    if (heroTransformed) return;
    heroTransformed = true;

    const sitting    = document.getElementById('hero-character-sitting');
    const standing   = document.getElementById('hero-character-standing');
    const speechCard = document.getElementById('hero-intro-speech-card');

    setTimeout(() => {
      if (sitting && standing) {
        sitting.style.opacity  = '0';
        standing.style.opacity = '1';
      }
      if (speechCard) {
        speechCard.classList.remove('hidden');
        speechCard.classList.add('animate-pop-in');
        const textEl = document.getElementById('hero-speech-text');
        if (textEl) typewriter(textEl, SECTIONS[0].speech);
      }

      // Boot the 3D walking character (three-character.js)
      if (window.init3DCharacter) window.init3DCharacter();

    }, 900);
  }

  /* ─── Typewriter ─────────────────────────────────────────── */
  function typewriter(el, text) {
    if (!el) return;
    if (el._tw) clearInterval(el._tw);
    el.innerText = '';
    let i = 0;
    el._tw = setInterval(() => {
      if (i < text.length) el.innerText += text[i++];
      else clearInterval(el._tw);
    }, 14);
  }

  /* ─── Global API ─────────────────────────────────────────── */
  window.startGuidedTour = () => {
    const el = document.getElementById(SECTIONS[1].id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.speakHeroIntro = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(SECTIONS[0].speech);
    u.rate = 1.0; u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  };

  /* ─── Boot ──────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', initPreloader);

})();
