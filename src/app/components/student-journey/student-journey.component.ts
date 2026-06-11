import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;
type GsapQuickTo = ReturnType<GsapApi['quickTo']>;

interface JourneyStep {
  id: number;
  phase: string;
  title: string;
  description: string;
  metric: string;
  detail: string;
}

@Component({
  selector: 'app-student-journey',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-journey.component.html',
  styleUrl: './student-journey.component.css',
})
export class StudentJourneyComponent implements AfterViewInit, OnDestroy {
  @ViewChild('journeySection') private journeySection?: ElementRef<HTMLElement>;
  @ViewChild('journeySignal') private journeySignal?: ElementRef<HTMLElement>;

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

  readonly activeStepIndex = signal(0);

  readonly activeStep = computed(() => this.steps[this.activeStepIndex()]);

  readonly section = {
    kicker: 'رحلة الطالب',
    title: 'من أول تقييم إلى إتقان مستمر',
    description:
      'نحوّل التعلم من دروس متفرقة إلى مسار واضح: تقييم، خطة، حلقة، متابعة، ثم إنجاز قابل للقياس.',
  };

  readonly steps: readonly JourneyStep[] = [
    {
      id: 1,
      phase: '01',
      title: 'تقييم المستوى',
      description:
        'نبدأ بفهم مستوى الطالب في الحفظ والتلاوة والالتزام، ثم نحدد نقطة البداية المناسبة.',
      metric: '15 دقيقة',
      detail: 'جلسة تعريف قصيرة تحدد المسار المناسب من غير تعقيد.',
    },
    {
      id: 2,
      phase: '02',
      title: 'اختيار المسار',
      description:
        'نربط هدف الطالب ببرنامج واضح للحفظ، التجويد، التفسير، أو المتابعة الفردية.',
      metric: '4 مسارات',
      detail: 'كل مسار له مدة، مستوى، ومعلم مناسب لطبيعة الطالب.',
    },
    {
      id: 3,
      phase: '03',
      title: 'حلقة مباشرة',
      description:
        'يدخل الطالب في حلقة منظمة مع معلم يتابع الأداء ويصحح التلاوة خطوة بخطوة.',
      metric: 'مباشر',
      detail: 'تجربة تعلم حية تركّز على التدرج والثبات.',
    },
    {
      id: 4,
      phase: '04',
      title: 'متابعة وتقارير',
      description:
        'ولي الأمر والمعلم يشاهدان مؤشرات التقدم، الحضور، المراجعة، ونقاط التحسن.',
      metric: 'أسبوعي',
      detail: 'تقارير مختصرة تساعد الطالب يكمل بثقة ووضوح.',
    },
    {
      id: 5,
      phase: '05',
      title: 'إنجاز مستمر',
      description:
        'كل إنجاز يتحول إلى خطة مراجعة جديدة حتى لا يكون التقدم مؤقتا.',
      metric: 'مستمر',
      detail: 'الهدف ليس الحفظ فقط، بل تثبيت ما تم تعلمه.',
    },
  ];

  async ngAfterViewInit(): Promise<void> {
    const { gsap } = await import('gsap');
    if (this.destroyed) {
      return;
    }

    this.gsap = gsap;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.createEntranceAnimation();
    this.createScrollMotion();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.scrollCleanup?.();
    this.resizeCleanup?.();
    this.context?.revert();
  }

  setActiveStep(index: number): void {
    this.activeStepIndex.set(index);
  }

  private createEntranceAnimation(): void {
    const section = this.journeySection?.nativeElement;
    const gsap = this.gsap;
    if (!section || !gsap || this.reducedMotion) {
      return;
    }

    this.context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(section.querySelectorAll('.journey-gsap-title'), {
          y: 42,
          opacity: 0,
          duration: 0.78,
          stagger: 0.1,
        })
        .from(
          section.querySelector('.journey-stage'),
          {
            y: 64,
            opacity: 0,
            scale: 0.98,
            duration: 0.82,
          },
          '-=0.35',
        )
        .from(
          section.querySelectorAll('.journey-step'),
          {
            x: 36,
            opacity: 0,
            duration: 0.58,
            stagger: 0.07,
          },
          '-=0.42',
        );
    }, section);
  }

  private createScrollMotion(): void {
    const section = this.journeySection?.nativeElement;
    const signal = this.journeySignal?.nativeElement;
    const gsap = this.gsap;
    if (!section || !signal || !gsap || this.reducedMotion) {
      return;
    }

    this.xTo = gsap.quickTo(signal, 'x', { duration: 0.72, ease: 'power3.out' });
    this.yTo = gsap.quickTo(signal, 'y', { duration: 0.72, ease: 'power3.out' });

    const update = (): void => {
      this.ticking = false;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const progress = this.clamp(
        (viewportHeight - rect.top) / (rect.height + viewportHeight),
        0,
        1,
      );
      const stepIndex = Math.min(
        this.steps.length - 1,
        Math.floor(progress * this.steps.length),
      );

      this.activeStepIndex.set(stepIndex);
      this.xTo?.(this.lerp(section.clientWidth * 0.74, section.clientWidth * 0.18, progress));
      this.yTo?.(this.lerp(120, section.clientHeight - 140, progress));
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
