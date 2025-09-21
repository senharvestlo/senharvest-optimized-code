import React from 'react';
import { generateGeneralInquiry } from '../../utils/whatsapp';

/**
 * WhatsApp Floating Button Component
 * Fixed floating WhatsApp button for quick contact
 */
function WhatsAppFloat({ lang }) {
  return (
    <a 
      href={generateGeneralInquiry(lang)} 
      target="_blank" 
      rel="noreferrer" 
      className="fixed bottom-8 right-8 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-2xl transition duration-200 z-50 animate-bounce focus:outline-none focus:ring-4 focus:ring-primary-300" 
      aria-label="Open WhatsApp"
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
      </svg>
    </a>
  );
}

export default WhatsAppFloat;
