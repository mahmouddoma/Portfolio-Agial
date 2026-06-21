import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy, computed, inject, input, signal } from '@angular/core';
import { SiteContentFacade } from '../../core/content/site-content.facade';
import { LanguageService } from '../../services/language.service';

type BackToTopVariant = 'portfolio' | 'admin';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css'
})
export class BackToTopComponent implements AfterViewInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly language = inject(LanguageService);
  private readonly siteContent = inject(SiteContentFacade);
  private readonly showAfterViewportRatio = 0.8;
  private readonly scrollAnimationDurationMs = 650;
  private readonly scrollContainerSelector = '.admin-page, .admin-main, .admin-page-content, .admin-preview-frame, .admin-content-tabs';
  private readonly capturedScrollOptions: AddEventListenerOptions = { capture: true, passive: true };
  private readonly handleCapturedScroll = (event: Event): void => {
    this.updateButtonVisibility(event.target);
  };
  private scrollAnimationFrame: number | null = null;

  readonly showWhatsApp = input(true);
  readonly variant = input<BackToTopVariant>('portfolio');
  readonly showButton = signal(false);
  readonly backToTopContent = computed(() => this.siteContent.content().footer.backToTop);
  readonly backToTopAria = computed(() => this.language.text(this.backToTopContent().backToTopAria));
  readonly whatsappAria = computed(() => this.language.text(this.backToTopContent().whatsappAria));

  ngAfterViewInit(): void {
    this.document.addEventListener('scroll', this.handleCapturedScroll, this.capturedScrollOptions);
    this.updateButtonVisibility();
    window.requestAnimationFrame(() => this.updateButtonVisibility());
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('scroll', this.handleCapturedScroll, true);
    this.cancelScrollAnimation();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateButtonVisibility();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateButtonVisibility();
  }

  scrollToTop(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.animateScrollToTop();
  }

  private updateButtonVisibility(target?: EventTarget | null): void {
    const threshold = window.innerHeight * this.showAfterViewportRatio;
    this.showButton.set(this.getCurrentScrollDepth(target) > threshold);
  }

  private getCurrentScrollDepth(target?: EventTarget | null): number {
    return Math.max(
      window.scrollY,
      this.document.documentElement.scrollTop,
      this.document.body.scrollTop,
      this.getElementScrollTop(target),
      ...this.getTrackedScrollContainers().map((container) => container.scrollTop),
    );
  }

  private getElementScrollTop(target?: EventTarget | null): number {
    if (target instanceof Element) {
      return target.scrollTop;
    }

    if (target === this.document) {
      return this.document.scrollingElement?.scrollTop ?? 0;
    }

    return 0;
  }

  private getTrackedScrollContainers(): HTMLElement[] {
    return Array.from(this.document.querySelectorAll<HTMLElement>(this.scrollContainerSelector));
  }

  private animateScrollToTop(): void {
    this.cancelScrollAnimation();

    const windowStartTop = window.scrollY || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const scrollContainers = this.getScrollableContainers()
      .map((container) => ({
        container,
        left: container.scrollLeft,
        top: container.scrollTop,
      }));
    const startedAt = window.performance.now();

    const step = (timestamp: number): void => {
      const elapsed = timestamp - startedAt;
      const progress = Math.min(elapsed / this.scrollAnimationDurationMs, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const remaining = 1 - easedProgress;

      window.scrollTo({ top: windowStartTop * remaining, left: 0, behavior: 'auto' });
      scrollContainers.forEach(({ container, left, top }) => {
        container.scrollTop = top * remaining;
        container.scrollLeft = left * remaining;
      });

      if (progress < 1) {
        this.scrollAnimationFrame = window.requestAnimationFrame(step);
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      scrollContainers.forEach(({ container }) => {
        container.scrollTop = 0;
        container.scrollLeft = 0;
      });
      this.scrollAnimationFrame = null;
      this.updateButtonVisibility();
    };

    this.scrollAnimationFrame = window.requestAnimationFrame(step);
  }

  private cancelScrollAnimation(): void {
    if (this.scrollAnimationFrame === null) {
      return;
    }

    window.cancelAnimationFrame(this.scrollAnimationFrame);
    this.scrollAnimationFrame = null;
  }

  private getScrollableContainers(): HTMLElement[] {
    const baseContainers = [
      this.document.scrollingElement,
      this.document.documentElement,
      this.document.body,
      ...this.getTrackedScrollContainers(),
    ].filter((container): container is HTMLElement => container instanceof HTMLElement);

    const scrollableContainers = Array.from(this.document.querySelectorAll<HTMLElement>('*'))
      .filter((element) => element.scrollHeight > element.clientHeight && element.scrollTop > 0);

    return Array.from(new Set([...baseContainers, ...scrollableContainers]));
  }
}
