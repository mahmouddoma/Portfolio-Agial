import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ElementRef,
  Injector,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  inject,
} from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import type { GsapContext } from '../../services/gsap-animation.service';
import type { HeroMotionHandles } from '../../animations/premium-landing.animations';
import { SiteContentFacade } from '../../core/content/site-content.facade';
import { EditableContentDirective } from '../../core/live-edit/editable-content.directive';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, SliderComponent, EditableContentDirective],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroSection') private heroSection?: ElementRef<HTMLElement>;
  @ViewChildren('slide') slideElements!: QueryList<ElementRef>;
  @ViewChildren('dot') dotElements!: QueryList<ElementRef>;

  private readonly injector = inject(Injector);
  private readonly language = inject(LanguageService);
  private readonly siteContent = inject(SiteContentFacade);

  readonly hero = computed(() => this.siteContent.content().hero);
  readonly localizedSlides = computed(() =>
    this.hero().slides.map((slide: any, index: number) => ({
      src: slide.src,
      alt: this.language.text(slide.alt),
      path: `hero.slides.${index}.src`,
    })),
  );
  readonly eyebrow = computed(() => this.language.text(this.hero().eyebrow));
  readonly sectionTitle = computed(() => this.language.text(this.hero().title));
  readonly description = computed(() => this.language.text(this.hero().description));
  readonly primaryAction = computed(() => this.language.text(this.hero().primaryAction));
  readonly secondaryAction = computed(() => this.language.text(this.hero().secondaryAction));
  readonly metricsAria = computed(() => this.language.text(this.hero().metricsAria));
  readonly metrics = computed(() =>
    this.hero().metrics.map((metric: any, index: number) => ({
      text: this.language.text(metric),
      path: `hero.metrics.${index}`,
    })),
  );
  readonly direction = computed(() => this.language.direction());

  currentSlide = 0;
  private slideSubscription?: Subscription;
  private motionContext?: GsapContext;
  private heroMotionHandles: HeroMotionHandles = {};
  private destroyed = false;
  private readonly SLIDE_INTERVAL = 2500;
  private readonly heavyMotionQuery = '(max-width: 768px)';

  ngOnInit(): void {
    this.startSlideshow();
  }

  async ngAfterViewInit(): Promise<void> {
    this.updateSlideClasses();
    await this.createHeroMotion();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopSlideshow();
    this.motionContext?.revert();
    this.heroMotionHandles.splitText?.revert();
  }

  private startSlideshow(): void {
    this.stopSlideshow();
    this.slideSubscription = interval(this.SLIDE_INTERVAL).subscribe(() => {
      this.moveToNextSlide();
    });
  }

  private stopSlideshow(): void {
    this.slideSubscription?.unsubscribe();
  }

  private moveToNextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.localizedSlides().length;
    this.updateSlideClasses();
  }

  setCurrentSlide(index: number): void {
    this.currentSlide = index;
    this.updateSlideClasses();
    this.startSlideshow();
  }

  private updateSlideClasses(): void {
    this.slideElements?.forEach((slide, i) =>
      slide.nativeElement.classList.toggle('active', i === this.currentSlide),
    );

    this.dotElements?.forEach((dot, i) =>
      dot.nativeElement.classList.toggle('active', i === this.currentSlide),
    );
  }

  private async createHeroMotion(): Promise<void> {
    const section = this.heroSection?.nativeElement;
    if (!section || this.shouldSkipHeavyMotion()) {
      return;
    }

    const [{ GsapAnimationService }, { setupHeroMotion }] = await Promise.all([
      import('../../services/gsap-animation.service'),
      import('../../animations/premium-landing.animations'),
    ]);
    if (this.destroyed) {
      return;
    }

    const motion = this.injector.get(GsapAnimationService);
    const context = await motion.createContext(section, (tools) =>
      setupHeroMotion(section, tools, this.heroMotionHandles),
    );

    if (this.destroyed) {
      context?.revert();
      this.heroMotionHandles.splitText?.revert();
      return;
    }

    this.motionContext = context;
  }

  private shouldSkipHeavyMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia(this.heavyMotionQuery).matches;
  }
}
