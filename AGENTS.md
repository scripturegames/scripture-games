# scripture-games

Brain-hosted **single** repo. In-app games hub (story catalog × game types), not a brain hub with inner `projects/`.

GitHub: `scripturegames/scripture-games` (public). `origin` is `git@github.com-scripturegames:scripturegames/scripture-games.git`. Play is clone-and-open (`file://`) or GitHub Pages. Do not recreate this repo under `cyberresearch-us`.

Contract (brain wiki): `D:\Dev\knowledge\wiki\scripture-games.md`

## Purpose

Teacher-hosted projector games for church activities, starting with Primary. Pick a scripture story, pick a game type, render in place. Game types: Jeopardy (clue banks), Pictionary (drawing prompts), and Scripture Chase (hidden tiles, race to the verse, discuss). Trivia later may reuse Jeopardy clues.

## Path class

| | |
|---|---|
| Class | brain-hosted |
| Shape | single |
| Registry | `D:\Dev\repo-list.conf` |
| GitHub | public `scripturegames/scripture-games` |

## Working constraints

**Allowed:** static HTML/CSS/JS; one `.js` pack per story, loaded on demand via `<script>`; Jeopardy engine; Pictionary engine; Scripture Chase engine; teacher-host + projector UX.

**Forbidden:** PHP or any local server to make packs load; `fetch()` of `.json` as the `file://` path; writing generated HTML to disk as the play path; inner `projects/jeopardy`; secrets; custom domain / Cloudflare unless Luke reopens that. Do not recreate `cyberresearch-us/scripture-games`. New church repos go to `scripturegames`.

**Do not delete** `david-and-goliath.html` until Job + engine + migrated pack are proven.

## Layout (target)

| Path | Role |
|------|------|
| `index.html` | Hub: pick story, pick game, render |
| `stories/` | One `.js` pack per story (JSON-shaped) |
| `games/jeopardy/` | Jeopardy engine |
| `games/pictionary/` | Pictionary engine (Next / Cover) |
| `games/scripture-chase/` | Scripture Chase engine (hidden tiles, reveal, discuss) |
| `david-and-goliath.html` | Legacy board; source for first migrated pack |
| `docs/` | Product pack: what exists / what wakes what |
| `ISSUES.md` | Backlog (Open / Closed) |
| `knowledge/` | Project wiki / research / docs |
| `plans/` | Build slices |
| `sessions/` | Dated notes (kickoff files live on the brain: `D:\Dev\sessions/`) |

## v1

- Hub + Jeopardy + Pictionary + Scripture Chase
- Each v1 story pack has **both** `clues` and `drawPrompts`: **Job**, **David and Goliath**, **Psalms: Praise the Lord** (CFM 2026 Aug 31–Sep 6). Requested CFM: **Proverbs: He Shall Direct Thy Paths** (Sep 7–13 2026, lesson 37).
- Requested CFM **Isaiah: God Is My Salvation** (Sep 14–20 2026, lesson 38) is **chase-only** (`chaseVerses`). No Jeopardy/Pictionary on that card until asked.
- Scripture Chase record: `{ ref, section, text, summary, questions }`. Click a hidden tile, show the reference, reveal verse text after someone finds it, then discuss that verse’s Teaching Children questions. No buzzers, scores, or activity prompts.
- Later hub (not built): Old Testament / New Testament / Book of Mormon / Doctrine and Covenants / Come Follow Me (date-range children). See brain wiki.
- New packs: both Jeopardy and Pictionary unless asked otherwise. Chase verses only when requested.

## Quick start

1. Open **this folder** as its own Cursor window (`D:\Dev\scripture-games`), not the whole brain.
2. Play: open `index.html` from disk, or https://scripturegames.github.io/scripture-games/ . Story × game. Isaiah CFM lesson 38 is Scripture Chase only.
3. Read `README.md`, this file, and `D:\Dev\knowledge\wiki\scripture-games.md`.
4. Push: `git push origin master` (church SSH). `gh auth switch --user scripturegames` before church `gh`.
