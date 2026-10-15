// ACT 2 — The Bar (0:22–1:03). An ordinary evening; the pre-verbal story; "We call that jealousy."
'use strict';

const BAR = { counterY: 800, youX: 520, herX: 1010, rivalX: 1460, s: 1.45, baseY: 905 };
function drawBarRoom(ctx, t, o = {}) {
  // back wall
  ctx.fillStyle = vgrad(ctx, -200, H, [[0, '#2a1638'], [0.6, '#4a2244'], [1, '#5b2a40']]);
  ctx.fillRect(-W, -H, W * 4, H * 3);
  speckle(ctx, 0.2);
  // big arched window onto the same night world
  const wx = 170, wy = 90, ww = 760, wh = 520;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx, wy + 180); ctx.quadraticCurveTo(wx, wy, wx + ww / 2, wy); ctx.quadraticCurveTo(wx + ww, wy, wx + ww, wy + 180); ctx.lineTo(wx + ww, wy + wh); ctx.closePath();
  ctx.save(); ctx.clip();
  ctx.fillStyle = vgrad(ctx, wy, wy + wh, [[0, '#0b1a52'], [0.7, '#2c5cc0'], [1, '#7fa2e6']]); ctx.fillRect(wx, wy, ww, wh);
  stars(ctx, t, { seed: 31, n: 120, x: wx, y: wy, w: ww, h: wh * 0.8 });
  ctx.save(); ctx.translate(wx + ww * 0.62, wy + wh - 30); ctx.scale(0.28, 0.28); crystalCluster(ctx, 0, 0, 1, 5, 1); ctx.restore();
  ctx.fillStyle = '#7466b8'; ctx.fillRect(wx, wy + wh - 30, ww, 30);
  ctx.restore();
  ctx.strokeStyle = P.ink; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = '#6b3a2a'; ctx.lineWidth = 10; ctx.stroke();
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + 260); ctx.lineTo(wx + ww, wy + 260); ctx.stroke();
  ctx.restore();
  // shelves + bottles on the right wall
  for (let r = 0; r < 3; r++) {
    const sy = 210 + r * 150;
    shape(ctx, [[1130, sy], [1900, sy], [1900, sy + 14], [1130, sy + 14]], '#6b3a2a', { w: 2.5 });
    const rr = mulberry32(90 + r);
    for (let x = 1150; x < 1880; x += 34 + rr() * 22) {
      const h = 70 + rr() * 50, c = ['#2f8f5a', '#c98a2e', '#3d7fa8', '#8a2f45', '#d9c06a', '#4aa38f'][Math.floor(rr() * 6)];
      shape(ctx, [[x, sy], [x, sy - h * 0.6], [x + 6, sy - h * 0.72], [x + 6, sy - h], [x + 14, sy - h], [x + 14, sy - h * 0.72], [x + 20, sy - h * 0.6], [x + 20, sy]], c, { w: 2 });
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x + 4, sy - h * 0.55, 3, h * 0.45);
    }
  }
  // neon eye sign (the motif hides in plain sight) — flickers on at 'something strange'
  const neon = o.neon ?? 0;
  ctx.save(); ctx.translate(1000, 120);
  ctx.lineWidth = 7; ctx.strokeStyle = neon > 0 ? `rgba(90,255,170,${0.25 + 0.75 * neon})` : 'rgba(120,140,130,0.5)';
  if (neon > 0) { ctx.shadowColor = '#3dffa0'; ctx.shadowBlur = 30 * neon; }
  ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(0, -48, 70, 0); ctx.quadraticCurveTo(0, 48, -70, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.stroke();
  ctx.restore();
  // background patrons — silhouettes at tables
  const pr = mulberry32(5);
  [[1060, 690, 230], [1180, 700, 210], [1700, 700, 240], [1820, 690, 220], [160, 720, 220], [270, 715, 230]].forEach(([px, py, ph], i) => {
    figure(ctx, px, py + 60, ph, i % 2 ? '#2c1430' : '#341a3a', { line: false, face: i % 2 ? -1 : 1 });
  });
  shape(ctx, [[1080, 700], [1170, 700], [1160, 712], [1090, 712]], '#24102a', { line: false });
  // pendant lamps with warm pools of light
  [[420, 150], [1000, 260 - 120], [1560, 150]].forEach(([lx, ly], i) => {
    ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx, -200); ctx.lineTo(lx, ly - 40); ctx.stroke();
    if (i === 1) return;
    glow(ctx, lx, ly + 10, 420, 'rgba(255,190,110,', 0.55);
    shape(ctx, [[lx - 22, ly - 40], [lx + 22, ly - 40], [lx + 56, ly + 6], [lx - 56, ly + 6]], '#e7a23c', { w: 3 });
    ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.ellipse(lx, ly + 8, 30, 8, 0, 0, TAU); ctx.fill();
  });
}
function drawCounter(ctx, t) {
  const y = BAR.counterY;
  ctx.fillStyle = vgrad(ctx, y + 30, H + 100, [[0, '#4a2018'], [1, '#2a0f10']]); ctx.fillRect(-W, y + 30, W * 4, H);
  for (let x = -100; x < W + 200; x += 180) { ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y + 60); ctx.lineTo(x, H + 50); ctx.stroke(); ctx.strokeStyle = 'rgba(255,170,110,0.12)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 5, y + 60); ctx.lineTo(x + 5, H + 50); ctx.stroke(); }
  ctx.fillStyle = '#d29a4a'; ctx.fillRect(-W, y + 200, W * 4, 10);
  shape(ctx, [[-W, y], [W * 3, y], [W * 3, y + 32], [-W, y + 32]], '#7a3a22', { w: 3 });
  ctx.fillStyle = 'rgba(255,200,140,0.35)'; ctx.fillRect(-W, y + 3, W * 4, 6);
}
// people state at time t (wide-shot choreography)
function barCast(t) {
  const rivalX = lerp(2150, BAR.rivalX, ss(t, 28.4, 30.3, E.out));
  const herFace = lerp(-1, 1, ss(t, 29.1, 29.6));
  const laugh = env(t, 33.2, 35.6, 0.15, 0.4);
  return {
    you: { who: 'you', face: 1, mouth: t > 23.8 && t < 26.2 ? 'talk' : (t < 29 ? 'smile' : 'tight'), talkT: t, eye: t > 36 ? 'narrow' : 'open', brow: ss(t, 30, 31) },
    her: { who: 'her', face: herFace, mouth: laugh > 0.3 ? 'laugh' : (t > 26.3 && t < 28.2) || (t > 30.5 && t < 32.0) ? 'talk' : 'smile', talkT: t * 1.1, eye: laugh > 0.3 ? 'happy' : 'open', tilt: -0.16 * laugh },
    rival: { who: 'rival', face: -1, mouth: t > 32.2 && t < 33.4 ? 'talk' : 'smile', talkT: t, gesture: env(t, 32.1, 33.6, 0.3, 0.4), x: rivalX },
  };
}
function drawBarWide(ctx, t, o = {}) {
  drawBarRoom(ctx, t, o);
  const c = barCast(t);
  const by = BAR.baseY;
  drawBust(ctx, BAR.youX, by, BAR.s, { ...c.you, t, eyeGreen: o.youGreen ?? 0, sil: o.sil?.you });
  drawBust(ctx, BAR.herX, by, BAR.s, { ...c.her, t, sil: o.sil?.her });
  if (c.rival.x < 2100) drawBust(ctx, c.rival.x, by - 20 + Math.abs(Math.sin(t * 7)) * 6 * (1 - ss(t, 29.8, 30.3)), BAR.s * 1.03, { ...c.rival, t, sil: o.sil?.rival });
  drawCounter(ctx, t);
  glass(ctx, 760, BAR.counterY + 10, 1, 0); glass(ctx, 820, BAR.counterY + 10, 1, 1, '#e9654c');
  if (c.rival.x < 1700) glass(ctx, c.rival.x - 200, BAR.counterY + 10, 1, 0, '#d9c06a');
  // anime sparkle on 'attractive'
  const sp = env(t, 30.9, 32.4, 0.2, 0.5);
  if (sp > 0) [[-120, -560, 1], [90, -600, 0.7], [140, -470, 0.5], [-160, -420, 0.6]].forEach(([dx, dy, k], i) => sparkle(ctx, c.rival.x + dx, by + dy, 26 * k * (0.6 + 0.4 * Math.sin(t * 9 + i)), sp));
  return c;
}
function sparkle(ctx, x, y, r, a) {
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#fff7c8'; ctx.strokeStyle = P.ink; ctx.lineWidth = 2;
  ctx.beginPath(); for (let i = 0; i < 8; i++) { const ang = i * Math.PI / 4, rr = i % 2 ? r * 0.28 : r; ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function headPos(x, y, s, face = 1) { return [x + 40 * s * face, y - 334 * s]; }

// ---- Shot 1+2: wide two-shot, rival arrives ----
G.scene(22.3, 35.2, (ctx, t) => {
  const pan = ss(t, 28.2, 30.6);
  ctx.save(); cam(ctx, lerp(900, 1010, pan), lerp(560, 540, pan), lerp(1.08, 1.0, ss(t, 22.3, 28)) );
  drawBarWide(ctx, t, { neon: 0 });
  ctx.restore();
}, { type: 'fade', dur: 0.7 });

// ---- Shot 3: close on you; something strange ----
G.scene(35.15, 38.4, (ctx, t) => {
  const z = lerp(1, 1.12, seg(t, 35.15, 38.4));
  // soft background: the pair, out of focus
  softly(ctx, x => {
    cam(x, 1150, 470, 1.25 * z);
    drawBarRoom(x, t, { neon: clamp((t - 36.0) * 2) * (0.7 + 0.3 * Math.sin(t * 40) * (t < 36.6 ? 1 : 0)) });
    const c = barCast(t);
    drawBust(x, BAR.herX + 30, BAR.baseY, BAR.s, { ...c.her, t });
    drawBust(x, c.rival.x, BAR.baseY - 20, BAR.s * 1.03, { ...c.rival, t });
  });
  ctx.fillStyle = 'rgba(30,10,40,0.25)'; ctx.fillRect(0, 0, W, H);
  // you, large in the foreground left
  const g = ss(t, 35.9, 37.6);
  drawBust(ctx, 380, 1460, 2.7 * z, { who: 'you', face: 1, t, mouth: 'tight', eye: 'narrow', brow: 1, eyeGreen: g, lookDX: 1.5 });
  // a thin green rim-light on your profile
  if (g > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(40,200,120,${0.10 * g})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}, { type: 'cut' });

// ---- Shot 4: the attention field (37.8–40.6) ----
G.scene(37.85, 41.0, (ctx, t) => {
  ctx.save(); cam(ctx, 1010, 540, 1.0);
  drawBarWide(ctx, t);
  ctx.restore();
  ctx.fillStyle = 'rgba(10,14,48,0.72)'; ctx.fillRect(0, 0, W, H);
  const eye = headPos(BAR.youX, BAR.baseY, BAR.s);
  // points of possible attention scattered in the room
  const pts = [[300, 300], [620, 200], [420, 160], [1000, 120], [1250, 180], [1500, 330], [1720, 460], [1180, 560], [200, 680], [1830, 620], [760, 790], [880, 700], [1560, 150], [700, 430]];
  const pair = [1240, 360];
  pts.forEach(([x, y], i) => { ctx.fillStyle = 'rgba(220,230,255,0.7)'; ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill(); });
  // the gaze wanders and snaps back to the pair
  const k = (t - 37.85) / 2.8;
  const seq = [2, 7, 0, 11, 13];
  const ph = clamp(k) * seq.length, idx = Math.floor(ph), f = ph - idx;
  const away = pts[seq[Math.min(idx, seq.length - 1)]];
  const pull = f < 0.45 ? E.out(f / 0.45) : 1 - E.inOut((f - 0.45) / 0.55);
  const tx = lerp(pair[0], away[0], pull), ty = lerp(pair[1], away[1], pull);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(eye[0], eye[1], tx, ty); g.addColorStop(0, 'rgba(90,255,170,0.85)'); g.addColorStop(1, 'rgba(90,255,170,0.18)');
  ctx.fillStyle = g; const ang = Math.atan2(ty - eye[1], tx - eye[0]), d = Math.hypot(tx - eye[0], ty - eye[1]);
  ctx.beginPath(); ctx.moveTo(eye[0], eye[1]); ctx.lineTo(tx + Math.cos(ang + Math.PI / 2) * 90, ty + Math.sin(ang + Math.PI / 2) * 90); ctx.lineTo(tx - Math.cos(ang + Math.PI / 2) * 90, ty - Math.sin(ang + Math.PI / 2) * 90); ctx.closePath(); ctx.fill();
  ctx.restore();
  inkCircle(ctx, pair[0], pair[1], 250, { w: 3, color: '#5dffb0', dash: [12, 10], p: ss(t, 38.0, 38.8), seed: 3 });
  handText(ctx, 'attention keeps returning', 1240, 680, { size: 46, align: 'center', color: '#bfffe0', p: ss(t, 38.0, 39.4) });
  // tally of returns
  const returns = Math.min(seq.length, Math.floor(ph + 0.55));
  for (let i = 0; i < returns; i++) inkLine(ctx, 1500 + i * 22, 610, 1500 + i * 22 + (i === 4 ? -110 : 0), 650 - (i === 4 ? 30 : 0), { w: 4, color: '#5dffb0', seed: i });
  drawBust(ctx, BAR.youX, BAR.baseY, BAR.s, { who: 'you', face: 1, t, sil: '#0b1030', eyeGreen: 1 });
}, { type: 'fade', dur: 0.35 });

// ---- Shot 5: the pre-verbal mind on paper (40.2–53.4) ----
function youHeadSil(ctx, x, y, s, a = 1) { drawBust(ctx, x, y, s, { who: 'you', face: 1, sil: `rgba(39,48,74,${0.13 * a})`, lw: 0.0001, t: 0 }); }
function people3(ctx, x, y, r, arr, a = 1) {
  // tiny colour-coded people: Y(you) H(her) R(rival); arr: [[who, dx, dy]]
  const col = { Y: LOOKS.you.top, H: LOOKS.her.top, R: LOOKS.rival.top };
  arr.forEach(([w, dx, dy, ghost]) => {
    ctx.save(); ctx.globalAlpha *= a * (ghost ? 0.35 : 1);
    ctx.fillStyle = col[w]; ctx.beginPath(); ctx.arc(x + dx, y + dy - r * 0.9, r * 0.45, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + dx, y + dy + r * 0.2, r * 0.55, r * 0.6, 0, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = P.ink; ctx.lineWidth = 2; if (ghost) ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(x + dx, y + dy - r * 0.9, r * 0.45, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x + dx, y + dy + r * 0.2, r * 0.55, r * 0.6, 0, Math.PI, 0); ctx.closePath(); ctx.stroke();
    ctx.restore();
  });
}
const FUT = (() => {
  // branching futures from 'now'
  const root = [560, 540];
  const lv1 = [[860, 330], [880, 560], [860, 780]];
  const leaves = [[1200, 190, 0], [1230, 330, 0], [1240, 480, 1], [1250, 620, 1], [1220, 780, 2], [1190, 910, 2]];
  const scenes = [
    [['H', -18, 0], ['R', 18, 0]], [['H', -22, 0], ['R', 6, 0], ['Y', 46, 0, 1]], [['Y', -18, 0], ['H', 18, 0]],
    [['R', -30, 0, 1], ['Y', 0, 0], ['H', 30, 0]], [['Y', 0, 0]], [['H', -18, 0], ['R', 18, 0], ['Y', 60, 0]],
  ];
  const verdict = ['✗', '✗', '✓', '?', '✗', '✗'];
  return { root, lv1, leaves, scenes, verdict };
})();
G.scene(40.25, 53.6, (ctx, t) => {
  drawPaper(ctx); paperGrid(ctx, 0.6);
  const zoom = lerp(1, 1.04, seg(t, 40.25, 53.6));
  ctx.save(); cam(ctx, 960, 540, zoom);
  // your head as a faint ink silhouette; the mind sits inside and spills out
  youHeadSil(ctx, 300, 1420, 2.6, 1 - ss(t, 48.4, 49.2));
  const fade = 1 - ss(t, 48.4, 49.0);
  const { root, lv1, leaves, scenes, verdict } = FUT;
  ctx.save(); ctx.globalAlpha = fade;
  inkCircle(ctx, root[0], root[1], 16, { fill: P.green, w: 3, p: ss(t, 40.3, 40.8) });
  handText(ctx, 'now', root[0] - 30, root[1] + 60, { size: 40, p: ss(t, 40.4, 41.0) });
  lv1.forEach((q, i) => inkArrow(ctx, bez2(root, [lerp(root[0], q[0], 0.5), q[1]], q), { p: ss(t, 40.5 + i * 0.25, 41.4 + i * 0.25), w: 3, seed: 10 + i, head: 12 }));
  leaves.forEach(([lx, ly, pi], i) => {
    const q = lv1[pi];
    inkArrow(ctx, bez2(q, [lerp(q[0], lx, 0.5), ly], [lx - 70, ly]), { p: ss(t, 41.2 + i * 0.18, 42.0 + i * 0.18), w: 2.5, seed: 20 + i, head: 11, dash: i % 2 ? [8, 6] : null });
    // judgments: a tick or cross on each branch
    const jp = ss(t, 42.6 + i * 0.12, 43.0 + i * 0.12);
    handText(ctx, verdict[i], lerp(q[0], lx, 0.55), lerp(q[1], ly, 0.7) - 14, { size: 42, align: 'center', color: verdict[i] === '✓' ? P.greenDeep : '#b33a3a', p: jp, fam: 'Hand' });
    // imagined outcomes: tiny scenes in bubbles
    const op = ss(t, 43.9 + i * 0.15, 44.4 + i * 0.15);
    if (op > 0) {
      inkCircle(ctx, lx, ly, 62, { p: op, w: 2.5, fill: '#f7f1e3', seed: 60 + i });
      people3(ctx, lx, ly + 6, 26, scenes[i], op);
    }
  });
  // the comparison weigh-up on "making judgments"
  const jp = env(t, 42.5, 48.5, 0.4, 0.4);
  if (jp > 0) {
    ctx.save(); ctx.globalAlpha *= jp; ctx.translate(1600, 300);
    const tilt = -0.18 * ss(t, 42.8, 43.6, E.outBack);
    inkLine(ctx, 0, 0, 0, 150, { w: 3 }); inkLine(ctx, -40, 150, 40, 150, { w: 3 });
    ctx.rotate(tilt); inkLine(ctx, -130, 0, 130, 0, { w: 3.5 });
    people3(ctx, -130, 40, 24, [['Y', 0, 0]]); people3(ctx, 130, 40, 24, [['R', 0, 0]]);
    ctx.restore();
    handText(ctx, 'making judgments', 1600, 520, { size: 40, align: 'center', alpha: jp, p: ss(t, 42.6, 43.6) });
  }
  handText(ctx, 'anticipating possibilities', 820, 110, { size: 46, align: 'center', p: ss(t, 40.3, 41.6) });
  handText(ctx, 'imagining outcomes', 1230, 1030, { size: 40, align: 'center', p: ss(t, 43.9, 45.0) });
  ctx.restore();
  // "deliberate thought" box stays empty
  const db = env(t, 45.5, 49.0, 0.4, 0.4);
  if (db > 0) {
    noteBox(ctx, 1380, 640, 470, 220, ['deliberate reasoning:', '', ''], { p: ss(t, 45.6, 46.4), alpha: db, size: 36 });
    ctx.save(); ctx.globalAlpha = db * 0.5;
    [0, 1].forEach(i => inkLine(ctx, 1405, 750 + i * 50, 1820, 750 + i * 50, { w: 2, color: P.navy, dash: [6, 8], seed: 70 + i }));
    if (Math.floor(t * 2.4) % 2) { ctx.fillStyle = P.navy; ctx.fillRect(1408, 712, 4, 34); }
    ctx.restore();
    handText(ctx, '(empty)', 1615, 838, { size: 30, align: 'center', color: '#8a7f6a', alpha: db * ss(t, 47.0, 47.6) });
  }
  // the story: wordless comic panels form inside the head
  const sp = ss(t, 48.6, 49.6);
  if (sp > 0) {
    const panels = [[[['Y', -30, 0], ['H', 30, 0]], 0], [[['H', -10, 0], ['R', 30, 0], ['Y', -70, 0]], 1], [[['H', -16, 0], ['R', 16, 0]], 2], [[['Y', 0, 0]], 3]];
    panels.forEach(([cast, i]) => {
      const px = 380 + i * 330, py = 330, a = ss(t, 48.7 + i * 0.35, 49.2 + i * 0.35);
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.translate(px, py); ctx.rotate((i % 2 ? 1 : -1) * 0.02);
      shape(ctx, wobble(densify([[0, 0], [290, 0], [290, 340], [0, 340], [0, 0]], 12), 1.4, i), '#fbf6ea', { w: 3.5 });
      if (i === 2) { shape(ctx, [[200, 60], [270, 60], [270, 330], [200, 330]], '#e9dcc0', { w: 2.5 }); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(212, 200, 4, 0, TAU); ctx.fill(); }
      people3(ctx, 145, 240, 52, cast, 1);
      if (i === 3) { ctx.fillStyle = 'rgba(39,48,74,0.08)'; ctx.fillRect(4, 4, 282, 332); }
      // empty speech balloon
      if (i < 3) { inkCircle(ctx, 150, 90, 0.01, { p: 0 }); ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2.5; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(150, 80, 80, 40, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(130, 116); ctx.lineTo(118, 150); ctx.lineTo(150, 118); ctx.fill(); ctx.stroke(); ctx.restore(); }
      ctx.restore();
    });
    handText(ctx, 'a story taking shape…', 960, 230, { size: 52, align: 'center', p: ss(t, 48.8, 50.2) });
    // words arrive — and get scribbled out: it isn't being told in words
    const wp = ss(t, 51.3, 52.3);
    if (wp > 0) {
      handText(ctx, '"she is going to leave with him"', 960, 790, { size: 54, align: 'center', color: P.navy, p: wp });
      const sc = ss(t, 52.5, 53.2);
      if (sc > 0) { const zz = []; for (let i = 0; i <= 26; i++) zz.push([lerp(640, 1290, i / 26), 772 + (i % 2 ? -22 : 22)]); stroke(ctx, wobble(zz, 2, 3), { p: sc, w: 6, color: '#b33a3a' }); }
      handText(ctx, 'not in words', 960, 880, { size: 44, align: 'center', color: '#b33a3a', p: ss(t, 52.7, 53.4) });
    }
  }
  ctx.restore();
}, { type: 'wipe', dur: 0.6 });

// ---- Shot 6: nothing lost — yet the response has already happened (53.4–60.1) ----
G.scene(53.3, 60.3, (ctx, t) => {
  drawPaper(ctx); paperGrid(ctx, 0.5);
  const y0 = 470, nowX = 640;
  // time axis
  inkArrow(ctx, [[160, y0], [1780, y0]], { p: ss(t, 53.4, 54.2), w: 3.5, seed: 2 });
  handText(ctx, 'time', 1790, y0 + 50, { size: 38, align: 'right', p: ss(t, 54.0, 54.4) });
  inkLine(ctx, nowX, y0 - 30, nowX, y0 + 30, { w: 4, p: ss(t, 53.6, 54.0) });
  handText(ctx, 'now', nowX, y0 + 70, { size: 42, align: 'center', p: ss(t, 53.8, 54.3) });
  // present: all three still here
  const pp = ss(t, 53.9, 54.6);
  people3(ctx, nowX - 110, y0 - 90, 30, [['Y', -40, 0], ['H', 20, 0], ['R', 70, 0]], pp);
  handText(ctx, 'nothing lost', nowX - 100, y0 - 180, { size: 44, align: 'center', color: P.greenDeep, p: ss(t, 54.0, 55.2) });
  // a possible future, drawn as a ghost
  const fp = ss(t, 55.6, 56.8);
  const fx = 1420, fy = y0 - 200;
  inkArrow(ctx, bez2([nowX + 20, y0 - 10], [1000, fy + 40], [fx - 90, fy]), { p: fp, w: 3, dash: [10, 9], seed: 7 });
  if (fp > 0) {
    glow(ctx, fx, fy, 160 * fp, 'rgba(90,255,170,', 0.35 * fp, 'source-over');
    inkCircle(ctx, fx, fy, 80, { p: fp, w: 3, dash: [8, 7], color: P.greenDeep, seed: 5 });
    people3(ctx, fx, fy + 10, 30, [['H', -16, 0, 1], ['R', 16, 0, 1]], fp);
    handText(ctx, 'possible loss', fx, fy - 110, { size: 40, align: 'center', color: P.greenDeep, p: ss(t, 56.0, 57.0) });
  }
  // body response trace under the axis — spikes NOW, before anything happened
  const by = 800, sp = ss(t, 54.4, 59.8, E.lin);
  const trace = []; for (let x = 160; x <= 1780; x += 4) {
    const base = by + Math.sin(x * 0.08) * 5;
    const spike = x > nowX - 260 && x < nowX ? Math.exp(-Math.pow((x - nowX + 120) / 60, 2)) * 150 * ss(t, 57.0, 58.0) : 0;
    const jitter = x > nowX - 260 && x < nowX ? Math.sin(x * 0.6) * 22 * ss(t, 57.0, 58.0) * Math.exp(-Math.pow((x - nowX + 120) / 90, 2)) : 0;
    trace.push([x, base - spike - jitter]);
  }
  stroke(ctx, trace.filter(q => q[0] <= nowX + 4), { p: ss(t, 54.4, 55.2), w: 3, color: '#b33a3a' });
  handText(ctx, 'your body', 170, by - 40, { size: 36, color: '#b33a3a', p: ss(t, 54.6, 55.4) });
  // the green current runs backward from the possible future into the present
  const bk = ss(t, 57.0, 58.6);
  if (bk > 0) {
    const pts = bez3([fx - 40, fy + 80], [1300, 700], [900, 760], [nowX - 110, by - 140]);
    ctx.save(); ctx.shadowColor = '#3dffa0'; ctx.shadowBlur = 18;
    inkArrow(ctx, pts, { p: bk, w: 5, color: '#13a865', seed: 9, head: 20 });
    ctx.restore();
    handText(ctx, 'already responding', 1240, 640, { size: 44, align: 'center', color: '#13a865', p: ss(t, 57.6, 58.8) });
  }
}, { type: 'fade', dur: 0.5 });

// ---- Shot 7: "We call that jealousy." ----
G.scene(59.9, 63.6, (ctx, t) => {
  softly(ctx, x => {
    cam(x, 1010, 540, lerp(1.0, 1.03, seg(t, 59.9, 63.6)));
    drawBarRoom(x, t, { neon: 1 });
    const c = barCast(t);
    drawBust(x, BAR.herX + 30, BAR.baseY, BAR.s, { ...c.her, face: 1, t });
    drawBust(x, BAR.rivalX, BAR.baseY - 20, BAR.s * 1.03, { ...c.rival, t });
  });
  ctx.fillStyle = 'rgba(8,20,30,0.45)'; ctx.fillRect(0, 0, W, H);
  drawBust(ctx, 380, 1480, 2.8, { who: 'you', face: 1, t, mouth: 'tight', eye: 'narrow', brow: 1, eyeGreen: 1 });
  const k = ss(t, 60.3, 61.6);
  handText(ctx, 'jealousy', 1290, 560, { size: 170, fam: 'Garamond', style: 'italic 600', align: 'center', color: '#7dffc0', glow: 'rgba(60,255,160,0.9)', glowBlur: 30, p: k });
}, { type: 'fade', dur: 0.5 });
