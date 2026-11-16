/* ============================================================
   sections/stack.js — S5
   · stack : 무한 마키 2줄(줄마다 방향 반대) + 직접 만든 것 목록(data.stack.builds). 움직임은 CSS 애니메이션만 사용.
     모션 축소 설정이면 멈추고 일반 목록으로 줄바꿈된다(복제본은 숨김).
   ============================================================ */
(function () {
  'use strict';
  var P = window.Portfolio;
  if (!P) return;

  var REPEAT = 3;   // 한 묶음 안에서 항목을 되풀이하는 횟수(묶음 폭이 화면보다 넓어야 끊김이 없다)
  function pad2(n) { return String(n).padStart(2, '0'); }

  function row(r, i) {
    var el = P.el;
    /* 같은 묶음을 두 번 이어 붙이고 -50%까지 이동시키면 이음매 없이 반복된다.
       스크린리더에는 첫 묶음의 첫 회차만 읽힌다(나머지는 복제본) */
    function group(isCopy) {
      var items = [];
      for (var n = 0; n < REPEAT; n++) {
        r.items.forEach(function (t) {
          var clone = isCopy || n > 0;
          items.push(el('li', { class: 'marquee__item' + (clone ? ' is-clone' : ''), 'aria-hidden': clone ? 'true' : null }, [
            el('span', { text: t }),
            el('span', { class: 'marquee__sep', 'aria-hidden': 'true', text: '✦' })
          ]));
        });
      }
      return items;
    }
    var track = el('ul', { class: 'marquee__track' }, group(false).concat(group(true)));
    var node = el('div', {
      class: 'marquee marquee--' + (r.direction === 'right' ? 'right' : 'left') + (i % 2 ? ' marquee--pill' : ' marquee--display'),
      'data-reveal': ''
    }, [track]);
    node.style.setProperty('--marquee-dur', Math.max(24, r.items.length * REPEAT * 2.6) + 's');
    node.style.setProperty('--reveal-delay', i * 0.12 + 's');
    return node;
  }

  P.register('stack', function (mount, data, P) {
    var el = P.el, s = data.stack;
    var idx = data.nav.findIndex(function (n) { return n.id === 'stack'; });

    mount.setAttribute('aria-labelledby', 'stack-title');
    mount.appendChild(el('div', { class: 'section__head', 'data-reveal': '' }, [
      el('span', { class: 'section__num', text: pad2(idx + 1) }),
      el('h2', { class: 'section__title', id: 'stack-title', text: s.heading })
    ]));
    if (s.intro) mount.appendChild(el('p', { class: 'stack__intro', 'data-reveal': '', text: s.intro }));
    mount.appendChild(el('div', { class: 'stack__rows' }, (s.rows || []).map(row)));

    /* 직접 만든 것: 묶음(에이전트 팀 / Notion / Web)별 목록 */
    (s.builds || []).forEach(function (g, gi) {
      var hid = 'stack-build-' + gi;
      mount.appendChild(el('section', { class: 'build', 'aria-labelledby': hid }, [
        el('div', { class: 'build__head', 'data-reveal': '' }, [
          el('h3', { class: 'build__title', id: hid, text: g.title }),
          g.note ? el('span', { class: 'build__note', text: g.note }) : null
        ]),
        el('ul', { class: 'build__list' }, (g.items || []).map(function (it, i) {
          var li = el('li', { class: 'build__item', 'data-reveal': '' }, [
            el('div', { class: 'build__row' }, [
              el('h4', { class: 'build__name', text: it.name }),
              it.meta ? el('span', { class: 'badge badge--teal', text: it.meta }) : null
            ]),
            it.desc ? el('p', { class: 'build__desc', text: it.desc }) : null
          ]);
          li.style.setProperty('--reveal-delay', (i % 2) * 0.08 + 's');
          return li;
        }))
      ]));
    });
  });
})();
