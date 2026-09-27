/* Ambient audio.
   - Nothing plays until start() is called from a tap (Safari autoplay rules).
   - Uses SITE.audio.src if set, otherwise a soft synthesized piano loop.
   - Volume is controlled via a Web Audio gain node, because iOS ignores
     <audio>.volume. */
window.Ambient = (function () {
  var ctx, master, el, synthTimer, nextNoteTime = 0, step = 0;
  var playing = false;      // currently audible
  var userMuted = false;    // she tapped the mute button herself
  var level = 0.2;
  var listeners = [];

  // Fmaj7 – Em7 – Dm7 – Cmaj7, gentle arpeggios (Hz)
  var BARS = [
    { bass: 87.31, notes: [349.23, 440.0, 523.25, 659.25, 523.25, 440.0] },
    { bass: 82.41, notes: [329.63, 392.0, 493.88, 587.33, 493.88, 392.0] },
    { bass: 73.42, notes: [293.66, 349.23, 440.0, 523.25, 440.0, 349.23] },
    { bass: 65.41, notes: [261.63, 329.63, 392.0, 493.88, 392.0, 329.63] },
  ];
  var NOTE_LEN = 0.52; // seconds per arpeggio step

  function emit() { listeners.forEach(function (fn) { fn(playing); }); }

  function init() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    var filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2400;
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(filter);
    filter.connect(ctx.destination);

    var src = window.SITE && SITE.audio && SITE.audio.src;
    if (src) {
      el = new Audio(src);
      el.loop = true;
      el.preload = "auto";
      el.setAttribute("playsinline", "");
      ctx.createMediaElementSource(el).connect(master);
    }
    return true;
  }

  function pluck(freq, t, vel) {
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    g.connect(master);
    [[1, "sine", 1], [2, "triangle", 0.18], [3, "sine", 0.06]].forEach(function (h) {
      var o = ctx.createOscillator(), hg = ctx.createGain();
      o.type = h[1];
      o.frequency.value = freq * h[0];
      hg.gain.value = h[2];
      o.connect(hg); hg.connect(g);
      o.start(t); o.stop(t + 2.7);
    });
  }

  function schedule() {
    while (nextNoteTime < ctx.currentTime + 0.4) {
      var bar = BARS[Math.floor(step / 6) % BARS.length], i = step % 6;
      if (i === 0) pluck(bar.bass, nextNoteTime, 0.22);
      pluck(bar.notes[i], nextNoteTime, i === 0 ? 0.14 : 0.09);
      nextNoteTime += NOTE_LEN;
      step++;
    }
  }

  function startSynth() {
    if (synthTimer) return;
    nextNoteTime = ctx.currentTime + 0.1;
    synthTimer = setInterval(schedule, 120);
    schedule();
  }

  function stopSynth() {
    clearInterval(synthTimer);
    synthTimer = null;
  }

  function ramp(to, secs) {
    if (!ctx) return;
    var now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(to, now + (secs || 1.5));
  }

  // Must be called from inside a tap handler.
  function play() {
    if (!init()) return;
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    if (ctx.state !== "running") ctx.resume();
    if (el) el.play().catch(function () {});
    else startSynth();
    playing = true;
    ramp(level, 2);
    emit();
  }

  function pause() {
    if (!ctx) return;
    playing = false;
    ramp(0, 0.4);
    setTimeout(function () {
      if (playing) return;
      if (el) el.pause();
      stopSynth();
      ctx.suspend(); // save battery
    }, 450);
    emit();
  }

  // Pause while the tab/app is in the background.
  document.addEventListener("visibilitychange", function () {
    if (!ctx || !playing) return;
    if (document.hidden) { stopSynth(); if (el) el.pause(); ctx.suspend(); }
    else { ctx.resume(); if (el) el.play().catch(function () {}); else startSynth(); }
  });

  return {
    // First-tap start: respects the mute button if she already used it.
    autoStart: function () { if (!userMuted && !playing) play(); },
    toggle: function () {
      if (playing) { userMuted = true; pause(); }
      else { userMuted = false; play(); }
    },
    mute: function () { if (playing) pause(); },
    setLevel: function (v, secs) { level = v; if (playing) ramp(v, secs); },
    isPlaying: function () { return playing; },
    onChange: function (fn) { listeners.push(fn); },
  };
})();
