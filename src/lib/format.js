import { STATUS } from '../data/exams.js';
import { toTimeline, getCountdownState, bakuToMs } from './countdown.js';

const MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr',
];

/** '2027-03-09' → '9 mart 2027'. Intl-dən asılı deyil (deterministik). */
export function formatDateAz(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** '2027-03-09' → '9 mart' (illik qısa forma). */
export function formatDayMonthAz(iso) {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

/** Cümlə əvvəlində böyük hərf (Azərbaycan hərfləri üçün düzgün). */
export const capitalize = (s) => s.charAt(0).toLocaleUpperCase('az') + s.slice(1);

/** Gün əlavə et, 'YYYYMMDD' qaytar (Google Calendar all-day end üçün). */
function nextDayCompact(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replaceAll('-', '');
}

/**
 * Bir imtahan üçün şablonlarda lazım olan bütün hazır dəyərlər.
 * @param exam   data/exams.js-dən imtahan
 * @param site   SITE obyekti
 * @param now    build anı (yalnız statusu müəyyən etmək üçün; countdown özü brauzerdə hesablanır)
 */
export function examView(exam, site, now = Date.now()) {
  const timeline = toTimeline(exam, site.periodStart);
  const hasDate = Boolean(timeline);
  const status = STATUS[exam.dateStatus];
  const dateText = hasDate ? formatDateAz(exam.date) : null;
  const state = getCountdownState(timeline, now);

  let calendarUrl = null;
  if (hasDate) {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${exam.year}-ci il ${exam.title}${exam.dateStatus === 'preliminary' ? ' (ilkin tarix)' : ''}`,
      dates: `${exam.date.replaceAll('-', '')}/${nextDayCompact(exam.endDate || exam.date)}`,
      details: `Rəsmi məlumat üçün: ${exam.officialSource}\nCountdown: İmtahanaNəQədər`,
      ctz: exam.timezone,
    });
    calendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  return { exam, timeline, hasDate, status, dateText, state, calendarUrl, startMs: hasDate ? bakuToMs(exam.date) : null };
}

/** Bir imtahanın tarix vəziyyətini bir cümlə ilə izah edir (SEO mətni və FAQ üçün). */
export function examDateSentence(view) {
  const title = capitalize(view.exam.title);
  if (!view.hasDate) return `${title} üçün rəsmi tarix hələ açıqlanmayıb.`;
  if (view.exam.dateStatus === 'official') return `${title} ${view.dateText} tarixində keçiriləcək (rəsmi tarix).`;
  return `${title} üçün ilkin tarix ${view.dateText} göstərilib; bu tarix hələ rəsmi təsdiqlənməyib.`;
}
