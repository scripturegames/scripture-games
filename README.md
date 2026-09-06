# scripture-games

Local **games hub** for church activities: pick a scripture story, pick a game type, play on a projector. No install, no server to run yourself.

**Jeopardy** uses story clue banks (Job, David and Goliath). **Pictionary** uses drawing prompts (this week's Come Follow Me psalms). Trivia and other types come later.

## Play

**Hosted:** [https://cyberresearch-us.github.io/scripture-games/](https://cyberresearch-us.github.io/scripture-games/) (GitHub Pages; this URL will change after the repo moves to `scripturegames`).

**From disk:** open `index.html` (double-click is fine).

1. **Jeopardy:** pick **Job** or **David and Goliath**, then Jeopardy. Choose teams → **Start**. Click a tile. **Show Hint** for the reference. **Spacebar** reveals the response.
2. **Pictionary:** pick **Psalms: Praise the Lord**, then Pictionary. **Next** (or Spacebar) rotates a shuffled list of 50 simple draws. **Cover word** so guessers watch the board, not the projector.

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
- GitHub today: [cyberresearch-us/scripture-games](https://github.com/cyberresearch-us/scripture-games) (transfer to `scripturegames` is locked, not executed)
