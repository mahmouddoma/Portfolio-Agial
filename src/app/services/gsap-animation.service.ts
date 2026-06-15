import { Injectable, NgZone, inject } from '@angular/core';

type GsapApi = typeof import('gsap').gsap;
type ScrollTriggerPlugin = typeof import('gsap/ScrollTrigger').ScrollTrigger;
type SplitTextPlugin = typeof import('gsap/SplitText').SplitText;

export type GsapContext = ReturnType<GsapApi['context']>;
export type GsapSplitText = InstanceType<SplitTextPlugin>;

export interface GsapAnimationTools {
  gsap: GsapApi;
  ScrollTrigger: ScrollTriggerPlugin;
  SplitText: SplitTextPlugin;
}

export type GsapAnimationSetup = (tools: GsapAnimationTools) => void;

@Injectable({
  providedIn: 'root',
})
export class GsapAnimationService {
  private readonly ngZone = inject(NgZone);
  private pluginsPromise?: Promise<GsapAnimationTools>;

  get canAnimate(): boolean {
    return this.isBrowser() && !this.prefersReducedMotion();
  }

  async createContext(
    scope: HTMLElement,
    setup: GsapAnimationSetup,
  ): Promise<GsapContext | undefined> {
    if (!this.canAnimate) {
      return undefined;
    }

    const tools = await this.loadPlugins();

    return this.ngZone.runOutsideAngular(() =>
      tools.gsap.context(() => setup(tools), scope),
    );
  }

  refreshScrollTriggers(): void {
    if (!this.pluginsPromise || !this.isBrowser()) {
      return;
    }

    void this.pluginsPromise.then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  }

  private loadPlugins(): Promise<GsapAnimationTools> {
    this.pluginsPromise ??= this.importPlugins();
    return this.pluginsPromise;
  }

  private async importPlugins(): Promise<GsapAnimationTools> {
    const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
    ]);

    gsap.registerPlugin(ScrollTrigger, SplitText);

    return { gsap, ScrollTrigger, SplitText };
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
