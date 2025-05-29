
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface FactoryData {
  id: number;
  name: string;
  logo: string;
  location: string;
  city: string;
  country: string;
  category: string;
  specialty: string;
  rating: number;
  workDays: string;
}

interface FactoryCardProps {
  factory: FactoryData;
}

const FactoryCard: React.FC<FactoryCardProps> = ({ factory }) => {
  const { t, language } = useLanguage();
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-factories-orange text-factories-orange" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half-star" className="h-4 w-4 text-factories-orange" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Logo and info section (left side) */}
          <div className="bg-gray-50 p-4 flex-shrink-0 flex flex-col items-center justify-center w-full md:w-1/3">
            <img 
              src={factory.logo} 
              alt={factory.name} 
              className="w-24 h-24 object-contain mb-3"
            />
            <div className="w-full space-y-2">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 text-factories-blue mr-1 rtl:ml-1 rtl:mr-0" />
                <span>{factory.city}, {factory.country}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-factories-blue mr-1 rtl:ml-1 rtl:mr-0" />
                <span>{factory.workDays}</span>
              </div>
              <div className="flex items-center">
                <div className="flex mr-1 rtl:ml-1 rtl:mr-0">
                  {renderStars(factory.rating)}
                </div>
                <span className="text-sm">({factory.rating})</span>
              </div>
            </div>
          </div>
          
          {/* Details section (right side) */}
          <div className="p-6 flex-grow">
            <h3 className="font-bold text-lg mb-2">{factory.name}</h3>
            <div className="space-y-2 mb-4">
              <div>
                <span className="text-sm font-medium text-gray-500">{t('filters.category')}:</span>
                <span className="text-sm ml-1 rtl:mr-1 rtl:ml-0">{factory.category}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">{t('filters.specialty')}:</span>
                <span className="text-sm ml-1 rtl:mr-1 rtl:ml-0">{factory.specialty}</span>
              </div>
            </div>
            
            <div className={`flex justify-end ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Link to={`/factory/${factory.id}`}>
                <Button className="bg-factories-blue hover:bg-blue-700">
                  {t('common.viewDetails')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FactoryCard;
