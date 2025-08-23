interface ChordType {
    keys: string[];
    selected: boolean;
}
interface AIChordGeneratorProps {
    onChordsGenerated: (chords: ChordType[]) => void;
    isOpen: boolean;
    onClose: () => void;
}
export default function AIChordGenerator({ onChordsGenerated, isOpen, onClose }: AIChordGeneratorProps): import("react/jsx-runtime").JSX.Element | null;
export {};
