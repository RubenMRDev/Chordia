import React from 'react';
import { FaKeyboard, FaCheck } from 'react-icons/fa';
import { usePianoSettings } from '../../hooks/usePianoSettings';
import {
  PIANO_PRESETS,
  describeRange,
  keyCount,
  type PianoPresetId,
} from '../../features/piano/pianoSettings';
import {
  HIGHEST_PIANO_MIDI,
  LOWEST_PIANO_MIDI,
  isBlackKey,
  midiToNoteName,
} from '../../features/audio/notes';

const ALL_KEYS = Array.from(
  { length: HIGHEST_PIANO_MIDI - LOWEST_PIANO_MIDI + 1 },
  (_, index) => LOWEST_PIANO_MIDI + index,
);

/** Dibujo del teclado completo con el rango elegido resaltado. */
const RangePreview: React.FC<{ lowestMidi: number; highestMidi: number }> = ({
  lowestMidi,
  highestMidi,
}) => (
  <div className="flex h-14 w-full gap-[1px] rounded overflow-hidden bg-black/40 p-1">
    {ALL_KEYS.filter((midi) => !isBlackKey(midi)).map((midi) => {
      const inside = midi >= lowestMidi && midi <= highestMidi;
      // La tecla negra siguiente pertenece al rango si ambas vecinas lo estan.
      return (
        <div
          key={midi}
          className={`flex-1 rounded-b-sm ${inside ? 'bg-[var(--accent-green)]' : 'bg-white/15'}`}
          title={midiToNoteName(midi)}
        />
      );
    })}
  </div>
);

/**
 * Configuracion del piano del usuario (numero de teclas y rango). Se guarda al
 * instante en el navegador y, con sesion abierta, tambien en el perfil.
 */
const PianoRangeSettings: React.FC = () => {
  const { settings, update, saving, error } = usePianoSettings();

  const handlePreset = (preset: PianoPresetId) => {
    if (preset === 'custom') {
      update({ preset: 'custom', lowestMidi: settings.lowestMidi, highestMidi: settings.highestMidi });
    } else {
      update({ preset });
    }
  };

  return (
    <div className="bg-[var(--card-background)] rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="flex items-center gap-2 font-bold text-lg">
          <FaKeyboard className="text-[var(--accent-green)]" />
          Mi piano
        </h3>
        <span className="text-sm text-[var(--text-secondary)]">
          {keyCount(settings)} teclas · {describeRange(settings)}
          {saving && ' · guardando...'}
          {!saving && !error && (
            <FaCheck className="inline ml-2 text-[var(--accent-green)]" title="Guardado" />
          )}
        </span>
      </div>

      <p className="text-sm text-[var(--text-secondary)]">
        Elige las teclas que tiene tu teclado y el modo MIDI dibujara exactamente ese piano, en vez
        de adaptarse a cada cancion.
      </p>

      <div className="flex flex-wrap gap-2">
        {PIANO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handlePreset(preset.id)}
            className={`px-3 py-2 rounded text-sm font-semibold ${
              settings.preset === preset.id
                ? 'bg-[var(--accent-green)] text-black'
                : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handlePreset('custom')}
          className={`px-3 py-2 rounded text-sm font-semibold ${
            settings.preset === 'custom'
              ? 'bg-[var(--accent-green)] text-black'
              : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
          }`}
        >
          Rango personalizado
        </button>
      </div>

      {settings.preset === 'custom' && (
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
            Nota mas grave
            <select
              value={settings.lowestMidi}
              onChange={(event) => update({ lowestMidi: Number(event.target.value) })}
              className="bg-[var(--background-darker)] text-white rounded px-2 py-1.5 border border-white/10"
            >
              {ALL_KEYS.map((midi) => (
                <option key={midi} value={midi}>
                  {midiToNoteName(midi)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
            Nota mas aguda
            <select
              value={settings.highestMidi}
              onChange={(event) => update({ highestMidi: Number(event.target.value) })}
              className="bg-[var(--background-darker)] text-white rounded px-2 py-1.5 border border-white/10"
            >
              {ALL_KEYS.map((midi) => (
                <option key={midi} value={midi}>
                  {midiToNoteName(midi)}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <RangePreview lowestMidi={settings.lowestMidi} highestMidi={settings.highestMidi} />

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={settings.autoTranspose}
          onChange={(event) => update({ autoTranspose: event.target.checked })}
          className="mt-1 accent-[var(--accent-green)]"
        />
        <span>
          <strong className="block">Transponer las canciones que no quepan</strong>
          <span className="text-[var(--text-secondary)]">
            Sube o baja octavas la pieza entera para que entre en tu teclado. Si lo desactivas, se
            avisa y puedes ajustarlo a mano en cada cancion.
          </span>
        </span>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default PianoRangeSettings;
