import { useState } from "react"

export interface ChordType {
  keys: string[]
  selected: boolean
}

export const useChordProgression = () => {
  const [chordProgression, setChordProgression] = useState<ChordType[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [editingChordIndex, setEditingChordIndex] = useState<number | null>(null)

  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"]
  const hasBlackKeyAfter = [true, true, false, true, true, true, false]

  const generateNotesWithOctaves = (octaveCount: number): string[] => {
    const notes: string[] = []
    for (let oct = 4; oct < 4 + octaveCount; oct++) {
      whiteKeys.forEach(note => {
        notes.push(`${note}${oct}`)
      })
    }
    return notes
  }

  const generateBlackKeysWithOctaves = (octaveCount: number): string[] => {
    const blackKeys = ["C#", "D#", "F#", "G#", "A#"]
    const notes: string[] = []
    for (let oct = 4; oct < 4 + octaveCount; oct++) {
      blackKeys.forEach(note => {
        notes.push(`${note}${oct}`)
      })
    }
    return notes
  }

  const handleKeyClick = (note: string) => {
    setSelectedKeys(prev => {
      if (prev.includes(note)) {
        return prev.filter(key => key !== note)
      } else {
        return [...prev, note]
      }
    })
  }

  const handleSaveChord = () => {
    if (selectedKeys.length > 0) {
      if (editingChordIndex !== null) {
        setChordProgression(prev => {
          const updated = [...prev]
          updated[editingChordIndex] = { keys: [...selectedKeys], selected: true }
          return updated
        })
        setEditingChordIndex(null)
      } else {
        const newChord: ChordType = { keys: [...selectedKeys], selected: true }
        setChordProgression(prev => [...prev, newChord])
      }
      setSelectedKeys([])
    }
  }

  const handleEditChord = (index: number) => {
    setEditingChordIndex(index)
    setSelectedKeys(chordProgression[index].keys)
  }

  const handleDeleteChord = (index: number) => {
    setChordProgression(prev => prev.filter((_, i) => i !== index))
  }

  const handleCancelEdit = () => {
    setEditingChordIndex(null)
    setSelectedKeys([])
  }

  const clearChordProgression = () => {
    setChordProgression([])
    setSelectedKeys([])
    setEditingChordIndex(null)
  }

  return {
    chordProgression,
    setChordProgression,
    selectedKeys,
    setSelectedKeys,
    editingChordIndex,
    whiteKeys,
    hasBlackKeyAfter,
    generateNotesWithOctaves,
    generateBlackKeysWithOctaves,
    handleKeyClick,
    handleSaveChord,
    handleEditChord,
    handleDeleteChord,
    handleCancelEdit,
    clearChordProgression,
  }
}
