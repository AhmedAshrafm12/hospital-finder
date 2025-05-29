
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageSlider from '@/components/ImageSlider';
import BookingForm from '@/components/BookingForm';
import { getFactoryById } from '@/mock/factories';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FactoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const factoryId = parseInt(id || '0');
  const factory = getFactoryById(factoryId);
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // If factory not found, redirect to factories page
  if (!factory) {
    toast({
      title: "Factory not found",
      description: "The factory you are looking for does not exist.",
      variant: "destructive",
    });
    
    // Redirect to factories page
    setTimeout(() => {
      navigate('/factories');
    }, 100);
    
    return null;
  }
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-factories-orange text-factories-orange" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half-star" className="h-5 w-5 text-factories-orange" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Top Banner */}
      <div className="relative">
        <img 
          src={factory.gallery[0]} 
          alt={factory.name}
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{factory.name}</h1>
            <p className="text-white/80">{factory.category} • {factory.specialty}</p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Factory image */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
              <div className="flex justify-center mb-6">
                <img 
                  src={factory.logo} 
                  alt={factory.name} 
                  className="w-32 h-32 object-contain"
                />
              </div>
              
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-factories-blue mr-2 rtl:ml-2 rtl:mr-0" />
                  <span>{factory.city}, {factory.country}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-factories-blue mr-2 rtl:ml-2 rtl:mr-0" />
                  <span>{factory.workDays}</span>
                </div>
                
                <div className="flex items-center">
                  <div className="flex mr-2 rtl:ml-2 rtl:mr-0">
                    {renderStars(factory.rating)}
                  </div>
                  <span>({factory.rating})</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Factory details tabs */}
          <div className="w-full lg:w-2/3">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="gallery">
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="gallery">{t('factory.gallery')}</TabsTrigger>
                    <TabsTrigger value="products">{t('factory.products')}</TabsTrigger>
                    <TabsTrigger value="about">{t('factory.about')}</TabsTrigger>
                    <TabsTrigger value="booking">{t('factory.booking')}</TabsTrigger>
                  </TabsList>
                  
                  {/* Gallery Tab */}
                  <TabsContent value="gallery" className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('factory.gallery')}</h3>
                    <ImageSlider images={factory.gallery} className="mb-4" />
                    <p className="text-gray-600 mt-4">
                      {language === 'en'
                        ? `Explore our state-of-the-art facilities at ${factory.name}.`
                        : `استكشف مرافقنا الحديثة في ${factory.name}.`
                      }
                    </p>
                  </TabsContent>
                  
                  {/* Products Tab */}
                  <TabsContent value="products" className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('factory.products')}</h3>
                    <ImageSlider images={factory.products} className="mb-4" />
                    <p className="text-gray-600 mt-4">
                      {language === 'en'
                        ? `View a sample of products manufactured at ${factory.name}.`
                        : `اطلع على عينة من المنتجات المصنعة في ${factory.name}.`
                      }
                    </p>
                  </TabsContent>
                  
                  {/* About Tab */}
                  <TabsContent value="about" className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('factory.about')}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {factory.description[language]}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-bold mb-2">Established</h4>
                        <p>2005</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-bold mb-2">Employees</h4>
                        <p>250-500</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-bold mb-2">Production Capacity</h4>
                        <p>10,000 units/month</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-bold mb-2">Certifications</h4>
                        <p>ISO 9001, ISO 14001</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Booking Tab */}
                  <TabsContent value="booking" className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('factory.booking')}</h3>
                    <BookingForm factoryId={factory.id} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FactoryDetail;
