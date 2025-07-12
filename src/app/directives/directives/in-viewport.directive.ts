import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInViewport]'
})
export class InViewportDirective implements OnInit {
  @Input() animationType: 'fade-in' | 'slide-left' | 'slide-right' | 'slide-bottom' | 'scale-in' = 'fade-in';
  @Input() staggerDelay: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const nativeEl = this.el.nativeElement;

    // Add initial animation class
    this.renderer.addClass(nativeEl, this.animationType);

    // Add stagger delay class if needed
    if (this.staggerDelay > 0) {
      const delayClass = `stagger-${Math.min(this.staggerDelay, 5)}`;
      this.renderer.addClass(nativeEl, delayClass);
    }

    // Setup IntersectionObserver
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(nativeEl, 'show');
          observer.unobserve(nativeEl);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(nativeEl);
  }
}
