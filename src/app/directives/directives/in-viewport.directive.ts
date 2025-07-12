import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appInViewport]',
  standalone: true,
})
export class InViewportDirective implements OnInit {
  @Input() animationType: 'fade-in' | 'slide-left' | 'slide-right' | 'slide-bottom' | 'scale-in' = 'fade-in';
  @Input() staggerDelay: number = 0;
  
  @HostBinding('class') elementClass = '';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Set initial classes
    this.elementClass = this.animationType;
    if (this.staggerDelay > 0) {
      this.elementClass += ` stagger-${Math.min(this.staggerDelay, 5)}`;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.elementClass = `${this.animationType} show`;
          if (this.staggerDelay > 0) {
            this.elementClass += ` stagger-${Math.min(this.staggerDelay, 5)}`;
          }
          observer.unobserve(this.el.nativeElement);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' 
    });

    observer.observe(this.el.nativeElement);
  }
}
