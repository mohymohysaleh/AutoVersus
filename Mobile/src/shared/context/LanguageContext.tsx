import React, { createContext, useContext, useState } from 'react';

export type Language = 'EN' | 'AR';

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  EN: {
    // Header & Navigation
    'app.tagline': 'GLOBAL AUTOMOTIVE CATALOG',
    'app.title': 'AutoVersus',
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.compare': 'Compare',
    'nav.news': 'News',
    'nav.profile': 'Profile',
    'nav.search': 'Search',

    // Home Screen
    'home.searchPlaceholder': 'Search make, model, or spec...',
    'home.findMyCarTitle': 'AI Car Matcher',
    'home.findMyCarSubtitle': 'Answer 3 quick questions to discover your ideal car',
    'home.startQuiz': 'Start AI Quiz',
    'home.popularNow': 'Popular Vehicles',
    'home.seeAll': 'See All',
    'home.latestNews': 'Latest News',
    'home.newsFeedLabel': 'SHIFT-EG AUTOMOTIVE FEED',

    // Catalog / Search Screen
    'catalog.title': 'Vehicle Catalog',
    'catalog.allBrands': 'All Brands',
    'catalog.filterSpecs': 'Filter Specs',
    'catalog.resultsCount': 'vehicles available',
    'catalog.sortBy': 'Sort by',
    'catalog.priceLowHigh': 'Price: Low to High',
    'catalog.priceHighLow': 'Price: High to Low',
    'catalog.powerHighLow': 'Power: High to Low',

    // Car Details Screen
    'details.saveToGarage': 'Save to Garage',
    'details.savedInGarage': 'Saved in Garage',
    'details.overview': 'Overview',
    'details.specs': 'Specs',
    'details.safety': 'Safety',
    'details.features': 'Features',
    'details.horsepower': 'Horsepower',
    'details.torque': 'Torque',
    'details.zeroToHundred': '0 - 100 km/h',
    'details.topSpeed': 'Top Speed',
    'details.fuelEconomy': 'Fuel Economy',
    'details.airbags': 'Airbags',
    'details.enginePowertrain': 'ENGINE & POWERTRAIN',
    'details.fuelType': 'Fuel Type',
    'details.displacement': 'Displacement',
    'details.transmission': 'Transmission',
    'details.drivetrain': 'Drivetrain',
    'details.dimensionsCapacity': 'DIMENSIONS & CAPACITY',
    'details.dimensions': 'Length × Width × Height',
    'details.wheelbase': 'Wheelbase',
    'details.trunkVolume': 'Trunk Cargo Volume',
    'details.seating': 'Seating Capacity',
    'details.safetyAssistance': 'SAFETY & DRIVER ASSISTANCE',
    'details.findDealership': 'Find Dealership / Request Quote',

    // News Screen
    'news.editorialTag': 'SHIFT-EG AUTOMOTIVE FEED',
    'news.headerTitle': 'Automotive News & Reviews',
    'news.all': 'All',
    'news.local': 'Local',
    'news.prices': 'Car Prices',
    'news.global': 'Global',
    'news.tech': 'Technology',
    'news.reports': 'Reports',
    'news.latestStories': 'Latest Stories',
    'news.articlesCount': 'articles',
    'news.readTime': 'read',
    'news.sourceTag': 'Source: Shift-EG Egypt',

    // Comparison Screen
    'compare.title': 'Vehicle Comparison',
    'compare.subtitle': 'Compare specs side by side',
    'compare.addCar': 'Add Car to Compare',
    'compare.vs': 'VS',

    // Profile Screen
    'profile.title': 'My Profile',
    'profile.savedGarage': 'Saved Garage',
    'profile.accountSettings': 'Account Settings',
    'profile.language': 'Language / اللغة',
    'profile.logout': 'Sign Out',
  },
  AR: {
    // Header & Navigation
    'app.tagline': 'دليل السيارات العالمي',
    'app.title': 'أوتو فيرسس',
    'nav.home': 'الرئيسية',
    'nav.catalog': 'الكتالوج',
    'nav.compare': 'المقارنة',
    'nav.news': 'الأخبار',
    'nav.profile': 'الحساب',
    'nav.search': 'البحث',

    // Home Screen
    'home.searchPlaceholder': 'ابحث عن الماركة، الموديل، أو المواصفات...',
    'home.findMyCarTitle': 'مساعد السيارات الذكي',
    'home.findMyCarSubtitle': 'أجب عن 3 أسئلة سريعة لاكتشاف السيارة المناسبة لك',
    'home.startQuiz': 'ابدأ الاختبار الذكي',
    'home.popularNow': 'السيارات الأكثر طلباً',
    'home.seeAll': 'عرض الكل',
    'home.latestNews': 'أحدث الأخبار',
    'home.newsFeedLabel': 'تغطية أخبار السيارات - شيفت',

    // Catalog / Search Screen
    'catalog.title': 'كتالوج السيارات',
    'catalog.allBrands': 'جميع الماركات',
    'catalog.filterSpecs': 'فلترة المواصفات',
    'catalog.resultsCount': 'سيارة متاحة',
    'catalog.sortBy': 'ترتيب حسب',
    'catalog.priceLowHigh': 'السعر: من الأقل للأعلى',
    'catalog.priceHighLow': 'السعر: من الأعلى للأقل',
    'catalog.powerHighLow': 'القوة: من الأعلى للأقل',

    // Car Details Screen
    'details.saveToGarage': 'حفظ في الكراج',
    'details.savedInGarage': 'محفوظ في الكراج',
    'details.overview': 'نظرة عامة',
    'details.specs': 'المواصفات',
    'details.safety': 'الأمان',
    'details.features': 'التجهيزات',
    'details.horsepower': 'القوة الحصانية',
    'details.torque': 'عزم دوران',
    'details.zeroToHundred': '0 - 100 كم/س',
    'details.topSpeed': 'السرعة القصوى',
    'details.fuelEconomy': 'استهلاك الوقود',
    'details.airbags': 'الوسائد الهوائية',
    'details.enginePowertrain': 'المحرك وناقل الحركة',
    'details.fuelType': 'نوع الوقود',
    'details.displacement': 'سعة المحرك',
    'details.transmission': 'ناقل الحركة',
    'details.drivetrain': 'منظومة الدفع',
    'details.dimensionsCapacity': 'الأبعاد والسعة',
    'details.dimensions': 'الطول × العرض × الارتفاع',
    'details.wheelbase': 'قاعدة العجلات',
    'details.trunkVolume': 'سعة الحقيبة الخلفية',
    'details.seating': 'سعة الركاب',
    'details.safetyAssistance': 'أنظمة الأمان والسلامة',
    'details.findDealership': 'استعلام عن وكيل / طلب عرض سعر',

    // News Screen
    'news.editorialTag': 'تغطيات أوتو فيرسس - شيفت',
    'news.headerTitle': 'أخبار وتغطيات السيارات',
    'news.all': 'الكل',
    'news.local': 'محلية',
    'news.prices': 'أسعار السيارات',
    'news.global': 'عالمية',
    'news.tech': 'تكنولوجيا',
    'news.reports': 'تقارير',
    'news.latestStories': 'أحدث الأخبار',
    'news.articlesCount': 'خبر',
    'news.readTime': 'قراءة',
    'news.sourceTag': 'المصدر: شيفت مصر',

    // Comparison Screen
    'compare.title': 'مقارنة السيارات',
    'compare.subtitle': 'مقارنة المواصفات جنباً إلى جنب',
    'compare.addCar': 'إضافة سيارة للمقارنة',
    'compare.vs': 'ضد',

    // Profile Screen
    'profile.title': 'الملف الشخصي',
    'profile.savedGarage': 'كراجي المحفوظ',
    'profile.accountSettings': 'إعدادات الحساب',
    'profile.language': 'اللغة / Language',
    'profile.logout': 'تسجيل الخروج',
  },
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'EN',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
  isRTL: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'AR' : 'EN'));
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.EN?.[key] || key;
  };

  const isRTL = language === 'AR';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
