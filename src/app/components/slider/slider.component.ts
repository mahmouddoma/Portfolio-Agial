import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TESTIMONIAL_CONTENT } from '../../data/site-content';
import { LanguageService } from '../../services/language.service';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;

interface AchievementMetric {
  label: string;
  value: string;
}

interface TestimonialSlide {
  id: number;
  name: string;
  role: string;
  program: string;
  achievement: string;
  quote: string;
  image: string;
  metrics: readonly AchievementMetric[];
}

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionRef') private sectionRef?: ElementRef<HTMLElement>;
  @ViewChildren('stackCard') private stackCards?: QueryList<ElementRef<HTMLElement>>;

  private readonly language = inject(LanguageService);
  private gsap?: GsapApi;
  private animationContext?: GsapContext;
  private reducedMotion = false;
  private destroyed = false;

  readonly section = computed(() => ({
    kicker: this.language.text(TESTIMONIAL_CONTENT.kicker),
    title: this.language.text(TESTIMONIAL_CONTENT.title),
    description: this.language.text(TESTIMONIAL_CONTENT.description),
    summaryAria: this.language.text(TESTIMONIAL_CONTENT.summaryAria),
    summaryLabel: this.language.text(TESTIMONIAL_CONTENT.summaryLabel),
    summaryValue: this.language.text(TESTIMONIAL_CONTENT.summaryValue),
    summaryUnit: this.language.text(TESTIMONIAL_CONTENT.summaryUnit),
    summaryText: this.language.text(TESTIMONIAL_CONTENT.summaryText),
    stackAria: this.language.text(TESTIMONIAL_CONTENT.stackAria),
    thumbnailsAria: this.language.text(TESTIMONIAL_CONTENT.thumbnailsAria),
    previousAria: this.language.text(TESTIMONIAL_CONTENT.previousAria),
    nextAria: this.language.text(TESTIMONIAL_CONTENT.nextAria),
    dotsAria: this.language.text(TESTIMONIAL_CONTENT.dotsAria),
    showStoryPrefix: this.language.text(TESTIMONIAL_CONTENT.showStoryPrefix),
  }));

  readonly slides = computed<readonly TestimonialSlide[]>(() =>
    TESTIMONIAL_CONTENT.slides.map((slide) => ({
      id: slide.id,
      name: this.language.text(slide.name),
      role: this.language.text(slide.role),
      program: this.language.text(slide.program),
      achievement: this.language.text(slide.achievement),
      quote: this.language.text(slide.quote),
      image: slide.image,
      metrics: slide.metrics.map((metric) => ({
        label: this.language.text(metric.label),
        value: this.language.text(metric.value),
      })),
    })),
  );

  readonly activeIndex = signal(0);

  async ngAfterViewInit(): Promise<void> {
    const { gsap } = await import('gsap');
    if (this.destroyed) {
      return;
    }

    this.gsap = gsap;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.createStoryExperience();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.animationContext?.revert();
  }

  nextSlide(): void {
    this.goToSlide((this.activeIndex() + 1) % this.slides().length);
  }

  previousSlide(): void {
    const previousIndex = this.activeIndex() === 0 ? this.slides().length - 1 : this.activeIndex() - 1;
    this.goToSlide(previousIndex);
  }

  goToSlide(index: number): void {
    const nextIndex = this.normalizeIndex(index);
    if (nextIndex === this.activeIndex()) {
      return;
    }

    this.activeIndex.set(nextIndex);
    this.animateActiveStory(nextIndex);
  }

  isActive(index: number): boolean {
    return index === this.activeIndex();
  }

  private createStoryExperience(): void {
    const section = this.sectionRef?.nativeElement;
    const cards = this.stackCards?.map((card) => card.nativeElement) ?? [];
    const gsap = this.gsap;
    if (!section || !cards.length || !gsap) {
      return;
    }

    this.animationContext = gsap.context(() => {
      if (this.reducedMotion) {
        return;
      }

      gsap.set(cards, {
        autoAlpha: (index: number) => (index === this.activeIndex() ? 1 : 0),
        y: (index: number) => (index === this.activeIndex() ? 0 : 24),
        scale: (index: number) => (index === this.activeIndex() ? 1 : 0.98),
        zIndex: (index: number) => (index === this.activeIndex() ? 2 : 1),
      });

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(section.querySelectorAll('.gsap-title'), {
          y: 42,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
        })
        .from(
          section.querySelectorAll('.gsap-panel'),
          {
            y: 64,
            opacity: 0,
            duration: 0.85,
            stagger: 0.12,
          },
          '-=0.48'
        )
        .from(
          section.querySelectorAll('.gsap-chip'),
          {
            y: 18,
            opacity: 0,
            duration: 0.45,
            stagger: 0.06,
          },
          '-=0.28'
        );

      this.animateActiveStory(this.activeIndex());
    }, section);
  }

  private normalizeIndex(index: number): number {
    return Math.min(Math.max(index, 0), this.slides().length - 1);
  }

  private animateActiveStory(index: number): void {
    if (!this.gsap || this.reducedMotion) {
      return;
    }

    const cards = this.stackCards?.map((card) => card.nativeElement) ?? [];
    const activeCard = cards[index];
    if (!activeCard) {
      return;
    }

    this.gsap.killTweensOf(cards);
    this.gsap.to(cards, {
      autoAlpha: (cardIndex: number) => (cardIndex === index ? 1 : 0),
      y: (cardIndex: number) => (cardIndex === index ? 0 : 24),
      scale: (cardIndex: number) => (cardIndex === index ? 1 : 0.98),
      zIndex: (cardIndex: number) => (cardIndex === index ? 2 : 1),
      duration: 0.38,
      ease: 'power2.out',
      overwrite: true,
    });

    const storyMotionItems = activeCard.querySelectorAll<HTMLElement>('.story-motion');
    this.gsap.fromTo(
      storyMotionItems,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        ease: 'power2.out',
        stagger: 0.055,
        overwrite: true,
      },
    );
  }
}
