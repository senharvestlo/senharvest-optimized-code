import React, { useState } from 'react';
import { COMPANY } from '../../config/company';
import { Container, SectionTitle, Input, Select, Textarea, Button } from '../ui';
import { submitContact } from '../../services/firebaseService';

// Cloud Function endpoint (set in .env/.env.local as REACT_APP_CF_SENDCONTACT_URL)
const CF_ENDPOINT = process.env.REACT_APP_CF_SENDCONTACT_URL;

async function postContactToCF(form) {
  if (!CF_ENDPOINT) return null;
  const r = await fetch(CF_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!r.ok) throw new Error('Cloud Function error');
  return r.json();
}
// Form utilities moved inline
const getInitialFormState = () => ({
  name: '',
  email: '',
  phone: '',
  subject: '',
  quantity: '',
  destination: '',
  incoterm: '',
  payment: '',
  message: ''
});

const validateForm = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  if (!form.subject.trim()) errors.subject = 'Subject is required';
  if (!form.message.trim()) errors.message = 'Message is required';
  return errors;
};

const submitToFormspree = async (formData) => {
  // Prefer Cloud Function (emails + Firestore), then Firestore, then mailto fallback
  try {
    const cf = await postContactToCF(formData);
    if (cf) return { status: 'cf_ok' };
  } catch {}
  try {
    await submitContact(formData);
    return { status: 'firestore_ok' };
  } catch {}
  const subject = encodeURIComponent(`[SenHarvest] ${formData.subject}`);
  const body = encodeURIComponent(`
Nouvelle demande de contact - SenHarvest Group

INFORMATIONS CLIENT:
Nom: ${formData.name}
Email: ${formData.email}
Téléphone: ${formData.phone}

DÉTAILS DE LA DEMANDE:
Sujet: ${formData.subject}
Quantité: ${formData.quantity}
Destination: ${formData.destination}
Incoterm: ${formData.incoterm}
Mode de paiement: ${formData.payment}

MESSAGE:
${formData.message}

---
Email envoyé depuis le site web SenHarvest Group
Date: ${new Date().toLocaleString('fr-FR')}
  `);
  
  const mailtoLink = `mailto:manager@senharvest.com?subject=${subject}&body=${body}`;
  window.open(mailtoLink);
  return { status: 'mailto_sent' };
};

/**
 * Contact Page Component
 * Contact form and company information
 */
function Contact({ t, lang, onSubmit }) {
  const [form, setForm] = useState(getInitialFormState());
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setBusy(true);
    setErrors({});
    
    try {
      await submitToFormspree(form);
      alert(lang === 'fr' 
        ? 'Votre client email va s\'ouvrir avec un message pré-rempli. Veuillez l\'envoyer pour finaliser votre demande.' 
        : 'Your email client will open with a pre-filled message. Please send it to complete your request.'
      );
      onSubmit();
      setForm(getInitialFormState());
    } catch (error) {
      console.error('Form submission error:', error);
      alert(t.alertError);
    } finally {
      setBusy(false);
    }
  };

  const incotermOptions = [
    { value: "FOB", label: "FOB" },
    { value: "CIF", label: "CIF" }
  ];

  const paymentOptions = [
    { 
      value: "LC", 
      label: lang === 'fr' ? 'Lettre de Crédit' : 'Letter of Credit' 
    },
    { 
      value: "Advance", 
      label: lang === 'fr' ? 'Paiement anticipé' : 'Advance Payment' 
    },
    { value: "TT", label: "TT" }
  ];

  return (
    <div className="py-20 px-4">
      <Container>
        <SectionTitle title={t.contactTitle} subtitle={t.contactDesc} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold mb-6">{t.contactInfo}</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 text-green-600">📍</span>
                <span>{lang === 'fr' ? COMPANY.addressFR : COMPANY.addressEN}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 text-green-600">✉️</span>
                <a href={`mailto:${COMPANY.email}`} className="underline">
                  {COMPANY.email}
                </a>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 text-green-600">📞</span>
                <div>
                  <a href={`tel:${COMPANY.phoneCA}`} className="underline">
                    {COMPANY.phoneCA}
                  </a>
                  <p className="text-sm text-gray-600">
                    {lang === 'fr' ? 'USA/Canada' : 'USA/Canada'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 text-green-600">📞</span>
                <div>
                  <a href={`tel:${COMPANY.phoneSN}`} className="underline">
                    {COMPANY.phoneSN}
                  </a>
                  <p className="text-sm text-gray-600">
                    {lang === 'fr' ? 'Sénégal' : 'Senegal'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-3">{t.founders}</h4>
              <p className="text-gray-600 text-sm">
                {lang === 'fr' 
                  ? "Équipe binationale combinant expertise agricole sénégalaise et réseau international canadien."
                  : "Binational team combining Senegalese agricultural expertise and Canadian international network."}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Honeypot field */}
            <input 
              type="text" 
              name="company" 
              value={form.company} 
              onChange={handleInputChange} 
              className="hidden" 
              aria-hidden="true" 
            />
            
            <Input
              label={t.subject}
              name="subject"
              value={form.subject}
              onChange={handleInputChange}
              placeholder={lang === 'fr' ? 'Ex: Arachides, Courtage...' : 'Ex: Peanuts, Brokerage...'}
              required
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t.quantity}
                name="quantity"
                value={form.quantity}
                onChange={handleInputChange}
                placeholder={lang === 'fr' ? 'Ex: 10 tonnes' : 'Ex: 10 tons'}
                className={errors.quantity ? 'border-red-500' : ''}
              />
              
              <Input
                label={t.destination}
                name="destination"
                value={form.destination}
                onChange={handleInputChange}
                placeholder={lang === 'fr' ? "Pays d'importation" : 'Import country'}
                className={errors.destination ? 'border-red-500' : ''}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label={t.incoterm}
                name="incoterm"
                value={form.incoterm}
                onChange={handleInputChange}
                options={incotermOptions}
              />
              
              <Select
                label={t.payment}
                name="payment"
                value={form.payment}
                onChange={handleInputChange}
                options={paymentOptions}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t.name}
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              
              <Input
                label={t.email}
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                required
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            
            <Input
              label={t.phone}
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              required
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            
            <Textarea
              label={t.message}
              name="message"
              value={form.message}
              onChange={handleInputChange}
              placeholder={lang === 'fr' ? 'Votre demande détaillée...' : 'Your detailed request...'}
            />
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={busy}
              className="w-full"
            >
              {busy 
                ? (lang === 'fr' ? 'Envoi…' : 'Sending…') 
                : t.send
              }
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Contact;
