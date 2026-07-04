/* 株式会社優心 — サイト共通の演出スクリプト
   - スクロールでのフェードイン表示
   - モバイル用ハンバーガーメニュー
   - スクロール時のヘッダー強調 */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {

    /* ---- Header: scrolled state ---- */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () {
        if (window.scrollY > 12) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      /* ---- Mobile hamburger (injected) ---- */
      var inner = header.querySelector('.header-inner');
      var navLinks = header.querySelector('.nav-links');
      if (inner && navLinks) {
        var btn = document.createElement('button');
        btn.className = 'nav-toggle';
        btn.setAttribute('aria-label', 'メニューを開く');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span></span><span></span><span></span>';
        inner.appendChild(btn);

        var setOpen = function (open) {
          header.classList.toggle('menu-open', open);
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
          btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
        };
        btn.addEventListener('click', function () {
          setOpen(!header.classList.contains('menu-open'));
        });
        navLinks.querySelectorAll('a').forEach(function (a) {
          a.addEventListener('click', function () { setOpen(false); });
        });
        window.addEventListener('resize', function () {
          if (window.innerWidth > 768) setOpen(false);
        });
      }
    }

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Premium UI: progress bar · back-to-top · mobile CTA ---- */
    var progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    var toTop = document.createElement('button');
    toTop.className = 'to-top';
    toTop.setAttribute('aria-label', 'ページ上部へ戻る');
    toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(toTop);
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    var path = location.pathname.split('/').pop();
    var mcta = document.createElement('div');
    mcta.className = 'mobile-cta';
    mcta.innerHTML =
      (path === 'recruit.html' ? '' : '<a class="m-recruit" href="recruit.html">採用情報</a>') +
      '<a class="m-contact" href="contact.html">お問い合わせ</a>';
    document.body.appendChild(mcta);

    var onScrollUI = function () {
      var st = window.scrollY || document.documentElement.scrollTop;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
      toTop.classList.toggle('show', st > 600);
      mcta.classList.toggle('show', st > 480);
    };
    onScrollUI();
    window.addEventListener('scroll', onScrollUI, { passive: true });

    /* ---- FAQ accordion ---- */
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        if (open) {
          a.style.maxHeight = null;
          item.classList.remove('open');
        } else {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });

    /* ---- Count-up numbers ---- */
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
      var runCount = function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;
        var small = el.querySelector('small');
        var suffix = small ? small.outerHTML : '';
        if (prefersReduced) { el.innerHTML = target + suffix; return; }
        var dur = 1300, start = null;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.innerHTML = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.innerHTML = target + suffix;
        };
        requestAnimationFrame(step);
      };
      if ('IntersectionObserver' in window) {
        var cio = new IntersectionObserver(function (ents) {
          ents.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { cio.observe(el); });
      } else {
        counters.forEach(runCount);
      }
    }

    /* ---- Scroll reveal ---- */
    if (prefersReduced || !('IntersectionObserver' in window)) return;

    var selectors = [
      '.manga-stage .panel',
      '.mg-divider',
      '.manga-cta',
      '.ed-index',
      '.ed-title',
      '.sns-card',
      '.about-media',
      '.about-facts .f',
      '.num-b',
      '.svc-row',
      '.philo-in',
      '.day-cell',
      '.gal-item',
      '.rec-in',
      '.sec-head',
      '.section-inner > .section-label',
      '.section-inner > .section-title',
      '.section-inner > .section-desc',
      '.section-inner > .divider',
      '.feature-body',
      '.reveal--img',
      '.fact',
      '.stat-item',
      '.value-card',
      '.reason',
      '.svc-card',
      '.service-item',
      '.flow-item',
      '.work',
      '.train-step',
      '.benefit',
      '.voice',
      '.faq-item',
      '.media-card',
      '.business-block',
      '.vision-inner',
      '.profile-table',
      '.recruit-job-card',
      '.cta-banner',
      '.contact-info-card',
      '.business-detail .business-inner > *'
    ];

    var els = [];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (els.indexOf(el) === -1) els.push(el);
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // 同じ親内の並び順で軽くずらす
          var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
          el.style.transitionDelay = Math.min(sibs, 4) * 80 + 'ms';
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    els.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  });
})();
