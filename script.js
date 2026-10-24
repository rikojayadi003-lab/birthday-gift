/* =========================================================
   SCRIPT — logika & animasi
   Konten TIDAK ditulis di sini; semua diambil dari data.js
   ========================================================= */
(() => {
  const D = birthdayData;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = innerWidth < 600;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);

  // ---------- 0. Warna dari config -> CSS variables ----------
  Object.entries(D.colors || {}).forEach(([k, v]) => document.documentElement.style.setProperty('--' + k, v));
  const palette = () => ['pink', 'rose', 'blush', 'mauve', 'gold', 'white'].map(k => D.colors[k]);

  // ---------- Helper ----------
  const titleCase = s => s.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const setText = (id, t) => { $('#' + id).textContent = t; };

  // Placeholder bila foto belum diganti / tidak ditemukan
  function placeholder(label) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${D.colors.blush}"/><stop offset="1" stop-color="${D.colors.pink}"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g)"/>
      <text x="200" y="230" font-size="70" text-anchor="middle" fill="${D.colors.white}">♥</text>
      <text x="200" y="290" font-size="20" text-anchor="middle" fill="${D.colors.text}" font-family="sans-serif">Ganti foto ini:</text>
      <text x="200" y="320" font-size="18" text-anchor="middle" fill="${D.colors.text}" font-family="sans-serif">${esc(label)}</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function img(el, src, alt) {
    el.alt = alt || '';
    el.onerror = () => { el.onerror = null; el.src = placeholder(src.split('/').pop()); };
    el.src = src;
  }

  // ---------- 1. Isi konten dari config ----------
  const fullName = titleCase(D.recipientName);
  document.title = `Happy Birthday, ${D.recipientShortName} 🎁`;
  setText('openingText', D.openingText);
  setText('envCardText', D.envelopeCardText);
  setText('openBtn', D.openButtonText);
  setText('dateLine', D.birthdayDate);
  setText('greetName', fullName);
  setText('photoTitle', D.photosTitle);
  setText('photoSub', D.photosSub);
  setText('tlTitle', D.timelineTitle);
  setText('letterTitle', D.letterTitle);
  setText('letterHint', D.letterHint);
  setText('cakeTitle', D.cakeTitle);
  setText('cakeHint', D.cakeHint);
  setText('wishBtn', D.cakeButton);
  setText('finalTitle', `Happy Birthday, ${D.nickname} ❤️`);
  setText('finalMsg', D.finalMessage);
  setText('sign', '— ' + D.signatureName);
  setText('replayBtn', D.replayText);
  setText('mTitle', D.easterEgg.title);
  setText('mMsg', D.easterEgg.message);
  setText('mClose', D.easterEgg.close);
  img($('#finalImg'), D.finalPhoto.src, D.finalPhoto.alt);

  // Pesan utama (baris demi baris)
  $('#msgLines').innerHTML = D.mainMessage
    .map((t, i) => `<p class="reveal" style="--d:${i * 0.35}s">${esc(t)}</p>`).join('');

  // Polaroid
  const rots = [-5, 4, -3, 5, -4, 3];
  const pols = $('#polaroids');
  D.photos.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pol reveal';
    b.dataset.reveal = i % 2 ? 'right' : 'left';
    b.style.setProperty('--rot', rots[i % rots.length] + 'deg');
    b.style.setProperty('--d', (i * 0.12) + 's');
    b.setAttribute('aria-label', `${p.alt}. ${p.caption}`);
    const im = document.createElement('img');
    im.loading = 'lazy'; im.decoding = 'async';
    img(im, p.src, p.alt);
    const cap = document.createElement('span');
    cap.className = 'cap'; cap.textContent = p.caption;
    b.append(im, cap);
    b.addEventListener('click', () => {
      const was = b.classList.contains('active');
      $$('.pol.active').forEach(x => x.classList.remove('active'));
      if (!was) b.classList.add('active');
    });
    pols.append(b);
  });

  // Timeline
  $('#tl').innerHTML = D.timeline.map((t, i) => `
    <li class="reveal" data-reveal="${i % 2 ? 'right' : 'left'}">
      <div class="tl-card"><img loading="lazy" decoding="async" alt="" data-src="${esc(t.photo)}">
        <div class="tl-body"><p class="tl-date">${esc(t.date)}</p><h3 class="tl-title">${esc(t.title)}</h3><p class="tl-cap">${esc(t.caption)}</p></div>
      </div></li>`).join('');
  $$('#tl img').forEach(el => img(el, el.dataset.src, ''));

  // Surat
  $('#paperInner').innerHTML = D.loveLetter.map((t, i) => `<p style="--i:${i}">${esc(t)}</p>`).join('') +
    `<p style="--i:${D.loveLetter.length}">${esc(D.signatureName)}</p>`;

  // ---------- 2. Dekorasi mengambang ----------
  function buildFloaters() {
    const box = $('#floaters');
    const glyphs = ['♥', '♥', '✦', '❀', '♥', '✧'];
    const n = isSmall ? 9 : 16;
    const cols = [D.colors.pink, D.colors.rose, D.colors.mauve, D.colors.gold, D.colors.blush];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'fl'; s.textContent = glyphs[i % glyphs.length];
      s.style.cssText = `--x:${rand(2, 96)}%;--s:${rand(12, 26)}px;--c:${cols[i % cols.length]};--o:${rand(.25, .5)};--t:${rand(16, 30)}s;--dl:${-rand(0, 28)}s;--dx:${rand(-60, 60)}px;--r:${rand(-60, 60)}deg`;
      box.append(s);
    }
    for (let i = 0; i < (isSmall ? 5 : 9); i++) {
      const s = document.createElement('span');
      s.className = 'fl star'; s.textContent = '✦';
      s.style.cssText = `--x:${rand(3, 95)}%;--y:${rand(4, 92)}%;--s:${rand(8, 16)}px;--c:${D.colors.gold};--o:${rand(.4, .8)};--t:${rand(3, 6)}s;--dl:${-rand(0, 6)}s`;
      box.append(s);
    }
  }
  buildFloaters();

  // ---------- 3. Confetti (canvas ringan, berhenti sendiri) ----------
  const cv = $('#confetti'), ctx = cv.getContext('2d');
  let parts = [], raf = 0;
  function sizeCanvas() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener('resize', sizeCanvas); sizeCanvas();

  function confetti({ count = 80, x = 0.5, y = 0.5, power = 1 } = {}) {
    if (reduceMotion) count = Math.ceil(count / 4);
    if (isSmall) count = Math.ceil(count * .75);
    const cols = palette();
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2), v = rand(4, 12) * power;
      parts.push({
        x: x * innerWidth, y: y * innerHeight,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - rand(3, 7),
        w: rand(6, 11), h: rand(4, 8), rot: rand(0, 6.28), vr: rand(-.2, .2),
        c: cols[i % cols.length], shape: i % 4, life: rand(90, 160), age: 0
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function heartPath(c, s) {
    c.beginPath(); c.moveTo(0, s * .35);
    c.bezierCurveTo(-s, -s * .3, -s * .5, -s, 0, -s * .4);
    c.bezierCurveTo(s * .5, -s, s, -s * .3, 0, s * .35); c.fill();
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.age < p.life && p.y < innerHeight + 30);
    for (const p of parts) {
      p.age++; p.vy += .22; p.vx *= .985; p.vy *= .985;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, (p.life - p.age) / 40);
      ctx.fillStyle = p.c;
      if (p.shape === 0) ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.h / 1.6, 0, 6.28); ctx.fill(); }
      else if (p.shape === 2) heartPath(ctx, p.w * .9);
      else ctx.fillRect(-p.h / 2, -p.w / 2, p.h, p.w);
      ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
  const celebrate = (n = 90) => {
    confetti({ count: n, x: .5, y: .45, power: 1.1 });
    setTimeout(() => confetti({ count: n * .5, x: .15, y: .6 }), 250);
    setTimeout(() => confetti({ count: n * .5, x: .85, y: .6 }), 400);
  };

  // ---------- 4. Musik ----------
  const bgm = $('#bgm'), mBtn = $('#musicBtn'), muBtn = $('#muteBtn'), mCtl = $('#musicCtl');

bgm.volume = 1;
bgm.load();
  const syncMusic = () => mBtn.classList.toggle('playing', !bgm.paused);
  async function playMusic() {
  try {
    await bgm.play();
    console.log('Musik berhasil diputar');
  } catch (error) {
    console.error('Musik gagal diputar:', error);
  }

  syncMusic();
}
  mBtn.addEventListener('click', () => { bgm.paused ? playMusic() : (bgm.pause(), syncMusic()); });
  muBtn.addEventListener('click', () => {
    bgm.muted = !bgm.muted;
    muBtn.textContent = bgm.muted ? '🔇' : '🔊';
    muBtn.setAttribute('aria-pressed', bgm.muted);
  });
  bgm.addEventListener('error', () => { mCtl.hidden = true; });
  bgm.addEventListener('play', syncMusic); bgm.addEventListener('pause', syncMusic);

  // ---------- 5. Scroll reveal ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        if (e.target.id === 'finalTitle' && !finalFired) { finalFired = true; celebrate(110); }
      }
    });
  }, { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  let finalFired = false;
  const observeAll = () => $$('.reveal').forEach(el => io.observe(el));

  // ---------- 6. Typing + countdown ----------
  let typeToken = 0;
  async function typeText(el, text, speed = 55) {
    const my = ++typeToken; el.textContent = '';
    if (reduceMotion) { el.textContent = text; return; }
    for (const ch of text) {
      if (my !== typeToken) return;
      el.textContent += ch; await wait(speed);
    }
  }
  const target = new Date(D.birthdayISO + 'T00:00:00');
  let cdTimer = 0;
  function renderCountdown() {
    const box = $('#countdown'), diff = target - new Date();
    if (isNaN(target) || diff <= 0) {
      box.innerHTML = `<p class="cd-today">Today is your special day! 🎂</p>`;
      clearInterval(cdTimer); return;
    }
    const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24,
          m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
    const cell = (n, l) => `<div class="cd"><b>${String(n).padStart(2, '0')}</b><span>${l}</span></div>`;
    box.innerHTML = cell(d, 'DAYS') + cell(h, 'HOURS') + cell(m, 'MINUTES') + cell(s, 'SECONDS');
  }

  // ---------- 7. Cake ----------
  const candles = $$('.candle'), wish = $('#wishText');
  function resetWish() { wish.textContent = ''; wish.classList.remove('done'); }
  function blow(c) {
    if (c.classList.contains('out')) return;
    c.classList.add('out');
    const r = c.getBoundingClientRect();
    spark(r.left + r.width / 2, r.top);
    if (candles.every(x => x.classList.contains('out'))) finishWish();
  }
  function spark(x, y) {
    if (reduceMotion) return;
    for (let i = 0; i < 4; i++) {
      const s = document.createElement('span');
      s.className = 'spark'; s.textContent = i % 2 ? '✦' : '✧';
      s.style.cssText = `position:fixed;left:${x + rand(-24, 24)}px;top:${y + rand(-10, 14)}px;font-size:${rand(12, 20)}px;z-index:85;animation-delay:${i * .08}s`;
      document.body.append(s); setTimeout(() => s.remove(), 1500);
    }
  }
  function finishWish() {
    wish.textContent = D.cakeDone; wish.classList.remove('done'); void wish.offsetWidth; wish.classList.add('done');
    $('#wishBtn').hidden = true;
    confetti({ count: 120, x: .5, y: .5, power: 1.2 });
    balloons();
  }
  function balloons() {
    if (reduceMotion) return;
    const cols = palette(); const n = isSmall ? 7 : 11;
    for (let i = 0; i < n; i++) {
      const b = document.createElement('div');
      b.className = 'balloon';
      b.style.cssText = `--x:${rand(2, 92)}%;--w:${rand(38, 60)}px;--c:${cols[i % 5]};--t:${rand(5, 8)}s;--dl:${rand(0, 1.2)}s;--dx:${rand(-40, 40)}px;--r:${rand(-14, 14)}deg`;
      document.body.append(b); setTimeout(() => b.remove(), 10000);
    }
  }
  candles.forEach(c => {
    c.addEventListener('click', () => blow(c));
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blow(c); } });
  });
  $('#wishBtn').addEventListener('click', () => candles.forEach((c, i) => setTimeout(() => blow(c), i * 220)));

  // ---------- 8. Surat ----------
  $('#letterBtn').addEventListener('click', e => {
    const b = e.currentTarget, open = !b.classList.contains('open');
    b.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
    $('#paperWrap').classList.toggle('open', open);
    if (open) { confetti({ count: 24, x: .5, y: .35, power: .6 }); setTimeout(() => $('#paperWrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 500); }
  });

  // ---------- 9. Easter egg ----------
  const modal = $('#modal');
  $('#egg').addEventListener('click', () => { modal.hidden = false; $('#mClose').focus(); confetti({ count: 40, x: .5, y: .4, power: .8 }); });
  const closeModal = () => { modal.hidden = true; $('#egg').focus({ preventScroll: true }); };
  $('#mClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  // ---------- 10. Alur utama: buka / ulang ----------
  const cover = $('#cover'), story = $('#story'), env = $('#envelope');
  let opening = false;

  async function openGift() {
    if (opening) return; opening = true;
    env.classList.add('open');
    playMusic();
    mCtl.hidden = false;
    await wait(reduceMotion ? 200 : 1300);
    celebrate(100);
    await wait(reduceMotion ? 100 : 900);
    cover.classList.add('leaving');
    story.hidden = false;
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
    observeAll();
    renderCountdown(); clearInterval(cdTimer); cdTimer = setInterval(renderCountdown, 1000);
    await wait(900);
    celebrate(60);
    typeText($('#typedSub'), D.greetingSub);
  }
  $('#openBtn').addEventListener('click', openGift);
  env.addEventListener('click', openGift);

  function replay() {
    typeToken++; clearInterval(cdTimer);
    story.hidden = true;
    $$('.reveal.in').forEach(el => el.classList.remove('in'));
    $$('.pol.active').forEach(el => el.classList.remove('active'));
    $('#letterBtn').classList.remove('open'); $('#letterBtn').setAttribute('aria-expanded', 'false');
    $('#paperWrap').classList.remove('open');
    candles.forEach(c => c.classList.remove('out')); resetWish(); $('#wishBtn').hidden = false;
    $('#typedSub').textContent = ''; finalFired = false;
    env.classList.remove('open');
    document.body.classList.add('locked');
    window.scrollTo(0, 0);
    cover.classList.remove('leaving');
    bgm.pause(); bgm.currentTime = 0; syncMusic(); mCtl.hidden = true;
    opening = false;
  }
  $('#replayBtn').addEventListener('click', replay);
})();
