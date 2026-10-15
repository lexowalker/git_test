// Ghost Green-Eye — illustrated world: landscapes, stags, props. Flat Technicolor fills + ink contour (Moebius / cel).
'use strict';

function shape(ctx, pts, fill, o = {}) {
  ctx.beginPath();
  pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
  if (o.close !== false) ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (o.line !== false) { ctx.strokeStyle = o.stroke ?? P.ink; ctx.lineWidth = o.w ?? 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
// smooth closed shape through control points (Catmull-Rom → bezier)
function smoothPts(pts, closed = true, n = 8) {
  const out = [], L = pts.length;
  const get = i => closed ? pts[(i + L) % L] : pts[clamp(i, 0, L - 1)];
  const last = closed ? L : L - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  if (!closed) out.push(pts[L - 1]);
  return out;
}
function blob(ctx, ctrl, fill, o = {}) { shape(ctx, smoothPts(ctrl, true, o.n ?? 8), fill, o); }
function vgrad(ctx, y0, y1, stops) { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }

// ---------------- LANDSCAPE ----------------
// Moebius night plateau. o.mood: 0 normal; o.ghost: 0..1 desaturate toward ink-blue.
function drawSky(ctx, t, o = {}) {
  const hz = o.horizon ?? 640;
  ctx.fillStyle = vgrad(ctx, -200, hz, [[0, '#071344'], [0.45, P.skyMid], [0.85, P.skyLow], [1, P.skyHorizon]]);
  ctx.fillRect(-W, -H, W * 3, hz + H + 10);
  stars(ctx, t, { seed: o.seed ?? 11, n: o.n ?? 420, x: -200, y: -150, w: W + 400, h: hz - 40, alpha: o.starAlpha ?? 1 });
  // a bright guide star (like the reference) — later reads as a distant eye
  const gx = o.starX ?? 1520, gy = o.starY ?? 150;
  glow(ctx, gx, gy, 40, 'rgba(255,255,255,', 0.8);
  ctx.save(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.moveTo(gx - 22, gy); ctx.lineTo(gx + 22, gy); ctx.moveTo(gx, gy - 22); ctx.lineTo(gx, gy + 22); ctx.stroke(); ctx.restore();
}
function crystalCluster(ctx, x, y, s, seed = 3, lit = 0) {
  const r = mulberry32(seed);
  // rocky mound
  const mound = [];
  for (let i = 0; i <= 14; i++) { const a = Math.PI + Math.PI * i / 14; mound.push([x + Math.cos(a) * 260 * s * (0.9 + r() * 0.2), y + Math.sin(a) * 120 * s * (0.8 + r() * 0.4)]); }
  shape(ctx, mound, '#5a4a9a', { w: 2.5 });
  // stipple the mound
  ctx.save(); ctx.fillStyle = 'rgba(25,20,55,0.35)';
  for (let i = 0; i < 260; i++) { const a = Math.PI + r() * Math.PI, rr = Math.sqrt(r()); ctx.beginPath(); ctx.arc(x + Math.cos(a) * 240 * s * rr, y + Math.sin(a) * 105 * s * rr, 1.2 * s + 0.4, 0, TAU); ctx.fill(); }
  ctx.restore();
  // crystals
  const cs = [[-150, 120, -0.18], [-80, 260, -0.06], [0, 360, 0.02], [60, 300, 0.12], [130, 170, 0.22], [-30, 190, -0.3], [190, 100, 0.3]];
  cs.forEach(([dx, hgt, lean], i) => {
    const bx = x + dx * s, by = y - 40 * s, w = (30 + r() * 22) * s, hh = hgt * s;
    const tipx = bx + Math.sin(lean) * hh, tipy = by - Math.cos(lean) * hh;
    const pts = [[bx - w, by], [bx - w + Math.sin(lean) * hh * 0.82, by - Math.cos(lean) * hh * 0.82], [tipx, tipy], [bx + w + Math.sin(lean) * hh * 0.8, by - Math.cos(lean) * hh * 0.8], [bx + w, by]];
    const g = ctx.createLinearGradient(0, tipy, 0, by);
    g.addColorStop(0, '#f4fdff'); g.addColorStop(0.55, '#bfeefc'); g.addColorStop(1, lit ? '#ffe9a0' : '#7fc3e8');
    shape(ctx, pts, g, { w: 2.2 });
    ctx.save(); ctx.strokeStyle = 'rgba(30,60,110,0.55)'; ctx.lineWidth = 1.2; ctx.beginPath();
    ctx.moveTo(lerp(bx, tipx, 0.1), by - 4); ctx.lineTo(tipx, tipy); ctx.moveTo(bx + w * 0.4, by); ctx.lineTo(lerp(bx + w, tipx, 0.75), lerp(by, tipy, 0.75)); ctx.stroke(); ctx.restore();
  });
}
function mesa(ctx, x, y, w, h, col = '#e79a86', seed = 2) {
  const r = mulberry32(seed);
  const pts = [[x - w / 2 - 20, y], [x - w / 2, y - h * 0.7], [x - w / 2 + 12, y - h], [x + w / 2 - 15, y - h - 6], [x + w / 2, y - h * 0.65], [x + w / 2 + 25, y]];
  shape(ctx, smoothPts(pts, false, 6).concat([[x + w / 2 + 25, y]]), col, { w: 2.2 });
  ctx.save(); ctx.strokeStyle = 'rgba(80,30,40,0.35)'; ctx.lineWidth = 1.1;
  for (let i = 0; i < 6; i++) { const yy = y - h * (0.2 + i * 0.13); ctx.beginPath(); ctx.moveTo(x - w / 2 + 10 + r() * 10, yy); ctx.quadraticCurveTo(x, yy + 6, x + w / 2 - r() * 12, yy - 2); ctx.stroke(); }
  ctx.restore();
}
function drawLand(ctx, t, o = {}) {
  const hz = o.horizon ?? 640;
  // far mountain band
  const far = smoothPts([[-300, hz + 10], [-200, hz - 40], [100, hz - 70], [380, hz - 30], [650, hz - 55], [900, hz - 20], [1250, hz - 50], [1600, hz - 35], [1900, hz - 75], [2200, hz - 20], [2300, hz + 10]], false, 6);
  shape(ctx, far.concat([[2300, hz + 40], [-300, hz + 40]]), '#7466b8', { w: 2 });
  if (!o.noCrystal) crystalCluster(ctx, o.crystalX ?? 1360, hz + 18, o.crystalS ?? 0.55, 5, 1);
  if (!o.noMesa) { mesa(ctx, 260, hz + 26, 170, 95, '#d98aa0', 4); mesa(ctx, 1850, hz + 20, 120, 70, '#e79a86', 6); }
  // plain
  ctx.fillStyle = vgrad(ctx, hz, H + 200, [[0, '#a9b6e6'], [0.5, '#bdb2e4'], [1, '#d4b6e2']]);
  ctx.beginPath(); ctx.rect(-W, hz + 14, W * 3, H * 2); ctx.fill();
  ctx.save(); ctx.strokeStyle = 'rgba(40,40,90,0.18)'; ctx.lineWidth = 1.2;
  for (let i = 0; i < 9; i++) { const y = hz + 30 + i * i * 6; ctx.beginPath(); ctx.moveTo(-200, y); for (let x = -200; x < W + 200; x += 80) ctx.lineTo(x, y + vnoise(x * 0.004 + i, 4) * 6); ctx.stroke(); }
  ctx.restore();
  ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-W, hz + 14); ctx.lineTo(W * 2, hz + 14); ctx.stroke(); ctx.restore();
}
// foreground ridge on which actors stand; returns y at x
function ridgeY(x, base = 800) { return base - 38 * Math.sin((x + 200) / 900 * Math.PI) + vnoise(x * 0.003, 2) * 10; }
function drawRidge(ctx, t, o = {}) {
  const base = o.base ?? 800;
  const pts = []; for (let x = -400; x <= W + 400; x += 20) pts.push([x, ridgeY(x, base)]);
  const poly = pts.concat([[W + 400, H + 400], [-400, H + 400]]);
  ctx.save();
  ctx.fillStyle = vgrad(ctx, base - 60, H + 100, [[0, '#d9b8e6'], [0.4, '#c69ad6'], [1, '#9d78c2']]);
  ctx.beginPath(); poly.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill();
  ctx.clip(); speckle(ctx, 0.25);
  // contour hatching
  ctx.strokeStyle = 'rgba(60,30,90,0.22)'; ctx.lineWidth = 1.3;
  for (let i = 1; i < 12; i++) { ctx.beginPath(); for (let x = -400; x <= W + 400; x += 30) { const y = ridgeY(x, base) + i * i * 4 + 8; x === -400 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.restore();
  stroke(ctx, pts, { w: 3.2 });
  // grass tufts
  const r = mulberry32(21);
  ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 1.6;
  for (let i = 0; i < 70; i++) {
    const x = -300 + r() * (W + 600), y = ridgeY(x, base) + 2 + r() * 30, h = 8 + r() * 14, sway = Math.sin(t * 1.3 + x * 0.01) * 2;
    ctx.beginPath(); for (let k = -2; k <= 2; k++) { ctx.moveTo(x + k * 3, y); ctx.quadraticCurveTo(x + k * 4, y - h * 0.6, x + k * 6 + sway, y - h * (1 - Math.abs(k) * 0.15)); } ctx.stroke();
  }
  ctx.restore();
}
function drawMoon(ctx, x, y, r, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  glow(ctx, x, y, r * 4, 'rgba(220,235,255,', 0.35);
  ctx.fillStyle = '#f3f1ff'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(160,170,220,0.35)';
  [[-0.3, -0.2, 0.22], [0.25, 0.1, 0.16], [0.0, 0.4, 0.12], [-0.35, 0.35, 0.08]].forEach(([dx, dy, rr]) => { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, rr * r, 0, TAU); ctx.fill(); });
  ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.restore();
}

// ---------------- STAG ----------------
// pose: { walk: phase (radians) or null, head: 0 (up) .. 1 (lowered, antlers forward), scale, flip, sil: colour (silhouette), alpha, eyeGlow, hind }
function limb(ctx, joints, widths, fill, lineW) {
  const L = [], R = [];
  for (let i = 0; i < joints.length; i++) {
    const a = joints[Math.max(0, i - 1)], b = joints[Math.min(joints.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const w = widths[i] / 2;
    L.push([joints[i][0] + nx * w, joints[i][1] + ny * w]); R.push([joints[i][0] - nx * w, joints[i][1] - ny * w]);
  }
  shape(ctx, smoothPts(L, false, 4).concat(smoothPts(R.reverse(), false, 4)), fill, { w: lineW });
}
function chain(start, segs) { const out = [start]; let p = start; for (const [a, l] of segs) { p = [p[0] + Math.sin(a) * l, p[1] + Math.cos(a) * l]; out.push(p); } return out; }
function hoof(ctx, p, ang, fill, lw) {
  ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(-ang * 0.5);
  shape(ctx, [[-6, -8], [6, -8], [11, 2], [-7, 2]], fill, { w: lw }); ctx.restore();
}
function antlerBeam(ctx, base, rot, s, lw, col) {
  ctx.save(); ctx.translate(base[0], base[1]); ctx.rotate(rot); ctx.scale(s, s);
  const beam = bez3([0, 0], [-34, -40], [-46, -112], [4, -168], 24);
  const tines = [[0.07, [42, -14], 0.9], [0.22, [38, -26], 0.8], [0.48, [36, -40], 0.75], [0.78, [26, -38], 0.6], [1.0, [-12, -30], 0.55], [1.0, [18, -26], 0.55]];
  const pass = (extra, c) => {
    ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 1; i < beam.length; i++) { ctx.lineWidth = lerp(11, 5, i / beam.length) + extra; ctx.beginPath(); ctx.moveTo(beam[i - 1][0], beam[i - 1][1]); ctx.lineTo(beam[i][0], beam[i][1]); ctx.stroke(); }
    tines.forEach(([f, [dx, dy], w]) => {
      const q = beam[Math.round(f * (beam.length - 1))];
      ctx.lineWidth = 6 * w + extra; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.quadraticCurveTo(q[0] + dx * 0.7, q[1] + dy * 0.15, q[0] + dx, q[1] + dy); ctx.stroke();
    });
  };
  pass(lw * 2, P.ink); pass(0, col);
  ctx.restore();
}
function drawStag(ctx, x, y, pose = {}) {
  const s = pose.scale ?? 1, flip = pose.flip ? -1 : 1, ph = pose.walk, hd = pose.head ?? 0, hind = !!pose.hind;
  const sil = pose.sil, lw = (pose.lw ?? 3.2) / s;
  const C = sil ? { body: sil, shade: sil, far: sil, cream: sil, dark: sil, antler: sil, antlerFar: sil, ruff: sil } :
    { body: hind ? '#c8864e' : '#b4643a', shade: hind ? '#9e6138' : '#7f4225', far: hind ? '#8f5530' : '#6c3720', cream: '#f0dcb2', dark: '#2e1d16', antler: '#f1e4c6', antlerFar: '#cdbb98', ruff: '#6a3a22' };
  ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s); ctx.globalAlpha *= pose.alpha ?? 1;
  const tt = pose.t ?? 0, breathe = Math.sin(tt * 2.2) * 1.4;
  const sw = a => (ph == null ? 0 : Math.sin(ph + a));
  const lift = a => (ph == null ? 0 : Math.max(0, Math.sin(ph + a)));
  ctx.translate(0, ph != null ? -Math.abs(Math.cos(ph)) * 3 : 0);
  const hindLeg = (hip, a) => chain(hip, [[0.32 + 0.28 * sw(a), 52], [-0.58 - 0.25 * lift(a + 0.4), 50], [0.1 + 0.3 * sw(a + 0.9), 50], [0.45, 10]]);
  const frontLeg = (sh, a) => chain(sh, [[-0.12 + 0.3 * sw(a), 40], [0.04 + 0.1 * sw(a), 54], [0.02 + 0.45 * lift(a + 0.6) + 0.15 * sw(a), 48], [0.4, 10]]);
  const HW = [42, 26, 13, 10, 9], FW = [30, 19, 12, 10, 9];
  const hb = hind ? 0.85 : 1;
  const legs = { hf: hindLeg([-92, -150], Math.PI), ff: frontLeg([82, -150], 0.4), hn: hindLeg([-102, -148], 0), fn: frontLeg([92, -148], Math.PI + 0.4) };
  limb(ctx, legs.hf, HW.map(w => w * hb), C.far, lw); hoof(ctx, legs.hf[4], 0, C.dark, lw);
  limb(ctx, legs.ff, FW.map(w => w * hb), C.far, lw); hoof(ctx, legs.ff[4], 0, C.dark, lw);
  // body: high withers, sloping back, deep chest, tucked belly
  const body = smoothPts(hind ? [[-138, -168], [-120, -196], [-40, -200 + breathe * 0.4], [55, -206], [100, -196], [122, -168], [108, -138], [60, -130], [-20, -130 - breathe], [-90, -134], [-132, -146]]
    : [[-140, -170], [-122, -200], [-40, -204 + breathe * 0.4], [40, -214], [82, -222], [128, -196], [136, -158], [112, -126], [50, -118], [-20, -124 - breathe], [-90, -128], [-134, -142]], true, 8);
  shape(ctx, body, C.body, { w: lw });
  if (!sil) {
    ctx.save(); ctx.beginPath(); body.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.clip();
    ctx.fillStyle = C.shade; ctx.beginPath(); ctx.ellipse(0, -110, 170, 32, 0.03, 0, TAU); ctx.fill();
    ctx.fillStyle = C.cream; ctx.beginPath(); ctx.ellipse(-142, -168, 20, 30, 0.25, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(40,20,10,0.32)'; ctx.lineWidth = 1.2 / s;
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-96 + i * 24, -196 + (i % 2) * 6); ctx.quadraticCurveTo(-88 + i * 24, -176, -98 + i * 24, -160); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-70, -196); ctx.quadraticCurveTo(-118, -170, -104, -132); ctx.stroke();
    ctx.restore(); shape(ctx, body, null, { w: lw });
  }
  limb(ctx, legs.hn, HW.map(w => w * hb), C.body, lw); hoof(ctx, legs.hn[4], 0, C.dark, lw);
  limb(ctx, legs.fn, FW.map(w => w * hb), C.body, lw); hoof(ctx, legs.fn[4], 0, C.dark, lw);
  if (!sil) { ctx.save(); ctx.strokeStyle = 'rgba(40,20,10,0.35)'; ctx.lineWidth = 1.2 / s; ctx.beginPath(); ctx.moveTo(-112, -140); ctx.quadraticCurveTo(-96, -112, -110, -96); ctx.stroke(); ctx.restore(); }
  shape(ctx, [[-138, -186], [-156, -176], [-150, -158]], sil ? sil : C.cream, { w: lw });
  // neck + head rotate about neck root
  ctx.save();
  ctx.translate(96, -186); ctx.rotate(hd * 0.9 + (pose.nod ?? 0)); ctx.translate(-96, 186);
  const neck = smoothPts(hind ? [[66, -204], [118, -262], [148, -302], [176, -300], [170, -270], [140, -214], [124, -166], [96, -160]]
    : [[52, -214], [104, -266], [136, -302], [172, -304], [176, -270], [154, -222], [138, -168], [100, -150]], true, 6);
  shape(ctx, neck, C.body, { w: lw });
  if (!sil) {
    ctx.save(); ctx.beginPath(); neck.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.clip();
    ctx.fillStyle = C.cream; ctx.beginPath(); ctx.ellipse(168, -262, 10, 26, -0.45, 0, TAU); ctx.fill();
    ctx.restore(); shape(ctx, neck, null, { w: lw });
    if (!hind) { // shaggy rut ruff under the neck
      const ruff = [[174, -270]]; for (let i = 0; i <= 5; i++) { const f = i / 5; ruff.push([lerp(176, 142, f) + 16, lerp(-258, -172, f) + 4], [lerp(170, 136, f + 0.1) + 4, lerp(-258, -172, f + 0.1)]); }
      ruff.push([132, -168]);
      shape(ctx, smoothPts(ruff, false, 4), C.ruff, { w: lw * 0.8, close: false });
    }
  }
  const earL = hind ? 46 : 34;
  const ear = smoothPts([[150, -308], [150 - earL * 0.5, -318 - earL * 0.35], [148 - earL, -306 - earL * 0.62], [146 - earL * 0.55, -296 - earL * 0.2], [142, -294]], true, 5);
  shape(ctx, ear, C.body, { w: lw });
  if (!sil) { ctx.fillStyle = '#e8b9a0'; ctx.beginPath(); ctx.ellipse(150 - earL * 0.55, -304 - earL * 0.3, earL * 0.28, 4, -0.55, 0, TAU); ctx.fill(); }
  const head = smoothPts([[140, -300], [160, -322], [192, -318], [230, -296], [248, -282], [244, -268], [222, -264], [188, -270], [158, -280]], true, 6);
  shape(ctx, head, C.body, { w: lw });
  if (!sil) {
    ctx.fillStyle = C.dark; ctx.beginPath(); ctx.ellipse(243, -278, 6, 6, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = C.cream; ctx.beginPath(); ctx.ellipse(226, -268, 14, 4, 0.1, 0, TAU); ctx.fill();
  }
  const eg = pose.eyeGlow ?? 0;
  if (!sil || eg > 0) {
    ctx.fillStyle = eg > 0.05 ? '#3dffa0' : C.dark; ctx.beginPath(); ctx.ellipse(186, -299, 6, 4.5, -0.2, 0, TAU); ctx.fill();
    if (!sil) { ctx.strokeStyle = P.ink; ctx.lineWidth = 1.6 / s; ctx.beginPath(); ctx.moveTo(175, -302); ctx.quadraticCurveTo(186, -308, 197, -301); ctx.stroke(); }
    if (eg > 0) glow(ctx, 186, -299, 46 * eg, P.greenGlow, eg);
  }
  if (!hind) {
    antlerBeam(ctx, [168, -316], 0.18, 1.0, lw, C.antlerFar);
    antlerBeam(ctx, [176, -314], -0.08, 1.06, lw, C.antler);
  }
  ctx.restore();
  ctx.restore();
}
// ground shadow
function shadow(ctx, x, y, w, a = 0.25) { ctx.save(); ctx.fillStyle = `rgba(40,20,70,${a})`; ctx.beginPath(); ctx.ellipse(x, y, w, w * 0.12, 0, 0, TAU); ctx.fill(); ctx.restore(); }
