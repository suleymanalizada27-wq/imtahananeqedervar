export function footer(ctx, lastUpdatedText) {
  return `<footer class="site-footer">
  <div class="wrap foot">
    <div class="foot-col">
      <p class="foot-brand">${ctx.site.nameShort}<span class="logo-q">?</span></p>
      <p class="fine">Bu sayt DİM-in rəsmi saytı deyil. İmtahan qaydaları və tarixləri üçün yalnız <a href="${ctx.site.officialSite}" target="_blank" rel="noopener">dim.gov.az</a> saytı əsas götürülməlidir.</p>
    </div>
    <nav class="foot-col" aria-label="Səhifələr">
      <ul class="foot-links">
        <li><a href="/buraxilis-imtahani-2027">2027 buraxılış imtahanı</a></li>
        <li><a href="/9-cu-sinif-buraxilis-imtahani-2027">9-cu sinif buraxılış imtahanı</a></li>
        <li><a href="/11-ci-sinif-buraxilis-imtahani-2027">11-ci sinif buraxılış imtahanı</a></li>
        <li><a href="/dim-imtahan-tarixleri-2027">İmtahan tarixləri</a></li>
      </ul>
    </nav>
    <div class="foot-col">
      <p class="fine">Məlumat son yenilənib: <time datetime="${ctx.site.lastUpdated}">${lastUpdatedText}</time></p>
      <p class="fine">Vaxt qurşağı: Asia/Baku (UTC+4)</p>
    </div>
  </div>
</footer>`;
}
