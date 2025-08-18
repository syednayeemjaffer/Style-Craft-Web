import React from 'react';
import { Link } from 'react-router-dom';

const MenWomen = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our carefully curated collections designed for every style and occasion
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Women's Collection */}
          <div className="group relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Women's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-light mb-2">Women</h3>
              <p className="text-white/80 mb-6 text-sm md:text-base">
                Elegant pieces that celebrate femininity and modern sophistication
              </p>
              <Link
                to="/womens"
                className="inline-flex items-center bg-white text-gray-900 px-6 py-3 hover:bg-gray-100 transition-all duration-300 group/btn"
              >
                <span className="font-medium text-sm uppercase tracking-wider">Explore Women</span>
                <svg 
                  className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Men's Collection */}
          <div className="group relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Men's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-light mb-2">Men</h3>
              <p className="text-white/80 mb-6 text-sm md:text-base">
                Refined menswear that combines classic style with contemporary comfort
              </p>
              <Link
                to="/mens"
                className="inline-flex items-center bg-white text-gray-900 px-6 py-3 hover:bg-gray-100 transition-all duration-300 group/btn"
              >
                <span className="font-medium text-sm uppercase tracking-wider">Explore Men</span>
                <svg 
                  className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600 text-sm">
              Crafted from the finest materials with attention to every detail
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">
              Quick and reliable shipping to bring your favorites to your door
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Satisfaction Guaranteed</h3>
            <p className="text-gray-600 text-sm">
              30-day return policy ensures you're completely satisfied
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenWomen;