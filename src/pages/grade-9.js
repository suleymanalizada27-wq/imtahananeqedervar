import { gradePage } from './grade-page.js';

export function grade9Page(ctx) {
  const view = ctx.views['grade-9'];
  const sections = `
    <section aria-labelledby="h-who">
      <h2 id="h-who">Bu imtahan kimlər üçündür?</h2>
      <p>9-cu sinif buraxılış imtahanı ümumi (doqquzillik) orta təhsil səviyyəsini bitirən şagirdlər üçün keçirilir. İmtahanı Dövlət İmtahan Mərkəzi təşkil edir, şagirdlər isə imtahana məktəbləri vasitəsilə qoşulur.</p>
    </section>

    <section aria-labelledby="h-why">
      <h2 id="h-why">Nəticə niyə vacibdir?</h2>
      <p>Ümumi orta təhsil bazasında orta ixtisas təhsili müəssisələrinə (kolleclərə) qəbulda cari ilin məzunlarının buraxılış imtahanından topladığı bal nəzərə alınır. Başqa sözlə, bu imtahanın nəticəsi sonrakı təhsil yolunda da rol oynaya bilər. Qəbulun dəqiq şərtləri və minimum bal hədləri hər il DİM-in elanlarında göstərilir.</p>
    </section>

    <section aria-labelledby="h-past">
      <h2 id="h-past">Keçən il necə olub?</h2>
      <p>DİM-in yayımladığı cavab açarlarından göründüyü kimi, 2026-cı ildə 9-cu sinif (doqquzillik baza) buraxılış imtahanı 21 iyunda keçirilib. Bu, yalnız keçmişə dair məlumatdır: imtahan tarixi hər il yenidən müəyyən edilir və ${view.exam.year}-ci il üçün proqnoz sayılmamalıdır.</p>
    </section>

    <section aria-labelledby="h-plan">
      <h2 id="h-plan">9-cu sinifdə hazırlığı necə bölmək olar?</h2>
      <p>Fənlərin sayı, tapşırıq formatı və vaxt DİM-in hər il yayımladığı imtahan proqramında göstərilir, ona görə hazırlığa başlamazdan əvvəl həmin sənədi oxumaq düzgün addımdır. Ondan sonra qalan vaxtı sadə şəkildə bölmək kifayətdir:</p>
      <ul>
        <li>Məktəb proqramının hər fənn üzrə mövzularını siyahıya al və bildiyin ilə bilmədiyini ayır.</li>
        <li>Həftədə ən azı bir dəfə qarışıq mövzulu qısa yoxlama tapşırığı həll et.</li>
        <li>Səhvlərini ayrıca dəftərdə topla: imtahandan əvvəl yenidən oxumaq üçün ən faydalı material elə odur.</li>
        <li>Valideyn və ya müəllimlə vaxtaşırı gedişatı yoxla; countdown-dakı faiz bunun üçün yaxşı bəhanədir.</li>
      </ul>
    </section>`;

  return gradePage(ctx, {
    view,
    otherView: ctx.views['grade-11'],
    title: '9-cu Sinif Buraxılış İmtahanı 2027 – Countdown',
    description:
      '9-cu sinif buraxılış imtahanına nə qədər qalıb? Canlı countdown, tarixin rəsmi statusu və 2027-ci il üçün hazırlığı planlaşdırmaq üçün faydalı qeydlər.',
    intro: 'Doqquzuncu sinif buraxılış imtahanına qalan vaxtı gün, saat, dəqiqə və saniyə ilə izlə.',
    sections,
  });
}
