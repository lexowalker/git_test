// ACT 1 — Before Words (0:00–0:22). Two stags; the evolutionary account as ink annotation; then inside the animal.
'use strict';

// world position of a stag-local point, honouring flip, scale and head rotation
function stagPoint(x, y, pose, lx, ly, onHead = true) {
  const s = pose.scale ?? 1, f = pose.flip ? -1 : 1;
  if (onHead) { const a = (pose.head ?? 0) * 0.9, dx = lx - 96, dy = ly + 186; lx = 96 + dx * Math.cos(a) - dy * Math.sin(a); ly = -186 + dx * Math.sin(a) + dy * Math.cos(a); }
  return [x + lx * s * f, y + ly * s];
}

const A1 = {
  ax: t => lerp(160, 640, ss(t, 0.2, 4.6, E.out)),
  bx: t => lerp(1290, 1250, ss(t, 3.5, 4.6)),
  hinds: [[1555, 0.42, true], [1680, 0.39, false], [1760, 0.36, true]],
};
function a1World(ctx, t, o = {}) {
  const sil = o.sil ?? 0;
  drawSky(ctx, t); drawMoon(ctx, 380, 170, 46); drawLand(ctx, t); drawRidge(ctx, t);
  A1.hinds.forEach(([hx, sc, fl], i) => drawStag(ctx, hx, ridgeY(hx) + 52 - i * 4, { scale: sc, hind: true, t: t + i, flip: fl, nod: Math.sin(t * 0.7 + i) * 0.05 + (i === 1 ? 0.35 : 0) }));
  const ax = A1.ax(t), bx = A1.bx(t);
  const walkA = t < 4.7 ? t * 5.2 : null;
  const poseA = { scale: 1, walk: walkA, t, head: ss(t, 4.4, 6.0) * 0.25 };
  const poseB = { scale: 1, flip: true, t, walk: t > 3.5 && t < 4.6 ? (t - 3.5) * 5.5 : null, head: ss(t, 4.5, 5.8, E.outBack) * 0.55, eyeGlow: o.eyeGlow ?? 0 };
  shadow(ctx, ax, ridgeY(ax) + 24, 150); drawStag(ctx, ax, ridgeY(ax) + 24, poseA);
  shadow(ctx, bx, ridgeY(bx) + 24, 150);
  if (sil < 1) drawStag(ctx, bx, ridgeY(bx) + 24, poseB);
  return { ax, bx, poseA, poseB, ay: ridgeY(ax) + 24, by: ridgeY(bx) + 24 };
}

G.scene(0, 22.9, (ctx, t) => {
  // camera: gentle drift, then push toward the defender's head and into its eye
  const push = ss(t, 14.9, 18.2), eyeIn = ss(t, 19.3, 22.6, E.in);
  const ref = { ax: A1.ax(t), bx: A1.bx(t) };
  const poseB = { scale: 1, flip: true, head: ss(t, 4.5, 5.8, E.outBack) * 0.55 };
  const by = ridgeY(ref.bx) + 24;
  const chest = stagPoint(ref.bx, by, poseB, 70, -170, false);
  const eye = stagPoint(ref.bx, by, poseB, 186, -299);
  let cx = lerp(960, 975, seg(t, 0, 14)), cy = 540, z = lerp(1.0, 1.05, seg(t, 0, 14));
  cx = lerp(cx, chest[0] + 40, push); cy = lerp(cy, chest[1] - 40, push); z = lerp(z, 2.3, push);
  cx = lerp(cx, eye[0], eyeIn); cy = lerp(cy, eye[1], eyeIn); z = z * Math.pow(22, eyeIn);
  ctx.save(); cam(ctx, cx, cy, z);
  const silK = ss(t, 16.0, 17.4);
  const st = a1World(ctx, t, {});
  // dusk falls over the world as we go inside
  if (silK > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(6,10,40,${0.62 * silK})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  // the defender becomes a window onto an inner space
  if (silK > 0) {
    const tr = ctx.getTransform();
    masked(ctx, x => { x.setTransform(tr); x.globalAlpha = silK; drawStag(x, st.bx, st.by, { ...st.poseB, sil: '#0a0f2e', eyeGlow: 0 }); }, x => {
      x.setTransform(tr);
      x.fillStyle = '#0a0f2e'; x.fillRect(st.bx - 400, st.by - 700, 800, 800);
      stars(x, t, { seed: 77, n: 220, x: st.bx - 300, y: st.by - 520, w: 600, h: 560, alpha: 0.9 });
      const g = ss(t, 16.8, 18.4) * (1 + 0.25 * Math.sin(t * 5));
      const hx = lerp(chest[0], eye[0], ss(t, 19.4, 20.8)), hy = lerp(chest[1], eye[1], ss(t, 19.4, 20.8));
      glow(x, hx, hy, 150 * g, P.greenGlow, Math.min(1, g));
      // rings of feeling radiating
      for (let k = 0; k < 3; k++) { const ph = ((t - 17.7) * 0.7 + k / 3) % 1; if (t > 17.7) inkCircle(x, hx, hy, 20 + ph * 140, { w: 2, color: '#5dffb0', alpha: (1 - ph) * 0.8 * ss(t, 17.7, 18.3), seed: k }); }
    });
    // outline of the silhouette so it keeps its shape
    ctx.save(); ctx.globalAlpha = silK * 0.9; ctx.globalCompositeOperation = 'source-over'; ctx.restore();
    const eg = ss(t, 19.6, 20.6);
    if (eg > 0) { glow(ctx, eye[0], eye[1], 60 + 80 * eg, P.greenGlow, eg); ctx.fillStyle = '#3dffa0'; ctx.beginPath(); ctx.ellipse(eye[0], eye[1], 6 * eg + 1, 4.5 * eg + 1, 0.2, 0, TAU); ctx.fill(); }
  }
  ctx.restore();

  // ---- ink annotations over a paper wash (the evolutionary account) ----
  const ann = env(t, 6.2, 15.4, 0.6, 0.7);
  if (ann > 0) {
    paperWash(ctx, ann * 0.5);
    ctx.save(); ctx.globalAlpha = ann;
    noteBox(ctx, 60, 60, 520, 120, ['In evolutionary terms…'], { p: ss(t, 6.4, 8.2), size: 40 });
    const hA = stagPoint(st.ax, st.ay, st.poseA, 200, -300), hB = stagPoint(st.bx, st.by, st.poseB, 200, -300);
    // competition for mates — double arrow between the stags
    const cp = ss(t, 9.4, 10.6);
    const arc = bez2([hA[0] - 30, hA[1] - 170], [(hA[0] + hB[0]) / 2, hA[1] - 330], [hB[0] + 30, hB[1] - 170]);
    inkArrow(ctx, arc, { p: cp, w: 3.5, seed: 4, color: P.navy });
    arrowHead(ctx, arc[0][0], arc[0][1], Math.atan2(arc[0][1] - arc[3][1], arc[0][0] - arc[3][0]), 16, P.navy, 3.5, clamp(cp * 3 - 1));
    handText(ctx, 'competition for mates', (hA[0] + hB[0]) / 2, hA[1] - 300, { size: 44, align: 'center', color: P.navy, p: ss(t, 9.6, 11.0) });
    // reproductive advantage — a lineage that branches
    const rp = ss(t, 11.0, 12.6);
    const lx = 1480, ly = 270;
    inkCircle(ctx, lx, ly, 9, { p: rp, w: 3, color: P.navy, fill: P.peach });
    [[-90, 70], [0, 80], [90, 70]].forEach(([dx, dy], i) => {
      inkLine(ctx, lx, ly + 10, lx + dx, ly + dy - 9, { p: ss(t, 11.2 + i * 0.12, 11.8 + i * 0.12), w: 2.5, color: P.navy, seed: 40 + i });
      inkCircle(ctx, lx + dx, ly + dy, 8, { p: ss(t, 11.6 + i * 0.12, 12.0 + i * 0.12), w: 2.5, color: P.navy, fill: P.peach });
      [[-24, 50], [24, 50]].forEach(([ex, ey], j) => {
        inkLine(ctx, lx + dx, ly + dy + 8, lx + dx + ex, ly + dy + ey - 6, { p: ss(t, 11.9 + i * 0.1, 12.3 + i * 0.1), w: 2, color: P.navy, seed: 50 + i * 2 + j });
        inkCircle(ctx, lx + dx + ex, ly + dy + ey, 5, { p: ss(t, 12.1 + i * 0.1, 12.4 + i * 0.1), w: 2, color: P.navy, fill: P.peach });
      });
    });
    handText(ctx, 'reproductive advantage', lx, ly - 34, { size: 38, align: 'center', color: P.navy, p: ss(t, 11.1, 12.3) });
    // the protection of something valuable — loop around the hinds
    const vp = ss(t, 12.7, 13.7);
    const hx = 1660, hy = ridgeY(1660) - 40;
    const loop = []; for (let i = 0; i <= 80; i++) { const a = -2.4 + i / 80 * (TAU + 0.4); loop.push([hx + Math.cos(a) * 190, hy + Math.sin(a) * 92]); }
    stroke(ctx, wobble(loop, 3, 6), { p: vp, w: 3.5, color: P.navy });
    handText(ctx, 'something valuable', hx, hy + 150, { size: 40, align: 'center', color: P.navy, p: ss(t, 13.0, 14.2) });
    // the triad crystallises out of the scene: self / valued / rival
    const tp = ss(t, 13.5, 14.9);
    const S = stagPoint(st.bx, st.by, st.poseB, 40, -175, false), R = stagPoint(st.ax, st.ay, st.poseA, 0, -175, false), V = [hx, hy];
    triad(ctx, S, V, R, { p: tp, r: 26, color: P.ink, labels: ss(t, 14.0, 14.8), labelSize: 40, lvy: -1.6, lsy: 1.2, lry: 1.2 });
    ctx.restore();
  }
  // a question, set in the dark
  const q = env(t, 15.2, 21.8, 0.6, 0.8);
  if (q > 0) {
    handText(ctx, 'what is happening inside?', W / 2, 980, { size: 52, align: 'center', color: '#dff', alpha: q * (1 - ss(t, 17.6, 18.2)) , p: ss(t, 15.3, 16.9) });
    handText(ctx, 'what does it feel?', W / 2, 980, { size: 52, align: 'center', color: '#dff', alpha: q * env(t, 17.8, 19.5, 0.3, 0.3), p: ss(t, 17.9, 18.9) });
    handText(ctx, 'something we might recognize?', W / 2, 980, { size: 52, align: 'center', color: '#bfffe0', alpha: q * ss(t, 19.6, 20.0), p: ss(t, 19.6, 20.9) });
  }
  // flood into green as we pass through the eye
  const fl = ss(t, 20.9, 22.3);
  if (fl > 0) { glow(ctx, W / 2, H / 2, 1400 * fl, 'rgba(120,255,190,', fl); ctx.fillStyle = `rgba(150,255,200,${ss(t, 21.6, 22.5)})`; ctx.fillRect(0, 0, W, H); }
});
