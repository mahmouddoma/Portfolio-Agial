import {
  BACK_TO_TOP_CONTENT,
  CONTACT_CONTENT,
  COUNTER_CONTENT,
  FEATURE_CONTENT,
  FOOTER_CONTENT,
  HEADER_CONTENT,
  HERO_CONTENT,
  JOURNEY_CONTENT,
  NAV_ITEMS,
  PACKAGE_CONTENT,
  SERVICES_CONTENT,
  TESTIMONIAL_CONTENT,
} from '../../data/site-content';
import type { SiteContent } from './site-content.model';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeImagePath(value: string): string {
  if (
    value.startsWith('/') ||
    value.startsWith('data:') ||
    value.startsWith('http://') ||
    value.startsWith('https://')
  ) {
    return value;
  }

  return `/${value}`;
}

function normalizeImagePaths(value: unknown, key = ''): void {
  if (!value || typeof value !== 'object') {
    return;
  }

  Object.entries(value).forEach(([childKey, childValue]) => {
    const normalizedKey = childKey.toLowerCase();
    if (
      typeof childValue === 'string' &&
      (normalizedKey === 'src' || normalizedKey === 'image' || normalizedKey === 'logosrc')
    ) {
      (value as Record<string, unknown>)[childKey] = normalizeImagePath(childValue);
      return;
    }

    normalizeImagePaths(childValue, childKey);
  });
}

export function createDefaultSiteContent(): SiteContent {
  const content: SiteContent = {
    nav: clone(NAV_ITEMS as unknown as any[]),
    header: {
      ...clone(HEADER_CONTENT),
      logoSrc: '/assets/images/Logo.jpg',
      loginLabel: { ar: 'تسجيل دخول', en: 'Login' },
      loginAria: { ar: 'تسجيل دخول الأدمن', en: 'Admin login' },
    },
    hero: clone(HERO_CONTENT),
    testimonials: clone(TESTIMONIAL_CONTENT),
    journey: clone(JOURNEY_CONTENT),
    features: clone(FEATURE_CONTENT),
    countersTitle: {
      ar: 'إحصائيات أجيال القرآن',
      en: 'Ajyal Al Quran statistics',
    },
    counters: clone(COUNTER_CONTENT as unknown as any[]),
    services: clone(SERVICES_CONTENT),
    packages: {
      ...clone(PACKAGE_CONTENT),
      useLocalPlans: false,
      plans: [
        {
          id: 'bronze',
          name: { ar: 'الباقة البرونزية', en: 'Bronze Package' },
          totalMinutes: 480,
          priceLE: 950,
          priceReyal: 75,
          priceDollar: 25,
          subscriberCount: 18,
          subscribeType: { ar: 'حلقتان أسبوعيا', en: '2 sessions weekly' },
        },
        {
          id: 'silver',
          name: { ar: 'الباقة الفضية', en: 'Silver Package' },
          totalMinutes: 720,
          priceLE: 1350,
          priceReyal: 110,
          priceDollar: 35,
          subscriberCount: 24,
          subscribeType: { ar: '3 حلقات أسبوعيا', en: '3 sessions weekly' },
        },
        {
          id: 'gold',
          name: { ar: 'الباقة الذهبية', en: 'Gold Package' },
          totalMinutes: 960,
          priceLE: 1750,
          priceReyal: 145,
          priceDollar: 45,
          subscriberCount: 31,
          subscribeType: { ar: '4 حلقات أسبوعيا', en: '4 sessions weekly' },
        },
        {
          id: 'diamond',
          name: { ar: 'الباقة الماسية', en: 'Diamond Package' },
          totalMinutes: 1440,
          priceLE: 2450,
          priceReyal: 205,
          priceDollar: 65,
          subscriberCount: 42,
          subscribeType: { ar: 'متابعة يومية', en: 'Daily follow-up' },
        },
        {
          id: 'fort',
          name: { ar: 'باقة الحصون', en: 'Fort Package' },
          totalMinutes: 600,
          priceLE: 1200,
          priceReyal: 95,
          priceDollar: 32,
          subscriberCount: 16,
          subscribeType: { ar: 'تحصين ومراجعة', en: 'Strengthening and review' },
        },
      ],
    },
    contact: clone(CONTACT_CONTENT),
    footer: {
      ...clone(FOOTER_CONTENT),
      backToTop: clone(BACK_TO_TOP_CONTENT),
      contactInfo: {
        email: 'info@ajyalalquran.com',
        phone: '+1 (123) 456-7890',
        address: '123 Business Street, City, Country',
      },
      socialLinks: [
        { icon: 'facebook', url: '#', ariaLabel: 'Visit our Facebook page' },
        { icon: 'twitter', url: '#', ariaLabel: 'Follow us on Twitter' },
        { icon: 'instagram', url: '#', ariaLabel: 'Follow us on Instagram' },
        { icon: 'linkedin', url: '#', ariaLabel: 'Connect with us on LinkedIn' },
      ],
    },
  };

  normalizeImagePaths(content);
  return content;
}
