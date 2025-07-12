import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInViewport]'
})
export class InViewportDirective implements OnInit {
  @Input() animationType: 'fade-in' | 'slide-left' | 'slide-right' | 'slide-bottom' | 'scale-in' | 'slide-in-out-bottom' | 'slide-bottom-emerge' = 'slide-bottom';
  @Input() staggerDelay: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const nativeEl = this.el.nativeElement;
    let children = nativeEl.querySelectorAll('[data-animate]');
  
    // If no children with data-animate, apply to self
    if (!children.length) {
      children = [nativeEl];
    }
  
    children.forEach((child: HTMLElement, index: number) => {
      this.renderer.addClass(child, this.animationType);
      if (this.staggerDelay > 0) {
        this.renderer.addClass(child, `stagger-${Math.min(this.staggerDelay + index, 5)}`);
      }
    });
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          children.forEach((child: HTMLElement) => {
            this.renderer.addClass(child, 'show');
          });
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