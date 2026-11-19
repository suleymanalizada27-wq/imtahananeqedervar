import { breadcrumbs } from '../components/breadcrumbs.js';
import { examCards } from '../components/exam-card.js';
import { examDateSentence } from '../lib/format.js';

export function graduationPage(ctx) {
  const { site, views } = ctx;
  const list = [views['grade-9'], views['grade-11']];
  const crumbs = [{ name: `${site.year} buraxılış imtahanı`, path: '/buraxilis-imtahani-2027' }];

  const main = `
<div class="wrap page-head">
  ${breadcrumbs(crumbs)}
  <h1>${site.year}-ci il buraxılış imtahanı: ümumi məlumat</h1>
  <p class="lead left">Buraxılış imtahanı nədir, kimlər iştirak edir, tarixi haradan öyrənmək olar və imtahan günü nələri nəzərə almaq lazımdır? Bu səhifə ${site.year}-ci il üçün əsas məsələləri bir yerdə toplayır.</p>
</div>

<section class="section tight" aria-labelledby="h-now">
  <div class="wrap">
    <h2 id="h-now">İki imtahan, iki ayrı countdown</h2>
    ${examCards(list)}
  </div>
</section>

<div class="wrap prose-wrap">
  <article class="prose">
    <section aria-labelledby="h-what">
      <h2 id="h-what">Buraxılış imtahanı nədir?</h2>
      <p>Buraxılış imtahanı ümumi təhsil müəssisələrində təhsil pilləsinin sonunda keçirilən yekun qiymətləndirmədir. Azərbaycanda bunu Dövlət İmtahan Mərkəzi (DİM) həyata keçirir. İmtahan iki səviyyədə təşkil olunur: 9-cu sinif (ümumi orta təhsil) və 11-ci sinif (tam orta təhsil).</p>
    </section>

    <section aria-labelledby="h-who">
      <h2 id="h-who">Kimlər iştirak edir?</h2>
      <p>Cari tədris ilinin 9-cu və 11-ci sinif şagirdləri imtahana məktəb vasitəsilə qoşulur. Əvvəlki illərin məzunları üçün ayrıca qeydiyyat qaydası ola bilər; bu barədə yalnız DİM-in elanına güvənmək lazımdır.</p>
    </section>

    <section aria-labelledby="h-status">
      <h2 id="h-status">${site.year}-ci il üçün tarixin vəziyyəti</h2>
      <p>${list.map(examDateSentence).join(' ')}</p>
      <p>Tarix elan olunduqda həm countdown, həm də bu səhifədəki məlumat eyni mərkəzi mənbədən yenilənir. Rəsmi elanı <a href="${site.officialSite}" target="_blank" rel="noopener">dim.gov.az</a> saytında izləyə bilərsən; daha geniş izahat üçün <a href="/dim-imtahan-tarixleri-2027">imtahan tarixləri səhifəsinə</a> keç.</p>
    </section>

    <section aria-labelledby="h-docs">
      <h2 id="h-docs">İmtahan günü: sənədlər və buraxılış vərəqəsi</h2>
      <p>İmtahana gələn şagirdlər DİM-in saytından çap edilən <em>imtahana buraxılış vərəqəsi</em> ilə gəlir. Vərəqədə imtahanla bağlı əsas məlumatlar yer alır. Şəxsiyyəti təsdiq edən sənədin də yanında olması tələb oluna bilər. Dəqiq siyahı hər imtahan üçün DİM-in elanında göstərilir, ona görə imtahandan bir neçə gün əvvəl həmin elanı mütləq oxu.</p>
    </section>

    <section aria-labelledby="h-results">
      <h2 id="h-results">Nəticələr və apellyasiya</h2>
      <p>İmtahan nəticələri DİM tərəfindən elan olunur. Nəticələrlə razı olmayan iştirakçılar üçün apellyasiya müraciəti mümkündür; müraciət müddəti və forması hər dəfə DİM-in elanında açıqlanır.</p>
    </section>

    <section aria-labelledby="h-next">
      <h2 id="h-next">Növbəti addım</h2>
      <p>Səni maraqlandıran sinfi seç və ona aid səhifəyə keç: <a href="/${list[0].exam.slug}">9-cu sinif buraxılış imtahanı</a> və ya <a href="/${list[1].exam.slug}">11-ci sinif buraxılış imtahanı</a>. Ana səhifədə isə hər iki imtahanı <a href="/">bir yerdə</a> izləmək olar.</p>
    </section>
  </article>
</div>`;

  return {
    path: '/buraxilis-imtahani-2027',
    title: `${site.year}-ci il Buraxılış İmtahanı – Ümumi Məlumat`,
    description:
      '2027-ci il buraxılış imtahanı haqqında ümumi məlumat: kimlər iştirak edir, tarixi haradan öyrənmək olar, imtahan günü sənədlər və nəticələr barədə qeydlər.',
    breadcrumbs: crumbs,
    exams: list,
    main,
  };
}
