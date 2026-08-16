# Cheatsheet — scripture-games

## Play

Open `index.html` in a browser. No server. Pick a story, pick Jeopardy, Start.

| Key | Action |
|-----|--------|
| Spacebar | Reveal the correct response |
| ESC | Close the current clue (or open Menu from the board) |
| 1–9 then Up/Down | Select team, change score |

Legacy board: `david-and-goliath.html`.

## Constraints

- `file://` must work. Load story packs with `<script src="stories/….js">`, not `fetch('….json')`.
- No PHP, no `npm start`, no GitHub Pages required to play.
- One `.js` file per story. Neutral clue: `{ clue, response, hint, category, difficulty }`.
- Do not delete `david-and-goliath.html` until Job + engine + migrated pack work in class.
- Do not create inner `projects/` for game types.

## Add a story (v1)

Ask the agent for a pack. It writes `stories/<slug>.js` and registers it in `stories/catalog.js`. Operator does not hand-edit unless they want to.

## Open this repo

Cursor: **File → Open Folder** → `D:\Dev\scripture-games` (its own window, not `D:\Dev`).
