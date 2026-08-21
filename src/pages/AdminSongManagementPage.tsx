import React, { useCallback, useEffect, useState } from 'react';
import Shell from '@/components/layout/Shell';
import SongCard from '@/components/songs/SongCard';
import EmptyState from '@/components/songs/EmptyState';
import {
  deleteSongAsAdmin,
  getAllSongsWithUserInfo,
} from '@/firebase/songService';
import type { Song } from '@/types/models';
import { useT } from '@/i18n';
import { Panel } from '@/ui';
import { confirmAction, notifyError } from '@/ui/dialog';

type AdminSong = Song & { userDisplayName: string };

/** Every published song, with the tools to remove one. Admins only. */
const AdminSongManagementPage: React.FC = () => {
  const { t, tn } = useT();
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      setSongs(await getAllSongsWithUserInfo());
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (song: Song) => {
    const author =
      (song as AdminSong).userDisplayName || t('discover.someone');
    const confirmed = await confirmAction({
      title: t('admin.deleteTitle', { name: song.title, author }),
      text: t('admin.deleteBody'),
      confirmLabel: t('state.delete'),
      cancelLabel: t('state.cancel'),
      destructive: true,
    });
    if (!confirmed || !song.id) return;

    const previous = songs;
    setSongs((current) => current.filter((item) => item.id !== song.id));
    try {
      await deleteSongAsAdmin(song.id);
    } catch (cause) {
      // Put it back rather than leave the list claiming it is gone.
      setSongs(previous);
      await notifyError({
        title: t('admin.deleteFailed'),
        text: cause instanceof Error ? cause.message : undefined,
        confirmLabel: t('state.ok'),
      });
    }
  };

  return (
    <Shell padded={false}>
      <div className="shell pt-10 pb-16">
        <header>
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05]">
            {t('admin.title')}
          </h1>
          <p className="mt-3 text-[15px] text-ink-mid">
            {t('admin.lede')}
            {songs.length > 0 && (
              <span className="numeric text-ink-low">
                {' · '}
                {tn('catalog.results', songs.length)}
              </span>
            )}
          </p>
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
              <span className="text-sm">{t('admin.loadFailed')}</span>
              <button
                type="button"
                onClick={() => void load()}
                className="ml-auto text-[13px] font-semibold text-hand-right hover:underline"
              >
                {t('state.retry')}
              </button>
            </Panel>
          ) : songs.length === 0 ? (
            <EmptyState title={t('admin.empty')} body={t('admin.emptyBody')} />
          ) : (
            <ul className="list-none m-0 p-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {songs.map((song) => (
                <li key={song.id} className="flex">
                  <div className="flex w-full">
                    <SongCard
                      song={song}
                      author={t('discover.by', {
                        name: song.userDisplayName || t('discover.someone'),
                      })}
                      onDelete={handleDelete}
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

export default AdminSongManagementPage;
