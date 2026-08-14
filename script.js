// Count-up animation for the results stats, triggered together with the
// stage-light sweep when the section scrolls into view.

document.addEventListener('DOMContentLoaded', function () {
  var results = document.querySelector('.results');
  if (!results) return;

  var counters = results.querySelectorAll('[data-count-to]');
  var hasRun = false;

  function formatNumber(n, decimals) {
    if (decimals > 0) {
      return n.toFixed(decimals);
    }
    return Math.round(n).toString();
  }

  function runCountUp() {
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (el.getAttribute('data-count-to').indexOf('.') > -1) ? 1 : 0;
      var duration = 1800;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        // ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;
        el.textContent = formatNumber(current, decimals) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = formatNumber(target, decimals) + suffix;
        }
      }
      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          results.classList.add('in-view');
          runCountUp();
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });
    observer.observe(results);
  } else {
    // Fallback for browsers without IntersectionObserver
    results.classList.add('in-view');
    runCountUp();
  }
});
