import { initializeDatabase, forceInitializeDatabase } from './firebase/initData';
import { getAllBooks } from './firebase/firestoreService';

const testFirestoreIntegration = async () => {
  try {
    console.log('Starting Firestore integration test...');

    const initialized = await initializeDatabase();
    console.log(`Database initialization ${initialized ? 'completed' : 'skipped (data already exists)'}`);

    console.log('Fetching books from Firestore...');
    const books = await getAllBooks();
    console.log(`Retrieved ${books.length} books from Firestore:`);
    books.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.author}`);
    });

    console.log('Firestore integration test completed successfully!');
  } catch (error) {
    console.error('Firestore integration test failed:', error);
  }
};

testFirestoreIntegration();

export default testFirestoreIntegration;
