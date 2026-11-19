# İmtahanaNəQədər? — buraxılış imtahanı countdown saytı

9-cu və 11-ci sinif buraxılış imtahanlarına qalan vaxtı canlı göstərən, Azərbaycan dilində statik sayt.
Asılılıqsızdır: yalnız Node.js (≥18) lazımdır, `npm install` tələb olunmur.

## Texnologiya

- **Statik generasiya**: `scripts/build.mjs` səhifələri HTML-ə çevirir (`dist/`). Bütün SEO səhifələri build zamanı yaradılır.
- **Client JS** (~11 KB, tək fayl): countdown, tablar, tema, menyu, paylaşım. Framework və kitabxana yoxdur.
- **CSS** (~10 KB), sistem şrift yığını (əlavə şrift sorğusu yoxdur), light/dark tema.
- **Lighthouse (lokal, mobil)**: Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100, CLS 0.

## Struktur

```
src/data/exams.js        ← imtahan tarixləri (yeniləmə üçün YEGANƏ yer)
src/data/faq.js          ← FAQ (tarix statusundan avtomatik asılıdır)
src/lib/countdown.js     ← countdown məntiqi (təmiz funksiyalar, Asia/Baku)
src/lib/format.js        ← Azərbaycan dilində tarix formatı, Google Calendar linki
src/seo/meta.js          ← <head>, Open Graph, Twitter, JSON-LD, sitemap, robots
src/components/*         ← header, footer, countdown, kartlar, FAQ, breadcrumb
src/pages/*              ← 5 SEO səhifəsi + 404 (hər birinin ayrı məzmunu)
src/client/app.js        ← brauzer kodu
src/styles/main.css
public/                  ← favicon, apple-touch-icon, og-image.png (build-ə kopyalanır)
design/                  ← favicon və OG şəklinin SVG mənbələri (scripts/make-icons.sh)
scripts/                 ← build.mjs, check.mjs (SEO yoxlaması), serve.mjs (lokal server)
tests/                   ← countdown və data testləri
netlify.toml             ← build, publish, header-lər
```

## İmtahan tarixini yeniləmək

`src/data/exams.js` faylında müvafiq imtahanı tapın:

```js
date: '2027-06-20',          // YYYY-MM-DD, Bakı vaxtı
dateStatus: 'official',      // 'official' | 'preliminary' | 'unconfirmed'
officialSource: 'https://dim.gov.az/...',   // elanın dəqiq linki (ixtiyari)
// time: '11:00',            // ixtiyari başlama saatı (yoxdursa 00:00)
// endDate: '2027-06-21',    // ixtiyari: bir neçə günlük imtahan
```

Eyni faylda `SITE.lastUpdated` tarixini də dəyişin, sonra commit/push edin. Netlify yenidən build edəcək.

Qaydalar (build zamanı yoxlanılır, pozulsa build dayanır):

- `unconfirmed` statusunda `date` `null` olmalıdır. Rəsmi olmayan tarix göstərilmir.
- `official`/`preliminary` üçün `date` tələb olunur. `preliminary` tarix saytda "İlkin tarix" kimi ayrıca işarələnir.

Tarix elan olunmayıbsa countdown gözləmə rejimində qalır, progress bar və təqvim düyməsi aktiv olmur.

## Əmrlər

```bash
npm run build     # dist/ yaradır
npm test          # countdown və data testləri
npm run check     # dist/ üçün SEO yoxlaması (title, description, canonical, H1, schema, sitemap, robots, daxili linklər)
npm run verify    # üçü birlikdə
npm run dev       # build + lokal server (http://localhost:8080)
```

## Netlify deployment

1. Layihəni GitHub/GitLab-a push edin.
2. Netlify → **Add new site → Import an existing project** → repozitoriyanı seçin.
3. Ayarlar `netlify.toml`-dan oxunur: **Build command** `npm run build`, **Publish directory** `dist`, Node 20. Əlavə heç nə lazım deyil.
4. Deploy bitdikdən sonra sayt `https://<sayt-adı>.netlify.app` ünvanında açılır. Site name-i `imtahananeqedervar` seçsəniz, canonical və sitemap linkləri defolt ünvanla üst-üstə düşür.

Düz (drag & drop) deploy üçün: lokal `npm run build` edin və `dist/` qovluğunu Netlify-ə sürükləyin.

### Custom domen qoşmaq

1. Netlify → **Domain management → Add a domain**, DNS qeydlərini göstərilən qaydada yeniləyin (HTTPS/Let's Encrypt avtomatik aktivləşir).
2. **Site configuration → Environment variables** bölməsində `SITE_URL=https://sizin-domen.az` əlavə edin və yenidən deploy edin. Canonical, Open Graph, sitemap, robots və schema linkləri avtomatik yenilənir.
3. Netlify-də `*.netlify.app` ünvanını custom domenə yönləndirmək üçün **Primary domain** olaraq custom domeni seçin.

### URL-lər və yönləndirmələr

Səhifələr `/səhifə.html` kimi yaradılır, `dist/_redirects` isə onları təmiz URL-lərlə (`/səhifə`) açır; `/səhifə/` → `/səhifə` (301). Fayl build zamanı avtomatik yazılır. Tapılmayan ünvanlar `404.html` göstərir (HTTP 404).

### Google Search Console

Deploy-dan sonra domeni Search Console-a əlavə edin və `https://<domen>/sitemap.xml` ünvanını göndərin.

## SEO qeydləri

- Hər səhifənin unikal title, description, H1, canonical, Open Graph və Twitter metadata-sı var.
- Schema: `WebSite`, `WebPage`, `BreadcrumbList` (bütün səhifələr), `FAQPage` (ana səhifə). `Organization` və `Event` schema əlavə **edilməyib**: real təşkilat məlumatı yoxdur və rəsmi tarix olmadan imtahan "hadisəsi" uydurmaq olmaz.
- FAQ schema Google-un FAQ rich result göstərəcəyinə zəmanət vermir.
- `og-image.png` və ikonlar `design/` qovluğundakı SVG-lərdən yaradılıb (`scripts/make-icons.sh`).
