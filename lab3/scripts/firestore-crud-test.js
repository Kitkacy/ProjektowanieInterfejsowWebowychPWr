
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "piwowicka.firebaseapp.com",
  projectId: "piwowicka",
  storageBucket: "piwowicka.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BOOKS_COLLECTION = 'books';
const booksCollection = collection(db, BOOKS_COLLECTION);

const testFunctions = {
  getAllBooks: async () => {
    console.log('\n--- GETTING ALL BOOKS ---');
    try {
      const snapshot = await getDocs(booksCollection);
      if (snapshot.empty) {
        console.log('No books found.');
        return [];
      }
      
      console.log(`Found ${snapshot.docs.length} books:`);
      const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      books.forEach((book, index) => {
        console.log(`${index + 1}. ${book.title} by ${book.author} - $${book.price}`);
      });
      return books;
    } catch (error) {
      console.error('Error getting books:', error);
      throw error;
    }
  },
  
  addTestBook: async () => {
    console.log('\n--- ADDING TEST BOOK ---');
    try {
      const testBook = {
        title: `Test Book ${new Date().toISOString()}`,
        author: 'Test Author',
        price: 19.99,
        condition: 'New',
        category: 'Test',
        description: 'This is a test book added via the Firebase test script.',
        publishYear: 2023,
        pages: 123,
        language: 'English',
        format: 'Paperback',
        cover: '/images/covers/book-default-cover.jpg',
        hasCover: false
      };
      
      const docRef = await addDoc(booksCollection, testBook);
      console.log(`Test book added with ID: ${docRef.id}`);
      return { id: docRef.id, ...testBook };
    } catch (error) {
      console.error('Error adding test book:', error);
      throw error;
    }
  },
  
  updateBook: async (bookId) => {
    console.log(`\n--- UPDATING BOOK (${bookId}) ---`);
    try {
      const updateData = {
        title: `Updated Book ${new Date().toISOString()}`,
        price: 29.99
      };
      
      const bookDocRef = doc(db, BOOKS_COLLECTION, bookId);
      await updateDoc(bookDocRef, updateData);
      console.log(`Book ${bookId} updated successfully`);
      return true;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },
  
  deleteBook: async (bookId) => {
    console.log(`\n--- DELETING BOOK (${bookId}) ---`);
    try {
      const bookDocRef = doc(db, BOOKS_COLLECTION, bookId);
      await deleteDoc(bookDocRef);
      console.log(`Book ${bookId} deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },
  
  queryBooksByCategory: async (category) => {
    console.log(`\n--- QUERYING BOOKS BY CATEGORY (${category}) ---`);
    try {
      const q = query(booksCollection, where('category', '==', category));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log(`No books found in category: ${category}`);
        return [];
      }
      
      console.log(`Found ${snapshot.docs.length} books in category: ${category}`);
      const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      books.forEach((book, index) => {
        console.log(`${index + 1}. ${book.title} by ${book.author}`);
      });
      return books;
    } catch (error) {
      console.error('Error querying books by category:', error);
      throw error;
    }
  },
  
  getBooksOrderedByPrice: async (ascending = true) => {
    console.log(`\n--- GETTING BOOKS ORDERED BY PRICE (${ascending ? 'ASCENDING' : 'DESCENDING'}) ---`);
    try {
      const q = query(
        booksCollection, 
        orderBy('price', ascending ? 'asc' : 'desc'),
        limit(5)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log('No books found.');
        return [];
      }
      
      console.log(`Found ${snapshot.docs.length} books:`);
      const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      books.forEach((book, index) => {
        console.log(`${index + 1}. ${book.title} - $${book.price}`);
      });
      return books;
    } catch (error) {
      console.error('Error getting books ordered by price:', error);
      throw error;
    }
  }
};

const runAllTests = async () => {
  try {
    console.log('=== STARTING FIRESTORE TESTS ===\n');
    
    const books = await testFunctions.getAllBooks();
    
    const newBook = await testFunctions.addTestBook();
    
    await testFunctions.updateBook(newBook.id);
    
    await testFunctions.queryBooksByCategory('Guides');
    
    await testFunctions.getBooksOrderedByPrice(false); 
    
    await testFunctions.deleteBook(newBook.id);
    
    await testFunctions.getAllBooks();
    
    console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY ===');
    process.exit(0);
  } catch (error) {
    console.error('\n=== TEST FAILED ===');
    console.error(error);
    process.exit(1);
  }
};

runAllTests();
