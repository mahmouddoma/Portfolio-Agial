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
import { CounterComponent } from '../counter/counter.component';
import { SiteContentFacade } from '../../core/content/site-content.facade';
import { EditableContentDirective } from '../../core/live-edit/editable-content.directive';
import { LanguageService } from '../../services/language.service';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;

interface FeatureHighlight {
  label: string;
  value: string;
}

interface Feature {
  id: number;
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  highlight: FeatureHighlight;
}

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, CounterComponent, EditableContentDirective],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
})
export class FeatureComponent implements AfterViewInit, OnDestroy {
  @ViewChild('featureSection') private featureSection?: ElementRef<HTMLElement>;
  @ViewChildren('featurePanel') private featurePanels?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('featureVisual') private featureVisuals?: QueryList<ElementRef<HTMLElement>>;

  private readonly language = inject(LanguageService);
  private readonly siteContent = inject(SiteContentFacade);
  private animationContext?: GsapContext;
  private destroyed = false;
  private reducedMotion = false;

  readonly content = computed(() => this.siteContent.content().features);

  readonly section = computed(() => ({
    kicker: this.language.text(this.content().section.kicker),
    title: this.language.text(this.content().section.title),
    description: this.language.text(this.content().section.description),
    visualAria: this.language.text(this.content().visualAria),
  }));

  readonly features = computed<readonly Feature[]>(() =>
    this.content().features.map((feature: any, index: number) => ({
      id: feature.id,
      index,
      eyebrow: this.language.text(feature.eyebrow),
      title: this.language.text(feature.title),
      description: this.language.text(feature.description),
      image: feature.image,
      highlight: {
        label: this.language.text(feature.highlight.label),
        value: this.language.text(feature.highlight.value),
      },
    })),
  );
  readonly activeFeatureIndex = signal(0);

  async ngAfterViewInit(): Promise<void> {
    const [{ gsap }, { ScrollTrigger }, { setupFeatureMotion }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('../../animations/feature.animations'),
    ]);
    if (this.destroyed) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this.createFeatureMotion(gsap, ScrollTrigger, setupFeatureMotion);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.animationContext?.revert();
  }

  trackByFeatureId(_: number, feature: Feature): number {
    return feature.id;
  }

  isActive(index: number): boolean {
    return this.activeFeatureIndex() === index;
  }

  private createFeatureMotion(
    gsap: GsapApi,
    ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
    setupFeatureMotion: typeof import('../../animations/feature.animations').setupFeatureMotion,
  ): void {
    const section = this.featureSection?.nativeElement;
    const panels = this.featurePanels?.map((panel) => panel.nativeElement) ?? [];
    const images = this.featureVisuals?.map((image) => image.nativeElement) ?? [];
    if (!section || !gsap || this.reducedMotion) {
      return;
    }

    this.animationContext = gsap.context(() => {
      setupFeatureMotion({
        section,
        panels,
        images,
        gsap,
        ScrollTrigger,
        onActiveFeatureChange: (index) => this.activeFeatureIndex.set(index),
      });
    }, section);
  }
}
