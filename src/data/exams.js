/**
 * MƏRKƏZİ MƏLUMAT FAYLI — imtahan tarixlərini yeniləmək üçün yeganə yer.
 *
 * Rəsmi tarix açıqlandıqda yalnız aşağıdakı sahələri dəyişin:
 *
 *   date:        '2027-06-20'      // YYYY-MM-DD (Asia/Baku)
 *   dateStatus:  'official'        // 'official' | 'preliminary' | 'unconfirmed'
 *   officialSource: 'https://dim.gov.az/...'   // elanın dəqiq linki (ixtiyari)
 *
 * İxtiyari sahələr:
 *   time:        '11:00'           // başlama saatı (Bakı vaxtı). Göstərilməsə 00:00 qəbul olunur
 *   endDate:     '2027-06-21'      // imtahan bir neçə gün davam edirsə son gün
 *
 * Sonra SITE.lastUpdated tarixini dəyişin və `git push` edin (Netlify yenidən build edəcək).
 *
 * Qaydalar (build zamanı yoxlanılır):
 *   - dateStatus 'unconfirmed' olduqda date null olmalıdır.
 *   - date doldurulubsa, status 'official' və ya 'preliminary' olmalıdır.
 */

export const SITE = {
  name: 'İmtahanaNəQədər?',
  nameShort: 'İmtahanaNəQədər',
  lang: 'az',
  locale: 'az_AZ',
  year: 2027,
  timezone: 'Asia/Baku',
  /** Məlumatın son yenilənmə tarixi (YYYY-MM-DD). Tarixləri dəyişəndə bunu da yeniləyin. */
  lastUpdated: '2026-11-19',
  officialSite: 'https://dim.gov.az',
  /** Sayt URL-i: build zamanı SITE_URL mühit dəyişəni ilə əvəz oluna bilər. */
  defaultUrl: 'https://imtahananeqedervar.netlify.app',
  /**
   * Progress bar üçün hesablama başlanğıcı: 2026–2027 tədris ilinin ilk günü
   * (Bilik Günü, 15 sentyabr 2026 — edu.gov.az).
   */
  periodStart: '2026-09-15',
};

export const EXAMS = [
  {
    id: 'grade-9',
    grade: 9,
    slug: '9-cu-sinif-buraxilis-imtahani-2027',
    shortTitle: '9-cu sinif',
    title: '9-cu sinif buraxılış imtahanı',
    year: 2027,
    date: null,
    dateStatus: 'unconfirmed',
    timezone: 'Asia/Baku',
    description:
      'Ümumi (doqquzillik) orta təhsil səviyyəsini başa vuran 9-cu sinif şagirdləri üçün buraxılış imtahanı.',
    officialSource: 'https://dim.gov.az',
  },
  {
    id: 'grade-11',
    grade: 11,
    slug: '11-ci-sinif-buraxilis-imtahani-2027',
    shortTitle: '11-ci sinif',
    title: '11-ci sinif buraxılış imtahanı',
    year: 2027,
    date: null,
    dateStatus: 'unconfirmed',
    timezone: 'Asia/Baku',
    description:
      'Tam (on birillik) orta təhsil səviyyəsini başa vuran 11-ci sinif şagirdləri üçün buraxılış imtahanı.',
    officialSource: 'https://dim.gov.az',
  },
];

export const getExam = (id) => EXAMS.find((e) => e.id === id);

/** Tarix statusları — istifadəçiyə göstərilən etiketlər. */
export const STATUS = {
  official: { label: 'Rəsmi tarix', tone: 'official' },
  preliminary: { label: 'İlkin tarix', tone: 'preliminary' },
  unconfirmed: { label: 'Tarix hələ açıqlanmayıb', tone: 'unconfirmed' },
};

/** Məlumatın bütövlüyünü yoxla; xəta varsa build dayanır. */
export function validateExams(exams = EXAMS) {
  const ids = new Set();
  for (const e of exams) {
    if (ids.has(e.id)) throw new Error(`Təkrar exam id: ${e.id}`);
    ids.add(e.id);
    if (!STATUS[e.dateStatus]) throw new Error(`${e.id}: yanlış dateStatus "${e.dateStatus}"`);
    if (e.date && !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) throw new Error(`${e.id}: date YYYY-MM-DD formatında olmalıdır`);
    if (e.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(e.endDate)) throw new Error(`${e.id}: endDate YYYY-MM-DD formatında olmalıdır`);
    if (e.time && !/^\d{2}:\d{2}$/.test(e.time)) throw new Error(`${e.id}: time HH:MM formatında olmalıdır`);
    if (e.dateStatus === 'unconfirmed' && e.date) {
      throw new Error(`${e.id}: status "unconfirmed" olduqda date null olmalıdır (rəsmi olmayan tarix göstərilə bilməz)`);
    }
    if (e.dateStatus !== 'unconfirmed' && !e.date) {
      throw new Error(`${e.id}: status "${e.dateStatus}" üçün date tələb olunur`);
    }
    if (e.timezone !== 'Asia/Baku') throw new Error(`${e.id}: yalnız Asia/Baku dəstəklənir`);
  }
}
