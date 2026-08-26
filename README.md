# altaiyeb.info

Personal site for Aimen Altaiyeb — frontend platform & developer experience.

Vite + React + Sass. No UI framework, no animation library: five dependencies
total (`react`, `react-dom`, `sass`, `vite`, `@vitejs/plugin-react`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the build locally
```

## Structure

```
src/
  Data.json                   all repeating content — edit copy here first
  App.jsx                     mounts background, rail, header, page
  pages/Home.jsx              section order
  hooks/
    useRafScroll.js           passive scroll → one rAF (every scroll effect uses this)
    useReveal.js              reveal-on-enter flag
    useReducedMotion.js       live prefers-reduced-motion
  sass/
    style.scss                imports the three globals below
    default/_variable.scss    palette, fonts, easing, layout widths
    default/_typography.scss  type scale + colour utilities
    default/_general.scss     reset, .wrap/.band/.card/.btn/.reveal/.disclose
  components/<Name>/
    <Name>.jsx                component
    <Name>.scss              its styles, imported by the .jsx
```

Component SCSS is imported by its own component, so a component is one folder
you can delete or move. Only genuinely global vocabulary lives in `sass/default`.

## Where to edit what

| Want to change | Go to |
| --- | --- |
| Any repeating copy — projects, chain steps, CV, toolkit, contact rows, nav | `src/Data.json` |
| Release-chain steps | `Data.json` → `machine.chain`. Each entry is `[label, "human" \| "auto"]`; the human count and the dwell timing derive from it |
| Colours, fonts, spacing scale, content width | `src/sass/default/_variable.scss` |
| Section order | `src/pages/Home.jsx` |
| Prose that appears exactly once (headings, the stakes argument) | the component's `.jsx` |
| Background density / speed / colour | `CONF` at the top of `components/Ambient/Ambient.jsx` |

Hero and contact buttons download `public/Aimen-Altaiyeb-Resume.pdf` (served at
the site root). Replace that file to update the résumé.

## The two custom graphics

**Hero — the propagation stack** (`components/Hero/`). Four plates on the Z
axis: shared packages at the base, then the rendering layer, brand surfaces,
consuming pages. Gold beams rise through them on staggered delays — one change
propagating upward. Tilts with the cursor, turns as you scroll. Scale is set from
JS (`rigScale()`) so it matches the CSS breakpoints exactly.

**The machine** (`components/Machine/`). The chain is colour-coded *at rest* —
a wall of red human steps versus gold automated ones — because that ratio is the
argument; the playhead then walks it, dwelling 1500ms on human steps and 460ms
on automated ones. Autoplays once when scrolled into view.

## Performance rules

The page holds 60fps because of four constraints. Breaking any of them brings
back the jank:

1. **No `backdrop-filter`.** It repaints the entire viewport every frame. Bands
   are translucent via `oklch(… / 0.62)` instead — same look, no cost.
2. **No `filter: blur()` on large elements.** Use a radial-gradient.
3. **No animated `background-position` or large conic-gradients.**
4. **Looping animations touch only `transform` and `opacity`.**

The ambient background is a single `<canvas>` at 24fps with DPR capped at 1.5,
paused when the tab is hidden, edges batched into two colour paths bucketed by
alpha (~8 stroke calls per frame, not one per edge). Every scroll listener goes
through `useRafScroll`.

All motion collapses under `prefers-reduced-motion`.

## Deploy

`.github/workflows/deploy.yml` builds on push to `master` and publishes `dist/`
to `gh-pages` (Node 20; needs the `ACTIONS_DEPLOY_KEY` secret). `public/CNAME`
carries the custom domain.

Apex DNS `A` records for GitHub Pages:
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
plus `CNAME` `www` → `aimenalt.github.io`.

Vercel and Cloudflare Pages need no config beyond `npm run build` → `dist`.
`vercel.json` handles SPA rewrites.
