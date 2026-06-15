import { Injectable, computed, effect, signal } from '@angular/core';

export type LanguageCode = 'ar' | 'en';

export interface LocalizedText {
  readonly ar: string;
  readonly en: string;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly storageKey = 'agial-language';

  readonly currentLanguage = signal<LanguageCode>(this.getInitialLanguage());
  readonly direction = computed(() => (this.currentLanguage() === 'ar' ? 'rtl' : 'ltr'));
  readonly locale = computed(() => (this.currentLanguage() === 'ar' ? 'ar-EG' : 'en-US'));
  readonly switchLabel = computed(() => (this.currentLanguage() === 'ar' ? 'English' : 'العربية'));
  readonly switchAriaLabel = computed(() =>
    this.currentLanguage() === 'ar' ? 'Switch language to English' : 'تغيير اللغة إلى العربية',
  );

  constructor() {
    effect(() => this.applyLanguage(this.currentLanguage()));
  }

  toggleLanguage(): void {
    this.currentLanguage.update((language) => (language === 'ar' ? 'en' : 'ar'));
  }

  text(value: LocalizedText): string {
    return value[this.currentLanguage()];
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat(this.locale()).format(value);
  }

  private getInitialLanguage(): LanguageCode {
    if (typeof localStorage === 'undefined') {
      return 'ar';
    }

    return localStorage.getItem(this.storageKey) === 'en' ? 'en' : 'ar';
  }

  private applyLanguage(language: LanguageCode): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = document.documentElement.dir;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, language);
    }
  }
}
