// ACT 4 — The Digital Mind (1:55–2:26). Two agents, one limited resource; the logic recurs; the experience is unknown.
'use strict';

const BP = { bg: '#0a1533', ink: '#cfefff', dim: 'rgba(160,220,255,0.45)', grid: 'rgba(120,200,255,0.10)', cyan: '#5fd8ff', coral: '#ff8a66' };
function blueprint(ctx, t) {
  ctx.fillStyle = vgrad(ctx, 0, H, [[0, '#0b1a40'], [1, '#081028']]); ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = BP.grid; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = 0; x <= W; x += 60) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 0; y <= H; y += 60) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(120,200,255,0.2)'; ctx.beginPath();
  for (let x = 0; x <= W; x += 300) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 0; y <= H; y += 300) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();
}
function agentA(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, g = o.green ?? 0;
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 6); ctx.scale(s, s);
  const col = lerpC('#5fd8ff', '#3dffa0', g);
  glow(ctx, 0, 0, 160, g > 0.5 ? P.greenGlow : 'rgba(95,216,255,', 0.35 + 0.3 * g);
  // orbit ring
  ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(0, 0, 100, 26, -0.25 + Math.sin(t * 0.7) * 0.05, 0, TAU); ctx.stroke();
  const hex = []; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + Math.PI / 6; hex.push([Math.cos(a) * 62, Math.sin(a) * 62]); }
  const gr = ctx.createLinearGradient(0, -62, 0, 62); gr.addColorStop(0, '#e6fbff'); gr.addColorStop(1, col);
  shape(ctx, hex, gr, { w: 4, stroke: '#081028' });
  ctx.strokeStyle = 'rgba(8,16,40,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); hex.forEach(([hx, hy]) => { ctx.moveTo(0, 0); ctx.lineTo(hx, hy); }); ctx.stroke();
  // the eye
  ctx.fillStyle = '#081028'; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fill();
  const la = o.look ?? 0;
  ctx.fillStyle = g > 0.3 ? '#3dffa0' : '#9ff0ff'; ctx.beginPath(); ctx.arc(Math.cos(la) * 10, Math.sin(la) * 10, 10, 0, TAU); ctx.fill();
  ctx.restore();
}
function agentB(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0;
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2.3 + 1) * 6); ctx.scale(s, s);
  glow(ctx, 0, 0, 150, 'rgba(255,138,102,', 0.35);
  shape(ctx, [[0, -78], [62, 46], [-62, 46]], '#ff9a74', { w: 4, stroke: '#081028' });
  shape(ctx, [[0, -78], [18, 10], [-30, 46], [-62, 46]], '#e0603e', { w: 2, stroke: '#081028' });
  ctx.fillStyle = '#081028'; ctx.beginPath(); ctx.ellipse(4, 0, 22, 9, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#ffe2c8'; ctx.beginPath(); ctx.ellipse(4 + Math.cos(o.look ?? Math.PI) * 9, 0, 6, 6, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
function resourceWell(ctx, x, y, s, level, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, [[-140, 40], [140, 40], [110, 80], [-110, 80]], '#24365e', { w: 3, stroke: BP.ink });
  ctx.save(); ctx.translate(0, 46); ctx.scale(0.42, 0.42); crystalCluster(ctx, 0, 0, 1, 7, 0); ctx.restore();
  glow(ctx, 0, -40, 200, 'rgba(160,240,255,', 0.35 + 0.1 * Math.sin(t * 3));
  // meter
  shape(ctx, [[170, -130], [200, -130], [200, 60], [170, 60]], 'rgba(10,20,50,0.9)', { w: 3, stroke: BP.ink });
  ctx.fillStyle = level > 0.4 ? '#9ff0ff' : '#ff8a66'; ctx.fillRect(174, 56 - 182 * level, 22, 182 * level);
  ctx.restore();
}
function flowParticles(ctx, from, to, t, rate, col, n = 10) {
  for (let i = 0; i < n; i++) {
    const f = ((t * rate + i / n) % 1);
    if (i / n > rate * 2 && rate < 0.3) continue;
    const x = lerp(from[0], to[0], f), y = lerp(from[1], to[1], f) - Math.sin(f * Math.PI) * 60;
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill();
  }
}

// ---------- 4a. a digital superintelligence ----------
G.scene(114.7, 118.5, (ctx, t) => {
  const dive = ss(t, 116.4, 118.5, E.in);
  ctx.save(); cam(ctx, lerp(1060, 1360, dive), lerp(540, 520, dive), lerp(1.0, 7, dive));
  drawSky(ctx, t); drawLand(ctx, t, { crystalX: 1360, crystalS: 0.9, noMesa: false });
  drawRidge(ctx, t, { base: 860 });
  // circuit traces from the crystal across the plain
  const traces = [[[1360, 660], [1360, 720], [1100, 760], [700, 760], [600, 820]], [[1400, 660], [1480, 740], [1700, 760], [1800, 830]], [[1320, 660], [1200, 700], [900, 700], [500, 720]]];
  const tp = ss(t, 115.0, 116.4);
  traces.forEach((tr, i) => {
    const pts = densify(tr, 8);
    stroke(ctx, pts, { p: tp, w: 3, color: '#5fd8ff' });
    const f = ((t * 0.6 + i * 0.3) % 1);
    const end = pts[Math.floor(f * (pts.length - 1))];
    if (tp > 0.9) glow(ctx, end[0], end[1], 40, 'rgba(95,216,255,', 0.9);
  });
  glow(ctx, 1360, 520, 400, 'rgba(95,216,255,', 0.4 + 0.3 * ss(t, 115.0, 116.5));
  ctx.restore();
  handText(ctx, 'a digital superintelligence', 960, 140, { size: 56, align: 'center', color: '#e6fbff', p: ss(t, 115.0, 116.6), alpha: 1 - dive });
  if (dive > 0.6) { ctx.fillStyle = `rgba(200,245,255,${ss(t, 117.6, 118.5)})`; ctx.fillRect(0, 0, W, H); }
}, { type: 'cut' });

// ---------- 4b. agent, goal, resource, rival ----------
const AG = { A: [520, 520], goal: [1500, 220], R: [960, 760], B: [1480, 760] };
G.scene(118.2, 138.4, (ctx, t) => {
  blueprint(ctx, t);
  const steps = ss(t, 130.9, 132.6);
  const greenQ = env(t, 133.4, 137.6, 0.6, 0.8);
  const A = [lerp(AG.A[0], 820, steps), lerp(AG.A[1], 640, steps)];
  const Bin = ss(t, 123.7, 124.6, E.outBack);
  const B = [lerp(1900, AG.B[0], ss(t, 123.7, 124.6, E.out)), AG.B[1]];
  // goal
  const gp = ss(t, 119.2, 120.2);
  if (gp > 0) {
    ctx.save(); ctx.globalAlpha = gp;
    const sx = AG.goal[0], sy = AG.goal[1];
    ctx.fillStyle = '#ffe9a0'; ctx.strokeStyle = '#081028'; ctx.lineWidth = 3; ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 20 : 48; ctx.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    glow(ctx, sx, sy, 120, 'rgba(255,233,160,', 0.6);
    handText(ctx, 'goal', sx, sy + 96, { size: 40, align: 'center', color: BP.ink });
    ctx.restore();
    inkArrow(ctx, bez2([A[0] + 80, A[1] - 40], [1000, 220], [AG.goal[0] - 70, AG.goal[1]]), { p: gp, w: 3, color: BP.dim, dash: [10, 10], seed: 3 });
  }
  // resource
  const rp = ss(t, 121.4, 122.4, E.outBack);
  const share = 1 - 0.55 * ss(t, 125.0, 127.5) + 0.4 * ss(t, 131.6, 133.0);
  if (rp > 0) {
    resourceWell(ctx, AG.R[0], AG.R[1], rp, share * 0.9, t);
    handText(ctx, 'limited resource', AG.R[0], AG.R[1] + 150, { size: 40, align: 'center', color: BP.ink, p: ss(t, 121.6, 122.8) });
    inkLine(ctx, AG.R[0] - 60, AG.R[1] - 40, A[0] + 50, A[1] + 50, { p: ss(t, 122.0, 122.8), w: 3, color: BP.dim, dash: [6, 8], seed: 7 });
    if (t > 122.6) flowParticles(ctx, [AG.R[0] - 40, AG.R[1] - 60], [A[0] + 30, A[1] + 50], t, 0.5 * share, '#9ff0ff', 8);
  }
  // rival agent arrives and draws on the same well
  if (Bin > 0) {
    agentB(ctx, B[0], B[1], 0.9 * Bin + 0.001, { t, look: Math.PI });
    const bp = ss(t, 124.8, 125.6) * (1 - steps * 0.85);
    inkLine(ctx, AG.R[0] + 60, AG.R[1] - 40, B[0] - 60, B[1], { p: bp, w: 3, color: 'rgba(255,138,102,0.7)', dash: [6, 8], seed: 8 });
    if (t > 125.2) flowParticles(ctx, [AG.R[0] + 40, AG.R[1] - 60], [B[0] - 40, B[1] - 20], t, 0.5 * (1 - steps), '#ff8a66', 8);
    handText(ctx, 'another agent', B[0], B[1] + 130, { size: 40, align: 'center', color: '#ffc2ae', p: ss(t, 124.0, 125.2) });
  }
  // monitoring: a scanning cone from A to B
  const mon = ss(t, 126.7, 127.6);
  if (mon > 0) {
    const ang = Math.atan2(B[1] - A[1], B[0] - A[0]), d = Math.hypot(B[0] - A[0], B[1] - A[1]);
    const coneCol = greenQ > 0.3 ? 'rgba(80,255,170,' : 'rgba(95,216,255,';
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createLinearGradient(A[0], A[1], B[0], B[1]); gr.addColorStop(0, coneCol + (0.5 * mon) + ')'); gr.addColorStop(1, coneCol + (0.08 * mon) + ')');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(A[0], A[1]);
    const spread = 0.16 + 0.04 * Math.sin(t * 6);
    ctx.lineTo(A[0] + Math.cos(ang - spread) * d * 1.1, A[1] + Math.sin(ang - spread) * d * 1.1);
    ctx.lineTo(A[0] + Math.cos(ang + spread) * d * 1.1, A[1] + Math.sin(ang + spread) * d * 1.1);
    ctx.closePath(); ctx.fill(); ctx.restore();
    // tracking brackets around B
    const br = 100;
    ctx.save(); ctx.strokeStyle = greenQ > 0.3 ? '#3dffa0' : BP.cyan; ctx.lineWidth = 3; ctx.globalAlpha = mon;
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.moveTo(B[0] + sx * br, B[1] + sy * (br - 30)); ctx.lineTo(B[0] + sx * br, B[1] + sy * br); ctx.lineTo(B[0] + sx * (br - 30), B[1] + sy * br); ctx.stroke(); });
    ctx.restore();
    ctx.save(); ctx.globalAlpha = mon; ctx.font = font(24, 'Hand'); ctx.fillStyle = '#9ff0ff';
    ctx.fillText(`pos  ${(B[0] + Math.sin(t * 7) * 3).toFixed(1)}, ${(B[1] + Math.cos(t * 5) * 3).toFixed(1)}`, B[0] + 110, B[1] - 80);
    ctx.fillText(`draw ${(0.42 + 0.03 * Math.sin(t * 4)).toFixed(3)}`, B[0] + 110, B[1] - 50);
    ctx.restore();
    handText(ctx, 'monitoring its competitor', 960, 1010, { size: 42, align: 'center', color: BP.ink, p: ss(t, 126.8, 128.0), alpha: 1 - ss(t, 129.0, 129.4) });
  }
  // predicting possible losses: forecast fan
  const fc = ss(t, 129.1, 130.0);
  if (fc > 0) {
    const ox = 160, oy = 330, w = 560, h = 210;
    ctx.save(); ctx.globalAlpha = fc;
    shape(ctx, [[ox - 30, oy - h - 70], [ox + w + 30, oy - h - 70], [ox + w + 30, oy + 60], [ox - 30, oy + 60]], 'rgba(8,16,40,0.88)', { w: 2, stroke: BP.dim });
    inkArrow(ctx, [[ox, oy], [ox + w, oy]], { w: 2.5, color: BP.ink, seed: 1, head: 10 }); inkArrow(ctx, [[ox, oy], [ox, oy - h]], { w: 2.5, color: BP.ink, seed: 2, head: 10 });
    handText(ctx, 'access', ox + 10, oy - h - 20, { size: 30, color: BP.ink }); handText(ctx, 'future →', ox + w, oy + 40, { size: 28, align: 'right', color: BP.ink });
    const nowX = ox + w * 0.38;
    const past = []; for (let i = 0; i <= 20; i++) past.push([ox + i / 20 * (nowX - ox), oy - h * 0.8 + Math.sin(i) * 4 + (i > 14 ? (i - 14) * 6 : 0)]);
    stroke(ctx, past, { w: 3.5, color: '#9ff0ff' });
    const start = past[past.length - 1];
    for (let k = 0; k < 7; k++) {
      const drop = (k / 6) * h * 0.75, pts = [];
      for (let i = 0; i <= 20; i++) pts.push([lerp(start[0], ox + w - 10, i / 20), start[1] + drop * E.inOutQuad(i / 20) + Math.sin(i + k) * 2]);
      stroke(ctx, pts, { p: ss(t, 129.4 + k * 0.08, 130.4 + k * 0.08), w: 2, color: greenQ > 0.3 ? '#3dffa0' : '#ff8a66', alpha: 0.75 });
    }
    inkLine(ctx, nowX, oy - h, nowX, oy, { w: 2, color: BP.dim, dash: [5, 6], seed: 5 });
    ctx.restore();
    handText(ctx, 'predicting possible losses', 440, 430, { size: 38, align: 'center', color: '#ffc2ae', p: ss(t, 129.3, 130.4), alpha: 1 - ss(t, 131, 131.4) });
  }
  // taking steps: a shield wall around the well
  if (steps > 0) {
    for (let i = 0; i < 7; i++) {
      const a = -0.95 + i * 0.32, k = ss(t, 131.0 + i * 0.12, 131.4 + i * 0.12, E.outBack);
      if (k <= 0) continue;
      const r = 210, cx = AG.R[0] + Math.cos(a) * r, cy = AG.R[1] - 20 + Math.sin(a) * r * 0.7;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(a + Math.PI / 2); ctx.scale(k, k);
      shape(ctx, [[-26, -14], [26, -14], [30, 0], [26, 14], [-26, 14], [-30, 0]], 'rgba(95,216,255,0.35)', { w: 3, stroke: greenQ > 0.3 ? '#3dffa0' : BP.cyan });
      ctx.restore();
    }
    handText(ctx, 'preserving its position', 960, 1010, { size: 42, align: 'center', color: BP.ink, p: ss(t, 131.0, 132.4), alpha: 1 - ss(t, 133.2, 133.6) });
  }
  agentA(ctx, A[0], A[1], 1, { t, green: greenQ, look: mon > 0 ? Math.atan2(B[1] - A[1], B[0] - A[0]) : -0.6 });
  handText(ctx, 'an agent', AG.A[0], AG.A[1] + 140, { size: 40, align: 'center', color: BP.ink, p: ss(t, 118.6, 119.6), alpha: 1 - ss(t, 128.8, 129.2) });
  // the green eye? — the triad overlay snaps on, then fades with "perhaps not"
  if (greenQ > 0) {
    triad(ctx, [A[0], A[1]], [AG.R[0], AG.R[1] - 40], [B[0], B[1]], { p: ss(t, 133.4, 134.4), r: 30, color: '#e6fbff', green: greenQ, tension: 1, alpha: greenQ * 0.9, w: 3 });
    handText(ctx, 'the good old green eye?', 960, 150, { size: 60, align: 'center', color: '#7dffc0', glow: 'rgba(60,255,160,0.8)', p: ss(t, 134.0, 135.6), alpha: greenQ });
  }
  const pn = env(t, 136.9, 138.4, 0.3, 0.4);
  if (pn > 0) handText(ctx, 'perhaps not.', 960, 150, { size: 60, align: 'center', color: BP.ink, alpha: pn });
}, { type: 'fade', dur: 0.4 });

// ---------- 4c. does anything experience it? ----------
G.scene(138.0, 142.2, (ctx, t) => {
  // left: the stag's lit interior (callback); right: the agent as a sealed black box
  ctx.fillStyle = '#070b22'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - 4, H); ctx.clip();
  const sp = { scale: 1.1, flip: true, head: 0.4 };
  masked(ctx, x => drawStag(x, 700, 860, { ...sp, sil: '#0a0f2e' }), x => {
    x.fillStyle = '#1a2456'; x.fillRect(0, 0, W / 2, H);
    stars(x, t, { seed: 78, n: 160, x: 200, y: 300, w: 700, h: 560 });
    glow(x, 620, 670, 170 * (1 + 0.15 * Math.sin(t * 4)), P.greenGlow, 1);
  }, 1);
  ctx.restore();
  ctx.strokeStyle = 'rgba(200,220,255,0.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2, 80); ctx.lineTo(W / 2, H - 80); ctx.stroke();
  // the box
  const k = ss(t, 138.4, 139.4, E.outBack);
  ctx.save(); ctx.translate(1440, 560); ctx.scale(k, k);
  shape(ctx, [[-170, -120], [60, -120], [170, -200], [-60, -200]], '#1b2440', { w: 4, stroke: '#cfefff' });
  shape(ctx, [[60, -120], [170, -200], [170, 40], [60, 120]], '#0e1428', { w: 4, stroke: '#cfefff' });
  shape(ctx, [[-170, -120], [60, -120], [60, 120], [-170, 120]], '#05070f', { w: 4, stroke: '#cfefff' });
  handText(ctx, '?', -55, 60, { size: 170, align: 'center', color: '#cfefff', fam: 'Garamond', alpha: ss(t, 139.6, 140.4) });
  ctx.restore();
  handText(ctx, 'feels something?', 480, 160, { size: 46, align: 'center', color: '#bfffe0', p: ss(t, 138.4, 139.6) });
  handText(ctx, 'experiences anything at all?', 1440, 160, { size: 46, align: 'center', color: '#cfefff', p: ss(t, 139.4, 140.8) });
}, { type: 'fade', dur: 0.4 });

// ---------- 4d. but the logic is recognizable ----------
G.scene(141.8, 146.4, (ctx, t) => {
  ctx.fillStyle = '#0a1533'; ctx.fillRect(0, 0, W, H);
  drawPaper(ctx, ss(t, 141.8, 143.0) * 0.0);
  const merge = ss(t, 143.2, 144.6);
  const cols = [[400, 'stag', '#e0a848'], [960, 'bar', '#e9654c'], [1520, 'agent', '#5fd8ff']];
  cols.forEach(([x, kind, c], i) => {
    const k = ss(t, 141.9 + i * 0.25, 142.6 + i * 0.25, E.outBack);
    if (k <= 0) return;
    const cx = lerp(x, 960, merge), cy = 520;
    triad(ctx, [cx - 150, cy + 110], [cx, cy - 140], [cx + 150, cy + 110], { p: k, r: 26, color: '#e6fbff', fillS: c, w: 3.5, tension: 1, green: merge * 0.9, alpha: 1 - merge * 0.55 + (i === 1 ? merge * 0.55 : 0) });
    ctx.save(); ctx.globalAlpha = 1 - merge;
    if (kind === 'stag') drawStag(ctx, x + 40, 900, { scale: 0.42, t, flip: true });
    if (kind === 'bar') drawBust(ctx, x, 1010, 0.62, { who: 'you', t, eyeGreen: 1, eye: 'narrow' });
    if (kind === 'agent') agentA(ctx, x, 830, 0.6, { t });
    ctx.restore();
  });
  handText(ctx, 'the underlying logic is recognizable', 960, 130, { size: 52, align: 'center', color: '#e6fbff', p: ss(t, 142.0, 143.6) });
}, { type: 'fade', dur: 0.4 });
