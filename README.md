# scripture-games

Local **games hub** for church activities: pick a scripture story, pick a game type, play on a projector. No install, no server to run yourself.

**Jeopardy** and **Pictionary** both work on **Job**, **David and Goliath**, and **Psalms: Praise the Lord** (this week's Come Follow Me). Trivia and other types come later.

## Play

**Hosted:** [https://scripturegames.github.io/scripture-games/](https://scripturegames.github.io/scripture-games/)

**From disk:** open `index.html` (double-click is fine).

1. Pick any of the three stories, then **Jeopardy** or **Pictionary**.
2. **Jeopardy:** choose teams → **Start**. Click a tile. **Show Hint** for the reference. **Spacebar** reveals the response.
3. **Pictionary:** **Next** (or Spacebar) rotates ~50 simple draws. **Cover word** so guessers watch the board, not the projector.

The legacy board still works: `david-and-goliath.html`.

## Repo layout

```
index.html              Hub (story × game)
stories/                One .js pack per story
games/jeopardy/         Jeopardy engine
games/pictionary/       Pictionary engine
david-and-goliath.html  Legacy board (kept until the hub is proven in class)
```

Packs are JSON-shaped JavaScript so they load from `file://`. Do not add a server.

## Related

- Project contract: `AGENTS.md`
- Brain wiki: `D:\Dev\knowledge\wiki\scripture-games.md`
- GitHub: [scripturegames/scripture-games](https://github.com/scripturegames/scripture-games). Career copy on `cyberresearch-us` was removed 2026-09-06.
