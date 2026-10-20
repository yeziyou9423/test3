/* ==================================================================
   hero.js — 首屏「散落照片球」（地球仪式旋转）
   · 外观：照片大小不一、横竖混排、随机错落散在一层球壳上（不是密铺的实心球）
   · 滚轮 → 整个球绕「垂直轴」水平转动（左右转，像地球仪）
     卡片在三维空间中环绕移动，有透视变化与前后遮挡
   · 平滑 + 惯性；不上下翻转、不 360° 自由乱转（转角有范围限制，到头放行页面滚动）
   · 悬停某张照片：页面底部显示作品名，点击进入详情
   · 首屏沉浸：无导航栏、无标题、无按钮，只有这团照片
   ================================================================== */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  var cluster = document.getElementById('hero-cluster');
  var cursor = document.getElementById('stage-cursor');
  var heroCaption = document.getElementById('hero-caption');
  if (!hero || !cluster || typeof PROJECTS === 'undefined' || !PROJECTS.length) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var DEG = Math.PI / 180;

  /* ---------------- 球体参数 ----------------
     半径用 vmin，任何屏幕比例下都是正球。透视距离 = 半径 × CAM，
     所以照片放大缩小时立体感自动保持一致（球心的照片更近更大，边缘侧过去）。 */
  var R = 34;                 /* 球半径（vmin） */
  var CAM = 3.0;              /* 相机距离 / 半径：太近侧面畸变厉害 */
  var ROT_MAX = 120;          /* 整球左右转动范围（±deg）：不 360° 自由乱转 */

  /* ---------------- 照片在球壳上的落点：纬度环带 + 抖动 ----------------
     ⚠️ 不能用完全随机的球面撒点：某个角度正面会缺一片，看起来就散了。
     环带保证每个角度都有覆盖；再加大抖动 + 大小/横竖混排，读起来是散落的照片，
     而不是整齐的地球仪网格。照片数量刻意不多（留大量空白，像参考图）。 */
  var SIZES = [9, 13, 8, 16, 10.5, 14, 8.5, 12, 17, 9.5, 13.5, 11];   /* vmin */
  var RATIOS = [3 / 4, 4 / 3, 1, 3 / 4, 1, 4 / 3, 3 / 4, 4 / 3];
  var narrow = window.innerWidth < 760;
  /* 8 个作品、封面循环铺开：桌面 16 张（每张出现两次）、窄屏 12 张 —— 刻意稀疏，留白多 */
  var RINGS = narrow
    ? [{ lat: 72, n: 1 }, { lat: 44, n: 2 }, { lat: 16, n: 3 },
       { lat: -16, n: 3 }, { lat: -46, n: 2 }, { lat: -72, n: 1 }]
    : [{ lat: 72, n: 2 }, { lat: 44, n: 3 }, { lat: 16, n: 3 },
       { lat: -16, n: 3 }, { lat: -46, n: 3 }, { lat: -72, n: 2 }];

  function buildCards(rings) {
    var out = [], k = 0;
    for (var r = 0; r < rings.length; r++) {
      var ring = rings[r];
      for (var j = 0; j < ring.n; j++) {
        out.push({
          lat: ring.lat + (((k * 53) % 7) - 3) * 2.2,                        /* ±6.6° 抖动 */
          lon: -180 + (j + 0.5) * 360 / ring.n + (((k * 37) % 13) - 6) * 2.6,
          w: SIZES[k % SIZES.length],
          r: RATIOS[k % RATIOS.length]
        });
        k++;
      }
    }
    return out;
  }
  var CARDS = buildCards(RINGS);
  var N = CARDS.length;

  /* 球半径的像素值，measure() 里算 */
  var Rpx = 300;

  var hovered = null;
  var mx = 0, my = 0;          /* 鼠标相对屏幕中心的偏移 */
  var px = 0, py = 0;          /* 缓动后的值 */

  /* ---------------- 注入封面（8 张封面循环使用） ----------------
     ⚠️ 用函数包一层：var 是函数作用域，直接在 for 里注册监听会让所有卡片共享
     同一个 p / a，悬停时取到的永远是最后一张的作品名。 */
  var items = [], data = [];

  function addCard(p, sp, i) {
    var a = document.createElement('a');
    a.className = 'cluster__item';
    a.href = 'work.html?id=' + encodeURIComponent(p.id);
    a.setAttribute('aria-label', p.title);
    /* 宽度：vmin 为主体、两端加 px 兜底；高度按比例（横竖混排） */
    a.style.setProperty('--w',
      'clamp(' + Math.round(sp.w * 3.2) + 'px, ' + sp.w.toFixed(1) + 'vmin, ' + Math.round(sp.w * 12) + 'px)');
    a.style.aspectRatio = sp.r;
    if ((i % 3) === 1) a.style.setProperty('--mx', '-1');   /* 部分照片左右镜像 */

    var im = document.createElement('img');
    im.src = p.cover;
    im.alt = p.title;
    im.decoding = 'async';
    if (i >= 8) im.loading = 'lazy';
    a.appendChild(im);

    if (hasHover) {
      a.addEventListener('mouseenter', function () { onEnter(a, p); });
      a.addEventListener('mouseleave', function () { onLeave(a); });
    }

    cluster.appendChild(a);
    items.push(a);

    var la = sp.lat * DEG;
    data.push({
      el: a,
      lat: sp.lat,
      lon0: sp.lon,
      cosLa: Math.cos(la),
      sinLa: Math.sin(la),
      tilt: ((i * 53) % 7 - 3) * 0.7,                   /* 自身极轻微倾斜（±2.1°） */
      ph: ((i * 137) % 628) / 100,                      /* 0..2π 相位错开 */
      amp: 1.8 + (i % 4) * 1.1,                         /* 漂浮幅度（px） */
      spd: 0.5 + (i % 5) * 0.14,
      zi: -1, op: -1, bl: -1
    });
  }

  for (var i = 0; i < N; i++) addCard(PROJECTS[i % PROJECTS.length], CARDS[i], i);

  function onEnter(a, p) {
    hovered = a;
    a.style.zIndex = 500;                 /* 悬停那张盖住所有卡片 */
    a.style.filter = 'none';
    a.style.opacity = 1;
    if (cursor) cursor.classList.add('is-card');
    if (heroCaption) {
      heroCaption.innerHTML =
        '<span class="scatter__caption-idx">[' + p.index + ']</span>' + p.title;
      heroCaption.classList.add('is-on');
    }
  }
  function onLeave(a) {
    if (hovered === a) hovered = null;
    if (cursor) cursor.classList.remove('is-card');
    if (heroCaption) heroCaption.classList.remove('is-on');
    var d = null;
    for (var k = 0; k < data.length; k++) if (data[k].el === a) { d = data[k]; break; }
    if (d) { d.zi = d.op = d.bl = -1; }   /* 让下一帧重新写回景深样式 */
  }

  /* ---------------- 尺寸测量：球半径 px + 透视距离 ---------------- */
  function measure() {
    var vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
    Rpx = R * vmin;
    cluster.style.perspective = Math.round(Rpx * CAM) + 'px';
  }

  /* ---------------- 滚轮：整个球绕垂直轴转动 ----------------
     · 下滚 → 往左转；上滚 → 往右转
     · 转角正比于滚动量，但有范围（±ROT_MAX），不上下翻转、不 360° 自由乱转
     · 平滑追赶 + 惯性：松手后还会顺着方向再滑一小段
     · 转到范围尽头继续滚 → 放行页面滚动（进得了下面的作品区）；
       回到页顶自动重新可用 */
  var DEG_PER_PX = 0.35;     /* 每 1px 滚动量 → 转角（deg） */
  var KICK = 0.012;          /* 滚动注入的惯性初速（deg/帧 per px） */
  var MAX_VEL = 5;           /* 惯性上限（deg/帧） */
  var DECAY = 0.78;          /* 惯性衰减（每帧） */
  var FOLLOW = 0.12;         /* 当前角平滑追赶目标角 */
  var rot = 0, rotT = 0, vel = 0;
  var released = false;

  function norm(deltaY, deltaMode) {
    var d = deltaY;
    if (deltaMode === 1) d *= 16;        /* 行 */
    else if (deltaMode === 2) d *= 100;  /* 页 */
    return d;
  }
  function spin(d) {
    if (released) return false;
    var dir = d > 0 ? -1 : 1;            /* 下滚（d>0）= 负角 */
    var next = rotT + dir * Math.abs(d) * DEG_PER_PX;
    if (next >= ROT_MAX) { rotT = ROT_MAX; released = true; vel = 0; return true; }
    if (next <= -ROT_MAX) { rotT = -ROT_MAX; released = true; vel = 0; return true; }
    rotT = next;
    vel += dir * Math.abs(d) * KICK;     /* 惯性 */
    if (vel > MAX_VEL) vel = MAX_VEL;
    if (vel < -MAX_VEL) vel = -MAX_VEL;
    return true;
  }
  /* 触屏拖动：直接改目标角（跟手），松手时把最后的速度留给惯性 */
  function drag(deg) {
    if (released) return;
    rotT = Math.max(-ROT_MAX, Math.min(ROT_MAX, rotT + deg));
    vel = deg * 0.4;
  }

  hero.addEventListener('wheel', function (e) {
    if (!ballActive()) return;                                /* 球不在视口：不拦截 */
    var d = norm(e.deltaY, e.deltaMode);
    if (Math.abs(d) < 1) return;
    if (!spin(d)) return;                                     /* 到头了：放行页面滚动 */
    e.preventDefault();
  }, { passive: false });

  /* 触屏：左右拖动转球（竖向手势留给页面滚动） */
  var tx0 = null, ty0 = null, txl = null;
  hero.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    tx0 = txl = e.touches[0].clientX;
    ty0 = e.touches[0].clientY;
  }, { passive: true });
  hero.addEventListener('touchmove', function (e) {
    if (txl === null || !ballActive()) return;
    var cx = e.touches[0].clientX, cy = e.touches[0].clientY;
    if (Math.abs(cx - tx0) < 8 || Math.abs(cx - tx0) < Math.abs(cy - ty0)) return;
    drag((cx - txl) * 0.4);
    txl = cx;
    e.preventDefault();
  }, { passive: false });
  hero.addEventListener('touchend', function () { tx0 = ty0 = txl = null; }, { passive: true });

  /* ---------------- 鼠标视差 + 自定义光标 ---------------- */
  if (hasHover) {
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX - window.innerWidth / 2;
      my = e.clientY - window.innerHeight / 2;
      if (cursor) cursor.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
    }, { passive: true });

    hero.addEventListener('mouseenter', function () {
      if (cursor && ballActive()) cursor.classList.add('is-on');
    });
    hero.addEventListener('mouseleave', function () {
      if (cursor) cursor.classList.remove('is-on');
    });
  }

  function ballActive() {
    var r = hero.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    return r.top < vh * 0.5 && r.bottom > vh * 0.5;   /* 球体横跨视口中线才算激活 */
  }

  /* ---------------- 逐帧摆位：球面经纬度 → 三维坐标 ----------------
     x = R·cos(lat)·sin(lon)   y = R·sin(lat)   z = R·cos(lat)·cos(lon)
     照片只「走位置」，不做朝向：每张都端正地平面对镜头（不贴球壳、不朝外翻），
     远近由 z 决定 —— 转到前面就大、到背面就小，前后遮挡照样成立。
     z > 0 在前面（更近更大、压住后面的），z < 0 转到背面（缩小 + 虚化 + 变淡）。 */
  var CARD_PARALLAX = 0.05;   /* 每单位景深的鼠标位移系数（近处动得多） */

  function place(d, t) {
    var el = d.el;
    var lo = (d.lon0 + rot) * DEG;
    var sinLo = Math.sin(lo), cosLo = Math.cos(lo);
    var x = Rpx * d.cosLa * sinLo;
    var y = Rpx * d.sinLa;
    var z = Rpx * d.cosLa * cosLo;
    var depth = z / (Rpx || 1);                        /* -1（最后）… 1（最前） */

    /* 漂浮 + 分层鼠标视差（近处幅度大，远处几乎不动） */
    var fx = 0, fy = 0;
    if (!reduce) {
      fx = Math.sin(t * d.spd + d.ph) * d.amp + px * CARD_PARALLAX * depth;
      fy = Math.cos(t * d.spd * 0.8 + d.ph * 1.7) * d.amp * 0.8 + py * CARD_PARALLAX * depth;
    }

    /* 姿态：只有平面内的极轻微倾斜（散落感），不做立体朝向翻转 */
    el.style.transform =
      'translate(-50%,-50%) translate3d(' + (x + fx).toFixed(1) + 'px,' + (y + fy).toFixed(1) + 'px,' + z.toFixed(1) + 'px)' +
      ' rotate(' + d.tilt.toFixed(2) + 'deg)';

    if (el === hovered) return;                        /* 悬停那张：保持在最前、不虚化 */

    /* 前后遮挡 + 轻微景深：正面清晰，转向背面慢慢淡去。
       （照片是平面对镜头的，不会被透视压成细条，所以球侧不用再隐去） */
    var near = (cosLo + 1) / 2;                        /* 0 = 球背面，1 = 正对镜头 */
    var vis = cosLo >= 0 ? 1 : 0.36 + 0.64 * (cosLo + 1);
    var zi = 20 + Math.round(near * 100);
    if (d.zi !== zi) { d.zi = zi; el.style.zIndex = zi; }
    var op = Math.round(vis * (0.45 + 0.55 * Math.pow(near, 0.75)) * 50) / 50;
    if (d.op !== op) { d.op = op; el.style.opacity = op; }
    var bl = Math.round((1 - near) * 6) / 4;           /* 0 … 1.5px，0.25 一档 */
    if (d.bl !== bl) {
      d.bl = bl;
      el.style.filter = bl > 0.05 ? 'blur(' + bl.toFixed(2) + 'px)' : '';
    }
  }

  function placeAll(t) {
    for (var k = 0; k < data.length; k++) place(data[k], t);
  }

  /* ---------------- 动画循环 ---------------- */
  var running = false, rafId = null;

  function loop(now) {
    if (!running) return;
    var t = now / 1000;

    /* 惯性：目标角继续推进一点，速度指数衰减（仍受 ROT_MAX 限制） */
    if (vel) {
      rotT += vel;
      if (rotT > ROT_MAX) rotT = ROT_MAX;
      if (rotT < -ROT_MAX) rotT = -ROT_MAX;
      vel *= DECAY;
      if (Math.abs(vel) < 0.004) vel = 0;
    }
    /* 当前角平滑追赶目标角 → 转动始终是缓的 */
    rot += (rotT - rot) * FOLLOW;

    px += (mx - px) * 0.06;
    py += (my - py) * 0.06;
    cluster.style.transform =
      'translate3d(' + (px * 0.015).toFixed(1) + 'px,' + (py * 0.015).toFixed(1) + 'px,0)';

    placeAll(t);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(loop);
  }
  function stop() {
    if (!running) return;
    running = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  /* ---------------- 可见性：球进入视口才开始动画，离开就停 ----------------
     离开视口时把 released 重置 —— 下次再滚回来，转动重新可用（角度保留）。 */
  function syncMode() {
    if (ballActive()) start();
    else {
      released = false;
      stop();
      if (cursor) cursor.classList.remove('is-on');
    }
  }
  window.addEventListener('scroll', syncMode, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else if (ballActive()) start();
  });

  /* 窗口尺寸变化：重新量球半径并立刻按新尺寸摆一遍 */
  var rzTimer = null;
  window.addEventListener('resize', function () {
    if (rzTimer) clearTimeout(rzTimer);
    rzTimer = setTimeout(function () { measure(); placeAll(performance.now() / 1000); }, 120);
  });

  /* ---------------- 启动 ---------------- */
  measure();
  placeAll(0);
  syncMode();
  start();

  /* 调试钩子（上线无害）：控制台里可把球钉在任意角度检查摆位 */
  window.__ball = {
    get: function () { return { rot: rot, rotT: rotT, vel: vel, released: released }; },
    set: function (v) { rotT = v; rot = v; vel = 0; placeAll(performance.now() / 1000); }
  };

  /* 入场：照片像参考站那样淡入出现（图片解码后开始，最多再等 900ms 兜底） */
  function once() { cluster.classList.add('is-ready'); }
  var revealed = false;
  function onceGuard() { if (!revealed) { revealed = true; once(); } }
  var lastImg = items.length && items[items.length - 1].querySelector('img');
  if (lastImg) {
    if (lastImg.complete) setTimeout(onceGuard, 120);
    else lastImg.addEventListener('load', function () { setTimeout(onceGuard, 120); });
  }
  setTimeout(onceGuard, 900);
})();
