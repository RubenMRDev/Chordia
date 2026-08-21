import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaRegClock, FaSave, FaTrash } from 'react-icons/fa';
import Shell from '@/components/layout/Shell';
import MidiDropzone from '@/components/player/MidiDropzone';
import CatalogBrowser from '@/components/player/CatalogBrowser';
import PianoRangeSettings from '@/components/piano/PianoRangeSettings';
import { usePianoSettings } from '@/hooks/usePianoSettings';
import { describeRange, keyCount } from '@/features/piano/pianoSettings';
import { formatTime } from '@/features/player/format';
import {
  deleteMidiSong,
  getMidiData,
  importMidiFile,
  listMidiSongs,
  type MidiLibraryEntry,
} from '@/features/midi/library';
import { parseMidiBuffer } from '@/features/midi/parseMidi';
import { estimateKey, midiToChords } from '@/features/midi/midiToChords';
import { createSong } from '@/firebase/songService';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/i18n';
import { Button, ButtonLink, Panel, Segmented } from '@/ui';
import {
  confirmAction,
  confirmNext,
  notifyError,
  notifyInfo,
} from '@/ui/dialog';

type Tab = 'catalog' | 'mine';

/**
 * Pieces to play: the bundled catalogue, and the `.mid` files this browser has
 * imported. Importing, playing, deleting, and turning a MIDI file into a
 * Chordia song of chords.
 */
const MidiLibraryPage: React.FC = () => {
  const { t } = useT();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { settings: piano } = usePianoSettings();

  const [tab, setTab] = useState<Tab>('catalog');
  const [showPiano, setShowPiano] = useState(false);
  const [entries, setEntries] = useState<MidiLibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setEntries(await listMidiSongs());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleFiles = async (files: File[]) => {
    setImporting(true);
    const failed: string[] = [];
    let lastId: string | null = null;

    for (const file of files) {
      try {
        const entry = await importMidiFile(file);
        lastId = entry.id;
      } catch (cause) {
        failed.push(
          `${file.name}: ${cause instanceof Error ? cause.message : t('state.error')}`,
        );
      }
    }

    setImporting(false);
    await refresh();

    if (failed.length > 0) {
      await notifyError({
        title: t('import.failedTitle'),
        html: failed.map((line) => `<div>${line}</div>`).join(''),
        confirmLabel: t('state.ok'),
      });
      return;
    }

    // One file is an unambiguous intent: open it.
    if (files.length === 1 && lastId) navigate(`/play/${lastId}`);
  };

  const handleDelete = async (entry: MidiLibraryEntry) => {
    const confirmed = await confirmAction({
      title: t('import.deleteTitle', { name: entry.name }),
      text: t('import.deleteBody'),
      confirmLabel: t('state.delete'),
      cancelLabel: t('state.cancel'),
      destructive: true,
    });
    if (!confirmed) return;

    try {
      await deleteMidiSong(entry.id);
      await refresh();
    } catch (cause) {
      await notifyError({
        title: t('import.deleteFailed'),
        text: cause instanceof Error ? cause.message : undefined,
        confirmLabel: t('state.ok'),
      });
    }
  };

  /** Turns the MIDI file into a chord progression and saves it to Firestore. */
  const handleSaveAsSong = async (entry: MidiLibraryEntry) => {
    if (!currentUser) {
      await notifyInfo({
        title: t('player.saveNeedsAccount'),
        text: t('player.saveNeedsAccountBody'),
        confirmLabel: t('state.ok'),
      });
      return;
    }

    setSavingId(entry.id);
    try {
      const data = await getMidiData(entry.id);
      if (!data) throw new Error(t('player.notFound'));
      const parsed = parseMidiBuffer(data, entry.fileName);
      const chords = midiToChords(parsed);
      if (chords.length === 0) throw new Error(t('player.saveFailed'));

      const songId = await createSong({
        userId: currentUser.uid,
        title: parsed.name || entry.name,
        tempo: parsed.bpm,
        key: estimateKey(parsed),
        timeSignature: `${parsed.timeSignature[0]}/${parsed.timeSignature[1]}`,
        chords,
        createdAt: new Date().toISOString(),
      });

      const view = await confirmNext({
        title: t('player.savedTitle'),
        text: t('player.savedBody', { count: chords.length, name: entry.name }),
        confirmLabel: t('player.savedView'),
        cancelLabel: t('player.savedStay'),
      });
      if (view) navigate(`/song/${songId}`);
    } catch (cause) {
      await notifyError({
        title: t('player.saveFailed'),
        text: cause instanceof Error ? cause.message : undefined,
        confirmLabel: t('state.ok'),
      });
    } finally {
      setSavingId(null);
    }
  };

  // The bundled demo is always present, so "mine" counts everything past it.
  const importedCount = Math.max(0, entries.length - 1);

  return (
    <Shell padded={false}>
      <div className="shell pt-10 pb-16 flex flex-col gap-8">
        <header>
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05]">
            {t('catalog.pageTitle')}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-mid prose-measure">
            {t('catalog.pageLede')}
          </p>
          <p className="numeric mt-4 text-[13px] text-ink-low">
            {t('catalog.yourPiano', {
              keys: keyCount(piano),
              range: describeRange(piano),
            })}
            {' · '}
            <button
              type="button"
              onClick={() => setShowPiano((value) => !value)}
              aria-expanded={showPiano}
              className="font-semibold text-hand-right hover:underline"
            >
              {showPiano ? t('catalog.hide') : t('catalog.configure')}
            </button>
          </p>
        </header>

        {/* The same setting as in the profile. It lives here too because it
            works without an account: it is kept in the browser. */}
        {showPiano && <PianoRangeSettings />}

        <Segmented<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: 'catalog', label: t('catalog.title') },
            {
              value: 'mine',
              label: importedCount
                ? `${t('import.mine')} (${importedCount})`
                : t('import.mine'),
            },
          ]}
        />

        {tab === 'catalog' && <CatalogBrowser piano={piano} />}

        {/*
          Kept mounted but hidden, so switching tabs does not re-read IndexedDB
          and lose the dropzone's state.
        */}
        <section className={tab === 'mine' ? 'flex flex-col gap-4' : 'hidden'}>
          <MidiDropzone onFiles={handleFiles} busy={importing} />

          <h2 className="font-display text-lg font-semibold mt-2">
            {t('import.yourFiles')}
          </h2>

          {loading ? (
            <p className="text-sm text-ink-low">{t('state.loading')}</p>
          ) : (
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <Panel className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate flex items-center gap-2">
                        {entry.name}
                        {entry.builtIn && (
                          <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[color-mix(in_srgb,var(--color-hand-right)_16%,transparent)] text-hand-right">
                            {t('import.builtIn')}
                          </span>
                        )}
                      </h3>
                      <p className="numeric mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink-low">
                        {entry.duration > 0 && (
                          <span className="flex items-center gap-1.5">
                            <FaRegClock aria-hidden />
                            {formatTime(entry.duration)}
                          </span>
                        )}
                        {entry.noteCount > 0 && (
                          <span>
                            {t('import.notes', { count: entry.noteCount })}
                          </span>
                        )}
                        <span>{entry.bpm} BPM</span>
                        {!entry.builtIn && (
                          <span>{Math.round(entry.size / 1024)} KB</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <ButtonLink
                        to={`/play/${entry.id}`}
                        tone="right"
                        size="md"
                      >
                        <FaPlay aria-hidden className="text-[12px]" />
                        {t('catalog.play')}
                      </ButtonLink>
                      <Button
                        tone="quiet"
                        size="md"
                        title={t('player.saveHint')}
                        busy={savingId === entry.id}
                        busyLabel={t('player.saving')}
                        onClick={() => void handleSaveAsSong(entry)}
                      >
                        <FaSave aria-hidden className="text-[12px]" />
                        {t('player.saveAsSong')}
                      </Button>
                      {!entry.builtIn && (
                        <Button
                          tone="ghost"
                          size="md"
                          aria-label={`${t('state.delete')} ${entry.name}`}
                          onClick={() => void handleDelete(entry)}
                          className="!text-[var(--color-felt-ink)] hover:!bg-[color-mix(in_srgb,var(--color-felt)_25%,transparent)]"
                        >
                          <FaTrash aria-hidden className="text-[12px]" />
                        </Button>
                      )}
                    </div>
                  </Panel>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Panel className="p-5 flex items-start gap-4">
          {/* The keyboard silhouette instead of a generic keyboard icon. */}
          <div aria-hidden className="mt-1 shrink-0 w-14 rule-keys h-px" />
          <div>
            <h2 className="font-semibold">{t('midi.withKeyboardTitle')}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-mid prose-measure">
              {t('midi.withKeyboardBody')}
            </p>
          </div>
        </Panel>
      </div>
    </Shell>
  );
};

export default MidiLibraryPage;
