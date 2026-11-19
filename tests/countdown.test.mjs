import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bakuToMs, toTimeline, getCountdownState, shareText, stateMessage } from '../src/lib/countdown.js';
import { validateExams } from '../src/data/exams.js';
import { formatDateAz } from '../src/lib/format.js';

const exam = (over = {}) => ({
  id: 'x', title: 't', year: 2027, date: '2027-06-20', dateStatus: 'official',
  timezone: 'Asia/Baku', officialSource: 'https://dim.gov.az', ...over,
});
const PERIOD = '2026-09-15';

test('Bakı vaxtı UTC+4 kimi hesablanır', () => {
  assert.equal(bakuToMs('2027-06-20', '00:00'), Date.UTC(2027, 5, 19, 20, 0, 0));
  assert.equal(bakuToMs('2027-06-20', '11:00'), Date.UTC(2027, 5, 20, 7, 0, 0));
});

test('tarix yoxdursa və ya təsdiqlənməyibsə timeline null-dur', () => {
  assert.equal(toTimeline(exam({ date: null, dateStatus: 'unconfirmed' }), PERIOD), null);
  assert.equal(toTimeline(exam({ dateStatus: 'unconfirmed' }), PERIOD), null);
  assert.equal(getCountdownState(null, Date.now()).kind, 'unknown');
});

test('gələcək tarix: gün/saat/dəqiqə/saniyə düzgündür', () => {
  const t = toTimeline(exam(), PERIOD);
  const now = t.target - (137 * 86400 + 8 * 3600 + 42 * 60 + 19) * 1000;
  const s = getCountdownState(t, now);
  assert.deepEqual([s.kind, s.days, s.hours, s.minutes, s.seconds], ['counting', 137, 8, 42, 19]);
});

test('saniyənin kəsr hissəsi yuxarı yuvarlaqlaşır (00:00:00:00 yalnız hədəfdə)', () => {
  const t = toTimeline(exam(), PERIOD);
  const s = getCountdownState(t, t.target - 400);
  assert.equal(s.kind, 'counting');
  assert.deepEqual([s.days, s.hours, s.minutes, s.seconds], [0, 0, 0, 1]);
});

test('imtahan günü: "today", sonra "ended"; mənfi dəyər heç vaxt yoxdur', () => {
  const t = toTimeline(exam(), PERIOD);
  assert.equal(getCountdownState(t, t.target).kind, 'today');
  assert.equal(getCountdownState(t, t.target + 3600_000).kind, 'today');
  assert.equal(getCountdownState(t, t.end).kind, 'ended');
  const after = getCountdownState(t, t.end + 400 * 86400_000);
  assert.equal(after.kind, 'ended');
  assert.equal(after.days, undefined);
  assert.equal(stateMessage('today', 2027), 'İmtahan günü gəldi!');
  assert.equal(stateMessage('ended', 2027), '2027-ci il imtahanı artıq başa çatıb.');
});

test('keçmişdəki tarix mənfi countdown vermir', () => {
  const t = toTimeline(exam({ date: '2020-01-01' }), PERIOD);
  const s = getCountdownState(t, Date.now());
  assert.equal(s.kind, 'ended');
});

test('çoxgünlük imtahan: endDate gününün sonuna qədər "today"', () => {
  const t = toTimeline(exam({ date: '2027-06-20', endDate: '2027-06-21' }), PERIOD);
  assert.equal(getCountdownState(t, bakuToMs('2027-06-21', '23:59')).kind, 'today');
  assert.equal(getCountdownState(t, bakuToMs('2027-06-22', '00:00')).kind, 'ended');
});

test('progress: 0–100 aralığında və monoton', () => {
  const t = toTimeline(exam(), PERIOD);
  assert.equal(getCountdownState(t, t.from - 1e9).progress, 0); // tədris ilindən əvvəl
  const mid = t.from + (t.target - t.from) / 2;
  assert.equal(getCountdownState(t, mid).progress, 50);
  const late = getCountdownState(t, t.target - 1000).progress;
  assert.ok(late >= 99 && late <= 100);
  assert.equal(getCountdownState(t, t.target).progress, 100);
});

test('hədəf tarixi hələ də saat qurşağından asılı deyil (DST yoxdur)', () => {
  // Yay və qış üçün eyni ofset
  assert.equal(bakuToMs('2027-01-15') % 3600_000, 0);
  assert.equal(bakuToMs('2027-07-15') - Date.UTC(2027, 6, 14, 20), 0);
  assert.equal(bakuToMs('2027-01-15') - Date.UTC(2027, 0, 14, 20), 0);
});

test('paylaşım mətni', () => {
  const t = toTimeline(exam(), PERIOD);
  const s = getCountdownState(t, t.target - 137.5 * 86400_000);
  assert.match(shareText(s, '11-ci sinif', 2027), /^2027-ci il 11-ci sinif buraxılış imtahanına cəmi 137 gün qalıb!/);
  assert.match(shareText({ kind: 'unknown' }, '9-cu sinif', 2027), /Rəsmi tarix elan olunduqda/);
});

test('tarix Azərbaycan dilində formatlanır', () => {
  assert.equal(formatDateAz('2027-03-09'), '9 mart 2027');
  assert.equal(formatDateAz('2027-04-05'), '5 aprel 2027');
  assert.equal(formatDateAz('2026-09-15'), '15 sentyabr 2026');
});

test('data validasiyası rəsmi olmayan tarixi rədd edir', () => {
  assert.throws(() => validateExams([exam({ dateStatus: 'unconfirmed' })]), /unconfirmed/);
  assert.throws(() => validateExams([exam({ date: null })]), /date tələb olunur/);
  assert.throws(() => validateExams([exam({ date: '09.03.2027' })]), /YYYY-MM-DD/);
  assert.doesNotThrow(() => validateExams([exam({ date: null, dateStatus: 'unconfirmed' })]));
  assert.doesNotThrow(() => validateExams([exam({ dateStatus: 'preliminary' })]));
});
