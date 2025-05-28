import { useState, useEffect, useCallback } from 'react';
import { useBooks } from '../context/BookContext';

export function EditBookModal({ book, isOpen, onClose, onSuccess }) {
  const { updateBook } = useBooks();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    price: '',
    condition: 'Good',
    category: 'True Crime',
    description: '',
    publishYear: 2025,
    pages: '',
    language: 'English',
    format: 'Paperback'
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form data only when modal opens with a new book
  useEffect(() => {
    if (isOpen && book && !isInitialized) {
      setBookData({
        title: book.title || '',
        author: book.author || '',
        price: book.price || '',
        condition: book.condition || 'Good',
        category: book.category || 'True Crime',
        description: book.description || '',
        publishYear: book.publishYear || 2025,
        pages: book.pages || '',
        language: book.language || 'English',
        format: book.format || 'Paperback'
      });
      setIsInitialized(true);
      setErrorMessage(null);
    }
    
    // Reset when modal closes
    if (!isOpen) {
      setIsInitialized(false);
      setSubmitting(false);
      setErrorMessage(null);
    }
  }, [isOpen, book, isInitialized]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'pages' || name === 'publishYear' 
        ? Number(value) 
        : value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookData.title || !bookData.author || !bookData.price) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      setErrorMessage(null);
      
      await updateBook(book.id, bookData);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating book:', error);
      setErrorMessage(error.message || 'Failed to update book. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Book</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={submitting}
            >
              ×
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={bookData.title}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={bookData.author}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={bookData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Pages
                </label>
                <input
                  type="number"
                  id="pages"
                  name="pages"
                  value={bookData.pages}
                  onChange={handleChange}
                  min="1"
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={bookData.condition}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={bookData.category}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="True Crime">True Crime</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Biography">Biography</option>
                  <option value="History">History</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Business">Business</option>
                  <option value="Technology">Technology</option>
                  <option value="Science">Science</option>
                  <option value="Art">Art</option>
                  <option value="Travel">Travel</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Health">Health</option>
                  <option value="Sports">Sports</option>
                  <option value="Children">Children</option>
                  <option value="Young Adult">Young Adult</option>
                  <option value="Horror">Horror</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Poetry">Poetry</option>
                  <option value="Drama">Drama</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select
                  id="format"
                  name="format"
                  value={bookData.format}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="Paperback">Paperback</option>
                  <option value="Hardcover">Hardcover</option>
                  <option value="Ebook">Ebook</option>
                  <option value="Audiobook">Audiobook</option>
                </select>
              </div>

              <div>
                <label htmlFor="publishYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Year
                </label>
                <input
                  type="number"
                  id="publishYear"
                  name="publishYear"
                  value={bookData.publishYear}
                  onChange={handleChange}
                  min="1900"
                  max="2030"
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={bookData.language}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Polish">Polish</option>
                <option value="Russian">Russian</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Arabic">Arabic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={bookData.description}
                onChange={handleChange}
                rows={4}
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                placeholder="Brief description of the book's condition or any additional notes..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
