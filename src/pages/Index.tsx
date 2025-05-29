
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FilterSection from '@/components/FilterSection';
import Footer from '@/components/Footer';
import bannerImage from '../images/pexels-pixabay-247763.jpg';
const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleFilters = (filters: any) => {
    // Navigate to factories page with filters
    navigate('/factories', { state: { filters } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-factories-blue/80 to-factories-slate/80 z-10"></div>
        <img 
          src={bannerImage}
          alt="Factory Banner"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">{t('home.title')}</h1>
          <p className="text-xl md:text-2xl max-w-2xl text-center">{t('home.subtitle')}</p>
          <p className="text-xl md:text-2xl max-w-2xl text-center">{t('home.subtitle2')}</p>
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-30">
        <FilterSection onApplyFilters={handleFilters} />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
