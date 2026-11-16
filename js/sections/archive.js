/* ============================================================
   sections/archive.js — S4
   · interlude : 풀스크린 필기체 슬로건(화면에 들어오면 줄 단위 write-on)
   · archive   : 2단 메이슨리(높이가 낮은 단에 차례로 배치), 흑백 → 컬러 호버, 패럴랙스(데스크톱만)
   숨김 상태는 전부 sections.css의 `.js` 하위 선택자에서만 걸린다(폴백: .force-visible).
   ============================================================ */
(function () {
  'use strict';
  var P = window.Portfolio;
  if (!P) return;

  var MOTION_MQ = '(min-width: 769px) and (prefers-reduced-motion: no-preference)';
  var LINE_GAP = 0.8, LINE_DUR = 1.2;   // write-on: 줄 간격 / 한 줄 길이(초). sections.css의 .interlude__line과 맞출 것
  function pad2(n) { return String(n).padStart(2, '0'); }

  /* ---------- interlude ---------- */
  P.register('interlude', function (mount, data, P) {
    var el = P.el, s = data.slogan;
    if (!s || (s.placements && s.placements.indexOf('interlude') === -1)) { mount.hidden = true; return; }

    var texts = s.enLines && s.enLines.length ? s.enLines : [s.en];
    var lines = texts.map(function (t, i) {
      var l = el('span', { class: 'interlude__line', 'aria-hidden': 'true', text: t });
      l.style.setProperty('--i', i);
      return l;
    });
    var slogan = el('p', { class: 'interlude__slogan', lang: 'en' }, [el('span', { class: 'sr-only', text: s.en })].concat(lines));
    var ko = el('p', { class: 'interlude__ko', 'data-reveal': '', text: s.ko });
    ko.style.setProperty('--reveal-delay', LINE_GAP * (lines.length - 1) + 0.5 + 's');

    mount.setAttribute('aria-label', '슬로건');
    mount.appendChild(el('div', { class: 'interlude__inner' }, [
      el('span', { class: 'interlude__rule', 'aria-hidden': 'true' }),
      slogan,
      ko
    ]));

    function write() {
      slogan.classList.add('is-written');
      /* 다 써진 뒤에는 마스크를 떼어 스크롤 중 합성 비용을 없앤다 */
      setTimeout(function () { slogan.classList.add('is-done'); }, (LINE_GAP * (lines.length - 1) + LINE_DUR + 0.3) * 1000);
    }
    if (!('IntersectionObserver' in window) || P.reduced.matches) write();
    else {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { write(); io.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(slogan);
    }
  });

  /* ---------- archive ---------- */
  function figure(it) {
    var el = P.el, frame;
    if (it.image) {
      var img = el('img', {
        class: 'ar__img', src: it.image.fallback || it.image.webp, alt: it.alt || it.caption || '',
        loading: 'lazy', decoding: 'async'
      });
      if (it.position) img.style.objectPosition = it.position;
      var sources = [];
      if (it.image.webpSmall) sources.push(el('source', { type: 'image/webp', media: '(max-width: 768px)', srcset: it.image.webpSmall }));
      if (it.image.webp) sources.push(el('source', { type: 'image/webp', srcset: it.image.webp }));
      frame = el('div', { class: 'ar__frame' }, [el('picture', null, sources.concat([img]))]);
    } else {
      frame = el('div', { class: 'ar__frame' }, [
        el('i', { 'data-lucide': 'image-plus', 'aria-hidden': 'true' }),
        el('span', { text: it.caption || '사진 추가 예정' })
      ]);
    }
    frame.style.setProperty('--ratio', it.ratio || 1);

    var cap = it.image ? el('figcaption', { class: 'ar__cap' }, [
      el('span', { text: it.caption || '' }),
      it.year ? el('span', { class: 'ar__year', text: it.year }) : null
    ]) : null;

    var fig = el('figure', { class: 'ar__fig' }, [frame, cap]);
    return { node: el('li', { class: 'ar' + (it.image ? '' : ' ar--empty'), 'data-reveal': '', dataset: { archive: it.id } }, [fig]), fig: fig, speed: it.speed };
  }

  P.register('archive', function (mount, data, P) {
    var el = P.el, a = data.archive;
    var idx = data.nav.findIndex(function (n) { return n.id === 'archive'; });

    mount.setAttribute('aria-labelledby', 'archive-title');
    mount.appendChild(el('div', { class: 'section__head', 'data-reveal': '' }, [
      el('span', { class: 'section__num', text: pad2(idx + 1) }),
      el('h2', { class: 'section__title', id: 'archive-title', text: a.heading })
    ]));
    if (a.intro) mount.appendChild(el('p', { class: 'archive__intro', 'data-reveal': '', text: a.intro }));

    /* 메이슨리: 지금까지 쌓인 높이가 낮은 단에 다음 사진을 넣는다(높이 = 1 / ratio) */
    var cols = [el('ul', { class: 'archive__col' }), el('ul', { class: 'archive__col' })];
    var heights = [0, 0], figs = [];
    (a.items || []).forEach(function (it) {
      var c = heights[1] < heights[0] ? 1 : 0;
      var f = figure(it);
      f.node.style.setProperty('--reveal-delay', (c ? 0.12 : 0) + 's');
      cols[c].appendChild(f.node);
      heights[c] += 1 / (it.ratio || 1) + 0.12;
      figs.push(f);
    });
    mount.appendChild(el('div', { class: 'archive' }, cols));

    /* 패럴랙스: 사진마다 속도가 달라 스크롤할 때 단이 어긋나 보인다. reveal이 걸린 li가 아니라 안쪽 figure를 움직인다 */
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!(gsap && ST && typeof gsap.matchMedia === 'function')) return;
    gsap.registerPlugin(ST);
    gsap.matchMedia().add(MOTION_MQ, function () {
      figs.forEach(function (f) {
        var shift = ((f.speed || 1) - 1) * 220;
        if (!shift) return;
        gsap.fromTo(f.fig, { y: shift }, {
          y: -shift, ease: 'none', force3D: true,
          scrollTrigger: { trigger: f.node, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    });
  });
})();
