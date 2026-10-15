// ACT 5 — Ghost Green-Eye (2:26–end). What recurs? Pattern and manifestation; the giant eye.
'use strict';

function nightField(ctx, t, seed = 91, a = 1) {
  ctx.fillStyle = vgrad(ctx, 0, H, [[0, '#050a24'], [1, '#0d1840']]); ctx.fillRect(0, 0, W, H);
  stars(ctx, t, { seed, n: 300, x: 0, y: 0, w: W, h: H, alpha: 0.7 * a });
}
function rotTriad(cx, cy, R, ang) { return [0, 1, 2].map(i => { const a = ang + Math.PI / 2 + i * TAU / 3; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; }); }

// ---------- 5a. so what, exactly, is recurring? ----------
G.scene(145.9, 149.9, (ctx, t) => {
  nightField(ctx, t);
  const [S, V, R] = rotTriad(960, 540, 220, (t - 146) * 0.18);
  triad(ctx, S, R, V, { p: ss(t, 146.0, 147.2), r: 30, color: '#e6fbff', green: 0.7 + 0.3 * Math.sin(t * 2), tension: 1, w: 3.5 });
  handText(ctx, 'what, exactly, is recurring?', 960, 940, { size: 58, align: 'center', color: '#e6fbff', p: ss(t, 146.3, 148.4) });
}, { type: 'fade', dur: 0.7 });

// ---------- 5b. three hypotheses ----------
function card(ctx, x, y, w, h, title, k, draw) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k); ctx.translate(x + w / 2, y + h / 2); ctx.scale(lerp(0.85, 1, k), lerp(0.85, 1, k)); ctx.translate(-x - w / 2, -y - h / 2);
  shape(ctx, wobble(densify([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], 12), 1.4, x), '#fbf6ea', { w: 3.5 });
  handText(ctx, title, x + w / 2, y + 70, { size: 44, align: 'center' });
  draw(); ctx.restore();
}
G.scene(149.4, 157.2, (ctx, t) => {
  drawPaper(ctx); paperGrid(ctx, 0.4);
  const out = ss(t, 156.3, 157.2);
  const cw = 520, ch = 600, y = 260 - out * 900;
  // 1. evolved instinct: passed down a lineage
  card(ctx, 90, y, cw, ch, 'an evolved instinct?', ss(t, 149.6, 150.4, E.outBack), () => {
    const nodes = [[350, y + 170], [250, y + 300], [450, y + 300], [200, y + 430], [300, y + 430], [400, y + 430], [500, y + 430]];
    [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]].forEach(([a, b], i) => inkLine(ctx, nodes[a][0], nodes[a][1] + 20, nodes[b][0], nodes[b][1] - 20, { w: 2.5, seed: i, p: ss(t, 150.0 + i * 0.08, 150.5 + i * 0.08) }));
    nodes.forEach(([nx, ny], i) => { inkCircle(ctx, nx, ny, 20, { w: 2.5, fill: '#bff2d6', p: ss(t, 149.9 + i * 0.07, 150.3 + i * 0.07), seed: i }); ctx.fillStyle = '#13a865'; ctx.beginPath(); ctx.arc(nx, ny, 6, 0, TAU); ctx.fill(); });
    handText(ctx, 'inherited', 350, y + 540, { size: 34, align: 'center', color: '#6a5a48', p: ss(t, 150.4, 151.2) });
  });
  // 2. learned response: passed between people
  card(ctx, 700, y, cw, ch, 'a learned response?', ss(t, 151.9, 152.7, E.outBack), () => {
    figure(ctx, 850, y + 470, 260, LOOKS.her.top, { face: 1 });
    figure(ctx, 1070, y + 470, 170, LOOKS.you.top, { face: -1 });
    bookIcon(ctx, 960, y + 230, 0.8);
    inkArrow(ctx, bez2([880, y + 230], [900, y + 180], [920, y + 210]), { w: 2.5, p: ss(t, 152.3, 152.8), seed: 2 });
    inkArrow(ctx, bez2([1000, y + 240], [1050, y + 260], [1060, y + 300]), { w: 2.5, p: ss(t, 152.6, 153.1), seed: 3 });
    handText(ctx, 'taught, copied', 960, y + 540, { size: 34, align: 'center', color: '#6a5a48', p: ss(t, 152.6, 153.4) });
  });
  // 3. a strategy, found independently
  card(ctx, 1310, y, cw, ch, 'a strategy found anew?', ss(t, 153.4, 154.2, E.outBack), () => {
    [[1390, y + 180], [1570, y + 180], [1480, y + 360]].forEach(([bx, by], i) => {
      shape(ctx, [[bx - 70, by - 70], [bx + 70, by - 70], [bx + 70, by + 70], [bx - 70, by + 70]], null, { w: 2 });
      const path = []; for (let k = 0; k <= 30; k++) { const f = k / 30; path.push([bx - 55 + f * 80, by + 50 - f * 80 + Math.sin(f * 12 + i * 2) * 18]); }
      stroke(ctx, path, { p: ss(t, 153.9 + i * 0.25, 154.8 + i * 0.25), w: 2.5, color: '#6f9aa6' });
      const [S, V, R] = rotTriad(bx + 34, by - 34, 20, 0);
      triad(ctx, S, R, V, { p: ss(t, 154.6 + i * 0.25, 155.2 + i * 0.25), r: 7, w: 2, green: 0.6 });
    });
    handText(ctx, 'discovered independently', 1570, y + 540, { size: 34, align: 'center', color: '#6a5a48', p: ss(t, 154.4, 155.6) });
  });
}, { type: 'fade', dur: 0.5 });

// ---------- 5c. an abstract structure, taking form in many physical systems ----------
function miniWorld(ctx, kind, x, y, w, h, t, lit = 0) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.translate(x, y); ctx.scale(w / W, h / H);
  if (kind === 'stag') { drawSky(ctx, t); drawLand(ctx, t); drawRidge(ctx, t); drawStag(ctx, 640, ridgeY(640) + 24, { scale: 1, t }); drawStag(ctx, 1260, ridgeY(1260) + 24, { scale: 1, flip: true, head: 0.5, t, eyeGlow: lit }); }
  else if (kind === 'bar') { drawBarRoom(ctx, t, { neon: lit }); drawBust(ctx, 520, 905, 1.45, { who: 'you', t, eyeGreen: lit, eye: 'narrow' }); drawBust(ctx, 1040, 905, 1.45, { who: 'her', face: 1, t }); drawBust(ctx, 1460, 885, 1.5, { who: 'rival', face: -1, t }); drawCounter(ctx, t); }
  else if (kind === 'stage') { stage(ctx, t, { green: lit }); figure(ctx, 760, 830, 380, '#0d0a14', { cloak: true, eye: lit }); figure(ctx, 660, 830, 300, '#1d1426', { hat: true }); figure(ctx, 1460, 820, 330, '#e8dcc8', { cloak: true, face: -1 }); }
  else if (kind === 'agent') { blueprint(ctx, t); resourceWell(ctx, 960, 760, 1, 0.5, t); agentA(ctx, 600, 560, 1.2, { t, green: lit, look: 0.4 }); agentB(ctx, 1400, 720, 1.1, { t }); }
  ctx.restore();
  shape(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], null, { w: 4, stroke: '#e6fbff' });
}
G.scene(156.6, 163.9, (ctx, t) => {
  nightField(ctx, t, 92);
  const rise = ss(t, 156.8, 158.6);
  const [S, V, R] = rotTriad(960, lerp(700, 250, rise), lerp(80, 130, rise), Math.PI + (t - 156) * 0.12);
  const beam = ss(t, 159.4, 160.6);
  const panels = [[90, 600, 'stag', 159.6], [540, 600, 'bar', 160.1], [990, 600, 'stage', 160.6], [1440, 600, 'agent', 161.1]];
  panels.forEach(([px, py, kind, t0]) => {
    const k = ss(t, t0, t0 + 0.6);
    if (k <= 0) return;
    // light falling from the form onto each system
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, 300, 0, py); g.addColorStop(0, `rgba(80,255,170,${0.28 * k})`); g.addColorStop(1, `rgba(80,255,170,${0.05 * k})`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(960 - 20, 330); ctx.lineTo(960 + 20, 330); ctx.lineTo(px + 390, py); ctx.lineTo(px, py); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = k; miniWorld(ctx, kind, px, py, 390, 220, t, ss(t, t0 + 0.3, t0 + 1.0)); ctx.restore();
  });
  triad(ctx, S, R, V, { p: 1, r: 26, color: '#e6fbff', green: 0.8 + 0.2 * Math.sin(t * 2), tension: 1, w: 3.5 });
  handText(ctx, 'an abstract structure', 960, 100, { size: 52, align: 'center', color: '#e6fbff', p: ss(t, 158.6, 160.0) });
  handText(ctx, 'taking form in many physical systems', 960, 920, { size: 46, align: 'center', color: '#bfffe0', p: ss(t, 160.4, 162.6) });
}, { type: 'fade', dur: 0.6 });

// ---------- 5d. a separate world, waiting to enter us? ----------
function cloudBank(ctx, y, t, col = '#e9eefc', alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha;
  const r = mulberry32(17);
  for (let i = 0; i < 16; i++) { const x = -100 + i * 140 + Math.sin(t * 0.2 + i) * 10, rr = 80 + r() * 70; blob(ctx, [[x - rr, y], [x - rr * 0.6, y - rr * 0.7], [x, y - rr], [x + rr * 0.7, y - rr * 0.6], [x + rr, y]], col, { w: 2.5, n: 6 }); }
  ctx.fillStyle = col; ctx.fillRect(-100, y - 2, W + 200, 400);
  ctx.restore();
}
G.scene(163.4, 169.2, (ctx, t) => {
  const imagined = ss(t, 166.6, 167.4), dissolve = ss(t, 167.6, 168.9);
  drawSky(ctx, t, { horizon: 1100, starX: 1700, starY: 120 });
  // the island floating above the clouds — a heaven of forms
  const iy = 430 + Math.sin(t * 0.8) * 10;
  ctx.save(); ctx.globalAlpha = 1 - dissolve;
  if (imagined > 0) ctx.setLineDash([12, 10]);
  const island = [[600, iy], [1320, iy], [1260, iy + 60], [1180, iy + 90], [1120, iy + 160], [1040, iy + 180], [1000, iy + 260], [960, iy + 330], [920, iy + 250], [860, iy + 190], [780, iy + 120], [700, iy + 80]];
  if (imagined < 1) { ctx.save(); ctx.globalAlpha *= 1 - imagined * 0.85; blob(ctx, island, '#c97f8f', { w: 3, n: 6 }); ctx.restore(); }
  blob(ctx, island, null, { w: 3, n: 6, stroke: imagined > 0 ? '#e6fbff' : P.ink });
  ctx.setLineDash([]);
  ctx.save(); ctx.translate(960, iy + 4); ctx.scale(0.42, 0.42); ctx.globalAlpha *= 1 - imagined * 0.8; crystalCluster(ctx, 0, 0, 1, 9, 1); ctx.restore();
  const [S, V, R] = rotTriad(960, iy - 200, 60, Math.PI);
  triad(ctx, S, R, V, { p: 1, r: 18, color: '#e6fbff', green: 0.8, tension: 1, w: 3 });
  // a ladder of light down toward waiting minds
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, iy + 300, 0, 900); g.addColorStop(0, 'rgba(120,255,190,0.35)'); g.addColorStop(1, 'rgba(120,255,190,0)'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(940, iy + 320); ctx.lineTo(980, iy + 290); ctx.lineTo(1180, 900); ctx.lineTo(740, 900); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.restore();
  // dissolve into drifting ink motes
  if (dissolve > 0) {
    const r = mulberry32(4);
    for (let i = 0; i < 260; i++) { const x0 = 620 + r() * 680, y0 = iy - 300 + r() * 600, vx = (r() - 0.5) * 300, vy = -60 - r() * 200; ctx.fillStyle = `rgba(230,251,255,${(1 - dissolve) * 0.9})`; ctx.beginPath(); ctx.arc(x0 + vx * dissolve, y0 + vy * dissolve, 2 + r() * 3, 0, TAU); ctx.fill(); }
  }
  cloudBank(ctx, 900, t, '#dfe6fb');
  for (let i = 0; i < 7; i++) figure(ctx, 640 + i * 110, 1040, 120, '#2a3266', { line: false, face: i % 2 ? -1 : 1 });
  handText(ctx, 'a separate world?', 960, 110, { size: 56, align: 'center', color: '#e6fbff', p: ss(t, 163.7, 165.2) });
  handText(ctx, 'we don’t have to imagine it', 960, 180, { size: 42, align: 'center', color: '#bfffe0', p: ss(t, 166.6, 167.8) });
}, { type: 'fade', dur: 0.6 });

// ---------- 5e. only in its manifestations: a net of jewels ----------
G.scene(168.6, 176.3, (ctx, t) => {
  nightField(ctx, t, 93, 0.6);
  const r = mulberry32(12), nodes = [];
  const cols = 9, rows = 5;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) nodes.push([170 + i * 197 + (j % 2) * 98 + (r() - 0.5) * 40, 180 + j * 180 + (r() - 0.5) * 40, r()]);
  const drift = (t - 168.6) * 6;
  const P2 = nodes.map(([x, y, s]) => [x + Math.sin(t * 0.5 + s * 9) * 6 - drift * 0.5, y + Math.cos(t * 0.4 + s * 7) * 6]);
  const np = ss(t, 168.8, 170.4);
  // threads
  ctx.save(); ctx.strokeStyle = 'rgba(200,220,255,0.28)'; ctx.lineWidth = 1.5;
  const edges = [];
  P2.forEach((a, i) => P2.forEach((b, k) => { if (k > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 240) edges.push([i, k]); }));
  edges.forEach(([i, k], n) => { if (n / edges.length > np) return; ctx.beginPath(); ctx.moveTo(P2[i][0], P2[i][1]); ctx.lineTo(P2[k][0], P2[k][1]); ctx.stroke(); });
  ctx.restore();
  // triangles light up across the net — the pattern exists where relations form
  const tris = [];
  edges.forEach(([i, k]) => edges.forEach(([a, b]) => { if (a === k) { const c = b; if (edges.some(([x, y]) => (x === i && y === c))) tris.push([i, k, c]); } }));
  const rr = mulberry32(5);
  const picks = tris.filter(() => rr() < 0.18).slice(0, 18);
  picks.forEach((tri, n) => {
    const t0 = 170.6 + n * 0.28, k = env(t, t0, t0 + 2.4, 0.4, 0.8);
    if (k <= 0) return;
    const pts = tri.map(i => P2[i]);
    ctx.save(); ctx.shadowColor = '#3dffa0'; ctx.shadowBlur = 14;
    stroke(ctx, [...pts, pts[0]], { w: 3, color: '#5dffb0', alpha: k });
    ctx.restore();
  });
  // jewels, each holding a small manifestation
  const kinds = ['stag', 'bar', 'agent', 'stage', 'bird', '?'];
  P2.forEach(([x, y], i) => {
    const k = ss(t, 168.8 + i * 0.02, 169.6 + i * 0.02);
    if (k <= 0) return;
    glow(ctx, x, y, 50, 'rgba(160,220,255,', 0.25 * k);
    ctx.save(); ctx.globalAlpha = k;
    ctx.fillStyle = 'rgba(15,25,60,0.9)'; ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#cfe0ff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, 28, 0, TAU); ctx.clip();
    const kind = kinds[i % kinds.length];
    if (kind === 'stag') drawStag(ctx, x + 6, y + 26, { scale: 0.14, t, flip: i % 2 === 0 });
    else if (kind === 'bar') drawBust(ctx, x - 4, y + 54, 0.17, { who: ['you', 'her', 'rival'][i % 3], t });
    else if (kind === 'agent') agentA(ctx, x, y, 0.25, { t });
    else if (kind === 'stage') figure(ctx, x, y + 26, 54, '#e8dcc8', { cloak: true, line: false });
    else if (kind === 'bird') wing(ctx, 'bird', x - 24, y, 0.14, '#3fb7c0');
    else { ctx.fillStyle = '#cfe0ff'; ctx.font = font(34, 'Hand'); ctx.textAlign = 'center'; ctx.fillText('?', x, y + 12); }
    ctx.restore();
  });
  ctx.fillStyle = 'rgba(5,10,36,0.6)'; ctx.fillRect(0, 960, W, 120);
  handText(ctx, 'perhaps it exists only in its manifestations', 960, 1030, { size: 48, align: 'center', color: '#e6fbff', p: ss(t, 168.9, 171.2) });
  ctx.fillStyle = 'rgba(5,10,36,0.6)'; ctx.fillRect(0, 0, W, 100);
  handText(ctx, 'inseparable from the minds and circumstances that give rise to it', 960, 66, { size: 40, align: 'center', color: '#bfffe0', p: ss(t, 171.8, 174.6) });
}, { type: 'fade', dur: 0.6 });

// ---------- 5f. a rival appears / attention narrows / a future is threatened / behaviour changes ----------
const MONT = { beats: [[175.8, 'a rival appears'], [177.3, 'attention narrows'], [178.8, 'a possible future is threatened'], [181.0, 'behavior changes']] };
function panelWorld(ctx, kind, t) {
  const rivalIn = ss(t, 175.8, 177.0, E.out), act = ss(t, 181.0, 182.0, E.outBack), att = ss(t, 177.3, 178.3);
  const fut = env(t, 178.8, 181.4, 0.3, 0.4);
  if (kind === 'stag') {
    drawSky(ctx, t); drawLand(ctx, t); drawRidge(ctx, t);
    A1.hinds.forEach(([hx, sc, fl], i) => drawStag(ctx, hx, ridgeY(hx) + 52 - i * 4, { scale: sc, hind: true, t: t + i, flip: fl, alpha: 1 - fut * 0.7 * (0.5 + 0.5 * Math.sin(t * 20)) }));
    const ax = lerp(-300, 640, rivalIn);
    drawStag(ctx, ax, ridgeY(ax) + 24, { scale: 1, t, walk: rivalIn < 1 ? t * 5 : null });
    drawStag(ctx, 1200, ridgeY(1200) + 24, { scale: 1, flip: true, t, head: act * 0.6, eyeGlow: att });
    return [[1010, 470], [ax + 150, 500]];
  }
  if (kind === 'bar') {
    drawBarRoom(ctx, t, { neon: att });
    drawBust(ctx, 520, 905, 1.45, { who: 'you', t, eyeGreen: att, eye: att > 0.5 ? 'narrow' : 'open', brow: att, mouth: 'tight', tilt: -0.05 * act });
    drawBust(ctx, 1010, 905, 1.45, { who: 'her', face: lerp(-1, 1, ss(t, 176.6, 177.0)), t, alpha: 1 - fut * 0.6 * (0.5 + 0.5 * Math.sin(t * 20)) });
    const rx = lerp(2200, 1430, rivalIn);
    drawBust(ctx, rx, 885, 1.5, { who: 'rival', face: -1, t });
    drawCounter(ctx, t);
    if (act > 0) { ctx.save(); ctx.globalAlpha = act; glass(ctx, 700, 810, 1, 0); ctx.restore(); }
    return [[580, 420], [rx - 60, 420]];
  }
  blueprint(ctx, t);
  resourceWell(ctx, 960, 760, 1, 0.9 - 0.4 * fut, t);
  const bx = lerp(2100, 1260, rivalIn);
  agentB(ctx, bx, 720, 1.1, { t });
  if (act > 0) for (let i = 0; i < 7; i++) { const a = -0.95 + i * 0.32, r = 210; ctx.save(); ctx.translate(960 + Math.cos(a) * r, 740 + Math.sin(a) * r * 0.7); ctx.rotate(a + Math.PI / 2); ctx.scale(act, act); shape(ctx, [[-26, -14], [26, -14], [30, 0], [26, 14], [-26, 14], [-30, 0]], 'rgba(95,216,255,0.35)', { w: 3, stroke: '#3dffa0' }); ctx.restore(); }
  agentA(ctx, 560, 520, 1.2, { t, green: att, look: att > 0 ? 0.3 : -0.6 });
  return [[560, 520], [bx, 720]];
}
G.scene(175.6, 188.0, (ctx, t) => {
  nightField(ctx, t, 94, 0.5);
  const pw = 560, ph = 600, py = 150;
  const kinds = [['stag', 'different bodies', 182.7], ['bar', 'different minds', 184.2], ['agent', 'different kinds of matter', 185.4]];
  const att = ss(t, 177.3, 178.3);
  kinds.forEach(([kind, label, t0], i) => {
    const px = 60 + i * (pw + 70);
    const k = ss(t, 175.6 + i * 0.1, 176.1 + i * 0.1);
    ctx.save(); ctx.globalAlpha = k;
    ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
    ctx.translate(px, py); const sc = ph / H; ctx.scale(sc, sc); ctx.translate(-({ stag: 930, bar: 990, agent: 900 }[kind] - pw / sc / 2), 0);
    const [eye, riv] = panelWorld(ctx, kind, t);
    ctx.restore();
    // attention narrows: the frame closes in like an iris, green at the edges
    if (att > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
      const cx = px + pw / 2, cy = py + ph * 0.45, rad = lerp(600, 230, att);
      const g = ctx.createRadialGradient(cx, cy, rad * 0.6, cx, cy, rad * 1.4);
      g.addColorStop(0, 'rgba(5,30,20,0)'); g.addColorStop(1, `rgba(5,30,20,${0.75 * att})`);
      ctx.fillStyle = g; ctx.fillRect(px, py, pw, ph); ctx.restore();
    }
    const hl = ss(t, t0, t0 + 0.4) * (1 - ss(t, 186.8, 187.6));
    shape(ctx, [[px, py], [px + pw, py], [px + pw, py + ph], [px, py + ph]], null, { w: 4 + hl * 4, stroke: hl > 0.2 ? '#5dffb0' : '#e6fbff' });
    if (hl > 0) { glow(ctx, px + pw / 2, py + ph + 70, 220, P.greenGlow, 0.4 * hl); }
    handText(ctx, label, px + pw / 2, py + ph + 84, { size: 46, align: 'center', color: '#bfffe0', p: ss(t, t0, t0 + 0.8) });
    ctx.restore();
  });
  // the four beats, lit in sequence
  MONT.beats.forEach(([t0, txt], i) => {
    const on = ss(t, t0, t0 + 0.4) * (1 - ss(t, 182.4, 182.9));
    const x = 250 + i * 470;
    handText(ctx, txt, x, 100, { size: 38, align: 'center', color: on > 0.5 ? '#7dffc0' : 'rgba(230,251,255,0.35)', alpha: Math.max(0.0, on), p: ss(t, t0, t0 + 0.7) });
    if (i < 3) handText(ctx, '→', x + 235, 100, { size: 38, align: 'center', color: '#e6fbff', alpha: on * 0.6 });
  });
}, { type: 'fade', dur: 0.5 });

// ---------- 5g. when jealousy next arises in you ----------
G.scene(187.6, 198.9, (ctx, t) => {
  const pull = ss(t, 193.9, 197.6, E.inOut);
  const roomFade = ss(t, 194.2, 196.4);
  // background: the bar dissolving into the night of countless minds
  nightField(ctx, t, 95);
  ctx.save(); cam(ctx, 960, 540, lerp(1.0, 0.9, pull));
  // crowd of minds receding into the dark, each with a green eye
  const cr = ss(t, 194.4, 197.8);
  if (cr > 0) {
    const r = mulberry32(33);
    for (let row = 9; row >= 0; row--) {
      const f = row / 9, y = lerp(1060, 640, Math.pow(f, 0.6)), sc = lerp(1, 0.18, Math.pow(f, 0.6)), n = Math.round(lerp(6, 34, f));
      const ra = clamp(cr * 10 - row * 0.8);
      if (ra <= 0) continue;
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5 + (r() - 0.5) * 0.6) / n * (W + 400) - 200, kind = r();
        const col = `rgba(${lerp(40, 70, f) | 0},${lerp(40, 60, f) | 0},${lerp(90, 140, f) | 0},1)`;
        ctx.save(); ctx.globalAlpha = ra * (1 - f * 0.4);
        if (kind < 0.55) figure(ctx, x, y, 260 * sc, col, { line: false, face: r() < 0.5 ? 1 : -1, eye: 0.0001 });
        else if (kind < 0.8) drawStag(ctx, x, y, { scale: 0.55 * sc, sil: col, flip: r() < 0.5 });
        else { ctx.translate(x, y - 120 * sc); ctx.scale(sc * 0.7, sc * 0.7); ctx.fillStyle = col; ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + Math.PI / 6; ctx.lineTo(Math.cos(a) * 62, Math.sin(a) * 62); } ctx.fill(); ctx.setTransform(ctx.getTransform()); }
        ctx.restore();
        const ex = x + (kind < 0.55 ? 8 : kind < 0.8 ? -40 : 0) * sc, ey = y - (kind < 0.55 ? 262 : kind < 0.8 ? 160 : 120) * sc;
        ctx.save(); ctx.globalAlpha = ra * (0.6 + 0.4 * Math.sin(t * 3 + i + row));
        glow(ctx, ex, ey, 26 * sc + 8, P.greenGlow, 0.8);
        ctx.fillStyle = '#7dffc0'; ctx.beginPath(); ctx.arc(ex, ey, 3.5 * sc + 1.2, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }
  }
  ctx.restore();
  // the bar fades away around you
  if (roomFade < 1) {
    ctx.save(); ctx.globalAlpha = 1 - roomFade; softly(ctx, x => { cam(x, 1010, 540, 1.0); drawBarRoom(x, t, { neon: 1 }); }); ctx.restore();
    ctx.fillStyle = `rgba(8,20,30,${0.45 * (1 - roomFade)})`; ctx.fillRect(0, 0, W, H);
  }
  // you — in the foreground, then smaller as the crowd is revealed
  const ys = lerp(1480, 1300, pull), sc = lerp(2.8, 1.5, pull), xs = lerp(380, 960, pull);
  const inner = ss(t, 190.2, 191.4);
  drawBust(ctx, xs, ys, sc, { who: 'you', face: 1, t, mouth: 'tight', eye: 'narrow', brow: 1, eyeGreen: 1, alpha: 1 - inner * 0.0 });
  if (inner > 0) {
    // consider what you're experiencing: look inside
    masked(ctx, x => drawBust(x, xs, ys, sc, { who: 'you', face: 1, t, sil: '#0b1030' }), x => {
      x.globalAlpha = inner; x.fillStyle = '#0b1030'; x.fillRect(0, 0, W, H);
      stars(x, t, { seed: 61, n: 200, x: 0, y: 0, w: W, h: H });
      glow(x, xs + 10 * sc, ys - 300 * sc, 170 * sc / 2.8 * (1 + 0.15 * Math.sin(t * 4)), P.greenGlow, 1);
    }, 2);
  }
  const own = env(t, 192.6, 194.4, 0.3, 0.5);
  if (own > 0) {
    ctx.save(); ctx.globalAlpha = own; ctx.setLineDash([10, 8]);
    inkCircle(ctx, xs + 10 * sc, ys - 300 * sc, 120 * sc / 2.8 * 1.4, { w: 4, color: '#e6fbff', dash: [10, 8], p: ss(t, 192.6, 193.4) });
    ctx.restore();
    handText(ctx, 'yours?', xs + 280, ys - 180 * sc, { size: 50, color: '#e6fbff', alpha: own, p: ss(t, 192.8, 193.6) });
  }
  handText(ctx, 'how much belongs to you —', 960, 120, { size: 50, align: 'center', color: '#e6fbff', p: ss(t, 192.5, 194.0), alpha: 1 - ss(t, 197.8, 198.6) });
  handText(ctx, 'and how much did countless minds arrive at before?', 960, 190, { size: 46, align: 'center', color: '#bfffe0', p: ss(t, 194.6, 197.4), alpha: 1 - ss(t, 197.8, 198.6) });
}, { type: 'fade', dur: 0.5 });

// ---------- 5h. do you have jealousy, or does jealousy have you? + title ----------
G.scene(198.4, 211.5, (ctx, t) => {
  const out = ss(t, 201.7, 204.4, E.inOut);
  nightField(ctx, t, 96);
  // the giant ghost eye fills the sky as we pull away
  const eyeA = ss(t, 201.6, 203.6), close = ss(t, 208.6, 210.6, E.inOut);
  if (eyeA > 0) {
    ctx.save(); ctx.globalAlpha = eyeA * 0.85;
    eyeGlyph(ctx, 960, 470, lerp(3.4, 2.6, out), { open: lerp(0.15, 1, eyeA) * (1 - close * 0.97), green: 1, white: 'rgba(170,255,210,0.18)', line: 'rgba(170,255,210,0.7)', pupil: 1.2 });
    ctx.restore();
  }
  // you, small — first holding a green ember, then held inside the eye's pupil
  const zx = 960, zy = lerp(1250, 600, out), zs = lerp(2.2, 0.32, out);
  const ember = ss(t, 199.9, 200.9);
  drawBust(ctx, zx, zy, zs, { who: 'you', face: 1, t, sil: '#05070f' });
  if (ember > 0) {
    const ex = zx + 10 * zs, ey = zy - 120 * zs;
    glow(ctx, ex, ey, 120 * zs * ember, P.greenGlow, ember);
    ctx.fillStyle = '#9dffd0'; ctx.beginPath(); ctx.arc(ex, ey, 9 * zs * ember, 0, TAU); ctx.fill();
  }
  const q1 = env(t, 199.9, 202.0, 0.3, 0.4), q2 = env(t, 201.6, 205.4, 0.3, 0.7);
  handText(ctx, 'do you have jealousy —', 960, 140, { size: 60, align: 'center', color: '#e6fbff', p: ss(t, 199.9, 201.0), alpha: q1 });
  handText(ctx, 'or does jealousy have you?', 960, 980, { size: 60, align: 'center', color: '#7dffc0', glow: 'rgba(60,255,160,0.7)', p: ss(t, 201.7, 203.2), alpha: q2 });
  // title
  const ti = env(t, 205.0, 211.2, 1.2, 1.4);
  if (ti > 0) {
    ctx.save(); ctx.globalAlpha = ti;
    ctx.font = font(120, 'Cinzel', '700'); ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(60,255,160,0.8)'; ctx.shadowBlur = 40;
    ctx.fillStyle = '#d8ffea'; ctx.fillText('GHOST GREEN-EYE', 960, 960);
    ctx.restore();
  }
}, { type: 'fade', dur: 0.5 });
