/**
 * EDTECH ISLAND â€” Navigation + Interaction Engine
 * Chapter-specific 3D scenes:
 *  - Light & Shadows: custom ray tracing / shadow projection scene
 *  - Space & Solar System: animated solar system with orbiting planets
 */
'use strict';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   APP STATE
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const AppState = {
  currentScreen:   'screen-home',
  previousScreen:  null,
  activeTab:       'experience',
  activeChapterId: null,

  chapterData: {
    'light-shadows': {
      title:       'LIGHT AND SHADOWS',
      description: 'The light and shadow simulation model provides interactive exploration of fundamental optical principles. Visualize the formation of complex shadow patterns, examine umbra and penumbra regions, and observe how light propagates to form shadows based on object shape and distance.',
      tabIcon:     'ph-lightbulb',
      nextChapter: 'space-solar',
      scene:       'lightShadows',
      url:         'Chapter_experience_L_S.html'
    },
    'space-solar': {
      title:       'SPACE AND SOLAR SYSTEM',
      description: 'The solar system model provides an interactive journey through our cosmic neighbourhood. Explore planetary orbits, understand gravitational forces, and discover the unique characteristics of each planet â€” from the scorching Mercury to the icy realms of Neptune.',
      tabIcon:     'ph-planet',
      nextChapter: 'light-shadows',
      scene:       'solarSystem',
      url:         null
    }
  }
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PAGE NAVIGATION
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function navigateTo(targetId, ctx = {}) {
  // If we are already on the chapter detail screen but going to a different chapter
  if (targetId === 'screen-chapter-detail' && targetId === AppState.currentScreen && ctx.chapterId && ctx.chapterId !== AppState.activeChapterId) {
    destroyThreeScene();
    const loadingEl = document.getElementById('canvas-loading');
    if (loadingEl) loadingEl.style.display = 'flex';
    
    populateChapterDetail(ctx.chapterId);
    setTimeout(bootChapterScene, 100);
    return;
  }

  if (targetId === AppState.currentScreen) return;

  const currentEl = document.getElementById(AppState.currentScreen);
  const targetEl  = document.getElementById(targetId);
  if (!currentEl || !targetEl) return;

  const overlayEl = document.getElementById('app-overlay');
  if (!overlayEl || overlayEl.classList.contains('hidden')) {
    document.body.classList.remove(FULLSCREEN_OVERLAY_BODY_CLASS);
  }

  // Eagerly destroy 3D scene when leaving or entering chapter detail
  if (AppState.currentScreen === 'screen-chapter-detail' || targetId === 'screen-chapter-detail') {
    destroyThreeScene();
    const loadingEl = document.getElementById('canvas-loading');
    if (loadingEl) loadingEl.style.display = 'flex';
  }

  if (targetId === 'screen-chapter-detail' && ctx.chapterId) {
    populateChapterDetail(ctx.chapterId);
  }

  currentEl.classList.remove('active');
  currentEl.classList.add('exit-left');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      targetEl.classList.add('active');
      setTimeout(() => currentEl.classList.remove('exit-left'), 400);

      // Boot the correct 3D scene after the DOM is painted
      if (targetId === 'screen-chapter-detail') {
        setTimeout(bootChapterScene, 100);
      }
    });
  });

  AppState.previousScreen = AppState.currentScreen;
  AppState.currentScreen  = targetId;
  updateNavActive(targetId);
  updateThemeBtnVisibility(targetId);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CHAPTER DETAIL POPULATION
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function populateChapterDetail(chapterId) {
  const data = AppState.chapterData[chapterId];
  if (!data) return;
  AppState.activeChapterId = chapterId;

  const titleEl      = document.getElementById('detail-title');
  const descEl       = document.getElementById('detail-description');
  const phosphorIcon = document.getElementById('detail-tab-phosphor-icon');

  if (titleEl)      titleEl.textContent = data.title;
  if (descEl)       descEl.textContent  = data.description;
  if (phosphorIcon) phosphorIcon.className = 'ph ' + data.tabIcon;

  // Wire "Next Chapter"
  const nextBtn = document.getElementById('btn-next-chapter');
  if (nextBtn && data.nextChapter) {
    nextBtn.onclick = () => navigateTo('screen-chapter-detail', { chapterId: data.nextChapter });
  }

  // Wire "Start Journey" button
  const startBtn = document.getElementById('btn-start-journey');
  if (startBtn) {
    startBtn.onclick = () => {
      if (data.url) {
        showOverlay(data.url, 'fullscreen', { cacheBust: true });
      } else {
        alert("Interactive experience is coming soon for this chapter!");
      }
    };
  }

  // Always reset to first tab on chapter change
  switchSolTab('experience');
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CHAPTER SCENE ROUTER
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function bootChapterScene() {
  const data = AppState.chapterData[AppState.activeChapterId];
  if (!data) return;
  if (data.scene === 'lightShadows') {
    initLightAndShadows3D();
  } else if (data.scene === 'solarSystem') {
    init3DSolarSystem();
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TAB SWITCHING
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function switchSolTab(tabName) {
  document.querySelectorAll('.sol-tab').forEach(btn => {
    btn.classList.remove('active-tab');
    btn.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.sol-tab-panel').forEach(p => p.classList.remove('active'));

  const activeBtn = document.querySelector(`.sol-tab[data-tab="${tabName}"]`);
  if (activeBtn) { activeBtn.classList.add('active-tab'); activeBtn.setAttribute('aria-selected', 'true'); }

  const panelEl = document.getElementById('tabpanel-' + tabName);
  if (panelEl) panelEl.classList.add('active');

  AppState.activeTab = tabName;

  // Fix: Force Three.js to recalculate its canvas size now that its container is display:flex again.
  // Otherwise it stucks at 0x0 dimensions (black scene) if the browser repainted or resized while hidden.
  setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   THREE.JS SHARED HELPERS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
let _threeAnimId  = null;
let _threeRenderer = null;

function destroyThreeScene() {
  if (_threeAnimId)   { cancelAnimationFrame(_threeAnimId); _threeAnimId = null; }
  if (_threeRenderer) { _threeRenderer.dispose(); _threeRenderer = null; }
  const c = document.getElementById('canvas-container');
  if (c) c.innerHTML = '';
}

/** Procedural radial glow texture for light source sprite */
function makeGlowTexture(innerColor = 'rgba(255,255,255,1)', outerColor = 'rgba(100,200,255,0)') {
  const cv  = document.createElement('canvas');
  cv.width  = 128; cv.height = 128;
  const ctx = cv.getContext('2d');
  const g   = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,   innerColor);
  g.addColorStop(0.25,'rgba(210,240,255,0.85)');
  g.addColorStop(0.55,'rgba(140,200,255,0.35)');
  g.addColorStop(1,   outerColor);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(cv);
}

/** Attach drag-rotate listener to a container, rotating a target object on Y */
function addDragRotate(container, target, sensitivityX = 0.006, sensitivityY = 0.003) {
  let drag = false;
  let last = { x: 0, y: 0 };

  const start = e => { drag = true; const p = e.touches ? e.touches[0] : e; last = { x: p.clientX, y: p.clientY }; };
  const end   = ()  => { drag = false; };
  const move  = e  => {
    if (!drag) return;
    const p = e.touches ? e.touches[0] : e;
    target.rotation.y += (p.clientX - last.x) * sensitivityX;
    target.rotation.x = Math.max(-Math.PI / 5, Math.min(Math.PI / 5, target.rotation.x + (p.clientY - last.y) * sensitivityY));
    last = { x: p.clientX, y: p.clientY };
  };

  container.addEventListener('mousedown',  start);
  container.addEventListener('mouseup',    end);
  container.addEventListener('mouseleave', end);
  container.addEventListener('mousemove',  move);
  container.addEventListener('touchstart', start, { passive: true });
  container.addEventListener('touchend',   end);
  container.addEventListener('touchmove',  move, { passive: true });
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   â–ˆâ–ˆâ–ˆ  LIGHT AND SHADOWS  â€” Three.js scene
       Inspired by the reference image:
       â€¢ Glowing point-light source (bottom-left)
       â€¢ Faceted geometric object with wireframe overlay
       â€¢ Visible light rays shooting from source
       â€¢ Curved grid screen receiving a shadow projection
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initLightAndShadows3D() {
  if (typeof THREE === 'undefined') return;
  destroyThreeScene();

  const container = document.getElementById('canvas-container');
  if (!container) return;

  const loadingEl = document.getElementById('canvas-loading');

  /* â”€â”€ Scene setup â”€â”€ */
  const scene  = new THREE.Scene();
  scene.background = new THREE.Color(0x070d18);
  scene.fog = new THREE.FogExp2(0x070d18, 0.025);
  
  // Default camera angle manually adjusted to match UI reference
  scene.rotation.y = 1.8;
  scene.rotation.x = 0.1;

  const W = container.clientWidth;
  const H = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
  camera.position.set(0, 2.5, 13);
  camera.lookAt(1, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  container.appendChild(renderer.domElement);
  _threeRenderer = renderer;

  if (loadingEl) loadingEl.style.display = 'none';

  /* â”€â”€ Lighting â”€â”€ */
  scene.add(new THREE.AmbientLight(0x0d1b33, 0.4)); // Darker ambient for stronger shadows

  // The visible point-light source
  const LIGHT_POS = new THREE.Vector3(-4.8, -1.2, 3.0);

  const pointLight = new THREE.PointLight(0xffffff, 5.0, 40);
  pointLight.position.copy(LIGHT_POS);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.set(2048, 2048); // High res for sharp shadow projection
  pointLight.shadow.bias = -0.001;
  pointLight.shadow.camera.near = 0.5;
  pointLight.shadow.camera.far  = 25;
  scene.add(pointLight);

  // Rim light very weak, just to prevent pitch black
  const rimLight = new THREE.DirectionalLight(0x40d0e0, 0.1);
  rimLight.position.set(8, 4, -4);
  scene.add(rimLight);

  /* â”€â”€ Light source visual â€” glowing sphere + corona sprite â”€â”€ */
  const bulbGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const bulb    = new THREE.Mesh(bulbGeo, bulbMat);
  bulb.position.copy(LIGHT_POS);
  scene.add(bulb);

  // Outer corona sprite
  const coronaMat = new THREE.SpriteMaterial({
    map: makeGlowTexture(),
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.92
  });
  const corona = new THREE.Sprite(coronaMat);
  corona.position.copy(LIGHT_POS);
  corona.scale.set(2.2, 2.2, 1);
  scene.add(corona);

  // Small floor stand under the light
  const standGeo = new THREE.CylinderGeometry(0.04, 0.12, 1.2, 8);
  const standMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.8, metalness: 0.5 });
  const stand    = new THREE.Mesh(standGeo, standMat);
  stand.position.set(LIGHT_POS.x, LIGHT_POS.y - 0.85, LIGHT_POS.z);
  scene.add(stand);

  // Light pool on the floor
  const poolGeo = new THREE.PlaneGeometry(8, 8);
  const poolMat = new THREE.MeshBasicMaterial({
    map: makeGlowTexture('rgba(160, 220, 255, 0.40)', 'rgba(0,0,0,0)'),
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  });
  const pool = new THREE.Mesh(poolGeo, poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(LIGHT_POS.x, -2.39, LIGHT_POS.z);
  scene.add(pool);

  /* â”€â”€ Central geometric object â”€â”€ */
  const objGroup = new THREE.Group();
  objGroup.position.set(0.6, 0.2, 0);

  // Solid geometric shape with flat shading (no wireframe, like reference)
  const objGeo  = new THREE.IcosahedronGeometry(1.4, 0); 
  // Custom material to be bright on lit side, black in shadow
  const objMat  = new THREE.MeshStandardMaterial({
    color:     0xbbeeff,   // Bright whitish-cyan
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true
  });
  const objMesh = new THREE.Mesh(objGeo, objMat);
  objMesh.castShadow = true;
  objGroup.add(objMesh);
  scene.add(objGroup);

  // Wireframe pyramid stand holding the object
  const pyramidGeo = new THREE.ConeGeometry( 0.9, 3.2, 4 );
  const pyramidMat = new THREE.MeshBasicMaterial({ color: 0x99ccdd, wireframe: true, transparent: true, opacity: 0.35 });
  const pyramid = new THREE.Mesh(pyramidGeo, pyramidMat);
  pyramid.position.set(0.6, -1.5, 0); 
  pyramid.rotation.y = Math.PI / 4;
  scene.add(pyramid);

  /* â”€â”€ Curved projection screen â”€â”€ */
  const SCREEN_POS = new THREE.Vector3(-7.27, 1.0, 4.37);

  // Opaque, light-colored background wall receiving sharp shadows
  const screenGeo = new THREE.CylinderGeometry(15.0, 15.0, 14.0, 64, 16, true, -0.7, 1.4);
  const screenMat = new THREE.MeshStandardMaterial({
    color:       0xaaddf0,   // Light blue matching reference wall
    roughness:   1,
    metalness:   0,
    side:        THREE.DoubleSide
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.rotation.y = 2.07;
  screenMesh.position.copy(SCREEN_POS);
  screenMesh.receiveShadow = true;
  scene.add(screenMesh);

  // Darker wireframe grid overlay on the screen
  const gridMat  = new THREE.MeshBasicMaterial({
    color:       0x336677,
    wireframe:   true,
    transparent: true,
    opacity:     0.4,
    side:        THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -1
  });
  const gridMesh = new THREE.Mesh(screenGeo.clone(), gridMat);
  gridMesh.rotation.y = 2.07;
  gridMesh.position.copy(SCREEN_POS);
  scene.add(gridMesh);

  /* â”€â”€ Floor grid â”€â”€ */
  const floorGeo = new THREE.PlaneGeometry(22, 16, 22, 16);
  const floorMat = new THREE.MeshBasicMaterial({
    color:       0x40e0d0,
    wireframe:   true,
    transparent: true,
    opacity:     0.055
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.4;
  scene.add(floor);

  /* â”€â”€ Light rays hitting the object vertices perfectly â”€â”€ */
  const rayMat = new THREE.LineBasicMaterial({
    color:       0xffffff,
    transparent: true,
    opacity:     0.45
  });

  const linesGroup = new THREE.Group();
  scene.add(linesGroup);
  
  // Update rays dynamically based on vertex positions
  const lines = [];
  const positionsAttr = objGeo.attributes.position;
  // unique vertices
  const uniquePts = [];
  for (let i = 0; i < positionsAttr.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(positionsAttr, i);
    if (!uniquePts.some(p => p.distanceTo(v) < 0.1)) uniquePts.push(v);
  }

  uniquePts.forEach(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const line = new THREE.Line(geo, rayMat);
    linesGroup.add(line);
    lines.push(line);
  });

  /* â”€â”€ Drag to rotate (whole scene Y-axis) â”€â”€ */
  addDragRotate(container, scene, 0.005, 0.003);

  /* â”€â”€ Resize handler â”€â”€ */
  const onResize = () => {
    if (!container || !_threeRenderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    _threeRenderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', onResize);

  /* â”€â”€ Animation loop â”€â”€ */
  let time = 0;
  function animate() {
    _threeAnimId = requestAnimationFrame(animate);
    time += 0.012;

    // Very slowly rotate the geometric object
    objGroup.rotation.y += 0.002;
    objGroup.rotation.x += 0.001;
    
    // Update light rays perfectly tracing to the object's moving vertices
    objGroup.updateMatrixWorld();
    uniquePts.forEach((localPos, idx) => {
      const worldPos = localPos.clone().applyMatrix4(objGroup.matrixWorld);
      const dir = worldPos.clone().sub(LIGHT_POS).normalize();
      const endPos = LIGHT_POS.clone().add(dir.multiplyScalar(24)); // Project out past to the wall
      const positions = new Float32Array([
        LIGHT_POS.x, LIGHT_POS.y, LIGHT_POS.z,
        endPos.x, endPos.y, endPos.z
      ]);
      lines[idx].geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    });

    // Pulse the corona glow
    const pulse = 1 + Math.sin(time * 1.8) * 0.14;
    corona.scale.set(2.2 * pulse, 2.2 * pulse, 1);

    // Flicker point light
    pointLight.intensity = 5.0 + Math.sin(time * 3.5) * 0.5 + (Math.random() - 0.5) * 0.2;

    renderer.render(scene, camera);
  }
  animate();
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   â–ˆâ–ˆâ–ˆ  SOLAR SYSTEM  â€” Three.js scene (for Space & Solar System chapter)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function init3DSolarSystem() {
  if (typeof THREE === 'undefined') return;
  destroyThreeScene();

  const container = document.getElementById('canvas-container');
  if (!container) return;

  const loadingEl = document.getElementById('canvas-loading');

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 30, 45);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x050814);
  container.appendChild(renderer.domElement);
  _threeRenderer = renderer;

  if (loadingEl) loadingEl.style.display = 'none';

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));
  scene.add(new THREE.PointLight(0xffdcb4, 2.5, 160));

  // Starfield
  const starsGeo = new THREE.BufferGeometry();
  const starPos  = new Float32Array(1200 * 3);
  for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 220;
  starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starField = new THREE.Points(starsGeo, new THREE.PointsMaterial({ size: 0.12, color: 0x88ccff, transparent: true, opacity: 0.80 }));
  scene.add(starField);

  // Sun
  const sun    = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
  scene.add(sun);
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(3.6, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.18, side: THREE.BackSide })));

  // Planets
  const planetsData = [
    { name:'Mercury', radius:0.30, distance:6,  speed:0.020, color:0x888888 },
    { name:'Venus',   radius:0.60, distance:9,  speed:0.015, color:0xe3bb76 },
    { name:'Earth',   radius:0.65, distance:13, speed:0.010, color:0x3366ff },
    { name:'Mars',    radius:0.40, distance:17, speed:0.008, color:0xff3300 },
    { name:'Jupiter', radius:1.80, distance:23, speed:0.004, color:0xd99b58 },
    { name:'Saturn',  radius:1.40, distance:30, speed:0.003, color:0xc5ab6e, hasRing:true },
    { name:'Uranus',  radius:0.90, distance:36, speed:0.002, color:0x66ccff }
  ];

  const planets = [];
  planetsData.forEach(d => {
    // Orbit line
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const t = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * d.distance, 0, Math.sin(t) * d.distance));
    }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x40e0d0, transparent: true, opacity: 0.20 })));

    // Planet
    const pGeo   = new THREE.SphereGeometry(d.radius, 28, 28);
    const pMesh  = new THREE.Mesh(pGeo, new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.7, metalness: 0.1 }));
    const grp    = new THREE.Group();
    grp.add(pMesh);
    pMesh.position.x = d.distance;
    scene.add(grp);

    if (d.hasRing) {
      const rMesh = new THREE.Mesh(
        new THREE.RingGeometry(d.radius * 1.4, d.radius * 2.2, 32),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, transparent: true, opacity: 0.70 })
      );
      rMesh.rotation.x = Math.PI / 2 + 0.3;
      pMesh.add(rMesh);
    }

    planets.push({ group: grp, mesh: pMesh, speed: d.speed, angle: Math.random() * Math.PI * 2 });
  });

  // Drag-rotate
  addDragRotate(container, scene);

  // Resize
  window.addEventListener('resize', () => {
    if (!container || !_threeRenderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    _threeRenderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Animate
  function animate() {
    _threeAnimId = requestAnimationFrame(animate);
    starField.rotation.y += 0.0002;
    sun.rotation.y       += 0.005;
    planets.forEach(p => {
      p.angle         += p.speed;
      p.group.rotation.y = p.angle;
      p.mesh.rotation.y  += 0.018;
    });
    renderer.render(scene, camera);
  }
  animate();
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SUB-APP OVERLAY
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const OVERLAY_STORY_CLASS = 'app-overlay--story';
const OVERLAY_FULLSCREEN_CLASS = 'app-overlay--fullscreen';
const FULLSCREEN_OVERLAY_BODY_CLASS = 'fullscreen-overlay-open';
let _overlayResetTimer = null;

function setOverlayMode(overlay, mode) {
  overlay.classList.remove(OVERLAY_STORY_CLASS, OVERLAY_FULLSCREEN_CLASS);
  overlay.classList.add(mode === 'story' ? OVERLAY_STORY_CLASS : OVERLAY_FULLSCREEN_CLASS);
}

function closeOverlay() {
  const overlay = document.getElementById('app-overlay');
  const iframe  = document.getElementById('app-iframe');
  document.body.classList.remove(FULLSCREEN_OVERLAY_BODY_CLASS);
  if (overlay) overlay.classList.add('hidden');
  if (_overlayResetTimer) clearTimeout(_overlayResetTimer);
  if (!iframe) return;
  _overlayResetTimer = setTimeout(() => {
    iframe.src = '';
    iframe.removeAttribute('src');
    _overlayResetTimer = null;
  }, 300);
}

function showOverlay(url, mode = 'fullscreen', { cacheBust = false } = {}) {
  const overlay = document.getElementById('app-overlay');
  const iframe  = document.getElementById('app-iframe');
  if (!overlay || !iframe || !url) return;

  if (_overlayResetTimer) {
    clearTimeout(_overlayResetTimer);
    _overlayResetTimer = null;
  }

  setOverlayMode(overlay, mode);
  document.body.classList.toggle(FULLSCREEN_OVERLAY_BODY_CLASS, mode === 'fullscreen');

  let finalUrl = url;
  if (cacheBust) {
    finalUrl += (url.includes('?') ? '&' : '?') + 'cb=' + Date.now();
  }

  iframe.src = finalUrl;
  overlay.classList.remove('hidden');
}

function initOverlayLauncher() {
  const closeBtn = document.getElementById('close-app-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeOverlay);
  }

  window.addEventListener('message', e => {
    if (e.data === 'closeOverlay') closeOverlay();
  });
}

window.closeOverlay = closeOverlay;
window.openStoryVideo = function(url) {
  showOverlay(url, 'story');
};

function openExperiment(url) {
  if (url.startsWith('placeholder')) {
    alert("This experiment is currently in development and will be released soon!");
  } else {
    showOverlay(url, 'fullscreen', { cacheBust: true });
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NAV ACTIVE STATE
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function updateNavActive(screenId) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const map = { 'screen-home': 'home', 'screen-subjects': 'studies', 'screen-chapters': 'studies', 'screen-chapter-detail': 'studies' };
  const key = map[screenId];
  if (key) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const label = btn.querySelector('.nav-label');
      if (label && label.textContent.trim().toLowerCase() === key) btn.classList.add('active');
    });
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   RIPPLE FEEDBACK & SOUND
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
let _audioCtx;
function playClickSound() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  
  const osc = _audioCtx.createOscillator();
  const gain = _audioCtx.createGain();
  osc.connect(gain);
  gain.connect(_audioCtx.destination);
  
  // A subtle, crisp, pleasant "tick/pop" sound
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, _audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, _audioCtx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.15, _audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, _audioCtx.currentTime + 0.05);
  
  osc.start();
  osc.stop(_audioCtx.currentTime + 0.06);
}

function addRipple(e) {
  playClickSound();

  const btn  = e.currentTarget;

  // Guarantee the button is a positioning context so our span lands inside it
  const existingPos = window.getComputedStyle(btn).position;
  if (existingPos === 'static') btn.style.position = 'relative';

  const rect = btn.getBoundingClientRect();

  // Use clientX/Y from the pointer event directly â€” works for mouse & touch
  const clientX = e.clientX !== undefined ? e.clientX
                : (e.changedTouches ? e.changedTouches[0].clientX : rect.left + rect.width  / 2);
  const clientY = e.clientY !== undefined ? e.clientY
                : (e.changedTouches ? e.changedTouches[0].clientY : rect.top  + rect.height / 2);

  // Position relative to the button's own top-left corner
  const cx = clientX - rect.left;
  const cy = clientY - rect.top;

  const ripple = document.createElement('span');
  ripple.style.cssText = [
    'position:absolute',
    'border-radius:50%',
    'width:8px',
    'height:8px',
    `left:${cx}px`,
    `top:${cy}px`,
    'background:rgba(255, 255, 255, 0.45)', // Clean white highlight for bright glass UI
    'transform:translate(-50%,-50%) scale(0)',
    'pointer-events:none',
    'z-index:9999',
    'animation:ripple-exp .55s cubic-bezier(.25,.46,.45,.94) forwards'
  ].join(';');

  if (!document.getElementById('ripple-style')) {
    const sty = document.createElement('style');
    sty.id = 'ripple-style';
    sty.textContent = '@keyframes ripple-exp{to{transform:translate(-50%,-50%) scale(28);opacity:0;}}';
    document.head.appendChild(sty);
  }

  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 580);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   INIT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
document.addEventListener('DOMContentLoaded', () => {

  // Wire sol-tabs via delegation
  const tabNav = document.getElementById('chapter-nav-tabs');
  if (tabNav) {
    tabNav.addEventListener('click', e => {
      const btn = e.target.closest('.sol-tab');
      if (btn && btn.dataset.tab) switchSolTab(btn.dataset.tab);
    });
  }

  // Ripple and sound on interactive surfaces globally
  // IMPORTANT: position:relative must be set so the absolute span lands inside the button
  document.querySelectorAll('button, .glass-panel-card, .nav-btn, .btn-back, .sol-tab, .btn-primary, .btn-secondary').forEach(el => {
    if (window.getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }
    el.style.overflow = 'hidden';
    el.addEventListener('pointerdown', addRipple);
  });

  // Keyboard: Escape = go back
  document.addEventListener('keydown', e => {
    const overlay = document.getElementById('app-overlay');
    if ((e.key === 'Escape' || e.key === 'Backspace') && overlay && !overlay.classList.contains('hidden')) {
      e.preventDefault();
      closeOverlay();
      return;
    }

    if ((e.key === 'Escape' || e.key === 'Backspace') && AppState.previousScreen && AppState.currentScreen !== 'screen-home') {
      navigateTo(AppState.previousScreen);
    }
  });

  // Prevent context menu on smartboard
  document.addEventListener('contextmenu', e => e.preventDefault());

  initOverlayLauncher();
  document.body.classList.remove('fullscreen-overlay-open');

  // Show theme button only on main screens on initial load
  updateThemeBtnVisibility(AppState.currentScreen);
  updateFullscreenToggleUI();

  console.log('%c✦ Edtech Island — Light & Shadows scene ready ✦', 'color:#40e0d0;font-weight:bold;font-size:13px;');
});

function scrollCarousel(direction) {
  const carousel = document.getElementById('experiments-carousel');
  if (carousel) {
    // Scroll by the width of 4 cards + 4 gaps (200*4 + 30*4 = 920px)
    carousel.scrollBy({ left: direction * 920, behavior: 'smooth' });
  }
}

// --- Theme Toggle Logic ---
const MAIN_SCREENS = new Set(['screen-home', 'screen-subjects', 'screen-chapters']);

function updateThemeBtnVisibility(screenId) {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  if (MAIN_SCREENS.has(screenId)) {
    themeBtn.style.display = 'flex';
  } else {
    themeBtn.style.display = 'none';
  }
}

window.toggleTheme = function() {
  const isLight = document.body.classList.toggle('light-theme');
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    if (isLight) {
      themeBtn.innerHTML = '<span class="theme-icon">☀️</span> Light';
    } else {
      themeBtn.innerHTML = '<span class="theme-icon">🌙</span> Dark';
    }
  }
};

/* ====================================================================
   FULLSCREEN TOGGLE
   ==================================================================== */
function isFullscreenActive() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

function updateFullscreenToggleUI() {
  const btn = document.getElementById('fullscreen-toggle');
  if (!btn) return;

  const isActive = isFullscreenActive();
  if (isActive) {
    btn.innerHTML = '<span class="fullscreen-icon">⤢</span> Exit Fullscreen';
    btn.setAttribute('aria-label', 'Exit Fullscreen');
  } else {
    btn.innerHTML = '<span class="fullscreen-icon">⛶</span> Fullscreen';
    btn.setAttribute('aria-label', 'Enter Fullscreen');
  }
}

window.toggleAppFullscreen = async function() {
  const root = document.documentElement;

  try {
    if (!isFullscreenActive()) {
      if (root.requestFullscreen) {
        await root.requestFullscreen();
      } else if (root.webkitRequestFullscreen) {
        root.webkitRequestFullscreen();
      } else if (root.msRequestFullscreen) {
        root.msRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } catch (err) {
    console.warn('Fullscreen toggle failed:', err);
  } finally {
    updateFullscreenToggleUI();
  }
};

document.addEventListener('fullscreenchange', updateFullscreenToggleUI);
document.addEventListener('webkitfullscreenchange', updateFullscreenToggleUI);
document.addEventListener('MSFullscreenChange', updateFullscreenToggleUI);
