import type {
  GsapAnimationTools,
  GsapSplitText,
} from '../services/gsap-animation.service';

export interface HeroMotionHandles {
  splitText?: GsapSplitText;
}

export function setupHeroMotion(
  section: HTMLElement,
  { gsap, ScrollTrigger }: GsapAnimationTools,
  handles: HeroMotionHandles,
): void {
  const media = section.querySelector<HTMLElement>('.slider');
  const eyebrow = section.querySelector<HTMLElement>('.hero-eyebrow');
  const title = section.querySelector<HTMLElement>('.hero-title');
  const description = section.querySelector<HTMLElement>('.hero-description');
  const actions = section.querySelector<HTMLElement>('.hero-actions');
  const metrics = section.querySelector<HTMLElement>('.hero-metrics');
  const pagination = section.querySelector<HTMLElement>('.pagination');

  handles.splitText?.revert();
  handles.splitText = undefined;
  const titleTargets = title ? [title] : [];

  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from(eyebrow, {
      y: 24,
      opacity: 0,
      duration: 0.72,
    })
    .from(
      titleTargets,
      {
        y: 42,
        opacity: 0,
        duration: 0.88,
        ease: 'power4.out',
      },
      '-=0.22',
    )
    .from(
      [description, actions, metrics, pagination].filter(isHTMLElement),
      {
        y: 30,
        opacity: 0,
        duration: 0.72,
        stagger: 0.12,
      },
      '-=0.46',
    );

  if (media) {
    gsap.fromTo(
      media,
      { yPercent: -2, scale: 1.02 },
      {
        yPercent: 9,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  }

  if (actions) {
    gsap.to(actions, {
      y: -7,
      duration: 2.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  ScrollTrigger.refresh();
}

export function setupHeaderMotion(
  navbar: HTMLElement,
  { gsap }: GsapAnimationTools,
): void {
  const navigationItems = Array.from(
    navbar.querySelectorAll<HTMLElement>(
      '.site-brand, .nav-link, .menu-toggle, .navbar-brand, .navbar-toggler',
    ),
  );

  gsap.set([navbar, ...navigationItems], {
    clearProps: 'opacity,visibility,transform',
  });

  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from(navbar, {
      y: -24,
      duration: 0.72,
      clearProps: 'transform',
    })
    .from(
      navigationItems,
      {
        y: -18,
        duration: 0.52,
        stagger: 0.065,
        clearProps: 'transform',
      },
      '-=0.36',
    );
}

function isHTMLElement(element: HTMLElement | null): element is HTMLElement {
  return element instanceof HTMLElement;
}
