import { ElementRef, Renderer2 } from '@angular/core';
import { SwiperDirective } from './swiper.directive';

describe('SwiperDirective', () => {
  it('should create an instance', () => {
    const renderer = {
      setStyle: jasmine.createSpy('setStyle'),
    } as unknown as Renderer2;
    const elementRef = new ElementRef(document.createElement('div'));
    const directive = new SwiperDirective(elementRef, renderer);

    expect(directive).toBeTruthy();
  });
});
