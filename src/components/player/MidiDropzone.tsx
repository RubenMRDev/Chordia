import React, { useRef, useState } from 'react';
import { useT } from '@/i18n';
import { Keyboard } from '@/ui';

interface MidiDropzoneProps {
  onFiles: (files: File[]) => void;
  busy?: boolean;
}

const ACCEPTED = ['.mid', '.midi', '.kar'];

const isMidiFile = (file: File): boolean => {
  const name = file.name.toLowerCase();
  return (
    ACCEPTED.some((extension) => name.endsWith(extension)) ||
    file.type === 'audio/midi'
  );
};

/** Drag-and-drop (or pick) MIDI files. */
const MidiDropzone: React.FC<MidiDropzoneProps> = ({
  onFiles,
  busy = false,
}) => {
  const { t } = useT();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files).filter(isMidiFile);
    if (files.length > 0) onFiles(files);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label={t('import.drop')}
      aria-busy={busy || undefined}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      className="press relative overflow-hidden rounded-xl border border-dashed p-8 text-center cursor-pointer"
      style={{
        borderColor: dragging
          ? 'var(--color-hand-right)'
          : 'color-mix(in srgb, var(--color-ivory) 16%, transparent)',
        background: dragging
          ? 'color-mix(in srgb, var(--color-hand-right) 7%, var(--color-ground-2))'
          : 'var(--color-ground-2)',
        transition:
          'border-color var(--t-quick) var(--ease-strike), background var(--t-quick) var(--ease-strike)',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".mid,.midi,.kar,audio/midi"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []).filter(isMidiFile);
          if (files.length > 0) onFiles(files);
          event.target.value = '';
        }}
      />

      {/*
        A keyboard waiting for something to land on it, rather than an upload
        cloud. It lights up while a file is over the zone.
      */}
      <Keyboard
        lowestMidi={60}
        highestMidi={72}
        height={44}
        decorative
        tone="shadow"
        className="mx-auto max-w-[200px] pointer-events-none"
      />

      <p className="mt-5 font-semibold text-ink">
        {busy ? `${t('state.loading')}` : t('import.drop')}
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-low">
        {t('import.browse')} · {t('import.note')}
      </p>

      {/* Progress reads as note light travelling along the top edge. */}
      {busy && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] bg-hand-right sustain"
        />
      )}
    </div>
  );
};

export default MidiDropzone;
