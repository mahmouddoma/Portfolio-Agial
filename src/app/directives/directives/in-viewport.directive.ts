import { Directive, ElementRef, Input, OnInit, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appInViewport]'
})
export class InViewportDirective implements OnInit, OnChanges {
  @Input() animationType: 'fade-in' | 'slide-left' | 'slide-right' | 'slide-bottom' | 'scale-in' | 'slide-in-out-bottom' | 'slide-bottom-emerge' = 'slide-bottom';
  @Input() staggerDelay: number | string = 0;

  private hasAnimated = false;
  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.applyAnimationClasses();
    this.setupObserver();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animationType'] || changes['staggerDelay']) {
      this.applyAnimationClasses();
    }
  }

  private applyAnimationClasses(): void {
    const nativeEl = this.el.nativeElement;
    let children = nativeEl.querySelectorAll('[data-animate]');
    if (!children.length) {
      children = [nativeEl];
    }
    // Remove previous animation classes
    children.forEach((child: HTMLElement) => {
      this.renderer.removeClass(child, 'fade-in');
      this.renderer.removeClass(child, 'slide-left');
      this.renderer.removeClass(child, 'slide-right');
      this.renderer.removeClass(child, 'slide-bottom');
      this.renderer.removeClass(child, 'scale-in');
      this.renderer.removeClass(child, 'slide-in-out-bottom');
      this.renderer.removeClass(child, 'slide-bottom-emerge');
      this.renderer.removeClass(child, 'show');
      for (let i = 1; i <= 6; i++) {
        this.renderer.removeClass(child, `stagger-${i}`);
      }
    });
    // Parse staggerDelay as number
    let baseDelay = typeof this.staggerDelay === 'string' ? parseInt(this.staggerDelay, 10) : this.staggerDelay;
    if (isNaN(baseDelay)) baseDelay = 0;
    children.forEach((child: HTMLElement, index: number) => {
      this.renderer.addClass(child, this.animationType);
      if (baseDelay > 0) {
        this.renderer.addClass(child, `stagger-${Math.min(baseDelay + index, 5)}`);
      }
    });
  }

  private setupObserver(): void {
    const nativeEl = this.el.nativeElement;
    let children = nativeEl.querySelectorAll('[data-animate]');
    if (!children.length) {
      children = [nativeEl];
    }
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            children.forEach((child: HTMLElement) => {
              if (!child.classList.contains('show')) {
                this.renderer.addClass(child, 'show');
              }
            });
            this.hasAnimated = true;
            this.observer && this.observer.unobserve(nativeEl);
          }
        });
      }, {
        threshold: 0.05, // was 0.01
        rootMargin: '0px 0px -10% 0px' 
      });
      this.observer.observe(nativeEl);
    } else {
      children.forEach((child: HTMLElement) => {
        this.renderer.addClass(child, 'show');
      });
    }
  }
}