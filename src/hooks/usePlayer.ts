import { useEffect, useRef, useState } from 'react';
import { Player, type PlayerSnapshot } from '../features/player/Player';

/**
 * Crea un Player (uno por pantalla) y mantiene un snapshot en el estado de
 * React. La animacion NO usa este estado: el renderer lee el tiempo del player
 * directamente en cada frame.
 */
export function usePlayer(): { player: Player; snapshot: PlayerSnapshot } {
  const playerRef = useRef<Player | null>(null);
  if (playerRef.current === null) playerRef.current = new Player();
  const player = playerRef.current;

  const [snapshot, setSnapshot] = useState<PlayerSnapshot>(() => player.snapshot());

  useEffect(() => player.subscribe(setSnapshot), [player]);

  useEffect(() => {
    return () => player.dispose();
  }, [player]);

  return { player, snapshot };
}
