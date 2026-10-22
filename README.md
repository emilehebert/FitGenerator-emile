# Fit Generator

A small web app for mixing and matching an outfit from a closet of hand-photographed clothes.

- Click a piece, or use the arrows, to change it
- Shuffle the whole outfit, and lock the pieces you want to keep
- Pick a piece from a grid, and switch between pants and shorts or shirts and crewnecks
- Light and dark themes

## Stack

Vanilla JavaScript (ES modules, one class per component), SCSS and Twig templates, built with Gulp and Webpack.

## Running it

```bash
npm install
npm start       # dev server with live reload
npm run build   # production build in dist/
```

## Structure

- `src/scripts/components/Clothes.js`: the outfit logic. The clothing categories and their variants are defined in `CATEGORIES`.
- `src/scripts/components/ThemeToggle.js`: the light/dark switch
- `src/styles/`: SCSS organized as settings, tools, generic, elements and components
- `src/assets/images/clothes/`: one folder per category, with images numbered `0.png`, `1.png`, …
