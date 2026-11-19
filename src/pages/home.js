import { countdownBlock, dateLine, progressBlock, actions, progressNote } from '../components/countdown.js';
import { examCards } from '../components/exam-card.js';
import { faqList } from '../components/faq.js';
import { buildFaq } from '../data/faq.js';
import { formatDateAz, examDateSentence } from '../lib/format.js';

function datesParagraph(views) {
  if (views.every((v) => !v.hasDate)) {
    return `Saytın məlumatlarına görə, ${views[0].exam.year}-ci il üçün 9-cu və 11-ci sinif buraxılış imtahanlarının rəsmi tarixi hələ müəyyən edilməyib. Buna görə countdown tarix məlum olana qədər gözləmə rejimindədir və heç bir təxmini tarix göstərilmir.`;
  }
  return views.map(examDateSentence).join(' ');
}

function heroPanel(view, selected) {
  const { exam } = view;
  return `<div class="panel" role="tabpanel" id="panel-${exam.id}" aria-labelledby="tab-${exam.id}"${selected ? '' : ' hidden'}>
  ${countdownBlock(view, 'lg')}
  ${dateLine(view)}
  ${progressBlock(view)}
  ${actions(view)}
  <p class="more"><a href="/${exam.slug}">${exam.shortTitle} imtahanı haqqında ətraflı →</a></p>
</div>`;
}

export function homePage(ctx) {
  const { site, views } = ctx;
  const list = [views['grade-9'], views['grade-11']];
  const faq = buildFaq(list, site);

  const tabs = list
    .map(
      (v, i) =>
        `<button type="button" role="tab" class="tab" id="tab-${v.exam.id}" data-tab="${v.exam.id}" aria-selected="${i === 0}" aria-controls="panel-${v.exam.id}" tabindex="${i === 0 ? 0 : -1}">${v.exam.shortTitle}</button>`,
    )
    .join('');

  const main = `
<section class="hero" aria-labelledby="h1">
  <div class="wrap hero-in">
    <p class="eyebrow">İmtahana nə qədər qalıb?</p>
    <h1 id="h1">${site.year}-ci il buraxılış imtahanlarına nə qədər qalıb?</h1>
    <p class="lead">${site.year}-ci il buraxılış imtahanlarına qalan vaxtı saniyəsinə qədər izləy.</p>
    <div class="tabs" role="tablist" aria-label="İmtahan seçimi">${tabs}</div>
    ${list.map((v, i) => heroPanel(v, i === 0)).join('\n')}
    ${progressNote(site, formatDateAz)}
    <p class="fine center">Məlumat son yenilənib: <time datetime="${site.lastUpdated}">${formatDateAz(site.lastUpdated)}</time> · Vaxt qurşağı: Asia/Baku</p>
  </div>
</section>

<section id="imtahanlar" class="section" aria-labelledby="h-cards">
  <div class="wrap">
    <h2 id="h-cards">İmtahanlar</h2>
    ${examCards(list)}
  </div>
</section>

<div class="wrap prose-wrap">
  <article class="prose">
    <section aria-labelledby="h-2027">
      <h2 id="h-2027">${site.year}-ci il buraxılış imtahanları</h2>
      <p>Azərbaycanda ümumi təhsilin iki pilləsi buraxılış imtahanı ilə tamamlanır: 9-cu sinifdə ümumi (doqquzillik), 11-ci sinifdə isə tam (on birillik) orta təhsil səviyyəsində. Bu imtahanları Dövlət İmtahan Mərkəzi (DİM) təşkil edir. Bu sayt yalnız bir sual üçün hazırlanıb: seçdiyin imtahana nə qədər vaxt qalıb?</p>
      <p>${datesParagraph(list)}</p>
      <p>Bütün ümumi məlumatı <a href="/buraxilis-imtahani-2027">${site.year}-ci il buraxılış imtahanı səhifəsində</a> toplamışıq.</p>
    </section>

    <section aria-labelledby="h-g9">
      <h2 id="h-g9">9-cu sinif buraxılış imtahanı</h2>
      <p>9-cu sinif şagirdləri üçün buraxılış imtahanı ümumi orta təhsil pilləsinin sonunda keçirilir. Burada topladığın bal sonradan kollec və digər orta ixtisas təhsili müəssisələrinə qəbul zamanı da nəzərə alına bilər, ona görə nəticə yalnız “keçdim-kəsildim” məsələsi deyil.</p>
      <p><a href="/${list[0].exam.slug}">9-cu sinif imtahanı səhifəsində</a> countdown, tarix statusu və hazırlıq üçün qısa plan var.</p>
    </section>

    <section aria-labelledby="h-g11">
      <h2 id="h-g11">11-ci sinif buraxılış imtahanı</h2>
      <p>11-ci sinif buraxılış imtahanı tam orta təhsilin yekun mərhələsidir. Nəticənin qəbul müsabiqəsində hansı şərtlərlə nəzərə alındığı hər il DİM-in qəbul elanlarında göstərilir. Ona görə həm buraxılış, həm də qəbul qaydalarını birlikdə izləmək məsləhətdir.</p>
      <p><a href="/${list[1].exam.slug}">11-ci sinif imtahanı səhifəsində</a> bu imtahan üçün ayrıca countdown və qeydlər yerləşdirilib.</p>
    </section>

    <section aria-labelledby="h-dates">
      <h2 id="h-dates">İmtahan tarixləri</h2>
      <p>Tarixin rəsmi sayılması üçün DİM-in elanı lazımdır. Bu saytda hər imtahanın tarixi yanında statusla göstərilir: <strong>rəsmi tarix</strong>, <strong>ilkin tarix</strong> və ya <strong>tarix hələ açıqlanmayıb</strong>. İlkin tarix heç vaxt rəsmi kimi təqdim olunmur.</p>
      <p>Tarix mənbələri və keçmiş illərdəki praktika barədə <a href="/dim-imtahan-tarixleri-2027">imtahan tarixləri səhifəsinə</a> baxa bilərsən. Ən dəqiq məlumat isə həmişə <a href="${site.officialSite}" target="_blank" rel="noopener">dim.gov.az</a> saytındadır.</p>
    </section>

    <section aria-labelledby="h-plan">
      <h2 id="h-plan">İmtahana hazırlıq müddətini planlaşdırmaq</h2>
      <p>Countdown vaxtın necə azaldığını göstərir, amma plan əvəzinə keçmir. Qalan vaxtı faydalı etmək üçün bir neçə sadə qayda kömək edir:</p>
      <ul>
        <li><strong>Günləri həftələrə böl.</strong> Məsələn, 140 gün 20 həftə deməkdir. Hər həftəyə bir-iki mövzu bloku ayırmaq həm real, həm də izləməsi asan plandır.</li>
        <li><strong>Zəif mövzulardan başla.</strong> Yaxşı bildiyin mövzunu təkrar etmək rahatdır, lakin bal itkisinin böyük hissəsi adətən zəif mövzulardan gəlir.</li>
        <li><strong>Sınaq imtahanlarını vaxtla həll et.</strong> Real imtahandakı vaxt məhdudiyyətinə vərdiş etmək nəticəyə birbaşa təsir edir.</li>
        <li><strong>Son həftələri təkrara saxla.</strong> Yeni mövzu öyrənməyi imtahandan əvvəlki son iki-üç həftəyə qoyma.</li>
      </ul>
      <p>Hero hissədəki progress bar tədris ilinin başlanğıcından imtahan gününə qədər keçən müddətin faizini göstərir. Bu, sadəcə orientirdir: hazırlığın necə getdiyini ölçmək üçün öz nəticələrinə bax.</p>
    </section>

    <section aria-labelledby="h-faq">
      <h2 id="h-faq">Tez-tez verilən suallar</h2>
      ${faqList(faq)}
    </section>

    <section id="haqqimizda" aria-labelledby="h-about">
      <h2 id="h-about">Haqqımızda</h2>
      <p>${site.name} şagirdlərə imtahana qalan vaxtı bir baxışda göstərən pulsuz və qeyri-rəsmi informasiya layihəsidir. Sayt DİM-in rəsmi səhifəsi deyil: imtahan qaydaları, tarixlər və sənədlər üçün yalnız <a href="${site.officialSite}" target="_blank" rel="noopener">dim.gov.az</a> əsas götürülməlidir. Qeydiyyat tələb olunmur və şəxsi məlumat toplanmır.</p>
    </section>
  </article>
</div>`;

  return {
    path: '/',
    title: 'Buraxılış İmtahanına Nə Qədər Qalıb? | 2027',
    description:
      '2027-ci il 9-cu və 11-ci sinif buraxılış imtahanlarına qalan vaxtı gün, saat, dəqiqə və saniyə ilə izlə. Rəsmi tarixlər açıqlandıqca məlumat yenilənir.',
    breadcrumbs: [],
    faq,
    exams: list,
    main,
  };
}
