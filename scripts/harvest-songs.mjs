/**
 * Recolector del catalogo de canciones MIDI de Chordia.
 *
 * Fuentes (todas con licencia que permite redistribuir, y se guarda la
 * atribucion de cada pieza en el catalogo):
 *
 *  1. Mutopia Project (https://www.mutopiaproject.org): partituras de dominio
 *     publico o Creative Commons, con MIDI generado desde LilyPond. Su
 *     robots.txt permite el rastreo de todo el contenido.
 *  2. Las canciones que trae sightread (https://github.com/sightread/sightread),
 *     cada una con su licencia CC declarada en su manifest.
 *
 * Uso:
 *   node scripts/harvest-songs.mjs            # todo
 *   node scripts/harvest-songs.mjs --limit 50 # prueba rapida
 *
 * Salida: public/songs/**.mid + public/songs/catalog.json
 */

import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import midiPackage from '@tonejs/midi';

const { Midi } = midiPackage;

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'songs');
const CATALOG_FILE = path.join(OUT_DIR, 'catalog.json');

const USER_AGENT =
  'ChordiaSongHarvester/1.0 (+https://github.com/RubenMRDev/Chordia; catalogo de piezas con licencia libre)';

const MUTOPIA_LIST =
  'https://www.mutopiaproject.org/cgibin/make-table.cgi?startat=%s&searchingfor=&Composer=&Instrument=Piano&Style=&collection=&id=&solo=&recent=&timelength=&timeunit=&lilyversion=&preview=';
const PAGE_SIZE = 10;

const SIGHTREAD_MANIFEST =
  'https://raw.githubusercontent.com/sightread/sightread/main/src/manifest.json';
const SIGHTREAD_RAW = 'https://raw.githubusercontent.com/sightread/sightread/main/public/';

const args = process.argv.slice(2);
const limitArg = args.indexOf('--limit');
const LIMIT = limitArg >= 0 ? Number(args[limitArg + 1]) : Infinity;
const RESET = args.includes('--reset');

const KNOWN_STYLES = new Set([
  'Baroque', 'Classical', 'Romantic', 'Modern', 'Renaissance', 'Medieval', 'Jazz', 'Blues',
  'Ragtime', 'Folk', 'Song', 'Hymn', 'Dance', 'Christmas', 'Country', 'Traditional', 'Popular',
  'Contemporary', 'March', 'Tango', 'Waltz',
]);

// --------------------------------------------------------------------- utiles

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function log(...parts) {
  process.stdout.write(`${parts.join(' ')}\n`);
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, ' '));
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

async function fetchText(url, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      if (attempt === attempts) throw error;
      await sleep(800 * attempt);
    }
  }
  throw new Error('unreachable');
}

async function fetchBuffer(url, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      if (attempt === attempts) throw error;
      await sleep(800 * attempt);
    }
  }
  throw new Error('unreachable');
}

// ------------------------------------------------------------------- analisis

/**
 * Metricas de la pieza a partir del MIDI: sirven para clasificar por
 * dificultad y para saber si cabe en el piano del usuario.
 */
function analyse(buffer) {
  const midi = new Midi(buffer);
  const notes = midi.tracks.flatMap((track) =>
    track.notes.map((note) => ({ midi: note.midi, time: note.time, duration: note.duration })),
  );
  if (notes.length === 0) return null;

  const duration = notes.reduce((max, note) => Math.max(max, note.time + note.duration), 0);
  if (duration < 3) return null;

  const lowestMidi = notes.reduce((min, note) => Math.min(min, note.midi), 127);
  const highestMidi = notes.reduce((max, note) => Math.max(max, note.midi), 0);
  const notesPerSecond = notes.length / duration;

  // Polifonia media: cuantas notas suenan a la vez de media.
  const sustained = notes.reduce((total, note) => total + note.duration, 0);
  const polyphony = sustained / duration;

  const accidentals = notes.filter((note) => [1, 3, 6, 8, 10].includes(note.midi % 12)).length;

  // Puntuacion continua: densidad de notas (lo que mas cuesta) modulada por
  // polifonia, extension del teclado y cantidad de alteraciones.
  const accidentalRatio = accidentals / notes.length;
  const score =
    notesPerSecond * (0.7 + 0.3 * Math.min(polyphony, 6)) +
    (highestMidi - lowestMidi) / 18 +
    accidentalRatio * 3;

  return {
    score: Math.round(score * 100) / 100,
    duration: Math.round(duration),
    noteCount: notes.length,
    bpm: Math.round(midi.header.tempos[0]?.bpm ?? 120),
    lowestMidi,
    highestMidi,
    notesPerSecond: Math.round(notesPerSecond * 100) / 100,
    polyphony: Math.round(polyphony * 100) / 100,
  };
}


/**
 * Mutopia abrevia los nombres ("L. V. Beethoven") y sightread los trae
 * completos ("Ludwig van Beethoven"), asi que el mismo compositor aparecia dos
 * veces en los filtros. Se agrupan por apellido y se usa un nombre canonico.
 */
const CANONICAL_COMPOSERS = {
  bach: 'Johann Sebastian Bach',
  beethoven: 'Ludwig van Beethoven',
  chopin: 'Frederic Chopin',
  mozart: 'Wolfgang Amadeus Mozart',
  schubert: 'Franz Schubert',
  schumann: 'Robert Schumann',
  debussy: 'Claude Debussy',
  satie: 'Erik Satie',
  liszt: 'Franz Liszt',
  brahms: 'Johannes Brahms',
  handel: 'Georg Friedrich Handel',
  haydn: 'Joseph Haydn',
  tchaikovsky: 'Piotr Ilich Chaikovski',
  grieg: 'Edvard Grieg',
  mendelssohn: 'Felix Mendelssohn',
  czerny: 'Carl Czerny',
  diabelli: 'Anton Diabelli',
  burgmuller: 'Johann Friedrich Burgmuller',
  verdi: 'Giuseppe Verdi',
  scarlatti: 'Domenico Scarlatti',
  clementi: 'Muzio Clementi',
  albeniz: 'Isaac Albeniz',
  granados: 'Enrique Granados',
  rachmaninoff: 'Sergei Rachmaninoff',
  pachelbel: 'Johann Pachelbel',
  joplin: 'Scott Joplin',
  sor: 'Fernando Sor',
  faure: 'Gabriel Faure',
  'saint-saens': 'Camille Saint-Saens',
  dvorak: 'Antonin Dvorak',
  vivaldi: 'Antonio Vivaldi',
  gounod: 'Charles Gounod',
  anonimo: 'Anonimo / Tradicional',
  unknown: 'Anonimo / Tradicional',
};

function composerKey(name) {
  const tokens = name.replace(/\(.*\)/, '').trim().split(/\s+/);
  // El apellido es el ultimo token que no sea una inicial ("L. V. Beethoven").
  const surname = [...tokens].reverse().find((token) => token.replace(/\./g, '').length > 2) ?? name;
  return slugify(surname);
}

function normalizeComposers(songs) {
  const display = new Map();
  for (const song of songs) {
    const key = composerKey(song.composer);
    const canonical = CANONICAL_COMPOSERS[key];
    const previous = display.get(key);
    // Sin nombre canonico gana la variante mas completa que aparezca.
    const candidate = canonical ?? song.composer;
    if (!previous || (!canonical && candidate.length > previous.length)) {
      display.set(key, candidate);
    }
  }
  for (const song of songs) {
    const key = composerKey(song.composer);
    song.composerKey = key;
    song.composer = display.get(key) ?? song.composer;
  }
}

/**
 * Dificultad 1-5 por cuantiles del propio catalogo: en absoluto no significa
 * nada, pero comparada con el resto de piezas si sirve para filtrar.
 */
function assignDifficulties(songs) {
  const sorted = [...songs].sort((a, b) => a.score - b.score);
  sorted.forEach((song, index) => {
    song.difficulty = Math.min(5, Math.floor((index / sorted.length) * 5) + 1);
  });
}

// -------------------------------------------------------------------- Mutopia

function parseMutopiaPage(html) {
  const blocks = html.split('<table class="table-bordered result-table">').slice(1);
  const pieces = [];

  for (const block of blocks) {
    const midMatch = block.match(/href="(https:\/\/www\.mutopiaproject\.org\/ftp\/[^"]+\.mid)"/);
    if (!midMatch) continue;

    const cells = [...block.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((match) =>
      stripTags(match[1]),
    );
    const title = cells[0] ?? '';
    if (!title) continue;

    const composerCell = cells.find((cell) => /^by /.test(cell)) ?? '';
    const composer = composerCell
      .replace(/^by /, '')
      .replace(/\((\d{3,4}[^)]*)\)/, '')
      .trim();
    const lifespan = (composerCell.match(/\((\d{3,4}[^)]*)\)/) ?? [])[1] ?? '';
    const instrument = (cells.find((cell) => /^for /.test(cell)) ?? '').replace(/^for /, '').trim();
    const style = cells.find((cell) => KNOWN_STYLES.has(cell)) ?? '';

    const licenseMatch = block.match(/legal\.html#([a-z-]+)">([^<]+)<\/a>/);
    const idMatch = block.match(/piece-info\.cgi\?id=(\d+)/);

    pieces.push({
      title,
      composer: composer || 'Anonimo',
      lifespan,
      instrument,
      style,
      license: licenseMatch ? decodeEntities(licenseMatch[2]) : 'Public Domain',
      licenseUrl: licenseMatch
        ? `https://www.mutopiaproject.org/legal.html#${licenseMatch[1]}`
        : 'https://www.mutopiaproject.org/legal.html',
      pageUrl: idMatch
        ? `https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=${idMatch[1]}`
        : 'https://www.mutopiaproject.org/',
      midUrl: midMatch[1],
      sourceName: 'Mutopia Project',
      sourceId: idMatch ? `mutopia-${idMatch[1]}` : `mutopia-${slugify(title)}`,
    });
  }

  return pieces;
}

async function listMutopiaPieces() {
  const pieces = [];
  const seen = new Set();

  for (let startat = 0; pieces.length < LIMIT; startat += PAGE_SIZE) {
    const html = await fetchText(MUTOPIA_LIST.replace('%s', String(startat)));
    const page = parseMutopiaPage(html);
    if (page.length === 0) break;

    for (const piece of page) {
      if (seen.has(piece.midUrl)) continue;
      seen.add(piece.midUrl);
      pieces.push(piece);
    }
    if (startat % 100 === 0) log(`  listando Mutopia... ${pieces.length} piezas`);
    await sleep(150);
  }

  return pieces.slice(0, LIMIT);
}

// ------------------------------------------------------------------ sightread

async function listSightreadPieces() {
  const manifest = JSON.parse(await fetchText(SIGHTREAD_MANIFEST));
  return manifest
    .filter((entry) => typeof entry.file === 'string' && entry.file.endsWith('.mid'))
    .filter((entry) => !entry.file.includes('/irish/'))
    .map((entry) => {
      // Los titulos vienen como "Pieza - Compositor".
      const [rawTitle, rawComposer] = String(entry.title).split(' - ');
      return {
        title: (rawTitle ?? entry.title).trim(),
        composer: (rawComposer ?? 'Varios').trim(),
        lifespan: '',
        instrument: 'Piano',
        style: '',
        license: entry.license?.includes('publicdomain') ? 'Public Domain' : 'CC BY 4.0',
        licenseUrl: entry.license ?? 'https://creativecommons.org/licenses/by/4.0/',
        pageUrl: entry.url ?? 'https://github.com/sightread/sightread',
        midUrl: `${SIGHTREAD_RAW}${entry.file}`,
        sourceName: 'sightread',
        sourceId: `sightread-${slugify(entry.id ?? entry.file)}`,
      };
    });
}

// ----------------------------------------------------------------------- main

/** Recalcula metricas y dificultades sin tocar la red. */
async function rescore() {
  const catalog = JSON.parse(await readFile(CATALOG_FILE, 'utf8'));
  for (const song of catalog.songs) {
    const buffer = await readFile(path.join(ROOT, 'public', song.file));
    const metrics = analyse(buffer);
    if (metrics) Object.assign(song, metrics);
  }
  normalizeComposers(catalog.songs);
  assignDifficulties(catalog.songs);
  catalog.composers = [...new Set(catalog.songs.map((song) => song.composer))].sort();
  catalog.songs.sort(
    (a, b) => a.composer.localeCompare(b.composer) || a.title.localeCompare(b.title),
  );
  await writeFile(CATALOG_FILE, `${JSON.stringify(catalog, null, 1)}
`, 'utf8');

  const byDifficulty = catalog.songs.reduce((acc, item) => {
    acc[item.difficulty] = (acc[item.difficulty] ?? 0) + 1;
    return acc;
  }, {});
  log(`Recalculadas ${catalog.songs.length} canciones: ${JSON.stringify(byDifficulty)}`);
}

async function main() {
  if (args.includes('--rescore')) {
    await rescore();
    return;
  }

  if (RESET && existsSync(OUT_DIR)) await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(path.join(OUT_DIR, 'mutopia'), { recursive: true });
  await mkdir(path.join(OUT_DIR, 'cc'), { recursive: true });

  log('1/3 Listando piezas...');
  const sightread = await listSightreadPieces();
  log(`  sightread: ${sightread.length} piezas`);
  const mutopia = await listMutopiaPieces();
  log(`  Mutopia: ${mutopia.length} piezas de piano`);

  const pieces = [...sightread, ...mutopia].slice(0, LIMIT === Infinity ? undefined : LIMIT);

  log(`2/3 Descargando y analizando ${pieces.length} ficheros...`);
  const catalog = [];
  const usedIds = new Set();
  let failed = 0;
  let skipped = 0;
  let index = 0;

  const CONCURRENCY = 4;
  const worker = async () => {
    while (index < pieces.length) {
      const piece = pieces[index++];
      const folder = piece.sourceName === 'Mutopia Project' ? 'mutopia' : 'cc';

      let id = slugify(`${piece.composer}-${piece.title}`) || piece.sourceId;
      if (usedIds.has(id)) id = `${id}-${piece.sourceId.replace(/\D/g, '')}`;
      if (usedIds.has(id)) {
        skipped++;
        continue;
      }
      usedIds.add(id);

      try {
        const buffer = await fetchBuffer(piece.midUrl);
        const metrics = analyse(buffer);
        if (!metrics) {
          skipped++;
          continue;
        }

        const file = `songs/${folder}/${id}.mid`;
        await writeFile(path.join(OUT_DIR, folder, `${id}.mid`), buffer);
        catalog.push({
          id,
          title: piece.title,
          composer: piece.composer,
          lifespan: piece.lifespan || undefined,
          instrument: piece.instrument || 'Piano',
          soloPiano: /^piano( solo)?$/i.test(piece.instrument.trim()),
          style: piece.style || undefined,
          file,
          size: buffer.length,
          source: piece.sourceName,
          sourceUrl: piece.pageUrl,
          license: piece.license,
          licenseUrl: piece.licenseUrl,
          ...metrics,
        });
      } catch (error) {
        failed++;
        if (failed < 10) log(`  fallo en ${piece.title}: ${error.message}`);
      }
      await sleep(60);
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  normalizeComposers(catalog);
  assignDifficulties(catalog);
  catalog.sort(
    (a, b) => a.composer.localeCompare(b.composer) || a.title.localeCompare(b.title),
  );

  log('3/3 Escribiendo catalogo...');
  const composers = [...new Set(catalog.map((item) => item.composer))].sort();
  const payload = {
    generatedAt: new Date().toISOString().slice(0, 10),
    count: catalog.length,
    composers,
    sources: [
      {
        name: 'Mutopia Project',
        url: 'https://www.mutopiaproject.org/',
        note: 'Partituras de dominio publico o Creative Commons; MIDI generado desde LilyPond.',
      },
      {
        name: 'sightread',
        url: 'https://github.com/sightread/sightread',
        note: 'Canciones incluidas en sightread, cada una con su licencia CC declarada.',
      },
    ],
    songs: catalog,
  };
  await writeFile(CATALOG_FILE, `${JSON.stringify(payload, null, 1)}\n`, 'utf8');

  const byDifficulty = catalog.reduce((acc, item) => {
    acc[item.difficulty] = (acc[item.difficulty] ?? 0) + 1;
    return acc;
  }, {});
  const totalBytes = catalog.reduce((sum, item) => sum + item.size, 0);

  log('');
  log(`Catalogo: ${catalog.length} canciones, ${composers.length} compositores`);
  log(`Por dificultad: ${JSON.stringify(byDifficulty)}`);
  log(`Tamano total: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
  log(`Descartadas: ${skipped} sin notas o duplicadas, ${failed} con error de descarga`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exit(1);
});
