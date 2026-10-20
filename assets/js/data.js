/* ------------------------------------------------------------------
   data.js — 全站内容数据
   以后要替换成真实项目，只改这个文件即可，不用动 HTML / CSS。
   aspect 必须和封面图的实际宽高比一致，否则瀑布流会有缝。
   ------------------------------------------------------------------ */

const SITE = {
  name: 'yeziyou',
  nameCn: '晏紫翊',
  email: 'yzysepp4i@gmail.com',
  phone: '15397953018',
  city: '南京',
  role: '前端开发',
  status: '正在寻找实习机会',
  years: '',
  intro: '我喜欢把想法做成能真正跑起来的东西。从一个模糊的念头开始，一点点把它做出来，这个过程本身就有意思；最开心的是看到它真的被人用起来的那一刻。',
  introShort: 'Computer Science junior, focused on frontend development.',
};

const PROJECTS = [
  {
    id: 'campus-market',
    index: '01',
    title: '校园二手交易平台',
    titleEn: 'Campus Market',
    year: '2025',
    category: 'Web / 全栈',
    filter: 'Web 开发',
    tags: ['Next.js', 'Node.js', 'PostgreSQL'],
    cover: 'assets/img/cover-01.png',
    aspect: 1.5,
    role: '全栈开发 · 独立完成',
    summary: '面向校内学生的二手闲置交易平台，支持发布、搜索、站内消息与信用体系。',
    detail: {
      overview: '校内闲置交易一直靠微信群和公告栏，信息散、找东西慢、没有信用保障。这个项目把「发布 — 检索 — 沟通 — 成交」做成一条完整链路，并在校园场景下做了针对性的取舍：只允许校园邮箱注册，交易地点默认锁定在校内几个固定点位。',
      blocks: [
        { t: '挑战', d: '图片上传是最大的性能瓶颈：一个商品最多 9 张原图，直接上传会让首屏加载超过 4 秒。同时站内消息需要实时到达，但又不能让学生一直挂着长连接耗电。' },
        { t: '方案', d: '前端用 Next.js 做图片的客户端压缩与 WebP 转码，上传走分片 + 断点续传；后端用 PostgreSQL 存元数据、对象存储放原图，列表接口做游标分页避免深翻页。消息用 WebSocket，但只在对话页建立连接，其余场景用轮询兜底。' },
        { t: '结果', d: '首屏加载从 4.2s 降到 1.1s，图片流量下降约 68%。上线两个月累计注册 1400+ 校内用户，累计发布商品 3200+ 件。' },
      ],
      stack: ['Next.js', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Redis', '对象存储'],
      highlights: ['客户端图片压缩 / WebP 转码', '分片上传 + 断点续传', '游标分页 + 索引优化', 'WebSocket 按需连接'],
    },
    gallery: [
      { src: 'assets/img/cover-01.png', cap: '首页商品瀑布流' },
      { src: 'assets/img/detail-01.png', cap: '发布流程 · 图片预处理' },
    ],
  },
  {
    id: 'data-board',
    index: '02',
    title: '实时数据可视化大屏',
    titleEn: 'Realtime Data Board',
    year: '2025',
    category: 'Web / 前端',
    filter: '数据可视化',
    tags: ['React', 'ECharts', 'WebSocket'],
    cover: 'assets/img/cover-02.png',
    aspect: 0.667,
    role: '前端负责人 · 3 人团队',
    summary: '为校内实验室做的设备状态监控大屏，秒级刷新、自适应任意分辨率。',
    detail: {
      overview: '实验室有 40 多台设备需要监控，之前靠人工巡检。这套大屏把设备状态、任务队列、告警日志汇总到一块 4K 屏幕上，运维同学抬头就能看到全局。',
      blocks: [
        { t: '挑战', d: '大屏要在 4K 和 1080p 投影之间来回切换，普通响应式断点方案会整体缩放导致字看不清；秒级数据推送下，图表频繁重绘会让浏览器掉帧。' },
        { t: '方案', d: '用 CSS 的 clamp() + vmin 单位建立一套流式缩放体系，保证任意分辨率下字号和间距都是设计稿比例。数据层把每秒推送合并成 1s 一批，图表用增量更新而不是整体 setOption；离屏的图表暂停渲染。' },
        { t: '结果', d: '4K 下稳定 60fps，设备异常发现时间从平均 40 分钟缩短到 1 分钟内。' },
      ],
      stack: ['React', 'ECharts', 'WebSocket', 'Vite', 'CSS clamp / vmin'],
      highlights: ['流式缩放替代断点响应式', '数据批处理降低重绘', '离屏图表暂停渲染'],
    },
    gallery: [
      { src: 'assets/img/cover-02.png', cap: '主视图 · 设备状态总览' },
      { src: 'assets/img/detail-02.png', cap: '任务队列与告警' },
    ],
  },
  {
    id: 'aurora-ui',
    index: '03',
    title: '组件库与设计系统',
    titleEn: 'Aurora UI',
    year: '2024',
    category: '前端工程化',
    filter: '前端工程化',
    tags: ['TypeScript', 'React', 'Vite'],
    cover: 'assets/img/cover-03.png',
    aspect: 1.5,
    role: '独立开发 · 开源',
    summary: '一套内部使用的 React 组件库，从设计变量到可发布产物打通，覆盖 32 个组件。',
    detail: {
      overview: '起因是团队里三个项目各写各的按钮和弹窗。我把设计稿里的颜色、间距、圆角抽成一套 design token，再基于 token 实现组件，让「改一次样式，全部页面同步」这件事真正成立。',
      blocks: [
        { t: '挑战', d: '设计变量要同时用在上层业务代码和底层 CSS 里，两边容易不同步；组件库要支持按需引入，否则打包体积会失控。' },
        { t: '方案', d: 'token 用 JSON 维护，构建时同时产出 CSS 变量、TS 类型和 SCSS 变量三份产物，从源头保证一致。打包用 Vite 的库模式，输出 ESM + CJS，并接入 tree-shaking 友好的目录结构。' },
        { t: '结果', d: '三个项目接入后，新增页面的样式代码量减少约 45%，设计稿走查问题下降明显。' },
      ],
      stack: ['TypeScript', 'React', 'Vite', 'Style Dictionary', 'Storybook'],
      highlights: ['token 单一数据源三端产出', 'ESM / CJS 双产物', '按需引入'],
    },
    gallery: [
      { src: 'assets/img/cover-03.png', cap: '组件总览' },
      { src: 'assets/img/detail-03.png', cap: 'Design Token 体系' },
    ],
  },
  {
    id: 'noto',
    index: '04',
    title: '本地优先的知识管理',
    titleEn: 'Noto',
    year: '2025',
    category: 'Web App',
    filter: 'Web App',
    tags: ['Vue 3', 'IndexedDB', 'PWA'],
    cover: 'assets/img/cover-04.png',
    aspect: 1,
    role: '独立开发',
    summary: '离线可用的笔记应用，双向链接 + 全文检索，数据全部存在浏览器本地。',
    detail: {
      overview: '灵感来自自己整理考研笔记的痛点：云笔记断网就不能写，本地软件又不好跨设备。Noto 用「本地优先」的思路——所有操作先落本地，联网后再增量同步。',
      blocks: [
        { t: '挑战', d: '几万条笔记要在浏览器里做到即时全文检索，纯遍历会卡死主线程；多设备同时编辑同一篇笔记时会产生冲突。' },
        { t: '方案', d: '用 Web Worker 跑索引构建，把笔记切成 n-gram 建倒排索引，检索只查索引不查正文。同步层用「最后写入 + 字段级合并」的策略，冲突字段保留双版本让用户选择。' },
        { t: '结果', d: '2 万条笔记下检索响应 < 60ms，断网状态下全部功能可用。' },
      ],
      stack: ['Vue 3', 'Pinia', 'IndexedDB', 'Web Worker', 'PWA'],
      highlights: ['Web Worker 建索引', 'n-gram 倒排检索', '字段级冲突合并'],
    },
    gallery: [
      { src: 'assets/img/cover-04.png', cap: '编辑器与双向链接' },
      { src: 'assets/img/detail-04.png', cap: '知识图谱视图' },
    ],
  },
  {
    id: 'video-analytics',
    index: '05',
    title: '短视频数据分析看板',
    titleEn: 'Video Analytics',
    year: '2025',
    category: '数据可视化',
    filter: '数据可视化',
    tags: ['React', 'D3', 'Python'],
    cover: 'assets/img/cover-05.png',
    aspect: 0.667,
    role: '前端开发 · 2 人团队',
    summary: '把 300 万条播放数据做成可下钻的多维分析看板，支持自定义指标。',
    detail: {
      overview: '运营团队需要回答「哪类封面在什么时段表现最好」这类问题，但原始数据只有一张明细表。项目把它做成可以层层下钻的分析工具：总览 → 分品类 → 单条视频。',
      blocks: [
        { t: '挑战', d: '300 万行数据直接拉到前端不现实；不同维度的组合查询在数据库上很慢。' },
        { t: '方案', d: '后端预聚合成小时 / 天两级汇总表，常见维度组合提前算好；前端只请求聚合结果，用 D3 手写柱状、折线、热力图，保证交互和视觉统一。非常规组合走异步查询并给进度反馈。' },
        { t: '结果', d: '常规查询响应 < 200ms，运营的周报产出时间从半天缩短到 1 小时。' },
      ],
      stack: ['React', 'D3.js', 'Python', 'Pandas', 'PostgreSQL'],
      highlights: ['两级预聚合', 'D3 手写图表', '多维下钻交互'],
    },
    gallery: [
      { src: 'assets/img/cover-05.png', cap: '品类表现总览' },
      { src: 'assets/img/detail-05.png', cap: '时段 × 封面热力图' },
    ],
  },
  {
    id: 'canteen',
    index: '06',
    title: '食堂点餐小程序',
    titleEn: 'Canteen Order',
    year: '2024',
    category: '小程序',
    filter: '小程序',
    tags: ['微信小程序', '云开发'],
    cover: 'assets/img/cover-06.png',
    aspect: 1.5,
    role: '独立开发 · 已上线',
    summary: '校内食堂提前点餐、到点取餐的小程序，高峰排队时间下降约一半。',
    detail: {
      overview: '午休只有一小时，排队能占掉二十分钟。小程序让同学提前下单，食堂按取餐码分窗口出餐。用云开发省去服务器运维，一周内上线试运行。',
      blocks: [
        { t: '挑战', d: '11:50—12:10 是绝对的流量尖峰，下单、支付、出餐状态更新都挤在这二十分钟。' },
        { t: '方案', d: '菜单和价格走云开发的静态缓存，前端拿到后本地渲染；下单走云函数事务，库存用原子操作扣减防止超卖；出餐状态用云数据库的实时监听推送。' },
        { t: '结果', d: '高峰期稳定支撑 200+ 并发下单，平均排队时间从 18 分钟降到 8 分钟。' },
      ],
      stack: ['微信小程序', '云开发', '云函数', '云数据库', '微信支付'],
      highlights: ['菜单本地缓存', '原子扣减防超卖', '实时监听推送出餐状态'],
    },
    gallery: [
      { src: 'assets/img/cover-06.png', cap: '菜单与购物车' },
      { src: 'assets/img/detail-06.png', cap: '取餐码与出餐状态' },
    ],
  },
  {
    id: 'webgl-lab',
    index: '07',
    title: 'WebGL 交互实验',
    titleEn: 'WebGL Lab',
    year: '2025',
    category: '创意开发',
    filter: '创意开发',
    tags: ['Three.js', 'GLSL'],
    cover: 'assets/img/cover-07.png',
    aspect: 1,
    role: '个人实验',
    summary: '一组用着色器做的视觉实验，探索鼠标交互与 GPU 粒子系统的边界。',
    detail: {
      overview: '这是一个纯粹为了「好玩」的项目。把粒子数量提到 20 万之后，性能瓶颈从 CPU 完全转移到 GPU，于是开始手写着色器，把物理计算搬进顶点着色器。',
      blocks: [
        { t: '挑战', d: '20 万粒子在 JS 里逐帧算位置会直接卡死；鼠标交互要让粒子产生流体般的跟随，但每帧都要读鼠标位置。' },
        { t: '方案', d: '把初始位置和速度存进纹理，位置更新放在顶点着色器里用纹理采样完成；鼠标位置作为 uniform 传入，用噪声函数混合出有机的扰动。后期加一层辉光和后处理。' },
        { t: '结果', d: '20 万粒子在集显笔记本上仍能保持 50fps 以上。' },
      ],
      stack: ['Three.js', 'GLSL', 'WebGL 2', 'Vite'],
      highlights: ['GPU 粒子（纹理存状态）', '手写顶点着色器', '后处理辉光'],
    },
    gallery: [
      { src: 'assets/img/cover-07.png', cap: '粒子流体' },
      { src: 'assets/img/detail-07.png', cap: '噪声扰动参数调试' },
    ],
  },
  {
    id: 'checkin',
    index: '08',
    title: '扫码签到系统',
    titleEn: 'QR Check-in',
    year: '2024',
    category: 'Web / 全栈',
    filter: 'Web 开发',
    tags: ['Node.js', 'Redis'],
    cover: 'assets/img/cover-08.png',
    aspect: 1.5,
    role: '全栈开发 · 学生工作',
    summary: '为院系活动做的扫码签到，支持离线补签与实时到场统计。',
    detail: {
      overview: '院系活动签到还在用纸质表，统计到场率要人工数。这套系统用动态二维码 + 微信网页授权，扫码即签到，后台实时看到到场曲线。',
      blocks: [
        { t: '挑战', d: '二维码容易被拍照转发代签；场地网络不稳定，偶尔断网导致签到失败。' },
        { t: '方案', d: '二维码每 10 秒刷新一次并带时间戳签名，同一码只能被同一微信号使用一次，重复请求直接拒绝。前端把失败的签到请求存进本地队列，网络恢复后自动补交。' },
        { t: '结果', d: '单场 600 人活动签到零排队，代签率降到接近 0。' },
      ],
      stack: ['Node.js', 'Express', 'Redis', 'MySQL', '微信 JSSDK'],
      highlights: ['动态签名二维码', '本地队列离线补签', 'Redis 去重'],
    },
    gallery: [
      { src: 'assets/img/cover-08.png', cap: '签到二维码与倒计时' },
      { src: 'assets/img/detail-08.png', cap: '实时到场统计' },
    ],
  },
];

const EXPERIENCE = [
  { period: '2026.07 — 2026.09', org: '某互联网公司', role: '前端开发实习生', desc: '参与中后台系统重构，负责表单与表格组件的性能优化，把长列表滚动帧率从 30fps 提到 60fps。' },
  { period: '2025.09 — 2026.06', org: '校内实验室', role: '前端负责人', desc: '带 3 人小组完成设备监控大屏，负责技术选型、排期与前端实现。' },
  { period: '2024.09 — 至今', org: '学院学生会技术组', role: '技术组成员', desc: '负责院系活动系统的开发与维护，扫码签到系统已在多场活动中使用。' },
];

const SKILLS = [
  { group: '前端', items: ['JavaScript / TypeScript', 'React / Next.js', 'Vue 3', 'CSS 架构与动效', 'Vite / 工程化'] },
  { group: '后端与数据', items: ['Node.js / Express', 'Python / Django', 'PostgreSQL / MySQL', 'Redis', 'RESTful / WebSocket'] },
  { group: '其他', items: ['微信小程序', 'Three.js / GLSL', 'Docker 基础', 'Git 协作流程', 'Figma 读稿与还原'] },
];

/* 个人优势：每条都配一个站内已有的项目 / 数据作为支撑，不新造数字 */
const STRENGTHS = [
  {
    t: '从需求到上线，完整走完全程',
    d: '作品集里的每个项目，从数据库设计、接口开发、前端实现到部署上线，都由我一个人走完。我更习惯把它当作一次完整的产品交付，而不是只负责其中一层。',
    ev: '校园二手交易平台 · 扫码签到系统',
  },
  {
    t: '用数据驱动的性能优化',
    d: '遇到性能瓶颈先量化、再动手：先用指标定位问题，再选择优化手段，最后用数据验证效果。优化不是感觉变快了，而是有前后对比。',
    ev: '首屏加载 4.2s → 1.1s · 2 万条笔记检索 < 60ms',
  },
  {
    t: '复杂交互与可视化的实现能力',
    d: '大屏、多维看板、GPU 粒子这类偏底层的交互，我习惯追到渲染原理层面去解决，而不是停在调用现成的库。',
    ev: '4K 设备监控大屏稳定 60fps · 20 万粒子保持 50fps',
  },
  {
    t: '把东西做成真正能用的产品',
    d: '不满足于「能跑起来」，更在意它有没有被真实的人用起来、有没有解决一开始想解决的问题。',
    ev: '食堂点餐小程序 排队 18 → 8 分钟 · 扫码签到单场 600 人',
  },
];
