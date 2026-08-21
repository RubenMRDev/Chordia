import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { chordLabel } from '@/features/midi/chordName';
import type { Song } from '@/types/models';
import { useT } from '@/i18n';
import { Panel } from '@/ui';

interface SongCardProps {
  song: Song;
  /** Shown on Discover, where the author is the point. */
  author?: string;
  onDelete?: (song: Song) => void;
}

/** How many chord symbols fit on a card before it stops being scannable. */
const PREVIEW = 8;

/**
 * One saved progression.
 *
 * The card's face is the progression itself — the chord symbols, named from the
 * notes actually stored. It used to be a circle with a music note in it, which
 * is decoration standing where the content should be, and made every song in a
 * library look identical.
 */
const SongCard: React.FC<SongCardProps> = ({ song, author, onDelete }) => {
  const { t, tn } = useT();

  const chords = song.chords ?? [];
  const shown = chords.slice(0, PREVIEW);
  const rest = chords.length - shown.length;

  const created = new Date(song.createdAt);
  const dateLabel = Number.isNaN(created.valueOf())
    ? null
    : created.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

  return (
    <Panel className="group relative flex flex-col overflow-hidden">
      {/* The progression, as the card's face. */}
      <div className="flex flex-wrap gap-1.5 p-4 pb-3.5 bg-ground-1 border-b border-[var(--edge)] min-h-[76px] content-start">
        {shown.length === 0 ? (
          <span className="text-[13px] text-ink-low self-center">
            {t('songs.noChords')}
          </span>
        ) : (
          <>
            {shown.map((chord, index) => (
              <span
                key={`${song.id}-${index}`}
                className="numeric rounded border border-[var(--edge)] bg-ground-3 px-2 py-1 text-[13px] font-semibold text-ink"
              >
                {chordLabel(chord.keys)}
              </span>
            ))}
            {rest > 0 && (
              <span className="numeric self-center px-1 text-[12px] text-ink-low">
                +{rest}
              </span>
            )}
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-snug">
          <Link
            to={`/song/${song.id}`}
            className="text-ink no-underline hover:text-hand-right transition-colors duration-[var(--t-quick)]"
          >
            {song.title}
          </Link>
        </h3>

        {author && (
          <p className="mt-1 text-[13px] text-ink-mid truncate">{author}</p>
        )}

        <p className="numeric mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-ink-low">
          <span>{song.key}</span>
          <span>{song.timeSignature}</span>
          <span>{song.tempo} BPM</span>
          <span>{tn('songs.chordCount', chords.length)}</span>
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          {dateLabel && (
            <span className="numeric text-[12px] text-ink-low">
              {dateLabel}
            </span>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(song)}
              aria-label={`${t('state.delete')} ${song.title}`}
              className="press ml-auto h-8 w-8 grid place-items-center rounded text-ink-low hover:text-[var(--color-felt-ink)] hover:bg-[color-mix(in_srgb,var(--color-felt)_25%,transparent)]"
            >
              <FaTrash aria-hidden className="text-[12px]" />
            </button>
          )}
        </div>
      </div>
    </Panel>
  );
};

export default SongCard;
