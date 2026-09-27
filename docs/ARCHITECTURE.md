# Architecture — scripture-games

**Last aligned:** 2026-09-27
**Audience:** a human who needs to know what this repo is and what is actually running.

## In one paragraph

Teacher-hosted projector games for church (starting with Primary): pick a scripture story, pick a game type, play in the browser. Static HTML/CSS/JS. Packs are JSON-shaped `.js` files loaded on demand with a script tag so `file://` and GitHub Pages both work. No PHP, no local server, no `fetch()` of `.json`. New CFM content and new games take scriptures and principles from **Ideas for Teaching Children**, with a hopeful Christ / Restoration focus.

## Picture of the system

```text
index.html (hub)
  ├─ how-to.html / credits.html
  ├─ games/gospel-link.js   Gospel Library URLs for refs
  ├─ stories/catalog.js     story list × game types
  ├─ stories/<slug>.js      clues + drawPrompts and/or chaseVerses / matchItems
  ├─ games/jeopardy/        5×5 board, hint, Spacebar reveal
  ├─ games/pictionary/      Next / Cover word
  ├─ games/scripture-chase/ Hidden tiles, reveal verse, discuss
  └─ games/matching/        One 6×4 board, memory or face-up, verse + discuss after match
Play: file://  or  https://scripturegames.github.io/scripture-games/
```

## What exists

| Piece | Status |
|-------|--------|
| Hub `index.html` (story × game, render in place) | live |
| Jeopardy engine `games/jeopardy/` | live |
| Pictionary engine `games/pictionary/` | live |
| Scripture Chase engine `games/scripture-chase/` | live |
| Matching engine `games/matching/` (one 6×4 board; discuss shows verse text) | live |
| Gospel Library links on scripture refs (`games/gospel-link.js`) | live |
| Hub pages `how-to.html`, `credits.html` | live |
| Pack Job | live |
| Pack David and Goliath | live |
| Pack Psalms CFM Aug 31–Sep 6 2026 | live |
| Pack Proverbs CFM Sep 7–13 2026 | live |
| Pack Isaiah CFM Sep 14–20 2026 (chase-only) | live |
| Pack Isaiah CFM Sep 21–27 2026 (matching-only) | live |
| GitHub Pages (`master` `/`, `.nojekyll`) | live |
| Legacy `david-and-goliath.html` | live (keep until hub is proven in class) |
| Book-category hub (OT / NT / BoM / D&C / CFM-by-date) | not-built |
| Trivia / buzzers / authoring form / CFM calendar | not-built |
| Custom domain / Cloudflare | not-built (do not add unless asked) |
