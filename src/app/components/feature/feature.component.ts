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
import { FEATURE_CONTENT } from '../../data/site-content';
import { LanguageService } from '../../services/language.service';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;

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
  @ViewChildren('featurePanel') private featurePanels?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('featureVisual') private featureVisuals?: QueryList<ElementRef<HTMLElement>>;

  private readonly language = inject(LanguageService);
  private animationContext?: GsapContext;
  private destroyed = false;
  private reducedMotion = false;

  readonly section = computed(() => ({
    kicker: this.language.text(FEATURE_CONTENT.section.kicker),
    title: this.language.text(FEATURE_CONTENT.section.title),
    description: this.language.text(FEATURE_CONTENT.section.description),
    visualAria: this.language.text(FEATURE_CONTENT.visualAria),
  }));

  readonly features = computed<readonly Feature[]>(() =>
    FEATURE_CONTENT.features.map((feature) => ({
      id: feature.id,
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
