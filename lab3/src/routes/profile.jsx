import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../firebase/firestoreService';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile || {});
        setDisplayName(userProfile?.displayName || user.displayName || '');
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setSaveMessage('');
      setError('');
      setLoading(true);
      
      await updateUserProfile(user.uid, {
        displayName
      });
      
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Books4Cash</title>
        <meta name="description" content="Manage your Books4Cash profile" />
      </Helmet>

      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.38A7.968 7.968 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.969 7.969 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 ml-2">Books4Cash.io</h1>
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            My Profile
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-300 rounded-lg p-3">
                    <div className="flex items-center text-red-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}
                
                {saveMessage && (
                  <div className="mb-6 bg-green-50 border border-green-300 rounded-lg p-3">
                    <div className="flex items-center text-green-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{saveMessage}</span>
                    </div>
                  </div>
                )}
              
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="h-24 w-24 rounded-full border-2 border-green-600"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 border-2 border-green-600">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label htmlFor="display-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Display Name
                      </label>
                      <div className="mt-2">
                        <input
                          id="display-name"
                          name="display-name"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Email: {user.email}</p>
                      {user.emailVerified ? (
                        <p className="text-sm text-green-600">✓ Email verified</p>
                      ) : (
                        <p className="text-sm text-amber-600">Email not verified</p>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setDisplayName(profile?.displayName || user.displayName || '');
                        }}
                        className="flex-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Display Name</h3>
                      <p className="text-lg font-medium">{profile?.displayName || user.displayName || user.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="text-lg font-medium">{user.email}</p>
                      {user.emailVerified ? (
                        <p className="text-sm text-green-600">✓ Email verified</p>
                      ) : (
                        <p className="text-sm text-amber-600">Email not verified</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                      <p className="text-base">
                        {profile?.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-center text-sm text-red-600 hover:text-red-500"
                  >
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm font-semibold leading-6 text-green-600 hover:text-green-500">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
