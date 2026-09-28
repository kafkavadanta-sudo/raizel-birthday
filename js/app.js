/* App logic. All text/photos/links live in js/content.js — you shouldn't
   need to edit this file to change content. */
(function () {
  "use strict";

  var S = window.SITE;
  var html = document.documentElement;
  var body = document.body;

  /* ---------------- helpers ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    },
  };
  var themeMeta = $('meta[name="theme-color"]');
  function setBg(color) {
    body.style.backgroundColor = color || "";
    if (themeMeta) themeMeta.setAttribute("content", color || "#FFFAD3");
  }

  /* ---------------- particle burst ---------------- */
  var EMOJI = ["❤️", "💖", "💕", "💗", "🌸", "✨"];
  var CONFETTI = ["#FFB1B1", "#FFDBB0", "#FFCCB8", "#FF8FA3", "#FFD66B", "#FFFFFF"];
  function burst(x, y, opts) {
    opts = opts || {};
    var box = el("div", "burst");
    box.style.left = x + "px";
    box.style.top = y + "px";
    var count = opts.count || 26, spread = opts.spread || 1;
    for (var i = 0; i < count; i++) {
      var p = opts.confetti && i % 2 ? el("i") : el("span", null, EMOJI[i % EMOJI.length]);
      var ang = rand(0, Math.PI * 2), dist = rand(70, 180) * spread;
      p.style.setProperty("--x", Math.cos(ang) * dist + "px");
      p.style.setProperty("--y", Math.sin(ang) * dist - 50 + "px");
      p.style.setProperty("--r", rand(-200, 200) + "deg");
      p.style.setProperty("--s", rand(14, 26) + "px");
      p.style.setProperty("--d", rand(0.9, 1.5) + "s");
      p.style.setProperty("--c", CONFETTI[i % CONFETTI.length]);
      p.style.animationDelay = rand(0, 0.12) + "s";
      box.appendChild(p);
    }
    body.appendChild(box);
    setTimeout(function () { box.remove(); }, 1900);
  }

  /* ---------------- sound toggle ---------------- */
  var soundBtn = $("#soundToggle");
  Ambient.onChange(function (on) {
    soundBtn.setAttribute("aria-pressed", String(on));
    soundBtn.setAttribute("aria-label", on ? "Mute music" : "Play music");
  });
  soundBtn.addEventListener("click", function () { Ambient.toggle(); });

  /* =====================================================================
     PART 1 — THE JOURNEY
     ===================================================================== */
  var J = S.journey;
  var journeyEl = $("#journey");
  var stage = $("#stage");
  var dash = $("#dashboard");
  var jState = store.get("rb.journey", { step: 0, done: false });
  var current = -1;
  var busy = false; // true while a screen is transitioning → taps are ignored

  function saveStep(n) {
    jState.step = n;
    if (J[n].type === "finale") jState.done = true;
    store.set("rb.journey", jState);
  }

  // Only ever moves forward by exactly one screen, and only from the screen
  // that asked for it — so double taps / fast taps can't skip anything.
  function next(from) {
    if (busy || from !== current || current >= J.length - 1) return;
    show(current + 1);
  }

  function show(n) {
    var page = J[n];
    var old = stage.querySelector(".screen.in");
    var slow = page.type === "auto" || page.type === "finale" || (J[n - 1] && J[n - 1].type === "auto");
    var scr = buildScreen(page, n);
    if (slow) scr.classList.add("slow");

    busy = true;
    current = n;
    saveStep(n);
    setBg(page.bg);
    if (page.volume != null) Ambient.setLevel(page.volume, 2.5);

    if (old) {
      old.classList.remove("in");
      old.classList.add("out");
      setTimeout(function () { old.remove(); }, 1300);
    }
    stage.appendChild(scr);
    var delay = old ? (slow ? 750 : 300) : 60;
    setTimeout(function () { scr.classList.add("in"); }, delay);
    setTimeout(function () {
      busy = false;
      onEnter(page, scr, n);
    }, delay + (slow ? 1100 : 550));
  }

  function onEnter(page, scr, n) {
    if (page.type === "auto") {
      setTimeout(function () { next(n); }, page.holdMs || 4000);
    } else if (page.type === "finale") {
      var cx = innerWidth / 2, cy = innerHeight / 2;
      burst(cx, cy, { confetti: true, count: 40, spread: 1.4 });
      setTimeout(function () { burst(cx * 0.6, cy * 0.8, { confetti: true, count: 24 }); }, 450);
      setTimeout(function () { burst(cx * 1.4, cy * 0.9, { confetti: true, count: 24 }); }, 800);
      setTimeout(finishJourney, page.holdMs || 3600);
    }
  }

  function buildScreen(page, n) {
    var scr = el("section", "screen screen--" + page.type);
    scr.appendChild(el("p", "screen-text", page.text));
    if (page.type === "choice" || page.type === "button") {
      scr.appendChild(buildButtons(page.buttons || [page.button], n));
    } else if (page.type === "scrabble") {
      scr.appendChild(buildScrabble(page, n));
    } else if (page.type === "slider") {
      scr.appendChild(buildSlider(page, n));
    }
    return scr;
  }

  function buildButtons(labels, n) {
    var wrap = el("div", "screen-actions");
    labels.forEach(function (label, i) {
      var b = el("button", "btn" + (labels.length > 1 && i < labels.length - 1 ? " btn-soft" : ""), label);
      b.type = "button";
      b.addEventListener("click", function () {
        if (busy || current !== n) return;
        if (n === 0) Ambient.autoStart(); // first tap → music (Safari needs a tap)
        wrap.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
        next(n);
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  /* ---------- Scrabble tiles ---------- */
  var TILE_POINTS = { A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10 };

  function buildScrabble(page, n) {
    var word = page.word.toUpperCase();
    var wrap = el("div", "scrabble");
    var slotsEl = el("div", "slots");
    var tray = el("div", "tray");
    var hint = el("p", "hint", "Drag the tiles into the boxes ✨");
    var slots = [];
    var placed = 0, solved = false;

    word.split("").forEach(function (_, i) {
      var s = el("div", "slot");
      s.dataset.i = i;
      s.setAttribute("aria-label", "Letter slot " + (i + 1));
      slots.push(s);
      slotsEl.appendChild(s);
    });

    var order = word.split("");
    if (order.length > 1) {
      do { order = shuffle(order); } while (order.join("") === word);
    }
    order.forEach(function (ch) { tray.appendChild(makeTile(ch)); });
    wrap.append(slotsEl, tray, hint);

    function makeTile(ch) {
      var t = el("div", "tile");
      t.dataset.letter = ch;
      t.setAttribute("role", "button");
      t.setAttribute("aria-label", "Tile " + ch);
      var face = el("div", "tile-face", ch);
      face.appendChild(el("small", null, TILE_POINTS[ch] || ""));
      t.appendChild(face);
      t.addEventListener("pointerdown", function (e) { startDrag(t, e); });
      return t;
    }

    function emptySlots() { return slots.filter(function (s) { return !s.firstChild; }); }

    // Nearest empty slot to the tile's centre, if close enough
    function slotUnder(t) {
      var r = t.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var best = null, bestD = Infinity;
      emptySlots().forEach(function (s) {
        var sr = s.getBoundingClientRect();
        var d = Math.hypot(cx - (sr.left + sr.width / 2), cy - (sr.top + sr.height / 2));
        if (d < sr.width * 0.85 && d < bestD) { best = s; bestD = d; }
      });
      return best;
    }

    function startDrag(t, e) {
      if (solved || busy || current !== n || t.classList.contains("placed")) return;
      if (e.button != null && e.button > 0) return;
      e.preventDefault();
      try { t.setPointerCapture(e.pointerId); } catch (err) {}
      var sx = e.clientX, sy = e.clientY, moved = false, hover = null;
      t.classList.add("dragging");

      function move(ev) {
        var dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.hypot(dx, dy) > 6) moved = true;
        t.style.transform = "translate(" + dx + "px," + dy + "px)";
        var s = moved ? slotUnder(t) : null;
        if (s !== hover) {
          if (hover) hover.classList.remove("hover");
          hover = s;
          if (s) s.classList.add("hover");
        }
      }
      function end(ev) {
        t.removeEventListener("pointermove", move);
        t.removeEventListener("pointerup", end);
        t.removeEventListener("pointercancel", end);
        t.classList.remove("dragging");
        if (hover) hover.classList.remove("hover");
        if (ev.type === "pointercancel" || solved) { t.style.transform = ""; return; }
        // A plain tap tries the next empty slot (still has to be the right letter)
        var target = moved ? slotUnder(t) : emptySlots()[0];
        if (!target) { t.style.transform = ""; return; }
        if (word[target.dataset.i] === t.dataset.letter) place(t, target);
        else wrong(t);
      }
      t.addEventListener("pointermove", move);
      t.addEventListener("pointerup", end);
      t.addEventListener("pointercancel", end);
    }

    function wrong(t) {
      t.style.transform = "";
      t.classList.remove("wrong");
      void t.offsetWidth;
      t.classList.add("wrong");
      setTimeout(function () { t.classList.remove("wrong"); }, 480);
    }

    function place(t, slot) {
      // FLIP: move into the slot, then animate from where it was dropped
      var from = t.getBoundingClientRect();
      t.style.transform = "";
      slot.appendChild(t);
      slot.classList.add("filled");
      t.classList.add("placed");
      t.removeAttribute("role");
      var to = t.getBoundingClientRect();
      t.style.transition = "none";
      t.style.transform = "translate(" + (from.left - to.left) + "px," + (from.top - to.top) + "px)";
      void t.offsetWidth;
      t.style.transition = "";
      t.style.transform = "";

      placed++;
      if (placed === word.length) {
        solved = true;
        wrap.classList.add("solved");
        hint.textContent = "Yes!! 💖";
        var r = slotsEl.getBoundingClientRect();
        setTimeout(function () { burst(r.left + r.width / 2, r.top + r.height / 2, { count: 18 }); }, 300);
        setTimeout(function () { next(n); }, 1500);
      }
    }

    return wrap;
  }

  /* ---------- Slide to confirm ---------- */
  function buildSlider(page, n) {
    var s = el("div", "slider");
    var fill = el("div", "slider-fill");
    var label = el("div", "slider-label", (page.sliderLabel || "slide to confirm") + " →");
    var thumb = el("div", "slider-thumb", "❤");
    s.append(fill, label, thumb);
    s.tabIndex = 0;
    s.setAttribute("role", "slider");
    s.setAttribute("aria-label", page.sliderLabel || "Slide to confirm");
    s.setAttribute("aria-valuemin", "0");
    s.setAttribute("aria-valuemax", "100");

    var p = 0, done = false, dragging = false, startX = 0, startP = 0;
    function maxX() { return s.clientWidth - thumb.offsetWidth - 8; }
    function set(v) {
      p = Math.max(0, Math.min(1, v));
      s.style.setProperty("--p", p);
      thumb.style.transform = "translateX(" + p * maxX() + "px)";
      s.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    }
    function complete() {
      if (done) return;
      done = true;
      dragging = false;
      s.classList.remove("returning");
      set(1);
      s.classList.add("done");
      label.textContent = "Confirmed! 💖";
      var r = thumb.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, { count: 30, spread: 1.2 });
      setTimeout(function () { next(n); }, 1500);
    }
    function release() {
      if (!dragging) return;
      dragging = false;
      if (done) return;
      if (p >= 0.97) return complete();
      s.classList.add("returning");
      set(0);
    }

    s.addEventListener("pointerdown", function (e) {
      if (done || busy || current !== n) return;
      e.preventDefault();
      try { s.setPointerCapture(e.pointerId); } catch (err) {}
      dragging = true;
      startX = e.clientX;
      startP = p;
      s.classList.remove("returning");
    });
    s.addEventListener("pointermove", function (e) {
      if (!dragging || done) return;
      set(startP + (e.clientX - startX) / maxX());
      if (p >= 1) complete();
    });
    s.addEventListener("pointerup", release);
    s.addEventListener("pointercancel", release);
    s.addEventListener("keydown", function (e) {
      if (done || busy || current !== n) return;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") set(p + 0.1);
      else if (e.key === "End") set(1);
      else return;
      e.preventDefault();
      if (p >= 1) complete();
    });
    return s;
  }

  /* ---------- Journey → dashboard ---------- */
  function finishJourney() {
    Ambient.setLevel(S.audio.dashboardVolume, 4);
    window.scrollTo(0, 0);
    dash.hidden = false;
    setBg("");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        dash.classList.add("shown");
        journeyEl.classList.add("leaving");
      });
    });
    setTimeout(function () {
      html.classList.add("mode-dashboard");
      stage.innerHTML = "";
      startDashboardEffects();
    }, 1400);
  }

  function startJourney() {
    var step = parseInt(jState.step, 10);
    if (!(step >= 0 && step < J.length)) step = 0;
    // Any first tap starts the music (e.g. after a refresh mid-journey)
    function unlock(e) {
      if (e.target.closest && e.target.closest("#soundToggle")) return;
      if (html.classList.contains("mode-dashboard")) return;
      Ambient.autoStart();
      document.removeEventListener("touchend", unlock);
      document.removeEventListener("click", unlock);
    }
    if (step > 0) {
      document.addEventListener("touchend", unlock, { passive: true });
      document.addEventListener("click", unlock);
    }
    show(step);
  }

  /* =====================================================================
     PART 2 — THE DASHBOARD
     ===================================================================== */

  /* ---------- modal & scroll lock ---------- */
  var locks = 0, lockY = 0;
  function lockScroll() {
    if (locks++) return;
    lockY = window.scrollY;
    body.style.position = "fixed";
    body.style.top = -lockY + "px";
    body.style.left = "0";
    body.style.right = "0";
  }
  function unlockScroll() {
    if (--locks > 0) return;
    locks = 0;
    body.style.position = body.style.top = body.style.left = body.style.right = "";
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, lockY);
    html.style.scrollBehavior = "";
  }

  var modal = $("#modal"), modalBody = $("#modalBody"), modalCard = $(".modal-card"), modalTimer, lastFocus;
  function openModal(content, extraClass) {
    clearTimeout(modalTimer);
    lastFocus = document.activeElement;
    modalBody.innerHTML = "";
    modalBody.className = "modal-body" + (extraClass ? " " + extraClass : "");
    modalBody.appendChild(content);
    if (modal.hidden) lockScroll();
    modal.hidden = false;
    modalCard.scrollTop = 0;
    requestAnimationFrame(function () { requestAnimationFrame(function () { modal.classList.add("open"); }); });
    $(".modal-close", modal).focus({ preventScroll: true });
  }
  function closeModal() {
    if (modal.hidden || !modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modalCard.classList.remove("impact");
    modalTimer = setTimeout(function () {
      modal.hidden = true;
      unlockScroll();
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }, 320);
  }
  modal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeModal(); });

  /* ---------- lightbox ---------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbCount = $("#lbCount"), lbList = [], lbIdx = 0, lbTimer;
  lbImg.draggable = false;
  function lbSet(animate) {
    var p = lbList[lbIdx];
    lbCount.textContent = lbList.length > 1 ? lbIdx + 1 + " / " + lbList.length : "";
    if (!animate) { lbImg.src = p.src; lbImg.alt = p.alt || ""; return; }
    lbImg.classList.add("swap");
    setTimeout(function () {
      lbImg.onload = function () { lbImg.classList.remove("swap"); };
      lbImg.src = p.src;
      lbImg.alt = p.alt || "";
      setTimeout(function () { lbImg.classList.remove("swap"); }, 600);
    }, 180);
  }
  function openLightbox(list, i) {
    clearTimeout(lbTimer);
    lastFocus = document.activeElement;
    lbList = list;
    lbIdx = i;
    lbSet(false);
    $("#lbPrev").hidden = $("#lbNext").hidden = list.length < 2;
    if (lb.hidden) lockScroll();
    lb.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { lb.classList.add("open"); }); });
    $(".lb-close", lb).focus({ preventScroll: true });
  }
  function closeLightbox() {
    if (lb.hidden || !lb.classList.contains("open")) return;
    lb.classList.remove("open");
    lbTimer = setTimeout(function () {
      lb.hidden = true;
      unlockScroll();
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }, 300);
  }
  function lbStep(d) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; lbSet(true); }
  $("#lbPrev").addEventListener("click", function () { lbStep(-1); });
  $("#lbNext").addEventListener("click", function () { lbStep(1); });
  lb.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]") || e.target === lb || e.target.id === "lbFigure") closeLightbox();
  });
  (function swipe() {
    var sx = null, sy = 0;
    lb.addEventListener("pointerdown", function (e) { sx = e.clientX; sy = e.clientY; });
    lb.addEventListener("pointerup", function (e) {
      if (sx == null || lbList.length < 2) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) lbStep(dx < 0 ? 1 : -1);
    });
  })();

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!zoom.hidden) return closeZoom(); // zoom closes first, back to the popup
      closeModal();
      closeLightbox();
    }
    if (!lb.hidden && e.key === "ArrowRight") lbStep(1);
    if (!lb.hidden && e.key === "ArrowLeft") lbStep(-1);
  });

  /* ---------- text bindings ---------- */
  function bindText() {
    document.querySelectorAll("[data-text]").forEach(function (n) {
      var v = get(S, n.getAttribute("data-text"));
      if (v != null) n.textContent = v;
    });
  }

  /* ---------- navbar ---------- */
  function buildNav() {
    var nav = $("#nav"), toggle = $("#navToggle"), list = $("#navList");
    S.nav.forEach(function (item) {
      if (!document.getElementById(item.id)) return;
      var li = el("li"), a = el("a", null, item.label);
      a.href = "#" + item.id;
      li.appendChild(a);
      list.appendChild(li);
    });
    function setOpen(open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    list.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });

    // hide on scroll down, show on scroll up
    var lastY = window.scrollY, ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (body.style.position !== "fixed" && !nav.classList.contains("open")) {
          if (y > lastY + 8 && y > 140) nav.classList.add("hide");
          else if (y < lastY - 8 || y < 140) nav.classList.remove("hide");
        }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- photo helpers ---------- */
  // Encodes spaces etc. in file names ("GALLERY - 1.png" → "GALLERY%20-%201.png")
  function assetUrl(p) {
    try { return encodeURI(decodeURI(p)); } catch (e) { return encodeURI(p); }
  }
  // Photos that fail to load (e.g. not uploaded yet) are skipped, not shown broken.
  var badSrc = {};
  function usable(list) {
    return (list || []).filter(function (p) { return !badSrc[p.src]; })
      .map(function (p) { return { src: assetUrl(p.src), alt: p.alt || "", raw: p.src }; });
  }
  function skipIfBroken(img, raw, rebuild) {
    img.addEventListener("error", function () {
      if (badSrc[raw]) return;
      badSrc[raw] = true;
      clearTimeout(rebuild.t);
      rebuild.t = setTimeout(rebuild, 250);
    });
  }

  /* ---------- photo conveyor ---------- */
  function buildConveyor() {
    var conveyor = $("#conveyor"), track = $("#conveyorTrack");
    function render() {
      var photos = usable(S.conveyorPhotos);
      track.innerHTML = "";
      conveyor.hidden = !photos.length;
      if (!photos.length) return;
      // Repeat so one "half" is always wider than the screen → seamless loop
      var reps = Math.max(1, Math.ceil(900 / (photos.length * 128)));
      for (var copy = 0; copy < 2; copy++) {
        for (var r = 0; r < reps; r++) {
          photos.forEach(function (p, i) {
            var item = el("div", "conveyor-item");
            var b = el("button");
            b.type = "button";
            b.setAttribute("aria-label", "Open photo " + (i + 1));
            if (copy || r) { b.tabIndex = -1; item.setAttribute("aria-hidden", "true"); }
            var img = el("img");
            img.src = p.src;
            img.alt = copy || r ? "" : p.alt;
            img.width = 116; img.height = 145;
            img.decoding = "async";
            img.draggable = false;
            skipIfBroken(img, p.raw, render);
            b.appendChild(img);
            b.addEventListener("click", function () { openLightbox(photos, i); });
            item.appendChild(b);
            track.appendChild(item);
          });
        }
      }
      track.style.setProperty("--dur", photos.length * reps * 5 + "s");
    }
    render();
    var resume;
    conveyor.addEventListener("touchstart", function () { clearTimeout(resume); conveyor.classList.add("paused"); }, { passive: true });
    ["touchend", "touchcancel"].forEach(function (ev) {
      conveyor.addEventListener(ev, function () {
        resume = setTimeout(function () { conveyor.classList.remove("paused"); }, 700);
      }, { passive: true });
    });
  }

  /* ---------- live refresh (ages, calendar hearts, day counts) ---------- */
  var liveFns = [];
  function onNewMinute(fn) { liveFns.push(fn); }
  setInterval(function () { liveFns.forEach(function (fn) { fn(); }); }, 60 * 1000);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) liveFns.forEach(function (fn) { fn(); });
  });

  /* ---------- about Raizel ---------- */
  function ageFrom(birthKey) {
    var b = parseKey(birthKey), t = new Date();
    var age = t.getFullYear() - b.getFullYear();
    if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
    return age;
  }
  function buildAbout() {
    var a = S.aboutHer, box = $("#aboutBody");
    var ages = [];
    if (a.generals && a.generals.length) {
      if (a.generalsTitle) box.appendChild(el("h3", "about-sub", a.generalsTitle));
      var dl = el("dl", "generals");
      a.generals.forEach(function (g) {
        var row = el("div", "general");
        var dt = el("dt", null, g.label);
        if (g.emoji) dt.prepend(el("span", "general-emoji", g.emoji));
        row.appendChild(dt);
        var dd = el("dd", null, g.value || "");
        if (g.birthdate) ages.push({ node: dd, birthdate: g.birthdate });
        row.appendChild(dd);
        dl.appendChild(row);
      });
      box.appendChild(dl);
    }
    if (a.cards && a.cards.length) {
      var grid = el("div", "about-grid");
      a.cards.forEach(function (c) {
        var card = el("div", "about-item");
        card.appendChild(el("b", null, c.label));
        card.appendChild(el("span", null, c.value));
        grid.appendChild(card);
      });
      box.parentNode.insertBefore(grid, box.nextSibling);
    }
    function updateAges() {
      ages.forEach(function (x) { x.node.textContent = String(ageFrom(x.birthdate)); });
    }
    updateAges();
    onNewMinute(updateAges);
  }

  /* ---------- looping animation between sections ---------- */
  function buildBetweenGif() {
    var box = $("#betweenGif"), g = S.betweenGif;
    if (!box || !g || !g.src) { if (box) box.hidden = true; return; }
    var img = el("img");
    img.src = assetUrl(g.src);
    img.alt = g.alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    img.draggable = false;
    img.addEventListener("error", function () { box.hidden = true; });
    box.appendChild(img);
  }

  /* ---------- "Remember This Day?" calendar ---------- */
  function parseKey(key) {
    var p = key.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function fmtDate(d) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
  function todayKey() {
    var t = new Date();
    return t.getFullYear() + "-" + pad(t.getMonth() + 1) + "-" + pad(t.getDate());
  }

  var MONTHS_UPPER = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  function folderKey(name) {
    return String(name).toUpperCase().replace(/\s+/g, " ").trim().replace(/^0+(?=\d)/, "");
  }
  // Photos for a date: from its folder (via js/photo-manifest.js), e.g. "3 JULY 2026"
  function eventPhotos(key, ev) {
    if (ev.photos && ev.photos.length) return ev.photos.map(assetUrl);
    var p = key.split("-").map(Number);
    var folder = ev.folder || p[2] + " " + MONTHS_UPPER[p[1] - 1] + " " + p[0];
    var dates = (window.PHOTO_MANIFEST && PHOTO_MANIFEST.dates) || {};
    var want = folderKey(folder), match = null;
    Object.keys(dates).forEach(function (name) { if (folderKey(name) === want) match = name; });
    if (!match) return [];
    var root = S.dates.photosRoot || "assets/photos/dates/";
    return dates[match].map(function (f) { return assetUrl(root + match + "/" + f); });
  }

  function buildEventCarousel(srcs, title) {
    var wrap = el("div", "ev-carousel");
    var track = el("div", "ev-track");
    var dots = el("div", "ev-dots");
    wrap.append(track, dots);
    srcs.forEach(function (src, i) {
      var slide = el("button", "ev-slide");
      slide.type = "button";
      slide.setAttribute("aria-label", "Zoom photo " + (i + 1));
      var img = el("img");
      img.src = src;
      img.alt = title;
      img.decoding = "async";
      img.draggable = false;
      img.addEventListener("error", function () { slide.remove(); refresh(); });
      slide.appendChild(img);
      slide.addEventListener("click", function () { openZoom(src, title); });
      track.appendChild(slide);
    });
    function current() { return Math.round(track.scrollLeft / Math.max(1, track.clientWidth)); }
    function refresh() {
      var n = track.children.length;
      if (!n) { wrap.remove(); return; }
      dots.innerHTML = "";
      dots.hidden = n < 2;
      for (var i = 0; i < n; i++) {
        var d = el("button", "ev-dot");
        d.type = "button";
        d.setAttribute("aria-label", "Photo " + (i + 1));
        d.addEventListener("click", (function (k) {
          return function () { track.scrollTo({ left: k * track.clientWidth, behavior: "smooth" }); };
        })(i));
        dots.appendChild(d);
      }
      mark();
    }
    function mark() {
      var c = current();
      Array.prototype.forEach.call(dots.children, function (d, i) { d.classList.toggle("on", i === c); });
    }
    var t;
    track.addEventListener("scroll", function () { clearTimeout(t); t = setTimeout(mark, 60); }, { passive: true });
    refresh();
    return wrap;
  }

  function openEvent(key) {
    var ev = S.dates.events[key];
    if (ev.special) return openSpecial(key, ev);
    var frag = document.createDocumentFragment();
    frag.appendChild(el("div", "date", fmtDate(parseKey(key))));
    var h = el("h3", null, ev.title);
    h.id = "modalTitle";
    frag.appendChild(h);
    var photos = eventPhotos(key, ev);
    if (photos.length) frag.appendChild(buildEventCarousel(photos, ev.title));
    if (ev.story) { frag.appendChild(el("h4", null, "What Happened That Day")); frag.appendChild(el("p", null, ev.story)); }
    openModal(frag, key === S.dates.highlightDate ? "ev-gold" : "");
  }

  // A special date: big centred title + subtitle, emoji confetti rain, and a cute "impact" shake
  function openSpecial(key, ev) {
    var frag = document.createDocumentFragment();
    var wrap = el("div", "special-pop");
    wrap.appendChild(el("div", "date", fmtDate(parseKey(key))));
    var h = el("h3", "special-title", ev.title);
    h.id = "modalTitle";
    wrap.appendChild(h);
    if (ev.subtitle) wrap.appendChild(el("p", "special-sub", ev.subtitle));
    frag.appendChild(wrap);
    var photos = eventPhotos(key, ev);
    if (photos.length) frag.appendChild(buildEventCarousel(photos, ev.title));
    if (ev.story) { frag.appendChild(el("h4", null, "What Happened That Day")); frag.appendChild(el("p", null, ev.story)); }
    openModal(frag, "ev-special");
    modalCard.classList.remove("impact");
    setTimeout(function () {
      void modalCard.offsetWidth;
      modalCard.classList.add("impact");
      emojiRain(ev.confetti);
    }, 260);
  }

  function emojiRain(list) {
    list = list && list.length ? list : EMOJI;
    var layer = el("div", "emoji-rain");
    layer.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 46; i++) {
      var s = el("span", null, list[i % list.length]);
      s.style.left = rand(0, 100) + "vw";
      s.style.setProperty("--s", rand(18, 34) + "px");
      s.style.setProperty("--d", rand(1.1, 1.8) + "s");
      s.style.setProperty("--r", rand(-240, 240) + "deg");
      s.style.setProperty("--dx", rand(-40, 40) + "px");
      s.style.animationDelay = rand(0, 0.45) + "s";
      layer.appendChild(s);
    }
    body.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 2500);
  }

  function buildCalendar() {
    var cfg = S.dates, events = cfg.events || {};
    var scroller = $("#calScroller"), label = $("#calLabel"), prev = $("#calPrev"), nextBtn = $("#calNext");
    var s = cfg.startMonth.split("-").map(Number), e = cfg.endMonth.split("-").map(Number);
    var months = [], y = s[0], m = s[1];
    while (y < e[0] || (y === e[0] && m <= e[1])) {
      months.push({ y: y, m: m });
      if (++m > 12) { m = 1; y++; }
    }
    var ws = cfg.weekStartsOn || 0;
    var dows = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var cells = []; // [key, node]

    months.forEach(function (mo) {
      var page = el("div", "cal-month-grid");
      mo.label = new Date(mo.y, mo.m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
      page.setAttribute("aria-label", mo.label);
      var grid = el("div", "cal-grid");
      for (var i = 0; i < 7; i++) grid.appendChild(el("div", "cal-dow", dows[(i + ws) % 7].slice(0, 2)));
      var blanks = (new Date(mo.y, mo.m - 1, 1).getDay() - ws + 7) % 7;
      for (var b = 0; b < blanks; b++) grid.appendChild(el("div"));
      var days = new Date(mo.y, mo.m, 0).getDate();
      for (var d = 1; d <= days; d++) {
        var key = mo.y + "-" + pad(mo.m) + "-" + pad(d), cell;
        if (events[key]) {
          cell = el("button", "cal-day event", d);
          cell.type = "button";
          cell.setAttribute("aria-label", d + " " + mo.label + ": " + events[key].title);
          cell.addEventListener("click", openEvent.bind(null, key));
        } else {
          cell = el("div", "cal-day", d);
        }
        if (key === cfg.highlightDate) cell.classList.add("gold");
        if (events[key] && events[key].special) cell.classList.add("special");
        cells.push([key, cell]);
        grid.appendChild(cell);
      }
      page.appendChild(grid);
      var ym = mo.y + "-" + pad(mo.m);
      if (cfg.locked && ym >= cfg.locked.from && ym <= cfg.locked.to) {
        page.classList.add("locked");
        grid.setAttribute("aria-hidden", "true");
        var lock = el("button", "cal-lock");
        lock.type = "button";
        lock.setAttribute("aria-label", "Locked: " + cfg.locked.text);
        lock.appendChild(el("span", "cal-lock-icon", "🔒"));
        lock.appendChild(el("span", "cal-lock-badge", "LOCKED"));
        lock.appendChild(el("span", "cal-lock-text", cfg.locked.text));
        lock.addEventListener("click", function () {
          this.classList.remove("nope");
          void this.offsetWidth;
          this.classList.add("nope");
        });
        page.appendChild(lock);
      }
      scroller.appendChild(page);
    });

    // Today outline + a little heart on every day from togetherSince → today (keeps extending)
    var markedFor = null;
    function markDays() {
      var today = todayKey();
      if (today === markedFor) return;
      markedFor = today;
      cells.forEach(function (c) {
        var together = cfg.togetherSince && c[0] >= cfg.togetherSince && c[0] <= today;
        c[1].classList.toggle("together", !!together);
        c[1].classList.toggle("today", c[0] === today);
      });
    }
    markDays();
    onNewMinute(markDays);

    function idx() { return Math.round(scroller.scrollLeft / Math.max(1, scroller.clientWidth)); }
    function update() {
      var i = Math.min(months.length - 1, Math.max(0, idx()));
      label.textContent = months[i].label;
      prev.disabled = i === 0;
      nextBtn.disabled = i === months.length - 1;
    }
    function go(i) { scroller.scrollTo({ left: i * scroller.clientWidth, behavior: "smooth" }); }
    prev.addEventListener("click", function () { go(idx() - 1); });
    nextBtn.addEventListener("click", function () { go(idx() + 1); });
    var t;
    scroller.addEventListener("scroll", function () { clearTimeout(t); t = setTimeout(update, 60); }, { passive: true });
    update();

    // timeline chips under the calendar
    var tl = $("#timeline");
    Object.keys(events).sort().forEach(function (key) {
      var chip = el("button", "chip" + (key === cfg.highlightDate ? " gold" : "") + (events[key].special ? " special" : ""));
      chip.type = "button";
      chip.appendChild(el("small", null, fmtDate(parseKey(key))));
      chip.appendChild(el("span", null, events[key].title));
      chip.addEventListener("click", function () {
        var p = key.split("-").map(Number);
        var i = months.findIndex(function (mo) { return mo.y === p[0] && mo.m === p[1]; });
        if (i >= 0) go(i);
        openEvent(key);
      });
      tl.appendChild(chip);
    });
  }

  /* ---------- zoom viewer (pinch / wheel / double-tap) ---------- */
  var zoom = $("#zoom"), zStage = $("#zoomStage"), zImg = $("#zoomImg"), zTimer;
  var Z = { s: 1, x: 0, y: 0 }, ptrs = new Map(), gesture = null, lastTap = 0;
  function zApply(animate) {
    zImg.style.transition = animate ? "transform .25s ease" : "none";
    zImg.style.transform = "translate(" + Z.x + "px," + Z.y + "px) scale(" + Z.s + ")";
  }
  function zClamp() {
    Z.s = Math.min(5, Math.max(1, Z.s));
    var mx = (zImg.offsetWidth * (Z.s - 1)) / 2, my = (zImg.offsetHeight * (Z.s - 1)) / 2;
    Z.x = Math.min(mx, Math.max(-mx, Z.x));
    Z.y = Math.min(my, Math.max(-my, Z.y));
    if (Z.s === 1) { Z.x = 0; Z.y = 0; }
  }
  // Zoom to scale `ns`, keeping the screen point (px, py) — relative to the stage centre — still
  function zoomAt(ns, px, py, base) {
    base = base || Z;
    var lx = (px - base.x) / base.s, ly = (py - base.y) / base.s;
    Z.s = Math.min(5, Math.max(1, ns));
    Z.x = px - Z.s * lx;
    Z.y = py - Z.s * ly;
    zClamp();
  }
  function rel(e) {
    var r = zStage.getBoundingClientRect();
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
  }
  function openZoom(src, alt) {
    clearTimeout(zTimer);
    Z = { s: 1, x: 0, y: 0 };
    zApply(false);
    zImg.src = src;
    zImg.alt = alt || "";
    zoom.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { zoom.classList.add("open"); }); });
    $("#zoomClose").focus({ preventScroll: true });
  }
  function closeZoom() {
    if (zoom.hidden) return;
    zoom.classList.remove("open");
    ptrs.clear();
    gesture = null;
    zTimer = setTimeout(function () { zoom.hidden = true; zImg.removeAttribute("src"); }, 250);
  }
  $("#zoomClose").addEventListener("click", closeZoom);
  function startGesture() {
    var pts = Array.from(ptrs.values());
    if (pts.length >= 2) {
      gesture = {
        type: "pinch",
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
        mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 },
        base: { s: Z.s, x: Z.x, y: Z.y },
      };
    } else if (pts.length === 1) {
      gesture = { type: "pan", start: pts[0], base: { x: Z.x, y: Z.y } };
    } else gesture = null;
  }
  zStage.addEventListener("pointerdown", function (e) {
    try { zStage.setPointerCapture(e.pointerId); } catch (err) {}
    ptrs.set(e.pointerId, rel(e));
    startGesture();
    if (ptrs.size === 1) {
      var now = Date.now(), p = rel(e);
      if (now - lastTap < 300) {
        if (Z.s > 1.05) Z = { s: 1, x: 0, y: 0 };
        else zoomAt(2.5, p.x, p.y);
        zApply(true);
        lastTap = 0;
      } else lastTap = now;
    }
  });
  zStage.addEventListener("pointermove", function (e) {
    if (!ptrs.has(e.pointerId) || !gesture) return;
    ptrs.set(e.pointerId, rel(e));
    var pts = Array.from(ptrs.values());
    if (gesture.type === "pinch" && pts.length >= 2) {
      var dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      var mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      zoomAt(gesture.base.s * (dist / gesture.dist), gesture.mid.x, gesture.mid.y, gesture.base);
      Z.x += mid.x - gesture.mid.x;
      Z.y += mid.y - gesture.mid.y;
      zClamp();
      zApply(false);
    } else if (gesture.type === "pan" && Z.s > 1) {
      Z.x = gesture.base.x + pts[0].x - gesture.start.x;
      Z.y = gesture.base.y + pts[0].y - gesture.start.y;
      zClamp();
      zApply(false);
    }
  });
  function zEnd(e) {
    ptrs.delete(e.pointerId);
    startGesture();
  }
  zStage.addEventListener("pointerup", zEnd);
  zStage.addEventListener("pointercancel", zEnd);
  zStage.addEventListener("wheel", function (e) {
    e.preventDefault();
    var p = rel(e);
    zoomAt(Z.s * Math.exp(-e.deltaY * 0.0025), p.x, p.y);
    zApply(false);
  }, { passive: false });
  // Stop Safari from zooming the whole page while the viewer is open
  ["gesturestart", "gesturechange"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (!zoom.hidden) e.preventDefault(); });
  });

  /* ---------- letters ---------- */
  function buildLetters() {
    var grid = $("#letterGrid"), colors = ["var(--pink)", "var(--peach)", "var(--blush)"];
    S.letters.items.forEach(function (letter, i) {
      var journal = letter.type === "journal";
      var card = el("button", "letter-card" + (journal ? " journal-card" : ""));
      card.type = "button";
      card.style.setProperty("--c", colors[i % colors.length]);
      card.appendChild(el("span", "icon", letter.icon || "💌"));
      var inner = el("div");
      inner.appendChild(el("h3", null, letter.title));
      inner.appendChild(el("span", "open", journal ? "tap to write ✍️" : "tap to open ✉️"));
      card.appendChild(inner);
      card.addEventListener("click", function () {
        if (journal) return openJournal(letter);
        var frag = document.createDocumentFragment();
        var h = el("h3", null, letter.title);
        h.id = "modalTitle";
        frag.appendChild(h);
        frag.appendChild(el("p", "letter-text", letter.text));
        openModal(frag, "letter-paper");
      });
      grid.appendChild(card);
    });
  }

  /* ---------- "Notes For The Future" — letters to her future self ---------- */
  var FK = "rb.future";
  function openJournal(letter) {
    var st = store.get(FK, { entries: [], draft: "" });
    st.entries = st.entries || [];
    var mode = st.entries.length ? "view" : "compose";
    var editingId = null;

    var root = el("div");
    var h = el("h3", null, letter.title);
    h.id = "modalTitle";
    root.appendChild(h);
    root.appendChild(el("p", "letter-text", letter.text));
    var area = el("div", "journal");
    root.appendChild(area);

    function save() { store.set(FK, st); }
    function stamp(e) {
      return "Written " + fmtDate(new Date(e.created)) + (e.updated ? " · edited " + fmtDate(new Date(e.updated)) : "");
    }
    function button(label, cls, fn) {
      var b = el("button", "btn btn-small " + (cls || ""), label);
      b.type = "button";
      b.addEventListener("click", fn);
      return b;
    }
    function edit(id) { editingId = id; mode = "compose"; render(true); }
    function remove(id) {
      if (!confirm("Delete this letter? This can't be undone.")) return;
      st.entries = st.entries.filter(function (x) { return x.id !== id; });
      if (editingId === id) editingId = null;
      if (!st.entries.length) mode = "compose";
      save();
      render();
    }
    function entryCard(e, isCurrent) {
      var c = el("article", "journal-entry" + (isCurrent ? " current" : ""));
      c.appendChild(el("small", null, stamp(e)));
      c.appendChild(el("p", null, e.text));
      var actions = el("div", "journal-actions");
      actions.appendChild(button("Edit", "btn-soft", function () { edit(e.id); }));
      actions.appendChild(button("Delete", "btn-soft", function () { remove(e.id); }));
      if (isCurrent) actions.appendChild(button("Write Another", "", function () { editingId = null; mode = "compose"; render(true); }));
      c.appendChild(actions);
      return c;
    }

    function render(focus) {
      area.innerHTML = "";
      var editing = editingId && st.entries.find(function (x) { return x.id === editingId; });
      if (mode === "compose") {
        var ta = el("textarea", "journal-input");
        ta.rows = 9;
        ta.placeholder = "Dear future me…";
        ta.setAttribute("aria-label", "Your letter to your future self");
        ta.value = editing ? editing.text : st.draft || "";
        ta.addEventListener("input", function () {
          if (!editing) { st.draft = ta.value; save(); }
        });
        area.appendChild(ta);
        var row = el("div", "journal-actions");
        row.appendChild(button(editing ? "Save" : "Send 💌", "", function () {
          var text = ta.value.trim();
          if (!text) {
            ta.classList.remove("wrong");
            void ta.offsetWidth;
            ta.classList.add("wrong");
            return;
          }
          if (editing) {
            editing.text = text;
            editing.updated = Date.now();
            // edited letter becomes the one on top
            st.entries = [editing].concat(st.entries.filter(function (x) { return x !== editing; }));
          } else {
            st.entries.unshift({ id: "f" + Date.now().toString(36), text: text, created: Date.now() });
            st.draft = "";
          }
          editingId = null;
          mode = "view";
          save();
          render();
          var r = area.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + 60, { count: 16, spread: 0.8 });
        }));
        if (st.entries.length) {
          row.appendChild(button("Cancel", "btn-soft", function () { editingId = null; mode = "view"; render(); }));
        }
        area.appendChild(row);
        if (focus) setTimeout(function () { ta.focus(); }, 50);
      }

      var list = st.entries.filter(function (x) { return x !== editing; });
      if (mode === "view" && list.length) {
        area.appendChild(entryCard(list[0], true));
        list = list.slice(1);
      }
      if (list.length) {
        area.appendChild(el("h4", "journal-past", "Earlier letters to yourself"));
        list.forEach(function (e) { area.appendChild(entryCard(e, false)); });
      }
    }
    render();
    openModal(root, "letter-paper");
  }

  /* ---------- us in numbers ---------- */
  function midnight(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function daysBetween(a, b) { return Math.round((midnight(b) - midnight(a)) / 864e5); }
  function daysUntil(md) {
    var t = midnight(new Date()), d = new Date(t.getFullYear(), md.month - 1, md.day);
    if (d < t) d = new Date(t.getFullYear() + 1, md.month - 1, md.day);
    return daysBetween(t, d);
  }

  var statEls = {};
  function buildNumbers() {
    var c = S.numbers.cards, box = $("#stats");
    [
      ["happyDays", c.happyDays, true],
      ["toKafka", c.toKafka, true],
      ["toRaizel", c.toRaizel, true],
      ["dates", c.dates.label, false, c.dates.value],
      ["love", c.love.label, false, c.love.value],
    ].forEach(function (row) {
      var card = el("div", "stat");
      var v = el("div", "stat-value" + (row[2] ? "" : " text"), row[3] || "0");
      var l = el("div", "stat-label", row[1]);
      card.append(v, l);
      box.appendChild(card);
      statEls[row[0]] = { v: v, l: l, label: row[1] };
    });
    updateNumbers(false);
    setInterval(function () { updateNumbers(false); }, 60 * 1000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) updateNumbers(false); });
  }

  var counted = false;
  function updateNumbers(animate) {
    var n = S.numbers;
    var vals = {
      happyDays: Math.max(0, daysBetween(parseKey(n.togetherSince), new Date())),
      toKafka: daysUntil(n.kafkaBirthday),
      toRaizel: daysUntil(n.raizelBirthday),
    };
    Object.keys(vals).forEach(function (k) {
      var s = statEls[k], val = vals[k];
      if (k !== "happyDays" && val === 0) {
        s.v.textContent = "TODAY! 🎂";
        s.v.classList.add("text");
        s.l.textContent = k === "toRaizel" ? "It's Raizel's Birthday!" : "It's Kafka's Birthday!";
        return;
      }
      s.v.classList.remove("text");
      s.l.textContent = s.label;
      if (animate) countUp(s.v, val);
      else if (counted) s.v.textContent = val;
      else s.v.dataset.target = val;
    });
  }
  function countUp(node, to) {
    var start = performance.now(), dur = 1100;
    (function frame(t) {
      var k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      node.textContent = Math.round(to * e);
      if (k < 1) requestAnimationFrame(frame);
    })(start);
  }

  /* ---------- Affectum Radio ---------- */
  function youtubeId(url) {
    var m = String(url || "").match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/|live\/)([\w-]{11})/);
    return m && m[1];
  }
  function buildRadio() {
    var card = $("#radioCard"), id = youtubeId(S.radio.youtubeUrl);
    card.appendChild(el("p", "radio-label", S.radio.label));
    var btn = el("button", "radio-play");
    btn.type = "button";
    btn.setAttribute("aria-label", "Play Affectum Radio");
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>';
    card.appendChild(btn);
    if (!id) {
      card.appendChild(el("p", "soon", "Tuning in soon… 📡"));
      btn.disabled = true;
      return;
    }
    btn.addEventListener("click", function () {
      Ambient.mute();
      var wrap = el("div", "embed");
      var f = el("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&playsinline=1&rel=0&modestbranding=1";
      f.title = "Affectum Radio";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      wrap.appendChild(f);
      btn.replaceWith(wrap);
    });
  }

  /* ---------- bucket list ---------- */
  var BK = "rb.bucket";
  function buildBucket() {
    var state = store.get(BK, { checked: {}, custom: [] });
    state.checked = state.checked || {};
    state.custom = state.custom || [];
    var list = $("#bucketList"), form = $("#bucketForm"), input = $("#bucketInput");
    input.placeholder = S.bucketList.placeholder || "";
    var tick = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function items() {
      return S.bucketList.items.map(function (t) { return { id: "d:" + t, text: t }; })
        .concat(state.custom.map(function (c) { return { id: c.id, text: c.text, custom: true }; }));
    }
    function render(newId) {
      list.innerHTML = "";
      items().forEach(function (it) {
        var li = el("li", "bucket-item" + (it.id === newId ? " new" : ""));
        var lab = el("label");
        var cb = el("input");
        cb.type = "checkbox";
        cb.checked = !!state.checked[it.id];
        var box = el("span", "check");
        box.innerHTML = tick;
        lab.append(cb, box, el("span", "txt", it.text));
        cb.addEventListener("change", function () {
          if (cb.checked) {
            state.checked[it.id] = true;
            var r = box.getBoundingClientRect();
            burst(r.left + r.width / 2, r.top + r.height / 2, { count: 10, spread: 0.5 });
          } else delete state.checked[it.id];
          store.set(BK, state);
        });
        li.appendChild(lab);
        if (it.custom) {
          var del = el("button", "del", "✕");
          del.type = "button";
          del.setAttribute("aria-label", "Remove " + it.text);
          del.addEventListener("click", function () {
            state.custom = state.custom.filter(function (c) { return c.id !== it.id; });
            delete state.checked[it.id];
            store.set(BK, state);
            render();
          });
          li.appendChild(del);
        }
        list.appendChild(li);
      });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      var id = "c:" + Date.now().toString(36);
      state.custom.push({ id: id, text: text });
      store.set(BK, state);
      input.value = "";
      render(id);
    });
    render();
  }

  /* ---------- gallery ---------- */
  function buildGallery() {
    var grid = $("#galleryGrid");
    function render() {
      var photos = usable(S.gallery.photos);
      grid.innerHTML = "";
      if (!photos.length) grid.appendChild(el("p", "soon", "Photos coming soon 📸"));
      photos.forEach(function (p, i) {
        var b = el("button");
        b.type = "button";
        b.setAttribute("aria-label", "Enlarge photo " + (i + 1));
        var img = el("img");
        img.src = p.src;
        img.alt = p.alt;
        img.loading = "lazy";
        img.decoding = "async";
        img.draggable = false;
        skipIfBroken(img, p.raw, render);
        b.appendChild(img);
        b.addEventListener("click", function () { openLightbox(photos, i); });
        grid.appendChild(b);
      });
    }
    render();
  }

  /* ---------- playlist ---------- */
  function spotifyEmbed(url) {
    var m = String(url || "").match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(playlist|album|track)\/([A-Za-z0-9]+)/);
    return m ? "https://open.spotify.com/embed/" + m[1] + "/" + m[2] + "?utm_source=generator" : null;
  }
  function buildPlaylist() {
    var card = $("#playlistCard"), url = S.playlist.spotifyUrl, embed = spotifyEmbed(url);
    if (embed) {
      var f = el("iframe");
      f.src = embed;
      f.title = "Spotify playlist";
      f.loading = "lazy";
      f.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      card.appendChild(f);
    }
    var link = el(url ? "a" : "div", "playlist-link");
    if (url) { link.href = url; link.target = "_blank"; link.rel = "noopener"; }
    link.appendChild(el("span", "disc"));
    var txt = el("span");
    txt.appendChild(el("span", null, S.playlist.label));
    txt.appendChild(el("small", "soon", url ? " Open in Spotify ↗" : " Coming soon…"));
    txt.lastChild.style.display = "block";
    txt.lastChild.style.margin = "0";
    link.appendChild(txt);
    card.appendChild(link);
    if (!embed) link.style.marginTop = "0";

    // Clicking into an embedded player (Spotify/YouTube) pauses the ambient music
    window.addEventListener("blur", function () {
      setTimeout(function () {
        if (document.activeElement && document.activeElement.tagName === "IFRAME") Ambient.mute();
      }, 0);
    });
  }

  /* ---------- gift codes ---------- */
  var GK = "rb.gifts";
  function buildCode() {
    var form = $("#codeForm"), input = $("#codeInput"), msg = $("#codeMsg"), reveal = $("#reveal"), shelf = $("#unlocked");
    var unlocked = store.get(GK, []);
    var revealing = false;
    input.placeholder = S.code.placeholder || "";

    function note(g) {
      var n = el("div", "gift-note");
      n.appendChild(el("div", "emoji", g.emoji || "🎁"));
      n.appendChild(el("p", "kicker", "You unlocked"));
      n.appendChild(el("h3", null, g.name || "A surprise"));
      n.appendChild(el("p", null, g.story || ""));
      return n;
    }
    function show(g, animate) {
      reveal.hidden = false;
      reveal.innerHTML = "";
      if (!animate) {
        reveal.appendChild(note(g));
        reveal.scrollIntoView({ block: "nearest", behavior: "smooth" });
        return;
      }
      revealing = true;
      var boxWrap = el("div", "gift-box"), box = el("span", "box", "🎁");
      boxWrap.appendChild(box);
      reveal.appendChild(boxWrap);
      reveal.scrollIntoView({ block: "center", behavior: "smooth" });
      setTimeout(function () { boxWrap.classList.add("open"); }, 950);
      setTimeout(function () {
        var r = boxWrap.getBoundingClientRect();
        reveal.innerHTML = "";
        var n = note(g);
        reveal.appendChild(n);
        burst(r.left + r.width / 2, r.top + r.height / 2, { confetti: true, count: 34, spread: 1.2 });
        revealing = false;
        renderShelf();
      }, 1400);
    }
    function renderShelf() {
      shelf.innerHTML = "";
      unlocked.forEach(function (g) {
        var c = el("button", "chip", (g.emoji || "🎁") + " " + (g.name || "Surprise"));
        c.type = "button";
        c.addEventListener("click", function () { if (!revealing) show(g, false); });
        shelf.appendChild(c);
      });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (revealing || !GiftCodec.normalize(input.value)) return;
      var g = GiftCodec.decode(input.value, window.GIFTS);
      if (!g) {
        msg.textContent = S.code.wrong;
        form.classList.remove("wrong");
        void form.offsetWidth;
        form.classList.add("wrong");
        return;
      }
      msg.textContent = "";
      input.value = "";
      input.blur();
      if (!unlocked.some(function (u) { return u.name === g.name && u.story === g.story; })) {
        unlocked.push(g);
        store.set(GK, unlocked);
      }
      show(g, true);
    });
    input.addEventListener("input", function () { msg.textContent = ""; form.classList.remove("wrong"); });
    renderShelf();
  }

  /* ---------- scroll reveals ---------- */
  function startDashboardEffects() {
    var sections = document.querySelectorAll(".section");
    var statsBox = $("#stats");
    if (!("IntersectionObserver" in window)) {
      counted = true;
      updateNumbers(false);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("visible");
        io.unobserve(en.target);
        if (en.target.id === "numbers" && !counted) {
          counted = true;
          updateNumbers(true);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    sections.forEach(function (s) {
      s.classList.add("reveal-on-scroll");
      io.observe(s);
    });
    if (!statsBox) counted = true;
  }

  /* ---------- replay ---------- */
  $("#replay").addEventListener("click", function () {
    if (!confirm("Replay the beginning of your surprise?")) return;
    store.set("rb.journey", { step: 0, done: false });
    location.replace(location.pathname);
  });

  /* ---------------- boot ---------------- */
  bindText();
  buildNav();
  buildConveyor();
  buildAbout();
  buildBetweenGif();
  buildCalendar();
  buildLetters();
  buildNumbers();
  buildRadio();
  buildBucket();
  buildGallery();
  buildPlaylist();
  buildCode();

  if (jState.done) {
    html.classList.add("mode-dashboard");
    dash.hidden = false;
    startDashboardEffects();
  } else {
    html.classList.remove("mode-dashboard");
    startJourney();
  }
})();
