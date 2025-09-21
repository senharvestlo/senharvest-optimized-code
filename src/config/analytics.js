// Google Analytics Configuration
export const GA_TRACKING_ID = 'G-FJH7JD5W2Q';

// Initialize Google Analytics
export const initGA = () => {
  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName) => {
  trackEvent('form_submit', 'engagement', formName);
};

// Track button clicks
export const trackButtonClick = (buttonName) => {
  trackEvent('click', 'engagement', buttonName);
};

// Track product views
export const trackProductView = (productName) => {
  trackEvent('view_item', 'ecommerce', productName);
};

// Track contact form submissions
export const trackContactForm = () => {
  trackEvent('contact_form_submit', 'lead_generation', 'contact_page');
};

// Track proforma access
export const trackProformaAccess = () => {
  trackEvent('proforma_access', 'admin_action', 'proforma_page');
};

// Track sourcing access
export const trackSourcingAccess = () => {
  trackEvent('sourcing_access', 'admin_action', 'sourcing_page');
};

// Track admin access
export const trackAdminAccess = () => {
  trackEvent('admin_access', 'admin_action', 'admin_page');
};
