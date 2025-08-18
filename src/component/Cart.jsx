import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const { getAuthHeaders, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCartItems();
    } else {
      setLoading(false);
      setError('Please log in to view your cart');
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://ecommerce-d1mr.onrender.com/products/cart', {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      setCartItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(cartId));

    try {
      const response = await fetch(
        `https://ecommerce-d1mr.onrender.com/products/cart/${cartId}/quantity/${newQuantity}`,
        {
          method: 'PUT',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      showNotification('Failed to update quantity', 'error');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
    }
  };

  const removeItem = async (cartId) => {
    if (window.confirm('Remove this item from your cart?')) {
      try {
        const response = await fetch(`https://ecommerce-d1mr.onrender.com/products/cart/${cartId}`, {
          method: 'DELETE',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to remove item');
        }

        setCartItems(prevItems => prevItems.filter(item => item.id !== cartId));
        showNotification('Item removed from cart');
      } catch (err) {
        console.error('Error removing item:', err);
        showNotification('Failed to remove item', 'error');
      }
    }
  };

  const clearCart = async () => {
    if (window.confirm('Clear your entire cart?')) {
      try {
        const response = await fetch('https://ecommerce-d1mr.onrender.com/products/cart/clear', {
          method: 'DELETE',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to clear cart');
        }

        setCartItems([]);
        showNotification('Cart cleared');
      } catch (err) {
        console.error('Error clearing cart:', err);
        showNotification('Failed to clear cart', 'error');
      }
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white text-sm font-medium ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 text-6xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in required</h2>
            <p className="text-gray-600 mb-8">Please sign in to view your shopping cart</p>
            <Link 
              to="/login" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Error loading cart</h3>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">Shopping Cart</h1>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 flex items-center group transition-colors"
            >
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m0 0l8 8-8 8" />
              </svg>
              Continue Shopping
            </Link>
          </div>
          
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="mt-4 md:mt-0 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Discover our latest collections and add some items to your cart</p>
            <Link
              to="/"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md transition-colors font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Cart Items ({getTotalItems()})
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                          {item.product.imgUrl && item.product.imgUrl.length > 0 && (
                            <img
                              src={item.product.imgUrl[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 ml-4">
                          <div className="flex justify-between">
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/${item.product.id}`}
                                className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-sm text-gray-500 mt-1">
                                Category: {item.product.category}
                              </p>
                              <div className="flex items-center mt-2">
                                <span className="text-lg font-semibold text-gray-900">
                                  ${item.product.price}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">each</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-700 mr-4">Quantity:</span>
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                                  className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="px-4 py-2 text-center min-w-[60px] border-l border-r border-gray-300">
                                  {updatingItems.has(item.id) ? '...' : item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={updatingItems.has(item.id)}
                                  className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">Subtotal</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm sticky top-24">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                </div>
                
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">$15.00</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-medium text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ${(parseFloat(getTotalPrice()) + 15).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-md font-medium transition-colors">
                    Proceed to Checkout
                  </button>
                  
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 mb-2">We accept:</p>
                    <div className="flex justify-center space-x-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">VISA</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">MC</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">AMEX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;