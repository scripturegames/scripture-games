# scripture-games

Brain-hosted **single** repo. In-app games hub (story catalog × game types), not a brain hub with inner `projects/`.

Remote: `github.com/cyberresearch-us/scripture-games` — public. Play is clone-and-open (`file://`); no server.

Contract (brain wiki): `D:\Dev\knowledge\wiki\scripture-games.md`

## Purpose

Teacher-hosted projector games for church activities, starting with Primary. Pick a scripture story, pick a game type, render in place. v1 game type is Jeopardy. Shared clue banks feed later types (trivia, etc.).

## Path class

| | |
|---|---|
| Class | brain-hosted |
| Shape | single |
| Registry | `D:\Dev\repo-list.conf` |
| GitHub | public (`cyberresearch-us/scripture-games`) |

## Working constraints

**Allowed:** static HTML/CSS/JS; one `.js` pack per story, loaded on demand via `<script>`; small original Jeopardy engine; teacher-host + projector UX (5×5, teams, hint, Spacebar reveal, scores).

**Forbidden:** PHP or any local server to make packs load; `fetch()` of `.json` as the `file://` path; writing generated HTML to disk as the play path; inner `projects/jeopardy`; secrets; GitHub Pages / custom domain as the required way to play (clone-and-open is enough). Custom hostname later needs a zone in `cloudflare-infra` before go-live.

**Do not delete** `david-and-goliath.html` until Job + engine + migrated pack are proven.

## Layout (target)

| Path | Role |
|------|------|
| `index.html` | Hub: pick story, pick game, render |
| `stories/` | One `.js` pack per story (JSON-shaped) |
| `games/jeopardy/` | Jeopardy engine |
| `david-and-goliath.html` | Legacy board; source for first migrated pack |
| `knowledge/` | Project wiki / research / docs |
| `plans/` | Build slices |
| `sessions/` | Dated notes (kickoff files live on the brain: `D:\Dev\sessions\`) |

## v1

- Hub + Jeopardy engine
- Packs: **Job** (this week) + migrate **David and Goliath**
- Neutral clue: `{ clue, response, hint, category, difficulty }`
- Authoring: operator requests packs from the agent; no in-hub form yet

## Quick start

1. Open **this folder** as its own Cursor window (`D:\Dev\scripture-games`), not the whole brain.
2. Play: open `index.html` in a browser. Pick Job (or David and Goliath) and Jeopardy.
3. Read `README.md`, this file, and `D:\Dev\knowledge\wiki\scripture-games.md`.
