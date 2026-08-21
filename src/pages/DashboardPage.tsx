import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Shell from '@/components/layout/Shell';
import SongCard from '@/components/songs/SongCard';
import EmptyState from '@/components/songs/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { getUserSongs } from '@/firebase/songService';
import type { Song } from '@/types/models';
import { useT, type MessageKey } from '@/i18n';
import { ButtonLink, Panel } from '@/ui';

/** How many recent songs the dashboard shows before pointing at the library. */
const RECENT = 4;

/** One of the three things you can go and do from here. */
const QuickAction: React.FC<{
  to: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
}> = ({ to, titleKey, bodyKey }) => {
  const { t } = useT();
  return (
    <Link
      to={to}
      className="press group block rounded-lg border border-[var(--edge)] bg-ground-2 p-5 no-underline hover:border-[var(--seam)] hover:bg-ground-3"
    >
      <span className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="h-1.5 w-6 rounded-full bg-[var(--edge)] transition-colors duration-[var(--t-quick)] group-hover:bg-hand-right"
        />
        <span className="font-semibold text-ink">{t(titleKey)}</span>
      </span>
      <span className="mt-2 block text-[13px] leading-relaxed text-ink-low">
        {t(bodyKey)}
      </span>
    </Link>
  );
};

/**
 * Where you left off and what to do next.
 *
 * It shows *your* songs. It used to call `getAllSongs()` and present everyone's
 * work as the signed-in user's dashboard, which is what Discover is for.
 */
const DashboardPage: React.FC = () => {
  const { t, tn } = useT();
  const { currentUser, userProfile } = useAuth();

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!currentUser) {
      setSongs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setSongs(await getUserSongs(currentUser.uid));
    } catch {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    void load();
  }, [load]);

  const name =
    userProfile?.displayName ||
    currentUser?.displayName ||
    currentUser?.email?.split('@')[0] ||
    '';

  const recent = [...songs]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, RECENT);

  const totalChords = songs.reduce(
    (sum, song) => sum + (song.chords?.length ?? 0),
    0,
  );

  return (
    <Shell padded={false}>
      <div className="shell pt-10 pb-16">
        <header>
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05]">
            {/* Without a name to greet, the heading is just the page's name. */}
            {name ? t('dashboard.title', { name }) : t('nav.dashboard')}
          </h1>
          <p className="mt-3 text-[15px] text-ink-mid">
            {t('dashboard.lede')}
          </p>
        </header>

        {/* Two measured figures, not a wall of tiles. */}
        {!loading && songs.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-x-12 gap-y-5">
            <div>
              <div className="numeric font-display text-[2.5rem] leading-none text-hand-right">
                {songs.length}
              </div>
              <p className="mt-1.5 text-[13px] text-ink-mid">
                {t('dashboard.stat.songs')}
              </p>
            </div>
            <div>
              <div className="numeric font-display text-[2.5rem] leading-none text-ink">
                {totalChords}
              </div>
              <p className="mt-1.5 text-[13px] text-ink-mid">
                {t('dashboard.stat.chords')}
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <QuickAction
            to="/create"
            titleKey="dashboard.quickCreate"
            bodyKey="dashboard.quickCreateBody"
          />
          <QuickAction
            to="/midi"
            titleKey="dashboard.quickPlay"
            bodyKey="dashboard.quickPlayBody"
          />
          <QuickAction
            to="/discover"
            titleKey="dashboard.quickDiscover"
            bodyKey="dashboard.quickDiscoverBody"
          />
        </div>

        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">
              {t('dashboard.recent')}
              {songs.length > 0 && (
                <span className="numeric ml-2 text-[13px] font-normal text-ink-low">
                  {tn('songs.chordCount', totalChords)}
                </span>
              )}
            </h2>
            {songs.length > RECENT && (
              <Link
                to="/library"
                className="text-[13px] font-semibold text-hand-right no-underline hover:underline"
              >
                {t('dashboard.seeAll')}
              </Link>
            )}
          </div>

          <div className="mt-5">
            {loading ? (
              <p className="text-sm text-ink-low" role="status">
                {t('state.loading')}
              </p>
            ) : recent.length === 0 ? (
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
              <ul className="list-none m-0 p-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recent.map((song) => (
                  <li key={song.id} className="flex">
                    <div className="flex w-full">
                      <SongCard song={song} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* The piano setting lives here too: it is per-browser and account-free. */}
        <Panel className="mt-12 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">{t('piano.mine')}</h2>
            <p className="mt-1 text-[13px] text-ink-low">{t('piano.body')}</p>
          </div>
          <ButtonLink to="/profile/edit" tone="quiet" size="md">
            {t('catalog.configure')}
          </ButtonLink>
        </Panel>
      </div>
    </Shell>
  );
};

export default DashboardPage;
