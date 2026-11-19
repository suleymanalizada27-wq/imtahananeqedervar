/**
 * Statik generator — asılılıqsız (yalnız Node ≥18).
 * İstifadə: node scripts/build.mjs   →   dist/
 *
 * Mühit dəyişənləri:
 *   SITE_URL   Sayt ünvanı (default: SITE.defaultUrl). Custom domen üçün dəyişin.
 */
import { mkdir, rm, writeFile, readFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { SITE, EXAMS, validateExams } from '../src/data/exams.js';
import { examView, formatDateAz } from '../src/lib/format.js';
import { layout } from '../src/components/layout.js';
import { renderSitemap, renderRobots } from '../src/seo/meta.js';
import { homePage } from '../src/pages/home.js';
import { graduationPage } from '../src/pages/graduation.js';
import { grade9Page } from '../src/pages/grade-9.js';
import { grade11Page } from '../src/pages/grade-11.js';
import { datesPage } from '../src/pages/dates.js';
import { notFoundPage } from '../src/pages/not-found.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);

/** Sadə, təhlükəsiz CSS minifikasiyası (şərhlər + artıq boşluqlar). */
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

/** countdown.js + app.js → tək IIFE (import/export sətirlərini çıxarmaqla). */
function bundleClient(libSrc, appSrc) {
  const lib = libSrc.replace(/^export\s+/gm, '');
  const app = appSrc.replace(/^import\s[^;]+;\s*$/gm, '');
  return `(()=>{\n'use strict';\n${lib}\n${app}\n})();\n`;
}

async function main() {
  validateExams();

  const siteUrl = (process.env.SITE_URL || SITE.defaultUrl).replace(/\/+$/, '');
  if (!/^https?:\/\//.test(siteUrl)) throw new Error(`SITE_URL yanlışdır: ${siteUrl}`);

  await rm(DIST, { recursive: true, force: true });
  await mkdir(path.join(DIST, 'assets'), { recursive: true });

  // --- Assets (hash-li fayl adları → immutable keş) ---
  const css = minifyCss(await readFile(path.join(SRC, 'styles/main.css'), 'utf8'));
  const cssName = `main.${hash(css)}.css`;
  await writeFile(path.join(DIST, 'assets', cssName), css);

  const js = bundleClient(
    await readFile(path.join(SRC, 'lib/countdown.js'), 'utf8'),
    await readFile(path.join(SRC, 'client/app.js'), 'utf8'),
  );
  const jsName = `app.${hash(js)}.js`;
  await writeFile(path.join(DIST, 'assets', jsName), js);

  await cp(path.join(ROOT, 'public'), DIST, { recursive: true });

  // --- Səhifələr ---
  const now = Date.now();
  const views = Object.fromEntries(EXAMS.map((e) => [e.id, examView(e, SITE, now)]));
  const ctx = {
    site: SITE,
    siteUrl,
    views,
    lastUpdatedText: formatDateAz(SITE.lastUpdated),
    assets: { css: `/assets/${cssName}`, js: `/assets/${jsName}` },
  };

  const pages = [
    homePage(ctx),
    graduationPage(ctx),
    grade9Page(ctx),
    grade11Page(ctx),
    datesPage(ctx),
  ];
  const notFound = notFoundPage(ctx);

  const redirects = [];
  for (const page of [...pages, notFound]) {
    const html = layout(page, page.main, ctx);
    const file = page.file || (page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`);
    await writeFile(path.join(DIST, file), html);

    if (!page.file && page.path !== '/') {
      // /səhifə/ → /səhifə (301); /səhifə → səhifə.html (rewrite, 200)
      redirects.push(`${page.path}/  ${page.path}  301`);
      redirects.push(`${page.path}  ${page.path}.html  200`);
    }
  }

  await writeFile(path.join(DIST, 'sitemap.xml'), renderSitemap(pages, ctx));
  await writeFile(path.join(DIST, 'robots.txt'), renderRobots(ctx));
  await writeFile(path.join(DIST, '_redirects'), `${redirects.join('\n')}\n`);

  // --- Qısa hesabat ---
  console.log(`Build OK → dist/  (${pages.length} səhifə + 404)  SITE_URL=${siteUrl}`);
  for (const p of pages) {
    console.log(
      `  ${p.path.padEnd(40)} title=${p.title.length}  description=${p.description.length}`,
    );
  }
}

main().catch((err) => {
  console.error('Build xətası:', err.message);
  process.exit(1);
});
