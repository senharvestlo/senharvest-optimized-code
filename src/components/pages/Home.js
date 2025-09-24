import React from 'react';
import { Container, Button } from '../ui';

/**
 * Home Page Component
 * Landing page with company introduction and key metrics
 */
function Home({ t, lang, setPage, onWhatsApp }) {
  const stats = [
    { n: "30+", k: lang === "fr" ? "Pays" : "Countries" },
    { n: "15K+", k: lang === "fr" ? "Tonnes/an" : "Tons/year" },
    { n: "8", k: lang === "fr" ? "Origines" : "Origins" },
    { n: "50+", k: lang === "fr" ? "Producteurs" : "Producers" },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 text-center py-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-brandGray-800 mb-8">
          {t.welcomeFull}
        </h1>
        
        <div className="space-y-6 text-lg md:text-xl text-brandGray-700 max-w-5xl mx-auto leading-relaxed">
          <p>{t.description}</p>
          
          <p>{t.presence}</p>
          
          <p className="text-primary-600 font-semibold text-xl md:text-2xl mt-8">
            {t.tagline}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 mb-16">
          <Button
            variant="primary"
            size="xl"
            onClick={() => setPage("products")}
          >
            {t.discover}
          </Button>
        </div>
        
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.k} className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.n}</div>
                <div className="text-brandGray-600">{stat.k}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Home;
