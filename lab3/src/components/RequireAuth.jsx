import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children }) {
  const { user, loading, error, clearError } = useAuth();
  const location = useLocation();

  // Clear any previous auth errors when the component mounts or unmounts
  useEffect(() => {
    if (error) {
      clearError();
    }
    
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  // If auth is still loading, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to the login page
  if (!user) {
    // Store the location they were trying to go to when redirected
    // This allows us to send them there after they login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child components
  return children;
}
