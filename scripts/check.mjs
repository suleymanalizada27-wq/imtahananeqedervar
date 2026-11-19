/**
 * dist/ üçün SEO və bütövlük yoxlaması. İstifadə: node scripts/check.mjs (build-dən sonra)
 * Xəta tapılsa çıxış kodu 1 olur.
 */
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PAGES = [
  ['/', 'index.html'],
  ['/buraxilis-imtahani-2027', 'buraxilis-imtahani-2027.html'],
  ['/9-cu-sinif-buraxilis-imtahani-2027', '9-cu-sinif-buraxilis-imtahani-2027.html'],
  ['/11-ci-sinif-buraxilis-imtahani-2027', '11-ci-sinif-buraxilis-imtahani-2027.html'],
  ['/dim-imtahan-tarixleri-2027', 'dim-imtahan-tarixleri-2027.html'],
];

const errors = [];
const warns = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);
const exists = (p) => access(p).then(() => true, () => false);
const attr = (html, re) => html.match(re)?.[1];

const titles = new Set();
const descs = new Set();
let siteUrl = null;

for (const [route, file] of PAGES) {
  const html = await readFile(path.join(DIST, file), 'utf8');

  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);

  if (!title) fail(route, 'title yoxdur');
  if (!desc) fail(route, 'meta description yoxdur');
  if (!canonical) fail(route, 'canonical yoxdur');
  if (title && titles.has(title)) fail(route, 'title təkrarlanır');
  if (desc && descs.has(desc)) fail(route, 'description təkrarlanır');
  titles.add(title);
  descs.add(desc);

  if (desc && (desc.length < 140 || desc.length > 165)) warns.push(`${route}: description uzunluğu ${desc.length}`);

  // Canonical: ana səhifə '/' ilə, qalanları səhifə yolu ilə bitməlidir
  if (canonical) {
    siteUrl ??= canonical.replace(/\/$/, '').replace(/\/[^/]*$/, '') && new URL(canonical).origin;
    const expected = route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`;
    if (canonical !== expected) fail(route, `canonical ${canonical} ≠ ${expected}`);
  }

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(route, `H1 sayı ${h1s.length} (1 olmalıdır)`);
  if (!/<h2[\s>]/.test(html)) fail(route, 'H2 yoxdur');
  if (!/<html lang="az"/.test(html)) fail(route, 'html lang="az" yoxdur');

  for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:locale']) {
    if (!html.includes(`property="${prop}"`)) fail(route, `${prop} yoxdur`);
  }
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    if (!html.includes(`name="${name}"`)) fail(route, `${name} yoxdur`);
  }

  // JSON-LD
  const ld = attr(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) {
    fail(route, 'JSON-LD yoxdur');
  } else {
    try {
      const graph = JSON.parse(ld)['@graph'];
      const types = graph.map((n) => n['@type']);
      for (const t of ['WebPage', 'BreadcrumbList']) if (!types.includes(t)) fail(route, `schema ${t} yoxdur`);
      if (route === '/' && !types.includes('WebSite')) fail(route, 'WebSite schema yoxdur');
      if (route === '/' && !types.includes('FAQPage')) fail(route, 'FAQPage schema yoxdur');
      if (types.includes('Organization')) fail(route, 'Organization schema olmamalıdır (real təşkilat məlumatı yoxdur)');
      if (types.includes('Event')) fail(route, 'Event schema olmamalıdır');
    } catch (e) {
      fail(route, `JSON-LD parse xətası: ${e.message}`);
    }
  }

  // Daxili linklər mövcud olmalıdır
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  for (const href of new Set(hrefs)) {
    const target =
      href === '/' ? 'index.html' : href.startsWith('/assets/') || /\.[a-z0-9]+$/i.test(href) ? href.slice(1) : `${href.slice(1)}.html`;
    if (!(await exists(path.join(DIST, target)))) fail(route, `sınıq daxili link: ${href}`);
  }

  // Şəkillərdə alt (hazırda <img> yoxdur; gələcək üçün qoruyucu)
  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\balt=/.test(img)) fail(route, `<img> alt-sız: ${img.slice(0, 60)}`);
  }

  // Rəsmi olmayan tarixin "rəsmi" kimi görünməməsi: unconfirmed ikən heç bir datetime olmamalı
  if (html.includes('badge-unconfirmed') && /<time datetime="20\d\d-\d\d-\d\d">(?!.*son)/.test(html.replace(/Məlumat son[^<]*<time[^>]*>[^<]*<\/time>/g, ''))) {
    // son yenilənmə <time> elementi istisnadır (yuxarıda silinir); qalan datetime tarixləri imtahan tarixidir
    const exam = html.replace(/Məlumat son[^<]*<time[^>]*>[^<]*<\/time>/g, '').replace(/Son yenilənmə:[^<]*<time[^>]*>[^<]*<\/time>/g, '');
    if (/<time datetime="20\d\d-\d\d-\d\d">/.test(exam) && html.includes('Tarix hələ açıqlanmayıb') && !html.includes('Rəsmi tarix</span>') && !html.includes('İlkin tarix</span>')) {
      fail(route, 'status "açıqlanmayıb" ikən imtahan tarixi göstərilir');
    }
  }
}

// 404
const nf = await readFile(path.join(DIST, '404.html'), 'utf8');
if (!/noindex/.test(nf)) fail('404', 'noindex yoxdur');

// sitemap.xml
const sitemap = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const [route] of PAGES) {
  const expected = route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`;
  if (!locs.includes(expected)) fail('sitemap', `${expected} yoxdur`);
}
if (locs.length !== PAGES.length) fail('sitemap', `URL sayı ${locs.length}, gözlənilən ${PAGES.length}`);
if (locs.some((l) => l.includes('404'))) fail('sitemap', '404 sitemap-də olmamalıdır');

// robots.txt
const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) fail('robots', 'Sitemap sətri yoxdur / yanlışdır');
if (/Disallow:\s*\/\s*$/m.test(robots)) fail('robots', 'bütün sayt bloklanıb');

// Statik fayllar
for (const f of ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'og-image.png', '_redirects']) {
  if (!(await exists(path.join(DIST, f)))) fail('dist', `${f} yoxdur`);
}

// _redirects: hər səhifə üçün rewrite
const redirects = await readFile(path.join(DIST, '_redirects'), 'utf8');
for (const [route] of PAGES.filter(([r]) => r !== '/')) {
  if (!redirects.includes(`${route}  ${route}.html  200`)) fail('_redirects', `${route} üçün rewrite yoxdur`);
}

for (const w of warns) console.warn(`⚠ ${w}`);
if (errors.length) {
  console.error(`\n✗ ${errors.length} xəta:\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✓ SEO yoxlaması keçdi (${PAGES.length} səhifə, sitemap, robots, schema, canonical, daxili linklər)`);
