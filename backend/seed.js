// Run once to populate the DB with the data that used to be hardcoded in index.html.
// Safe to re-run: it skips seeding if the tables already have rows.
const db = require('./db');

const dealCount = db.prepare('SELECT COUNT(*) AS c FROM deals').get().c;
const trackCount = db.prepare('SELECT COUNT(*) AS c FROM track_record').get().c;

if (dealCount === 0) {
  const insert = db.prepare(`INSERT INTO deals
    (sector, structure, structureBn, status, amountEn, amountBn, nameEn, nameBn, descEn, descBn, roi, overviewEn, overviewBn, useEn, useBn, sortOrder)
    VALUES (@sector, @structure, @structureBn, @status, @amountEn, @amountBn, @nameEn, @nameBn, @descEn, @descBn, @roi, @overviewEn, @overviewBn, @useEn, @useBn, @sortOrder)`);

  const deals = [
    { sector: 'Service', structure: 'Murabaha', structureBn: 'মুরাবাহা', status: 'Deployed', amountEn: 'BDT 5 lakh', amountBn: '৳৫ লাখ', nameEn: 'SukunLife', nameBn: 'SukunLife', descEn: 'A Ruqyah-based spiritual wellness service, Murabaha financed for office devices and decoration', descBn: 'একটা রুকইয়াহ-ভিত্তিক স্পিরিচুয়াল ওয়েলনেস সার্ভিস, অফিস ডিভাইস আর ডেকোরেশনের জন্য মুরাবাহায় অর্থায়ন করা', roi: null,
      overviewEn: 'SukunLife is a Ruqyah-based spiritual wellness service — offering diagnosis, courses, and appointments — and the first deal funded under this SME segment. The Murabaha financed office devices and interior decoration for their center, deployed in July 2026 with a 6-month term and a confirmed profit rate agreed before disbursement.',
      overviewBn: 'SukunLife একটা রুকইয়াহ-ভিত্তিক স্পিরিচুয়াল ওয়েলনেস সার্ভিস — ডায়াগনোসিস, কোর্স, আর অ্যাপয়েন্টমেন্ট নিয়ে কাজ করে — আর এই SME সেগমেন্টের আওতায় ফান্ড হওয়া প্রথম ডিল। মুরাবাহাটা গেছে তাদের সেন্টারের জন্য অফিস ডিভাইস আর ইন্টেরিয়র ডেকোরেশনের খরচ মেটাতে। বিতরণ হয়েছে ২০২৬-এর জুলাইয়ে, ৬ মাস মেয়াদে, বিতরণের আগেই ঠিক করা একটা নিশ্চিত মুনাফার হার নিয়ে।',
      useEn: 'Capital was deployed under a Murabaha structure to finance office devices and interior decoration for SukunLife\'s premises, secured with a post-dated cheque and a defined repayment schedule agreed before disbursement.',
      useBn: 'SukunLife-এর প্রাঙ্গণের জন্য অফিস ডিভাইস আর ইন্টেরিয়র ডেকোরেশনের খরচ মেটাতে মুরাবাহা কাঠামোর আওতায় পুঁজি গেছে। নিরাপত্তা হিসেবে আছে post-dated চেক, আর বিতরণের আগেই ঠিক করা একটা পরিশোধের সময়সূচি।', sortOrder: 1 },
    { sector: 'Trading', structure: 'Murabaha', structureBn: 'মুরাবাহা', status: 'Deployed', amountEn: 'BDT 8 lakh', amountBn: '৳৮ লাখ', nameEn: 'Walidain', nameBn: 'Walidain', descEn: 'A panjabi fabric trading business', descBn: 'পাঞ্জাবির কাপড়ের একটা ট্রেডিং বিজনেস', roi: null,
      overviewEn: 'Walidain is a trading business dealing in panjabi fabric. The investment was deployed in August 2026 under a Murabaha structure, with a 6-month term and a confirmed profit rate agreed before disbursement.',
      overviewBn: 'Walidain পাঞ্জাবির কাপড় নিয়ে কাজ করা একটা ট্রেডিং বিজনেস। বিনিয়োগটা গেছে ২০২৬-এর আগস্টে, মুরাবাহা কাঠামোর আওতায়, ৬ মাস মেয়াদে, বিতরণের আগেই ঠিক করা একটা নিশ্চিত মুনাফার হার নিয়ে।',
      useEn: 'Capital was deployed under a Murabaha structure to finance the purchase of panjabi fabric stock, with a defined repayment schedule agreed before disbursement.',
      useBn: 'পাঞ্জাবির কাপড়ের স্টক কেনার জন্য মুরাবাহা কাঠামোর আওতায় পুঁজি গেছে, বিতরণের আগেই ঠিক করা একটা পরিশোধের সময়সূচি নিয়ে।', sortOrder: 2 },
  ];
  const insertMany = db.transaction(rows => rows.forEach(r => insert.run(r)));
  insertMany(deals);
  console.log(`Seeded ${deals.length} deals.`);
} else {
  console.log(`Deals table already has ${dealCount} rows — skipped.`);
}

if (trackCount === 0) {
  const insert = db.prepare(`INSERT INTO track_record
    (year, nameEn, nameBn, category, round, months, durationEn, durationBn, roi)
    VALUES (@year, @nameEn, @nameBn, @category, @round, @months, @durationEn, @durationBn, @roi)`);

  const trackRecord = [
    { year: 2023, nameEn: 'Shai Tea', nameBn: 'Shai Tea', category: 'trading', round: null, months: 20, durationEn: '20 months', durationBn: '২০ মাস', roi: 28.75 },
    { year: 2023, nameEn: 'Sharif Fashion', nameBn: 'Sharif Fashion', category: 'maleClothing', round: 1, months: 3, durationEn: '3 months', durationBn: '৩ মাস', roi: 15.9 },
    { year: 2023, nameEn: 'Onman', nameBn: 'Onman', category: 'maleClothing', round: null, months: 3, durationEn: '3 months', durationBn: '৩ মাস', roi: 9.33 },
    { year: 2024, nameEn: 'Muin Shop', nameBn: 'Muin Shop', category: 'femaleClothing', round: null, months: 2, durationEn: '2 months', durationBn: '২ মাস', roi: 6 },
    { year: 2024, nameEn: 'Hygienic Agro', nameBn: 'Hygienic Agro', category: 'agro', round: 1, months: 4, durationEn: '4 months', durationBn: '৪ মাস', roi: 6.2 },
    { year: 2024, nameEn: 'Sharif Fashion', nameBn: 'Sharif Fashion', category: 'maleClothing', round: 2, months: 6, durationEn: '6 months', durationBn: '৬ মাস', roi: 13.94 },
    { year: 2024, nameEn: 'Walidain', nameBn: 'Walidain', category: 'maleClothing', round: 1, months: 4, durationEn: '4 months', durationBn: '৪ মাস', roi: 12.5 },
    { year: 2025, nameEn: 'Walidain', nameBn: 'Walidain', category: 'maleClothing', round: 2, months: 6, durationEn: '6 months', durationBn: '৬ মাস', roi: 20 },
    { year: 2025, nameEn: 'Hygienic Agro', nameBn: 'Hygienic Agro', category: 'agro', round: 2, months: 1, durationEn: '1 month', durationBn: '১ মাস', roi: 2 },
    { year: 2025, nameEn: 'Walidain', nameBn: 'Walidain', category: 'maleClothing', round: 3, months: 3, durationEn: '3 months', durationBn: '৩ মাস', roi: 10 },
  ];
  const insertMany = db.transaction(rows => rows.forEach(r => insert.run(r)));
  insertMany(trackRecord);
  console.log(`Seeded ${trackRecord.length} track record rows.`);
} else {
  console.log(`Track record table already has ${trackCount} rows — skipped.`);
}
