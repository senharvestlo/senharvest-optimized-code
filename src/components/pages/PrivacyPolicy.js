import React from 'react';
import { Container } from '../ui';

function PrivacyPolicy({ t, lang }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🔒 {lang === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'} – SenHarvest Group
            </h1>
            <p className="text-gray-600">
              {lang === 'fr' 
                ? 'Dernière mise à jour : Septembre 2024' 
                : 'Last updated: September 2024'
              }
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? '1. Introduction' : '1. Introduction'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {lang === 'fr' 
                  ? 'Chez SenHarvest Group (SenHarvest LLC – USA, Xidma & Harvest – Sénégal et Canada), la protection de vos données personnelles et de vos informations commerciales est une priorité. Cette politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos données lorsque vous utilisez notre site web et nos services de courtage, de sourcing et de commerce international.'
                  : 'At SenHarvest Group (SenHarvest LLC – USA, Xidma & Harvest – Senegal and Canada), protecting your personal data and business information is a priority. This privacy policy describes how we collect, use, store and protect your data when you use our website and our brokerage, sourcing and international trade services.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? '2. Données que nous collectons' : '2. Data We Collect'}
              </h2>
              <p className="text-gray-700 mb-4">
                {lang === 'fr' ? 'Nous pouvons collecter les informations suivantes :' : 'We may collect the following information:'}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>{lang === 'fr' ? 'Informations d\'entreprise :' : 'Business information:'}</strong> 
                  {lang === 'fr' 
                    ? ' raison sociale, adresse, immatriculation, NINEA/tax ID, licences import/export.'
                    : ' company name, address, registration, NINEA/tax ID, import/export licenses.'
                  }
                </li>
                <li>
                  <strong>{lang === 'fr' ? 'Coordonnées :' : 'Contact details:'}</strong> 
                  {lang === 'fr' 
                    ? ' nom, fonction, email, numéro de téléphone, site web.'
                    : ' name, position, email, phone number, website.'
                  }
                </li>
                <li>
                  <strong>{lang === 'fr' ? 'Informations transactionnelles :' : 'Transactional information:'}</strong> 
                  {lang === 'fr' 
                    ? ' demandes de devis (RFQ), commandes, proforma, factures, paiements.'
                    : ' quote requests (RFQ), orders, proforma, invoices, payments.'
                  }
                </li>
                <li>
                  <strong>{lang === 'fr' ? 'Documents contractuels :' : 'Contractual documents:'}</strong> 
                  {lang === 'fr' 
                    ? ' certificats d\'origine, certificats sanitaires/phytosanitaires, factures commerciales, connaissements (B/L).'
                    : ' certificates of origin, sanitary/phytosanitary certificates, commercial invoices, bills of lading (B/L).'
                  }
                </li>
                <li>
                  <strong>{lang === 'fr' ? 'Données techniques :' : 'Technical data:'}</strong> 
                  {lang === 'fr' 
                    ? ' adresse IP, cookies de navigation, langue du navigateur, données de connexion.'
                    : ' IP address, browsing cookies, browser language, connection data.'
                  }
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? '3. Utilisation des données' : '3. Data Usage'}
              </h2>
              <p className="text-gray-700 mb-4">
                {lang === 'fr' ? 'Vos données sont utilisées pour :' : 'Your data is used to:'}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>{lang === 'fr' ? 'Faciliter les transactions commerciales internationales (export, import, courtage).' : 'Facilitate international trade transactions (export, import, brokerage).'}</li>
                <li>{lang === 'fr' ? 'Vérifier l\'authenticité des entreprises (KYC, licences, conformité).' : 'Verify business authenticity (KYC, licenses, compliance).'}</li>
                <li>{lang === 'fr' ? 'Gérer la logistique (expéditions, certificats, transport maritime/terrestre).' : 'Manage logistics (shipments, certificates, maritime/land transport).'}</li>
                <li>{lang === 'fr' ? 'Sécuriser les paiements via banques partenaires et fintech (Stripe, Wise Business, virements SWIFT, LC).' : 'Secure payments through partner banks and fintech (Stripe, Wise Business, SWIFT transfers, LC).'}</li>
                <li>{lang === 'fr' ? 'Améliorer nos services (plateforme B2B, sourcing personnalisé, suivi transactions).' : 'Improve our services (B2B platform, personalized sourcing, transaction tracking).'}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? '4. Partage des données' : '4. Data Sharing'}
              </h2>
              <p className="text-gray-700 mb-4">
                {lang === 'fr' ? 'Nous ne partageons vos données qu\'avec :' : 'We only share your data with:'}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>{lang === 'fr' ? 'Nos filiales (SenHarvest Canada, Xidma & Harvest Sénégal) pour faciliter vos transactions.' : 'Our subsidiaries (SenHarvest Canada, Xidma & Harvest Senegal) to facilitate your transactions.'}</li>
                <li>{lang === 'fr' ? 'Nos partenaires financiers (banques, fintech Stripe et Wise Business) pour sécuriser les paiements.' : 'Our financial partners (banks, fintech Stripe and Wise Business) to secure payments.'}</li>
                <li>{lang === 'fr' ? 'Nos partenaires logistiques (transitaires, compagnies maritimes, organismes d\'inspection SGS/Bureau Veritas).' : 'Our logistics partners (freight forwarders, shipping companies, inspection bodies SGS/Bureau Veritas).'}</li>
                <li>{lang === 'fr' ? 'Les autorités compétentes si la loi l\'exige (douanes, services phytosanitaires, régulateurs).' : 'Competent authorities if required by law (customs, phytosanitary services, regulators).'}</li>
              </ul>
              <p className="text-gray-700 mt-4 font-semibold">
                {lang === 'fr' ? 'Nous ne vendons jamais vos données personnelles à des tiers.' : 'We never sell your personal data to third parties.'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? '5. Stockage et sécurité' : '5. Storage and Security'}
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>{lang === 'fr' ? 'Vos données sont stockées sur des serveurs sécurisés, avec contrôle d\'accès strict.' : 'Your data is stored on secure servers with strict access control.'}</li>
                <li>{lang === 'fr' ? 'Les documents sensibles (factures, certificats, contrats) sont protégés par chiffrement et archivage sécurisé.' : 'Sensitive documents (invoices, certificates, contracts) are protected by encryption and secure archiving.'}</li>
                <li>{lang === 'fr' ? 'Les paiements effectués via Stripe ou Wise Business sont traités sur leurs systèmes conformes PCI-DSS et GDPR.' : 'Payments made via Stripe or Wise Business are processed on their PCI-DSS and GDPR compliant systems.'}</li>
                <li>{lang === 'fr' ? 'Nous appliquons des audits réguliers et des sauvegardes automatiques.' : 'We apply regular audits and automatic backups.'}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? '6. Vos droits' : '6. Your Rights'}
              </h2>
              <p className="text-gray-700 mb-4">
                {lang === 'fr' ? 'En tant qu\'utilisateur, vous disposez de droits :' : 'As a user, you have the right to:'}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>{lang === 'fr' ? 'Accéder à vos données et demander une copie.' : 'Access your data and request a copy.'}</li>
                <li>{lang === 'fr' ? 'Corriger ou mettre à jour vos informations.' : 'Correct or update your information.'}</li>
                <li>{lang === 'fr' ? 'Demander la suppression de vos données (hors obligations légales et contractuelles).' : 'Request deletion of your data (except legal and contractual obligations).'}</li>
                <li>{lang === 'fr' ? 'Retirer votre consentement pour l\'utilisation marketing.' : 'Withdraw your consent for marketing use.'}</li>
              </ul>
              <p className="text-gray-700 mt-4">
                {lang === 'fr' 
                  ? 'Pour exercer ces droits, contactez-nous à : privacy@senharvestgroup.com'
                  : 'To exercise these rights, contact us at: privacy@senharvestgroup.com'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? '7. Cookies et suivi' : '7. Cookies and Tracking'}
              </h2>
              <p className="text-gray-700 mb-4">
                {lang === 'fr' ? 'Notre site utilise des cookies pour :' : 'Our site uses cookies to:'}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>{lang === 'fr' ? 'Assurer le bon fonctionnement technique (authentification, sessions).' : 'Ensure proper technical functioning (authentication, sessions).'}</li>
                <li>{lang === 'fr' ? 'Analyser l\'utilisation du site et améliorer nos services (Google Analytics ou équivalent).' : 'Analyze site usage and improve our services (Google Analytics or equivalent).'}</li>
              </ul>
              <p className="text-gray-700 mt-4">
                {lang === 'fr' 
                  ? 'Vous pouvez gérer vos préférences de cookies depuis votre navigateur.'
                  : 'You can manage your cookie preferences from your browser.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? '8. Durée de conservation' : '8. Retention Period'}
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>{lang === 'fr' ? 'Les documents commerciaux et financiers : 10 ans (conformité comptable et légale).' : 'Commercial and financial documents: 10 years (accounting and legal compliance).'}</li>
                <li>{lang === 'fr' ? 'Les données de navigation : 12 mois maximum.' : 'Browsing data: maximum 12 months.'}</li>
                <li>{lang === 'fr' ? 'Les comptes inactifs : suppression automatique après 3 ans sans activité.' : 'Inactive accounts: automatic deletion after 3 years without activity.'}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? '9. Transferts internationaux' : '9. International Transfers'}
              </h2>
              <p className="text-gray-700">
                {lang === 'fr' 
                  ? 'Vos données peuvent être transférées entre nos structures aux États-Unis, Canada et Sénégal. Nous appliquons des clauses contractuelles types et des standards internationaux pour garantir leur protection.'
                  : 'Your data may be transferred between our structures in the United States, Canada and Senegal. We apply standard contractual clauses and international standards to ensure their protection.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {lang === 'fr' ? '10. Contact' : '10. Contact'}
              </h2>
              <p className="text-gray-700 mb-4">
                {lang === 'fr' 
                  ? 'Pour toute question relative à la confidentialité, contactez :'
                  : 'For any questions regarding privacy, contact:'
                }
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">📧 abdoulahat.lo@senharvest.com</p>
                <div className="space-y-1 text-gray-700">
                  <p>📍 SenHarvest LLC – Delaware, USA</p>
                  <p>📍 Xidma & Harvest – Dakar, Sénégal</p>
                  <p>📍 Xidma & Harvest Canada – Montréal, Canada</p>
                </div>
              </div>
            </section>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700 text-sm">
                {lang === 'fr' 
                  ? '👉 Cette politique de confidentialité peut être mise à jour à tout moment pour refléter nos pratiques ou changements réglementaires.'
                  : '👉 This privacy policy may be updated at any time to reflect our practices or regulatory changes.'
                }
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default PrivacyPolicy;
