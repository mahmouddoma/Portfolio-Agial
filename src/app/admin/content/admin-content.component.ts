import { Component, computed, inject, signal } from '@angular/core';

import { SiteContentFacade } from '../../core/content/site-content.facade';
import type {
  EditableCollection,
  EditableContentField,
} from '../../core/content/site-content.model';

interface PackagePlan {
  id: string;
  name: { ar: string; en: string };
  totalMinutes: number;
  priceLE: number;
  priceReyal: number;
  priceDollar: number;
  subscriberCount?: number;
  image?: string;
  subscribeType?: { ar: string; en: string };
}

interface PackageMeta {
  gradient: string;
  iconBg: string;
  accentColor: string;
  emoji: string;
  tier: string;
}

interface ContentEditorTab {
  id: string;
  label: string;
  description: string;
  sections: string[];
}

interface ContentEditorTabSummary extends ContentEditorTab {
  fieldCount: number;
  collectionCount: number;
}

type EditableLanguage = 'ar' | 'en';

interface ContentFieldControl {
  id: string;
  label: string;
  path: string;
  kind: string;
  fields: EditableContentField[];
  singles: EditableContentField[];
  ar?: EditableContentField;
  en?: EditableContentField;
}

interface ContentFieldGroup {
  id: string;
  title: string;
  kicker: string;
  path: string;
  controls: ContentFieldControl[];
  fieldCount: number;
}

interface PackageEditorMetric {
  label: string;
  value: string;
}

interface PackageEditorCard {
  id: string;
  index: number;
  plan: PackagePlan;
  group: ContentFieldGroup;
  meta: PackageMeta;
  metrics: PackageEditorMetric[];
}

interface MutableContentFieldGroup extends Omit<ContentFieldGroup, 'controls'> {
  controls: ContentFieldControl[];
  controlMap: Map<string, ContentFieldControl>;
}

@Component({
  selector: 'app-admin-content',
  standalone: false,
  templateUrl: './admin-content.component.html',
  styleUrl: '../admin-shared.css',
})
export class AdminContentComponent {
  private readonly contentFacade = inject(SiteContentFacade);

  readonly contentTabs: ContentEditorTab[] = [
    {
      id: 'header',
      label: 'الهيدر والتنقل',
      description: 'اللوجو، روابط التنقل، ونصوص الهيدر الرئيسية.',
      sections: ['nav', 'header'],
    },
    {
      id: 'hero',
      label: 'الهيرو',
      description:
        'العنوان الرئيسي، الوصف، الصور، والمؤشرات الموجودة في أول الشاشة.',
      sections: ['hero'],
    },
    {
      id: 'stories',
      label: 'قصص الطلاب',
      description: 'سلايدر القصص والشهادات المعروضة في البورتفوليو.',
      sections: ['testimonials'],
    },
    {
      id: 'journey',
      label: 'الرحلة',
      description: 'خطوات رحلة الطالب والنصوص المرتبطة بها.',
      sections: ['journey'],
    },
    {
      id: 'features',
      label: 'المميزات',
      description: 'محتوى قسم المميزات والكروت الظاهرة فيه.',
      sections: ['features'],
    },
    {
      id: 'stats',
      label: 'الإحصائيات',
      description: 'عنوان الإحصائيات والأرقام المعروضة في العدادات.',
      sections: ['countersTitle', 'counters'],
    },
    {
      id: 'courses',
      label: 'الكورسات',
      description: 'بيانات الكورسات والخدمات المعروضة للزائر.',
      sections: ['services'],
    },
    {
      id: 'packages',
      label: 'الباقات',
      description: 'الباقات والأسعار والدقائق وأنواع الاشتراك.',
      sections: ['packages'],
    },
    {
      id: 'contact',
      label: 'التواصل',
      description: 'نصوص وبيانات نموذج التواصل.',
      sections: ['contact'],
    },
    {
      id: 'footer',
      label: 'الفوتر',
      description: 'بيانات الفوتر وروابط السوشيال ونصوص أزرار العودة.',
      sections: ['footer'],
    },
  ];

  readonly searchTerm = signal('');
  readonly selectedTab = signal(this.contentTabs[0].id);

  readonly packagePlans = computed<PackagePlan[]>(() => {
    const plans = this.contentFacade.content().packages?.plans;
    return Array.isArray(plans) ? (plans as PackagePlan[]) : [];
  });

  readonly isPackagesTab = computed(() => this.selectedTab() === 'packages');

  readonly packagePlanGroups = computed(() =>
    this.fieldGroups().filter(
      (group) => this.getPackagePlanIndex(group.path) !== null,
    ),
  );

  readonly packageSupportingGroups = computed(() =>
    this.fieldGroups().filter(
      (group) => this.getPackagePlanIndex(group.path) === null,
    ),
  );

  readonly packagePlansCollection = computed(
    () =>
      this.collections().find(
        (collection) => collection.path === 'packages.plans',
      ) ?? null,
  );

  readonly packageEditorCards = computed<PackageEditorCard[]>(() => {
    const plans = this.packagePlans();

    return this.packagePlanGroups()
      .map((group) => {
        const index = this.getPackagePlanIndex(group.path);
        const plan = index === null ? null : plans[index];

        if (index === null || !plan) {
          return null;
        }

        return {
          id: group.id,
          index,
          plan,
          group,
          meta: this.getPackageMeta(plan.id),
          metrics: this.createPackageMetrics(plan),
        };
      })
      .filter((card): card is PackageEditorCard => card !== null);
  });

  private readonly packageMetaMap: Record<string, PackageMeta> = {
    bronze: {
      gradient:
        'linear-gradient(135deg, #7c4a1e 0%, #cd7f32 50%, #e8a96a 100%)',
      iconBg: 'linear-gradient(135deg, #cd7f32, #a0522d)',
      accentColor: '#cd7f32',
      emoji: '🥉',
      tier: 'البرونزية',
    },
    silver: {
      gradient:
        'linear-gradient(135deg, #4a4a4a 0%, #9e9e9e 50%, #d0d0d0 100%)',
      iconBg: 'linear-gradient(135deg, #9e9e9e, #6e6e6e)',
      accentColor: '#9e9e9e',
      emoji: '🥈',
      tier: 'الفضية',
    },
    gold: {
      gradient:
        'linear-gradient(135deg, #7d5a00 0%, #d4af37 50%, #f5e06a 100%)',
      iconBg: 'linear-gradient(135deg, #d4af37, #b8952e)',
      accentColor: '#d4af37',
      emoji: '🥇',
      tier: 'الذهبية',
    },
    diamond: {
      gradient:
        'linear-gradient(135deg, #005577 0%, #00b4d8 50%, #90e0ef 100%)',
      iconBg: 'linear-gradient(135deg, #00b4d8, #0077b6)',
      accentColor: '#00b4d8',
      emoji: '💎',
      tier: 'الماسية',
    },
    fort: {
      gradient:
        'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)',
      iconBg: 'linear-gradient(135deg, #2d6a4f, #1b4332)',
      accentColor: '#52b788',
      emoji: '🏰',
      tier: 'الحصون',
    },
  };

  private readonly defaultPackageMeta: PackageMeta = {
    gradient: 'linear-gradient(135deg, #001b2e 0%, #1f7a8c 100%)',
    iconBg: 'linear-gradient(135deg, #1f7a8c, #001b2e)',
    accentColor: 'var(--color-primary)',
    emoji: '📦',
    tier: 'باقة',
  };

  getPackageMeta(planId: string): PackageMeta {
    return this.packageMetaMap[planId] ?? this.defaultPackageMeta;
  }

  getPackageForGroup(groupPath: string): PackagePlan | null {
    const plans = this.packagePlans();
    const match = groupPath.match(/plans\.(\d+)/);
    if (!match) return null;
    return plans[Number(match[1])] ?? null;
  }

  private readonly fieldLabelMap: Record<string, string> = {
    address: 'العنوان',
    addressLabel: 'عنوان حقل العنوان',
    addressValue: 'قيمة العنوان',
    achievement: 'الإنجاز',
    alt: 'وصف الصورة',
    ariaLabel: 'وصف الوصول',
    backToTopAria: 'وصف زر الرجوع للأعلى',
    badges: 'الشارات',
    brandName: 'اسم البراند',
    carouselAria: 'وصف سلايدر الباقات',
    category: 'التصنيف',
    chars: 'نص عدد الحروف',
    companyLogoAlt: 'وصف لوجو الشركة',
    companyName: 'اسم الشركة',
    contactTitle: 'عنوان التواصل',
    description: 'الوصف',
    detail: 'التفاصيل',
    dotsAria: 'وصف نقاط السلايدر',
    duration: 'المدة',
    email: 'البريد الإلكتروني',
    emailLabel: 'عنوان البريد الإلكتروني',
    error: 'رسالة الخطأ',
    eyebrow: 'النص التمهيدي',
    fallback: 'رسالة بديلة',
    fields: 'حقول النموذج',
    followTitle: 'عنوان المتابعة',
    followUpSeats: 'مقاعد المتابعة',
    highlight: 'المعلومة البارزة',
    icon: 'الأيقونة',
    image: 'الصورة',
    instructors: 'المدربون',
    kicker: 'النص الصغير',
    label: 'التسمية',
    level: 'المستوى',
    levelLabel: 'عنوان المستوى',
    loginAria: 'وصف زر تسجيل الدخول',
    loginLabel: 'زر تسجيل الدخول',
    logoAlt: 'وصف اللوجو',
    logoSrc: 'صورة اللوجو',
    mapAria: 'وصف خريطة الرحلة',
    menuToggleAria: 'وصف زر القائمة',
    message: 'الرسالة',
    metric: 'المؤشر',
    metricsAria: 'وصف المؤشرات',
    minuteUnit: 'وحدة الدقائق',
    monthSuffix: 'لاحقة الشهر',
    monthlyMinutes: 'الدقائق الشهرية',
    name: 'الاسم',
    names: 'أسماء الباقات',
    navigationAria: 'وصف التنقل',
    nextAria: 'وصف زر التالي',
    panelAria: 'وصف لوحة التفاصيل',
    phone: 'رقم الهاتف',
    phoneLabel: 'عنوان الهاتف',
    phase: 'رقم المرحلة',
    previousAria: 'وصف زر السابق',
    priceAria: 'وصف السعر',
    priceDollar: 'السعر بالدولار',
    priceLE: 'السعر بالجنيه',
    priceReyal: 'السعر بالريال',
    primaryAction: 'الزر الأساسي',
    program: 'البرنامج',
    quickLinksTitle: 'عنوان الروابط السريعة',
    quote: 'الاقتباس',
    required: 'رسالة الحقل المطلوب',
    rights: 'حقوق النشر',
    role: 'الدور',
    sarSuffix: 'لاحقة الريال',
    secondaryAction: 'الزر الثانوي',
    sectionKicker: 'النص الصغير للقسم',
    sessionUnit: 'وحدة الجلسات',
    sessions: 'عدد الجلسات',
    showPrefix: 'نص عرض العنصر',
    showStoryPrefix: 'نص عرض القصة',
    src: 'مصدر الصورة',
    stackAria: 'وصف كروت القصص',
    stats: 'الإحصائيات',
    studentUnit: 'وحدة الطلاب',
    submit: 'زر الإرسال',
    submitting: 'نص أثناء الإرسال',
    subscribe: 'زر الاشتراك',
    subscribeType: 'نوع الاشتراك',
    subscribeTypes: 'أنواع الاشتراك',
    subscriptionMode: 'نمط الاشتراك',
    summary: 'الملخص',
    summaryAria: 'وصف ملخص الإنجازات',
    summaryLabel: 'عنوان الملخص',
    summaryText: 'نص الملخص',
    summaryUnit: 'وحدة الملخص',
    summaryValue: 'قيمة الملخص',
    tags: 'الوسوم',
    target: 'الرقم المستهدف',
    thumbnailsAria: 'وصف الصور المصغرة',
    title: 'العنوان',
    totalHoursUnit: 'وحدة الساعات',
    totalMinutes: 'إجمالي الدقائق',
    url: 'الرابط',
    value: 'القيمة',
    visualAria: 'وصف الصورة التوضيحية',
    whatsappAria: 'وصف زر واتساب',
  };

  private readonly staticGroupLabelMap: Record<string, string> = {
    contact: 'قسم التواصل',
    'contact.errors': 'رسائل أخطاء نموذج التواصل',
    'contact.fields': 'حقول نموذج التواصل',
    countersTitle: 'عنوان الإحصائيات',
    features: 'قسم المميزات',
    'features.section': 'تعريف قسم المميزات',
    footer: 'الفوتر',
    'footer.backToTop': 'أزرار العودة والتواصل',
    'footer.contactInfo': 'بيانات التواصل في الفوتر',
    header: 'الهيدر',
    hero: 'قسم الهيرو',
    journey: 'قسم رحلة الطالب',
    'journey.section': 'تعريف قسم الرحلة',
    packages: 'قسم الباقات',
    'packages.badges': 'شارات الباقات',
    'packages.names': 'أسماء الباقات الافتراضية',
    'packages.subscribeTypes': 'أنواع الاشتراك الافتراضية',
    services: 'قسم الكورسات',
    'services.section': 'تعريف قسم الكورسات',
    testimonials: 'قسم قصص الطلاب',
  };

  private readonly collectionSingularLabelMap: Record<string, string> = {
    counters: 'عداد',
    courses: 'كورس',
    features: 'ميزة',
    instructors: 'مدرب',
    metrics: 'مؤشر',
    nav: 'رابط تنقل',
    plans: 'باقة',
    slides: 'سلايد',
    socialLinks: 'رابط سوشيال',
    stats: 'إحصائية',
    steps: 'خطوة',
    tags: 'وسم',
  };

  readonly tabSummaries = computed<ContentEditorTabSummary[]>(() => {
    const fields = this.contentFacade.editableFields();
    const collections = this.contentFacade.editableCollections();

    return this.contentTabs.map((tab) => ({
      ...tab,
      fieldCount: fields.filter((field) =>
        this.matchesTabSection(tab, field.section),
      ).length,
      collectionCount: collections.filter((collection) =>
        this.matchesTabSection(tab, this.getTopLevelSection(collection.path)),
      ).length,
    }));
  });

  readonly activeTab = computed(() => {
    const tabs = this.tabSummaries();
    return tabs.find((tab) => tab.id === this.selectedTab()) ?? tabs[0];
  });

  readonly filteredFields = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const activeTab = this.activeTab();

    return this.contentFacade.editableFields().filter((field) => {
      const matchesSection = this.matchesTabSection(activeTab, field.section);
      const matchesSearch =
        !search ||
        field.path.toLowerCase().includes(search) ||
        field.label.toLowerCase().includes(search) ||
        this.getFieldSearchLabel(field.path).toLowerCase().includes(search) ||
        this.getGroupTitle(this.getFieldParts(field.path).groupPath)
          .toLowerCase()
          .includes(search) ||
        String(field.value).toLowerCase().includes(search);

      return matchesSection && matchesSearch;
    });
  });

  readonly fieldGroups = computed(() =>
    this.groupFields(this.filteredFields()),
  );

  readonly activeTabStats = computed(() => ({
    collections: this.collections().length,
    fields: this.filteredFields().length,
    groups: this.fieldGroups().length,
  }));

  readonly collections = computed(() => {
    const activeTab = this.activeTab();
    return this.contentFacade
      .editableCollections()
      .filter((collection) =>
        this.matchesTabSection(
          activeTab,
          this.getTopLevelSection(collection.path),
        ),
      );
  });

  selectTab(tabId: string): void {
    this.selectedTab.set(tabId);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  trackPackageEditorCard(
    _index: number,
    card: PackageEditorCard,
  ): string {
    return card.id;
  }

  updateField(
    field: EditableContentField,
    value: string | number | boolean,
  ): void {
    const nextValue = field.type === 'number' ? Number(value) : value;
    this.contentFacade.updateAtPath(field.path, nextValue);
  }

  addItem(collection: EditableCollection): void {
    this.contentFacade.addCollectionItem(collection.path);
  }

  removeLastItem(collection: EditableCollection): void {
    this.contentFacade.removeCollectionItem(
      collection.path,
      collection.count - 1,
    );
  }

  getLanguageLabel(language: EditableLanguage): string {
    return language === 'ar' ? 'العربي' : 'English';
  }

  getFieldInputType(field: EditableContentField): string {
    return field.type === 'email'
      ? 'email'
      : field.type === 'url'
        ? 'url'
        : field.type === 'phone'
          ? 'tel'
          : 'text';
  }

  private matchesTabSection(tab: ContentEditorTab, section: string): boolean {
    return tab.sections.includes(section);
  }

  private getTopLevelSection(path: string): string {
    return path.split('.')[0] ?? '';
  }

  private getPackagePlanIndex(groupPath: string): number | null {
    const match = groupPath.match(/^packages\.plans\.(\d+)$/);
    return match ? Number(match[1]) : null;
  }

  private createPackageMetrics(plan: PackagePlan): PackageEditorMetric[] {
    return [
      {
        label: 'الدقائق الشهرية',
        value: `${plan.totalMinutes} دقيقة`,
      },
      {
        label: 'الأسعار',
        value: `${plan.priceLE} ج.م / ${plan.priceReyal} ر.س / ${plan.priceDollar}$`,
      },
      {
        label: 'نمط الاشتراك',
        value: plan.subscribeType?.ar || 'غير محدد',
      },
      {
        label: 'مقاعد المتابعة',
        value: `${plan.subscriberCount ?? 0} طالب`,
      },
    ];
  }

  private groupFields(fields: EditableContentField[]): ContentFieldGroup[] {
    const groups = new Map<string, MutableContentFieldGroup>();

    fields.forEach((field) => {
      const parts = this.getFieldParts(field.path);
      const group =
        groups.get(parts.groupPath) ??
        this.createMutableGroup(
          parts.groupPath,
          this.getTopLevelSection(field.path),
        );
      groups.set(parts.groupPath, group);

      const controlKey = parts.propertyPath;
      let control = group.controlMap.get(controlKey);
      if (!control) {
        control = {
          id: controlKey,
          label: this.getControlLabel(
            parts.propertyName,
            parts.propertyPath,
            parts.groupPath,
          ),
          path: parts.propertyPath,
          kind: this.getControlKind(field),
          fields: [],
          singles: [],
        };
        group.controlMap.set(controlKey, control);
        group.controls.push(control);
      }

      control.fields.push(field);
      control.kind = this.mergeControlKind(
        control.kind,
        this.getControlKind(field),
      );

      if (parts.language === 'ar') {
        control.ar = field;
      } else if (parts.language === 'en') {
        control.en = field;
      } else {
        control.singles.push(field);
      }

      group.fieldCount += 1;
    });

    return Array.from(groups.values()).map(
      ({ controlMap: _controlMap, ...group }) => group,
    );
  }

  private createMutableGroup(
    path: string,
    section: string,
  ): MutableContentFieldGroup {
    return {
      id: path || section,
      title: this.getGroupTitle(path || section),
      kicker: this.getGroupKicker(path || section),
      path: path || section,
      controls: [],
      controlMap: new Map<string, ContentFieldControl>(),
      fieldCount: 0,
    };
  }

  private getFieldParts(path: string): {
    groupPath: string;
    propertyName: string;
    propertyPath: string;
    language: EditableLanguage | null;
  } {
    const segments = path.split('.');
    const lastSegment = segments[segments.length - 1];
    const language =
      lastSegment === 'ar' || lastSegment === 'en' ? lastSegment : null;
    const propertySegments = language ? segments.slice(0, -1) : segments;
    const propertyName = propertySegments[propertySegments.length - 1] ?? path;
    const parentSegments = language
      ? segments.slice(0, -2)
      : segments.slice(0, -1);
    const firstArrayIndex = propertySegments.findIndex((segment) =>
      /^\d+$/.test(segment),
    );
    const groupSegments =
      firstArrayIndex >= 0
        ? propertySegments.slice(0, firstArrayIndex + 1)
        : parentSegments.length
          ? parentSegments
          : propertySegments;

    return {
      groupPath: groupSegments.join('.'),
      propertyName,
      propertyPath: propertySegments.join('.'),
      language,
    };
  }

  private getFieldSearchLabel(path: string): string {
    const parts = this.getFieldParts(path);
    return this.getControlLabel(
      parts.propertyName,
      parts.propertyPath,
      parts.groupPath,
    );
  }

  private getControlLabel(
    propertyName: string,
    path: string,
    groupPath = '',
  ): string {
    const relativePath =
      groupPath && path.startsWith(`${groupPath}.`)
        ? path.slice(groupPath.length + 1)
        : propertyName;
    const relativeSegments = relativePath.split('.').filter(Boolean);

    if (relativeSegments.length >= 2 && /^\d+$/.test(relativeSegments[1])) {
      const label =
        this.collectionSingularLabelMap[relativeSegments[0]] ??
        this.readableSegment(relativeSegments[0]);
      const tail = relativeSegments
        .slice(2)
        .map((segment) => this.readableSegment(segment))
        .join(' / ');
      return tail
        ? `${label} ${Number(relativeSegments[1]) + 1} / ${tail}`
        : `${label} ${Number(relativeSegments[1]) + 1}`;
    }

    if (relativeSegments.length > 1) {
      return relativeSegments
        .map((segment) => this.readableSegment(segment))
        .join(' / ');
    }

    return (
      this.fieldLabelMap[propertyName] ??
      this.fieldLabelMap[path] ??
      this.readableSegment(propertyName)
    );
  }

  private getGroupTitle(path: string): string {
    const arrayTitle = this.getArrayGroupTitle(path);
    if (arrayTitle) {
      return arrayTitle;
    }

    return this.staticGroupLabelMap[path] ?? this.getPathFallbackLabel(path);
  }

  private getGroupKicker(path: string): string {
    const root = this.getTopLevelSection(path);
    const tab = this.contentTabs.find((contentTab) =>
      contentTab.sections.includes(root),
    );
    return tab?.label ?? 'محتوى';
  }

  private getArrayGroupTitle(path: string): string | null {
    const segments = path.split('.');
    const indexPosition = segments.findIndex((segment) =>
      /^\d+$/.test(segment),
    );
    if (indexPosition < 0) {
      return null;
    }

    const collectionName = segments[indexPosition - 1] ?? segments[0];
    const label = this.collectionSingularLabelMap[collectionName] ?? 'عنصر';
    return `${label} ${Number(segments[indexPosition]) + 1}`;
  }

  private getPathFallbackLabel(path: string): string {
    const readableParts = path
      .split('.')
      .filter((segment) => !/^\d+$/.test(segment))
      .map((segment) => this.readableSegment(segment));

    return readableParts.join(' / ') || 'محتوى';
  }

  private readableSegment(segment: string): string {
    return (
      this.fieldLabelMap[segment] ?? segment.replace(/([A-Z])/g, ' $1').trim()
    );
  }

  private getControlKind(field: EditableContentField): string {
    const typeLabels: Record<string, string> = {
      boolean: 'اختيار',
      email: 'إيميل',
      image: 'صورة',
      number: 'رقم',
      phone: 'هاتف',
      textarea: 'نص طويل',
      text: 'نص',
      url: 'رابط',
    };

    return typeLabels[field.type] ?? 'حقل';
  }

  private mergeControlKind(currentKind: string, nextKind: string): string {
    return currentKind === nextKind ? currentKind : 'متعدد';
  }
}
