import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useLang from './hooks/useLang';
import { updateSEO } from './utils/seo';
import { generateProductInquiry } from './utils/whatsapp';
import { trackPageView, trackContactForm, trackAdminAccess } from './config/analytics';
import { Header, Footer, WhatsAppFloat } from './components/layout';
import { Home, Products, Services, Mission, Contact, Admin, PrivacyPolicy, CookiePolicy, QuotationPage } from './components/pages';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import LogoutPage from './components/pages/admin/LogoutPage';
import ContactRequests from './components/pages/admin/ContactRequests';
import DocsList from './pages/admin/DocsList';
import EditQuotation from './pages/admin/EditQuotation';
import EditProforma from './pages/admin/EditProforma';
import NCNDAEditor from './pages/admin/ncnda/NCNDAEditor';
import NCNDAList from './pages/admin/ncnda/NCNDAList';
import PSAEditor from './pages/admin/psa/PSAEditor';
import PSAList from './pages/admin/psa/PSAList';
import SpecsList from './pages/admin/specs/SpecsList';
import EditSpec from './pages/admin/specs/EditSpec';
import { AuthProvider } from './context/AuthContext';
import './App.css';

/**
 * Main App Component
 * Handles routing, SEO, and global state management
 */
function MainShell() {
  const { lang, setLang, t } = useLang();
  const [page, setPage] = useState("home");

  // Log to console for debugging
  console.log('🌐 SenHarvest Website loaded successfully!');
  console.log('📄 Current page:', page);
  console.log('🌍 Current language:', lang);

  // Update SEO when language or page changes
  useEffect(() => {
    updateSEO(lang);
    console.log('🔍 SEO updated for language:', lang);
  }, [lang]);

  // Track page views when page changes
  useEffect(() => {
    trackPageView(`/${page}`);
    console.log('📊 Page view tracked:', page);
  }, [page]);

  // Handle product inquiry form opening
  const handleProductInquiry = (productName) => {
    console.log('📧 Product inquiry requested for:', productName);
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
        {page === 'quotation' && (
          <QuotationPage />
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
      {/* WhatsApp button hidden per request */}
    </div>
  );
}

// EditWrapper component removed - AdminDocEditor doesn't exist

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Nouveau système Proforma/Devis avec collections séparées */}
          <Route path="/admin/docs" element={<DocsList/>} />
          <Route path="/admin/quotation/:id" element={<EditQuotation/>} />
          <Route path="/admin/proforma/:id" element={<EditProforma/>} />
          
          {/* NCNDA system */}
          <Route path="/admin/ncnda" element={<NCNDAList/>} />
          <Route path="/admin/ncnda/new" element={<NCNDAEditor/>} />
          <Route path="/admin/ncnda/:id" element={<NCNDAEditor/>} />
          
          {/* PSA (Profit-Sharing Agreements) system */}
          <Route path="/admin/psa" element={<PSAList/>} />
          <Route path="/admin/psa/new" element={<PSAEditor/>} />
          <Route path="/admin/psa/:id" element={<PSAEditor/>} />
          
          {/* Product Specifications */}
          <Route path="/admin/specs" element={<SpecsList/>} />
          <Route path="/admin/specs/:id" element={<EditSpec/>} />
          
          {/* Contact Requests */}
          <Route path="/admin/contact-requests" element={<ContactRequests/>} />
          
          {/* Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/logout" element={<LogoutPage />} />
          <Route path="/*" element={<MainShell/>} />
        </Routes>
        <WhatsAppFloat />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
