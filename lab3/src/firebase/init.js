import { initializeDatabase } from './initData.js';

const initializeFirestore = async () => {
  try {
    console.log('Initializing Firestore...');
    const initialized = await initializeDatabase();
    console.log(`Firestore initialization ${initialized ? 'completed' : 'skipped (data already exists)'}`);
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
};

export default initializeFirestore;
