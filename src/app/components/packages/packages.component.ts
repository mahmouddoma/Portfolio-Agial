import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PackageCurrencyField, PackagePlan, PackagesService } from '../../services/packages.service';
import { PACKAGE_CONTENT } from '../../data/site-content';
import { LanguageService } from '../../services/language.service';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;
type PackageKind = 'bronze' | 'silver' | 'gold' | 'diamond' | 'fort' | 'default';

interface PackageFeatureRow {
  label: string;
  value: string;
}

interface PackageCardViewModel extends PackagePlan {
  badge: string;
  displayName: string;
  displaySubscribeType: string;
  kind: PackageKind;
  styleClass: string;
  pricePrefix: string;
  priceSuffix: string;
  totalHours: string;
  features: readonly PackageFeatureRow[];
}

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css',
})
export class PackagesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('packagesSection') private packagesSection?: ElementRef<HTMLElement>;
  @ViewChild('packagesTrack') private packagesTrack?: ElementRef<HTMLElement>;

  private readonly packagesService = inject(PackagesService);
  private readonly language = inject(LanguageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly http = inject(HttpClient);
  private animationContext?: GsapContext;
  private viewReady = false;
  private reducedMotion = false;
  packages: PackagePlan[] = [];
  packageCards: PackageCardViewModel[] = [];
  error: string | null = null;
  currencyField: PackageCurrencyField = 'priceDollar';
  packageLoadFailed = false;

  readonly section = computed(() => ({
    kicker: this.language.text(PACKAGE_CONTENT.sectionKicker),
    title: this.language.text(PACKAGE_CONTENT.title),
    description: this.language.text(PACKAGE_CONTENT.description),
    carouselAria: this.language.text(PACKAGE_CONTENT.carouselAria),
    previousAria: this.language.text(PACKAGE_CONTENT.previousAria),
    nextAria: this.language.text(PACKAGE_CONTENT.nextAria),
    priceAria: this.language.text(PACKAGE_CONTENT.priceAria),
    dotsAria: this.language.text(PACKAGE_CONTENT.dotsAria),
    showPrefix: this.language.text(PACKAGE_CONTENT.showPrefix),
    subscribe: this.language.text(PACKAGE_CONTENT.subscribe),
  }));

  private readonly languageSync = effect(() => {
    this.language.currentLanguage();
    if (this.packages.length) {
      this.packageCards = this.createPackageCards(this.packages);
    }

    if (this.packageLoadFailed) {
      this.error = this.language.text(PACKAGE_CONTENT.error);
    }

    this.cdr.markForCheck();
  });

  ngOnInit(): void {
    this.setPackages(this.packagesService.getMockPackages(this.currencyField));
    this.detectUserCurrencyAndLoadPackages();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.setupPackagesMotion();
  }

  ngOnDestroy(): void {
    this.animationContext?.revert();
  }

  detectUserCurrencyAndLoadPackages(): void {
    this.http.get<{ country_name: string; country_code?: string; currency?: string }>('https://ipapi.co/json/').subscribe({
      next: (res) => {
        const detectedCurrency: PackageCurrencyField =
          res.country_name === 'Egypt' || res.country_code === 'EG' || res.currency === 'EGP'
            ? 'priceLE'
            : 'priceDollar';

        if (detectedCurrency !== this.currencyField) {
          this.currencyField = detectedCurrency;
          this.setPackages(this.packagesService.getMockPackages(this.currencyField));
        }

        this.loadPackages();
      },
      error: () => {
        this.currencyField = 'priceDollar';
        this.loadPackages();
      },
    });
  }

  loadPackages(): void {
    this.packagesService.getPackages(this.currencyField).subscribe({
      next: (data) => {
        this.packageLoadFailed = false;
        this.setPackages(data);
        this.error = null;
      },
      error: (err: unknown) => {
        this.packageLoadFailed = true;
        this.error = this.language.text(PACKAGE_CONTENT.error);
        console.error(err);
      },
    });
  }

  trackPackage(_index: number, packageItem: PackageCardViewModel): string {
    return `${packageItem.name}-${packageItem.currency}-${packageItem.totalMinutes}`;
  }

  tiltPackage(event: MouseEvent): void {
    const card = event.currentTarget;

    if (!(card instanceof HTMLElement)) {
      return;
    }

    if (event.type === 'mouseleave') {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      return;
    }

    const rect = card.getBoundingClientRect();
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;

    card.style.setProperty('--tilt-x', `${rotateX}deg`);
    card.style.setProperty('--tilt-y', `${rotateY}deg`);
  }

  private setPackages(data: readonly PackagePlan[]): void {
    this.packages = [...data];
    this.packageCards = this.createPackageCards(data);
    if (!this.viewReady) {
      return;
    }

    this.cdr.detectChanges();
    this.setupPackagesMotion();
  }

  private createPackageCards(packages: readonly PackagePlan[]): PackageCardViewModel[] {
    return packages.map((packageItem) => {
      const kind = this.getPackageKind(packageItem.name);
      const isFeatured = kind === 'diamond';

      return {
        ...packageItem,
        badge: this.getPackageBadge(kind),
        displayName: this.getPackageDisplayName(kind),
        displaySubscribeType: this.getPackageSubscribeType(kind, packageItem.subscribeType),
        kind,
        styleClass: `package-card package-${kind}${isFeatured ? ' package-featured' : ''}`,
        pricePrefix: packageItem.currency === 'USD' ? '$' : '',
        priceSuffix: this.getPriceSuffix(packageItem.currency),
        totalHours: `${this.language.formatNumber(Math.round(packageItem.totalMinutes / 60))} ${this.language.text(PACKAGE_CONTENT.totalHoursUnit)}`,
        features: [
          {
            label: this.language.text(PACKAGE_CONTENT.monthlyMinutes),
            value: `${this.language.formatNumber(packageItem.totalMinutes)} ${this.language.text(PACKAGE_CONTENT.minuteUnit)}`,
          },
          {
            label: this.language.text(PACKAGE_CONTENT.subscriptionMode),
            value: this.getPackageSubscribeType(kind, packageItem.subscribeType),
          },
          {
            label: this.language.text(PACKAGE_CONTENT.followUpSeats),
            value: `${this.language.formatNumber(packageItem.subscriberCount)} ${this.language.text(PACKAGE_CONTENT.studentUnit)}`,
          },
        ],
      };
    });
  }

  private getPackageKind(name: string): PackageKind {
    const normalizedName = name.toLowerCase();

    if (normalizedName.includes('الماسية') || normalizedName.includes('diamond')) {
      return 'diamond';
    }

    if (normalizedName.includes('الحصون') || normalizedName.includes('fort')) {
      return 'fort';
    }

    if (normalizedName.includes('برونزية') || normalizedName.includes('bronze')) {
      return 'bronze';
    }

    if (normalizedName.includes('الفضية') || normalizedName.includes('silver')) {
      return 'silver';
    }

    if (normalizedName.includes('الذهبية') || normalizedName.includes('gold')) {
      return 'gold';
    }

    return 'default';
  }

  private getPackageBadge(kind: PackageKind): string {
    return this.language.text(PACKAGE_CONTENT.badges[kind]);
  }

  private getPackageDisplayName(kind: PackageKind): string {
    return this.language.text(PACKAGE_CONTENT.names[kind]);
  }

  private getPackageSubscribeType(kind: PackageKind, fallback: string): string {
    return kind === 'default' && fallback ? fallback : this.language.text(PACKAGE_CONTENT.subscribeTypes[kind]);
  }

  private getPriceSuffix(currency: PackagePlan['currency']): string {
    if (currency === 'LE') {
      return this.language.text(PACKAGE_CONTENT.egpSuffix);
    }

    if (currency === 'SAR') {
      return this.language.text(PACKAGE_CONTENT.sarSuffix);
    }

    return this.language.text(PACKAGE_CONTENT.monthSuffix);
  }


  private async setupPackagesMotion(): Promise<void> {
    if (!this.viewReady || this.reducedMotion || !this.packagesSection?.nativeElement) {
      return;
    }

    const [{ gsap }, { ScrollTrigger }, { setupPackagesMotion }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('../../animations/packages.animations'),
    ]);

    if (!this.packagesSection?.nativeElement) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.animationContext?.revert();
    this.animationContext = gsap.context(() => {
      setupPackagesMotion({
        section: this.packagesSection?.nativeElement as HTMLElement,
        gsap: gsap as GsapApi,
        ScrollTrigger,
      });
    }, this.packagesSection.nativeElement);
  }
}
