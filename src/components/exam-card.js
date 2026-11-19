import { countdownBlock, dateLine } from './countdown.js';

/** Hero-dan aşağıdakı imtahan kartı (kiçik countdown ilə). */
export function examCard(view) {
  const { exam } = view;
  return `<article class="card" aria-labelledby="card-${exam.id}">
  <h3 id="card-${exam.id}">${exam.title}</h3>
  ${dateLine(view)}
  ${countdownBlock(view, 'sm')}
  <a class="btn btn-block" href="/${exam.slug}">İmtahana bax</a>
</article>`;
}

export function examCards(views) {
  return `<div class="grid">${views.map(examCard).join('\n')}</div>`;
}
