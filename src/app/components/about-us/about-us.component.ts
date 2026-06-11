import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { InViewportDirective } from '../../directives/directives/in-viewport.directive';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, SliderComponent, InViewportDirective],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('slide') slideElements!: QueryList<ElementRef>;
  @ViewChildren('dot') dotElements!: QueryList<ElementRef>;

  slides: string[] = [
    'banner.png',
    'muslims-reading-from-quran.jpg',
    'silhouette-woman-reading-quran.jpg',
  ];

  currentSlide = 0;
  private slideSubscription?: Subscription;
  private readonly SLIDE_INTERVAL = 2500;

  // Dynamic content for the About Us section
  sectionTitle: string = 'مدرسة أجيال القرآن';
  description: string = `نصنع أجيالًا بالقرآن علمًا وخلقًا وقيادة، من خلال تجربة تعليمية تربوية تجمع بين الأصالة والمعاصرة.

نقدم بيئة آمنة ومنظمة تساعد الطالب على الحفظ، التلاوة، الفهم، وبناء الشخصية المتوازنة بإشراف معلمين متخصصين.`;

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngAfterViewInit(): void {
    this.updateSlideClasses();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  private startSlideshow(): void {
    this.stopSlideshow();
    this.slideSubscription = interval(this.SLIDE_INTERVAL).subscribe(() => {
      this.moveToNextSlide();
    });
  }

  private stopSlideshow(): void {
    this.slideSubscription?.unsubscribe();
  }

  private moveToNextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateSlideClasses();
  }

  setCurrentSlide(index: number): void {
    this.currentSlide = index;
    this.updateSlideClasses();
    this.startSlideshow();
  }

  private updateSlideClasses(): void {
    this.slideElements?.forEach((slide, i) =>
      slide.nativeElement.classList.toggle('active', i === this.currentSlide),
    );

    this.dotElements?.forEach((dot, i) =>
      dot.nativeElement.classList.toggle('active', i === this.currentSlide),
    );
  }
}
