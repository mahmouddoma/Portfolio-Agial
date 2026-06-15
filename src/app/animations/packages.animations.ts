type GsapApi = typeof import('gsap').gsap;
type ScrollTriggerPlugin = typeof import('gsap/ScrollTrigger').ScrollTrigger;

export interface PackagesMotionConfig {
  section: HTMLElement;
  gsap: GsapApi;
  ScrollTrigger: ScrollTriggerPlugin;
}

export function setupPackagesMotion(config: PackagesMotionConfig): void {
  const { section, gsap, ScrollTrigger } = config;
  const cards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.package-card'));
  const controls = section.querySelectorAll<HTMLElement>('.package-nav, .package-dots button');

  gsap
    .timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 74%',
        once: true,
      },
    })
    .from(section.querySelectorAll('.packages-gsap-title > *'), {
      y: 32,
      duration: 0.72,
      stagger: 0.08,
    })
    .from(
      cards,
      {
        y: 76,
        rotateX: -10,
        scale: 0.96,
        transformOrigin: '50% 100%',
        duration: 0.82,
        stagger: { each: 0.08, from: 'center' },
      },
      '-=0.42',
    )
    .from(
      controls,
      {
        scale: 0.78,
        duration: 0.38,
        stagger: 0.06,
      },
      '-=0.35',
    );

  ScrollTrigger.refresh();
}
