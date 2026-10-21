/* =====================================================
   AnkitX Portfolio - Ankit Sharma
   Cursor, smooth scroll, animations, form
   ===================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var pageLoader = $('#pageLoader');
  if (pageLoader) {
    var loaderStarted = Date.now();
    var loaderHidden = false;
    var loaderFallback;
    function hidePageLoader() {
      if (loaderHidden) return;
      loaderHidden = true;
      clearTimeout(loaderFallback);
      var delay = reduced ? 0 : Math.max(0, 650 - (Date.now() - loaderStarted));
      setTimeout(function () {
        pageLoader.classList.add('is-hidden');
        setTimeout(function () { pageLoader.remove(); }, reduced ? 0 : 700);
      }, delay);
    }
    loaderFallback = setTimeout(hidePageLoader, 8000);
    if (document.readyState === 'complete') hidePageLoader();
    else window.addEventListener('load', hidePageLoader, { once: true });
  }
  var useGsap = !!window.gsap && !reduced;
  if (useGsap) root.classList.add('gsap-ready');
  var PHONE = '919672244908';
  var EMAIL = 'ankitsharma20033@gmail.com';

  /* ---------------------------------------------------
     1. CUSTOM CURSOR + NEON TRAIL
  --------------------------------------------------- */
  var mouse = { x: innerWidth / 2, y: innerHeight / 2, px: 0, py: 0, active: false };
  if (fine) {
    document.body.classList.add('has-cursor');
    var dot = $('#cDot'), ring = $('#cRing'), label = $('#cLabel');
    var rx = mouse.x, ry = mouse.y, lastFrame = 0;
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      mouse.x = e.clientX; mouse.y = e.clientY;
      if (!mouse.active) {
        mouse.active = true;
        dot.style.opacity = ring.style.opacity = 1;
        rx = mouse.x; ry = mouse.y;
      }
    });
    document.addEventListener('pointerleave', function () {
      dot.style.opacity = ring.style.opacity = 0;
      mouse.active = false;
      ring.classList.remove('hover', 'no-label', 'down');
      label.textContent = '';
    });
    document.addEventListener('mousedown', function () { ring.classList.add('down'); });
    document.addEventListener('mouseup', function () { ring.classList.remove('down'); });
    document.addEventListener('pointerover', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var target = e.target;
      var el = target instanceof Element && target.closest('a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]), [data-cursor]');
      if (el) {
        var txt = el.getAttribute('data-cursor');
        label.textContent = txt || '';
        ring.classList.add('hover');
        ring.classList.toggle('no-label', !txt);
      } else {
        ring.classList.remove('hover', 'no-label');
        label.textContent = '';
      }
    });
    (function loop(now) {
      var elapsed = lastFrame ? Math.min(now - lastFrame, 50) : 16.7;
      lastFrame = now;
      var follow = 1 - Math.exp(-elapsed / 45);
      rx += (mouse.x - rx) * follow;
      ry += (mouse.y - ry) * follow;
      dot.style.transform = 'translate3d(' + mouse.x + 'px,' + mouse.y + 'px,0) translate(-50%,-50%)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)' + (ring.classList.contains('down') ? ' scale(.8)' : '');
      requestAnimationFrame(loop);
    })(performance.now());

    // neon trail
    var tc = $('#trail'), tx = tc.getContext('2d'), pts = [];
    function sizeTrail() { var d = Math.min(devicePixelRatio || 1, 2); tc.width = innerWidth * d; tc.height = innerHeight * d; tx.setTransform(d, 0, 0, d, 0, 0); }
    sizeTrail(); addEventListener('resize', sizeTrail);
    var hue = 0;
    (function trail() {
      if (mouse.active && !reduced) pts.push({ x: mouse.x, y: mouse.y, life: 1, h: hue });
      hue = (hue + 3) % 360;
      tx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = pts.length - 1; i >= 0; i--) {
        var p = pts[i]; p.life -= 0.035;
        if (p.life <= 0) { pts.splice(i, 1); continue; }
      }
      if (pts.length > 1) {
        for (var j = 1; j < pts.length; j++) {
          var a = pts[j - 1], b = pts[j];
          tx.strokeStyle = 'hsla(0,0%,' + (78 + 14 * Math.sin(a.h * Math.PI / 90)) + '%,' + (b.life * 0.35) + ')';
          tx.lineWidth = b.life * 5; tx.lineCap = 'round';
          tx.shadowColor = 'rgba(255,255,255,.45)'; tx.shadowBlur = 10;
          tx.beginPath(); tx.moveTo(a.x, a.y); tx.lineTo(b.x, b.y); tx.stroke();
        }
      }
      requestAnimationFrame(trail);
    })();

    // click burst
    document.addEventListener('click', function (e) {
      if (reduced) return;
      for (var i = 0; i < 12; i++) {
        var s = document.createElement('i');
        var ang = (Math.PI * 2 * i) / 12, dist = 30 + Math.random() * 30;
        s.style.cssText = 'position:fixed;z-index:2600;pointer-events:none;width:6px;height:6px;border-radius:50%;left:' + e.clientX + 'px;top:' + e.clientY + 'px;background:' + (i % 2 ? '#bfc0bf' : '#f2f2f0') + ';box-shadow:0 0 10px currentColor;transition:transform .6s cubic-bezier(.1,.8,.3,1),opacity .6s;';
        document.body.appendChild(s);
        requestAnimationFrame((function (el, a, d) { return function () { el.style.transform = 'translate(' + Math.cos(a) * d + 'px,' + Math.sin(a) * d + 'px) scale(.2)'; el.style.opacity = 0; }; })(s, ang, dist));
        setTimeout((function (el) { return function () { el.remove(); }; })(s), 650);
      }
    });
  }

  /* ---------------------------------------------------
     4. BACKGROUND PARTICLE NETWORK
  --------------------------------------------------- */
  (function () {
    var c = $('#bg'), x = c.getContext('2d'), W, H, parts = [], D;
    function size() {
      D = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
      c.width = W * D; c.height = H * D; x.setTransform(D, 0, 0, D, 0, 0);
      var n = Math.min(90, Math.floor(W * H / 16000));
      parts = [];
      for (var i = 0; i < n; i++) parts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.8 + .8, c: i % 3 });
    }
    size(); addEventListener('resize', size);
    var cols = ['220,220,218', '162,163,162', '245,245,242'];
    function draw() {
      x.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        var dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.sqrt(dx * dx + dy * dy);
        if (mouse.active && d < 160) { p.x -= dx / d * 0.9; p.y -= dy / d * 0.9; }
        x.fillStyle = 'rgba(' + cols[p.c] + ',.75)';
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill();
        for (var j = i + 1; j < parts.length; j++) {
          var q = parts[j], ax = p.x - q.x, ay = p.y - q.y, dd = ax * ax + ay * ay;
          if (dd < 14400) {
            x.strokeStyle = 'rgba(' + cols[p.c] + ',' + (0.16 * (1 - dd / 14400)) + ')';
            x.lineWidth = 1; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
          }
        }
        if (mouse.active && d < 190) {
          x.strokeStyle = 'rgba(220,220,218,' + (0.24 * (1 - d / 190)) + ')';
          x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(mouse.x, mouse.y); x.stroke();
        }
      }
      requestAnimationFrame(draw);
    }
    if (!reduced) draw();
  })();

  /* ---------------------------------------------------
     5. SMOOTH SCROLL
  --------------------------------------------------- */
  var smooth = !reduced && fine;
  var sTarget = scrollY, sCur = scrollY, sAnim = false;
  function maxScroll() { return Math.max(0, document.documentElement.scrollHeight - innerHeight); }
  function sLoop() {
    var diff = sTarget - sCur;
    if (Math.abs(diff) < 0.4) { sCur = sTarget; window.scrollTo(0, sCur); sAnim = false; return; }
    sCur += diff * 0.1; window.scrollTo(0, sCur);
    requestAnimationFrame(sLoop);
  }
  function sGo(y) { sTarget = Math.max(0, Math.min(maxScroll(), y)); if (!sAnim) { sAnim = true; sCur = scrollY; requestAnimationFrame(sLoop); } }
  if (smooth) {
    addEventListener('wheel', function (e) {
      if (e.ctrlKey || document.body.style.overflow === 'hidden') return;
      e.preventDefault();
      var d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      if (!sAnim) sTarget = scrollY;
      sGo(sTarget + d);
    }, { passive: false });
    addEventListener('scroll', function () { if (!sAnim) { sTarget = sCur = scrollY; } }, { passive: true });
    addEventListener('keydown', function () { if (!sAnim) sTarget = sCur = scrollY; });
  }
  function goTo(y) { if (smooth) sGo(y); else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' }); }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var el = $(id); if (!el) return;
      e.preventDefault();
      goTo(id === '#home' ? 0 : el.getBoundingClientRect().top + scrollY - 70);
      closeMenu();
    });
  });

  /* ---------------------------------------------------
     4. NAVBAR, PROGRESS, ACTIVE LINK
  --------------------------------------------------- */
  var nav = $('#nav'), progress = $('#progress'), links = $$('.nav-links a');
  var secs = links.map(function (a) { return $(a.getAttribute('href')); });
  function onScroll() {
    var y = scrollY, m = maxScroll();
    nav.classList.toggle('scrolled', y > 20);
    progress.style.transform = 'scaleX(' + (m ? y / m : 0) + ')';
    var cur = 0;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var burger = $('#burger'), menu = $('#navLinks');
  function closeMenu() { burger.classList.remove('open'); menu.classList.remove('open'); }
  burger.addEventListener('click', function () { burger.classList.toggle('open'); menu.classList.toggle('open'); });

  var dock = $('.dock'), dockTrigger = $('#dockTrigger');
  var desktopDock = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1025px)');
  if (dock && dockTrigger && desktopDock.matches) {
    function updateDockState() {
      var isOpen = dock.matches(':hover') || dock.contains(document.activeElement);
      dockTrigger.setAttribute('aria-expanded', String(isOpen));
      dockTrigger.setAttribute('aria-label', isOpen ? 'Social links open' : 'Open social links');
    }
    dock.addEventListener('pointerenter', updateDockState);
    dock.addEventListener('pointerleave', updateDockState);
    dock.addEventListener('focusin', updateDockState);
    dock.addEventListener('focusout', function () { setTimeout(updateDockState, 0); });
    desktopDock.addEventListener('change', function (event) {
      if (!event.matches) {
        dockTrigger.setAttribute('aria-expanded', 'false');
        dockTrigger.setAttribute('aria-label', 'Open social links');
      }
    });
  }

  // text scramble on nav hover
  var chars = '01<>/{}[]#$%&*';
  links.forEach(function (a) {
    var orig = a.textContent, timer;
    a.addEventListener('mouseenter', function () {
      var i = 0; clearInterval(timer);
      timer = setInterval(function () {
        a.textContent = orig.split('').map(function (ch, k) { return k < i ? ch : chars[Math.floor(Math.random() * chars.length)]; }).join('');
        if (i++ >= orig.length) { clearInterval(timer); a.textContent = orig; }
      }, 35);
    });
  });

  /* ---------------------------------------------------
     5. TYPING EFFECT
  --------------------------------------------------- */
  (function () {
    var el = $('#typed'), words = ['Web Developer', 'Python & Django Builder', 'Frontend Animator', 'AI-assisted Coder', 'Idea â†’ Reality'];
    var w = 0, c = 0, del = false;
    if (reduced) { el.textContent = words[0]; return; }
    (function tick() {
      var word = words[w];
      el.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1500); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 75);
    })();
  })();

  /* ---------------------------------------------------
     6. REVEAL ON SCROLL + COUNTERS
  --------------------------------------------------- */
  var revealStarted = false;
  function startReveal() {
    if (revealStarted) return; revealStarted = true;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        if (useGsap && en.target.classList.contains('reveal')) {
          var delay = parseFloat(en.target.style.getPropertyValue('--d')) || 0;
          window.gsap.fromTo(en.target,
            { autoAlpha: 0, y: 20, filter: 'blur(2px)' },
            { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .7, delay: delay, ease: 'power3.out', overwrite: 'auto', clearProps: 'opacity,visibility,transform,filter' }
          );
        }
        io.unobserve(en.target);
        $$('[data-count]', en.target).forEach(count);
        if (en.target.hasAttribute('data-count')) count(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(function (el, i) {
      // stagger siblings
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--d', Math.min(sib, 6) * 0.08 + 's');
      io.observe(el);
    });
    $$('.stat b').forEach(function (b) { io.observe(b); });
  }
  function count(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    var to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1400;
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  startReveal();

  /* ---------------------------------------------------
     7. 3D TILT + SPOTLIGHT GLOW + MAGNETIC BUTTONS
  --------------------------------------------------- */
  if (fine && !reduced) {
    $$('[data-tilt]').forEach(function (el) {
      var strong = el.classList.contains('photo-card') ? 9 : 7;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%');
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * strong) + 'deg) rotateY(' + ((px - 0.5) * strong * 1.3) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------
     8. SKILL FILTER TABS
  --------------------------------------------------- */
  var tabs = $$('.tab'), cards = $$('.skill');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      var f = t.dataset.filter, n = 0;
      cards.forEach(function (c) {
        var show = f === 'all' || c.dataset.cat === f;
        c.classList.toggle('hide', !show);
        c.classList.remove('pop');
        if (show) {
          var delay = n++ * (useGsap ? .035 : .05);
          c.style.setProperty('--d', delay + 's');
          if (useGsap) {
            window.gsap.fromTo(c,
              { autoAlpha: 0, y: 12, scale: .98 },
              { autoAlpha: 1, y: 0, scale: 1, duration: .4, delay: delay, ease: 'power2.out', overwrite: 'auto', clearProps: 'opacity,visibility,transform' }
            );
          } else {
            void c.offsetWidth;
            c.classList.add('pop');
          }
        }
      });
    });
  });

  /* ---------------------------------------------------
     9. TOAST + COPY
  --------------------------------------------------- */
  var toast = $('#toast'), toastT;
  function say(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('show'); }, 2800);
  }
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.dataset.copy;
      function ok() { say('Copied: ' + v); }
      function fallback() {
        var ta = document.createElement('textarea'); ta.value = v; ta.style.position = 'fixed'; ta.style.opacity = 0;
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); ok(); } catch (e) { say(v); }
        ta.remove();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(ok, fallback); else fallback();
    });
  });

  /* ---------------------------------------------------
     10. CONTACT FORM (opens WhatsApp or Email, ready to send)
  --------------------------------------------------- */
  var form = $('#contactForm');
  function err(id, msg) {
    var f = $('#' + id), e = $('.err[data-for="' + id + '"]');
    f.parentElement.classList.toggle('invalid', !!msg);
    if (e) e.textContent = msg || '';
  }
  ['fName', 'fEmail', 'fMsg'].forEach(function (id) { $('#' + id).addEventListener('input', function () { err(id, ''); }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#fName').value.trim(), mail = $('#fEmail').value.trim(), type = $('#fType').value, msg = $('#fMsg').value.trim();
    var bad = false;
    if (name.length < 2) { err('fName', 'Please enter your name.'); bad = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { err('fEmail', 'Please enter a valid email address.'); bad = true; }
    if (msg.length < 10) { err('fMsg', 'Please write at least 10 characters.'); bad = true; }
    if (bad) { say('Please fix the highlighted fields.'); return; }
    var via = (e.submitter && e.submitter.dataset.via) || 'wa';
    var text = 'Hi Ankit, I found you on AnkitX.\n\nName: ' + name + '\nEmail: ' + mail + '\nProject: ' + type + '\n\n' + msg;
    if (via === 'wa') {
      window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      say('Opening WhatsApp...');
    } else {
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('New project enquiry from ' + name) + '&body=' + encodeURIComponent(text);
      say('Opening your email app...');
    }
  });

  /* ---------------------------------------------------
     11. MISC
  --------------------------------------------------- */
  $('#year').textContent = new Date().getFullYear();
})();
