import React, { useState, useEffect } from 'react';
import useLang from './hooks/useLang';
import { updateSEO } from './utils/seo';
import { generateProductInquiry } from './utils/whatsapp';
import { trackPageView, trackContactForm, trackAdminAccess } from './config/analytics';
import { Header, Footer, WhatsAppFloat } from './components/layout';
import { Home, Products, Services, Mission, Contact, Admin, PrivacyPolicy, CookiePolicy } from './components/pages';
import './App.css';

/**
 * Main App Component
 * Handles routing, SEO, and global state management
 */
function App() {
  const { lang, setLang, t } = useLang();
  const [page, setPage] = useState("home");

  // Update SEO when language or page changes
  useEffect(() => {
    updateSEO(lang);
  }, [lang]);

  // Track page views when page changes
  useEffect(() => {
    trackPageView(`/${page}`);
  }, [page]);

  // Handle product inquiry form opening
  const handleProductInquiry = (productName) => {
    setPage('contact');
    // Pre-fill the subject field with the product name
    setTimeout(() => {
      const subjectField = document.querySelector('input[name="subject"]');
      if (subjectField) {
        subjectField.value = productName;
        subjectField.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
  };

  // Handle service inquiry form opening
  const handleServiceInquiry = (serviceName) => {
    setPage('contact');
    setTimeout(() => {
      const subjectField = document.querySelector('input[name="subject"]');
      if (subjectField) {
        subjectField.value = serviceName;
        subjectField.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
  };

  // Handle form submission completion
  const handleFormSubmit = () => {
    trackContactForm();
    console.log('Form submitted successfully');
  };

  // Generate WhatsApp link for general inquiry
  const generateWhatsAppLink = () => {
    return generateProductInquiry(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lightGreen-50 to-gold-50">
      {/* Header */}
      <Header 
        t={t} 
        lang={lang} 
        setLang={setLang} 
        page={page} 
        setPage={setPage} 
      />

      {/* Main Content */}
      <main>
        {page === 'home' && (
          <Home 
            t={t} 
            lang={lang} 
            setPage={setPage} 
            onWhatsApp={generateWhatsAppLink} 
          />
        )}
        
        {page === 'products' && (
          <Products 
            t={t} 
            lang={lang} 
            onOpenForm={handleProductInquiry} 
          />
        )}
        
        {page === 'services' && (
          <Services 
            t={t} 
            lang={lang} 
            onOpenForm={handleServiceInquiry} 
          />
        )}
        
        {page === 'mission' && (
          <Mission 
            t={t} 
            lang={lang} 
          />
        )}
        
        {page === 'contact' && (
          <Contact 
            t={t} 
            lang={lang} 
            onSubmit={handleFormSubmit} 
          />
        )}
        
        {page === 'admin' && (
          <Admin 
            t={t} 
            lang={lang} 
            onAccess={() => trackAdminAccess()}
          />
        )}
        
        {page === 'privacy' && (
          <PrivacyPolicy 
            t={t} 
            lang={lang} 
          />
        )}
        
        {page === 'cookies' && (
          <CookiePolicy 
            t={t} 
            lang={lang} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer t={t} lang={lang} setPage={setPage} />

      {/* Floating WhatsApp Button */}
      <WhatsAppFloat lang={lang} />
    </div>
  );
}

export default App;
