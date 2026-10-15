// ACT 3 — The Green-Eyed Monster (1:03–1:55). Stories, replicators, deep time, convergence, the pattern.
'use strict';

// ---------- 3a. thousands of years of describing it ----------
function tablet(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  blob(ctx, [[-90, -120], [90, -125], [100, 110], [-95, 118]], '#d8b48a', { w: 3, n: 3 });
  const r = mulberry32(3); ctx.fillStyle = '#7a5532';
  for (let row = 0; row < 7; row++) for (let i = 0; i < 6; i++) { const wx = -70 + i * 26 + r() * 6, wy = -95 + row * 30; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 14, wy + 4); ctx.lineTo(wx, wy + 9); ctx.fill(); }
  ctx.restore();
}
function amphora(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const body = smoothPts([[-30, -150], [30, -150], [34, -120], [80, -60], [84, 30], [40, 120], [-40, 120], [-84, 30], [-80, -60], [-34, -120]], true, 6);
  shape(ctx, body, '#e0814e', { w: 3 });
  shape(ctx, [[-40, 120], [40, 120], [30, 140], [-30, 140]], '#1e1520', { w: 3 });
  ctx.strokeStyle = P.ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-32, -130); ctx.bezierCurveTo(-80, -140, -90, -90, -66, -70); ctx.moveTo(32, -130); ctx.bezierCurveTo(80, -140, 90, -90, 66, -70); ctx.stroke();
  ctx.fillStyle = '#1e1520'; ctx.fillRect(-82, -40, 164, 6); ctx.fillRect(-82, 70, 164, 6);
  // black-figure: a crowned woman glaring
  figure(ctx, -10, 66, 100, '#1e1520', { line: false, cloak: true, face: 1 });
  shape(ctx, [[-22, -36], [-14, -48], [-8, -38], [0, -50], [6, -38], [12, -46], [14, -34]], '#1e1520', { line: false });
  ctx.restore();
}
function handscroll(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, [[-140, -80], [140, -80], [140, 80], [-140, 80]], '#f1e6c8', { w: 3 });
  shape(ctx, [[-156, -92], [-140, -92], [-140, 92], [-156, 92]], '#8a3a2a', { w: 3 }); shape(ctx, [[140, -92], [156, -92], [156, 92], [140, 92]], '#8a3a2a', { w: 3 });
  // a pale wisp — Lady Rokujō's jealous spirit
  ctx.strokeStyle = 'rgba(30,110,80,0.8)'; ctx.lineWidth = 2.5;
  const wisp = []; for (let i = 0; i <= 30; i++) { const f = i / 30; wisp.push([-80 + f * 150, 40 - f * 90 + Math.sin(f * 9 + t * 2) * 12]); }
  stroke(ctx, wisp, { w: 2.5, color: '#2a8a62' });
  ctx.fillStyle = 'rgba(80,220,150,0.35)'; ctx.beginPath(); ctx.ellipse(70, -50, 26, 34, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2a8a62'; ctx.stroke();
  ctx.fillStyle = '#13a865'; ctx.beginPath(); ctx.arc(78, -56, 4, 0, TAU); ctx.fill();
  figure(ctx, -90, 60, 80, '#5a2a46', { line: false, cloak: true });
  ctx.restore();
}
function quarto(ctx, x, y, s, title = 'OTHELLO') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, [[-90, -125], [90, -125], [90, 125], [-90, 125]], '#efe2c0', { w: 3 });
  shape(ctx, [[-90, -125], [-74, -125], [-74, 125], [-90, 125]], '#8a5a2a', { w: 2 });
  ctx.fillStyle = P.ink; ctx.font = font(28, 'Cinzel', '700'); ctx.textAlign = 'center'; ctx.fillText(title, 8, -60);
  ctx.font = font(16, 'Cinzel'); ctx.fillText('THE MOORE', 8, -32); ctx.fillText('OF VENICE', 8, -12);
  ctx.strokeStyle = P.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-50, 10); ctx.lineTo(66, 10); ctx.stroke();
  ctx.font = font(15, 'Cinzel'); ctx.fillText('1604', 8, 90);
  ctx.restore();
}
G.scene(62.9, 68.3, (ctx, t) => {
  drawPaper(ctx); paperGrid(ctx, 0.4);
  const push = ss(t, 66.9, 68.3, E.in);
  ctx.save(); cam(ctx, lerp(960, 1580, push), lerp(540, 470, push), lerp(1, 2.4, push));
  inkArrow(ctx, [[110, 760], [1830, 760]], { p: ss(t, 63.0, 64.0), w: 3, seed: 9 });
  handText(ctx, 'thousands of years of describing it', 960, 150, { size: 56, align: 'center', p: ss(t, 63.2, 64.6) });
  const items = [
    [330, 63.3, x => tablet(ctx, 330, 470, 1), 'Song of Songs', '“jealousy is cruel as the grave”'],
    [760, 64.3, x => amphora(ctx, 760, 470, 1), 'Greek myth', 'Hera’s jealous fury'],
    [1180, 65.2, x => handscroll(ctx, 1180, 470, 1, t), 'Tale of Genji, c. 1010', 'a jealous spirit'],
    [1580, 66.0, x => quarto(ctx, 1580, 470, 1), 'Shakespeare, 1604', ''],
  ];
  items.forEach(([x, t0, draw, a, b]) => {
    const k = ss(t, t0, t0 + 0.6, E.outBack);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(k); ctx.translate(x, 470); ctx.scale(k, k); ctx.translate(-x, -470); draw(); ctx.restore();
    inkLine(ctx, x, 740, x, 780, { w: 3, p: ss(t, t0, t0 + 0.3) });
    handText(ctx, a, x, 830, { size: 36, align: 'center', p: ss(t, t0 + 0.1, t0 + 0.7) });
    handText(ctx, b, x, 875, { size: 30, align: 'center', color: '#6a5a48', p: ss(t, t0 + 0.3, t0 + 0.9) });
  });
  ctx.restore();
}, { type: 'wipe', dur: 0.6 });

// ---------- 3b. "the green-eyed monster" ----------
function inkMonster(ctx, x, y, r, t, k) {
  if (k <= 0) return;
  glow(ctx, x, y, r * 1.6 * k, 'rgba(60,255,160,', 0.12 * k, 'source-over');
  const pts = []; for (let i = 0; i < 72; i++) { const a = i / 72 * TAU; const rr = r * k * (1 + 0.16 * vnoise(a * 2 + t * 0.8, 3) + 0.08 * Math.sin(a * 7 + t * 1.5)); pts.push([x + Math.cos(a) * rr * 1.25, y + Math.sin(a) * rr * 0.85]); }
  fillPts(ctx, pts, '#05070d', 0.96);
  // drips
  for (let i = 0; i < 5; i++) { const dx = x - r * 0.8 + i * r * 0.4, len = (40 + 30 * Math.sin(i * 2.3 + t)) * k; ctx.fillStyle = '#05070d'; ctx.beginPath(); ctx.ellipse(dx, y + r * 0.7 * k + len * 0.5, 12 * k, len, 0, 0, TAU); ctx.fill(); }
}
G.scene(67.75, 71.6, (ctx, t) => {
  drawPaper(ctx);
  const mk = ss(t, 68.0, 69.3, E.out);
  ctx.fillStyle = `rgba(22,28,46,${0.9 * ss(t, 67.8, 68.8)})`; ctx.fillRect(0, 0, W, H);
  inkMonster(ctx, 960, 470, 300, t, mk);
  const eo = ss(t, 69.4, 70.2, E.outBack);
  if (eo > 0) { eyeGlyph(ctx, 840, 420, 0.3, { open: eo, green: 1, white: '#d6ffe8', line: '#0a0f1a', lookX: 30 }); eyeGlyph(ctx, 1080, 420, 0.3, { open: eo, green: 1, white: '#d6ffe8', line: '#0a0f1a', lookX: 30 }); }
  const L = [['O, beware, my lord, of jealousy;', 68.0], ['It is the green-eyed monster which doth mock', 68.6], ['The meat it feeds on.', 69.4]];
  L.forEach(([s, t0], i) => {
    const y = 820 + i * 66;
    if (i === 1) {
      const a = 'It is the ', b = 'green-eyed monster', c = ' which doth mock';
      const fs = 60, wa = measure(ctx, a, fs, 'Garamond', 'italic'), wb = measure(ctx, b, fs, 'Garamond', 'italic 600'), wc = measure(ctx, c, fs, 'Garamond', 'italic');
      const x0 = 960 - (wa + wb + wc) / 2, p = ss(t, t0, t0 + 1.4, E.lin);
      const tot = wa + wb + wc, pa = clamp(p * tot / wa), pb = clamp((p * tot - wa) / wb), pc = clamp((p * tot - wa - wb) / wc);
      handText(ctx, a, x0, y, { size: fs, fam: 'Garamond', style: 'italic', color: '#f4ecd8', p: pa });
      handText(ctx, b, x0 + wa, y, { size: fs, fam: 'Garamond', style: 'italic 600', color: '#6dffb6', glow: 'rgba(60,255,160,0.8)', p: pb });
      handText(ctx, c, x0 + wa + wb, y, { size: fs, fam: 'Garamond', style: 'italic', color: '#f4ecd8', p: pc });
    } else handText(ctx, s, 960, y, { size: 60, fam: 'Garamond', style: 'italic', align: 'center', color: '#f4ecd8', p: ss(t, t0, t0 + 1.0, E.lin) });
  });
  handText(ctx, '— Othello, Act III, Scene iii', 1200, 1030, { size: 34, fam: 'Garamond', color: '#cfc4a8', p: ss(t, 69.8, 70.6) });
}, { type: 'fade', dur: 0.4 });

// ---------- 3c. Othello: suggestion → suspicion → conviction ----------
function stage(ctx, t, o = {}) {
  ctx.fillStyle = '#12091a'; ctx.fillRect(-W, -H, W * 3, H * 3);
  const lightG = o.green ?? 0;
  // floor + light pool
  shape(ctx, [[200, 760], [1720, 760], [1920, 1080], [0, 1080]], '#5a3a2a', { w: 3 });
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(200 + i * 140, 760); ctx.lineTo(i * 175, 1080); ctx.stroke(); }
  // back wall/sky drop
  ctx.fillStyle = vgrad(ctx, 100, 760, [[0, lerpC('#1b2a6a', '#0b3a2a', lightG)], [1, lerpC('#5b6fc0', '#2fa070', lightG)]]); ctx.fillRect(200, 100, 1520, 660);
  stars(ctx, t, { seed: 4, n: 80, x: 220, y: 110, w: 1480, h: 380, alpha: 0.7 });
  const spot = lightG > 0 ? 'rgba(80,255,170,' : 'rgba(255,230,170,';
  glow(ctx, 960, 760, 700, spot, 0.35 + 0.2 * lightG);
  // proscenium
  ctx.fillStyle = '#2a1018';
  ctx.beginPath(); ctx.rect(-W, -H, W * 3, H * 3); ctx.moveTo(200, 1080); ctx.lineTo(200, 220); ctx.quadraticCurveTo(960, 30, 1720, 220); ctx.lineTo(1720, 1080); ctx.closePath(); ctx.fill('evenodd');
  ctx.strokeStyle = '#d9a441'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(200, 1080); ctx.lineTo(200, 220); ctx.quadraticCurveTo(960, 30, 1720, 220); ctx.lineTo(1720, 1080); ctx.stroke();
  ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.stroke();
  // curtains (drawn open; o.close 0..1 drops a front curtain)
  const cur = (x0, dir) => { const pts = [[x0, 110]]; for (let i = 0; i <= 8; i++) pts.push([x0 + dir * (60 + i * 6), 130 + i * 80 + Math.sin(i + t) * 3]); pts.push([x0, 1080]); shape(ctx, pts, '#a3202e', { w: 3 }); ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 3; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x0 + dir * k * 18, 120); ctx.lineTo(x0 + dir * k * 22, 1060); ctx.stroke(); } };
  cur(200, 1); cur(1720, -1);
  const cl = o.close ?? 0;
  if (cl > 0) { const yb = lerp(-60, 1090, E.in(cl)); const pts = [[180, -60], [1740, -60]]; for (let x = 1740; x >= 180; x -= 60) pts.push([x, yb + Math.sin(x * 0.05) * 14]); shape(ctx, pts, '#8f1a28', { w: 3 }); }
}
function lerpC(a, b, k) { const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], k))).join(',')})`; }
G.scene(71.0, 80.2, (ctx, t) => {
  const green = ss(t, 77.0, 78.4);
  stage(ctx, t, { green, close: ss(t, 78.8, 80.1) });
  // actors (silhouettes): Iago whispers to Othello; Desdemona apart
  const lean = Math.sin(t * 3) * 0.5 + 0.5;
  figure(ctx, 1460, 820, 330, '#e8dcc8', { cloak: true, face: -1, lw: 2.5 });
  figure(ctx, 760, 830, 380, '#0d0a14', { cloak: true, face: 1, eye: ss(t, 76.6, 77.6) });
  figure(ctx, 660 - lean * 6, 830, 300, '#1d1426', { hat: true, face: 1 });
  // a handkerchief drifts down — the seed of a suggestion
  const hk = ss(t, 71.3, 73.4);
  if (hk > 0 && t < 79) { const hx = lerp(1300, 1100, hk), hy = lerp(260, 790, hk); ctx.save(); ctx.translate(hx, hy); ctx.rotate(Math.sin(t * 3) * 0.4); shape(ctx, [[-26, -16], [26, -20], [30, 14], [-22, 18]], '#fff8ee', { w: 2.5 }); ctx.fillStyle = '#d33'; [[-10, -4], [8, 2], [16, -8], [-2, 8]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(dx, dy, 3, 0, TAU); ctx.fill(); }); ctx.restore(); }
  // the escalation, drawn above the stage
  const nodes = [[560, 330, 34, 'suggestion', 72.2], [960, 300, 56, 'suspicion', 73.6], [1390, 280, 84, 'conviction', 75.6]];
  nodes.forEach(([x, y, r, label, t0], i) => {
    const p = ss(t, t0, t0 + 0.7);
    if (p <= 0) return;
    const fill = i === 0 ? null : i === 1 ? 'rgba(120,230,170,0.45)' : '#2fe08a';
    if (i === 2) glow(ctx, x, y, r * 2.6, P.greenGlow, p * (0.6 + 0.4 * green));
    inkCircle(ctx, x, y, r, { p, w: 4, color: '#f4ecd8', dash: i === 0 ? [8, 8] : null, fill, fillAlpha: 1, seed: i });
    handText(ctx, label, x, y + r + 50, { size: 42, align: 'center', color: '#f4ecd8', p: ss(t, t0 + 0.1, t0 + 0.8) });
    if (i > 0) { const [px, py, pr] = nodes[i - 1]; inkArrow(ctx, [[px + pr + 16, py], [x - r - 18, y]], { p: ss(t, t0 - 0.4, t0 + 0.2), w: 3, color: '#f4ecd8', seed: 30 + i }); }
  });
  handText(ctx, 'changes everything', 960, 160, { size: 54, align: 'center', color: '#7dffc0', glow: 'rgba(60,255,160,0.8)', p: ss(t, 77.1, 78.4) });
}, { type: 'fade', dur: 0.5 });

// ---------- 3d. stories survive by being retold — but jealousy doesn't need one ----------
function bookIcon(ctx, x, y, s, a = 1, col = '#e9654c') {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, [[-40, -30], [0, -22], [40, -30], [40, 30], [0, 38], [-40, 30]], '#fbf3df', { w: 3 });
  inkLine(ctx, 0, -22, 0, 38, { w: 2.5 });
  shape(ctx, [[-44, 30], [0, 40], [44, 30], [44, 36], [0, 46], [-44, 36]], col, { w: 2.5 });
  ctx.restore();
}
G.scene(79.8, 86.1, (ctx, t) => {
  drawPaper(ctx); paperGrid(ctx, 0.4);
  // binary copying cascade of retellings
  const gens = 5, x0 = 260, dx = 340;
  const nodes = [];
  for (let g = 0; g < gens; g++) { const n = 1 << g; for (let i = 0; i < n; i++) nodes.push([g, i, x0 + g * dx, 540 + (i - (n - 1) / 2) * (760 / n)]); }
  const fade = 1 - ss(t, 82.9, 84.0);
  nodes.forEach(([g, i, x, y]) => {
    const t0 = 80.0 + g * 0.5, k = ss(t, t0, t0 + 0.45, E.outBack);
    if (g > 0) { const par = nodes.find(n => n[0] === g - 1 && n[1] === (i >> 1)); inkArrow(ctx, bez2([par[2] + 50, par[3]], [par[2] + dx * 0.5, y], [x - 54, y]), { p: ss(t, t0 - 0.35, t0), w: 2.2, seed: g * 13 + i, head: 10, alpha: fade }); }
    if (k > 0) bookIcon(ctx, x, y, (g === 0 ? 1.1 : 0.9 - g * 0.1) * k, fade, ['#e9654c', '#3fb7c0', '#e0a848', '#b9a6d6', '#9fc1b0'][(i + g) % 5]);
  });
  handText(ctx, 'stories survive by being retold', 960, 110, { size: 52, align: 'center', p: ss(t, 80.0, 81.6), alpha: fade });
  // what remains when the stories fade: an ember, unbound to any text
  const em = ss(t, 83.2, 84.6);
  if (em > 0) {
    const ex = 960, ey = 520 + Math.sin(t * 1.6) * 10;
    glow(ctx, ex, ey, 220 * em, 'rgba(60,230,140,', em * 0.9, 'source-over');
    ctx.fillStyle = '#2fe08a'; ctx.beginPath(); ctx.arc(ex, ey, 14 * em, 0, TAU); ctx.fill();
    handText(ctx, 'jealousy doesn’t need a story', 960, 800, { size: 54, align: 'center', color: P.greenDeep, p: ss(t, 83.4, 85.2) });
  }
}, { type: 'fade', dur: 0.4 });

// ---------- 3e. Deutsch: a replicator ----------
function infoGlyph(ctx, x, y, s, a = 1, green = 0) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, wobble(densify([[-50, -50], [50, -50], [50, 50], [-50, 50], [-50, -50]], 8), 1.2, 3), green ? '#c9f7dc' : '#f6d9b4', { w: 3.5 });
  // a little double-helix squiggle = information
  ctx.strokeStyle = P.ink; ctx.lineWidth = 3;
  ctx.beginPath(); for (let i = 0; i <= 20; i++) { const yy = -34 + i * 3.4, xx = Math.sin(i * 0.6) * 18; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
  ctx.beginPath(); for (let i = 0; i <= 20; i++) { const yy = -34 + i * 3.4, xx = -Math.sin(i * 0.6) * 18; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
  ctx.lineWidth = 2; for (let i = 1; i < 20; i += 3) { const yy = -34 + i * 3.4, xx = Math.sin(i * 0.6) * 18; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(-xx, yy); ctx.stroke(); }
  ctx.restore();
}
function replicatorLoop(ctx, x, y, s, p, t, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  infoGlyph(ctx, 0, 0, 1);
  const loop = []; for (let i = 0; i <= 60; i++) { const ang = -Math.PI * 0.8 + i / 60 * Math.PI * 1.6; loop.push([Math.cos(ang - Math.PI / 2) * 95, -70 + Math.sin(ang - Math.PI / 2) * 60]); }
  inkArrow(ctx, loop, { p, w: 3.5, seed: 2 });
  ctx.restore();
}
G.scene(85.6, 91.8, (ctx, t) => {
  drawPaper(ctx); paperGrid(ctx, 0.5);
  noteBox(ctx, 60, 60, 640, 130, ['David Deutsch,', 'The Beginning of Infinity'], { p: ss(t, 85.8, 87.2), size: 36 });
  const cx = 960, cy = 560;
  infoGlyph(ctx, cx, cy, 1.3, ss(t, 86.2, 86.8));
  handText(ctx, 'information…', cx, cy + 120, { size: 42, align: 'center', p: ss(t, 86.6, 87.4), alpha: 1 - ss(t, 88.0, 88.5) });
  // the copying loop: the information acts on the world to produce more of itself
  const lp = ss(t, 87.6, 88.6);
  const loop = []; for (let i = 0; i <= 60; i++) { const a = Math.PI * 1.05 + i / 60 * Math.PI * 0.9; loop.push([cx + Math.cos(a) * 200, cy - 120 + Math.sin(a) * 120]); }
  const loopR = loop.map(([x, y]) => [2 * cx - x, y]);
  inkArrow(ctx, loop.slice().reverse().map(([x, y]) => [x, y]), { p: lp, w: 3.5, seed: 4 });
  inkArrow(ctx, loopR, { p: lp, w: 3.5, seed: 5 });
  handText(ctx, '…that causes itself to be copied', cx, 300, { size: 46, align: 'center', p: ss(t, 87.8, 89.2) });
  const copies = [[cx - 330, cy], [cx + 330, cy], [cx - 560, cy + 220], [cx - 120, cy + 260], [cx + 120, cy + 260], [cx + 560, cy + 220]];
  copies.forEach(([x, y], i) => { const k = ss(t, 88.3 + i * 0.22, 88.7 + i * 0.22, E.outBack); if (k > 0) infoGlyph(ctx, x, y, 0.8 * k + 0.0001, clamp(k)); });
  const rp = ss(t, 90.1, 91.0, E.outBack);
  if (rp > 0) handText(ctx, 'a replicator', cx, 960, { size: 84, align: 'center', fam: 'Garamond', style: 'italic 600', color: P.navy, p: ss(t, 90.1, 90.9) });
}, { type: 'fade', dur: 0.4 });

// ---------- 3f. the stag has never heard of Shakespeare; deep time ----------
G.scene(91.4, 99.6, (ctx, t) => {
  const pull = ss(t, 93.5, 96.0);
  ctx.save(); cam(ctx, lerp(1150, 960, pull), lerp(640, 520, pull), lerp(1.7, 1.0, pull));
  drawSky(ctx, t); drawMoon(ctx, 380, 170, 46); drawLand(ctx, t, { noCrystal: false }); drawRidge(ctx, t);
  // a procession of ancestors receding toward the horizon (back in time)
  const anc = ss(t, 93.8, 97.0);
  for (let i = 9; i >= 1; i--) {
    const f = i / 9, a = clamp(anc * 9 - (i - 1)) * (1 - f * 0.55);
    if (a <= 0) continue;
    const x = lerp(1000, 360, f), y = lerp(ridgeY(1000) + 10, 690, Math.pow(f, 0.7));
    drawStag(ctx, x, y, { scale: lerp(0.9, 0.18, Math.pow(f, 0.6)), sil: `rgba(${lerp(60, 120, f) | 0},${lerp(50, 110, f) | 0},${lerp(120, 190, f) | 0},1)`, alpha: a * 0.8, t: t + i, flip: false, head: (i % 3) * 0.15 });
  }
  shadow(ctx, 1240, ridgeY(1240) + 24, 150);
  drawStag(ctx, 1240, ridgeY(1240) + 24, { scale: 1, flip: true, t, head: ss(t, 91.6, 92.6) * 0.55 * (1 - ss(t, 94, 95)) });
  // the unread book in the grass
  const bk = 1 - ss(t, 94.0, 95.0);
  if (bk > 0) { ctx.save(); ctx.globalAlpha = bk; ctx.translate(980, ridgeY(980) + 40); ctx.rotate(-0.08); quarto(ctx, 0, 0, 0.42, 'SHAKESPEARE'); ctx.restore(); }
  ctx.restore();
  // deep-time axis
  const ax = ss(t, 94.6, 95.6);
  if (ax > 0) {
    ctx.save(); ctx.globalAlpha = ax;
    ctx.fillStyle = 'rgba(10,12,40,0.55)'; ctx.fillRect(0, 930, W, 150);
    inkArrow(ctx, [[120, 990], [1800, 990]], { p: ax, w: 3, color: '#e8e4ff', seed: 3 });
    handText(ctx, 'countless generations of rivals', 140, 965, { size: 36, color: '#e8e4ff', p: ss(t, 95.0, 96.2) });
    handText(ctx, 'millions of years ago', 140, 1045, { size: 30, color: '#b9b4e0', p: ss(t, 95.4, 96.4) });
    for (let i = 0; i < 24; i++) inkLine(ctx, 160 + i * 66, 980, 160 + i * 66, 1000, { w: 2, color: '#e8e4ff', seed: i, alpha: 0.6, p: ss(t, 95 + i * 0.03, 95.3 + i * 0.03) });
    const hu = ss(t, 97.4, 98.2);
    ctx.fillStyle = '#3dffa0'; ctx.fillRect(1782 - 10 * hu, 972, 10 * hu, 36);
    handText(ctx, 'humans →', 1770, 955, { size: 34, align: 'right', color: '#7dffc0', p: hu });
    ctx.restore();
  }
  handText(ctx, 'never heard of Shakespeare', 1400, 120, { size: 46, align: 'center', color: '#e8e4ff', alpha: 1 - ss(t, 93.6, 94.2), p: ss(t, 91.7, 92.9) });
}, { type: 'iris', dur: 0.9, x: 1150, y: 640 });

// ---------- 3g. a recurring solution to a recurring problem ----------
const WINGS = {
  bird: { pts: [[0, 0], [40, -30], [120, -48], [200, -44], [280, -24], [340, 0], [300, 8], [322, 22], [280, 22], [296, 40], [250, 36], [262, 56], [210, 46], [214, 64], [160, 52], [110, 46], [60, 36], [20, 20]], bones: [] },
  bat: { pts: [[0, 0], [80, -30], [160, -50], [240, -60], [330, -10], [270, 10], [300, 60], [232, 34], [220, 92], [172, 42], [120, 80], [90, 40], [30, 40]], bones: [[[0, 0], [120, -45], [240, -60]], [[240, -60], [330, -10]], [[240, -60], [300, 60]], [[240, -60], [220, 92]], [[240, -60], [120, 80]]] },
  ptero: { pts: [[0, 0], [100, -30], [200, -40], [380, -10], [300, 10], [200, 30], [100, 40], [30, 30]], bones: [[[0, 0], [100, -30], [200, -40]], [[200, -40], [380, -10]]] },
};
function wing(ctx, kind, x, y, s, col, a = 1) {
  const wg = WINGS[kind];
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, wg.pts, col, { w: 3 / s });
  ctx.strokeStyle = P.ink; ctx.lineWidth = 3.5 / s; ctx.lineCap = 'round';
  wg.bones.forEach(b => { ctx.beginPath(); b.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); });
  if (kind === 'bird') { ctx.lineWidth = 1.6 / s; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(60 + i * 40, -20 - (i < 3 ? i * 6 : (5 - i) * 6)); ctx.lineTo(80 + i * 40, 30); ctx.stroke(); } }
  ctx.restore();
}
G.scene(99.3, 108.6, (ctx, t) => {
  drawPaper(ctx); paperGrid(ctx, 0.5);
  // a tree of life with three distant branches, each independently arriving at flight
  const root = [960, 980];
  const tips = [[420, 560, 'bat', '#8a6a9a', 'bats'], [960, 520, 'bird', '#3fb7c0', 'birds'], [1500, 560, 'ptero', '#e0a848', 'pterosaurs']];
  const conv = ss(t, 106.6, 107.8);
  inkLine(ctx, root[0], root[1], root[0], 820, { w: 4, p: ss(t, 99.4, 99.9) });
  tips.forEach(([x, y, kind, col, lab], i) => {
    inkArrow(ctx, bez2([960, 820], [lerp(960, x, 0.3), 700], [x, y + 90]), { p: ss(t, 99.6 + i * 0.2, 100.6 + i * 0.2), w: 3.5, seed: 10 + i, alpha: 1 - conv * 0.6 });
    const wk = ss(t, 102.8 + i * 0.25, 103.5 + i * 0.25, E.outBack);
    const wx = lerp(x - 170, 790, conv), wy = lerp(y, 360, conv);
    if (wk > 0) wing(ctx, kind, wx, wy, 0.95 * wk + 0.001, col, (1 - conv * 0.45) * clamp(wk));
    handText(ctx, lab, x, y + 140, { size: 36, align: 'center', p: ss(t, 103 + i * 0.25, 103.7 + i * 0.25), alpha: 1 - conv });
  });
  // the problem: moving through air (wind lines above)
  const ap = ss(t, 101.4, 102.4);
  for (let k = 0; k < 4; k++) { const pts = []; for (let i = 0; i <= 40; i++) pts.push([300 + i * 34, 200 + k * 34 + Math.sin(i * 0.4 + t * 2 + k) * 8]); stroke(ctx, pts, { p: ap, w: 2, color: '#6f9aa6', alpha: 1 - conv }); }
  handText(ctx, 'a recurring problem: air', 960, 140, { size: 44, align: 'center', color: '#3e6f7a', p: ss(t, 101.4, 102.5), alpha: 1 - conv });
  handText(ctx, 'a recurring solution: wings', 960, 1050, { size: 44, align: 'center', p: ss(t, 102.8, 104.0) });
  // not necessarily a replicator
  const rp = env(t, 104.4, 106.9, 0.4, 0.4);
  if (rp > 0) {
    replicatorLoop(ctx, 1700, 200, 0.7, 1, t, rp);
    inkLine(ctx, 1610, 110, 1790, 290, { w: 6, color: '#b33a3a', p: ss(t, 104.9, 105.4), alpha: rp });
    handText(ctx, 'not necessarily copied', 1700, 330, { size: 32, align: 'center', color: '#b33a3a', alpha: rp, p: ss(t, 105.0, 105.8) });
  }
  // …but at least a pattern: the shared form traced in green
  if (conv > 0) {
    ctx.save(); ctx.shadowColor = 'rgba(60,255,160,0.9)'; ctx.shadowBlur = 16;
    const outline = WINGS.bird.pts.map(([x, y]) => [790 + x * 0.95, 360 + y * 0.95]);
    stroke(ctx, outline.concat([outline[0]]), { p: ss(t, 107.0, 108.2), w: 5, color: '#13a865' });
    ctx.restore();
    handText(ctx, 'a pattern', 960, 560, { size: 80, fam: 'Garamond', style: 'italic 600', align: 'center', color: P.greenDeep, p: ss(t, 107.0, 108.0) });
  }
}, { type: 'wipe', dur: 0.6 });

// ---------- 3h. wherever something valuable can be lost to a rival ----------
function miniIcon(ctx, kind, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 'stag') { drawStag(ctx, 30, 30, { scale: 0.22, flip: false, t: 0 }); }
  else if (kind === 'bar') { glass(ctx, -14, 30, 0.6, 1, '#e9654c'); glass(ctx, 18, 30, 0.6, 0); }
  else if (kind === 'stage') { quarto(ctx, 0, 0, 0.32); }
  else if (kind === 'bird') { wing(ctx, 'bird', -40, 0, 0.25, '#3fb7c0'); }
  else { handText(ctx, '?', 0, 18, { size: 60, align: 'center', color: P.navy }); }
  ctx.restore();
}
G.scene(108.2, 115.0, (ctx, t) => {
  drawPaper(ctx); paperGrid(ctx, 0.5);
  const big = 1 - ss(t, 110.6, 111.6);
  const S = [760, 640], V = [960, 360], R = [1160, 640];
  // the abstract triad, stated plainly
  if (big > 0) {
    ctx.save(); ctx.globalAlpha = big;
    triad(ctx, S, V, R, { p: ss(t, 108.4, 109.8), r: 40, labels: 1, labelSize: 46, lvy: -1.4, green: ss(t, 109.6, 110.4) * 0.8, tension: 1, w: 4 });
    handText(ctx, 'something valuable · a rival · a possible loss', 960, 900, { size: 46, align: 'center', p: ss(t, 108.6, 110.4) });
    ctx.restore();
  }
  // similar responses arise — the same shape, many places
  const grid = [[330, 300, 'stag'], [960, 260, 'bar'], [1590, 300, 'stage'], [520, 720, 'bird'], [1400, 720, '?'], [960, 760, '?']];
  grid.forEach(([x, y, kind], i) => {
    const k = ss(t, 110.8 + i * 0.25, 111.4 + i * 0.25, E.outBack);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
    const rot = (i - 2.5) * 0.12, sc = 0.9 + (i % 3) * 0.1;
    const P3 = [[-120, 70], [0, -90], [120, 70]].map(([dx, dy]) => [x + (dx * Math.cos(rot) - dy * Math.sin(rot)) * sc, y + (dx * Math.sin(rot) + dy * Math.cos(rot)) * sc]);
    triad(ctx, P3[0], P3[1], P3[2], { p: 1, r: 18, w: 3, green: ss(t, 112.0 + i * 0.25, 112.8 + i * 0.25), tension: 1 });
    miniIcon(ctx, kind, x, y + 160, 1);
    ctx.restore();
  });
  handText(ctx, 'similar responses might arise', 960, 1030, { size: 46, align: 'center', color: P.greenDeep, p: ss(t, 111.5, 113.0) });
}, { type: 'fade', dur: 0.5 });
