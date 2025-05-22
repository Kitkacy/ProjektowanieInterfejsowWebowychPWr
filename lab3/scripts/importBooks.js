const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

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

const booksData = [
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
  }
];

async function addBook(bookData) {
  try {
    const docRef = await addDoc(collection(db, "books"), bookData);
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function importAllBooks() {
  console.log("Starting to import books...");
  
  for (const book of booksData) {
    try {
      await addBook(book);
      console.log(`Added book: ${book.title}`);
    } catch (error) {
      console.error(`Failed to add book: ${book.title}`, error);
    }
  }
  
  console.log("Import completed!");
}

importAllBooks()
  .then(() => {
    console.log("All done!");
  })
  .catch(error => {
    console.error("Error during import:", error);
  });
