import { Link } from "react-router-dom";
import { BookCover } from "../components/BookCover";
import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { useBooks } from "../context/BookContext";


import { useAuth } from "../context/AuthContext";
import { AuthButton } from "../components/AuthButton";

export function Welcome() {
  const { featuredBooks, loading, error, showMyBooks, showFavorites, favoritesCount } = useBooks();
  const { user } = useAuth();

  const handleShowMyBooks = async () => {
    if (showMyBooks) {
      await showMyBooks();
    }
  };

  const handleShowFavorites = async () => {
    if (showFavorites) {
      await showFavorites();
    }
  };

  return (
    <main className="flex flex-col items-center">
      <header className="w-full bg-green-700 text-white p-4 flex justify-between items-center" data-cy="header">
        <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.38A7.968 7.968 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.969 7.969 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          <h1 className="text-2xl font-bold" data-cy="site-title">Books4Cash.io</h1>
          
          <nav className="ml-auto">
            <ul className="flex gap-6 items-center">
              <li><a href="#" className="hover:underline">Buy</a></li>
              <li><a href="#" className="hover:underline">Sell</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              {user && (
                <li className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm" data-cy="favorites-count">{favoritesCount}</span>
                </li>
              )}
              <li>
                <AuthButton />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="w-full bg-gray-50 p-12 text-center rounded-lg mt-4 mb-4" data-cy="hero-section">
        <h2 className="text-4xl font-bold mb-4">Turn Your Books Into Cash</h2>
        <p className="text-xl text-gray-700 mb-6">Buy and sell used books using our military-grade internet technology AI+™</p>
        <div className="flex justify-center">
          <Link 
            to="/new" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            data-cy="add-new-book-hero-button"
          >
            Add New Book
          </Link>
        </div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <SearchBar />
          {user ? (
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={handleShowMyBooks}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                data-cy="show-my-books-button"
              >
                Show My Books
              </button>
              <button
                onClick={handleShowFavorites}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 whitespace-nowrap flex items-center gap-1"
                data-cy="show-favorites-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Favorites ({favoritesCount})
              </button>
            </div>
          ) : (
            <span className="text-gray-500 text-sm mt-4 md:mt-0">Log in to see your books and favorites</span>
          )}
        </div>
        <SearchResults />
      </div>

      <div className="max-w-6xl w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Books</h2>
          <Link to="/new" className="text-green-600 hover:underline flex items-center gap-1" data-cy="add-new-book-featured-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Book
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-cy="featured-books-grid">
          {featuredBooks.map((book) => (
            <div key={book.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md flex flex-col">
              <div className="h-64 bg-gray-100">
                <BookCover book={book} />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-lg text-green-600">${book.price}</span>
                  <span className="text-sm text-gray-500">{book.condition}</span>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button className="text-green-600 text-sm hover:underline">Edit</button>
                  <button className="text-red-600 text-sm hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#" className="text-green-600 hover:underline">Browse all books →</a>
        </div>
      </div>

      <footer className="w-full bg-gray-800 text-white p-6 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4">Books4Cash.io</h3>
              <p className="text-gray-300">The snappy way to buy books.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-4 mt-6 md:mt-0">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Help</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">ToS</a>
              <a href="#" className="hover:underline">Contact</a>
              <a href="#" className="hover:underline">Blog</a>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 Books4Cash.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
