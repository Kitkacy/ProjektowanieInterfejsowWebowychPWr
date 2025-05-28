import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';

export function AuthButton() {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-white">
          Welcome, {user.displayName || user.email}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
      >
        Sign In
      </button>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
}
