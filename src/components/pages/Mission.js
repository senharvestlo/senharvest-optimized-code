import React from 'react';
import { Container } from '../ui';

/**
 * Mission Page Component
 * Displays company mission, values, and global structure
 */
function Mission({ t, lang }) {
  const missionSections = [
    {
      title: lang === 'fr' ? '🌱 Notre Credo' : '🌱 Our Credo',
      quote: lang === 'fr' 
        ? '"Cultivating prosperity across continents – Sow locally, Harvest globally!"'
        : '"Cultivating prosperity across continents – Sow locally, Harvest globally!"',
      description: lang === 'fr' 
        ? 'Nous croyons que la prospérité naît de la terre, mais qu\'elle se partage à l\'échelle mondiale. En connectant les producteurs locaux aux marchés internationaux, nous semons l\'espoir et récoltons un avenir meilleur pour tous.'
        : 'We believe that prosperity is born from the earth, but it is shared on a global scale. By connecting local producers to international markets, we sow hope and harvest a better future for all.',
      icon: '🌱',
      color: 'green'
    },
    {
      title: lang === 'fr' ? '💖 Notre Engagement Humain' : '💖 Our Human Commitment',
      quote: lang === 'fr' 
        ? '"Serving humanity with divine compassion"'
        : '"Serving humanity with divine compassion"',
      description: lang === 'fr' 
        ? 'Au-delà du commerce, notre objectif ultime est de servir l\'humanité. Chez SenHarvest Group, nous travaillons avec une compassion divine qui transcende les frontières, en soutenant les communautés agricoles locales et en œuvrant pour améliorer le sort des plus démunis.'
        : 'Beyond commerce, our ultimate goal is to serve humanity. At SenHarvest Group, we work with divine compassion that transcends borders, supporting local agricultural communities and working to improve the lot of the most disadvantaged.',
      icon: '💖',
      color: 'pink'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      green: 'bg-green-100 text-green-600',
      pink: 'bg-pink-100 text-pink-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="py-20 px-4">
      <Container>
        {/* Mission Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            🌍 {lang === 'fr' ? 'Notre Mission' : 'Our Mission'}
          </h1>
        </div>

        {/* Main Mission Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {lang === 'fr' 
                ? 'Chez SenHarvest Group, notre mission est de créer un pont solide entre l\'Afrique, l\'Amérique et l\'Asie afin de faciliter le commerce international des produits agricoles.'
                : 'At SenHarvest Group, our mission is to create a strong bridge between Africa, America and Asia to facilitate international trade in agricultural products.'
              }
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {lang === 'fr' 
                ? 'Nous travaillons main dans la main avec les coopératives et producteurs sénégalais pour valoriser leurs récoltes (arachides, noix de cajou, sésame, haricots…) et leur offrir un accès direct aux marchés mondiaux.'
                : 'We work hand in hand with Senegalese cooperatives and producers to enhance their harvests (peanuts, cashew nuts, sesame, beans...) and give them direct access to world markets.'
              }
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              {lang === 'fr' 
                ? 'En parallèle, nous importons du Canada et d\'Asie des produits essentiels comme le riz 100 % brisé parfumé, la farine de blé, les légumineuses et les engrais chimiques, afin de répondre aux besoins croissants des marchés africains.'
                : 'In parallel, we import from Canada and Asia essential products such as 100% fragrant broken rice, wheat flour, legumes and chemical fertilizers, to meet the growing needs of African markets.'
              }
            </p>
          </div>

          {/* Mission Sections */}
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {missionSections.map((section, index) => (
                <div key={index} className="bg-white/95 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 text-2xl ${getColorClasses(section.color)}`}>
                    {section.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h3>
                  
                  <blockquote className="text-lg font-semibold text-gray-700 mb-4 italic border-l-4 border-gray-300 pl-4">
                    {section.quote}
                  </blockquote>
                  
                  <p className="text-gray-600 leading-relaxed">{section.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Message Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              {lang === 'fr' 
                ? '👉 SenHarvest Group : plus qu\'un courtier, un acteur de développement qui unit les continents et les peuples par le commerce et la solidarité.'
                : '👉 SenHarvest Group: more than a broker, a development actor that unites continents and peoples through trade and solidarity.'
              }
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Mission;
