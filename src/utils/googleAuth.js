// Google Identity Services (GIS) & Real OAuth 2.0 Integration Helper

const GOOGLE_CLIENT_ID_KEY = 'frappequest_google_client_id';

/**
 * Get active Google OAuth Client ID (from Vite env or LocalStorage)
 */
export function getGoogleClientId() {
  if (typeof window === 'undefined') return '';
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (envId && envId.trim() && !envId.includes('YOUR_GOOGLE_CLIENT_ID')) {
    return envId.trim();
  }
  return localStorage.getItem(GOOGLE_CLIENT_ID_KEY) || '';
}

/**
 * Save custom Google Client ID to LocalStorage
 */
export function saveGoogleClientId(clientId) {
  if (typeof window === 'undefined') return;
  if (clientId && clientId.trim()) {
    localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId.trim());
  } else {
    localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
  }
}

/**
 * Decode JWT token returned by Google Identity Services
 */
export function decodeGoogleJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT payload:', e);
    return null;
  }
}

/**
 * Ensure Google Identity Services script is loaded and ready
 */
export function waitForGoogleScript(timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window not available'));
    
    if (window.google?.accounts) {
      return resolve(window.google.accounts);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (window.google?.accounts) {
        clearInterval(interval);
        resolve(window.google.accounts);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        // Fallback: check if script tag exists
        if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            if (window.google?.accounts) resolve(window.google.accounts);
            else reject(new Error('Google accounts library failed to initialize'));
          };
          script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
          document.head.appendChild(script);
        } else {
          reject(new Error('Google Identity Services script load timeout'));
        }
      }
    }, 100);
  });
}

/**
 * Launch Real Google OAuth 2.0 Account Picker Popup Window
 * Opens real Google accounts popup: accounts.google.com
 */
export async function launchGoogleOAuthPopup(customClientId = null) {
  const clientId = customClientId || getGoogleClientId();

  if (!clientId) {
    return {
      success: false,
      needConfig: true,
      message: 'Google Client ID is not configured yet. Please configure your Google Cloud OAuth Client ID.'
    };
  }

  try {
    await waitForGoogleScript();

    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google OAuth2 client is not supported in this browser environment');
    }

    return new Promise((resolve, reject) => {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              console.error('Google OAuth error:', tokenResponse);
              reject(new Error(tokenResponse.error_description || tokenResponse.error || 'Google authorization was cancelled or failed.'));
              return;
            }

            try {
              // Fetch the user's authentic profile from Google's UserInfo API endpoint
              const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`
                }
              });

              if (!response.ok) {
                throw new Error(`Google UserInfo API responded with status ${response.status}`);
              }

              const profile = await response.json();

              resolve({
                success: true,
                user: {
                  email: profile.email,
                  name: profile.name || profile.given_name || 'Google Developer',
                  avatar: profile.picture || '🌐',
                  googleId: profile.sub || `g_${Date.now()}`
                }
              });
            } catch (fetchErr) {
              console.error('Failed to fetch userinfo from Google:', fetchErr);
              reject(fetchErr);
            }
          },
          error_callback: (err) => {
            console.error('Google token client error:', err);
            reject(new Error(err?.message || 'Google authorization window was closed.'));
          }
        });

        // Trigger Google's real authentication window with account chooser!
        tokenClient.requestAccessToken({ prompt: 'select_account' });
      } catch (clientInitErr) {
        reject(clientInitErr);
      }
    });
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to initialize Google Authentication.'
    };
  }
}
