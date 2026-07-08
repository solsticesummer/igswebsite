(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mainNav.querySelectorAll(".nav-link").forEach(function (link) {
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
    setActiveNav(target);
    window.scrollTo(0, 0);
  }

  document.querySelectorAll("[data-section]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showSection(link.dataset.section);
      history.pushState(null, "", "#" + link.dataset.section);
    });
  });

  showSection((location.hash || "").replace("#", "") || "home");

  /* ---------- Generic carousel ---------- */
  function initCarousel(root, dotsContainer) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel-slide"));
    var current = 0;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "第 " + (i + 1) + " 张");
      dot.addEventListener("click", function () { goTo(i); });
      dotsContainer.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsContainer.children);

    function goTo(index) {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
    }

    return { next: function () { goTo(current + 1); }, prev: function () { goTo(current - 1); } };
  }

  var carousels = {
    about: initCarousel(document.getElementById("aboutCarousel"), document.getElementById("aboutDots")),
    plan: initCarousel(document.getElementById("planCarousel"), document.getElementById("planDots")),
    history: initCarousel(document.getElementById("historyCarousel"), document.getElementById("historyDots"))
  };

  document.querySelectorAll(".carousel-arrow").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = carousels[btn.dataset.carousel];
      if (btn.dataset.dir === "1") target.next(); else target.prev();
    });
  });

  /* ---------- History tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll("#historyTabs .tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      panels.forEach(function (p) { p.classList.remove("is-active"); });
      tab.classList.add("is-active");
      document.querySelector('.tab-panel[data-tab-panel="' + tab.dataset.tab + '"]').classList.add("is-active");
    });
  });
})();
