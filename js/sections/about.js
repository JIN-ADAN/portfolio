/* ============================================================
   sections/about.js — S2
   · 소개 문단, Craft × AI 훅, 벤토 4카드(3D 틸트 + 카운트업)
   · 숫자는 DOM에 최종값으로 먼저 들어가므로 JS가 중간에 멈춰도 값이 틀리게 보이지 않는다.
   ============================================================ */
(function () {
  'use strict';
  var P = window.Portfolio;
  if (!P) return;

  function countUp(node, to, dur) {
    var start = null, done = false;
    function finish() { if (!done) { done = true; node.textContent = String(to); } }
    function tick(t) {
      if (done) return;
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / dur);
      node.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 4))));
      if (k < 1) requestAnimationFrame(tick); else done = true;
    }
    node.textContent = '0';
    requestAnimationFrame(tick);
    setTimeout(finish, dur + 600);          // rAF가 멈춰도 최종값 보장
  }

  function tilt(card) {
    var queued = false, rx = 0, ry = 0, gx = 50, gy = 50;
    function apply() {
      queued = false;
      card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      card.style.setProperty('--gx', gx.toFixed(1) + '%');
      card.style.setProperty('--gy', gy.toFixed(1) + '%');
    }
    card.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      ry = (px - 0.5) * 12; rx = (0.5 - py) * 10; gx = px * 100; gy = py * 100;
      card.classList.add('is-tilting');
      if (!queued) { queued = true; requestAnimationFrame(apply); }
    });
    card.addEventListener('pointerleave', function () {
      rx = 0; ry = 0;
      card.classList.remove('is-tilting');
      if (!queued) { queued = true; requestAnimationFrame(apply); }
    });
  }

  P.register('about', function (mount, data, P) {
    var el = P.el, a = data.about;
    var showVerify = !!data.meta.showVerifyMarks;
    var idx = data.nav.findIndex(function (n) { return n.id === 'about'; });

    mount.setAttribute('aria-labelledby', 'about-title');
    mount.appendChild(el('div', { class: 'section__head', 'data-reveal': '' }, [
      el('span', { class: 'section__num', text: String(idx + 1).padStart(2, '0') }),
      el('h2', { class: 'section__title', id: 'about-title', text: a.heading })
    ]));

    /* 문단 */
    mount.appendChild(el('div', { class: 'about__text' }, a.paragraphs.map(function (t, i) {
      var p = el('p', { class: i === 0 ? 'about__lead' : null, 'data-reveal': '', text: t });
      p.style.setProperty('--reveal-delay', i * 0.08 + 's');
      return p;
    })));

    /* 훅: Craft × AI */
    if (a.hook) {
      mount.appendChild(el('div', { class: 'about__hook', 'data-reveal': '' }, [
        el('p', { class: 'about__hook-title' }, [
          el('em', { text: a.hook.left }),
          el('span', { class: 'about__hook-x', 'aria-hidden': 'true', text: '×' }),
          el('span', { class: 'sr-only', text: ' × ' }),
          el('span', { text: a.hook.right })
        ]),
        a.hook.note ? el('p', { class: 'about__hook-note', text: a.hook.note }) : null
      ]));
    }

    /* 벤토 */
    var counters = [];
    var cards = a.bento.map(function (b, i) {
      var isNum = typeof b.value === 'number';
      var value;
      if (isNum) {
        var num = el('span', { class: 'bento__num', 'aria-hidden': 'true', text: String(b.value) });
        counters.push({ node: num, to: b.value });
        value = el('p', { class: 'bento__value bento__value--num' }, [
          el('span', { class: 'sr-only', text: b.value + (b.suffix || '') + (b.unit || '') }),
          num,
          b.suffix ? el('span', { class: 'bento__suffix', 'aria-hidden': 'true', text: b.suffix }) : null,
          b.unit ? el('span', { class: 'bento__unit', 'aria-hidden': 'true', text: b.unit }) : null
        ]);
      } else {
        value = el('p', { class: 'bento__value', text: b.value });
      }

      var card = el('li', {
        class: 'bento__card bento__card--' + (b.accent || 'gold') + (isNum ? ' bento__card--num' : ' bento__card--text'),
        'data-reveal': '', dataset: { bento: b.id }
      }, [
        el('div', { class: 'bento__inner' }, [
          el('div', { class: 'bento__top' }, [
            el('span', { class: 'bento__icon', 'aria-hidden': 'true' }, [el('i', { 'data-lucide': b.icon })]),
            el('span', { class: 'bento__label', text: b.label }),
            b.verify && showVerify ? el('span', { class: 'verify-mark', text: '확인 필요' }) : null
          ]),
          value,
          el('span', { class: 'bento__glare', 'aria-hidden': 'true' })
        ])
      ]);
      card.style.setProperty('--reveal-delay', i * 0.09 + 's');
      return card;
    });
    var grid = el('ul', { class: 'bento', 'aria-label': '한눈에 보기' }, cards);
    mount.appendChild(grid);

    /* 3D 틸트: 마우스 환경 + 모션 허용일 때만 */
    if (window.matchMedia('(pointer: fine)').matches && !P.reduced.matches) cards.forEach(tilt);

    /* 카운트업: 카드가 보이는 순간 0 → 값 */
    if (counters.length && 'IntersectionObserver' in window && !P.reduced.matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          counters.forEach(function (c) {
            if (e.target.contains(c.node)) countUp(c.node, c.to, 1600);
          });
        });
      }, { threshold: 0.4 });
      cards.forEach(function (c) { if (c.querySelector('.bento__num')) io.observe(c); });
    }
  });
})();
