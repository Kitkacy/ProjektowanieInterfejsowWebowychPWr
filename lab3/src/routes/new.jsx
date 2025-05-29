import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useBooks } from '../context/BookContext';

export default function NewBook() {
  const { addBook, filterOptions, loading, error } = useBooks();
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'pages' || name === 'publishYear' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookData.title || !bookData.author || !bookData.price) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      setErrorMessage(null);
      
      await addBook(bookData);
      
      navigate('/');
    } catch (error) {
      console.error('Error adding book:', error);
      setErrorMessage(error.message || 'Failed to add book. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center pt-16 pb-4">
      <Helmet>
        <title>Add New Book - Books4Cash</title>
        <meta name="description" content="Add a new book to the Books4Cash marketplace" />
      </Helmet>
      
      <header className="w-full bg-green-700 text-white p-4 flex justify-between items-center fixed top-0 left-0">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.38A7.968 7.968 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.969 7.969 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <h1 className="text-2xl font-bold">Books4Cash.io</h1>
          </Link>
        </div>
        <nav>
          <ul className="flex gap-6 items-center">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li>
              <button className="bg-white text-green-700 px-3 py-1 rounded-lg hover:bg-green-50">
                Login
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="w-full max-w-4xl mx-auto p-8">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-green-600 hover:underline mr-2">
            ← Back to Home
          </Link>
          <h2 className="text-2xl font-semibold ml-4">Add New Book</h2>
        </div>

        {}
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-sm">This book will be added to Firestore database</span>
          </div>
        </div>

        {}
        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-300 rounded-lg p-3">
            <div className="flex items-center text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm" data-cy="add-book-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-900"
                data-cy="book-title-input"
                required
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
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-900"
                data-cy="book-author-input"
                required
              />
            </div>


            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={bookData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-900"
                data-cy="book-price-input"
                required
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
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-900"
                data-cy="book-condition-select"
              >
                {filterOptions.conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
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
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-900"
                data-cy="book-category-select"
              >
                {filterOptions.categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
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
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-900"
              >
                {filterOptions.formats.map(format => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label htmlFor="publishYear" className="block text-sm font-medium text-gray-700 mb-1">
                Publication Year
              </label>
              <select
                id="publishYear"
                name="publishYear"
                value={bookData.publishYear}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-900"
              >
                {[...Array(10)].map((_, i) => {
                  const year = 2023 - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>


            <div>
              <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
                Pages
              </label>
              <input
                type="number"
                id="pages"
                name="pages"
                value={bookData.pages}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>


          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={bookData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-900"
            ></textarea>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              disabled={submitting}
              data-cy="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={submitting}
              data-cy="submit-book-button"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
