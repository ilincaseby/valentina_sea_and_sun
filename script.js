/* =========================================================
   Valentina Sea & Sun — script.js
   =========================================================
   ⚙️  EDITEAZĂ DATELE DE CONTACT AICI ↓↓↓
   - phone:    numărul afișat (cum vrei să apară)
   - phoneTel: același număr, doar cifre + prefix (pentru apel)
   - whatsapp: numărul de WhatsApp, doar cifre cu prefix de țară (fără + sau spații)
   - email:    adresa de e-mail
   ========================================================= */
const CONFIG = {
  phone:    "+40 764 496 240",
  phoneTel: "+40764496240",
  whatsapp: "40764496240",
  email:    "valystyle1601@yahoo.com"
};

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Contact details ---------- */
  function applyContact() {
    const phone = $("#contactPhone");
    if (phone) { phone.textContent = CONFIG.phone; phone.href = "tel:" + CONFIG.phoneTel.replace(/\s+/g, ""); }
    const wa = $("#contactWhatsApp");
    if (wa) wa.href = "https://wa.me/" + CONFIG.whatsapp;
    const mail = $("#contactEmail");
    if (mail) { mail.textContent = CONFIG.email; mail.href = "mailto:" + CONFIG.email; }
  }

  /* ---------- Loader ---------- */
  function hideLoader() {
    const loader = $("#loader");
    if (!loader) return;
    loader.classList.add("is-done");
    document.body.classList.add("is-ready");
    setTimeout(() => loader.remove(), 800);
  }

  /* ---------- Header / progress / back-to-top ---------- */
  const header = $("#header");
  const progress = $("#progress");
  const toTop = $("#toTop");
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    const toggle = $("#navToggle");
    const nav = $("#nav");
    if (!toggle || !nav) return;
    const close = () => { nav.classList.remove("is-open"); toggle.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav__link", nav).forEach(l => l.addEventListener("click", close));
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  /* ---------- Active nav link ---------- */
  function initScrollSpy() {
    const links = $$(".nav__link");
    const map = new Map();
    links.forEach(l => { const id = l.getAttribute("href"); if (id && id.startsWith("#")) { const sec = $(id); if (sec) map.set(sec, l); } });
    if (!map.size) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(l => l.classList.remove("is-current"));
          const l = map.get(en.target); if (l) l.classList.add("is-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, sec) => obs.observe(sec));
  }

  /* ---------- Hero split-letter title ---------- */
  function splitTitle() {
    if (reduceMotion) return;
    $$("[data-split]").forEach((el, li) => {
      const text = el.textContent;
      el.textContent = "";
      [...text].forEach((ch, i) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch === " " ? "\u00A0" : ch;
        span.style.animationDelay = (0.25 + li * 0.35 + i * 0.045) + "s";
        el.appendChild(span);
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (reduceMotion) { items.forEach(i => i.classList.add("is-in")); return; }
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const sibs = $$("[data-reveal]", en.target.parentElement).filter(s => s.parentElement === en.target.parentElement);
          const idx = sibs.indexOf(en.target);
          en.target.style.transitionDelay = Math.max(0, idx) * 0.08 + "s";
          en.target.classList.add("is-in");
          o.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(i => obs.observe(i));
  }

  /* ---------- Stat counters ---------- */
  function initCounters() {
    const nums = $$("[data-count]");
    if (!nums.length) return;
    const run = el => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      const dur = 1100; const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(en => { if (en.isIntersecting) { run(en.target); o.unobserve(en.target); } });
    }, { threshold: 0.6 });
    nums.forEach(n => obs.observe(n));
  }

  /* ---------- Hero parallax ---------- */
  function initParallax() {
    if (reduceMotion) return;
    const img = $("#heroImg");
    const sun = $(".hero__sun");
    if (!img) return;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        img.style.transform = `translateY(${y * 0.18}px) scale(1.12)`;
        if (sun) sun.style.transform = `translateY(${y * 0.32}px)`;
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  }

  /* ---------- Cursor glow ---------- */
  function initCursor() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const glow = $(".cursor-glow");
    if (!glow) return;
    let x = 0, y = 0, gx = 0, gy = 0, active = false;
    window.addEventListener("mousemove", e => {
      x = e.clientX; y = e.clientY;
      if (!active) { active = true; glow.classList.add("is-active"); }
    });
    const interactive = "a, button, .tile, .feature, .stat, input, select, textarea";
    document.addEventListener("mouseover", e => { if (e.target.closest(interactive)) glow.classList.add("is-big"); });
    document.addEventListener("mouseout",  e => { if (e.target.closest(interactive)) glow.classList.remove("is-big"); });
    const loop = () => { gx += (x - gx) * 0.18; gy += (y - gy) * 0.18; glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`; requestAnimationFrame(loop); };
    loop();
  }

  /* ---------- Button shine follows cursor ---------- */
  function initBtnShine() {
    $$(".btn").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", (e.clientX - r.left) + "px");
        btn.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Gallery filter ---------- */
  function initFilters() {
    const chips = $$(".chip");
    const tiles = $$(".tile");
    chips.forEach(chip => chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const f = chip.dataset.filter;
      tiles.forEach(t => t.classList.toggle("is-hidden", !(f === "all" || t.dataset.cat === f)));
    }));
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    const lb = $("#lightbox");
    const lbImg = $("#lbImg");
    const lbCap = $("#lbCap");
    if (!lb || !lbImg) return;
    const tiles = $$(".tile");
    let index = 0;
    const visible = () => tiles.filter(t => !t.classList.contains("is-hidden"));

    const show = i => {
      const list = visible();
      if (!list.length) return;
      index = (i + list.length) % list.length;
      const img = $("img", list[index]);
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.dataset.caption || img.alt || "";
    };
    const open = tile => {
      const list = visible();
      index = list.indexOf(tile);
      show(index);
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    tiles.forEach(t => t.addEventListener("click", () => open(t)));
    $("#lbClose").addEventListener("click", close);
    $("#lbPrev").addEventListener("click", () => show(index - 1));
    $("#lbNext").addEventListener("click", () => show(index + 1));
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });

    // swipe on touch
    let sx = 0;
    lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------- Video tour ---------- */
  function initVideo() {
    const video = $("#tourVideo");
    const btn = $("#playBtn");
    if (!video || !btn) return;
    btn.addEventListener("click", () => { video.play(); btn.classList.add("is-hidden"); });
    video.addEventListener("play",  () => btn.classList.add("is-hidden"));
    video.addEventListener("pause", () => btn.classList.remove("is-hidden"));
  }

  /* ---------- Booking form -> WhatsApp ---------- */
  function initBooking() {
    const form = $("#bookingForm");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const required = ["#bName", "#bIn", "#bOut"];
      let ok = true;
      required.forEach(sel => {
        const el = $(sel);
        const empty = !el.value.trim();
        el.classList.toggle("invalid", empty);
        if (empty) ok = false;
      });
      if (!ok) { $(required.find(s => $(s).classList.contains("invalid"))).focus(); return; }

      const name = $("#bName").value.trim();
      const cin = $("#bIn").value;
      const cout = $("#bOut").value;
      const guests = $("#bGuests").value;
      const phone = $("#bPhone").value.trim();
      const msg = $("#bMsg").value.trim();

      let text = `Bună! Aș dori să rezerv apartamentul *Valentina Sea & Sun* (Mamaia Nord).%0A`;
      text += `%0A👤 Nume: ${enc(name)}`;
      text += `%0A📅 Check-in: ${enc(cin)}`;
      text += `%0A📅 Check-out: ${enc(cout)}`;
      text += `%0A👥 Persoane: ${enc(guests)}`;
      if (phone) text += `%0A📞 Telefon: ${enc(phone)}`;
      if (msg)   text += `%0A📝 Mesaj: ${enc(msg)}`;

      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${text}`, "_blank", "noopener");
    });
    // clear invalid on input
    $$("#bookingForm input, #bookingForm select").forEach(el =>
      el.addEventListener("input", () => el.classList.remove("invalid")));
  }
  const enc = s => encodeURIComponent(s).replace(/%20/g, " ");

  /* ---------- Year ---------- */
  function initYear() { const y = $("#year"); if (y) y.textContent = "© " + new Date().getFullYear(); }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyContact();
    splitTitle();
    initNav();
    initScrollSpy();
    initReveal();
    initCounters();
    initParallax();
    initCursor();
    initBtnShine();
    initFilters();
    initLightbox();
    initVideo();
    initBooking();
    initYear();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  });

  window.addEventListener("load", () => setTimeout(hideLoader, 500));
  // safety: never let the loader trap the page
  setTimeout(hideLoader, 3500);
})();
