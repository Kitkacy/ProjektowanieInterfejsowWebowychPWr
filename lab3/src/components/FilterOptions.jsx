import { useState } from 'react';
import { useBooks } from '../context/BookContext';

export function FilterOptions({ isOpen, toggleFilters }) {
  const { filters, updateFilters, resetFilters, filterOptions } = useBooks();
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);
  
  const handlePriceChange = (type, value) => {
    setLocalPriceRange(prev => {
      const newRange = { ...prev, [type]: Number(value) };
      return newRange;
    });
  };
  
  const applyPriceRange = () => {
    updateFilters('priceRange', localPriceRange);
  };
  
  const toggleFilter = (filterType, value) => {
    updateFilters(filterType, value);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="p-4 bg-white border rounded-lg shadow-md mb-6" data-cy="filter-options">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Options</h3>
        <div>
          <button 
            onClick={resetFilters}
            className="text-gray-500 hover:text-green-600 text-sm mr-4"
            data-cy="reset-filters-button"
          >
            Reset
          </button>
          <button 
            onClick={toggleFilters}
            className="text-gray-500 hover:text-green-600"
            data-cy="close-filters-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="mb-4">
          <h4 className="font-medium mb-2 text-sm">Categories</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filterOptions.categories.map(category => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={filters.category.includes(category)}
                  onChange={() => toggleFilter('category', category)}
                  className="mr-2"
                />
                <label htmlFor={`category-${category}`} className="text-sm">{category}</label>
              </div>
            ))}
          </div>
        </div>
        

        <div className="mb-4">
          <h4 className="font-medium mb-2 text-sm">Condition</h4>
          <div className="space-y-2">
            {filterOptions.conditions.map(condition => (
              <div key={condition} className="flex items-center">
                <input
                  type="checkbox"
                  id={`condition-${condition}`}
                  checked={filters.condition.includes(condition)}
                  onChange={() => toggleFilter('condition', condition)}
                  className="mr-2"
                />
                <label htmlFor={`condition-${condition}`} className="text-sm">{condition}</label>
              </div>
            ))}
          </div>
        </div>
        

        <div className="mb-4">
          <h4 className="font-medium mb-2 text-sm">Format</h4>
          <div className="space-y-2">
            {filterOptions.formats.map(format => (
              <div key={format} className="flex items-center">
                <input
                  type="checkbox"
                  id={`format-${format}`}
                  checked={filters.format.includes(format)}
                  onChange={() => toggleFilter('format', format)}
                  className="mr-2"
                />
                <label htmlFor={`format-${format}`} className="text-sm">{format}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2 text-sm">Publication Year</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filterOptions.publishYears.map(year => (
              <div key={year} className="flex items-center">
                <input
                  type="checkbox"
                  id={`year-${year}`}
                  checked={filters.publishYear.includes(year)}
                  onChange={() => toggleFilter('publishYear', year)}
                  className="mr-2"
                />
                <label htmlFor={`year-${year}`} className="text-sm">{year}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
      

      <div className="mt-4">
        <h4 className="font-medium mb-2 text-sm">Price Range ($)</h4>
        <div className="flex items-center space-x-4">
          <div>
            <input
              type="number"
              min="0"
              value={localPriceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-16 p-2 border rounded-lg text-sm text-gray-900"
              placeholder="Min"
            />
          </div>
          <span className="text-gray-400">to</span>
          <div>
            <input
              type="number"
              min="0"
              value={localPriceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-16 p-2 border rounded-lg text-sm text-gray-900"
              placeholder="Max"
            />
          </div>
          <button
            onClick={applyPriceRange}
            className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
