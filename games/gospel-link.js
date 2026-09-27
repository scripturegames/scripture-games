(function (g) {
  "use strict";

  var BOOKS = {
    "genesis": { vol: "ot", slug: "gen" },
    "exodus": { vol: "ot", slug: "ex" },
    "leviticus": { vol: "ot", slug: "lev" },
    "numbers": { vol: "ot", slug: "num" },
    "deuteronomy": { vol: "ot", slug: "deut" },
    "joshua": { vol: "ot", slug: "josh" },
    "judges": { vol: "ot", slug: "judg" },
    "ruth": { vol: "ot", slug: "ruth" },
    "1 samuel": { vol: "ot", slug: "1-sam" },
    "2 samuel": { vol: "ot", slug: "2-sam" },
    "1 kings": { vol: "ot", slug: "1-kgs" },
    "2 kings": { vol: "ot", slug: "2-kgs" },
    "1 chronicles": { vol: "ot", slug: "1-chr" },
    "2 chronicles": { vol: "ot", slug: "2-chr" },
    "ezra": { vol: "ot", slug: "ezra" },
    "nehemiah": { vol: "ot", slug: "neh" },
    "esther": { vol: "ot", slug: "esth" },
    "job": { vol: "ot", slug: "job" },
    "psalm": { vol: "ot", slug: "ps" },
    "psalms": { vol: "ot", slug: "ps" },
    "proverbs": { vol: "ot", slug: "prov" },
    "ecclesiastes": { vol: "ot", slug: "eccl" },
    "song of solomon": { vol: "ot", slug: "song" },
    "isaiah": { vol: "ot", slug: "isa" },
    "jeremiah": { vol: "ot", slug: "jer" },
    "lamentations": { vol: "ot", slug: "lam" },
    "ezekiel": { vol: "ot", slug: "ezek" },
    "daniel": { vol: "ot", slug: "dan" },
    "hosea": { vol: "ot", slug: "hosea" },
    "joel": { vol: "ot", slug: "joel" },
    "amos": { vol: "ot", slug: "amos" },
    "obadiah": { vol: "ot", slug: "obad" },
    "jonah": { vol: "ot", slug: "jonah" },
    "micah": { vol: "ot", slug: "micah" },
    "nahum": { vol: "ot", slug: "nahum" },
    "habakkuk": { vol: "ot", slug: "hab" },
    "zephaniah": { vol: "ot", slug: "zeph" },
    "haggai": { vol: "ot", slug: "hag" },
    "zechariah": { vol: "ot", slug: "zech" },
    "malachi": { vol: "ot", slug: "mal" },
    "matthew": { vol: "nt", slug: "matt" },
    "mark": { vol: "nt", slug: "mark" },
    "luke": { vol: "nt", slug: "luke" },
    "john": { vol: "nt", slug: "john" },
    "acts": { vol: "nt", slug: "acts" },
    "romans": { vol: "nt", slug: "rom" },
    "1 corinthians": { vol: "nt", slug: "1-cor" },
    "2 corinthians": { vol: "nt", slug: "2-cor" },
    "galatians": { vol: "nt", slug: "gal" },
    "ephesians": { vol: "nt", slug: "eph" },
    "philippians": { vol: "nt", slug: "philip" },
    "colossians": { vol: "nt", slug: "col" },
    "1 thessalonians": { vol: "nt", slug: "1-thes" },
    "2 thessalonians": { vol: "nt", slug: "2-thes" },
    "1 timothy": { vol: "nt", slug: "1-tim" },
    "2 timothy": { vol: "nt", slug: "2-tim" },
    "titus": { vol: "nt", slug: "titus" },
    "philemon": { vol: "nt", slug: "philem" },
    "hebrews": { vol: "nt", slug: "heb" },
    "james": { vol: "nt", slug: "james" },
    "1 peter": { vol: "nt", slug: "1-pet" },
    "2 peter": { vol: "nt", slug: "2-pet" },
    "1 john": { vol: "nt", slug: "1-jn" },
    "2 john": { vol: "nt", slug: "2-jn" },
    "3 john": { vol: "nt", slug: "3-jn" },
    "jude": { vol: "nt", slug: "jude" },
    "revelation": { vol: "nt", slug: "rev" },
    "1 nephi": { vol: "bofm", slug: "1-ne" },
    "2 nephi": { vol: "bofm", slug: "2-ne" },
    "jacob": { vol: "bofm", slug: "jacob" },
    "enos": { vol: "bofm", slug: "enos" },
    "jarom": { vol: "bofm", slug: "jarom" },
    "omni": { vol: "bofm", slug: "omni" },
    "words of mormon": { vol: "bofm", slug: "w-of-m" },
    "mosiah": { vol: "bofm", slug: "mosiah" },
    "alma": { vol: "bofm", slug: "alma" },
    "helaman": { vol: "bofm", slug: "hel" },
    "3 nephi": { vol: "bofm", slug: "3-ne" },
    "4 nephi": { vol: "bofm", slug: "4-ne" },
    "mormon": { vol: "bofm", slug: "morm" },
    "ether": { vol: "bofm", slug: "ether" },
    "moroni": { vol: "bofm", slug: "moro" },
    "doctrine and covenants": { vol: "dc-testament", slug: "dc" },
    "d&c": { vol: "dc-testament", slug: "dc" },
    "moses": { vol: "pgp", slug: "moses" },
    "abraham": { vol: "pgp", slug: "abr" },
    "joseph smith-matthew": { vol: "pgp", slug: "js-m" },
    "joseph smith-history": { vol: "pgp", slug: "js-h" },
    "articles of faith": { vol: "pgp", slug: "a-of-f" }
  };

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseRef(ref) {
    var s = String(ref == null ? "" : ref)
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
    var m;
    var book;
    var found;
    if (!s) {
      return null;
    }
    m = s.match(/^((?:[1-4] )?[A-Za-z][A-Za-z&' -]*?)\s+(\d+)(?:-(\d+))?(?::(\d+)(?:-(\d+))?)?$/);
    if (!m) {
      return null;
    }
    book = m[1].replace(/\u2014/g, "-").replace(/\s+/g, " ").trim().toLowerCase();
    found = BOOKS[book];
    if (!found) {
      return null;
    }
    return {
      vol: found.vol,
      slug: found.slug,
      chapter: m[2],
      verse: m[4] || "",
      verseEnd: m[5] || ""
    };
  }

  function gospelLibraryUrl(ref) {
    var p = parseRef(ref);
    var url;
    if (!p) {
      return "";
    }
    url = "https://www.churchofjesuschrist.org/study/scriptures/" +
      p.vol + "/" + p.slug + "/" + p.chapter + "?lang=eng";
    if (p.verse) {
      url += "&id=p" + p.verse;
      if (p.verseEnd && p.verseEnd !== p.verse) {
        url += "-p" + p.verseEnd;
      }
      url += "#p" + p.verse;
    }
    return url;
  }

  function isSafeGospelUrl(url) {
    return typeof url === "string" &&
      url.indexOf("https://www.churchofjesuschrist.org/study/scriptures/") === 0;
  }

  function gospelLinkHtml(ref) {
    var url = gospelLibraryUrl(ref);
    var label = escapeHtml(ref);
    if (!isSafeGospelUrl(url)) {
      return label;
    }
    return '<a class="sg-gospel-link" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' +
      label +
      "</a>";
  }

  g.ScriptureGames = g.ScriptureGames || {};
  g.ScriptureGames.gospelLibraryUrl = gospelLibraryUrl;
  g.ScriptureGames.gospelLinkHtml = gospelLinkHtml;
})(window);
