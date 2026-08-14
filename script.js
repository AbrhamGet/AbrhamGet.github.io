/* Portfolio interactions: custom cursor, scroll reveals, count-up stats,
   mosaic assembly, and the timeline spine that draws as you scroll. */

document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero letter stagger ---------- */
  var letters = document.querySelectorAll('.hero__name .ltr');
  letters.forEach(function (el, i) {
    el.style.animationDelay = (0.25 + i * 0.045) + 's';
  });

  /* ---------- Custom cursor ---------- */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine && !reduceMotion) {
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });

    function loopCursor() {
      // ring lags behind the dot for a soft trailing feel
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loopCursor);
    }
    loopCursor();

    var interactive = 'a, summary, button, .skill, .spotlight__card';
    document.querySelectorAll(interactive).forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hovering'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hovering'); });
    });
    document.addEventListener('mousedown', function () { ring.classList.add('is-down'); });
    document.addEventListener('mouseup', function () { ring.classList.remove('is-down'); });
    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0'; ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1'; ring.style.opacity = '1';
    });
  }

  /* ---------- Build the mosaic tiles ---------- */
  var mosaic = document.querySelector('.mosaic');
  if (mosaic) {
    var COLS = 8, ROWS = 8;
    var tiles = [];
    for (var i = 0; i < COLS * ROWS; i++) {
      var t = document.createElement('span');
      t.className = 'mosaic__tile';
      // vary opacity, and let some tiles read navy instead of orange
      var r = Math.random();
      if (r < 0.16) {
        t.style.background = '#11222C';
        t.style.setProperty('--o', (0.5 + Math.random() * 0.4).toFixed(2));
      } else if (r < 0.3) {
        t.style.background = 'transparent';
        t.style.border = '1px solid rgba(228,121,12,0.5)';
        t.style.setProperty('--o', '1');
      } else {
        t.style.setProperty('--o', (0.25 + Math.random() * 0.65).toFixed(2));
      }
      mosaic.appendChild(t);
      tiles.push(t);
    }
    // shuffle reveal order so it assembles organically
    var order = tiles.slice();
    for (var j = order.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = order[j]; order[j] = order[k]; order[k] = tmp;
    }
    mosaic._revealTiles = function () {
      order.forEach(function (el, idx) {
        setTimeout(function () { el.classList.add('is-on'); }, idx * 16);
      });
    };
    if (reduceMotion) {
      tiles.forEach(function (el) { el.classList.add('is-on'); });
    }
  }

  /* ---------- Count-up stats ---------- */
  function runCountUp(scope) {
    scope.querySelectorAll('[data-count-to]').forEach(function (el) {
      var raw = el.getAttribute('data-count-to');
      var target = parseFloat(raw);
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = raw.indexOf('.') > -1 ? 1 : 0;
      if (reduceMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      var duration = 1800, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) { requestAnimationFrame(step); }
        else { el.textContent = target.toFixed(decimals) + suffix; }
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Generic scroll reveal ---------- */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });

    // Results section: stage lights + counters
    var results = document.querySelector('.results');
    if (results) {
      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          results.classList.add('in-view');
          runCountUp(results);
          statsObserver.disconnect();
        });
      }, { threshold: 0.3 });
      statsObserver.observe(results);
    }

    // Mosaic assembly
    if (mosaic && !reduceMotion) {
      var mosaicObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          mosaic._revealTiles();
          mosaicObserver.disconnect();
        });
      }, { threshold: 0.25 });
      mosaicObserver.observe(mosaic);
    }
  } else {
    // No IntersectionObserver: show everything
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
    var r = document.querySelector('.results');
    if (r) { r.classList.add('in-view'); runCountUp(r); }
    if (mosaic && mosaic._revealTiles) mosaic._revealTiles();
  }

  /* ---------- Timeline spine draws with scroll ---------- */
  var wrap = document.querySelector('.timeline-wrap');
  var fill = document.querySelector('.timeline__spine-fill');
  if (wrap && fill && !reduceMotion) {
    var ticking = false;
    function updateSpine() {
      var rect = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      // progress from when the top hits 75% of viewport to when bottom passes 40%
      var startPt = vh * 0.75;
      var total = rect.height + (startPt - vh * 0.4);
      var travelled = startPt - rect.top;
      var pct = Math.max(0, Math.min(1, travelled / total));
      fill.style.height = (pct * 100) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(updateSpine); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', updateSpine);
    updateSpine();
  } else if (fill) {
    fill.style.height = '100%';
  }

});
