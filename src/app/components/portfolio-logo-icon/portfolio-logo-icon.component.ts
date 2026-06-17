import { ChangeDetectionStrategy, Component, computed, input, signal, OnInit, OnDestroy } from '@angular/core';

export type PortfolioLogoIconVariant = 'full' | 'mark';
export type PortfolioLogoIconAnimation = 'intro' | 'loop' | 'none';

interface LogoBackgroundRect {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
}

@Component({
  selector: 'app-portfolio-logo-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'portfolio-logo-icon-host',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel()',
    '[class.portfolio-logo-icon-host--mark]': "variant() === 'mark'",
    '[style.--portfolio-logo-icon-width]': 'resolvedWidth()',
    '[style.--portfolio-logo-icon-accent]': 'accentColor()',
    '[style.--portfolio-logo-icon-text]': 'textColor()',
    '[style.--portfolio-logo-icon-background]': 'backgroundColor()',
  },
  template: `
    <span
      class="portfolio-logo-icon"
      [class.portfolio-logo-icon--mark]="variant() === 'mark'"
      [class.portfolio-logo-icon--loop]="animation() === 'loop'"
      [class.portfolio-logo-icon--static]="animation() === 'none'"
    >
      @if (renderTrigger()) {
      <svg
        class="portfolio-logo-icon__svg"
        [attr.viewBox]="viewBox()"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <title>{{ ariaLabel() }}</title>

        @if (showBackground()) {
          <rect
            class="portfolio-logo-icon__background"
            [attr.x]="backgroundRect().x"
            [attr.y]="backgroundRect().y"
            [attr.width]="backgroundRect().width"
            [attr.height]="backgroundRect().height"
            [attr.rx]="backgroundRect().rx"
          />
        }

        <g
          class="portfolio-logo-icon__stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          stroke-width="14"
        >
          <g class="portfolio-logo-icon__accent">
            <path class="portfolio-logo-icon__arrow" d="M 40 65 L 75 100 L 40 135" />
            <path class="portfolio-logo-icon__cursor" d="M 100 150 L 150 150" />
          </g>

          @if (variant() === 'full') {
            <g class="portfolio-logo-icon__letters">
              <path
                class="portfolio-logo-icon__letter portfolio-logo-icon__letter--d"
                d="M 190 50 L 230 50 A 50 50 0 0 1 230 150 L 190 150"
              />
              <path
                class="portfolio-logo-icon__letter portfolio-logo-icon__letter--e"
                d="M 320 50 L 380 50 M 320 100 L 370 100 M 320 150 L 380 150"
              />
              <path
                class="portfolio-logo-icon__letter portfolio-logo-icon__letter--v"
                d="M 420 50 L 460 150 L 500 50"
              />
              <circle
                class="portfolio-logo-icon__letter portfolio-logo-icon__letter--o"
                cx="585"
                cy="100"
                r="45"
              />
              <path
                class="portfolio-logo-icon__letter portfolio-logo-icon__letter--r"
                d="M 670 50 L 710 50 A 25 25 0 0 1 710 100 L 670 100 L 720 150"
              />
              <path
                class="portfolio-logo-icon__letter portfolio-logo-icon__letter--a"
                d="M 775 150 L 815 50 L 855 150"
              />
            </g>
          }
        </g>
      </svg>
      }
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        width: var(--portfolio-logo-icon-width);
        max-width: 100%;
        line-height: 0;
        color: var(--portfolio-logo-icon-text);
      }

      :host(.portfolio-logo-icon-host--mark) {
        aspect-ratio: 1 / 1;
      }

      .portfolio-logo-icon {
        display: inline-flex;
        width: 100%;
        max-width: 100%;
        align-items: center;
        justify-content: flex-start;
        filter: drop-shadow(
          0 0 8px color-mix(in srgb, var(--portfolio-logo-icon-accent) 28%, transparent)
        );
      }

      .portfolio-logo-icon__svg {
        display: block;
        width: 100%;
        height: auto;
        overflow: visible;
      }

      .portfolio-logo-icon--mark .portfolio-logo-icon__svg {
        height: 100%;
      }

      .portfolio-logo-icon__background {
        fill: var(--portfolio-logo-icon-background);
      }

      .portfolio-logo-icon__accent {
        stroke: var(--portfolio-logo-icon-accent);
      }

      .portfolio-logo-icon__letters {
        stroke: var(--portfolio-logo-icon-text);
      }

      .portfolio-logo-icon__arrow {
        transform-box: fill-box;
        transform-origin: center;
        animation: portfolio-logo-arrow-write 4s cubic-bezier(0.45, 0, 0.55, 1) forwards;
      }

      .portfolio-logo-icon__cursor {
        opacity: 0;
        transform-box: fill-box;
        transform-origin: left center;
        animation: portfolio-logo-cursor-typing 0.8s infinite ease-in-out 3.5s;
      }

      .portfolio-logo-icon__letter {
        opacity: 0;
        transform-box: fill-box;
        transform-origin: center;
        animation: portfolio-logo-letter-reveal 0.3s ease-out forwards;
      }

      .portfolio-logo-icon__letter--d { animation-delay: 0.6s; }
      .portfolio-logo-icon__letter--e { animation-delay: 1s; }
      .portfolio-logo-icon__letter--v { animation-delay: 1.4s; }
      .portfolio-logo-icon__letter--o { animation-delay: 1.8s; }
      .portfolio-logo-icon__letter--r { animation-delay: 2.2s; }
      .portfolio-logo-icon__letter--a { animation-delay: 2.6s; }

      .portfolio-logo-icon--mark .portfolio-logo-icon__arrow {
        animation-name: portfolio-logo-mark-arrow;
      }

      .portfolio-logo-icon--mark .portfolio-logo-icon__cursor {
        animation-delay: 1.1s;
      }

      .portfolio-logo-icon--loop {
        animation: portfolio-logo-soft-pulse 3.6s ease-in-out infinite 4s;
      }

      .portfolio-logo-icon--static,
      .portfolio-logo-icon--static .portfolio-logo-icon__arrow,
      .portfolio-logo-icon--static .portfolio-logo-icon__cursor,
      .portfolio-logo-icon--static .portfolio-logo-icon__letter {
        animation: none;
      }

      .portfolio-logo-icon--static .portfolio-logo-icon__cursor,
      .portfolio-logo-icon--static .portfolio-logo-icon__letter {
        opacity: 1;
        filter: none;
        transform: none;
      }

      @keyframes portfolio-logo-arrow-write {
        0%   { opacity: 0; transform: translateX(0); }
        5%   { opacity: 1; }
        65%  { transform: translateX(810px); }
        85%, 100% { opacity: 1; transform: translateX(0); }
      }

      @keyframes portfolio-logo-mark-arrow {
        0%   { opacity: 0; transform: translateX(-10px); }
        45%  { opacity: 1; transform: translateX(12px); }
        100% { opacity: 1; transform: translateX(0); }
      }

      @keyframes portfolio-logo-letter-reveal {
        0%   { opacity: 0; filter: blur(5px); transform: translateY(5px); }
        100% { opacity: 1; filter: blur(0); transform: translateY(0); }
      }

      @keyframes portfolio-logo-cursor-typing {
        0%, 100% {
          opacity: 1;
          filter: drop-shadow(0 0 12px color-mix(in srgb, var(--portfolio-logo-icon-accent) 90%, transparent));
          transform: translateX(0) scaleX(1);
        }
        50% {
          opacity: 0.5;
          filter: drop-shadow(0 0 4px color-mix(in srgb, var(--portfolio-logo-icon-accent) 40%, transparent));
          transform: translateX(6px) scaleX(0.7);
        }
      }

      @keyframes portfolio-logo-soft-pulse {
        0%, 100% {
          filter: drop-shadow(0 0 8px color-mix(in srgb, var(--portfolio-logo-icon-accent) 28%, transparent));
        }
        50% {
          filter: drop-shadow(0 0 16px color-mix(in srgb, var(--portfolio-logo-icon-accent) 46%, transparent));
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .portfolio-logo-icon,
        .portfolio-logo-icon__arrow,
        .portfolio-logo-icon__cursor,
        .portfolio-logo-icon__letter { animation: none; }

        .portfolio-logo-icon__cursor,
        .portfolio-logo-icon__letter { opacity: 1; filter: none; transform: none; }
      }
    `,
  ],
})
export class PortfolioLogoIconComponent implements OnInit, OnDestroy {
  readonly variant    = input<PortfolioLogoIconVariant>('full');
  readonly renderTrigger = signal(true);
  private intervalId?: any;

  ngOnInit(): void {
    if (this.animation() === 'loop') {
      this.intervalId = setInterval(() => {
        this.renderTrigger.set(false);
        setTimeout(() => {
          this.renderTrigger.set(true);
        }, 50);
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  readonly animation  = input<PortfolioLogoIconAnimation>('intro');
  readonly width      = input<string | null>(null);
  readonly accentColor     = input('#00d7ff');
  readonly textColor       = input('#f5f5f7');
  readonly backgroundColor = input('#060910');
  readonly showBackground  = input(false);
  readonly ariaLabel       = input('DEVORA portfolio logo');

  readonly resolvedWidth = computed(() => {
    const width = this.width();
    if (width) return width;
    return this.variant() === 'mark' ? '64px' : 'clamp(128px, 16vw, 220px)';
  });

  readonly viewBox = computed(() =>
    this.variant() === 'mark' ? '20 30 150 140' : '20 30 860 140',
  );

  readonly backgroundRect = computed<LogoBackgroundRect>(() =>
    this.variant() === 'mark'
      ? { x: 20, y: 30, width: 150, height: 140, rx: 24 }
      : { x: 20, y: 30, width: 860, height: 140, rx: 28 },
  );
}
