// Dynamic word-by-word subtitles for vertical shorts.
// Chunks of ≤4 words / ~20 chars; the spoken word lights gold and pops; key terms stay warm-gold.
'use strict';

const SUBS = {
  Y: 1480, SIZE: 76, MAXW: 820,
  keys: new Set(),
  chunks: [],
  build(words, keys = []) {
    this.keys = new Set(keys.map(k => k.toLowerCase()));
    const norm = w => w.toLowerCase().replace(/[^a-z']/g, '');
    let cur = [];
    const flush = () => { if (cur.length) this.chunks.push(cur); cur = []; };
    words.forEach((w, i) => {
      const prev = words[i - 1];
      const chars = cur.reduce((n, x) => n + x.w.length + 1, 0);
      if (cur.length && (cur.length >= 4 || chars + w.w.length > 21 || /[.?!]$/.test(prev.w) || (/,$/.test(prev.w) && cur.length >= 2) || w.s - prev.e > 0.45 || w.seg !== prev.seg)) flush();
      cur.push({ ...w, key: this.keys.has(norm(w.w)) || this.keys.has(norm(w.w) + (words[i + 1] ? ' ' + norm(words[i + 1].w) : '')) });
    });
    flush();
    // multi-word keys (e.g. "observing center"): mark both words
    this.chunks.forEach(c => c.forEach((w, i) => { if (i + 1 < c.length && this.keys.has(norm(w.w) + ' ' + norm(c[i + 1].w))) { w.key = true; c[i + 1].key = true; } }));
    this.chunks.forEach((c, i) => {
      const next = this.chunks[i + 1];
      c.t0 = c[0].s - 0.06;
      c.t1 = Math.min(next ? next[0].s - 0.04 : Infinity, c[c.length - 1].e + 0.7);
    });
  },
  draw(ctx, t) {
    if (this.hidden && this.hidden(t)) return;
    const c = this.chunks.find(c => t >= c.t0 && t < c.t1);
    if (!c) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const k = E.outBack(clamp((t - c.t0) / 0.16)), fade = clamp((c.t1 - t) / 0.08);
    let size = this.SIZE;
    ctx.font = `900 ${size}px Sub`;
    const gap = size * 0.46;
    let widths = c.map(w => ctx.measureText(w.w).width);
    let total = widths.reduce((a, b) => a + b, 0) + gap * (c.length - 1);
    if (total > this.MAXW) { size *= this.MAXW / total; ctx.font = `900 ${size}px Sub`; widths = c.map(w => ctx.measureText(w.w).width); total = widths.reduce((a, b) => a + b, 0) + gap * (c.length - 1); }
    let x = W / 2 - 20 - total / 2;  // nudged left of the Shorts action rail
    const y = this.Y;
    ctx.globalAlpha = fade * clamp(k * 1.5);
    ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    c.forEach((w, i) => {
      const next = c[i + 1];
      const active = t >= w.s - 0.03 && t < (next ? next.s - 0.03 : c.t1);
      const pop = active ? 1 + 0.14 * E.outBack(clamp((t - w.s + 0.03) / 0.14)) : 1;
      const cx = x + widths[i] / 2;
      ctx.save(); ctx.translate(cx, y); ctx.scale(pop * lerp(0.9, 1, k), pop * lerp(0.9, 1, k));
      ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
      ctx.lineWidth = size * 0.2; ctx.strokeStyle = '#0c0d22'; ctx.textAlign = 'center';
      ctx.strokeText(w.w, 0, 0);
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = active ? '#ffc93c' : w.key ? '#ffe6a6' : '#ffffff';
      ctx.fillText(w.w, 0, 0);
      ctx.restore();
      x += widths[i] + gap;
    });
    ctx.restore();
  },
};

// word-cue helpers: time of the nth occurrence of a word (case/punctuation-insensitive)
function cue(word, n = 1, which = 's') {
  const want = word.toLowerCase();
  let k = 0;
  for (const w of window.WORDS) if (w.w.toLowerCase().replace(/[^a-z']/g, '') === want && ++k === n) return w[which];
  console.warn('cue not found', word, n);
  return 0;
}
// time of the first word of a phrase
function cueP(phrase, n = 1) {
  const ws = phrase.toLowerCase().split(/\s+/), W2 = window.WORDS.map(w => w.w.toLowerCase().replace(/[^a-z']/g, ''));
  let k = 0;
  for (let i = 0; i + ws.length <= W2.length; i++) if (ws.every((x, j) => W2[i + j] === x) && ++k === n) return window.WORDS[i].s;
  console.warn('phrase not found', phrase);
  return 0;
}
