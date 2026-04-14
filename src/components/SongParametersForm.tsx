import type React from 'react';

interface SongParametersFormProps {
  keySignature: string
  onKeyChange: (key: string) => void
  timeSignature: string
  onTimeSignatureChange: (time: string) => void
  tempo: number
  onTempoChange: (tempo: number) => void
}

const KEY_OPTIONS = [
  "C Major", "G Major", "D Major", "A Major", "E Major", "B Major",
  "F# Major", "C# Major", "F Major", "Bb Major", "Eb Major", "Ab Major",
  "Db Major", "Gb Major", "Cb Major",
  "A Minor", "E Minor", "B Minor", "F# Minor", "C# Minor", "G# Minor",
  "D# Minor", "A# Minor", "D Minor", "G Minor", "C Minor", "F Minor",
  "Bb Minor", "Eb Minor", "Ab Minor"
]

const TIME_SIGNATURE_OPTIONS = ["4/4", "3/4", "2/4", "6/8", "9/8", "12/8", "5/4", "7/8"]

export const SongParametersForm: React.FC<SongParametersFormProps> = ({
  keySignature,
  onKeyChange,
  timeSignature,
  onTimeSignatureChange,
  tempo,
  onTempoChange,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-5">
      <div className="mb-4">
        <span className="text-emerald-500 text-base font-medium block mb-3">
          Song Parameters
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="key-select"
              className="block mb-2 text-gray-300 text-sm"
            >
              Key
            </label>
            <select
              id="key-select"
              value={keySignature}
              onChange={(e) => onKeyChange(e.target.value)}
              className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer text-sm"
            >
              {KEY_OPTIONS.map((keyName) => (
                <option key={keyName} value={keyName}>
                  {keyName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="time-select"
              className="block mb-2 text-gray-300 text-sm"
            >
              Time Signature
            </label>
            <select
              id="time-select"
              value={timeSignature}
              onChange={(e) => onTimeSignatureChange(e.target.value)}
              className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer text-sm"
            >
              {TIME_SIGNATURE_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="tempo-input"
              className="block mb-2 text-gray-300 text-sm"
            >
              Tempo (BPM)
            </label>
            <div className="flex items-center">
              <input
                id="tempo-input"
                type="number"
                min="40"
                max="240"
                value={tempo}
                onChange={(e) => onTempoChange(Number(e.target.value))}
                className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
