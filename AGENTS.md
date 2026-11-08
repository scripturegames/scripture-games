# scripture-games

Brain-hosted **single** repo. In-app games hub (story catalog × game types), not a brain hub with inner `projects/`.

GitHub: `scripturegames/scripture-games` (public). `origin` is `git@github.com-scripturegames:scripturegames/scripture-games.git`. Play is clone-and-open (`file://`) or GitHub Pages. Do not recreate this repo under `cyberresearch-us`.

Contract (brain wiki): `D:\Dev\knowledge\wiki\scripture-games.md`

## Purpose

Teacher-hosted projector games for church activities, starting with Primary. Pick a scripture story, pick a game type, render in place. Game types: Jeopardy (clue banks), Pictionary (drawing prompts), Scripture Chase (hidden tiles, race to the verse, discuss), Matching (two of each picture, then discuss), and Trail (path of squares; same facts as Jeopardy, asked as a question, answer hidden until clicked).

## Path class

| | |
|---|---|
| Class | brain-hosted |
| Shape | single |
| Registry | `D:\Dev\repo-list.conf` |
| GitHub | public `scripturegames/scripture-games` |

## Working constraints

**Allowed:** static HTML/CSS/JS; one `.js` pack per story, loaded on demand via `<script>`; Jeopardy engine; Pictionary engine; Scripture Chase engine; Matching engine; teacher-host + projector UX. Matching pictures may be **Church Media Library** copies under `stories/images/` with a `source` URL and `CREDITS.md` pointing at the original page. They are not our art. Do not copy Red Crystal or paid member printables.

**Forbidden:** PHP or any local server to make packs load; a database; a bundler or component-framework rewrite; `fetch()` of `.json` as the `file://` path; writing generated HTML to disk as the play path; inner `projects/jeopardy`; secrets; custom domain / Cloudflare unless Luke reopens that. Do not recreate `cyberresearch-us/scripture-games`. New church repos go to `scripturegames`.

**Stack (2026-11-08):** Pack files in git are the content store. Teachers play published packs on GitHub Pages, or from a downloaded folder when the room has no internet. A private editor on this PC may read and write a pack file so Luke can review questions, answers, draw prompts, and scripture references. Do not add a hosted database, accounts, or a teacher submission flow unless Luke asks. A later theme pass, when he asks, is shared CSS tokens, projector-sized type, and the same chrome on the hub and every board. No design-agent and no model switch for that pass.

**Decisions and later ideas:** When Luke accepts a recommendation, record the decision in `D:\Dev\knowledge\wiki\scripture-games.md`. Record deferred enhancements in `ISSUES.md` under **Later**. Do not start Later items until he asks to go over enhancements. Open tickets wait for a build chat. A week-adding chat does not pick them up.

**Do not delete** `david-and-goliath.html` until Job + engine + migrated pack are proven.

## Layout (target)

| Path | Role |
|------|------|
| `index.html` | Hub: pick story, pick game, render |
| `how-to.html` | How to use this site |
| `credits.html` | Picture credits / not-our-art disclaimer |
| `stories/` | One `.js` pack per story (JSON-shaped) |
| `games/gospel-link.js` | Gospel Library URLs for scripture refs |
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
- Each v1 story pack has **both** `clues` and `drawPrompts`: **Job**, **David and Goliath**, **Psalms: Praise the Lord** (CFM 2026 Aug 31–Sep 6). Requested CFM: **Proverbs: He Shall Direct Thy Paths** (Sep 7–13 2026, lesson 37). Requested CFM: **Jeremiah: I Will Turn Their Mourning into Joy** (Oct 26–Nov 1 2026, lesson 44). Requested CFM: **Ezekiel: A New Spirit Will I Put within You** (Nov 2–8 2026, lesson 45). Ezekiel uses Teaching Children plus the lesson intro’s hopeful verses (new heart, dry bones, the Lord is there), and it also has Scripture Chase. The home-and-church question block stays off that board.
- Requested CFM **Isaiah: God Is My Salvation** (Sep 14–20 2026, lesson 38) is **chase-only** (`chaseVerses`). No Jeopardy/Pictionary on that card until asked.
- Requested CFM **Isaiah: A Marvellous Work and a Wonder** (Sep 21–27 2026, lesson 39) is **matching-only** (`matchItems`). No Jeopardy/Pictionary/Chase on that card until asked.
- Scripture Chase record: `{ ref, section, text, summary, questions }`. Click a hidden tile, show the reference, reveal verse text after someone finds it, then discuss that verse’s Teaching Children questions. No buzzers, scores, or activity prompts.
- Matching record: `{ id, section, label, image, refs, verses: [{ ref, text }], prompt, source }`. Pictures live under `stories/images/<pack-id>/` as Church Media Library copies with `source` and a nearby `CREDITS.md`. Not our art. Memory (hide pictures) or Face up (younger Primary). After a match, show the verse text and a Gospel Library link so the class can read together. No buzzers or scores. Hub footer: `how-to.html` and `credits.html`.
- Later hub (not built): Old Testament / New Testament / Book of Mormon / Doctrine and Covenants / Come Follow Me (date-range children). See brain wiki.
- New packs, for now: Jeopardy, Pictionary, and Trail. Scripture Chase after Luke reviews the facts. Matching when the week is picture-shaped or he asks. End goal: every week populated with every game. Do not backfill old weeks unless he asks. A week stays off the hub until he reviews it. Every played card has a scripture reference the class can open. Pictionary keeps the draw word covered; after the drawing, the teacher can open that scripture without showing the word.
- **Primary source (2026-09-27):** new games and new CFM content come from the lesson’s **Ideas for Teaching Children** (scriptures, headings, matching verses). Not the adult/home sections unless Luke asks. Scripture Helps are a later candidate pool only: extra scriptures those pages cite, current and future weeks first, then previous weeks, and Luke reviews before anything is published. Do not start that pass until he opens it. See `ISSUES.md` Later. Prefer the hopeful Christ / refuge / Restoration lines; skip pride, Babylon, and “turning away” warning blocks as the main class content. Ezekiel lesson 45 also uses the lesson intro’s hopeful verses, because Luke asked on 2026-11-08. The home-and-church question block stays off the board.
- **Game-shape research (allowed):** church [Games, Stories, and Activities](https://www.churchofjesuschrist.org/study/manual/games-stories-activities/2026?lang=eng) (follow that week’s child links), the *Friend* weekly activity, and member Primary sites such as [The Red Crystal](https://www.theredcrystal.org/general-6). Steal **mechanics**, not art or paid PDFs. Do not copy their printables into this repo.

## Quick start

1. Open **this folder** as its own Cursor window (`D:\Dev\scripture-games`), not the whole brain.
2. Play: open `index.html` from disk, or https://scripturegames.github.io/scripture-games/ . Story × game. Isaiah CFM lesson 38 is Scripture Chase only. Isaiah CFM lesson 39 is Matching only.
3. Read `README.md`, this file, and `D:\Dev\knowledge\wiki\scripture-games.md`.
4. Push: `git push origin master` (church SSH). `gh auth switch --user scripturegames` before church `gh`.
