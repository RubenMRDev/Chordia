import React, { useRef, useState } from 'react';
import { FaFileUpload, FaSpinner } from 'react-icons/fa';

interface MidiDropzoneProps {
  onFiles: (files: File[]) => void;
  busy?: boolean;
}

const ACCEPTED = ['.mid', '.midi', '.kar'];

function isMidiFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED.some((extension) => name.endsWith(extension)) || file.type === 'audio/midi';
}

/** Zona de arrastrar y soltar (o seleccionar) ficheros MIDI. */
const MidiDropzone: React.FC<MidiDropzoneProps> = ({ onFiles, busy = false }) => {
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
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
      }}
      className={`rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
        dragging
          ? 'border-[var(--accent-green)] bg-[var(--accent-green)]/5'
          : 'border-white/15 hover:border-white/30 bg-[var(--card-background)]'
      }`}
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
      <div className="flex flex-col items-center gap-3">
        {busy ? (
          <FaSpinner className="text-3xl text-[var(--accent-green)] animate-spin" />
        ) : (
          <FaFileUpload className="text-3xl text-[var(--accent-green)]" />
        )}
        <p className="font-semibold text-white">
          {busy ? 'Importando...' : 'Arrastra aqui tus ficheros .mid'}
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          O haz clic para elegirlos. Se guardan en este navegador, no se suben a ningun sitio.
        </p>
      </div>
    </div>
  );
};

export default MidiDropzone;
