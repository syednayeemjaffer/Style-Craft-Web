import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { getAuthHeaders, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isAuthenticated()) {
        setError('Please log in to view product details');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://ecommerce-w3qm.onrender.com/products/${id}`, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
        setReviews(data.reviews || []);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isAuthenticated, getAuthHeaders]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      showNotification('Please log in to add items to cart', 'error');
      return;
    }

    setAddingToCart(true);
    try {
      const response = await fetch(`https://ecommerce-w3qm.onrender.com/products/cart/${id}`, {
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
      showNotification('Added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      showNotification('Failed to add to cart. Please try again.', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated()) {
      showNotification('Please log in to purchase', 'error');
      return;
    }
    navigate(`/buy/${id}`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      showNotification('Please log in to submit a review', 'error');
      return;
    }
    
    if (!reviewerName.trim()) {
      showNotification('Please enter your name', 'error');
      return;
    }
    
    if (rating === 0) {
      showNotification('Please select a rating', 'error');
      return;
    }

    setSubmitLoading(true);
    
    try {
      const response = await fetch(`https://ecommerce-w3qm.onrender.com/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          comment: reviewText.trim(),
          userName: reviewerName.trim()
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to submit review';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      
      // Refresh product data
      const productResponse = await fetch(`https://ecommerce-w3qm.onrender.com/products/${id}`, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      if (productResponse.ok) {
        const updatedProduct = await productResponse.json();
        setProduct(updatedProduct);
      }

      setReviewText('');
      setRating(0);
      setReviewerName('');
      setShowReviewForm(false);
      
      showNotification('Review submitted successfully!');
      
    } catch (err) {
      console.error('Error submitting review:', err);
      showNotification(`Error: ${err.message}`, 'error');
    } finally {
      setSubmitLoading(false);
    }
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
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-gray-400 text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in required</h2>
          <p className="text-gray-600 mb-8">Please sign in to view product details</p>
          <Link 
            to="/login" 
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Error loading product</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              Home
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link 
              to={product.category === 'MEN' ? '/mens' : '/womens'} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {product.category === 'MEN' ? "Men's" : "Women's"}
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>
      
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 mb-16">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 mb-4">
            {product.imgUrl && product.imgUrl.length > 0 && (
              <img 
                src={product.imgUrl[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Image Thumbnails */}
          {product.imgUrl && product.imgUrl.length > 1 && (
            <div className="flex space-x-3">
              {product.imgUrl.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden ${
                    selectedImageIndex === index ? 'ring-2 ring-gray-900' : ''
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-light text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <span className="text-3xl font-light text-gray-900">${product.price}</span>
              {product.rating && (
                <div className="ml-6 flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        } fill-current`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                product.category === 'MEN' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
              }`}>
                {product.category === 'MEN' ? "Men's Fashion" : "Women's Fashion"}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <button 
              onClick={handleBuyNow}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-md font-medium text-lg transition-colors"
            >
              Buy Now
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 py-4 px-6 rounded-md font-medium text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 mr-2"></div>
                  Adding to Cart...
                </div>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>

          {/* Product Features */}
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Free shipping on orders over $100
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              30-day return policy
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure payment processing
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-light text-gray-900">Customer Reviews</h2>
          {!showReviewForm && (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-md transition-colors font-medium"
            >
              Write a Review
            </button>
          )}
        </div>
        
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Write a Review</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  required
                  disabled={submitLoading}
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      disabled={submitLoading}
                      className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${
                        submitLoading ? 'cursor-not-allowed' : 'cursor-pointer hover:text-yellow-400'
                      } transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                id="review"
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                disabled={submitLoading}
                placeholder="Share your thoughts about this product..."
              ></textarea>
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitLoading}
                className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-2 px-6 rounded-md transition-colors font-medium"
              >
                {submitLoading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewText('');
                  setRating(0);
                  setReviewerName('');
                }}
                disabled={submitLoading}
                className="border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 py-2 px-6 rounded-md transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="pb-8 border-b border-gray-200 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium text-gray-900 mr-4">{review.userName}</h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                            } fill-current`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share your thoughts about this product</p>
            {!showReviewForm && (
              <button 
                onClick={() => setShowReviewForm(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-6 rounded-md transition-colors font-medium"
              >
                Write the First Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;