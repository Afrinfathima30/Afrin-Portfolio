/**
 * three-character.js
 * Live 3D Walking Character — Peachweb.io Style
 *
 * Renders a fully-animated GLTF 3D character on a transparent canvas
 * overlay. She walks left ↔ right across the portfolio as the user scrolls.
 *
 * Model: Three.js "Soldier" GLB (public CDN) — has Walk / Idle / Run anims.
 * Canvas: fixed, full-screen, pointer-events none except on the character mesh.
 *
 * Architecture:
 *  ┌─ transparent fixed <canvas id="char3d-canvas"> over entire page ─┐
 *  │  Three.js scene (alpha bg)                                        │
 *  │   └─ character mesh (GLTF) — walks to target X/Y on screen       │
 *  └────────────────────────────────────────────────────────────────── ┘
 *  ┌─ DOM speech bubble <div id="char-speech"> tracks above canvas pos─┐
 *  └────────────────────────────────────────────────────────────────── ┘
 */

(function () {
  'use strict';

  /* ─── Section story ─────────────────────────────────────── */
  const SECTIONS = [
    { id: 'hero',        speech: "Hi! I'm Afrin Fathima 👋 Java Full Stack Developer & Capgemini National Winner!", side: 'right'  },
    { id: 'stats',       speech: "9.4 CGPA ✦ 3 Internships ✦ 4 Hackathons ✦ National Winner! 🏆",                  side: 'left'   },
    { id: 'about',       speech: "Final-year B.Tech IT at MSACE Chennai — building impactful software! 💻",          side: 'right'  },
    { id: 'skills',      speech: "Java ∙ Spring Boot ∙ React.js ∙ MySQL ∙ MongoDB — my core superpowers ⚡",         side: 'left'   },
    { id: 'process',     speech: "Discover → Architect → Build → Deploy — my 4-step engineering flow 🔄",            side: 'right'  },
    { id: 'projects',    speech: "D-Cure, Rural Portal & Alumni Hub — real products I shipped! 🚀",                  side: 'left'   },
    { id: 'experience',  speech: "Kaar Tech → Cognizant → CodeAlpha — my professional journey 💼",                   side: 'right'  },
    { id: 'achievements',speech: "National Winner — Capgemini Tech4Positive 2026! 🥇",                               side: 'left'   },
    { id: 'contact',     speech: "Let's connect & build something amazing together! ✉️",                             side: 'right'  }
  ];

  /* ─── State ─────────────────────────────────────────────── */
  let renderer, scene, camera, mixer, clock;
  let charGroup;                // pivot for the whole character
  let idleAction, walkAction;
  let currentAction = null;
  let currentSection = 0;

  // World-space positions (Three.js units) mapped from screen pixels
  let targetScreenX = 0;       // pixel position on screen we're aiming at
  let currentScreenX = 0;      // interpolated current pixel
  let charFacingRight = true;  // mirror flag

  let speechBubble, speechText;
  let speechTimeout;
  let speechVisible = false;

  // Height offset (above model) for speech bubble, updated each frame
  let charScreenTop = 0;
  let charScreenLeft = 0;

  const CHAR_HEIGHT_UNITS = 1.65; // approximate model height in Three.js units

  /* ─── GLTF model URL ────────────────────────────────────── */
  // Three.js Soldier model — has Walk/Idle/Run animations, public CDN
  const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';

  /* ─── Boot ──────────────────────────────────────────────── */
  window.init3DCharacter = function () {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded — 3D character skipped.');
      return;
    }
    buildCanvas();
    loadModel();
    buildSpeechBubble();
    startScrollObserver();
  };

  /* ─── 1. Build transparent Three.js canvas overlay ─────── */
  function buildCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'char3d-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 8500;
    `;
    document.body.appendChild(canvas);

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,         // transparent background — she floats ON the page
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);   // fully transparent

    scene = new THREE.Scene();

    // Camera: orthographic-ish perspective so character looks 2D-ish on page
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 200);
    camera.position.set(0, 1.2, 9);
    camera.lookAt(0, 1, 0);

    // Lighting — soft, matching page vibe (purple accent)
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(3, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Soft purple rim light
    const rimLight = new THREE.DirectionalLight(0xa855f7, 0.9);
    rimLight.position.set(-4, 4, -3);
    scene.add(rimLight);

    // Fill from below (bounce)
    const fillLight = new THREE.HemisphereLight(0xf3e8ff, 0x1e1b4b, 0.6);
    scene.add(fillLight);

    // Handle resize
    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
  }

  /* ─── 2. Load GLTF model ────────────────────────────────── */
  function loadModel() {
    // GLTFLoader is not in r128 global build — shim it inline via import map
    // Fallback: use THREE.ObjectLoader workaround or load via script tag
    loadGLTFLoaderScript(() => {
      const loader = new THREE.GLTFLoader();
      loader.load(
        MODEL_URL,
        (gltf) => onModelLoaded(gltf),
        (xhr) => { /* progress */ },
        (err) => { console.error('GLTF load error:', err); }
      );
    });
  }

  function loadGLTFLoaderScript(cb) {
    // THREE r128 global build doesn't include GLTFLoader — load it from CDN
    if (THREE.GLTFLoader) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
    s.onload = cb;
    s.onerror = () => {
      console.warn('GLTFLoader CDN failed — trying fallback');
      fallbackToCSS3DChar();
    };
    document.head.appendChild(s);
  }

  function onModelLoaded(gltf) {
    charGroup = gltf.scene;

    // Scale to reasonable size
    charGroup.scale.set(0.9, 0.9, 0.9);
    charGroup.position.set(3, 0, 0);  // start right side

    // Enable shadows & improve material quality
    charGroup.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = false;
        if (node.material) {
          node.material.envMapIntensity = 1.2;
        }
      }
    });

    scene.add(charGroup);

    // Animation mixer
    mixer = new THREE.AnimationMixer(charGroup);
    const anims = gltf.animations;
    console.log('Available animations:', anims.map(a => a.name));

    // Soldier.glb has: "Idle", "Walk", "Run", "TPose"
    const idleClip = THREE.AnimationClip.findByName(anims, 'Idle');
    const walkClip = THREE.AnimationClip.findByName(anims, 'Walk');

    if (idleClip) { idleAction = mixer.clipAction(idleClip); idleAction.play(); }
    if (walkClip) { walkAction = mixer.clipAction(walkClip); }

    currentAction = idleAction;

    // Initial position: right side of screen
    targetScreenX = window.innerWidth - 200;
    currentScreenX = targetScreenX;
    syncCharToScreenX();

    // Start render loop
    animate();

    // Intro — show hero speech
    setTimeout(() => showSpeech(SECTIONS[0].speech), 1200);
  }

  /* ─── 3. Render & walk loop ─────────────────────────────── */
  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    // Smoothly lerp character X toward target
    const lerpFactor = 0.045;
    const dist = Math.abs(targetScreenX - currentScreenX);
    const walking = dist > 10;

    // Switch walk ↔ idle animations
    if (walking && currentAction !== walkAction && walkAction) {
      fadeToAction(walkAction, 0.3);
    } else if (!walking && currentAction !== idleAction && idleAction) {
      fadeToAction(idleAction, 0.5);
    }

    currentScreenX += (targetScreenX - currentScreenX) * lerpFactor;
    syncCharToScreenX();

    // Update speech bubble DOM position every frame
    updateSpeechBubblePos();

    renderer.render(scene, camera);
  }

  function fadeToAction(newAction, dur) {
    if (currentAction && currentAction !== newAction) {
      currentAction.fadeOut(dur);
    }
    newAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(dur).play();
    currentAction = newAction;
  }

  /* ─── Convert screen pixel X → Three.js world X ─────────── */
  function syncCharToScreenX() {
    if (!charGroup || !camera || !renderer) return;

    // Map pixel X to world X via un-projection
    // NDC x: -1 (left edge) to +1 (right edge)
    const ndcX = (currentScreenX / window.innerWidth) * 2 - 1;

    // At y=0 world (feet level), find world X
    // Use camera FOV + distance to get world width at char depth
    const camDist = camera.position.z; // how far the camera is from z=0
    const vFOV = (camera.fov * Math.PI) / 180;
    const worldHeight = 2 * Math.tan(vFOV / 2) * camDist;
    const worldWidth  = worldHeight * camera.aspect;

    const worldX = ndcX * (worldWidth / 2);

    charGroup.position.x = worldX;

    // Mirror model left/right based on direction of movement
    const movingRight = targetScreenX > currentScreenX + 5;
    const movingLeft  = targetScreenX < currentScreenX - 5;
    if (movingRight && !charFacingRight) {
      charGroup.rotation.y = 0;
      charFacingRight = true;
    } else if (movingLeft && charFacingRight) {
      charGroup.rotation.y = Math.PI;
      charFacingRight = false;
    }

    // Compute screen-space position of head for speech bubble
    const headWorld = new THREE.Vector3(
      charGroup.position.x,
      charGroup.position.y + CHAR_HEIGHT_UNITS,
      charGroup.position.z
    );
    const projected = headWorld.clone().project(camera);
    charScreenLeft = ((projected.x + 1) / 2) * window.innerWidth;
    charScreenTop  = ((-projected.y + 1) / 2) * window.innerHeight;
  }

  /* ─── 4. Speech bubble (pure DOM, above head) ───────────── */
  function buildSpeechBubble() {
    const el = document.createElement('div');
    el.id = 'char-speech';
    el.innerHTML = `
      <div class="char-speech-inner"><p id="char-speech-text"></p></div>
      <div class="char-speech-tail"></div>
    `;
    el.classList.add('hidden');
    document.body.appendChild(el);
    speechBubble = el;
    speechText = document.getElementById('char-speech-text');
  }

  function updateSpeechBubblePos() {
    if (!speechBubble || speechBubble.classList.contains('hidden')) return;
    const bw = speechBubble.offsetWidth  || 200;
    const bh = speechBubble.offsetHeight || 80;
    speechBubble.style.left = `${Math.round(charScreenLeft - bw / 2)}px`;
    speechBubble.style.top  = `${Math.round(charScreenTop  - bh - 12)}px`;
  }

  function showSpeech(text) {
    if (!speechBubble || !speechText) return;
    speechText.innerText = text;
    speechBubble.classList.remove('hidden', 'char-speech-hide');
    speechBubble.classList.add('char-speech-show');
    speechVisible = true;
    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(hideSpeech, 5500);
  }

  function hideSpeech() {
    if (!speechBubble) return;
    speechBubble.classList.remove('char-speech-show');
    speechBubble.classList.add('char-speech-hide');
    speechVisible = false;
    setTimeout(() => {
      if (!speechVisible) speechBubble.classList.add('hidden');
    }, 400);
  }

  /* ─── 5. Scroll observer — move char each section ────────── */
  function startScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        const idx = SECTIONS.findIndex(s => s.id === id);
        if (idx !== -1 && idx !== currentSection) {
          currentSection = idx;
          moveTo(SECTIONS[idx]);
        }
      });
    }, { threshold: 0.35, rootMargin: '-5% 0px -20% 0px' });

    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
  }

  function moveTo(section) {
    const vw = window.innerWidth;
    // Alternate sides; right = far right, left = far left
    if (section.side === 'right') {
      targetScreenX = vw - 160;
    } else {
      targetScreenX = 110;
    }

    // Speech appears after she's (mostly) arrived
    clearTimeout(speechTimeout);
    hideSpeech();
    speechTimeout = setTimeout(() => showSpeech(section.speech), 900);
  }

  /* ─── 6. Fallback if GLTFLoader fails ───────────────────── */
  function fallbackToCSS3DChar() {
    console.warn('Falling back to CSS animated character');
    // Remove canvas, use the image-based walker from walkthrough.js
    const c = document.getElementById('char3d-canvas');
    if (c) c.remove();
    // walkthrough.js image walker will auto-activate (it's already loaded)
  }

  /* ─── Public API ─────────────────────────────────────────── */
  window.char3dSpeak = (text) => showSpeech(text);
  window.char3dMoveTo = (screenX) => { targetScreenX = screenX; };

})();
