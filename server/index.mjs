import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

/* ── /api/translate — Google Translate proxy (no CORS issues) ── */
app.post('/api/translate', async (req, res) => {
  const { text, from, to } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'empty text' });
  if (!from || !to)  return res.status(400).json({ error: 'from/to required' });
  if (from === to)   return res.json({ translated: text });

  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t` +
    `&q=${encodeURIComponent(text)}`;

  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) return res.status(502).json({ error: `google status ${r.status}` });
    const d = await r.json();
    const translated = d[0]?.map(x => x?.[0] ?? '').join('').trim();
    return res.json({ translated: translated || text });
  } catch (e) {
    return res.status(502).json({ error: e?.message || 'translate failed' });
  }
});

/* ── /api/tts — Google TTS proxy ── */
app.get('/api/tts', async (req, res) => {
  const { text, lang } = req.query;
  if (!text || !lang) return res.status(400).json({ error: 'text and lang required' });

  const url =
    `https://translate.googleapis.com/translate_tts` +
    `?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${encodeURIComponent(lang)}&client=gtx&ttsspeed=0.88`;

  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://translate.google.com/',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return res.status(502).end();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const buf = await r.arrayBuffer();
    res.end(Buffer.from(buf));
  } catch {
    res.status(502).end();
  }
});

/* ── Serve built frontend in production ── */
if (process.env.NODE_ENV === 'production') {
  const dist = join(__dirname, '..', 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`i-hear server running on http://localhost:${PORT}`);
});
