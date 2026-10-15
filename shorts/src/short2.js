// SHORT 2 — "Who Is Watching?" (≈111 s). The felt weight of despair, Eckhart Tolle's question, the space.
'use strict';

G.AUDIO_END = window.AUDIO_DUR; G.DURATION = window.AUDIO_DUR + 3.0;
SUBS.build(window.WORDS, ['observing', 'watching', 'body', 'hopeless', 'helpless', 'failure', 'despair', 'heart', 'sink', 'sinking', 'feel', 'cloud', 'heavier', 'eckhart', 'tolle', 'boom', 'space', 'thoughts', 'sensations']);
SUBS.hidden = t => t > window.AUDIO_DUR + 0.2;

const C2 = {
  who1: cue('who'), watching1: cueP("who's watching this"), body: cue('body'), hopeless: cue('hopeless'), helpless: cue('helpless'), givingUp: cue('giving'),
  noMatter: cueP('no matter'), neverWork: cue('never'), world: cue('world'), failure: cue('failure'), noOne: cueP('no one'), success: cue('success'), ahead: cue('ahead', 2), despair: cue('despair'), badNews: cueP('bad news'),
  focus: cue('focus'), sinking: cue('sinking'), sink: cue('sink'), feelDespair: cueP('but just feel'), justFeel: cueP('just feel it'), god: cue('god'),
  cloud: cue('cloud'), heavier: cue('heavier'), someone: cue('someone'), andSo: cueP('and so someone'), tolle: cue('tolle'), depressed: cue('depressed'), wondered: cue('wondered'),
  observing2: cue('observing', 2), watching2: cueP("who's watching this", 2), whoWants: cueP('who is it that wants'), whoAmI: cueP('who am i'), describes: cue('describes'),
  boom: cue('boom'), realized: cue('realized'), space1: cue('space'), space2: cue('space', 2), space3: cue('space', 3), sensations: cue('sensations'), end: window.AUDIO_DUR,
};

// gold eye (the watcher) — a gold-palette take on the film's eye glyph
function goldEye(ctx, x, y, s, o = {}) {
  const open = o.open ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= o.alpha ?? 1;
  glow(ctx, 0, 0, 300, GOLDG, 0.45 * open);
  ctx.beginPath(); ctx.moveTo(-200, 0); ctx.quadraticCurveTo(0, -150 * open, 200, 0); ctx.quadraticCurveTo(0, 150 * open, -200, 0); ctx.closePath();
  ctx.fillStyle = 'rgba(255,246,220,0.95)'; ctx.fill();
  ctx.save(); ctx.clip();
  const gi = ctx.createRadialGradient(0, 0, 8, 0, 0, 80); gi.addColorStop(0, '#3a2408'); gi.addColorStop(0.35, '#c8860e'); gi.addColorStop(0.8, '#ffd76a'); gi.addColorStop(1, '#8a5a10');
  ctx.fillStyle = gi; ctx.beginPath(); ctx.arc(o.look ?? 0, 0, 80, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(60,30,5,0.45)'; ctx.lineWidth = 2; for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; ctx.beginPath(); ctx.moveTo((o.look ?? 0) + Math.cos(a) * 34, Math.sin(a) * 34); ctx.lineTo((o.look ?? 0) + Math.cos(a) * 74, Math.sin(a) * 74); ctx.stroke(); }
  ctx.fillStyle = '#120a02'; ctx.beginPath(); ctx.arc(o.look ?? 0, 0, 30 * (o.pupil ?? 1), 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc((o.look ?? 0) + 26, -26, 11, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#1a1206'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-200, 0); ctx.quadraticCurveTo(0, -150 * open, 200, 0); ctx.quadraticCurveTo(0, 150 * open, -200, 0); ctx.closePath(); ctx.stroke();
  ctx.restore();
}
// dark "slate" paper for the heavy, felt passages — chalk-like lines
const CHALK = '#e9e6f8';
function slate(ctx) {
  ctx.fillStyle = vgrad(ctx, 0, H, [[0, '#151a36'], [1, '#0d1026']]); ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.07; ctx.globalCompositeOperation = 'screen'; ctx.drawImage(TX.paper, 0, 0); ctx.restore();
  paperGrid(ctx, 0.6, 60, 'rgba(180,190,255,0.06)');
}
function inkBlot(ctx, x, y, r, k, t, seed, col = 'rgba(40,20,70,') {
  if (k <= 0) return;
  const pts = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; pts.push([x + Math.cos(a) * r * k * (1 + 0.25 * vnoise(a * 2 + seed + t * 0.6, seed)), y + Math.sin(a) * r * k * (1 + 0.25 * vnoise(a * 2 + seed * 3 + t * 0.6, seed))]); }
  fillPts(ctx, pts, col + '0.85)'); glow(ctx, x, y, r * k * 1.6, col, 0.4, 'source-over');
}
const BODY = { x: 540, y: 1270, s: 1.05 };

// ---------- 1. cold open: who is watching? ----------
G.scene(0, C2.body - 0.2, (ctx, t) => {
  ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H);
  stars(ctx, t, { seed: 3, n: 160, x: 0, y: 0, w: W, h: H, alpha: 0.5 * ss(t, 0.3, 2) });
  const op = ss(t, 0.2, 2.2, E.out), blink = 1 - pulse(t, C2.watching1 - 0.1, 0.25) * 0.9;
  goldEye(ctx, 540, 720, lerp(1.6, 1.9, seg(t, 0, C2.body)), { open: op * blink, look: Math.sin(t * 0.8) * 20 });
  label(ctx, 'who is watching?', 540, 1110, ss(t, C2.watching1 - 0.1, C2.watching1 + 1.2), { size: 72, fam: 'Garamond', style: 'italic 600', color: '#ffe6a6', glow: 'rgba(255,200,90,0.6)' });
  seriesTag(ctx, 'THE OBSERVING CENTER', ss(t, 0.6, 1.6));
}, { type: 'cut' });

// ---------- 2. feel it in your body: hopeless, helpless, giving up ----------
G.scene(C2.body - 0.5, C2.noMatter - 0.1, (ctx, t) => {
  slate(ctx);
  const slump = ss(t, C2.givingUp - 0.2, C2.givingUp + 1.0);
  bodyOutline(ctx, BODY.x, BODY.y, BODY.s, { fill: 'rgba(233,230,248,0.06)', stroke: CHALK, slump, alpha: ss(t, C2.body - 0.4, C2.body + 0.6) });
  const cy = BODY.y - 560 * BODY.s;
  inkBlot(ctx, BODY.x, cy + 20, 90, ss(t, C2.body + 0.3, C2.hopeless + 0.8), t, 2);
  inkBlot(ctx, BODY.x, cy + 170, 70, ss(t, C2.hopeless, C2.helpless + 0.6), t, 5);
  inkBlot(ctx, BODY.x - 120, cy - 40 + slump * 30, 50, ss(t, C2.helpless, C2.givingUp + 0.4), t, 7);
  inkBlot(ctx, BODY.x + 120, cy - 40 + slump * 30, 50, ss(t, C2.helpless + 0.2, C2.givingUp + 0.6), t, 9);
  const tags = [[C2.hopeless, 'hopeless', 200, cy - 120, BODY.x - 70, cy], [C2.helpless, 'helpless', 880, cy + 60, BODY.x + 70, cy + 150], [C2.givingUp, 'giving up', 210, cy + 330, BODY.x - 120, cy + 20 + slump * 30]];
  tags.forEach(([tc, txt, x, y, tx, ty], i) => {
    const k = ss(t, tc - 0.1, tc + 0.6);
    label(ctx, txt, x, y, k, { size: 58, color: '#c9b8ff', fam: 'Scrawl', style: 'bold' });
    inkArrow(ctx, bez2([x + (x < 540 ? 70 : -70), y + 14], [lerp(x, tx, 0.5), y + 50], [tx, ty]), { p: ss(t, tc + 0.2, tc + 0.8), w: 3, color: CHALK, seed: 30 + i, head: 12 });
  });
  label(ctx, 'feel it in your body', 540, 300, ss(t, C2.body - 0.3, C2.body + 1.2), { size: 64, color: CHALK });
  seriesTag(ctx, 'THE OBSERVING CENTER', 0.85);
}, { type: 'fade', dur: 0.4 });

// ---------- 3. the story despair tells: never going to work… ----------
G.scene(C2.noMatter - 0.4, C2.focus - 0.1, (ctx, t) => {
  const dark = ss(t, C2.noMatter, C2.badNews + 1.5);
  nightV(ctx, t, { starA: 1 - dark, moon: dark < 0.6, horizon: 1100 });
  // a road toward the horizon
  ctx.save();
  shape(ctx, [[470, 1110], [610, 1110], [1020, H + 50], [60, H + 50]], '#8a86ae', { w: 3 });
  ctx.setLineDash([40, 40]); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(540, 1120); ctx.lineTo(540, H); ctx.stroke(); ctx.restore();
  // what's ahead dissolves into dark fog
  const fog = ss(t, C2.ahead - 0.4, C2.badNews + 1.0);
  if (fog > 0) { const g = ctx.createLinearGradient(0, 900, 0, 1300); g.addColorStop(0, `rgba(12,8,28,${0.95 * fog})`); g.addColorStop(1, 'rgba(12,8,28,0)'); ctx.fillStyle = g; ctx.fillRect(0, 700, W, 600); }
  // thought clouds pile up, lower and lower over the head
  const thoughts = [[C2.neverWork, "it's never going to work", 330, 0], [C2.world, 'the world won’t work for me', 520, 1], [C2.noOne, 'no one really cares', 700, 2], [C2.success, 'never a success', 410, 3], [C2.ahead, 'never get ahead', 610, 4], [C2.despair, 'just despair', 790, 5]];
  thoughts.forEach(([tc, txt, y, i]) => {
    const k = ss(t, tc - 0.2, tc + 0.5, E.outBack);
    if (k <= 0) return;
    const press = ss(t, C2.despair, C2.badNews + 1.5) * 60;
    cloud(ctx, i % 2 ? 640 : 440, y + press, 560 * k, 170 * k, { seed: 40 + i, fill: i % 2 ? '#3b3460' : '#463d72', text: k > 0.7 ? txt : '', textSize: 42 });
  });
  // FAILURE, written on the road ahead
  const fw = ss(t, C2.failure + 0.3, C2.failure + 1.6);
  if (fw > 0) { ctx.save(); ctx.translate(540, 1215); ctx.scale(1, 0.55); handText(ctx, 'FAILURE', 0, 0, { size: 150, fam: 'Cinzel', style: '700', align: 'center', color: 'rgba(30,14,36,0.9)', p: fw }); ctx.restore(); }
  // you: a small figure on the road, shrinking under the weight
  const wgt = ss(t, C2.noOne, C2.badNews + 1.0);
  figure(ctx, 540, 1500, lerp(330, 250, wgt), '#1a1636', { face: 1, stroke: '#0a0814' });
  // no one cares: distant figures turn away
  const nc = env(t, C2.noOne, C2.success + 0.2, 0.3, 0.5);
  if (nc > 0) [[200, 1180], [860, 1200], [960, 1150]].forEach(([x, y], i) => figure(ctx, x, y, 110, `rgba(40,36,80,${nc})`, { face: i % 2 ? 1 : -1, line: false }));
  ctx.fillStyle = `rgba(5,4,15,${0.45 * dark})`; ctx.fillRect(0, 0, W, H);
  subBand(ctx);
  seriesTag(ctx, 'THE OBSERVING CENTER', 0.85 * (1 - dark * 0.6));
}, { type: 'fade', dur: 0.4 });

// ---------- 4. focus on the body: the heart sinks ----------
G.scene(C2.focus - 0.4, C2.cloud - 1.2, (ctx, t) => {
  slate(ctx);
  bodyOutline(ctx, BODY.x, BODY.y, BODY.s, { fill: 'rgba(233,230,248,0.06)', stroke: CHALK, slump: 0.6 });
  const chestY = BODY.y - 580 * BODY.s, gutY = BODY.y - 330 * BODY.s;
  const sinkK = ss(t, C2.sinking - 0.2, C2.sinking + 1.0) * 0.55 + ss(t, C2.sink - 0.1, C2.sink + 1.0) * 0.45;
  const hy = lerp(chestY, gutY, sinkK);
  // focus ring
  const fk = ss(t, C2.focus, C2.focus + 0.8);
  inkCircle(ctx, BODY.x, chestY, 150, { p: fk, w: 4, color: '#ffe6a6', dash: [12, 10], seed: 3 });
  label(ctx, 'focus on the body', 540, 300, ss(t, C2.focus, C2.focus + 1.0), { size: 60, color: CHALK });
  // ghost of where the heart was + motion lines
  if (sinkK > 0.05) { heartShape(ctx, BODY.x, chestY, 1.5, 'rgba(226,82,94,0.25)', 0.6); for (let i = 0; i < 3; i++) stroke(ctx, [[BODY.x - 40 + i * 40, chestY + 50], [BODY.x - 40 + i * 40, hy - 40]], { w: 3, color: 'rgba(233,230,248,0.6)', dash: [8, 8] }); }
  heartShape(ctx, BODY.x, hy, 1.5 + 0.06 * Math.sin(t * 6), '#e2525e');
  if (sinkK > 0.2) { rings(ctx, BODY.x, hy, t, sinkK, { R: 140, n: 2, color: '226,120,130' }); label(ctx, 'sinking', 850, hy + 20, ss(t, C2.sinking, C2.sinking + 0.8), { size: 56, color: '#ff9aa4', fam: 'Scrawl', style: 'bold' }); }
  // just feel it: awareness wraps the body in gold — holding, not fighting
  const aw = ss(t, C2.justFeel - 0.2, C2.god + 0.6);
  if (aw > 0) {
    ctx.save(); ctx.shadowColor = 'rgba(255,200,90,0.9)'; ctx.shadowBlur = 24;
    bodyOutline(ctx, BODY.x, BODY.y, BODY.s * 1.06, { fill: 'rgba(0,0,0,0)', stroke: `rgba(255,214,110,${aw})`, lw: 6, slump: 0.6 });
    ctx.restore();
    label(ctx, 'just feel it', 540, 380, ss(t, C2.justFeel, C2.justFeel + 0.8), { size: 64, color: '#ffe6a6', fam: 'Scrawl', style: 'bold' });
    label(ctx, '(don’t fight it)', 540, 440, ss(t, C2.god - 0.4, C2.god + 0.6), { size: 42, color: 'rgba(255,230,166,0.8)' });
  }
  seriesTag(ctx, 'THE OBSERVING CENTER', 0.85);
}, { type: 'fade', dur: 0.4 });

// ---------- 5. a dark cloud — but heavier ----------
G.scene(C2.cloud - 1.4, C2.andSo + 0.1, (ctx, t) => {
  slate(ctx);
  const heavy = ss(t, C2.heavier - 0.4, C2.heavier + 0.8);
  const drop = 60 + E.outBack(heavy) * 60;
  bodyOutline(ctx, BODY.x, 1320, 0.85, { fill: 'rgba(233,230,248,0.06)', stroke: CHALK, slump: 0.6 + heavy * 0.4 });
  const ck = ss(t, C2.cloud - 1.2, C2.cloud + 0.2, E.out);
  if (heavy < 1) cloud(ctx, 540, 420 + drop * 0.5, 620 * ck, 240 * ck, { seed: 77, fill: '#2a2448', alpha: 1 - heavy });
  if (heavy > 0) {
    // the cloud condenses into stone
    ctx.save(); ctx.globalAlpha = heavy;
    blob(ctx, [[300, 470 + drop], [360, 350 + drop], [520, 320 + drop], [720, 360 + drop], [790, 470 + drop], [700, 540 + drop], [420, 545 + drop]], '#3c3a4a', { w: 5, n: 5, stroke: CHALK });
    ctx.strokeStyle = 'rgba(233,230,248,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(420, 400 + drop); ctx.lineTo(500, 450 + drop); ctx.lineTo(480, 510 + drop); ctx.moveTo(620, 380 + drop); ctx.lineTo(660, 470 + drop); ctx.stroke();
    for (let i = 0; i < 3; i++) stroke(ctx, [[400 + i * 140, 280 + drop - 20], [400 + i * 140, 220 + drop - 20]], { w: 4, color: 'rgba(233,230,248,0.5)' });
    ctx.restore();
    label(ctx, 'heavier than that', 540, 340, ss(t, C2.heavier, C2.heavier + 0.9), { size: 60, color: '#c9b8ff', fam: 'Scrawl', style: 'bold' });
  }
  label(ctx, 'a dark cloud', 540, 250, ss(t, C2.cloud - 0.2, C2.cloud + 0.8), { size: 64, color: CHALK });
  seriesTag(ctx, 'THE OBSERVING CENTER', 0.0);
}, { type: 'fade', dur: 0.4 });

// ---------- 6. Eckhart Tolle: a dark night, and a question ----------
function room(ctx, t, o = {}) {
  ctx.fillStyle = vgrad(ctx, 0, H, [[0, '#14122a'], [1, '#0a0918']]); ctx.fillRect(0, 0, W, H);
  // window onto the night world
  ctx.save(); ctx.beginPath(); ctx.rect(300, 260, 480, 560); ctx.clip();
  ctx.fillStyle = vgrad(ctx, 260, 820, [[0, '#071344'], [1, '#2c5cc0']]); ctx.fillRect(300, 260, 480, 560);
  stars(ctx, t, { seed: 12, n: 70, x: 300, y: 260, w: 480, h: 500 });
  drawMoon(ctx, 660, 380, 34);
  ctx.restore();
  ctx.strokeStyle = '#2a2240'; ctx.lineWidth = 18; ctx.strokeRect(300, 260, 480, 560); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(540, 260); ctx.lineTo(540, 820); ctx.moveTo(300, 540); ctx.lineTo(780, 540); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, 820, 0, 1500); g.addColorStop(0, 'rgba(90,120,220,0.18)'); g.addColorStop(1, 'rgba(90,120,220,0)'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(300, 820); ctx.lineTo(780, 820); ctx.lineTo(900, 1500); ctx.lineTo(180, 1500); ctx.closePath(); ctx.fill(); ctx.restore();
  // bed edge
  shape(ctx, [[60, 1260], [1020, 1260], [1020, 1340], [60, 1340]], '#2a2448', { w: 3, stroke: '#0a0814' });
}
function seatedSide(ctx, x, y, s, col, headDown = 0) {
  // a figure sitting on the bed's edge, seen from the front-ish, head bowed
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  blob(ctx, [[-70, 0], [-60, -200], [60, -200], [70, 0]], col, { w: 3, stroke: '#0a0814', n: 4 });
  limb(ctx, [[-55, -180], [-80, -90], [-30, -40]], [36, 30, 26], col, 3);
  limb(ctx, [[55, -180], [80, -90], [30, -40]], [36, 30, 26], col, 3);
  shape(ctx, [[-60, 0], [-50, 160], [-10, 160], [-10, 0]], col, { w: 3, stroke: '#0a0814' }); shape(ctx, [[60, 0], [50, 160], [10, 160], [10, 0]], col, { w: 3, stroke: '#0a0814' });
  ctx.beginPath(); ctx.ellipse(0, -240 + headDown * 30, 42, 48, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = '#0a0814'; ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}
G.scene(C2.andSo - 0.3, C2.describes - 0.2, (ctx, t) => {
  room(ctx, t);
  const pull = ss(t, C2.observing2 - 0.5, C2.whoAmI + 1.5);
  const bowed = 1 - ss(t, C2.observing2 - 0.3, C2.observing2 + 0.8);
  seatedSide(ctx, 540, 1250, 1.2, '#2d2850', bowed);
  // the thought hangs over him
  const th = ss(t, C2.depressed - 0.3, C2.depressed + 0.6);
  if (th > 0) cloud(ctx, 540, 620 - pull * 120, 640, 200, { seed: 88, fill: '#2a2448', text: 'I can’t live with myself', textSize: 44, alpha: th * (1 - pull * 0.35) });
  // the watcher: a gold outline that is not the thought, looking at it
  const wk = ss(t, C2.observing2 - 0.2, C2.watching2 + 0.6);
  if (wk > 0) {
    ctx.save(); ctx.globalAlpha = wk; ctx.shadowColor = 'rgba(255,200,90,0.9)'; ctx.shadowBlur = 30;
    meditator(ctx, 540, 1110, 1.0, { sil: 'rgba(255,214,110,0.0)', lw: 0.001 });
    ctx.restore();
    ctx.save(); ctx.globalAlpha = wk;
    inkCircle(ctx, 540, 1250 - 290 * 1.2, 70, { w: 4, color: '#ffd76a', seed: 2 });
    glow(ctx, 540, 1250 - 290 * 1.2, 220, GOLDG, 0.7 * wk);
    ctx.restore();
    inkArrow(ctx, [[540, 1250 - 360 * 1.2], [540, 720 - pull * 120]], { p: ss(t, C2.watching2 - 0.2, C2.watching2 + 0.6), w: 4, color: '#ffd76a', dash: [12, 10], seed: 4 });
  }
  // the question itself
  const q = ss(t, C2.whoWants - 0.1, C2.whoAmI + 0.6);
  if (q > 0) {
    label(ctx, 'thought', 860, 560 - pull * 120, ss(t, C2.whoWants, C2.whoWants + 0.6), { size: 44, color: '#c9b8ff', fam: 'Scrawl', style: 'bold' });
    label(ctx, '…and who is watching it?', 540, 800, ss(t, C2.whoAmI - 0.2, C2.whoAmI + 1.6), { size: 52, color: '#ffe6a6', fam: 'Garamond', style: 'italic 600' });
  }
  // name card
  const nc = env(t, C2.someone, C2.depressed + 0.6, 0.5, 0.5);
  if (nc > 0) {
    ctx.save(); ctx.globalAlpha = nc;
    shape(ctx, [[230, 140], [850, 140], [850, 250], [230, 250]], 'rgba(244,238,224,0.95)', { w: 3 });
    ctx.restore();
    label(ctx, 'Eckhart Tolle', 540, 216, ss(t, C2.tolle - 0.6, C2.tolle + 0.3), { size: 64, fam: 'Garamond', style: '600', color: P.navy, alpha: nc });
  }
  subBand(ctx);
}, { type: 'fade', dur: 0.5 });

// ---------- 7. "he describes it much better" — the book ----------
G.scene(C2.describes - 0.4, C2.boom - 0.05, (ctx, t) => {
  paperV(ctx);
  const k = ss(t, C2.describes - 0.3, C2.describes + 0.5, E.outBack);
  ctx.save(); ctx.translate(540, 720); ctx.scale(k, k); ctx.rotate(-0.04);
  shape(ctx, [[-230, -330], [230, -330], [230, 330], [-230, 330]], '#1f3a6a', { w: 4 });
  shape(ctx, [[-230, -330], [-200, -330], [-200, 330], [-230, 330]], '#14284c', { w: 3 });
  glow(ctx, 20, -40, 160, GOLDG, 0.8, 'source-over');
  ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.arc(20, -40, 22, 0, TAU); ctx.fill();
  ctx.font = font(54, 'Garamond', '600'); ctx.textAlign = 'center'; ctx.fillStyle = '#f4ecd8';
  ctx.fillText('The Power', 20, 140); ctx.fillText('of Now', 20, 200);
  ctx.font = font(34, 'Garamond', 'italic'); ctx.fillText('Eckhart Tolle', 20, 280);
  ctx.restore();
  label(ctx, 'he tells it best', 540, 260, ss(t, C2.describes, C2.describes + 1.0), { size: 56 });
}, { type: 'fade', dur: 0.4 });

// ---------- 8. boom — the space between your thoughts and you ----------
G.scene(C2.boom - 0.1, G.DURATION, (ctx, t) => {
  const pull = ss(t, C2.boom, C2.space3 + 0.8, E.inOut);
  ctx.save(); cam(ctx, 540, lerp(1050, 960, pull), lerp(1.6, 1.0, pull));
  nightV(ctx, t, { horizon: 1160 });
  hill(ctx, t);
  const mx = 540, my = 1282, ms = 1.5;
  const [hx, hy] = heartOf(mx, my, ms);
  // thoughts drift up and away; sensations drift out to the sides
  const gapK = ss(t, C2.space1 - 0.2, C2.space1 + 0.6) * 0.3 + ss(t, C2.space2 - 0.2, C2.space2 + 0.6) * 0.3 + ss(t, C2.space3 - 0.2, C2.space3 + 1.4) * 0.4;
  const thoughts = [['never going to work', -170], ['no one cares', 0], ['bad news', 170]];
  thoughts.forEach(([txt, dx], i) => {
    const y = lerp(820, 260, gapK) + (i % 2) * 60, x = 540 + dx * lerp(1, 1.6, gapK);
    cloud(ctx, x, y, lerp(360, 260, gapK), lerp(130, 100, gapK), { seed: 60 + i, fill: STORM2, text: txt, textSize: lerp(36, 28, gapK), alpha: lerp(1, 0.75, gapK) });
  });
  const sens = ss(t, C2.sensations - 0.3, C2.sensations + 1.2);
  [['#e2858f', -1], ['#6aa0e0', 1]].forEach(([col, side], i) => {
    const x = hx + side * lerp(120, 380, sens), y = hy + 40 - sens * 60;
    glow(ctx, x, y, 120, `rgba(${parseInt(col.slice(1, 3), 16)},${parseInt(col.slice(3, 5), 16)},${parseInt(col.slice(5, 7), 16)},`, 0.8, 'source-over');
  });
  meditator(ctx, mx, my, ms, { t, center: ss(t, C2.boom, C2.boom + 0.6), eyesOpen: false });
  rings(ctx, hx, hy, t, ss(t, C2.boom, C2.boom + 1.0), { R: 380 });
  // the gap, measured: a double arrow that keeps growing
  if (gapK > 0) {
    const top = lerp(880, 360, gapK), bot = my - 340 * ms;
    inkArrow(ctx, [[1000 - 70, (top + bot) / 2], [1000 - 70, top + 40]], { w: 4, color: '#ffe6a6', seed: 5, head: 18 });
    inkArrow(ctx, [[1000 - 70, (top + bot) / 2], [1000 - 70, bot - 10]], { w: 4, color: '#ffe6a6', seed: 6, head: 18 });
    label(ctx, 'space', 860, (top + bot) / 2 + 16, ss(t, C2.space1, C2.space1 + 0.6), { size: 56, color: '#ffe6a6', fam: 'Scrawl', style: 'bold' });
  }
  if (sens > 0) {
    inkArrow(ctx, [[hx - 40, hy + 40], [hx - lerp(120, 330, sens), hy + 40 - sens * 60]], { w: 3.5, color: '#ffe6a6', seed: 7, head: 14 });
    inkArrow(ctx, [[hx + 40, hy + 40], [hx + lerp(120, 330, sens), hy + 40 - sens * 60]], { w: 3.5, color: '#ffe6a6', seed: 8, head: 14 });
  }
  ctx.restore();
  // the boom
  const fl = pulse(t, C2.boom - 0.05, 0.7);
  if (fl > 0) { ctx.fillStyle = `rgba(255,236,190,${0.85 * fl})`; ctx.fillRect(0, 0, W, H); }
  subBand(ctx);
  seriesTag(ctx, 'THE OBSERVING CENTER', 0.9);
  const ec = ss(t, C2.end + 0.1, C2.end + 0.9);
  if (ec > 0) {
    ctx.fillStyle = `rgba(5,8,30,${0.6 * ec})`; ctx.fillRect(0, 0, W, H);
    label(ctx, 'There’s a space', 540, 560, ec, { size: 88, fam: 'Garamond', style: 'italic 600', color: '#fff3d0' });
    label(ctx, 'between your thoughts', 540, 660, ss(t, C2.end + 0.4, C2.end + 1.3), { size: 70, fam: 'Garamond', style: 'italic 600', color: '#fff3d0' });
    label(ctx, 'and you.', 540, 760, ss(t, C2.end + 0.9, C2.end + 1.8), { size: 92, fam: 'Garamond', style: 'italic 600', color: GOLD, glow: 'rgba(255,200,90,0.8)' });
  }
}, { type: 'cut' });
