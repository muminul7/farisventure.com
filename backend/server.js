const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');
const { issueToken, checkPassword, requireAuth } = require('./auth');

const app = express();
app.use(express.json());

const uploadsDir = path.join(__dirname, 'data', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, crypto.randomUUID() + (ALLOWED_EXT.has(ext) ? ext : '.jpg'));
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, ALLOWED_EXT.has(ext));
  },
});

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://farisventure.com')
  .split(',')
  .map(s => s.trim());
app.use(cors({ origin: allowedOrigins }));

app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

// ---- auth ----
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (!checkPassword(password)) return res.status(401).json({ error: 'Wrong password' });
  res.json({ token: issueToken() });
});

// ---- image upload (admin only) ----
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded, or file type not allowed.' });
  res.json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` });
});

// ---- deals (public read, admin write) ----
app.get('/api/deals', (req, res) => {
  const rows = db.prepare('SELECT * FROM deals ORDER BY sortOrder ASC, id ASC').all();
  res.json(rows);
});

app.post('/api/deals', requireAuth, (req, res) => {
  const d = req.body || {};
  const stmt = db.prepare(`INSERT INTO deals
    (sector, structure, structureBn, status, amountEn, amountBn, nameEn, nameBn, descEn, descBn, roi, overviewEn, overviewBn, useEn, useBn, sortOrder, imageUrl)
    VALUES (@sector, @structure, @structureBn, @status, @amountEn, @amountBn, @nameEn, @nameBn, @descEn, @descBn, @roi, @overviewEn, @overviewBn, @useEn, @useBn, @sortOrder, @imageUrl)`);
  const info = stmt.run({
    sector: d.sector || '', structure: d.structure || '', structureBn: d.structureBn || '',
    status: d.status || 'Deployed', amountEn: d.amountEn || '', amountBn: d.amountBn || '',
    nameEn: d.nameEn || '', nameBn: d.nameBn || '', descEn: d.descEn || '', descBn: d.descBn || '',
    roi: d.roi === '' || d.roi === undefined ? null : Number(d.roi),
    overviewEn: d.overviewEn || '', overviewBn: d.overviewBn || '',
    useEn: d.useEn || '', useBn: d.useBn || '', sortOrder: Number(d.sortOrder) || 0,
    imageUrl: d.imageUrl || null,
  });
  res.json({ id: info.lastInsertRowid });
});

app.put('/api/deals/:id', requireAuth, (req, res) => {
  const d = req.body || {};
  db.prepare(`UPDATE deals SET sector=@sector, structure=@structure, structureBn=@structureBn,
    status=@status, amountEn=@amountEn, amountBn=@amountBn, nameEn=@nameEn, nameBn=@nameBn,
    descEn=@descEn, descBn=@descBn, roi=@roi, overviewEn=@overviewEn, overviewBn=@overviewBn,
    useEn=@useEn, useBn=@useBn, sortOrder=@sortOrder, imageUrl=@imageUrl WHERE id=@id`).run({
    id: Number(req.params.id),
    sector: d.sector || '', structure: d.structure || '', structureBn: d.structureBn || '',
    status: d.status || 'Deployed', amountEn: d.amountEn || '', amountBn: d.amountBn || '',
    nameEn: d.nameEn || '', nameBn: d.nameBn || '', descEn: d.descEn || '', descBn: d.descBn || '',
    roi: d.roi === '' || d.roi === undefined ? null : Number(d.roi),
    overviewEn: d.overviewEn || '', overviewBn: d.overviewBn || '',
    useEn: d.useEn || '', useBn: d.useBn || '', sortOrder: Number(d.sortOrder) || 0,
    imageUrl: d.imageUrl || null,
  });
  res.json({ ok: true });
});

app.delete('/api/deals/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM deals WHERE id=?').run(Number(req.params.id));
  res.json({ ok: true });
});

// ---- track record (public read, admin write) ----
app.get('/api/track-record', (req, res) => {
  const rows = db.prepare('SELECT * FROM track_record ORDER BY year DESC, id DESC').all();
  res.json(rows);
});

app.post('/api/track-record', requireAuth, (req, res) => {
  const t = req.body || {};
  const stmt = db.prepare(`INSERT INTO track_record
    (year, nameEn, nameBn, category, round, months, durationEn, durationBn, roi)
    VALUES (@year, @nameEn, @nameBn, @category, @round, @months, @durationEn, @durationBn, @roi)`);
  const info = stmt.run({
    year: Number(t.year), nameEn: t.nameEn || '', nameBn: t.nameBn || '',
    category: t.category || '', round: t.round === '' || t.round === undefined ? null : Number(t.round),
    months: Number(t.months) || 0, durationEn: t.durationEn || '', durationBn: t.durationBn || '',
    roi: Number(t.roi) || 0,
  });
  res.json({ id: info.lastInsertRowid });
});

app.put('/api/track-record/:id', requireAuth, (req, res) => {
  const t = req.body || {};
  db.prepare(`UPDATE track_record SET year=@year, nameEn=@nameEn, nameBn=@nameBn, category=@category,
    round=@round, months=@months, durationEn=@durationEn, durationBn=@durationBn, roi=@roi WHERE id=@id`).run({
    id: Number(req.params.id),
    year: Number(t.year), nameEn: t.nameEn || '', nameBn: t.nameBn || '',
    category: t.category || '', round: t.round === '' || t.round === undefined ? null : Number(t.round),
    months: Number(t.months) || 0, durationEn: t.durationEn || '', durationBn: t.durationBn || '',
    roi: Number(t.roi) || 0,
  });
  res.json({ ok: true });
});

app.delete('/api/track-record/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM track_record WHERE id=?').run(Number(req.params.id));
  res.json({ ok: true });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Faris Venture backend listening on :${PORT}`));
