import React, { useState } from 'react';
import { COMPANY } from '../../config/company';
import { Container } from '../ui';
import FooterAdminTrigger from './FooterAdminTrigger';
import AdminLoginModal from '../pages/admin/AdminLoginModal';

/**
 * Footer Component
 * Site footer with company information and links
 */
function Footer({ t, lang, setPage }) {
  const [openLogin, setOpenLogin] = useState(false);

  const handleFooterCompanyNameClick = () => {
    setPage('home');
  };
  return (
    <footer className="relative bg-brandGray-900 text-white py-12 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/footer.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      ></div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-brandGray-900/80"></div>
      
      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          {/* Company Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <FooterAdminTrigger onOpen={() => setOpenLogin(true)} />
            </div>
            <button 
              onClick={handleFooterCompanyNameClick}
              className="text-left hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded"
            >
              <h3 className="text-lg font-bold">{COMPANY.name}</h3>
              <p className="text-sm text-brandGray-400">Import & Export</p>
            </button>
          </div>

          {/* Company Structures */}
          <div className="text-center">
            <h4 className="text-sm font-semibold text-brandGray-300 mb-2">
              {lang === "fr" ? "Nos Structures" : "Our Structures"}
            </h4>
            <div className="space-y-1 text-xs text-brandGray-400">
              <p>SenHarvest LLC - {lang === "fr" ? "USA" : "USA"}</p>
              <p>Xidma & Harvest Inc - {lang === "fr" ? "Canada (Structure Mère)" : "Canada (Parent Company)"}</p>
              <p>Xidma & Harvest SARL - {lang === "fr" ? "Sénégal" : "Senegal"}</p>
            </div>
          </div>

          {/* Copyright and Links */}
          <div className="text-center md:text-right">
            <p className="text-brandGray-400">
              &copy; {new Date().getFullYear()} {COMPANY.name}.{' '}
              {lang === "fr" ? "Tous droits réservés." : "All rights reserved."}
            </p>
            <p className="text-sm text-brandGray-500 mt-1">
              {lang === "fr" ? "Du Sénégal au monde entier" : "From Senegal to the world"}
            </p>
            
            <div className="mt-2 flex gap-4 justify-center md:justify-end text-xs text-brandGray-400">
              <button 
                onClick={() => setPage('privacy')}
                className="hover:text-white underline bg-transparent border-none cursor-pointer"
              >
                {t.privacy}
              </button>
              <button 
                onClick={() => setPage('cookies')}
                className="hover:text-white underline bg-transparent border-none cursor-pointer"
              >
                {t.cookie}
              </button>
            </div>
          </div>
        </div>
      </Container>
      {openLogin && <AdminLoginModal onClose={() => setOpenLogin(false)} />}
    </footer>
  );
}

export default Footer;
