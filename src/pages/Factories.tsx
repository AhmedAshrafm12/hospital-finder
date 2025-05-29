import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import FilterSection from '@/components/FilterSection';
import Footer from '@/components/Footer';
import { MapPin, Star, Calendar, Clock, Phone, ExternalLink, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageSlider from '@/components/ImageSlider';
import BookingForm from '@/components/BookingForm';
import axios from 'axios';
import RatingDialog from '@/components/RatingDialog';
import ShareButtons from '@/components/ShareButtons';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
}

interface FilterItem {
  id: number;
  name: string;
}

interface Filters {
  country?: FilterItem;
  city?: FilterItem;
  category?: FilterItem;
  specialty?: FilterItem;
  search: string;
}

interface WorkDay {
  from: string;
  to: string;
  closed?: boolean;
}

interface WorkDays {
  mon: WorkDay;
  tue: WorkDay;
  wed: WorkDay;
  thu: WorkDay;
  fri: WorkDay;
  sat: WorkDay;
  sun: WorkDay;
}

interface GalleryImage {
  id: number;
  url: string;
  type: string;
  imageable_id: string;
  imageable_type: string;
  created_at: string;
  updated_at: string;
}

interface TopAd {
  id: number;
  image: string;
  url?: string;
  title?: string;
}

// Use same interface for left ad since they share the same structure
type LeftAd = TopAd;

interface Factory {
  id: number;
  name: string;
  logo: string;
  rating: number;
  category: string;
  specialty: string;
  description: string;
  services: string;
  city: string;
  country: string;
  workDays: WorkDays;
  gallery: GalleryImage[];
  products: GalleryImage[];
  location_link: string;
  website?: string;
  email?: string;
  phone?: string;
}

const FILTERS_STORAGE_KEY = 'factory_finder_filters';
const BASE_IMAGE_URL = 'https://back.factoriesguide.com/storage/';

function Factories() {
  const { language, t } = useLanguage() as LanguageContextType;
  const location = useLocation();
  const navigate = useNavigate();

  const [allFactories, setAllFactories] = useState<Factory[]>([]);
  const [filteredFactories, setFilteredFactories] = useState<Factory[]>([]);
  const [quickFilteredFactories, setQuickFilteredFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<Filters>(() => {
    try {
      const storedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);
      return storedFilters ? JSON.parse(storedFilters) : { search: '' };
    } catch (err) {
      console.error('Error loading stored filters:', err);
      return { search: '' };
    }
  });

  const [selectedWorkDays, setSelectedWorkDays] = useState<WorkDays | null>(null);
  const [selectedFactoryForRating, setSelectedFactoryForRating] = useState<number | null>(null);
  const [quickFilters, setQuickFilters] = useState<{
    categories: { type: 'category', id: number; name: string; count: number }[];
    countries: { type: 'country', id: number; name: string; count: number }[];
  }>({
    categories: [],
    countries: []
  });
  const [activeQuickFilter, setActiveQuickFilter] = useState<{
    type: 'category' | 'country' | null;
    name: string | null;
  }>({ type: null, name: null });

  const [topAds, setTopAds] = useState<TopAd[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [leftAd, setLeftAd] = useState<LeftAd | null>(null);

  // Generate quick filters from filtered factories
  const generateQuickFilters = (factories: Factory[]) => {
    const categoryMap = new Map<string, number>();
    const countryMap = new Map<string, number>();

    factories.forEach(factory => {
      if (factory.category) {
        categoryMap.set(factory.category, (categoryMap.get(factory.category) || 0) + 1);
      }
      if (factory.country) {
        countryMap.set(factory.country, (countryMap.get(factory.country) || 0) + 1);
      }
    });

    setQuickFilters({
      categories: Array.from(categoryMap.entries()).map(([name, count], index) => ({
        type: 'category' as const,
        id: index + 1,
        name,
        count
      })),
      countries: Array.from(countryMap.entries()).map(([name, count], index) => ({
        type: 'country' as const,
        id: index + 1,
        name,
        count
      }))
    });
  };

  const fetchFactories = async (filters: Filters) => {
    setLoading(true);
    setError(null);
    try {
      const apiFilters: Record<string, string> = {};
      
      if (filters.country?.name) apiFilters.country = filters.country.name;
      if (filters.city?.name) apiFilters.city = filters.city.name;
      if (filters.category?.name) apiFilters.category = filters.category.name;
      if (filters.specialty?.name) apiFilters.specialty = filters.specialty.name;
      if (filters.search) apiFilters.search = filters.search;

      const response = await axios.get('https://back.factoriesguide.com/result', { 
        params: apiFilters,
        headers: {
          'language': language
        }
      });

      if (!response.data) {
        throw new Error('Invalid response format');
      }

      const factoriesData = response.data.data?.factories || response.data.factories || [];
      const adsData = response.data?.ads?.topbanner || [];
      const leftAdData = response.data?.ads?.leftad || null;
      
      console.log(response.data.ads);
      setAllFactories(factoriesData);
      setFilteredFactories(factoriesData);
      setQuickFilteredFactories(factoriesData);
      setTopAds(adsData);
      setLeftAd(leftAdData);
      generateQuickFilters(factoriesData);
      
    } catch (err) {
      console.error('Error fetching factories:', err);
      setError(t('errors.failedToLoad') || 'Failed to load factories.');
      setAllFactories([]);
      setFilteredFactories([]);
      setQuickFilteredFactories([]);
      setQuickFilters({ categories: [], countries: [] });
      setTopAds([]);
      setLeftAd(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilters = (filters: Filters) => {
    setCurrentFilters(filters);
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    fetchFactories(filters);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      let filtersToUse = currentFilters;

      if (location.state?.filters) {
        filtersToUse = location.state.filters;
        setCurrentFilters(filtersToUse);
        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filtersToUse));
      }

      await fetchFactories(filtersToUse);
    };

    loadInitialData();
  }, [language]);

  // Helper function to get full image URL
  const getImageUrl = (image: GalleryImage) => {
    return `${BASE_IMAGE_URL}${image.url}`;
  };

  // Function to check if factory is currently open
  const isFactoryOpen = (workDays: WorkDays | undefined): boolean => {
    if (!workDays) return false;
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const dayMap: Record<string, keyof WorkDays> = {
      'mon': 'mon',
      'tue': 'tue',
      'wed': 'wed',
      'thu': 'thu',
      'fri': 'fri',
      'sat': 'sat',
      'sun': 'sun'
    };
    
    const today = workDays[dayMap[currentDay]];
    if (!today) return false;
    
    if (today.closed || !today.from || !today.to) return false;
    
    try {
      const [fromHour, fromMinute] = today.from.split(':').map(Number);
      const [toHour, toMinute] = today.to.split(':').map(Number);
      
      if (isNaN(fromHour) || isNaN(fromMinute) || isNaN(toHour) || isNaN(toMinute)) {
        return false;
      }
      
      const currentTime = currentHour * 60 + currentMinute;
      const fromTime = fromHour * 60 + fromMinute;
      const toTime = toHour * 60 + toMinute;
      
      return currentTime >= fromTime && currentTime <= toTime;
    } catch (error) {
      console.error('Error parsing working hours:', error);
      return false;
    }
  };

  // Handle quick filter click
  const handleQuickFilterClick = (filter: { type: 'category' | 'country', name: string }) => {
    if (activeQuickFilter.type === filter.type && activeQuickFilter.name === filter.name) {
      setActiveQuickFilter({ type: null, name: null });
      setQuickFilteredFactories(filteredFactories);
    } else {
      setActiveQuickFilter({ type: filter.type, name: filter.name });
      const newFilters: Filters = {
        ...currentFilters,
        [filter.type]: { id: 0, name: filter.name }
      };
      fetchFactories(newFilters);
    }
  };

  // Add autoplay effect for ads
  useEffect(() => {
    if (topAds.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentAdIndex((current) => (current + 1) % topAds.length);
    }, 5000); // Change ad every 5 seconds
    
    return () => clearInterval(interval);
  }, [topAds.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Top Banner */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-factories-slate/80 to-factories-blue/70 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&auto=format&fit=crop&q=80"
          alt="Factories Banner"
          className="w-full h-[300px] object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&auto=format&fit=crop&q=80";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white">  {t('home.title')}</h1>
        </div>
      </div>

      {/* Main Content with Left Ad */}
      <div className="container mx-auto px-4 -mt-10 relative z-30">
        <FilterSection 
          onApplyFilters={handleFilters}
          initialFilters={currentFilters}
        />

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* Left Ad Section - Always on left for both RTL and LTR */}
          {leftAd && leftAd.image && (
            <div className="lg:w-[300px] flex-shrink-0 lg:!mr-6">
              <div className="rounded-lg overflow-hidden shadow-sm">
                {leftAd.url ? (
                  <a
                    href={leftAd.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative group"
                  >
                    <img
                      src={`${BASE_IMAGE_URL}${leftAd.image}`}
                      alt={leftAd.title || 'Advertisement'}
                      className="w-full"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                  </a>
                ) : (
                  <img
                    src={`${BASE_IMAGE_URL}${leftAd.image}`}
                    alt={leftAd.title || 'Advertisement'}
                    className="w-full"
                  />
                )}
              </div>
            </div>
          )}

          {/* Main Content Section */}
          <div className="flex-1">
            {/* Top Ads Swiper */}
            {!loading && !error && topAds.length > 0 && (
              <div className="rounded-lg overflow-hidden">
                <div className="relative h-[200px]">
                  {topAds.map((ad, idx) => (
                    <div
                      key={ad.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        idx === currentAdIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      {ad.url ? (
                        <a
                          href={ad.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full relative group"
                        >
                          <img
                            src={`${BASE_IMAGE_URL}${ad.image}`}
                            alt={ad.title || 'Advertisement'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-5 h-5 text-white drop-shadow-lg" />
                          </div>
                        </a>
                      ) : (
                        <img
                          src={`${BASE_IMAGE_URL}${ad.image}`}
                          alt={ad.title || 'Advertisement'}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  
                  {/* Ad Navigation Dots */}
                  {topAds.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                      {topAds.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentAdIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentAdIndex 
                              ? 'w-4 bg-white' 
                              : 'bg-white/60 hover:bg-white/80'
                          }`}
                          aria-label={`Go to advertisement ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Filter Tags */}
            {!loading && !error && filteredFactories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 bg-white p-4 rounded-lg shadow-sm">
                <div className={`w-full flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-medium text-gray-500">
                    {t('filters.quickFilters')}:
                  </span>
                </div>
                <div className={`flex flex-wrap gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  {quickFilters.categories.map((filter) => (
                    <button
                      key={`category-${filter.id}`}
                      onClick={() => handleQuickFilterClick(filter)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                        ${activeQuickFilter.type === 'category' && activeQuickFilter.name === filter.name
                          ? 'bg-factories-blue text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        transition-colors duration-200
                        ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                    >
                      {filter.name}
                      <span className={`${language === 'ar' ? 'mr-2' : 'ml-2'} text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full`}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                  {quickFilters.countries.map((filter) => (
                    <button
                      key={`country-${filter.id}`}
                      onClick={() => handleQuickFilterClick(filter)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                        ${activeQuickFilter.type === 'country' && activeQuickFilter.name === filter.name
                          ? 'bg-factories-blue text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        transition-colors duration-200
                        ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                    >
                      {filter.name}
                      <span className={`${language === 'ar' ? 'mr-2' : 'ml-2'} text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full`}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Factories List */}
            {loading && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-factories-blue"></div>
              </div>
            )}
            
            {error && (
              <div className="text-center text-red-500 py-10">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => fetchFactories(currentFilters)}
                >
                  {t('common.tryAgain')}
                </Button>
              </div>
            )}

            {!loading && !error && quickFilteredFactories.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <p className="mb-4">{t('common.noFactoriesFound')}</p>
                {Object.keys(currentFilters).some(key => 
                  key !== 'search' && currentFilters[key as keyof Filters]
                ) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const newFilters = { search: '' };
                      setCurrentFilters(newFilters);
                      handleFilters(newFilters);
                    }}
                  >
                    {t('filters.clear')}
                  </Button>
                )}
              </div>
            )}

            {!loading && !error && quickFilteredFactories.length > 0 && (
              <div className="space-y-8">
                {quickFilteredFactories.map((factory) => (
                  <Card key={factory.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className={`flex flex-col lg:flex-row gap-8 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        {/* Factory Info */}
                        <div className="w-full lg:w-1/3">
                          <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex flex-col items-center mb-6">
                              <img
                                src={`${BASE_IMAGE_URL}${factory.logo}`}
                                alt={factory.name}
                                className="w-32 h-32 object-contain mb-1"
                              />
                              <h3 className="text-lg font-semibold text-factories-blue text-center">
                                {factory.name}
                              </h3>
                              {/* Rating */}
                              <div className="flex items-center gap-1 mt-2">
                                <button
                                  onClick={() => setSelectedFactoryForRating(factory.id)}
                                  className="group flex items-center gap-1 hover:opacity-80 transition-opacity"
                                >
                                  {[...Array(5)].map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`h-4 w-4 ${
                                        index < Math.floor(factory.rating)
                                          ? 'fill-factories-orange text-factories-orange'
                                          : index < factory.rating
                                          ? 'fill-factories-orange/50 text-factories-orange'
                                          : 'fill-gray-200 text-gray-200'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-600 ml-1 group-hover:underline">
                                    ({factory.rating.toFixed(1)})
                                  </span>
                                </button>
                              </div>
                            </div>
                            
                            <div className="space-y-4 border-t pt-4">
                              {/* Contact Info Grid */}
                              <div className="space-y-2">
                                {/* Location */}
                                <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row' : ''}`}>
                                  <MapPin className="h-5 w-5 text-factories-blue flex-shrink-0" />
                                  <a 
                                    href={factory.location_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-factories-blue hover:text-factories-blue/80 hover:underline flex-1 ${language === 'ar' ? 'text-right' : ''}`}
                                  >
                                    {factory.city}, {factory.country}
                                  </a>
                                </div>

                                {/* Email */}
                                {factory.email && (
                                  <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row' : ''}`}>
                                    <Mail className="h-5 w-5 text-factories-blue flex-shrink-0" />
                                    <a 
                                      href={`mailto:${factory.email}`}
                                      className={`text-factories-blue hover:text-factories-blue/80 hover:underline flex-1 ${language === 'ar' ? 'text-right' : ''}`}
                                    >
                                      {factory.email}
                                    </a>
                                  </div>
                                )}

                                {/* Phone */}
                                {factory.phone && (
                                  <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row' : ''}`}>
                                    <Phone className="h-5 w-5 text-factories-blue flex-shrink-0" />
                                    <a 
                                      href={`tel:${factory.phone}`}
                                      className={`text-factories-blue hover:text-factories-blue/80 hover:underline flex-1 ${language === 'ar' ? 'text-right' : ''}`}
                                    >
                                      {factory.phone}
                                    </a>
                                  </div>
                                )}

                                {/* Working Hours */}
                                <div className={`flex items-center ${language === 'ar' ? 'flex-row gap-0' : 'gap-2'}`}>
                                  <Clock className="h-5 w-5 text-factories-blue flex-shrink-0" />
                                  <Button
                                    variant="ghost"
                                    className={`p-0 h-auto hover:bg-transparent ${
                                      isFactoryOpen(factory.workDays) 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                    } ${language === 'ar' ? 'text-right !pl-0' : ''}`}
                                    onClick={() => setSelectedWorkDays(factory.workDays)}
                                  >
                                    {isFactoryOpen(factory.workDays)
                                      ? language === 'ar' ? 'مفتوح الآن' : 'Open Now'
                                      : language === 'ar' ? 'مغلق' : 'Closed'}
                                  </Button>
                                </div>
                              </div>

                              {/* Share Buttons */}
                              <div className={`mt-4 flex items-center border-t pt-4 ${language === 'ar' ? 'flex-row' : ''}`}>
                                <ShareButtons 
                                  url={factory.website}
                                  title={`${factory.name} - Visit our factory at`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Factory Details Tabs */}
                        <div className="w-full lg:w-2/3">
                          <Card>
                            <CardContent className="p-0">
                              <Tabs defaultValue="gallery" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                <TabsList className="w-full grid grid-cols-5">
                                  <TabsTrigger value="gallery" className={language === 'ar' ? 'text-right' : 'text-left'}>
                                    {t('factory.gallery')}
                                  </TabsTrigger>
                                  <TabsTrigger value="products" className={language === 'ar' ? 'text-right' : 'text-left'}>
                                    {t('factory.products')}
                                  </TabsTrigger>
                                  <TabsTrigger value="about" className={language === 'ar' ? 'text-right' : 'text-left'}>
                                    {t('factory.about')}
                                  </TabsTrigger>
                                  <TabsTrigger value="services" className={language === 'ar' ? 'text-right' : 'text-left'}>
                                    {t('factory.services')}
                                  </TabsTrigger>
                                  <TabsTrigger value="booking" className={language === 'ar' ? 'text-right' : 'text-left'}>
                                  {t('nav.contactUs')}
                                  </TabsTrigger>
                                </TabsList>
                                
                                {/* Gallery Tab */}
                                <TabsContent value="gallery" className="p-6">
                                  <ImageSlider 
                                    images={factory.gallery.map(img => getImageUrl(img))} 
                                    className="mb-4" 
                                  />
                                </TabsContent>
                                
                                {/* Products Tab */}
                                <TabsContent value="products" className="p-6">
                                  <ImageSlider 
                                    images={factory.products.map(img => getImageUrl(img))} 
                                    className="mb-4" 
                                  />
                                </TabsContent>
                                
                                {/* About Tab */}
                                <TabsContent value="about" className="p-6">
                                  <h3 className={`text-xl font-bold mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                    {t('factory.about')}
                                  </h3>
                                  <div 
                                    className={`prose max-w-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                                    dangerouslySetInnerHTML={{ 
                                      __html: factory.description || ''
                                    }}
                                  />
                                </TabsContent>

                                {/* Services Tab */}
                                <TabsContent value="services" className="p-6">
                                  <h3 className={`text-xl font-bold mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                    {t('factory.services')}
                                  </h3>
                                  <div 
                                    className={`prose max-w-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                                    dangerouslySetInnerHTML={{ 
                                      __html: factory.services || ''
                                    }}
                                  />
                                </TabsContent>
                                
                                {/* Booking Tab */}
                                <TabsContent value="booking" className="p-6">
                                  <h3 className={`text-xl font-bold mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                    {/* {t('factory.booking')}
                                     */}
                                  </h3>
                                  <BookingForm factoryId={factory.id} />
                                </TabsContent>
                              </Tabs>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Work Days Modal */}
      <Dialog open={selectedWorkDays !== null} onOpenChange={() => setSelectedWorkDays(null)}>
        <DialogContent className={language === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
              {language === 'en' ? 'Working Hours' : 'ساعات العمل'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {selectedWorkDays && (
              <div className="grid gap-2">
                {[
                  { key: 'mon', en: 'Monday', ar: 'الاثنين' },
                  { key: 'tue', en: 'Tuesday', ar: 'الثلاثاء' },
                  { key: 'wed', en: 'Wednesday', ar: 'الأربعاء' },
                  { key: 'thu', en: 'Thursday', ar: 'الخميس' },
                  { key: 'fri', en: 'Friday', ar: 'الجمعة' },
                  { key: 'sat', en: 'Saturday', ar: 'السبت' },
                  { key: 'sun', en: 'Sunday', ar: 'الأحد' }
                ].map(day => (
                  <div 
                    key={day.key}
                    className={`p-2 rounded ${
                      selectedWorkDays[day.key as keyof WorkDays]?.closed 
                        ? 'bg-red-50' 
                        : 'bg-green-50'
                    } ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  >
                    {language === 'en' 
                      ? `${day.en}: ${selectedWorkDays[day.key as keyof WorkDays]?.closed ? 'Closed' : `${selectedWorkDays[day.key as keyof WorkDays]?.from} - ${selectedWorkDays[day.key as keyof WorkDays]?.to}`}`
                      : `${day.ar}: ${selectedWorkDays[day.key as keyof WorkDays]?.closed ? 'مغلق' : `${selectedWorkDays[day.key as keyof WorkDays]?.from} - ${selectedWorkDays[day.key as keyof WorkDays]?.to}`}`
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <RatingDialog
        factoryId={selectedFactoryForRating || 0}
        isOpen={selectedFactoryForRating !== null}
        onClose={() => setSelectedFactoryForRating(null)}
        onRatingSubmit={() => fetchFactories(currentFilters)}
      />

      <Footer />
    </div>
  );
}

export default Factories;
