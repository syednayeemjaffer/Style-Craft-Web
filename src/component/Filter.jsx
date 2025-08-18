import React, { useState } from 'react';

const Filter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const priceRanges = [
    { label: 'Under $50', value: '0-50', min: 0, max: 50 },
    { label: '$50 - $100', value: '50-100', min: 50, max: 100 },
    { label: '$100 - $200', value: '100-200', min: 100, max: 200 },
    { label: 'Over $200', value: '200-999999', min: 200, max: 999999 }
  ];

  const categories = [
    { label: 'Women', value: 'WOMEN' },
    { label: 'Men', value: 'MEN' }
  ];

  const handlePriceRangeChange = (range) => {
    const newPriceRange = selectedPriceRange === range.value ? '' : range.value;
    setSelectedPriceRange(newPriceRange);
    
    const filters = {
      minPrice: newPriceRange ? range.min : null,
      maxPrice: newPriceRange ? range.max : null,
      category: selectedCategory || null
    };
    
    onFilterChange(filters);
  };

  const handleCategoryChange = (category) => {
    const newCategory = selectedCategory === category.value ? '' : category.value;
    setSelectedCategory(newCategory);
    
    let minPrice = null;
    let maxPrice = null;
    
    if (selectedPriceRange) {
      const priceRange = priceRanges.find(range => range.value === selectedPriceRange);
      if (priceRange) {
        minPrice = priceRange.min;
        maxPrice = priceRange.max;
      }
    }
    
    const filters = {
      minPrice,
      maxPrice,
      category: newCategory || null
    };
    
    onFilterChange(filters);
  };

  const clearAllFilters = () => {
    setSelectedPriceRange('');
    setSelectedCategory('');
    onFilterChange({
      minPrice: null,
      maxPrice: null,
      category: null
    });
  };

  const activeFiltersCount = (selectedPriceRange ? 1 : 0) + (selectedCategory ? 1 : 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-8">
      <div className="p-6">
        {/* Filter Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="text-sm font-medium mr-2">
              {isOpen ? 'Hide Filters' : 'Show Filters'}
            </span>
            <svg 
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Categories */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Categories
              </h4>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category.value} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory === category.value}
                      onChange={() => handleCategoryChange(category)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center transition-colors ${
                      selectedCategory === category.value 
                        ? 'bg-gray-900 border-gray-900' 
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {selectedCategory === category.value && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Price Range
              </h4>
              <div className="space-y-3">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedPriceRange === range.value}
                      onChange={() => handlePriceRangeChange(range)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center transition-colors ${
                      selectedPriceRange === range.value 
                        ? 'bg-gray-900 border-gray-900' 
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {selectedPriceRange === range.value && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearAllFilters}
                disabled={activeFiltersCount === 0}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {categories.find(cat => cat.value === selectedCategory)?.label}
                  <button
                    onClick={() => handleCategoryChange(categories.find(cat => cat.value === selectedCategory))}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedPriceRange && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {priceRanges.find(range => range.value === selectedPriceRange)?.label}
                  <button
                    onClick={() => handlePriceRangeChange(priceRanges.find(range => range.value === selectedPriceRange))}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Filter;