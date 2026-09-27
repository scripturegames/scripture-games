# scripture-games

Brain-hosted **single** repo. In-app games hub (story catalog × game types), not a brain hub with inner `projects/`.

GitHub: `scripturegames/scripture-games` (public). `origin` is `git@github.com-scripturegames:scripturegames/scripture-games.git`. Play is clone-and-open (`file://`) or GitHub Pages. Do not recreate this repo under `cyberresearch-us`.

Contract (brain wiki): `D:\Dev\knowledge\wiki\scripture-games.md`

## Purpose

Teacher-hosted projector games for church activities, starting with Primary. Pick a scripture story, pick a game type, render in place. Game types: Jeopardy (clue banks), Pictionary (drawing prompts), Scripture Chase (hidden tiles, race to the verse, discuss), and Matching (two of each picture, then discuss). Trivia later may reuse Jeopardy clues.

## Path class

| | |
|---|---|
| Class | brain-hosted |
| Shape | single |
| Registry | `D:\Dev\repo-list.conf` |
| GitHub | public `scripturegames/scripture-games` |

## Working constraints

**Allowed:** static HTML/CSS/JS; one `.js` pack per story, loaded on demand via `<script>`; Jeopardy engine; Pictionary engine; Scripture Chase engine; Matching engine; teacher-host + projector UX. Matching pictures may be **Church Media Library** copies under `stories/images/` with a `source` URL and `CREDITS.md` pointing at the original page. They are not our art. Do not copy Red Crystal or paid member printables.

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
| `games/matching/` | Matching engine (section boards, memory or face-up, discuss) |
| `david-and-goliath.html` | Legacy board; source for first migrated pack |
| `docs/` | Product pack: what exists / what wakes what |
| `ISSUES.md` | Backlog (Open / Closed) |
| `knowledge/` | Project wiki / research / docs |
| `plans/` | Build slices |
| `sessions/` | Dated notes (kickoff files live on the brain: `D:\Dev\sessions/`) |

## v1

- Hub + Jeopardy + Pictionary + Scripture Chase + Matching
- Each v1 story pack has **both** `clues` and `drawPrompts`: **Job**, **David and Goliath**, **Psalms: Praise the Lord** (CFM 2026 Aug 31–Sep 6). Requested CFM: **Proverbs: He Shall Direct Thy Paths** (Sep 7–13 2026, lesson 37).
- Requested CFM **Isaiah: God Is My Salvation** (Sep 14–20 2026, lesson 38) is **chase-only** (`chaseVerses`). No Jeopardy/Pictionary on that card until asked.
- Requested CFM **Isaiah: A Marvellous Work and a Wonder** (Sep 21–27 2026, lesson 39) is **matching-only** (`matchItems`). No Jeopardy/Pictionary/Chase on that card until asked.
- Scripture Chase record: `{ ref, section, text, summary, questions }`. Click a hidden tile, show the reference, reveal verse text after someone finds it, then discuss that verse’s Teaching Children questions. No buzzers, scores, or activity prompts.
- Matching record: `{ id, section, label, image, refs, prompt }`. Pictures live under `stories/images/<pack-id>/` as original SVGs. Memory (hide pictures) or Face up (younger Primary). After a match, share why it is marvelous. No buzzers or scores.
- Later hub (not built): Old Testament / New Testament / Book of Mormon / Doctrine and Covenants / Come Follow Me (date-range children). See brain wiki.
- New packs: both Jeopardy and Pictionary unless asked otherwise. Chase verses or matching pictures only when requested.
- **Primary source (2026-09-27):** new games and new CFM content come from the lesson’s **Ideas for Teaching Children** (scriptures, headings, matching verses). Not the adult/home sections unless Luke asks. Prefer the hopeful Christ / refuge / Restoration lines; skip pride, Babylon, and “turning away” warning blocks as the main class content.
- **Game-shape research (allowed):** church [Games, Stories, and Activities](https://www.churchofjesuschrist.org/study/manual/games-stories-activities/2026?lang=eng) (follow that week’s child links), the *Friend* weekly activity, and member Primary sites such as [The Red Crystal](https://www.theredcrystal.org/general-6). Steal **mechanics**, not art or paid PDFs. Do not copy their printables into this repo.

## Quick start

1. Open **this folder** as its own Cursor window (`D:\Dev\scripture-games`), not the whole brain.
2. Play: open `index.html` from disk, or https://scripturegames.github.io/scripture-games/ . Story × game. Isaiah CFM lesson 38 is Scripture Chase only. Isaiah CFM lesson 39 is Matching only.
3. Read `README.md`, this file, and `D:\Dev\knowledge\wiki\scripture-games.md`.
4. Push: `git push origin master` (church SSH). `gh auth switch --user scripturegames` before church `gh`.
