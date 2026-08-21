# Chordia — design system

Recorded from the shipped build, not from intentions. Direction contract:
[`.impeccable/direction.md`](.impeccable/direction.md). Product truth:
[`PRODUCT.md`](PRODUCT.md).

**World: "Señal viva".** A lit instrument in a dark room. Every colour comes
from one of two places — the signal palette the falling-notes renderer already
used, or the physical materials a piano is made of. Nothing is invented, so the
canvas and the DOM can never disagree about what green means.

---

## Colour

Tokens live in `src/styles/tokens.css` under Tailwind v4 `@theme`, so each one
generates real utilities (`bg-ground-2`, `text-ink-mid`, …).

### Signal — semantic, never decorative

| Token | Value | What it means |
|---|---|---|
| `hand-right` | `#00e676` | notes for the right hand |
| `hand-left` | `#38bdf8` | notes for the left hand |
| `wait` | `#ffd166` | practice mode is frozen; play this note |
| `struck` | `#ffffff` | the note landed |
| `felt` / `felt-ink` | `#7f1d2e` / `#ff8a9b` | damper felt: destructive, out of range |

These four match `COLORS` in `src/features/renderer/FallingNotes.ts` exactly.
If you change one, change both.

> **Naming:** they are `hand-right` / `hand-left`, not `right` / `left`,
> because `text-right`, `bg-right` and `border-left` are already Tailwind
> alignment and position utilities. The first cut of this system used the short
> names and produced elements that were simultaneously green *and*
> right-aligned.

### Materials — the keys themselves

`ivory #f4f7fb`, `ivory-shade #c9d2de`, `ebony #151b26`.

### Ground — the room behind the instrument

`ground-0 #070c14` · `ground-1 #0a101b` (page) · `ground-2 #0f1624` (panel) ·
`ground-3 #151d2c` · `ground-4 #1c2536`.

`ground-1` is the renderer's own background, so the canvas sits on the page
with no visible seam.

### Ink — tinted from the ground's hue, never neutral grey

`ink #f4f7fb` (the same white as the keys) · `ink-mid #9fb0c4` (8.6:1) ·
`ink-low #7488a0` (5.2:1). All body text clears 4.5:1 on every surface it is
used on; verified across every text node on the home page.

Dark is chosen from the use scene recorded in PRODUCT.md — a desk at night,
headphones on, behind a lit keyboard — not from category habit.

---

## Type

- **Display:** `Bricolage Grotesque Variable` (`--font-display`), self-hosted
  via `@fontsource-variable`. Its optical-size axis lets one face carry a
  5rem headline and a 13px label. Applied to `h1`–`h3` and `.font-display`.
- **Text / UI:** `Inter Variable` (`--font-sans`). Body and controls only —
  never the display voice.
- **Measurement:** `.numeric` sets `tabular-nums slashed-zero`. Used for
  tempo, time, key counts, piece counts, accuracy. No monospace face is
  loaded: mono as a costume for "technical" is not the same as figures that
  need to line up in a column.
- Headings carry `letter-spacing: -0.03em` and `text-wrap: balance`.
- Body copy uses `.prose-measure` (`--measure: 68ch`, `text-wrap: pretty`).
- Section heading → body gap is 24px (`SectionHeading`). Space above a heading
  always exceeds the space below it.

---

## Motion

**One authored moment: the strike.** A note reaches the hit line, the key
depresses, light blooms from the contact point and decays. Every control in the
product borrows that one gesture rather than inventing its own hover effect.

- Easing: `--ease-strike: cubic-bezier(.16,1,.3,1)` (exponential out) for
  arrivals, `--ease-depress` for presses.
- Durations: `--t-tap 120ms`, `--t-quick 180ms`, `--t-move 240ms`,
  `--t-settle 320ms`.
- Classes in `src/styles/instrument.css`: `.press` (depress), `.bloom-*`
  (note light on hover/focus), `.strike`, `.keydown`, `.sustain` (the one
  continuous loop, for a live MIDI indicator), `.rise`.
- **Content is visible by default.** Nothing is hidden waiting for a scroll
  listener. The previous landing faded up every section on an
  `IntersectionObserver`; that is not the grammar and it is not coming back.
- `prefers-reduced-motion` collapses all durations to 1ms, disables the
  keyframe classes, and turns the hero canvas into a single still frame parked
  2.4s into the piece — a frame that actually shows notes in flight.

---

## Materials and components

- **`.chassis`** — a machined plate: a 1px gradient of caught light along the
  top edge (`::before`), a soft border, `--lift-1`. This is the panel; it is
  not a rounded rectangle with a shadow. `.chassis-flush` drops the side
  borders for full-width use.
- **Depth** — `--lift-1/2/3`, each with a real offset *and* blur. A
  zero-offset coloured halo is decoration, not depth, and is not used.
- **`--bloom-right/left/wait`** — note light with a two-stop falloff, because
  a struck string does not glow in a flat ring.
- **`.keycap-white` / `.keycap-black`** — a lit instrument.
  **`.keycap-white-shadow` / `.keycap-black-shadow`** — the same instrument in
  a dark room, for structural uses. Dimming a lit keyboard with `opacity`
  instead turns the ivory into flat grey and the whole thing reads as a bar
  chart; that is why the shadow variants exist.
- **`.rule-keys`** — a hairline shaped like a keyboard.
- **`.shell`** (84rem) / **`.shell-narrow`** (52rem), gutter
  `clamp(1.25rem, 4vw, 3.5rem)`. One rhythm for the whole product.

### UI primitives — `src/ui/`

| Component | Notes |
|---|---|
| `Button` / `ButtonLink` / `ButtonAnchor` | tones `right`, `left`, `quiet`, `ghost`, `felt`; sizes `sm/md/lg`. A button is a key: it depresses and blooms. |
| `Keyboard` | the recurring structural device. One component at every size — the hero instrument, the size picker, the footer edge, empty states. `tone="lit" \| "shadow"`. |
| `Panel`, `Stat`, `SectionHeading` | `SectionHeading` takes no eyebrow and no section number, by design. |
| `Field`, `Segmented`, `Toggle` | real `<label>`, `aria-invalid`, `aria-describedby`, `aria-pressed`. |
| `LanguageSwitcher` | both languages always visible; a dropdown for two options hides the escape hatch. |

`src/ui/dialog.ts` is the **only** module that opens a dialog:
`confirmAction`, `confirmNext`, `notifyOk`, `notifyError`, `notifyInfo`, and
`openDialog` for the rare one-off. Appearance lives in
`src/styles/dialog.css`, which themes SweetAlert's own classes.

> Never call `Swal.fire` directly. SweetAlert styles its buttons with *inline*
> background colours unless `buttonsStyling: false` is passed, and an inline
> style beats the stylesheet — so one forgotten flag puts a stock blue button in
> the middle of this palette. The wrappers pass it; eight call sites used to
> each carry their own hand-copied theme, with different values in every file.

### Shared surface components

| Component | Notes |
|---|---|
| `components/songs/SongCard` | a saved progression. Its face is the **chord symbols**, named from the stored notes by `features/midi/chordName`. It used to be a circle with a music note in it, which made every song look identical. |
| `components/songs/EmptyState` | nothing-here-yet, grounded by an unlit keyboard instead of a big grey icon. |
| `components/auth/AuthLayout` | the two-column auth frame: the form, and beside it the reason to bother. |
| `components/auth/authErrors` | maps Firebase error codes onto our own messages, so nobody ever reads `auth/invalid-credential`. |

`src/components/layout/` holds `Header` (with a real mobile sheet), `Footer`
(`showKeys` off when the page already closes on a keyboard), `Shell` and
`BrandMark` (five keys, one lit — authored, not borrowed from an icon set).

---

## Browser surfaces

Themed from the palette in `src/styles/base.css`, all inside `@layer base`:
selection, caret, focus ring (`:focus-visible` only), scrollbars, autofill,
`accent-color`, native `<option>` backgrounds, `::marker`, link underline
offset.

> **Cascade:** every custom rule lives in `@layer base` or `@layer components`.
> Unlayered CSS outranks Tailwind's layered utilities, so a bare
> `p { margin: 0 }` silently beat every `mt-*` on the page and
> `a { color: inherit }` beat every `text-*`. If spacing or colour stops
> applying, check the layer first.

`user-select: none` applies only to `.instrument` — the keyboard and transport.
It used to be on every element on the page, which made the whole product
unselectable.

---

## Composition rules that hold across the product

- No page is structured as a grid of same-size icon + heading + text cards.
  Each section takes the form its content actually has: the catalogue is a
  dotted-leader index with tabular counts, the engine is two figures and two
  named behaviours, the input methods are a `<dl>` on hairlines.
- No eyebrows, no section numbers, no gradient text.
- Prove rather than claim: the home page runs the real renderer on the real
  bundled demo, the keyboard picker uses the real presets, and the progression
  showcase draws real chord voicings on real keys. Numbers come from
  `src/features/midi/catalogStats.ts`, generated from
  `public/songs/catalog.json`.
- **The landing demonstrates; it is never an instrument.** `HeroInstrument`,
  `PracticeDemo` and `ProgressionShowcase` are all `pointer-events: none` /
  `decorative`, import no audio engine, and advance on their own timers. A
  visitor clicking the artwork must not get a piano note. The only interactive
  thing on the page is `PianoPicker`, which is an ordinary segmented control,
  not a keyboard you play.
- **Both halves of the product are present, composing first.** The page order is
  hero → compose → network → your piano → catalogue → practice → engine → input
  → close. A landing that shows only the play-along mis-describes Chordia.
- **The account is offered, never hidden.** Sign in and Create account sit in
  the header at every breakpoint regardless of whether Firebase credentials are
  configured, and both the hero and the close lead with registration.
- **Difficulty is drawn as five keys, not five stars.** Stars read as a rating
  somebody gave the piece; this is a level on a scale, and the keyboard is the
  product's own unit of measure.
- **Loading is note light, not a spinning border.** A working state uses
  `.sustain` on a few key-shaped bars.

---

## Tailwind v4 traps this project already hit

- **`*-opacity-*` utilities were removed.** `bg-black bg-opacity-70` is a silent
  no-op, which is why the guided tour's overlay was fully opaque black and hid
  the very thing it was explaining. Use the slash syntax: `bg-black/70`.
- **Token names collide with built-in utilities.** See the colour note above.
- **Unlayered CSS beats layered utilities.** See the cascade note above.
- There is **no stock palette left** in `src/`: no `emerald-*`, `gray-*`,
  `blue-*`, `red-*`. Every colour is a token. Grep before adding one.
- Vary density: a dense passage earns a quiet one. The page ends anchored on
  the instrument, edge to edge.

---

## Language

Both languages are first class — `src/i18n/`. `messages/es.ts` is the source of
truth and `messages/en.ts` is typed `Messages`, so adding a Spanish string
without an English one fails the build. `useT()` gives `t` and `tn` (for
`one|other` plurals). The chosen locale persists in `localStorage` and syncs
`<html lang>`.

Catalogue data (style names) is English in the JSON, so it is translated for
display through `style.*` keys rather than shown raw.
