import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaClock, FaRandom } from 'react-icons/fa';
import Shell from '@/components/layout/Shell';
import SongCard from '@/components/songs/SongCard';
import EmptyState from '@/components/songs/EmptyState';
import {
  getAllSongsWithAuthors,
  type SongWithAuthor,
} from '@/firebase/songService';
import { useT } from '@/i18n';
import { ButtonLink, Panel, Segmented } from '@/ui';

type SortMethod = 'recent' | 'random';

/** Fisher–Yates, so "random" is actually uniform and not a sort-comparator hack. */
const shuffled = <T,>(items: readonly T[]): T[] => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

/** Everything every user has published. */
const DiscoverPage: React.FC = () => {
  const { t } = useT();
  const [songs, setSongs] = useState<SongWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [sort, setSort] = useState<SortMethod>('recent');
  /**
   * Re-shuffles only when the visitor asks. Shuffling inside the render would
   * reorder the page on every unrelated state change.
   */
  const [shuffleToken, setShuffleToken] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      setSongs(await getAllSongsWithAuthors());
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const ordered = useMemo(() => {
    if (sort === 'random') return shuffled(songs);
    return [...songs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    // `shuffleToken` is what makes "random" re-roll on a repeat click.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs, sort, shuffleToken]);

  return (
    <Shell padded={false}>
      <div className="shell pt-10 pb-16">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05]">
              {t('discover.title')}
            </h1>
            <p className="mt-3 text-[15px] text-ink-mid">
              {t('discover.lede')}
            </p>
          </div>

          <Segmented<SortMethod>
            value={sort}
            onChange={(next) => {
              setSort(next);
              if (next === 'random') setShuffleToken((token) => token + 1);
            }}
            options={[
              {
                value: 'recent',
                label: (
                  <>
                    <FaClock aria-hidden className="text-[11px]" />
                    {t('discover.sortRecent')}
                  </>
                ),
              },
              {
                value: 'random',
                label: (
                  <>
                    <FaRandom aria-hidden className="text-[11px]" />
                    {t('discover.sortRandom')}
                  </>
                ),
              },
            ]}
          />
        </header>

        <div className="mt-10">
          {loading ? (
            <p className="text-sm text-ink-low" role="status">
              {t('state.loading')}
            </p>
          ) : failed ? (
            <Panel className="p-5 flex flex-wrap items-center gap-3">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-[var(--color-felt-ink)]"
              />
              <span className="text-sm">{t('library.loadFailed')}</span>
              <button
                type="button"
                onClick={() => void load()}
                className="ml-auto text-[13px] font-semibold text-hand-right hover:underline"
              >
                {t('state.retry')}
              </button>
            </Panel>
          ) : ordered.length === 0 ? (
            <EmptyState
              title={t('discover.empty')}
              body={t('discover.emptyBody')}
              action={
                <ButtonLink to="/create" tone="right" size="md">
                  {t('songs.newSong')}
                </ButtonLink>
              }
            />
          ) : (
            <ul className="list-none m-0 p-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ordered.map((song) => (
                <li key={song.id} className="flex">
                  <div className="flex w-full">
                    <SongCard
                      song={song}
                      author={t('discover.by', {
                        name: song.authorName ?? t('discover.someone'),
                      })}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Shell>
  );
};

export default DiscoverPage;
