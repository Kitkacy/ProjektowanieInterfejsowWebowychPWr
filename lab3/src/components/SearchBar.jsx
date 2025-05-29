import { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { FilterOptions } from './FilterOptions';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { searchBooks } = useBooks();
  
  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(query);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div>
      <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            data-cy="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author or category..."
            className="w-full py-2 px-4 focus:outline-none rounded-l-lg text-gray-900"
          />
          <button 
            data-cy="filter-toggle-button"
            type="button"
            onClick={toggleFilters}
            className="px-2 py-2 text-gray-500 hover:text-green-600"
            title="Show filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <button 
            data-cy="search-button"
            type="submit"
            className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 rounded-r-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      
      <div className="mt-4">
        <FilterOptions isOpen={showFilters} toggleFilters={toggleFilters} />
      </div>
    </div>
  );
}
