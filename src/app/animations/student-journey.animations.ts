type GsapApi = typeof import('gsap').gsap;
type ScrollTriggerPlugin = typeof import('gsap/ScrollTrigger').ScrollTrigger;

interface JourneyScrollState {
  progress: number;
}

export interface StudentJourneyMotionConfig {
  section: HTMLElement;
  path?: SVGPathElement;
  steps: HTMLElement[];
  stepCount: number;
  gsap: GsapApi;
  ScrollTrigger: ScrollTriggerPlugin;
  onActiveStepChange: (index: number) => void;
}

export function setupStudentJourneyMotion(config: StudentJourneyMotionConfig): void {
  const { section, path, steps, stepCount, gsap, ScrollTrigger, onActiveStepChange } = config;
  const stage = section.querySelector<HTMLElement>('.journey-stage');
  const panel = section.querySelector<HTMLElement>('.journey-panel');
  const pathTrack = section.querySelector<SVGPathElement>('.journey-path__track');
  const isCompact = window.matchMedia('(max-width: 900px)').matches;
  const isMobile = window.matchMedia('(max-width: 560px)').matches;
  let activeStepIndex = -1;

  gsap
    .timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: section,
        start: isCompact ? 'top 82%' : 'top 76%',
        once: true,
      },
    })
    .from(section.querySelectorAll('.journey-gsap-title'), {
      y: 42,
      opacity: 0,
      duration: 0.78,
      stagger: 0.1,
    })
    .from(
      stage,
      {
        y: 64,
        opacity: 0,
        scale: 0.98,
        duration: 0.82,
      },
      '-=0.35',
    )
    .from(
      steps,
      {
        x: isMobile ? 0 : 36,
        y: isMobile ? 24 : 0,
        opacity: 0,
        immediateRender: false,
        duration: 0.58,
        stagger: 0.07,
      },
      '-=0.42',
    );

  if (!path || !steps.length) {
    return;
  }

  gsap.set(path, { drawSVG: '0%', opacity: 1 });
  if (pathTrack) {
    gsap.set(pathTrack, { opacity: isCompact ? 0.95 : 1 });
  }
  gsap.set(steps, { '--step-glow': 0 });

  const activateStep = (index: number): void => {
    const stepIndex = Math.min(Math.max(index, 0), stepCount - 1);
    if (stepIndex === activeStepIndex) {
      return;
    }

    activeStepIndex = stepIndex;
    onActiveStepChange(stepIndex);
    setStepGlow(steps, stepIndex, gsap);

    window.requestAnimationFrame(() => {
      animateJourneyPanel(panel, gsap, isCompact);
    });
  };

  activateStep(0);

  if (isCompact) {
    steps.forEach((step, index) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 72%',
        end: 'bottom 46%',
        onEnter: () => activateStep(index),
        onEnterBack: () => activateStep(index),
      });
    });
  }

  gsap.to(path, {
    drawSVG: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: stage ?? section,
      start: isCompact ? 'top 74%' : 'top 68%',
      end: isCompact ? 'bottom 38%' : 'bottom 44%',
      scrub: 0.75,
      onUpdate: (self: JourneyScrollState) => {
        activateStep(getActiveStepIndexFromPath(self.progress, stepCount));
      },
      onRefresh: (self: JourneyScrollState) => {
        activateStep(getActiveStepIndexFromPath(self.progress, stepCount));
      },
    },
  });

  ScrollTrigger.refresh();
}

function getActiveStepIndexFromPath(progress: number, stepCount: number): number {
  const maxIndex = Math.max(stepCount - 1, 0);
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  return Math.min(maxIndex, Math.floor(clampedProgress * stepCount));
}

function animateJourneyPanel(panel: HTMLElement | null, gsap: GsapApi, isCompact: boolean): void {
  if (!panel) {
    return;
  }

  const panelContent = panel.querySelectorAll<HTMLElement>(
    '.journey-panel__phase, h3, p, .journey-panel__metric',
  );

  gsap.fromTo(
    panel,
    {
      y: isCompact ? 18 : 12,
      scale: isCompact ? 0.94 : 0.985,
    },
    {
      y: 0,
      scale: 1,
      duration: isCompact ? 0.46 : 0.36,
      ease: isCompact ? 'back.out(1.45)' : 'power2.out',
      overwrite: true,
    },
  );

  gsap.fromTo(
    panelContent,
    { y: 18, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.42, stagger: 0.045, ease: 'power2.out', overwrite: true },
  );
}

function setStepGlow(steps: HTMLElement[], activeIndex: number, gsap: GsapApi): void {
  steps.forEach((step, index) => {
    gsap.to(step, {
      '--step-glow': index <= activeIndex ? 1 : 0,
      duration: 0.2,
      overwrite: true,
    });
  });
}
