import {
  isRouteErrorResponse,
  Outlet,
  Routes,
  Route,
} from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { lazy, Suspense } from 'react';

import { BookProvider } from "./context/BookContext";
import { AuthProvider } from "./context/AuthContext";
import SimplePage from "./SimplePage";
import "./app.css";

// Lazy load route components
const Home = lazy(() => import('./routes/home'));
const New = lazy(() => import('./routes/new'));

// Loading component
const Loading = () => <div className="p-4">Loading...</div>;

export function Layout({ children }) {
  console.log('Layout component rendering');
  return (
    <div className="min-h-full flex flex-col bg-white">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        />
      </Helmet>
      <AuthProvider>
        <BookProvider>
          {children}
        </BookProvider>
      </AuthProvider>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        } />
        <Route path="new" element={
          <Suspense fallback={<Loading />}>
            <New />
          </Suspense>
        } />
        <Route path="simple" element={
          <Suspense fallback={<Loading />}>
            <SimplePage />
          </Suspense>
        } />
        <Route path="*" element={<div>Page not found</div>} />
      </Route>
    </Routes>
  );
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
