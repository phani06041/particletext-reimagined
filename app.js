const themes = [
  {
    name: "Aurora",
    background: "#08111f",
    accent: "#9effd2",
    accentStrong: "#42f5b9",
    particles: ["#9effd2", "#5cf2ff", "#d2f7ff"],
  },
  {
    name: "Solar Flare",
    background: "#180b06",
    accent: "#ffbf69",
    accentStrong: "#ff7a18",
    particles: ["#ffd166", "#ff7a18", "#fff0c2"],
  },
  {
    name: "Electric Bloom",
    background: "#11071d",
    accent: "#ffa1f5",
    accentStrong: "#8d7cff",
    particles: ["#ffa1f5", "#8d7cff", "#e4ddff"],
  },
  {
    name: "Arctic Pulse",
    background: "#041722",
    accent: "#88f0ff",
    accentStrong: "#38d4ff",
    particles: ["#38d4ff", "#88f0ff", "#eefcff"],
  },
];

const showcaseWords = [
  "PHANINDRA",
  "PARTICLES",
  "CREATIVE",
  "MADMAXX",
  "GITHUB",
  "REIMAGINED",
];

const canvas = document.querySelector("#particleCanvas");
const ctx = canvas.getContext("2d", { alpha: true });
const textInput = document.querySelector("#textInput");
const themeSelect = document.querySelector("#themeSelect");
const densityInput = document.querySelector("#densityInput");
const radiusInput = document.querySelector("#radiusInput");
const glowInput = document.querySelector("#glowInput");
const cycleToggle = document.querySelector("#cycleToggle");
const linksToggle = document.querySelector("#linksToggle");
const controlsForm = document.querySelector("#controls");
const shuffleButton = document.querySelector("#shuffleButton");
const burstButton = document.querySelector("#burstButton");
const particleCount = document.querySelector("#particleCount");
const fpsHint = document.querySelector("#fpsHint");
const chips = document.querySelectorAll(".chip");

const pointer = {
  active: false,
  x: 0,
  y: 0,
  radius: Number(radiusInput.value),
};

const state = {
  text: textInput.value.trim() || "PHANINDRA",
  density: Number(densityInput.value),
  themeIndex: 0,
  particles: [],
  ambient: [],
  animationId: 0,
  wordIndex: 0,
  cycleId: 0,
  glowStrength: Number(glowInput.value) / 100,
  showLinks: linksToggle.checked,
  frameCount: 0,
  fpsLastTick: performance.now(),
};

class Particle {
  constructor(x, y, color, size) {
    this.originX = x;
    this.originY = y;
    this.x = x + (Math.random() - 0.5) * 30;
    this.y = y + (Math.random() - 0.5) * 30;
    this.color = color;
    this.size = size;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.86;
    this.ease = 0.11 + Math.random() * 0.05;
  }

  update() {
    if (pointer.active) {
      const dx = this.x - pointer.x;
      const dy = this.y - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance < pointer.radius) {
        const force = (pointer.radius - distance) / pointer.radius;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force * 2.5;
        this.vy += Math.sin(angle) * force * 2.5;
      }
    }

    this.vx += (this.originX - this.x) * this.ease;
    this.vy += (this.originY - this.y) * this.ease;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class AmbientParticle {
  constructor(width, height) {
    this.reset(width, height);
    this.y = Math.random() * height;
  }

  reset(width, height) {
    this.x = Math.random() * width;
    this.y = height + Math.random() * height * 0.3;
    this.size = 1 + Math.random() * 2.2;
    this.speed = 0.25 + Math.random() * 0.7;
    this.alpha = 0.18 + Math.random() * 0.25;
  }

  update(width, height) {
    this.y -= this.speed;
    if (this.y < -20) {
      this.reset(width, height);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function populateThemeSelect() {
  themeSelect.innerHTML = themes
    .map((theme, index) => `<option value="${index}">${theme.name}</option>`)
    .join("");
}

function applyTheme(themeIndex) {
  state.themeIndex = themeIndex;
  const theme = themes[themeIndex];
  document.documentElement.style.setProperty("--bg", theme.background);
  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--accent-strong", theme.accentStrong);
  themeSelect.value = String(themeIndex);
}

function updateStats(text) {
  particleCount.textContent = `${state.particles.length.toLocaleString()} particles`;
  fpsHint.textContent = text;
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createAmbientParticles();
  rebuildParticles();
}

function fitFontSize(text) {
  const maxWidth = canvas.clientWidth * 0.8;
  let size = Math.max(72, Math.min(168, canvas.clientWidth / 6.2));
  ctx.font = `800 ${size}px "Avenir Next", "Segoe UI", sans-serif`;

  while (ctx.measureText(text).width > maxWidth && size > 56) {
    size -= 6;
    ctx.font = `800 ${size}px "Avenir Next", "Segoe UI", sans-serif`;
  }

  return size;
}

function createAmbientParticles() {
  const count = Math.max(18, Math.floor(canvas.clientWidth / 42));
  state.ambient = Array.from(
    { length: count },
    () => new AmbientParticle(canvas.clientWidth, canvas.clientHeight)
  );
}

function rebuildParticles() {
  const text = state.text || "PHANINDRA";
  const { particles } = themes[state.themeIndex];
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext("2d");
  const fontSize = fitFontSize(text);

  offCtx.clearRect(0, 0, width, height);
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.font = `800 ${fontSize}px "Avenir Next", "Segoe UI", sans-serif`;
  offCtx.fillStyle = "#ffffff";
  offCtx.fillText(text, width / 2, height / 2);

  const imageData = offCtx.getImageData(0, 0, width, height).data;
  const nextParticles = [];
  const gap = state.density;

  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      const alpha = imageData[(y * width + x) * 4 + 3];
      if (alpha > 120) {
        const color = particles[Math.floor(Math.random() * particles.length)];
        nextParticles.push(new Particle(x, y, color, gap * 0.28));
      }
    }
  }

  state.particles = nextParticles.slice(0, 15000);
  updateStats("interactive motion");
}

function drawConnections() {
  if (!state.showLinks) {
    return;
  }

  const maxDistance = 24;
  ctx.save();
  ctx.lineWidth = 0.45;
  for (let i = 0; i < state.particles.length; i += 2) {
    const a = state.particles[i];
    const b = state.particles[i + 1];
    if (!a || !b) {
      continue;
    }
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    if (distance < maxDistance) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function renderBackgroundGlow() {
  const theme = themes[state.themeIndex];
  const radius = canvas.clientWidth * (0.26 + state.glowStrength * 0.22);
  const gradient = ctx.createRadialGradient(
    canvas.clientWidth * 0.5,
    canvas.clientHeight * 0.5,
    40,
    canvas.clientWidth * 0.5,
    canvas.clientHeight * 0.5,
    radius
  );
  gradient.addColorStop(0, `${theme.accentStrong}33`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function renderAmbient() {
  for (const particle of state.ambient) {
    particle.update(canvas.clientWidth, canvas.clientHeight);
    particle.draw();
  }
}

function updateFpsHint(now) {
  state.frameCount += 1;
  if (now - state.fpsLastTick > 1000) {
    updateStats(`${state.frameCount} fps snapshot`);
    state.frameCount = 0;
    state.fpsLastTick = now;
  }
}

function animate(now = performance.now()) {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  renderBackgroundGlow();
  renderAmbient();

  for (const particle of state.particles) {
    particle.update();
    particle.draw();
  }

  drawConnections();
  updateFpsHint(now);
  state.animationId = requestAnimationFrame(animate);
}

function updateText(nextText) {
  state.text = (nextText || "").trim().slice(0, 18) || "PHANINDRA";
  textInput.value = state.text;
  rebuildParticles();
}

function startAutoCycle() {
  stopAutoCycle();
  if (!cycleToggle.checked) {
    return;
  }

  state.cycleId = window.setInterval(() => {
    state.wordIndex = (state.wordIndex + 1) % showcaseWords.length;
    updateText(showcaseWords[state.wordIndex]);
  }, 2600);
}

function stopAutoCycle() {
  if (state.cycleId) {
    window.clearInterval(state.cycleId);
    state.cycleId = 0;
  }
}

function setPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = event.clientX - rect.left;
  pointer.y = event.clientY - rect.top;
  pointer.active = true;
}

function burstParticles() {
  pointer.active = true;
  pointer.x = canvas.clientWidth * 0.5;
  pointer.y = canvas.clientHeight * 0.5;

  for (const particle of state.particles) {
    particle.vx += (Math.random() - 0.5) * 12;
    particle.vy += (Math.random() - 0.5) * 12;
  }

  window.setTimeout(() => {
    pointer.active = false;
  }, 180);
}

populateThemeSelect();
applyTheme(0);
resizeCanvas();
animate();
startAutoCycle();

window.addEventListener("resize", resizeCanvas);

canvas.addEventListener("pointermove", setPointerPosition);
canvas.addEventListener("pointerdown", setPointerPosition);
canvas.addEventListener("pointerleave", () => {
  pointer.active = false;
});

controlsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.density = Number(densityInput.value);
  pointer.radius = Number(radiusInput.value);
  state.glowStrength = Number(glowInput.value) / 100;
  updateText(textInput.value);
});

textInput.addEventListener("input", () => {
  stopAutoCycle();
});

themeSelect.addEventListener("change", () => {
  applyTheme(Number(themeSelect.value));
  rebuildParticles();
});

densityInput.addEventListener("input", () => {
  state.density = Number(densityInput.value);
  rebuildParticles();
});

radiusInput.addEventListener("input", () => {
  pointer.radius = Number(radiusInput.value);
});

glowInput.addEventListener("input", () => {
  state.glowStrength = Number(glowInput.value) / 100;
});

cycleToggle.addEventListener("change", () => {
  if (cycleToggle.checked) {
    startAutoCycle();
  } else {
    stopAutoCycle();
  }
});

linksToggle.addEventListener("change", () => {
  state.showLinks = linksToggle.checked;
});

shuffleButton.addEventListener("click", () => {
  const nextIndex = (state.themeIndex + 1) % themes.length;
  applyTheme(nextIndex);
  rebuildParticles();
});

burstButton.addEventListener("click", burstParticles);

for (const chip of chips) {
  chip.addEventListener("click", () => {
    stopAutoCycle();
    updateText(chip.dataset.word || chip.textContent || "PHANINDRA");
  });
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(state.animationId);
    stopAutoCycle();
  } else {
    animate();
    startAutoCycle();
  }
});
