export function notFoundPage() {
  const main = `
<section class="hero" aria-labelledby="h1">
  <div class="wrap hero-in">
    <p class="eyebrow">404</p>
    <h1 id="h1">Bu səhifə tapılmadı</h1>
    <p class="lead">Axtardığın ünvan mövcud deyil və ya köçürülüb. Aşağıdakı səhifələrdən birinə keç:</p>
    <p class="actions center-actions">
      <a class="btn btn-primary" href="/">Ana səhifə</a>
      <a class="btn" href="/9-cu-sinif-buraxilis-imtahani-2027">9-cu sinif</a>
      <a class="btn" href="/11-ci-sinif-buraxilis-imtahani-2027">11-ci sinif</a>
      <a class="btn" href="/dim-imtahan-tarixleri-2027">İmtahan tarixləri</a>
    </p>
  </div>
</section>`;
  return {
    path: '/404.html',
    file: '404.html',
    title: 'Səhifə tapılmadı – İmtahanaNəQədər?',
    description: 'Axtardığınız səhifə tapılmadı. Ana səhifəyə qayıdın və buraxılış imtahanına qalan vaxtı izləyin.',
    noindex: true,
    exams: [],
    main,
  };
}
