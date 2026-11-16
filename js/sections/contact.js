/* ============================================================
   sections/contact.js — S5
   · contact : 큰 제목 + 안내 문구 + 마그네틱 버튼(마우스 환경에서만 커서 쪽으로 살짝 끌려온다)
               enabled:false 항목은 링크가 아닌 비활성 표시("준비 중")
   · footer  : 저작권 문구 + 맨 위로
   ============================================================ */
(function () {
  'use strict';
  var P = window.Portfolio;
  if (!P) return;

  function pad2(n) { return String(n).padStart(2, '0'); }

  /* 버튼이 커서 쪽으로 끌려오는 효과. reveal이 걸린 li가 아니라 안쪽 버튼을 움직인다 */
  function magnet(btn) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || P.reduced.matches) return;
    var queued = false, x = 0, y = 0;
    btn.addEventListener('pointermove', function (e) {
      var r = btn.getBoundingClientRect();
      x = (e.clientX - (r.left + r.width / 2)) * 0.22;
      y = (e.clientY - (r.top + r.height / 2)) * 0.32;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        btn.classList.add('is-pulled');
        btn.style.setProperty('--mx', x.toFixed(1) + 'px');
        btn.style.setProperty('--my', y.toFixed(1) + 'px');
      });
    });
    btn.addEventListener('pointerleave', function () {
      btn.classList.remove('is-pulled');
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    });
  }

  function button(l) {
    var el = P.el;
    var on = !!(l.enabled && l.url);
    var external = on && /^https?:/.test(l.url);
    var inner = [
      el('span', { class: 'cta__icon', 'aria-hidden': 'true' }, [el('i', { 'data-lucide': l.icon })]),
      el('span', { class: 'cta__label', text: l.label }),
      on ? (external ? el('span', { class: 'sr-only', text: ' (새 탭)' }) : null) : el('span', { class: 'cta__note', text: l.note || '준비 중' }),
      on ? el('span', { class: 'cta__arrow', 'aria-hidden': 'true' }, [el('i', { 'data-lucide': 'arrow-up-right' })]) : null
    ];
    var btn = on
      ? el('a', { class: 'cta', href: l.url, target: external ? '_blank' : null, rel: external ? 'noopener noreferrer' : null, dataset: { contact: l.id } }, inner)
      : el('span', { class: 'cta is-disabled', 'aria-disabled': 'true', dataset: { contact: l.id } }, inner);
    if (on) magnet(btn);
    return btn;
  }

  P.register('contact', function (mount, data, P) {
    var el = P.el, c = data.contact;
    var idx = data.nav.findIndex(function (n) { return n.id === 'contact'; });

    mount.setAttribute('aria-labelledby', 'contact-title');
    mount.appendChild(el('div', { class: 'section__head', 'data-reveal': '' }, [
      el('span', { class: 'section__num', text: pad2(idx + 1) }),
      el('h2', { class: 'section__title contact__title', id: 'contact-title', text: c.heading })
    ]));
    if (c.message) mount.appendChild(el('p', { class: 'contact__message', 'data-reveal': '', text: c.message }));

    mount.appendChild(el('ul', { class: 'contact__links' }, (c.links || []).map(function (l, i) {
      var li = el('li', { 'data-reveal': '' }, [button(l)]);
      li.style.setProperty('--reveal-delay', i * 0.07 + 's');
      return li;
    })));
  });

  P.register('footer', function (mount, data, P) {
    var el = P.el;
    mount.appendChild(el('p', { class: 'footer__text', text: data.contact.footer }));
    mount.appendChild(el('a', { class: 'footer__top', href: '#hero' }, [
      el('span', { text: '맨 위로' }),
      el('i', { 'data-lucide': 'arrow-up', 'aria-hidden': 'true' })
    ]));
  });
})();
