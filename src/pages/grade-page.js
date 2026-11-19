import { breadcrumbs } from '../components/breadcrumbs.js';
import { countdownBlock, dateLine, progressBlock, actions } from '../components/countdown.js';
import { examDateSentence } from '../lib/format.js';

/** Hər iki sinif səhifəsinin ortaq çərçivəsi; məzmun hər sinif üçün ayrıca yazılır. */
export function gradePage(ctx, { view, title, description, intro, sections, otherView }) {
  const { site } = ctx;
  const { exam } = view;
  const path = `/${exam.slug}`;
  const crumbs = [
    { name: `${site.year} buraxılış imtahanı`, path: '/buraxilis-imtahani-2027' },
    { name: exam.shortTitle, path },
  ];

  const main = `
<section class="hero hero-sub" aria-labelledby="h1">
  <div class="wrap hero-in">
    ${breadcrumbs(crumbs)}
    <h1 id="h1">${exam.shortTitle} buraxılış imtahanı ${exam.year}</h1>
    <p class="lead">${intro}</p>
    ${countdownBlock(view, 'lg')}
    ${dateLine(view)}
    ${progressBlock(view)}
    ${actions(view)}
    <p class="fine center">Məlumat son yenilənib: <time datetime="${site.lastUpdated}">${ctx.lastUpdatedText}</time> · Vaxt qurşağı: Asia/Baku</p>
  </div>
</section>

<div class="wrap prose-wrap">
  <article class="prose">
    <section aria-labelledby="h-state">
      <h2 id="h-state">Tarixin vəziyyəti</h2>
      <p>${examDateSentence(view)} Rəsmi məlumatı <a href="${exam.officialSource}" target="_blank" rel="noopener">dim.gov.az</a> saytında yoxlaya bilərsən. Bütün tarixlərin siyahısı üçün <a href="/dim-imtahan-tarixleri-2027">imtahan tarixləri səhifəsinə</a> bax.</p>
    </section>
    ${sections}
    <section aria-labelledby="h-other">
      <h2 id="h-other">Digər imtahan</h2>
      <p>${otherView.exam.shortTitle} şagirdlərinin imtahanı üçün ayrıca countdown <a href="/${otherView.exam.slug}">${otherView.exam.shortTitle} buraxılış imtahanı ${otherView.exam.year}</a> səhifəsindədir. İki imtahanı yan-yana görmək üçün <a href="/">ana səhifəyə</a> qayıt.</p>
    </section>
  </article>
</div>`;

  return {
    path,
    title,
    description,
    breadcrumbs: crumbs,
    exams: [view],
    main,
  };
}
