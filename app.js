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

  /* ---------- Scroll-spy nav highlighting ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main > section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.dataset.section === id);
    });
  }

  var spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach(function (section) { spyObserver.observe(section); });

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

  var aboutCarousel = initCarousel(document.getElementById("aboutCarousel"), document.getElementById("aboutDots"));
  var historyCarousel = initCarousel(document.getElementById("historyCarousel"), document.getElementById("historyDots"));

  document.querySelectorAll(".carousel-arrow").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.dataset.carousel === "about" ? aboutCarousel : historyCarousel;
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
