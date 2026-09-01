export interface ShiftNewsArticle {
  id: string;
  slug: string;
  coverImage: string;
  isFeatured?: boolean;
  
  titleEn: string;
  titleAr: string;
  
  categoryEn: string;
  categoryAr: string;
  
  summaryEn: string;
  summaryAr: string;
  
  authorNameEn: string;
  authorNameAr: string;
  
  publishedDateEn: string;
  publishedDateAr: string;
  
  readTimeEn: string;
  readTimeAr: string;
  
  fullContentEn: string;
  fullContentAr: string;

  // Fallbacks for direct access
  title?: string;
  category?: string;
  summary?: string;
  authorName?: string;
  publishedDate?: string;
  readTime?: string;
  fullContent?: string;
}

export const SHIFT_FEATURED_ARTICLE: ShiftNewsArticle = {
  id: 'shift-1',
  slug: 'taxi-replacement-aswan',
  coverImage:
    'https://media.gemini.media/img/shift-eg/medium/2026/8/31/2026_8_31_15_20_42_331.webp',
  isFeatured: true,

  titleEn: 'Aswan Taxi Replacement Initiative Launched for Modern Fleet Upgrade',
  titleAr: '«مستعمل حديث بمستعمل قديم».. تفاصيل مبادرة إحلال سيارات التاكسي في أسوان',

  categoryEn: 'Local News',
  categoryAr: 'محلية',

  summaryEn:
    'Aswan governorate announced a comprehensive initiative to replace aging passenger taxis with eco-friendly modern sedans under low-interest financing packages.',
  summaryAr:
    'أعلنت محافظة أسوان عبر صفحتها الرسمية عن مبادرة لإحلال وتجديد سيارات التاكسي القديمة بأخرى حديثة، بهدف الارتقاء بمنظومة النقل وتوفير حزم تمويلية ميسرة.',

  authorNameEn: 'Shift-EG Local Desk',
  authorNameAr: 'محرر شيفت مصر',

  publishedDateEn: 'Aug 31, 2026',
  publishedDateAr: '31 أغسطس 2026',

  readTimeEn: '4 min read',
  readTimeAr: '4 دقائق',

  fullContentEn:
    'The governorate of Aswan officially announced on social media the launch of a public-private partnership initiative to trade in aging passenger taxis for brand new fuel-efficient models. The scheme provides taxi drivers with accessible installment financing options, reduces carbon emissions in tourist areas, and upgrades urban public transportation standards.',
  fullContentAr:
    'أعلنت محافظة أسوان عبر صفحتها الرسمية على موقع التواصل الاجتماعي "فيسبوك" عن إطلاق مبادرة جديدة لإحلال وتجديد سيارات نقل الركاب "التاكسي" القديمة بأخرى حديثة. وتهدف المبادرة إلى التسهيل على سائقي التاكسي بتقديم حزم تمويلية ميسرة وتسهيلات في السداد، بالإضافة إلى تقليل الانبعاثات الكربونية وتحسين الخدمات المقدمة للأهالي والزائرين للمدينة السياحية.',
};

export const SHIFT_ARTICLES_LIST: ShiftNewsArticle[] = [
  {
    id: 'shift-2',
    slug: 'baic-u5-plus-manual-egypt',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2024/5/31/2024_5_31_15_5_20_130.webp',

    titleEn: 'Alkan Auto Launches BAIC U5 Plus Manual in Egypt at EGP 695,000',
    titleAr: 'لأول مرة في مصر.. ألكان أوتو تطرح بايك U5 Plus مانيوال بسعر 695 ألف جنيه',

    categoryEn: 'Car Prices',
    categoryAr: 'أسعار السيارات',

    summaryEn:
      'Alkan Auto, official agent for BAIC in Egypt, introduced a 5-speed manual transmission variant of the U5 Plus sedan, targeting competitive price value.',
    summaryAr:
      'أعلنت شركة ألكان أوتو، الوكيل المحلي لعلامة بايك في مصر، عن طرح فئة جديدة من السيارة بايك U5 Plus السيدان مزودة بناقل حركة يدوي «مانيوال» بسعر تنافسي.',

    authorNameEn: 'Shift Auto Desk',
    authorNameAr: 'شيفت أوتو',

    publishedDateEn: 'Aug 31, 2026',
    publishedDateAr: '31 أغسطس 2026',

    readTimeEn: '3 min read',
    readTimeAr: '3 دقائق',

    fullContentEn:
      'Alkan Auto, the official distributor of Chinese brand BAIC in Egypt, unveiled a manual transmission trim of the compact U5 Plus sedan. Powered by a 1.5-liter engine delivering 111 HP and paired with a 5-speed manual gearbox, the model comes equipped with ABS, EBD, dual airbags, and an 8-inch touchscreen at an MSRP of EGP 695,000.',
    fullContentAr:
      'طرحت شركة ألكان أوتو، الوكيل الرسمي لعلامة بايك الصينية في مصر، الفئة الجديدة من السيدان الاقتصادية BAIC U5 Plus المزودة بنقل حركة يدوي من 5 سرعات. تقدم السيارة بمحرك 1.5 ليتر بقوة 111 حصان، مع تجهيزات أمان تشمل فرامل ABS وتوزيع إلكتروني للفرامل EBD ووسائد هوائية أمامية وشاشة لمسية قياس 8 بوصة بسعر رسمي 695 ألف جنيه.',
  },
  {
    id: 'shift-3',
    slug: 'trump-tariffs-canada-toyota-honda',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/8/31/2026_8_31_13_41_0_575.webp',

    titleEn: 'Trump Tariffs Against Canada Impact Toyota & Honda Supply Chains',
    titleAr: 'رسوم ترامب ضد كندا تضرب سيارات تويوتا وهوندا في مقتل.. ما القصة؟',

    categoryEn: 'Global News',
    categoryAr: 'عالمية',

    summaryEn:
      'Proposed tariff levies on North American imports threaten Japanese automakers Toyota and Honda, whose major US-market crossover production relies on Canadian plants.',
    summaryAr:
      'كشف تقرير لوكالة رويترز أن الرسوم الجمركية التي يسعى الرئيس الأمريكي إلى فرضها على واردات السيارات الكندية قد تتحمل النصيب الأكبر من تداعياتها شركتا تويوتا وهوندا.',

    authorNameEn: 'Reuters / Shift',
    authorNameAr: 'رويترز / شيفت',

    publishedDateEn: 'Aug 31, 2026',
    publishedDateAr: '31 أغسطس 2026',

    readTimeEn: '5 min read',
    readTimeAr: '5 دقائق',

    fullContentEn:
      'A Reuters report highlights severe supply chain disruption for Toyota Motor and Honda Motor due to proposed tariff adjustments on Canadian automotive exports. Both manufacturers produce flagship crossovers like the Toyota RAV4 and Honda CR-V in Ontario facilities bound for US dealership networks.',
    fullContentAr:
      'تواجه مصانع تويوتا وهوندا في كندا تحديات كبيرة عقب المقترحات الجمركية الجديدة على واردات السيارات من شمال أمريكا. وتصنع الشركتان النسبة الأكبر من الطرازات الموجهة للسوق الأمريكي داخل المصانع الكندية، مما قد يؤدي لارتفاع أسعار موديلات مثل تويوتا RAV4 وهوندا CR-V بأكثر من 15%.',
  },
  {
    id: 'shift-4',
    slug: 'volkswagen-iron-dome-plant-germany',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/8/31/2026_8_31_13_36_28_971.webp',

    titleEn: 'Volkswagen Explores Defense Tech Manufacturing at Osnabrück Plant',
    titleAr: 'القبة الحديدية تنقذ مصنع فولكس فاجن من الإغلاق.. خطة ألمانية إسرائيلية',

    categoryEn: 'Technology',
    categoryAr: 'تكنولوجيا',

    summaryEn:
      'VW Group considers re-tooling part of its Osnabrück assembly plant for high-tech components and defense electronics in partnership with tech firms.',
    summaryAr:
      'كشفت تقارير أن شركة فولكس فاجن الألمانية تدرس تحويل جزء من نشاط مصنعها في مدينة أوسنابروك إلى إنتاج مكونات ومعدات دفاعية لصالح شركات التكنولوجيا.',

    authorNameEn: 'DW Tech Report',
    authorNameAr: 'تقارير دويتشه فيله',

    publishedDateEn: 'Aug 31, 2026',
    publishedDateAr: '31 أغسطس 2026',

    readTimeEn: '4 min read',
    readTimeAr: '4 دقائق',

    fullContentEn:
      'Volkswagen Group is evaluating strategic re-allocation options for its Osnabrück plant in Germany. Facing overcapacity in traditional combustion vehicle lines, the carmaker is exploring joint production agreements with systems integration and robotics suppliers.',
    fullContentAr:
      'تسعى مجموعة فولكس فاجن لتفادي إغلاق أحد أعرق مصانعها في ألمانيا من خلال التحول نحو الإنتاج التكنولوجي والدفاعي بالشراكة مع شركات تكنولوجيا النظم. وتأتي الخطوة في إطار إعادة هيكلة خطوط الإنتاج التقليدية للسيارات الاحتراق الداخلي والتحول نحو المنظومات الذكية.',
  },
  {
    id: 'shift-5',
    slug: 'renault-taliant-cheapest-european-car-egypt',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/8/17/2026_8_17_15_24_53_657.webp',

    titleEn: 'Renault Taliant: Egypt’s Most Affordable European Sedan',
    titleAr: 'رينو تاليانت.. أرخص سيارة أوروبية جديدة تقدم لعملاء السوق المصري',

    categoryEn: 'Reports',
    categoryAr: 'تقارير',

    summaryEn:
      'The Renault Taliant maintains its rank as the lowest-priced brand-new European import sedan in the Egyptian automotive market with 1.0 Turbo power.',
    summaryAr:
      'تواصل رينو تاليانت تعزيز مكانتها داخل السوق المصري، بعدما نجحت في الحفاظ على لقب أرخص سيارة أوروبية جديدة متاحة للبيع في مصر.',

    authorNameEn: 'Shift Market Team',
    authorNameAr: 'فريق قسم التقارير',

    publishedDateEn: 'Aug 31, 2026',
    publishedDateAr: '31 أغسطس 2026',

    readTimeEn: '4 min read',
    readTimeAr: '4 دقائق',

    fullContentEn:
      'Renault Taliant remains a strong contender for budget-conscious Egyptian buyers seeking European engineering. Powered by a 1.0-liter turbocharged engine paired with an efficient CVT transmission, the sedan offers ESP, rear parking sensors, and a touchscreen infotainment system.',
    fullContentAr:
      'تستمر رينو تاليانت في المنافسة بقوة بفضل محركها التربو 1.0 ليتر بقوة 100 حصان وتجهيزاتها المتكاملة. تشمل السيارة شاشة ترفيهية تعمل باللمس، عجلة قيادة متعددة الوظائف، أنظمة أمان متطورة مثل ESP وحساسات ركن خلفية وسعر رسمي يثير اهتمام الباحثين عن جودة أوروبية واقتصادية في التشغيل.',
  },
  {
    id: 'shift-6',
    slug: 'nissan-egypt-wahdan-auto-nozha',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/8/31/2026_8_31_10_42_17_787.webp',

    titleEn: 'Nissan Egypt Opens Integrated Facility with Wahdan Auto in Nozha',
    titleAr: 'في النزهة الجديدة.. نيسان مصر تفتتح فرعًا جديدًا بالتعاون مع وهدان أوتو',

    categoryEn: 'Local News',
    categoryAr: 'محلية',

    summaryEn:
      'Nissan Egypt and Wahdan Auto inaugurated an upgraded 3S facility in New Nozha featuring Nissan global retail identity and quick-service bays.',
    summaryAr:
      'أعلنت "نيسان مصر" بالتعاون مع "وهدان أوتو" الافتتاح الرسمي لفرع متكامل بمنطقة النزهة الجديدة في القاهرة بعد تحديثه وفق الهوية العالمية لنيسان.',

    authorNameEn: 'Shift Local Desk',
    authorNameAr: 'محرر شيفت مصر',

    publishedDateEn: 'Aug 31, 2026',
    publishedDateAr: '31 أغسطس 2026',

    readTimeEn: '3 min read',
    readTimeAr: '3 دقائق',

    fullContentEn:
      'Nissan Motor Egypt, in partnership with authorized dealer Wahdan Auto, officially opened a newly modernized showroom and 3S service complex in New Nozha, Cairo. The facility aligns with Nissan NRC global brand identity, housing modern sales floors and diagnostic tools.',
    fullContentAr:
      'شهدت منطقة النزهة الجديدة افتتاح أحدث مراكز نيسان المعتمدة بالتعاون مع وهدان أوتو. يضم المركز صالة عرض متطورة تستعرض أحدث موديلات نيسان صني وقشقاي وجوك، بالإضافة إلى مركز صيانة سريع مجهز بأحدث أجهزة الفحص الإلكتروني وقطع غيار نيسان الأصلية.',
  },
  {
    id: 'shift-7',
    slug: 'indrive-ai-driver-inspection-egypt',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/8/30/2026_8_30_12_39_32_422.webp',

    titleEn: 'inDrive Implements AI Verification for Drivers & Vehicles',
    titleAr: 'الذكاء الاصطناعي يراقب السائقين والسيارات.. إجراءات جديدة من إندرايف',

    categoryEn: 'Technology',
    categoryAr: 'تكنولوجيا',

    summaryEn:
      'Global ride-hailing platform inDrive rolled out real-time AI computer vision tools to inspect driver identities and vehicle license conditions.',
    summaryAr:
      'تواصل شركة إندرايف تعزيز منظومة الأمان والسلامة على منصتها من خلال الاعتماد على تقنيات الذكاء الاصطناعي في التحقق من هويات السائقين وفحص المركبات.',

    authorNameEn: 'Shift Tech Desk',
    authorNameAr: 'قسم التكنولوجيا',

    publishedDateEn: 'Aug 30, 2026',
    publishedDateAr: '30 أغسطس 2026',

    readTimeEn: '4 min read',
    readTimeAr: '4 دقائق',

    fullContentEn:
      'Ride-hailing service inDrive deployed automated artificial intelligence verification features to enhance passenger safety across its platform. The AI engine continuously checks driver permits, facial recognition metrics, and vehicle safety status prior to ride confirmation.',
    fullContentAr:
      'أطلقت منصة NDrive العالمية حزمة تحديثات جديدة تعتمد على شبكات التعرف الذاتي والذكاء الاصطناعي للتحقق اللحظي من سلامة رخص القيادة وحالة السيارات قبل بدء الرحلات. تهدف هذه الإجراءات للارتقاء بمعايير السلامة والأمان للركاب وسائقي النقل الذكي في مصر والشرق الأوسط.',
  },
];

export function getLocalizedArticle(article: ShiftNewsArticle, lang: 'EN' | 'AR') {
  const isEn = lang === 'EN';
  return {
    ...article,
    title: isEn ? article.titleEn : article.titleAr,
    category: isEn ? article.categoryEn : article.categoryAr,
    summary: isEn ? article.summaryEn : article.summaryAr,
    authorName: isEn ? article.authorNameEn : article.authorNameAr,
    publishedDate: isEn ? article.publishedDateEn : article.publishedDateAr,
    readTime: isEn ? article.readTimeEn : article.readTimeAr,
    fullContent: isEn ? article.fullContentEn : article.fullContentAr,
  };
}
