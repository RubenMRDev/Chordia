import React, { useEffect, useMemo, useState } from 'react';
import { FaExternalLinkAlt, FaPlay, FaSearch } from 'react-icons/fa';
import {
  EMPTY_FILTERS,
  catalogStyles,
  filterCatalog,
  loadCatalog,
  toCatalogId,
  type Catalog,
  type CatalogFilters,
  type CatalogSong,
} from '@/features/midi/catalog';
import { formatTime } from '@/features/player/format';
import {
  describeRange,
  fitsInPiano,
  type PianoSettings,
} from '@/features/piano/pianoSettings';
import { midiToNoteName } from '@/features/audio/notes';
import { useT, type MessageKey, type Translate } from '@/i18n';
import { Button, ButtonLink, Panel } from '@/ui';

interface CatalogBrowserProps {
  piano: PianoSettings;
}

const PAGE_SIZE = 60;

const LEVELS = [1, 2, 3, 4, 5] as const;

const difficultyLabel = (t: Translate, level: number): string =>
  t(`catalog.diff${level}` as MessageKey);

/**
 * Difficulty, drawn as five keys rather than five stars.
 *
 * Stars read as a rating someone gave the piece; these are a level on a scale,
 * and the keyboard is the product's own unit of measure.
 */
const Difficulty: React.FC<{ level: number; label: string }> = ({
  level,
  label,
}) => (
  <span
    className="inline-flex items-end gap-[2px] h-3.5"
    title={label}
    aria-label={label}
  >
    {LEVELS.map((step) => (
      <span
        key={step}
        aria-hidden
        className="w-[3px] rounded-[1px]"
        style={{
          height: `${45 + step * 11}%`,
          background:
            step <= level
              ? 'var(--color-hand-right)'
              : 'color-mix(in srgb, var(--color-ivory) 12%, transparent)',
        }}
      />
    ))}
  </span>
);

const SELECT =
  'h-9 rounded-md bg-ground-1 border border-[var(--edge)] px-2.5 text-[13px] text-ink ' +
  'hover:border-[var(--seam)] focus:border-hand-right focus:outline-none';

const CHECKBOX =
  'h-4 w-4 shrink-0 rounded-[3px] border border-[var(--seam)] bg-ground-1';

/**
 * The catalogue that ships with the app: search, filters by composer, style and
 * difficulty, and a warning when a piece runs past the visitor's own keyboard.
 */
const CatalogBrowser: React.FC<CatalogBrowserProps> = ({ piano }) => {
  const { t, tn } = useT();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [failed, setFailed] = useState(false);
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    loadCatalog()
      .then(setCatalog)
      .catch(() => setFailed(true));
  }, []);

  const styles = useMemo(
    () => (catalog ? catalogStyles(catalog.songs) : []),
    [catalog],
  );

  const results = useMemo(
    () => (catalog ? filterCatalog(catalog.songs, filters) : []),
    [catalog, filters],
  );

  const patch = (next: Partial<CatalogFilters>) => {
    setFilters((previous) => ({ ...previous, ...next }));
    setVisible(PAGE_SIZE);
  };

  const filtered =
    Boolean(filters.search) ||
    Boolean(filters.composer) ||
    Boolean(filters.style) ||
    filters.difficulty !== null ||
    filters.soloOnly ||
    Boolean(filters.range);

  if (failed) {
    return (
      <Panel className="p-4 flex items-center gap-3">
        <span
          aria-hidden
          className="h-2 w-2 rounded-full bg-[var(--color-felt-ink)]"
        />
        <span className="text-sm text-ink">{t('catalog.error')}</span>
      </Panel>
    );
  }

  if (!catalog) {
    return (
      <p className="text-sm text-ink-low" role="status">
        {t('catalog.loading')}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Panel as="section" className="p-4 flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <FaSearch
              aria-hidden
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-ink-low pointer-events-none"
            />
            <input
              type="search"
              value={filters.search}
              onChange={(event) => patch({ search: event.target.value })}
              placeholder={t('catalog.search')}
              aria-label={t('catalog.search')}
              className="w-full h-9 rounded-md bg-ground-1 border border-[var(--edge)] pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-low hover:border-[var(--seam)] focus:border-hand-right focus:outline-none"
            />
          </div>

          <select
            value={filters.composer}
            onChange={(event) => patch({ composer: event.target.value })}
            className={SELECT}
            aria-label={t('catalog.composer')}
          >
            <option value="">{t('catalog.allComposers')}</option>
            {catalog.composers.map((composer) => (
              <option key={composer} value={composer}>
                {composer}
              </option>
            ))}
          </select>

          <select
            value={filters.style}
            onChange={(event) => patch({ style: event.target.value })}
            className={SELECT}
            aria-label={t('catalog.style')}
          >
            <option value="">{t('catalog.allStyles')}</option>
            {styles.map((style) => (
              <option key={style} value={style}>
                {t(`style.${style}` as MessageKey)}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(event) =>
              patch({ sort: event.target.value as CatalogFilters['sort'] })
            }
            className={SELECT}
            aria-label={t('catalog.sortLabel')}
          >
            <option value="composer">{t('catalog.sortComposer')}</option>
            <option value="title">{t('catalog.sortTitle')}</option>
            <option value="difficulty">{t('catalog.sortDifficulty')}</option>
            <option value="duration">{t('catalog.sortDuration')}</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low">
            {t('catalog.level')}
          </span>
          <div className="inline-flex gap-1 rounded-lg bg-ground-1 p-1 border border-[var(--edge)]">
            {LEVELS.map((level) => {
              const active = filters.difficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    patch({ difficulty: active ? null : level })
                  }
                  title={difficultyLabel(t, level)}
                  className={`press numeric h-7 w-7 rounded-[5px] text-[13px] font-semibold ${
                    active
                      ? 'bg-hand-right text-hand-right-ink'
                      : 'text-ink-mid hover:text-ink hover:bg-ground-3'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 text-[13px] text-ink-mid cursor-pointer select-none ml-1">
            <input
              type="checkbox"
              checked={filters.soloOnly}
              onChange={(event) => patch({ soloOnly: event.target.checked })}
              className={CHECKBOX}
            />
            {t('catalog.soloPiano')}
          </label>

          <label
            className="flex items-center gap-2 text-[13px] text-ink-mid cursor-pointer select-none"
            title={t('catalog.yourPiano', {
              keys: '',
              range: describeRange(piano),
            })}
          >
            <input
              type="checkbox"
              checked={filters.range !== null}
              onChange={(event) =>
                patch({
                  range: event.target.checked
                    ? {
                        lowestMidi: piano.lowestMidi,
                        highestMidi: piano.highestMidi,
                      }
                    : null,
                })
              }
              className={CHECKBOX}
            />
            {t('catalog.fitsOnly')}
          </label>

          {filtered && (
            <Button
              tone="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setVisible(PAGE_SIZE);
              }}
            >
              {t('catalog.clear')}
            </Button>
          )}
        </div>
      </Panel>

      <p className="numeric text-[13px] text-ink-low" aria-live="polite">
        {t('catalog.resultsOf', {
          shown: results.length,
          total: catalog.count,
        })}
        {' · '}
        {tn('catalog.composers', catalog.composers.length)}
        {' · '}
        {t('catalog.licenceNote')}
      </p>

      {results.length === 0 ? (
        <Panel className="p-8 text-center">
          <p className="font-semibold">{t('catalog.empty')}</p>
          <p className="mt-1.5 text-[13px] text-ink-low">
            {t('catalog.emptyBody')}
          </p>
          {filtered && (
            <Button
              tone="quiet"
              size="md"
              className="mt-5"
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setVisible(PAGE_SIZE);
              }}
            >
              {t('catalog.clear')}
            </Button>
          )}
        </Panel>
      ) : (
        <ul className="list-none m-0 p-0 flex flex-col gap-2">
          {results.slice(0, visible).map((song) => (
            <li key={song.id}>
              <CatalogRow song={song} piano={piano} />
            </li>
          ))}
        </ul>
      )}

      {visible < results.length && (
        <Button
          tone="quiet"
          size="md"
          className="self-center"
          onClick={() => setVisible((value) => value + PAGE_SIZE)}
        >
          {t('catalog.showMore', { count: results.length - visible })}
        </Button>
      )}
    </div>
  );
};

const CatalogRow: React.FC<{ song: CatalogSong; piano: PianoSettings }> = ({
  song,
  piano,
}) => {
  const { t } = useT();
  const fits = fitsInPiano(piano, song.lowestMidi, song.highestMidi);

  return (
    <Panel className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">
          {song.title}
          {!song.soloPiano && (
            <span className="ml-2 text-[12px] font-normal text-ink-low">
              ({song.instrument})
            </span>
          )}
        </h3>
        <p className="numeric mt-0.5 text-[13px] text-ink-low truncate">
          {song.composer}
          {song.style ? ` · ${t(`style.${song.style}` as MessageKey)}` : ''}
          {' · '}
          {formatTime(song.duration)}
          {' · '}
          {t('catalog.notes', { count: song.noteCount })}
          {' · '}
          {midiToNoteName(song.lowestMidi)}–{midiToNoteName(song.highestMidi)}
        </p>
      </div>

      <div className="flex items-center gap-3.5 shrink-0">
        <Difficulty
          level={song.difficulty}
          label={`${t('catalog.difficulty')}: ${difficultyLabel(t, song.difficulty)}`}
        />

        {/* Out of range wears the amber the player uses for "you must act". */}
        {!fits && (
          <span
            className="text-[12px] font-semibold text-wait"
            title={t('catalog.doesNotFitTitle', {
              range: describeRange(piano),
            })}
          >
            {t('catalog.doesNotFit')}
          </span>
        )}

        <a
          href={song.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-1 text-[12px] text-ink-low no-underline hover:text-ink-mid"
          title={`${song.source} · ${song.license}`}
        >
          {song.license.replace('Creative Commons ', 'CC ')}
          <FaExternalLinkAlt aria-hidden className="text-[8px]" />
        </a>

        <ButtonLink to={`/play/${toCatalogId(song.id)}`} tone="right" size="md">
          <FaPlay aria-hidden className="text-[11px]" />
          {t('catalog.play')}
        </ButtonLink>
      </div>
    </Panel>
  );
};

export default CatalogBrowser;
