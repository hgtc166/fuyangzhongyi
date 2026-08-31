/* ============================================================================
   shared-nav.js — 扶阳中医馆 · 共享顶部导航组件（单一来源） · v3.2.1
   复用方式：在页面 <head> 引入 <script src="shared-nav.js"></script>，
   并在 <body> 上标记 data-nav="home"（首页，菜单锚点为 #xxx）
   或 data-nav="sub"（子页，菜单锚点为 index.html#xxx）。
   组件自包含：设计令牌 + 导航样式 + 导航 HTML + 全部交互（主题/汉堡/
   移动菜单/平滑滚动/滚动高亮/预约弹窗/全站搜索），两页视觉与交互完全一致。
   v3.2.1：① 预绘同步主题应用（<head> 内即生效，无 FOUC）；
          ② 修 initScroll 中 `prefix is not defined` 根因；
          ③ 子页钉死「专病门诊」桌面+移动高亮，滚动不再清除。
   ========================================================================== */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 0. 预绘同步主题应用（<head> 内脚本执行时即生效，无 FOUC） ----------
     硬编码的 data-theme="light" 仅作 file:// 或 localStorage 不可用时的降级； */
  try {
    var __saved = localStorage.getItem("fy:theme");
    if (__saved === "dark" || __saved === "light") document.documentElement.setAttribute("data-theme", __saved);
  } catch (e) {}

  /* ---------- 1. 设计令牌（与首页 index.html :root 完全一致，统一两页） ---------- */
  var CSS =
    ":root{" +
    "--brand-50:#FFF4EB;--brand-100:#FFE6D4;--brand-200:#FFCDA8;--brand-300:#FFAD78;" +
    "--brand-400:#FF8C42;--brand-500:#F2741B;--brand-600:#D85C12;--brand-700:#B2470F;" +
    "--brand-800:#8C380F;--brand-900:#6B2C0D;" +
    "--neutral-0:#FFFCF9;--neutral-100:#F2EBE2;--neutral-300:#D6C8B6;--neutral-500:#998A74;--neutral-700:#5C5244;--neutral-900:#262019;" +
    "--success:#2E9E6B;--warning:#E08A1E;--error:#D9533B;--info:#3E8E8A;--accent-sage:#5CA99A;" +
    "--text-primary:#6B6155;--text-secondary:#6B6155;--text-tertiary:#998A74;--bg:#FFFCF9;--line:#E5DDD0;" +
    "--cjk:'Noto Sans SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei',system-ui,sans-serif;" +
    "--mono:'Roboto Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;" +
    "--sh-sm:0 2px 4px rgba(42,29,15,.06);--sh-md:0 4px 12px rgba(42,29,15,.08);--sh-lg:0 12px 28px rgba(42,29,15,.12);" +
    "--paper:var(--bg);--paper-2:var(--neutral-100);--surface:var(--neutral-0);" +
    "--ink:var(--text-primary);--ink-2:var(--text-secondary);--ink-3:var(--text-tertiary);" +
    "--line-strong:var(--neutral-300);--cinnabar:var(--brand-500);--cinnabar-deep:var(--brand-600);--cinnabar-soft:var(--brand-50);" +
    "--gold:var(--brand-300);--gold-soft:var(--brand-100);--ring:rgba(242,116,27,.45);" +
    "--shadow-sm:var(--sh-sm);--shadow-md:var(--sh-md);--shadow-lg:var(--sh-lg);" +
    "--grad-bg:radial-gradient(circle at 50% 0%,rgba(255,140,66,.13) 0%,transparent 55%);" +
    "--grad-brand:linear-gradient(135deg,var(--brand-600) 0%,var(--brand-500) 50%,var(--brand-300) 130%);" +
    "--grad-text:linear-gradient(100deg,var(--brand-500) 0%,var(--brand-300) 100%);" +
    "--grad-hairline:linear-gradient(90deg,var(--brand-500) 0%,var(--brand-300) 55%,transparent 100%);" +
    "--sage-soft:color-mix(in oklch,var(--accent-sage) 15%,transparent);--sage-deep:color-mix(in oklch,var(--accent-sage) 55%,var(--ink));" +
    "--font-display:var(--cjk);--font-body:var(--cjk);--font-mono:var(--mono);" +
    "--fs-h1:clamp(1.6rem,3.2vw,2rem);--fs-h2:clamp(1.25rem,2.2vw,1.5rem);--fs-h3:1.125rem;--fs-body:1rem;--fs-sm:0.875rem;--fs-xs:0.8125rem;" +
    "--sp-1:4px;--sp-2:8px;--sp-3:12px;--sp-4:16px;--sp-5:24px;--sp-6:32px;--sp-7:48px;--sp-8:64px;--sp-9:96px;" +
    "--ease-out-quart:cubic-bezier(0.25,1,0.5,1);--ease-out-expo:cubic-bezier(0.16,1,0.3,1);--ease-in-out:cubic-bezier(0.65,0,0.35,1);" +
    "--radius:16px;--radius-sm:8px;--nav-h:62px;--maxw:1160px;" +
    "}" +
    "[data-theme=\"dark\"]{" +
    "--brand-50:rgba(255,140,66,.14);--brand-100:rgba(255,140,66,.14);--brand-300:#FFAD78;--brand-400:#FF8C42;--brand-500:#FF8C42;--brand-600:#FFAD78;" +
    "--neutral-0:#1A1612;--neutral-100:#221D18;--neutral-300:#3A332A;--neutral-500:#8A7E70;--neutral-700:#C9BDB0;--neutral-900:#F5F2EE;" +
    "--text-primary:#F5F2EE;--text-secondary:#C9BDB0;--text-tertiary:#8A7E70;--bg:#1A1612;--line:#3A332A;--ring:rgba(255,140,66,.5);" +
    "--sh-sm:0 2px 4px rgba(0,0,0,.3);--sh-md:0 4px 12px rgba(0,0,0,.35);--sh-lg:0 12px 28px rgba(0,0,0,.45);" +
    "--grad-bg:radial-gradient(circle at 50% 0%,rgba(255,140,66,.09) 0%,transparent 55%);" +
    "--success:#4CC38A;--warning:#F0A93B;--error:#F0775E;--info:#5BBDB8;--accent-sage:#6FC4B4;" +
    "}" +
    /* ---------- 2. 导航样式 ---------- */
    ".nav{position:fixed;top:0;left:0;right:0;z-index:100;height:var(--nav-h);display:flex;align-items:center;background:color-mix(in oklch,var(--paper) 84%,transparent);backdrop-filter:saturate(1.3) blur(14px);-webkit-backdrop-filter:saturate(1.3) blur(14px);border-bottom:1px solid transparent;transition:border-color .3s}" +
    ".nav.is-scrolled{border-bottom-color:var(--line)}" +
    ".nav-inner{width:100%;max-width:var(--maxw);margin-inline:auto;padding-inline:var(--sp-6);display:flex;align-items:center;gap:var(--sp-6);height:100%}" +
    ".brand{display:flex;align-items:center;gap:12px;flex-shrink:0}" +
    ".brand-seal{width:38px;height:38px;border-radius:var(--radius-sm);background:var(--grad-brand);color:#fff;display:grid;place-items:center;font-family:var(--font-display);font-weight:700;font-size:19px;box-shadow:var(--shadow-sm);flex-shrink:0}" +
    ".brand-name{font-family:var(--font-display);font-weight:600;font-size:1.05rem;line-height:1.2;letter-spacing:0.04em}" +
    ".brand-sub{font-size:var(--fs-xs);color:var(--ink-3);letter-spacing:0.2em}" +
    ".nav-links{display:flex;align-items:center;gap:var(--sp-2);margin-inline:auto}" +
    ".nav-links a{position:relative;padding:8px 13px;font-size:var(--fs-sm);color:var(--ink-2);border-radius:8px;transition:color .2s;white-space:nowrap}" +
    ".nav-links a:hover{color:var(--ink)}" +
    ".nav-links a[aria-current=\"true\"]{color:var(--cinnabar);font-weight:600}" +
    ".nav-actions{display:flex;align-items:center;gap:var(--sp-3);flex-shrink:0}" +
    ".nav-search{position:relative;display:flex;align-items:center;gap:7px;height:38px;width:210px;padding:0 11px;border:0;border-radius:var(--radius-sm);background:color-mix(in oklch,var(--paper-2) 65%,transparent);transition:border-color .2s,box-shadow .2s}" +
    ".nav-search:focus-within{border-color:var(--cinnabar);box-shadow:0 0 0 3px var(--ring)}" +
    ".ns-ic{width:16px;height:16px;flex-shrink:0;color:var(--ink-3);pointer-events:none}" +
    ".ns-input{flex:1;min-width:0;border:0;background:transparent;outline:none;font-size:var(--fs-sm);color:var(--ink);font-family:inherit}" +
    ".ns-input::placeholder{color:var(--ink-3)}" +
    ".ns-clear{border:0;background:transparent;color:var(--ink-3);font-size:21px;line-height:1;cursor:pointer;padding:0 2px;flex-shrink:0}" +
    ".ns-clear:hover{color:var(--ink)}" +
    ".ns-results{position:absolute;top:calc(100% + 8px);right:0;width:min(360px,84vw);max-height:62vh;overflow:auto;background:var(--paper);border:0;border-radius:12px;box-shadow:var(--shadow-md);padding:6px;z-index:200}" +
    ".ns-item{display:flex;flex-direction:column;gap:2px;width:100%;text-align:left;border:0;background:transparent;padding:9px 10px;border-radius:8px;cursor:pointer}" +
    ".ns-item:hover,.ns-item:focus-visible{background:color-mix(in oklch,var(--cinnabar) 12%,transparent);outline:none}" +
    ".ns-sec{font-size:var(--fs-xs);color:var(--cinnabar);letter-spacing:.04em}" +
    ".ns-title{font-size:var(--fs-sm);color:var(--ink-2);line-height:1.4}" +
    ".ns-empty{padding:14px 10px;font-size:var(--fs-sm);color:var(--ink-3);text-align:center}" +
    ".search-hit{animation:searchHit 1.8s ease}" +
    "@keyframes searchHit{0%{box-shadow:0 0 0 3px var(--ring);background:color-mix(in oklch,var(--cinnabar) 12%,transparent)}100%{box-shadow:0 0 0 0 transparent;background:transparent}}" +
    ".theme-toggle{width:40px;height:40px;border:0;border-radius:var(--radius-sm);display:grid;place-items:center;padding:0;background:transparent;color:var(--ink-2);cursor:pointer;transition:background .2s,color .2s}" +
    ".theme-toggle:hover{background:var(--paper-2);color:var(--ink)}" +
    ".theme-toggle svg{width:19px;height:19px}" +
    "[data-theme=\"light\"] .theme-toggle .icon-moon{display:none}" +
    "[data-theme=\"dark\"] .theme-toggle .icon-sun{display:none}" +
    ".btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:12px 24px;border-radius:var(--radius-sm);font-size:var(--fs-sm);font-weight:600;line-height:1;letter-spacing:0.02em;white-space:nowrap;transition:transform .15s var(--ease-out-quart),box-shadow .15s,background-color .15s,border-color .15s}" +
    ".btn:active{transform:scale(0.97)}" +
    ".btn-primary{background:var(--brand-500);color:#fff;border:none}" +
    ".btn-primary:hover{background:var(--brand-600);transform:translateY(-1px);box-shadow:var(--shadow-md)}" +
    ".btn-ghost{border:1px solid var(--line-strong);color:var(--ink)}" +
    ".btn-ghost:hover{border-color:var(--cinnabar);color:var(--cinnabar);transform:translateY(-1px)}" +
    ".btn-lg{padding:15px 32px;font-size:1rem}" +
    ".btn-sm{padding:9px 16px}" +
    ".burger{display:none;width:42px;height:42px;border:0;border-radius:var(--radius-sm);place-items:center;padding:0;background:transparent;color:var(--ink);cursor:pointer}" +
    ".burger:hover{background:var(--paper-2)}" +
    ".burger svg{width:22px;height:22px}" +
    ".mobile-menu{position:fixed;top:var(--nav-h);left:0;right:0;z-index:99;background:var(--paper);border-bottom:1px solid var(--line);padding:var(--sp-4) var(--sp-6) var(--sp-6);display:none;flex-direction:column;gap:4px;box-shadow:var(--shadow-md)}" +
    ".mobile-menu.open{display:flex;animation:fadeIn .25s var(--ease-out-quart)}" +
    ".mobile-menu a{padding:14px 8px;font-size:1rem;border-bottom:1px solid var(--line);color:var(--ink)}" +
    ".mobile-menu a:last-child{border-bottom:none}" +
    ".mobile-menu a[aria-current=\"true\"]{color:var(--cinnabar)}" +
    ".qr-modal{position:fixed;inset:0;z-index:300;display:grid;place-items:center;padding:var(--sp-5)}" +
    ".qr-modal[hidden]{display:none}" +
    ".qr-overlay{position:absolute;inset:0;background:rgba(26,22,18,.55);backdrop-filter:blur(4px);animation:fadeIn .3s var(--ease-out-quart)}" +
    ".qr-card{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:var(--sp-6);text-align:center;max-width:320px;width:100%;box-shadow:var(--shadow-lg);animation:pop .35s var(--ease-out-quart)}" +
    ".qr-card img{width:180px;height:180px;border-radius:var(--radius-sm);background:#fff;padding:6px;border:1px solid var(--line);margin-bottom:var(--sp-4)}" +
    ".qr-card h3{font-size:var(--fs-h3);margin-bottom:var(--sp-2)}" +
    ".qr-card p{font-size:var(--fs-xs);color:var(--ink-3);line-height:1.8}" +
    ".qr-close{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;color:var(--ink-3);font-size:1.2rem;line-height:1;background:transparent;border:none;cursor:pointer;transition:background .2s,color .2s}" +
    ".qr-close:hover{background:var(--paper-2);color:var(--ink)}" +
    "@keyframes fadeIn{from{opacity:0}to{opacity:1}}" +
    "@keyframes pop{from{opacity:0;transform:scale(.92) translateY(8px)}to{opacity:1;transform:none}}" +
    /* ---------- 3. 响应式 ---------- */
    "@media (max-width:1279px){" +
    ".nav-inner{gap:var(--sp-3)}" +
    ".nav-links{gap:0}" +
    ".nav-links a{padding:8px 9px;font-size:var(--fs-sm)}" +
    ".nav-links{display:none}" +
    ".burger{display:grid}" +
    ".nav-actions .nav-search{display:none}" +
    ".mobile-menu .nav-search{display:flex;width:100%;margin-bottom:10px}" +
    ".mobile-menu .nav-search .ns-results{position:static;width:100%;box-shadow:none;border:0;border-top:1px solid var(--line);margin-top:6px;max-height:50vh}" +
    "}" +
    "@media (max-width:1023px){" +
    ":root{--maxw:960px}" +
    ".brand-sub{display:none}" +
    "}" +
    "@media (max-width:767px){" +
    ":root{--nav-h:58px;--maxw:100%}" +
    ".nav-inner{padding-inline:var(--sp-5)}" +
    ".nav-links{display:none}" +
    ".burger{display:grid}" +
    ".nav-actions .btn-ghost{display:none}" +
    ".brand-sub{display:none}" +
    "}";

  /* ---------- 4. 导航 HTML（菜单链接按 data-nav 前缀决定，延迟到 body 就绪后构建） ---------- */
  function buildNav() {
    var prefix = document.body.getAttribute("data-nav") === "sub" ? "index.html" : "";
    function menuHref(id) { return prefix + "#" + id; }
    return '<header class="nav" id="top">' +
    '  <div class="nav-inner">' +
    '    <a class="brand" href="' + (prefix || "#top") + '" aria-label="扶阳中医馆 首页">' +
    '      <span class="brand-seal">扶</span>' +
    '      <span><span class="brand-name">扶阳中医馆</span><br><span class="brand-sub">郑钦安扶阳医学研究中心</span></span>' +
    '    </a>' +
    '    <nav class="nav-links" aria-label="主导航">' +
    '      <a href="' + menuHref("theory") + '" data-spy>元阳为本</a>' +
    '      <a href="' + menuHref("dept") + '" data-spy>专病门诊</a>' +
    '      <a href="' + menuHref("lineage") + '" data-spy>学术渊源</a>' +
    '      <a href="' + menuHref("method") + '" data-spy>经典法度</a>' +
    '      <a href="' + menuHref("wellness") + '" data-spy>日常养生</a>' +
    '      <a href="' + menuHref("faq") + '" data-spy>常见问题</a>' +
    '    </nav>' +
    '    <div class="nav-actions">' +
    '      <form class="nav-search" role="search" autocomplete="off">' +
    '        <svg class="ns-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
    '        <input type="text" class="ns-input" placeholder="搜索全站…" aria-label="全站搜索">' +
    '        <button type="button" class="ns-clear" aria-label="清除搜索" hidden>×</button>' +
    '        <div class="ns-results" hidden></div>' +
    '      </form>' +
    '      <button class="theme-toggle" id="themeToggle" aria-label="切换明暗主题">' +
    '        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
    '        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
    '      </button>' +
    '      <a class="btn btn-primary btn-sm" href="#" id="qrTrigger">立即预约</a>' +
    '      <button class="burger" id="burger" aria-label="打开菜单" aria-expanded="false" aria-controls="mobileMenu">' +
    '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
    '      </button>' +
    '    </div>' +
    '  </div>' +
    '</header>' +
    '<nav class="mobile-menu" id="mobileMenu" aria-label="移动端导航">' +
    '  <form class="nav-search" role="search" autocomplete="off">' +
    '    <svg class="ns-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
    '    <input type="text" class="ns-input" placeholder="搜索全站…" aria-label="全站搜索">' +
    '    <button type="button" class="ns-clear" aria-label="清除搜索" hidden>×</button>' +
    '    <div class="ns-results" hidden></div>' +
    '  </form>' +
    '  <a href="' + menuHref("theory") + '">元阳为本</a>' +
    '  <a href="' + menuHref("dept") + '">专病门诊</a>' +
    '  <a href="' + menuHref("lineage") + '">学术渊源</a>' +
    '  <a href="' + menuHref("method") + '">经典法度</a>' +
    '  <a href="' + menuHref("wellness") + '">日常养生</a>' +
    '  <a href="' + menuHref("faq") + '">常见问题</a>' +
    '</nav>' +
    '<div class="qr-modal" id="qrModal" hidden>' +
    '  <div class="qr-overlay" data-qr-close></div>' +
    '  <div class="qr-card" role="dialog" aria-modal="true" aria-labelledby="qrTitle">' +
    '    <button type="button" class="qr-close" data-qr-close aria-label="关闭弹窗">×</button>' +
    '    <img src="assets/qrcode-miniapp.jpg" alt="扶阳中医馆服务号二维码" width="180" height="180">' +
    '    <h3 id="qrTitle">扫码预约 · 立即挂号</h3>' +
    '    <p>长按识别服务号二维码<br>开启一对一中医调理咨询</p>' +
    '  </div>' +
    '</div>';
  }

  /* ---------- 5. 挂载 ---------- */
  function mount() {
    var style = document.createElement("style");
    style.id = "shared-nav-css";
    style.textContent = CSS;
    document.head.appendChild(style);

    var NAV = buildNav();
    var holder = document.createElement("div");
    holder.innerHTML = NAV;
    while (holder.firstChild) document.body.insertBefore(holder.firstChild, document.body.firstChild);

    initTheme();
    initMobileMenu();
    initSmooth();
    initScroll();
    initQRModal();
    initSearch();
  }

  /* ---------- 6. 交互 ---------- */
  function initTheme() {
    // 初始主题已在 IIFE 顶部预绘应用（<head> 执行时），此处仅挂载点击切换
    var t = $("#themeToggle");
    if (t) t.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      var next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("fy:theme", next); } catch (e) {}
    });
  }

  function initMobileMenu() {
    var burger = $("#burger"), menu = $("#mobileMenu");
    if (!burger || !menu) return;
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  function closeMobile() {
    var menu = $("#mobileMenu");
    if (menu && menu.classList.contains("open")) {
      menu.classList.remove("open");
      var b = $("#burger"); if (b) b.setAttribute("aria-expanded", "false");
    }
  }

  function initSmooth() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        var y = t.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top: y, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        closeMobile();
        try { history.replaceState(null, "", id); } catch (e) {}
      });
    });
  }

  function initScroll() {
    var nav = $("#top");
    if (!nav) return;
    var links = $$(".nav-links a[data-spy]");
    var mob = $$(".mobile-menu a");
    var isSub = document.body.getAttribute("data-nav") === "sub";

    // 子页（无对应 #section）钉死「专病门诊」高亮，桌面 + 移动一致
    function setDeptActive() {
      [].concat(links, mob).forEach(function (a) {
        if (a.getAttribute("href").indexOf("#dept") >= 0) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
    if (isSub) setDeptActive();

    var secs = ["theory", "dept", "lineage", "method", "wellness", "faq"].map(function (id) { return document.getElementById(id); });
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
      if (isSub) return; // 子页钉死态由 setDeptActive 维护，不参与滚动清除
      var pos = window.scrollY + 140, cur = "";
      secs.forEach(function (s) { if (s && s.offsetTop <= pos) cur = s.id; });
      var apply = function (a) { var id = a.getAttribute("href").split("#")[1]; if (id === cur) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); };
      links.forEach(apply); mob.forEach(apply);
    };
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
    }, { passive: true });
    onScroll();
  }

  function initQRModal() {
    var modal = $("#qrModal"), trigger = $("#qrTrigger");
    if (!modal || !trigger) return;
    function open() { modal.hidden = false; document.body.style.overflow = "hidden"; }
    function close() { modal.hidden = true; document.body.style.overflow = ""; }
    trigger.addEventListener("click", function (e) { e.preventDefault(); open(); });
    modal.addEventListener("click", function (e) { if (e.target.closest("[data-qr-close]")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) close(); });
  }

  function initSearch() {
    var forms = $$(".nav-search");
    if (!forms.length) return;
    var index = [];
    function push(el, title, text, section) {
      var t = (text || "").replace(/\s+/g, " ").trim();
      if (!t) return;
      index.push({ el: el, title: (title || "").trim(), text: t.toLowerCase(), section: (section || "").trim() });
    }
    $$("main section").forEach(function (sec) {
      var t = $(".sec-title", sec), eb = $(".eyebrow", sec);
      var label = (eb ? eb.textContent.trim() : "") + (t ? " · " + t.textContent.trim() : "");
      if (!label) label = sec.id || "页面";
      push(sec, label, sec.textContent, eb ? eb.textContent.trim() : (t ? t.textContent.trim() : ""));
    });
    $$(".spec-card, .card").forEach(function (c) { var h = $("h3,h4", c); push(c, h ? h.textContent.trim() : "专病", c.textContent, "专病"); });
    $$(".faq-item").forEach(function (c) { var q = $(".faq-q", c); push(c, q ? q.textContent.trim() : "常见问题", c.textContent, "常见问题"); });
    $$(".well-card, .method-card").forEach(function (c) { var h = $("h3", c); push(c, h ? h.textContent.trim() : "内容", c.textContent, "内容"); });

    function esc(s) { return s.replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); }

    forms.forEach(function (form) {
      var input = $(".ns-input", form), box = $(".ns-results", form), clear = $(".ns-clear", form);
      var last = [];
      function render(q) {
        q = (q || "").trim().toLowerCase();
        if (!q) { box.hidden = true; box.innerHTML = ""; return; }
        var res = [];
        index.forEach(function (it) {
          var inTitle = it.title.toLowerCase().indexOf(q) >= 0;
          var inText = it.text.indexOf(q) >= 0;
          if (inTitle || inText) res.push({ it: it, s: inTitle ? 2 : 1 });
        });
        res.sort(function (a, b) { return b.s - a.s; });
        res = res.slice(0, 8);
        last = res;
        if (!res.length) { box.innerHTML = '<div class="ns-empty">未找到相关内容</div>'; box.hidden = false; return; }
        box.innerHTML = res.map(function (r, i) {
          return '<button type="button" class="ns-item" data-idx="' + i + '">' +
            '<span class="ns-sec">' + esc(r.it.section) + '</span>' +
            '<span class="ns-title">' + esc(r.it.title) + '</span></button>';
        }).join("");
        box.hidden = false;
      }
      input.addEventListener("input", function () { clear.hidden = !input.value; render(input.value); });
      clear.addEventListener("click", function () { input.value = ""; clear.hidden = true; box.hidden = true; box.innerHTML = ""; input.focus(); });
      box.addEventListener("click", function (e) {
        var btn = e.target.closest(".ns-item"); if (!btn) return;
        var r = last[+btn.getAttribute("data-idx")]; if (!r) return;
        var el = r.it.el;
        var y = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        el.classList.add("search-hit");
        setTimeout(function () { el.classList.remove("search-hit"); }, 1800);
        box.hidden = true;
        closeMobile();
      });
      input.addEventListener("keydown", function (e) { if (e.key === "Escape") { box.hidden = true; input.blur(); } });
    });
    document.addEventListener("click", function (e) {
      $$(".nav-search").forEach(function (form) {
        if (!form.contains(e.target)) { var b = $(".ns-results", form); if (b) b.hidden = true; }
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
