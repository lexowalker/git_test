// SHORT 1 — "The Observing Center" (≈75 s). The method: hold to the center, let negativity teach.
'use strict';

G.AUDIO_END = window.AUDIO_DUR; G.DURATION = window.AUDIO_DUR + 2.9;
SUBS.build(window.WORDS, ['negative', 'observing', 'center', 'teaching', 'learning', 'immune', 'misfortune', 'message', 'mileage', 'negativity', 'preliminary', 'work', 'thoughts', 'feelings']);
SUBS.hidden = t => t > window.AUDIO_DUR + 0.2;

const C1 = {
  negative: cue('negative'), attention: cue('attention'), observing: cue('observing'), center: cue('center'),
  watch: cue('watch'), unfolds: cue('unfolds'), learningWay: cueP('learning this way'), immune: cue('immune'), misfortune: cue('misfortune'),
  series: cueP('so this life'), teaching: cue('teaching', 2), l1: cue('learning', 3), l2: cue('learning', 4), l3: cue('learning', 5),
  now: cueP('now the message'), hear: cue('hear'), appear: cue('appear'), veryNeg: cue('negative', 2), badNews: cueP('bad news'), misf2: cue('misfortune', 2),
  useful: cue('useful'), mileage: cue('mileage'), center2: cue('center', 2), observing2: cue('observing', 2), negativity: cue('negativity'), play: cue('play'),
  important: cue('important'), preliminary: cue('preliminary'), hold3: cueP('so you can hold'), center3: cue('center', 4), fromThere: cueP('and then from there'),
  thoughts: cue('thoughts'), feelings: cue('feelings'), end: window.AUDIO_DUR,
};
const M = { x: 540, y: 1282, s: 1.5 };

// ---------- 1. the storm arrives; hold to the observing center; the storm unfolds into a lesson; immune ----------
G.scene(0, C1.series - 0.25, (ctx, t) => {
  const push = ss(t, C1.attention - 0.4, C1.observing + 0.6);
  ctx.save(); cam(ctx, 540, lerp(960, 900, push), lerp(1.0, 1.07, push));
  nightV(ctx, t);
  // storm rolls in
  const sx = lerp(-420, 470, ss(t, 0.1, 3.6, E.out));
  const part = ss(t, C1.watch + 0.2, C1.watch + 1.4), close = ss(t, C1.learningWay - 0.4, C1.learningWay + 0.4);
  const gap = 260 * part * (1 - close);
  const drawStorm = (dx) => {
    cloud(ctx, sx - 160 + dx, 470, 560, 230, { seed: 3, fill: STORM });
    cloud(ctx, sx + 200 + dx, 390, 520, 210, { seed: 9, fill: STORM2 });
  };
  // split the cloud apart to reveal the scroll
  if (gap > 1) {
    ctx.save(); ctx.beginPath(); ctx.rect(-W, -H, sx + W, H * 3); ctx.clip(); drawStorm(-gap); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(sx, -H, W * 3, H * 3); ctx.clip(); drawStorm(gap); ctx.restore();
  } else drawStorm(0);
  bolt(ctx, sx - 140, 540, 360, 3, pulse(t, C1.negative - 0.05, 0.35));
  bolt(ctx, sx + 260, 470, 300, 7, pulse(t, C1.misfortune, 0.35));
  // the teaching function unfolds: a scroll unrolls from the storm
  const sc = part * (1 - close);
  if (sc > 0) {
    const top = 250, h = 420 * E.out(sc);
    ctx.save(); ctx.globalAlpha = clamp(sc * 2);
    shape(ctx, [[sx - 180, top], [sx + 180, top], [sx + 180, top + h], [sx - 180, top + h]], '#f4ead2', { w: 4 });
    shape(ctx, [[sx - 196, top + h - 10], [sx + 196, top + h - 10], [sx + 196, top + h + 14], [sx - 196, top + h + 14]], '#c9a46a', { w: 3 });
    ctx.beginPath(); ctx.rect(sx - 180, top, 360, h); ctx.clip();
    // a seed in dark soil becomes a sprout — difficulty composting into growth
    shape(ctx, [[sx - 120, top + 380], [sx + 120, top + 380], [sx + 120, top + 440], [sx - 120, top + 440]], '#5a3a2a', { w: 3 });
    const gr = ss(t, C1.watch + 0.8, C1.unfolds + 0.9);
    stroke(ctx, bez2([sx, top + 380], [sx - 10, top + 300], [sx + 6, top + 230]), { p: gr, w: 6, color: '#2f8f5a' });
    if (gr > 0.6) { const k = (gr - 0.6) / 0.4; blob(ctx, [[sx + 6, top + 260], [sx + 70 * k, top + 230 - 30 * k], [sx + 90 * k, top + 250], [sx + 10, top + 272]], '#4fc27a', { w: 3, n: 4 }); blob(ctx, [[sx, top + 290], [sx - 70 * k, top + 262 - 26 * k], [sx - 86 * k, top + 286], [sx - 6, top + 300]], '#4fc27a', { w: 3, n: 4 }); }
    label(ctx, 'a lesson', sx, top + 120, ss(t, C1.unfolds - 0.2, C1.unfolds + 0.8), { size: 58, fam: 'Scrawl', style: 'bold' });
    ctx.restore();
  }
  // rain of misfortune — deflected by the dome of the center
  const dome = ss(t, C1.immune - 0.3, C1.immune + 0.4);
  const rainK = Math.max(env(t, C1.negative, C1.watch + 0.4, 0.6, 0.6) * 0.5, env(t, C1.learningWay - 0.2, C1.series, 0.4, 0.5));
  const [hx, hy] = heartOf(M.x, M.y, M.s);
  rainfall(ctx, -60, 520, W + 120, 800, t, rainK, { n: 110, dome: dome > 0.3 ? [hx, M.y - 60, 400 * dome] : null });
  hill(ctx, t);
  if (dome > 0) {
    ctx.save(); ctx.globalAlpha = 0.9 * dome;
    const g = ctx.createRadialGradient(hx, M.y - 60, 60, hx, M.y - 60, 400 * dome);
    g.addColorStop(0, 'rgba(255,214,110,0.0)'); g.addColorStop(0.85, 'rgba(255,214,110,0.16)'); g.addColorStop(1, 'rgba(255,224,150,0.55)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, M.y - 60, 400 * dome, Math.PI, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,224,150,0.9)'; ctx.lineWidth = 3; ctx.setLineDash([12, 10]); ctx.stroke(); ctx.restore();
  }
  // attention: a line of sight up into the storm
  const at = env(t, C1.attention, C1.watch + 1.6, 0.5, 0.6);
  if (at > 0) inkArrow(ctx, [[M.x, M.y - 330 * M.s], [M.x - 30, 640]], { p: ss(t, C1.attention, C1.attention + 0.8), w: 4, color: '#fff3c4', dash: [10, 10], seed: 2, alpha: at });
  const cK = ss(t, C1.observing - 0.1, C1.center + 0.3);
  meditator(ctx, M.x, M.y, M.s, { t, center: cK, eyesOpen: t > C1.attention && t < C1.immune });
  rings(ctx, hx, hy, t, ss(t, C1.center, C1.center + 0.8), { R: 360 });
  ctx.restore();
  label(ctx, 'observing center', 800, 900, ss(t, C1.center, C1.center + 0.9), { color: '#ffe6a6', fam: 'Scrawl', style: 'bold', size: 56, alpha: 1 - ss(t, C1.watch, C1.watch + 0.4) });
  subBand(ctx);
  seriesTag(ctx, 'THE OBSERVING CENTER', ss(t, 0.4, 1.4));
}, { type: 'cut' });

// ---------- 2. life is a series of learning — a spiral of lessons ----------
function spiralPts(n = 400) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const f = i / n, a = f * TAU * 3.2 + Math.PI / 2; pts.push([540 + Math.cos(a) * lerp(330, 150, f), lerp(1120, 360, f) + Math.sin(a) * lerp(90, 40, f)]); }
  return pts;
}
const SPI = spiralPts();
G.scene(C1.series - 0.5, C1.now - 0.1, (ctx, t) => {
  paperV(ctx);
  const p = ss(t, C1.series, C1.l3 + 0.4, E.inOutQuad);
  stroke(ctx, SPI, { p: Math.max(0.02, p), w: 5, color: P.navy });
  // events on the path become lessons
  const nodes = [0.08, 0.2, 0.33, 0.46, 0.58, 0.7, 0.8, 0.9, 0.98];
  nodes.forEach((f, i) => {
    if (p < f) return;
    const q = SPI[Math.round(f * (SPI.length - 1))];
    const k = clamp((p - f) * 12);
    inkCircle(ctx, q[0], q[1], 20 * k + 1, { w: 3, fill: i % 3 === 0 ? P.peach : i % 3 === 1 ? P.sage : P.lilac, seed: i });
    if (k > 0.8) { ctx.fillStyle = P.navy; ctx.font = font(26, 'Hand'); ctx.textAlign = 'center'; ctx.fillText('✓', q[0], q[1] + 9); }
  });
  // a traveller climbing the path
  const tq = SPI[Math.round(clamp(p) * (SPI.length - 1))];
  meditator(ctx, tq[0], tq[1] - 18, 0.16, { t, sil: '#27304a' });
  // three beats on "learning, learning, learning"
  [[C1.l1, 0.7], [C1.l2, 0.8], [C1.l3, 0.9]].forEach(([tc, f], i) => {
    const q = SPI[Math.round(f * (SPI.length - 1))];
    rings(ctx, q[0], q[1], t, env(t, tc, tc + 1.6, 0.1, 0.6), { R: 120, n: 2, color: '220,150,40' });
    label(ctx, 'learning', clamp(q[0] + (i % 2 ? -230 : 230), 170, 910), q[1] + 10, ss(t, tc, tc + 0.4), { size: 56, color: '#c07a10', fam: 'Scrawl', style: 'bold' });
  });
  label(ctx, 'life = a series of lessons', 540, 300, ss(t, C1.series + 0.3, C1.series + 1.8), { size: 60 });
  label(ctx, 'always teaching', 540, 1200, ss(t, C1.teaching - 0.2, C1.teaching + 0.8), { size: 50, color: '#6a5a48' });
  seriesTag(ctx, 'THE OBSERVING CENTER', 0.0);
}, { type: 'wipe', dur: 0.5 });

// ---------- 3. the message isn't always what we want to hear; negative, bad news, misfortune ----------
function newspaper(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  shape(ctx, [[-170, -120], [170, -120], [170, 120], [-170, 120]], '#efe9dc', { w: 4 });
  ctx.fillStyle = P.ink; ctx.font = font(54, 'Cinzel', '700'); ctx.textAlign = 'center'; ctx.fillText('BAD NEWS', 0, -50);
  ctx.fillStyle = 'rgba(20,20,40,0.5)'; for (let r = 0; r < 5; r++) { ctx.fillRect(-150, -10 + r * 22, 140, 8); ctx.fillRect(10, -10 + r * 22, 140, 8); }
  ctx.restore();
}
function umbrellaBroken(ctx, x, y, s, rot, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  shape(ctx, [[-170, -120], [170, -120], [170, 120], [-170, 120]], '#dfe6f5', { w: 4 });
  rainfall(ctx, -160, -120, 320, 240, t, 0.4, { n: 40, color: 'rgba(60,80,140,0.6)' });
  shape(ctx, [[-110, -10], [-60, -60], [0, -70], [40, -40], [10, -30], [70, -20], [110, -10]], '#3a3f6a', { w: 4 });
  stroke(ctx, [[0, -60], [0, 70], [-20, 90]], { w: 6, color: P.ink });
  ctx.restore();
}
G.scene(C1.now - 0.4, C1.useful - 0.1, (ctx, t) => {
  paperV(ctx);
  // the envelope arrives and opens
  const inK = ss(t, C1.now - 0.3, C1.now + 0.5, E.out), op = ss(t, C1.now + 0.8, C1.hear);
  const cardsOn = ss(t, C1.appear - 0.5, C1.appear);
  if (cardsOn < 1) {
    ctx.save(); ctx.globalAlpha = 1 - cardsOn;
    const ey = lerp(-200, 700, inK);
    const letter = ss(t, C1.hear - 0.4, C1.hear + 0.6);
    if (letter > 0) {
      const ly = lerp(ey, ey - 300, letter);
      shape(ctx, [[400, ly - 200], [680, ly - 200], [680, ly + 60], [400, ly + 60]], '#fbf6ea', { w: 3 });
      cloud(ctx, 540, ly - 110, 180, 80, { seed: 5, fill: STORM, lw: 2.5 });
      stroke(ctx, [[460, ly - 20], [620, ly - 20]], { w: 3, color: P.navy }); stroke(ctx, [[460, ly + 10], [580, ly + 10]], { w: 3, color: P.navy });
    }
    envelope(ctx, 540, ey, 1.2, op);
    label(ctx, 'the message', 540, 1000, ss(t, C1.now + 0.2, C1.now + 1.2), { size: 62 });
    label(ctx, '(not always what we want to hear)', 540, 1070, ss(t, C1.hear - 0.6, C1.hear + 0.6), { size: 40, color: '#6a5a48' });
    ctx.restore();
  }
  // three faces of difficulty, dealt like cards
  const cards = [
    [C1.veryNeg, 540, 470, -0.06, (x, y, r) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r); shape(ctx, [[-170, -120], [170, -120], [170, 120], [-170, 120]], '#d9d3ea', { w: 4 }); cloud(ctx, 0, -10, 260, 120, { seed: 2 }); bolt(ctx, 20, 30, 80, 4, 1); ctx.restore(); }, 'negative'],
    [C1.badNews, 540, 720, 0.05, (x, y, r) => newspaper(ctx, x, y, 1, r), 'bad news'],
    [C1.misf2, 540, 970, -0.03, (x, y, r) => umbrellaBroken(ctx, x, y, 1, r, t), 'misfortune'],
  ];
  cards.forEach(([tc, x, y, r, draw, lab], i) => {
    const k = ss(t, tc - 0.35, tc + 0.15, E.outBack);
    if (k <= 0) return;
    const yy = lerp(-300, y, clamp(k));
    ctx.save(); ctx.globalAlpha = clamp(k * 2); draw(x - 60 + i * 60, yy, r * k); ctx.restore();
    label(ctx, lab, i % 2 ? 230 : 860, yy + 14, ss(t, tc, tc + 0.5), { size: 48, color: '#8a3a3a', fam: 'Scrawl', style: 'bold' });
  });
  subBand(ctx, 0.5);
}, { type: 'fade', dur: 0.4 });

// ---------- 4. the most mileage: a chart ----------
G.scene(C1.useful - 0.4, C1.observing2 - 0.15, (ctx, t) => {
  paperV(ctx);
  const ox = 170, oy = 1040, w = 760, h = 660;
  inkArrow(ctx, [[ox, oy], [ox + w, oy]], { p: ss(t, C1.useful - 0.2, C1.useful + 0.5), w: 4, seed: 1 });
  inkArrow(ctx, [[ox, oy], [ox, oy - h]], { p: ss(t, C1.useful - 0.1, C1.useful + 0.6), w: 4, seed: 2 });
  label(ctx, 'how bad it feels →', ox + w / 2, oy + 70, ss(t, C1.useful + 0.2, C1.useful + 1.2), { size: 44 });
  ctx.save(); ctx.translate(ox - 50, oy - h / 2); ctx.rotate(-Math.PI / 2); label(ctx, 'practice mileage →', 0, 0, ss(t, C1.useful + 0.4, C1.useful + 1.4), { size: 44 }); ctx.restore();
  const curve = []; for (let i = 0; i <= 60; i++) { const f = i / 60; curve.push([ox + 20 + f * (w - 60), oy - 30 - Math.pow(f, 1.8) * (h - 110)]); }
  const cp = ss(t, C1.useful + 0.6, C1.mileage);
  stroke(ctx, curve, { p: cp, w: 6, color: '#c07a10' });
  // a marker rides the curve to the top
  const mp = ss(t, C1.mileage - 0.6, C1.center2);
  const q = curve[Math.round(mp * (curve.length - 1))];
  if (mp > 0) { meditator(ctx, q[0], q[1] + 4, 0.17, { t, sil: '#27304a', center: ss(t, C1.center2 - 0.3, C1.center2 + 0.3) }); }
  if (t > C1.center2 - 0.2) rings(ctx, q[0], q[1] - 26, t, ss(t, C1.center2 - 0.2, C1.center2 + 0.5), { R: 160, n: 3, color: '220,150,40' });
  // odometer
  const od = ss(t, C1.mileage - 0.3, C1.center2, E.out);
  if (od > 0) {
    const val = Math.round(od * 9999).toString().padStart(4, '0');
    shape(ctx, [[600, 300], [900, 300], [900, 400], [600, 400]], '#1d2238', { w: 4 });
    ctx.font = font(72, 'Sub', '900'); ctx.textAlign = 'center'; ctx.fillStyle = '#ffe6a6';
    [...val].forEach((d, i) => ctx.fillText(d, 640 + i * 74, 378));
    label(ctx, 'mileage', 750, 280, ss(t, C1.mileage - 0.2, C1.mileage + 0.5), { size: 44 });
  }
  label(ctx, 'the hard moments', 360, 330, ss(t, C1.useful - 0.1, C1.useful + 0.9), { size: 52 });
  label(ctx, 'are the most useful', 360, 390, ss(t, C1.useful + 0.3, C1.useful + 1.3), { size: 52, color: '#c07a10' });
}, { type: 'fade', dur: 0.4 });

// ---------- 5. the observing center; watching negativity play out ----------
G.scene(C1.observing2 - 0.4, C1.important - 0.6, (ctx, t) => {
  ctx.save(); cam(ctx, 540, 900, 1.04);
  nightV(ctx, t, { starA: 0.8 });
  // the storm plays itself out across the sky, fast, like weather on time-lapse
  const k = (t - C1.observing2) / (C1.important - C1.observing2);
  for (let i = 0; i < 4; i++) {
    const x = lerp(-500, 1600, ((k * 0.9 + i * 0.28) % 1.2)), y = 330 + (i % 2) * 150;
    cloud(ctx, x, y, 420 + i * 40, 180, { seed: 11 + i, fill: i % 2 ? STORM : STORM2 });
    bolt(ctx, x, y + 60, 260, 20 + i, pulse(t, C1.negativity + i * 0.9, 0.3));
  }
  rainfall(ctx, -60, 500, W + 120, 800, t, 0.6, { n: 90, dome: [540, M.y - 60, 400] });
  hill(ctx, t);
  meditator(ctx, M.x, M.y, M.s, { t, center: 1, eyesOpen: t > C1.negativity - 0.5 });
  const [hx, hy] = heartOf(M.x, M.y, M.s);
  rings(ctx, hx, hy, t, 1, { R: 300 });
  ctx.restore();
  label(ctx, 'watch it play out', 540, 720, ss(t, C1.play - 0.5, C1.play + 0.6), { color: '#ffe6a6', size: 56, fam: 'Scrawl', style: 'bold' });
  subBand(ctx);
  seriesTag(ctx, 'THE OBSERVING CENTER', 0.9);
}, { type: 'fade', dur: 0.5 });

// ---------- 6. preliminary work: the foundation under the center ----------
G.scene(C1.important - 0.8, C1.fromThere - 0.2, (ctx, t) => {
  paperV(ctx);
  const n = 8, baseY = 1130, sh = 62;
  const grown = ss(t, C1.important - 0.4, C1.preliminary + 1.4);
  let topY = baseY;
  for (let i = 0; i < n; i++) {
    const k = clamp(grown * n - i);
    if (k <= 0) break;
    const y = baseY - (i + 1) * sh, w = 420 - i * 22;
    ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - E.outBack(k)) * -60);
    blob(ctx, [[540 - w / 2, y + sh], [540 - w / 2 + 10, y + 6], [540, y], [540 + w / 2 - 8, y + 4], [540 + w / 2, y + sh]], ['#b7a58e', '#c9b79c', '#a9977e'][i % 3], { w: 3.5, n: 3 });
    ctx.fillStyle = P.navy; ctx.font = font(30, 'Hand'); ctx.textAlign = 'center'; ctx.fillText(['sit', 'breathe', 'notice', 'return', 'sit', 'notice', 'return', 'breathe'][i], 540, y + sh * 0.62);
    ctx.restore();
    topY = y;
  }
  label(ctx, 'preliminary work', 540, 300, ss(t, C1.preliminary - 0.2, C1.preliminary + 0.9), { size: 64 });
  label(ctx, 'practice on calm days', 540, 370, ss(t, C1.preliminary + 0.6, C1.preliminary + 1.8), { size: 42, color: '#6a5a48' });
  // the storm comes — the centered one holds
  const st = ss(t, C1.hold3 - 0.4, C1.hold3 + 0.6);
  if (st > 0) {
    cloud(ctx, lerp(-200, 330, st), 520, 380, 160, { seed: 4, alpha: st });
    for (let i = 0; i < 5; i++) { const y = 560 + i * 40, x0 = lerp(-200, 380, st); stroke(ctx, [[x0, y], [x0 + 140, y + 6]], { w: 3, color: '#6f7aa6', alpha: st }); }
  }
  meditator(ctx, 540, topY + 4, 0.55, { t, center: ss(t, C1.hold3, C1.center3 + 0.3), eyesOpen: false });
  rings(ctx, 540, topY - 80, t, ss(t, C1.center3 - 0.2, C1.center3 + 0.6), { R: 200, color: '220,150,40' });
}, { type: 'wipe', dur: 0.5 });

// ---------- 7. from there: thoughts and feelings go by ----------
G.scene(C1.fromThere - 0.4, G.DURATION, (ctx, t) => {
  nightV(ctx, t, { starA: 0.9 });
  hill(ctx, t);
  const [hx, hy] = heartOf(M.x, M.y, M.s);
  // thoughts (clouds with words) drift by, then feelings (coloured mists)
  const thoughts = [['never going to work', 0.0, 360], ['bad news', 0.7, 520], ['what if…', 1.3, 260]];
  thoughts.forEach(([txt, d, y], i) => {
    const t0 = C1.thoughts - 1.2 + d, k = (t - t0) / 6.5;
    if (k < 0 || k > 1) return;
    const x = lerp(-380, 1460, k);
    cloud(ctx, x, y, 420, 150, { seed: 30 + i, fill: STORM2, text: txt, textSize: 44 });
    if (t < C1.end) inkLine(ctx, hx, hy, x, y + 60, { w: 2.5, color: 'rgba(255,230,160,0.7)', dash: [8, 10], seed: i });
  });
  const feelings = [['#e2858f', 'tense', 0, 640], ['#6aa0e0', 'heavy', 0.8, 470], ['#e0b04a', 'anxious', 1.5, 300]];
  feelings.forEach(([col, lab, d, y], i) => {
    const t0 = C1.feelings - 0.6 + d, k = (t - t0) / 6.0;
    if (k < 0 || k > 1) return;
    const x = lerp(1440, -360, k);
    ctx.save(); ctx.globalAlpha = 0.85;
    glow(ctx, x, y, 170, `rgba(${parseInt(col.slice(1, 3), 16)},${parseInt(col.slice(3, 5), 16)},${parseInt(col.slice(5, 7), 16)},`, 0.9, 'source-over');
    ctx.restore();
    handText(ctx, lab, x, y + 12, { size: 46, align: 'center', color: '#fff6e0' });
    if (t < C1.end) inkLine(ctx, hx, hy, x, y + 20, { w: 2.5, color: 'rgba(255,230,160,0.7)', dash: [8, 10], seed: 9 + i });
  });
  meditator(ctx, M.x, M.y, M.s, { t, center: 1, eyesOpen: true });
  rings(ctx, hx, hy, t, 1, { R: 300 });
  label(ctx, 'thoughts go by', 270, 760, ss(t, C1.thoughts, C1.thoughts + 0.8), { color: '#e6e0ff', size: 48, fam: 'Scrawl', style: 'bold', alpha: 1 - ss(t, C1.end, C1.end + 0.4) });
  label(ctx, 'feelings go by', 810, 760, ss(t, C1.feelings, C1.feelings + 0.8), { color: '#ffd9c0', size: 48, fam: 'Scrawl', style: 'bold', alpha: 1 - ss(t, C1.end, C1.end + 0.4) });
  subBand(ctx);
  seriesTag(ctx, 'THE OBSERVING CENTER', 0.9);
  // end card
  const ec = ss(t, C1.end + 0.1, C1.end + 0.9);
  if (ec > 0) {
    ctx.fillStyle = `rgba(5,8,30,${0.55 * ec})`; ctx.fillRect(0, 0, W, H);
    label(ctx, 'Hold to the', 540, 560, ec, { size: 84, fam: 'Garamond', style: 'italic 600', color: '#fff3d0' });
    label(ctx, 'observing center.', 540, 660, ss(t, C1.end + 0.5, C1.end + 1.5), { size: 92, fam: 'Garamond', style: 'italic 600', color: GOLD, glow: 'rgba(255,200,90,0.8)' });
  }
}, { type: 'fade', dur: 0.5 });
