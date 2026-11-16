/* ============================================================
   sections/work.js — S3
   · 하이라이트: 경제 강의 영상(세로 폰 프레임, 화면에 들어오면 재생 / 나가면 정지, 탭하면 소리)
   · 타임라인 카드(호버 시 형제 카드 dim)
   · 쇼케이스: 데스크톱은 가로 핀닝(GSAP), 모바일·모션 축소·GSAP 없음은 가로 스와이프
   ============================================================ */
(function () {
  'use strict';
  var P = window.Portfolio;
  if (!P) return;

  var MOTION_MQ = '(min-width: 769px) and (prefers-reduced-motion: no-preference)';
  function pad2(n) { return String(n).padStart(2, '0'); }

  function tags(list) {
    if (!list || !list.length) return null;
    return P.el('ul', { class: 'tags', 'aria-label': '키워드' }, list.map(function (t) { return P.el('li', { class: 'tag', text: t }); }));
  }

  /* ---------- 하이라이트 영상 ---------- */
  function feature(fv, showVerify) {
    var el = P.el;
    var video = el('video', {
      class: 'phone__video', playsinline: '', loop: '', preload: 'none',
      poster: fv.poster && (fv.poster.webp || fv.poster.fallback),
      width: fv.width, height: fv.height, 'aria-label': fv.title + ' 영상'
    }, fv.sources.map(function (s) { return el('source', { src: s.src, type: s.type }); }));
    video.muted = true; video.defaultMuted = true; video.setAttribute('muted', '');

    var sound = fv.hasAudio ? el('button', { class: 'phone__sound', type: 'button', 'aria-pressed': 'false', 'aria-label': '영상 소리 켜기' }, [
      el('i', { 'data-lucide': 'volume-x', 'aria-hidden': 'true' }),
      el('i', { 'data-lucide': 'volume-2', 'aria-hidden': 'true' }),
      el('span', { class: 'sr-only sr-only--icon-label', text: '소리' })
    ]) : null;

    var phone = el('div', { class: 'phone' }, [el('div', { class: 'phone__screen' }, [video, sound])]);
    phone.style.setProperty('--phone-ratio', fv.width + ' / ' + fv.height);

    var hint = fv.hasAudio ? el('p', { class: 'feature__hint', text: '영상을 누르면 소리가 켜집니다.' }) : null;
    var node = el('article', { class: 'feature', 'data-reveal': '' }, [
      phone,
      el('div', { class: 'feature__body' }, [
        el('p', { class: 'eyebrow', text: 'Highlight · ' + fv.period }),
        el('h3', { class: 'feature__title', text: fv.title }),
        el('p', { class: 'feature__role', text: fv.role }),
        el('p', { class: 'feature__desc', text: fv.description }),
        tags(fv.tags),
        hint
      ])
    ]);

    function setSound(on) {
      video.muted = !on;
      if (sound) {
        sound.setAttribute('aria-pressed', on ? 'true' : 'false');
        sound.setAttribute('aria-label', on ? '영상 소리 끄기' : '영상 소리 켜기');
      }
      if (hint) hint.textContent = on ? '다시 누르면 소리가 꺼집니다.' : '영상을 누르면 소리가 켜집니다.';
    }
    function play() { var p = video.play(); if (p && p.catch) p.catch(function () { /* 자동재생 차단 시 포스터 유지 */ }); }
    function toggle() {
      if (video.paused) { play(); return; }
      setSound(video.muted);
    }
    video.addEventListener('click', toggle);
    if (sound) sound.addEventListener('click', toggle);
    video.addEventListener('playing', function () { phone.classList.add('is-playing'); });
    video.addEventListener('pause', function () { phone.classList.remove('is-playing'); });

    /* 화면에 절반 이상 들어오면 재생, 벗어나면 정지(소리도 함께 꺼짐) */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio >= 0.5) { if (!P.reduced.matches) play(); }
          else if (!video.paused) { video.pause(); setSound(false); }
        });
      }, { threshold: [0, 0.5] }).observe(phone);
    } else {
      video.setAttribute('controls', '');
    }
    if (P.reduced.matches) video.setAttribute('controls', '');
    return node;
  }

  /* 타임라인 카드 안 사진 줄 (item.photos) */
  function photos(list) {
    if (!list || !list.length) return null;
    var el = P.el;
    return el('ul', { class: 'tl__photos' }, list.map(function (ph) {
      var img = el('img', { class: 'tl__photo-img', src: ph.fallback || ph.webp, alt: ph.alt || '', loading: 'lazy', decoding: 'async' });
      if (ph.position) img.style.objectPosition = ph.position;
      var sources = ph.webpSmall || ph.webp ? [el('source', { type: 'image/webp', srcset: ph.webpSmall || ph.webp })] : [];
      return el('li', { class: 'tl__photo' }, [el('picture', null, sources.concat([img]))]);
    }));
  }

  /* ---------- 타임라인 ---------- */
  function timeline(items, showVerify) {
    var el = P.el;
    return el('ol', { class: 'timeline' }, items.map(function (it, i) {
      var title = it.link
        ? el('a', { class: 'tl__link', href: it.link, target: '_blank', rel: 'noopener noreferrer' }, [
            el('span', { text: it.title }),
            el('span', { class: 'sr-only', text: ' (새 탭)' }),
            el('i', { 'data-lucide': 'arrow-up-right', 'aria-hidden': 'true' })
          ])
        : el('span', { text: it.title });

      var badges = [
        it.featured ? el('span', { class: 'badge badge--gold', text: 'Highlight' }) : null,
        it.status === 'planning' ? el('span', { class: 'badge badge--teal', text: '기획 단계' }) : null,
        it.verify && showVerify ? el('span', { class: 'verify-mark', text: '확인 필요' }) : null
      ].filter(Boolean);

      var li = el('li', { class: 'tl', 'data-reveal': '' }, [
        el('article', { class: 'tl__card' + (it.featured ? ' is-featured' : '') + (it.link ? ' has-link' : ''), dataset: { work: it.id } }, [
          el('p', { class: 'tl__period', text: it.period }),
          el('div', { class: 'tl__body' }, [
            el('h3', { class: 'tl__title' }, [title]),
            el('p', { class: 'tl__role' }, [el('span', { text: it.role })].concat(badges)),
            it.description ? el('p', { class: 'tl__desc', text: it.description }) : null,
            it.points && it.points.length ? el('ul', { class: 'tl__points' }, it.points.map(function (t) { return el('li', { text: t }); })) : null,
            photos(it.photos),
            tags(it.tags)
          ])
        ])
      ]);
      li.style.setProperty('--reveal-delay', Math.min(i, 3) * 0.06 + 's');
      return li;
    }));
  }

  /* ---------- 쇼케이스 ---------- */
  function showcase(items) {
    var el = P.el, total = items.length;
    var cards = items.map(function (it, i) {
      var inner = [
        el('span', { class: 'sc__index', 'aria-hidden': 'true', text: pad2(i + 1) }),
        el('div', { class: 'sc__text' }, [
          el('p', { class: 'sc__caption', text: it.caption }),
          el('h3', { class: 'sc__title', text: it.title })
        ])
      ];
      if (it.image) {
        var scImg = el('img', { class: 'sc__img', src: it.image, alt: '', loading: 'lazy', decoding: 'async' });
        if (it.position) scImg.style.objectPosition = it.position;
        inner.unshift(scImg);
      }
      return el('li', { class: 'sc sc--' + (it.accent || 'gold') + (it.image ? ' sc--image' : ' sc--type') }, inner);
    });

    var track = el('ul', { class: 'showcase__track' }, cards);
    var viewport = el('div', { class: 'showcase__viewport', tabindex: '0', role: 'group', 'aria-label': '쇼케이스 (가로로 넘겨 보기)' }, [track]);
    var count = el('span', { class: 'showcase__count', 'aria-hidden': 'true', text: pad2(1) + ' / ' + pad2(total) });
    var bar = el('span', { class: 'showcase__bar' });
    var node = el('div', { class: 'showcase' }, [
      el('div', { class: 'showcase__head' }, [
        el('p', { class: 'eyebrow', text: 'Showcase' }),
        el('span', { class: 'showcase__progress', 'aria-hidden': 'true' }, [bar]),
        count
      ]),
      viewport
    ]);

    var lastIdx = -1;
    function progress(p) {
      p = Math.min(1, Math.max(0, p));
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var idx = Math.min(total, Math.round(p * (total - 1)) + 1);
      if (idx !== lastIdx) { lastIdx = idx; count.textContent = pad2(idx) + ' / ' + pad2(total); }
    }
    progress(0);

    /* 기본(폴백) 모드: 가로 스와이프 */
    var queued = false;
    viewport.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        var max = viewport.scrollWidth - viewport.clientWidth;
        if (max > 0 && !node.classList.contains('is-pinned')) progress(viewport.scrollLeft / max);
      });
    }, { passive: true });

    /* 데스크톱: 세로 스크롤을 가로 이동으로 바꾸는 핀닝. 핀은 DOM에 붙은 뒤에만 만들 수 있어 init으로 분리 */
    function init() {
      var gsap = window.gsap, ST = window.ScrollTrigger;
      if (!(gsap && ST && typeof gsap.matchMedia === 'function')) return;
      gsap.registerPlugin(ST);
      gsap.matchMedia().add(MOTION_MQ, function () {
        var dist = function () { return Math.max(0, track.scrollWidth - viewport.clientWidth); };
        viewport.scrollLeft = 0;
        node.classList.add('is-pinned');
        viewport.removeAttribute('tabindex');
        gsap.to(track, {
          x: function () { return -dist(); }, ease: 'none', force3D: true,
          scrollTrigger: {
            trigger: node, start: 'center center', end: function () { return '+=' + dist(); },
            pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: function (self) { progress(self.progress); }
          }
        });
        return function () {            // 모바일 폭으로 바뀌면 스와이프 모드로 복귀
          node.classList.remove('is-pinned');
          viewport.setAttribute('tabindex', '0');
          progress(0);
        };
      });
      /* 웹폰트가 늦게 들어오면 높이가 달라지므로 핀 위치 재계산 */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    }
    return { node: node, init: init };
  }

  /* ---------- 등록 ---------- */
  P.register('work', function (mount, data, P) {
    var el = P.el, w = data.work;
    var showVerify = !!data.meta.showVerifyMarks;
    var idx = data.nav.findIndex(function (n) { return n.id === 'work'; });

    mount.setAttribute('aria-labelledby', 'work-title');
    mount.appendChild(el('div', { class: 'section__head', 'data-reveal': '' }, [
      el('span', { class: 'section__num', text: pad2(idx + 1) }),
      el('h2', { class: 'section__title', id: 'work-title', text: w.heading })
    ]));
    if (w.intro) mount.appendChild(el('p', { class: 'work__intro', 'data-reveal': '', text: w.intro }));

    if (w.featuredVideo) mount.appendChild(feature(w.featuredVideo, showVerify));
    if (w.timeline && w.timeline.length) {
      mount.appendChild(el('p', { class: 'eyebrow work__label', 'data-reveal': '', text: 'Timeline' }));
      mount.appendChild(timeline(w.timeline, showVerify));
    }
    if (w.showcase && w.showcase.length) {
      var sc = showcase(w.showcase);
      mount.appendChild(sc.node);
      sc.init();
    }
  });
})();
