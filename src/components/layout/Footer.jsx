import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginModal from '../pages/admin/AdminLoginModal';

export default function Footer() {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const clicksRef = useRef({ count: 0, last: 0 });

  const onLogoClick = () => {
    const now = Date.now();
    const diff = now - clicksRef.current.last;
    clicksRef.current.last = now;

    // Reset si > 1.5s entre clicks
    if (diff > 1500) clicksRef.current.count = 0;

    clicksRef.current.count += 1;
    if (clicksRef.current.count >= 3) {
      clicksRef.current.count = 0;
      setLoginOpen(true);
    }
  };

  return (
    <footer className="border-t mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between">
        <div className="text-sm text-gray-600">© {new Date().getFullYear()} SenHarvest Group</div>

        {/* Logo cliquable 3x */}
        <button onClick={onLogoClick} className="opacity-80 hover:opacity-100 transition">
          <img src="/logo192.png" alt="SenHarvest" className="h-8 w-auto" />
        </button>
      </div>

      {loginOpen && (
        <AdminLoginModal
          onClose={() => setLoginOpen(false)}
          onSuccess={() => {
            setLoginOpen(false);
            navigate('/admin');
          }}
        />
      )}
    </footer>
  );
}
