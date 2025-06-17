const API_URL = 'http://localhost:4000';

export async function getUserProfile(uid: string) {
  const res = await fetch(`${API_URL}/users/${uid}`);
  return res.json();
}

export async function createUserProfile(profile: any) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  return res.json();
}

export async function updateUserProfile(uid: string, profile: any) {
  await fetch(`${API_URL}/users/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
}

export async function deleteUserProfile(uid: string) {
  await fetch(`${API_URL}/users/${uid}`, { method: 'DELETE' });
} 