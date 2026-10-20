/* ==================================================================
   main.js — 导航、瀑布流排版、渲染各页面
   ================================================================== */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 瀑布流卡片缓存（保持原始顺序，重排时重新分配列） */
  var masonryCards = [];

  /* ---------------------------------------------------------- 导航 */
  function initNav() {
    var nav = $('.nav');
    if (!nav) return;

    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var here = location.pathname.split('/').pop() || 'index.html';
    if (here === 'work.html') here = 'index.html';   /* 详情页归到 Works */
    $$('.nav__link').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.split('#')[0] === here) a.classList.add('is-active');
    });
  }

  /* ------------------------------------------------- 滚动进场动效 */
  var io = null;
  function initReveal(root) {
    var nodes = $$('.reveal', root);
    if (!nodes.length) return;

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    }
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* --------------------------------------------- 瀑布流：均衡分列 */
  function cssInt(name, fallback) {
    var v = parseInt(getComputedStyle(document.documentElement).getPropertyValue(name), 10);
    return isNaN(v) ? fallback : v;
  }

  /* 给定每张卡的估算高度，按原始顺序装箱到 cols 列，
     在一列接近目标高度时就换下一列（列内保持 01→08 的阅读顺序） */
  function tryPack(est, cols, target) {
    var heights = [], assignment = [], ci = 0, i;
    for (i = 0; i < cols; i++) heights.push(0);
    for (i = 0; i < est.length; i++) {
      var h = est[i];
      if (ci < cols - 1 && heights[ci] > 0 && heights[ci] + h > target + h * 0.5) ci++;
      heights[ci] += h;
      assignment.push(ci);
    }
    var mx = Math.max.apply(null, heights);
    var mn = Math.min.apply(null, heights);
    return { spread: mx - mn, assignment: assignment };
  }

  /* 目标高度在 [均值, 均值+最高卡] 之间扫描，取列高差最小的方案 */
  function planColumns(est, cols) {
    var total = 0, mx = 0, i;
    for (i = 0; i < est.length; i++) { total += est[i]; if (est[i] > mx) mx = est[i]; }
    if (cols > est.length) cols = Math.max(1, est.length);

    var lo = total / cols, hi = lo + mx;
    var best = null;
    for (var t = 0; t <= 24; t++) {
      var res = tryPack(est, cols, lo + (hi - lo) * t / 24);
      if (!best || res.spread < best.spread) best = res;
      if (best.spread === 0) break;
    }
    return best.assignment;
  }

  function visibleCards() {
    return masonryCards.filter(function (c) { return !c.classList.contains('is-hidden'); });
  }

  function layoutMasonry() {
    var grid = $('#grid');
    if (!grid || !masonryCards.length) return;

    var cards = visibleCards();
    var cols = cssInt('--cols', 4);
    var gap = cssInt('--gap', 4);
    var metaH = cssInt('--meta-h', 66);

    /* 重建列容器并按方案分配（列数不变，保证筛选后卡片宽度一致） */
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    if (!cards.length) return;

    var inner = grid.clientWidth - (cols - 1) * gap;
    if (inner <= 0) return;
    var colW = inner / cols;

    /* 估算每张卡的真实高度（图片按 aspect-ratio 撑开 + 固定高度的信息条 + 间距） */
    var est = cards.map(function (card) {
      var ar = parseFloat(card.dataset.ar) || (4 / 3);
      return colW / ar + metaH + gap;
    });

    var plan = planColumns(est, cols);

    var colEls = [];
    for (var c = 0; c < cols; c++) {
      var el = document.createElement('div');
      el.className = 'grid__col';
      grid.appendChild(el);
      colEls.push(el);
    }
    cards.forEach(function (card, i) {
      colEls[plan[i]].appendChild(card);
    });
  }

  var rzTimer = null;
  function onResize() {
    clearTimeout(rzTimer);
    rzTimer = setTimeout(layoutMasonry, 120);
  }

  /* -------------------------------------------------- 渲染作品墙（瀑布流：封面 + 标题 + 简要说明） */
  function renderWorks() {
    var grid = $('#grid');
    if (!grid || typeof PROJECTS === 'undefined') return;

    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    grid.innerHTML = PROJECTS.map(function (p, i) {
      return '' +
        '<a class="grid__card reveal" href="work.html?id=' + p.id + '"' +
        ' data-ar="' + (p.aspect || (4 / 3)) + '"' +
        ' data-filter="' + (p.filter || '') + '">' +
          '<div class="grid__media" style="--ar:' + (p.aspect || (4 / 3)) + '">' +
            '<img src="' + p.cover + '" alt="' + p.title + '" loading="lazy" decoding="async">' +
          '</div>' +
          '<div class="grid__meta">' +
            '<div class="grid__row">' +
              '<span class="grid__idx">[' + pad(i + 1) + ']</span>' +
              '<span class="grid__title">' + p.title + '</span>' +
              '<span class="grid__year">' + p.year + '</span>' +
            '</div>' +
            '<p class="grid__desc">' + p.summary + '</p>' +
          '</div>' +
        '</a>';
    }).join('');

    masonryCards = $$('.grid__card', grid);

    var meta = $('.works__meta');
    if (meta && typeof SITE !== 'undefined') {
      meta.innerHTML =
        '<span>' + PROJECTS.length + ' 个项目 / 案例</span><br>' +
        '<span>全部独立完成</span><br>' +
        '<span>' + SITE.role + '</span>';
    }
  }

  /* ------------------------------------------------ 作品墙分类筛选 */
  var currentFilter = '全部';

  function filterGroups() {
    var groups = [];
    PROJECTS.forEach(function (p) {
      if (p.filter && groups.indexOf(p.filter) < 0) groups.push(p.filter);
    });
    return groups;
  }

  function countOf(g) {
    if (g === '全部') return PROJECTS.length;
    return PROJECTS.filter(function (p) { return p.filter === g; }).length;
  }

  function renderFilters() {
    var bar = $('#works-filters');
    if (!bar || typeof PROJECTS === 'undefined') return;

    var list = ['全部'].concat(filterGroups());
    bar.innerHTML = list.map(function (g) {
      var on = g === currentFilter;
      return '<button class="filter' + (on ? ' is-active' : '') + '" type="button"' +
        ' data-filter="' + g + '" aria-pressed="' + on + '">' + g +
        '<span class="filter__n">' + countOf(g) + '</span></button>';
    }).join('');

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.filter') : null;
      if (btn) applyFilter(btn.getAttribute('data-filter'));
    });
  }

  function applyFilter(g) {
    if (!g || g === currentFilter) return;
    currentFilter = g;

    masonryCards.forEach(function (item) {
      var match = g === '全部' || item.getAttribute('data-filter') === g;
      item.classList.toggle('is-hidden', !match);
      if (match) item.classList.add('is-in');   /* 曾被隐藏的卡片保证重新可见 */
    });
    layoutMasonry();   /* 筛选后重新均衡分列（列数不变，只排可见卡） */

    var bar = $('#works-filters');
    if (bar) {
      $$('.filter', bar).forEach(function (b) {
        var on = b.getAttribute('data-filter') === g;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on);
      });
    }
  }

  /* ---------------------------------------------------- 首屏封面 */
  function renderCover() {
    var meta = $('#cover-meta');
    var lead = $('#cover-lead');
    var facts = $('#cover-facts');
    if (!meta || typeof SITE === 'undefined') return;

    meta.innerHTML =
      '<span class="cover__meta-dot"></span>' + SITE.role +
      ' <em>/ ' + SITE.status + '</em>';
    lead.textContent = SITE.intro;

    if (facts) {
      var types = filterGroups().join(' / ');
      facts.innerHTML =
        '<div class="cover__fact"><span>覆盖类型</span><strong>' + types + '</strong></div>' +
        '<div class="cover__fact"><span>实现方式</span><strong>设计 + 前端 + 部署，全部独立完成</strong></div>' +
        '<div class="cover__fact"><span>坐标</span><strong>' + SITE.city + ' · ' + SITE.nameCn + '</strong></div>';
    }
  }

  /* ---------------------------------------------------- 文字打散 */
  function splitChars(el) {
    if (!el) return;
    var text = el.textContent;
    el.textContent = '';
    var i = 0;
    Array.prototype.forEach.call(text, function (c) {
      if (c === ' ' || c === '\n') {
        el.appendChild(document.createTextNode(' '));
        return;
      }
      var s = document.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--i', i++);
      s.textContent = c;
      el.appendChild(s);
    });
  }

  /* ---------------------------------------------------- 关于页面 */
  function renderAbout() {
    var root = $('#about-root');
    if (!root || typeof SITE === 'undefined') return;

    root.innerHTML = '' +
      '<div class="about__grid">' +
        '<figure class="about__portrait reveal">' +
          '<img src="assets/img/portrait.png" alt="' + SITE.nameCn + '">' +
        '</figure>' +
        '<div class="about__proto">' +
          '<div class="prose reveal">' +
            '<h2>你好，我是' + SITE.nameCn + '</h2>' +
            '<p>' + SITE.intro + '</p>' +
            '<p>比起「写完就行」，我更在意一个页面在按下回车之前被推敲过多少遍 —— 间距是不是对得上、动效是不是有理由、弱网下会不会白屏。我把作品集里的每个项目都当作一次完整的交付来对待：需求拆解、技术选型、上线、复盘。</p>' +
            '<p>目前正在寻找前端方向的实习机会，也欢迎一切有意思的合作。</p>' +
          '</div>' +
          '<div class="skills" style="margin-top:clamp(40px,6vh,72px)">' +
            (typeof SKILLS !== 'undefined' ? SKILLS.map(function (g) {
              return '<div class="skills__group reveal">' +
                '<h3>' + g.group + '</h3>' +
                '<div class="skills__list">' +
                  g.items.map(function (t) { return '<span class="chip">' + t + '</span>'; }).join('') +
                '</div></div>';
            }).join('') : '') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="section-rule"></div>' +
      '<div class="prose" style="margin-bottom:clamp(28px,4.5vh,50px)"><h2>个人优势</h2>' +
        '<p>几条我认为最值得说的能力，每一条都配了作品集里可以点开验证的项目或数据。</p>' +
      '</div>' +
      '<div class="strengths">' +
        (typeof STRENGTHS !== 'undefined' ? STRENGTHS.map(function (s, i) {
          return '<article class="strength reveal">' +
            '<span class="strength__idx">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
            '<h3 class="strength__t">' + s.t + '</h3>' +
            '<p class="strength__d">' + s.d + '</p>' +
            '<p class="strength__ev">' + s.ev + '</p>' +
          '</article>';
        }).join('') : '') +
      '</div>' +
      '<div class="section-rule"></div>' +
      '<div class="prose" style="margin-bottom:26px"><h2>经历</h2></div>' +
      '<div class="timeline">' +
        (typeof EXPERIENCE !== 'undefined' ? EXPERIENCE.map(function (e) {
          return '<div class="timeline__item reveal">' +
            '<div class="timeline__period">' + e.period + '</div>' +
            '<div>' +
              '<div class="timeline__role">' + e.role + '</div>' +
              '<div class="timeline__org">' + e.org + '</div>' +
              '<p class="timeline__desc">' + e.desc + '</p>' +
            '</div></div>';
        }).join('') : '') +
      '</div>';
  }

  /* ---------------------------------------------------- 联系页面 */
  function renderContact() {
    var root = $('#contact-root');
    if (!root || typeof SITE === 'undefined') return;

    root.innerHTML = '' +
      '<a class="contact__mail" href="mailto:' + SITE.email + '">' + SITE.email + '</a>' +
      '<a class="contact__tel" href="tel:' + SITE.phone + '">' +
        '<span class="contact__tel-label">电话 / Tel</span>' + SITE.phone + '</a>' +
      '<div class="contact__actions">' +
        '<button class="btn" data-copy="' + SITE.email + '">复制邮箱</button>' +
        '<button class="btn" data-copy="' + SITE.phone + '">复制电话</button>' +
        '<a class="btn" href="mailto:' + SITE.email + '">写邮件</a>' +
        '<a class="btn" href="tel:' + SITE.phone + '">打电话</a>' +
        '<a class="btn" href="gallery.html#works">看作品</a>' +
      '</div>' +
      '<dl class="contact__facts">' +
        '<div class="contact__fact"><dt>邮箱 / Email</dt>' +
          '<dd><a href="mailto:' + SITE.email + '">' + SITE.email + '</a></dd></div>' +
        '<div class="contact__fact"><dt>电话 / Phone</dt>' +
          '<dd><a href="tel:' + SITE.phone + '">' + SITE.phone + '</a></dd></div>' +
        '<div class="contact__fact"><dt>所在城市 / City</dt><dd>' + SITE.city + '</dd></div>' +
        '<div class="contact__fact"><dt>方向 / Focus</dt><dd>' + SITE.role + '</dd></div>' +
        '<div class="contact__fact"><dt>状态 / Status</dt><dd>' + SITE.status + '</dd></div>' +
        '<div class="contact__fact"><dt>回复 / Reply</dt><dd>通常在 24 小时内</dd></div>' +
      '</dl>' +
      '<p class="page__lead" style="margin-top:clamp(48px,8vh,90px)">' +
        '如果你在看我的作品，或者手上有合适的机会，欢迎邮件或电话联系我。' +
        '如果是比赛或合作评阅，需要项目源码、演示视频或更详细的设计说明，也请告诉我，我会尽快整理给你。' +
      '</p>';
  }

  /* ---------------------------------------------------- 作品详情 */
  function renderCase() {
    var root = $('#case-root');
    if (!root || typeof PROJECTS === 'undefined') return;

    var id = new URLSearchParams(location.search).get('id');
    var i = PROJECTS.findIndex(function (p) { return p.id === id; });
    if (i < 0) i = 0;

    var p = PROJECTS[i];
    var prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
    var next = PROJECTS[(i + 1) % PROJECTS.length];
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    document.title = p.title + ' · ' + SITE.name;

    var metaRows = [
      ['年份 / Year', p.year],
      ['角色 / Role', p.role],
      ['类型 / Type', p.category],
      ['技术栈 / Stack', p.detail.stack.join(', ')]
    ];

    root.innerHTML = '' +
      '<div class="case__top">' +
        '<a class="back" href="gallery.html#works">← 全部作品 / All works</a>' +
        '<span class="case__no">' + pad(i + 1) + ' / ' + pad(PROJECTS.length) + '</span>' +
      '</div>' +

      '<header class="case__head">' +
        '<h1 class="case__title">' + p.title + '</h1>' +
        '<p class="case__subtitle">' + p.titleEn + '</p>' +
        '<p class="case__summary">' + p.summary + '</p>' +
      '</header>' +

      '<dl class="case__meta">' +
        metaRows.map(function (r) {
          return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
        }).join('') +
      '</dl>' +

      '<figure class="case__cover reveal">' +
        '<img src="' + p.cover + '" alt="' + p.title + ' 封面" decoding="async">' +
      '</figure>' +

      '<div class="case__body">' +
        '<section class="prose case__oversight reveal" style="margin-top:clamp(48px,7vh,90px)">' +
          '<h2>项目概述</h2>' +
          '<p>' + p.detail.overview + '</p>' +
        '</section>' +

        '<div class="case__blocks">' +
          p.detail.blocks.map(function (b) {
            return '<div class="case__block reveal">' +
              '<h3>' + b.t + '</h3><p>' + b.d + '</p></div>';
          }).join('') +
        '</div>' +

        '<div class="case__blocks" style="border-top:0">' +
          '<div class="case__block reveal">' +
            '<h3>技术要点</h3>' +
            '<p>' + p.detail.highlights.join('　·　') + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="case__gallery">' +
        p.gallery.map(function (g) {
          return '<figure class="case__fig reveal">' +
            '<img src="' + g.src + '" alt="' + g.cap + '" loading="lazy" decoding="async">' +
            '<figcaption>' + g.cap + '</figcaption></figure>';
        }).join('') +
      '</div>' +

      '<nav class="case__pager">' +
        '<a class="pager__link" href="work.html?id=' + prev.id + '">' +
          '<span class="pager__dir">← 上一个项目</span>' +
          '<div class="pager__name">' + prev.title + '</div>' +
        '</a>' +
        '<a class="pager__link pager__link--next" href="work.html?id=' + next.id + '">' +
          '<span class="pager__dir">下一个项目 →</span>' +
          '<div class="pager__name">' + next.title + '</div>' +
        '</a>' +
      '</nav>';
  }

  /* -------------------------------------------------- 复制到剪贴板 */
  function initCopy() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-copy]');
      if (!btn) return;
      var text = btn.getAttribute('data-copy');
      var done = function () {
        var old = btn.textContent;
        btn.textContent = '已复制 ✓';
        btn.classList.add('is-done');
        setTimeout(function () {
          btn.textContent = old;
          btn.classList.remove('is-done');
        }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) { /* noop */ }
        document.body.removeChild(ta);
        done();
      }
    });
  }

  /* ------------------------------------------------------ 启动 */
  function boot() {
    renderCover();
    renderWorks();
    renderFilters();
    renderAbout();
    renderContact();
    renderCase();

    $$('.page__title').forEach(splitChars);

    initNav();
    initCopy();
    layoutMasonry();
    initReveal(document);

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    /* 图片加载完再量一次，双保险 */
    window.addEventListener('load', layoutMasonry);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('is-ready');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
