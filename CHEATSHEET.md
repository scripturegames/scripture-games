# Cheatsheet — scripture-games

## Play

Open `index.html` in a browser (or the Pages URL in `README.md`). Pick a story, pick a game.

### Jeopardy (Job, David and Goliath, Psalms, Proverbs)

| Key | Action |
|-----|--------|
| Spacebar | Reveal the correct response |
| ESC | Close the current clue (or open Menu from the board) |
| 1–9 then Up/Down | Select team, change score |

### Pictionary (Job, David and Goliath, Psalms, Proverbs)

| Key / button | Action |
|-----|--------|
| Next or Spacebar | Next shuffled drawing prompt |
| Cover word | Hide the prompt so guessers watch the board |
| ESC or Hub | Back to the hub |

### Scripture Chase (Isaiah CFM Sep 14–20 2026)

| Key / button | Action |
|-----|--------|
| Click a tile or Random / Spacebar | Show the reference, start a 15-second hunt timer and ticks |
| Reveal verse or Spacebar | Show the verse text |
| Discuss or Spacebar after reveal | Section heading, summary, and that verse’s questions |
| Back (bottom left) or ESC | Previous step: discuss → verse → reference → board → hub |
| Back to Board (bottom right) | Return to the tile board |
| Back to Hub (board, bottom left) | Back to the hub |

### Matching (Isaiah CFM Sep 21–27 2026)

| Key / button | Action |
|-----|--------|
| Memory / Face up | Hide pictures (classic) or show all (younger Primary) |
| Click two tiles | Match → discuss prompt. Mismatch flips back after a beat |
| Spacebar or Keep matching | Close the discuss screen |
| Shuffle | New mix of the same pictures |
| ESC | Discuss → board → hub |

Legacy board: `david-and-goliath.html`.

## Constraints

- `file://` must work. Load story packs with `<script src="stories/….js">`, not `fetch('….json')`.
- No PHP, no `npm start`. GitHub Pages is an allowed share path; `file://` must still work.
- One `.js` file per story. Jeopardy clues: `{ clue, response, hint, category, difficulty }`. Pictionary prompts: `{ draw, ref }`. Scripture Chase verses: `{ ref, section, text, summary, questions }`. Matching pictures: `{ id, section, label, image, refs, prompt, source }`. Church Media Library copies go in `stories/images/<pack-id>/` with `CREDITS.md` linking the original page.
- Do not delete `david-and-goliath.html` until Job + engine + migrated pack work in class.
- Do not create inner `projects/` for game types.
- Come Follow Me packs are requested one week at a time. Do not build a week-key calendar unless asked.

## Add a story (v1)

Ask the agent for a pack. It writes `stories/<slug>.js` and registers it in `stories/catalog.js`. Operator does not hand-edit unless they want to.

New CFM content and new games: take scriptures and principles from **Ideas for Teaching Children** only. Keep the hopeful parts (Christ saves, refuge, Restoration). Skip adult warning sections unless asked. Matching pictures are original SVGs in `stories/images/` — do not paste church gospel art or member printables.

## Open this repo

Cursor: **File → Open Folder** → `D:\Dev\scripture-games` (its own window, not `D:\Dev`).

Architecture: `docs/ARCHITECTURE.md`. Backlog: `ISSUES.md`.
