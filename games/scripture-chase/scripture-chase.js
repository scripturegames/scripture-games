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
      .replace(/"/g, "&quot;");
  }

  function normalizePack(src) {
    var verses = (src.chaseVerses || []).map(function (v) {
      var questions = (v.questions || []).map(function (q) {
        return String(q == null ? "" : q).trim();
      }).filter(function (q) {
        return q.length > 0;
      });
      return {
        ref: String(v.ref == null ? "" : v.ref).trim(),
        section: String(v.section == null ? "" : v.section).trim(),
        text: String(v.text == null ? "" : v.text).replace(/\r\n/g, "\n").trim(),
        summary: String(v.summary == null ? "" : v.summary).trim(),
        questions: questions
      };
    }).filter(function (v) {
      return v.ref.length > 0;
    });
    return {
      id: String(src.id || "pack"),
      title: String(src.title || "Scripture Chase"),
      scripture: String(src.scripture || ""),
      chaseVerses: verses
    };
  }

  function currentVerse() {
    if (!state || state.current == null) {
      return null;
    }
    return pack.chaseVerses[state.current] || null;
  }

  function unusedIndexes() {
    var out = [];
    var i;
    for (i = 0; i < pack.chaseVerses.length; i++) {
      if (!state.done[i]) {
        out.push(i);
      }
    }
    return out;
  }

  function doneCount() {
    var n = 0;
    var i;
    for (i = 0; i < pack.chaseVerses.length; i++) {
      if (state.done[i]) {
        n += 1;
      }
    }
    return n;
  }

  function openVerse(index) {
    if (!pack.chaseVerses[index]) {
      return;
    }
    state.current = index;
    state.view = "chase";
    state.revealed = false;
    state.done[index] = true;
    render();
  }

  function pickRandom() {
    var unused = unusedIndexes();
    var pool = unused.length ? unused : pack.chaseVerses.map(function (_v, i) {
      return i;
    });
    if (!pool.length) {
      return;
    }
    openVerse(pool[Math.floor(Math.random() * pool.length)]);
  }

  function barHtml() {
    var n = pack.chaseVerses.length;
    var found = doneCount();
    return (
      '<div class="sg-chase-bar">' +
        "<div>" +
          "<h1>" + escapeHtml(pack.title) + "</h1>" +
          '<p class="sg-chase-meta">' + escapeHtml(pack.scripture) + "</p>" +
        "</div>" +
        '<div class="sg-chase-count">' + found + " / " + n + " found</div>" +
      "</div>"
    );
  }

  function btn(action, label, className) {
    return (
      '<button type="button" class="' + className + '" data-chase="' + action + '">' +
        escapeHtml(label) +
      "</button>"
    );
  }

  function footHtml(leftBtn, centerBtn, rightBtn) {
    return (
      '<div class="sg-chase-foot">' +
        '<div class="sg-chase-foot-side left">' + (leftBtn || "") + "</div>" +
        '<div class="sg-chase-foot-mid">' + (centerBtn || "") + "</div>" +
        '<div class="sg-chase-foot-side right">' + (rightBtn || "") + "</div>" +
      "</div>"
    );
  }

  function goBack() {
    if (!state) {
      return;
    }
    if (state.view === "discuss") {
      state.view = "chase";
      state.revealed = true;
      render();
      return;
    }
    if (state.view === "chase" && state.revealed) {
      state.revealed = false;
      render();
      return;
    }
    if (state.view === "chase") {
      state.view = "board";
      state.current = null;
      state.revealed = false;
      render();
      return;
    }
    if (opts.onExit) {
      opts.onExit();
    }
  }

  function goBoard() {
    state.view = "board";
    state.current = null;
    state.revealed = false;
    render();
  }

  function renderBoard() {
    var tiles = [];
    var i;
    var verse;
    for (i = 0; i < pack.chaseVerses.length; i++) {
      verse = pack.chaseVerses[i];
      tiles.push(
        '<button type="button" class="sg-chase-tile' + (state.done[i] ? " done" : "") + '" data-chase="tile" data-index="' + i + '">' +
          '<span class="sg-chase-tile-num">' + (i + 1) + "</span>" +
          (state.done[i] ? '<span class="sg-chase-tile-ref">' + escapeHtml(verse.ref) + "</span>" : "") +
        "</button>"
      );
    }
    return (
      '<div class="sg-chase-board-wrap">' +
        '<p class="sg-chase-hint">Click a hidden tile. Kids race to find the reference. First one to get there reads it.</p>' +
        '<div class="sg-chase-board">' + tiles.join("") + "</div>" +
      "</div>" +
      footHtml(
        btn("exit", "Back to Hub", "sg-chase-ghost"),
        btn("random", "Random", "sg-chase-primary"),
        ""
      )
    );
  }

  function renderChase() {
    var verse = currentVerse();
    var center;
    if (!verse) {
      return renderBoard();
    }
    var body = (
      '<p class="sg-chase-ref">' + escapeHtml(verse.ref) + "</p>" +
      '<p class="sg-chase-hint">Find it in your scriptures. First one to get there reads it.</p>'
    );
    if (state.revealed) {
      body += '<p class="sg-chase-text">' + escapeHtml(verse.text).replace(/\n/g, "<br>") + "</p>";
    }
    center = state.revealed
      ? btn("discuss", "Discuss", "sg-chase-primary")
      : btn("reveal", "Reveal verse", "sg-chase-primary");
    return (
      '<div class="sg-chase-stage">' + body + "</div>" +
      footHtml(
        btn("back", "Back", "sg-chase-ghost"),
        center,
        btn("board", "Back to Board", "sg-chase-ghost")
      )
    );
  }

  function renderDiscuss() {
    var verse = currentVerse();
    var items;
    var i;
    if (!verse) {
      return renderBoard();
    }
    items = [];
    for (i = 0; i < verse.questions.length; i++) {
      items.push("<li>" + escapeHtml(verse.questions[i]) + "</li>");
    }
    return (
      '<div class="sg-chase-stage discuss">' +
        '<p class="sg-chase-ref small">' + escapeHtml(verse.ref) + "</p>" +
        '<h2 class="sg-chase-section">' + escapeHtml(verse.section) + "</h2>" +
        (verse.summary ? '<p class="sg-chase-summary">' + escapeHtml(verse.summary) + "</p>" : "") +
        (items.length ? '<ol class="sg-chase-questions">' + items.join("") + "</ol>" : "") +
      "</div>" +
      footHtml(
        btn("back", "Back", "sg-chase-ghost"),
        "",
        btn("board", "Back to Board", "sg-chase-ghost")
      )
    );
  }

  function render() {
    if (!root || !state) {
      return;
    }
    var inner = "";
    if (state.view === "chase") {
      inner = renderChase();
    } else if (state.view === "discuss") {
      inner = renderDiscuss();
    } else {
      inner = renderBoard();
    }
    root.innerHTML = barHtml() + inner;
  }

  function onClick(e) {
    var btnEl = e.target.closest("[data-chase]");
    var action;
    var index;
    if (!btnEl) {
      return;
    }
    action = btnEl.getAttribute("data-chase");
    if (action === "tile") {
      index = parseInt(btnEl.getAttribute("data-index"), 10);
      if (isFinite(index)) {
        openVerse(index);
      }
    } else if (action === "random") {
      pickRandom();
    } else if (action === "reveal") {
      state.revealed = true;
      render();
    } else if (action === "discuss") {
      if (state.revealed) {
        state.view = "discuss";
        render();
      }
    } else if (action === "back") {
      goBack();
    } else if (action === "board") {
      goBoard();
    } else if (action === "exit") {
      goBack();
    }
  }

  function onKey(e) {
    if (!state) {
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      goBack();
      return;
    }
    if (e.key !== " " && e.code !== "Space") {
      return;
    }
    e.preventDefault();
    if (state.view === "board") {
      pickRandom();
    } else if (state.view === "chase") {
      if (!state.revealed) {
        state.revealed = true;
      } else {
        state.view = "discuss";
      }
      render();
    } else if (state.view === "discuss") {
      goBoard();
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
    root.classList.add("sg-chase");
    root.hidden = false;
    state = {
      view: "board",
      current: null,
      revealed: false,
      done: {}
    };
    root.addEventListener("click", onClick);
    keyHandler = onKey;
    document.addEventListener("keydown", keyHandler);
    render();
  }

  function unmount() {
    if (root) {
      root.removeEventListener("click", onClick);
      root.classList.remove("sg-chase");
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

  g.ScriptureGames.scriptureChase = {
    mount: mount,
    unmount: unmount
  };
})(window);
