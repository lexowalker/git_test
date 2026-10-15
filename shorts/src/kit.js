// Shorts kit — vertical (1080×1920) props for the Observing Center series.
// Same language as Ghost Green-Eye: flat Technicolor + ink contour, paper diagrams. Accent here is GOLD (the observing center).
'use strict';

const GOLD = '#ffc93c', GOLDG = 'rgba(255,200,90,', STORM = '#3d3768', STORM2 = '#5a4f8c';

// ---------- vertical night world ----------
function nightV(ctx, t, o = {}) {
  const hz = o.horizon ?? 1160;
  ctx.fillStyle = vgrad(ctx, -300, hz, [[0, '#060f3a'], [0.5, '#163a96'], [0.85, '#3f6fd0'], [1, '#86a8ea']]);
  ctx.fillRect(-W, -H, W * 3, hz + H + 10);
  stars(ctx, t, { seed: o.seed ?? 21, n: 360, x: -200, y: -200, w: W + 400, h: hz - 60, alpha: o.starA ?? 1 });
  if (o.moon !== false) drawMoon(ctx, o.moonX ?? 820, o.moonY ?? 330, 44);
  // far mountains + crystal massif (the series' landmark)
  const far = smoothPts([[-300, hz + 10], [-120, hz - 60], [160, hz - 40], [420, hz - 90], [700, hz - 40], [980, hz - 80], [1300, hz - 30], [1400, hz + 10]], false, 6);
  shape(ctx, far.concat([[1400, hz + 60], [-300, hz + 60]]), '#7466b8', { w: 2 });
  if (o.crystal !== false) crystalCluster(ctx, o.crystalX ?? 250, hz + 16, 0.42, 5, 1);
  mesa(ctx, 900, hz + 22, 140, 80, '#e79a86', 6);
  ctx.fillStyle = vgrad(ctx, hz, H + 100, [[0, '#a9b6e6'], [1, '#c9b0e0']]); ctx.fillRect(-W, hz + 14, W * 3, H * 2);
  ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-W, hz + 14); ctx.lineTo(W * 2, hz + 14); ctx.stroke(); ctx.restore();
}
// rounded foreground hill the observer sits on; returns its top y at x
function hillY(x, top = 1290) { return top + Math.pow((x - 540) / 520, 2) * 160; }
function hill(ctx, t, top = 1290) {
  const pts = []; for (let x = -300; x <= W + 300; x += 20) pts.push([x, hillY(x, top)]);
  ctx.save();
  ctx.fillStyle = vgrad(ctx, top - 20, H + 50, [[0, '#d9b8e6'], [0.35, '#b98fd0'], [1, '#6e4f9a']]);
  ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.lineTo(W + 300, H + 300); ctx.lineTo(-300, H + 300); ctx.closePath(); ctx.fill();
  ctx.clip(); speckle(ctx, 0.25);
  ctx.strokeStyle = 'rgba(60,30,90,0.22)'; ctx.lineWidth = 1.3;
  for (let i = 1; i < 14; i++) { ctx.beginPath(); for (let x = -300; x <= W + 300; x += 30) { const y = hillY(x, top) + i * i * 4 + 10; x === -300 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.restore();
  stroke(ctx, pts, { w: 3.2 });
  const r = mulberry32(8);
  ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 1.6;
  for (let i = 0; i < 40; i++) { const x = r() * W, y = hillY(x, top) + 6 + r() * 40, h = 8 + r() * 14, sw = Math.sin(t * 1.3 + x * 0.01) * 2; ctx.beginPath(); for (let k = -2; k <= 2; k++) { ctx.moveTo(x + k * 3, y); ctx.quadraticCurveTo(x + k * 4, y - h * 0.6, x + k * 6 + sw, y - h * (1 - Math.abs(k) * 0.15)); } ctx.stroke(); }
  ctx.restore();
}
// darken the lower band so subtitles always read
function subBand(ctx, a = 1) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  const g = ctx.createLinearGradient(0, 1340, 0, 1620); g.addColorStop(0, 'rgba(6,8,30,0)'); g.addColorStop(0.5, 'rgba(6,8,30,0.5)'); g.addColorStop(1, 'rgba(6,8,30,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 1340, W, 280); ctx.restore();
}

// ---------- the observer: a seated figure, front view ----------
function meditator(ctx, x, y, s, o = {}) {
  const col = o.sil ?? '#2f2c63', hi = o.sil ? o.sil : '#4a4590', lw = (o.lw ?? 3.4) / s, t = o.t ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= o.alpha ?? 1;
  const br = Math.sin(t * 1.2) * 2.5; // slow breath
  // crossed legs
  blob(ctx, [[-170, -6], [-120, -66], [0, -58], [120, -66], [170, -6], [0, 14]], col, { w: lw, n: 6 });
  if (!o.sil) { ctx.strokeStyle = 'rgba(10,8,30,0.5)'; ctx.lineWidth = 2 / s; ctx.beginPath(); ctx.moveTo(-110, -30); ctx.quadraticCurveTo(0, 10, 110, -30); ctx.stroke(); }
  // torso (robe)
  const torso = smoothPts([[-92, -50], [-78, -190 - br], [-40, -222 - br], [40, -222 - br], [78, -190 - br], [92, -50]], true, 6);
  shape(ctx, torso, col, { w: lw });
  if (!o.sil) {
    ctx.save(); ctx.beginPath(); torso.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.clip();
    ctx.fillStyle = hi; ctx.beginPath(); ctx.ellipse(-70, -130, 30, 110, 0.1, 0, TAU); ctx.fill(); ctx.restore();
    shape(ctx, torso, null, { w: lw });
    ctx.strokeStyle = 'rgba(10,8,30,0.55)'; ctx.lineWidth = 2 / s; ctx.beginPath(); ctx.moveTo(-30, -220 - br); ctx.lineTo(10, -120); ctx.lineTo(40, -220 - br); ctx.stroke();
  }
  // arms resting on knees, hands in lap
  limb(ctx, [[-70, -200 - br], [-112, -110], [-60, -52]], [44, 34, 28], col, lw);
  limb(ctx, [[70, -200 - br], [112, -110], [60, -52]], [44, 34, 28], col, lw);
  blob(ctx, [[-44, -66], [0, -76], [44, -66], [0, -44]], o.sil ?? '#e7b48e', { w: lw, n: 4 });
  // neck + head
  shape(ctx, [[-16, -232 - br], [16, -232 - br], [14, -212 - br], [-14, -212 - br]], o.sil ?? '#d9a07c', { w: lw });
  ctx.beginPath(); ctx.ellipse(0, -276 - br, 44, 50, 0, 0, TAU); ctx.fillStyle = o.sil ?? '#e7b48e'; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = lw; ctx.stroke();
  if (!o.sil) {
    ctx.fillStyle = '#1f2747'; ctx.beginPath(); ctx.ellipse(0, -300 - br, 46, 30, 0, Math.PI, 0); ctx.fill(); ctx.stroke(); // hair cap
    ctx.strokeStyle = P.ink; ctx.lineWidth = 2.6 / s; // closed, calm eyes — or open, watching
    if (o.eyesOpen) { [-16, 16].forEach(dx => { ctx.fillStyle = '#1a1414'; ctx.beginPath(); ctx.arc(dx, -272 - br, 4, 0, TAU); ctx.fill(); }); }
    else { [-16, 16].forEach(dx => { ctx.beginPath(); ctx.arc(dx, -274 - br, 7, 0.2, Math.PI - 0.2); ctx.stroke(); }); }
    ctx.beginPath(); ctx.moveTo(-8, -248 - br); ctx.quadraticCurveTo(0, -244 - br, 8, -248 - br); ctx.stroke();
  }
  // the observing center
  const c = o.center ?? 0;
  if (c > 0) {
    const cy = o.centerY ?? -150;
    glow(ctx, 0, cy, 150 * c * (1 + 0.08 * Math.sin(t * 2.4)), GOLDG, c);
    ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.arc(0, cy, 11 * c, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// world coordinates of the meditator's heart
function heartOf(x, y, s) { return [x, y - 150 * s]; }

// rippling concentric rings around a point (the observing center motif)
function rings(ctx, x, y, t, k, o = {}) {
  if (k <= 0) return;
  const n = o.n ?? 4, R = o.R ?? 260, col = o.color ?? '255,214,110';
  ctx.save();
  for (let i = 0; i < n; i++) {
    const ph = ((t * (o.speed ?? 0.22) + i / n) % 1);
    const r = 30 + ph * R * k;
    ctx.globalAlpha = (1 - ph) * 0.8 * k;
    ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = 3; ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 30 * (i % 2 ? 1 : -1);
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}

// ---------- weather of the mind ----------
function cloud(ctx, x, y, w, h, o = {}) {
  const r = mulberry32(o.seed ?? 3), n = o.bumps ?? 6, lw = o.lw ?? 3.5;
  const puffs = [];
  for (let i = 0; i < n; i++) { const f = (i + 0.5) / n, rr = h * (0.34 + 0.22 * Math.sin(f * Math.PI)) * (0.85 + r() * 0.3); puffs.push([x - w / 2 + f * w, y - rr * 0.35 - Math.sin(f * Math.PI) * h * 0.18, rr]); }
  for (let i = 0; i < n - 1; i++) puffs.push([x - w / 2 + (i + 1) / n * w, y + h * 0.12, h * 0.3]);
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1;
  const all = (pad, col) => { ctx.fillStyle = col; ctx.beginPath(); puffs.forEach(([px, py, pr]) => { ctx.moveTo(px + pr + pad, py); ctx.arc(px, py, pr + pad, 0, TAU); }); ctx.fill(); };
  all(lw, o.stroke ?? P.ink); all(0, o.fill ?? STORM);
  if (o.shade !== false) { ctx.save(); ctx.beginPath(); puffs.forEach(([px, py, pr]) => { ctx.moveTo(px + pr, py); ctx.arc(px, py, pr, 0, TAU); }); ctx.clip();
    ctx.fillStyle = 'rgba(10,8,30,0.28)'; ctx.beginPath(); ctx.ellipse(x, y + h * 0.45, w * 0.62, h * 0.32, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)'; puffs.slice(0, n).forEach(([px, py, pr]) => { ctx.beginPath(); ctx.arc(px - pr * 0.25, py - pr * 0.3, pr * 0.45, 0, TAU); ctx.fill(); }); ctx.restore(); }
  if (o.text) handText(ctx, o.text, x, y + (o.textDY ?? 4), { size: o.textSize ?? 40, align: 'center', color: o.textColor ?? '#f4ecff', p: o.textP ?? 1, base: 'middle' });
  ctx.restore();
}
function rainfall(ctx, x0, y0, w, h, t, k = 1, o = {}) {
  if (k <= 0) return;
  const r = mulberry32(o.seed ?? 4), n = Math.round((o.n ?? 90) * k);
  ctx.save(); ctx.strokeStyle = o.color ?? 'rgba(200,210,255,0.75)'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * w, sp = 900 + r() * 500, ph = r();
    const y = y0 + ((t * sp / h + ph) % 1) * h;
    if (o.dome) { const [dx, dy, dr] = o.dome; const d = Math.hypot(x - dx, y - dy); if (d < dr && y < dy) { // deflect off the dome as a little splash
      ctx.save(); ctx.strokeStyle = 'rgba(255,220,140,0.8)'; ctx.beginPath(); ctx.arc(x, dy - Math.sqrt(Math.max(0, dr * dr - (x - dx) ** 2)), 6, Math.PI, TAU); ctx.stroke(); ctx.restore(); continue; } }
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 26); ctx.stroke();
  }
  ctx.restore();
}
function bolt(ctx, x, y, len, seed, a = 1) {
  if (a <= 0) return;
  const r = mulberry32(seed), pts = [[x, y]];
  for (let i = 1; i <= 7; i++) pts.push([x + (r() - 0.5) * 70, y + len * i / 7]);
  ctx.save(); ctx.globalAlpha *= a; ctx.shadowColor = '#fff6c8'; ctx.shadowBlur = 24;
  stroke(ctx, pts, { w: 9, color: P.ink }); stroke(ctx, pts, { w: 4.5, color: '#fff6c8' });
  ctx.restore();
}

// ---------- paper props ----------
function envelope(ctx, x, y, s, open = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, [[-160, -100], [160, -100], [160, 100], [-160, 100]], '#f3e3c0', { w: 4 });
  const fy = lerp(10, -230, E.inOut(open));
  if (open > 0.5) shape(ctx, [[-160, -100], [0, fy], [160, -100]], '#e8d2a6', { w: 4 });
  ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-160, 100); ctx.lineTo(-30, -10); ctx.moveTo(160, 100); ctx.lineTo(30, -10); ctx.stroke();
  if (open <= 0.5) shape(ctx, [[-160, -100], [0, fy], [160, -100]], '#e8d2a6', { w: 4 });
  ctx.restore();
}
function bodyOutline(ctx, x, y, s, o = {}) {
  // front-facing standing body, drawn as a diagram outline on paper (origin at feet)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= o.alpha ?? 1;
  const slump = o.slump ?? 0;
  const pts = [[0, -760 + slump * 30], [-60, -740 + slump * 30], [-60, -680 + slump * 30], [-30, -640 + slump * 26], [-120, -610 + slump * 40], [-150, -560 + slump * 30], [-170, -330], [-140, -320], [-110, -520],
    [-100, -360], [-110, -10], [-30, -10], [0, -330], [30, -10], [110, -10], [100, -360], [110, -520], [140, -320], [170, -330], [150, -560 + slump * 30], [120, -610 + slump * 40], [30, -640 + slump * 26], [60, -680 + slump * 30], [60, -740 + slump * 30]];
  const sh = smoothPts(pts, true, 5);
  shape(ctx, sh, o.fill ?? 'rgba(255,255,255,0.55)', { w: (o.lw ?? 4) / s, stroke: o.stroke ?? P.navy });
  ctx.restore();
}
function heartShape(ctx, x, y, s, fill = '#e2525e', a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -40, -60, 0, -30); ctx.bezierCurveTo(40, -60, 60, -10, 0, 30); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 4 / s; ctx.stroke();
  ctx.restore();
}

// ---------- titling ----------
function seriesTag(ctx, title, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  ctx.font = font(30, 'Cinzel', '700'); ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,236,190,0.92)';
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10;
  ctx.fillText(title, W / 2, 196);
  const w = ctx.measureText(title).width;
  ctx.strokeStyle = 'rgba(255,214,110,0.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - w / 2 - 90, 186); ctx.lineTo(W / 2 - w / 2 - 20, 186); ctx.moveTo(W / 2 + w / 2 + 20, 186); ctx.lineTo(W / 2 + w / 2 + 90, 186); ctx.stroke();
  ctx.restore();
}
function paperV(ctx, a = 1) {
  // paper texture is 1080×1920 here because W/H are vertical
  drawPaper(ctx, a); paperGrid(ctx, 0.5 * a);
}
// handwritten label on paper, centred
function label(ctx, txt, x, y, p, o = {}) { handText(ctx, txt, x, y, { size: o.size ?? 52, align: 'center', color: o.color ?? P.navy, p, alpha: o.alpha ?? 1, fam: o.fam, style: o.style, glow: o.glow }); }
