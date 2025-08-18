import React from 'react';
import { useAuth } from './AuthContext';

const Home = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[80vh] bg-gradient-to-r from-amber-50 to-stone-100 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
        
        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
              Timeless
              <br />
              <span className="font-normal">Elegance</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-lg leading-relaxed">
              Discover our curated collection of premium clothing designed for the modern lifestyle.
            </p>
            
            {user && (
              <div className="mb-8">
                <p className="text-base mb-2 opacity-75">
                  Welcome back, <span className="font-semibold text-amber-200">{user.username || user.email.split('@')[0]}</span>
                  {isAdmin() && <span className="ml-2 text-amber-300">(Admin)</span>}
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-none hover:bg-gray-100 transition-all duration-300 font-medium text-sm uppercase tracking-wider">
                Shop Collection
              </button>
              <button className="border border-white text-white px-8 py-4 rounded-none hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium text-sm uppercase tracking-wider">
                Explore More
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Admin Features Notice */}
      {isAdmin() && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Admin Panel Access:</span> You have administrative privileges to manage products and orders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;