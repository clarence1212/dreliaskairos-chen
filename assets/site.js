(function () {
  var b = document.querySelector('.menu-btn'), n = document.getElementById('mnav');
  if (b && n) b.addEventListener('click', function () { var o = n.classList.toggle('open'); b.setAttribute('aria-expanded', o ? 'true' : 'false'); b.textContent = o ? 'Close' : 'Menu'; });

  document.querySelectorAll('.copy').forEach(function (c) {
    c.addEventListener('click', function () {
      var src = c.getAttribute('data-copy-from'), el = src ? document.getElementById(src) : null;
      var t = c.getAttribute('data-copy') || (el ? el.textContent.trim() : ''), label = c.textContent;
      try { navigator.clipboard.writeText(t).then(function () { c.textContent = 'Copied'; setTimeout(function () { c.textContent = label; }, 1600); }); } catch (e) {}
    });
  });

  /* Essay archive: topic chips and search. */
  var list = document.getElementById('archive');
  if (list) {
    var items = Array.prototype.slice.call(list.querySelectorAll('.ess')), q = document.getElementById('q'),
        chips = Array.prototype.slice.call(document.querySelectorAll('.chips .chip')), count = document.getElementById('count'),
        empty = document.getElementById('empty'), topic = 'all';
    var params = new URLSearchParams(location.search);
    if (params.get('topic')) topic = params.get('topic');
    function apply() {
      var term = (q.value || '').trim().toLowerCase(), shown = 0;
      items.forEach(function (li) {
        var ok = (topic === 'all' || li.getAttribute('data-topic') === topic) && (!term || li.getAttribute('data-text').indexOf(term) > -1);
        li.hidden = !ok; if (ok) shown++;
      });
      chips.forEach(function (c) { var on = c.getAttribute('data-f') === topic; c.classList.toggle('on', on); c.setAttribute('aria-pressed', on); });
      count.textContent = shown + (shown === 1 ? ' essay' : ' essays');
      empty.hidden = shown > 0;
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { topic = c.getAttribute('data-f'); apply(); }); });
    q.addEventListener('input', apply);
    apply();
  }
})();
/* Reading progress on essay pages (thin bar, not sticky content). */
(function () {
  var bar = document.getElementById('prog'), art = document.querySelector('.art-body');
  if (!bar || !art) return;
  function upd() { var r = art.getBoundingClientRect(), h = art.offsetHeight - window.innerHeight; var p = h > 0 ? Math.min(1, Math.max(0, -r.top / h)) : 1; bar.style.transform = 'scaleX(' + p + ')'; }
  window.addEventListener('scroll', upd, { passive: true }); upd();
})();
/* v5: journey animation, book tilt. Content is visible without script; motion is skipped when reduced motion is requested. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var j = document.querySelector('.journey');
  if (j && !reduce && 'IntersectionObserver' in window && j.getBoundingClientRect().top > window.innerHeight * 0.6) {
    j.classList.add('pre');
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { j.classList.add('go'); j.classList.remove('pre'); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(j);
  }
  if (reduce || !window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.tilt').forEach(function (t) {
    var host = t.parentElement;
    host.addEventListener('pointermove', function (e) {
      var r = host.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = 'rotateY(' + (x * 14).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg) translateZ(0)';
    });
    host.addEventListener('pointerleave', function () { t.style.transform = ''; });
  });
})();
