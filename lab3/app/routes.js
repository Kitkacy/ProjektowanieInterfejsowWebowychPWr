import { lazy, Suspense } from 'react';
import App from './root';

const Home = lazy(() => import('./routes/home'));
const New = lazy(() => import('./routes/new'));

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
          <Suspense fallback={<Loading />}>
            <New />
          </Suspense>
        )
      }
    ]
  }
];