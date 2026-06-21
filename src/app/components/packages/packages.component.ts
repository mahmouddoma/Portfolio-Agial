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
import { timeout } from 'rxjs/operators';
import { PackageCurrencyField, PackagePlan, PackagesService } from '../../services/packages.service';
import { SiteContentFacade } from '../../core/content/site-content.facade';
import { EditableContentDirective } from '../../core/live-edit/editable-content.directive';
import { LanguageService } from '../../services/language.service';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;
type PackageKind = 'bronze' | 'silver' | 'gold' | 'diamond' | 'fort' | 'default';

interface PackageFeatureRow {
  label: string;
  value: string;
}

interface PackageCardViewModel extends PackagePlan {
  sourceIndex: number;
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
  imports: [CommonModule, EditableContentDirective],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css',
})
export class PackagesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('packagesSection') private packagesSection?: ElementRef<HTMLElement>;
  @ViewChild('packagesTrack') private packagesTrack?: ElementRef<HTMLElement>;

  private readonly packagesService = inject(PackagesService);
  private readonly language = inject(LanguageService);
  private readonly siteContent = inject(SiteContentFacade);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly http = inject(HttpClient);
  private animationContext?: GsapContext;
  private viewReady = false;
  private reducedMotion = false;
  private readonly heavyMotionQuery = '(max-width: 768px)';
  packages: PackagePlan[] = [];
  packageCards: PackageCardViewModel[] = [];
  error: string | null = null;
  currencyField: PackageCurrencyField = 'priceDollar';
  packageLoadFailed = false;

  readonly content = computed(() => this.siteContent.content().packages);

  readonly section = computed(() => ({
    kicker: this.language.text(this.content().sectionKicker),
    title: this.language.text(this.content().title),
    description: this.language.text(this.content().description),
    carouselAria: this.language.text(this.content().carouselAria),
    previousAria: this.language.text(this.content().previousAria),
    nextAria: this.language.text(this.content().nextAria),
    priceAria: this.language.text(this.content().priceAria),
    dotsAria: this.language.text(this.content().dotsAria),
    showPrefix: this.language.text(this.content().showPrefix),
    subscribe: this.language.text(this.content().subscribe),
  }));

  private readonly languageSync = effect(() => {
    this.language.currentLanguage();
    this.content();
    if (this.packages.length) {
      this.packageCards = this.createPackageCards(this.packages);
    }

    if (this.packageLoadFailed) {
      this.error = this.language.text(this.content().error);
    }

    if (this.content().useLocalPlans) {
      this.setPackages(this.packagesService.getMockPackages(this.currencyField));
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
    this.http.get<{ country_name: string; country_code?: string; currency?: string }>('https://ipapi.co/json/').pipe(
      timeout(1200),
    ).subscribe({
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
        this.error = this.language.text(this.content().error);
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
    return packages.map((packageItem, sourceIndex) => {
      const kind = this.getPackageKind(packageItem.name);
      const isFeatured = kind === 'diamond';

      return {
        ...packageItem,
        sourceIndex,
        badge: this.getPackageBadge(kind),
        displayName: this.getPackageDisplayName(kind),
        displaySubscribeType: this.getPackageSubscribeType(kind, packageItem.subscribeType),
        kind,
        styleClass: `package-card package-${kind}${isFeatured ? ' package-featured' : ''}`,
        pricePrefix: packageItem.currency === 'USD' ? '$' : '',
        priceSuffix: this.getPriceSuffix(packageItem.currency),
        totalHours: `${this.language.formatNumber(Math.round(packageItem.totalMinutes / 60))} ${this.language.text(this.content().totalHoursUnit)}`,
        features: [
          {
            label: this.language.text(this.content().monthlyMinutes),
            value: `${this.language.formatNumber(packageItem.totalMinutes)} ${this.language.text(this.content().minuteUnit)}`,
          },
          {
            label: this.language.text(this.content().subscriptionMode),
            value: this.getPackageSubscribeType(kind, packageItem.subscribeType),
          },
          {
            label: this.language.text(this.content().followUpSeats),
            value: `${this.language.formatNumber(packageItem.subscriberCount)} ${this.language.text(this.content().studentUnit)}`,
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
    return this.language.text(this.content().badges[kind]);
  }

  private getPackageDisplayName(kind: PackageKind): string {
    return this.language.text(this.content().names[kind]);
  }

  private getPackageSubscribeType(kind: PackageKind, fallback: string): string {
    return kind === 'default' && fallback ? fallback : this.language.text(this.content().subscribeTypes[kind]);
  }

  private getPriceSuffix(currency: PackagePlan['currency']): string {
    if (currency === 'LE') {
      return this.language.text(this.content().egpSuffix);
    }

    if (currency === 'SAR') {
      return this.language.text(this.content().sarSuffix);
    }

    return this.language.text(this.content().monthSuffix);
  }


  private async setupPackagesMotion(): Promise<void> {
    if (!this.viewReady || this.shouldSkipHeavyMotion() || !this.packagesSection?.nativeElement) {
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

  private shouldSkipHeavyMotion(): boolean {
    return this.reducedMotion || window.matchMedia(this.heavyMotionQuery).matches;
  }
}
