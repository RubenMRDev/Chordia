const API_URL = 'http://localhost:4000';

export async function getAllSongs() {
  const res = await fetch(`${API_URL}/songs`);
  return res.json();
}

export async function getSongById(id: string) {
  const res = await fetch(`${API_URL}/songs/${id}`);
  return res.json();
}

export async function createSong(song: any) {
  const res = await fetch(`${API_URL}/songs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(song),
  });
  return res.json();
}

export async function deleteSongById(id: string) {
  await fetch(`${API_URL}/songs/${id}`, { method: 'DELETE' });
}

export async function getUserSongs(userId: string) {
  const res = await fetch(`${API_URL}/songs?userId=${userId}`);
  return res.json();
}

export async function deleteAllUserSongs(userId: string) {
  // Suponiendo que el backend tenga un endpoint para esto, si no, habría que implementarlo
  await fetch(`${API_URL}/songs/user/${userId}`, { method: 'DELETE' });
} 