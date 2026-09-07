# Qingyuan’s desktop

A static, raspberry-pink, early-Windows-inspired portfolio with an orthographic, cel-shaded Three.js CRT computer with fine outlines and orbiting project windows. Click a project window or its accessible HTML button to open a project detail dialog. Drag horizontally to orbit, or use the arrow keys when the scene is focused. Motion can be paused and follows reduced-motion preferences.

## Develop

Use Node 24 and pnpm 11.19.0.

```sh
pnpm install
pnpm dev
pnpm build
```

The static site is exported to `dist/client`. `scripts/build.mjs` defers Vinext’s successful Windows shutdown by one second to avoid a native-worker shutdown race. Failed builds still exit immediately with their original error status.

## GitHub Pages

The intended repository is `qingyuandev/qingyuandev.github.io`. In repository Settings → Pages, select GitHub Actions as the source. The included workflow builds and deploys the static site on pushes to `main`. No custom domain or paid hosting is required. This checkout is prepared for the account-root URL; a differently named project repository would require a base-path configuration.

## Edit content

- `app/page.tsx`: project records, experience dates, external links, contact details.
- `app/retro-desktop.tsx`: 3D computer, orbiting project windows, motion and interaction.
- `app/globals.css`: retro visual styling and responsive layouts.
- `public/media`: project assets.

## Content provenance

Professional dates and contributions: Qingyuan Ma CV 2026.pdf supplied through the local Downloads folder. Thesis: Final Thesis Presentation -June 10th 2025.pptx. Additional images and demos: pre-mqy.key and Interview Intro - Qingyuan.key. Character comparison: user-supplied image. Fluid images: linked Ma-qy/tda362-labs repository, which redirects to qingyuann/tda362-labs. Alice images: the user’s linked itch.io game page. Hospital, EmoWear and research graphics: supplied presentations. Volvo and VR covers are explicitly identified workflow diagrams, not product screenshots. Original presentation files, third-party reference contact details and phone numbers are not bundled.

The site includes short silent MP4 excerpts of local project demos and links to the original code, game and publications. The YouTube player loads only after the visitor chooses to watch. WebGL failure preserves HTML navigation and every project detail. GPU pixel ratio is capped and rendering is suspended while the scene is offscreen or the tab is hidden.

