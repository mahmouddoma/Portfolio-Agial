import { ElementRef, Renderer2 } from '@angular/core';
import { InViewportDirective } from './in-viewport.directive';

describe('InViewportDirective', () => {
  it('should create an instance', () => {
    const renderer = {
      addClass: jasmine.createSpy('addClass'),
      removeClass: jasmine.createSpy('removeClass'),
    } as unknown as Renderer2;
    const elementRef = new ElementRef(document.createElement('div'));
    const directive = new InViewportDirective(elementRef, renderer);

    expect(directive).toBeTruthy();
  });
});
