import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: 'MEN',
    imgUrl: []
  });
  const [loading, setLoading] = useState(!id);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://ecommerce-d1mr.onrender.com/products/${id}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      setProduct(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = id ? `https://ecommerce-d1mr.onrender.com/products/${id}` : 'https://ecommerce-d1mr.onrender.com/products';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error(id ? 'Failed to update product' : 'Failed to create product');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.message);
    }
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setProduct({
        ...product,
        imgUrl: [...product.imgUrl, newImage.trim()]
      });
      setNewImage('');
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...product.imgUrl];
    newImages.splice(index, 1);
    setProduct({ ...product, imgUrl: newImages });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Edit Product' : 'Create New Product'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({...product, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={product.price}
            onChange={(e) => setProduct({...product, price: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Category</label>
          <select
            value={product.category}
            onChange={(e) => setProduct({...product, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Images</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {product.imgUrl.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="truncate flex-1">{url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            {id ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;