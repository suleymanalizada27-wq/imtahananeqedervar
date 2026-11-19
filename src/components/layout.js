import { renderHead } from '../seo/meta.js';
import { header } from './header.js';
import { footer } from './footer.js';
import { formatDateAz } from '../lib/format.js';

/**
 * Səhifənin tam HTML sənədi.
 * @param page  { path, title, description, breadcrumbs?, faq?, noindex?, exams?: views[] }
 * @param main  <main> daxilindəki HTML
 * @param ctx   { siteUrl, site, assets }
 */
export function layout(page, main, ctx) {
  // Client JS-ə yalnız lazım olan minimal məlumat ötürülür.
  let clientData = '';
  if (page.exams?.length) {
    const data = {};
    for (const v of page.exams) {
      data[v.exam.id] = {
        t: v.timeline,
        y: v.exam.year,
        n: v.exam.shortTitle,
      };
    }
    clientData = `<script type="application/json" id="exam-data">${JSON.stringify(data)}</script>\n`;
  }

  return `<!doctype html>
<html lang="${ctx.site.lang}">
<head>
${renderHead(page, ctx)}
</head>
<body>
<a class="skip" href="#main">Məzmuna keç</a>
${header(ctx)}
<main id="main">
${main}
</main>
${footer(ctx, formatDateAz(ctx.site.lastUpdated))}
${clientData}<script src="${ctx.assets.js}" defer></script>
</body>
</html>
`;
}
