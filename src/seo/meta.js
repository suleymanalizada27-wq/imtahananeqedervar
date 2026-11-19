import { esc } from '../lib/html.js';

/** Tam URL: siteUrl + path ('/' ana səhifə üçün, digərləri sonunda slash-sız). */
export const absoluteUrl = (siteUrl, path) => (path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`);

/**
 * Səhifənin JSON-LD qrafı. Yalnız real məlumatlar:
 *  - Organization yoxdur (real təşkilat məlumatı verilməyib).
 *  - Event yoxdur (rəsmi tarix olmadan imtahan "hadisəsi" uydurulmur).
 */
export function buildJsonLd(page, ctx) {
  const { siteUrl, site } = ctx;
  const url = absoluteUrl(siteUrl, page.path);
  const websiteId = `${siteUrl}/#website`;
  const graph = [];

  graph.push({
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${siteUrl}/`,
    name: site.name,
    inLanguage: site.lang,
  });

  graph.push({
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: site.lang,
    isPartOf: { '@id': websiteId },
    dateModified: site.lastUpdated,
    breadcrumb: { '@id': `${url}#breadcrumb` },
  });

  const crumbs = [{ name: 'Ana səhifə', path: '/' }, ...(page.breadcrumbs || [])];
  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(siteUrl, c.path),
    })),
  });

  if (page.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: page.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.text },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/** <head> içindəki bütün SEO və sosial metadata. */
export function renderHead(page, ctx) {
  const { siteUrl, site, assets } = ctx;
  const url = absoluteUrl(siteUrl, page.path);
  const image = `${siteUrl}/og-image.png`;
  const imageAlt = 'İmtahanaNəQədər? — buraxılış imtahanlarına qalan vaxt';
  const title = esc(page.title);
  const desc = esc(page.description);

  const robots = page.noindex
    ? '<meta name="robots" content="noindex, follow">'
    : '<meta name="robots" content="index, follow, max-image-preview:large">';

  const canonical = page.noindex ? '' : `<link rel="canonical" href="${esc(url)}">`;

  const social = page.noindex
    ? ''
    : `
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="${esc(imageAlt)}">`;

  const jsonLd = page.noindex
    ? ''
    : `<script type="application/ld+json">${JSON.stringify(buildJsonLd(page, ctx)).replaceAll('<', '\\u003c')}</script>`;

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
${robots}
${canonical}
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#F8FAFC" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B1220" media="(prefers-color-scheme: dark)">${social}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script>(function(){var d=document.documentElement,t;try{t=localStorage.getItem('theme')}catch(e){}if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.dataset.theme=t;d.classList.add('js')})()</script>
<link rel="stylesheet" href="${assets.css}">
<noscript><style>.tabs{display:none}[role=tabpanel][hidden]{display:block}.menu-btn{display:none}</style></noscript>
${jsonLd}`;
}

/** sitemap.xml */
export function renderSitemap(pages, ctx) {
  const urls = pages
    .filter((p) => !p.noindex)
    .map(
      (p) =>
        `  <url>\n    <loc>${esc(absoluteUrl(ctx.siteUrl, p.path))}</loc>\n    <lastmod>${ctx.site.lastUpdated}</lastmod>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** robots.txt */
export function renderRobots(ctx) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${ctx.siteUrl}/sitemap.xml\n`;
}
