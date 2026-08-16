# scripture-games

Local **games hub** for church activities: pick a scripture story, pick a game type, play on a projector. No install, no server, no internet.

v1 is a Jeopardy-style board (teacher-host). Trivia and other types come later, using the same story clue banks.

## Play

1. Open `index.html` in a browser (double-click is fine).
2. Pick a story (**Job** or **David and Goliath**) and **Jeopardy**.
3. Choose teams → **Start**.
4. Click a tile. Kids search their scriptures. **Show Hint** for the reference. **Spacebar** reveals the response.

The legacy board still works: `david-and-goliath.html`.

## Repo layout

```
index.html              Hub (story × game)
stories/                One .js pack per story
games/jeopardy/         Jeopardy engine
david-and-goliath.html  Legacy board (kept until the hub is proven in class)
```

Packs are JSON-shaped JavaScript so they load from `file://`. Do not add a server.

## Related

- Project contract: `AGENTS.md`
- Brain wiki: `D:\Dev\knowledge\wiki\scripture-games.md`
- GitHub: [cyberresearch-us/scripture-games](https://github.com/cyberresearch-us/scripture-games)
