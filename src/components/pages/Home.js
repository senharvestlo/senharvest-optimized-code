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
          
          <a
            href={onWhatsApp()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Button variant="secondary" size="xl">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              {t.whatsapp}
            </Button>
          </a>
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
