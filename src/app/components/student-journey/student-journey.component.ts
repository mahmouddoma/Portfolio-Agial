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
import { SiteContentFacade } from '../../core/content/site-content.facade';
import { EditableContentDirective } from '../../core/live-edit/editable-content.directive';
import { AdminLiveEditService } from '../../core/live-edit/admin-live-edit.service';
import { LanguageService } from '../../services/language.service';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;

interface JourneyStep {
  id: number;
  index: number;
  phase: string;
  title: string;
  description: string;
  metric: string;
  detail: string;
}

@Component({
  selector: 'app-student-journey',
  standalone: true,
  imports: [CommonModule, EditableContentDirective],
  templateUrl: './student-journey.component.html',
  styleUrl: './student-journey.component.css',
})
export class StudentJourneyComponent implements AfterViewInit, OnDestroy {
  @ViewChild('journeySection') private journeySection?: ElementRef<HTMLElement>;
  @ViewChild('journeyPathProgress') private journeyPathProgress?: ElementRef<SVGPathElement>;
  @ViewChildren('journeyStep') private journeyStepElements?: QueryList<ElementRef<HTMLElement>>;

  private readonly language = inject(LanguageService);
  private readonly siteContent = inject(SiteContentFacade);
  private readonly liveEdit = inject(AdminLiveEditService);
  private context?: GsapContext;
  private destroyed = false;
  private reducedMotion = false;

  readonly activeStepIndex = signal(0);
  readonly isLiveEdit = this.liveEdit.enabled;

  readonly content = computed(() => this.siteContent.content().journey);

  readonly section = computed(() => ({
    kicker: this.language.text(this.content().section.kicker),
    title: this.language.text(this.content().section.title),
    description: this.language.text(this.content().section.description),
    panelAria: this.language.text(this.content().panelAria),
    mapAria: this.language.text(this.content().mapAria),
  }));

  readonly steps = computed<readonly JourneyStep[]>(() =>
    this.content().steps.map((step: any, index: number) => ({
      id: step.id,
      index,
      phase: step.phase,
      title: this.language.text(step.title),
      description: this.language.text(step.description),
      metric: this.language.text(step.metric),
      detail: this.language.text(step.detail),
    })),
  );

  readonly activeStep = computed(() => this.steps()[this.activeStepIndex()]);

  async ngAfterViewInit(): Promise<void> {
    if (this.liveEdit.enabled()) {
      return;
    }

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
