import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Filter } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

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

interface QuickFilter {
  type: 'category' | 'country';
  id: number;
  name: string;
  count: number;
}

interface FilterSectionProps {
  compact?: boolean;
  onApplyFilters?: (filters: Filters) => void;
  initialFilters?: Filters;
  quickFilters?: {
    categories: QuickFilter[];
    countries: QuickFilter[];
  };
}

const FILTERS_STORAGE_KEY = 'factory_finder_filters';

// Helper function to validate filter item structure
const isValidFilterItem = (item: any): item is FilterItem => {
  return item && typeof item.id === 'number' && typeof item.name === 'string';
};

const FilterSection: React.FC<FilterSectionProps> = ({ 
  compact = false, 
  onApplyFilters,
  initialFilters,
  quickFilters 
}) => {
  const { t, language } = useLanguage();

  // State for data
  const [countries, setCountries] = useState<FilterItem[]>([]);
  const [cities, setCities] = useState<FilterItem[]>([]);
  const [categories, setCategories] = useState<FilterItem[]>([]);
  const [specialties, setSpecialties] = useState<FilterItem[]>([]);

  // State for selections
  const [selectedCountry, setSelectedCountry] = useState<FilterItem | undefined>();
  const [selectedCity, setSelectedCity] = useState<FilterItem | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<FilterItem | undefined>();
  const [selectedSpecialty, setSelectedSpecialty] = useState<FilterItem | undefined>();
  const [searchText, setSearchText] = useState('');

  // Load initial data and filters
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [countriesRes, categoriesRes] = await Promise.all([
          axios.get('https://back.factoriesguide.com/api/countries', {
            headers: {
              'language': language
            }
          }),
          axios.get('https://back.factoriesguide.com/api/categories', {
            headers: {
              'language': language
            }
          })
        ]);
        
        setCountries(countriesRes.data);
        setCategories(categoriesRes.data);

        // Load filters from props or localStorage
        let filtersToApply: Filters | null = null;

        if (initialFilters) {
          filtersToApply = initialFilters;
        } else {
          const storedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);
          if (storedFilters) {
            try {
              const parsedFilters = JSON.parse(storedFilters);
              // Validate filter items before applying
              filtersToApply = {
                country: isValidFilterItem(parsedFilters.country) ? parsedFilters.country : undefined,
                city: isValidFilterItem(parsedFilters.city) ? parsedFilters.city : undefined,
                category: isValidFilterItem(parsedFilters.category) ? parsedFilters.category : undefined,
                specialty: isValidFilterItem(parsedFilters.specialty) ? parsedFilters.specialty : undefined,
                search: parsedFilters.search || ''
              };
            } catch (err) {
              console.error('Error parsing stored filters:', err);
            }
          }
        }

        if (filtersToApply) {
          // Set the filters
          if (filtersToApply.country) {
            setSelectedCountry(filtersToApply.country);
            // Load cities for the selected country
            try {
              const citiesRes = await axios.get(`https://back.factoriesguide.com/api/cities?country=${filtersToApply.country.id}`, {
                headers: {
                  'language': language
                }
              });
              setCities(citiesRes.data);
              if (filtersToApply.city) {
                setSelectedCity(filtersToApply.city);
              }
            } catch (error) {
              console.error('Error loading cities:', error);
            }
          }

          if (filtersToApply.category) {
            setSelectedCategory(filtersToApply.category);
            // Load specialties for the selected category
            try {
              const specialtiesRes = await axios.get(`https://back.factoriesguide.com/api/specilaity?category=${filtersToApply.category.id}`, {
                headers: {
                  'language': language
                }
              });
              setSpecialties(specialtiesRes.data);
              if (filtersToApply.specialty) {
                setSelectedSpecialty(filtersToApply.specialty);
              }
            } catch (error) {
              console.error('Error loading specialties:', error);
            }
          }

          setSearchText(filtersToApply.search || '');
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, [initialFilters, language]);

  // Fetch cities when country changes
  useEffect(() => {
    const loadCities = async () => {
      if (selectedCountry?.id) {
        try {
          const res = await axios.get(`https://back.factoriesguide.com/api/cities?country=${selectedCountry.id}`, {
            headers: {
              'language': language
            }
          });
          setCities(res.data);
        } catch (error) {
          console.error('Error loading cities:', error);
          setCities([]);
        }
      } else {
        setCities([]);
        setSelectedCity(undefined);
      }
    };

    loadCities();
  }, [selectedCountry, language]);

  // Fetch specialties when category changes
  useEffect(() => {
    const loadSpecialties = async () => {
      if (selectedCategory?.id) {
        try {
          const res = await axios.get(`https://back.factoriesguide.com/api/specilaity?category=${selectedCategory.id}`, {
            headers: {
              'language': language
            }
          });
          setSpecialties(res.data);
        } catch (error) {
          console.error('Error loading specialties:', error);
          setSpecialties([]);
        }
      } else {
        setSpecialties([]);
        setSelectedSpecialty(undefined);
      }
    };

    loadSpecialties();
  }, [selectedCategory, language]);

  // Handle search
  const handleSearch = () => {
    const filters: Filters = {
      country: selectedCountry,
      city: selectedCity,
      category: selectedCategory,
      specialty: selectedSpecialty,
      search: searchText,
    };

    // Save filters to localStorage
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));

    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  // Handle clear filters
  const handleClear = () => {
    setSelectedCountry(undefined);
    setSelectedCity(undefined);
    setSelectedCategory(undefined);
    setSelectedSpecialty(undefined);
    setSearchText('');
    
    // Clear filters from localStorage
    localStorage.removeItem(FILTERS_STORAGE_KEY);

    // Notify parent component
    if (onApplyFilters) {
      onApplyFilters({ search: '' });
    }
  };

  // Handle quick filter click
  const handleQuickFilterClick = (filter: QuickFilter) => {
    if (filter.type === 'category') {
      const categoryItem = categories.find(c => c.id === filter.id);
      setSelectedCategory(categoryItem);
      setSelectedSpecialty(undefined);
    } else if (filter.type === 'country') {
      const countryItem = countries.find(c => c.id === filter.id);
      setSelectedCountry(countryItem);
      setSelectedCity(undefined);
    }

    // Trigger search with the new filter
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className={`w-full ${compact ? 'py-4' : 'py-8'} px-6 bg-white rounded-lg shadow-md`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Country */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <Select 
              value={selectedCountry?.id?.toString()}
              onValueChange={(id) => {
                const found = countries.find(c => String(c.id) === id);
                setSelectedCountry(found);
              }}
            >
              <SelectTrigger className={cn(
                "w-full",
                language === 'ar' ? "text-right flex-row-reverse" : "text-left"
              )}>
                <SelectValue placeholder={t('filters.country')} className={language === 'ar' ? "text-right" : "text-left"} />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                side="bottom" 
                align={language === 'ar' ? 'end' : 'start'}
                className={cn(
                  "max-h-[300px] overflow-y-auto",
                  language === 'ar' ? "text-right" : "text-left"
                )}
              >
                {countries.map(country => (
                  <SelectItem 
                    key={country.id} 
                    value={String(country.id)}
                    className={language === 'ar' ? "text-right flex-row-reverse" : "text-left"}
                  >
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <Select
              value={selectedCity?.id?.toString()}
              onValueChange={(id) => {
                const found = cities.find(city => String(city.id) === id);
                setSelectedCity(found);
              }}
              disabled={!cities.length}
            >
              <SelectTrigger className={cn(
                "w-full",
                language === 'ar' ? "text-right flex-row-reverse" : "text-left"
              )}>
                <SelectValue placeholder={t('filters.city')} className={language === 'ar' ? "text-right" : "text-left"} />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                side="bottom" 
                align={language === 'ar' ? 'end' : 'start'}
                className={cn(
                  "max-h-[300px] overflow-y-auto",
                  language === 'ar' ? "text-right" : "text-left"
                )}
              >
                {cities.map(city => (
                  <SelectItem 
                    key={city.id} 
                    value={String(city.id)}
                    className={language === 'ar' ? "text-right flex-row-reverse" : "text-left"}
                  >
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <Select
              value={selectedCategory?.id?.toString()}
              onValueChange={(id) => {
                const found = categories.find(c => String(c.id) === id);
                setSelectedCategory(found);
              }}
            >
              <SelectTrigger className={cn(
                "w-full",
                language === 'ar' ? "text-right flex-row-reverse" : "text-left"
              )}>
                <SelectValue placeholder={t('filters.category')} className={language === 'ar' ? "text-right" : "text-left"} />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                side="bottom" 
                align={language === 'ar' ? 'end' : 'start'}
                className={cn(
                  "max-h-[300px] overflow-y-auto",
                  language === 'ar' ? "text-right" : "text-left"
                )}
              >
                {categories.map(category => (
                  <SelectItem 
                    key={category.id} 
                    value={String(category.id)}
                    className={language === 'ar' ? "text-right flex-row-reverse" : "text-left"}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Specialty */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <Select
              value={selectedSpecialty?.id?.toString()}
              onValueChange={(id) => {
                const found = specialties.find(s => String(s.id) === id);
                setSelectedSpecialty(found);
              }}
              disabled={!specialties.length}
            >
              <SelectTrigger className={cn(
                "w-full",
                language === 'ar' ? "text-right flex-row-reverse" : "text-left"
              )}>
                <SelectValue placeholder={t('filters.specialty')} className={language === 'ar' ? "text-right" : "text-left"} />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                side="bottom" 
                align={language === 'ar' ? 'end' : 'start'}
                className={cn(
                  "max-h-[300px] overflow-y-auto",
                  language === 'ar' ? "text-right" : "text-left"
                )}
              >
                {specialties.map(specialty => (
                  <SelectItem 
                    key={specialty.id} 
                    value={String(specialty.id)}
                    className={language === 'ar' ? "text-right flex-row-reverse" : "text-left"}
                  >
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <Input
              type="text"
              placeholder={t('filters.search')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className={language === 'ar' ? 'text-right' : 'text-left'}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className={`mt-4 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Button variant="outline" onClick={handleClear}>
            {t('filters.clear')}
          </Button>
          <Button onClick={handleSearch} className="bg-factories-blue hover:bg-blue-700">
            <Filter className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
            {t('filters.apply')}
          </Button>
        </div>
      </div>

      {/* Quick Filter Tags */}
      {quickFilters && (quickFilters.categories.length > 0 || quickFilters.countries.length > 0) && (
        <div className={`flex flex-wrap gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          {quickFilters.categories.map((filter) => (
            <button
              key={`category-${filter.id}`}
              onClick={() => handleQuickFilterClick(filter)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                ${selectedCategory?.id === filter.id 
                  ? 'bg-factories-blue text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                transition-colors duration-200
                ${language === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              {filter.name}
              <span className={`text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full ${language === 'ar' ? 'mr-2' : 'ml-2'}`}>
                {filter.count}
              </span>
            </button>
          ))}
          {quickFilters.countries.map((filter) => (
            <button
              key={`country-${filter.id}`}
              onClick={() => handleQuickFilterClick(filter)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                ${selectedCountry?.id === filter.id 
                  ? 'bg-factories-blue text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                transition-colors duration-200
                ${language === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              {filter.name}
              <span className={`text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full ${language === 'ar' ? 'mr-2' : 'ml-2'}`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
