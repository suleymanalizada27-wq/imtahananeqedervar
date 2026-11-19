/** HTML atributları və mətn üçün qaçış (escaping). */
export const esc = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

/** Mətnin HTML teqlərini silib düz mətn verir (schema və meta üçün). */
export const stripTags = (html) =>
  html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
