# Learnings

- JeopardyLabs HTML is a fine classroom board and a bad hub: clues are baked into markup (~75KB export). v1 needs a small original engine plus `.js` packs.
- `fetch()` of JSON from `file://` is often blocked. `<script src="stories/job.js">` (inject on pick) is the offline equivalent of a PHP include.
- PHP would “serve only the selected story” but requires a local server; that breaks clone-and-double-click.
- Shared clue banks work for Jeopardy and trivia. Family Feud-style games need extra fields — do not over-abstract v1.
- Come Follow Me week keys change every year; keep them out of v1 story identity.
- Score after closing a clue needs `lastClue`; do not fall back to the first tile’s point value (JeopardyLabs did, and it false-awards 100).
