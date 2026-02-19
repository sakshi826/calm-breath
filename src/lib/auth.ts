const USER_ID_KEY = 'wellness_user_id';

export async function resolveUser(): Promise<number | null> {
  const stored = sessionStorage.getItem(USER_ID_KEY);
  if (stored) return parseInt(stored, 10);

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' || 
                  window.location.hostname.startsWith('192.168.') ||
                  window.location.hostname.startsWith('10.') ||
                  window.location.hostname.includes('.local');

  if (!token) {
    if (isLocal) {
      console.log('Auth: Local dev detected, using dummy user_id');
      const dummyId = 12345;
      sessionStorage.setItem(USER_ID_KEY, String(dummyId));
      return dummyId;
    }
    console.warn('Auth: No token found and not on local dev. Redirecting to /token');
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
  } catch (err) {
    console.error('Auth: fetch failed:', err);
    if (isLocal) return 12345;
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