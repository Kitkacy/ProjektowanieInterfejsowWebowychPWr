export const getUserBooks = async (userId) => {
  try {
    const booksCollection = collection(db, BOOKS_COLLECTION);
    const q = query(booksCollection, where('ownerId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user books:', error);
    throw error;
  }
};
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc, 
  query, 
  where,
  updateDoc
} from 'firebase/firestore';
import { db } from './config.js';

const BOOKS_COLLECTION = 'books';

export const getAllBooks = async () => {
  try {
    const booksCollection = collection(db, BOOKS_COLLECTION);
    const snapshot = await getDocs(booksCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting books:', error);
    throw error;
  }
};

export const addBook = async (bookData) => {
  try {
    const booksCollection = collection(db, BOOKS_COLLECTION);
    const docRef = await addDoc(booksCollection, bookData);
    return {
      id: docRef.id,
      ...bookData
    };
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const bookDocRef = doc(db, BOOKS_COLLECTION, bookId);
    await deleteDoc(bookDocRef);
    return bookId;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

export const updateBook = async (bookId, bookData) => {
  try {
    const bookDocRef = doc(db, BOOKS_COLLECTION, bookId);
    await updateDoc(bookDocRef, bookData);
    return {
      id: bookId,
      ...bookData
    };
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const searchBooks = async (searchTerm, filters) => {
  try {
    const books = await getAllBooks();
    
    let filteredBooks = books;
    
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredBooks = filteredBooks.filter(
        book => 
          book.title.toLowerCase().includes(term) || 
          book.author.toLowerCase().includes(term) ||
          book.category.toLowerCase().includes(term)
      );
    }
    
    if (filters.category && filters.category.length > 0) {
      filteredBooks = filteredBooks.filter(book => filters.category.includes(book.category));
    }
    
    if (filters.condition && filters.condition.length > 0) {
      filteredBooks = filteredBooks.filter(book => filters.condition.includes(book.condition));
    }
    
    if (filters.format && filters.format.length > 0) {
      filteredBooks = filteredBooks.filter(book => filters.format.includes(book.format));
    }
    
    if (filters.publishYear && filters.publishYear.length > 0) {
      filteredBooks = filteredBooks.filter(book => filters.publishYear.includes(book.publishYear));
    }
    
    if (filters.priceRange) {
      filteredBooks = filteredBooks.filter(
        book => 
          book.price >= filters.priceRange.min && 
          book.price <= filters.priceRange.max
      );
    }
    
    return filteredBooks;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};