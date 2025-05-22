import { Welcome } from "../welcome/welcome";
import { Helmet } from 'react-helmet-async';
import { useBooks } from '../context/BookContext';

export default function Home() {
  const { loading, error } = useBooks();

  return (
    <>
      <Helmet>
        <title>Books4Cash - Online Bookstore</title>
        <meta name="description" content="Find your next favorite book at Books4Cash!" />
      </Helmet>
      
      {error && (
        <div className="w-full max-w-4xl mx-auto mt-4 p-4 border border-red-300 bg-red-50 rounded-lg text-red-700">
          <h3 className="font-semibold mb-2">Error loading books</h3>
          <p>{error}</p>
          <p className="mt-2 text-sm">Please check your Firebase configuration in src/firebase/config.js</p>
        </div>
      )}
      
      <Welcome />
    </>
  );
}
