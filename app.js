const canvas = document.querySelector("#globe-canvas");

const markets = [
  { name: "Ho Chi Minh City", lat: 10.8231, lon: 106.6297, color: "#ff6f61" },
  { name: "North America", lat: 39.8283, lon: -98.5795, color: "#61d6a2" },
  { name: "Canada", lat: 56.1304, lon: -106.3468, color: "#f6c35d" },
  { name: "Europe", lat: 50.1109, lon: 8.6821, color: "#65d9e8" },
];

const routes = [
  [markets[0], markets[1]],
  [markets[0], markets[2]],
  [markets[0], markets[3]],
];

startGlobe();

async function startGlobe() {
  try {
    const THREE = await import("https://unpkg.com/three@0.165.0/build/three.module.js");
    createThreeGlobe(THREE);
  } catch (error) {
    console.warn("Three.js CDN unavailable, using canvas fallback.", error);
    createFallbackGlobe();
  }
}

function createThreeGlobe(THREE) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);

  const globeTexture = new THREE.CanvasTexture(createGlobeTexture());
  globeTexture.anisotropy = 8;

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(2.25, 96, 96),
    new THREE.MeshStandardMaterial({
      map: globeTexture,
      metalness: 0.18,
      roughness: 0.72,
      emissive: new THREE.Color("#143028"),
      emissiveIntensity: 0.4,
    }),
  );
  group.add(globe);

  const wire = new THREE.Mesh(
    new THREE.SphereGeometry(2.262, 32, 32),
    new THREE.MeshBasicMaterial({
      color: "#dffced",
      opacity: 0.12,
      transparent: true,
      wireframe: true,
    }),
  );
  group.add(wire);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.42, 96, 96),
    new THREE.MeshBasicMaterial({
      color: "#61d6a2",
      opacity: 0.09,
      side: THREE.BackSide,
      transparent: true,
    }),
  );
  group.add(atmosphere);

  const routeGroup = new THREE.Group();
  routes.forEach(([from, to], index) => {
    routeGroup.add(createRoute(THREE, from, to, index));
  });
  markets.forEach((market) => routeGroup.add(createPin(THREE, market)));
  group.add(routeGroup);

  scene.add(new THREE.HemisphereLight("#f8fbf5", "#203d34", 2.4));
  const keyLight = new THREE.DirectionalLight("#ffffff", 3.2);
  keyLight.position.set(-4, 5, 4);
  scene.add(keyLight);
  const edgeLight = new THREE.PointLight("#ff6f61", 12, 8);
  edgeLight.position.set(3, -2, 2);
  scene.add(edgeLight);

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.35;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.2;
  });

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.position.set(width < 720 ? 0.6 : 1.7, width < 720 ? 0.2 : 0.1, 7.2);
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener("resize", resize);

  let frame = 0;
  renderer.setAnimationLoop(() => {
    frame += 0.01;
    group.rotation.y = -0.74 + frame * 0.18 + pointer.x;
    group.rotation.x = -0.12 + pointer.y;
    atmosphere.scale.setScalar(1 + Math.sin(frame * 2) * 0.012);
    routeGroup.children.forEach((child, index) => {
      if (child.userData.pulse) {
        child.material.opacity = 0.48 + Math.sin(frame * 3 + index) * 0.18;
      }
    });
    renderer.render(scene, camera);
  });
}

function createRoute(THREE, from, to, index) {
  const start = latLonToVector(THREE, from.lat, from.lon, 2.31);
  const end = latLonToVector(THREE, to.lat, to.lon, 2.31);
  const mid = start.clone().add(end).normalize().multiplyScalar(3.18 + index * 0.08);
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const geometry = new THREE.TubeGeometry(curve, 72, 0.011, 8, false);
  const route = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: to.color,
      opacity: 0.62,
      transparent: true,
    }),
  );
  route.userData.pulse = true;
  return route;
}

function createPin(THREE, market) {
  const pin = new THREE.Group();
  const point = latLonToVector(THREE, market.lat, market.lon, 2.36);
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 20, 20),
    new THREE.MeshBasicMaterial({ color: market.color }),
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.008, 8, 32),
    new THREE.MeshBasicMaterial({
      color: market.color,
      opacity: 0.65,
      transparent: true,
    }),
  );
  pin.position.copy(point);
  pin.lookAt(0, 0, 0);
  pin.add(dot, ring);
  return pin;
}

function latLonToVector(THREE, lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function createGlobeTexture() {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 512;
  const ctx = textureCanvas.getContext("2d");

  ctx.fillStyle = "#10231e";
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

  ctx.strokeStyle = "rgba(248, 251, 245, 0.12)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= textureCanvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, textureCanvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= textureCanvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(textureCanvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#355f4f";
  drawLand(ctx, [
    [140, 150],
    [205, 106],
    [282, 126],
    [315, 192],
    [270, 246],
    [206, 238],
    [162, 206],
  ]);
  drawLand(ctx, [
    [258, 254],
    [330, 272],
    [350, 352],
    [304, 420],
    [250, 378],
    [228, 304],
  ]);
  drawLand(ctx, [
    [468, 134],
    [562, 116],
    [620, 174],
    [594, 236],
    [496, 232],
    [438, 184],
  ]);
  drawLand(ctx, [
    [600, 184],
    [742, 178],
    [844, 254],
    [814, 340],
    [686, 322],
    [604, 260],
  ]);
  drawLand(ctx, [
    [780, 342],
    [860, 374],
    [852, 430],
    [760, 420],
  ]);

  ctx.fillStyle = "rgba(97, 214, 162, 0.18)";
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
  return textureCanvas;
}

function drawLand(ctx, points) {
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
}

function createFallbackGlobe() {
  const ctx = canvas.getContext("2d");
  let t = 0;

  function resize() {
    canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
    canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);
  }

  function draw() {
    t += 0.012;
    const width = canvas.width;
    const height = canvas.height;
    const cx = width * 0.68;
    const cy = height * 0.48;
    const radius = Math.min(width, height) * 0.26;
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, 0, cx, cy, radius);
    gradient.addColorStop(0, "#2b6b58");
    gradient.addColorStop(1, "#10231e");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(248, 251, 245, 0.18)";
    ctx.lineWidth = Math.max(1, width * 0.0012);
    for (let i = -3; i <= 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * (0.22 + Math.abs(i) * 0.16), radius, t + i * 0.18, 0, Math.PI * 2);
      ctx.stroke();
    }

    const routeColor = ["#ff6f61", "#61d6a2", "#65d9e8"];
    routeColor.forEach((color, i) => {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(cx - radius * 0.1, cy + radius * 0.2);
      ctx.quadraticCurveTo(cx - radius * (1.1 + i * 0.18), cy - radius * (0.7 + i * 0.08), cx - radius * 1.72, cy - radius * (0.28 - i * 0.25));
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
}
