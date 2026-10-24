// =====================================================================
// SCRIPT.JS — logika interaksi website ulang tahun
// ---------------------------------------------------------------------
// Kamu TIDAK perlu mengedit file ini untuk mengganti nama/pesan/foto/warna.
// Semua itu ada di js/data.js. File ini hanya "mesin"-nya.
//
// Daftar isi:
//   1. Setup & fungsi bantu           8. Musik
//   2. Tema warna dari data.js        9. Urutan pembukaan (buka gift)
//   3. Membangun konten dari data     10. Countdown
//   4. Elemen melayang                11. Surat
//   5. Confetti (canvas)              12. Kue & lilin
//   6. Scroll reveal                  13. Easter egg
//   7. Foto polaroid                  14. Replay & start
// =====================================================================
(function () {
  'use strict';

  // ===================================================================
  // 1. SETUP & FUNGSI BANTU
  // ===================================================================
  var D = window.birthdayData;
  if (!D) {
    console.error('[birthday] js/data.js tidak ditemukan. Pastikan <script src="js/data.js"> ada sebelum script.js');
    return;
  }

  var NS = 'http://www.w3.org/2000/svg';
  var root = document.documentElement;

  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function rand(min, max) { return min + Math.random() * (max - min); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isSmall = window.matchMedia('(max-width: 639px)').matches;

  // Buat elemen HTML dengan cara singkat
  // el('div', { class:'a', text:'hai', attrs:{id:'x'}, style:{'--d':'1s'} }, anak1, anak2)
  function el(tag, opts) {
    opts = opts || {};
    var n = document.createElement(tag);
    if (opts.class) n.className = opts.class;
    if (opts.text != null) n.textContent = opts.text;
    if (opts.attrs) Object.keys(opts.attrs).forEach(function (k) { n.setAttribute(k, opts.attrs[k]); });
    if (opts.style) Object.keys(opts.style).forEach(function (k) { n.style.setProperty(k, opts.style[k]); });
    for (var i = 2; i < arguments.length; i++) { if (arguments[i]) n.appendChild(arguments[i]); }
    return n;
  }

  // Ikon SVG dari sprite di index.html (#i-heart, #i-sparkle, dst.)
  function icon(name, cls) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', cls || 'ico');
    s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS(NS, 'use');
    u.setAttribute('href', '#i-' + name);
    s.appendChild(u);
    return s;
  }

  // ---------- warna ----------
  var HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  var DEFAULT_COLORS = {
    pink: '#D98FA3', rose: '#B96F86', blush: '#F3D5DD', cream: '#FFF8F3',
    white: '#FFFFFF', mauve: '#9B788D', ink: '#765D61', gold: '#D5B58A'
  };
  var C = {};
  Object.keys(DEFAULT_COLORS).forEach(function (k) {
    var v = D.colors && D.colors[k];
    C[k] = (typeof v === 'string' && HEX.test(v)) ? v : DEFAULT_COLORS[k];
  });

  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgbToHex(rgb) {
    return '#' + rgb.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('');
  }
  // campur 2 warna: t=0 -> a, t=1 -> b
  function mix(a, b, t) {
    var A = hexToRgb(a), B = hexToRgb(b);
    return rgbToHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
  }

  // ---------- nama & template teks ----------
  // "PENTI GADIS" (huruf besar semua) -> "Penti Gadis"
  function prettyName(s) {
    s = String(s || '').trim();
    if (s && s === s.toUpperCase() && s !== s.toLowerCase()) {
      return s.toLowerCase().replace(/(^|[\s'\-])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); });
    }
    return s;
  }
  var NAME = prettyName(D.recipientName);
  var NAMES = {
    name: NAME,
    firstName: D.firstName ? prettyName(D.firstName) : NAME.split(/\s+/)[0],
    nickname: D.nickname || NAME.split(/\s+/)[0],
    sender: prettyName(D.senderName),
    signature: prettyName(D.senderSignature || D.senderName),
    date: D.birthdayDate || ''
  };
  // ganti {name}, {firstName}, dst. di dalam teks
  function tpl(s) {
    return String(s == null ? '' : s).replace(/\{(\w+)\}/g, function (m, k) {
      return NAMES[k] != null ? NAMES[k] : m;
    });
  }
  // ambil nilai dari data.js lewat alamat teks: get('cover.title')
  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, D);
  }

  // ---------- gambar + placeholder ----------
  // Kalau file foto tidak ada, tampilkan gambar pink sebagai pengganti
  function placeholderSrc(label, w, h) {
    var s = (w * 0.3) / 24;
    var svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + w + ' ' + h + "'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='" + C.blush + "'/><stop offset='1' stop-color='" + C.pink + "'/></linearGradient></defs>" +
      "<rect width='100%' height='100%' fill='url(#g)'/>" +
      "<g transform='translate(" + (w / 2 - 12 * s) + ' ' + (h / 2 - 12 * s - h * 0.04) + ') scale(' + s + ")'>" +
      "<path fill='" + C.white + "' opacity='.92' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></g>" +
      "<text x='50%' y='" + (h / 2 + h * 0.16) + "' text-anchor='middle' font-family='Georgia,serif' font-style='italic' font-size='" + (w * 0.055) + "' fill='" + C.white + "'>" +
      String(label).replace(/[<>&']/g, '') + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function makeImg(src, alt, cls, label, w, h) {
    var img = document.createElement('img');
    if (cls) img.className = cls;
    img.alt = alt || '';
    img.width = w; img.height = h;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', function () { img.src = placeholderSrc(label, w, h); }, { once: true });
    img.src = src || placeholderSrc(label, w, h);
    return img;
  }

  // ===================================================================
  // 2. TEMA WARNA DARI data.js
  // ===================================================================
  function applyTheme() {
    Object.keys(C).forEach(function (k) {
      root.style.setProperty('--' + k, C[k]);
      root.style.setProperty('--' + k + '-rgb', hexToRgb(C[k]).join(', '));
    });
    // versi lebih gelap untuk teks kecil supaya kontrasnya aman
    root.style.setProperty('--rose-deep', mix(C.rose, '#2b1620', 0.22));
    root.style.setProperty('--mauve-deep', mix(C.mauve, '#2b1620', 0.18));
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', C.blush);
  }

  // ===================================================================
  // 3. MEMBANGUN KONTEN DARI data.js
  // ===================================================================
  function bindTexts() {
    $$('[data-text]').forEach(function (n) {
      var v = get(n.getAttribute('data-text'));
      if (v != null) n.textContent = tpl(v);
    });
    document.title = tpl(D.pageTitle || 'Happy Birthday, {firstName}');
  }

  function buildCover() {
    $('#cover-name').textContent = NAME;
    $('#cover-from').textContent = tpl(D.cover.cardFrom || '');
  }

  function buildHero() {
    var g = D.greeting;
    $('#hero-kicker').textContent = tpl(g.kicker);

    var title = $('#hero-title');
    tpl(g.title).split(/\s+/).forEach(function (w) {
      title.appendChild(el('span', { class: 'word seq', text: w }));
    });

    var nameEl = $('#hero-name');
    NAME.split(/\s+/).forEach(function (w) {
      nameEl.appendChild(el('span', { class: 'word seq', text: w }));
    });
    if (g.emoji) nameEl.appendChild(el('span', { class: 'word word--emoji seq', text: g.emoji, attrs: { 'aria-hidden': 'true' } }));

    $('#cd-label').textContent = tpl(g.countdownLabel);
    $('#cd-today').textContent = tpl(g.todayText);
    var u = g.countdownUnits || {};
    $('#cd-d-l').textContent = u.days || 'DAYS';
    $('#cd-h-l').textContent = u.hours || 'HOURS';
    $('#cd-m-l').textContent = u.minutes || 'MINUTES';
    $('#cd-s-l').textContent = u.seconds || 'SECONDS';
    $('#scroll-cue-text').textContent = tpl(g.scrollHint);

    // beri nomor urut supaya muncul satu per satu (stagger)
    $$('#hero .seq').forEach(function (n, i) { n.style.setProperty('--i', i); });
  }

  function buildMessage() {
    var box = $('#message-lines');
    (D.mainMessage.lines || []).forEach(function (line, i) {
      box.appendChild(el('p', {
        class: 'reveal', text: tpl(line),
        attrs: { 'data-reveal': 'blur' },
        style: { '--d': '60ms' }
      }));
    });
  }

  function buildPhotos() {
    var box = $('#polaroids');
    var rots = (D.memories.rotations && D.memories.rotations.length) ? D.memories.rotations : [-5, 4, -3, 5];

    (D.photos || []).forEach(function (p, i) {
      if (typeof p === 'string') p = { src: p };
      var cap = tpl(p.caption || '');

      var wrap = el('div', {
        class: 'polaroid-wrap reveal',
        attrs: { 'data-reveal': 'up' },
        style: { '--d': (i % 2) * 140 + 'ms' }
      });
      var btn = el('button', {
        class: 'polaroid',
        attrs: { type: 'button', 'aria-pressed': 'false', 'aria-label': cap ? 'Foto ' + (i + 1) + '. ' + cap : 'Foto ' + (i + 1) },
        style: { '--rot': rots[i % rots.length] + 'deg' }
      });
      btn.appendChild(makeImg(p.src, p.alt || 'Foto kenangan ' + (i + 1), 'polaroid__img', 'Foto ' + (i + 1), 800, 1000));
      btn.appendChild(el('span', { class: 'polaroid__cap' },
        el('span', { class: 'polaroid__tap', text: D.memories.tapHint || '' }),
        el('span', { class: 'polaroid__text', text: cap })
      ));
      btn.addEventListener('click', function () { togglePolaroid(btn); });
      wrap.appendChild(btn);
      box.appendChild(wrap);
    });
  }

  function buildTimeline() {
    var list = $('#timeline');
    var T = D.timeline;

    (T.items || []).forEach(function (it, i) {
      var card = el('div', { class: 'glass tl-card' },
        makeImg(it.photo, it.alt || ('Foto ' + tpl(it.title || '')), 'tl-card__img', it.date || 'Kenangan', 800, 600),
        el('span', { class: 'tl-date', text: tpl(it.date || '') }),
        el('h3', { class: 'tl-title', text: tpl(it.title || '') }),
        el('p', { class: 'tl-text', text: tpl(it.caption || '') })
      );
      var li = el('li', { class: 'tl-item reveal', attrs: { 'data-reveal': 'up' } },
        el('span', { class: 'tl-dot', attrs: { 'aria-hidden': 'true' } }, icon('heart')),
        card
      );
      list.appendChild(li);
    });

    // ujung timeline = tempat hati emas rahasia (easter egg)
    var eggBtn = el('button', {
      class: 'egg-heart', attrs: { id: 'egg-btn', type: 'button', 'aria-label': D.easterEgg.ariaLabel || 'Satu kejutan lagi' }
    }, icon('heart'));
    list.appendChild(el('li', { class: 'tl-end reveal', attrs: { 'data-reveal': 'up' } },
      eggBtn,
      el('span', { class: 'tl-end__text', text: tpl(T.endText || '') })
    ));
  }

  function buildLetter() {
    var L = D.letter;
    var paper = $('#letter-paper');
    var items = [{ cls: 'letter__salut', t: L.salutation }];
    (L.paragraphs || []).forEach(function (t) { items.push({ cls: 'letter__p', t: t }); });
    items.push({ cls: 'letter__close', t: L.closing });
    items.push({ cls: 'letter__sign', t: L.signature });

    items.forEach(function (it, i) {
      if (!it.t) return;
      paper.appendChild(el('p', { class: it.cls, text: tpl(it.t), style: { '--i': i } }));
    });
    $('#letter-env').setAttribute('data-label', tpl(L.envelopeHint || ''));
  }

  function buildFinal() {
    var F = D.final;
    $('#final-photo-wrap').appendChild(makeImg(F.photo, F.photoAlt || 'Foto terbaik', '', 'Foto terbaik', 800, 1000));
    $('#final-nick').textContent = NAMES.nickname;
    $('#final-heart').textContent = F.heart || '';
    $('#final-sign').textContent = tpl(F.signature);
  }

  // ===================================================================
  // 4. ELEMEN MELAYANG (hati, bunga, kilau) — CSS yang menganimasikan
  // ===================================================================
  function spawnFloaters(container, drift, twinkles) {
    if (reduceMotion) return;
    var cols = [C.pink, C.rose, C.blush, C.mauve, C.gold];
    var kinds = ['heart', 'heart', 'flower', 'sparkle'];
    var i, n, dur;

    for (i = 0; i < drift; i++) {
      dur = rand(16, 30);
      n = el('span', {
        class: 'floater',
        style: {
          '--x': rand(2, 96).toFixed(1) + '%',
          '--s': rand(11, 26).toFixed(0) + 'px',
          '--dur': dur.toFixed(1) + 's',
          '--delay': (-rand(0, dur)).toFixed(1) + 's',
          '--sway': rand(-46, 46).toFixed(0) + 'px',
          '--rot': rand(-40, 40).toFixed(0) + 'deg',
          '--o': rand(0.22, 0.5).toFixed(2),
          '--c': pick(cols)
        }
      }, icon(pick(kinds)));
      container.appendChild(n);
    }
    for (i = 0; i < twinkles; i++) {
      dur = rand(3, 6);
      n = el('span', {
        class: 'twinkle',
        style: {
          '--x': rand(3, 94).toFixed(1) + '%',
          '--y': rand(4, 92).toFixed(1) + '%',
          '--s': rand(8, 16).toFixed(0) + 'px',
          '--dur': dur.toFixed(1) + 's',
          '--delay': (-rand(0, dur)).toFixed(1) + 's'
        }
      }, icon('sparkle'));
      container.appendChild(n);
    }
  }

  // ===================================================================
  // 5. CONFETTI (canvas buatan sendiri — tanpa library)
  //    Hanya berjalan saat ada partikel, lalu berhenti total.
  // ===================================================================
  var Confetti = (function () {
    var canvas = $('#confetti');
    var ctx = canvas.getContext('2d');
    var HEART = new Path2D('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
    var w = 0, h = 0, parts = [], raf = 0, last = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function shape(heartBias) {
      var r = Math.random();
      if (r < heartBias) return 2;   // hati
      return r < 0.62 ? 0 : 1;       // 0 = kertas, 1 = bulat
    }

    function make(x, y, vx, vy, heartBias, maxLife) {
      var cols = [C.pink, C.rose, C.gold, C.mauve, C.blush, C.pink];
      return {
        x: x, y: y, vx: vx, vy: vy,
        rot: rand(0, 6.28), vr: rand(-0.3, 0.3),
        size: rand(6, 13), color: pick(cols),
        shape: shape(heartBias), life: 0, max: maxLife, wob: rand(0, 6.28)
      };
    }

    // ledakan dari satu titik. x,y = 0..1 (posisi relatif layar)
    function burst(o) {
      if (reduceMotion) return;
      o = o || {};
      var count = Math.round((o.count || 90) * (isSmall ? 0.7 : 1));
      var cx = (o.x == null ? 0.5 : o.x) * w, cy = (o.y == null ? 0.5 : o.y) * h;
      var angle = ((o.angle == null ? -90 : o.angle) * Math.PI) / 180;
      var spread = ((o.spread == null ? 90 : o.spread) * Math.PI) / 180;
      var power = o.power || 13;
      for (var i = 0; i < count; i++) {
        var a = angle + (Math.random() - 0.5) * spread;
        var v = power * (0.45 + Math.random() * 0.75);
        parts.push(make(cx, cy, Math.cos(a) * v, Math.sin(a) * v, o.heartBias == null ? 0.2 : o.heartBias, rand(150, 230)));
      }
      start();
    }

    // hujan pelan dari atas layar
    function rain(count) {
      if (reduceMotion) return;
      count = Math.round(count * (isSmall ? 0.7 : 1));
      for (var i = 0; i < count; i++) {
        (function () {
          setTimeout(function () {
            parts.push(make(rand(0, w), -20, rand(-1, 1), rand(1.5, 3.5), 0.25, rand(260, 380)));
            start();
          }, rand(0, 2200));
        })();
      }
    }

    function tick(t) {
      var dt = Math.min((t - last) / 16.67, 3) || 1;
      last = t;
      ctx.clearRect(0, 0, w, h);

      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life += dt;
        p.vx *= Math.pow(0.96, dt);
        p.vy = p.vy * Math.pow(0.96, dt) + 0.15 * dt;
        p.x += p.vx * dt + Math.sin(p.wob + p.life * 0.08) * 0.6;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;

        if (p.life > p.max || p.y > h + 30) { parts.splice(i, 1); continue; }

        var fadeStart = p.max * 0.75;
        var alpha = p.life > fadeStart ? 1 - (p.life - fadeStart) / (p.max - fadeStart) : 1;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 0) {
          var hh = p.size * 0.55 * Math.cos(p.life * 0.14 + p.wob);
          ctx.fillRect(-p.size / 2, -hh / 2, p.size, hh);
        } else if (p.shape === 1) {
          ctx.beginPath(); ctx.arc(0, 0, p.size * 0.38, 0, 6.2832); ctx.fill();
        } else {
          var s = (p.size * 1.5) / 24;
          ctx.scale(s, s); ctx.translate(-12, -12); ctx.fill(HEART);
        }
        ctx.restore();
      }

      if (parts.length) { raf = requestAnimationFrame(tick); }
      else { raf = 0; ctx.clearRect(0, 0, w, h); }
    }

    function start() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    resize();
    var rt = 0;
    window.addEventListener('resize', function () {
      cancelAnimationFrame(rt);
      rt = requestAnimationFrame(resize);
    });

    return { burst: burst, rain: rain };
  })();

  // posisi tengah elemen, dalam skala 0..1 dari layar
  function originOf(node) {
    var r = node.getBoundingClientRect();
    return { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
  }

  // ===================================================================
  // 6. SCROLL REVEAL (IntersectionObserver)
  //    Elemen berkelas .reveal muncul saat masuk layar.
  // ===================================================================
  var revealEls = [];
  var revealIO = null;
  var onceList = [];
  var onceIO = null;

  function setupReveal() {
    revealEls = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (n) { n.classList.add('is-visible'); });
      return;
    }
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        revealIO.unobserve(e.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (n) { revealIO.observe(n); });

    // "sekali saja" saat elemen terlihat (dipakai untuk confetti di penutup)
    onceIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || !opened) return;
        onceList.forEach(function (it) {
          if (it.el === e.target && !it.fired) { it.fired = true; it.cb(); }
        });
      });
    }, { threshold: 0.6 });
  }

  function onceInView(node, cb) {
    if (!onceIO) return;
    onceList.push({ el: node, cb: cb, fired: false });
    onceIO.observe(node);
  }

  // ===================================================================
  // 7. FOTO POLAROID (tap = tampilkan caption)
  // ===================================================================
  function togglePolaroid(btn) {
    var willOpen = !btn.classList.contains('is-active');
    deactivatePolaroids();
    if (willOpen) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
    }
  }
  function deactivatePolaroids() {
    $$('.polaroid.is-active').forEach(function (b) {
      b.classList.remove('is-active');
      b.setAttribute('aria-pressed', 'false');
    });
  }

  // ===================================================================
  // 8. MUSIK (baru mulai setelah user menekan "Open Your Gift")
  // ===================================================================
  var audio = $('#bgm');
  var musicUI = $('#music');
  var toggleBtn = $('#music-toggle');
  var muteBtn = $('#music-mute');
  var muteIcon = $('#music-mute-icon');
  var musicOK = !!(D.music && D.music.src);
  var resumeAfterHidden = false;

  function setPlayingUI(on) {
    musicUI.classList.toggle('is-playing', on);
    toggleBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', on ? 'Jeda musik' : 'Putar musik');
  }
  function setMuteUI() {
    muteIcon.setAttribute('href', audio.muted ? '#i-speaker-off' : '#i-speaker');
    muteBtn.setAttribute('aria-pressed', audio.muted ? 'true' : 'false');
    muteBtn.setAttribute('aria-label', audio.muted ? 'Nyalakan suara' : 'Matikan suara');
  }

  function setupMusic() {
    if (!musicOK) { musicUI.hidden = true; return; }
    audio.src = D.music.src;
    audio.volume = clamp(D.music.volume == null ? 0.55 : D.music.volume, 0, 1);
    audio.addEventListener('play', function () { setPlayingUI(true); });
    audio.addEventListener('pause', function () { setPlayingUI(false); });
    audio.addEventListener('error', function () {
      // file musik tidak ada / format tidak didukung -> sembunyikan kontrol, website tetap jalan
      musicOK = false;
      musicUI.hidden = true;
      console.info('[birthday] File musik tidak bisa dimuat: ' + D.music.src);
    });

    toggleBtn.addEventListener('click', function () {
      if (audio.paused) { var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
      else { audio.pause(); }
    });
    muteBtn.addEventListener('click', function () { audio.muted = !audio.muted; setMuteUI(); });

    // jeda otomatis saat tab/aplikasi disembunyikan
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (!audio.paused) { resumeAfterHidden = true; audio.pause(); }
      } else if (resumeAfterHidden) {
        resumeAfterHidden = false;
        var p = audio.play(); if (p && p.catch) p.catch(function () {});
      }
    });
    setMuteUI();
  }

  function startMusic() {
    if (!musicOK) return;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setPlayingUI(false); });
  }
  function stopMusic() {
    if (!musicOK) return;
    audio.pause();
    try { audio.currentTime = 0; } catch (e) { /* abaikan */ }
    audio.muted = false;
    setMuteUI();
  }

  // ===================================================================
  // 9. URUTAN PEMBUKAAN (buka gift)
  // ===================================================================
  var cover = $('#cover');
  var coverEnv = $('#cover-envelope');
  var openBtn = $('#open-btn');
  var hero = $('#hero');
  var mainEl = $('#story');
  var opened = false;
  var session = 0; // naik setiap replay, untuk membatalkan urutan lama

  async function openGift() {
    if (opened) return;
    opened = true;
    var my = ++session;
    var fast = reduceMotion;

    // 1) langsung di dalam event klik, supaya browser mengizinkan musik
    startMusic();
    openBtn.disabled = true;
    coverEnv.classList.add('is-open');
    cover.classList.add('is-open');

    // 2) kartu naik -> confetti
    await sleep(fast ? 120 : 800);
    if (my !== session) return;
    var o = originOf(coverEnv);
    Confetti.burst({ x: o.x, y: o.y - 0.06, count: 110, spread: 110, power: 14, heartBias: 0.3 });

    // 3) cover memudar, halaman utama muncul
    await sleep(fast ? 120 : 1500);
    if (my !== session) return;
    window.scrollTo(0, 0);
    root.classList.remove('is-locked');
    cover.classList.add('is-leaving');
    if (musicOK) musicUI.classList.add('is-visible');

    await sleep(fast ? 50 : 450);
    if (my !== session) return;
    hero.classList.add('is-live');
    typeSubtitle();
    startCountdown();
    Confetti.burst({ x: 0.5, y: 0.28, count: 90, spread: 150, power: 12 });
    mainEl.focus({ preventScroll: true });

    await sleep(fast ? 50 : 1000);
    if (my !== session) return;
    cover.hidden = true;
  }

  // efek mengetik untuk subjudul greeting
  var typeToken = 0;
  async function typeSubtitle() {
    var node = $('#hero-sub');
    var text = tpl(D.greeting.subtitle);
    var my = ++typeToken;
    node.textContent = '';
    if (reduceMotion) { node.textContent = text; return; }
    var idx = Number(node.style.getPropertyValue('--i')) || 0;
    await sleep(idx * 170 + 600);
    if (my !== typeToken) return;
    node.classList.add('is-typing');
    var chars = Array.from(text);
    for (var i = 0; i < chars.length; i++) {
      if (my !== typeToken) return;
      node.textContent += chars[i];
      await sleep(56);
    }
    node.classList.remove('is-typing');
  }

  // ===================================================================
  // 10. COUNTDOWN
  // ===================================================================
  var cdTimer = 0;
  function startCountdown() {
    clearInterval(cdTimer);
    var box = $('#countdown');
    var target = Date.parse(D.birthdayISO);
    if (isNaN(target)) { box.hidden = true; return; }

    var elD = $('#cd-d'), elH = $('#cd-h'), elM = $('#cd-m'), elS = $('#cd-s');
    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {            // hari H atau sudah lewat
        box.classList.add('is-today');
        clearInterval(cdTimer);
        return;
      }
      box.classList.remove('is-today');
      var s = Math.floor(diff / 1000);
      elD.textContent = pad(Math.floor(s / 86400));
      elH.textContent = pad(Math.floor((s % 86400) / 3600));
      elM.textContent = pad(Math.floor((s % 3600) / 60));
      elS.textContent = pad(s % 60);
    }
    tick();
    cdTimer = setInterval(tick, 1000);
  }

  // ===================================================================
  // 11. SURAT
  // ===================================================================
  var letterEnv = $('#letter-env');
  var letterWrap = $('#letter-wrap');
  var letterHint = $('#letter-hint');
  var letterOpen = false;

  async function openLetter() {
    if (letterOpen) return;
    letterOpen = true;
    letterEnv.classList.add('is-open');
    letterEnv.setAttribute('aria-expanded', 'true');
    var o = originOf(letterEnv);
    Confetti.burst({ x: o.x, y: o.y, count: 36, spread: 120, power: 9, heartBias: 0.75 });
    await sleep(reduceMotion ? 0 : 650);
    letterWrap.classList.add('is-open');
    letterHint.textContent = tpl(D.letter.openedHint || '');
  }
  function closeLetter() {
    letterOpen = false;
    letterEnv.classList.remove('is-open');
    letterEnv.setAttribute('aria-expanded', 'false');
    letterWrap.classList.remove('is-open');
    letterHint.textContent = '';
  }

  // ===================================================================
  // 12. KUE & LILIN
  // ===================================================================
  var cakeSvg = $('#cake-svg');
  var cakeStage = $('#cake-stage');
  var cakeText = $('#cake-text');
  var wishBtn = $('#wish-btn');
  var relightBtn = $('#relight-btn');
  var blown = false;

  function sparklesAround(n) {
    var cols = [C.gold, C.pink, C.rose, C.mauve];
    for (var i = 0; i < n; i++) {
      var s = el('span', {
        class: 'sparkle',
        style: {
          '--x': rand(-8, 98).toFixed(0) + '%',
          '--y': rand(-6, 90).toFixed(0) + '%',
          '--s': rand(12, 24).toFixed(0) + 'px',
          '--c': pick(cols)
        }
      }, icon('sparkle'));
      s.style.animationDelay = rand(0, 0.7).toFixed(2) + 's';
      s.addEventListener('animationend', function () { this.remove(); });
      cakeStage.appendChild(s);
    }
  }

  function balloons() {
    if (reduceMotion) return;
    var cols = [C.pink, C.rose, C.blush, C.mauve, C.gold];
    var n = isSmall ? 6 : 9;
    for (var i = 0; i < n; i++) {
      var b = el('div', {
        class: 'balloon',
        style: {
          '--x': rand(4, 90).toFixed(0) + 'vw',
          '--dur': rand(5.5, 8).toFixed(1) + 's',
          '--delay': rand(0, 1).toFixed(2) + 's',
          '--sway': rand(-40, 40).toFixed(0) + 'px',
          '--c': cols[i % cols.length]
        },
        attrs: { 'aria-hidden': 'true' }
      }, icon('balloon'));
      b.addEventListener('animationend', function () { this.remove(); });
      document.body.appendChild(b);
    }
  }

  function blowCandles() {
    if (blown) return;
    blown = true;
    cakeSvg.classList.add('is-blown');
    cakeText.textContent = tpl(D.cake.doneText);
    cakeText.classList.remove('is-done');
    void cakeText.offsetWidth;             // restart animasi
    cakeText.classList.add('is-done');
    wishBtn.hidden = true;
    relightBtn.hidden = false;

    var o = originOf(cakeStage);
    Confetti.burst({ x: o.x, y: o.y - 0.08, count: 120, spread: 130, power: 15, heartBias: 0.25 });
    sparklesAround(isSmall ? 9 : 14);
    balloons();
  }

  function relightCandles() {
    blown = false;
    cakeSvg.classList.remove('is-blown');
    cakeText.classList.remove('is-done');
    cakeText.textContent = '';
    wishBtn.hidden = false;
    relightBtn.hidden = true;
  }

  // ===================================================================
  // 13. EASTER EGG (hati emas di ujung timeline)
  // ===================================================================
  var eggDialog = $('#egg');
  function openEgg() {
    if (typeof eggDialog.showModal === 'function') eggDialog.showModal();
    else eggDialog.setAttribute('open', '');
  }
  function closeEgg() {
    if (typeof eggDialog.close === 'function') { if (eggDialog.open) eggDialog.close(); }
    else eggDialog.removeAttribute('open');
  }

  // ===================================================================
  // 14. REPLAY & START
  // ===================================================================
  function replay() {
    session++;                         // batalkan urutan pembukaan yang masih jalan
    typeToken++;
    stopMusic();
    musicUI.classList.remove('is-visible', 'is-playing');
    setPlayingUI(false);

    hero.classList.remove('is-live');
    $('#hero-sub').textContent = '';
    $('#hero-sub').classList.remove('is-typing');
    clearInterval(cdTimer);

    closeLetter();
    relightCandles();
    deactivatePolaroids();
    closeEgg();

    // reveal & confetti penutup bisa muncul lagi
    revealEls.forEach(function (n) {
      n.classList.remove('is-visible');
      if (revealIO) revealIO.observe(n);
    });
    onceList.forEach(function (it) { it.fired = false; });

    // kembali ke atas tanpa animasi scroll
    root.classList.add('is-locked');
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    requestAnimationFrame(function () { root.style.scrollBehavior = ''; });

    // tampilkan cover lagi dengan fade-in
    cover.hidden = false;
    cover.classList.add('is-leaving');
    void cover.offsetWidth;
    cover.classList.remove('is-leaving', 'is-open');
    coverEnv.classList.remove('is-open');
    openBtn.disabled = false;
    opened = false;
  }

  function onActivate(node, fn) {
    node.addEventListener('click', fn);
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
    });
  }

  function init() {
    applyTheme();
    bindTexts();
    buildCover();
    buildHero();
    buildMessage();
    buildPhotos();
    buildTimeline();
    buildLetter();
    buildFinal();

    // dekorasi (lebih sedikit di HP)
    spawnFloaters($('#floaters'), isSmall ? 9 : 16, isSmall ? 7 : 13);
    spawnFloaters($('#cover-floaters'), isSmall ? 8 : 12, isSmall ? 6 : 10);

    setupReveal();
    setupMusic();

    // ----- pembukaan -----
    openBtn.addEventListener('click', openGift);
    onActivate(coverEnv, openGift);

    // ----- hero -----
    $('#scroll-cue').addEventListener('click', function () {
      $('#message').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    // ----- surat -----
    onActivate(letterEnv, openLetter);

    // ----- kue -----
    wishBtn.addEventListener('click', blowCandles);
    relightBtn.addEventListener('click', relightCandles);
    $$('.candle').forEach(function (c) { onActivate(c, blowCandles); });

    // ----- easter egg -----
    $('#egg-btn').addEventListener('click', openEgg);
    $('#egg-close').addEventListener('click', closeEgg);
    eggDialog.addEventListener('click', function (e) { if (e.target === eggDialog) closeEgg(); });

    // ----- penutup -----
    onceInView($('#final-title'), function () { Confetti.rain(isSmall ? 45 : 80); });
    $('#replay-btn').addEventListener('click', replay);
  }

  init();
})();
