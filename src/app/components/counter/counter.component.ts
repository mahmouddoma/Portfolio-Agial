import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  effect,
  inject,
} from '@angular/core';

import { SiteContentFacade } from '../../core/content/site-content.facade';
import { EditableContentDirective } from '../../core/live-edit/editable-content.directive';
import { CounterItem, CounterService } from '../../services/counter.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule, EditableContentDirective],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
})
export class CounterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('counterElement') counterElements!: QueryList<ElementRef<HTMLElement>>;

  private readonly counterService = inject(CounterService);
  private readonly language = inject(LanguageService);
  private readonly siteContent = inject(SiteContentFacade);
  private readonly cdRef = inject(ChangeDetectorRef);
  private observer: IntersectionObserver | null = null;
  private triggered = false;

  counters: CounterItem[] = [];

  private readonly contentSync = effect(() => {
    this.cleanupCounters();
    this.counters = this.siteContent.content().counters.map((counter: any) => ({
      label: counter.label,
      target: counter.target,
      icon: counter.icon,
      count: 0,
      duration: counter.duration,
    }));
    this.triggered = false;
    this.cdRef.markForCheck();
  });

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngAfterViewInit(): void {
    this.observeCounters();
    if (window.innerWidth <= 768 || !('IntersectionObserver' in window)) {
      setTimeout(() => this.startAllCounters(), 400);
    }
  }

  ngOnDestroy(): void {
    this.cleanupCounters();
    this.observer?.disconnect();
  }

  formatNumber(value: number): string {
    return this.language.formatNumber(value);
  }

  getCounterLabel(counter: CounterItem): string {
    return this.language.text(counter.label);
  }

  getTitle(): string {
    return this.language.text(this.siteContent.content().countersTitle);
  }

  private setupIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      this.observer = this.counterService.createIntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = this.getCounterIndex(entry.target);
            this.startSingleCounter(index);
            this.observer?.unobserve(entry.target);
          }
        });
      });
    }
  }

  private observeCounters(): void {
    if (!this.observer) {
      return;
    }

    this.counterElements.forEach((element) => {
      this.observer?.observe(element.nativeElement);
    });
  }

  private startSingleCounter(index: number): void {
    const counter = this.counters[index];
    if (!counter) {
      return;
    }

    counter.started = true;
    this.cdRef.markForCheck();

    const startTime = performance.now();
    const startValue = 0;

    if (counter.interval) {
      clearInterval(counter.interval);
    }

    counter.interval = setInterval(() => {
      const { progress, easeProgress } = this.counterService.calculateProgress(
        startTime,
        counter.duration,
      );

      counter.count = Math.round(startValue + (counter.target - startValue) * easeProgress);
      this.cdRef.markForCheck();

      if (progress >= 1) {
        clearInterval(counter.interval);
        counter.count = counter.target;
        this.cdRef.markForCheck();
      }
    }, 16);
  }

  private startAllCounters(): void {
    if (this.triggered) {
      return;
    }

    this.triggered = true;
    this.counters.forEach((_, index) => this.startSingleCounter(index));
  }

  private cleanupCounters(): void {
    this.counters.forEach((counter) => {
      if (counter.interval) {
        clearInterval(counter.interval);
      }
    });
  }

  private getCounterIndex(target: Element): number {
    if (!(target instanceof HTMLElement)) {
      return -1;
    }

    const index = Number(target.dataset['counterIndex']);
    return Number.isInteger(index) ? index : -1;
  }
}
