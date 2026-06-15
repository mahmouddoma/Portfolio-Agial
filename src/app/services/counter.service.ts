import { Injectable } from '@angular/core';
import { COUNTER_CONTENT } from '../data/site-content';
import type { LocalizedText } from './language.service';

export interface CounterConfig {
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  refreshRate?: number;
}

export interface CounterItem {
  label: LocalizedText;
  target: number;
  icon: string;
  count: number;
  started?: boolean;
  interval?: ReturnType<typeof setInterval>;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private readonly DEFAULT_ANIMATION_DURATION = 2000;
  private readonly DEFAULT_REFRESH_RATE = 16;
  private readonly DEFAULT_THRESHOLD = 0.5;
  private readonly DEFAULT_ROOT_MARGIN = '0px 0px -10% 0px';

  getCounters(): CounterItem[] {
    return COUNTER_CONTENT.map((counter) => ({
      label: counter.label,
      target: counter.target,
      icon: counter.icon,
      count: 0,
      duration: counter.duration,
    }));
  }

  createIntersectionObserver(
    callback: IntersectionObserverCallback,
    config?: CounterConfig
  ): IntersectionObserver {
    return new IntersectionObserver(callback, {
      threshold: config?.threshold || this.DEFAULT_THRESHOLD,
      rootMargin: config?.rootMargin || this.DEFAULT_ROOT_MARGIN,
    });
  }

  calculateProgress(
    startTime: number,
    duration: number = this.DEFAULT_ANIMATION_DURATION
  ): { progress: number; easeProgress: number } {
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use easeOutExpo for smooth deceleration
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    return { progress, easeProgress };
  }

  formatNumber(value: number, locale: string = 'ar-EG'): string {
    return new Intl.NumberFormat(locale).format(value);
  }
}
