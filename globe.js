// ── PARTICLE GLOBE ──
(function () {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 4.5);

  function resize() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ── BUILD GLOBE PARTICLES ──
  const PARTICLE_COUNT = 2500;
  const RADIUS = 1.6;

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const sizes     = new Float32Array(PARTICLE_COUNT);

  const colorPalette = [
    new THREE.Color(0x22d3ee), // cyan
    new THREE.Color(0x3b82f6), // blue
    new THREE.Color(0xa855f7), // purple
    new THREE.Color(0x06b6d4), // teal
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // fibonacci sphere for even distribution
    const phi   = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;

    const x = RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = RADIUS * Math.sin(phi) * Math.sin(theta);
    const z = RADIUS * Math.cos(phi);

    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = Math.random() * 2.5 + 1.0;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const globe = new THREE.Points(geo, mat);
  scene.add(globe);

  // ── INNER GLOW SPHERE ──
  const glowGeo = new THREE.SphereGeometry(1.55, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x0ea5e9,
    transparent: true,
    opacity: 0.04,
    side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(glowGeo, glowMat));

  // ── ORBIT RINGS ──
  function makeRing(radius, color, opacity, rotX, rotY) {
    const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.006, 6, 120), m);
    mesh.rotation.x = rotX;
    mesh.rotation.y = rotY;
    scene.add(mesh);
    return mesh;
  }

  const ring1 = makeRing(1.9, 0x22d3ee, 0.3,  Math.PI / 2,  0);
  const ring2 = makeRing(2.1, 0x3b82f6, 0.15, Math.PI / 3,  Math.PI / 5);
  const ring3 = makeRing(2.3, 0xa855f7, 0.10, Math.PI / 6, -Math.PI / 4);

  // ── AMBIENT LIGHT PARTICLES (floating dots around globe) ──
  const aGeo = new THREE.BufferGeometry();
  const aPos = new Float32Array(80 * 3);
  for (let i = 0; i < 80; i++) {
    const r = 2.2 + Math.random() * 1.2;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    aPos[i * 3]     = r * Math.sin(p) * Math.cos(t);
    aPos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
    aPos[i * 3 + 2] = r * Math.cos(p);
  }
  aGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
  const aMat = new THREE.PointsMaterial({ color: 0x22d3ee, size: 0.035, transparent: true, opacity: 0.5 });
  const ambient = new THREE.Points(aGeo, aMat);
  scene.add(ambient);

  // ── MOUSE PARALLAX ──
  let mX = 0, mY = 0, tX = 0, tY = 0;
  document.addEventListener('mousemove', e => {
    mX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── INTRO FADE IN ──
  let opacity = 0;
  const FADE_SPEED = 0.008;

  // ── ANIMATE ──
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // fade in
    if (opacity < 1) {
      opacity = Math.min(opacity + FADE_SPEED, 1);
      mat.opacity  = opacity * 0.88;
      aMat.opacity = opacity * 0.5;
    }

    // smooth mouse follow
    tX += (mX - tX) * 0.04;
    tY += (mY - tY) * 0.04;

    // auto rotate + mouse parallax
    globe.rotation.y  = elapsed * 0.12 + tX * 0.4;
    globe.rotation.x  = tY * -0.25;

    ring1.rotation.z  += 0.003;
    ring2.rotation.z  -= 0.002;
    ring2.rotation.x  += 0.001;
    ring3.rotation.z  += 0.0015;
    ring3.rotation.y  += 0.002;

    ambient.rotation.y += 0.0008;
    ambient.rotation.x += 0.0004;

    // gentle breathe
    const breathe = 1 + Math.sin(elapsed * 0.8) * 0.025;
    globe.scale.setScalar(breathe);

    // pulse glow
    glowMat.opacity = 0.03 + Math.sin(elapsed * 1.2) * 0.02;

    renderer.render(scene, camera);
  }

  animate();
})();