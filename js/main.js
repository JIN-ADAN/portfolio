/* ============================================================
   main.js — 앱 코어 (S1)
   · window.Portfolio 네임스페이스 + 섹션 렌더러 등록(register)
   · 사이드바/상단바 렌더, Lenis+GSAP 연동, 스크롤스파이, 진행바, 스포트라이트, reveal
   · 섹션 파일(js/sections/*.js)은 이 파일 뒤에 로드하고 Portfolio.register(id, fn)만 호출한다.
       fn(mountEl, data, P)  — mountEl: [data-mount="id"] 요소
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var P = window.Portfolio = {
    data: null,
    sections: {},
    lenis: null,
    activeId: null,
    mobile: window.matchMedia('(max-width: 768px)'),
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)'),
    register: function (id, fn) { P.sections[id] = fn; },

    /* DOM 헬퍼: el('a', {class:'x', href:'#', text:'hi', dataset:{nav:'about'}}, [children]) */
    el: function (tag, attrs, children) {
      var node = document.createElement(tag), k;
      attrs = attrs || {};
      for (k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null) continue;
        if (k === 'text') node.textContent = attrs[k];
        else if (k === 'class') node.className = attrs[k];
        else if (k === 'dataset') { for (var d in attrs.dataset) node.dataset[d] = attrs.dataset[d]; }
        else node.setAttribute(k, attrs[k]);
      }
      (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
      return node;
    },

    /* 아이콘: lucide가 없으면 텍스트 라벨이 대신 보인다 (.no-icons) */
    icons: function () {
      if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
      else root.classList.add('no-icons');
    },

    /* [data-reveal] 등장 감시. 섹션 렌더러가 DOM을 만든 뒤 P.reveal(mountEl) 호출 */
    reveal: function (scope) {
      var nodes = (scope || document).querySelectorAll('[data-reveal]:not(.is-in)');
      if (!nodes.length) return;
      if (!('IntersectionObserver' in window) || P.reduced.matches) {
        nodes.forEach(function (n) { n.classList.add('is-in'); });
        return;
      }
      if (!P._revealIO) {
        P._revealIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('is-in'); P._revealIO.unobserve(e.target); }
          });
        }, { threshold: 0.15 });
      }
      nodes.forEach(function (n) { P._revealIO.observe(n); });
    },

    scrollTo: function (target) {
      var offset = P.mobile.matches ? (document.getElementById('topbar') || {}).offsetHeight || 0 : 0;
      if (P.lenis) P.lenis.scrollTo(target, { offset: -offset });
      else {
        var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: P.reduced.matches ? 'auto' : 'smooth' });
      }
    }
  };

  /* ---------- 자리표시 (렌더러 미등록 섹션) ---------- */
  var STAGE = { hero: 'S2', 'hero-bg': 'S2', about: 'S2', work: 'S3', interlude: 'S4', archive: 'S4', stack: 'S5', contact: 'S5', footer: 'S5' };

  function placeholder(mount, id, data) {
    var el = P.el;
    if (id === 'hero-bg') return;
    if (id === 'footer') { mount.textContent = data.contact.footer; return; }
    if (id === 'hero') {
      mount.appendChild(el('p', { class: 'eyebrow', text: data.hero.eyebrow }));
      mount.appendChild(el('h1', { class: 'ph-hero__name' }, data.profile.nameLines.map(function (l) { return el('span', { text: l }); })));
      mount.appendChild(el('p', { class: 'ph-hero__roles', text: data.profile.roles.join(' · ') }));
      return;
    }
    if (id === 'interlude') {
      mount.appendChild(el('div', { class: 'ph' }, [
        el('span', { class: 'ph__stage', text: STAGE[id] }),
        el('span', { text: '슬로건 인터루드 — ' + data.slogan.en })
      ]));
      return;
    }
    var idx = data.nav.findIndex(function (n) { return n.id === id; });
    var heading = (data[id] && data[id].heading) || id;
    var hid = id + '-title';
    mount.setAttribute('aria-labelledby', hid);
    mount.appendChild(el('div', { class: 'section__head' }, [
      el('span', { class: 'section__num', text: String(idx + 1).padStart(2, '0') }),
      el('h2', { class: 'section__title', id: hid, text: heading })
    ]));
    mount.appendChild(el('div', { class: 'ph' }, [
      el('span', { class: 'ph__stage', text: STAGE[id] || '' }),
      el('span', { text: heading + ' 섹션은 ' + (STAGE[id] || '다음') + ' 단계에서 제작됩니다.' })
    ]));
  }

  function mountSections(data) {
    document.querySelectorAll('[data-mount]').forEach(function (mount) {
      var id = mount.dataset.mount, fn = P.sections[id];
      if (fn) {
        try { fn(mount, data, P); return; }
        catch (err) { console.error('[portfolio] section "' + id + '" failed:', err); mount.textContent = ''; }
      }
      placeholder(mount, id, data);
    });
  }

  /* ---------- 사이드바 / 상단바 ---------- */
  function renderChrome(data) {
    var el = P.el, p = data.profile;

    var sbName = document.querySelector('.sidebar__name');
    sbName.textContent = p.nameEn;
    var roles = document.querySelector('.sidebar__roles');
    p.roles.forEach(function (r) { roles.appendChild(el('span', { text: r })); });
    document.querySelector('.sidebar__tagline').textContent = p.tagline;

    var list = document.querySelector('.sidebar__nav ul');
    var top = document.querySelector('.topbar__nav');
    document.querySelector('.topbar__name').textContent = p.nameEn;

    data.nav.forEach(function (n, i) {
      list.appendChild(el('li', null, [
        el('a', { href: '#' + n.id, dataset: { nav: n.id } }, [
          el('span', { class: 'nav__num', text: String(i + 1).padStart(2, '0'), 'aria-hidden': 'true' }),
          el('span', { class: 'nav__line', 'aria-hidden': 'true' }),
          el('span', { text: n.label })
        ])
      ]));
      top.appendChild(el('a', { href: '#' + n.id, dataset: { nav: n.id }, text: n.label }));
    });

    var social = document.querySelector('.sidebar__social');
    data.contact.links.filter(function (l) { return l.enabled && l.url; }).forEach(function (l) {
      social.appendChild(el('li', null, [
        el('a', { href: l.url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': l.label + ' (새 탭)' }, [
          el('i', { 'data-lucide': l.icon, 'aria-hidden': 'true' }),
          el('span', { class: 'sr-only sr-only--icon-label', text: l.label })
        ])
      ]));
    });
  }

  /* ---------- 부드러운 스크롤 (Lenis + GSAP) ---------- */
  function initSmoothScroll() {
    var hasGsap = !!(window.gsap && window.ScrollTrigger);
    if (hasGsap) window.gsap.registerPlugin(window.ScrollTrigger);
    if (!window.Lenis || P.reduced.matches) return;

    var lenis = P.lenis = new window.Lenis({ lerp: 0.1 });
    if (hasGsap) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    }
  }

  /* ---------- 스크롤스파이 + 진행바 ---------- */
  function initSpy() {
    var targets = [].slice.call(document.querySelectorAll('[data-spy]'));
    var links = [].slice.call(document.querySelectorAll('[data-nav]'));
    var bar = document.getElementById('progress-bar');
    var topNav = document.querySelector('.topbar__nav');
    var ticking = false;

    function setActive(id) {
      if (id === P.activeId) return;
      P.activeId = id;
      root.classList.toggle('at-hero', id === 'hero');
      links.forEach(function (a) {
        var on = a.dataset.nav === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        if (on && topNav && topNav.contains(a) && P.mobile.matches) {
          var inNav = topNav.scrollLeft + a.getBoundingClientRect().left - topNav.getBoundingClientRect().left;
          topNav.scrollTo({ left: inNav - (topNav.clientWidth - a.offsetWidth) / 2, behavior: P.reduced.matches ? 'auto' : 'smooth' });
        }
      });
      document.dispatchEvent(new CustomEvent('portfolio:section', { detail: { id: id } }));
    }

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;
      var y = window.pageYOffset;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, Math.max(0, y / max)) : 0) + ')';

      var line = vh * 0.4, current = targets[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].getBoundingClientRect().top <= line) current = targets[i];
      }
      if (max > 0 && y >= max - 2) current = targets[targets.length - 1];   // 페이지 끝 = 마지막 섹션
      if (current) setActive(current.id);
    }
    function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', request);
    update();
  }

  /* ---------- 앵커 클릭 ---------- */
  function initAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      P.scrollTo(target);
      if (history.replaceState) history.replaceState(null, '', '#' + id);
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ---------- 커서 스포트라이트 (마우스 환경만) ---------- */
  function initSpotlight() {
    if (!window.matchMedia('(pointer: fine)').matches || P.reduced.matches) return;
    var spot = document.querySelector('.spotlight');
    if (!spot) return;
    var x = 0, y = 0, queued = false, shown = false;
    /* 성능: :root의 CSS 변수를 바꾸면 문서 전체 스타일이 재계산된다. 요소 하나의 transform만 바꾼다(합성 단계만 사용). */
    window.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        spot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
        if (!shown) { shown = true; root.classList.add('has-pointer'); }
      });
    }, { passive: true });
  }

  /* ---------- Init ---------- */
  function init() {
    var data = P.data = window.portfolioData;
    if (!data) { root.classList.add('force-visible'); console.error('[portfolio] data.js not loaded'); return; }

    document.title = data.meta.title;
    renderChrome(data);
    mountSections(data);
    P.icons();
    initSmoothScroll();
    initSpy();
    initAnchors();
    initSpotlight();
    P.reveal(document);

    if (window.ScrollTrigger) window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
    window.__portfolioReady = true;
    root.classList.add('is-ready');
  }

  /* defer 스크립트는 readyState가 'interactive'일 때 실행되므로, 여기서 바로 init하면
     뒤에 오는 js/sections/*.js가 등록되기 전에 마운트가 끝난다. 반드시 DOMContentLoaded까지 기다린다. */
  var booted = false;
  function boot() { if (booted) return; booted = true; init(); }
  if (document.readyState === 'complete') boot();
  else { document.addEventListener('DOMContentLoaded', boot); window.addEventListener('load', boot); }
})();
