/**
 * Countdown məntiqi — təmiz funksiyalar, DOM-dan asılı deyil.
 * Həm build (Node), həm brauzer (client bundle) tərəfindən istifadə olunur.
 *
 * Saat qurşağı: Asia/Baku = UTC+4. Azərbaycanda 2016-cı ildən yay saatı yoxdur,
 * buna görə sabit ofset il boyu düzgündür. Hesablama mütləq vaxt fərqinə
 * (target − now) əsaslanır, yəni istifadəçi cihazının qurşağından asılı deyil.
 */

export const BAKU_OFFSET = '+04:00';
const DAY_MS = 86_400_000;

/** 'YYYY-MM-DD' (+ 'HH:MM') Bakı vaxtını UTC millisaniyəyə çevirir. */
export function bakuToMs(dateStr, time = '00:00') {
  return Date.parse(`${dateStr}T${time}:00${BAKU_OFFSET}`);
}

/**
 * Exam məlumatından timeline çıxarır:
 *  - target: imtahanın başlama anı
 *  - end:    imtahan gününün sonu (bu andan sonra "başa çatıb")
 *  - from:   progress hesablamasının başlanğıcı
 * Rəsmi/ilkin tarix yoxdursa null qaytarır.
 */
export function toTimeline(exam, periodStart) {
  if (!exam.date || exam.dateStatus === 'unconfirmed') return null;
  const target = bakuToMs(exam.date, exam.time || '00:00');
  const end = bakuToMs(exam.endDate || exam.date) + DAY_MS;
  const from = periodStart ? bakuToMs(periodStart) : null;
  if (Number.isNaN(target) || Number.isNaN(end)) return null;
  return { target, end: Math.max(end, target + 1), from };
}

/**
 * Verilmiş andakı vəziyyət.
 * kind: 'unknown' | 'counting' | 'today' | 'ended'
 * Heç vaxt mənfi dəyər qaytarmır.
 */
export function getCountdownState(timeline, now) {
  if (!timeline) return { kind: 'unknown', progress: 0 };
  if (now >= timeline.end) return { kind: 'ended', progress: 100 };
  if (now >= timeline.target) return { kind: 'today', progress: 100 };

  const totalSeconds = Math.ceil((timeline.target - now) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let progress = 0;
  if (timeline.from != null && timeline.target > timeline.from) {
    const ratio = (now - timeline.from) / (timeline.target - timeline.from);
    progress = Math.floor(Math.min(1, Math.max(0, ratio)) * 100);
  }
  return { kind: 'counting', days, hours, minutes, seconds, progress };
}

export const pad2 = (n) => String(n).padStart(2, '0');

/** Vəziyyətə uyğun mesaj (boş sətir = göstərmə). */
export function stateMessage(kind, year) {
  if (kind === 'today') return 'İmtahan günü gəldi!';
  if (kind === 'ended') return `${year}-ci il imtahanı artıq başa çatıb.`;
  if (kind === 'unknown') return 'Rəsmi tarix hələ açıqlanmayıb. Tarix məlum olduqda countdown burada görünəcək.';
  return '';
}

/** Progress mətni. */
export function progressMessage(state) {
  if (state.kind === 'counting') return `İmtahan yolunun ${state.progress}%-i geridə qalıb.`;
  if (state.kind === 'today') return 'İmtahan yolunun 100%-i geridə qalıb.';
  if (state.kind === 'ended') return 'İmtahan yolu başa çatıb.';
  return 'Tarix açıqlandıqdan sonra imtahan yolunun faizi burada göstəriləcək.';
}

/** Paylaşım mətni: "2027-ci il buraxılış imtahanına cəmi X gün qalıb! ..." */
export function shareText(state, name, year) {
  const subject = `${year}-ci il ${name} buraxılış imtahanına`;
  if (state.kind === 'counting') {
    let left;
    if (state.days >= 1) left = `${state.days} gün`;
    else if (state.hours >= 1) left = `${state.hours} saat`;
    else left = `${Math.max(1, state.minutes)} dəqiqə`;
    return `${subject} cəmi ${left} qalıb! İmtahanaNəQədər saytında canlı countdown-a bax.`;
  }
  if (state.kind === 'today') return `${year}-ci il ${name} buraxılış imtahanı bu gündür! İmtahanaNəQədər saytına bax.`;
  if (state.kind === 'ended') return `${year}-ci il ${name} buraxılış imtahanı başa çatıb. İmtahanaNəQədər saytına bax.`;
  return `${year}-ci il ${name} buraxılış imtahanı üçün countdown İmtahanaNəQədər saytında hazırdır. Rəsmi tarix elan olunduqda yenilənəcək.`;
}
