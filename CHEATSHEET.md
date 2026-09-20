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

Legacy board: `david-and-goliath.html`.

## Constraints

- `file://` must work. Load story packs with `<script src="stories/….js">`, not `fetch('….json')`.
- No PHP, no `npm start`. GitHub Pages is an allowed share path; `file://` must still work.
- One `.js` file per story. Jeopardy clues: `{ clue, response, hint, category, difficulty }`. Pictionary prompts: `{ draw, ref }`. Scripture Chase verses: `{ ref, section, text, summary, questions }`.
- Do not delete `david-and-goliath.html` until Job + engine + migrated pack work in class.
- Do not create inner `projects/` for game types.
- Come Follow Me packs are requested one week at a time. Do not build a week-key calendar unless asked.

## Add a story (v1)

Ask the agent for a pack. It writes `stories/<slug>.js` and registers it in `stories/catalog.js`. Operator does not hand-edit unless they want to.

## Open this repo

Cursor: **File → Open Folder** → `D:\Dev\scripture-games` (its own window, not `D:\Dev`).

Architecture: `docs/ARCHITECTURE.md`. Backlog: `ISSUES.md`.
