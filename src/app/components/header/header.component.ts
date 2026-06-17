import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { HEADER_CONTENT, NAV_ITEMS } from '../../data/site-content';
import type { GsapContext } from '../../services/gsap-animation.service';
import { LanguageService } from '../../services/language.service';

interface NavItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navbarRef') private navbarRef?: ElementRef<HTMLElement>;

  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly language = inject(LanguageService);
  private motionContext?: GsapContext;
  private destroyed = false;

  readonly navItems = computed<readonly NavItem[]>(() =>
    NAV_ITEMS.map((item) => ({
      id: item.id,
      label: this.language.text(item.label),
    })),
  );
  readonly languageSwitchLabel = computed(() => this.language.switchLabel());
  readonly languageSwitchAriaLabel = computed(() => this.language.switchAriaLabel());
  readonly brandName = computed(() => this.language.text(HEADER_CONTENT.brandName));
  readonly brandLogoAlt = computed(() => this.language.text(HEADER_CONTENT.logoAlt));
  readonly navigationAriaLabel = computed(() => this.language.text(HEADER_CONTENT.navigationAria));
  readonly menuToggleAriaLabel = computed(() => this.language.text(HEADER_CONTENT.menuToggleAria));
  readonly activeSectionId = signal('about');

  isScrolled = false;
  isMenuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollY > 64;
    this.syncActiveSection();
  }



  /**
   * Scroll to a section when clicking a navigation link.
   * @param event - The click event from the navigation link.
   */

  scrollTo(event: Event, sectionId?: string): void {
    event.preventDefault();

    const targetElementId = sectionId ?? this.getSectionIdFromEvent(event);
    if (!targetElementId) {
      return;
    }

    this.activeSectionId.set(targetElementId);
    this.closeMenu();

    const element = document.getElementById(targetElementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    void this.router.navigate([], {
      fragment: targetElementId,
      onSameUrlNavigation: 'reload',
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleLanguage(): void {
    this.language.toggleLanguage();
    this.closeMenu();
  }

  isActive(sectionId: string): boolean {
    return this.activeSectionId() === sectionId;
  }

  async ngAfterViewInit(): Promise<void> {
    this.onWindowScroll();
    await this.createHeaderMotion();
    this.scrollToInitialFragment();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.motionContext?.revert();
  }

  private async createHeaderMotion(): Promise<void> {
    const navbar = this.navbarRef?.nativeElement;
    if (!navbar) {
      return;
    }

    const [{ GsapAnimationService }, { setupHeaderMotion }] = await Promise.all([
      import('../../services/gsap-animation.service'),
      import('../../animations/premium-landing.animations'),
    ]);
    if (this.destroyed) {
      return;
    }

    const motion = this.injector.get(GsapAnimationService);
    const context = await motion.createContext(navbar, (tools) =>
      setupHeaderMotion(navbar, tools),
    );

    if (this.destroyed) {
      context?.revert();
      return;
    }

    this.motionContext = context;
  }

  private syncActiveSection(): void {
    const viewportLine = window.scrollY + 120;
    const currentItem = [...this.navItems()]
      .reverse()
      .find((item) => {
        const section = document.getElementById(item.id);
        return section ? section.offsetTop <= viewportLine : false;
      });

    if (currentItem && currentItem.id !== this.activeSectionId()) {
      this.activeSectionId.set(currentItem.id);
    }
  }

  private scrollToInitialFragment(): void {
    const fragment = this.router.parseUrl(this.router.url).fragment;
    if (fragment) {
      setTimeout(() => {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          this.activeSectionId.set(fragment);
        }
      }, 500);
    }
  }

  private getSectionIdFromEvent(event: Event): string | null {
    if (!(event.currentTarget instanceof HTMLAnchorElement)) {
      return null;
    }

    return event.currentTarget.hash.replace('#', '') || null;
  }
}
