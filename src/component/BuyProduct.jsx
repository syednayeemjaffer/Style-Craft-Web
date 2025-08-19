import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const BuyProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    address: '',
    noProduct: 1
  });
  
  const [errors, setErrors] = useState({});
  
  const { getAuthHeaders, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Pre-fill email from logged-in user
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        customerName: user.username || user.email.split('@')[0]
      }));
    }

    fetchProduct();
  }, [id, isAuthenticated, user, navigate]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://ecommerce-w3qm.onrender.com/products/${id}`, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();
      setProduct(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.noProduct || formData.noProduct < 1) {
      newErrors.noProduct = 'Please enter a valid quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await fetch(`https://ecommerce-w3qm.onrender.com/products/buy/${id}`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          noProduct: parseInt(formData.noProduct)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const message = await response.text();
      alert(message);
      navigate('/');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getTotalPrice = () => {
    if (!product) return '0.00';
    return (parseFloat(product.price) * parseInt(formData.noProduct || 1)).toFixed(2);
  };

  if (!isAuthenticated()) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Purchase</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="flex items-start space-x-4 mb-4">
              {product.imgUrl && product.imgUrl.length > 0 && (
                <img
                  src={product.imgUrl[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.category}</p>
                <p className="text-lg font-bold text-blue-600">${product.price}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Unit Price:</span>
                <span>${product.price}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Quantity:</span>
                <span>{formData.noProduct}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-600">${getTotalPrice()}</span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.customerName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full delivery address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="noProduct"
                  value={formData.noProduct}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.noProduct ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.noProduct && (
                  <p className="mt-1 text-sm text-red-600">{errors.noProduct}</p>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 rounded-md transition-colors"
                  disabled={submitLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                  {submitLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Place Order - $${getTotalPrice()}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyProduct;