import React from 'react';
import { FaKeyboard } from 'react-icons/fa';
import { midiToNoteName } from '../../features/audio/notes';

interface KeyboardHelpProps {
  mapping: Map<string, number>;
}

/** Chuleta de las teclas del ordenador que hacen de piano. */
const KeyboardHelp: React.FC<KeyboardHelpProps> = ({ mapping }) => {
  const entries = [...mapping.entries()];
  const lower = entries.slice(0, 13);
  const upper = entries.slice(13);

  const renderRow = (row: Array<[string, number]>) => (
    <div className="flex flex-wrap gap-1.5">
      {row.map(([key, midi]) => (
        <span
          key={key}
          className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-[var(--text-secondary)]"
          title={midiToNoteName(midi)}
        >
          <span className="text-white font-semibold uppercase">{key === ',' ? ',' : key}</span>
          <span className="ml-1.5">{midiToNoteName(midi)}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-[var(--card-background)] rounded-lg p-4">
      <h3 className="flex items-center gap-2 font-bold text-white mb-3">
        <FaKeyboard className="text-[var(--accent-green)]" />
        Tocar con el teclado del ordenador
      </h3>
      <div className="flex flex-col gap-2">
        {renderRow(upper)}
        {renderRow(lower)}
      </div>
      <p className="text-xs text-[var(--text-secondary)] mt-3">
        Espacio reproduce o pausa, las flechas se mueven 5 segundos y Shift hace de pedal de
        sustain. Tambien puedes tocar las teclas de la pantalla con el raton.
      </p>
    </div>
  );
};

export default KeyboardHelp;
