// Main Application Controller

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Background & Interactions
  if (window.initThreeUniverse) window.initThreeUniverse();
  if (window.initCustomCursor) window.initCustomCursor();
  if (window.initModals) window.initModals();

  // 2. Render Dynamic Content
  renderSkills('all');
  renderProcess();
  renderProjects();
  renderExperience();
  renderHackathons();
  renderCertifications();

  // 3. Initialize UI Interactivity & Listeners
  initNavigation();
  initAudioToggle();
  initScrollAnimations();
  initStatsCounter();
  initSkillFilters();
  initTiltEffects();
  initEasterEggs();

  // 4. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Render Skills
function renderSkills(categoryFilter = 'all') {
  const container = document.getElementById('skills-grid-container');
  if (!container || !window.skillsData) return;

  let allItems = [];
  if (categoryFilter === 'all') {
    window.skillsData.forEach(cat => {
      allItems.push(...cat.items.map(item => ({ ...item, category: cat.category })));
    });
  } else {
    const cat = window.skillsData.find(c => c.category === categoryFilter);
    if (cat) {
      allItems = cat.items.map(item => ({ ...item, category: cat.category }));
    }
  }

  container.innerHTML = allItems.map((skill) => `
    <div class="glass-card p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer group hover:border-purple-300 hover:shadow-lg transition-all duration-300 skill-pill" data-skill-name="${skill.name}" data-skill-desc="${skill.relation}">
      <div class="w-12 h-12 rounded-xl bg-purple-50/80 p-2.5 mb-2.5 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300 shadow-inner">
        <img src="${skill.icon}" alt="${skill.name}" class="w-full h-full object-contain pointer-events-none" onerror="this.src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'">
      </div>
      <h4 class="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">${skill.name}</h4>
      <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
        <div class="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700" style="width: ${skill.level}%"></div>
      </div>
      <span class="text-[10px] text-slate-400 mt-1 font-medium">${skill.level}% Proficiency</span>
    </div>
  `).join('');

  // Skill Card Hover Detail Listener
  container.querySelectorAll('.skill-pill').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (window.soundManager) window.soundManager.playHover();
      const name = card.getAttribute('data-skill-name');
      const desc = card.getAttribute('data-skill-desc');
      const titleEl = document.getElementById('skill-detail-title');
      const descEl = document.getElementById('skill-detail-desc');
      if (titleEl && descEl) {
        titleEl.innerText = name;
        descEl.innerText = desc;
      }
    });
  });
}

// Render "How an Idea Becomes a Product" Process
function renderProcess() {
  const container = document.getElementById('process-grid-container');
  if (!container || !window.processData) return;

  container.innerHTML = window.processData.map((step) => `
    <div class="glass-card p-6 rounded-2xl border border-purple-100/90 shadow-md hover:border-purple-300 group transition-all duration-300 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xl font-extrabold text-purple-200 group-hover:text-purple-600 transition-colors font-mono">${step.step}</span>
          <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner">
            <i data-lucide="${step.icon}" class="w-5 h-5"></i>
          </div>
        </div>
        <h4 class="text-base font-extrabold text-slate-900 mb-1">${step.title}</h4>
        <p class="text-[11px] font-bold text-purple-600 mb-2">${step.subtitle}</p>
        <p class="text-xs text-slate-600 leading-relaxed">${step.desc}</p>
      </div>
      <div class="pt-4 mt-2 border-t border-slate-100/80 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 group-hover:text-purple-600 transition-colors">
        <span>Continuous Polish</span>
        <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
      </div>
    </div>
  `).join('');
}

// Render Featured Projects
function renderProjects() {
  const container = document.getElementById('projects-grid-container');
  if (!container || !window.projectsData) return;

  container.innerHTML = window.projectsData.map((project) => `
    <div class="glass-card rounded-3xl overflow-hidden border border-purple-100 shadow-xl group hover:border-purple-300 transition-all duration-500 flex flex-col justify-between tilt-card" data-tilt data-tilt-max="5" data-tilt-speed="600">
      
      <!-- Project Image Preview -->
      <div class="relative overflow-hidden h-56 sm:h-64 bg-slate-100">
        <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80"></div>
        
        <!-- Top Badge -->
        <div class="absolute top-4 left-4 z-10">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-purple-700 shadow-md backdrop-blur-sm border border-purple-200/80">
            ${project.badge}
          </span>
        </div>

        <!-- Bottom Number -->
        <div class="absolute bottom-4 right-4 z-10 text-3xl font-black text-white/80 font-mono">
          ${project.number}
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
        <div>
          <h3 class="text-xl font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
            ${project.title}
          </h3>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            ${project.shortDesc}
          </p>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5 pt-1">
          ${project.tags.map(tag => `
            <span class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600 group-hover:bg-purple-50 group-hover:text-purple-700 transition-colors">
              ${tag}
            </span>
          `).join('')}
        </div>

        <!-- Footer CTA -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button class="text-xs font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1.5 group/btn" onclick="window.openProjectModal('${project.id}')">
            <span>Explore Project & Deep Dive</span>
            <i data-lucide="arrow-right" class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"></i>
          </button>
          
          <span class="text-[11px] text-slate-400 font-medium">${project.isHero ? '⭐ Hero Feature' : 'Interactive'}</span>
        </div>

      </div>

    </div>
  `).join('');
}

// Render Experience Timeline
function renderExperience() {
  const container = document.getElementById('experience-timeline-container');
  if (!container || !window.experienceData) return;

  container.innerHTML = window.experienceData.map((exp) => `
    <div class="relative flex flex-col md:flex-row items-start gap-6 p-6 rounded-3xl glass-card border border-purple-100 shadow-lg hover:border-purple-300 transition-all">
      
      <!-- Node Badge -->
      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${exp.color} text-white flex items-center justify-center font-bold text-base shadow-md flex-shrink-0 z-10">
        <i data-lucide="${exp.icon}" class="w-6 h-6"></i>
      </div>

      <!-- Experience Details -->
      <div class="flex-1 space-y-2 text-left">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 class="text-base font-extrabold text-slate-900">${exp.role}</h3>
            <p class="text-xs font-bold text-purple-600">${exp.company} <span class="text-slate-400 font-normal">• ${exp.location}</span></p>
          </div>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 w-fit">
            ${exp.period}
          </span>
        </div>

        <ul class="text-xs text-slate-600 space-y-1.5 list-disc list-inside pt-1">
          ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>

        <div class="flex flex-wrap gap-1.5 pt-2">
          ${exp.tech.map(t => `
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
              ${t}
            </span>
          `).join('')}
        </div>
      </div>

    </div>
  `).join('');
}

// Render Hackathons Collectibles
function renderHackathons() {
  const container = document.getElementById('hackathons-grid-container');
  if (!container || !window.hackathonsData) return;

  container.innerHTML = window.hackathonsData.map((hack) => `
    <div class="glass-card p-6 rounded-2xl border border-purple-100 shadow-md hover:border-purple-300 group transition-all duration-300 flex flex-col justify-between tilt-card" data-tilt data-tilt-max="8">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">${hack.year}</span>
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr ${hack.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <i data-lucide="${hack.badgeIcon}" class="w-4 h-4"></i>
          </div>
        </div>
        <h4 class="text-sm font-extrabold text-slate-900 mb-0.5">${hack.title}</h4>
        <p class="text-xs font-bold text-purple-600 mb-2">${hack.project}</p>
        <p class="text-xs text-slate-600 leading-relaxed">${hack.description}</p>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span> ${hack.status}
        </span>
        <span class="text-purple-600 group-hover:translate-x-0.5 transition-transform">Verified ✦</span>
      </div>
    </div>
  `).join('');
}

// Render Certifications
function renderCertifications() {
  const container = document.getElementById('certifications-grid-container');
  if (!container || !window.certificationsData) return;

  container.innerHTML = window.certificationsData.map((cert) => `
    <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:bg-white transition-all flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
        <i data-lucide="${cert.icon}" class="w-4 h-4"></i>
      </div>
      <div class="text-left">
        <p class="text-xs font-bold text-slate-800">${cert.title}</p>
        <p class="text-[10px] text-slate-500">${cert.issuer}</p>
      </div>
    </div>
  `).join('');
}

// Navigation & Active Link Highlight
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      if (window.soundManager) window.soundManager.playPop();
      mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // ScrollSpy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('bg-purple-600', 'text-white');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('bg-purple-600', 'text-white');
        link.classList.remove('text-slate-600');
      }
    });
  }, { passive: true });
}

// Audio Toggle Button
function initAudioToggle() {
  const btn = document.getElementById('sound-toggle-btn');
  const icon = document.getElementById('sound-icon');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!window.soundManager) return;
    const isMuted = window.soundManager.toggleMute();
    if (isMuted) {
      icon.setAttribute('data-lucide', 'volume-x');
      btn.classList.add('bg-slate-100', 'text-slate-400');
      btn.classList.remove('bg-purple-50', 'text-purple-700');
    } else {
      icon.setAttribute('data-lucide', 'volume-2');
      btn.classList.remove('bg-slate-100', 'text-slate-400');
      btn.classList.add('bg-purple-50', 'text-purple-700');
      window.soundManager.playPop();
    }
    if (window.lucide) window.lucide.createIcons();
  });
}

// Scroll Reveal Animations
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
}

// Animated Stats Counter
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const suffix = counter.getAttribute('data-suffix') || '';
          const isDecimal = counter.getAttribute('data-decimal') === 'true';

          let start = 0;
          const duration = 1500;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              counter.innerText = (isDecimal ? target.toFixed(1) : Math.floor(target)) + suffix;
              clearInterval(timer);
            } else {
              counter.innerText = (isDecimal ? start.toFixed(1) : Math.floor(start)) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

// Skill Filter Tabs
function initSkillFilters() {
  const tabs = document.querySelectorAll('#skill-category-tabs .filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (window.soundManager) window.soundManager.playPop();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category');
      renderSkills(cat);
      if (window.lucide) window.lucide.createIcons();
    });
  });
}

// Initialize Tilt Effects on Cards
function initTiltEffects() {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max: 6,
      speed: 400,
      glare: true,
      "max-glare": 0.15,
      scale: 1.02
    });
  }
}

// Easter Eggs (Logo Click Confetti & Konami Code Listener)
function initEasterEggs() {
  let logoClicks = 0;
  const logo = document.getElementById('brand-logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      logoClicks++;
      if (window.soundManager) window.soundManager.playPop();

      if (logoClicks >= 3) {
        if (window.soundManager) window.soundManager.playEasterEgg();
        if (window.confetti) {
          window.confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.1 }
          });
        }
        logoClicks = 0;
      }
    });
  }

  // Konami Code Sequence: Up Up Down Down Left Right Left Right B A
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  window.addEventListener('keydown', (e) => {
    if (e.key === konamiSequence[konamiIndex] || e.key.toLowerCase() === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        if (window.openKonamiModal) window.openKonamiModal();
      }
    } else {
      konamiIndex = 0;
    }
  });
}

// Global Helper: Copy to Clipboard
window.copyToClipboard = function(type, text) {
  if (window.soundManager) window.soundManager.playPop();
  navigator.clipboard.writeText(text).then(() => {
    const statusEl = document.getElementById(`${type}-copy-status`);
    if (statusEl) {
      statusEl.innerText = 'Copied! ✓';
      statusEl.classList.add('bg-emerald-500', 'text-white');
      setTimeout(() => {
        statusEl.innerText = 'Copy';
        statusEl.classList.remove('bg-emerald-500', 'text-white');
      }, 2000);
    }
  }).catch(err => {
    console.error('Clipboard copy error', err);
  });
};

// Global Helper: Contact Form Submit
window.handleContactSubmit = function(e) {
  e.preventDefault();
  if (window.soundManager) window.soundManager.playChime();

  if (window.confetti) {
    window.confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  }

  const successMsg = document.getElementById('form-success-msg');
  if (successMsg) {
    successMsg.classList.remove('hidden');
    document.getElementById('contact-form').reset();
    setTimeout(() => {
      successMsg.classList.add('hidden');
    }, 5000);
  }
};
