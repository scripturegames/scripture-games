---
status: completed
created: 2026-08-16
completed: 2026-08-16
vendor: cursor
---

# v1 — hub + Jeopardy + Job

Build slice after scaffold. Contract: `AGENTS.md`, brain wiki `D:\Dev\knowledge\wiki\scripture-games.md`.

## Done

- Hub `index.html`: pick story, pick Jeopardy, render in place
- Original Jeopardy engine in `games/jeopardy/` (5×5, teams, hint, Spacebar, scores)
- Pack format `stories/<slug>.js` — load on demand via script tag
- **Job** pack for this week (Primary, open-book, scripture hints)
- David and Goliath migrated to `stories/david-goliath.js`
- Legacy `david-and-goliath.html` kept until proven in class

## Out of scope (still)

Trivia, PHP, authoring form, CFM week keys, Daily Double / Final Jeopardy, GitHub Pages as the play path, dumping a full OT catalog.


# v1 — hub + Jeopardy + Job

Build slice after scaffold. Contract: `AGENTS.md`, brain wiki `D:\Dev\knowledge\wiki\scripture-games.md`.

## Done (scaffold)

- Entry files, knowledge dirs, rename target `scripture-games`
- Legacy board kept: `david-and-goliath.html`

## Next

1. Small original Jeopardy engine (`games/jeopardy/`) matching current UX: 5×5, teams, hint, Spacebar, scores.
2. Hub `index.html`: pick story, pick Jeopardy, render in place.
3. Pack format `stories/<slug>.js` — load on demand via script tag.
4. Author **Job** for this week (Primary, open-book, scripture hints).
5. Migrate David and Goliath clues into `stories/david-goliath.js`.
6. Only then consider removing or archiving `david-and-goliath.html`.

## Out of scope

Trivia, PHP, authoring form, CFM week keys, Daily Double / Final Jeopardy, GitHub Pages as the play path, dumping a full OT catalog.
