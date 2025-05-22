import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAaQWLf5z8Hw1gqv2GcNY63HJJcR8WVv0", 
  authDomain: "piwowicka.firebaseapp.com",
  projectId: "piwowicka",
  storageBucket: "piwowicka.appspot.com",
  messagingSenderId: "123456789",  
  appId: "1:123456789:web:abc123" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BOOKS_COLLECTION = 'books';

const initialBooks = [
  {
    title: "How to Talk to Your Cat About Gun Safety",
    author: "John Smith",
    price: 45.99,
    condition: "Like New",
    category: "Guns",
    description: "Do you love your cat? Well, no self-respecting cat mom or dad would let their baby grow up without a solid grounding in gun safety.",
    publishYear: 2021,
    pages: 450,
    language: "English",
    format: "Paperback",
    cover: "/images/covers/1.png",
    hasCover: true
  },
  {
    title: "How to Survive a Garden Gnome Attack",
    author: "Sarah Johnson",
    price: 38.50,
    condition: "Good",
    category: "Guides",
    description: "Crucial survival information when dealing with one of the world's smallest menaces.",
    publishYear: 2020,
    pages: 380,
    language: "English",
    format: "Hardcover",
    cover: "/images/covers/2.png",
    hasCover: true
  },
  {
    title: "Eating People is Wrong",
    author: "Michael Brown",
    price: 52.75,
    condition: "Very Good",
    category: "Psychology",
    description: "The all in one book for the person on the fence.",
    publishYear: 2019,
    pages: 520,
    language: "English",
    format: "Paperback",
    cover: "/images/covers/3.png",
    hasCover: true
  },
  {
    title: "Crafting with Cat Hair: Cute Handicrafts to Make with Your Cat",
    author: "Emily Chen",
    price: 34.99,
    condition: "Good",
    category: "Guides",
    description: "Have you been storing your cat's hair, waiting for your moment? Well, your moment is now.",
    publishYear: 2022,
    pages: 310,
    language: "English",
    format: "Paperback",
    cover: "/images/covers/4.jpg",
    hasCover: true
  },
  {
    title: "The Field Guide to Dumb Birds of North America",
    author: "David Wilson",
    price: 42.25,
    condition: "Like New",
    category: "Guides",
    description: "You may be outwitted by the smart ones, but these ones are more in your grasp.",
    publishYear: 2021,
    pages: 620,
    language: "English",
    format: "Hardcover",
    cover: "/images/covers/5.jpg",
    hasCover: true
  },
  {
    title: "How to Raise Your I.Q. by Eating Gifted Children",
    author: "Jennifer Adams",
    price: 29.99,
    condition: "Acceptable",
    category: "Psychology",
    description: "Children are the new Super Food.",
    publishYear: 2018,
    pages: 350,
    language: "English",
    format: "Digital",
    cover: "/images/covers/6.jpg",
    hasCover: true
  },
  {
    title: "Microwave for One",
    author: "Robert Taylor",
    price: 48.50,
    condition: "Very Good",
    category: "Cooking",
    description: "Microwave cooking turned all the way up to 1.",
    publishYear: 2020,
    pages: 480,
    language: "English",
    format: "Paperback",
    cover: "/images/covers/7.jpg",
    hasCover: true
  },
  {
    title: "Extreme Ironing",
    author: "Amanda Lewis",
    price: 36.75,
    condition: "Good",
    category: "Sports",
    description: "For the adrenaline junky looking to get their fix in this modern crazy world.",
    publishYear: 2019,
    pages: 290,
    language: "English",
    format: "Digital",
    cover: "/images/covers/8.jpg",
    hasCover: true
  }
];

const forceInitializeDatabase = async () => {
  try {
    console.log('Force initializing Firestore with books data...');
    
    const booksCollection = collection(db, BOOKS_COLLECTION);
    
    const snapshot = await getDocs(booksCollection);
    if (!snapshot.empty) {
      console.log('Books already exist in the database. Continuing anyway...');
    }
    
    const promises = initialBooks.map(book => addDoc(booksCollection, book));
    await Promise.all(promises);
    
    console.log('Firestore initialized with books data successfully!');
    return true;
  } catch (error) {
    console.error('Error force initializing database:', error);
    throw error;
  }
};

forceInitializeDatabase()
  .then(() => {
    console.log('Books have been added to Firestore successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
