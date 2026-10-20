/* ------------------------------------------------------------------
   starfield.js — 清新漂浮光点背景
   固定全屏 canvas：三层视差光点 + 呼吸式闪烁 + 缓慢上浮 + 鼠标视差
   自动处理 devicePixelRatio / resize / 标签页隐藏暂停 / 减弱动效偏好
   ------------------------------------------------------------------ */
(function () {
  var canvas = document.getElementById('starfield');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dpr = 1;
  var W = 0;
  var H = 0;
  var dots = [];
  var mx = 0, my = 0;        /* 鼠标归一化位置（-1 → 1） */
  var tmx = 0, tmy = 0;      /* 缓动后的视差偏移 */
  var raf = null;
  var last = 0;

  /* 光点色系：薄荷 / 天蓝 / 蜜桃（浅色底上的柔和点缀） */
  var COLORS = [
    'rgba(47,176,138,',
    'rgba(79,190,230,',
    'rgba(255,156,134,'
  ];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    /* 光点密度随视口面积变化，并设上下限，保证小屏流畅、大屏够满 */
    var count = Math.round(Math.min(Math.max((W * H) / 7000, 90), 320));
    dots = [];
    for (var i = 0; i < count; i++) {
      var depth = Math.random();                  /* 0 = 远，1 = 近 */
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        d: depth,
        r: rand(1.1, 3.4) * (0.6 + depth * 0.8),
        a: rand(0.22, 0.6) * (0.55 + depth * 0.6),
        sp: rand(0.008, 0.03) * (0.5 + depth),
        ph: Math.random() * Math.PI * 2,
        c: COLORS[Math.random() < 0.46 ? 0 : (Math.random() < 0.58 ? 1 : 2)]
      });
    }
  }

  function draw(dt, t) {
    ctx.clearRect(0, 0, W, H);

    /* 鼠标视差缓动 */
    tmx += (mx - tmx) * 0.055;
    tmy += (my - tmy) * 0.055;

    for (var i = 0; i < dots.length; i++) {
      var s = dots[i];

      /* 极缓慢地上浮漂移，像空气里的光尘 */
      s.y -= s.sp * 22 * dt;
      s.x += s.sp * 7 * dt;
      if (s.y < -6) { s.y = H + 6; s.x = Math.random() * W; }
      if (s.x > W + 6) { s.x = -6; }

      var depthPar = 10 + s.d * 46;
      var px = s.x + tmx * depthPar;
      var py = s.y + tmy * depthPar;

      /* 呼吸式闪烁 */
      var tw = 0.74 + 0.26 * Math.sin(t * 0.0014 * (0.6 + s.d) + s.ph);
      var alpha = s.a * tw;

      ctx.beginPath();
      ctx.fillStyle = s.c + alpha.toFixed(3) + ')';
      ctx.arc(px, py, s.r * (0.92 + 0.2 * tw), 0, Math.PI * 2);
      ctx.fill();

      /* 近处大光点加一层柔和晕光 */
      if (s.d > 0.66 && s.r > 2.2) {
        ctx.beginPath();
        ctx.fillStyle = s.c + (alpha * 0.12).toFixed(3) + ')';
        ctx.arc(px, py, s.r * 3.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!last) last = now;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    draw(dt, now);
  }

  function start() {
    if (reduce || raf !== null) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }

  var rt = null;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      resize();
      if (reduce) draw(0, 0);
    }, 120);
  }, { passive: true });

  window.addEventListener('mousemove', function (e) {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  resize();
  draw(0, 0);
  start();
})();
