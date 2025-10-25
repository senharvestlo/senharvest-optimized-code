import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useLang from './hooks/useLang';
import { updateSEO } from './utils/seo';
import { trackPageView, trackContactForm, trackAdminAccess } from './config/analytics';
import { Header, Footer, WhatsAppFloat } from './components/layout';
import { Home, Products, Services, Mission, Contact, PrivacyPolicy, CookiePolicy, QuotationPage } from './components/pages';
import AdminDashboard from './components/pages/AdminDashboard';
import ProtectedRoute from './components/security/ProtectedRoute';
import AdminLoginModal from './components/pages/AdminLoginModal';
import './App.css';

/**
 * Main App Component
 * Handles routing, SEO, and global state management
 */
function MainShell() {
  const { lang, setLang, t } = useLang();
  const [page, setPage] = useState("home");
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Update SEO when language or page changes
  React.useEffect(() => {
    updateSEO(lang);
    console.log('🔍 SEO updated for language:', lang);
  }, [lang]);

  // Track page views when page changes
  React.useEffect(() => {
    trackPageView(`/${page}`);
    console.log('📊 Page view tracked:', page);
  }, [page]);

  // Handle product inquiry form opening
  const handleProductInquiry = (productName) => {
    setPage('contact');
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

  // Handle admin access
  const handleAdminAccess = () => {
    trackAdminAccess();
    setShowAdminModal(true);
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
        onAdminAccess={handleAdminAccess}
      />

      {/* Main Content */}
      <main>
        {page === 'home' && (
          <Home 
            t={t} 
            lang={lang} 
            setPage={setPage} 
            onProductInquiry={handleProductInquiry}
            onServiceInquiry={handleServiceInquiry}
          />
        )}
        
        {page === 'products' && (
          <Products 
            t={t} 
            lang={lang} 
            onProductInquiry={handleProductInquiry}
          />
        )}
        
        {page === 'services' && (
          <Services 
            t={t} 
            lang={lang} 
            onServiceInquiry={handleServiceInquiry}
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
        
        {page === 'quotation' && (
          <QuotationPage />
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
      <WhatsAppFloat />

      {/* Admin Login Modal */}
      {showAdminModal && (
        <AdminLoginModal onClose={() => setShowAdminModal(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Shell with all pages */}
        <Route path="/" element={<MainShell />} />
        
        {/* Page Admin protégée */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;