/**
 * Client JS: countdown, tablar, tema, menyu, paylaşım.
 * Build zamanı lib/countdown.js ilə birləşdirilib tək faylda təqdim olunur (asılılıq yoxdur).
 */
import { getCountdownState, pad2, stateMessage, progressMessage, shareText } from '../lib/countdown.js';

const dataEl = document.getElementById('exam-data');
const EXAMS = dataEl ? JSON.parse(dataEl.textContent) : {};

/* ---------- Countdown ---------- */

const countdowns = [...document.querySelectorAll('[data-cd]')].map((root) => ({
  root,
  id: root.dataset.cd,
  msg: root.querySelector('[data-msg]'),
  nums: {
    days: root.querySelector('[data-u="days"]'),
    hours: root.querySelector('[data-u="hours"]'),
    minutes: root.querySelector('[data-u="minutes"]'),
    seconds: root.querySelector('[data-u="seconds"]'),
  },
  tickFlip: false,
}));

const progressBars = [...document.querySelectorAll('[data-prog]')].map((root) => ({
  id: root.dataset.prog,
  bar: root.querySelector('.bar'),
  fill: root.querySelector('.bar span'),
  text: root.querySelector('[data-prog-text]'),
  last: -1,
}));

function setText(el, value) {
  if (el && el.textContent !== value) el.textContent = value;
}

function stateFor(id, now) {
  return getCountdownState(EXAMS[id] ? EXAMS[id].t : null, now);
}

function render(now) {
  let live = false;
  const cache = {};

  for (const cd of countdowns) {
    const state = cache[cd.id] || (cache[cd.id] = stateFor(cd.id, now));
    const year = EXAMS[cd.id] ? EXAMS[cd.id].y : '';
    cd.root.dataset.kind = state.kind;

    if (state.kind === 'counting') {
      live = true;
      setText(cd.nums.days, pad2(state.days));
      setText(cd.nums.hours, pad2(state.hours));
      setText(cd.nums.minutes, pad2(state.minutes));
      const before = cd.nums.seconds.textContent;
      setText(cd.nums.seconds, pad2(state.seconds));
      if (before !== cd.nums.seconds.textContent) {
        // İki fərqli animasiya adı növbələnir: reflow tələb etmədən yüngül "tik" effekti
        cd.tickFlip = !cd.tickFlip;
        cd.nums.seconds.className = cd.tickFlip ? 'cd-num ta' : 'cd-num tb';
      }
    } else if (state.kind === 'today' || state.kind === 'ended') {
      if (state.kind === 'today') live = true; // gün bitəndə "ended"-ə keçid üçün
      for (const key of ['days', 'hours', 'minutes', 'seconds']) setText(cd.nums[key], '00');
    }
    setText(cd.msg, stateMessage(state.kind, year));
  }

  for (const p of progressBars) {
    const state = cache[p.id] || (cache[p.id] = stateFor(p.id, now));
    const key = state.kind === 'unknown' ? -1 : state.progress;
    if (key !== p.last) {
      p.last = key;
      p.fill.style.transform = `scaleX(${Math.max(0, key) / 100})`;
      if (key >= 0) p.bar.setAttribute('aria-valuenow', String(key));
      else p.bar.removeAttribute('aria-valuenow');
    }
    setText(p.text, progressMessage(state));
  }
  return live;
}

let timer = 0;
function tick() {
  const now = Date.now();
  const live = render(now);
  // Yalnız canlı countdown varsa yenidən planlaşdır; saniyənin başlanğıcına hizala.
  timer = live ? setTimeout(tick, 1000 - (now % 1000) + 8) : 0;
}

function stop() {
  clearTimeout(timer);
  timer = 0;
}

if (countdowns.length) {
  tick();
  document.addEventListener('visibilitychange', () => {
    stop();
    if (!document.hidden) tick();
  });
  addEventListener('pagehide', stop);
}

/* ---------- İmtahan tabları ---------- */

const tabs = [...document.querySelectorAll('[role="tab"]')];

function selectTab(tab, focus) {
  for (const t of tabs) {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    if (panel) panel.hidden = !selected;
  }
  if (focus) tab.focus();
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab, false));
  tab.addEventListener('keydown', (e) => {
    let next = null;
    if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (next) {
      e.preventDefault();
      selectTab(next, true);
    }
  });
});

/* ---------- Tema ---------- */

const root = document.documentElement;
const themeBtn = document.querySelector('[data-theme-toggle]');

function syncThemeLabel() {
  if (!themeBtn) return;
  const dark = root.dataset.theme === 'dark';
  themeBtn.setAttribute('aria-label', dark ? 'İşıqlı rejimə keç' : 'Qaranlıq rejimə keç');
}

if (themeBtn) {
  syncThemeLabel();
  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* private mode və s. — seçim yalnız bu sessiya üçün qalır */
    }
    syncThemeLabel();
  });
}

/* ---------- Mobil menyu ---------- */

const menuBtn = document.querySelector('[data-menu-toggle]');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Menyunu bağla' : 'Menyunu aç');
}

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setMenu(false);
      menuBtn.focus();
    }
  });
}

/* ---------- Paylaşım ---------- */

function pageUrl() {
  const canonical = document.querySelector('link[rel="canonical"]');
  return canonical ? canonical.href : location.href;
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:-100px;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  ta.remove();
  if (!ok) throw new Error('copy failed');
}

function flash(btn, message) {
  const label = btn.lastChild; // düymənin mətn node-u (ikondan sonra)
  const original = label.textContent;
  label.textContent = message;
  const status = btn.parentElement.querySelector('[data-share-status]');
  if (status) status.textContent = message;
  setTimeout(() => {
    label.textContent = original;
    if (status) status.textContent = '';
  }, 2200);
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-share]');
  if (!btn) return;
  const exam = EXAMS[btn.dataset.share];
  if (!exam) return;

  const text = shareText(stateFor(btn.dataset.share, Date.now()), exam.n, exam.y);
  const url = pageUrl();

  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text, url });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return; // istifadəçi özü bağladı
    }
  }
  try {
    await copyToClipboard(`${text} ${url}`);
    flash(btn, 'Link kopyalandı');
  } catch (err) {
    flash(btn, 'Kopyalamaq alınmadı');
  }
});
