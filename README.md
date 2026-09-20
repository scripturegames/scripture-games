# scripture-games

Local **games hub** for church activities: pick a scripture story, pick a game type, play on a projector. No install, no server to run yourself.

**Jeopardy** and **Pictionary** both work on **Job**, **David and Goliath**, **Psalms: Praise the Lord**, and **Proverbs: He Shall Direct Thy Paths** (Come Follow Me Sep 7–13 2026). **Scripture Chase** is on **Isaiah: God Is My Salvation** (Come Follow Me Sep 14–20 2026). Trivia and other types come later.

## Play

**Hosted:** [https://scripturegames.github.io/scripture-games/](https://scripturegames.github.io/scripture-games/)

**From disk:** open `index.html` (double-click is fine).

1. Pick a story, then a game.
2. **Jeopardy:** choose teams → **Start**. Click a tile. **Show Hint** for the reference. **Spacebar** reveals the response.
3. **Pictionary:** **Next** (or Spacebar) rotates ~50 simple draws. **Cover word** so guessers watch the board, not the projector.
4. **Scripture Chase:** click a hidden tile (or **Random**, centered). Kids race to the reference. **Reveal verse**, **Discuss**. **Back** (bottom left) is the previous step. **Back to Board** is bottom right. **Back to Hub** is on the board, bottom left.

The legacy board still works: `david-and-goliath.html`.

## Repo layout

```
index.html              Hub (story × game)
stories/                One .js pack per story
games/jeopardy/         Jeopardy engine
games/pictionary/       Pictionary engine
games/scripture-chase/  Scripture Chase engine
david-and-goliath.html  Legacy board (kept until the hub is proven in class)
docs/                   What exists / what wakes what
ISSUES.md               Backlog
```

Packs are JSON-shaped JavaScript so they load from `file://`. Do not add a server.

## Related

- Project contract: `AGENTS.md`
- Architecture: `docs/ARCHITECTURE.md`
- Brain wiki: `D:\Dev\knowledge\wiki\scripture-games.md`
- GitHub: [scripturegames/scripture-games](https://github.com/scripturegames/scripture-games). Career copy on `cyberresearch-us` was removed 2026-09-06.
