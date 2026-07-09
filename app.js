(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Page-view section switching ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main > section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.dataset.section === id);
    });
  }

  function showSection(id) {
    var target = document.getElementById(id) ? id : "home";
    sections.forEach(function (section) {
      section.classList.toggle("is-active", section.id === target);
    });
    document.body.classList.toggle("on-home", target === "home");
    setActiveNav(target);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  document.querySelectorAll("[data-section]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showSection(link.dataset.section);
      history.pushState(null, "", "#" + link.dataset.section);
    });
  });

  showSection((location.hash || "").replace("#", "") || "home");

  // Defeat the browser's native hash-anchor scroll so sections always open at the top
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("load", function () {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });

  /* ---------- Generic carousel ---------- */
  function initCarousel(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel-slide"));
    var prevBtn = root.querySelector(".carousel-arrow-prev");
    var nextBtn = root.querySelector(".carousel-arrow-next");
    var current = 0;

    function goTo(index) {
      slides[current].classList.remove("is-active");
      current = Math.max(0, Math.min(index, slides.length - 1));
      slides[current].classList.add("is-active");
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === slides.length - 1;
    }

    goTo(0);
    return { next: function () { goTo(current + 1); }, prev: function () { goTo(current - 1); } };
  }

  var carousels = {
    about: initCarousel(document.getElementById("aboutCarousel")),
    plan: initCarousel(document.getElementById("planCarousel")),
    history: initCarousel(document.getElementById("historyCarousel"))
  };

  document.querySelectorAll(".carousel-arrow").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = carousels[btn.dataset.carousel];
      if (btn.dataset.dir === "1") target.next(); else target.prev();
    });
  });

  /* ---------- History panels (nav dropdown) ---------- */
  var panels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));

  function activateHistoryPanel(name) {
    panels.forEach(function (p) {
      p.classList.toggle("is-active", p.dataset.tabPanel === name);
    });
  }

  document.querySelectorAll("[data-history-tab]").forEach(function (link) {
    link.addEventListener("click", function () {
      activateHistoryPanel(link.dataset.historyTab);
    });
  });
})();
