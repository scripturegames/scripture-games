(function (g) {
  "use strict";

  g.ScriptureGames = g.ScriptureGames || {};

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
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function coerceDifficulty(value) {
    var n = parseInt(value, 10);
    if (!isFinite(n) || n < 0 || n > 10000) {
      return 0;
    }
    return n;
  }

  function normalizePack(src) {
    var cats = (src.categories || []).map(function (c) {
      return String(c == null ? "" : c);
    });
    var diffs = (src.difficulties || [100, 200, 300, 400, 500]).map(coerceDifficulty);
    var clues = (src.clues || []).map(function (c) {
      return {
        category: String(c.category == null ? "" : c.category),
        difficulty: coerceDifficulty(c.difficulty),
        hint: String(c.hint == null ? "" : c.hint),
        clue: String(c.clue == null ? "" : c.clue),
        response: String(c.response == null ? "" : c.response)
      };
    });
    return {
      id: String(src.id || "pack").replace(/[^a-z0-9\-]/gi, "").slice(0, 40) || "pack",
      title: String(src.title || "Jeopardy"),
      scripture: String(src.scripture || ""),
      categories: cats,
      difficulties: diffs,
      clues: clues
    };
  }

  function cellKey(category, difficulty) {
    return category + "|" + difficulty;
  }

  function findClue(category, difficulty) {
    var clues = pack.clues || [];
    for (var i = 0; i < clues.length; i++) {
      if (clues[i].category === category && clues[i].difficulty === difficulty) {
        return clues[i];
      }
    }
    return null;
  }

  function storageKey() {
    return "sg-jeopardy-" + (pack && pack.id ? pack.id : "unknown");
  }

  function saveState() {
    if (!state || state.page === "chooser") {
      return;
    }
    try {
      localStorage.setItem(storageKey(), JSON.stringify({
        teamCount: state.teamCount,
        teams: state.teams,
        used: state.used
      }));
    } catch (e) {
      /* file:// private mode, quota, or disabled storage */
    }
  }

  function loadSaved() {
    try {
      var raw = localStorage.getItem(storageKey());
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearSaved() {
    try {
      localStorage.removeItem(storageKey());
    } catch (e) {
      /* ignore */
    }
  }

  function isEditingText() {
    var el = document.activeElement;
    if (!el || !root || !root.contains(el)) {
      return false;
    }
    if (el.isContentEditable) {
      return true;
    }
    var tag = el.tagName;
    return tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";
  }

  function render() {
    if (!root) {
      return;
    }
    var cats = pack.categories || [];
    var diffs = pack.difficulties || [100, 200, 300, 400, 500];
    var html = [];
    var i;
    var t;

    html.push(
      '<div class="sg-board-wrap"><div class="sg-board" role="table" aria-label="Game board"' +
        ' style="grid-template-columns:repeat(' + cats.length + ",1fr);grid-template-rows:minmax(3.2rem,0.7fr) repeat(" +
        diffs.length + ',1fr)">'
    );
    for (i = 0; i < cats.length; i++) {
      html.push('<div class="sg-cat" role="columnheader">' + escapeHtml(cats[i]) + "</div>");
    }
    for (var r = 0; r < diffs.length; r++) {
      for (var c = 0; c < cats.length; c++) {
        var clue = findClue(cats[c], diffs[r]);
        var key = cellKey(cats[c], diffs[r]);
        if (!clue) {
          html.push('<button type="button" class="sg-tile empty" disabled>—</button>');
        } else {
          var points = coerceDifficulty(diffs[r]);
          var used = !!state.used[key];
          html.push(
            '<button type="button" class="sg-tile' + (used ? " used" : "") + '"' +
              ' data-cat="' + escapeHtml(cats[c]) + '"' +
              ' data-diff="' + escapeHtml(String(points)) + '"' +
              ' aria-label="' + (used ? "Answered " : "") + escapeHtml(String(points)) + '"' +
              (used ? " disabled" : "") +
              ">" + escapeHtml(String(points)) + "</button>"
          );
        }
      }
    }
    html.push("</div></div>");

    html.push('<button type="button" class="sg-menu-btn" data-act="menu">Menu</button>');
    html.push('<div class="sg-teams"' + (state.teamCount === 0 ? " hidden" : "") + ">");
    for (i = 0; i < state.teams.length; i++) {
      t = state.teams[i];
      html.push(
        '<div class="sg-team' + (state.activeTeam === i ? " active" : "") + '" data-team="' + i + '">' +
          '<div class="sg-team-name" contenteditable="true" role="textbox" spellcheck="false">' +
            escapeHtml(t.name) + "</div>" +
          '<div class="sg-team-score" contenteditable="true" role="textbox">' +
            escapeHtml(String(t.points)) + "</div>" +
          '<div class="sg-team-ptr">' +
            '<button type="button" class="sg-plus" data-act="score" data-dir="1" data-team="' + i + '" aria-label="Add points">+</button>' +
            '<button type="button" class="sg-minus" data-act="score" data-dir="-1" data-team="' + i + '" aria-label="Subtract points">−</button>' +
          "</div>" +
        "</div>"
      );
    }
    html.push("</div>");

    if (state.page === "chooser") {
      var saved = loadSaved();
      html.push('<div class="sg-overlay">');
      html.push('<div class="sg-chooser">');
      html.push("<h1>" + escapeHtml(pack.title) + "</h1>");
      html.push('<p class="sg-scripture">' + escapeHtml(pack.scripture || "") + "</p>");
      html.push('<div class="sg-chooser-row">');
      html.push('<select id="sg-team-count" aria-label="Number of teams">');
      var labels = ["No teams", "1 team", "2 teams", "3 teams", "4 teams", "5 teams", "6 teams", "7 teams", "8 teams", "9 teams", "10 teams"];
      var selected = saved && typeof saved.teamCount === "number" ? saved.teamCount : 3;
      for (i = 0; i <= 10; i++) {
        html.push('<option value="' + i + '"' + (i === selected ? " selected" : "") + ">" + labels[i] + "</option>");
      }
      html.push("</select>");
      html.push('<button type="button" class="sg-start" data-act="start">' + (saved ? "Continue" : "Start") + "</button>");
      if (saved) {
        html.push('<button type="button" class="sg-ghost" data-act="reset">Reset</button>');
      }
      html.push("</div>");
      html.push('<p class="sg-chooser-note">Click a tile. Kids search their scriptures. <strong>Show Hint</strong> for the reference. <kbd class="sg-kbd">Spacebar</kbd> reveals the response.</p>');
      html.push('<p><button type="button" class="sg-ghost" data-act="exit">Back to stories</button></p>');
      html.push("</div></div>");
    }

    if (state.page === "menu") {
      html.push('<div class="sg-overlay"><div class="sg-menu-panel">');
      html.push("<h2>Menu</h2>");
      html.push('<button type="button" class="sg-start" data-act="continue">Continue game</button>');
      html.push('<button type="button" data-act="newgame">New game</button>');
      html.push('<button type="button" data-act="exit">Back to stories</button>');
      html.push("</div></div>");
    }

    if (state.clue) {
      var clue = state.clue;
      html.push('<div class="sg-clue" role="dialog" aria-modal="true" aria-label="Prompt">');
      html.push('<div class="sg-clue-head">');
      html.push('<button type="button" data-act="close">Continue <kbd class="sg-kbd">ESC</kbd></button>');
      html.push('<div class="sg-clue-title">' + escapeHtml(clue.category) + " for " + escapeHtml(String(clue.difficulty)) + "</div>");
      html.push('<div><button type="button" class="sg-hint-btn" data-act="hint">Show Hint</button></div>');
      html.push('<button type="button" data-act="reveal">Reveal Answer <kbd class="sg-kbd">Spacebar</kbd></button>');
      html.push("</div>");
      html.push('<div class="sg-hint' + (state.hintShown ? " show" : "") + '">' + escapeHtml(clue.hint || "") + "</div>");
      html.push('<div class="sg-clue-body">');
      html.push('<div class="sg-clue-text">' + escapeHtml(clue.clue) + "</div>");
      html.push('<div class="sg-response' + (state.revealed ? " show" : "") + '">' + escapeHtml(clue.response) + "</div>");
      html.push("</div></div>");
    }

    root.innerHTML = html.join("");
  }

  function syncTeamsFromDom() {
    if (!root) {
      return;
    }
    var names = root.querySelectorAll(".sg-team-name");
    var scores = root.querySelectorAll(".sg-team-score");
    for (var i = 0; i < state.teams.length; i++) {
      if (names[i]) {
        state.teams[i].name = names[i].textContent.replace(/\s+/g, " ").trim() || ("Team " + (i + 1));
      }
      if (scores[i]) {
        var n = parseInt(scores[i].textContent, 10);
        state.teams[i].points = isNaN(n) ? 0 : n;
      }
    }
  }

  function startGame(reset) {
    var select = root.querySelector("#sg-team-count");
    var count = select ? parseInt(select.value, 10) : 3;
    if (isNaN(count) || count < 0) {
      count = 0;
    }
    if (count > 10) {
      count = 10;
    }

    var saved = reset ? null : loadSaved();
    state.teamCount = count;
    state.teams = [];
    state.used = {};
    state.activeTeam = -1;
    state.clue = null;
    state.lastClue = null;
    state.hintShown = false;
    state.revealed = false;
    state.page = "board";

    if (saved && saved.teams && !reset) {
      for (var i = 0; i < count; i++) {
        var prev = saved.teams[i];
        state.teams.push({
          name: prev && prev.name ? String(prev.name).slice(0, 40) : "Team " + (i + 1),
          points: prev && !isNaN(parseInt(prev.points, 10)) ? parseInt(prev.points, 10) : 0
        });
      }
      if (saved.used && typeof saved.used === "object" && !Array.isArray(saved.used)) {
        var usedKeys = Object.keys(saved.used);
        for (var u = 0; u < usedKeys.length; u++) {
          if (saved.used[usedKeys[u]]) {
            state.used[usedKeys[u]] = true;
          }
        }
      }
    } else {
      for (var j = 0; j < count; j++) {
        state.teams.push({ name: "Team " + (j + 1), points: 0 });
      }
    }

    saveState();
    render();
  }

  function openClue(cat, diff) {
    var clue = findClue(cat, diff);
    if (!clue) {
      return;
    }
    if (state.used[cellKey(cat, diff)]) {
      return;
    }
    state.clue = clue;
    state.hintShown = false;
    state.revealed = false;
    render();
  }

  function revealClue() {
    if (!state.clue) {
      return;
    }
    state.revealed = true;
    state.lastClue = state.clue;
    state.used[cellKey(state.clue.category, state.clue.difficulty)] = true;
    saveState();
    render();
  }

  function closeClue() {
    if (!state.clue) {
      return;
    }
    var key = cellKey(state.clue.category, state.clue.difficulty);
    if (state.used[key] || !state.lastClue) {
      state.lastClue = state.clue;
    }
    state.clue = null;
    state.hintShown = false;
    state.revealed = false;
    render();
  }

  function applyScore(teamIndex, dir) {
    var clue = state.clue || state.lastClue;
    if (!clue || teamIndex < 0 || teamIndex >= state.teams.length) {
      return;
    }
    var val = coerceDifficulty(clue.difficulty) * (dir < 0 ? -1 : 1);
    state.teams[teamIndex].points += val;
    state.used[cellKey(clue.category, clue.difficulty)] = true;
    if (state.clue) {
      state.lastClue = state.clue;
    }
    state.activeTeam = teamIndex;
    saveState();
    render();
  }

  function onClick(e) {
    var btn = e.target.closest("[data-act], .sg-tile");
    if (!btn || !root.contains(btn)) {
      if (state.activeTeam >= 0 && !e.target.closest(".sg-team")) {
        state.activeTeam = -1;
        var active = root.querySelector(".sg-team.active");
        if (active) {
          active.classList.remove("active");
        }
      }
      return;
    }

    var act = btn.getAttribute("data-act");
    if (btn.classList.contains("sg-tile") && !act) {
      openClue(btn.getAttribute("data-cat"), parseInt(btn.getAttribute("data-diff"), 10));
      return;
    }

    if (act === "start") {
      startGame(false);
    } else if (act === "reset") {
      clearSaved();
      startGame(true);
    } else if (act === "exit") {
      unmount();
      if (opts.onExit) {
        opts.onExit();
      }
    } else if (act === "menu") {
      syncTeamsFromDom();
      saveState();
      state.page = "menu";
      render();
    } else if (act === "continue") {
      state.page = "board";
      render();
    } else if (act === "newgame") {
      clearSaved();
      state.page = "chooser";
      state.clue = null;
      state.lastClue = null;
      render();
    } else if (act === "hint") {
      state.hintShown = !state.hintShown;
      var hint = root.querySelector(".sg-hint");
      var hintBtn = root.querySelector(".sg-hint-btn");
      if (hint) {
        hint.classList.toggle("show", state.hintShown);
      }
      if (hintBtn) {
        hintBtn.textContent = state.hintShown ? "Hide Hint" : "Show Hint";
      }
    } else if (act === "reveal") {
      revealClue();
    } else if (act === "close") {
      closeClue();
    } else if (act === "score") {
      var idx = parseInt(btn.getAttribute("data-team"), 10);
      var dir = parseInt(btn.getAttribute("data-dir"), 10);
      if (state.clue || state.lastClue) {
        applyScore(idx, dir);
      } else {
        state.activeTeam = idx;
        var teams = root.querySelectorAll(".sg-team");
        for (var i = 0; i < teams.length; i++) {
          teams[i].classList.toggle("active", i === idx);
        }
      }
    }
  }

  function onInput(e) {
    if (!e.target.closest(".sg-team-name, .sg-team-score")) {
      return;
    }
    syncTeamsFromDom();
    saveState();
  }

  function onKey(e) {
    if (!root) {
      return;
    }
    var key = e.key;
    var code = e.keyCode;

    if (state.page === "chooser" || state.page === "menu") {
      if (key === "Escape") {
        e.preventDefault();
        if (state.page === "menu") {
          state.page = "board";
          render();
        }
      }
      return;
    }

    if (state.clue) {
      if (key === "Escape") {
        e.preventDefault();
        closeClue();
      } else if (key === " " || code === 32) {
        if (!isEditingText()) {
          e.preventDefault();
          if (!state.revealed) {
            revealClue();
          }
        }
      }
      if (!isEditingText() && state.clue && ((code >= 48 && code <= 57) || (code >= 96 && code <= 105))) {
        var n = code >= 96 ? code - 96 : code - 48;
        if (n >= 1 && n <= state.teams.length) {
          state.activeTeam = n - 1;
          var teams = root.querySelectorAll(".sg-team");
          for (var i = 0; i < teams.length; i++) {
            teams[i].classList.toggle("active", i === n - 1);
          }
        }
      }
      if (state.activeTeam >= 0 && (state.clue || state.lastClue) && !isEditingText()) {
        if (key === "ArrowUp" && !e.repeat) {
          e.preventDefault();
          applyScore(state.activeTeam, 1);
        } else if (key === "ArrowDown" && !e.repeat) {
          e.preventDefault();
          applyScore(state.activeTeam, -1);
        }
      }
      return;
    }

    if (isEditingText()) {
      return;
    }

    if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105)) {
      var num = code >= 96 ? code - 96 : code - 48;
      if (num >= 1 && num <= state.teams.length) {
        state.activeTeam = num - 1;
        var teamEls = root.querySelectorAll(".sg-team");
        for (var k = 0; k < teamEls.length; k++) {
          teamEls[k].classList.toggle("active", k === num - 1);
        }
      }
    }

    if (state.activeTeam >= 0 && state.lastClue) {
      if (key === "ArrowUp" && !e.repeat) {
        e.preventDefault();
        applyScore(state.activeTeam, 1);
      } else if (key === "ArrowDown" && !e.repeat) {
        e.preventDefault();
        applyScore(state.activeTeam, -1);
      }
    }

    if (key === "Escape") {
      e.preventDefault();
      state.activeTeam = -1;
      state.page = "menu";
      render();
    }
  }

  function mount(container, storyPack, options) {
    unmount();
    if (!container || !storyPack) {
      return;
    }
    pack = normalizePack(storyPack);
    opts = options || {};
    root = container;
    root.classList.add("sg-jeopardy");
    root.hidden = false;
    state = {
      page: "chooser",
      teamCount: 3,
      teams: [],
      used: {},
      activeTeam: -1,
      clue: null,
      lastClue: null,
      hintShown: false,
      revealed: false
    };
    root.addEventListener("click", onClick);
    root.addEventListener("input", onInput);
    keyHandler = onKey;
    document.addEventListener("keydown", keyHandler);
    render();
  }

  function unmount() {
    if (root) {
      root.removeEventListener("click", onClick);
      root.removeEventListener("input", onInput);
      root.classList.remove("sg-jeopardy");
      root.innerHTML = "";
      root.hidden = true;
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

  g.ScriptureGames.jeopardy = {
    mount: mount,
    unmount: unmount
  };
})(window);
