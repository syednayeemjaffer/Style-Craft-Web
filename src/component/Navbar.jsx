import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../component/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCartItemCount();
    }
  }, [isAuthenticated]);

  const fetchCartItemCount = async () => {
    try {
      const response = await fetch("https://ecommerce-w3qm.onrender.com/products/cart", {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const cartItems = await response.json();
        const totalItems = cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartItemCount(totalItems);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl lg:text-3xl font-light text-gray-900 tracking-wide hover:text-gray-700 transition-colors"
          >
            StyleCraft
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {isAuthenticated() ? (
              <>
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Shop
                </Link>
                <Link 
                  to="/womens" 
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Women
                </Link>
                <Link 
                  to="/mens" 
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Men
                </Link>
                
                {/* Admin Links */}
                {isAdmin() && (
                  <>
                    <Link
                      to="/admin/orders"
                      className="text-amber-600 hover:text-amber-700 transition-colors font-medium text-sm uppercase tracking-wider"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/admin/products"
                      className="text-amber-600 hover:text-amber-700 transition-colors font-medium text-sm uppercase tracking-wider"
                    >
                      Products
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated() && (
              <>
                {/* Search Icon */}
                <button className="text-gray-700 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* User Icon */}
                <button className="text-gray-700 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={fetchCartItemCount}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L21 18M7 13v6a2 2 0 002 2h10a2 2 0 002-2v-6M7 13H5" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-600">
                    {user?.username || user?.email.split("@")[0]}
                    {isAdmin() && (
                      <span className="ml-1 text-amber-600 text-xs">(Admin)</span>
                    )}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="py-4 space-y-4 border-t border-gray-200">
            {isAuthenticated() ? (
              <>
                <Link 
                  to="/" 
                  className="block text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link 
                  to="/womens" 
                  className="block text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Women
                </Link>
                <Link 
                  to="/mens" 
                  className="block text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Men
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Link>

                {isAdmin() && (
                  <>
                    <Link
                      to="/admin/orders"
                      className="block text-amber-600 hover:text-amber-700 transition-colors font-medium text-sm uppercase tracking-wider"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Orders
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block text-amber-600 hover:text-amber-700 transition-colors font-medium text-sm uppercase tracking-wider"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Products
                    </Link>
                  </>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {user?.username || user?.email.split("@")[0]}
                      {isAdmin() && (
                        <span className="ml-1 text-amber-600 text-xs">(Admin)</span>
                      )}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium text-sm uppercase tracking-wider text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;