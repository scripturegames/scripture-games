(function (g) {
  "use strict";

  g.ScriptureGames = g.ScriptureGames || {};

  var root = null;
  var pack = null;
  var opts = {};
  var keyHandler = null;
  var state = null;
  var flipTimer = null;

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isSafeSource(src) {
    return typeof src === "string" &&
      (src.indexOf("https://www.churchofjesuschrist.org/media/") === 0 ||
        src.indexOf("https://commons.wikimedia.org/wiki/File:") === 0);
  }

  function sourceLabel(src) {
    if (src.indexOf("https://commons.wikimedia.org/") === 0) {
      return "Picture from Wikimedia Commons (not our art)";
    }
    return "Picture from the Church Media Library (not our art)";
  }

  function isSafeImage(src) {
    return typeof src === "string" &&
      src.indexOf("stories/images/") === 0 &&
      src.indexOf("..") === -1 &&
      src.indexOf(":") === -1 &&
      src.indexOf("\\") === -1;
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

  function uniqueSections(items) {
    var seen = {};
    var out = [];
    var i;
    var name;
    for (i = 0; i < items.length; i++) {
      name = items[i].section;
      if (!name || seen[name]) {
        continue;
      }
      seen[name] = true;
      out.push(name);
    }
    return out;
  }

  function linkRef(ref) {
    if (g.ScriptureGames && typeof g.ScriptureGames.gospelLinkHtml === "function") {
      return g.ScriptureGames.gospelLinkHtml(ref);
    }
    return escapeHtml(ref);
  }

  function normalizeVerses(item) {
    var verses;
    var refs;
    if (item.verses && item.verses.length) {
      verses = item.verses.map(function (verse) {
        return {
          ref: String(verse.ref == null ? "" : verse.ref).trim(),
          text: String(verse.text == null ? "" : verse.text).replace(/\r\n/g, "\n").trim()
        };
      }).filter(function (verse) {
        return verse.ref.length > 0;
      });
    } else {
      verses = [];
    }
    refs = (item.refs || []).map(function (ref) {
      return String(ref == null ? "" : ref).trim();
    }).filter(function (ref) {
      return ref.length > 0;
    });
    if (!verses.length && refs.length) {
      verses = refs.map(function (ref) {
        return { ref: ref, text: "" };
      });
    }
    if (!refs.length && verses.length) {
      refs = verses.map(function (verse) {
        return verse.ref;
      });
    }
    return { refs: refs, verses: verses };
  }

  function normalizePack(src) {
    var items = (src.matchItems || []).map(function (item) {
      var parsed = normalizeVerses(item);
      return {
        id: String(item.id == null ? "" : item.id).trim(),
        section: String(item.section == null ? "" : item.section).trim(),
        label: String(item.label == null ? "" : item.label).trim(),
        image: String(item.image == null ? "" : item.image).trim(),
        refs: parsed.refs,
        verses: parsed.verses,
        prompt: String(item.prompt == null ? "" : item.prompt).trim(),
        source: String(item.source == null ? "" : item.source).trim(),
        fit: item.fit === "contain" ? "contain" : "cover"
      };
    }).filter(function (item) {
      return item.id.length > 0 &&
        item.label.length > 0 &&
        isSafeImage(item.image);
    });
    return {
      id: String(src.id || "pack"),
      title: String(src.title || "Matching"),
      scripture: String(src.scripture || ""),
      matchItems: items,
      sections: uniqueSections(items)
    };
  }

  function itemById(id) {
    var i;
    for (i = 0; i < pack.matchItems.length; i++) {
      if (pack.matchItems[i].id === id) {
        return pack.matchItems[i];
      }
    }
    return null;
  }

  function applyFaceMode() {
    var i;
    if (!state || !state.tiles) {
      return;
    }
    for (i = 0; i < state.tiles.length; i++) {
      if (!state.tiles[i].matched) {
        state.tiles[i].faceUp = !!state.faceUp;
      }
    }
    state.picked = [];
    state.locked = false;
  }

  function startBoard() {
    clearFlipTimer();
    state.items = pack.matchItems.slice();
    state.tiles = buildTiles(state.items);
    state.picked = [];
    state.locked = false;
    state.discussItem = null;
    state.view = "board";
    render();
  }

  function columnsFor(n) {
    if (n === 24) {
      return 6;
    }
    if (n === 16) {
      return 4;
    }
    if (n <= 6) {
      return 3;
    }
    if (n <= 12) {
      return 4;
    }
    return 5;
  }

  function clearFlipTimer() {
    if (flipTimer) {
      clearTimeout(flipTimer);
      flipTimer = null;
    }
  }

  function matchedCount() {
    var n = 0;
    var i;
    if (!state || !state.tiles) {
      return 0;
    }
    for (i = 0; i < state.tiles.length; i++) {
      if (state.tiles[i].matched) {
        n += 1;
      }
    }
    return n / 2;
  }

  function pairTotal() {
    return state && state.items ? state.items.length : 0;
  }

  function allMatched() {
    return pairTotal() > 0 && matchedCount() >= pairTotal();
  }

  function buildTiles(items) {
    var cards = [];
    var i;
    for (i = 0; i < items.length; i++) {
      cards.push(items[i]);
      cards.push(items[i]);
    }
    cards = shuffle(cards);
    return cards.map(function (item, index) {
      return {
        index: index,
        id: item.id,
        faceUp: !!state.faceUp,
        matched: false
      };
    });
  }

  function shuffleBoard() {
    if (!state || !state.items || !state.items.length) {
      return;
    }
    clearFlipTimer();
    state.tiles = buildTiles(state.items);
    state.picked = [];
    state.locked = false;
    state.discussItem = null;
    state.view = "board";
    render();
  }

  function closeDiscuss() {
    if (!state) {
      return;
    }
    state.discussItem = null;
    state.view = "board";
    render();
  }

  function goBack() {
    if (!state) {
      return;
    }
    if (state.view === "discuss") {
      closeDiscuss();
      return;
    }
    if (state.view === "board") {
      if (opts.onExit) {
        opts.onExit();
      }
      return;
    }
    if (opts.onExit) {
      opts.onExit();
    }
  }

  function pickTile(index) {
    var tile;
    var other;
    var a;
    var b;
    if (!state || state.view !== "board" || state.locked) {
      return;
    }
    tile = state.tiles[index];
    if (!tile || tile.matched) {
      return;
    }
    if (state.faceUp) {
      if (state.picked.indexOf(index) !== -1) {
        return;
      }
    } else if (tile.faceUp) {
      return;
    }
    tile.faceUp = true;
    state.picked.push(index);
    if (state.picked.length < 2) {
      render();
      return;
    }
    a = state.picked[0];
    b = state.picked[1];
    other = state.tiles[a];
    tile = state.tiles[b];
    if (other && tile && other.id === tile.id) {
      other.matched = true;
      tile.matched = true;
      state.picked = [];
      state.discussItem = itemById(tile.id);
      state.view = "discuss";
      render();
      return;
    }
    state.locked = true;
    render();
    flipTimer = setTimeout(function () {
      if (!state || !state.tiles[a] || !state.tiles[b]) {
        return;
      }
      if (!state.tiles[a].matched) {
        state.tiles[a].faceUp = !!state.faceUp;
      }
      if (!state.tiles[b].matched) {
        state.tiles[b].faceUp = !!state.faceUp;
      }
      state.picked = [];
      state.locked = false;
      flipTimer = null;
      render();
    }, 900);
  }

  function renderBoard() {
    var html = [];
    var i;
    var tile;
    var item;
    var cols = columnsFor(state.tiles.length);
    html.push('<header class="sg-match-bar">');
    html.push("<div><h1>" + escapeHtml(pack.title) + "</h1>");
    html.push('<p class="sg-match-meta">' + escapeHtml(pack.scripture) + "</p></div>");
    html.push('<p class="sg-match-count">' + matchedCount() + " / " + pairTotal() + " matched</p>");
    html.push("</header>");
    html.push('<div class="sg-match-board-wrap">');
    if (allMatched()) {
      html.push('<p class="sg-match-hint">All matched. Shuffle to play again.</p>');
    } else {
      html.push('<p class="sg-match-hint">' + (state.faceUp ? "Find the two pictures that match." : "Flip two tiles. Match, then share.") + "</p>");
    }
    html.push('<div class="sg-match-board" style="grid-template-columns: repeat(' + cols + ', 1fr);">');
    for (i = 0; i < state.tiles.length; i++) {
      tile = state.tiles[i];
      item = itemById(tile.id);
      html.push(
        '<button type="button" class="sg-match-tile' +
          (tile.faceUp ? " face-up" : "") +
          (tile.matched ? " matched" : "") +
          '" data-action="tile" data-index="' +
          tile.index +
          '"' +
          (tile.matched ? " disabled" : "") +
          ">"
      );
      if (tile.faceUp && item) {
        html.push('<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.label) + '">');
        html.push('<span class="sg-match-tile-label">' + escapeHtml(item.label) + "</span>");
      } else {
        html.push('<span class="sg-match-tile-back">?</span>');
      }
      html.push("</button>");
    }
    html.push("</div></div>");
    html.push('<div class="sg-match-actions">');
    html.push('<button type="button" class="sg-match-mode-btn' + (state.faceUp ? "" : " selected") + '" data-action="mode-memory">Memory</button>');
    html.push('<button type="button" class="sg-match-mode-btn' + (state.faceUp ? " selected" : "") + '" data-action="mode-faceup">Face up</button>');
    html.push('<button type="button" class="sg-match-secondary" data-action="shuffle">Shuffle</button>');
    html.push('<button type="button" class="sg-match-exit" data-action="exit">Back to Hub</button>');
    html.push("</div>");
    return html.join("");
  }

  function renderDiscuss() {
    var item = state.discussItem;
    var html = [];
    var i;
    var verse;
    html.push('<header class="sg-match-bar">');
    html.push("<div><h1>A match!</h1>");
    html.push('<p class="sg-match-meta">' + escapeHtml((item && item.section) || pack.title) + "</p></div>");
    html.push('<p class="sg-match-count">' + matchedCount() + " / " + pairTotal() + " matched</p>");
    html.push("</header>");
    html.push('<div class="sg-match-discuss">');
    if (item) {
      html.push('<div class="sg-match-discuss-body">');
      html.push('<img class="sg-match-discuss-art" src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.label) + '">');
      html.push('<div class="sg-match-discuss-copy">');
      html.push("<h2>" + escapeHtml(item.label) + "</h2>");
      for (i = 0; i < (item.verses || []).length; i++) {
        verse = item.verses[i];
        html.push('<p class="sg-match-refs">' + linkRef(verse.ref) + "</p>");
        if (verse.text) {
          html.push('<p class="sg-match-verse">' + escapeHtml(verse.text).replace(/\n/g, "<br>") + "</p>");
        }
      }
      if (item.prompt) {
        html.push('<p class="sg-match-prompt">' + escapeHtml(item.prompt) + "</p>");
      }
      html.push("</div></div>");
    }
    html.push("</div>");
    html.push('<div class="sg-match-actions">');
    html.push('<button type="button" class="sg-match-exit" data-action="back">Back</button>');
    html.push('<button type="button" class="sg-match-primary" data-action="continue">Keep matching</button>');
    html.push("</div>");
    return html.join("");
  }

  function render() {
    if (!root || !state) {
      return;
    }
    if (state.view === "board") {
      root.innerHTML = renderBoard();
      return;
    }
    root.innerHTML = renderDiscuss();
  }

  function onClick(e) {
    var btn = e.target.closest("[data-action]");
    var action;
    var index;
    if (!btn || !state) {
      return;
    }
    action = btn.getAttribute("data-action");
    if (action === "exit") {
      if (opts.onExit) {
        opts.onExit();
      }
      return;
    }
    if (action === "back") {
      goBack();
      return;
    }
    if (action === "continue") {
      closeDiscuss();
      return;
    }
    if (action === "shuffle") {
      shuffleBoard();
      return;
    }
    if (action === "mode-memory") {
      state.faceUp = false;
      applyFaceMode();
      render();
      return;
    }
    if (action === "mode-faceup") {
      state.faceUp = true;
      applyFaceMode();
      render();
      return;
    }
    if (action === "tile") {
      index = parseInt(btn.getAttribute("data-index"), 10);
      if (isFinite(index)) {
        pickTile(index);
      }
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
    if (state.view === "discuss") {
      e.preventDefault();
      closeDiscuss();
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
    root.classList.add("sg-matching");
    root.hidden = false;
    state = {
      view: "board",
      faceUp: false,
      items: [],
      tiles: [],
      picked: [],
      locked: false,
      discussItem: null
    };
    root.addEventListener("click", onClick);
    keyHandler = onKey;
    document.addEventListener("keydown", keyHandler);
    startBoard();
  }

  function unmount() {
    clearFlipTimer();
    if (root) {
      root.removeEventListener("click", onClick);
      root.classList.remove("sg-matching");
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

  g.ScriptureGames.matching = {
    mount: mount,
    unmount: unmount
  };
})(window);
