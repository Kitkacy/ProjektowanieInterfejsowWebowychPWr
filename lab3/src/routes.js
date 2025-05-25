import { lazy, Suspense } from 'react';
import App from './root';
import RequireAuth from './components/RequireAuth';

// Lazy load route components for better performance
const Home = lazy(() => import('./routes/home'));
const New = lazy(() => import('./routes/new'));
const Login = lazy(() => import('./routes/login'));
const Signup = lazy(() => import('./routes/signup'));
const Profile = lazy(() => import('./routes/profile'));

// Add a loading component for suspense fallback
const Loading = () => {
  return <div className="p-4">Loading...</div>;
};

export default [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: '/new',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loading />}>
              <New />
            </Suspense>
          </RequireAuth>
        )
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        )
      },
      {
        path: '/signup',
        element: (
          <Suspense fallback={<Loading />}>
            <Signup />
          </Suspense>
        )
      },
      {
        path: '/profile',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loading />}>
              <Profile />
            </Suspense>
          </RequireAuth>
        )
      }
    ]
  }
];