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
import { CounterComponent } from '../counter/counter.component';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;
type GsapQuickTo = ReturnType<GsapApi['quickTo']>;

interface FeatureHighlight {
  label: string;
  value: string;
}

interface Feature {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  highlight: FeatureHighlight;
}

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, CounterComponent],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
})
export class FeatureComponent implements AfterViewInit, OnDestroy {
  @ViewChild('featureSection') private featureSection?: ElementRef<HTMLElement>;
  @ViewChild('journeyOrb') private journeyOrb?: ElementRef<HTMLElement>;

  private readonly ngZone = inject(NgZone);
  private gsap?: GsapApi;
  private animationContext?: GsapContext;
  private xTo?: GsapQuickTo;
  private yTo?: GsapQuickTo;
  private scrollListener?: () => void;
  private resizeListener?: () => void;
  private ticking = false;
  private destroyed = false;
  private reducedMotion = false;

  readonly section = {
    kicker: 'المميزات',
    title: 'مميزات مدرسة أجيال القرآن',
    description:
      'منظومة تعليمية تربط المتابعة الفردية، جودة الإشراف، وتنظيم الحلقات في تجربة واحدة واضحة للطالب وولي الأمر.',
  };

  readonly features: readonly Feature[] = [
    {
      id: 1,
      eyebrow: 'متابعة ذكية',
      title: 'تقارير الطالب ومتابعته',
      description:
        'تقارير دقيقة تعرض الحفظ، الحضور، المشاركة، ونقاط التحسن، حتى يحصل كل طالب على دعم مناسب حسب مستواه.',
      image: 'medium-shot-boy-first-communion-portrait.jpg',
      highlight: { label: 'تحديثات دورية', value: 'أسبوعية' },
    },
    {
      id: 2,
      eyebrow: 'إشراف متخصص',
      title: 'مشرفون على التخطيط والتدريس',
      description:
        'فريق إشراف يتابع جودة الحفظ والتلاوة، ويراجع أداء الحلقات والمعلمين لضمان بيئة تعليمية مستقرة.',
      image: 'muslims-reading-from-quran.jpg',
      highlight: { label: 'تقييم أداء', value: 'مستمر' },
    },
    {
      id: 3,
      eyebrow: 'رحلة منظمة',
      title: 'حلقات فردية حسب المستوى',
      description:
        'مسارات تعلم تراعي العمر والقدرة، مع خطة حفظ ومراجعة واضحة تساعد الطالب على التدرج بثقة.',
      image: 'islamic-new-year-concept-with-copy-space.jpg',
      highlight: { label: 'خطة شخصية', value: 'مفعلة' },
    },
    {
      id: 4,
      eyebrow: 'فريق مؤهل',
      title: 'معلمون يرافقون الطالب',
      description:
        'معلمون ومعلمات يجمعون بين الخبرة التربوية وإتقان التجويد، ويركزون على الثبات والاستمرار.',
      image: 'silhouette-woman-reading-quran.jpg',
      highlight: { label: 'مرافقة تربوية', value: 'يومية' },
    },
  ];

  async ngAfterViewInit(): Promise<void> {
    const { gsap } = await import('gsap');
    if (this.destroyed) {
      return;
    }

    this.gsap = gsap;
    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this.createEntranceAnimation();
    this.createJourneyMotion();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.scrollListener?.();
    this.resizeListener?.();
    this.animationContext?.revert();
  }

  trackByFeatureId(_: number, feature: Feature): number {
    return feature.id;
  }

  private createEntranceAnimation(): void {
    const section = this.featureSection?.nativeElement;
    const gsap = this.gsap;
    if (!section || !gsap || this.reducedMotion) {
      return;
    }

    this.animationContext = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(section.querySelectorAll('.feature-gsap-title'), {
          y: 44,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
        })
        .from(
          section.querySelectorAll('.feature-card'),
          {
            y: 60,
            opacity: 0,
            rotateX: -8,
            duration: 0.8,
            stagger: 0.1,
          },
          '-=0.38',
        )
        .from(
          section.querySelectorAll('.journey-step'),
          {
            scale: 0.72,
            opacity: 0,
            duration: 0.45,
            stagger: 0.07,
          },
          '-=0.2',
        );
    }, section);
  }

  private createJourneyMotion(): void {
    const section = this.featureSection?.nativeElement;
    const orb = this.journeyOrb?.nativeElement;
    const gsap = this.gsap;
    if (!section || !orb || !gsap || this.reducedMotion) {
      return;
    }

    this.xTo = gsap.quickTo(orb, 'x', { duration: 0.65, ease: 'power3.out' });
    this.yTo = gsap.quickTo(orb, 'y', { duration: 0.65, ease: 'power3.out' });

    const update = (): void => {
      this.ticking = false;
      const rect = section.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const progress = this.clamp(
        (viewportHeight - rect.top) / (rect.height + viewportHeight),
        0,
        1,
      );
      const width = section.clientWidth;
      const height = section.clientHeight;

      this.xTo?.(this.lerp(width * 0.78, width * 0.18, progress));
      this.yTo?.(this.lerp(110, height - 160, progress));
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

    this.scrollListener = () =>
      window.removeEventListener('scroll', requestUpdate);
    this.resizeListener = () =>
      window.removeEventListener('resize', requestUpdate);
    requestUpdate();
  }

  private lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
