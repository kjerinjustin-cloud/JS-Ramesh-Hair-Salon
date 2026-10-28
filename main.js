/* ============================================================
   J S RAMESH HAIR SALON — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Header / floating buttons ---------- */
  const header = document.getElementById("header");
  const toTop = document.getElementById("toTop");
  const fab = document.querySelector(".fab");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    toTop.classList.toggle("is-visible", y > 600);
    fab.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  const closeNav = () => {
    burger.classList.remove("is-open");
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });

  /* ---------- Scroll spy ---------- */
  const sections = [...document.querySelectorAll("section[id]")];
  const navLinks = [...document.querySelectorAll(".nav__link")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) =>
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id)
      );
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = (i * 70) + "ms";
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- PRICE / NUMBER COUNT-UP ANIMATION ---------- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCount = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = "1";

    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    el.classList.add("is-counting");

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = target * easeOut(progress);
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
        setTimeout(() => el.classList.remove("is-counting"), 500);
      }
    };
    requestAnimationFrame(tick);
  };

  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      // stagger counters inside the same row/grid
      const siblings = [...(entry.target.parentElement?.querySelectorAll(".count") || [])];
      const idx = Math.max(0, siblings.indexOf(entry.target));
      setTimeout(() => animateCount(entry.target), idx * 120);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".count").forEach((el) => countObserver.observe(el));

  /* ---------- Testimonials slider ---------- */
  const track = document.getElementById("testimonialsTrack");
  const dots = [...document.querySelectorAll(".dot")];
  let current = 0;
  let autoTimer;

  const goTo = (index) => {
    current = (index + dots.length) % dots.length;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
  };

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  };

  dots.forEach((dot) =>
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.index));
      startAuto();
    })
  );
  startAuto();

  /* ---------- Booking form ---------- */
  const form = document.getElementById("bookingForm");
  const success = document.getElementById("formSuccess");
  const successName = document.getElementById("successName");
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;

  const setError = (input, message) => {
    const field = input.closest(".field");
    field.classList.add("has-error");
    field.querySelector(".field__error").textContent = message;
  };
  const clearError = (input) => {
    const field = input.closest(".field");
    field.classList.remove("has-error");
    field.querySelector(".field__error").textContent = "";
  };

  form.querySelectorAll("[required]").forEach((input) =>
    input.addEventListener("input", () => clearError(input))
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll("[required]").forEach((input) => {
      clearError(input);
      if (!input.value.trim()) {
        setError(input, "This field is required.");
        valid = false;
      }
    });

    const phone = document.getElementById("phone");
    if (phone.value.trim() && phone.value.replace(/\D/g, "").length < 10) {
      setError(phone, "Enter a valid 10-digit number.");
      valid = false;
    }

    if (!valid) {
      form.querySelector(".has-error input, .has-error select")?.focus();
      return;
    }

    successName.textContent = document.getElementById("name").value.trim().split(" ")[0];
    success.hidden = false;
    form.querySelector('button[type="submit"]').textContent = "Request Sent ✓";
    form.reset();
    dateInput.min = today;

    setTimeout(() => {
      success.hidden = true;
      form.querySelector('button[type="submit"]').textContent = "Confirm Booking";
    }, 6000);
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
