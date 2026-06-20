import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SiteContentFacade } from '../core/content/site-content.facade';
import type { EditablePackagePlan } from '../core/content/site-content.model';
import { LanguageService } from './language.service';

export type PackageCurrencyField = 'priceLE' | 'priceReyal' | 'priceDollar';
export type PackageCurrency = 'LE' | 'SAR' | 'USD';

interface PackageApiItem {
  name: string;
  totalMinutes: number;
  priceLE?: number;
  priceReyal?: number;
  priceDollar?: number;
  subscriberCount: number;
  subscribeType?: {
    name?: string;
  };
}

export interface PackagePlan {
  name: string;
  totalMinutes: number;
  price: number;
  currency: PackageCurrency;
  subscriberCount: number;
  subscribeType: string;
}

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  private readonly contentFacade = inject(SiteContentFacade);
  private readonly language = inject(LanguageService);
  private apiUrl = 'https://ajyalalquran.somee.com/api/Subscribe';
  private readonly mockPackages: readonly PackageApiItem[] = [
    {
      name: 'الباقة البرونزية',
      totalMinutes: 480,
      priceLE: 950,
      priceReyal: 75,
      priceDollar: 25,
      subscriberCount: 18,
      subscribeType: { name: 'حلقتان أسبوعياً' },
    },
    {
      name: 'الباقة الفضية',
      totalMinutes: 720,
      priceLE: 1350,
      priceReyal: 110,
      priceDollar: 35,
      subscriberCount: 24,
      subscribeType: { name: '3 حلقات أسبوعياً' },
    },
    {
      name: 'الباقة الذهبية',
      totalMinutes: 960,
      priceLE: 1750,
      priceReyal: 145,
      priceDollar: 45,
      subscriberCount: 31,
      subscribeType: { name: '4 حلقات أسبوعياً' },
    },
    {
      name: 'الباقة الماسية',
      totalMinutes: 1440,
      priceLE: 2450,
      priceReyal: 205,
      priceDollar: 65,
      subscriberCount: 42,
      subscribeType: { name: 'متابعة يومية' },
    },
    {
      name: 'باقة الحصون',
      totalMinutes: 600,
      priceLE: 1200,
      priceReyal: 95,
      priceDollar: 32,
      subscriberCount: 16,
      subscribeType: { name: 'تحصين ومراجعة' },
    },
  ];

  constructor(private http: HttpClient) {}

  getMockPackages(currency: PackageCurrencyField = 'priceDollar'): PackagePlan[] {
    if (this.shouldUseLocalPlans()) {
      return this.mapEditablePackages(this.contentFacade.content().packages.plans, currency);
    }

    return this.mapPackages(this.mockPackages, currency);
  }

  getPackages(currency: PackageCurrencyField = 'priceDollar'): Observable<PackagePlan[]> {
    if (this.shouldUseLocalPlans()) {
      return of(this.mapEditablePackages(this.contentFacade.content().packages.plans, currency));
    }

    return this.http.get<PackageApiItem[]>(this.apiUrl).pipe(
      map((packages) => this.mapPackages(packages.length ? packages : this.mockPackages, currency)),
      catchError(() => of(this.mapPackages(this.mockPackages, currency))),
    );
  }

  private shouldUseLocalPlans(): boolean {
    return !!this.contentFacade.content().packages.useLocalPlans;
  }

  private mapEditablePackages(
    packages: readonly EditablePackagePlan[],
    currency: PackageCurrencyField,
  ): PackagePlan[] {
    return packages.map((pkg) => ({
      name: this.language.text(pkg.name),
      totalMinutes: pkg.totalMinutes,
      price: pkg[currency],
      currency: currency === 'priceLE' ? 'LE' : currency === 'priceReyal' ? 'SAR' : 'USD',
      subscriberCount: pkg.subscriberCount,
      subscribeType: this.language.text(pkg.subscribeType),
    }));
  }

  private mapPackages(
    packages: readonly PackageApiItem[],
    currency: PackageCurrencyField,
  ): PackagePlan[] {
    const hasValid = packages.some(pkg => (pkg[currency] ?? 0) > 0);
    let usedCurrency = currency;

    if (!hasValid) {
      if (currency !== 'priceDollar' && packages.some(pkg => (pkg.priceDollar ?? 0) > 0)) {
        usedCurrency = 'priceDollar';
      } else if (currency !== 'priceLE' && packages.some(pkg => (pkg.priceLE ?? 0) > 0)) {
        usedCurrency = 'priceLE';
      }
    }

    return packages.map((pkg) => ({
      name: pkg.name,
      totalMinutes: pkg.totalMinutes,
      price: pkg[usedCurrency] ?? 0,
      currency: usedCurrency === 'priceLE' ? 'LE' : usedCurrency === 'priceReyal' ? 'SAR' : 'USD',
      subscriberCount: pkg.subscriberCount,
      subscribeType: pkg.subscribeType?.name ?? '',
    }));
  }
}
