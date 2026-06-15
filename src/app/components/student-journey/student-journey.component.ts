import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { JOURNEY_CONTENT } from '../../data/site-content';
import { LanguageService } from '../../services/language.service';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;

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
  @ViewChild('journeyPathProgress') private journeyPathProgress?: ElementRef<SVGPathElement>;
  @ViewChildren('journeyStep') private journeyStepElements?: QueryList<ElementRef<HTMLElement>>;

  private readonly language = inject(LanguageService);
  private context?: GsapContext;
  private destroyed = false;
  private reducedMotion = false;

  readonly activeStepIndex = signal(0);

  readonly section = computed(() => ({
    kicker: this.language.text(JOURNEY_CONTENT.section.kicker),
    title: this.language.text(JOURNEY_CONTENT.section.title),
    description: this.language.text(JOURNEY_CONTENT.section.description),
    panelAria: this.language.text(JOURNEY_CONTENT.panelAria),
    mapAria: this.language.text(JOURNEY_CONTENT.mapAria),
  }));

  readonly steps = computed<readonly JourneyStep[]>(() =>
    JOURNEY_CONTENT.steps.map((step) => ({
      id: step.id,
      phase: step.phase,
      title: this.language.text(step.title),
      description: this.language.text(step.description),
      metric: this.language.text(step.metric),
      detail: this.language.text(step.detail),
    })),
  );

  readonly activeStep = computed(() => this.steps()[this.activeStepIndex()]);

  async ngAfterViewInit(): Promise<void> {
    const [{ gsap }, { ScrollTrigger }, { DrawSVGPlugin }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/DrawSVGPlugin'),
    ]);
    if (this.destroyed) {
      return;
    }

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await this.createJourneyMotion(gsap, ScrollTrigger, DrawSVGPlugin);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.context?.revert();
  }

  setActiveStep(index: number): void {
    this.activeStepIndex.set(index);
  }

  private async createJourneyMotion(
    gsap: GsapApi,
    ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
    DrawSVGPlugin: typeof import('gsap/DrawSVGPlugin').DrawSVGPlugin,
  ): Promise<void> {
    const section = this.journeySection?.nativeElement;
    const path = this.journeyPathProgress?.nativeElement;
    const steps = this.journeyStepElements?.map((step) => step.nativeElement) ?? [];
    if (!section || !gsap || this.reducedMotion) {
      return;
    }

    const { setupStudentJourneyMotion } = await import('../../animations/student-journey.animations');
    if (this.destroyed) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

    this.context = gsap.context(() => {
      setupStudentJourneyMotion({
        section,
        path,
        steps,
        stepCount: this.steps().length,
        gsap,
        ScrollTrigger,
        onActiveStepChange: (index) => this.activeStepIndex.set(index),
      });
    }, section);
  }
}
