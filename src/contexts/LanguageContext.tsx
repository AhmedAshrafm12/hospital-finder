import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'ar';

// Define translation keys structure
interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

// Define translations
const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    ar: 'الرئيسية',
  },
  'nav.payHere': {
    en: 'Pay Here',
    ar: 'ادفع هنا',
  },
  'nav.login': {
    en: 'Login',
    ar: 'تسجيل الدخول',
  },
  'nav.register': {
    en: 'Register',
    ar: 'تسجيل جديد',
  },
  'nav.franchiseFactories': {
    en: 'Franchise',
    ar: 'الامتيازات',
  },
  'nav.factories': {
    en: 'Factories',
    ar: 'المصانع',
  },
  'nav.about': {
    en: 'About',
    ar: 'عن الموقع',
  },
  'nav.contact': {
    en: 'Contact',
    ar: 'اتصل بنا',
  },
  'nav.whoWeAre': {
    en: 'Who We Are',
    ar: 'من نحن',
  },
  'nav.howToUse': {
    en: 'How to Use the Website',
    ar: 'كيفية استخدام الموقع',
  },
  'nav.help': {
    en: 'Help',
    ar: 'المساعدة',
  },
  'nav.terms': {
    en: 'Terms & Conditions',
    ar: 'الشروط والأحكام',
  },
  'nav.privacy': {
    en: 'Privacy Policy',
    ar: 'سياسة الخصوصية',
  },
  'nav.contactUs': {
    en: 'Contact Us',
    ar: 'اتصل بنا',
  },
  'nav.more': {
    en: 'More',
    ar: 'المزيد',
  },
  
  // Franchise
  'franchise.requestFranchise': {
    en: 'Request Franchise',
    ar: 'طلب امتياز',
  },
  
  // Home page
  'home.title': {
    en: 'Factories Guide',
    ar: 'ابحث عن المصنع المثالي',
  },
  'home.subtitle': {
    en: 'Our website is your ultimate destination for comprehensive information on factories, providing reliable and up-to-date resources.',
    ar: 'موقعنا هو الوجهة النهائية للحصول على معلومات شاملة عن المصانع، حيث نقدم موارد موثوقة ومحدثة.',
  },
  'home.subtitle2': {
    en: 'Whether you need to find a nearby factory, explore specialties and industrial services, or access contact details, our platform meets all your needs.',
    ar: 'سواء كنت بحاجة إلى العثور على مصنع قريب، استكشاف التخصصات والخدمات الصناعية، أو الحصول على تفاصيل الاتصال، فإن منصتنا تلبي جميع احتياجاتك.',
  },
  'home.featured': {
    en: 'Featured Factories',
    ar: 'المصانع المميزة',
  },
  
  // Filters
  'filters.country': {
    en: 'Country',
    ar: 'الدولة',
  },
  'filters.city': {
    en: 'City',
    ar: 'المدينة',
  },
  'filters.category': {
    en: 'Category',
    ar: 'التصنيف',
  },
  'filters.specialty': {
    en: 'Specialty',
    ar: 'التخصص',
  },
  'filters.search': {
    en: 'Search factories...',
    ar: 'بحث عن مصانع...',
  },
  'filters.apply': {
    en: 'Apply Filters',
    ar: 'تطبيق الفلاتر',
  },
  'filters.clear': {
    en: 'Clear Filters',
    ar: 'مسح الفلاتر',
  },
  
  // Factory details
  'factory.workdays': {
    en: 'Working Days',
    ar: 'أيام العمل',
  },
  'factory.mainImage': {
    en: 'Main Image',
    ar: 'الصورة الرئيسية',
  },
  'factory.location': {
    en: 'Location',
    ar: 'الموقع',
  },
  'factory.rating': {
    en: 'Rating',
    ar: 'التقييم',
  },
  'factory.gallery': {
    en: 'Gallery',
    ar: 'معرض الصور',
  },
  'factory.products': {
    en: 'Products',
    ar: 'المنتجات',
  },
  'factory.about': {
    en: 'About',
    ar: 'عن المصنع',
  },
  'factory.services': {
    en: 'Services',
    ar: 'الخدمات',
  },
  'factory.booking': {
    en: 'Book a Visit',
    ar: 'حجز زيارة',
  },
  
  // Form labels
  'form.name': {
    en: 'Name',
    ar: 'الاسم',
  },
  'form.email': {
    en: 'Email',
    ar: 'البريد الإلكتروني',
  },
  'form.phone': {
    en: 'Phone Number',
    ar: 'رقم الهاتف',
  },
  'form.date': {
    en: 'Preferred Date',
    ar: 'التاريخ المفضل',
  },
  'form.message': {
    en: 'Message',
    ar: 'الرسالة',
  },
  'form.submit': {
    en: 'Submit Request',
    ar: 'إرسال الطلب',
  },
  
  // Booking
  'booking.agreement': {
    en: 'I agree to the <a href="/terms" class="text-factories-blue hover:underline">Terms and Conditions</a> for booking a factory visit',
    ar: 'أوافق على <a href="/terms" class="text-factories-blue hover:underline">الشروط والأحكام</a> لحجز زيارة المصنع',
  },
  'booking.file': {
    en: 'file',
    ar: 'ملف',
  },
  
  // Generic
  'common.viewDetails': {
    en: 'View Details',
    ar: 'عرض التفاصيل',
  },
  'common.cancel': {
    en: 'Cancel',
    ar: 'إلغاء',
  },
  'common.submitting': {
    en: 'Submitting...',
    ar: 'جاري الإرسال...',
  },
  
  // Rating
  'rating.title': {
    en: 'Rate this Factory',
    ar: 'قيم هذا المصنع',
  },
  'rating.rateNow': {
    en: 'Rate Now',
    ar: 'قيم الآن',
  },
  'rating.submit': {
    en: 'Submit Rating',
    ar: 'إرسال التقييم',
  },
  'rating.emailPlaceholder': {
    en: 'Enter your email',
    ar: 'أدخل بريدك الإلكتروني',
  },
  'rating.fillAllFields': {
    en: 'Please select a rating and enter your email',
    ar: 'الرجاء اختيار تقييم وإدخال بريدك الإلكتروني',
  },
  'rating.submitError': {
    en: 'Failed to submit rating. Please try again.',
    ar: 'فشل في إرسال التقييم. يرجى المحاولة مرة أخرى.',
  },

  // Contact Form
  'contact.name': {
    en: 'Name',
    ar: 'الاسم',
  },
  'contact.email': {
    en: 'Email',
    ar: 'البريد الإلكتروني',
  },
  'contact.phone': {
    en: 'Phone Number',
    ar: 'رقم الهاتف',
  },
  'contact.message': {
    en: 'Message',
    ar: 'الرسالة',
  },
  'contact.submit': {
    en: 'Send Message',
    ar: 'إرسال الرسالة',
  },
  'contact.submitting': {
    en: 'Sending...',
    ar: 'جاري الإرسال...',
  },
  'contact.successTitle': {
    en: 'Message Sent',
    ar: 'تم إرسال الرسالة',
  },
  'contact.successMessage': {
    en: 'Thank you for your message. We will get back to you soon.',
    ar: 'شكراً لرسالتك. سنتواصل معك قريباً.',
  },
  'contact.errorTitle': {
    en: 'Error',
    ar: 'خطأ',
  },
  'contact.errorMessage': {
    en: 'Failed to send message. Please try again.',
    ar: 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
  },

  // Footer
  'footer.rights': {
    en: 'All rights reserved.',
    ar: 'جميع الحقوق محفوظة.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Try to get language from localStorage or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  // Update language and store in localStorage
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage;
    document.body.setAttribute('dir', newLanguage === 'ar' ? 'rtl' : 'ltr');
  };

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translations[key][language];
  };

  // Set initial direction and language
  useEffect(() => {
    document.documentElement.lang = language;
    document.body.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
