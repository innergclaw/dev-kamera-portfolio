# Dev Kamera Video Portfolio

Netflix-style single-page portfolio for local video work. Built with Next.js App Router, React, Tailwind CSS, and a dark streaming-library layout.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Add your media

Drop files into these folders:

- `public/videos/hero.mp4` powers the full-screen hero.
- `public/videos/*.mp4` powers tile hover previews and the modal player.
- `public/thumbnails/*.jpg` or `.png` supplies tile poster frames.

The file names are defined in `data/library.ts`. Replace the placeholder paths there when you add your own titles, descriptions, thumbnails, and MP4 files. The page renders dark CSS placeholders before any media is added.

## Main files

- `app/portfolio-app.tsx` contains the navigation, hero, rows, tiles, modal, and footer.
- `data/library.ts` is the single content source for all rows.
- `app/globals.css` contains the dark visual system and responsive behavior.

Video modals close with Escape or by clicking the backdrop. Tile rows support native touch scrolling on mobile, and reduced-motion preferences are respected.
