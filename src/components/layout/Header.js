import React, { useState } from 'react';
import { COMPANY } from '../../config/company';
import { Container } from '../ui';

/**
 * Header Component
 * Navigation header with logo and language toggle
 */
function Header({ t, lang, setLang, page, setPage, onAdminAccess }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { k: 'home', l: t.home },
    { k: 'products', l: t.products },
    { k: 'services', l: t.services },
    { k: 'mission', l: t.mission },
    { k: 'contact', l: t.contact },
  ];

  const handlePageChange = (pageKey) => {
    console.log('🧭 Navigation clicked:', pageKey);
    setPage(pageKey);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    // Simple clic pour aller à la page d'accueil
    setPage('home');
  };

  const handleCompanyNameClick = () => {
    setPage('home');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <Container>
        <div className="flex justify-between items-center py-4">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleLogoClick}
              className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded" 
              aria-label={`${COMPANY.name} logo - Go to home page`}
            >
              <img 
                src={COMPANY.headerLogoSrc || COMPANY.logoSrc} 
                alt={`${COMPANY.name} logo`} 
                className="w-full h-full object-contain" 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            </button>
            <button 
              onClick={handleCompanyNameClick}
              className="text-left hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded"
            >
              <h1 className="text-2xl font-bold text-brandGray-800">{COMPANY.name}</h1>
              <p className="text-sm text-brandGray-600">Import & Export</p>
            </button>
          </div>

          {/* Navigation and Language Toggle */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav aria-label="Primary" className="hidden md:flex space-x-6">
              {navigationItems.map((item) => (
                <button 
                  key={item.k} 
                  onClick={() => setPage(item.k)} 
                  className={`font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded ${
                    page === item.k 
                      ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                      : 'text-brandGray-700 hover:text-primary-600'
                  }`}
                >
                  {item.l}
                </button>
              ))}
            </nav>
            
            {/* Language Toggle */}
            <button 
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} 
              className="bg-brandGray-200 hover:bg-brandGray-300 text-brandGray-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300" 
              aria-label="Language toggle"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-brandGray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-brandGray-700 transition duration-200 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-full h-0.5 bg-brandGray-700 transition duration-200 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-full h-0.5 bg-brandGray-700 transition duration-200 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-brandGray-200 bg-white">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.k}
                  onClick={() => handlePageChange(item.k)}
                  className={`w-full text-left px-4 py-3 font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded ${
                    page === item.k
                      ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                      : 'text-brandGray-700 hover:text-primary-600 hover:bg-brandGray-50'
                  }`}
                >
                  {item.l}
                </button>
              ))}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;
