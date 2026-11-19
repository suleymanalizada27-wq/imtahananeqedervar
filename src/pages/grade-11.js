import { gradePage } from './grade-page.js';

export function grade11Page(ctx) {
  const view = ctx.views['grade-11'];
  const sections = `
    <section aria-labelledby="h-who">
      <h2 id="h-who">Bu imtahan kimlər üçündür?</h2>
      <p>11-ci sinif buraxılış imtahanı tam (on birillik) orta təhsil səviyyəsini başa vuran şagirdlər üçündür. İmtahanı Dövlət İmtahan Mərkəzi (DİM) təşkil edir və şagirdlər ona məktəbləri vasitəsilə qoşulur.</p>
    </section>

    <section aria-labelledby="h-why">
      <h2 id="h-why">Nəticə qəbul prosesinə necə təsir edə bilər?</h2>
      <p>Bəzi hallarda buraxılış imtahanında iştirak edən abituriyent topladığı bal cari ilin müsabiqə şərtlərini ödəyirsə, həmin il qəbul imtahanında iştirak etməyə də bilər. Bu şərtlər hər il dəyişə bilər və DİM-in qəbul elanlarında yazılır. Ona görə 11-ci sinif şagirdləri üçün buraxılış və qəbul qaydalarını birlikdə izləmək vacibdir.</p>
    </section>

    <section aria-labelledby="h-past">
      <h2 id="h-past">Keçmiş illərdən bir nümunə</h2>
      <p>DİM-in məlumatına görə, tam orta təhsil səviyyəsi üzrə buraxılış imtahanları 2024-cü ildə 3 və 10 mart tarixlərində keçirilib. Bu, yalnız tarixi nümunədir: imtahan vaxtı hər il yenidən müəyyən edilir və ${view.exam.year}-ci il üçün proqnoz kimi oxunmamalıdır.</p>
    </section>

    <section aria-labelledby="h-plan">
      <h2 id="h-plan">11-ci sinifdə vaxtı necə bölmək olar?</h2>
      <p>11-ci sinif şagirdləri eyni anda məktəb dərsləri, buraxılış və qəbul hazırlığı ilə məşğul olur. Bu yükü idarə etmək üçün aşağıdakı yanaşma kömək edə bilər:</p>
      <ul>
        <li>Əvvəlcə hansı imtahanların sənin üçün həqiqətən vacib olduğunu müəyyən et və hazırlığı buna uyğun qur.</li>
        <li>Ortaq mövzuları (məsələn, məktəb proqramı ilə üst-üstə düşən hissələri) birlikdə təkrar et, beləliklə vaxta qənaət olar.</li>
        <li>İki-üç həftədən bir tam həcmli sınaq imtahanı yazıb vaxt idarəetməsini yoxla.</li>
        <li>İmtahan həftəsinə yaxınlaşdıqca yuxu və gündəlik rejimi pozma; son günlərdə yeni mövzu yükləməkdən çəkin.</li>
      </ul>
    </section>`;

  return gradePage(ctx, {
    view,
    otherView: ctx.views['grade-9'],
    title: '11-ci Sinif Buraxılış İmtahanı 2027 – Countdown',
    description:
      '11-ci sinif buraxılış imtahanına nə qədər qalıb? Canlı countdown, tarixin rəsmi statusu və 2027-ci il üçün hazırlıq və vaxt bölgüsü ilə bağlı qeydlər.',
    intro: 'On birinci sinif buraxılış imtahanına qalan vaxtı gün, saat, dəqiqə və saniyə ilə izlə.',
    sections,
  });
}
