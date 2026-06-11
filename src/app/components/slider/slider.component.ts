import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;
type GsapTimeline = ReturnType<GsapApi['timeline']>;
type GsapTween = ReturnType<GsapApi['to']>;

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
  @ViewChild('storyCard') private storyCard?: ElementRef<HTMLElement>;
  @ViewChild('progressBar') private progressBar?: ElementRef<HTMLElement>;
  @ViewChildren('thumbnailButton') private thumbnailButtons?: QueryList<ElementRef<HTMLButtonElement>>;

  private readonly ngZone = inject(NgZone);
  private readonly autoplayDuration = 7200;
  private gsap?: GsapApi;
  private animationContext?: GsapContext;
  private slideTimeline?: GsapTimeline;
  private progressTween?: GsapTween;
  private autoplayId?: number;
  private reducedMotion = false;
  private destroyed = false;

  readonly slides: readonly TestimonialSlide[] = [
    {
      id: 1,
      name: 'أحمد محمد',
      role: 'طالب خاتم',
      program: 'برنامج الختم المتقن',
      achievement: 'ختم القرآن كاملًا خلال عامين',
      quote:
        'بدأت الرحلة بحفظ قصير يومي، ومع المتابعة الفردية والتقييم المستمر وصلت إلى الختم بثبات وثقة.',
      image: 'medium-shot-boy-first-communion-portrait.jpg',
      metrics: [
        { label: 'مدة الرحلة', value: '24 شهر' },
        { label: 'نسبة الالتزام', value: '96%' },
        { label: 'المراجعة', value: 'يومية' },
      ],
    },
    {
      id: 2,
      name: 'عبد الرحمن خالد',
      role: 'متقن تلاوة',
      program: 'برنامج التلاوة والتجويد',
      achievement: 'إتقان أحكام التجويد والتلاوة الصحيحة',
      quote:
        'التدريب العملي على المخارج والوقف والابتداء جعل التلاوة أوضح، والمراجعة الصوتية ساعدتني أرى تقدمي أسبوعًا بعد أسبوع.',
      image: 'muslims-reading-from-quran.jpg',
      metrics: [
        { label: 'جلسات تقييم', value: '48' },
        { label: 'تحسن الأداء', value: '82%' },
        { label: 'المتابعة', value: 'أسبوعية' },
      ],
    },
    {
      id: 3,
      name: 'محمد عبد الله',
      role: 'طالب متميز',
      program: 'برنامج المتابعة الفردية',
      achievement: 'بناء عادة حفظ ومراجعة مستقرة',
      quote:
        'أكثر ما صنع الفارق هو وضوح الخطة، كل أسبوع أعرف المطلوب مني، والمعلم يتابعني بخطوات صغيرة لكنها مؤثرة.',
      image: 'silhouette-woman-reading-quran.jpg',
      metrics: [
        { label: 'معدل الحفظ', value: '5 أيام' },
        { label: 'اختبارات ناجحة', value: '18' },
        { label: 'خطة شخصية', value: 'مفعلة' },
      ],
    },
  ];

  readonly activeIndex = signal(0);
  readonly activeSlide = computed(() => this.slides[this.activeIndex()]);
  readonly formattedActiveIndex = computed(() => `${this.activeIndex() + 1}`.padStart(2, '0'));
  readonly totalSlides = computed(() => `${this.slides.length}`.padStart(2, '0'));

  async ngAfterViewInit(): Promise<void> {
    const { gsap } = await import('gsap');
    if (this.destroyed) {
      return;
    }

    this.gsap = gsap;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.createEntranceAnimation();
    this.animateActiveStory();
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopAutoplay();
    this.progressTween?.kill();
    this.slideTimeline?.kill();
    this.animationContext?.revert();
  }

  nextSlide(): void {
    this.goToSlide((this.activeIndex() + 1) % this.slides.length);
  }

  previousSlide(): void {
    const previousIndex = this.activeIndex() === 0 ? this.slides.length - 1 : this.activeIndex() - 1;
    this.goToSlide(previousIndex);
  }

  goToSlide(index: number): void {
    if (index === this.activeIndex()) {
      this.restartAutoplay();
      return;
    }

    this.activeIndex.set(index);
    this.restartAutoplay();
    this.scheduleStoryAnimation();
  }

  isActive(index: number): boolean {
    return index === this.activeIndex();
  }

  private createEntranceAnimation(): void {
    const section = this.sectionRef?.nativeElement;
    const gsap = this.gsap;
    if (!section || !gsap || this.reducedMotion) {
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
    }, section);
  }

  private scheduleStoryAnimation(): void {
    window.requestAnimationFrame(() => this.animateActiveStory());
  }

  private animateActiveStory(): void {
    const card = this.storyCard?.nativeElement;
    const progressBar = this.progressBar?.nativeElement;
    const thumbnails = this.thumbnailButtons?.map((button) => button.nativeElement) ?? [];
    const gsap = this.gsap;

    this.slideTimeline?.kill();
    this.progressTween?.kill();

    if (!card || !gsap || this.reducedMotion) {
      return;
    }

    const animatedItems = card.querySelectorAll('.story-motion');

    this.slideTimeline = gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .fromTo(
        card,
        { y: 24, opacity: 0.92, scale: 0.985 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55 }
      )
      .fromTo(
        animatedItems,
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.56, stagger: 0.07 },
        '-=0.32'
      )
      .fromTo(
        card.querySelector('.student-portrait'),
        { scale: 0.86, rotate: -3, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.7 },
        '-=0.5'
      );

    if (thumbnails.length) {
      gsap.fromTo(
        thumbnails,
        { y: 8, opacity: 0.7 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
      );
    }

    if (progressBar) {
      gsap.set(progressBar, { scaleX: 0, transformOrigin: 'right center' });
      this.progressTween = gsap.to(progressBar, {
        scaleX: 1,
        duration: this.autoplayDuration / 1000,
        ease: 'none',
      });
    }
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.ngZone.runOutsideAngular(() => {
      this.autoplayId = window.setInterval(() => {
        this.ngZone.run(() => this.nextSlide());
      }, this.autoplayDuration);
    });
  }

  private restartAutoplay(): void {
    this.startAutoplay();
  }

  private stopAutoplay(): void {
    if (this.autoplayId) {
      window.clearInterval(this.autoplayId);
      this.autoplayId = undefined;
    }
  }
}
