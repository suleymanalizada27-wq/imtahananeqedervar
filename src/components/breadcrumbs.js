import { esc } from '../lib/html.js';

/** Görünən breadcrumb (schema ilə eyni data). Son element cari səhifədir. */
export function breadcrumbs(items) {
  const all = [{ name: 'Ana səhifə', path: '/' }, ...items];
  const lis = all
    .map((c, i) =>
      i === all.length - 1
        ? `<li aria-current="page">${esc(c.name)}</li>`
        : `<li><a href="${c.path}">${esc(c.name)}</a></li>`,
    )
    .join('');
  return `<nav class="crumbs" aria-label="Səhifə yolu"><ol>${lis}</ol></nav>`;
}
