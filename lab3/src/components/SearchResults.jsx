import { useBooks } from '../context/BookContext';

export function SearchResults() {
  const { searchResults, filters, removeBook, loading, error } = useBooks();
  
  if (loading) {
    return (
      <div className="mt-6 w-full max-w-4xl mx-auto">
        <div className="p-4 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 bg-gray-200 rounded mb-2"></div>
          </div>
          <p className="text-gray-500 mt-2">Loading books...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mt-6 w-full max-w-4xl mx-auto">
        <div className="p-4 border border-red-300 bg-red-50 rounded-lg text-red-700">
          <h3 className="font-semibold mb-2">Error loading books</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (searchResults.length === 0) {
    return null;
  }
  
  const hasActiveFilters = 
    filters.category.length > 0 || 
    filters.condition.length > 0 || 
    filters.format.length > 0 || 
    filters.publishYear.length > 0 ||
    filters.priceRange.min > 0 || 
    filters.priceRange.max < 100;
  
  return (
    <div className="mt-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Search Results ({searchResults.length})</h3>
        {hasActiveFilters && (
          <span className="text-sm text-green-600">Filters applied</span>
        )}
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm">
        {searchResults.map(book => (
          <div key={book.id} className="border-b p-4 flex justify-between items-center">
            <div>
              <h4 className="font-medium">{book.title}</h4>
              <p className="text-gray-600 text-sm">{book.author}</p>
              <div className="flex gap-2 text-xs mt-1">
                <span className="bg-gray-100 px-2 py-1 rounded-lg">{book.category}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-lg">{book.condition}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-lg">{book.format}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-lg">{book.publishYear}</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">{book.pages} pages</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-lg text-green-600">${book.price.toFixed(2)}</span>
              <div className="flex gap-2 mt-2">
                <button className="text-green-600 text-sm hover:underline">View Details</button>
                <button className="text-green-600 text-sm hover:underline">Edit</button>
                <button 
                  className="text-red-600 text-sm hover:underline"
                  onClick={() => removeBook(book.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
