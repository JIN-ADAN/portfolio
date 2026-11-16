/* ============================================================
   sections/hero.js — S2
   · hero-bg : 배경 사진 슬라이드(교차 전환) + 오버레이 + 스크롤 줌/패럴랙스
   · hero    : 키네틱 이름, 직함, NOW 배지, 필기체 슬로건 write-on, 스크롤 힌트
   숨김 상태는 전부 sections.css의 `.js` 하위 선택자에서만 걸린다(폴백: .force-visible).
   ============================================================ */
(function () {
  'use strict';
  var P = window.Portfolio;
  if (!P) return;

  var MOTION_MQ = '(min-width: 769px) and (prefers-reduced-motion: no-preference)';

  /* 스크롤 연동 모션: GSAP이 있고, 데스크톱이며, 모션 축소가 아닐 때만. 조건이 바뀌면 자동 원복 */
  function scrollMotion(setup) {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || typeof gsap.matchMedia !== 'function') return;
    gsap.registerPlugin(ST);
    gsap.matchMedia().add(MOTION_MQ, function () { setup(gsap); });
  }

  /* ---------- hero-bg ---------- */
  P.register('hero-bg', function (mount, data, P) {
    var el = P.el, h = data.hero;
    var list = h.slides && h.slides.length ? h.slides : (h.image ? [h.image] : []);
    if (!list.length) return;

    /* 슬라이드: 첫 장만 우선 로드, 나머지는 뒤에서 받아 두고 준비된 뒤에만 넘어간다 */
    var imgs = [];
    var slides = list.map(function (src, i) {
      var img = el('img', {
        class: 'hero-bg__img', src: src.fallback, alt: '',
        width: src.width, height: src.height, decoding: 'async', fetchpriority: i === 0 ? 'high' : 'low'
      });
      if (src.position) img.style.setProperty('--pos', src.position);
      if (src.positionMobile) img.style.setProperty('--pos-m', src.positionMobile);
      if (src.zoomOrigin) img.style.setProperty('--origin', src.zoomOrigin);
      imgs.push(img);
      var sources = [];
      if (src.webp) {
        sources.push(el('source', {
          type: 'image/webp',
          srcset: (src.webpSmall ? src.webpSmall + ' ' + (src.smallWidth || 800) + 'w, ' : '') + src.webp + ' ' + src.width + 'w',
          sizes: '(min-aspect-ratio: 1/1) 100vw, ' + src.width + 'px'   // 세로 화면은 cover로 크게 잘리므로 큰 원본 사용
        }));
      }
      var slide = el('div', { class: 'hero-bg__slide' + (i === 0 ? ' is-active' : '') + (src.inset ? ' hero-bg__slide--inset' : '') });
      /* zoom은 :root가 아니라 슬라이드에 걸어 모바일 미디어쿼리에서 img 쪽 값(1)으로 덮어쓸 수 있게 한다 */
      if (src.zoom) slide.style.setProperty('--zoom', src.zoom);
      if (src.inset) {
        slide.style.setProperty('--inset-w', src.inset);
        var backdrop = el('div', { class: 'hero-bg__backdrop' });
        backdrop.style.backgroundImage = 'url("' + (src.webpSmall || src.webp || src.fallback) + '")';
        slide.appendChild(backdrop);
      }
      slide.appendChild(el('picture', null, sources.concat([img])));
      return slide;
    });

    var media = el('div', { class: 'hero-bg__media' }, slides);
    mount.appendChild(media);
    mount.appendChild(el('div', { class: 'hero-bg__overlay' }));

    function loaded() { mount.classList.add('is-loaded'); }
    if (imgs[0].complete) loaded();
    else { imgs[0].addEventListener('load', loaded); imgs[0].addEventListener('error', loaded); }

    /* 교차 전환: 히어로가 화면에 있고 탭이 보일 때만 돈다. 모션 축소 설정이면 첫 장 고정 */
    if (slides.length > 1 && !P.reduced.matches) {
      var current = 0, timer = null, inView = true;
      var interval = Math.max(3000, h.slideInterval || 6000);
      var next = function () {
        var n = (current + 1) % slides.length;
        if (!(imgs[n].complete && imgs[n].naturalWidth > 0)) return;   // 아직 못 받았으면 다음 차례에 다시 시도
        slides[current].classList.remove('is-active');
        slides[n].classList.add('is-active');
        current = n;
      };
      var sync = function () {
        var run = inView && !document.hidden;
        if (run && !timer) timer = setInterval(next, interval);
        else if (!run && timer) { clearInterval(timer); timer = null; }
      };
      document.addEventListener('visibilitychange', sync);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          inView = entries[entries.length - 1].isIntersecting;
          sync();
        }).observe(mount);
      }
      sync();
    }

    scrollMotion(function (gsap) {
      gsap.to(media, {
        yPercent: 10, scale: 1.12, ease: 'none', force3D: true,
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });
  });

  /* ---------- hero ---------- */
  P.register('hero', function (mount, data, P) {
    var el = P.el, p = data.profile, h = data.hero, s = data.slogan;
    var mountedAt = performance.now();
    var ci = 0;

    mount.setAttribute('aria-labelledby', 'hero-title');

    /* 이름: 줄 → 마스크 → 글자. 글자 단위 등장(CSS), 줄 단위 스크롤 이동(GSAP) */
    var lines = p.nameLines.map(function (line) {
      var chars = Array.from(line).map(function (ch) {
        var c = el('span', { class: 'hero__char', text: ch });
        c.style.setProperty('--i', ci++);
        return c;
      });
      return el('span', { class: 'hero__line', 'aria-hidden': 'true' }, [el('span', { class: 'hero__mask' }, chars)]);
    });

    var roles = el('p', { class: 'hero__roles', 'data-reveal': '' },
      p.roles.map(function (r) { return el('span', { text: r }); }));
    roles.style.setProperty('--reveal-delay', '0.55s');

    var meta = el('p', { class: 'hero__meta', 'data-reveal': '' },
      [p.affiliation, p.location].filter(Boolean).map(function (t) { return el('span', { text: t }); }));
    meta.style.setProperty('--reveal-delay', '0.65s');

    var now = null;
    if (p.now && p.now.text) {
      now = el('p', { class: 'hero__now', 'data-reveal': '' }, [
        el('span', { class: 'hero__now-dot', 'aria-hidden': 'true' }),
        el('span', { class: 'hero__now-label', text: p.now.label || 'NOW' }),
        el('span', { class: 'hero__now-text', text: p.now.text })
      ]);
      now.style.setProperty('--reveal-delay', '0.75s');
    }

    /* 슬로건: 줄 단위 write-on(마스크가 왼쪽에서 오른쪽으로 걷힘) */
    var slogan = null;
    if (s && s.placements.indexOf('hero') !== -1) {
      var sloganLines = (s.enLines && s.enLines.length ? s.enLines : [s.en]).map(function (t, i) {
        var l = el('span', { class: 'hero__slogan-line', 'aria-hidden': 'true', text: t });
        l.style.setProperty('--i', i);
        return l;
      });
      slogan = el('div', { class: 'hero__slogan-wrap' }, [
        el('p', { class: 'hero__slogan', lang: 'en' }, [el('span', { class: 'sr-only', text: s.en })].concat(sloganLines)),
        el('p', { class: 'hero__slogan-ko', 'data-reveal': '', text: s.ko })
      ]);
    }

    var eyebrow = el('p', { class: 'eyebrow hero__eyebrow', 'data-reveal': '', text: h.eyebrow });
    var inner = el('div', { class: 'hero__inner' }, [
      eyebrow,
      el('h1', { class: 'hero__name', id: 'hero-title', 'aria-label': p.nameEn }, lines),
      roles, meta, now, slogan
    ]);
    mount.appendChild(inner);

    var hint = el('a', { class: 'hero__scroll', href: '#about', 'data-reveal': '', 'aria-label': 'About 섹션으로 이동' }, [
      el('span', { text: h.scrollHint || 'Scroll' }),
      el('span', { class: 'hero__scroll-line', 'aria-hidden': 'true' })
    ]);
    hint.style.setProperty('--reveal-delay', '1.6s');
    mount.appendChild(hint);

    /* 이름 등장: 렌더 직후 한 프레임 뒤에 시작. rAF가 멈춘 백그라운드 탭 대비 타이머 병행 */
    function live() { mount.classList.add('is-live'); }
    requestAnimationFrame(function () { requestAnimationFrame(live); });
    setTimeout(live, 120);

    /* 슬로건: 화면에 들어오면 써진다. 첫 화면에서 바로 보이는 경우엔 이름 뒤에 시작 */
    if (slogan) {
      var sl = slogan.querySelector('.hero__slogan');
      var koLine = slogan.querySelector('.hero__slogan-ko');
      var write = function () {
        var early = performance.now() - mountedAt < 1200;
        sl.style.setProperty('--write-delay', early ? '0.7s' : '0s');
        koLine.style.setProperty('--reveal-delay', (early ? 0.7 : 0) + 0.7 * (sloganLines.length - 1) + 0.4 + 's');   // 마지막 줄이 써지는 동안 함께 등장
        sl.classList.add('is-written');
        setTimeout(function () { sl.classList.add('is-done'); }, ((early ? 0.7 : 0) + 0.7 * (sloganLines.length - 1) + 1.2) * 1000);
      };
      if (!('IntersectionObserver' in window) || P.reduced.matches) write();
      else {
        var io = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) { write(); io.disconnect(); }
        }, { threshold: 0.3 });
        io.observe(sl);
      }
    }

    /* 스크롤 키네틱: 두 줄이 서로 반대로 미끄러지고 히어로 본문이 가라앉는다 */
    scrollMotion(function (gsap) {
      var st = { trigger: mount, start: 'top top', end: 'bottom top', scrub: true };
      var lineEls = mount.querySelectorAll('.hero__line');
      lineEls.forEach(function (lineEl, i) {
        gsap.to(lineEl, { xPercent: i % 2 ? 9 : -5, ease: 'none', scrollTrigger: st });
      });
      gsap.to(inner, { opacity: 0.15, yPercent: -4, ease: 'none', scrollTrigger: { trigger: mount, start: '35% top', end: 'bottom top', scrub: true } });
    });
  });
})();
