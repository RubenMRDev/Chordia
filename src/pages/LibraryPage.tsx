import React, { useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Shell from '@/components/layout/Shell';
import SongCard from '@/components/songs/SongCard';
import EmptyState from '@/components/songs/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { deleteSongById, getUserSongs } from '@/firebase/songService';
import type { Song } from '@/types/models';
import { useT } from '@/i18n';
import { ButtonLink, Panel } from '@/ui';
import { confirmAction, notifyError } from '@/ui/dialog';

/** Everything this account has saved. */
const LibraryPage: React.FC = () => {
  const { t, tn } = useT();
  const { currentUser } = useAuth();

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    if (!currentUser) {
      setSongs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    try {
      setSongs(await getUserSongs(currentUser.uid));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (song: Song) => {
    const confirmed = await confirmAction({
      title: t('library.deleteTitle', { name: song.title }),
      text: t('library.deleteBody'),
      confirmLabel: t('state.delete'),
      cancelLabel: t('state.cancel'),
      destructive: true,
    });
    if (!confirmed || !song.id) return;

    // Removed from the list straight away; put back if the delete fails, so the
    // page never claims something was deleted when it was not.
    const previous = songs;
    setSongs((current) => current.filter((item) => item.id !== song.id));
    try {
      await deleteSongById(song.id);
    } catch (cause) {
      setSongs(previous);
      await notifyError({
        title: t('library.deleteFailed'),
        text: cause instanceof Error ? cause.message : undefined,
        confirmLabel: t('state.ok'),
      });
    }
  };

  const totalChords = songs.reduce(
    (sum, song) => sum + (song.chords?.length ?? 0),
    0,
  );

  return (
    <Shell padded={false}>
      <div className="shell pt-10 pb-16">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05]">
              {t('library.title')}
            </h1>
            <p className="mt-3 text-[15px] text-ink-mid">
              {t('library.lede')}
              {songs.length > 0 && (
                <span className="numeric text-ink-low">
                  {' · '}
                  {tn('songs.chordCount', totalChords)}
                </span>
              )}
            </p>
          </div>
          <ButtonLink to="/create" tone="right" size="md">
            <FaPlus aria-hidden className="text-[11px]" />
            {t('songs.newSong')}
          </ButtonLink>
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
          ) : songs.length === 0 ? (
            <EmptyState
              title={t('library.empty')}
              body={t('library.emptyBody')}
              action={
                <ButtonLink to="/create" tone="right" size="md">
                  {t('songs.newSong')}
                </ButtonLink>
              }
            />
          ) : (
            <ul className="list-none m-0 p-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {songs.map((song) => (
                <li key={song.id} className="flex">
                  <div className="flex w-full">
                    <SongCard song={song} onDelete={handleDelete} />
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

export default LibraryPage;
