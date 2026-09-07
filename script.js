/* =========================================================================
   Deep H. Makadiya — academic site
   Mobile sidebar toggle, in-page section tabs, and the sidebar colour
   picker. This one script is shared by every page.
   You do NOT need to understand or edit this file to update your content —
   all your text lives in the .html files. This file only makes the sidebar
   menu button work on narrow screens/phones.
   ========================================================================= */
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
});
