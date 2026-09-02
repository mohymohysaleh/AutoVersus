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
  slug: 'used-cars-prices-egypt-guide',
  coverImage:
    'https://media.gemini.media/img/shift-eg/medium/2024/2/1/2024_2_1_13_53_33_792.webp',
  isFeatured: true,

  titleEn: 'Before Buying: 5 Economy Used Cars in the Egyptian Market',
  titleAr: 'قبل الشراء.. تعرف على أسعار 5 سيارات اقتصادية في سوق المستعمل',

  categoryEn: 'Local News',
  categoryAr: 'محلية',

  summaryEn:
    'With rising new car prices in Egypt, buyers turn to the used market for reliable, low-maintenance options with cheap spare parts.',
  summaryAr:
    'مع ارتفاع أسعار السيارات الجديدة في السوق المصري، اتجهت شريحة من المستهلكين إلى سوق السيارات المستعملة بحثًا عن خيارات اقتصادية واعتمادية.',

  authorNameEn: 'Shift-EG Local Desk',
  authorNameAr: 'محرر شيفت مصر',

  publishedDateEn: 'Sep 02, 2026',
  publishedDateAr: '02 سبتمبر 2026',

  readTimeEn: '4 min read',
  readTimeAr: '4 دقائق',

  fullContentEn:
    'With rising new car prices in Egypt, consumers turn to used cars offering low fuel consumption, cheap spare parts, and high resale value. Key models include the Nissan Sunny, Toyota Corolla, Hyundai Verna, Fiat Tipo, and Chevrolet Optra.',
  fullContentAr:
    'مع ارتفاع أسعار السيارات الجديدة في السوق المصري، اتجهت شريحة من المستهلكين إلى سوق السيارات المستعملة، بحثًا عن خيارات تجمع بين الاعتمادية وانخفاض تكاليف التشغيل والصيانة، إلى جانب توافر قطع الغيار وسهولة إعادة البيع.',
};

export const SHIFT_ARTICLES_LIST: ShiftNewsArticle[] = [
  {
    id: 'shift-2',
    slug: 'sisi-jinping-ev-manufacturing-egypt',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/9/2/2026_9_2_16_27_11_735.webp',

    titleEn: 'Sisi & Xi Jinping Pave the Way for EV Manufacturing in Egypt',
    titleAr: 'السيسي وجين بينج يمهدان الطريق أمام تصنيع السيارات الكهربائية في مصر',

    categoryEn: 'Local News',
    categoryAr: 'محلية',

    summaryEn:
      'President Sisi and Chinese President Xi Jinping agreed in Cairo to boost industrial technology cooperation and localize EV manufacturing.',
    summaryAr:
      'اتفق الرئيس عبد الفتاح السيسي والرئيس الصيني شي جين بينج على تعزيز التعاون بين مصر والصين لتوطين صناعة السيارات الكهربائية.',

    authorNameEn: 'Shift Desk',
    authorNameAr: 'شيفت مصر',

    publishedDateEn: 'Sep 02, 2026',
    publishedDateAr: '02 سبتمبر 2026',

    readTimeEn: '4 min read',
    readTimeAr: '4 دقائق',

    fullContentEn:
      'President Abdel Fattah El-Sisi and Chinese President Xi Jinping held talks in Cairo, agreeing to expand partnership frameworks for Electric Vehicle (EV) localized assembly, battery manufacturing, and technology transfer.',
    fullContentAr:
      'اتفق الرئيس عبد الفتاح السيسي، والرئيس الصيني شي جين بينج، خلال مباحثاتهما في القاهرة، على بحث سبل تعزيز التعاون بين مصر والصين في عدد من المجالات الصناعية والتكنولوجية، من بينها توطين صناعة السيارات الكهربائية.',
  },
  {
    id: 'shift-3',
    slug: 'honda-cost-reduction-chinese-competition',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2025/6/18/2025_6_18_17_1_22_14.webp',

    titleEn: 'Honda Aims to Save $9.4B to Compete with Chinese EV Makers',
    titleAr: 'هوندا تسعى لتوفير 9.4 مليار دولار لتتمكن من مواجهة شركات السيارات الصينية',

    categoryEn: 'Global News',
    categoryAr: 'عالمية',

    summaryEn:
      'Honda Motor plans $9.4 billion cost reductions over 4 years to boost EV competitiveness against Chinese automakers like BYD.',
    summaryAr:
      'تعتزم شركة هوندا اليابانية خفض تكاليفها بأكثر من 9 مليارات دولار لتعزيز قدرتها التنافسية في مواجهة السيارات الصينية وعلى رأسها BYD.',

    authorNameEn: 'Reuters / Shift',
    authorNameAr: 'رويترز / شيفت',

    publishedDateEn: 'Sep 02, 2026',
    publishedDateAr: '02 سبتمبر 2026',

    readTimeEn: '5 min read',
    readTimeAr: '5 دقائق',

    fullContentEn:
      'Honda Motor Co. unveiled a $9.4 billion cost efficiency plan to fund software-defined vehicle architectures and next-gen batteries, countering rapid global market expansion by BYD and Chinese EV brands.',
    fullContentAr:
      'تعتزم شركة هوندا اليابانية خفض تكاليفها بأكثر من 9 مليارات دولار خلال السنوات الأربع المقبلة، في إطار خطة واسعة لتعزيز قدرتها التنافسية في مواجهة شركات السيارات الصينية، وعلى رأسها BYD العملاق الصيني الجديد في عالم السيارات.',
  },
  {
    id: 'shift-4',
    slug: 'hongqi-n701-chinese-presidential-limousine',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/9/2/2026_9_2_15_44_15_95.webp',

    titleEn: 'Inside the Hongqi N701 Limousine Escorting President Xi in Egypt',
    titleAr: 'ماذا نعرف عن السيارة هونشي N701 المرافقة للرئيس الصيني في زيارته إلى مصر؟',

    categoryEn: 'Local News',
    categoryAr: 'محلية',

    summaryEn:
      'Details about the armored Hongqi N701 presidential limousine deployed during Chinese President Xi Jinping’s state visit to Cairo.',
    summaryAr:
      'تعد N701 سيارة ليموزين مصفحة مخصصة للرئاسة الصينية، ظهرت خلال زيارة الرئيس شي جين بينج الرسمية إلى القاهرة.',

    authorNameEn: 'Shift Desk',
    authorNameAr: 'محرر شيفت',

    publishedDateEn: 'Sep 02, 2026',
    publishedDateAr: '02 سبتمبر 2026',

    readTimeEn: '3 min read',
    readTimeAr: '3 دقائق',

    fullContentEn:
      'The Hongqi N701 is a custom-built armored state limousine reserved for China head of state. Equipped with a V12 engine, bulletproof plating, and advanced communication systems, it accompanied President Xi during his official Egypt visit.',
    fullContentAr:
      'تعد N701 سيارة ليموزين مخصصة للرئاسة الصينية، وتحمل اسمًا رمزيًا وليس اسمًا تجاريًا معلنًا حتى الآن. وظهرت السيارة للمرة الأولى بشكل علني خلال زيارة الرئيس شي جين بينج إلى هونج كونج في يوليو 2022.',
  },
  {
    id: 'shift-5',
    slug: 'egypt-battery-manufacturing-mansour-tianneng',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/9/2/2026_9_2_16_30_20_851.webp',

    titleEn: 'Egypt Nears Car Battery Manufacturing: Mansour & Tianneng MoU',
    titleAr: 'مصر تقترب من تصنيع بطاريات السيارات.. شراكة بين منصور وTianneng',

    categoryEn: 'Local News',
    categoryAr: 'محلية',

    summaryEn:
      'Mansour Group signed an MoU with Chinese Tianneng Battery Group to establish automotive battery manufacturing facilities in Egypt.',
    summaryAr:
      'وقعت مجموعة منصور مذكرة تفاهم مع شركة Tianneng الصينية لبحث تصنيع بطاريات السيارات داخل جمهورية مصر العربية.',

    authorNameEn: 'Shift Local Desk',
    authorNameAr: 'محرر شيفت',

    publishedDateEn: 'Sep 02, 2026',
    publishedDateAr: '02 سبتمبر 2026',

    readTimeEn: '4 min read',
    readTimeAr: '4 دقائق',

    fullContentEn:
      'Minister of Investment Dr. Mohamed Farid witnessed the signing of a strategic Memorandum of Understanding between Mansour Automotive Group and China Tianneng Battery Group to build EV and traditional car battery plants in Egypt.',
    fullContentAr:
      'شهد الدكتور محمد فريد صالح، وزير الاستثمار والتجارة الخارجية، توقيع مذكرة تفاهم بين مجموعة منصور وشركة Tianneng Battery Group Co Ltd الصينية، لبحث فرص التعاون وإنشاء مصانع لبطاريات السيارات الكهربائية والتقليدية.',
  },
  {
    id: 'shift-6',
    slug: 'geely-monjaro-em-i-egypt-launch-prices',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/9/2/2026_9_2_14_20_7_765.webp',

    titleEn: 'Geely Monjaro EM-i Officially Launched in Egypt: Specs & Prices',
    titleAr: 'جيلي Monjaro EM-i تنطلق رسميًا ولأول مرة في مصر.. أسعار ومواصفات',

    categoryEn: 'Local News',
    categoryAr: 'محلية',

    summaryEn:
      'Abu Ghaly Motors unveiled the Geely Monjaro EM-i hybrid SUV in Egypt with new-energy drive system and premium luxury specs.',
    summaryAr:
      'كشفت مجموعة أبو غالي موتورز، الوكيل المحلي لعلامة جيلي، عن السيارة Geely Monjaro EM-i الجديدة رسميًا في السوق المصري.',

    authorNameEn: 'Shift Auto Desk',
    authorNameAr: 'شيفت أوتو',

    publishedDateEn: 'Sep 02, 2026',
    publishedDateAr: '02 سبتمبر 2026',

    readTimeEn: '5 min read',
    readTimeAr: '5 دقائق',

    fullContentEn:
      'Abu Ghaly Motors officially introduced the Geely Monjaro EM-i hybrid SUV in the Egyptian market. Featuring NordThor hybrid powertrain technology, 3-screen digital cockpit, and Level-2 ADAS, it targets the luxury crossover segment.',
    fullContentAr:
      'كشفت مجموعة أبو غالي موتورز، الوكيل المحلي لعلامة جيلي في مصر، عن السيارة Geely Monjaro EM-i الجديدة رسميًا في السوق المصري، لتنضم إلى طرازات العلامة الصينية المقدمة بتقنيات الطاقة الجديدة.',
  },
  {
    id: 'shift-7',
    slug: 'zc-rubber-tire-factory-egypt',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/9/2/2026_9_2_16_32_40_637.webp',

    titleEn: 'ZC Rubber Considers $500M Mega Tire Factory in Egypt',
    titleAr: 'بـ 500 مليون دولار.. ZC Rubber تدرس إنشاء مجمع إطارات ضخم بمصر',

    categoryEn: 'Local News',
    categoryAr: 'محلية',

    summaryEn:
      'Chinese ZC Rubber signed a letter of intent to invest $500M in a massive tire manufacturing complex inside SCZONE in Egypt.',
    summaryAr:
      'وقعت مجموعة ZC Rubber الصينية خطاب نوايا لإنشاء مجمع إطارات ضخم باستثمارات 500 مليون دولار بالمنطقة الاقتصادية لقناة السويس.',

    authorNameEn: 'Shift Business Desk',
    authorNameAr: 'محرر شيفت',

    publishedDateEn: 'Sep 02, 2026',
    publishedDateAr: '02 سبتمبر 2026',

    readTimeEn: '4 min read',
    readTimeAr: '4 دقائق',

    fullContentEn:
      'ZC Rubber Group signed a letter of intent with SCZONE authority to build a $500 million tire manufacturing plant in Suez Economic Zone, supplying local vehicle assemblers and export markets in the Middle East and Africa.',
    fullContentAr:
      'شهد الدكتور محمد فريد، وزير الاستثمار والتجارة الخارجية، ومصطفى شيخون، رئيس الهيئة العامة للمنطقة الاقتصادية لقناة السويس، توقيع خطاب نوايا مع مجموعة ZC Rubber الصينية لإنشاء مصنع إطارات عالمي باستثمارات 500 مليون دولار.',
  },
  {
    id: 'shift-8',
    slug: 'chinese-cars-market-lead-egypt',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/9/1/2026_9_1_15_35_40_950.webp',

    titleEn: 'How Chinese Automakers Claimed Top Market Share in Egypt',
    titleAr: 'تزامنًا مع زيارة شي جين بينج| كيف نجحت السيارات الصينية في تصدر السوق المصري؟',

    categoryEn: 'Local News',
    categoryAr: 'محلية',

    summaryEn:
      'Report analyzing how Chinese car brands captured over 40% of Egyptian new car sales through localized assembly and rich tech specs.',
    summaryAr:
      'تحليل حول كيفية نجاح العلامات الصينية في كسب ثقة المستهلك المصري وتصدر المبيعات بفضل التجميع المحلي والتكنولوجيا الحديثة.',

    authorNameEn: 'Shift Analysis',
    authorNameAr: 'تحليلات شيفت',

    publishedDateEn: 'Sep 01, 2026',
    publishedDateAr: '01 سبتمبر 2026',

    readTimeEn: '5 min read',
    readTimeAr: '5 دقائق',

    fullContentEn:
      'Coinciding with President Xi Jinping state visit, market analysis shows Chinese auto brands (Chery, MG, BYD, Geely, BAIC) now account for over 40% of Egyptian passenger car sales due to aggressive pricing, local assembly, and modern specs.',
    fullContentAr:
      'تستضيف مصر الرئيس الصيني شي جين بينج في زيارة تتزامن مع احتفال البلدين بمرور 70 عامًا على العلاقات الدبلوماسية. واستطاعت السيارات الصينية حصد أكثر من 40% من مبيعات السوق المصري بفضل التجميع المحلي والأسعار التنافسية.',
  },
  {
    id: 'shift-9',
    slug: 'aswan-taxi-replacement-initiative',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/8/31/2026_8_31_15_20_42_331.webp',

    titleEn: 'Aswan Taxi Replacement Initiative Details',
    titleAr: '«مستعمل حديث بمستعمل قديم».. تفاصيل مبادرة إحلال سيارات التاكسي في أسوان',

    categoryEn: 'Local News',
    categoryAr: 'محلية',

    summaryEn:
      'Aswan governorate announced a comprehensive initiative to replace aging passenger taxis with eco-friendly modern sedans.',
    summaryAr:
      'أعلنت محافظة أسوان عن مبادرة لإحلال وتجديد سيارات التاكسي القديمة بأخرى حديثة لتحديث أسطول النقل بالمدينة.',

    authorNameEn: 'Shift Local Desk',
    authorNameAr: 'محرر شيفت',

    publishedDateEn: 'Aug 31, 2026',
    publishedDateAr: '31 أغسطس 2026',

    readTimeEn: '4 min read',
    readTimeAr: '4 دقائق',

    fullContentEn:
      'Aswan governorate launched a public trade-in program for taxi owners, offering low-interest bank loans and subsidies for modern fuel-efficient sedans.',
    fullContentAr:
      'أعلنت محافظة أسوان عبر صفحتها الرسمية عن مبادرة لإحلال وتجديد سيارات نقل الركاب "التاكسي" القديمة بأخرى حديثة، بهدف الارتقاء بمنظومة النقل وتوفير تسهيلات تمويلية.',
  },
  {
    id: 'shift-10',
    slug: 'baic-u5-plus-manual-egypt-launch',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2024/5/31/2024_5_31_15_5_20_130.webp',

    titleEn: 'BAIC U5 Plus Manual Launched in Egypt at EGP 695,000',
    titleAr: 'لأول مرة في مصر.. ألكان أوتو تطرح بايك U5 Plus مانيوال بسعر 695 ألف جنيه',

    categoryEn: 'Car Prices',
    categoryAr: 'أسعار السيارات',

    summaryEn:
      'Alkan Auto introduced a 5-speed manual transmission variant of the BAIC U5 Plus sedan priced at EGP 695,000.',
    summaryAr:
      'أعلنت شركة ألكان أوتو عن طرح فئة جديدة من السيارة بايك U5 Plus بمحرك 1.5L وناقل حركة يدوي بسعر 695 ألف جنيه.',

    authorNameEn: 'Shift Auto Desk',
    authorNameAr: 'شيفت أوتو',

    publishedDateEn: 'Aug 31, 2026',
    publishedDateAr: '31 أغسطس 2026',

    readTimeEn: '3 min read',
    readTimeAr: '3 دقائق',

    fullContentEn:
      'Alkan Auto launched the manual trim of BAIC U5 Plus sedan in Egypt. Equipped with a 1.5L 111 HP engine, 5-speed manual transmission, ABS, EBD, and 8-inch screen at EGP 695,000.',
    fullContentAr:
      'طرحت شركة ألكان أوتو، الوكيل الرسمي لعلامة بايك في مصر، الفئة الجديدة من السيدان BAIC U5 Plus بنقل حركة يدوي من 5 سرعات ومحرك 1.5L بسعر 695 ألف جنيه.',
  },
  {
    id: 'shift-11',
    slug: 'nissan-egypt-wahdan-nozha-branch',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/8/31/2026_8_31_10_42_17_787.webp',

    titleEn: 'Nissan Egypt Opens New Integrated 3S Center in New Nozha',
    titleAr: 'في النزهة الجديدة.. نيسان مصر تفتتح فرعًا جديدًا بالتعاون مع وهدان أوتو',

    categoryEn: 'Local News',
    categoryAr: 'محلية',

    summaryEn:
      'Nissan Egypt and Wahdan Auto inaugurated a modern 3S showroom and service facility in New Nozha, Cairo.',
    summaryAr:
      'افتتحت نيسان مصر بالتعاون مع وهدان أوتو فرعًا متكاملاً 3S في منطقة النزهة الجديدة بالقاهرة وفق التقييم العالمي لنيسان.',

    authorNameEn: 'Shift Desk',
    authorNameAr: 'محرر شيفت',

    publishedDateEn: 'Aug 31, 2026',
    publishedDateAr: '31 أغسطس 2026',

    readTimeEn: '3 min read',
    readTimeAr: '3 دقائق',

    fullContentEn:
      'Nissan Motor Egypt partnered with Wahdan Auto to open an updated 3S sales and service center in New Nozha, Cairo, built to NRC global retail standards.',
    fullContentAr:
      'أعلنت نيسان مصر بالتعاون مع وهدان أوتو الافتتاح الرسمي لفرع متكامل بمنطقة النزهة الجديدة بالقاهرة بعد تحديثه وفق الهوية العالمية لنيسان.',
  },
  {
    id: 'shift-12',
    slug: 'indrive-ai-safety-verification',
    coverImage:
      'https://media.gemini.media/img/shift-eg/medium/2026/8/30/2026_8_30_12_39_32_422.webp',

    titleEn: 'inDrive Deploys AI to Verify Drivers & Vehicles',
    titleAr: 'الذكاء الاصطناعي يراقب السائقين والسيارات.. إجراءات جديدة من إندرايف',

    categoryEn: 'Technology',
    categoryAr: 'تكنولوجيا',

    summaryEn:
      'inDrive introduced AI computer vision verification tools to inspect driver credentials and vehicle safety compliance.',
    summaryAr:
      'تعتمد إندرايف على تقنيات الذكاء الاصطناعي للتحقق اللحظي من هويات السائقين وفحص رخص السيارات.',

    authorNameEn: 'Shift Tech Desk',
    authorNameAr: 'قسم التكنولوجيا',

    publishedDateEn: 'Aug 30, 2026',
    publishedDateAr: '30 أغسطس 2026',

    readTimeEn: '4 min read',
    readTimeAr: '4 دقائق',

    fullContentEn:
      'Ride-hailing platform inDrive launched automated AI facial recognition and license document validation systems across Egypt and North Africa.',
    fullContentAr:
      'تواصل شركة إندرايف تعزيز منظومة الأمان على منصتها من خلال الاعتماد على تقنيات الذكاء الاصطناعي للتحقق من هويات السائقين وفحص السيارات.',
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
