<p align="center">
  <img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743164811/logo_rkxbip.webp" alt="Chordia" width="400">
</p>

<h1 align="center">🎵 Chordia 🎹</h1>

Experience the perfect blend of music theory and technology with Chordia, your ultimate chord progression management platform. Create, explore, and manage your musical ideas with our intuitive interface, designed for musicians of all levels.

Develop your musical skills with our interactive piano interface, where you can visualize and experiment with chord progressions in real-time. Whether you're composing a new piece or learning music theory, Chordia provides the tools you need to make your musical journey seamless and enjoyable.

Sign up now and start building your chord library today!

<h1>🎼 Features</h1>

- **Interactive Piano Interface**: Create and visualize chord progressions with our intuitive keyboard
- **Custom Song Management**: Save songs with key, tempo, and time signature information
- **Personal Library**: Organize and access all your musical creations in one place
- **Real-time Chord Recognition**: Instantly see chord names and progressions as you play
- **Community Sharing**: Share your arrangements and collaborate with other musicians
- **Smart Practice Tools**: Track your progress and get personalized recommendations
- **MIDI Import & Play-Along**: Import any `.mid` file and play it with falling notes over the keyboard (Sightread style), with wait mode, hand selection, speed control and scoring
- **Built-in Song Catalog**: 759 public-domain / Creative Commons piano pieces (105 composers), searchable and filterable by composer, style and difficulty
- **Your Own Piano**: tell Chordia how many keys your keyboard has and the MIDI mode draws exactly that piano, transposing pieces that don't fit
- **Studio-grade Piano Engine**: Multi-sampled acoustic piano over the Web Audio API, with velocity dynamics, sustain pedal, stereo spread and reverb

<h1>📸 Screenshots</h1>

**Desktop Version 💻**:

<table align="center">
  <tr>
    <th colspan="1" style="text-align:center; font-size:20px;">Landing Page</th>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743165458/b329ccb3-9cac-4d17-9322-c24a74ff852c.png" alt="Chordia Landing Page" width="850"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <th colspan="3" style="text-align:center; font-size:20px;">App Features</th>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743165225/7c9ed27d-8d7f-4b91-92d6-d84f1f6dfde4.png" alt="Stage Page" width="280"></td>
    <td><img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743165262/acf8247c-6351-442c-89b5-5143774e54ee.png" alt="Library Page" width="280"></td>
    <td><img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743165330/bd8247d9-4f2b-45a5-985b-8e11fd11ce1f.png" alt="Song Creation Page" width="280"></td>
  </tr>
  <tr>
    <td align="center"><strong>Stage</strong></td>
    <td align="center"><strong>Library</strong></td>
    <td align="center"><strong>Song Creation</strong></td>
  </tr>
</table>

<h1>⚙️ Tech Stack & Libraries 📖</h1>

1. **Main Technologies**:
   - **Frontend**: React with TypeScript
   - **Styling**: Tailwind CSS
   - **Backend**: Firebase (Authentication, Firestore, Storage)
   - **Build Tool**: Vite

2. **Libraries**:
   - **react-icons** - For UI icons
   - **react-router-dom** - For navigation and routing
   - **firebase** - Auth, Firestore and Storage, all loaded on demand
   - **sweetalert2** - Dialogs, themed in `src/styles/dialog.css` and opened
     only through `src/ui/dialog.ts`
   - **tailwindcss** (v4) - Utility CSS; the design tokens live in
     `src/styles/tokens.css` under `@theme`
   - **@tonejs/midi** - For parsing imported `.mid` files
   - **@fontsource-variable/{inter,bricolage-grotesque}** - Self-hosted
     variable fonts

3. **Language**: the interface is bilingual (Spanish and English). Strings live
   in `src/i18n/messages/`; `es.ts` is the source of truth and `en.ts` is typed
   against it, so adding a Spanish string without an English one fails the
   build.

<h1>🎹 MIDI Import & Play-Along</h1>

Import a MIDI file and play it like in Sightread: the notes fall over an on-screen
keyboard and you play along with a MIDI keyboard, the computer keyboard or the mouse.

- **Where**: `MIDI` in the top navigation (`/midi` to import, `/play/:midiId` to play). No account needed.
- **Import**: drag & drop `.mid` / `.midi` files. They are stored in the browser (IndexedDB), never uploaded.
- **Modes**: *Listen* plays the whole piece; *Practice* freezes the clock on every note of your hand until you play it right.
- **Controls**: hand selection (what you play / what the app plays), 25%-150% speed, zoom, metronome, note names, click-to-seek scrub bar and hit/streak/accuracy stats.
- **Input**: any MIDI keyboard is auto-detected (velocity + CC64 sustain pedal). Without one, the `q w e r ...` and `z x c v ...` rows are the piano and `Shift` is the pedal.
- **Bridge to Chordia songs**: *Guardar como cancion* extracts the chord progression from a MIDI file and saves it as a regular Chordia song (key, tempo and time signature included).
- A built-in public-domain demo song ships with the app, so the feature can be tried without importing anything.

<h2>📚 Song catalog</h2>

`/midi` opens with a catalog of **759 pieces from 105 composers** (Bach 124, Schubert 49, Chopin 47,
Beethoven 43, Mozart 33, Satie, Debussy, Handel, Schumann, Czerny...), all of them public domain or
Creative Commons, bundled in `public/songs/` with per-song attribution (source, original link and
license). Search by title or composer and filter by composer, style, difficulty (1-5, relative to
the rest of the catalog) or "only what fits my piano".

Sources: [Mutopia Project](https://www.mutopiaproject.org/) (their robots.txt allows crawling) and
the CC-licensed songs shipped with [sightread](https://github.com/sightread/sightread). No
copyrighted material is redistributed.

Regenerate or extend the catalog with:

```bash
npm run songs            # crawl + download + analyse (writes public/songs/**)
npm run songs:rescore    # recompute metrics/difficulty from local files, no network
```

`scripts/harvest-songs.mjs` parses every file, measures duration, note count, note density,
polyphony and keyboard range, and assigns a relative difficulty by quantiles.

<h2>🎹 Your piano</h2>

In **Profile > Edit** (or straight from `/midi`, no account needed) you can set how many keys your
keyboard has: 88, 76, 73, 61, 49, 37, 25 or a custom range. The MIDI mode then draws exactly that
piano instead of adapting to each song, the catalog marks the pieces that don't fit, and
"Ajustar a mi piano" (or the automatic option) shifts a piece by octaves so it does. The setting is
stored in the browser and, when signed in, in the Firestore profile.

<h2>🔊 Piano sound engine</h2>

`src/features/audio` replaces the old 3-sample `Tone.Sampler` with a Web Audio engine:

- 31 Salamander Grand Piano samples (one every minor third), so pitch-shifting never exceeds one semitone
- velocity drives both loudness and brightness (filter), like a real hammer action
- sustain pedal, 48-voice polyphony with voice stealing, pitch-based stereo spread, convolution reverb, compressor and limiter
- notes are scheduled on the audio clock (sample-accurate playback and metronome), not with `setTimeout`
- fallback additive synth: notes always sound, even while samples are still downloading or offline

<h1>🔧 Installation</h1>

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/RubenMRDev/Chordia
    cd Chordia
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    # or
    yarn
    ```

3. **Install SweetAlert2 for confirmation dialogs**:

    ```bash
    npm install sweetalert2
    # or
    yarn add sweetalert2
    ```

4. **Set Up Firebase**:
   
   Create a `.env` file in the root directory with your Firebase configuration:

    ```
    VITE_FIREBASE_API_KEY=your-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    VITE_FIREBASE_APP_ID=your-app-id
    VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
    ```

5. **Run the Development Server**:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. **Open [http://localhost:5173](http://localhost:5173)** with your browser to see the result.

<h1>🔍 Project Structure</h1>

```
chordia-landing/
├── public/               # Static assets, including the 759-piece catalogue
│   └── songs/            # catalog.json + the bundled .mid files
├── src/
│   ├── app/              # Application shell
│   │   ├── main.tsx      # Entry point: providers, fonts, error boundary
│   │   ├── App.tsx       # Routes, every one a lazy chunk
│   │   ├── ErrorBoundary.tsx
│   │   └── RouteFallback.tsx
│   ├── features/         # Domain logic, framework-free and tested
│   │   ├── audio/        # Web Audio piano engine (PianoEngine, samples)
│   │   ├── midi/         # Parsing, library, catalogue, demo song
│   │   ├── piano/        # The user's own keyboard range
│   │   ├── player/       # Transport, practice clock, scoring
│   │   └── renderer/     # Falling-notes canvas
│   ├── i18n/             # Spanish + English dictionaries and provider
│   ├── styles/           # tokens.css, base.css, instrument.css
│   ├── ui/               # Design-system primitives (Button, Keyboard, Field…)
│   ├── components/
│   │   ├── layout/       # Header, Footer, Shell, BrandMark
│   │   ├── home/         # Landing sections
│   │   ├── player/       # Player surface
│   │   └── piano/
│   ├── context/          # AuthContext
│   ├── firebase/         # env.ts (flag only) + config.ts (SDK, lazy)
│   ├── hooks/
│   ├── pages/            # One route each
│   ├── services/
│   ├── types/            # Ambient types and domain models
│   └── index.css         # Imports Tailwind and the style layers
├── .env                  # VITE_FIREBASE_* (optional: the app plays without it)
├── DESIGN.md             # The design system, recorded from the build
├── PRODUCT.md            # Product truth
└── README.md
```

Two conventions worth knowing before editing:

- **`@/` is an alias for `src/`**, wired in `vite.config.ts`, `tsconfig*.json`
  and the Jest `moduleNameMapper`.
- **`src/firebase/config.ts` must only ever be reached through a dynamic
  `import()`.** It is the one module that touches the Firebase SDK; importing
  it statically puts 535 kB back on the critical path of every page, including
  the ones that need no account. Import `src/firebase/env.ts` when all you need
  is `isFirebaseConfigured`.

<h1>🚀 Future Enhancements</h1>

- **Collaborative Editing**: Allow multiple users to work on compositions simultaneously
- **Audio Export**: Enable exporting compositions as MIDI or audio files

<h1>🧪 Testing</h1>

Chordia includes comprehensive test suites for both frontend and backend components to ensure reliability and stability.

### Running Tests

To run all tests, use the following command:

```bash
npm test
# or
yarn test
```

### Test Structure

```
chordia-landing/
├── src/              
│   ├── __tests__/     # Frontend component tests
│   │   ├── components/   # Component-specific tests
│   │   ├── pages/        # Page-specific tests
│   │   └── utils/        # Utility function tests
│   │
│   ├── firebase/      
│       └── __tests__/    # Backend/Firebase service tests
```

### Test Coverage

🔹 **Front-end (components, pages, hooks, utils, context):**
Includes:

- `src/components`
- `src/pages`
- `src/context`
- `src/hooks`
- `src/utils`

**Front-end average coverage:**

| Metric   | Estimated Avg. Coverage |
|----------|:----------------------:|
| % Stmts  | ~65.0%                 |
| % Branch | ~51.0%                 |
| % Funcs  | ~56.0%                 |
| % Lines  | ~65.0%                 |

➡️ Approximate result: **~59%** of the front-end is tested (weighted average of the 4 metrics).

🔹 **Back-end (services, API, firebase):**
Includes:

- `src/api`
- `src/services`
- `src/firebase`

**Back-end average coverage:**

| Metric   | Estimated Avg. Coverage |
|----------|:----------------------:|
| % Stmts  | ~63.0%                 |
| % Branch | ~66.0%                 |
| % Funcs  | ~53.0%                 |
| % Lines  | ~62.0%                 |

➡️ Approximate result: **~61%** of the back-end is tested.

✅ **Final summary**

| Part       | Approx. Coverage % |
|------------|:-----------------:|
| Front-end  | ~59%              |
| Back-end   | ~61%              |
| Overall    | ~52.5% (actual, from global table) |

<table align="center">
  <tr>
    <th style="text-align:center; font-size:20px;">Test Results</th>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1750598540/Screenshot_2025-06-22_152141_mojfgf.png" alt="Chordia Test Results" width="600"></td>
  </tr>
</table>

<h1>📜 License</h1>

This project is licensed under the MIT License - see the LICENSE file for details.
