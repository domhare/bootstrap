/* Ewebot Home 10 – Bootstrap rebuild: interactions */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header + back to top ---------- */
  var header = document.getElementById('siteHeader');
  var toTop = document.getElementById('backToTop');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 10);
    toTop.classList.toggle('show', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* Close the mobile menu after picking a plain link */
  document.querySelectorAll('#mobileMenu a.mm-link[href^="#"]:not([data-bs-toggle]), #mobileMenu .mm-sub a').forEach(function (a) {
    a.addEventListener('click', function () { bootstrap.Collapse.getOrCreateInstance('#mobileMenu').hide(); });
  });

  /* Focus search input when the overlay opens */
  var searchModal = document.getElementById('searchModal');
  searchModal.addEventListener('shown.bs.modal', function () { searchModal.querySelector('input').focus(); });

  /* ---------- Typed text (strings: Success / Services / Business) ---------- */
  var typedEl = document.querySelector('.typed');
  if (typedEl) {
    var strings = JSON.parse(typedEl.dataset.strings);
    var si = 0, ci = 0, deleting = false;
    (function tick() {
      var word = strings[si];
      ci += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, ci);
      var delay = deleting ? 50 : 100;                 // backSpeed / typeSpeed
      if (!deleting && ci === word.length) { deleting = true; delay = 700; } // backDelay
      else if (deleting && ci === 0) { deleting = false; si = (si + 1) % strings.length; delay = 300; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- Scroll reveal, counters, progress bars ---------- */
  function animateCount(el) {
    var target = +el.dataset.count, start = null, dur = 2000;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function animateBar(bar) {
    var v = +bar.dataset.value;
    var label = bar.closest('.skill').querySelector('.skill-val');
    bar.style.width = v + '%';
    var start = null;
    (function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1600, 1);
      label.textContent = Math.round(v * p) + '%';
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.classList.contains('reveal')) el.classList.add('in');
      if (el.dataset.count) animateCount(el);
      if (el.classList.contains('progress-bar')) animateBar(el);
      io.unobserve(el);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, [data-count], .progress-bar').forEach(function (el) {
    if (reduceMotion && el.classList.contains('reveal')) { el.classList.add('in'); return; }
    io.observe(el);
  });

  /* ---------- Case-studies carousel (center mode, dots, drag, autoplay) ---------- */
  var slider = document.getElementById('caseSlider');
  if (slider) {
    var track = slider.querySelector('.case-track');
    var dotsBox = slider.querySelector('.slider-dots');
    var originals = Array.prototype.slice.call(track.children);
    var n = originals.length;
    // clone a full set on both sides for an infinite loop
    originals.forEach(function (it) { track.appendChild(it.cloneNode(true)); });
    originals.slice().reverse().forEach(function (it) { track.insertBefore(it.cloneNode(true), track.firstChild); });
    var items = Array.prototype.slice.call(track.children);
    var index = n; // first real slide
    var timer;

    for (var d = 0; d < n; d++) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'Go to slide ' + (d + 1));
      b.addEventListener('click', (function (k) { return function () { go(n + k); restart(); }; })(d));
      dotsBox.appendChild(b);
    }

    function offsetFor(i) {
      var it = items[i];
      return it.offsetLeft - (slider.clientWidth - it.offsetWidth) / 2;
    }
    function render(animate) {
      track.style.transition = animate ? '' : 'none';
      track.style.transform = 'translateX(' + (-offsetFor(index)) + 'px)';
      items.forEach(function (it, i) { it.classList.toggle('is-active', i === index); });
      var real = ((index - n) % n + n) % n;
      Array.prototype.forEach.call(dotsBox.children, function (btn, i) { btn.classList.toggle('active', i === real); });
      if (!animate) { void track.offsetWidth; track.style.transition = ''; }
    }
    function go(i) { index = i; render(true); }
    track.addEventListener('transitionend', function (e) {
      if (e.target !== track) return;
      if (index >= 2 * n) { index -= n; render(false); }
      else if (index < n) { index += n; render(false); }
    });
    function restart() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { go(index + 1); }, 4000);
    }
    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);

    // drag / swipe
    var startX = 0, dx = 0, dragging = false, base = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      dragging = true; moved = false; startX = e.clientX; dx = 0; base = -offsetFor(index);
      track.classList.add('dragging'); clearInterval(timer);
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      track.style.transform = 'translateX(' + (base + dx) + 'px)';
    });
    window.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false; track.classList.remove('dragging');
      if (dx < -60) go(index + 1); else if (dx > 60) go(index - 1); else render(true);
      restart();
    });
    track.addEventListener('click', function (e) { if (moved) e.preventDefault(); }, true);
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });

    window.addEventListener('resize', function () { render(false); });
    window.addEventListener('load', function () { render(false); });
    render(false);
    restart();
  }

  /* ---------- Contact form validation ---------- */
  document.querySelectorAll('.needs-validation').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('was-validated');
      if (form.checkValidity()) {
        form.querySelector('.form-ok').classList.remove('d-none');
        form.reset(); form.classList.remove('was-validated');
      }
    });
  });

  /* ---------- Floating confetti dots ---------- */
  var box = document.querySelector('.bubbles');
  if (box && !reduceMotion) {
    var colors = ['#ff4969', '#fc9d44', '#6254e7', '#40d1d1', '#ffd426', '#ec4bc7', '#ffad4f'];
    for (var k = 0; k < 18; k++) {
      var s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.background = colors[k % colors.length];
      s.style.animationDuration = (10 + Math.random() * 14) + 's';
      s.style.animationDelay = (-Math.random() * 20) + 's';
      box.appendChild(s);
    }
  }

  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
