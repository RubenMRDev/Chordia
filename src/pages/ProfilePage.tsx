import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaInstagram,
  FaSpotify,
  FaSoundcloud,
  FaTwitter,
} from 'react-icons/fa';
import Shell from '@/components/layout/Shell';
import SongCard from '@/components/songs/SongCard';
import EmptyState from '@/components/songs/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { deleteAllUserSongs, getUserSongs } from '@/firebase/songService';
import type { Song } from '@/types/models';
import { useT } from '@/i18n';
import { Button, ButtonLink, Panel } from '@/ui';
import { confirmAction, notifyError, notifyOk } from '@/ui/dialog';

const AVATAR_FALLBACK =
  'https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp';

/** Each social handle, and how to turn it into a URL. */
const SOCIALS = [
  {
    key: 'instagram',
    Icon: FaInstagram,
    href: (handle: string) => `https://instagram.com/${handle}`,
  },
  {
    key: 'twitter',
    Icon: FaTwitter,
    href: (handle: string) => `https://twitter.com/${handle}`,
  },
  {
    key: 'soundcloud',
    Icon: FaSoundcloud,
    href: (handle: string) => `https://soundcloud.com/${handle}`,
  },
  {
    key: 'spotify',
    Icon: FaSpotify,
    href: (handle: string) => `https://open.spotify.com/artist/${handle}`,
  },
] as const;

const ProfilePage: React.FC = () => {
  const { t, tn } = useT();
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

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

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (cause) {
      await notifyError({
        title: t('profile.signOutFailed'),
        text: cause instanceof Error ? cause.message : undefined,
        confirmLabel: t('state.ok'),
      });
    }
  };

  const handleDeleteAll = async () => {
    if (!currentUser || songs.length === 0) return;
    const confirmed = await confirmAction({
      title: t('profile.dangerConfirmTitle', { count: songs.length }),
      text: t('profile.dangerConfirmBody'),
      confirmLabel: t('state.delete'),
      cancelLabel: t('state.cancel'),
      destructive: true,
    });
    if (!confirmed) return;

    setBusy(true);
    try {
      await deleteAllUserSongs(currentUser.uid);
      setSongs([]);
      await notifyOk({
        title: t('profile.dangerDone'),
        confirmLabel: t('state.ok'),
      });
    } catch (cause) {
      await notifyError({
        title: t('profile.dangerFailed'),
        text: cause instanceof Error ? cause.message : undefined,
        confirmLabel: t('state.ok'),
      });
    } finally {
      setBusy(false);
    }
  };

  const name =
    userProfile?.displayName || currentUser?.displayName || t('profile.title');
  const avatar =
    userProfile?.photoURL || currentUser?.photoURL || AVATAR_FALLBACK;
  const joined = userProfile?.joinDate ? new Date(userProfile.joinDate) : null;
  const links = userProfile?.socialLinks;
  const hasLinks = SOCIALS.some((social) => links?.[social.key]);
  const isAdmin = userProfile?.role === 'admin';

  return (
    <Shell padded={false}>
      <div className="shell pt-10 pb-16">
        {/* Identity, then the two things you can do with the account. */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-5 min-w-0">
            <img
              src={avatar}
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 shrink-0 rounded-full object-cover border border-[var(--seam)]"
              onError={(event) => {
                event.currentTarget.src = AVATAR_FALLBACK;
              }}
            />
            <div className="min-w-0">
              <h1 className="font-display text-[clamp(1.5rem,3.5vw,2.15rem)] font-semibold leading-tight truncate">
                {name}
              </h1>
              <p className="numeric mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-ink-low">
                {userProfile?.email && <span>{userProfile.email}</span>}
                {userProfile?.location && <span>{userProfile.location}</span>}
                {joined && !Number.isNaN(joined.valueOf()) && (
                  <span>
                    {t('profile.joined', {
                      date: joined.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                      }),
                    })}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isAdmin && (
              <ButtonLink to="/admin/songs" tone="quiet" size="md">
                {t('profile.admin')}
              </ButtonLink>
            )}
            <ButtonLink to="/profile/edit" tone="quiet" size="md">
              {t('profile.edit')}
            </ButtonLink>
            <Button tone="ghost" size="md" onClick={() => void handleSignOut()}>
              {t('profile.signOut')}
            </Button>
          </div>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-10 items-start">
          <div className="flex flex-col gap-6">
            <Panel className="p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low">
                {t('profile.about')}
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-mid whitespace-pre-line">
                {userProfile?.bio || (
                  <span className="text-ink-low">{t('profile.noBio')}</span>
                )}
              </p>
              {userProfile?.website && (
                <a
                  href={userProfile.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-block text-[13px] text-hand-right no-underline hover:underline break-all"
                >
                  {userProfile.website}
                </a>
              )}
            </Panel>

            {hasLinks && (
              <Panel className="p-5">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low">
                  {t('profile.links')}
                </h2>
                <ul className="mt-3.5 flex flex-wrap gap-2 list-none m-0 p-0">
                  {SOCIALS.map(({ key, Icon, href }) => {
                    const handle = links?.[key];
                    if (!handle) return null;
                    return (
                      <li key={key}>
                        <a
                          href={href(handle)}
                          target="_blank"
                          rel="noreferrer noopener"
                          title={handle}
                          aria-label={`${key}: ${handle}`}
                          className="press grid h-10 w-10 place-items-center rounded-md border border-[var(--edge)] bg-ground-3 text-ink-mid no-underline hover:text-ink hover:border-[var(--seam)]"
                        >
                          <Icon aria-hidden />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </Panel>
            )}

            {songs.length > 0 && (
              <Panel className="p-5">
                <h2 className="font-semibold text-[var(--color-felt-ink)]">
                  {t('profile.dangerTitle')}
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-low">
                  {t('profile.dangerBody')}
                </p>
                <Button
                  tone="felt"
                  size="md"
                  className="mt-4"
                  busy={busy}
                  busyLabel={t('auth.working')}
                  onClick={() => void handleDeleteAll()}
                >
                  {t('state.delete')}
                </Button>
              </Panel>
            )}
          </div>

          <section>
            <h2 className="font-display text-lg font-semibold">
              {t('dashboard.yourSongs')}
              {songs.length > 0 && (
                <span className="numeric ml-2 text-[13px] font-normal text-ink-low">
                  {tn('catalog.results', songs.length)}
                </span>
              )}
            </h2>

            <div className="mt-5">
              {loading ? (
                <p className="text-sm text-ink-low" role="status">
                  {t('state.loading')}
                </p>
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
                <ul className="list-none m-0 p-0 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {songs.map((song) => (
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
        </div>
      </div>
    </Shell>
  );
};

export default ProfilePage;
