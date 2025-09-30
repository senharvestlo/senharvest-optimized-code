import React, { useRef } from 'react';

export default function FooterAdminTrigger({ onOpen }) {
  const clicksRef = useRef(0);
  const timerRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    clicksRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { clicksRef.current = 0; }, 1200);

    if (clicksRef.current >= 3) {
      clicksRef.current = 0;
      if (typeof onOpen === 'function') onOpen();
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Admin login"
      className="inline-flex items-center focus:outline-none"
      style={{ background: 'transparent' }}
      type="button"
    >
      <img
        src="/senharvest-logo.png"
        alt="SenHarvest"
        className="h-8 w-auto opacity-80 hover:opacity-100 transition"
        draggable={false}
      />
    </button>
  );
}



