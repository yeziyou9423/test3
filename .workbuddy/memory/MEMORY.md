# 作业三 · 项目长期备忘

## 用户背景
- 计算机科学与技术专业**大三**学生（2026.10 时），**2024 级**（用户已确认），2028 届毕业，前端/全栈方向。
- 求职定位：**前端开发**；自我介绍亮点=独立完成度高、技术深度、设计感；文风带点个性；不编造数据/经历。
- 作品集面向招聘方与比赛评委；站点内所有时间线必须与此一致（届别=2028、项目年份≥2024）。

## 文案口径（全站统一）
- 求职定位「前端开发」，不提全栈、不提设计。
- ⚠️ **用户明确要求：全站不要出现专业（计算机科学与技术）和年级/届别（大三、2024 级、2028 届）**——已从首屏状态行、简介、meta 描述、works 统计、About 求职句中全部移除；状态行改为「正在寻找实习机会」，works 统计中间行改为「全部独立完成」，页脚署名「Designed & built by yeziyou」改为「Built by yeziyou」。
- 首屏草绿介绍（第十版，现役，写做作品的乐趣）：「我喜欢把想法做成能真正跑起来的东西。从一个模糊的念头开始，一点点把它做出来，这个过程本身就有意思；最开心的是看到它真的被人用起来的那一刻。」字号 13.5–16px 段落体。
- ⚠️ 用户要求简介里**不写自己做什么**（职业/工种/工作内容都不出现，如「做前端」「写代码、调试、上线」）——介绍只谈做作品的感受和乐趣；职业信息由小字 meta 行「FRONTEND DEVELOPER」承担。
- ⚠️ 网站要拿去**参加比赛**（也兼顾招聘），文案必须专业稳重；学计算机、不是学设计——文案走工程/技术口径；不要自嘲、不要套路排比、不要抽象大词、不要「酷」的短句。

## yeziyou 个人作品集网站
- 纯 HTML/CSS/JS 零构建，多页面：index / about / contact / work(详情)，内容统一在 assets/js/data.js。**真实联系方式（2026-10-16 用户提供，全站已接入）**：邮箱 yzysepp4i@gmail.com（SITE.email）、电话 15397953018（SITE.phone）；页脚有 tel 链接 + 复制邮箱/复制电话按钮，联系页有大号邮箱+电话行、facts 网格含邮箱/电话。
- **真实姓名=晏紫翊**（⚠️ 2026-10-18 用户更正，不是「叶子游」，SITE.nameCn 已改、四个页脚已同步）。About 头像=assets/img/portrait.png（2026-10-18 定稿：**正面 single-line 线条画**——深绿细线、米白纸感底、正面对称正视前方，带轻刘海、年龄感约 21 岁（⚠️ 不要太成熟也不要太幼态，勿侧面）；迭代教训：kawaii 太萌、editorial 太复杂、普通 line-art 太僵硬均被否；水印一律裁掉；.about__portrait aspect-ratio 改 1/1）。
- **作品墙（2026-10-16 定稿：瀑布流 + 简要说明；2026-10-20 起随照片球移入 gallery.html）**——gallery.html #works 下 #grid 容器，main.js renderWorks 渲染 .grid__card（封面 aspect-ratio 裁切 + meta 行「[NN] 标题 年份」+ .grid__desc 两行截断的 summary），复用旧 layoutMasonry 均衡分列（桌面 4 列/≤1359px 3 列/≤1023px 2 列，--meta-h 96/90/86）；applyFilter 后必须调 layoutMasonry() 重排可见卡。⚠️ 2026-10-16 用户明确要求作品图任何时候都清楚，勿加「hover 聚焦变暗」类规则。旧的自由散点索引（gionatannese.com 式 SCATTER 落点）与 bindScatterCaption 已删除；.scatter__caption 样式保留（gallery 球的 hero-caption 仍在用）。
- **视觉主题（2026-10-13 三改，现役）：清新薄荷浅色风**（用户要求：清新、颜色不要太深、稍微可爱）——底色 #F3FAF7 + 柔光光斑渐变（body::before，z-index -2：薄荷/天蓝/蜜桃）+ Canvas 漂浮光点（assets/js/starfield.js，三层视差、缓慢上浮、无流星）；文字深松绿 --fg #16342C；强调色薄荷绿 --accent #2FB08A / --accent-2 #12A277 / 文字用 --accent-ink #0B6B52，点缀 --peach #FF9C86（状态行脉冲点）；卡片/图片统一 --r-md 16px 小圆角（可爱向，用户已接受，旧的「全站零圆角」作废）；玻璃面用白色半透明 --glass-bg。
- ⚠️ 层级约定：光斑/粒子靠负 z-index 垫底，**body 和各 section 的 background 必须保持 transparent**，否则背景会被盖住。
- **首页结构（2026-10-20 定稿）**：index.html = 排版式封面（.cover，见下条）+ 页脚，**没有作品内容**；作品全部独立成 **gallery.html 作品页**（nav + 满屏照片球 #ball + Selected Works 瀑布流 + 页脚）。封面「查看作品」按钮 → gallery.html；全站 nav Works 链接、contact 页「看作品」、work.html「返回全部作品」、详情页 Works 归组（main.js here='work.html'→'gallery.html'）统一指向 gallery.html。球上方有 .ball__hint（z-index 400，始终可读）「滚轮/拖动·转动作品球」，右下 .ball__skip「全部作品↓」（窄屏隐藏）。
- **首屏封面（2026-10-20 定稿：排版式封面，参考用户提供的 AE+AI 作品集截图）**——index.html 顶部 .cover 区：大标题「yeziyou」+ 旁挂小字「晏紫翊」（衬线斜体）、meta 行（SITE.role + 状态，peach 脉冲点）、SITE.intro 引文（main.js renderCover 渲染）、按钮组（.btn.btn-solid「查看作品」→gallery.html / .btn.btn-ghost「联系合作」→contact.html）、装饰层 = 6 彩条 + 3 菱形 + 手绘圈 SVG + 细网格底纹（::before，径向 mask 渐隐）、底部 .cover__facts 三格（覆盖类型=filterGroups 拼接 / 实现方式 / 坐标）、左下竖排「FRONTEND PORTFOLIO / 2026」。⚠️ CSS 顺序坑：.btn 变体必须用 .btn.btn-solid 双类选择器写在 .btn 基类之后，否则被覆盖。
- **照片球（2026-10-20 起独占 gallery.html 首屏，满屏 100vh）**：#ball 区（复用 .hero 类）。转动交互不变（见下条），激活条件 **ballActive()=球体横跨视口中线**（getBoundingClientRect），离开视口时 released 重置（下次滚回来转动重新可用，角度保留）；动画循环只在球可见时 start()。hero.js 只在 gallery.html 加载。hero-immersive 沉浸模式已删。悬停照片→#hero-caption（fixed 底部）显示「[NN] 作品名」，点击进详情。调试钩子 window.__ball。移动端 .cluster scale 1.15，桌面端星形光标。
- **照片球技术参数（沿用 2026-10-15 定稿）**：RINGS 纬度环带（±72/44/16/-16/-46/-72，桌面 16 张/窄屏 12 张，8 封面循环），R=34vmin 球壳、perspective=球半径×3；照片始终平面对镜头（仅 ±2.1° 平面内倾斜），x=R·cos(lat)·sin(lon) 等；滚轮转球 DEG_PER_PX=0.35 + 惯性（KICK/DECAY 0.78/FOLLOW 0.12），**钳制 ±120°（ROT_MAX），到边界放行页面滚动**；触屏横向拖动转球；遮挡 zIndex=20+near·100，背面线性淡到 0.36+blur≤1.5px。⚠️ 教训：用户口头描述空间概念（「球」「充满表面」）必须拿参考图确认是 3D 还是平面构图；外观参考图=平面散落，交互描述=地球仪式，两者可叠加；别把「转法」和「外观」绑死。
- **自定义光标（2026-10-13 定稿）：20px 实心五角星**（clip-path 星形多边形，浅色下为深绿 --accent-ink、带白色衬光），悬停卡片 scale(1.4) 变 --accent 绿 + 辉光，下方小号 ENTER 文案。⚠️ 用户连改 4 版（圆→四角取景框→细方框→星形），以后动光标先给示意图确认。
- ⚠️ file:// 本地打开时资源 URL 不能带 ?v= 查询参数（会白屏）。
- 2026-10-13 按用户提供的《VibeCoding作品集教程》补齐三件功能：① 首屏 `.hero__lead`（intro + 定位副标题「前端开发方向 · 正在寻找实习机会」+ 三个入口按钮，原 intro-meta 删除）；② About 优势卡片（data.js 新增 STRENGTHS 4 条，证据全引站内已有项目/数据）；③ 作品墙分类筛选（data.js 每项目加 filter 字段，index.html #works-filters 筛选条，main.js renderFilters/applyFilter，layoutMasonry 只排可见卡且列数不变）。
- **作品数量（2026-10-16 精简）**：**8 个**——campus-market / data-board / aurora-ui / noto / video-analytics / canteen / webgl-lab / checkin（index 01–08）。已删：排课系统、Markdown 编辑器、校园地图、简历工具（旧图移至 .workbuddy/unused-images/，data.js 块已删、STRENGTHS 第 4 条引用已改）。
- **图片现状（2026-10-16 二轮重做）**：16 张「真实产品截图」风配图——`assets/img/cover-01…08.png` + `detail-01…08.png`（按新编号命名；横 1536x1024 / 竖 1024x1536 / 方 1024x1024，aspect 用真实比例 1.5 / 0.667 / 1）。prompt 要点=真人头像、真实商品照片、时间戳日志、浏览器 chrome、屏幕反光，洗掉设计稿感；用户嫌第一版太「设计稿」。p01~p12.svg 薄荷占位图仍在目录但无引用。⚠️ AI 示意素材，比赛/求职前建议换真实截图（用户已知晓）。项目文案与数据仍是占位。
- ⚠️ agent-browser 会话在两次 Bash 调用之间会重置（变 about:blank）——截图/交互必须一条命令链内完成 open→wait→操作→screenshot→close。
