import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
})
export class CounterComponent implements OnInit, AfterViewInit {
  @ViewChildren('counterElement') counterElements!: QueryList<ElementRef>;

  counters = [
    { label: 'طلابنا السعداء', target: 1900, icon: 'fa fa-users', count: 0 },
    { label: 'الجوائز المحققة', target: 500, icon: 'fa fa-trophy', count: 0 },
    {
      label: 'الشركات التي تثق بنا',
      target: 200,
      icon: 'fa-building',
      count: 0,
    },
    { label: 'الدول التي وصلنا إليها', target: 50, icon: 'fa-globe', count: 0 },
  ];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.observeCounters();
  }

  startCounters(): void {
    this.counters.forEach((counter) => {
      const target = counter.target;
      let currentCount = 0;
      const increment = target / 100;
      const interval = setInterval(() => {
        currentCount = Math.ceil(currentCount + increment);
        counter.count = currentCount;
        this.cdRef.markForCheck();

        if (currentCount >= target) {
          clearInterval(interval);
          counter.count = target;
          this.cdRef.markForCheck();
        }
      }, 10);
    });
  }

observeCounters(): void {
  const options = { threshold: 0.5 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        this.startSingleCounter(index); 
        observer.unobserve(entry.target);
      }
    });
  }, options);

  this.counterElements.toArray().forEach((el) => {
    observer.observe(el.nativeElement);
  });
}

startSingleCounter(index: number): void {
  const counter = this.counters[index];
  const target = counter.target;
  let currentCount = 0;
  const increment = target / 100;

  const interval = setInterval(() => {
    currentCount = Math.ceil(currentCount + increment);
    counter.count = currentCount;
    this.cdRef.markForCheck();

    if (currentCount >= target) {
      clearInterval(interval);
      counter.count = target;
      this.cdRef.markForCheck();
    }
  }, 10);
}
}
