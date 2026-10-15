// Ghost Green-Eye — explanatory layer: the triad motif, labels, note boxes, masks.
'use strict';

// scratch canvases for masking effects
const SCR = [];
function scratch(i = 0) {
  while (SCR.length <= i) SCR.push(makeCanvas(W, H));
  const c = SCR[i], x = c.getContext('2d');
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H);
  return [c, x];
}
// draw `inside` only where `mask` painted (both draw in screen space)
function masked(ctx, mask, inside, i = 0) {
  const [c, x] = scratch(i);
  x.save(); mask(x); x.restore();
  x.globalCompositeOperation = 'source-atop'; x.save(); inside(x); x.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(c, 0, 0); ctx.restore();
}

function paperWash(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(TX.paper, 0, 0); ctx.restore(); }

// ---- the triad: SELF (circle) – VALUED (diamond) – RIVAL (triangle) ----
// o: p (draw progress 0..1), green (0..1 tension glow), labels (bool / alpha), scale, color, alpha, bond (0..1), threat (0..1)
function nodeSelf(ctx, x, y, r, o = {}) {
  inkCircle(ctx, x, y, r, { p: o.p ?? 1, w: o.w ?? 3.5, color: o.color ?? P.ink, fill: o.fill ?? P.sage, fillAlpha: 0.9, alpha: o.alpha ?? 1, seed: 5 });
}
function nodeValued(ctx, x, y, r, o = {}) {
  const pts = wobble(densify([[x, y - r * 1.15], [x + r, y], [x, y + r * 1.15], [x - r, y], [x, y - r * 1.15]], 6), 1.2, 8);
  if ((o.p ?? 1) > 0.5) fillPts(ctx, pts, o.fill ?? P.peach, 0.9 * (o.alpha ?? 1) * clamp(((o.p ?? 1) - 0.5) * 3));
  stroke(ctx, pts, { p: o.p ?? 1, w: o.w ?? 3.5, color: o.color ?? P.ink, alpha: o.alpha ?? 1 });
}
function nodeRival(ctx, x, y, r, o = {}) {
  const pts = wobble(densify([[x, y - r * 1.1], [x + r, y + r * 0.75], [x - r, y + r * 0.75], [x, y - r * 1.1]], 6), 1.2, 9);
  if ((o.p ?? 1) > 0.5) fillPts(ctx, pts, o.fill ?? P.lilac, 0.9 * (o.alpha ?? 1) * clamp(((o.p ?? 1) - 0.5) * 3));
  stroke(ctx, pts, { p: o.p ?? 1, w: o.w ?? 3.5, color: o.color ?? P.ink, alpha: o.alpha ?? 1 });
}
function triad(ctx, S, V, R, o = {}) {
  const p = o.p ?? 1, a = o.alpha ?? 1, r = o.r ?? 26, col = o.color ?? P.ink, g = o.green ?? 0;
  if (a <= 0 || p <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  // bond self—valued (solid), rival→valued (dashed approach), self—rival (tension)
  const sh = (A, B, k) => { const d = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / d, uy = (B[1] - A[1]) / d; return [[A[0] + ux * r * k, A[1] + uy * r * k], [B[0] - ux * r * k, B[1] - uy * r * k]]; };
  const [s1, v1] = sh(S, V, 1.5), [r1, v2] = sh(R, V, 1.5), [s2, r2] = sh(S, R, 1.5);
  inkLine(ctx, s1[0], s1[1], v1[0], v1[1], { p: ss(p, 0.3, 0.6), w: (o.w ?? 3) * 1.1, color: col, seed: 31 });
  inkLine(ctx, r1[0], r1[1], v2[0], v2[1], { p: ss(p, 0.45, 0.75), w: o.w ?? 3, color: col, dash: [10, 9], seed: 32 });
  if (g > 0 || o.tension) {
    // tension line: zig-zag from self to rival, turning green
    const n = 18, zz = [];
    for (let i = 0; i <= n; i++) { const f = i / n, x = lerp(s2[0], r2[0], f), y = lerp(s2[1], r2[1], f); const d = Math.hypot(r2[0] - s2[0], r2[1] - s2[1]); const nx = -(r2[1] - s2[1]) / d, ny = (r2[0] - s2[0]) / d; const k = (i % 2 ? 1 : -1) * 7 * Math.sin(f * Math.PI); zz.push([x + nx * k, y + ny * k]); }
    const gc = g > 0.5 ? '#13a865' : col;
    if (g > 0) { ctx.save(); ctx.shadowColor = 'rgba(60,255,160,0.9)'; ctx.shadowBlur = 16 * g; stroke(ctx, zz, { p: ss(p, 0.6, 0.95) * Math.max(g, o.tension ?? 0), w: 3, color: gc }); ctx.restore(); }
    else stroke(ctx, zz, { p: ss(p, 0.6, 0.95) * (o.tension ?? 0), w: 2.5, color: col, alpha: 0.7 });
  }
  const np = q => ss(p, q, q + 0.3);
  if (g > 0) glow(ctx, S[0], S[1], r * 4.5 * g, P.greenGlow, g * 0.9);
  nodeValued(ctx, V[0], V[1], r, { p: np(0.05), color: col, fill: o.fillV });
  nodeRival(ctx, R[0], R[1], r, { p: np(0.2), color: col, fill: o.fillR });
  nodeSelf(ctx, S[0], S[1], r, { p: np(0), color: col, fill: g > 0.3 ? '#7ff0b4' : o.fillS });
  const la = (o.labels ?? 0) * clamp(p * 2 - 1);
  if (la > 0) {
    const fs = o.labelSize ?? 34, lc = o.labelColor ?? col;
    const lab = (txt, P0, dy) => handText(ctx, txt, P0[0], P0[1] + dy, { size: fs, align: 'center', color: lc, alpha: la });
    lab(o.ls ?? 'self', S, (o.lsy ?? 1) * (r + fs + 6));
    lab(o.lv ?? 'valued', V, (o.lvy ?? -1) * (r + 18));
    lab(o.lr ?? 'rival', R, (o.lry ?? 1) * (r + fs + 6));
  }
  ctx.restore();
}

// note box like the reference's corner annotations
function noteBox(ctx, x, y, w, h, lines, o = {}) {
  const p = o.p ?? 1, a = o.alpha ?? 1; if (p <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const pts = wobble(densify([[x + 10, y], [x + w - 10, y], [x + w, y + 10], [x + w, y + h - 10], [x + w - 10, y + h], [x + 10, y + h], [x, y + h - 10], [x, y + 10], [x + 10, y]], 10), 1.2, 4);
  fillPts(ctx, pts, 'rgba(244,238,224,0.92)', clamp(p * 3));
  stroke(ctx, pts, { p: ss(p, 0, 0.5), w: 2, color: P.navy });
  lines.forEach((ln, i) => {
    const q = ss(p, 0.3 + i * 0.15, 0.6 + i * 0.15);
    handText(ctx, ln, x + 22, y + 46 + i * (o.lh ?? 40), { size: o.size ?? 32, color: P.navy, p: q });
  });
  ctx.restore();
}

// eye glyph — almond with iris; o.open 0..1, o.green 0..1
function eyeGlyph(ctx, x, y, s, o = {}) {
  const open = o.open ?? 1, g = o.green ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= o.alpha ?? 1;
  if (g > 0) glow(ctx, 0, 0, 260, P.greenGlow, 0.5 * g);
  ctx.beginPath(); ctx.moveTo(-200, 0); ctx.quadraticCurveTo(0, -150 * open, 200, 0); ctx.quadraticCurveTo(0, 150 * open, -200, 0); ctx.closePath();
  ctx.fillStyle = o.white ?? 'rgba(220,255,236,0.95)'; ctx.fill();
  ctx.save(); ctx.clip();
  const ir = 78 + (o.dilate ?? 0) * 10;
  const gi = ctx.createRadialGradient(0, 0, 8, 0, 0, ir);
  gi.addColorStop(0, '#0a3a24'); gi.addColorStop(0.35, '#16b86a'); gi.addColorStop(0.8, '#3dffa0'); gi.addColorStop(1, '#0d6b40');
  ctx.fillStyle = gi; ctx.beginPath(); ctx.arc(o.lookX ?? 0, 0, ir, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(5,40,25,0.5)'; ctx.lineWidth = 2;
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; ctx.beginPath(); ctx.moveTo((o.lookX ?? 0) + Math.cos(a) * 34, Math.sin(a) * 34); ctx.lineTo((o.lookX ?? 0) + Math.cos(a) * (ir - 6), Math.sin(a) * (ir - 6)); ctx.stroke(); }
  ctx.fillStyle = '#05110c'; ctx.beginPath(); ctx.ellipse(o.lookX ?? 0, 0, 30 * (o.pupil ?? 1) * 0.55, 30 * (o.pupil ?? 1), 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc((o.lookX ?? 0) + 26, -26, 11, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = o.line ?? P.ink; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-200, 0); ctx.quadraticCurveTo(0, -150 * open, 200, 0); ctx.quadraticCurveTo(0, 150 * open, -200, 0); ctx.closePath(); ctx.stroke();
  ctx.restore();
}

// cheap depth-of-field: draw at low resolution, then scale up (bilinear smoothing does the blur)
const SOFT = { c: null };
function softly(ctx, draw, k = 0.09) {
  if (!SOFT.c) SOFT.c = makeCanvas(Math.round(W * k), Math.round(H * k));
  const c = SOFT.c, x = c.getContext('2d');
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, c.width, c.height);
  x.setTransform(c.width / W, 0, 0, c.height / H, 0, 0);
  x.save(); draw(x); x.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.globalAlpha *= 1; ctx.drawImage(c, 0, 0, W, H); ctx.restore();
}
