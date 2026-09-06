(function (g) {
  "use strict";

  var hub = document.getElementById("hub");
  var gameRoot = document.getElementById("game-root");
  var storiesEl = document.getElementById("story-cards");
  var gamesEl = document.getElementById("game-cards");
  var playBtn = document.getElementById("play-btn");
  var errEl = document.getElementById("hub-error");

  var selectedStoryId = null;
  var selectedGameId = null;
  var loaded = {};

  function showError(msg) {
    if (errEl) {
      errEl.textContent = msg || "";
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (loaded[src]) {
        resolve();
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.onload = function () {
        loaded[src] = true;
        resolve();
      };
      s.onerror = function () {
        reject(new Error("Could not load " + src));
      };
      document.head.appendChild(s);
    });
  }

  function loadStylesheet(href) {
    return new Promise(function (resolve, reject) {
      if (loaded[href]) {
        resolve();
        return;
      }
      var settled = false;
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = function () {
        if (settled) {
          return;
        }
        settled = true;
        loaded[href] = true;
        resolve();
      };
      link.onerror = function () {
        if (settled) {
          return;
        }
        settled = true;
        reject(new Error("Could not load " + href));
      };
      document.head.appendChild(link);
      setTimeout(function () {
        if (settled) {
          return;
        }
        settled = true;
        resolve();
      }, 800);
    });
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isSafeAsset(src, prefix) {
    return typeof src === "string" &&
      src.indexOf(prefix) === 0 &&
      src.indexOf("..") === -1 &&
      src.indexOf(":") === -1 &&
      src.indexOf("\\") === -1;
  }

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        return list[i];
      }
    }
    return null;
  }

  function renderCards() {
    var catalog = (g.ScriptureGames && g.ScriptureGames.catalog) || [];
    var games = (g.ScriptureGames && g.ScriptureGames.gameTypes) || [];
    var html = [];
    var i;

    if (!selectedStoryId && catalog[0]) {
      selectedStoryId = catalog[0].id;
    }
    if (!selectedGameId && games[0]) {
      selectedGameId = games[0].id;
    }

    for (i = 0; i < catalog.length; i++) {
      var story = catalog[i];
      html.push(
        '<button type="button" class="card' + (story.id === selectedStoryId ? " selected" : "") + '" data-story="' + escapeHtml(story.id) + '">' +
          "<h3>" + escapeHtml(story.title) + "</h3>" +
          '<p class="meta">' + escapeHtml(story.scripture || "") + "</p>" +
          '<p class="blurb">' + escapeHtml(story.summary || "") + "</p>" +
        "</button>"
      );
    }
    storiesEl.innerHTML = html.join("");

    html = [];
    for (i = 0; i < games.length; i++) {
      var game = games[i];
      html.push(
        '<button type="button" class="card' + (game.id === selectedGameId ? " selected" : "") + '" data-game="' + escapeHtml(game.id) + '">' +
          "<h3>" + escapeHtml(game.title) + "</h3>" +
          '<p class="blurb">' + escapeHtml(game.summary || "") + "</p>" +
        "</button>"
      );
    }
    gamesEl.innerHTML = html.join("");
    playBtn.disabled = !(selectedStoryId && selectedGameId);
  }

  function backToHub() {
    if (g.ScriptureGames.jeopardy) {
      g.ScriptureGames.jeopardy.unmount();
    }
    if (g.ScriptureGames.pictionary) {
      g.ScriptureGames.pictionary.unmount();
    }
    gameRoot.hidden = true;
    hub.hidden = false;
    showError("");
  }

  function play() {
    var catalog = g.ScriptureGames.catalog || [];
    var games = g.ScriptureGames.gameTypes || [];
    var story = findById(catalog, selectedStoryId);
    var game = findById(games, selectedGameId);
    if (!story || !game) {
      showError("Pick a story and a game first.");
      return;
    }
    if (!isSafeAsset(story.file, "stories/") || !isSafeAsset(game.css, "games/") || !isSafeAsset(game.js, "games/")) {
      showError("That story or game path is not allowed.");
      return;
    }
    showError("");
    playBtn.disabled = true;

    loadScript(story.file)
      .then(function () {
        if (game.id !== "jeopardy" && game.id !== "pictionary") {
          throw new Error("That game is not in this version yet.");
        }
        return Promise.all([loadStylesheet(game.css), loadScript(game.js)]);
      })
      .then(function () {
        var pack = g.ScriptureGames.packs && g.ScriptureGames.packs[story.id];
        if (!pack) {
          throw new Error("Story pack did not load: " + story.id);
        }
        hub.hidden = true;
        gameRoot.hidden = false;
        if (game.id === "jeopardy") {
          if (!pack.clues || !pack.clues.length) {
            throw new Error("This story has no Jeopardy clues. Pick Job or David and Goliath.");
          }
          if (!g.ScriptureGames.jeopardy) {
            throw new Error("Jeopardy engine did not load.");
          }
          g.ScriptureGames.jeopardy.mount(gameRoot, pack, { onExit: backToHub });
          return;
        }
        if (!pack.drawPrompts || !pack.drawPrompts.length) {
          throw new Error("This story has no drawing prompts. Pick Psalms: Praise the Lord.");
        }
        if (!g.ScriptureGames.pictionary) {
          throw new Error("Pictionary engine did not load.");
        }
        g.ScriptureGames.pictionary.mount(gameRoot, pack, { onExit: backToHub });
      })
      .catch(function (err) {
        if (g.ScriptureGames.jeopardy) {
          g.ScriptureGames.jeopardy.unmount();
        }
        if (g.ScriptureGames.pictionary) {
          g.ScriptureGames.pictionary.unmount();
        }
        showError(err.message || "Could not start the game.");
        hub.hidden = false;
        gameRoot.hidden = true;
      })
      .then(function () {
        playBtn.disabled = false;
      });
  }

  storiesEl.addEventListener("click", function (e) {
    var card = e.target.closest("[data-story]");
    if (!card) {
      return;
    }
    selectedStoryId = card.getAttribute("data-story");
    renderCards();
  });

  gamesEl.addEventListener("click", function (e) {
    var card = e.target.closest("[data-game]");
    if (!card) {
      return;
    }
    selectedGameId = card.getAttribute("data-game");
    renderCards();
  });

  playBtn.addEventListener("click", play);

  renderCards();
})(window);
