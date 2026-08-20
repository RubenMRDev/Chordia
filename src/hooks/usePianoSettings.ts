import { useCallback, useEffect, useState } from 'react';
import {
  getPianoSettings,
  hydratePianoSettings,
  setPianoSettings,
  subscribePianoSettings,
  type PianoSettings,
} from '../features/piano/pianoSettings';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../firebase/userService';

interface UsePianoSettingsReturn {
  settings: PianoSettings;
  /** Cambia la configuracion y la guarda (local y, con sesion, en el perfil). */
  update: (patch: Partial<PianoSettings>) => void;
  saving: boolean;
  error: string | null;
}

/**
 * Configuracion del piano del usuario. Vive en un almacen propio (localStorage)
 * y se sincroniza con el perfil de Firestore cuando hay sesion.
 */
export function usePianoSettings(): UsePianoSettingsReturn {
  const { currentUser, userProfile } = useAuth();
  const [settings, setSettings] = useState<PianoSettings>(() => getPianoSettings());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => subscribePianoSettings(setSettings), []);

  // Al cargar el perfil se adopta lo que hubiera guardado en la cuenta.
  useEffect(() => {
    if (userProfile?.piano) hydratePianoSettings(userProfile.piano);
  }, [userProfile]);

  const update = useCallback(
    (patch: Partial<PianoSettings>) => {
      const next = setPianoSettings(patch);
      if (!currentUser) return;

      setSaving(true);
      setError(null);
      updateUserProfile(currentUser.uid, { piano: next })
        .catch((caught: unknown) =>
          setError(caught instanceof Error ? caught.message : 'No se pudo guardar en tu perfil'),
        )
        .finally(() => setSaving(false));
    },
    [currentUser],
  );

  return { settings, update, saving, error };
}
