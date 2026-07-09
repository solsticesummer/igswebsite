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

  function showSectionFromHash() {
    showSection((location.hash || "").replace("#", "") || "home");
  }

  showSectionFromHash();

  // Keep the page in sync with the URL: browser back/forward moves through the
  // pushState hash entries without reloading, and only this event tells us
  window.addEventListener("hashchange", showSectionFromHash);

  // Defeat the browser's native hash-anchor scroll so sections always open at the top
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("load", function () {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });

  /* ---------- History panels (nav dropdown + page flow) ---------- */
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

  /* ---------- Generic carousel ---------- */
  // Like a nav click: switch section, run any panel/slide setup, record the hash
  function jumpTo(sectionId, setup) {
    showSection(sectionId);
    if (setup) setup();
    history.pushState(null, "", "#" + sectionId);
  }

  // onBeforeFirst / onAfterLast chain the carousel into the neighbouring
  // section instead of dead-ending on a disabled arrow
  function initCarousel(root, opts) {
    opts = opts || {};
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel-slide"));
    var prevBtn = root.querySelector(".carousel-arrow-prev");
    var nextBtn = root.querySelector(".carousel-arrow-next");
    var counter = root.querySelector(".carousel-count");
    var current = 0;

    function goTo(index) {
      if (index < 0) {
        if (opts.onBeforeFirst) opts.onBeforeFirst();
        return;
      }
      if (index > slides.length - 1) {
        if (opts.onAfterLast) opts.onAfterLast();
        return;
      }
      slides[current].classList.remove("is-active");
      current = index;
      slides[current].classList.add("is-active");
      if (prevBtn) prevBtn.disabled = current === 0 && !opts.onBeforeFirst;
      if (nextBtn) nextBtn.disabled = current === slides.length - 1 && !opts.onAfterLast;
      if (counter) counter.textContent = (current + 1) + " / " + slides.length;
    }

    goTo(0);
    return {
      next: function () { goTo(current + 1); },
      prev: function () { goTo(current - 1); },
      goTo: goTo,
      count: slides.length
    };
  }

  // Swiping past either end runs the same chain as the arrows
  function attachSwipe(el, controls) {
    var startX = 0, startY = 0, tracking = false;

    el.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;
      tracking = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    el.addEventListener("touchend", function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) controls.next(); else controls.prev();
    }, { passive: true });
  }

  /* ---------- The global page flow ----------
     home → about(3) → plan(2) → history·盛况(8) → history·嘉宾 → contact */
  var carousels = {};

  carousels.about = initCarousel(document.getElementById("aboutCarousel"), {
    onBeforeFirst: function () { jumpTo("home"); },
    onAfterLast: function () {
      jumpTo("plan", function () { carousels.plan.goTo(0); });
    }
  });

  carousels.plan = initCarousel(document.getElementById("planCarousel"), {
    onBeforeFirst: function () {
      jumpTo("about", function () { carousels.about.goTo(carousels.about.count - 1); });
    },
    onAfterLast: function () {
      jumpTo("history", function () {
        activateHistoryPanel("highlights");
        carousels.history.goTo(0);
      });
    }
  });

  carousels.history = initCarousel(document.getElementById("historyCarousel"), {
    onBeforeFirst: function () {
      jumpTo("plan", function () { carousels.plan.goTo(carousels.plan.count - 1); });
    },
    onAfterLast: function () {
      jumpTo("history", function () { activateHistoryPanel("guests"); });
    }
  });

  document.querySelectorAll(".carousel-arrow[data-carousel]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = carousels[btn.dataset.carousel];
      if (btn.dataset.dir === "1") target.next(); else target.prev();
    });
  });

  Object.keys(carousels).forEach(function (key) {
    var root = document.querySelector('[data-carousel="' + key + '"]');
    attachSwipe(root.closest(".carousel"), carousels[key]);
  });

  /* ---------- Flow arrows on carousel-less pages (嘉宾回顾 / 联系我们) ---------- */
  var flowStops = {
    "history-highlights-last": function () {
      jumpTo("history", function () {
        activateHistoryPanel("highlights");
        carousels.history.goTo(carousels.history.count - 1);
      });
    },
    "history-guests": function () {
      jumpTo("history", function () { activateHistoryPanel("guests"); });
    },
    "contact": function () { jumpTo("contact"); }
  };

  document.querySelectorAll("[data-flow]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      flowStops[btn.dataset.flow]();
    });
  });
})();
