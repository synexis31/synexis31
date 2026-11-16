/**
 * Bengali number-to-words for text-to-speech.
 * Used in SA SYNEXIS newsroom workflows so AI voices read numbers naturally
 * (e.g. 2026 → "দুই হাজার ছাব্বিশ", 1971 সাল → "উনিশশো একাত্তর", 3.5 → "সাড়ে তিন").
 * Works in n8n Code nodes, Make.com Code modules and Node.js.
 */
const BN = 'শূন্য এক দুই তিন চার পাঁচ ছয় সাত আট নয় দশ এগারো বারো তেরো চৌদ্দ পনেরো ষোলো সতেরো আঠারো উনিশ বিশ একুশ বাইশ তেইশ চব্বিশ পঁচিশ ছাব্বিশ সাতাশ আটাশ ঊনত্রিশ ত্রিশ একত্রিশ বত্রিশ তেত্রিশ চৌত্রিশ পঁয়ত্রিশ ছত্রিশ সাঁইত্রিশ আটত্রিশ ঊনচল্লিশ চল্লিশ একচল্লিশ বিয়াল্লিশ তেতাল্লিশ চুয়াল্লিশ পঁয়তাল্লিশ ছেচল্লিশ সাতচল্লিশ আটচল্লিশ ঊনপঞ্চাশ পঞ্চাশ একান্ন বাহান্ন তিপ্পান্ন চুয়ান্ন পঞ্চান্ন ছাপ্পান্ন সাতান্ন আটান্ন ঊনষাট ষাট একষট্টি বাষট্টি তেষট্টি চৌষট্টি পঁয়ষট্টি ছেষট্টি সাতষট্টি আটষট্টি ঊনসত্তর সত্তর একাত্তর বাহাত্তর তিয়াত্তর চুয়াত্তর পঁচাত্তর ছিয়াত্তর সাতাত্তর আটাত্তর ঊনআশি আশি একাশি বিরাশি তিরাশি চুরাশি পঁচাশি ছিয়াশি সাতাশি অষ্টাশি ঊননব্বই নব্বই একানব্বই বিরানব্বই তিরানব্বই চুরানব্বই পঁচানব্বই ছিয়ানব্বই সাতানব্বই আটানব্বই নিরানব্বই'.split(' ');

/** Bengali digits (০-৯) → ASCII digits */
const toAscii = (s) => String(s).replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));

/** Whole number → Bengali words (supports হাজার, লাখ, কোটি) */
function intWords(n) {
  n = Math.floor(Number(n) || 0);
  if (n < 100) return BN[n];
  const parts = [];
  const take = (unit, name) => { const q = Math.floor(n / unit); if (q) { parts.push(intWords(q) + ' ' + name); n %= unit; } };
  take(10000000, 'কোটি'); take(100000, 'লাখ'); take(1000, 'হাজার');
  const h = Math.floor(n / 100); if (h) { parts.push(BN[h] + 'শো'); n %= 100; }
  if (n) parts.push(BN[n]);
  return parts.join(' ');
}

/** Any number string (Bengali or ASCII digits, commas, decimals) → spoken Bengali */
function numWords(raw) {
  const [i, d] = toAscii(raw).replace(/,/g, '').split('.');
  const whole = Number(i) || 0;
  if (d === '5' && whole > 0) return 'সাড়ে ' + intWords(whole);
  if (d === '25' && whole > 0) return 'সোয়া ' + intWords(whole);
  if (d === '75') return 'পৌনে ' + intWords(whole + 1);
  let w = intWords(whole);
  if (d) w += ' দশমিক ' + d.split('').map((x) => BN[Number(x)]).join(' ');
  return w;
}

/** Years 1100–1999 are read the traditional way: 1971 → "উনিশশো একাত্তর" */
function yearWords(raw) {
  const n = Number(toAscii(raw));
  return n >= 1100 && n <= 1999 ? BN[Math.floor(n / 100)] + 'শো' + (n % 100 ? ' ' + BN[n % 100] : '') : intWords(n);
}

module.exports = { intWords, numWords, yearWords, toAscii };

// Quick self-test: node bengali-number-words.js
if (require.main === module) {
  const assert = require('assert');
  assert.strictEqual(intWords(2026), 'দুই হাজার ছাব্বিশ');
  assert.strictEqual(numWords('১,২৫০'), 'এক হাজার দুইশো পঞ্চাশ');
  assert.strictEqual(numWords('3.5'), 'সাড়ে তিন');
  assert.strictEqual(numWords('12.75'), 'পৌনে তেরো');
  assert.strictEqual(yearWords('1971'), 'উনিশশো একাত্তর');
  assert.strictEqual(intWords(15000000), 'এক কোটি পঞ্চাশ লাখ');
  console.log('All Bengali number tests passed ✔');
}
