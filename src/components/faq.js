import { esc } from '../lib/html.js';

/** Native <details> accordion: JS tələb etmir, klaviatura və screen reader ilə işləyir. */
export function faqList(items) {
  return `<div class="faq">${items
    .map(
      (i) => `<details>
  <summary>${esc(i.q)}</summary>
  <div class="faq-a"><p>${i.a}</p></div>
</details>`,
    )
    .join('\n')}</div>`;
}
