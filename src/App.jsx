import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./component/AuthContext";
import ProtectedRoute from "./component/ProtectedRoute";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import MenWomen from "./component/MenWomen";
import ViewAllProduct from "./component/ViewAllProduct";
import ProductDetail from "./component/ProductDetail";
import Filter from "./component/Filter";
import Login from "./component/Login";
import Register from "./component/Register";
import ForgotPassword from "./component/ForgotPassword";
import Cart from "./component/Cart";
import BuyProduct from "./component/BuyProduct";
import AdminOrdersPage from "./component/AdminOrdersPage";
import AdminProductsPage from "./component/AdminProductsPage";
import EditProductPage from "./component/EditProductPage";

function App() {
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    category: null,
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="relative">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <div className="pt-16">
                      <Home />
                      <MenWomen />
                      <div className="bg-white py-12">
                        <div className="container mx-auto px-4">
                          <Filter onFilterChange={handleFilterChange} />
                          <ViewAllProduct filters={filters} />
                        </div>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mens"
                element={
                  <ProtectedRoute>
                    <div className="pt-20 bg-white min-h-screen">
                      <ViewAllProduct gender="MEN" />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/womens"
                element={
                  <ProtectedRoute>
                    <div className="pt-20 bg-white min-h-screen">
                      <ViewAllProduct gender="WOMEN" />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buy/:id"
                element={
                  <ProtectedRoute>
                    <div className="pt-20 bg-gray-50 min-h-screen">
                      <BuyProduct />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/:id"
                element={
                  <ProtectedRoute>
                    <div className="pt-20 bg-gray-50 min-h-screen">
                      <ProductDetail />
                    </div>
                  </ProtectedRoute>
                }
              />
              
              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <div className="pt-20 bg-gray-50 min-h-screen">
                      <div className="container mx-auto px-4 py-8">
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                          <h1 className="text-3xl font-light text-gray-900 mb-4">Admin Dashboard</h1>
                          <p className="text-gray-600 mb-8">Manage your store products and orders</p>
                          <div className="grid md:grid-cols-2 gap-6 max-w-md mx-auto">
                            <a 
                              href="/admin/products"
                              className="bg-gray-900 hover:bg-gray-800 text-white p-6 rounded-lg transition-colors text-center"
                            >
                              <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              <div className="font-medium">Products</div>
                            </a>
                            <a 
                              href="/admin/orders"
                              className="bg-gray-900 hover:bg-gray-800 text-white p-6 rounded-lg transition-colors text-center"
                            >
                              <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                              </svg>
                              <div className="font-medium">Orders</div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <div className="pt-20 bg-gray-50 min-h-screen">
                      <AdminOrdersPage />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <div className="pt-20 bg-gray-50 min-h-screen">
                      <AdminProductsPage />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products/edit/:id"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <div className="pt-20 bg-gray-50 min-h-screen">
                      <EditProductPage />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products/new"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <div className="pt-20 bg-gray-50 min-h-screen">
                      <EditProductPage />
                    </div>
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;