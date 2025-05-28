import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getAllBooks, 
  addBook as addBookToFirestore, 
  deleteBook as deleteBookFromFirestore,
  updateBook as updateBookInFirestore,
  searchBooks as searchBooksInFirestore,
  getUserBooks
} from '../firebase/firestoreService';
import { initializeDatabase } from '../firebase/initData';


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
      
      // Check if user owns the book
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
      
      // Check if user owns the book
      const book = books.find(b => b.id === id) || searchResults.find(b => b.id === id);
      if (book && book.ownerId !== user.uid) {
        throw new Error('You can only edit books you own.');
      }
      
      const updatedBook = await updateBookInFirestore(id, bookData);
      
      // Update the book in both books and searchResults arrays
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

  // Show only books added by the current user
  const showMyBooks = async () => {
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
  };
  
  return (
    <BookContext.Provider 
      value={{ 
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
        DEFAULT_COVER
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  return useContext(BookContext);
}
