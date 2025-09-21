import { COMPANY } from '../config/company';

/**
 * SEO Utility Functions
 * Handles dynamic SEO meta tags and structured data
 */

/**
 * Updates page title and meta description
 * @param {string} lang - Language code ('fr' or 'en')
 * @param {string} pageTitle - Optional page-specific title
 */
export function updatePageMeta(lang, pageTitle = '') {
  const baseTitle = `${COMPANY.name} — Import & Export`;
  document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;

  const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
  metaDesc.setAttribute('name', 'description');
  metaDesc.setAttribute('content', lang === 'fr' ? COMPANY.taglineFR : COMPANY.taglineEN);
  
  if (!document.querySelector('meta[name="description"]')) {
    document.head.appendChild(metaDesc);
  }
}

/**
 * Generates and injects JSON-LD structured data
 * @param {string} lang - Language code ('fr' or 'en')
 */
export function injectStructuredData(lang) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    url: `https://${COMPANY.domain}`,
    logo: COMPANY.logoSrc,
    email: COMPANY.email,
    telephone: [COMPANY.phoneSN, COMPANY.phoneCA],
    sameAs: [],
    address: [
      { '@type': 'PostalAddress', addressLocality: 'Dakar', addressCountry: 'SN' },
      { '@type': 'PostalAddress', addressLocality: 'Montreal', addressCountry: 'CA' }
    ],
    description: lang === 'fr' ? COMPANY.taglineFR : COMPANY.taglineEN,
  };

  const scriptId = 'jsonld-org';
  let script = document.getElementById(scriptId);
  
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(structuredData);
}

/**
 * Updates all SEO elements for a page
 * @param {string} lang - Language code ('fr' or 'en')
 * @param {string} pageTitle - Optional page-specific title
 */
export function updateSEO(lang, pageTitle = '') {
  updatePageMeta(lang, pageTitle);
  injectStructuredData(lang);
}
