(function (g) {
  "use strict";

  g.ScriptureGames = g.ScriptureGames || {};

  var LAST = 19;
  var ANSWER_SECONDS = 10;
  var SAVE_VERSION = 4;
  var DIE = [2, 4, 6];
  var TEAM_COLORS = ["#1565c0", "#c62828", "#2e7d32", "#ef6c00"];
  var SQUARE_COLORS = ["#1b4f72", "#0e6655", "#7d6608", "#6c3483", "#922b21"];
  var STONES = [
    [7, 14], [18, 20], [29, 12], [40, 20], [51, 12], [62, 20], [73, 12], [86, 20],
    [86, 46], [73, 54], [62, 46], [51, 54], [40, 46], [29, 54], [18, 46], [7, 54],
    [12, 76], [32, 88], [54, 76], [78, 88]
  ];

  var root = null;
  var pack = null;
  var opts = {};
  var keyHandler = null;
  var state = null;

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shuffle(list) {
    var arr = list.slice();
    var i;
    var j;
    var tmp;
    for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function plainAnswer(response) {
    return String(response || "")
      .replace(/^(what is|what are|who is|who are)\s+/i, "")
      .replace(/\?$/, "");
  }

  function normalizePack(src) {
    var clues = (src.clues || []).map(function (c) {
      var clue = String(c.clue == null ? "" : c.clue);
      var response = String(c.response == null ? "" : c.response);
      return {
        category: String(c.category == null ? "" : c.category),
        clue: clue,
        response: response,
        hint: String(c.hint == null ? "" : c.hint),
        question: String(c.question == null || c.question === "" ? clue : c.question),
        answer: String(c.answer == null || c.answer === "" ? plainAnswer(response) : c.answer)
      };
    }).filter(function (c) {
      return c.question.length > 0;
    });
    var cats = (src.categories || []).map(function (c) {
      return String(c == null ? "" : c);
    }).filter(function (c) {
      return c.length > 0;
    });
    clues.forEach(function (c) {
      if (c.category && cats.indexOf(c.category) === -1) {
        cats.push(c.category);
      }
    });
    return {
      id: String(src.id || "pack").replace(/[^a-z0-9\-]/gi, "").slice(0, 40) || "pack",
      title: String(src.title || "Trail"),
      scripture: String(src.scripture || ""),
      categories: cats,
      clues: clues
    };
  }

  function storageKey() {
    return "sg-trail-" + (pack && pack.id ? pack.id : "unknown");
  }

  function clearTrailSaves() {
    var keys = [];
    var i;
    var key;
    try {
      for (i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        if (key && key.indexOf("sg-trail-") === 0) {
          keys.push(key);
        }
      }
      for (i = 0; i < keys.length; i++) {
        localStorage.removeItem(keys[i]);
      }
    } catch (e) {
      /* file:// private mode */
    }
  }

  function loadSaved() {
    try {
      var raw = localStorage.getItem(storageKey());
      var data = raw ? JSON.parse(raw) : null;
      if (!data || data.v !== SAVE_VERSION) {
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  function save() {
    if (!state || state.page === "chooser" || state.page === "menu") {
      return;
    }
    try {
      localStorage.setItem(storageKey(), JSON.stringify({
        v: SAVE_VERSION,
        teams: state.teams,
        turn: state.turn,
        phase: state.phase,
        die: state.die,
        card: state.card,
        timerLeft: state.timerLeft,
        revealed: state.revealed,
        answerShown: !!state.answerShown,
        decks: state.decks,
        awardNote: state.awardNote,
        winner: state.winner
      }));
    } catch (e) {
      /* file:// private mode or quota */
    }
  }

  function clearSaved() {
    try {
      localStorage.removeItem(storageKey());
    } catch (e) {
      /* ignore */
    }
  }

  function clearTimer() {
    if (state && state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer() {
    var id;
    clearTimer();
    if (!state || state.phase !== "question" || state.timerLeft <= 0 || state.page === "menu") {
      return;
    }
    id = setInterval(function () {
      var el;
      if (!state || state.timerId !== id) {
        return;
      }
      state.timerLeft -= 1;
      if (state.timerLeft <= 0) {
        state.timerLeft = 0;
        clearTimer();
        openHint();
        return;
      }
      el = root && root.querySelector("[data-timer]");
      if (el) {
        el.textContent = String(state.timerLeft);
      }
    }, 1000);
    state.timerId = id;
  }

  function categoryAt(index) {
    var cats;
    if (index <= 0 || index >= LAST) {
      return "";
    }
    cats = pack.categories || [];
    if (!cats.length) {
      return "";
    }
    return cats[(index - 1) % cats.length];
  }

  function colorForCategory(name) {
    var i = (pack.categories || []).indexOf(name);
    if (i < 0) {
      i = 0;
    }
    return SQUARE_COLORS[i % SQUARE_COLORS.length];
  }

  function teamName(i) {
    var t = state.teams[i];
    return t && t.name ? t.name : ("Team " + (i + 1));
  }

  function drawCard(category) {
    var pool;
    if (!state.decks[category] || !state.decks[category].length) {
      pool = pack.clues.filter(function (c) {
        return c.category === category;
      });
      if (!pool.length) {
        pool = pack.clues.slice();
      }
      state.decks[category] = shuffle(pool);
    }
    return state.decks[category].pop();
  }

  function moveTeam(index, steps) {
    var t = state.teams[index];
    if (!t) {
      return false;
    }
    t.pos += steps;
    if (t.pos >= LAST) {
      t.pos = LAST;
      return true;
    }
    return false;
  }

  function declareWin(index, note) {
    state.winner = index;
    state.page = "win";
    state.awardNote = note;
    clearTimer();
    save();
    render();
  }

  function freshGame(count) {
    var teams = [];
    var i;
    var n = count;
    if (n < 2) {
      n = 2;
    }
    if (n > 4) {
      n = 4;
    }
    for (i = 0; i < n; i++) {
      teams.push({ name: "Team " + (i + 1), pos: 0, color: TEAM_COLORS[i] });
    }
    state.teams = teams;
    state.turn = 0;
    state.phase = "roll";
    state.die = null;
    state.card = null;
    state.timerLeft = ANSWER_SECONDS;
    state.revealed = false;
    state.answerShown = false;
    state.decks = {};
    state.awardNote = "";
    state.winner = -1;
    state.page = "play";
    clearTimer();
    save();
  }

  function resume(saved) {
    state.teams = (saved.teams || []).map(function (t, i) {
      return {
        name: String(t.name || ("Team " + (i + 1))).slice(0, 40),
        pos: Math.max(0, Math.min(LAST, parseInt(t.pos, 10) || 0)),
        color: TEAM_COLORS[i % TEAM_COLORS.length]
      };
    });
    if (state.teams.length < 2) {
      freshGame(3);
      return;
    }
    state.turn = Math.max(0, Math.min(state.teams.length - 1, parseInt(saved.turn, 10) || 0));
    state.phase = saved.phase || "roll";
    if (["roll", "flip", "question", "hint", "reveal"].indexOf(state.phase) === -1) {
      state.phase = "roll";
    }
    state.die = saved.die == null ? null : saved.die;
    state.card = saved.card || null;
    state.timerLeft = typeof saved.timerLeft === "number" ? saved.timerLeft : ANSWER_SECONDS;
    state.revealed = !!saved.revealed;
    state.answerShown = !!saved.answerShown;
    state.decks = saved.decks || {};
    state.awardNote = saved.awardNote || "";
    state.winner = typeof saved.winner === "number" ? saved.winner : -1;
    state.page = state.winner >= 0 ? "win" : "play";
    clearTimer();
    if (state.page === "play" && state.phase === "question") {
      startTimer();
    }
  }

  function linkHint(ref) {
    if (g.ScriptureGames.gospelLinkHtml) {
      return g.ScriptureGames.gospelLinkHtml(ref);
    }
    return escapeHtml(ref);
  }

  function fullSteps() {
    return parseInt(state.die, 10) || 0;
  }

  function halfSteps() {
    return Math.floor(fullSteps() / 2);
  }

  function stepsNow() {
    return state.phase === "hint" ? halfSteps() : fullSteps();
  }

  function destination(index, steps) {
    var pos = state.teams[index].pos + steps;
    if (pos > LAST) {
      pos = LAST;
    }
    return pos;
  }

  function roadPath() {
    var d = "M " + STONES[0][0] + " " + STONES[0][1];
    var i;
    for (i = 1; i < STONES.length; i++) {
      d += " L " + STONES[i][0] + " " + STONES[i][1];
    }
    return d;
  }

  function aimIndex() {
    var steps;
    if (!state.teams[state.turn]) {
      return -1;
    }
    if (state.phase !== "flip" && state.phase !== "question" && state.phase !== "hint") {
      return -1;
    }
    steps = stepsNow();
    if (!steps) {
      return -1;
    }
    return destination(state.turn, steps);
  }

  function renderSquare(index) {
    var cat = categoryAt(index);
    var label;
    var bg;
    var color;
    var cls = "sg-trail-stone";
    var tokens = "";
    var i;
    var aim = aimIndex();
    if (index === 0) {
      label = "Start";
      cls += " start";
    } else if (index === LAST) {
      label = "Finish";
      cls += " finish";
    } else {
      label = String(index);
      bg = colorForCategory(cat);
    }
    if (state.teams[state.turn] && state.teams[state.turn].pos === index && state.page === "play") {
      cls += " here";
    }
    if (aim === index) {
      cls += " aim";
    }
    for (i = 0; i < state.teams.length; i++) {
      if (state.teams[i].pos === index) {
        tokens += '<span class="sg-trail-token' + (i === state.turn ? " on" : "") + '" style="background:' +
          state.teams[i].color + '">' + (i + 1) + "</span>";
      }
    }
    color = ' style="left:' + STONES[index][0] + "%;top:" + STONES[index][1] + "%;" +
      (bg ? "background:" + bg + ";color:#fff" : "") + '"';
    return '<div class="' + cls + '"' + color + ">" +
      '<div class="sg-trail-sq-label">' + escapeHtml(label) + "</div>" +
      (tokens ? '<div class="sg-trail-tokens">' + tokens + "</div>" : "") +
      "</div>";
  }

  function statusLine() {
    if (!state || state.page === "chooser") {
      return "";
    }
    if (state.page === "win") {
      return teamName(state.winner) + " reached the end.";
    }
    if (state.phase === "roll") {
      return (state.awardNote ? state.awardNote + " " : "") +
        "Roll 2, 4, or 6. Get it before the hint to move the full roll.";
    }
    if (state.phase === "flip") {
      return "Rolled " + state.die + ". Flip the card for " + teamName(state.turn) + ".";
    }
    return state.awardNote || "Card is open.";
  }

  function renderPageChrome() {
    var slot = document.getElementById("lesson-key-page");
    var html = [];
    var i;
    var playing;
    if (!slot || !pack || !state) {
      return;
    }
    playing = state.page !== "chooser";
    html.push('<div class="sg-trail-head">');
    html.push('<div class="sg-trail-head-title"><h1>' + escapeHtml(pack.title) + "</h1>");
    if (playing && state.teams.length) {
      html.push('<p class="sg-trail-meta">' + escapeHtml(teamName(state.turn)) + "'s turn</p>");
    }
    html.push("</div>");
    html.push('<div class="sg-trail-legend">');
    for (i = 0; i < (pack.categories || []).length; i++) {
      html.push('<span><i style="background:' + colorForCategory(pack.categories[i]) + '"></i>' +
        escapeHtml(pack.categories[i]) + "</span>");
    }
    html.push("</div>");
    if (playing) {
      html.push('<p class="sg-trail-status">' + escapeHtml(statusLine()) + "</p>");
      html.push('<button type="button" class="sg-trail-menu-btn" data-act="menu">MENU</button>');
      if (state.page === "play" && state.phase === "flip") {
        html.push('<button type="button" class="sg-go" data-act="flip">Flip card</button>');
      }
      html.push(renderDie());
    }
    html.push('<p class="sg-trail-credit">Photo: <a href="https://www.churchofjesuschrist.org/media/image/dome-of-the-rock-jerusalem-7f55afd?lang=eng">Temple Mount in Jerusalem</a>, Church Media Library. Not our art.</p>');
    html.push("</div>");
    slot.innerHTML = html.join("");
    if (g.ScriptureGames.lessonKey && g.ScriptureGames.lessonKey.fit) {
      g.ScriptureGames.lessonKey.fit();
    }
  }

  function renderBoard() {
    var html = [];
    var i;
    html.push('<div class="sg-trail-board">');
    html.push('<svg class="sg-trail-road" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">');
    html.push('<path class="sg-trail-road-wide" d="' + roadPath() + '"></path>');
    html.push('<path class="sg-trail-road-line" d="' + roadPath() + '"></path>');
    html.push("</svg>");
    for (i = 0; i <= LAST; i++) {
      html.push(renderSquare(i));
    }
    html.push("</div>");
    return html.join("");
  }

  function renderCard() {
    var html = [];
    if (state.phase === "reveal") {
      html.push('<div class="sg-trail-overlay"><div class="sg-trail-card sg-trail-card-still sg-trail-pass">');
      html.push('<button type="button" class="sg-go sg-trail-next" data-act="next">Next team\'s turn</button>');
      html.push("</div></div>");
      return html.join("");
    }
    html.push('<div class="sg-trail-overlay"><div class="sg-trail-card' + (state.keepCard ? " sg-trail-card-still" : "") + '">');
    html.push("<h2>" + escapeHtml(state.card.category || "Question") + "</h2>");
    html.push('<p class="sg-trail-q">' + escapeHtml(state.card.question || state.card.clue) + "</p>");
    if (state.phase === "question") {
      html.push(answerBlock());
      html.push('<p class="sg-trail-time" data-timer>' + state.timerLeft + "</p>");
      html.push('<p class="sg-trail-note">For ' + escapeHtml(teamName(state.turn)) +
        ". Right answer moves " + fullSteps() + ". When time is up, a right answer moves " + halfSteps() + ".</p>");
      if (state.answerShown) {
        html.push(judgeButtons());
      }
    } else if (state.phase === "hint") {
      html.push('<p class="sg-trail-time done">Time is up.</p>');
      html.push(answerBlock());
      html.push('<p class="sg-trail-hint">' + linkHint(state.card.hint) + "</p>");
      html.push('<p class="sg-trail-note">For ' + escapeHtml(teamName(state.turn)) +
        ". A right answer now moves " + halfSteps() + ".</p>");
      if (state.answerShown) {
        html.push(judgeButtons());
      }
    }
    html.push("</div></div>");
    return html.join("");
  }

  function renderChooser(saved) {
    var html = [];
    html.push('<div class="sg-trail-overlay"><div class="sg-trail-panel">');
    html.push("<h2>" + escapeHtml(pack.title) + "</h2>");
    html.push("<p>" + escapeHtml(pack.scripture || "") + "</p>");
    html.push("<p>Roll 2, 4, or 6, then flip a card. That team has 10 seconds. Get it right and move the full roll. After the hint, a right answer moves half. Miss it then and the next team rolls. First to Finish wins.</p>");
    html.push('<div class="sg-trail-actions">');
    html.push('<select id="sg-trail-teams" aria-label="Number of teams">');
    html.push('<option value="2">2 teams</option>');
    html.push('<option value="3" selected>3 teams</option>');
    html.push('<option value="4">4 teams</option>');
    html.push("</select>");
    if (saved) {
      html.push('<button type="button" class="sg-go" data-act="continue">Continue</button>');
      html.push('<button type="button" class="sg-ghost" data-act="reset">New game</button>');
    } else {
      html.push('<button type="button" class="sg-go" data-act="start">Start</button>');
    }
    html.push("</div>");
    html.push('<p><button type="button" class="sg-ghost" data-act="exit">Back to stories</button></p>');
    html.push("</div></div>");
    return html.join("");
  }

  function renderMenu() {
    return '<div class="sg-trail-overlay"><div class="sg-trail-panel">' +
      "<h2>Menu</h2>" +
      '<div class="sg-trail-actions">' +
      '<button type="button" class="sg-go" data-act="continue">Continue game</button>' +
      '<button type="button" class="sg-ghost" data-act="newgame">New game</button>' +
      '<button type="button" class="sg-ghost" data-act="exit">Back to stories</button>' +
      "</div></div></div>";
  }

  function renderWin() {
    return '<div class="sg-trail-overlay"><div class="sg-trail-panel">' +
      "<h2>" + escapeHtml(teamName(state.winner)) + " reached the end</h2>" +
      "<p>Nice work. Read one verse from the board together before you close.</p>" +
      '<div class="sg-trail-actions">' +
      '<button type="button" class="sg-go" data-act="newgame">New game</button>' +
      '<button type="button" class="sg-ghost" data-act="exit">Back to stories</button>' +
      "</div></div></div>";
  }

  function render() {
    var saved;
    var html;
    if (!root || !state) {
      return;
    }
    if (state.page === "chooser") {
      saved = loadSaved();
      root.innerHTML = renderChooser(saved && saved.teams && saved.teams.length);
      renderPageChrome();
      return;
    }
    if (state.page === "menu") {
      root.innerHTML = renderBoard() + renderMenu();
      renderPageChrome();
      return;
    }
    if (state.page === "win") {
      root.innerHTML = renderBoard() + renderWin();
      renderPageChrome();
      return;
    }
    html = renderBoard();
    if (state.card && (state.phase === "question" || state.phase === "hint" || state.phase === "reveal")) {
      html += renderCard();
    }
    root.innerHTML = html;
    renderPageChrome();
  }

  function renderDie() {
    var face = state.die == null ? "" : String(state.die);
    var locked = state.phase === "reveal";
    if (!face) {
      return '<button type="button" class="sg-trail-die waiting" data-act="roll">Roll</button>';
    }
    if (locked) {
      return '<div class="sg-trail-die face" aria-label="Rolled ' + escapeHtml(face) + '">' + escapeHtml(face) + "</div>";
    }
    return '<button type="button" class="sg-trail-die face" data-act="roll" aria-label="Rolled ' +
      escapeHtml(face) + '. Roll again">' + escapeHtml(face) + "</button>";
  }

  function openHint() {
    if (!state || state.phase !== "question") {
      return;
    }
    clearTimer();
    state.phase = "hint";
    state.revealed = false;
    state.answerShown = false;
    state.awardNote = "";
    state.keepCard = true;
    save();
    render();
    state.keepCard = false;
  }

  function onRoll() {
    var reroll;
    if (!state || state.page !== "play" || state.phase === "reveal") {
      return;
    }
    reroll = state.phase !== "roll";
    state.die = DIE[Math.floor(Math.random() * DIE.length)];
    if (!reroll) {
      state.phase = "flip";
      state.card = null;
      state.awardNote = "";
    }
    state.keepCard = reroll && !!state.card;
    save();
    render();
    state.keepCard = false;
  }

  function onFlip() {
    var land;
    var cat;
    if (state.phase !== "flip") {
      return;
    }
    land = destination(state.turn, state.die);
    cat = categoryAt(land);
    state.card = drawCard(cat);
    state.phase = "question";
    state.timerLeft = ANSWER_SECONDS;
    state.revealed = false;
    state.answerShown = false;
    state.awardNote = "";
    save();
    render();
    startTimer();
  }

  function judgeButtons() {
    return '<div class="sg-trail-actions">' +
      '<button type="button" class="sg-go" data-act="gotit">They got it</button>' +
      '<button type="button" class="sg-ghost" data-act="wrong">They missed it</button>' +
      "</div>";
  }

  function answerBlock() {
    if (state.phase === "reveal" || state.answerShown) {
      return '<p class="sg-trail-answer"><span>Answer</span> ' + escapeHtml(state.card.answer || "") + "</p>";
    }
    return '<button type="button" class="sg-trail-answer sg-trail-answer-hidden" data-act="showanswer"><span>Answer</span> Show answer</button>';
  }

  function showAnswer() {
    if (!state || !state.card || state.answerShown) {
      return;
    }
    if (state.phase !== "question" && state.phase !== "hint") {
      return;
    }
    clearTimer();
    state.answerShown = true;
    state.keepCard = true;
    save();
    render();
    state.keepCard = false;
  }

  function passTurn(note) {
    state.turn = (state.turn + 1) % state.teams.length;
    state.phase = "roll";
    state.die = null;
    state.card = null;
    state.revealed = false;
    state.answerShown = false;
    state.awardNote = note;
    state.timerLeft = ANSWER_SECONDS;
    save();
    render();
  }

  function onGotIt() {
    var won;
    var steps;
    var note;
    if (state.phase !== "question" && state.phase !== "hint") {
      return;
    }
    clearTimer();
    steps = stepsNow();
    note = teamName(state.turn) + " got it" +
      (state.phase === "hint" ? " after the hint" : "") + " and moved " + steps + ".";
    won = moveTeam(state.turn, steps);
    if (won) {
      declareWin(state.turn, teamName(state.turn) + " got it and reached the end.");
      return;
    }
    passTurn(note);
  }

  function onWrong() {
    var note;
    if (state.phase !== "question" && state.phase !== "hint") {
      return;
    }
    clearTimer();
    note = teamName(state.turn) + " missed it and stays put.";
    passTurn(note);
  }

  function onNext() {
    if (state.phase !== "reveal") {
      return;
    }
    state.turn = (state.turn + 1) % state.teams.length;
    state.phase = "roll";
    state.die = null;
    state.card = null;
    state.revealed = false;
    state.answerShown = false;
    state.awardNote = "";
    state.timerLeft = ANSWER_SECONDS;
    save();
    render();
  }

  function openMenu() {
    if (state.page === "chooser" || state.page === "menu") {
      return;
    }
    clearTimer();
    state.page = "menu";
    render();
  }

  function continueGame() {
    if (state.page !== "menu") {
      return;
    }
    state.page = state.winner >= 0 ? "win" : "play";
    render();
    if (state.page === "play" && state.phase === "question") {
      startTimer();
    }
  }

  function onClick(e) {
    var btn = e.target.closest("[data-act]");
    var act;
    var select;
    var n;
    var saved;
    var exit;
    var keyHost = document.getElementById("lesson-key");
    if (!btn || !root || (!root.contains(btn) && !(keyHost && keyHost.contains(btn)))) {
      return;
    }
    act = btn.getAttribute("data-act");
    if (act === "start") {
      select = root.querySelector("#sg-trail-teams");
      n = select ? parseInt(select.value, 10) : 3;
      freshGame(n);
      render();
    } else if (act === "continue") {
      if (state.page === "menu") {
        continueGame();
        return;
      }
      saved = loadSaved();
      if (saved) {
        resume(saved);
        render();
      }
    } else if (act === "reset" || act === "newgame") {
      clearSaved();
      clearTimer();
      state.page = "chooser";
      state.teams = [];
      state.winner = -1;
      render();
    } else if (act === "roll") {
      onRoll();
    } else if (act === "flip") {
      onFlip();
    } else if (act === "gotit") {
      onGotIt();
    } else if (act === "showanswer") {
      showAnswer();
    } else if (act === "wrong") {
      onWrong();
    } else if (act === "next") {
      onNext();
    } else if (act === "menu") {
      openMenu();
    } else if (act === "exit") {
      exit = opts.onExit;
      unmount();
      if (exit) {
        exit();
      }
    }
  }

  function onKey(e) {
    var key;
    if (!state || !root) {
      return;
    }
    key = e.key;
    if (key === "Escape") {
      e.preventDefault();
      if (state.page === "menu") {
        continueGame();
      } else if (state.page !== "chooser") {
        openMenu();
      }
      return;
    }
    if (key !== " " && key !== "Spacebar") {
      return;
    }
    if (state.page !== "play") {
      return;
    }
    e.preventDefault();
    if (state.phase === "roll") {
      onRoll();
    } else if (state.phase === "flip") {
      onFlip();
    } else if (state.phase === "reveal") {
      onNext();
    }
  }

  function mount(container, storyPack, options) {
    unmount();
    if (!container || !storyPack) {
      return;
    }
    clearTrailSaves();
    pack = normalizePack(storyPack);
    opts = options || {};
    root = container;
    root.classList.add("sg-trail");
    root.hidden = false;
    state = {
      page: "chooser",
      teams: [],
      turn: 0,
      phase: "roll",
      die: null,
      card: null,
      timerLeft: ANSWER_SECONDS,
      timerId: null,
      revealed: false,
      answerShown: false,
      decks: {},
      awardNote: "",
      winner: -1
    };
    document.addEventListener("click", onClick);
    keyHandler = onKey;
    document.addEventListener("keydown", keyHandler);
    render();
  }

  function unmount() {
    clearTimer();
    document.removeEventListener("click", onClick);
    if (root) {
      root.classList.remove("sg-trail");
      root.innerHTML = "";
      root.hidden = true;
    }
    var pageSlot = document.getElementById("lesson-key-page");
    if (pageSlot) {
      pageSlot.innerHTML = "";
    }
    if (keyHandler) {
      document.removeEventListener("keydown", keyHandler);
    }
    root = null;
    pack = null;
    opts = {};
    keyHandler = null;
    state = null;
  }

  g.ScriptureGames.trail = {
    mount: mount,
    unmount: unmount
  };

  window.addEventListener("pageshow", function (event) {
    clearTrailSaves();
    if (event.persisted) {
      window.location.reload();
    }
  });
})(window);
