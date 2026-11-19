import { examDateSentence } from '../lib/format.js';
import { stripTags } from '../lib/html.js';

const DIM_LINK = '<a href="https://dim.gov.az" target="_blank" rel="noopener">dim.gov.az</a>';

function daysAnswer(view) {
  if (view.hasDate) {
    return `Qalan vaxt yuxarıdakı canlı countdown-da gün, saat, dəqiqə və saniyə ilə göstərilir. ${examDateSentence(view)}`;
  }
  return `Rəsmi tarix açıqlanmadığı üçün qalan gün sayı hələ hesablanmır. ${examDateSentence(view)} Tarix elan olunan kimi countdown qalan vaxtı saniyəsinə qədər göstərəcək.`;
}

/**
 * Ana səhifə FAQ-ı. Cavablar imtahan tarixlərinin cari statusundan asılıdır,
 * ona görə data dəyişdikdə FAQ və FAQPage schema avtomatik yenilənir.
 * @param views [grade9View, grade11View]
 */
export function buildFaq(views, site) {
  const [g9, g11] = views;
  const items = [
    {
      q: `${site.year}-ci il buraxılış imtahanı nə vaxtdır?`,
      a: `${examDateSentence(g9)} ${examDateSentence(g11)} Dəqiq və son məlumat üçün həmişə ${DIM_LINK} saytına baxın; tarix elan olunduqda bu saytda da yenilənir.`,
    },
    {
      q: '9-cu sinif buraxılış imtahanına neçə gün qalıb?',
      a: daysAnswer(g9),
    },
    {
      q: '11-ci sinif buraxılış imtahanına neçə gün qalıb?',
      a: daysAnswer(g11),
    },
    {
      q: 'İmtahan tarixləri haradan öyrənilir?',
      a: `Rəsmi mənbə Dövlət İmtahan Mərkəzidir (DİM): xəbərlər və elanlar ${DIM_LINK} saytında dərc olunur. İmtahana buraxılış vərəqələri barədə məktəbin əlaqələndiricisi də məlumat verir. Bu saytda hər tarixin yanında statusu göstərilir: rəsmi, ilkin və ya hələ açıqlanmayıb.`,
    },
    {
      q: 'Countdown hansı saat qurşağına əsaslanır?',
      a: 'Hesablama Asia/Baku saat qurşağına (UTC+4, Azərbaycan vaxtı) əsaslanır. Azərbaycanda yay saatı tətbiq olunmur, ona görə hesablama il boyu eynidir. Qalan vaxt cihazının saat qurşağından asılı olmayaraq eyni göstərilir; yalnız cihazın saatı düzgün olmalıdır.',
    },
    {
      q: 'İmtahan tarixi dəyişərsə countdown yenilənəcəkmi?',
      a: 'Bəli. DİM tarixi dəyişdirsə və ya yenisini elan etsə, məlumatı saytda yeniləyirik və countdown yeni tarixə görə hesablanır. Məlumatın son yenilənmə tarixi səhifənin yuxarısında və aşağısında göstərilir.',
    },
    {
      q: 'Sayt pulsuzdurmu?',
      a: 'Bəli, sayt tamamilə pulsuzdur və qeydiyyat tələb etmir. Şəxsi məlumat toplanmır; yalnız seçdiyin işıqlı/qaranlıq rejim cihazında yadda saxlanılır.',
    },
  ];
  return items.map((i) => ({ ...i, text: stripTags(i.a) }));
}
