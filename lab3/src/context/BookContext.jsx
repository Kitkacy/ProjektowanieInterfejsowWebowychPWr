import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAllBooks, 
  addBook as addBookToFirestore, 
  deleteBook as deleteBookFromFirestore,
  searchBooks as searchBooksInFirestore
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
      const newBookData = {
        ...book,
        cover: DEFAULT_COVER,
        hasCover: false
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
      await deleteBookFromFirestore(id);
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    } catch (err) {
      console.error('Error removing book:', err);
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
