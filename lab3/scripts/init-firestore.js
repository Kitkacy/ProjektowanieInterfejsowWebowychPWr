import { forceInitializeDatabase } from '../src/firebase/initData.js';

const initializeFirestore = async () => {
  try {
    console.log('Starting Firestore initialization...');
    
    await forceInitializeDatabase();
    
    console.log('Firestore initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    process.exit(1);
  }
};

initializeFirestore();
