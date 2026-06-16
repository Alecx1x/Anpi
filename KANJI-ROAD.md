# 漢字ロード / Kanji Road — design spec

A second guided path, separate from the main grammar "Learn" journey. The learner
reads short graded-Japanese passages about real Japanese towns / historic sites.
Kanji and vocabulary **accumulate** lesson-over-lesson, so the text starts almost
fully furigana'd and gradually becomes near-bare kanji.

## Locked decisions
- **Model: self-contained reading track.** Kanji Road never uses a kanji/word it
  hasn't already taught, *except* the few it introduces in the current lesson
  (which get furigana + tap-gloss). So a near-beginner can start at lesson 1.
- **Kanji set/order: 教育漢字 (kyōiku), Grade 1 → 6, 1,026 kanji.** Each lesson
  formally teaches ~3–6 new kanji (its "collectibles"). 1,026 ÷ ~5 ≈ ~200 lessons.
- **Grammar is borrowed, not taught here.** Sentences use only N5/N4 patterns;
  anything trickier is glossed. Reading practice targets kanji + vocab, not grammar.
- **Name:** 漢字ロード / Kanji Road.

## The engine (the hard part — build + prove first)
1. **Known-kanji model** — localStorage `kanjiRoadKnown` = set of kanji the reader
   has been taught (a lesson's `newKanji` are added on completion).
2. **Furigana auto-thinning** — a word renders **bare** if every kanji in it is in
   `kanjiRoadKnown`; otherwise it shows furigana. So furigana naturally disappears
   as the reader progresses. Proper nouns (place names) always keep furigana.
3. **Tap-to-gloss** — tap any word → reading + meaning popup.
4. **Toggles** — furigana mode (new-only / all / off) and a collapsed English
   translation for self-checking.

## Lesson data schema (one town/site = one lesson)
```
{
  id, place, placeReading, region, xy:[lng,lat],   // reuse the journey map
  newKanji: [ { k, on, kun, meaning, example } ],  // taught this lesson → badges
  vocab:    [ { w, reading, meaning } ],
  passage:  [ token, ... ],                         // token = {jp, reading, en, kanji:[...]} or {text:"。"}
  translation: "full English",
  check: [ { q, choices:[...], answer } ]           // 1–2 comprehension Qs to complete
}
```

## Content sourcing rule (accuracy)
Write graded Japanese only about **well-documented, famous places** first
(Kyoto, Nara, Mt Fuji, Hiroshima, Nikkō, Kamakura, Kanazawa, …). Do NOT auto-
generate histories for obscure municipalities — wrong facts are worse than none.
Expand the place list deliberately over time.

## Unlock gate (design later, after the engine is proven)
Two "keys": (1) **kana proficiency** via the game's full no-repeat first cycle,
(2) **a basic-grammar foundation** on the main Learn path (e.g. finished N5
foundations). Completing the 2nd key plays the key-turning animation → reveals
Kanji Road. (The no-repeat-first-cycle game change becomes default regardless.)

## Build phases
0. **POC (done):** `kanji-road-demo.html` — standalone page proving the engine on
   one real lesson (auto-thinning + tap-gloss + toggles + "learn the kanji" payoff).
1. Integrate the engine into the app as a new view; reuse the journey map for the
   Kanji Road pins (its own track/colour).
2. Build the kyōiku kanji dataset (Grade 1→6 order, readings/meanings) once.
3. Author lessons for famous places, simplest-grammar first; furigana-thinning
   keyed to the kyōiku order so coverage compounds.
4. Wire the unlock keys + animation; add the kanji-badge collection to the profile.
