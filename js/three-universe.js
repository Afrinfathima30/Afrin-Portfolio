// Three.js 3D Universe Background & Floating Elements

window.initThreeUniverse = function() {
  const canvas = document.getElementById('three-universe-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xa78bfa, 1.2); // lavender purple
  dirLight1.position.set(20, 20, 20);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.9); // baby blue
  dirLight2.position.set(-20, -10, 15);
  scene.add(dirLight2);

  const pointLight = new THREE.PointLight(0xf472b6, 1.0, 50); // soft pink
  pointLight.position.set(0, 0, 10);
  scene.add(pointLight);

  // Group for floating objects
  const floatingGroup = new THREE.Group();
  scene.add(floatingGroup);

  // Colors: Lavender, Electric Purple, Soft Blue, Soft Pink, Mint
  const colors = [0x8b5cf6, 0xa855f7, 0x38bdf8, 0xf472b6, 0x6366f1, 0x34d399, 0xc084fc];
  const objects = [];

  // Create floating 3D objects
  const sphereGeo = new THREE.SphereGeometry(0.8, 32, 32);
  const cubeGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
  const octaGeo = new THREE.OctahedronGeometry(0.9);
  const torusGeo = new THREE.TorusGeometry(0.7, 0.25, 16, 40);

  const geometries = [sphereGeo, cubeGeo, octaGeo, torusGeo];

  const count = window.innerWidth < 768 ? 8 : 16;

  for (let i = 0; i < count; i++) {
    const geo = geometries[i % geometries.length];
    const color = colors[i % colors.length];

    const mat = new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.35,
      thickness: 0.8,
      transparent: true,
      opacity: 0.45,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });

    const mesh = new THREE.Mesh(geo, mat);

    // Spread across scene
    mesh.position.x = (Math.random() - 0.5) * 45;
    mesh.position.y = (Math.random() - 0.5) * 35;
    mesh.position.z = (Math.random() - 0.5) * 20 - 5;

    const scale = 0.5 + Math.random() * 0.9;
    mesh.scale.set(scale, scale, scale);

    mesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.012,
      rotSpeedY: (Math.random() - 0.5) * 0.014,
      floatSpeed: 0.0008 + Math.random() * 0.0012,
      floatOffset: Math.random() * Math.PI * 2,
      initialY: mesh.position.y,
      initialX: mesh.position.x,
      depthFactor: 0.03 + Math.random() * 0.04
    };

    floatingGroup.add(mesh);
    objects.push(mesh);
  }

  // Particle Star Dust
  const particleCount = window.innerWidth < 768 ? 40 : 100;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const pPalette = [
    new THREE.Color(0xa78bfa),
    new THREE.Color(0x60a5fa),
    new THREE.Color(0xf472b6),
    new THREE.Color(0x818cf8)
  ];

  for (let i = 0; i < particleCount; i++) {
    particlePos[i * 3] = (Math.random() - 0.5) * 60;
    particlePos[i * 3 + 1] = (Math.random() - 0.5) * 50;
    particlePos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;

    const c = pPalette[Math.floor(Math.random() * pPalette.length)];
    particleColors[i * 3] = c.r;
    particleColors[i * 3 + 1] = c.g;
    particleColors[i * 3 + 2] = c.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      floatingGroup.position.x = targetX * 1.5;
      floatingGroup.position.y = -targetY * 1.2;

      objects.forEach((obj) => {
        obj.rotation.x += obj.userData.rotSpeedX;
        obj.rotation.y += obj.userData.rotSpeedY;
        obj.position.y = obj.userData.initialY + Math.sin(time * 1.2 + obj.userData.floatOffset) * 0.9;
        obj.position.x = obj.userData.initialX + Math.cos(time * 0.8 + obj.userData.floatOffset) * 0.5;
      });

      particleSystem.rotation.y = time * 0.02;
      particleSystem.rotation.x = time * 0.01;
    }

    renderer.render(scene, camera);
  }

  animate();
};
