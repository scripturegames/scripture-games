(function (g) {
  g.ScriptureGames = g.ScriptureGames || {};

  g.ScriptureGames.catalog = [
    {
      id: "job",
      title: "Job",
      file: "stories/job.js",
      scripture: "Job 1–3; 12–14; 19; 21–24; 38–40; 42",
      summary: "Job stays faithful through hard trials and testifies that his Redeemer lives."
    },
    {
      id: "david-goliath",
      title: "David and Goliath",
      file: "stories/david-goliath.js",
      scripture: "1 Samuel 16–17",
      summary: "A shepherd boy trusts the Lord and faces a giant."
    }
  ];

  g.ScriptureGames.gameTypes = [
    {
      id: "jeopardy",
      title: "Jeopardy",
      css: "games/jeopardy/jeopardy.css",
      js: "games/jeopardy/jeopardy.js",
      summary: "5×5 board, teams, scripture hint, Spacebar reveal."
    }
  ];
})(window);
