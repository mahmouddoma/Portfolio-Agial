import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';
import { CounterService, CounterItem } from '../../services/counter.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
})
export class CounterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('counterElement') counterElements!: QueryList<ElementRef>;
  private observer: IntersectionObserver | null = null;
  counters: CounterItem[] = [];
  private triggered: boolean = false;

  constructor(
    private counterService: CounterService,
    private cdRef: ChangeDetectorRef
  ) {
    this.counters = this.counterService.getCounters();
  }

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngAfterViewInit(): void {
    this.observeCounters();
    // Fallback: If on small screen or IntersectionObserver not supported, trigger all counters
    if (window.innerWidth <= 768 || !('IntersectionObserver' in window)) {
      setTimeout(() => this.startAllCounters(), 400); // slight delay for DOM
    }
  }

  ngOnDestroy(): void {
    this.cleanupCounters();
    this.observer?.disconnect();
  }

  private setupIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      this.observer = this.counterService.createIntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            this.startSingleCounter(index);
            this.observer?.unobserve(entry.target);
          }
        });
      });
    }
  }

  private observeCounters(): void {
    if (!this.observer) return;

    this.counterElements.forEach((element) => {
      this.observer?.observe(element.nativeElement);
    });
  }

  private startSingleCounter(index: number): void {
    const counter = this.counters[index];
    if (!counter) return;

    const startTime = performance.now();
    const startValue = 0;

    // Cleanup any existing interval
    if (counter.interval) {
      clearInterval(counter.interval);
    }

    counter.interval = setInterval(() => {
      const { progress, easeProgress } = this.counterService.calculateProgress(
        startTime,
        counter.duration
      );

      counter.count = Math.round(
        startValue + (counter.target - startValue) * easeProgress
      );
      this.cdRef.markForCheck();

      if (progress >= 1) {
        clearInterval(counter.interval);
        counter.count = counter.target;
        this.cdRef.markForCheck();
      }
    }, 16);
  }

  private startAllCounters(): void {
    if (this.triggered) return;
    this.triggered = true;
    this.counters.forEach((_, idx) => this.startSingleCounter(idx));
  }

  private cleanupCounters(): void {
    this.counters.forEach((counter) => {
      if (counter.interval) {
        clearInterval(counter.interval);
      }
    });
  }

  formatNumber(value: number): string {
    return this.counterService.formatNumber(value);
  }
}
