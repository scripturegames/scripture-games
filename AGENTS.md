# scripture-games

Brain-hosted **single** repo. In-app games hub (story catalog × game types), not a brain hub with inner `projects/`.

GitHub user: `scripturegames` (church profile). **Today** `origin` is `cyberresearch-us/scripture-games` (keep it). Church copy on `scripturegames/scripture-games` is allowed when that remote exists; do not Transfer. Play is clone-and-open (`file://`) or GitHub Pages.

Contract (brain wiki): `D:\Dev\knowledge\wiki\scripture-games.md`

## Purpose

Teacher-hosted projector games for church activities, starting with Primary. Pick a scripture story, pick a game type, render in place. Game types: Jeopardy (clue banks) and Pictionary (drawing prompts). Trivia later may reuse Jeopardy clues.

## Path class

| | |
|---|---|
| Class | brain-hosted |
| Shape | single |
| Registry | `D:\Dev\repo-list.conf` |
| GitHub | public (`cyberresearch-us/scripture-games`; church copy on `scripturegames` later, no transfer) |

## Working constraints

**Allowed:** static HTML/CSS/JS; one `.js` pack per story, loaded on demand via `<script>`; Jeopardy engine; Pictionary engine; teacher-host + projector UX.

**Forbidden:** PHP or any local server to make packs load; `fetch()` of `.json` as the `file://` path; writing generated HTML to disk as the play path; inner `projects/jeopardy`; secrets; custom domain / Cloudflare unless Luke reopens that. Do not GitHub-Transfer this repo. Do not delete `cyberresearch-us/scripture-games`. New church repos go to `scripturegames`, not `cyberresearch-us`.

**Do not delete** `david-and-goliath.html` until Job + engine + migrated pack are proven.

## Layout (target)

| Path | Role |
|------|------|
| `index.html` | Hub: pick story, pick game, render |
| `stories/` | One `.js` pack per story (JSON-shaped) |
| `games/jeopardy/` | Jeopardy engine |
| `games/pictionary/` | Pictionary engine (Next / Cover) |
| `david-and-goliath.html` | Legacy board; source for first migrated pack |
| `knowledge/` | Project wiki / research / docs |
| `plans/` | Build slices |
| `sessions/` | Dated notes (kickoff files live on the brain: `D:\Dev\sessions\`) |

## v1

- Hub + Jeopardy + Pictionary
- Each v1 story pack has **both** `clues` and `drawPrompts`: **Job**, **David and Goliath**, **Psalms: Praise the Lord** (CFM 2026 Aug 31–Sep 6)
- Later hub (not built): Old Testament / New Testament / Book of Mormon / Doctrine and Covenants / Come Follow Me (date-range children). See brain wiki.
- New packs: both games unless asked otherwise

## Quick start

1. Open **this folder** as its own Cursor window (`D:\Dev\scripture-games`), not the whole brain.
2. Play: open `index.html` from disk, or the GitHub Pages URL in `README.md`. Any of the three stories × Jeopardy or Pictionary.
3. Read `README.md`, this file, and `D:\Dev\knowledge\wiki\scripture-games.md`.
