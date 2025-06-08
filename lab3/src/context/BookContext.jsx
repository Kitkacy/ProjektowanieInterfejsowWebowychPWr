import { createContext, useContext, useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import { useAuth } from './AuthContext';
import { 
  getAllBooks, 
  addBook as addBookToFirestore, 
  deleteBook as deleteBookFromFirestore,
  updateBook as updateBookInFirestore,
  searchBooks as searchBooksInFirestore,
  getUserBooks,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  getUserFavoriteIds
} from '../firebase/firestoreService';
import { initializeDatabase } from '../firebase/initData';
import { favoritesReducer, initialFavoritesState, FAVORITES_ACTIONS } from '../reducers/favoritesReducer';


const DEFAULT_COVER = "/images/covers/book-default-cover.jpg";

const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    condition: [],
    format: [],
    priceRange: { min: 0, max: 100 },
    publishYear: []
  });
  
  // Use useReducer for favorites management
  const [favoritesState, favoritesDispatch] = useReducer(favoritesReducer, initialFavoritesState);
  
  const { user } = useAuth();

  const filterOptions = {
    categories: [...new Set(books.map(book => book.category))],
    conditions: [...new Set(books.map(book => book.condition))],
    formats: [...new Set(books.map(book => book.format))],
    publishYears: [...new Set(books.map(book => book.publishYear))].sort((a, b) => b - a)
  };
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        await initializeDatabase();
        const booksData = await getAllBooks();
        setBooks(booksData);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const loadUserFavorites = async () => {
      if (user) {
        try {
          favoritesDispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: true });
          const favoriteBookIds = await getUserFavoriteIds(user.uid);
          favoritesDispatch({ type: FAVORITES_ACTIONS.SET_FAVORITE_IDS, payload: favoriteBookIds });
        } catch (err) {
          console.error('Error loading user favorites:', err);
          favoritesDispatch({ type: FAVORITES_ACTIONS.SET_ERROR, payload: err.message });
        } finally {
          favoritesDispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: false });
        }
      } else {
        favoritesDispatch({ type: FAVORITES_ACTIONS.RESET_FAVORITES });
      }
    };

    loadUserFavorites();
  }, [user]);

  const addToFavoritesHandler = async (bookId) => {
    try {
      if (!user) throw new Error('You must be logged in to add favorites.');
      
      favoritesDispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: true });
      await addToFavorites(user.uid, bookId);
      favoritesDispatch({ type: FAVORITES_ACTIONS.ADD_FAVORITE, payload: bookId });
    } catch (err) {
      console.error('Error adding to favorites:', err);
      favoritesDispatch({ type: FAVORITES_ACTIONS.SET_ERROR, payload: err.message });
      setError(err.message);
      throw err;
    } finally {
      favoritesDispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const removeFromFavoritesHandler = async (bookId) => {
    try {
      if (!user) throw new Error('You must be logged in to remove favorites.');
      
      favoritesDispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: true });
      await removeFromFavorites(user.uid, bookId);
      favoritesDispatch({ type: FAVORITES_ACTIONS.REMOVE_FAVORITE, payload: bookId });
    } catch (err) {
      console.error('Error removing from favorites:', err);
      favoritesDispatch({ type: FAVORITES_ACTIONS.SET_ERROR, payload: err.message });
      setError(err.message);
      throw err;
    } finally {
      favoritesDispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const showFavorites = useCallback(async () => {
    try {
      if (!user) throw new Error('You must be logged in to view favorites.');
      setLoading(true);
      favoritesDispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: true });
      
      const favoriteBooks = await getUserFavorites(user.uid);
      favoritesDispatch({ type: FAVORITES_ACTIONS.SET_FAVORITES, payload: favoriteBooks });
      setSearchResults(favoriteBooks);
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      favoritesDispatch({ type: FAVORITES_ACTIONS.SET_ERROR, payload: errorMessage });
      setSearchResults([]);
    } finally {
      setLoading(false);
      favoritesDispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: false });
    }
  }, [user]);

  const isFavoriteBook = useCallback((bookId) => {
    return favoritesState.favoriteIds.includes(bookId);
  }, [favoritesState.favoriteIds]);

  const addBook = async (book) => {
    try {
      if (!user) throw new Error('You must be logged in to add a book.');
      const newBookData = {
        ...book,
        cover: DEFAULT_COVER,
        hasCover: false,
        ownerId: user.uid
      };
      const newBook = await addBookToFirestore(newBookData);
      setBooks(prevBooks => [...prevBooks, newBook]);
      return newBook;
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.message);
      throw err;
    }
  };
  
  const removeBook = async (id) => {
    try {
      if (!user) throw new Error('You must be logged in to delete a book.');
      
      const book = books.find(b => b.id === id) || searchResults.find(b => b.id === id);
      if (book && book.ownerId !== user.uid) {
        throw new Error('You can only delete books you own.');
      }
      
      await deleteBookFromFirestore(id);
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      setSearchResults(prevResults => prevResults.filter(book => book.id !== id));
    } catch (err) {
      console.error('Error removing book:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      if (!user) throw new Error('You must be logged in to edit a book.');
      
      const book = books.find(b => b.id === id) || searchResults.find(b => b.id === id);
      if (book && book.ownerId !== user.uid) {
        throw new Error('You can only edit books you own.');
      }
      
      const updatedBook = await updateBookInFirestore(id, bookData);
      
      setBooks(prevBooks => 
        prevBooks.map(book => book.id === id ? { ...book, ...updatedBook } : book)
      );
      setSearchResults(prevResults => 
        prevResults.map(book => book.id === id ? { ...book, ...updatedBook } : book)
      );
      
      return updatedBook;
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateFilters = (filterType, value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      if (filterType === 'priceRange') {
        newFilters.priceRange = value;
      } else {
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        } else {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      }
      
      if (searchResults.length > 0) {
        applyFilters(newFilters);
      }
      
      return newFilters;
    });
  };
  
  const applyFilters = (currentFilters = filters) => {
    const query = searchResults.length > 0 ? '' : null;
    searchBooks(query, currentFilters);
  };
  
  const searchBooks = async (query, currentFilters = filters) => {
    try {
      const results = await searchBooksInFirestore(query, currentFilters);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching books:', err);
      setError(err.message);
      setSearchResults([]);
    }
  };
  
  const resetFilters = () => {
    setFilters({
      category: [],
      condition: [],
      format: [],
      priceRange: { min: 0, max: 100 },
      publishYear: []
    });
    
    if (searchResults.length > 0) {
      const resetFiltersObj = {
        category: [],
        condition: [],
        format: [],
        priceRange: { min: 0, max: 100 },
        publishYear: []
      };
      searchBooks('', resetFiltersObj);
    }
  };

  const showMyBooks = useCallback(async () => {
    try {
      if (!user) throw new Error('You must be logged in to view your books.');
      setLoading(true);
      const myBooks = await getUserBooks(user.uid);
      setSearchResults(myBooks);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const contextValue = useMemo(() => ({
    books, 
    featuredBooks: books.slice(0, 3),
    searchResults, 
    loading,
    error,
    searchBooks,
    filters,
    updateFilters,
    applyFilters,
    resetFilters,
    filterOptions,
    addBook, 
    removeBook,
    updateBook,
    showMyBooks,
    favorites: favoritesState.favorites,
    favoriteIds: favoritesState.favoriteIds,
    favoritesCount: favoritesState.favoriteIds.length,
    favoritesLoading: favoritesState.loading,
    favoritesError: favoritesState.error,
    addToFavorites: addToFavoritesHandler,
    removeFromFavorites: removeFromFavoritesHandler,
    showFavorites,
    isFavoriteBook,
    DEFAULT_COVER
  }), [
    books, 
    searchResults, 
    loading, 
    error, 
    filters, 
    filterOptions,
    showMyBooks,
    favoritesState.favorites,
    favoritesState.favoriteIds,
    favoritesState.loading,
    favoritesState.error,
    showFavorites,
    isFavoriteBook
  ]);
  
  return (
    <BookContext.Provider value={contextValue}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  return useContext(BookContext);
}
