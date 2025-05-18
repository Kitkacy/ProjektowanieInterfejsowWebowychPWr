import { createContext, useContext, useState, useEffect } from 'react';
import { db, auth, provider } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Brak initialBooks, wszystko z Firestore

const DEFAULT_COVER = "/images/covers/book-default-cover.jpg";

const BookContext = createContext();


export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    condition: [],
    format: [],
    priceRange: { min: 0, max: 100 },
    publishYear: []
  });
  const [user, setUser] = useState(null);
  const [showMyBooks, setShowMyBooks] = useState(false);

  // Obsługa logowania Google
  const login = async () => {
    await signInWithPopup(auth, provider);
  };
  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  // Pobieranie książek z Firestore
  const fetchBooks = async () => {
    let q = collection(db, 'books');
    if (showMyBooks && user) {
      q = query(q, where('ownerId', '==', user.uid));
    }
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBooks(data);
    setSearchResults(data);
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [user, showMyBooks]);

  // Dodawanie książki do Firestore
  const addBook = async (book) => {
    if (!user) return;
    const newBook = {
      ...book,
      ownerId: user.uid,
      cover: book.cover || DEFAULT_COVER,
      hasCover: !!book.cover
    };
    await addDoc(collection(db, 'books'), newBook);
    fetchBooks();
  };

  // Usuwanie książki
  const removeBook = async (id) => {
    await deleteDoc(doc(db, 'books', id));
    fetchBooks();
  };

  // Filtrowanie i wyszukiwanie
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
    let results = [...books];
    if (currentFilters.category.length > 0) {
      results = results.filter(book => currentFilters.category.includes(book.category));
    }
    if (currentFilters.condition.length > 0) {
      results = results.filter(book => currentFilters.condition.includes(book.condition));
    }
    if (currentFilters.format.length > 0) {
      results = results.filter(book => currentFilters.format.includes(book.format));
    }
    if (currentFilters.publishYear.length > 0) {
      results = results.filter(book => currentFilters.publishYear.includes(book.publishYear));
    }
    results = results.filter(
      book => book.price >= currentFilters.priceRange.min && book.price <= currentFilters.priceRange.max
    );
    setSearchResults(results);
  };

  const searchBooks = (query, currentFilters = filters) => {
    let results = [...books];
    if (query && query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        book =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery) ||
          book.category.toLowerCase().includes(lowerQuery)
      );
    }
    applyFilters(currentFilters);
    setSearchResults(results);
  };

  const resetFilters = () => {
    setFilters({
      category: [],
      condition: [],
      format: [],
      priceRange: { min: 0, max: 100 },
      publishYear: []
    });
    fetchBooks();
  };

  const filterOptions = {
    categories: [...new Set(books.map(book => book.category))],
    conditions: [...new Set(books.map(book => book.condition))],
    formats: [...new Set(books.map(book => book.format))],
    publishYears: [...new Set(books.map(book => book.publishYear))].sort((a, b) => b - a)
  };

  return (
    <BookContext.Provider
      value={{
        books,
        featuredBooks: books.slice(0, 3),
        searchResults,
        searchBooks,
        filters,
        updateFilters,
        applyFilters,
        resetFilters,
        filterOptions,
        addBook,
        removeBook,
        DEFAULT_COVER,
        user,
        login,
        logout,
        showMyBooks,
        setShowMyBooks
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  return useContext(BookContext);
}
