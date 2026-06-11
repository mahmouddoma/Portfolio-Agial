import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;
type GsapQuickTo = ReturnType<GsapApi['quickTo']>;

interface CourseStat {
  label: string;
  value: string;
}

interface Course {
  id: number;
  title: string;
  category: string;
  summary: string;
  image: string;
  duration: string;
  sessions: number;
  level: string;
  instructors: readonly string[];
  stats: readonly CourseStat[];
  tags: readonly string[];
}

@Component({
  selector: 'app-our-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './our-services.component.html',
  styleUrl: './our-services.component.css',
})
export class OurServicesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('servicesSection') private servicesSection?: ElementRef<HTMLElement>;
  @ViewChild('courseSignal') private courseSignal?: ElementRef<HTMLElement>;

  private readonly ngZone = inject(NgZone);
  private gsap?: GsapApi;
  private context?: GsapContext;
  private xTo?: GsapQuickTo;
  private yTo?: GsapQuickTo;
  private scrollCleanup?: () => void;
  private resizeCleanup?: () => void;
  private ticking = false;
  private destroyed = false;
  private reducedMotion = false;

  readonly section = {
    kicker: 'برامجنا التعليمية',
    title: 'الدورات الشائعة',
    description:
      'مسارات تعليمية مصممة للحفظ، التجويد، التفسير، والمتابعة الفردية، مع وضوح في الخطة والمدرب والنتيجة المتوقعة.',
  };

  readonly courses: readonly Course[] = [
    {
      id: 1,
      title: 'برنامج الحفظ المتدرج',
      category: 'تحفيظ',
      summary: 'خطة حفظ يومية تراعي مستوى الطالب وتوازن بين الحفظ الجديد والمراجعة.',
      image: 'muslims-reading-from-quran.jpg',
      duration: '12 أسبوع',
      sessions: 24,
      level: 'مبتدئ إلى متوسط',
      instructors: ['أ. سمية سليمان', 'أ. عبدالله محمد'],
      stats: [
        { label: 'جلسة', value: '24' },
        { label: 'متابعة', value: 'يومية' },
      ],
      tags: ['حفظ', 'مراجعة', 'تقييم'],
    },
    {
      id: 2,
      title: 'التلاوة وأحكام التجويد',
      category: 'تجويد',
      summary: 'تدريب عملي على المخارج والصفات والوقف والابتداء بتسجيلات وملاحظات واضحة.',
      image: 'medium-shot-boy-first-communion-portrait.jpg',
      duration: '8 أسابيع',
      sessions: 16,
      level: 'كل المستويات',
      instructors: ['أ. خالد أحمد', 'أ. مريم حسين'],
      stats: [
        { label: 'تدريب صوتي', value: '16' },
        { label: 'اختبار', value: '4' },
      ],
      tags: ['مخارج', 'تلاوة', 'تصحيح'],
    },
    {
      id: 3,
      title: 'تفسير سور مختارة',
      category: 'تفسير',
      summary: 'فهم المعاني العامة للسور وربطها بالقيم والسلوك اليومي بأسلوب مناسب للعمر.',
      image: 'islamic-new-year-concept-with-copy-space.jpg',
      duration: '10 أسابيع',
      sessions: 20,
      level: 'متوسط',
      instructors: ['أ. محمود عبدالله', 'أ. فاطمة الزهراء'],
      stats: [
        { label: 'سورة', value: '10' },
        { label: 'نشاط', value: '20' },
      ],
      tags: ['فهم', 'تدبر', 'قيم'],
    },
    {
      id: 4,
      title: 'حلقة المتابعة الفردية',
      category: 'متابعة',
      summary: 'مسار خاص للطالب بخطة أسبوعية ومؤشرات تقدم واضحة لولي الأمر والمعلم.',
      image: 'silhouette-woman-reading-quran.jpg',
      duration: 'شهري',
      sessions: 8,
      level: 'حسب المستوى',
      instructors: ['أ. سارة علي', 'أ. محمد سعيد'],
      stats: [
        { label: 'خطة', value: 'فردية' },
        { label: 'تقرير', value: 'أسبوعي' },
      ],
      tags: ['فردي', 'تقارير', 'مرونة'],
    },
  ];

  readonly featuredCourse = this.courses[0];

  async ngAfterViewInit(): Promise<void> {
    const { gsap } = await import('gsap');
    if (this.destroyed) {
      return;
    }

    this.gsap = gsap;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.createEntranceAnimation();
    this.createSignalMotion();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.scrollCleanup?.();
    this.resizeCleanup?.();
    this.context?.revert();
  }

  trackByCourseId(_: number, course: Course): number {
    return course.id;
  }

  private createEntranceAnimation(): void {
    const section = this.servicesSection?.nativeElement;
    const gsap = this.gsap;
    if (!section || !gsap || this.reducedMotion) {
      return;
    }

    this.context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(section.querySelectorAll('.course-gsap-title'), {
          y: 44,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
        })
        .from(
          section.querySelector('.featured-course'),
          {
            y: 56,
            opacity: 0,
            scale: 0.97,
            duration: 0.75,
          },
          '-=0.34'
        )
        .from(
          section.querySelectorAll('.course-card'),
          {
            y: 56,
            opacity: 0,
            duration: 0.72,
            stagger: 0.08,
          },
          '-=0.36'
        );
    }, section);
  }

  private createSignalMotion(): void {
    const section = this.servicesSection?.nativeElement;
    const signal = this.courseSignal?.nativeElement;
    const gsap = this.gsap;
    if (!section || !signal || !gsap || this.reducedMotion) {
      return;
    }

    this.xTo = gsap.quickTo(signal, 'x', { duration: 0.7, ease: 'power3.out' });
    this.yTo = gsap.quickTo(signal, 'y', { duration: 0.7, ease: 'power3.out' });

    const update = (): void => {
      this.ticking = false;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const progress = this.clamp((viewportHeight - rect.top) / (rect.height + viewportHeight), 0, 1);

      this.xTo?.(this.lerp(section.clientWidth * 0.82, section.clientWidth * 0.18, progress));
      this.yTo?.(this.lerp(96, section.clientHeight - 120, progress));
    };

    const requestUpdate = (): void => {
      if (this.ticking) {
        return;
      }

      this.ticking = true;
      window.requestAnimationFrame(update);
    };

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate);
    });

    this.scrollCleanup = () => window.removeEventListener('scroll', requestUpdate);
    this.resizeCleanup = () => window.removeEventListener('resize', requestUpdate);
    requestUpdate();
  }

  private lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
