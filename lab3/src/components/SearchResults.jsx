import { useState, useCallback } from 'react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { EditBookModal } from './EditBookModal';

export function SearchResults() {
  const { searchResults, filters, removeBook, loading, error, addToFavorites, removeFromFavorites, isFavoriteBook } = useBooks();
  const { user } = useAuth();
  const [editingBook, setEditingBook] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleEditBook = useCallback((book) => {
    setEditingBook(book);
    setIsEditModalOpen(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingBook(null);
  }, []);

  const handleDeleteBook = useCallback(async (book) => {
    if (!user) {
      alert('You must be logged in to delete a book.');
      return;
    }
    
    if (book.ownerId !== user.uid) {
      alert('You can only delete books you own.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await removeBook(book.id);
      } catch (error) {
        alert(error.message);
      }
    }
  }, [user, removeBook]);

  const isOwner = useCallback((book) => {
    return user && book.ownerId === user.uid;
  }, [user]);

  const handleFavoriteToggle = useCallback(async (book) => {
    if (!user) {
      alert('You must be logged in to add favorites.');
      return;
    }

    try {
      if (isFavoriteBook(book.id)) {
        await removeFromFavorites(book.id);
      } else {
        await addToFavorites(book.id);
      }
    } catch (error) {
      alert(error.message);
    }
  }, [user, addToFavorites, removeFromFavorites, isFavoriteBook]);

  if (loading) {
    return (
      <div className="mt-6 w-full max-w-4xl mx-auto" data-cy="search-loading">
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
    <div className="mt-6 w-full max-w-4xl mx-auto" data-cy="search-results">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold" data-cy="search-results-count">Search Results ({searchResults.length})</h3>
        {hasActiveFilters && (
          <span className="text-sm text-green-600" data-cy="filters-applied">Filters applied</span>
        )}
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm" data-cy="search-results-list">
        {searchResults.map(book => (
          <div key={book.id} className="border-b p-4 flex justify-between items-center" data-cy="book-item">
            <div>
              <h4 className="font-medium" data-cy="book-title">{book.title}</h4>
              <p className="text-gray-600 text-sm" data-cy="book-author">{book.author}</p>
              <div className="flex gap-2 text-xs mt-1">
                <span className="bg-gray-100 px-2 py-1 rounded-lg" data-cy="book-category">{book.category}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-lg" data-cy="book-condition">{book.condition}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-lg" data-cy="book-format">{book.format}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-lg" data-cy="book-year">{book.publishYear}</span>
              </div>
              <p className="text-gray-500 text-xs mt-1" data-cy="book-pages">{book.pages} pages</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-lg text-green-600" data-cy="book-price">${book.price.toFixed(2)}</span>
              <div className="flex gap-2 mt-2">
                <button className="text-green-600 text-sm hover:underline" data-cy="view-details-button">View Details</button>
                {user && (
                  <button
                    onClick={() => handleFavoriteToggle(book)}
                    className={`text-sm hover:underline ${
                      isFavoriteBook(book.id) 
                        ? 'text-red-500' 
                        : 'text-gray-600'
                    }`}
                    data-cy="favorite-button"
                    title={isFavoriteBook(book.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavoriteBook(book.id) ? '♥ Favorite' : '♡ Add to Favorites'}
                  </button>
                )}
                {isOwner(book) && (
                  <>
                    <button 
                      className="text-blue-600 text-sm hover:underline"
                      onClick={() => handleEditBook(book)}
                      data-cy="edit-book-button"
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 text-sm hover:underline"
                      onClick={() => handleDeleteBook(book)}
                      data-cy="delete-book-button"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <EditBookModal
        book={editingBook}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={() => {
        }}
      />
    </div>
  );
}
