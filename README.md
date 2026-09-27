# scripture-games

Local **games hub** for church activities: pick a scripture story, pick a game type, play on a projector. No install, no server to run yourself.

**Jeopardy** and **Pictionary** both work on **Job**, **David and Goliath**, **Psalms: Praise the Lord**, and **Proverbs: He Shall Direct Thy Paths** (Come Follow Me Sep 7–13 2026). **Scripture Chase** is on **Isaiah: God Is My Salvation** (Come Follow Me Sep 14–20 2026). **Matching** is on **Isaiah: A Marvellous Work and a Wonder** (Come Follow Me Sep 21–27 2026). Trivia and other types come later.

## Play

**Hosted:** [https://scripturegames.github.io/scripture-games/](https://scripturegames.github.io/scripture-games/)

**From disk:** open `index.html` (double-click is fine).

1. Pick a story, then a game.
2. **Jeopardy:** choose teams → **Start**. Click a tile. **Show Hint** for the reference. **Spacebar** reveals the response.
3. **Pictionary:** **Next** (or Spacebar) rotates ~50 simple draws. **Cover word** so guessers watch the board, not the projector.
4. **Scripture Chase:** click a hidden tile (or **Random**, centered). Kids race to the reference. **Reveal verse**, **Discuss**. **Back** (bottom left) is the previous step. **Back to Board** is bottom right. **Back to Hub** is on the board, bottom left.
5. **Matching:** 6×4 hidden board. Flip two tiles (or use **Face up** for younger Primary). After a match, read the verse together (the reference opens Gospel Library). **Shuffle** to play again.

Hub footer: [How to use this site](how-to.html) · [Picture credits](credits.html). The legacy board still works: `david-and-goliath.html`.

## Repo layout

```
index.html              Hub (story × game)
how-to.html             How to use this site
credits.html            Picture credits / not-our-art disclaimer
stories/                One .js pack per story
games/gospel-link.js    Gospel Library URLs for scripture refs
games/jeopardy/         Jeopardy engine
games/pictionary/       Pictionary engine
games/scripture-chase/  Scripture Chase engine
games/matching/         Matching engine
stories/images/         Media Library copies for matching packs (see CREDITS.md)
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
