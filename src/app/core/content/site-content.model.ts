import type { LocalizedText } from '../../services/language.service';

export type EditableFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'image'
  | 'url'
  | 'email'
  | 'phone'
  | 'boolean';

export interface EditablePackagePlan {
  id: string;
  name: LocalizedText;
  totalMinutes: number;
  priceLE: number;
  priceReyal: number;
  priceDollar: number;
  subscriberCount: number;
  subscribeType: LocalizedText;
}

export interface FooterSocialLink {
  icon: string;
  url: string;
  ariaLabel: string;
}

export interface FooterContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface SiteContent {
  nav: any[];
  header: any;
  hero: any;
  testimonials: any;
  journey: any;
  features: any;
  countersTitle: LocalizedText;
  counters: any[];
  services: any;
  packages: any & {
    useLocalPlans: boolean;
    plans: EditablePackagePlan[];
  };
  contact: any;
  footer: any & {
    socialLinks: FooterSocialLink[];
    contactInfo: FooterContactInfo;
  };
}

export interface EditableContentField {
  path: string;
  label: string;
  section: string;
  type: EditableFieldType;
  value: string | number | boolean;
}

export interface EditableCollection {
  path: string;
  label: string;
  count: number;
}
