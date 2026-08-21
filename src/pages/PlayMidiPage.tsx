import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaSyncAlt } from 'react-icons/fa';
import Shell from '@/components/layout/Shell';
import PlayerStage from '@/components/player/PlayerStage';
import PlayerControls from '@/components/player/PlayerControls';
import ScrubBar from '@/components/player/ScrubBar';
import KeyboardHelp from '@/components/player/KeyboardHelp';
import { usePlayer } from '@/hooks/usePlayer';
import { useComputerKeyboard } from '@/hooks/useComputerKeyboard';
import { useMidiKeyboard } from '@/hooks/useMidiKeyboard';
import { usePiano } from '@/hooks/usePiano';
import { usePianoSettings } from '@/hooks/usePianoSettings';
import {
  describeRange,
  fitsInPiano,
  keyCount,
  suggestTranspose,
} from '@/features/piano/pianoSettings';
import pianoService from '@/services/pianoService';
import {
  getMidiData,
  getMidiEntry,
  type MidiLibraryEntry,
} from '@/features/midi/library';
import { parseMidiBuffer } from '@/features/midi/parseMidi';
import type { ParsedSong } from '@/features/midi/types';
import { useT } from '@/i18n';
import { Button, ButtonLink, Panel } from '@/ui';

/** One measured readout in the header row. */
const Readout: React.FC<{
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}> = ({ label, value, accent = false }) => (
  <div className="text-right">
    <div className="text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-low">
      {label}
    </div>
    <div
      className={`numeric font-display text-[22px] leading-tight ${
        accent ? 'text-hand-right' : 'text-ink'
      }`}
    >
      {value}
    </div>
  </div>
);

/**
 * The play screen: notes falling onto the keyboard, with Chordia's piano and
 * support for a MIDI keyboard, the computer keyboard and the mouse.
 */
const PlayMidiPage: React.FC = () => {
  const { t } = useT();
  const { midiId } = useParams<{ midiId: string }>();
  const { player, snapshot } = usePlayer();
  const { loadProgress, isSampled, isLoading } = usePiano();
  const { settings: piano } = usePianoSettings();

  const [song, setSong] = useState<ParsedSong | null>(null);
  const [entry, setEntry] = useState<MidiLibraryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNoteNames, setShowNoteNames] = useState(true);
  const [volume, setVolume] = useState(() => pianoService.getVolume());

  // The piano starts downloading as soon as this screen opens.
  useEffect(() => {
    void pianoService.initialize();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!midiId) return;
      setLoading(true);
      setError(null);
      try {
        const [data, meta] = await Promise.all([
          getMidiData(midiId),
          getMidiEntry(midiId),
        ]);
        if (!data) throw new Error(t('player.gone'));
        const parsed = parseMidiBuffer(data, meta?.fileName ?? 'song.mid');
        if (cancelled) return;

        setSong(parsed);
        setEntry(meta);
        player.setSong(parsed);

        // By default the visitor plays the right hand and the app accompanies
        // with the left; a one-handed piece is played with that hand.
        const hasLeft = parsed.notes.some((note) => note.hand === 'left');
        const hasRight = parsed.notes.some((note) => note.hand === 'right');
        const shift = suggestTranspose(
          piano,
          parsed.lowestMidi,
          parsed.highestMidi,
        );
        player.updateSettings({
          userHands: { left: !hasRight, right: hasRight },
          playbackHands: { left: hasLeft, right: hasRight },
          // A piece that will not fit gets shifted by octaves when the visitor
          // has asked for that.
          transpose: piano.autoTranspose ? shift : 0,
        });
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error ? caught.message : t('player.cannotOpen'),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
    // `piano` is only read for the initial fit: there is no need to reload the
    // song because the range changed in another tab.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiId, player]);

  const handleToggle = useCallback(() => player.toggle(), [player]);
  const handleSeekBy = useCallback(
    (delta: number) => player.seek(player.getTime() + delta),
    [player],
  );

  const keyMapping = useComputerKeyboard(player, {
    onToggle: handleToggle,
    onSeek: handleSeekBy,
  });
  const midiKeyboard = useMidiKeyboard(player);

  const handleVolumeChange = (next: number) => {
    setVolume(next);
    pianoService.setVolume(next);
  };

  const { stats, status } = snapshot;
  const scored = stats.hits + stats.wrong;

  const transpose = snapshot.settings.transpose;
  const suggested = song
    ? suggestTranspose(piano, song.lowestMidi, song.highestMidi)
    : 0;
  const fitsNow = song
    ? fitsInPiano(
        piano,
        song.lowestMidi + transpose,
        song.highestMidi + transpose,
      )
    : true;
  const keyboardRange: [number, number] = [piano.lowestMidi, piano.highestMidi];

  /*
    One floating notice over the canvas, so the view never shifts when a
    message appears or goes away.
  */
  const pianoLabel = t('player.yourPianoOf', {
    keys: keyCount(piano),
    range: describeRange(piano),
  });
  const octaves = transpose / 12;
  const shifted = t('player.transposedBy', {
    sign: octaves > 0 ? '+' : '',
    octaves,
  });

  let notice: string | null = null;
  if (transpose === 0 && !fitsNow) {
    // The button is only mentioned when shifting octaves would actually help.
    notice = suggested
      ? t('player.noticeTooWideFixable', {
          piano: pianoLabel,
          action: t('player.fitToPiano'),
        })
      : t('player.noticeTooWide', { piano: pianoLabel });
  } else if (transpose !== 0 && fitsNow) {
    notice = t('player.noticeFits', { shifted, piano: pianoLabel });
  } else if (transpose !== 0) {
    notice = t('player.noticeStillWide', { shifted, piano: pianoLabel });
  }
  if (isLoading && !isSampled) {
    notice = t('player.samplesLoading', {
      percent: Math.round(loadProgress * 100),
    });
  } else if (status === 'finished') {
    notice =
      scored > 0
        ? t('player.finishedScored', {
            hits: stats.hits,
            wrong: stats.wrong,
            best: stats.bestStreak,
          })
        : t('player.finishedPlain');
  }

  return (
    <Shell padded={false} bare>
      <div className="shell pt-6 pb-14 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/midi"
              aria-label={t('player.backToCatalog')}
              className="press h-10 w-10 shrink-0 grid place-items-center rounded-full bg-ground-3 border border-[var(--edge)] text-ink no-underline hover:bg-ground-4"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 3.5L4.5 7.5l4 4M4.5 7.5H12" />
              </svg>
            </Link>
            <div className="min-w-0">
              <h1 className="font-display text-[clamp(1.25rem,2.5vw,1.6rem)] font-semibold truncate">
                {entry?.name ?? song?.name ?? t('player.loading')}
              </h1>
              {song && (
                <p className="numeric mt-1 text-[13px] text-ink-low">
                  {song.bpm} BPM
                  {' · '}
                  {song.timeSignature[0]}/{song.timeSignature[1]}
                  {' · '}
                  {t('player.bars', {
                    current: snapshot.measure,
                    total: song.measures.length,
                  })}
                  {' · '}
                  {t('player.notes', { count: song.notes.length })}
                  {' · '}
                  <Link
                    to="/profile/edit"
                    title={t('player.pianoKeysTitle')}
                    className="text-hand-right no-underline hover:underline"
                  >
                    {t('player.pianoKeys', { keys: keyCount(piano) })}
                  </Link>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Readout
              label={t('player.accuracy')}
              accent
              value={
                scored === 0 ? '—' : `${Math.round(stats.accuracy * 100)}%`
              }
            />
            <Readout label={t('player.streak')} value={stats.streak} />
            <Readout label={t('player.best')} value={stats.bestStreak} />
          </div>
        </div>

        {error && (
          <Panel className="px-4 py-3 flex flex-wrap items-center gap-3">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-[var(--color-felt-ink)]"
            />
            <span className="text-sm text-ink">{error}</span>
            <ButtonLink
              to="/midi"
              tone="quiet"
              size="sm"
              className="ml-auto"
            >
              {t('player.openLibrary')}
            </ButtonLink>
          </Panel>
        )}

        <PlayerStage
          player={player}
          song={song}
          status={status}
          time={snapshot.time}
          duration={snapshot.duration}
          showNoteNames={showNoteNames}
          keyboardRange={keyboardRange}
          loading={loading}
          notice={notice}
        />

        <ScrubBar
          time={snapshot.time}
          duration={snapshot.duration}
          onSeek={(time) => player.seek(time)}
        />

        <PlayerControls
          player={player}
          snapshot={snapshot}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          showNoteNames={showNoteNames}
          onToggleNoteNames={() => setShowNoteNames((value) => !value)}
          suggestedTranspose={suggested}
        />

        <div className="grid gap-4 md:grid-cols-2 items-start">
          <Panel className="p-4">
            <h2 className="flex items-center gap-2.5 font-semibold">
              {/* A live device gets a pulsing note-light, not a USB icon. */}
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${
                  midiKeyboard.connected
                    ? 'bg-hand-right sustain'
                    : 'bg-[var(--edge)]'
                }`}
              />
              {t('midi.title')}
            </h2>
            {!midiKeyboard.supported ? (
              <p className="mt-2 text-[13px] leading-relaxed text-ink-mid">
                {t('midi.unsupported')}
              </p>
            ) : midiKeyboard.connected ? (
              <p className="mt-2 text-[13px] leading-relaxed text-ink-mid">
                {t('midi.connectedTo', {
                  names: midiKeyboard.deviceNames.join(', '),
                })}
              </p>
            ) : (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-[13px] leading-relaxed text-ink-mid">
                  {midiKeyboard.error ?? t('midi.notDetected')}
                </p>
                <Button
                  tone="quiet"
                  size="sm"
                  onClick={midiKeyboard.reconnect}
                >
                  <FaSyncAlt aria-hidden className="text-[11px]" />
                  {t('midi.search')}
                </Button>
              </div>
            )}
          </Panel>

          <KeyboardHelp mapping={keyMapping} />
        </div>
      </div>
    </Shell>
  );
};

export default PlayMidiPage;
