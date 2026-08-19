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

    var interactive = 'a, summary, button, .scard, .spotlight__card, .mq__item, .wall__tile';
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

  /* ---------- Hero: orbs merge onto the cursor and light the text ---------- */
  var hero = document.querySelector('.hero');
  if (hero && fine && !reduceMotion) {
    var spot = hero.querySelector('.hero__spot');
    var lit = hero.querySelector('.hero__text--lit');
    var orbs = Array.prototype.slice.call(hero.querySelectorAll('.orb'));
    var hx = 0, hy = 0, active = false;

    function orbHome(orb) {
      // cache each orb's resting centre relative to the hero
      if (!orb._home) {
        var hr = hero.getBoundingClientRect();
        var or = orb.getBoundingClientRect();
        orb._home = {
          x: or.left - hr.left + or.width / 2,
          y: or.top - hr.top + or.height / 2
        };
      }
      return orb._home;
    }

    hero.addEventListener('mouseenter', function () {
      active = true;
      hero.classList.add('is-lit');
      orbs.forEach(function (o) {
        orbHome(o);
        o.style.animationPlayState = 'paused';
        o.style.transition = 'transform .55s cubic-bezier(.2,.8,.3,1), opacity .4s ease';
      });
    });

    hero.addEventListener('mousemove', function (e) {
      if (!active) return;
      var r = hero.getBoundingClientRect();
      hx = e.clientX - r.left;
      hy = e.clientY - r.top;
      spot.style.left = hx + 'px';
      spot.style.top = hy + 'px';
      lit.style.setProperty('--mx', hx + 'px');
      lit.style.setProperty('--my', hy + 'px');
      // pull every orb toward the cursor so they read as one mass
      orbs.forEach(function (o) {
        var home = orbHome(o);
        o.style.transform = 'translate(' + (hx - home.x) + 'px,' + (hy - home.y) + 'px) scale(.55)';
      });
    });

    hero.addEventListener('mouseleave', function () {
      active = false;
      hero.classList.remove('is-lit');
      lit.style.setProperty('--mx', '-999px');
      lit.style.setProperty('--my', '-999px');
      orbs.forEach(function (o) {
        o.style.transform = '';
        // let the idle drift animation take over again once they're home
        setTimeout(function () {
          o.style.transition = '';
          o.style.animationPlayState = '';
        }, 560);
      });
    });
  }

  /* ---------- Build the mosaic portrait ---------- */
  var MOSAIC_COLORS = ["#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FF9729","#FF9729","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FF9729","#FF9729","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FF9729","#E4790C","#E4790C","#E4790C","#FF9729","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FF9729","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#2E3E4A","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#E4790C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FF9729","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#2E3E4A","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#E4790C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#E4790C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#FF9729","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#E4790C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#E4790C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#2E3E4A","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#2E3E4A","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#2E3E4A","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FF9729","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#2E3E4A","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FF9729","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#E4790C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#2E3E4A","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#2E3E4A","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#E4790C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#E4790C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#2E3E4A","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#FF9729","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#E4790C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#2E3E4A","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#2E3E4A","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#FF9729","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#E4790C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#E4790C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FF9729","#FF9729","#FF9729","#2E3E4A","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#E4790C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FF9729","#FF9729","#E4790C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#2E3E4A","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#2E3E4A","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#2E3E4A","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#E4790C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#E4790C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#2E3E4A","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#E4790C","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#FFCE96","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#11222C","#FF9729","#FFCE96"];
  var MOSAIC_N = 24;
  
  var mosaic = document.querySelector('.mosaic');
  if (mosaic) {
    var tiles = [];
    for (var i = 0; i < MOSAIC_COLORS.length; i++) {
      var t = document.createElement('span');
      t.className = 'mosaic__tile';
      t.style.background = MOSAIC_COLORS[i];
      mosaic.appendChild(t);
      tiles.push(t);
    }
    var tileOrder = tiles.slice();
    for (var j = tileOrder.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = tileOrder[j]; tileOrder[j] = tileOrder[k]; tileOrder[k] = tmp;
    }
    mosaic._revealTiles = function () {
      tileOrder.forEach(function (el, idx) {
        setTimeout(function () { el.classList.add('is-on'); }, idx * 5);
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

  /* ---------- Skill card stack shuffle ---------- */
  var stack = document.getElementById('skillStack');
  if (stack) {
    var cards = Array.prototype.slice.call(stack.querySelectorAll('.scard'));
    var total = cards.length;
    var order = cards.slice();
    var counter = document.querySelector('.stack__count');
    var clicks = 0;
    var busy = false;

    function layout() {
      order.forEach(function (card, i) {
        var depth = Math.min(i, 3);
        var rot = (i % 2 === 0 ? 1 : -1) * depth * 1.2;
        card.style.zIndex = total - i;
        card.style.transform =
          'translateY(' + (depth * 12) + 'px) scale(' + (1 - depth * 0.035) + ') rotate(' + rot + 'deg)';
        card.style.opacity = i > 3 ? 0 : 1;
        card.style.pointerEvents = i === 0 ? 'auto' : 'none';
        card.classList.toggle('scard--top', i === 0);
      });
    }

    // "Click me" nudge: pulse + badge until the first interaction
    var clickBadge = document.createElement('span');
    clickBadge.className = 'stack__click';
    clickBadge.textContent = 'Click the card \u2193';
    stack.appendChild(clickBadge);
    var interacted = false;

    function startNudge() {
      if (interacted) return;
      stack.classList.add('stack--nudge');
      clickBadge.classList.add('is-in');
    }
    function endNudge() {
      if (interacted) return;
      interacted = true;
      stack.classList.remove('stack--nudge');
      clickBadge.classList.add('is-out');
      setTimeout(function () {
        if (clickBadge.parentNode) clickBadge.parentNode.removeChild(clickBadge);
      }, 500);
    }
    if ('IntersectionObserver' in window) {
      var nudgeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          setTimeout(startNudge, 700);
          nudgeObserver.disconnect();
        });
      }, { threshold: 0.4 });
      nudgeObserver.observe(stack);
    } else {
      setTimeout(startNudge, 1200);
    }

    function shuffle() {
      endNudge();
      if (busy) return;
      busy = true;
      var top = order[0];
      top.classList.add('scard--fly');
      setTimeout(function () {
        order.push(order.shift());
        top.classList.remove('scard--fly');
        layout();
        clicks = (clicks + 1) % total;
        if (counter) counter.textContent = (clicks + 1) + ' / ' + total;
        setTimeout(function () { busy = false; }, 120);
      }, 430);
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        // let the CTA link on The End card work normally
        if (e.target.closest && e.target.closest('a')) return;
        shuffle();
      });
    });

    if (reduceMotion) {
      // still functional, transitions are disabled globally
    }
    layout();
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
