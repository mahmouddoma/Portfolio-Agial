import type { LocalizedText } from '../services/language.service';

export interface LocalizedNavItem {
  readonly id: string;
  readonly label: LocalizedText;
}

export interface LocalizedImage {
  readonly src: string;
  readonly alt: LocalizedText;
}

export interface LocalizedMetric {
  readonly label: LocalizedText;
  readonly value: LocalizedText;
}

export const NAV_ITEMS: readonly LocalizedNavItem[] = [
  { id: 'about', label: { ar: 'من نحن', en: 'About' } },
  { id: 'features', label: { ar: 'المميزات', en: 'Features' } },
  { id: 'our-services', label: { ar: 'خدماتنا', en: 'Programs' } },
  { id: 'packages', label: { ar: 'الباقات', en: 'Packages' } },
  { id: 'contact', label: { ar: 'اتصل بنا', en: 'Contact' } },
];

export const HEADER_CONTENT = {
  brandName: { ar: 'أجيال القرآن', en: 'Ajyal Al Quran' },
  logoAlt: { ar: 'شعار أجيال القرآن', en: 'Ajyal Al Quran logo' },
  navigationAria: { ar: 'التنقل الرئيسي', en: 'Main navigation' },
  menuToggleAria: { ar: 'فتح القائمة', en: 'Open menu' },
};

export const HERO_CONTENT = {
  slides: [
    {
      src: 'banner.png',
      alt: { ar: 'طالب يقرأ القرآن في بيئة تعليمية', en: 'Student reading Quran in a learning setting' },
    },
    {
      src: 'muslims-reading-from-quran.jpg',
      alt: { ar: 'حلقة تعليم قرآن للأطفال', en: 'Quran learning circle for children' },
    },
    {
      src: 'silhouette-woman-reading-quran.jpg',
      alt: { ar: 'قراءة هادئة للقرآن', en: 'Peaceful Quran reading' },
    },
  ],
  eyebrow: { ar: 'تعليم قرآني متكامل', en: 'Complete Quran Learning' },
  title: { ar: 'مدرسة أجيال القرآن', en: 'Ajyal Al Quran School' },
  description: {
    ar: 'نصنع أجيالا بالقرآن علما وخلقا وقيادة، من خلال تجربة تعليمية تربوية تجمع بين الأصالة والمعاصرة.\n\nنقدم بيئة آمنة ومنظمة تساعد الطالب على الحفظ، التلاوة، الفهم، وبناء الشخصية المتوازنة بإشراف معلمين متخصصين.',
    en: 'We help students grow with the Quran in knowledge, character, and confidence through a learning experience that blends authenticity with modern structure.\n\nOur safe, organized environment supports memorization, recitation, understanding, and balanced personal growth under specialized teachers.',
  },
  primaryAction: { ar: 'ابدأ الآن', en: 'Start Now' },
  secondaryAction: { ar: 'استكشف البرامج', en: 'Explore Programs' },
  metricsAria: { ar: 'ملخص أجيال القرآن', en: 'Ajyal Al Quran summary' },
  metrics: [
    { ar: 'حفظ', en: 'Memorization' },
    { ar: 'تجويد', en: 'Tajweed' },
    { ar: 'متابعة فردية', en: 'Personal Follow-up' },
  ],
};

export const TESTIMONIAL_CONTENT = {
  kicker: { ar: 'قصص الختم', en: 'Completion Stories' },
  title: { ar: 'إنجازات الطلاب الخاتمين', en: 'Student Achievement Stories' },
  description: {
    ar: 'تجربة جديدة لعرض رحلات الطلاب: قصة واضحة، أرقام مختصرة، وحركة تفاعلية تكشف أثر المتابعة اليومية.',
    en: 'A focused look at student journeys through clear stories, concise metrics, and interactive motion that shows the impact of daily follow-up.',
  },
  summaryAria: { ar: 'ملخص الإنجازات', en: 'Achievement summary' },
  summaryLabel: { ar: 'دفعة هذا الشهر', en: 'This month' },
  summaryValue: { ar: '3', en: '3' },
  summaryUnit: { ar: 'قصص', en: 'Stories' },
  summaryText: {
    ar: 'نماذج من تقدم الطلاب في الحفظ، التجويد، والمراجعة الفردية.',
    en: 'Examples of student progress in memorization, Tajweed, and personal review.',
  },
  stackAria: { ar: 'قصص الطلاب المتراكمة', en: 'Stacked student stories' },
  thumbnailsAria: { ar: 'اختيار قصة الطالب', en: 'Choose a student story' },
  previousAria: { ar: 'القصة السابقة', en: 'Previous story' },
  nextAria: { ar: 'القصة التالية', en: 'Next story' },
  dotsAria: { ar: 'مؤشرات القصص', en: 'Story indicators' },
  showStoryPrefix: { ar: 'عرض قصة', en: 'Show story for' },
  slides: [
    {
      id: 1,
      name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
      role: { ar: 'طالب خاتم', en: 'Completion student' },
      program: { ar: 'برنامج الختم المتقن', en: 'Mastered Completion Program' },
      achievement: { ar: 'ختم القرآن كاملا خلال عامين', en: 'Completed the full Quran in two years' },
      quote: {
        ar: 'بدأت الرحلة بحفظ قصير يومي، ومع المتابعة الفردية والتقييم المستمر وصلت إلى الختم بثبات وثقة.',
        en: 'The journey started with small daily portions. With personal follow-up and steady assessment, I completed the Quran with confidence.',
      },
      image: 'medium-shot-boy-first-communion-portrait.jpg',
      metrics: [
        { label: { ar: 'مدة الرحلة', en: 'Journey length' }, value: { ar: '24 شهر', en: '24 months' } },
        { label: { ar: 'نسبة الالتزام', en: 'Commitment' }, value: { ar: '96%', en: '96%' } },
        { label: { ar: 'المراجعة', en: 'Review' }, value: { ar: 'يومية', en: 'Daily' } },
      ],
    },
    {
      id: 2,
      name: { ar: 'عبد الرحمن خالد', en: 'Abdulrahman Khaled' },
      role: { ar: 'متقن تلاوة', en: 'Recitation achiever' },
      program: { ar: 'برنامج التلاوة والتجويد', en: 'Recitation and Tajweed Program' },
      achievement: { ar: 'إتقان أحكام التجويد والتلاوة الصحيحة', en: 'Mastered Tajweed rules and proper recitation' },
      quote: {
        ar: 'التدريب العملي على المخارج والوقف والابتداء جعل التلاوة أوضح، والمراجعة الصوتية ساعدتني أرى تقدمي أسبوعا بعد أسبوع.',
        en: 'Practical work on articulation, pauses, and starts made my recitation clearer, and audio review helped me see progress every week.',
      },
      image: 'muslims-reading-from-quran.jpg',
      metrics: [
        { label: { ar: 'جلسات تقييم', en: 'Assessment sessions' }, value: { ar: '48', en: '48' } },
        { label: { ar: 'تحسن الأداء', en: 'Performance gain' }, value: { ar: '82%', en: '82%' } },
        { label: { ar: 'المتابعة', en: 'Follow-up' }, value: { ar: 'أسبوعية', en: 'Weekly' } },
      ],
    },
    {
      id: 3,
      name: { ar: 'محمد عبد الله', en: 'Mohamed Abdullah' },
      role: { ar: 'طالب متميز', en: 'Distinguished student' },
      program: { ar: 'برنامج المتابعة الفردية', en: 'Personal Follow-up Program' },
      achievement: { ar: 'بناء عادة حفظ ومراجعة مستقرة', en: 'Built a stable memorization and review habit' },
      quote: {
        ar: 'أكثر ما صنع الفارق هو وضوح الخطة، كل أسبوع أعرف المطلوب مني، والمعلم يتابعني بخطوات صغيرة لكنها مؤثرة.',
        en: 'The biggest difference was clarity. Every week I knew what was expected, and my teacher followed up in small but effective steps.',
      },
      image: 'silhouette-woman-reading-quran.jpg',
      metrics: [
        { label: { ar: 'معدل الحفظ', en: 'Memorization rate' }, value: { ar: '5 أيام', en: '5 days' } },
        { label: { ar: 'اختبارات ناجحة', en: 'Passed tests' }, value: { ar: '18', en: '18' } },
        { label: { ar: 'خطة شخصية', en: 'Personal plan' }, value: { ar: 'مفعلة', en: 'Active' } },
      ],
    },
  ],
};

export const JOURNEY_CONTENT = {
  section: {
    kicker: { ar: 'رحلة الطالب', en: 'Student Journey' },
    title: { ar: 'من أول تقييم إلى إتقان مستمر', en: 'From First Assessment to Lasting Mastery' },
    description: {
      ar: 'نحول التعلم من دروس متفرقة إلى مسار واضح: تقييم، خطة، حلقة، متابعة، ثم إنجاز قابل للقياس.',
      en: 'We turn scattered lessons into a clear path: assessment, plan, session, follow-up, and measurable progress.',
    },
  },
  panelAria: { ar: 'تفاصيل المرحلة الحالية', en: 'Current step details' },
  mapAria: { ar: 'خطوات رحلة الطالب', en: 'Student journey steps' },
  steps: [
    {
      id: 1,
      phase: '01',
      title: { ar: 'تقييم المستوى', en: 'Level Assessment' },
      description: {
        ar: 'نبدأ بفهم مستوى الطالب في الحفظ والتلاوة والالتزام، ثم نحدد نقطة البداية المناسبة.',
        en: 'We understand the student level in memorization, recitation, and commitment, then set the right starting point.',
      },
      metric: { ar: '15 دقيقة', en: '15 minutes' },
      detail: { ar: 'جلسة تعريف قصيرة تحدد المسار المناسب من غير تعقيد.', en: 'A short discovery session to choose the right path without complexity.' },
    },
    {
      id: 2,
      phase: '02',
      title: { ar: 'اختيار المسار', en: 'Choose the Path' },
      description: {
        ar: 'نربط هدف الطالب ببرنامج واضح للحفظ، التجويد، التفسير، أو المتابعة الفردية.',
        en: 'We connect the student goal to a clear program for memorization, Tajweed, Tafsir, or personal follow-up.',
      },
      metric: { ar: '4 مسارات', en: '4 paths' },
      detail: { ar: 'كل مسار له مدة، مستوى، ومعلم مناسب لطبيعة الطالب.', en: 'Each path has a suitable duration, level, and teacher for the student.' },
    },
    {
      id: 3,
      phase: '03',
      title: { ar: 'حلقة مباشرة', en: 'Live Session' },
      description: {
        ar: 'يدخل الطالب في حلقة منظمة مع معلم يتابع الأداء ويصحح التلاوة خطوة بخطوة.',
        en: 'The student joins a structured session with a teacher who follows performance and corrects recitation step by step.',
      },
      metric: { ar: 'مباشر', en: 'Live' },
      detail: { ar: 'تجربة تعلم حية تركز على التدرج والثبات.', en: 'A live learning experience focused on gradual, steady progress.' },
    },
    {
      id: 4,
      phase: '04',
      title: { ar: 'متابعة وتقارير', en: 'Follow-up and Reports' },
      description: {
        ar: 'ولي الأمر والمعلم يشاهدان مؤشرات التقدم، الحضور، المراجعة، ونقاط التحسن.',
        en: 'Parents and teachers see indicators for progress, attendance, review, and improvement points.',
      },
      metric: { ar: 'أسبوعي', en: 'Weekly' },
      detail: { ar: 'تقارير مختصرة تساعد الطالب يكمل بثقة ووضوح.', en: 'Concise reports that help the student continue with clarity and confidence.' },
    },
    {
      id: 5,
      phase: '05',
      title: { ar: 'إنجاز مستمر', en: 'Ongoing Progress' },
      description: {
        ar: 'كل إنجاز يتحول إلى خطة مراجعة جديدة حتى لا يكون التقدم مؤقتا.',
        en: 'Every achievement becomes a new review plan so progress does not fade.',
      },
      metric: { ar: 'مستمر', en: 'Continuous' },
      detail: { ar: 'الهدف ليس الحفظ فقط، بل تثبيت ما تم تعلمه.', en: 'The goal is not only memorization, but retaining what was learned.' },
    },
  ],
};

export const FEATURE_CONTENT = {
  section: {
    kicker: { ar: 'المميزات', en: 'Features' },
    title: { ar: 'مميزات مدرسة أجيال القرآن', en: 'Why Ajyal Al Quran Works' },
    description: {
      ar: 'منظومة تعليمية تربط المتابعة الفردية، جودة الإشراف، وتنظيم الحلقات في تجربة واحدة واضحة للطالب وولي الأمر.',
      en: 'A learning system that connects personal follow-up, supervision quality, and structured sessions in one clear experience.',
    },
  },
  visualAria: { ar: 'صور توضيحية للمميزات', en: 'Feature visuals' },
  features: [
    {
      id: 1,
      eyebrow: { ar: 'متابعة ذكية', en: 'Smart follow-up' },
      title: { ar: 'تقارير الطالب ومتابعته', en: 'Student Reports and Follow-up' },
      description: {
        ar: 'تقارير دقيقة تعرض الحفظ، الحضور، المشاركة، ونقاط التحسن، حتى يحصل كل طالب على دعم مناسب حسب مستواه.',
        en: 'Clear reports show memorization, attendance, participation, and improvement points so each student gets suitable support.',
      },
      image: 'medium-shot-boy-first-communion-portrait.jpg',
      highlight: { label: { ar: 'تحديثات دورية', en: 'Regular updates' }, value: { ar: 'أسبوعية', en: 'Weekly' } },
    },
    {
      id: 2,
      eyebrow: { ar: 'إشراف متخصص', en: 'Specialized supervision' },
      title: { ar: 'مشرفون على التخطيط والتدريس', en: 'Supervisors for Planning and Teaching' },
      description: {
        ar: 'فريق إشراف يتابع جودة الحفظ والتلاوة، ويراجع أداء الحلقات والمعلمين لضمان بيئة تعليمية مستقرة.',
        en: 'A supervision team reviews memorization, recitation, sessions, and teacher performance to keep learning consistent.',
      },
      image: 'muslims-reading-from-quran.jpg',
      highlight: { label: { ar: 'تقييم أداء', en: 'Performance review' }, value: { ar: 'مستمر', en: 'Continuous' } },
    },
    {
      id: 3,
      eyebrow: { ar: 'رحلة منظمة', en: 'Structured journey' },
      title: { ar: 'حلقات فردية حسب المستوى', en: 'Individual Sessions by Level' },
      description: {
        ar: 'مسارات تعلم تراعي العمر والقدرة، مع خطة حفظ ومراجعة واضحة تساعد الطالب على التدرج بثقة.',
        en: 'Learning tracks respect age and ability, with a clear memorization and review plan for confident progress.',
      },
      image: 'islamic-new-year-concept-with-copy-space.jpg',
      highlight: { label: { ar: 'خطة شخصية', en: 'Personal plan' }, value: { ar: 'مفعلة', en: 'Active' } },
    },
    {
      id: 4,
      eyebrow: { ar: 'فريق مؤهل', en: 'Qualified team' },
      title: { ar: 'معلمون يرافقون الطالب', en: 'Teachers Who Support the Student' },
      description: {
        ar: 'معلمون ومعلمات يجمعون بين الخبرة التربوية وإتقان التجويد، ويركزون على الثبات والاستمرار.',
        en: 'Teachers combine educational experience with Tajweed mastery and focus on consistency and continuity.',
      },
      image: 'silhouette-woman-reading-quran.jpg',
      highlight: { label: { ar: 'مرافقة تربوية', en: 'Educational support' }, value: { ar: 'يومية', en: 'Daily' } },
    },
  ],
};

export const COUNTER_CONTENT = [
  { label: { ar: 'طلابنا السعداء', en: 'Happy Students' }, target: 1900, icon: 'fa-solid fa-users', duration: 2000 },
  { label: { ar: 'الجوائز المحققة', en: 'Awards Achieved' }, target: 500, icon: 'fa-solid fa-trophy', duration: 1500 },
  { label: { ar: 'الشركاء الذين يثقون بنا', en: 'Trusted Partners' }, target: 200, icon: 'fa-solid fa-building', duration: 1800 },
  { label: { ar: 'الدول التي وصلنا إليها', en: 'Countries Reached' }, target: 50, icon: 'fa-solid fa-globe', duration: 1200 },
] as const;

export const SERVICES_CONTENT = {
  section: {
    kicker: { ar: 'برامجنا التعليمية', en: 'Learning Programs' },
    title: { ar: 'الدورات الشائعة', en: 'Popular Courses' },
    description: {
      ar: 'مسارات تعليمية مصممة للحفظ، التجويد، التفسير، والمتابعة الفردية، مع وضوح في الخطة والمدرب والنتيجة المتوقعة.',
      en: 'Programs designed for memorization, Tajweed, Tafsir, and personal follow-up with clear plans, teachers, and expected outcomes.',
    },
  },
  levelLabel: { ar: 'المستوى', en: 'Level' },
  sessionUnit: { ar: 'جلسة', en: 'sessions' },
  courses: [
    {
      id: 1,
      title: { ar: 'برنامج الحفظ المتدرج', en: 'Gradual Memorization Program' },
      category: { ar: 'تحفيظ', en: 'Memorization' },
      summary: {
        ar: 'خطة حفظ يومية تراعي مستوى الطالب وتوازن بين الحفظ الجديد والمراجعة.',
        en: 'A daily memorization plan that fits the student level and balances new memorization with review.',
      },
      image: 'muslims-reading-from-quran.jpg',
      duration: { ar: '12 أسبوع', en: '12 weeks' },
      sessions: 24,
      level: { ar: 'مبتدئ إلى متوسط', en: 'Beginner to intermediate' },
      instructors: [
        { ar: 'أ. سمية سليمان', en: 'Ms. Somaya Soliman' },
        { ar: 'أ. عبدالله محمد', en: 'Mr. Abdullah Mohamed' },
      ],
      stats: [
        { label: { ar: 'جلسة', en: 'Sessions' }, value: { ar: '24', en: '24' } },
        { label: { ar: 'متابعة', en: 'Follow-up' }, value: { ar: 'يومية', en: 'Daily' } },
      ],
      tags: [
        { ar: 'حفظ', en: 'Memorization' },
        { ar: 'مراجعة', en: 'Review' },
        { ar: 'تقييم', en: 'Assessment' },
      ],
    },
    {
      id: 2,
      title: { ar: 'التلاوة وأحكام التجويد', en: 'Recitation and Tajweed Rules' },
      category: { ar: 'تجويد', en: 'Tajweed' },
      summary: {
        ar: 'تدريب عملي على المخارج والصفات والوقف والابتداء بتسجيلات وملاحظات واضحة.',
        en: 'Practical training on articulation, attributes, pauses, and starts with recordings and clear feedback.',
      },
      image: 'medium-shot-boy-first-communion-portrait.jpg',
      duration: { ar: '8 أسابيع', en: '8 weeks' },
      sessions: 16,
      level: { ar: 'كل المستويات', en: 'All levels' },
      instructors: [
        { ar: 'أ. خالد أحمد', en: 'Mr. Khaled Ahmed' },
        { ar: 'أ. مريم حسين', en: 'Ms. Mariam Hussein' },
      ],
      stats: [
        { label: { ar: 'تدريب صوتي', en: 'Audio drills' }, value: { ar: '16', en: '16' } },
        { label: { ar: 'اختبار', en: 'Tests' }, value: { ar: '4', en: '4' } },
      ],
      tags: [
        { ar: 'مخارج', en: 'Articulation' },
        { ar: 'تلاوة', en: 'Recitation' },
        { ar: 'تصحيح', en: 'Correction' },
      ],
    },
    {
      id: 3,
      title: { ar: 'تفسير سور مختارة', en: 'Selected Surah Tafsir' },
      category: { ar: 'تفسير', en: 'Tafsir' },
      summary: {
        ar: 'فهم المعاني العامة للسور وربطها بالقيم والسلوك اليومي بأسلوب مناسب للعمر.',
        en: 'Understand general meanings and connect them to values and daily behavior in an age-appropriate way.',
      },
      image: 'islamic-new-year-concept-with-copy-space.jpg',
      duration: { ar: '10 أسابيع', en: '10 weeks' },
      sessions: 20,
      level: { ar: 'متوسط', en: 'Intermediate' },
      instructors: [
        { ar: 'أ. محمود عبدالله', en: 'Mr. Mahmoud Abdullah' },
        { ar: 'أ. فاطمة الزهراء', en: 'Ms. Fatima Al Zahraa' },
      ],
      stats: [
        { label: { ar: 'سورة', en: 'Surahs' }, value: { ar: '10', en: '10' } },
        { label: { ar: 'نشاط', en: 'Activities' }, value: { ar: '20', en: '20' } },
      ],
      tags: [
        { ar: 'فهم', en: 'Understanding' },
        { ar: 'تدبر', en: 'Reflection' },
        { ar: 'قيم', en: 'Values' },
      ],
    },
    {
      id: 4,
      title: { ar: 'حلقة المتابعة الفردية', en: 'Personal Follow-up Session' },
      category: { ar: 'متابعة', en: 'Follow-up' },
      summary: {
        ar: 'مسار خاص للطالب بخطة أسبوعية ومؤشرات تقدم واضحة لولي الأمر والمعلم.',
        en: 'A personal path with a weekly plan and clear progress indicators for parents and teachers.',
      },
      image: 'silhouette-woman-reading-quran.jpg',
      duration: { ar: 'شهري', en: 'Monthly' },
      sessions: 8,
      level: { ar: 'حسب المستوى', en: 'Based on level' },
      instructors: [
        { ar: 'أ. سارة علي', en: 'Ms. Sara Ali' },
        { ar: 'أ. محمد سعيد', en: 'Mr. Mohamed Saeed' },
      ],
      stats: [
        { label: { ar: 'خطة', en: 'Plan' }, value: { ar: 'فردية', en: 'Personal' } },
        { label: { ar: 'تقرير', en: 'Report' }, value: { ar: 'أسبوعي', en: 'Weekly' } },
      ],
      tags: [
        { ar: 'فردي', en: 'Individual' },
        { ar: 'تقارير', en: 'Reports' },
        { ar: 'مرونة', en: 'Flexible' },
      ],
    },
  ],
};

export const PACKAGE_CONTENT = {
  sectionKicker: { ar: 'الباقات', en: 'Packages' },
  title: { ar: 'اختر الباقة المناسبة لك', en: 'Choose the Right Package' },
  description: {
    ar: 'خطط مرنة تناسب مستوى الطالب وعدد الحلقات المطلوبة، مع متابعة واضحة ومراجعة مستمرة.',
    en: 'Flexible plans for the student level and required number of sessions, with clear follow-up and steady review.',
  },
  carouselAria: { ar: 'باقات الاشتراك', en: 'Subscription packages' },
  previousAria: { ar: 'الباقة السابقة', en: 'Previous package' },
  nextAria: { ar: 'الباقة التالية', en: 'Next package' },
  priceAria: { ar: 'سعر الباقة', en: 'Package price' },
  dotsAria: { ar: 'مؤشرات الباقات', en: 'Package indicators' },
  showPrefix: { ar: 'عرض', en: 'Show' },
  subscribe: { ar: 'اشترك الآن', en: 'Subscribe Now' },
  error: { ar: 'فشل في تحميل الباقات. حاول لاحقا.', en: 'Failed to load packages. Please try again later.' },
  totalHoursUnit: { ar: 'ساعة', en: 'hours' },
  minuteUnit: { ar: 'دقيقة', en: 'minutes' },
  studentUnit: { ar: 'طالب', en: 'students' },
  monthlyMinutes: { ar: 'الدقائق الشهرية', en: 'Monthly minutes' },
  subscriptionMode: { ar: 'نمط الاشتراك', en: 'Subscription mode' },
  followUpSeats: { ar: 'مقاعد المتابعة', en: 'Follow-up seats' },
  monthSuffix: { ar: '/ الشهر', en: '/ month' },
  egpSuffix: { ar: 'ج.م / الشهر', en: 'EGP / month' },
  sarSuffix: { ar: 'ريال / الشهر', en: 'SAR / month' },
  badges: {
    bronze: { ar: 'بداية مناسبة', en: 'Good start' },
    silver: { ar: 'متابعة ثابتة', en: 'Steady follow-up' },
    gold: { ar: 'الأكثر توازنا', en: 'Most balanced' },
    diamond: { ar: 'الأكثر اختيارا', en: 'Most chosen' },
    fort: { ar: 'مراجعة مركزة', en: 'Focused review' },
    default: { ar: 'خطة مرنة', en: 'Flexible plan' },
  },
  names: {
    bronze: { ar: 'الباقة البرونزية', en: 'Bronze Package' },
    silver: { ar: 'الباقة الفضية', en: 'Silver Package' },
    gold: { ar: 'الباقة الذهبية', en: 'Gold Package' },
    diamond: { ar: 'الباقة الماسية', en: 'Diamond Package' },
    fort: { ar: 'باقة الحصون', en: 'Fort Package' },
    default: { ar: 'باقة مرنة', en: 'Flexible Package' },
  },
  subscribeTypes: {
    bronze: { ar: 'حلقتان أسبوعيا', en: '2 sessions weekly' },
    silver: { ar: '3 حلقات أسبوعيا', en: '3 sessions weekly' },
    gold: { ar: '4 حلقات أسبوعيا', en: '4 sessions weekly' },
    diamond: { ar: 'متابعة يومية', en: 'Daily follow-up' },
    fort: { ar: 'تحصين ومراجعة', en: 'Strengthening and review' },
    default: { ar: 'خطة مرنة', en: 'Flexible plan' },
  },
};

export const CONTACT_CONTENT = {
  title: { ar: 'اتصل بنا', en: 'Contact Us' },
  description: { ar: 'نحن هنا للإجابة على استفساراتك', en: 'We are here to answer your questions' },
  fields: {
    name: { ar: 'الاسم', en: 'Name' },
    email: { ar: 'البريد الإلكتروني', en: 'Email' },
    phone: { ar: 'رقم الهاتف', en: 'Phone number' },
    message: { ar: 'رسالتك', en: 'Your message' },
  },
  submit: { ar: 'إرسال', en: 'Send' },
  submitting: { ar: 'جاري الإرسال...', en: 'Sending...' },
  phone: { ar: 'الهاتف', en: 'Phone' },
  email: { ar: 'البريد الإلكتروني', en: 'Email' },
  address: { ar: 'العنوان', en: 'Address' },
  addressValue: { ar: '123 شارع المثال، المدينة', en: '123 Example Street, City' },
  errors: {
    required: { ar: 'هذا الحقل مطلوب', en: 'This field is required' },
    email: { ar: 'يرجى إدخال بريد إلكتروني صحيح', en: 'Please enter a valid email address' },
    minlength: { ar: 'يجب أن يكون الحد الأدنى', en: 'Minimum length is' },
    chars: { ar: 'حروف', en: 'characters' },
    pattern: { ar: 'يرجى إدخال رقم هاتف صحيح', en: 'Please enter a valid phone number' },
    fallback: { ar: 'خطأ في الإدخال', en: 'Invalid input' },
    submit: {
      ar: 'عذرا، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
      en: 'Sorry, an error occurred while sending your message. Please try again.',
    },
  },
};

export const FOOTER_CONTENT = {
  companyName: { ar: 'أجيال القرآن', en: 'Ajyal Al Quran' },
  companyLogoAlt: { ar: 'شعار أجيال القرآن', en: 'Ajyal Al Quran logo' },
  quickLinksTitle: { ar: 'روابط سريعة', en: 'Quick Links' },
  contactTitle: { ar: 'اتصل بنا', en: 'Contact Us' },
  followTitle: { ar: 'تابعنا', en: 'Follow Us' },
  emailLabel: { ar: 'البريد الإلكتروني', en: 'Email' },
  phoneLabel: { ar: 'الهاتف', en: 'Phone' },
  addressLabel: { ar: 'العنوان', en: 'Address' },
  address: { ar: '123 شارع الأعمال، المدينة، البلد', en: '123 Business Street, City, Country' },
  rights: { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' },
};

export const BACK_TO_TOP_CONTENT = {
  backToTopAria: { ar: 'العودة إلى أعلى الصفحة', en: 'Back to top' },
  whatsappAria: { ar: 'تواصل معنا عبر واتساب', en: 'Contact us on WhatsApp' },
};
