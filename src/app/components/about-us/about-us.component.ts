import { Component, AfterViewInit,OnDestroy,OnInit,ElementRef,QueryList,ViewChildren} from '@angular/core';
import { SliderComponent } from "../slider/slider.component";
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { InViewportDirective } from '../../directives/directives/in-viewport.directive';


@Component({
  selector: 'app-about-us',
  imports: [CommonModule, SliderComponent,InViewportDirective],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('slide') slideElements!: QueryList<ElementRef>;
  @ViewChildren('dot') dotElements!: QueryList<ElementRef>;

  slides: string[] = [
    'https://i.pinimg.com/736x/fd/07/1b/fd071bbe03e4f934d9778fc891991f2b.jpg',
    'https://i.pinimg.com/736x/7e/12/68/7e1268fcfbe66584d3d5e4f17dcdd6ef.jpg',
    'https://i.pinimg.com/736x/5b/ac/a7/5baca7ecb295e3db48df80ad419eb46b.jpg',
  ];

  currentSlide = 0;
  private slideSubscription?: Subscription;
  private readonly SLIDE_INTERVAL = 2500; 

  // Dynamic content for the About Us section
  sectionTitle: string = ' مدرسة أجيال القرآن 🌟';
  description: string = `نصنع أجيالًا بالقرآن... علمًا وخلقًا وقيادة

مدرسة أجيال القرآن هي مؤسسة تعليمية تربوية تُعنى بصناعة جيل قرآني واعٍ، يتربّى على هدي الكتاب والسنة، ويتسلّح بالعلم والمعرفة والمهارات الحياتية التي تؤهله لصناعة المستقبل.

نعمل على تقديم تعليم متميز يدمج بين العلوم الشرعية والمعارف المعاصرة، في إطار بيئة تعليمية محفّزة يقودها نخبة من المعلمين المتخصصين في تدريس القرآن الكريم والعلوم الإسلامية.

نحرص على بناء شخصية الطالب بناءً متكاملًا، يجمع بين الثبات الديني، والرقي الأخلاقي، والكفاءة العلمية، كما نولي اهتمامًا خاصًا بتنمية مهارات التفكير النقدي والإبداعي، وتعزيز روح المبادرة والقيادة.

نطمح في مدرسة أجيال القرآن إلى أن نكون روّادًا في تقديم نموذج تعليمي يُحتذى، يجمع بين الأصالة والمعاصرة، ويُخرّج طلابًا مؤمنين، مبدعين، وفاعلين في مجتمعاتهم.
`;

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
      slide.nativeElement.classList.toggle('active', i === this.currentSlide)
    );

    this.dotElements?.forEach((dot, i) =>
      dot.nativeElement.classList.toggle('active', i === this.currentSlide)
    );
  }
}