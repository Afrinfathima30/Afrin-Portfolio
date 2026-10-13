// Interactive Modals: Project Deep Dive, Resume Viewer, Konami Terminal

window.initModals = function() {
  const modalContainer = document.getElementById('modal-root');
  if (!modalContainer) return;

  // Open Project Modal
  window.openProjectModal = function(projectId) {
    const project = window.projectsData.find(p => p.id === projectId);
    if (!project) return;

    if (window.soundManager) window.soundManager.playPop();

    const isDcure = project.id === 'dcure';

    modalContainer.innerHTML = `
      <div class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in" id="project-modal-backdrop">
        <div class="modal-content relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 border border-purple-100 rounded-3xl shadow-2xl p-6 md:p-8 custom-scrollbar">
          
          <!-- Close Button -->
          <button class="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-600 flex items-center justify-center transition-all duration-200 z-20" onclick="window.closeModal()">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <!-- Header -->
          <div class="mb-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60 mb-3">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              ${project.badge}
            </div>
            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">${project.title}</h2>
            <p class="text-slate-600 mt-1 text-base md:text-lg">${project.tagline}</p>
          </div>

          <!-- Visual Showcase Banner -->
          <div class="relative rounded-2xl overflow-hidden shadow-lg border border-purple-100/80 mb-8 group bg-gradient-to-tr from-purple-50 to-blue-50">
            <img src="${project.image}" alt="${project.title}" class="w-full h-64 md:h-80 object-cover transform group-hover:scale-105 transition-transform duration-700">
            ${isDcure ? `
              <div class="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-purple-400/30">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active Neural Telemetry Simulation</span>
              </div>
            ` : ''}
          </div>

          <!-- Interactive Prototype Simulation Tab if D-Cure -->
          ${isDcure ? `
            <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-900/5 via-indigo-900/5 to-purple-900/5 border border-purple-200/70 mb-8">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span class="p-2 rounded-lg bg-purple-600 text-white shadow-sm">
                    <i data-lucide="activity" class="w-4 h-4"></i>
                  </span>
                  <h4 class="font-bold text-slate-900">D-Cure Interactive Cognitive Diagnostic Demo</h4>
                </div>
                <span class="text-xs px-2.5 py-1 bg-purple-100 text-purple-700 font-medium rounded-full">Interactive Preview</span>
              </div>
              <p class="text-xs text-slate-600 mb-4">Simulate patient cognitive assessment test response:</p>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3" id="dcure-interactive-grid">
                <div class="p-3 bg-white rounded-xl border border-purple-100 shadow-sm hover:border-purple-300 transition-all cursor-pointer" onclick="window.simulateCognitive('memory')">
                  <div class="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Memory Recall Test</span>
                    <span class="text-purple-600 font-bold" id="memory-score">94%</span>
                  </div>
                  <div class="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-purple-600 h-full rounded-full transition-all duration-500" style="width: 94%" id="memory-bar"></div>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">Spatial pattern stimulation</p>
                </div>

                <div class="p-3 bg-white rounded-xl border border-purple-100 shadow-sm hover:border-purple-300 transition-all cursor-pointer" onclick="window.simulateCognitive('speed')">
                  <div class="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Reaction Telemetry</span>
                    <span class="text-blue-600 font-bold" id="speed-score">185ms</span>
                  </div>
                  <div class="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-blue-600 h-full rounded-full transition-all duration-500" style="width: 88%" id="speed-bar"></div>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">Reflex response time</p>
                </div>

                <div class="p-3 bg-white rounded-xl border border-purple-100 shadow-sm hover:border-purple-300 transition-all cursor-pointer" onclick="window.simulateCognitive('stability')">
                  <div class="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Caregiver Alert Status</span>
                    <span class="text-emerald-600 font-bold flex items-center gap-1" id="stability-score">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Normal
                    </span>
                  </div>
                  <div class="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-emerald-600 h-full rounded-full transition-all duration-500" style="width: 98%" id="stability-bar"></div>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">Vital tracking normal</p>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Deep-Dive Breakdown Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Problem & Solution -->
            <div class="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <div class="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <i data-lucide="alert-circle" class="w-4 h-4 text-rose-500"></i>
                <span>The Problem</span>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed">${project.problem}</p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <div class="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>
                <span>The Solution</span>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed">${project.solution}</p>
            </div>

            <!-- Key Innovation -->
            <div class="p-5 rounded-2xl bg-purple-50/50 border border-purple-100">
              <div class="flex items-center gap-2 font-bold text-purple-900 mb-2">
                <i data-lucide="lightbulb" class="w-4 h-4 text-amber-500"></i>
                <span>Core Innovation</span>
              </div>
              <p class="text-sm text-slate-700 leading-relaxed">${project.innovation}</p>
            </div>

            <!-- My Contribution -->
            <div class="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div class="flex items-center gap-2 font-bold text-blue-900 mb-2">
                <i data-lucide="user-check" class="w-4 h-4 text-blue-500"></i>
                <span>My Contribution</span>
              </div>
              <p class="text-sm text-slate-700 leading-relaxed">${project.myContribution}</p>
            </div>
          </div>

          <!-- Technologies Used -->
          <div class="mb-8">
            <h4 class="text-xs uppercase tracking-wider font-bold text-slate-500 mb-3">Technologies & Tools</h4>
            <div class="flex flex-wrap gap-2">
              ${project.technologies.map(t => `
                <span class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-purple-100 hover:text-purple-700 transition-colors">
                  ${t}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Impact & Footer -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-purple-100/50 to-indigo-100/50 border border-purple-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="text-xs text-slate-700">
              <span class="font-bold text-purple-900">Impact Statement:</span> ${project.impact}
            </div>
            <button class="w-full md:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md hover:shadow-purple-300 transition-all flex items-center justify-center gap-2" onclick="window.closeModal()">
              <span>Close Experience</span>
            </button>
          </div>

        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    document.getElementById('project-modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'project-modal-backdrop') {
        window.closeModal();
      }
    });
  };

  // Cognitive Simulation function
  window.simulateCognitive = function(type) {
    if (window.soundManager) window.soundManager.playPop();
    if (type === 'memory') {
      const val = Math.floor(Math.random() * 10) + 90;
      document.getElementById('memory-score').innerText = `${val}%`;
      document.getElementById('memory-bar').style.width = `${val}%`;
    } else if (type === 'speed') {
      const val = Math.floor(Math.random() * 50) + 160;
      document.getElementById('speed-score').innerText = `${val}ms`;
    } else if (type === 'stability') {
      const statusEl = document.getElementById('stability-score');
      statusEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Realtime Synced`;
      setTimeout(() => {
        statusEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Normal`;
      }, 1500);
    }
  };

  // Close Modal
  window.closeModal = function() {
    if (window.soundManager) window.soundManager.playHover();
    modalContainer.innerHTML = '';
  };

  // Resume Modal
  window.openResumeModal = function() {
    const profile = window.profileData;
    if (window.soundManager) window.soundManager.playPop();
    modalContainer.innerHTML = `
      <div class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in" id="resume-modal-backdrop">
        <div class="modal-content relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-purple-100 rounded-3xl shadow-2xl p-6 md:p-8 custom-scrollbar">
          
          <button class="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-600 flex items-center justify-center transition-all duration-200 z-20" onclick="window.closeModal()">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <!-- Header -->
          <div class="text-center pb-6 border-b border-slate-100">
            <h2 class="text-3xl font-extrabold text-slate-900">${profile.name}</h2>
            <p class="text-purple-600 font-bold mt-1 text-sm tracking-wide">${profile.title}</p>
            <p class="text-xs text-slate-500 mt-1">${profile.location} • ${profile.phone} • ${profile.email}</p>
            <div class="flex flex-wrap items-center justify-center gap-3 text-xs text-purple-700 font-semibold mt-2">
              <a href="${profile.github}" target="_blank" rel="noopener" class="hover:underline flex items-center gap-1">
                <i data-lucide="github" class="w-3.5 h-3.5"></i> github.com/Afrinfathima30
              </a>
              <span class="text-slate-300">•</span>
              <a href="${profile.linkedin}" target="_blank" rel="noopener" class="hover:underline flex items-center gap-1">
                <i data-lucide="linkedin" class="w-3.5 h-3.5"></i> linkedin.com/in/afrin-fathima-basheer-ahamed
              </a>
            </div>
            
            <div class="flex items-center justify-center gap-3 mt-4">
              <button class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all hover:scale-105" onclick="window.printResume()">
                <i data-lucide="printer" class="w-4 h-4"></i>
                <span>Print / Save as PDF</span>
              </button>
              <a href="mailto:${profile.email}" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-all">
                <i data-lucide="mail" class="w-4 h-4"></i>
                <span>Contact Direct</span>
              </a>
            </div>
          </div>

          <!-- Resume Content Preview -->
          <div class="py-6 space-y-6 text-left" id="printable-resume">
            
            <!-- Summary -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2 flex items-center gap-2">
                <i data-lucide="user" class="w-4 h-4"></i> Professional Summary
              </h4>
              <p class="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                Java Full Stack Developer with a strong frontend foundation and hands-on internship experience across three organizations, building responsive, cross-browser web applications using HTML, CSS, JavaScript, and React.js. Working knowledge of Java, Spring Boot, MySQL, and MongoDB, with Git/GitHub version control and Figma/Canva-based UI design. National winner of the Capgemini Tech4Positive Future Challenge. Final-year B.Tech Information Technology student (9.4 CGPA) seeking a Java Full Stack Developer or Frontend Developer role to contribute to real-world product development.
              </p>
            </div>

            <!-- Technical Skills -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2 flex items-center gap-2">
                <i data-lucide="cpu" class="w-4 h-4"></i> Technical Skills
              </h4>
              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div><span class="font-bold text-slate-800">Programming Languages:</span> <span class="text-slate-600">Java, Python, C, JavaScript</span></div>
                <div><span class="font-bold text-slate-800">Frontend Technologies:</span> <span class="text-slate-600">HTML5, CSS3, JavaScript, React.js, Responsive Web Design</span></div>
                <div><span class="font-bold text-slate-800">Backend Frameworks:</span> <span class="text-slate-600">Spring Boot</span></div>
                <div><span class="font-bold text-slate-800">Databases:</span> <span class="text-slate-600">MySQL, MongoDB</span></div>
                <div><span class="font-bold text-slate-800">Tools & Design:</span> <span class="text-slate-600">Git/GitHub, Figma, Canva, UI/UX Design</span></div>
                <div><span class="font-bold text-slate-800">AI-Assisted Development:</span> <span class="text-slate-600">Claude, Codex, Grok, Antigravity, Trae</span></div>
                <div><span class="font-bold text-slate-800">Additional Skills:</span> <span class="text-slate-600">Excel, Power BI, SEO, AEO, Content Writing, SMM</span></div>
              </div>
            </div>

            <!-- Professional Experience -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-purple-700 mb-3 flex items-center gap-2">
                <i data-lucide="briefcase" class="w-4 h-4"></i> Professional Experience
              </h4>
              <div class="space-y-3">
                <div class="p-3 bg-white rounded-xl border border-slate-200">
                  <div class="flex justify-between items-start">
                    <div>
                      <h5 class="font-bold text-xs text-slate-900">Web Developer Intern</h5>
                      <p class="text-xs text-purple-600">Xyzon Innovations Pvt Ltd • Chennai, India</p>
                    </div>
                    <span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">2025</span>
                  </div>
                  <ul class="text-[11px] text-slate-600 list-disc list-inside mt-2 space-y-1">
                    <li>Collaborated within a 5+ member development team to build and structure a company website, handling multiple business requirements.</li>
                    <li>Used Figma and Canva to support UI/UX design decisions ahead of development.</li>
                    <li>Coordinated with developers to align site structure and layout with business goals.</li>
                  </ul>
                </div>

                <div class="p-3 bg-white rounded-xl border border-slate-200">
                  <div class="flex justify-between items-start">
                    <div>
                      <h5 class="font-bold text-xs text-slate-900">Frontend Developer Intern</h5>
                      <p class="text-xs text-purple-600">Nainu Startups • Chennai, India</p>
                    </div>
                    <span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">2024 – 2025</span>
                  </div>
                  <ul class="text-[11px] text-slate-600 list-disc list-inside mt-2 space-y-1">
                    <li>Contributed to the design and development of the company website end-to-end, focusing on responsive and user-friendly layouts.</li>
                    <li>Implemented core frontend features using HTML, CSS, and JavaScript, and supported content integration across the site.</li>
                    <li>Collaborated with the team to improve overall website responsiveness across desktop and mobile devices.</li>
                  </ul>
                </div>

                <div class="p-3 bg-white rounded-xl border border-slate-200">
                  <div class="flex justify-between items-start">
                    <div>
                      <h5 class="font-bold text-xs text-slate-900">Junior Web Developer Intern</h5>
                      <p class="text-xs text-purple-600">Makers Tribe • Chennai, India</p>
                    </div>
                    <span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">2024</span>
                  </div>
                  <ul class="text-[11px] text-slate-600 list-disc list-inside mt-2 space-y-1">
                    <li>Developed and maintained responsive web pages using HTML, CSS, and JavaScript for live client projects.</li>
                    <li>Gained hands-on exposure to React.js and Git/GitHub while contributing to live projects.</li>
                    <li>Improved UI/UX and ensured cross-browser compatibility across 2 live applications.</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Projects, Hackathons & Achievements -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2 flex items-center gap-2">
                <i data-lucide="trophy" class="w-4 h-4"></i> Projects, Hackathons & Achievements
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div class="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-lg md:col-span-2">
                  <div class="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <span>🏆</span>
                    <span>Capgemini Tech4Positive Future Challenge (2026) — National Winner</span>
                  </div>
                  <p class="text-slate-700 text-[11px] mt-1">Created "D Cure" (Dementia Cure Platform), a technology-driven solution for the Tech4Positive challenge, and won at the national level.</p>
                </div>
                <div class="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <p class="font-bold text-slate-800">Smart India Hackathon (SIH 2023)</p>
                  <p class="text-slate-600 text-[11px] mt-0.5">Built "Alumni Connect Platform," contributing as a front-end developer to solve real-world problem statements at national level.</p>
                </div>
                <div class="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <p class="font-bold text-slate-800">Design Spark Challenge (2025, Intellect)</p>
                  <p class="text-slate-600 text-[11px] mt-0.5">Built a web app tackling rural governance and resource-utilization challenges, in a 50-hour time-constrained hackathon.</p>
                </div>
                <div class="p-2.5 bg-white border border-slate-200 rounded-lg md:col-span-2">
                  <p class="font-bold text-slate-800">AI Hackathon (Impacteers, 2025)</p>
                  <p class="text-slate-600 text-[11px] mt-0.5">Built "AI Student Performance Tracker," an AI-based prototype applying AI concepts to a practical education use case.</p>
                </div>
              </div>
            </div>

            <!-- Education -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2 flex items-center gap-2">
                <i data-lucide="graduation-cap" class="w-4 h-4"></i> Education
              </h4>
              <div class="space-y-2 text-xs">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-start">
                  <div>
                    <h5 class="font-bold text-slate-900">Bachelor of Technology in Information Technology</h5>
                    <p class="text-slate-600 text-[11px]">Mohamed Sathak A.J. College of Engineering, Chennai, India</p>
                  </div>
                  <div class="text-right">
                    <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">CGPA: 9.4 / 10</span>
                    <p class="text-[10px] text-slate-400 mt-0.5">2023 – 2027 (Expected)</p>
                  </div>
                </div>
                <div class="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 flex justify-between items-center text-[11px]">
                  <div>
                    <span class="font-bold text-slate-800">HSC</span> — St. Francis Xavier Anglo Indian Hr. Sec. School, Chennai
                  </div>
                  <div class="text-right">
                    <span class="font-bold text-slate-700">83%</span>
                    <span class="text-slate-400 ml-1">| 2022 – 2023</span>
                  </div>
                </div>
                <div class="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 flex justify-between items-center text-[11px]">
                  <div>
                    <span class="font-bold text-slate-800">SSLC</span> — Our Lady's Center Matriculation School, Chennai
                  </div>
                  <div class="text-right">
                    <span class="font-bold text-slate-700">93%</span>
                    <span class="text-slate-400 ml-1">| 2020 – 2021</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Certifications -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2 flex items-center gap-2">
                <i data-lucide="award" class="w-4 h-4"></i> Certifications
              </h4>
              <div class="flex flex-wrap gap-2 text-[11px]">
                <span class="px-2.5 py-1 bg-slate-100 rounded-md font-medium text-slate-700">Responsive Web Design Certification</span>
                <span class="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-md font-medium border border-purple-200">Oracle Java Skill Badge</span>
                <span class="px-2.5 py-1 bg-slate-100 rounded-md font-medium text-slate-700">Frontend Development Certification</span>
                <span class="px-2.5 py-1 bg-slate-100 rounded-md font-medium text-slate-700">Database Management Systems Certification</span>
                <span class="px-2.5 py-1 bg-slate-100 rounded-md font-medium text-slate-700">Fundamentals of Java</span>
                <span class="px-2.5 py-1 bg-slate-100 rounded-md font-medium text-slate-700">HackerRank 30 Days of Code Challenge</span>
              </div>
            </div>

            <!-- Languages -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2 flex items-center gap-2">
                <i data-lucide="globe" class="w-4 h-4"></i> Languages
              </h4>
              <div class="flex gap-3 text-xs text-slate-700">
                <span class="px-3 py-1 bg-slate-100 rounded-lg"><span class="font-bold">English:</span> Proficient</span>
                <span class="px-3 py-1 bg-slate-100 rounded-lg"><span class="font-bold">Tamil:</span> Native</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    document.getElementById('resume-modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'resume-modal-backdrop') {
        window.closeModal();
      }
    });
  };

  // Print helper
  window.printResume = function() {
    if (!document.getElementById('printable-resume')) {
      window.openResumeModal();
      setTimeout(() => {
        window.print();
      }, 350);
    } else {
      window.print();
    }
  };

  // Konami Code Easter Egg Terminal
  window.openKonamiModal = function() {
    if (window.soundManager) window.soundManager.playEasterEgg();
    modalContainer.innerHTML = `
      <div class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" id="konami-backdrop">
        <div class="w-full max-w-xl bg-slate-900 border border-purple-500/50 rounded-2xl shadow-2xl p-6 text-emerald-400 font-mono text-xs">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-slate-400">
            <span class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-rose-500"></span>
              <span class="w-3 h-3 rounded-full bg-amber-500"></span>
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span class="ml-2 text-slate-300 font-semibold">afrin_universe_terminal.sh</span>
            </span>
            <button onclick="window.closeModal()" class="text-slate-400 hover:text-white">✕</button>
          </div>
          <div class="space-y-2 leading-relaxed">
            <p class="text-purple-400">🎉 SECRET DEVELOPER EASTER EGG UNLOCKED!</p>
            <p>===========================================</p>
            <p>> initializing Afrin's Developer Matrix...</p>
            <p>> NAME: Afrin Fathima B</p>
            <p>> ROLE: Java Full Stack Developer | Frontend Developer</p>
            <p>> CGPA: 9.4 / 10 | Location: Chennai, India</p>
            <p>> FAVORITE_STACK: Java, Spring Boot, React, JavaScript, MySQL, MongoDB, AI</p>
            <p>> HIGHLIGHT: 🏆 National Winner - Capgemini Tech4Positive Future Challenge (2026)</p>
            <p>> PASSION: Code × Design × Innovation × Impact</p>
            <p class="text-cyan-300">> "Design is not just what it looks like and feels like. Design is how it works."</p>
            <p>===========================================</p>
            <div class="pt-4 flex justify-end">
              <button onclick="window.closeModal()" class="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all">
                RETURN TO UNIVERSE →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('konami-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'konami-backdrop') {
        window.closeModal();
      }
    });
  };
};
