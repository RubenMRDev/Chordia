import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaSearch, FaStar, FaExclamationTriangle, FaExternalLinkAlt } from 'react-icons/fa';
import {
  DIFFICULTY_LABELS,
  EMPTY_FILTERS,
  catalogStyles,
  filterCatalog,
  loadCatalog,
  toCatalogId,
  type Catalog,
  type CatalogFilters,
  type CatalogSong,
} from '../../features/midi/catalog';
import { formatTime } from '../../features/player/format';
import { describeRange, fitsInPiano, type PianoSettings } from '../../features/piano/pianoSettings';
import { midiToNoteName } from '../../features/audio/notes';

interface CatalogBrowserProps {
  piano: PianoSettings;
}

const PAGE_SIZE = 60;

const Difficulty: React.FC<{ level: number }> = ({ level }) => (
  <span
    className="inline-flex items-center gap-0.5"
    title={DIFFICULTY_LABELS[level] ?? `Nivel ${level}`}
  >
    {[1, 2, 3, 4, 5].map((step) => (
      <FaStar
        key={step}
        className={`text-[10px] ${step <= level ? 'text-[var(--accent-green)]' : 'text-white/15'}`}
      />
    ))}
  </span>
);

const selectClass =
  'bg-[var(--background-darker)] text-white text-sm rounded px-2 py-1.5 border border-white/10';

/**
 * Catalogo de piezas que viene con la app: buscador, filtros por compositor,
 * estilo y dificultad, y aviso de si la pieza cabe en el piano del usuario.
 */
const CatalogBrowser: React.FC<CatalogBrowserProps> = ({ piano }) => {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    loadCatalog()
      .then(setCatalog)
      .catch((caught: unknown) =>
        setError(caught instanceof Error ? caught.message : 'No se pudo cargar el catalogo'),
      );
  }, []);

  const styles = useMemo(() => (catalog ? catalogStyles(catalog.songs) : []), [catalog]);

  const results = useMemo(
    () => (catalog ? filterCatalog(catalog.songs, filters) : []),
    [catalog, filters],
  );

  const patch = (next: Partial<CatalogFilters>) => {
    setFilters((previous) => ({ ...previous, ...next }));
    setVisible(PAGE_SIZE);
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center gap-3">
        <FaExclamationTriangle className="text-red-400" />
        <span>{error}</span>
      </div>
    );
  }

  if (!catalog) {
    return <p className="text-[var(--text-secondary)]">Cargando el catalogo...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[var(--card-background)] rounded-lg p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-sm" />
            <input
              type="search"
              value={filters.search}
              onChange={(event) => patch({ search: event.target.value })}
              placeholder="Buscar por titulo o compositor..."
              className="w-full bg-[var(--background-darker)] border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white"
            />
          </div>

          <select
            value={filters.composer}
            onChange={(event) => patch({ composer: event.target.value })}
            className={selectClass}
            aria-label="Compositor"
          >
            <option value="">Todos los compositores</option>
            {catalog.composers.map((composer) => (
              <option key={composer} value={composer}>
                {composer}
              </option>
            ))}
          </select>

          <select
            value={filters.style}
            onChange={(event) => patch({ style: event.target.value })}
            className={selectClass}
            aria-label="Estilo"
          >
            <option value="">Todos los estilos</option>
            {styles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(event) => patch({ sort: event.target.value as CatalogFilters['sort'] })}
            className={selectClass}
            aria-label="Ordenar"
          >
            <option value="composer">Ordenar por compositor</option>
            <option value="title">Ordenar por titulo</option>
            <option value="difficulty">Ordenar por dificultad</option>
            <option value="duration">Ordenar por duracion</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Nivel</span>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => patch({ difficulty: filters.difficulty === level ? null : level })}
              className={`px-3 py-1 rounded text-sm font-semibold ${
                filters.difficulty === level
                  ? 'bg-[var(--accent-green)] text-black'
                  : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
              }`}
              title={DIFFICULTY_LABELS[level]}
            >
              {level}
            </button>
          ))}

          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] ml-2">
            <input
              type="checkbox"
              checked={filters.soloOnly}
              onChange={(event) => patch({ soloOnly: event.target.checked })}
              className="accent-[var(--accent-green)]"
            />
            Solo piano
          </label>

          <label
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
            title={`Tu piano: ${describeRange(piano)}`}
          >
            <input
              type="checkbox"
              checked={filters.range !== null}
              onChange={(event) =>
                patch({
                  range: event.target.checked
                    ? { lowestMidi: piano.lowestMidi, highestMidi: piano.highestMidi }
                    : null,
                })
              }
              className="accent-[var(--accent-green)]"
            />
            Solo lo que cabe en mi piano
          </label>

          {(filters.search ||
            filters.composer ||
            filters.style ||
            filters.difficulty !== null ||
            filters.soloOnly ||
            filters.range) && (
            <button
              type="button"
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setVisible(PAGE_SIZE);
              }}
              className="ml-auto text-sm text-[var(--accent-green)] font-semibold"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)]">
        {results.length} de {catalog.count} canciones · {catalog.composers.length} compositores ·
        todas de dominio publico o Creative Commons
      </p>

      <div className="flex flex-col gap-2">
        {results.slice(0, visible).map((song) => (
          <CatalogRow key={song.id} song={song} piano={piano} />
        ))}
      </div>

      {results.length === 0 && (
        <p className="text-[var(--text-secondary)]">
          Nada con esos filtros. Prueba a quitar alguno.
        </p>
      )}

      {visible < results.length && (
        <button
          type="button"
          onClick={() => setVisible((value) => value + PAGE_SIZE)}
          className="self-center px-5 py-2 rounded bg-white/5 hover:bg-white/10 font-semibold"
        >
          Mostrar mas ({results.length - visible} restantes)
        </button>
      )}
    </div>
  );
};

const CatalogRow: React.FC<{ song: CatalogSong; piano: PianoSettings }> = ({ song, piano }) => {
  const fits = fitsInPiano(piano, song.lowestMidi, song.highestMidi);

  return (
    <article className="bg-[var(--card-background)] rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold truncate">
          {song.title}
          {!song.soloPiano && (
            <span className="ml-2 text-xs font-normal text-[var(--text-secondary)]">
              ({song.instrument})
            </span>
          )}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] truncate">
          {song.composer}
          {song.style ? ` · ${song.style}` : ''} · {formatTime(song.duration)} · {song.noteCount}{' '}
          notas · {midiToNoteName(song.lowestMidi)}-{midiToNoteName(song.highestMidi)}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Difficulty level={song.difficulty} />

        {!fits && (
          <span
            className="text-xs text-[#FFD166] font-semibold"
            title={`Se sale de tu piano (${describeRange(piano)}); se puede transponer al abrirla`}
          >
            no cabe
          </span>
        )}

        <a
          href={song.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-xs text-[var(--text-secondary)] hover:text-white no-underline flex items-center gap-1"
          title={`${song.source} · ${song.license}`}
        >
          {song.license.replace('Creative Commons ', 'CC ')}
          <FaExternalLinkAlt className="text-[9px]" />
        </a>

        <Link
          to={`/play/${toCatalogId(song.id)}`}
          className="px-4 py-2 rounded bg-[var(--accent-green)] text-black font-bold no-underline flex items-center gap-2 hover:brightness-110"
        >
          <FaPlay />
          Tocar
        </Link>
      </div>
    </article>
  );
};

export default CatalogBrowser;
