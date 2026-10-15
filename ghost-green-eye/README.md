# Ghost Green-Eye

A ~3½-minute hybrid explainer film on jealousy as a recurring pattern across animals, people, stories and machines.
It moves back and forth between Moebius/cel-style illustration and 3Blue1Brown-style ink diagrams, keyed word by word to the narration.

Everything is drawn procedurally on an HTML canvas: no generative imagery and no stock assets. The film is deterministic, so any frame can be re-rendered exactly.

- **Watch:** `out/ghost_green_eye.mp4` (1920×1080, 30 fps, narration muxed in)
- **Interactive preview:** serve this folder (`npx serve .`) and open `index.html`. It plays the narration and renders live; add `?t=95` to start at 1:35.
- **Shot-by-shot plan:** [`BEATMAP.md`](BEATMAP.md)

## Layout
| Path | What |
|---|---|
| `src/core.js` | timing/easing, hand-drawn ink primitives, paper + grain textures, scene compositor and transitions (cut, fade, iris, ink-wipe) |
| `src/art.js` | the illustrated world: night plateau, crystal massif, mesas, ridge, animated stags and hinds |
| `src/people.js` | cel-style profile figures (you / her / rival), glasses, silhouettes |
| `src/diagrams.js` | the triad motif, note boxes, the green eye glyph, masks, soft focus |
| `src/act1.js` … `src/act5.js` | the five acts, timed to the narration |
| `transcript/words.json` | word-level timings (Parakeet TDT 0.6B via sherpa-onnx) |
| `tools/render.mjs` | parallel headless-Chromium → ffmpeg renderer |
| `tools/still.mjs`, `tools/sheet.sh`, `tools/bench.mjs` | review stills, contact sheets, per-frame timing |

## Rebuild
```bash
npm install                      # playwright + fonts (set PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 if Chromium is preinstalled)
node tools/render.mjs out/ghost_green_eye.mp4 4 30          # whole film, 4 workers
node tools/render.mjs out/clip.mp4 4 30 56 64               # just 0:56–1:04
node tools/still.mjs out/stills 12.5 77 203                 # PNG stills at given seconds
```
To change a beat, edit the act file. Times are in seconds of narration and come from `transcript/words.json`.
