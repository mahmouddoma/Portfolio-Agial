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
type GsapTimeline = ReturnType<GsapApi['timeline']>;
type ScrollTriggerApi = typeof import('gsap/ScrollTrigger').ScrollTrigger;

interface StackScrollTrigger {
  readonly start: number;
  readonly end: number;
  scroll(position: number): void;
  update(): void;
}

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
  @ViewChild('stackPin') private stackPin?: ElementRef<HTMLElement>;
  @ViewChild('storyStack') private storyStack?: ElementRef<HTMLElement>;
  @ViewChildren('stackCard') private stackCards?: QueryList<ElementRef<HTMLElement>>;

  private readonly language = inject(LanguageService);
  private gsap?: GsapApi;
  private animationContext?: GsapContext;
  private reducedMotion = false;
  private destroyed = false;
  private readonly stackHoldDuration = 1.15;
  private readonly stackTransitionDuration = 1.05;
  private stackTimeline?: GsapTimeline;
  private stackScrollTrigger?: StackScrollTrigger;

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
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    if (this.destroyed) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.gsap = gsap;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.createStackExperience(ScrollTrigger);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.animationContext?.revert();
    this.stackTimeline = undefined;
    this.stackScrollTrigger = undefined;
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
    this.activeIndex.set(nextIndex);

    if (this.seekStackCard(nextIndex)) {
      return;
    }

    this.scrollToStackCard(nextIndex);
  }

  isActive(index: number): boolean {
    return index === this.activeIndex();
  }

  private createStackExperience(ScrollTrigger: ScrollTriggerApi): void {
    const section = this.sectionRef?.nativeElement;
    const pin = this.stackPin?.nativeElement;
    const storyStack = this.storyStack?.nativeElement;
    const cards = this.stackCards?.map((card) => card.nativeElement) ?? [];
    const gsap = this.gsap;
    if (!section || !pin || !storyStack || !cards.length || !gsap || this.reducedMotion) {
      return;
    }

    this.animationContext = gsap.context(() => {
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

      gsap.set(cards, {
        opacity: (index: number) => (index === 0 ? 1 : 0),
        xPercent: -50,
        yPercent: -50,
        y: (index: number) => (index === 0 ? 0 : 150),
        scale: (index: number) => 1 - index * 0.035,
        rotate: (index: number) => index * -1.5,
        transformOrigin: '50% 100%',
      });

      const isDesktop = window.matchMedia('(min-width: 992px)').matches;
      const pinTarget = isDesktop ? pin : storyStack;

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pinTarget,
          start: isDesktop ? 'top 10%' : 'top 14%',
          end: `+=${Math.max(isDesktop ? 3200 : 2400, cards.length * (isDesktop ? 1100 : 820))}`,
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self: { progress: number }) => {
            this.syncActiveIndex(self.progress, cards.length);
          },
        },
      });
      const timelineWithTrigger = timeline as GsapTimeline & { scrollTrigger?: StackScrollTrigger };
      this.stackTimeline = timeline;
      this.stackScrollTrigger = timelineWithTrigger.scrollTrigger;

      const holdState = { value: 0 };
      const holdDuration = this.stackHoldDuration;
      const transitionDuration = this.stackTransitionDuration;

      timeline.to(holdState, {
        value: 0.2,
        duration: holdDuration,
      });

      cards.forEach((card, index) => {
        if (index === 0) {
          return;
        }

        timeline
          .to(
            card,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: transitionDuration,
            },
            '>',
          )
          .to(
            cards[index - 1],
            {
              y: -42,
              scale: 0.94,
              opacity: 0.58,
              duration: transitionDuration,
            },
            '<',
          )
          .to(
            holdState,
            {
              value: index,
              duration: holdDuration,
            },
            '>',
          );
      });

      ScrollTrigger.refresh();
    }, section);
  }

  private syncActiveIndex(progress: number, count: number): void {
    const nextIndex = Math.min(count - 1, Math.round(progress * (count - 1)));
    if (nextIndex !== this.activeIndex()) {
      this.activeIndex.set(nextIndex);
    }
  }

  private seekStackCard(index: number): boolean {
    const trigger = this.stackScrollTrigger;
    const timeline = this.stackTimeline;
    const cardCount = this.stackCards?.length ?? this.slides().length;
    if (!trigger || !timeline || cardCount < 2) {
      return false;
    }

    const progress = this.getStackProgressForIndex(index, cardCount);
    const targetScroll = trigger.start + (trigger.end - trigger.start) * progress;

    trigger.scroll(targetScroll);
    trigger.update();
    timeline.progress(progress);
    this.activeIndex.set(index);

    return true;
  }

  private getStackProgressForIndex(index: number, count: number): number {
    const maxIndex = Math.max(count - 1, 0);
    const clampedIndex = Math.min(Math.max(index, 0), maxIndex);
    const totalDuration =
      this.stackHoldDuration + maxIndex * (this.stackTransitionDuration + this.stackHoldDuration);

    if (totalDuration <= 0) {
      return 0;
    }

    const stablePhase =
      clampedIndex === 0
        ? this.stackHoldDuration / 2
        : this.stackHoldDuration +
          (clampedIndex - 1) * (this.stackTransitionDuration + this.stackHoldDuration) +
          this.stackTransitionDuration +
          this.stackHoldDuration / 2;

    return stablePhase / totalDuration;
  }

  private normalizeIndex(index: number): number {
    return Math.min(Math.max(index, 0), this.slides().length - 1);
  }

  private scrollToStackCard(index: number): void {
    if (this.stackScrollTrigger) {
      return;
    }

    this.stackCards?.get(index)?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}
