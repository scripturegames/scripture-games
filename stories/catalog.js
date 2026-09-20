(function (g) {
  g.ScriptureGames = g.ScriptureGames || {};

  g.ScriptureGames.catalog = [
    {
      id: "isaiah-cfm-2026-38",
      title: "Isaiah: God Is My Salvation",
      file: "stories/isaiah-cfm-2026-38.js",
      scripture: "Isaiah 1–12",
      summary: "Come Follow Me Sep 14–20 2026. Scripture Chase from this week's Teaching Children verses.",
      games: ["scripture-chase"]
    },
    {
      id: "proverbs-cfm-2026-37",
      title: "Proverbs: He Shall Direct Thy Paths",
      file: "stories/proverbs-cfm-2026-37.js",
      scripture: "Proverbs 1–4; 15–16; 22; 31; Ecclesiastes 1–3; 11–12",
      summary: "Come Follow Me Sep 7–13 2026. Jeopardy and Pictionary from this week's Proverbs and Ecclesiastes.",
      games: ["jeopardy", "pictionary"]
    },
    {
      id: "job",
      title: "Job",
      file: "stories/job.js",
      scripture: "Job 1–3; 12–14; 19; 21–24; 38–40; 42",
      summary: "Job stays faithful through hard trials. Jeopardy and Pictionary.",
      games: ["jeopardy", "pictionary"]
    },
    {
      id: "david-goliath",
      title: "David and Goliath",
      file: "stories/david-goliath.js",
      scripture: "1 Samuel 16–17",
      summary: "A shepherd boy trusts the Lord and faces a giant. Jeopardy and Pictionary.",
      games: ["jeopardy", "pictionary"]
    },
    {
      id: "psalms-cfm-2026-36",
      title: "Psalms: Praise the Lord",
      file: "stories/psalms-cfm-2026-36.js",
      scripture: "Psalms 102–103; 110; 116–119; 127–128; 135–139; 146–150",
      summary: "Come Follow Me Aug 31–Sep 6 2026. Jeopardy and Pictionary from this week's psalms.",
      games: ["jeopardy", "pictionary"]
    }
  ];

  g.ScriptureGames.gameTypes = [
    {
      id: "jeopardy",
      title: "Jeopardy",
      css: "games/jeopardy/jeopardy.css",
      js: "games/jeopardy/jeopardy.js",
      summary: "5×5 board, teams, scripture hint, Spacebar reveal."
    },
    {
      id: "pictionary",
      title: "Pictionary",
      css: "games/pictionary/pictionary.css",
      js: "games/pictionary/pictionary.js",
      summary: "One button, next drawing prompt. Cover the word so guessers watch the board."
    },
    {
      id: "scripture-chase",
      title: "Scripture Chase",
      css: "games/scripture-chase/scripture-chase.css",
      js: "games/scripture-chase/scripture-chase.js",
      summary: "Hidden tiles, race to the verse, then read and discuss."
    }
  ];
})(window);
