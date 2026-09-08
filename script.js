/* =========================================================================
   Deep H. Makadiya — academic site
   Mobile sidebar toggle, in-page section tabs, and the sidebar colour
   picker. This one script is shared by every page.
   You do NOT need to understand or edit this file to update your content —
   all your text lives in the .html files. This file only makes the sidebar
   menu button work on narrow screens/phones.
   ========================================================================= */
/* -------------------------------------------------------------------------
   THE ONE LINE TO CHANGE WHEN YOU UPDATE THE SITE
   Whatever you type between the quotes below is shown as "Last updated: ..."
   in the footer of EVERY page. Change it here and all seven pages follow.
   ------------------------------------------------------------------------- */
var LAST_UPDATED = "September 2026";

document.addEventListener("DOMContentLoaded", function () {
  var sidebar = document.getElementById("sidebar");
  var toggle = document.getElementById("menuToggle");
  var overlay = document.getElementById("overlay");

  function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
    document.body.classList.add("menu-open");   // stops the page behind scrolling
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("menu-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  // Escape closes the slide-in menu, as people expect it to.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // The button opens the menu and, while it is open, closes it again.
  if (toggle) toggle.addEventListener("click", function () {
    if (sidebar.classList.contains("open")) { closeMenu(); } else { openMenu(); }
  });
  if (overlay) overlay.addEventListener("click", closeMenu);

  // Close the menu automatically if someone taps a page link inside it.
  if (sidebar) {
    var links = sidebar.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", closeMenu);
    }
  }

  // -----------------------------------------------------------------------
  // In-page section tabs: single scrollable line, with fade hints and
  // arrow buttons that appear only when there are more tabs than fit.
  // Runs automatically for every ".page-tabs-wrap" found on the page — you
  // never need to edit this when you add or rename a tab in the HTML.
  // -----------------------------------------------------------------------
  var tabWraps = document.querySelectorAll(".page-tabs-wrap");
  tabWraps.forEach(function (wrap) {
    var tabs = wrap.querySelector(".page-tabs");
    var leftArrow = wrap.querySelector(".tabs-arrow.left");
    var rightArrow = wrap.querySelector(".tabs-arrow.right");
    var leftFade = wrap.querySelector(".tabs-fade.left");
    var rightFade = wrap.querySelector(".tabs-fade.right");
    if (!tabs) return;

    function update() {
      var hasOverflow = tabs.scrollWidth > tabs.clientWidth + 1;
      var atStart = tabs.scrollLeft <= 0;
      var atEnd = tabs.scrollLeft + tabs.clientWidth >= tabs.scrollWidth - 1;

      if (leftArrow) leftArrow.hidden = !hasOverflow || atStart;
      if (rightArrow) rightArrow.hidden = !hasOverflow || atEnd;
      if (leftFade) leftFade.hidden = !hasOverflow || atStart;
      if (rightFade) rightFade.hidden = !hasOverflow || atEnd;
    }

    if (leftArrow) leftArrow.addEventListener("click", function () {
      tabs.scrollBy({ left: -160, behavior: "smooth" });
    });
    if (rightArrow) rightArrow.addEventListener("click", function () {
      tabs.scrollBy({ left: 160, behavior: "smooth" });
    });

    tabs.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    update();
  });

  // -----------------------------------------------------------------------
  // COLOUR PICKER (the two-tone circles at the bottom of the sidebar).
  // Clicking one sets data-theme="..." on the <html> element — every colour
  // on the site is a CSS variable, and styles.css re-states those variables
  // for each scheme, so the whole page recolours at once. The choice is
  // saved in the browser and re-applied by the small script in each page's
  // <head> on the next page or visit.
  // You never need to edit this: it works with whatever circles it finds in
  // the sidebar, so adding or removing a scheme is purely an HTML + CSS job.
  // -----------------------------------------------------------------------
  var STORE_KEY = "site-theme";
  var swatches = document.querySelectorAll("[data-set-theme]");

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "cream";
  }
  function markActive() {
    var now = currentTheme();
    for (var i = 0; i < swatches.length; i++) {
      var on = swatches[i].getAttribute("data-set-theme") === now;
      swatches[i].classList.toggle("active", on);
      swatches[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
  }
  for (var s = 0; s < swatches.length; s++) {
    swatches[s].addEventListener("click", function () {
      var picked = this.getAttribute("data-set-theme");
      document.documentElement.setAttribute("data-theme", picked);
      try { localStorage.setItem(STORE_KEY, picked); } catch (e) {}
      markActive();
    });
  }
  markActive();

  // -----------------------------------------------------------------------
  // "LAST UPDATED" — the date lives only in LAST_UPDATED at the top of this
  // file, and is written into the footer of every page from here. The footer
  // line starts out hidden and is revealed once a date has been put in it,
  // so a page never shows an empty or stale "Last updated:".
  // -----------------------------------------------------------------------
  var stamp = document.getElementById("lastUpdated");
  var stampLine = document.getElementById("lastUpdatedLine");
  if (stamp && stampLine && LAST_UPDATED) {
    stamp.textContent = LAST_UPDATED;
    stampLine.hidden = false;
  }

  // -----------------------------------------------------------------------
  // ABSTRACTS — each "Abstract" button in the publication list opens the
  // panel whose id matches the button's aria-controls attribute. Works with
  // however many buttons the page has; nothing here needs editing when you
  // add a paper.
  // -----------------------------------------------------------------------
  var absButtons = document.querySelectorAll(".pub-toggle");
  for (var a = 0; a < absButtons.length; a++) {
    absButtons[a].addEventListener("click", function () {
      var panel = document.getElementById(this.getAttribute("aria-controls"));
      if (!panel) return;
      var isOpen = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", isOpen ? "false" : "true");
      panel.hidden = isOpen;

      // The maths inside an abstract is laid out the first time the panel is
      // actually shown — measuring it while hidden can come out wrong.
      if (!isOpen && !panel.dataset.typeset &&
          window.MathJax && window.MathJax.typesetPromise) {
        panel.dataset.typeset = "1";
        window.MathJax.typesetPromise([panel]);
      }
    });
  }

  // -----------------------------------------------------------------------
  // COLLAPSIBLE GROUPS — the <details> blocks open and close on their own;
  // this only re-lays-out any mathematical notation inside one the first
  // time it is actually shown, since measuring maths while it is hidden can
  // come out wrong. Nothing here needs editing when you add a group.
  // -----------------------------------------------------------------------
  var groups = document.querySelectorAll("details");
  for (var g = 0; g < groups.length; g++) {
    groups[g].addEventListener("toggle", function () {
      if (!this.open || this.dataset.typeset) return;
      if (window.MathJax && window.MathJax.typesetPromise) {
        this.dataset.typeset = "1";
        window.MathJax.typesetPromise([this]);
      }
    });
  }

  // -----------------------------------------------------------------------
  // SECTION HIGHLIGHTING ("scrollspy")
  // As you scroll an inner page, the tab for the section you are currently
  // reading is marked with the "current" class (styled in styles.css). The
  // section a tab points at is found from its own href — so adding, renaming
  // or re-ordering tabs needs no change here. On narrow screens, where the
  // tab row scrolls sideways, the highlighted tab is nudged into view.
  // -----------------------------------------------------------------------
  tabWraps.forEach(function (wrap) {
    var tabs = wrap.querySelector(".page-tabs");
    if (!tabs) return;

    var links = [];
    var anchors = tabs.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      var target = document.getElementById(anchors[i].getAttribute("href").slice(1));
      if (target) links.push({ link: anchors[i], target: target });
    }
    if (links.length === 0) return;

    var active = null;

    function setCurrent(entry) {
      if (entry === active) return;
      if (active) active.link.classList.remove("current");
      active = entry;
      if (!active) return;
      active.link.classList.add("current");

      // Keep the highlighted tab visible when the row is scrollable.
      if (tabs.scrollWidth > tabs.clientWidth + 1) {
        var t = active.link;
        var left = t.offsetLeft - tabs.offsetLeft;
        var right = left + t.offsetWidth;
        if (left < tabs.scrollLeft + 8) {
          tabs.scrollTo({ left: Math.max(0, left - 16), behavior: "smooth" });
        } else if (right > tabs.scrollLeft + tabs.clientWidth - 8) {
          tabs.scrollTo({ left: right - tabs.clientWidth + 16, behavior: "smooth" });
        }
      }
    }

    function spy() {
      // Where a heading comes to rest when you click its tab — that is its
      // CSS "scroll-margin-top", which already clears the frozen tab bar.
      // Measuring from the same line means a tab lights up the instant you
      // click it, instead of staying one section behind.
      var landing = parseFloat(getComputedStyle(links[0].target).scrollMarginTop);
      if (!landing || isNaN(landing)) landing = wrap.getBoundingClientRect().bottom + 12;
      var line = landing + 6;
      var found = null;
      for (var i = 0; i < links.length; i++) {
        if (links[i].target.getBoundingClientRect().top <= line) found = links[i];
      }
      // Above the first heading nothing is marked at all — the highlight
      // only appears once you have actually scrolled into a section. At the
      // very bottom of the page, always mark the last one.
      var atBottom = (window.innerHeight + window.pageYOffset) >=
                     (document.documentElement.scrollHeight - 2);
      if (atBottom) found = links[links.length - 1];
      setCurrent(found);
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { spy(); ticking = false; });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    spy();
  });
});
