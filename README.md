# ParticleText Reimagined

A standalone, dependency-free particle text landing page inspired by the ParticleText concept and rebuilt as a GitHub-ready project.

## Included

- Interactive particle text rendered on HTML canvas
- Mouse and touch repulsion with spring-back motion
- Live text editing, preset chips, density tuning, glow control, and pointer radius control
- Theme presets, theme shuffling, constellation links, and ambient background particles
- Trigger burst effect for a quick motion accent
- Responsive layout suitable for desktop and mobile
- Automatic GitHub Pages deployment via GitHub Actions
- Custom SVG favicon

## Run locally

Because this project is plain HTML, CSS, and JavaScript, you can open `index.html` directly or serve it with any static server.

Example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy on GitHub Pages

The repository includes `.github/workflows/deploy.yml` for Pages deployment.

1. Push to `main`
2. In GitHub, open `Settings > Pages`
3. Set `Source` to `GitHub Actions`
4. The workflow will publish the site automatically on future pushes

## Project Files

- `index.html` for structure
- `styles.css` for layout and visual treatment
- `app.js` for the particle engine and controls
- `favicon.svg` for browser branding
