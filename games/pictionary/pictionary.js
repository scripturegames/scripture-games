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

  function normalizePack(src) {
    var prompts = (src.drawPrompts || []).map(function (p) {
      return {
        draw: String(p.draw == null ? "" : p.draw).trim(),
        ref: String(p.ref == null ? "" : p.ref).trim()
      };
    }).filter(function (p) {
      return p.draw.length > 0;
    });
    return {
      id: String(src.id || "pack"),
      title: String(src.title || "Pictionary"),
      scripture: String(src.scripture || ""),
      drawPrompts: prompts
    };
  }

  function currentPrompt() {
    if (!state || !state.order.length) {
      return null;
    }
    return state.order[state.index];
  }

  function nextPrompt() {
    if (!state || !state.order.length) {
      return;
    }
    state.index += 1;
    if (state.index >= state.order.length) {
      state.order = shuffle(pack.drawPrompts);
      state.index = 0;
      state.looped = true;
    }
    state.covered = false;
    render();
  }

  function toggleCover() {
    if (!state) {
      return;
    }
    state.covered = !state.covered;
    render();
  }

  function render() {
    if (!root || !state) {
      return;
    }
    var prompt = currentPrompt();
    var n = state.order.length;
    var shown = n ? state.index + 1 : 0;
    var word;
    var refHtml = "";
    if (!prompt) {
      word = "No drawing prompts in this pack.";
    } else if (state.covered) {
      word = "Draw it!";
    } else {
      word = prompt.draw;
      if (prompt.ref) {
        refHtml = '<p class="sg-pic-ref">' + escapeHtml(prompt.ref) + "</p>";
      }
    }

    root.innerHTML =
      '<div class="sg-pic-bar">' +
        "<div>" +
          "<h1>" + escapeHtml(pack.title) + "</h1>" +
          '<p class="sg-pic-meta">' + escapeHtml(pack.scripture) + "</p>" +
        "</div>" +
        '<div class="sg-pic-count">' + shown + " / " + n + (state.looped ? " · shuffled" : "") + "</div>" +
      "</div>" +
      '<div class="sg-pic-stage">' +
        '<p class="sg-pic-word' + (state.covered ? " covered" : "") + '">' + escapeHtml(word) + "</p>" +
        refHtml +
        '<p class="sg-pic-hint">Show the word to the drawer. Cover it so guessers watch the board. Spacebar = next.</p>' +
      "</div>" +
      '<div class="sg-pic-actions">' +
        '<button type="button" class="sg-pic-next" data-pic="next">Next</button>' +
        '<button type="button" class="sg-pic-cover" data-pic="cover">' + (state.covered ? "Show word" : "Cover word") + "</button>" +
        '<button type="button" class="sg-pic-exit" data-pic="exit">Hub</button>' +
      "</div>";
  }

  function onClick(e) {
    var btn = e.target.closest("[data-pic]");
    if (!btn) {
      return;
    }
    var action = btn.getAttribute("data-pic");
    if (action === "next") {
      nextPrompt();
    } else if (action === "cover") {
      toggleCover();
    } else if (action === "exit" && opts.onExit) {
      opts.onExit();
    }
  }

  function onKey(e) {
    if (!state) {
      return;
    }
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      nextPrompt();
    } else if (e.key === "Escape" && opts.onExit) {
      e.preventDefault();
      opts.onExit();
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
    root.classList.add("sg-pictionary");
    root.hidden = false;
    state = {
      order: shuffle(pack.drawPrompts),
      index: 0,
      covered: false,
      looped: false
    };
    root.addEventListener("click", onClick);
    keyHandler = onKey;
    document.addEventListener("keydown", keyHandler);
    render();
  }

  function unmount() {
    if (root) {
      root.removeEventListener("click", onClick);
      root.classList.remove("sg-pictionary");
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

  g.ScriptureGames.pictionary = {
    mount: mount,
    unmount: unmount
  };
})(window);
