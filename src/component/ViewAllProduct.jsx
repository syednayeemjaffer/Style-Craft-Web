import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ViewAllProduct = ({ gender, filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated()) {
        setError('Please log in to view products');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let url;
        
        if (filters && (filters.minPrice !== null || filters.maxPrice !== null || filters.category !== null)) {
          const params = new URLSearchParams();
          
          if (filters.minPrice !== null) params.append('minPrice', filters.minPrice);
          if (filters.maxPrice !== null) params.append('maxPrice', filters.maxPrice);
          if (filters.category !== null) params.append('category', filters.category);
          
          url = `https://ecommerce-w3qm.onrender.com/products/filter?${params.toString()}`;
        } else if (gender) {
          url = `https://ecommerce-w3qm.onrender.com/products/byGender/${gender}`;
        } else {
          url = 'https://ecommerce-w3qm.onrender.com/products';
        }
          
        const response = await fetch(url, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [gender, filters, isAuthenticated, getAuthHeaders]);

  const handleAddToCart = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      alert('Please log in to add items to cart');
      return;
    }

    setAddingToCart(prev => new Set(prev).add(productId));

    try {
      const response = await fetch(`https://ecommerce-w3qm.onrender.com/products/cart/${productId}`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const message = await response.text();
      // Show success notification instead of alert
      showNotification('Added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      showNotification('Failed to add to cart. Please try again.', 'error');
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleBuyNow = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      alert('Please log in to purchase');
      return;
    }
    navigate(`/buy/${productId}`);
  };

  const showNotification = (message, type = 'success') => {
    // Simple notification - you can replace with a proper toast library
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white text-sm font-medium ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const getPageTitle = () => {
    if (gender === 'MEN') return "Men's Collection";
    if (gender === 'WOMEN') return "Women's Collection";
    if (filters && (filters.minPrice !== null || filters.maxPrice !== null || filters.category !== null)) {
      return "Filtered Products";
    }
    return "All Products";
  };

  if (!isAuthenticated()) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Authentication Required</h2>
        <p className="text-gray-500 mb-4">Please log in to view products</p>
        <Link 
          to="/login" 
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Error loading products</h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600">
            {products.length === 0 
              ? 'No products found' 
              : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rating</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl text-gray-500 mb-2">No products available</h3>
          <p className="text-gray-400">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-6'
        }>
          {products.map((product) => (
            <div
              key={product.id} 
              className={`group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <Link to={`/${product.id}`} className={`block ${viewMode === 'list' ? 'flex w-full' : ''}`}>
                {/* Product Image */}
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-[3/4]'
                }`}>
                  {product.imgUrl && product.imgUrl.length > 0 && (
                    <img 
                      src={product.imgUrl[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  
                  {/* Product Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.rating && product.rating > 4.5 && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Top Rated
                      </span>
                    )}
                    {product.category && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        product.category === 'WOMEN' 
                          ? 'bg-pink-100 text-pink-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* Quick Add Button */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => handleAddToCart(product.id, e)}
                      disabled={addingToCart.has(product.id)}
                      className="w-full bg-white text-gray-900 py-2 px-4 rounded font-medium text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart.has(product.id) ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900 mr-2"></div>
                          Adding...
                        </div>
                      ) : (
                        'Quick Add'
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-gray-900">
                        ${product.price}
                      </span>
                      {product.rating && product.rating > 0 && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons - Only show in list view */}
                  {viewMode === 'list' && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={addingToCart.has(product.id)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-3 rounded text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingToCart.has(product.id) ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-900 mr-1"></div>
                            Adding...
                          </div>
                        ) : (
                          'Add to Cart'
                        )}
                      </button>
                      
                      <button
                        onClick={(e) => handleBuyNow(product.id, e)}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-3 rounded text-sm font-medium transition"
                      >
                        Buy Now
                      </button>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAllProduct;