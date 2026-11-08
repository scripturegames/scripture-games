(function (g) {
  "use strict";

  var root = document.getElementById("lesson-key");
  var list = document.getElementById("lesson-key-list");

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function rows(pack) {
    var key = pack && pack.key;
    return key && key.length ? key : [];
  }

  function refsHtml(refs) {
    var link = g.ScriptureGames.gospelLinkHtml;
    var parts = [];
    var i;
    refs = refs || [];
    for (i = 0; i < refs.length; i++) {
      parts.push(link ? link(refs[i]) : escapeHtml(refs[i]));
    }
    return parts.join("; ");
  }

  function fit() {
    var height = 0;
    if (root && !root.hidden) {
      height = root.offsetHeight;
    }
    document.documentElement.style.setProperty("--lesson-key-h", height + "px");
  }

  function show(pack) {
    var items = rows(pack);
    var html = [];
    var i;
    var item;
    if (!root || !list || !items.length) {
      hide();
      return;
    }
    for (i = 0; i < items.length; i++) {
      item = items[i];
      html.push('<li><p class="lesson-key-title">' + escapeHtml(item.title) + "</p>");
      html.push('<p class="lesson-key-refs">' + refsHtml(item.refs) + "</p></li>");
    }
    list.className = "lesson-key-list";
    list.innerHTML = html.join("");
    root.hidden = false;
    fit();
  }

  function hide() {
    var page = document.getElementById("lesson-key-page");
    if (list) {
      list.innerHTML = "";
    }
    if (page) {
      page.innerHTML = "";
    }
    if (root) {
      root.hidden = true;
    }
    fit();
  }

  window.addEventListener("resize", fit);

  g.ScriptureGames = g.ScriptureGames || {};
  g.ScriptureGames.lessonKey = { show: show, hide: hide, fit: fit };
})(window);
