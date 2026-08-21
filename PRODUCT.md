# Chordia — Product truth

## What it is

A place to write chord progressions and then play them.

You build a progression by picking chords off a circle of fifths, Chordia draws
each one on a keyboard as you go, and you save it as a song of your own — with
its key, its tempo and its time signature. Your songs live in your library;
everybody else's are in Discover, credited to the person who wrote them, with
real profiles behind them.

The second half is the play-along: a bundled catalogue of 759 public-domain and
Creative Commons pieces whose notes fall toward an on-screen keyboard, played
on a real MIDI keyboard, the computer's letter rows, or the mouse.

**Both halves matter, and the composing half is the origin.** A surface that
presents Chordia as a MIDI play-along with a login screen has mis-described the
product.

## The unique mechanisms

**The progression is the artefact.** Chords come first and theory second: you
point at a circle of fifths, see the shape on the keys, and the thing you save
carries the musical context (key, tempo, time signature), not just a list of
chord names. There is an AI generator for when you do not know where to go
next.

**Chordia knows *your* piano.** You tell it how many keys your instrument has
(88, 76, 73, 61, 49, 37, 25 or a custom range) and it draws exactly that
keyboard, marks the pieces that do not fit, and transposes by octaves the ones
that nearly do. Every other play-along teaches you on a keyboard you do not own.

Underneath it is a real instrument, not a toy: 31 multi-sampled Salamander
Grand notes (one every minor third, so pitch-shifting never exceeds a
semitone), velocity driving loudness *and* brightness like a hammer action,
sustain pedal via CC64, 48-voice polyphony with voice stealing, pitch-based
stereo spread, convolution reverb, compressor and limiter — over raw Web Audio.

## The audience and the scene

A person at a desk at night with a MIDI keyboard in front of them and
headphones on, or a learner with no keyboard at all trying the letter rows
first. Lights low, screen bright, one piece on repeat. This is why the surface
is dark: it sits behind a lit instrument in a dim room, not on a desk at noon.

## What the product actually does

- **Catalogue** — 759 pieces, 105 composers (Bach 124, Schubert 49, Chopin 47,
  Beethoven 43, Mozart 33, Satie, Debussy, Handel, Schumann, Czerny…), bundled
  in `public/songs/` with per-song attribution, source link and licence.
  Search by title or composer; filter by composer, style, difficulty (1–5,
  relative to the rest of the catalogue) or "only what fits my piano".
- **Import** — drag any `.mid` / `.midi` file. Stored in the browser
  (IndexedDB). Never uploaded.
- **Listen mode** — the piece plays through; you accompany or just listen.
- **Practice mode** — the clock freezes on every note of your hand until you
  play it right.
- **Per-hand routing** — choose independently which hands you play and which
  hands the app plays.
- **Play controls** — 25 %–150 % speed, zoom (seconds visible), metronome,
  note names, click-to-seek scrub bar, full screen.
- **Scoring** — hits, streak, accuracy.
- **Hardware** — any MIDI keyboard is auto-detected, with velocity and sustain
  pedal. Without one, `q w e r …` and `z x c v …` are the piano and `Shift`
  is the pedal.
- **Bridge to songs** — "save as a song" extracts the chord progression from a
  MIDI file and stores it as a Chordia song with key, tempo and time signature.
## The account is not optional decoration

Composing, saving, the library, Discover and profiles all require an account —
they are the product, not an upsell. The catalogue, the importer and the player
work without one, which is a good way to try Chordia before signing up, but it
is not the headline.

- **Compose** — chord progressions built on a circle of fifths, each chord drawn
  on a keyboard, saved with key, tempo and time signature. AI chord suggestions.
- **Library** — your own saved progressions, editable and deletable.
- **Discover** — every user's songs, with the author's display name.
- **Profiles** — display name, photo, bio, location, website, and links to
  Instagram, Twitter, SoundCloud and Spotify. Admins can manage songs.

## Constraints and commitments

- **Palette is pinned by the user**: dark navy ground plus the green accent
  (`#00E676`). Kept, re-grounded on real material rather than neon-on-black.
- **Bilingual, Spanish and English, user-switchable.** Confirmed this session.
  Previously the landing was English and the app Spanish; that split is a bug.
- Stack is fixed: React 19 + TypeScript, Vite, Tailwind v4, Firebase
  (auth / Firestore / Storage), `@tonejs/midi`, Web Audio.
- No copyrighted material is ever redistributed. Sources are the Mutopia
  Project and the CC-licensed songs shipped with sightread.
- `features/` (audio, midi, piano, player, renderer) is the good, tested core:
  65 passing tests. Its behaviour and public API are preserved.
- Playing the catalogue must work with no account and no Firebase credentials
  configured. Everything social requires an account, by design.
- **The landing page is a page, not an instrument.** It may animate and it may
  show the product working, but it must not be a piano the visitor plays:
  clicking the artwork should never produce a note. Confirmed 2026-08-21.

## What must not be touched

Audio timing and the player clock, the MIDI parsing contract, the catalogue
files and their attribution, difficulty scoring, and the keyboard-range
transposition rules.
