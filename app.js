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
];

const showcaseWords = [
  "PHANINDRA",
  "PARTICLES",
  "CREATIVE",
  "GITHUB",
  "REIMAGINED",
];

const canvas = document.querySelector("#particleCanvas");
const ctx = canvas.getContext("2d", { alpha: true });
const textInput = document.querySelector("#textInput");
const themeSelect = document.querySelector("#themeSelect");
const densityInput = document.querySelector("#densityInput");
const cycleToggle = document.querySelector("#cycleToggle");
const controlsForm = document.querySelector("#controls");
const shuffleButton = document.querySelector("#shuffleButton");

const pointer = {
  active: false,
  x: 0,
  y: 0,
  radius: 110,
};

const state = {
  text: textInput.value.trim() || "PHANINDRA",
  density: Number(densityInput.value),
  themeIndex: 0,
  particles: [],
  animationId: 0,
  wordIndex: 0,
  cycleId: 0,
};

class Particle {
  constructor(x, y, color, size) {
    this.originX = x;
    this.originY = y;
    this.x = x + (Math.random() - 0.5) * 24;
    this.y = y + (Math.random() - 0.5) * 24;
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
      const distance = Math.hypot(dx, dy);
      if (distance < pointer.radius) {
        const force = (pointer.radius - distance) / pointer.radius;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force * 2.3;
        this.vy += Math.sin(angle) * force * 2.3;
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

function populateThemeSelect() {
  themeSelect.innerHTML = themes
    .map(
      (theme, index) =>
        `<option value="${index}">${theme.name}</option>`
    )
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

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
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
  const particlesList = [];
  const gap = state.density;

  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      const alpha = imageData[(y * width + x) * 4 + 3];
      if (alpha > 120) {
        const color = particles[Math.floor(Math.random() * particles.length)];
        particlesList.push(new Particle(x, y, color, gap * 0.28));
      }
    }
  }

  state.particles = particlesList.slice(0, 14000);
}

function drawConnections() {
  const maxDistance = 22;
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
  const gradient = ctx.createRadialGradient(
    canvas.clientWidth * 0.5,
    canvas.clientHeight * 0.5,
    50,
    canvas.clientWidth * 0.5,
    canvas.clientHeight * 0.5,
    canvas.clientWidth * 0.45
  );
  gradient.addColorStop(0, `${theme.accentStrong}22`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function animate() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  renderBackgroundGlow();

  for (const particle of state.particles) {
    particle.update();
    particle.draw();
  }

  drawConnections();
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

cycleToggle.addEventListener("change", () => {
  if (cycleToggle.checked) {
    startAutoCycle();
  } else {
    stopAutoCycle();
  }
});

shuffleButton.addEventListener("click", () => {
  const nextIndex = (state.themeIndex + 1) % themes.length;
  applyTheme(nextIndex);
  rebuildParticles();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(state.animationId);
    stopAutoCycle();
  } else {
    animate();
    startAutoCycle();
  }
});
