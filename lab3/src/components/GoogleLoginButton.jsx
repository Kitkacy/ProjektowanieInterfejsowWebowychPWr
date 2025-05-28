import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function GoogleLoginButton() {
  const { user, loginWithGoogle, loading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const handleLogin = async () => {
    setLocalLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setLocalLoading(false);
    }
  };

  if (user) {
    return <span className="text-green-200 px-3 py-1 rounded-lg">Logged in</span>;
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-white text-green-700 px-3 py-1 rounded-lg hover:bg-green-50"
      disabled={loading || localLoading}
    >
      {(loading || localLoading) ? 'Logging in...' : 'Login'}
    </button>
  );
}
