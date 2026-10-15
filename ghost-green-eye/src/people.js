// Ghost Green-Eye — people. Profile busts in cel style (flat fill + ink), facing right in local space.
'use strict';

const LOOKS = {
  you:   { skin: '#eebd98', skinSh: '#cf9472', hair: '#1f2747', hairHi: '#3a4a7a', top: '#2c8c93', topSh: '#1d6168', collar: '#e9e2cf' },
  her:   { skin: '#f3c8a8', skinSh: '#d79c80', hair: '#8c2f3a', hairHi: '#b8495a', top: '#e9654c', topSh: '#b2412f', collar: '#f3d5a0' },
  rival: { skin: '#e8b48c', skinSh: '#c58a66', hair: '#f0c95a', hairHi: '#fff0a6', top: '#d99a32', topSh: '#a8701e', collar: '#2a2238' },
};
function drawBust(ctx, x, y, s, o = {}) {
  const who = o.who ?? 'you', L = o.sil ? null : LOOKS[who], sil = o.sil;
  const C = k => (sil ? sil : L[k]);
  const lw = (o.lw ?? 3.4) / s;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.face ?? 1), s); ctx.globalAlpha *= o.alpha ?? 1;
  const tt = o.t ?? 0, breathe = Math.sin(tt * 1.8 + (who === 'her' ? 1 : 0)) * 2;
  ctx.translate(0, breathe * 0.5);
  // --- hair behind (long hair) ---
  const tilt = o.tilt ?? 0;
  const headRot = (fn) => { ctx.save(); ctx.translate(0, -262); ctx.rotate(tilt); ctx.translate(0, 262); fn(); ctx.restore(); };
  if (who === 'her') headRot(() => {
    const sway = Math.sin(tt * 1.3) * 4;
    blob(ctx, [[30, -398], [-40, -404], [-82, -360], [-92, -290], [-100 + sway, -200], [-112 + sway, -130], [-70 + sway, -120], [-40, -170], [-30, -250], [-10, -300]], C('hair'), { w: lw });
  });
  // --- torso ---
  const torso = smoothPts([[-62, -240], [44, -244], [74, -196], [82, -100], [80, 40], [-78, 40], [-86, -110], [-82, -206]], true, 6);
  shape(ctx, torso, C('top'), { w: lw });
  if (!sil) {
    ctx.save(); ctx.beginPath(); torso.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.clip();
    ctx.fillStyle = L.topSh; ctx.beginPath(); ctx.ellipse(-70, -60, 50, 200, 0, 0, TAU); ctx.fill();
    ctx.restore(); shape(ctx, torso, null, { w: lw });
    // collar / neckline
    if (who === 'you') shape(ctx, [[-6, -236], [34, -236], [22, -196], [10, -214]], L.collar, { w: lw });
    if (who === 'rival') { shape(ctx, [[-10, -238], [36, -238], [44, -150], [20, -120], [0, -170]], L.collar, { w: lw }); shape(ctx, [[36, -238], [62, -200], [44, -150]], L.topSh, { w: lw }); }
    if (who === 'her') shape(ctx, smoothPts([[-14, -236], [40, -236], [30, -205], [6, -200]], true, 4), L.skin, { w: lw });
  }
  // --- neck ---
  headRot(() => {
    shape(ctx, [[-24, -286], [34, -276], [38, -232], [-22, -228]], C('skin'), { w: lw });
    if (!sil) { ctx.fillStyle = L.skinSh; ctx.beginPath(); ctx.moveTo(-12, -278); ctx.lineTo(30, -262); ctx.lineTo(30, -250); ctx.lineTo(-12, -258); ctx.fill(); }
    // --- head profile ---
    const jaw = who === 'rival' ? 6 : who === 'her' ? -4 : 0;
    const mouthOpen = o.mouth === 'laugh' ? 14 : o.mouth === 'talk' ? Math.max(0, Math.sin((o.talkT ?? tt) * 14)) * 7 * (o.talkAmt ?? 1) : 0;
    const face = [[-58, -336], [-50, -376], [-16, -400], [30, -394], [54, -366], [58, -344], [62, -334], [82, -312], [76, -306], [64, -302],
      [68, -296], [62, -290 + mouthOpen * 0.2], [66, -284 + mouthOpen], [60, -270 + mouthOpen + jaw * 0.3], [44, -260 + mouthOpen * 0.8 + jaw], [12, -264 + jaw * 0.5], [-14, -282], [-46, -300]];
    const headPts = smoothPts(face, true, 5);
    shape(ctx, headPts, C('skin'), { w: lw });
    if (!sil) {
      // cheek shade + blush
      ctx.fillStyle = L.skinSh; ctx.globalAlpha *= 0.5; ctx.beginPath(); ctx.moveTo(-40, -300); ctx.quadraticCurveTo(10, -270, 40, -262); ctx.lineTo(-10, -262); ctx.closePath(); ctx.fill(); ctx.globalAlpha /= 0.5;
      if (who === 'her' || o.blush) { ctx.fillStyle = 'rgba(240,110,120,0.35)'; ctx.beginPath(); ctx.ellipse(30, -306, 14, 7, 0, 0, TAU); ctx.fill(); }
      // ear
      shape(ctx, smoothPts([[-30, -330], [-20, -336], [-15, -322], [-20, -308], [-30, -312]], true, 4), L.skin, { w: lw * 0.7 }); ctx.strokeStyle = L.skinSh; ctx.lineWidth = 2 / s; ctx.beginPath(); ctx.arc(-24, -321, 5, -1.2, 1.4); ctx.stroke();
      // mouth
      ctx.strokeStyle = P.ink; ctx.lineWidth = 2.2 / s; ctx.lineCap = 'round';
      if (o.mouth === 'laugh') { ctx.fillStyle = '#7a2a33'; ctx.beginPath(); ctx.moveTo(64, -290); ctx.lineTo(48, -286); ctx.lineTo(60, -276 + mouthOpen * 0.5); ctx.closePath(); ctx.fill(); }
      else if (o.mouth === 'smile') { ctx.beginPath(); ctx.moveTo(62, -289); ctx.quadraticCurveTo(54, -284, 46, -290); ctx.stroke(); }
      else if (o.mouth === 'tight') { ctx.beginPath(); ctx.moveTo(62, -289); ctx.lineTo(48, -287); ctx.stroke(); }
      else { ctx.beginPath(); ctx.moveTo(62, -289 + mouthOpen * 0.4); ctx.lineTo(50, -289 + mouthOpen * 0.3); ctx.stroke(); }
      if (who === 'her') { ctx.fillStyle = '#c83c4a'; ctx.beginPath(); ctx.ellipse(64, -292, 4, 2.5, 0, 0, TAU); ctx.fill(); }
      // eye
      const ex = 38, ey = -334, eg = o.eyeGreen ?? 0;
      if (o.eye === 'happy') { ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.moveTo(ex - 10, ey + 2); ctx.quadraticCurveTo(ex, ey - 7, ex + 10, ey + 2); ctx.stroke(); }
      else {
        const nar = o.eye === 'narrow' ? 0.5 : 1;
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(ex - 11, ey); ctx.quadraticCurveTo(ex, ey - 9 * nar, ex + 11, ey - 1); ctx.quadraticCurveTo(ex + 2, ey + 7 * nar, ex - 11, ey); ctx.fill();
        ctx.fillStyle = eg > 0.05 ? `rgb(${lerp(40, 40, eg)},${lerp(30, 230, eg)},${lerp(40, 140, eg)})` : (who === 'rival' ? '#3a6fc4' : '#2a1d1a');
        ctx.beginPath(); ctx.ellipse(ex + 5 + (o.lookDX ?? 0), ey - 0.5, 4.5, 6 * nar, 0, 0, TAU); ctx.fill();
        ctx.lineWidth = 3.2 / s; ctx.beginPath(); ctx.moveTo(ex - 12, ey - 1); ctx.quadraticCurveTo(ex, ey - 10 * nar, ex + 12, ey - 2); ctx.stroke();
        if (who === 'her') { ctx.beginPath(); ctx.moveTo(ex + 10, ey - 3); ctx.lineTo(ex + 17, ey - 8); ctx.stroke(); }
        if (eg > 0) { glow(ctx, ex + 5, ey, 30 * eg, 'rgba(40,255,150,', 0.8 * eg, 'source-over'); ctx.fillStyle = '#3dffa0'; ctx.beginPath(); ctx.ellipse(ex + 5 + (o.lookDX ?? 0), ey - 0.5, 4.5, 6 * nar, 0, 0, TAU); ctx.fill(); }
      }
      // brow
      const bt = o.brow ?? 0;
      ctx.lineWidth = (who === 'her' ? 2.4 : 4) / s; ctx.beginPath(); ctx.moveTo(ex - 12, ey - 15 + bt * 2); ctx.quadraticCurveTo(ex + 2, ey - 21 - bt * 1, ex + 16, ey - 16 + bt * 5); ctx.stroke();
    } else if ((o.eyeGreen ?? 0) > 0) {
      const eg = o.eyeGreen; ctx.fillStyle = '#3dffa0'; ctx.beginPath(); ctx.ellipse(43, -334.5, 5, 4, 0, 0, TAU); ctx.fill(); glow(ctx, 43, -334, 46 * eg, P.greenGlow, eg);
    }
    // --- hair front ---
    if (who === 'you') blob(ctx, [[54, -366], [46, -392], [70, -400], [30, -414], [40, -432], [0, -418], [-10, -444], [-30, -416], [-62, -428], [-56, -398], [-82, -392], [-62, -366], [-70, -340], [-48, -330], [-30, -352], [-10, -362], [14, -374], [30, -366]], C('hair'), { w: lw, n: 3 });
    if (who === 'rival') blob(ctx, [[52, -366], [60, -394], [86, -406], [58, -420], [20, -434], [-26, -428], [-58, -404], [-66, -360], [-52, -326], [-36, -354], [-12, -366], [16, -372], [36, -376]], C('hair'), { w: lw, n: 5 });
    if (who === 'her') blob(ctx, [[56, -360], [50, -388], [24, -406], [-20, -408], [-60, -386], [-66, -350], [-52, -320], [-36, -350], [-14, -372], [20, -380], [40, -372]], C('hair'), { w: lw, n: 5 });
    if (!sil) {
      ctx.strokeStyle = L.hairHi; ctx.lineWidth = 3 / s; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-30, -400); ctx.quadraticCurveTo(0, -410, 26, -398); ctx.stroke();
    }
  });
  // --- arm resting forward on the counter / gesturing ---
  const arm = o.arm ?? 'bar';
  const ga = o.gesture ?? 0;
  const sh = [6, -200], el = arm === 'bar' ? [lerp(26, 70, ga), lerp(-96, -150, ga)] : [40, -100];
  const hand = arm === 'bar' ? [lerp(112, 140, ga), lerp(-112, -250, ga)] : [130, -120];
  limb(ctx, [sh, el, hand], [46, 36, 30], C('top'), lw);
  shape(ctx, smoothPts([[hand[0] - 6, hand[1] - 14], [hand[0] + 22, hand[1] - 16], [hand[0] + 30, hand[1] - 2], [hand[0] + 16, hand[1] + 12], [hand[0] - 6, hand[1] + 12]], true, 4), C('skin'), { w: lw });
  ctx.restore();
}

// a cocktail / beer glass sitting on the counter
function glass(ctx, x, y, s, kind = 0, fill = '#f2b24a') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 0) {
    shape(ctx, [[-22, -80], [22, -80], [18, 0], [-18, 0]], 'rgba(220,240,255,0.35)', { w: 2.5 });
    shape(ctx, [[-20, -60], [20, -60], [17, -4], [-17, -4]], fill, { w: 0, line: false });
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-12, -70); ctx.lineTo(-10, -12); ctx.stroke();
  } else {
    shape(ctx, [[-36, -90], [36, -90], [0, -50]], 'rgba(220,240,255,0.35)', { w: 2.5 });
    shape(ctx, [[-28, -84], [28, -84], [0, -56]], fill, { line: false });
    shape(ctx, [[-2, -50], [2, -50], [2, -6], [-2, -6]], '#dfefff', { w: 2 });
    shape(ctx, [[-20, 0], [20, 0], [12, -6], [-12, -6]], '#dfefff', { w: 2 });
    ctx.fillStyle = '#d33'; ctx.beginPath(); ctx.arc(20, -88, 6, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// standing silhouette (patrons, crowds, theatre)
function figure(ctx, x, y, h, col, o = {}) {
  const s = h / 300;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.face ?? 1), s); ctx.globalAlpha *= o.alpha ?? 1;
  const lw = (o.lw ?? 2.5) / s;
  const line = o.line === false ? { line: false } : { w: lw, stroke: o.stroke ?? P.ink };
  const sw = o.walk != null ? Math.sin(o.walk) * 18 : 0;
  shape(ctx, [[-14, -130], [-8 - sw, 0], [6 - sw, 0], [4, -120]], col, line);
  shape(ctx, [[-4, -130], [4 + sw, 0], [18 + sw, 0], [14, -125]], col, line);
  blob(ctx, o.cloak ? [[-30, -230], [30, -230], [52, -60], [-50, -60]] : [[-30, -232], [26, -232], [34, -120], [-34, -120]], col, { ...line, n: 4 });
  ctx.beginPath(); ctx.ellipse(0, -262, 26, 30, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); if (o.line !== false) { ctx.strokeStyle = o.stroke ?? P.ink; ctx.lineWidth = lw; ctx.stroke(); }
  if (o.hat) shape(ctx, [[-30, -282], [32, -282], [8, -330]], col, line);
  if ((o.eye ?? 0) > 0) { glow(ctx, 12, -266, 50 * o.eye, P.greenGlow, o.eye); ctx.fillStyle = '#5dffb0'; ctx.beginPath(); ctx.arc(12, -266, 5, 0, TAU); ctx.fill(); }
  ctx.restore();
}
