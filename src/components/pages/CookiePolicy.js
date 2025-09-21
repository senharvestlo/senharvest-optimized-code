import React, { useState, useEffect } from 'react';
import { Container } from '../ui';

function CookiePolicy({ t, lang }) {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false
  });

  // Load saved preferences on component mount
  useEffect(() => {
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      setCookiePreferences(prevPrefs => ({ ...prevPrefs, ...preferences }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save preferences to localStorage
  const savePreferences = (prefs) => {
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    setCookiePreferences(prefs);
  };

  // Handle preference change
  const handlePreferenceChange = (type, value) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    const newPrefs = { ...cookiePreferences, [type]: value };
    savePreferences(newPrefs);
  };

  // Accept all cookies
  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    savePreferences(allAccepted);
  };

  // Accept only necessary cookies
  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    savePreferences(necessaryOnly);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🍪 {lang === 'fr' ? 'Gestion des Cookies' : 'Cookie Management'} – SenHarvest Group
            </h1>
            <p className="text-gray-600">
              {lang === 'fr' 
                ? 'Contrôlez vos préférences de cookies pour une expérience personnalisée'
                : 'Control your cookie preferences for a personalized experience'
              }
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? 'Qu\'est-ce que les cookies ?' : 'What are cookies?'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {lang === 'fr' 
                  ? 'Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez notre site web. Ils nous aident à améliorer votre expérience de navigation et à comprendre comment vous utilisez notre site.'
                  : 'Cookies are small text files stored on your device when you visit our website. They help us improve your browsing experience and understand how you use our site.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? 'Types de cookies utilisés' : 'Types of cookies used'}
              </h2>
              
              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lang === 'fr' ? 'Cookies Nécessaires' : 'Necessary Cookies'}
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.necessary}
                        disabled
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        {lang === 'fr' ? 'Toujours actifs' : 'Always active'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {lang === 'fr' 
                      ? 'Ces cookies sont essentiels au fonctionnement du site web. Ils incluent les cookies de session, d\'authentification et de sécurité. Ils ne peuvent pas être désactivés.'
                      : 'These cookies are essential for the website to function. They include session, authentication and security cookies. They cannot be disabled.'
                    }
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lang === 'fr' ? 'Cookies d\'Analyse' : 'Analytics Cookies'}
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        {cookiePreferences.analytics 
                          ? (lang === 'fr' ? 'Activé' : 'Enabled')
                          : (lang === 'fr' ? 'Désactivé' : 'Disabled')
                        }
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    {lang === 'fr' 
                      ? 'Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site web en collectant des informations de manière anonyme.'
                      : 'These cookies help us understand how visitors interact with our website by collecting information anonymously.'
                    }
                  </p>
                  <p className="text-gray-600 text-xs">
                    {lang === 'fr' 
                      ? 'Utilisé par : Google Analytics pour analyser le trafic et l\'utilisation du site.'
                      : 'Used by: Google Analytics to analyze traffic and site usage.'
                    }
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lang === 'fr' ? 'Cookies Marketing' : 'Marketing Cookies'}
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        {cookiePreferences.marketing 
                          ? (lang === 'fr' ? 'Activé' : 'Enabled')
                          : (lang === 'fr' ? 'Désactivé' : 'Disabled')
                        }
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    {lang === 'fr' 
                      ? 'Ces cookies sont utilisés pour afficher des publicités pertinentes et mesurer l\'efficacité des campagnes publicitaires.'
                      : 'These cookies are used to display relevant advertisements and measure the effectiveness of advertising campaigns.'
                    }
                  </p>
                  <p className="text-gray-600 text-xs">
                    {lang === 'fr' 
                      ? 'Utilisé par : Réseaux publicitaires et partenaires marketing pour personnaliser les annonces.'
                      : 'Used by: Advertising networks and marketing partners to personalize ads.'
                    }
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? 'Gestion des cookies' : 'Cookie Management'}
              </h2>
              <p className="text-gray-700 mb-4">
                {lang === 'fr' 
                  ? 'Vous pouvez modifier vos préférences de cookies à tout moment en utilisant les contrôles ci-dessus ou en supprimant les cookies de votre navigateur.'
                  : 'You can modify your cookie preferences at any time using the controls above or by deleting cookies from your browser.'
                }
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {lang === 'fr' ? 'Comment supprimer les cookies :' : 'How to delete cookies:'}
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>Chrome :</strong> {lang === 'fr' ? 'Paramètres > Confidentialité et sécurité > Cookies' : 'Settings > Privacy and security > Cookies'}</li>
                  <li><strong>Firefox :</strong> {lang === 'fr' ? 'Options > Vie privée et sécurité > Cookies' : 'Options > Privacy & Security > Cookies'}</li>
                  <li><strong>Safari :</strong> {lang === 'fr' ? 'Préférences > Confidentialité > Cookies' : 'Preferences > Privacy > Cookies'}</li>
                  <li><strong>Edge :</strong> {lang === 'fr' ? 'Paramètres > Cookies et autorisations de site' : 'Settings > Cookies and site permissions'}</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? 'Durée de conservation' : 'Retention Period'}
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>{lang === 'fr' ? 'Cookies de session : Supprimés à la fermeture du navigateur' : 'Session cookies: Deleted when browser is closed'}</li>
                <li>{lang === 'fr' ? 'Cookies persistants : 12 mois maximum' : 'Persistent cookies: Maximum 12 months'}</li>
                <li>{lang === 'fr' ? 'Cookies d\'analyse : 24 mois maximum' : 'Analytics cookies: Maximum 24 months'}</li>
                <li>{lang === 'fr' ? 'Cookies marketing : 13 mois maximum' : 'Marketing cookies: Maximum 13 months'}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? 'Contact' : 'Contact'}
              </h2>
              <p className="text-gray-700 mb-4">
                {lang === 'fr' 
                  ? 'Pour toute question concernant notre utilisation des cookies, contactez-nous :'
                  : 'For any questions regarding our use of cookies, contact us:'
                }
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">📧 abdoulahat.lo@senharvest.com</p>
                <p className="text-gray-600 text-sm">
                  {lang === 'fr' 
                    ? 'Nous répondrons à votre demande dans les 30 jours ouvrés.'
                    : 'We will respond to your request within 30 business days.'
                  }
                </p>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={acceptAll}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {lang === 'fr' ? 'Accepter tous les cookies' : 'Accept All Cookies'}
              </button>
              <button
                onClick={acceptNecessary}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {lang === 'fr' ? 'Accepter uniquement les cookies nécessaires' : 'Accept Only Necessary Cookies'}
              </button>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <p className="text-gray-700 text-sm">
                {lang === 'fr' 
                  ? '✅ Vos préférences de cookies ont été sauvegardées. Vous pouvez les modifier à tout moment.'
                  : '✅ Your cookie preferences have been saved. You can modify them at any time.'
                }
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default CookiePolicy;
