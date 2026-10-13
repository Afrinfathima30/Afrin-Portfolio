// Interactive Magnetic Custom Cursor with Sparkle Particles

window.initCustomCursor = function() {
  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursorDot);

  const cursorRing = document.createElement('div');
  cursorRing.className = 'custom-cursor-ring';
  document.body.appendChild(cursorRing);

  // Check if touch device
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  // Hover states on interactive elements
  const hoverSelectors = 'a, button, [role="button"], input, textarea, select, .interactive-card, .skill-pill, .badge-3d, .project-card, .glass-card';

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverSelectors);
    if (target) {
      cursorRing.classList.add('cursor-hover');
      cursorDot.classList.add('cursor-dot-hover');

      if (target.dataset.cursor) {
        cursorRing.setAttribute('data-cursor-text', target.dataset.cursor);
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverSelectors);
    if (target) {
      cursorRing.classList.remove('cursor-hover');
      cursorDot.classList.remove('cursor-dot-hover');
      cursorRing.removeAttribute('data-cursor-text');
    }
  });

  document.addEventListener('mousedown', () => {
    cursorRing.classList.add('cursor-click');
  });

  document.addEventListener('mouseup', () => {
    cursorRing.classList.remove('cursor-click');
  });
};
