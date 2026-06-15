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
import { HERO_CONTENT } from '../../data/site-content';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, SliderComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroSection') private heroSection?: ElementRef<HTMLElement>;
  @ViewChildren('slide') slideElements!: QueryList<ElementRef>;
  @ViewChildren('dot') dotElements!: QueryList<ElementRef>;

  private readonly injector = inject(Injector);
  private readonly language = inject(LanguageService);

  readonly slides = HERO_CONTENT.slides;
  readonly localizedSlides = computed(() =>
    this.slides.map((slide) => ({
      src: slide.src,
      alt: this.language.text(slide.alt),
    })),
  );
  readonly eyebrow = computed(() => this.language.text(HERO_CONTENT.eyebrow));
  readonly sectionTitle = computed(() => this.language.text(HERO_CONTENT.title));
  readonly description = computed(() => this.language.text(HERO_CONTENT.description));
  readonly primaryAction = computed(() => this.language.text(HERO_CONTENT.primaryAction));
  readonly secondaryAction = computed(() => this.language.text(HERO_CONTENT.secondaryAction));
  readonly metricsAria = computed(() => this.language.text(HERO_CONTENT.metricsAria));
  readonly metrics = computed(() => HERO_CONTENT.metrics.map((metric) => this.language.text(metric)));
  readonly direction = computed(() => this.language.direction());

  currentSlide = 0;
  private slideSubscription?: Subscription;
  private motionContext?: GsapContext;
  private heroMotionHandles: HeroMotionHandles = {};
  private destroyed = false;
  private readonly SLIDE_INTERVAL = 2500;

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
    if (!section) {
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
}
