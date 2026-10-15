# The Observing Center — two vertical shorts

Two 1080×1920 shorts cut from a 3:24 talk on the "observing center". They use the speaker's own audio, word-by-word subtitles, and hand-drawn animation in the Ghost Green-Eye style: flat Moebius colour with ink outlines, plus paper diagrams. Gold is the accent colour, for the observing center.

| | Short | Length | Idea |
|---|---|---|---|
| 1 | `out/short1_observing_center.mp4` | 1:15 | **The method.** Hold to the observing center while negativity plays out; hard moments give the most practice "mileage"; do the preliminary work so you can watch thoughts and feelings go by. |
| 2 | `out/short2_who_is_watching.mp4` | 1:24 | **The experience and the insight.** The felt weight of despair (body, heart sinking, the dark cloud); the question "who is watching?"; the space between your thoughts and you. |

## The edits (source seconds → order used)
**Short 1:** 0.00–18.40 (the aphorism) · 25.84–36.08 (life is always teaching) · 36.32–48.78 (the message isn't what we want to hear) · 49.74–62.88 (the most mileage; watch it play out) · 98.42–114.94 (preliminary work; thoughts and feelings go by).

**Short 2:** 173.30–178.98 (cold open: "who is it that's observing? Who's watching this?") · 63.12–71.04 · 72.08–97.62 (despair in the body and its story) · 121.54–128.50 (heart sinking) · 138.46–143.00 (just feel it) · 147.08–157.56 (dark cloud, heavier) · 173.30–178.98 (the question returns) · 190.48–191.24 ("and then boom,") · 193.60–203.44 (the space).
No named references: the passage naming Eckhart Tolle and the story built around him are left out by request.

The cuts are snapped to real silences and joined with 0.32 s gaps and micro-fades. Loudness is normalised for YouTube. All cut points are listed in `tools/build_edit.py`.

## Visual beats
**Short 1:** a storm rolls over a seated figure on the night plateau. "Hold to the observing center" lights a gold point with rippling rings. The storm splits open and a scroll unrolls with a seed sprouting ("a lesson"). Rain of misfortune bounces off a gold dome ("immune"). Then a spiral path of lessons with three pulses on "learning, learning, learning"; an envelope with an unwelcome message; three cards (negative / BAD NEWS / misfortune); a chart of *how bad it feels* against *practice mileage*, with a spinning odometer. The storm plays out on time-lapse while the center holds. A column of practice stones shows the preliminary work. Thought-clouds and coloured feelings drift by while the observer watches. End card: *Hold to the observing center.*

**Short 2:** a gold eye opens ("who is watching?"). A chalk body map fills with ink: hopeless, helpless, giving up. A figure on a darkening road under piling thought-clouds, with FAILURE written on the road ahead. The heart sinks from chest to gut; "just feel it" wraps the body in gold, holding rather than fighting. The dark cloud condenses into stone. Then the question returns, and a larger gold watcher appears around the small figure and the stone: awareness looking at the cloud from outside it. Boom: a flash, a pull-back, and the thoughts float up and away while a measuring arrow labelled *space* keeps growing. End card: *There's a space between your thoughts and you.*

## Rebuild
```bash
npm install
python3 tools/build_edit.py <source.mp4> short1      # cut audio + word timings → out/, data/
node tools/render.mjs short1 out/short1_observing_center.mp4 4 30
node tools/still.mjs short1 out/stills 9.8 47.6 70  # review frames + sheet.png
```
Preview live in a browser: serve the repo root and open `shorts/index.html?s=short2` (add `&t=95` to jump).
The shorts reuse the engine and art from `../ghost-green-eye/src` (canvas size set via `window.VW/VH`).
