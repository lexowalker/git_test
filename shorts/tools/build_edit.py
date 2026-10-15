"""Cut a short's narration from the source video and remap word timings.

usage: python3 tools/build_edit.py <source.mp4> <short_id>

Reads EDITS[short_id] (source time ranges), snaps each cut to real silence, joins the
pieces with short gaps and micro-fades, loudness-normalises to -14 LUFS (YouTube), and
writes out/<id>_narration.m4a plus data/<id>.js (window.WORDS / window.AUDIO_DUR).
"""
import json, subprocess, sys, wave, os
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAP = 0.32  # silence inserted between joined segments

# (start, end) in source seconds — each range begins/ends on a word boundary
EDITS = {
    'short1': [  # The Observing Center — the method
        (0.00, 18.40),    # When something that seems negative… immune to misfortune.
        (25.84, 36.08),   # So this life is just a series of learning… learning, learning.
        (36.32, 48.78),   # Now, the message is not always what we want to hear… misfortune, right?
        (49.74, 62.88),   # And those are very useful… watching this negativity just play out,
        (98.42, 114.94),  # And so that's when… observe the thoughts go by and the feelings go by
    ],
    'short2': [  # Who Is Watching? — the experience and the insight
        (173.30, 178.98),  # who is it that's observing? Who's watching this?
        (63.12, 71.04),    # And then you can also feel it in your body… giving up,
        (72.08, 97.62),    # And you just feel like no matter what you do… despair and just bad news.
        (121.54, 128.50),  # you can focus on the body… You can feel your heart sink.
        (138.46, 143.00),  # But just feel the despair. Just feel it. It's just like, oh, God.
        (147.08, 157.56),  # And you can feel that… a dark cloud… heavier than that.
        (158.18, 203.44),  # someone who talked about this really well was Eckhart Tolle… bodily sensations and you.
    ],
}
FIXES = {'Eckert': 'Eckhart', 'Tolly,': 'Tolle,', 'Out': 'out', 'their': "they're", 'Who\'s': "Who's"}


def load_wav(path):
    w = wave.open(path)
    return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768, w.getframerate()


def snap(x, sr, t, direction, words):
    """Move a cut point into the nearest quiet 20 ms window, without crossing a word."""
    hop = int(sr * 0.02)
    rms = lambda i: float(np.sqrt(np.mean(x[i:i + hop] ** 2))) if i + hop <= len(x) else 0.0
    i = int(t * sr)
    thr = 0.012
    limit = int(0.45 * sr)
    if direction > 0:  # extend end forward until quiet, but never into the next word
        nxt = min([w['s'] for w in words if w['s'] > t + 0.05] or [t + 1])
        stop = min(int((nxt - 0.04) * sr), i + limit)
        while i < stop and rms(i) > thr:
            i += hop
        return min(i, stop) / sr
    prv = max([w['s'] for w in words if w['s'] < t - 0.05] or [0])
    stop = max(int(prv * sr), i - limit, 0)
    while i > stop and rms(i - hop) > thr:
        i -= hop
    return max(i, stop) / sr


def main(src, sid):
    words = json.load(open(os.path.join(ROOT, 'data', 'source_words.json')))
    tmp = os.path.join(ROOT, 'out', f'{sid}_src.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '48000', tmp], check=True)
    x, sr = load_wav(tmp)
    pieces, out_words, t_out = [], [], 0.0
    for k, (a, b) in enumerate(EDITS[sid]):
        a2 = snap(x, sr, a, -1, words) if a > 0 else 0.0
        b2 = snap(x, sr, b, +1, words)
        seg = x[int(a2 * sr):int(b2 * sr)].copy()
        f = int(0.012 * sr)
        seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
        for w in words:
            if a - 0.02 <= w['s'] < b - 0.01:
                txt = FIXES.get(w['w'], w['w'])
                out_words.append({'w': txt, 's': round(t_out + (w['s'] - a2), 3), 'e': round(t_out + (min(w['e'], b2) - a2), 3), 'seg': k})
        pieces.append(seg)
        t_out += len(seg) / sr
        if k < len(EDITS[sid]) - 1:
            pieces.append(np.zeros(int(GAP * sr), dtype=np.float32)); t_out += GAP
    y = np.concatenate(pieces)
    raw = os.path.join(ROOT, 'out', f'{sid}_raw.wav')
    wv = wave.open(raw, 'w'); wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(sr)
    wv.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()); wv.close()
    out = os.path.join(ROOT, 'out', f'{sid}_narration.m4a')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'highpass=f=70,loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', out], check=True)
    os.remove(tmp); os.remove(raw)
    # caption tidy-up at the seams: capitalise segment openers, close segment endings,
    # and restore the question mark Parakeet drops before "Who's"
    for i, w in enumerate(out_words):
        if i == 0 or out_words[i - 1]['seg'] != w['seg']:
            w['w'] = w['w'][:1].upper() + w['w'][1:]
        last = i == len(out_words) - 1 or out_words[i + 1]['seg'] != w['seg']
        if last and w['w'].endswith(','):
            w['w'] = w['w'][:-1] + '.'
        if w['w'] == 'observing' and i + 1 < len(out_words) and out_words[i + 1]['w'] == "Who's":
            w['w'] = 'observing?'
    dur = round(t_out, 3)
    with open(os.path.join(ROOT, 'data', f'{sid}.js'), 'w') as fh:
        fh.write(f'window.AUDIO_DUR = {dur};\nwindow.WORDS = {json.dumps(out_words)};\n')
    print(f'{sid}: {len(out_words)} words, {dur:.2f}s audio -> {out}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
