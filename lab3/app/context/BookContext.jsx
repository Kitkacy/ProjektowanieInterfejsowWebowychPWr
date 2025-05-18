import { createContext, useContext, useState } from 'react';

const initialBooks = [
  {
    id: 1,
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
    id: 2,
    title: "How to Survive a Garden Gnome Attack",
    author: "Sarah Johnson",
    price: 38.50,
    condition: "Good",
    category: "Guides",
    description: "Crucial survival information when dealing with one of the world’s smallest menaces.",
    publishYear: 2020,
    pages: 380,
    language: "English",
    format: "Hardcover",
    cover: "/images/covers/2.png",
    hasCover: true
  },
  {
    id: 3,
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
    id: 4,
    title: "Crafting with Cat Hair: Cute Handicrafts to Make with Your Cat",
    author: "Emily Chen",
    price: 34.99,
    condition: "Good",
    category: "Guides",
    description: "Have you been storing your cat’s hair, waiting for your moment? Well, your moment is now.",
    publishYear: 2022,
    pages: 310,
    language: "English",
    format: "Paperback",
    cover: "/images/covers/4.jpg",
    hasCover: true
  },
  {
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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

const DEFAULT_COVER = "/images/covers/book-default-cover.jpg";

const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState(initialBooks);
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
  
  const addBook = (book) => {
    const newBook = {
      ...book,
      id: books.length + 1,
      cover: DEFAULT_COVER,
      hasCover: false
    };
    setBooks([...books, newBook]);
  };
  
  const removeBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
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
      book => book.price >= currentFilters.priceRange.min && 
              book.price <= currentFilters.priceRange.max
    );
    
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
