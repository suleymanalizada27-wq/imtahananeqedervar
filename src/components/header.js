const ICON_MOON =
  '<svg class="i-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z"/></svg>';
const ICON_SUN =
  '<svg class="i-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MENU =
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path class="m-open" d="M4 7h16M4 12h16M4 17h16"/><path class="m-close" d="M6 6l12 12M18 6L6 18"/></svg>';

const LOGO_MARK =
  '<svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="8" fill="var(--accent)"/><circle cx="16" cy="16" r="8" fill="none" stroke="#fff" stroke-width="2"/><path d="M16 11.5V16l3 2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function header(ctx) {
  return `<header class="site-header">
  <div class="wrap hdr">
    <a class="logo" href="/" aria-label="${ctx.site.name} — ana səhifə">${LOGO_MARK}<span>${ctx.site.nameShort}<span class="logo-q">?</span></span></a>
    <nav id="nav" class="nav" aria-label="Əsas naviqasiya">
      <a href="/#imtahanlar">İmtahanlar</a>
      <a href="/dim-imtahan-tarixleri-2027">İmtahan tarixləri</a>
      <a href="/#haqqimizda">Haqqımızda</a>
    </nav>
    <div class="hdr-actions">
      <button type="button" class="icon-btn" data-theme-toggle aria-label="Qaranlıq rejimə keç">${ICON_MOON}${ICON_SUN}</button>
      <button type="button" class="icon-btn menu-btn" data-menu-toggle aria-expanded="false" aria-controls="nav" aria-label="Menyunu aç">${ICON_MENU}</button>
    </div>
  </div>
</header>`;
}
