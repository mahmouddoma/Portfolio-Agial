type GsapApi = typeof import('gsap').gsap;
type ScrollTriggerPlugin = typeof import('gsap/ScrollTrigger').ScrollTrigger;

interface FeatureScrollState {
  direction: number;
}

export interface FeatureMotionConfig {
  section: HTMLElement;
  panels: HTMLElement[];
  images: HTMLElement[];
  gsap: GsapApi;
  ScrollTrigger: ScrollTriggerPlugin;
  onActiveFeatureChange: (index: number) => void;
}

export function setupFeatureMotion(config: FeatureMotionConfig): void {
  const { section, panels, images, gsap, ScrollTrigger, onActiveFeatureChange } = config;
  const visualFrame = section.querySelector<HTMLElement>('.feature-visual-frame');
  const showcase = section.querySelector<HTMLElement>('.feature-showcase');
  let activeIndex = -1;

  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from(section.querySelectorAll('.feature-gsap-title'), {
      y: 44,
      opacity: 0,
      duration: 0.85,
      stagger: 0.1,
    })
    .from(
      section.querySelector('.feature-showcase'),
      {
        y: 54,
        opacity: 0,
        duration: 0.82,
      },
      '-=0.36',
    );

  if (!panels.length || !images.length) {
    return;
  }

  gsap.set(images, {
    autoAlpha: 0,
    clipPath: 'inset(0% 18% 0% 0% round 18px)',
    rotateY: -8,
    scale: 1.08,
    xPercent: -8,
  });
  gsap.set(images[0], {
    autoAlpha: 1,
    clipPath: 'inset(0% 0% 0% 0% round 18px)',
    rotateY: 0,
    scale: 1,
    xPercent: 0,
  });
  activeIndex = 0;

  if (visualFrame && showcase) {
    gsap.to(visualFrame, {
      y: 26,
      rotateX: 1.8,
      ease: 'none',
      scrollTrigger: {
        trigger: showcase,
        start: 'top 70%',
        end: 'bottom 36%',
        scrub: 0.75,
      },
    });
  }

  panels.forEach((panel, index) => {
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 54%',
      end: 'bottom 46%',
      onEnter: (self: FeatureScrollState) => {
        activeIndex = setActiveFeature(
          index,
          activeIndex,
          self.direction,
          images,
          visualFrame,
          gsap,
          onActiveFeatureChange,
        );
      },
      onEnterBack: (self: FeatureScrollState) => {
        activeIndex = setActiveFeature(
          index,
          activeIndex,
          self.direction,
          images,
          visualFrame,
          gsap,
          onActiveFeatureChange,
        );
      },
    });
  });

  ScrollTrigger.refresh();
}

function setActiveFeature(
  nextIndex: number,
  currentIndex: number,
  direction: number,
  images: HTMLElement[],
  visualFrame: HTMLElement | null,
  gsap: GsapApi,
  onActiveFeatureChange: (index: number) => void,
): number {
  if (nextIndex === currentIndex) {
    return currentIndex;
  }

  const motionDirection = direction >= 0 ? 1 : -1;
  onActiveFeatureChange(nextIndex);

  if (visualFrame) {
    gsap.fromTo(
      visualFrame,
      { rotateY: motionDirection * -4, scale: 0.985 },
      { rotateY: 0, scale: 1, duration: 0.58, ease: 'power3.out', overwrite: true },
    );
  }

  images.forEach((image, index) => {
    const imageElement = image.querySelector('img');

    if (index === nextIndex) {
      gsap.fromTo(
        image,
        {
          autoAlpha: 0,
          clipPath:
            motionDirection > 0
              ? 'inset(0% 24% 0% 0% round 18px)'
              : 'inset(0% 0% 0% 24% round 18px)',
          rotateY: motionDirection * -8,
          scale: 1.08,
          xPercent: motionDirection * -9,
        },
        {
          autoAlpha: 1,
          clipPath: 'inset(0% 0% 0% 0% round 18px)',
          rotateY: 0,
          scale: 1,
          xPercent: 0,
          duration: 0.72,
          ease: 'power3.out',
          overwrite: true,
        },
      );

      if (imageElement) {
        gsap.fromTo(
          imageElement,
          { scale: 1.12 },
          { scale: 1, duration: 0.86, ease: 'power3.out', overwrite: true },
        );
      }

      return;
    }

    gsap.to(image, {
      autoAlpha: 0,
      clipPath:
        motionDirection > 0
          ? 'inset(0% 0% 0% 18% round 18px)'
          : 'inset(0% 18% 0% 0% round 18px)',
      rotateY: motionDirection * 5,
      scale: 0.98,
      xPercent: motionDirection * 7,
      duration: 0.42,
      ease: 'power2.inOut',
      overwrite: true,
    });
  });

  return nextIndex;
}
