import React from 'react';
import { Container } from '../ui';

/**
 * Services Page Component
 * Displays company services and offerings
 */
function Services({ t, lang, onOpenForm }) {
  const services = [
    {
      id: 1,
      title: lang === 'fr' ? 'Courtier en commodités agricoles' : 'Agricultural Commodities Broker',
      description: lang === 'fr' 
        ? 'Mise en relation directe entre producteurs, coopératives sénégalaises et acheteurs internationaux. Négociation et sécurisation des transactions (prix, incoterms, quantités).'
        : 'Direct connection between producers, Senegalese cooperatives and international buyers. Negotiation and securing of transactions (prices, incoterms, quantities).',
      icon: '🤝',
      color: 'green'
    },
    {
      id: 2,
      title: lang === 'fr' ? 'Exportation de produits agricoles du Sénégal' : 'Export of Agricultural Products from Senegal',
      description: lang === 'fr' 
        ? 'Gestion des ventes à l\'étranger pour le compte des coopératives et producteurs locaux. Produits phares : arachides, noix de cajou, sésame, haricots et autres légumineuses africaines. Accompagnement dans les certificats et inspections (phyto, sanitaire, origine, qualité).'
        : 'Management of foreign sales on behalf of cooperatives and local producers. Flagship products: peanuts, cashew nuts, sesame, beans and other African legumes. Support in certificates and inspections (phytosanitary, sanitary, origin, quality).',
      icon: '🌾',
      color: 'blue'
    },
    {
      id: 3,
      title: lang === 'fr' ? 'Importation & courtage de produits canadiens et internationaux' : 'Import & Brokering of Canadian and International Products',
      description: lang === 'fr' 
        ? 'Produits canadiens : légumineuses (pois, lentilles, fèves), farine de blé, huile et graines de canola, engrais chimiques. Riz brisé parfumé : importé principalement d\'Asie (Vietnam, Thaïlande, Pakistan, Inde, etc.). Engrais chimiques : sourcing auprès de fournisseurs compétitifs du Canada, Chine et autres marchés.'
        : 'Canadian products: legumes (peas, lentils, beans), wheat flour, canola oil and seeds, chemical fertilizers. Fragrant broken rice: mainly imported from Asia (Vietnam, Thailand, Pakistan, India, etc.). Chemical fertilizers: sourcing from competitive suppliers from Canada, China and other markets.',
      icon: '🌍',
      color: 'amber'
    },
    {
      id: 4,
      title: lang === 'fr' ? 'Services de sourcing et courtage élargi' : 'Expanded Sourcing and Brokering Services',
      description: lang === 'fr' 
        ? 'Grâce à notre réseau international, nous offrons un service de sourcing personnalisé pour d\'autres produits agricoles et agroalimentaires, en fonction des besoins spécifiques des acheteurs.'
        : 'Thanks to our international network, we offer a personalized sourcing service for other agricultural and agri-food products, according to the specific needs of buyers.',
      icon: '🔍',
      color: 'purple'
    },
    {
      id: 5,
      title: lang === 'fr' ? 'Supervision des transactions & gestion documentaire' : 'Transaction Supervision & Document Management',
      description: lang === 'fr' 
        ? 'Suivi complet de chaque étape : de la commande à la livraison finale. Centralisation et gestion des documents d\'export/import : factures, connaissement (B/L), certificats, assurances, packing list. Vérification qualité et conformité via inspections indépendantes (SGS, Bureau Veritas).'
        : 'Complete follow-up of each step: from order to final delivery. Centralization and management of export/import documents: invoices, bill of lading (B/L), certificates, insurance, packing list. Quality and compliance verification through independent inspections (SGS, Bureau Veritas).',
      icon: '📋',
      color: 'indigo'
    },
    {
      id: 6,
      title: lang === 'fr' ? 'Solutions de paiement sécurisées' : 'Secure Payment Solutions',
      description: lang === 'fr' 
        ? 'Encadrement des paiements par Lettres de Crédit (LC) irrévocables et confirmées. Paiements anticipés et virements SWIFT. Intégration fintech pour transactions internationales rapides : Stripe et Wise Business.'
        : 'Payment framework through irrevocable and confirmed Letters of Credit (LC). Advance payments and SWIFT transfers. Fintech integration for fast international transactions: Stripe and Wise Business.',
      icon: '💳',
      color: 'emerald'
    },
    {
      id: 7,
      title: lang === 'fr' ? 'Logistique & transport international' : 'International Logistics & Transport',
      description: lang === 'fr' 
        ? 'Coordination avec transitaires et compagnies maritimes. Gestion FOB et CIF (20ft/40ft containers). Suivi en temps réel des expéditions et accompagnement jusqu\'au port de destination.'
        : 'Coordination with freight forwarders and shipping companies. FOB and CIF management (20ft/40ft containers). Real-time tracking of shipments and support to destination port.',
      icon: '🚢',
      color: 'teal'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      amber: 'bg-amber-100 text-amber-600',
      purple: 'bg-purple-100 text-purple-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      teal: 'bg-teal-100 text-teal-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="relative py-20 px-4 overflow-hidden">
      {/* Background with World Map Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/monde.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08
        }}
      ></div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/20"></div>
      
      <Container className="relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            🌍 {lang === 'fr' ? 'Nos Services' : 'Our Services'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {lang === 'fr' 
              ? 'SenHarvest Group propose une solution intégrée de bout en bout : sourcing, courtage, supervision des transactions, sécurisation des paiements et logistique internationale — reliant ainsi l\'Afrique, l\'Amérique et l\'Asie.'
              : 'SenHarvest Group offers an integrated end-to-end solution: sourcing, brokering, transaction supervision, payment security and international logistics — thus connecting Africa, America and Asia.'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div key={service.id} className="bg-white/95 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 text-2xl ${getColorClasses(service.color)}`}>
                {service.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/20 p-8 rounded-2xl text-center shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {lang === 'fr' ? 'En résumé' : 'In Summary'}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {lang === 'fr' 
                ? '👉 SenHarvest Group propose une solution intégrée de bout en bout : sourcing, courtage, supervision des transactions, sécurisation des paiements et logistique internationale — reliant ainsi l\'Afrique, l\'Amérique et l\'Asie.'
                : '👉 SenHarvest Group offers an integrated end-to-end solution: sourcing, brokering, transaction supervision, payment security and international logistics — thus connecting Africa, America and Asia.'
              }
            </p>
            
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Services;
