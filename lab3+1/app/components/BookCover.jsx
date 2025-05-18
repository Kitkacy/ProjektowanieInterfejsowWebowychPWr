import { useBooks } from '../context/BookContext';

export function BookCover({ book, className }) {
  const { DEFAULT_COVER } = useBooks();

  if (book.hasCover) {
    return (
      <div className="w-full h-full flex justify-center bg-gray-100">
        <img 
          src={book.cover} 
          alt={`Cover of ${book.title}`}
          className={className || "h-full object-contain"} 
        />
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center bg-gray-100 ${className || "w-full h-full"}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
  );
}
