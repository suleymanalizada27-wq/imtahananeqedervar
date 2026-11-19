import { esc } from '../lib/html.js';
import { stateMessage, progressMessage } from '../lib/countdown.js';

const UNITS = [
  ['days', 'Gün'],
  ['hours', 'Saat'],
  ['minutes', 'Dəqiqə'],
  ['seconds', 'Saniyə'],
];
const PLACEHOLDER = '––';

/**
 * Countdown bloku. Rəqəmləri brauzerdə JS hər saniyə yeniləyir.
 * Server tərəfdə (build) yalnız placeholder yazılır: köhnəlmiş rəqəm göstərməməkdən ötrü.
 */
export function countdownBlock(view, size = 'lg') {
  const { exam } = view;
  const msg = view.hasDate ? '' : stateMessage('unknown', exam.year);
  const cells = UNITS.map(
    ([key, label]) =>
      `<div class="cd-unit"><span class="cd-num" data-u="${key}">${PLACEHOLDER}</span><span class="cd-lbl">${label}</span></div>`,
  ).join('');
  return `<div class="cd cd-${size}" data-cd="${exam.id}" data-kind="${view.hasDate ? 'pending' : 'unknown'}">
  <div class="cd-grid" role="timer" aria-label="${esc(exam.title)}: qalan vaxt">${cells}</div>
  <p class="cd-msg" data-msg>${msg}</p>
</div>`;
}

/** "İmtahan tarixi" sətri + status nişanı. */
export function dateLine(view) {
  const value = view.hasDate
    ? `<time datetime="${view.exam.date}">${view.dateText}</time>`
    : '<span aria-label="açıqlanmayıb">—</span>';
  return `<p class="date-line"><span class="date-lbl">İmtahan tarixi</span> <strong class="date-val">${value}</strong> <span class="badge badge-${view.status.tone}">${view.status.label}</span></p>`;
}

/** Progress bar (scaleX ilə, layout dəyişdirmir). */
export function progressBlock(view) {
  const { exam } = view;
  const text = progressMessage(view.state);
  return `<div class="prog" data-prog="${exam.id}">
  <div class="bar" role="progressbar" aria-label="${esc(exam.title)}: imtahan yolunun keçilmiş hissəsi" aria-valuemin="0" aria-valuemax="100"><span style="transform:scaleX(0)"></span></div>
  <p class="prog-text" data-prog-text>${view.hasDate ? '' : text}</p>
</div>`;
}

const ICON_SHARE =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
const ICON_CAL =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>';

/** Paylaş + Google Calendar düymələri. */
export function actions(view) {
  const { exam } = view;
  const cal = view.calendarUrl
    ? `<a class="btn" href="${esc(view.calendarUrl)}" target="_blank" rel="noopener">${ICON_CAL}Google Calendar-a əlavə et</a>`
    : `<button type="button" class="btn" disabled title="Tarix açıqlandıqdan sonra aktiv olacaq">${ICON_CAL}Google Calendar-a əlavə et</button>`;
  return `<div class="actions">
  <button type="button" class="btn btn-primary" data-share="${exam.id}">${ICON_SHARE}İmtahana qalan vaxtı paylaş</button>
  ${cal}
  <span class="sr-only" role="status" data-share-status></span>
</div>`;
}

/** Progress hesablamasının izahı. */
export function progressNote(site, formatDateAz) {
  return `<p class="fine center">Faiz ${formatDateAz(site.periodStart)} tarixindən (2026–2027 tədris ilinin başlanğıcı) imtahan gününə qədər olan müddətə görə hesablanır.</p>`;
}
