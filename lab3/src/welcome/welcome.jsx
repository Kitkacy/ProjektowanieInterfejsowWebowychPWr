import { Link, useNavigate } from "react-router-dom";
import { BookCover } from "../components/BookCover";
import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { useBooks } from "../context/BookContext";
import { useAuth } from "../context/AuthContext";

export function Welcome() {
  const { featuredBooks, loading, error } = useBooks();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center">
      <header className="w-full bg-green-700 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.38A7.968 7.968 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.969 7.969 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          <h1 className="text-2xl font-bold">Books4Cash.io</h1>
          
          <nav className="ml-auto">
            <ul className="flex gap-6 items-center">
              <li><a href="#" className="hover:underline">Buy</a></li>
              <li><a href="#" className="hover:underline">Sell</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              {user ? (
                <>
                  <li>
                    <Link to="/profile" className="text-white hover:underline flex items-center">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Profile" 
                          className="h-6 w-6 rounded-full mr-2 border border-white"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-white text-green-700 flex items-center justify-center text-sm font-bold mr-2">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>Hello, {user.displayName || user.email.split('@')[0]}</span>
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => logout()} 
                      className="bg-white text-green-700 px-3 py-1 rounded-lg hover:bg-green-50"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="bg-white text-green-700 px-3 py-1 rounded-lg hover:bg-green-50"
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <div className="w-full bg-gray-50 p-12 text-center rounded-lg mt-4 mb-4">
        <h2 className="text-4xl font-bold mb-4">Turn Your Books Into Cash</h2>
        <p className="text-xl text-gray-700 mb-6">Buy and sell used books using our military-grade internet technology AI+™</p>
        <div className="flex justify-center">
          {user ? (
            <Link 
              to="/new" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Add New Book
            </Link>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Login to Add Books
            </button>
          )}
        </div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto p-8">
        <SearchBar />
        <SearchResults />
      </div>

      <div className="max-w-6xl w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Books</h2>
          <Link to="/new" className="text-green-600 hover:underline flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Book
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
