/**
 * Conversion de duraciones musicales a segundos.
 *
 * La app usa la notacion de Tone.js ("4n", "8n", "2n."), asi que se mantiene
 * para no cambiar las llamadas existentes, pero ahora se resuelve aqui y no
 * dentro de Tone.
 */

const DEFAULT_BPM = 120;

/**
 * Acepta:
 *  - numeros: segundos directos
 *  - "1n" | "2n" | "4n" | "8n" | "16n" ... (redonda, blanca, negra, ...)
 *  - sufijo "." para puntillo ("4n.") y "t" para tresillo ("8t")
 *  - "2m" (compases) y cadenas numericas ("0.5")
 */
export function durationToSeconds(duration: string | number, bpm: number = DEFAULT_BPM): number {
  if (typeof duration === 'number' && Number.isFinite(duration)) return Math.max(0, duration);

  const beatSeconds = 60 / (bpm > 0 ? bpm : DEFAULT_BPM);
  const text = String(duration).trim().toLowerCase();

  const numeric = Number(text);
  if (!Number.isNaN(numeric)) return Math.max(0, numeric);

  const match = text.match(/^(\d+)(n|m|t)(\.?)$/);
  if (!match) return beatSeconds * 2;

  const value = parseInt(match[1], 10) || 4;
  const unit = match[2];
  const dotted = match[3] === '.';

  let seconds: number;
  if (unit === 'm') {
    seconds = beatSeconds * 4 * value; // compases de 4/4
  } else {
    seconds = (beatSeconds * 4) / value;
    if (unit === 't') seconds = (seconds * 2) / 3;
  }
  if (dotted) seconds *= 1.5;

  return seconds;
}
