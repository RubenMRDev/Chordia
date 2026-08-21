# Direction contract — "Señal viva"

Chosen by the user, 2026-08-21, over "Rack de estudio" and "Programa de
concierto". Palette pinned by the user; scope is the whole product; bilingual
ES/EN; full structural refactor authorised.

## World

The product renders its own visual language and we stopped looking at it. The
falling-notes canvas in `features/renderer/FallingNotes.ts` already carries a
complete, *semantic* palette — and the marketing surface threw it away for
two-tone green-on-navy plus a stock photo.

The world is **a lit instrument in a dark room**: the keyboard as the page's
structural spine, and colour that means something because the renderer already
made it mean something.

| Role | Value | Meaning in the product |
|---|---|---|
| Right hand | `#00E676` | the notes you play with your right hand |
| Left hand | `#38BDF8` | the notes you play with your left hand |
| Waiting | `#FFD166` | practice mode froze; play this note |
| Struck | `#FFFFFF` | the note landed |
| Ivory | `#F4F7FB` | white keys |
| Ebony | `#151b26` | black keys |
| Ground | `#0a101b` / `#0f1624` | the room behind the instrument |
| Felt | `#7f1d2e` | damper felt — destructive actions, over-range warnings |

This is the raise the direction needed and the reason it is not
near-black-plus-one-neon: the accent is not one glow, it is a four-role signal
system taken from the instrument, plus the two real materials a piano is made
of. Felt red is a physical part of the subject, not an invented second brand
colour.

Dark is chosen from the scene, not the category: the user is at a desk at
night, headphones on, behind a keyboard with lit keys. PRODUCT.md records it.

## Type

- Display: **Bricolage Grotesque** (variable weight/width/optical size).
  Industrial-editorial, has a point of view, and its optical-size axis lets one
  face carry a poster headline and a 13px label without a second family.
- Text / UI: **Inter**, body and controls only, never display.
- Measurement: Inter with `tabular-nums` + `slashed-zero`. Tempo, time, key
  and accuracy are real measurement, so figures align in a column; no
  monospace costume is added to imply "technical".

## Correction, 2026-08-21

The first build of this direction over-rotated on the play-along and made the
hero a playable instrument. Both were wrong, and the user said so:

1. **The landing is a page, not an instrument.** The falling-notes canvas stays
   — it is the product working, and it is attractive — but it has no pointer
   handling and loads no audio engine. Clicking it does nothing. The practice
   and progression demos advance on their own timers and are silent. Playing
   belongs in the player.
2. **The composing half leads.** Chordia is a place to write chord progressions;
   the play-along is what you do afterwards. The page now opens on
   "Escribe acordes. Tócalos. Compártelos." and gives the second and third
   sections to composing and to the network (library, Discover, profiles).
3. **The account is central.** "You do not need an account" was the closing
   message; it is now a footnote. Sign in and Create account are always in the
   header, Discover and the catalogue are always advertised, and both the hero
   and the close point at registration.

## First viewport

Not a hero. The instrument, at the scale it has in life.

A live falling-notes field runs behind the fold — the real renderer, the real
bundled demo (Ode to Joy), right hand green and left hand blue, over a real
keyboard spanning the full width of the viewport at the bottom edge. Keys light
on strike and decay. The headline sits in the dark air *between* the falling
notes and the keys, so the notes pass behind it.

It is a picture. `pointer-events: none`, `aria-hidden`, no audio engine.

The claim is proven, not stated: within two seconds the visitor has seen the
falling notes, the two-hand colour coding, and the keyboard, which is the
entire product. The keys are live from the first frame — click one and it
sounds.

## Visitor path

the product at work → writing a progression (chords on the circle, drawn on the
keys, saved with its key/tempo/compás) → the network (your library, everyone's
songs, profiles) → your keyboard drawn to size → the catalogue as a real dense
index → practice mode with the clock frozen → the engine → create an account.

## Signature interaction

**The keyboard is the page's spine, not its instrument.** The same `Keyboard`
component carries the hero's bottom edge, the chord shapes in the progression
showcase, the keyboard-size picker, the practice diagram, the footer edge and
the 404. Seeing one chord light up on real keys is what explains the product;
the visitor plays in the player, where the transport and the hands exist.

## Motion grammar

One authored moment, not an entrance on every section. The authored moment is
**the strike**: a note reaches the hit line, the key depresses, light blooms
from the contact point along the key's length and decays on the sustain
envelope. Everything else in the interface borrows that one gesture —
buttons depress and bloom, toggles land, the scrub head strikes.

- Easing: exponential ease-out, `cubic-bezier(.16,1,.3,1)`, from an
  already-visible default. Nothing is hidden waiting to animate in.
- The falling field is continuous and generative; every other motion is
  event-driven and short (120–320 ms).
- Bounded: the canvas pauses off-screen and under `prefers-reduced-motion`,
  where the field renders one static frame and the strike becomes a
  colour change with no bloom.
- Scroll reveals are *not* the grammar. Where the scroll is used at all it
  varies — density, scale, quiet — inside the one grammar.

## Cross-surface reach

- The keyboard silhouette is the recurring structural device: it rules the
  footer, separates sections, and forms the progress track in the player.
- Hand colour is load-bearing everywhere, not decorative: catalogue difficulty,
  charts, per-hand toggles, and range warnings all read from the same four
  roles.
- Panels are instrument chassis — a 1px light seam on top, deep ground below.
- Every browser surface is themed from the palette: selection, caret,
  scrollbars, focus rings, autofill.

## Honest risk

Dark-plus-signal-green is exactly the cluster AI interfaces fall into, and the
user pinned that palette. The direction only escapes it by being disciplined
about the other three signal colours and the two piano materials — if the build
drifts back to green-on-navy with a glow, it has failed, and the failure will
look like the thing it replaced. The other risk is the live canvas in the first
viewport: it must cost nothing on a laptop on battery, or the first impression
is a fan spinning up.
