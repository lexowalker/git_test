// Ghost Green-Eye — core engine: timing, easing, ink-drawing primitives, textures, scene compositor.
'use strict';

const W = window.VW || 1920, H = window.VH || 1080;  // shorts set VW/VH for vertical
const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  lin: t => t,
  in: t => t * t * t,
  out: t => 1 - Math.pow(1 - t, 3),
  inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outExpo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutQuad: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};
// smooth progress between a and b
const ss = (t, a, b, e = E.inOut) => e(seg(t, a, b));
// in-hold-out envelope: 0 before a, ramps to 1 over fin, holds, ramps to 0 ending at b
const env = (t, a, b, fin = 0.4, fout = 0.4) => Math.min(ss(t, a, a + fin), 1 - ss(t, b - fout, b));
const pulse = (t, a, d = 0.6) => { const x = (t - a) / d; return x < 0 || x > 1 ? 0 : Math.sin(Math.PI * x); };

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// smooth 1D value noise
function vnoise(x, seed = 0) {
  const h = n => { const s = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return s - Math.floor(s); };
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(h(i), h(i + 1), u) * 2 - 1;
}

// ---------- palette ----------
const P = {
  ink: '#191629', inkSoft: '#2a2f4a', navy: '#27304a',
  paper: '#efe8d8', paperDark: '#e2d8c2',
  green: '#2fe08a', greenDeep: '#0f8a55', greenGlow: 'rgba(80,255,170,', greenPale: '#b9f5d2',
  skyTop: '#0b1a52', skyMid: '#1d46a8', skyLow: '#4f7fd6', skyHorizon: '#8fb0ec',
  lilac: '#b9a6d6', lavender: '#c9b8e8', sage: '#9fc1b0', peach: '#f0c09a', rose: '#e7a3b5',
  teal: '#3fb7c0', coral: '#ef7d5e', ochre: '#e0a848', cyan: '#9fe6ff', crystal: '#d9f6ff',
  plum: '#3a1f3d', amber: '#ffb347', cream: '#f4e3bd',
};

// ---------- geometry helpers ----------
function bez2(p0, p1, p2, n = 24) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
    out.push([a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]]);
  }
  return out;
}
function bez3(p0, p1, p2, p3, n = 32) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, mt = 1 - t;
    const a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, d = t * t * t;
    out.push([a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]);
  }
  return out;
}
function circlePts(cx, cy, r, n = 64, a0 = -Math.PI / 2, sweep = TAU) {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = a0 + sweep * i / n; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return out;
}
// densify a polyline so wobble looks organic
function densify(pts, step = 8) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(d / step));
    for (let k = 1; k <= n; k++) out.push([lerp(x0, x1, k / n), lerp(y0, y1, k / n)]);
  }
  return out;
}
// perpendicular wobble — hand-drawn feel. seed keeps it stable across frames.
function wobble(pts, amp = 1.5, seed = 1, freq = 0.02) {
  let acc = 0;
  return pts.map((p, i) => {
    if (i > 0) acc += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
    const a = i < pts.length - 1 ? pts[i + 1] : p, b = i > 0 ? pts[i - 1] : p;
    let nx = -(a[1] - b[1]), ny = a[0] - b[0];
    const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const o = vnoise(acc * freq, seed) * amp;
    return [p[0] + nx * o, p[1] + ny * o];
  });
}
function pathLen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
// trace first fraction p of a polyline into the current path
function tracePartial(ctx, pts, p = 1, from = 0) {
  if (p <= from || pts.length < 2) return null;
  const L = pathLen(pts), a = L * from, b = L * p;
  let s = 0, started = false, last = null;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const d = Math.hypot(x1 - x0, y1 - y0);
    if (s + d >= a && s <= b) {
      const t0 = clamp((a - s) / (d || 1)), t1 = clamp((b - s) / (d || 1));
      const sx = lerp(x0, x1, t0), sy = lerp(y0, y1, t0), ex = lerp(x0, x1, t1), ey = lerp(y0, y1, t1);
      if (!started) { ctx.moveTo(sx, sy); started = true; }
      ctx.lineTo(ex, ey); last = [ex, ey, Math.atan2(y1 - y0, x1 - x0)];
    }
    s += d;
    if (s > b) break;
  }
  return last;
}
function stroke(ctx, pts, { p = 1, from = 0, w = 3, color = P.ink, alpha = 1, dash = null, cap = 'round' } = {}) {
  if (p <= 0 || alpha <= 0) return null;
  ctx.save();
  ctx.globalAlpha *= alpha; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = cap; ctx.lineJoin = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  const end = tracePartial(ctx, pts, p, from);
  ctx.stroke();
  ctx.restore();
  return end;
}
function fillPts(ctx, pts, color, alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color; ctx.beginPath();
  pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
// hand-drawn line between two points
function inkLine(ctx, x1, y1, x2, y2, o = {}) {
  const pts = wobble(densify([[x1, y1], [x2, y2]], 10), o.amp ?? 1.6, o.seed ?? (x1 * 7 + y2 * 3));
  return stroke(ctx, pts, o);
}
function inkCircle(ctx, cx, cy, r, o = {}) {
  const pts = wobble(circlePts(cx, cy, r, Math.max(24, r * 0.6 | 0), o.a0 ?? -Math.PI / 2 - 0.3, TAU + 0.35), o.amp ?? 1.8, o.seed ?? (cx + cy), 0.03);
  if (o.fill) { const pf = o.fillAlpha ?? 1; ctx.save(); ctx.globalAlpha *= pf * (o.alpha ?? 1) * clamp((o.p ?? 1) * 1.4 - 0.4); ctx.fillStyle = o.fill; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ctx.restore(); }
  return stroke(ctx, pts, o);
}
function arrowHead(ctx, x, y, ang, size = 14, color = P.ink, w = 3, alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - Math.cos(ang - 0.45) * size, y - Math.sin(ang - 0.45) * size);
  ctx.lineTo(x, y);
  ctx.lineTo(x - Math.cos(ang + 0.45) * size, y - Math.sin(ang + 0.45) * size);
  ctx.stroke(); ctx.restore();
}
function inkArrow(ctx, pts, o = {}) {
  const wp = wobble(densify(pts, 10), o.amp ?? 1.4, o.seed ?? 3);
  const end = stroke(ctx, wp, o);
  if (end && (o.p ?? 1) > 0.15) arrowHead(ctx, end[0], end[1], end[2], o.head ?? 16, o.color ?? P.ink, o.w ?? 3, (o.alpha ?? 1) * clamp(((o.p ?? 1) - 0.15) * 5));
  return end;
}

// ---------- text ----------
function font(size, fam = 'Hand', style = '') { return `${style} ${size}px ${fam}`.trim(); }
// write-on text reveal (left-to-right clip with a soft edge)
function handText(ctx, str, x, y, o = {}) {
  const p = o.p ?? 1; if (p <= 0) return;
  ctx.save();
  ctx.font = font(o.size ?? 40, o.fam ?? 'Hand', o.style ?? '');
  ctx.textAlign = o.align ?? 'left'; ctx.textBaseline = o.base ?? 'alphabetic';
  const m = ctx.measureText(str), w = m.width;
  const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  ctx.globalAlpha *= (o.alpha ?? 1);
  if (p < 1) {
    const sz = o.size ?? 40;
    const g = ctx.createLinearGradient(x0 + w * p - 30, 0, x0 + w * p + 2, 0);
    const col = o.color ?? P.ink;
    ctx.beginPath(); ctx.rect(x0 - 10, y - sz * 1.5, w * p + 12, sz * 2.2); ctx.clip();
  }
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.glowBlur ?? 18; }
  ctx.fillStyle = o.color ?? P.ink;
  ctx.fillText(str, x, y);
  ctx.restore();
  return w;
}
function measure(ctx, str, size, fam = 'Hand', style = '') { ctx.save(); ctx.font = font(size, fam, style); const w = ctx.measureText(str).width; ctx.restore(); return w; }

// ---------- light ----------
function glow(ctx, x, y, r, rgbaPrefix = P.greenGlow, a = 1, mode = 'lighter') {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = mode;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgbaPrefix + (0.9 * a) + ')');
  g.addColorStop(0.25, rgbaPrefix + (0.45 * a) + ')');
  g.addColorStop(0.6, rgbaPrefix + (0.12 * a) + ')');
  g.addColorStop(1, rgbaPrefix + '0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
}

// ---------- textures (built once) ----------
const TX = {};
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function buildTextures() {
  // paper: warm off-white with fibres, blotches and a soft vignette
  const pc = makeCanvas(W, H), p = pc.getContext('2d');
  p.fillStyle = P.paper; p.fillRect(0, 0, W, H);
  const r = mulberry32(7);
  for (let i = 0; i < 160; i++) {
    const x = r() * W, y = r() * H, rad = 40 + r() * 160;
    const g = p.createRadialGradient(x, y, 0, x, y, rad);
    const dark = r() < 0.5;
    g.addColorStop(0, dark ? 'rgba(160,140,100,0.022)' : 'rgba(255,255,250,0.04)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    p.fillStyle = g; p.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  const id = p.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n * 0.9; }
  p.putImageData(id, 0, 0);
  p.strokeStyle = 'rgba(120,100,70,0.05)'; p.lineWidth = 1;
  for (let i = 0; i < 900; i++) { const x = r() * W, y = r() * H, a = r() * TAU, l = 6 + r() * 24; p.beginPath(); p.moveTo(x, y); p.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); p.stroke(); }
  const vg = p.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(90,70,40,0.22)');
  p.fillStyle = vg; p.fillRect(0, 0, W, H);
  TX.paper = pc;
  // film grain frames
  TX.grain = [];
  for (let k = 0; k < 6; k++) {
    const gc = makeCanvas(W / 2, H / 2), g = gc.getContext('2d'), gid = g.createImageData(W / 2, H / 2), gd = gid.data, rr = mulberry32(100 + k);
    for (let i = 0; i < gd.length; i += 4) { const v = rr() * 255; gd[i] = gd[i + 1] = gd[i + 2] = v; gd[i + 3] = 255; }
    g.putImageData(gid, 0, 0); TX.grain.push(gc);
  }
  // vignette
  const vc = makeCanvas(W, H), v = vc.getContext('2d');
  const vg2 = v.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.0);
  vg2.addColorStop(0, 'rgba(0,0,0,0)'); vg2.addColorStop(1, 'rgba(5,5,20,0.45)');
  v.fillStyle = vg2; v.fillRect(0, 0, W, H);
  TX.vignette = vc;
  // print-like halftone speckle used on illustrated fills
  const sc = makeCanvas(512, 512), s = sc.getContext('2d'), rs = mulberry32(55);
  for (let i = 0; i < 2600; i++) { s.fillStyle = `rgba(20,15,40,${0.05 + rs() * 0.12})`; s.beginPath(); s.arc(rs() * 512, rs() * 512, 0.6 + rs() * 1.1, 0, TAU); s.fill(); }
  TX.speckle = sc;
}
function drawPaper(ctx, alpha = 1) { ctx.save(); ctx.globalAlpha *= alpha; ctx.drawImage(TX.paper, 0, 0); ctx.restore(); }
// faint graph-paper / polar guide lines like the diagram reference
function paperGrid(ctx, alpha = 0.5, step = 60, color = 'rgba(70,80,110,0.10)') {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash([3, 7]);
  ctx.beginPath();
  for (let x = (W / 2) % step; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = (H / 2) % step; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke(); ctx.restore();
}
function speckle(ctx, alpha = 0.5) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = ctx.createPattern(TX.speckle, 'repeat'); ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore();
}

// starfield (deterministic); twinkle with t
function stars(ctx, t, o = {}) {
  const r = mulberry32(o.seed ?? 11), n = o.n ?? 380, x0 = o.x ?? 0, y0 = o.y ?? 0, w = o.w ?? W, h = o.h ?? H * 0.6;
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1;
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * w, y = y0 + Math.pow(r(), 1.3) * h, s = Math.pow(r(), 5) * 3.2 + 0.6, ph = r() * TAU, c = r();
    const tw = 0.65 + 0.35 * Math.sin(t * (1.2 + c * 2) + ph);
    ctx.globalAlpha = (o.alpha ?? 1) * tw * (0.5 + 0.5 * (1 - (y - y0) / h * 0.6));
    ctx.fillStyle = c < 0.07 ? '#ffe9b0' : c < 0.12 ? '#cfe8ff' : '#ffffff';
    ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill();
    if (s > 2.6) { ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - s * 3, y); ctx.lineTo(x + s * 3, y); ctx.moveTo(x, y - s * 3); ctx.lineTo(x, y + s * 3); ctx.stroke(); }
  }
  ctx.restore();
}

// camera: world point (x,y) at screen centre, zoom z
function cam(ctx, x, y, z = 1, rot = 0) { ctx.translate(W / 2, H / 2); ctx.scale(z, z); if (rot) ctx.rotate(rot); ctx.translate(-x, -y); }

// ---------- scene compositor ----------
const G = {
  DURATION: 211.5, AUDIO_END: 203.9, FPS: 30, scenes: [], buffers: [],
  scene(t0, t1, draw, enter = { type: 'cut' }) { this.scenes.push({ t0, t1, draw, enter }); },
  init() {
    buildTextures();
    for (let i = 0; i < 3; i++) this.buffers.push(makeCanvas(W, H));
  },
  frame(ctx, t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const act = this.scenes.filter(s => t >= s.t0 && t < s.t1);
    let start = 0;
    act.forEach((s, i) => { if (s.enter.type === 'cut' || t >= s.t0 + (s.enter.dur ?? 0)) start = i; });
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    for (let i = start, b = 0; i < act.length; i++) {
      const s = act[i];
      const k = i === start ? 1 : clamp((t - s.t0) / (s.enter.dur || 1));
      if (i === start) { ctx.save(); s.draw(ctx, t); ctx.restore(); continue; }
      const buf = this.buffers[b++ % this.buffers.length], bc = buf.getContext('2d');
      bc.setTransform(1, 0, 0, 1, 0, 0); bc.globalAlpha = 1; bc.globalCompositeOperation = 'source-over';
      bc.clearRect(0, 0, W, H); bc.save(); s.draw(bc, t); bc.restore();
      composite(ctx, buf, s.enter, k, t);
    }
    // finishing: grain + vignette
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    ctx.drawImage(TX.vignette, 0, 0);
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.07;
    ctx.drawImage(TX.grain[Math.floor(t * 24) % TX.grain.length], 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    // fade from/to black at the very ends
    const fb = Math.max(1 - seg(t, 0, 0.6), seg(t, this.DURATION - 1.4, this.DURATION - 0.2));
    if (fb > 0) { ctx.fillStyle = `rgba(0,0,0,${fb})`; ctx.fillRect(0, 0, W, H); }
  },
};
function composite(ctx, buf, tr, k, t) {
  ctx.save();
  const e = E.inOut(k);
  if (tr.type === 'fade') { ctx.globalAlpha = e; ctx.drawImage(buf, 0, 0); }
  else if (tr.type === 'iris') {
    const cx = tr.x ?? W / 2, cy = tr.y ?? H / 2, R = Math.hypot(W, H) * E.in(k) * 1.02 + 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip(); ctx.drawImage(buf, 0, 0);
  } else if (tr.type === 'wipe') {
    // ink-brush wipe with a ragged leading edge
    const dir = tr.dir ?? 1, x = lerp(-200, W + 200, e);
    ctx.beginPath();
    if (dir > 0) { ctx.moveTo(-10, -10); for (let y = -10; y <= H + 10; y += 20) ctx.lineTo(x + vnoise(y * 0.02, 9) * 90 + Math.sin(y * 0.05) * 20, y); ctx.lineTo(-10, H + 10); }
    else { ctx.moveTo(W + 10, -10); for (let y = -10; y <= H + 10; y += 20) ctx.lineTo(W - x + vnoise(y * 0.02, 9) * 90, y); ctx.lineTo(W + 10, H + 10); }
    ctx.closePath(); ctx.clip(); ctx.drawImage(buf, 0, 0);
  } else if (tr.type === 'flash') {
    ctx.globalAlpha = e; ctx.drawImage(buf, 0, 0);
    ctx.globalAlpha = Math.sin(Math.PI * k) * 0.8; ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = tr.color ?? '#7dffb6'; ctx.fillRect(0, 0, W, H);
  } else { ctx.drawImage(buf, 0, 0); }
  ctx.restore();
}
