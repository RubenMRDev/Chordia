import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '@/components/layout/Shell';
import PianoRangeSettings from '@/components/piano/PianoRangeSettings';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/firebase/userService';
import { uploadProfilePicture } from '@/firebase/storageService';
import { useT } from '@/i18n';
import { Button, Field, Panel } from '@/ui';
import { AuthNotice } from '@/components/auth/AuthParts';

const AVATAR_FALLBACK =
  'https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp';

const SOCIAL_FIELDS = [
  'instagram',
  'twitter',
  'soundcloud',
  'spotify',
] as const;

type SocialField = (typeof SOCIAL_FIELDS)[number];

const EditProfilePage: React.FC = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { currentUser, userProfile, updateProfileInContext } = useAuth();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    name: userProfile?.displayName || currentUser?.displayName || '',
    bio: userProfile?.bio || '',
    location: userProfile?.location || '',
    website: userProfile?.website || '',
    instagram: userProfile?.socialLinks?.instagram || '',
    twitter: userProfile?.socialLinks?.twitter || '',
    soundcloud: userProfile?.socialLinks?.soundcloud || '',
    spotify: userProfile?.socialLinks?.spotify || '',
  });

  const [photoURL, setPhotoURL] = useState(
    userProfile?.photoURL || currentUser?.photoURL || '',
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  /**
   * The photo is uploaded as soon as it is chosen, and the resulting URL is
   * held in state until the form is saved — so picking a file and then leaving
   * does not silently change the profile.
   */
  const handlePhoto = async (file: File) => {
    setProblem(null);
    setUploading(true);
    try {
      setPhotoURL(await uploadProfilePicture(file));
    } catch (cause) {
      setProblem(
        cause instanceof Error ? cause.message : t('edit.saveFailed'),
      );
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) return;
    setProblem(null);
    setSaving(true);
    try {
      await updateUserProfile(currentUser.uid, {
        displayName: form.name.trim(),
        bio: form.bio,
        location: form.location.trim(),
        website: form.website.trim(),
        photoURL,
        socialLinks: {
          instagram: form.instagram.trim(),
          twitter: form.twitter.trim(),
          soundcloud: form.soundcloud.trim(),
          spotify: form.spotify.trim(),
        },
      });
      await updateProfileInContext();
      navigate('/profile');
    } catch (cause) {
      // Surfaced instead of only reaching the console, which is what the
      // previous version did — the form just stopped with no explanation.
      setProblem(cause instanceof Error ? cause.message : t('edit.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell padded={false}>
      <div className="shell-narrow pt-10 pb-16">
        <header>
          <h1 className="font-display text-[clamp(1.6rem,3.5vw,2.15rem)] font-semibold leading-tight">
            {t('edit.title')}
          </h1>
          <p className="mt-3 text-[15px] text-ink-mid">{t('edit.lede')}</p>
        </header>

        {problem && (
          <div className="mt-7">
            <AuthNotice tone="error" onDismiss={() => setProblem(null)}>
              {problem}
            </AuthNotice>
          </div>
        )}

        <form onSubmit={submit} className="mt-9 flex flex-col gap-6" noValidate>
          <Panel className="p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low">
              {t('edit.photo')}
            </h2>
            <div className="mt-4 flex items-center gap-5">
              <img
                src={photoURL || AVATAR_FALLBACK}
                alt=""
                width={72}
                height={72}
                className="h-18 w-18 shrink-0 rounded-full object-cover border border-[var(--seam)]"
                style={{ height: 72, width: 72 }}
                onError={(event) => {
                  event.currentTarget.src = AVATAR_FALLBACK;
                }}
              />
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handlePhoto(file);
                    event.target.value = '';
                  }}
                />
                <Button
                  tone="quiet"
                  size="md"
                  busy={uploading}
                  busyLabel={t('auth.working')}
                  onClick={() => fileRef.current?.click()}
                >
                  {t('import.browse')}
                </Button>
                <p className="mt-2 text-[12px] text-ink-low">
                  {t('edit.photoHint')}
                </p>
              </div>
            </div>
          </Panel>

          <Panel className="p-5 flex flex-col gap-5">
            <Field
              label={t('edit.name')}
              value={form.name}
              autoComplete="name"
              onChange={(event) => set('name')(event.target.value)}
            />

            <div>
              <label
                htmlFor="bio"
                className="block text-[13px] font-medium text-ink-mid mb-2"
              >
                {t('edit.bio')}
              </label>
              <textarea
                id="bio"
                rows={4}
                value={form.bio}
                onChange={(event) => set('bio')(event.target.value)}
                className="w-full rounded-md bg-ground-1 px-3.5 py-2.5 text-[15px] text-ink border border-[var(--edge)] hover:border-[var(--seam)] focus:border-hand-right focus:outline-none resize-y"
              />
              <p className="mt-2 text-[13px] text-ink-low">
                {t('edit.bioHint')}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={t('edit.location')}
                value={form.location}
                onChange={(event) => set('location')(event.target.value)}
              />
              <Field
                label={t('edit.website')}
                type="url"
                inputMode="url"
                placeholder="https://"
                value={form.website}
                onChange={(event) => set('website')(event.target.value)}
              />
            </div>
          </Panel>

          <Panel className="p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low">
              {t('edit.social')}
            </h2>
            <p className="mt-1.5 text-[13px] text-ink-low">
              {t('edit.socialHint')}
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {SOCIAL_FIELDS.map((key: SocialField) => (
                <Field
                  key={key}
                  label={key[0].toUpperCase() + key.slice(1)}
                  value={form[key]}
                  onChange={(event) => set(key)(event.target.value)}
                />
              ))}
            </div>
          </Panel>

          {/* The keyboard setting lives with the rest of the account settings. */}
          <PianoRangeSettings />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              tone="right"
              size="lg"
              busy={saving}
              busyLabel={t('auth.working')}
            >
              {t('state.save')}
            </Button>
            <Button
              tone="ghost"
              size="lg"
              onClick={() => navigate('/profile')}
            >
              {t('state.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </Shell>
  );
};

export default EditProfilePage;
