# CHANGELOG · 扶阳中医馆官网（index.html 单文件版）

> 版本信息可追溯：本文件 + index.html 文件头版本注释。非 git 仓库，以文件方式存档。

## v3.3.0 — 2026-08-31 · 三大专病门诊详情页学术重构 ✅
- **需求**：基于用户补充的 9 份 PDF，以「中医博士、教授专业视角」重构睡眠 / 代谢 / 男三专病门诊详情页，每页须含 ① 疾病概述与中医辨证分型 ② 合并病 / 共病 ③ 就诊指引与注意事项，突出阴阳五行、气血津液、脏腑经络等学术深度，零编造、严格依 PDF。
- **决策（用户明确）**：① 4 篇肿瘤论文（肺癌 Meta / 肝癌 / 大肠癌 / 乳腺癌）归入**代谢疾病专病门诊**（广义代谢疾病）；② 2 篇脑血管论文（脑小血管病 / 中风后遗症）**不归入任何科室**，全部 9 篇 PDF 统一作为「参考文献」列示（非每篇内容都须写进正文），对全站做全局更新。
- **sleep-overview.html（模块一/二/三 + 附录）**：疾病概述（失眠患病率 9%–15%、2025 版定义）；中医辨证分型 **9 型**（主症 / 舌脉 / 推荐方，整理自《中国失眠症诊断和治疗指南（2025 版）》表 2，含 2025 新增「肝气郁结证」「心火炽盛证」）；合并病共病（抑郁焦虑 / 心脑血管 / 代谢综合征 / SDB / 疼痛）；就诊指引 5 条（睡眠日记、CBT-I 一线、停药等）；参考文献 9 篇（★ 第 1、2 篇）。
- **metabolism-overview.html**：广义代谢疾病概述；模块一「中医辨证论治纲领 · 次第治疗」——唐农三步法（桂枝法→四逆法→培土填精）+ 糖尿病肾病（龚胜男/唐农，79 岁女尿蛋白转阴病案）+ 扶阳抗肿瘤（4 篇，肺癌 Meta OR=2.19/0.15/0.41 等循证）；模块二共病（代谢综合征组分互结、肿瘤与代谢共病）；模块三就诊指引 5 条；保留 10 病「门诊纳入范畴」导航卡片（链 clinic 详情）；参考文献 9 篇（★ 第 2–7 篇）。
- **men-overview.html**：男科康复概述（命门火衰、III 型前列腺炎 90%–95%）；模块一「中医辨证纲领（扶阳框架）」5 型（命门火衰 / 寒湿下注 / 心脾两虚 / 肝郁气滞 / 瘀血阻络），透明标注其以「体、相、用」健康标准为理论根基、非引自单一临床文献、未编造；模块二共病（代谢 / 睡眠 / 前列腺炎 / 男性更年期）；模块三就诊指引 5 条；参考文献 9 篇（★ 第 2 篇）。
- **metabolism-clinic.html 同步**：#dz-cancer（恶性肿瘤）节新增「扶阳辨治 · 学术依据」块，列 4 篇肿瘤文献与次第治疗（桂枝法→四逆法→补中益气汤）及肺癌 Meta 循证值，与概述页对齐。
- **设计系统**：新增 v3.3.0 学术模块样式（`.mod`/`.syn`/`.step3`/`.panel`/`.chips`/`.guide`/`.refs` 等），复用既有令牌与卡片栅格，三页视觉一致；移动端响应式补齐。
- **验证（Playwright）**：三页 0 个 pageerror / console error；主题切换按钮 `border-width:0`、背景透明（无 UA 边框）；`fy:theme` 跨页持久化一致；sleep 9 辨证 / metabolism 4 模块 / men 5 辨证 均正确渲染。

## v3.2.4 — 2026-08-31 · 顶部导航栏所有组件去边框统一 ✅
- **问题（实测定位）**：用 Playwright 计算样式实测发现，`metabolism-overview.html`、`sleep-overview.html`、`men-overview.html` 三个概述页顶部导航栏的主题切换按钮与汉堡按钮均带有 **2px outset 黑色边框**，搜索表单与结果面板也带 1px `--line` 边框；而首页 `index.html` 的同类按钮无边框。两者视觉不一致。
- **根因**：`shared-nav.js` 注入的 `.theme-toggle` / `.burger` 规则没有写 `border` 与 `background` 声明，在**没有全局按钮重置**的页面会回退到浏览器默认按钮样式（2px 黑色 outset 边框 + 浅灰填充背景）。首页 `index.html` 自身静态 CSS 含有按钮重置，所以首页正常；三个新建概述页自身没有重置，于是暴露 UA 默认边框。这是典型的**样式优先级/页面重置不一致冲突**。
- **修复**：修改 `shared-nav.js` 注入的导航样式：
  - `.theme-toggle`：`border:0; padding:0; background:transparent; cursor:pointer`
  - `.burger`：`border:0; padding:0; background:transparent; cursor:pointer`
  - `.nav-search`：`border:0`（保留半透明背景作为可辨识区域）
  - `.ns-results`：`border:0`（保留 `box-shadow:var(--shadow-md)` 与背景）
  一次性修复首页 + 三个概述页（以及所有未来引入 shared-nav.js 的页面）。
- **布局检查**：实测导航 `position:fixed; top:0; z-index:100; height:62px`，三个概述页 `.wrap` 均设置 `padding-top:var(--nav-h)`（62px），首行真实内容 `.hero` 位于 `top:62px`，**无位置偏移、无被遮挡、无与内容重叠**；移动端汉堡菜单展开正常。
- **验证**：Playwright 38/39 通过（1 个为首页 `.skip-link` 选择器误报，与布局无关）：四页 toggle/burger 均 `border-width:0`、`border-style:none`、`background:transparent`；`.nav-search`、`.ns-results` 无边框；切换主题并写入 `fy:theme`，跨页读取一致；0 JS 错误。

## v3.2.3 — 2026-08-31 · 专病详情页导航主题切换按钮与首页统一 ✅
- **问题**：`specialty-detail.html` 顶部导航栏使用独立实现，主题切换按钮 `.icon-btn` 为 44px 圆形（`border-radius:999px`）、hover 填充强白背景 `--surface-2`（`rgba(255,255,255,.78)`），看起来像带边框/装饰的圆形按钮，与首页 `shared-nav.js` 的 `.theme-toggle`（40px、圆角 8px、透明背景、微妙 hover 底）视觉不一致。
- **约束**：不能直接引入 `shared-nav.js`——该组件会注入自己的 `:root` 令牌（`--brand-500:#F2741B` 等），覆盖 `specialty-detail.html` 现有的 `--cinnabar:#E0492A` 等令牌，导致页面全部内容（卡片、标签、按钮）被重新着色。
- **修复**：在 `specialty-detail.html` 现有导航代码内，复刻首页 `.theme-toggle` 的精确外观：
  - `.icon-btn` 改为 `width/height:40px`、`border:0`、`border-radius:8px`、透明背景；
  - hover 改为微妙暖灰 `rgba(42,33,24,.06)`（非强白圆盘），与首页 `--paper-2` 的微妙 beige hover 视觉等价；
  - 图标尺寸改为 `19px` × `19px`；
  - sun/moon SVG 替换为与首页 `shared-nav.js` 完全一致的 markup（`stroke-width="1.75"`、rays 路径）。
- **交互**：保持 `fy:theme` 持久化、`data-theme` 切换、`[data-theme]` 驱动 sun/moon 显隐——已与首页逻辑一致，无需改动。
- **验证**：Playwright 实测首页与专病详情页切换按钮的 `border-width`、`border-radius`、`width/height`、`backgroundColor` 四项均一致；点击切换 light→dark 并写入 `fy:theme=dark`；跨页到首页读取为 dark；0 JS 错误。

## v3.2.2 — 2026-08-31 · 三专病「查看专病」跳转统一 ✅
- **问题**：首页专病门诊三卡中，仅 `meta` 带 `href:"metabolism-overview.html"`（真页跳转），`sleep`/`men` 无 `href`、回退为打开首页内联弹窗（`openSpec`），跳转逻辑与代谢不一致。
- **修复**：`FY.DATA.dept` 为 `sleep` 加 `href:"sleep-overview.html"`、`men` 加 `href:"men-overview.html"`（meta 保持 `metabolism-overview.html`）。点击 handler 已按 `data-href` 统一 `location.href` 跳转，三卡逻辑一致。
- **按钮样式**：三卡共用同一 `.spec-arrow` 规则（`查看专病 →`，暖金色 `#f3b15f`/hover 朱红、字重 600、translateX 动效），实测文本/颜色/字重三卡完全一致，无需改动。
- **新增生产页（仿 metabolism-overview.html 结构/CSS）**：`sleep-overview.html`、`men-overview.html`，仅用 `FY.SPECIALTY_DETAIL` 中已校订素材（definition/philosophy/science/indications），未编造任何临床数据；均含 `shared-nav.js` + `data-nav="sub"` + 预绘主题脚本，与概述页主题处理一致。
- **一致性增强**：`metabolism-overview.html` 头部补「预绘同步主题」脚本，三子页主题处理统一无 FOUC。
- **实测（Playwright 12/12 通过）**：① 三卡均带正确 `data-href`、不再走弹窗；② 按钮文本/颜色/字重一致；③ 点击分别跳转 `sleep-overview.html`/`metabolism-overview.html`/`men-overview.html` 且落地页 h1+导航正常；④ 三子页预绘即 dark（无 FOUC）；⑤ 0 个 JS 错误。

## v3.2.1 — 2026-08-31 · 顶部导航主题 & 子页高亮统一 ✅
- **`shared-nav.js` 根因修复**：`initScroll` 中引用了 `prefix`（实为 `buildNav` 局部 `var`），每页加载必抛 `ReferenceError: prefix is not defined` → 桌面/移动的「专病门诊」子页默认高亮失效 + `initQRModal`/`initSearch` 永远未注册（两页"立即预约"弹窗均打不开）。改为 `document.body.getAttribute("data-nav")==="sub"` 判定 + 钉死态 `setDeptActive` 同步设置桌面+移动高亮 + `onScroll` 对子页 early-return 不参与清除。
- **预绘同步主题应用（无 FOUC）**：`<head>` 内脚本执行时即读 `localStorage["fy:theme"]` 并 `setAttribute("data-theme", ...)`，在首次绘制前生效；硬编码 `data-theme="light"` 仅作 `file://` 降级。`initTheme` 简化为只挂点击切换，初始应用单一来源。
- **跨页存储键统一**：`specialty-detail.html` 的 `sp-theme` → `fy:theme`（与首页/概述/详情一致），主题按钮增 moon SVG 并按 `data-theme` 切换；`<head>` 加预绘脚本。
- **`metabolism-clinic.html` 主题按钮升级**：字符 `◐` 改为 sun/moon SVG（与首页视觉一致），`<head>` 加预绘脚本；键 `fy:theme` 保持。
- **验证**：Playwright 实测四页（index / overview / clinic / detail）持久化链路、预绘无闪、子页高亮、QR 弹窗、全站搜索、主题按钮图标全部一致；JS 0 错误。

## v3.2.0 — 2026-08-31 · 顶部导航抽取为共享组件 ✅
- **抽取共享导航组件** `shared-nav.js`（单一来源）：自包含设计令牌（与首页 :root 完全一致的亮/暗色）+ 导航样式 + 导航 HTML（brand / 6 菜单 / 搜索框 / 主题切换 / 立即预约 / 汉堡 / 移动菜单 / 预约弹窗）+ 全部交互（主题、汉堡折叠、移动菜单、平滑滚动、滚动高亮、预约弹窗、全站搜索）。
- **复用方式**：页面 `<head>` 引入 `<script src="shared-nav.js">`，`<body>` 标记 `data-nav="home"`（菜单锚点 `#xxx`）或 `data-nav="sub"`（菜单锚点 `index.html#xxx`）；子页自动高亮「专病门诊」标示当前位置。
- **首页 index.html**：删除内联导航 HTML（header#top + mobile-menu）与预约弹窗 HTML，删除导航 JS（initTheme/initScroll/initSmooth/initMobileMenu/closeMobile/initQRModal/initSearch）及 boot 中的对应调用，改为引用 shared-nav.js；`.btn` 系列保留（hero CTA 复用），内联导航 CSS 保留为惰性 fallback（被 shared-nav.js 后加载覆盖，实际生效以 shared-nav.js 为权威）。
- **概述页 metabolism-overview.html**：删除旧 topbar（HTML + CSS + JS），改为引用 shared-nav.js，`.wrap` 补 `padding-top:var(--nav-h)` 避免 fixed 导航遮挡。
- **验证**：三页 JS 语法 OK；首页 13 处导航 HTML/JS 残留清零、boot 无导航调用；概述页 topbar/themeBtn 清零；data-nav 标记正确；标签平衡（首页 div 86/86、header 1/1、section 22/22；概述页 div 22/22、section 2/2）；本地服务四文件均 200。

## v3.1.1 — 2026-08-31 · 代谢疾病门诊三级跳转 ✅
- **首页「代谢疾病门诊」跳转接入**：`dept` 数据为 meta 卡片加 `href:"metabolism-overview.html"`；`renderDept` 模板加 `data-href`；`initSpecDetail` 点击与 Enter/Space 键盘委托优先判断 `data-href` 跳转（`location.href`），无 href 才打开弹窗——睡眠障碍、男科康复两卡保持原有弹窗行为。
- **新增代谢疾病概述页** `metabolism-overview.html`：广义代谢疾病认识框架（范畴、代谢综合征、扶阳视角）+ 10 疾病清单卡片（按「糖尿病及并发症／代谢与内分泌／消化系统／肿瘤」四组），每卡片链接 `metabolism-clinic.html#dz-xxx`。
- **详情页返回导航**：`metabolism-clinic.html` 顶栏加「← 返回概述」，形成 首页 → 概述页 → 疾病详情 三级清晰层级。
- **验证**：首页 JS OK；10 卡片链接与 10 详情锚点（dz-dm/dkd/dfu/mafld/gout/htn/gerd/uc/cag/cancer）一一对应；概述页 section 2/2、div 25/25，详情页 section 1/1、div 82/82、article 10/10 平衡；三页 JS 全 OK。

## v3.1.0 — 2026-08-30 · 专病门诊板块专业扩展 ✅
> 依据《中药新药研发用临床需求清单》（中华中医药学会，第一/二/三批）权威原文，将三大专病详情由 6 区块扩展至 16 区块。
- **新增 10 个内容区块**（每专病）：① 专病定义 ② 发病机制·中西医互参 ③ 典型症状 ④ 诊断标准（中医辨证／西医诊断双栏）⑤ 规范化治疗方案（分阶段时间轴）⑥ 就诊流程（编号步骤）⑦ 注意事项 ⑧ 相关疾病科普（折叠卡）⑨ 专家团队（传承人领衔 + 多学科协作，不虚构具体姓名）⑩ 常见问题（手风琴）。
- **病种映射与数据来源**：睡眠障碍→《失眠障碍》（第三批·脑病分会，含 48.5% 睡眠困扰、3.9%–14.7% 诊断率）；代谢疾病→《痛风》《代谢相关脂肪性肝病》《糖尿病肾脏疾病》（第二批·第三批，含高尿酸 13.3%、MAFLD 20%–30%/肥胖 70%–90%、DKD 30%–40%/我国 T2DM 合并 CKD 36%）；男科康复→《慢性非细菌性前列腺炎》（第一批·男科分会，占前列腺炎 90%–95%、发病率 10%–15%）。
- **审慎原则**：所有流行病学数字均取自清单原文，未编造；专家团队以「卢氏扶阳医学传承人领衔 + 专病主诊医师 + 健康管理师」表述，不虚构具体医师姓名，出诊信息注明以馆内公示为准。
- **实现**：`FY.SPECIALTY_DETAIL` 三专病各增 10 字段；`renderSpecDetail` 渲染 16 区块；新增 CSS 类 `.spd-def/.spd-mechlist/.spd-dx/.spd-tx/.spd-flow/.spd-prec/.spd-sci/.spd-team/.spd-faq`；`initSpecDetail` 委托扩展科普卡（data-sci）与常见问题手风琴（.spd-faq-q）。
- **验证**：JS 语法 OK；10 字段三专病各 3 处齐备；10 新 section 落地；CSS 9 类齐全；section 22/22、div 94/94 平衡。

## v3.0.2 — 2026-08-27 · 专病详情跳转逻辑集成 ✅
- **设计方案集成**：将 `specialty-detail.html` 的专病详情内容（核心诊疗理念 / 适应症范围 / 治疗特色·扶阳应用 / 适合·不适用人群 / 共病同治协同诊疗）以数据驱动方式嵌入 `index.html`，通过统一的「查看专病」跳转逻辑触发。
- **统一跳转入口**：三大专病卡片（睡眠障碍 / 代谢疾病 / 男科康复）渲染时绑定 `data-spec="sleep|meta|men"` + `role="button" tabindex="0"`；全站委托 `document` 上的 `closest("[data-spec]")` 点击 + Enter/Space 键盘处理，三入口行为完全一致、可复用。
- **复用既有弹窗范式**：新增 `#spdModal` 覆盖层（固定定位、`hidden` 切换、`role="dialog"`、毛玻璃遮罩、body 滚动锁定、Esc / 点击遮罩 / 关闭按钮关闭），视觉与交互对齐站内 `qr-modal`；详情内容注入 `#spdPanel`，含 sticky 关闭键、共病「查看合并诊疗思路」展开、底部「预约」按钮复用现有 qrModal 预约流。
- **设计一致性**：详情弹窗沿用 WarmSun 暖阳令牌（--brand-*/--cinnabar/--sage/--surface/--ink/--ease-out-*），明暗双主题自动适配，≤560px 响应式（特性网格与人群双栏转单列）。
- **验证**：JS 语法 OK；三卡片 data-spec 运行时绑定；initSpecDetail 接入 boot()；section 12/12、div 79/79 平衡；本地服务 index/detail 均 200。

## v3.0.1 — 2026-08-27 · 学术渊源板块结构精简 ✅
> 自 v3.0.0 以来的内容校订与结构精简汇总（设计系统 WarmSun 不变）：
- **学术渊源文案审慎校勘**：年份与措辞复核（刘沅 1767–1855、郑钦安 1804–1901、颜龙臣 1808–1902、卢铸之 1876–1963、卢永定 1901–1986、卢崇汉 1947–）；阶段标签「郑颜并立→钦安立派」「卢氏开派→发展为纯阳医学」；核心人物「卢崇汉·卢氏嫡传」简化为「卢崇汉」；弟子「唐农→李耕（1962–·《七堂至明中医扶阳课》）」。
- **经典法度**：标题改为扶阳纲领「人生立命在于以火立极 · 治病立法在于以火消阴」，描述改为「病在阳者扶阳抑阴，病在阴者用阳化阴」。
- **全局黑字统一**：亮色模式 `--text-primary` 由近黑 #2A241D 改为导航菜单项同款暖棕灰 #6B6155，全站文字一致。
- **回字形设计归档**：完整代码存为 `lineage-huitu-design.html`（独立可预览），首页移除回字形，改以线性「传承时间轴」。
- **元阳为本文案精简**：去除【】括号与末句"人生立命……用阳化阴"，保留"元阳为本，诸阴阳为标……元阳之外，另起诸阴阳"。
- **本次重点**：移除学术渊源时间轴内层标题「传承时间轴 / 钦安卢氏 · 百年薪火相传」，5 个传承节点（含 2006 拜师节点）保留于板块主标题「钦安卢氏 · 传承脉络」之下；清理对应死 CSS（.axis-head/.axis-title）。
- 验证：JS new Function 语法 OK；axis-head/axis-title 0 残留；section/div 标签平衡。

## v3.0.0 — 2026-08-27 · WarmSun 设计系统全面重构 ✅
- **设计系统对齐**：引入 WarmSun 暖阳设计系统（附件 warmsun-design-system.html v1.0）Hex 令牌体系，双层结构 = 规范层（--brand-50..900/--neutral-*/语义色/字体/阴影）+ 兼容别名层（--paper/--ink/--cinnabar 等旧变量引用规范层，组件 CSS 零破坏）。
- **色彩**：主色 #F2741B（brand-500，替代旧朱砂 #f2542d）；中性暖灰 #FFFCF9 系；语义色 success #2E9E6B / warning #E08A1E / error #D9533B / info #3E8E8A；辅助 accent-sage #5CA99A。
- **暗色**：暖褐底 #1A1612（canvas）/ #221D18（surface-1），文本 #F5F2EE/#C9BDB0/#8A7E70，品牌提亮 #FF8C42/#FFAD78，语义色暗底值。
- **字体**：Noto Sans SC（主，300-900）+ Roboto Mono（数值：tl-year/spec-count/f-num），Google Fonts 外链 + 系统回退。
- **排版**：正文 16px/1.6；h1/h2 700、h3 600；字号阶梯对齐附件桌面基准并保留 clamp 响应式。
- **间距/圆角/阴影**：4/8 基准间距（原已一致）；圆角 6 档体系（卡片 16px、按钮 8px、图标容器 12px）；3 层暖阴影 sm/md/lg。
- **组件**：按钮实色主色 44px/8px（hover brand-600）；输入框 44px/8px；新增语义 Tag 组件（success/warning/error/info/brand 五态 999 胶囊）；图标描边统一 1.75px（HTML+JS 全部替换）。
- **清理**：删除全部 oklch() 定义、插画死变量（--mt-*/--sun-*/--qi）、无用渐变（--grad-fill/--grad-brand-hover）。
- **功能保持完整**：导航/全站搜索/预约表单/主题切换/FAQ 手风琴/3D tilt/reveal 入场/响应式断点全部不变。
- 验证：JS new Function 语法 OK；oklch(#f2542d/#f3b15f) 残留 0。

## v2.5.0 — 2026-08-27 · 重构前基线（保存点）
本节为 WarmSun 对齐前最后一次可追溯状态。此前迭代（v2.0.0 动态交互版之后的增量）：
- 导航：品牌副标题「郑钦安扶阳医学研究中心」；导航序 元阳为本→专病门诊→学术渊源→经典法度→就诊流程→常见问题；「预约挂号」改为全站搜索框（≤1279 折叠汉堡）。
- Hero：极简单栏（阳主阴从/扶正守阳 上三分之一，CTA 下三分之一），坎卦 pattern 平铺背景。
- 专病门诊：截图式三列症状矩阵 + 3D tilt / ::before 渐变条 / ::after 光晕全动效。
- 元阳为本：精简为纯文本（坎中一阳 · 人生立命之本 + 学术长段），标题单行自适应。
- 所有 `.sec-head` 板块标题居中。
- 前置基线：v1.0.0 动态重构外壳 → v2.0.0 动态交互版（前后端+组件化，见 .workbuddy/memory/）。
