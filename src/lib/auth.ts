const USER_ID_KEY = 'wellness_user_id';

export async function resolveUser(): Promise<number | null> {
  const stored = sessionStorage.getItem(USER_ID_KEY);
  if (stored) return parseInt(stored, 10);

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (!token) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Local dev detected, using dummy user_id');
      return 12345;
    }
    window.location.href = '/token';
    return null;
  }

  try {
    const response = await fetch('https://api.mantracare.com/user/user-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) throw new Error('Token validation failed');

    const data = await response.json();
    const userId: number = data.user_id;

    sessionStorage.setItem(USER_ID_KEY, String(userId));

    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    return userId;
  } catch {
    window.location.href = '/token';
    return null;
  }
}

export function getUserId(): number | null {
  const stored = sessionStorage.getItem(USER_ID_KEY);
  return stored ? parseInt(stored, 10) : null;
}

export function clearSession(): void {
  sessionStorage.removeItem(USER_ID_KEY);
}