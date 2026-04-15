# ParticleText Reimagined

An interactive particle-text experience built with vanilla JavaScript and the HTML5 Canvas API. No frameworks, no build step, and no dependencies — just a fast, lightweight front end designed to feel playful, polished, and easy to deploy.

## Overview

ParticleText Reimagined turns text into a living field of animated particles. Type into the interface and the canvas redraws your words as a glowing particle formation. Move your cursor through the composition to push particles away, switch between color themes, adjust the interaction feel, and trigger a burst animation for a more dramatic effect.

The project is built as a static site, so it runs locally with a simple file open or a tiny local server and deploys cleanly to GitHub Pages.

## Live Demo

- Site: https://phani06041.github.io/particletext-reimagined/
- Repo: https://github.com/phani06041/particletext-reimagined

## Features

- Interactive particle text rendered on an HTML5 canvas
- Real-time text redraw with editable input
- Pointer-based particle repulsion with smooth spring-back motion
- Theme presets with one-click shuffling
- Adjustable particle density, pointer radius, and glow intensity
- Optional constellation-style links between nearby particles
- Ambient background particle layer for added depth
- Quick text preset chips for instant demos
- Burst interaction for a fast scatter-and-return effect
- Responsive layout for desktop and mobile screens
- Custom SVG favicon
- Automatic deployment through GitHub Pages

## Controls

### Text Controls

- Type a word or short phrase in the text field
- Click `Redraw` to regenerate the particle layout
- Use the preset chips to switch text instantly
- Toggle `Auto-cycle showcase words` to rotate through demo text

### Visual Controls

- Change `Theme` to switch the color palette
- Adjust `Density` for fewer or more particles
- Adjust `Glow Intensity` to change the center bloom
- Toggle `Show constellation links` to enable or disable connecting lines

### Interaction Controls

- Move the cursor across the canvas to repel particles
- Adjust `Pointer Radius` to control the interaction area
- Click `Trigger Burst` for a quick global scatter effect
- Use `Shuffle Theme` for a fast palette change

## Technical Notes

### Rendering Model

The text is rasterized to an off-screen canvas, sampled by alpha, and converted into particle target positions. Each visible particle stores:

- a current position
- an origin position
- a velocity vector
- a per-particle color and size

### Motion System

Particles are animated with a simple spring-and-friction model:

- particles accelerate toward their origin positions
- pointer interaction adds repulsion force inside a configurable radius
- friction smooths the motion and prevents jitter

### Performance Approach

The project stays lightweight by using:

- a single canvas for rendering
- `requestAnimationFrame` for the animation loop
- capped particle counts during text generation
- a dependency-free static architecture

## Project Structure

```text
particletext-reimagined/
├── .github/workflows/deploy.yml
├── app.js
├── favicon.svg
├── index.html
├── README.md
└── styles.css
```

## Run Locally

You can open `index.html` directly in a browser, but serving it locally is a better dev experience.

```bash
cd /Users/phanindra/Madmaxx/particletext-reimagined
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

This repo already includes a GitHub Pages workflow.

1. Push changes to `main`
2. Open the repository settings
3. In `Pages`, set `Source` to `GitHub Actions`
4. GitHub will publish the site automatically on future pushes

## Customization Ideas

If you want to keep evolving the project, good next upgrades would be:

- smoother text transitions between words
- exportable theme presets
- mobile-specific performance tuning
- a 3D depth layer or faux perspective effect
- downloadable screenshots or recorded loops

## License

MIT
