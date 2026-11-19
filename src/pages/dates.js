import { breadcrumbs } from '../components/breadcrumbs.js';
import { examDateSentence } from '../lib/format.js';

function statusRow(view) {
  const { exam } = view;
  return `<tr>
  <th scope="row"><a href="/${exam.slug}">${exam.title}</a></th>
  <td>${view.hasDate ? `<time datetime="${exam.date}">${view.dateText}</time>` : '—'}</td>
  <td><span class="badge badge-${view.status.tone}">${view.status.label}</span></td>
</tr>`;
}

export function datesPage(ctx) {
  const { site, views } = ctx;
  const list = [views['grade-9'], views['grade-11']];
  const crumbs = [{ name: 'İmtahan tarixləri', path: '/dim-imtahan-tarixleri-2027' }];

  const main = `
<div class="wrap page-head">
  ${breadcrumbs(crumbs)}
  <h1>${site.year}-ci il buraxılış imtahanlarının tarixləri</h1>
  <p class="lead left">DİM-in elan etdiyi tarixlər və onların statusu bir yerdə. Rəsmi olmayan tarix heç vaxt rəsmi kimi göstərilmir.</p>
</div>

<div class="wrap prose-wrap">
  <article class="prose">
    <section aria-labelledby="h-table">
      <h2 id="h-table">Cari vəziyyət</h2>
      <div class="table-wrap">
        <table>
          <caption class="sr-only">${site.year}-ci il buraxılış imtahanlarının tarixləri və statusları</caption>
          <thead><tr><th scope="col">İmtahan</th><th scope="col">Tarix</th><th scope="col">Status</th></tr></thead>
          <tbody>
            ${list.map(statusRow).join('\n')}
          </tbody>
        </table>
      </div>
      <p class="fine">Son yenilənmə: <time datetime="${site.lastUpdated}">${ctx.lastUpdatedText}</time>.</p>
      <p>${list.map(examDateSentence).join(' ')}</p>
    </section>

    <section aria-labelledby="h-status">
      <h2 id="h-status">Statuslar nə deməkdir?</h2>
      <ul>
        <li><strong>Rəsmi tarix:</strong> DİM-in elanında göstərilən tarix.</li>
        <li><strong>İlkin tarix:</strong> rəsmi mənbədə hələ təsdiqlənməyib, dəyişə bilər. Saytda bu cür tarix ayrıca qeyd olunur.</li>
        <li><strong>Tarix hələ açıqlanmayıb:</strong> hələlik göstərə biləcəyimiz tarix yoxdur. Bu halda countdown gözləmə rejimində olur.</li>
      </ul>
    </section>

    <section aria-labelledby="h-where">
      <h2 id="h-where">Rəsmi tarixi haradan öyrənmək olar?</h2>
      <p>Ən etibarlı mənbə Dövlət İmtahan Mərkəzinin <a href="${site.officialSite}" target="_blank" rel="noopener">dim.gov.az</a> saytıdır. Xəbərlər və elanlar bölməsində imtahan tarixləri barədə məlumatlar dərc olunur. DİM həmçinin hər tədris ili üçün yekun qiymətləndirmənin təqvim planını yerləşdirir (məsələn, 2025–2026-cı tədris ili üçün belə plan saytda mövcuddur). İmtahana buraxılış vərəqələri barədə isə məktəbin əlaqələndiricisi məlumat verir.</p>
    </section>

    <section aria-labelledby="h-past">
      <h2 id="h-past">Keçmiş illərdə necə olub?</h2>
      <p>Aşağıdakı nümunələr yalnız tarixi məlumat üçündür. İmtahan vaxtı hər il yenidən müəyyən olunur, ona görə bunlardan ${site.year}-ci il üçün proqnoz çıxarmaq düzgün deyil.</p>
      <div class="table-wrap">
        <table>
          <caption class="sr-only">Keçmiş illərdə keçirilmiş buraxılış imtahanlarına nümunələr</caption>
          <thead><tr><th scope="col">İmtahan</th><th scope="col">Keçirildiyi tarix</th></tr></thead>
          <tbody>
            <tr><th scope="row">11-ci sinif (tam orta təhsil), 2024</th><td>3 və 10 mart 2024</td></tr>
            <tr><th scope="row">9-cu sinif (doqquzillik baza), 2026</th><td>21 iyun 2026</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="h-update">
      <h2 id="h-update">Tarix dəyişərsə nə olacaq?</h2>
      <p>DİM yeni tarix elan edəndə və ya mövcud tarixi dəyişəndə məlumatı bu saytda yeniləyirik. Bütün səhifələrdəki countdown eyni mərkəzi mənbədən oxunduğu üçün tarix hər yerdə birlikdə dəyişir. Hər imtahanın öz səhifəsi də var: <a href="/${list[0].exam.slug}">9-cu sinif</a> və <a href="/${list[1].exam.slug}">11-ci sinif</a>.</p>
      <p>Ümumi məlumat üçün <a href="/buraxilis-imtahani-2027">${site.year}-ci il buraxılış imtahanı</a> səhifəsinə, canlı countdown üçün isə <a href="/">ana səhifəyə</a> bax.</p>
    </section>
  </article>
</div>`;

  return {
    path: '/dim-imtahan-tarixleri-2027',
    title: 'DİM İmtahan Tarixləri 2027 – Buraxılış İmtahanları',
    description:
      'DİM-in 2027-ci il buraxılış imtahanı tarixləri və statusu: rəsmi, ilkin və ya hələ açıqlanmayıb. Tarixi haradan öyrənmək olar və nə vaxt yenilənir.',
    breadcrumbs: crumbs,
    exams: list,
    main,
  };
}
