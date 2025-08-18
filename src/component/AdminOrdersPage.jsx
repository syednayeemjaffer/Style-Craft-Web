import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminOrdersPage = () => {
  const { getAuthHeaders, isAdmin } = useAuth();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAdmin()) {
      fetchOrders();
    }
  }, [isAdmin]);

 // In AdminOrdersPage.js, ensure the fetchOrders function is correct:
const fetchOrders = async () => {
  try {
    const [pendingRes, deliveredRes] = await Promise.all([
      fetch('https://ecommerce-d1mr.onrender.com/admin/orders/pending', {
        headers: getAuthHeaders()
      }),
      fetch('https://ecommerce-d1mr.onrender.com/admin/orders/delivered', {
        headers: getAuthHeaders()
      })
    ]);

    if (!pendingRes.ok) throw new Error('Failed to fetch pending orders');
    if (!deliveredRes.ok) throw new Error('Failed to fetch delivered orders');

    setPendingOrders(await pendingRes.json());
    setDeliveredOrders(await deliveredRes.json());
  } catch (error) {
    console.error('Error fetching orders:', error);
    setError(error.message);
  }
};

  const handleDeliverOrder = async (orderId) => {
    try {
      const response = await fetch(`https://ecommerce-d1mr.onrender.com/admin/orders/deliver/${orderId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        fetchOrders(); // Refresh the orders list
      }
    } catch (error) {
      console.error('Error delivering order:', error);
    }
  };

  return (
    
    <div className="container mx-auto p-4">
    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )}
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'pending' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Orders ({pendingOrders.length})
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'delivered' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered Orders ({deliveredOrders.length})
        </button>
      </div>

      {activeTab === 'pending' ? (
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <p>No pending orders</p>
          ) : (
            pendingOrders.map(order => (
              <div key={order.id} className="border p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{order.customerName}</h3>
                    <p className="text-gray-600">{order.email}</p>
                    <p className="text-gray-600">{order.address}</p>
                    <p className="mt-2">
                      Ordered: {order.noProduct} x {order.product?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeliverOrder(order.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Mark as Delivered
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {deliveredOrders.length === 0 ? (
            <p>No delivered orders yet</p>
          ) : (
            deliveredOrders.map(order => (
              <div key={order.id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                <div>
                  <h3 className="font-medium">{order.customerName}</h3>
                  <p className="text-gray-600">{order.email}</p>
                  <p className="text-gray-600">{order.address}</p>
                  <p className="mt-2">
                    Delivered: {order.noProduct} x {order.product?.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Delivered on: {new Date(order.deliveryDate).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;