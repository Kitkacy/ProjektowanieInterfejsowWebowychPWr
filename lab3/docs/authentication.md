# Google Authentication Implementation for Books4Cash

This document outlines the implementation details for Google Authentication in the Books4Cash application.

## Authentication Features

- Login with email/password
- Login with Google authentication (popup and redirect methods)
- User registration with email/password
- User profile management
- Protected routes requiring authentication
- Persistent authentication state
- Logout functionality
- Firestore security rules for data protection

## Implementation Components

### 1. Firebase Configuration (`src/firebase/config.js`)

The Firebase configuration includes the necessary setup for authentication:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAnDEoCI0JUEU1h8U83VeM4MAGam1lrWmM",
  authDomain: "piwowicka.firebaseapp.com",
  // other config properties...
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
```

### 2. Authentication Context (`src/context/AuthContext.jsx`)

The `AuthContext` provides authentication functionality throughout the application:

- Authentication state management
- Login methods (email/password and Google)
- Registration methods
- Logout functionality
- Error handling

Key methods include:
- `login(email, password)` - Email/password authentication
- `loginWithGoogle()` - Google popup authentication
- `loginWithGoogleRedirect()` - Google redirect authentication (mobile-friendly)
- `signup(email, password)` - New user registration
- `logout()` - User sign out

### 3. Login and Signup Pages

The login and signup pages provide user interface for authentication:

**Login Page** (`src/routes/login.jsx`):
- Email/password login form
- Google authentication button
- Form validation
- Error handling
- Redirect for authenticated users

**Signup Page** (`src/routes/signup.jsx`):
- Registration form with validation
- Google authentication button
- Error handling
- Redirect for authenticated users

### 4. Route Protection

Protected routes use the `RequireAuth` component (`src/components/RequireAuth.jsx`):

```jsx
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

Routes are protected in the router configuration (`src/routes.js`):

```jsx
{
  path: '/new',
  element: (
    <RequireAuth>
      <Suspense fallback={<Loading />}>
        <New />
      </Suspense>
    </RequireAuth>
  )
}
```

### 5. User-Specific Data

The Firestore service (`src/firebase/firestoreService.js`) includes methods for user-specific data:

- `getUserBooks(userId)` - Get books owned by a specific user
- `addBook(bookData, userId)` - Add a book with owner information

## Testing

You can test the authentication flow using the provided test script:

```
node tests/test-auth.js
```

This script tests:
- Email/password signup and login
- Google authentication
- Authentication state monitoring

## User Profile Management

The application includes a user profile system:

- Profile creation upon registration or first Google sign-in
- Profile page for viewing and editing user information
- Synchronization between Firebase Auth and Firestore user data
- Profile photo display from Google account (when available)

Users can access their profile via:
- The profile link in the navigation bar (when logged in)
- Direct navigation to `/profile` route (protected)

## Firestore Security Rules

Security rules have been implemented to protect user data:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Check if the user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if the user is the owner of the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Books collection - anyone can read, but write requires authentication
    match /books/{bookId} {
      allow read: if true;
      
      // Allow create if user is authenticated and sets themselves as owner
      allow create: if isAuthenticated() && 
                    request.resource.data.ownerId == request.auth.uid;
      
      // Allow update and delete only if the user is the owner
      allow update, delete: if isAuthenticated() && 
                            resource.data.ownerId == request.auth.uid;
    }
    
    // User profiles - secure per user
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    // Default rule - deny access to other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Future Improvements

1. Implement email verification for new users
2. Add password reset functionality
3. Enhance user profile with additional fields (address, preferences)
4. Implement admin authentication for advanced features
5. Add multi-factor authentication options

## Troubleshooting

If Google authentication fails:

1. Ensure the Firebase project has Google authentication enabled
2. Check that the correct API key is being used
3. Verify that the authDomain is properly configured
4. Ensure that popup windows are not blocked by the browser
