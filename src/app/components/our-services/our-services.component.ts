import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentFacade } from '../../core/content/site-content.facade';
import { EditableContentDirective } from '../../core/live-edit/editable-content.directive';
import { LanguageService } from '../../services/language.service';

type GsapApi = typeof import('gsap').gsap;
type GsapContext = ReturnType<GsapApi['context']>;
type ScrollTriggerPlugin = typeof import('gsap/ScrollTrigger').ScrollTrigger;

interface CourseStat {
  label: string;
  value: string;
  labelPath: string;
  valuePath: string;
}

interface Course {
  id: number;
  index: number;
  title: string;
  category: string;
  summary: string;
  image: string;
  duration: string;
  sessions: number;
  level: string;
  instructors: readonly string[];
  stats: readonly CourseStat[];
  tags: readonly string[];
}

@Component({
  selector: 'app-our-services',
  standalone: true,
  imports: [CommonModule, EditableContentDirective],
  templateUrl: './our-services.component.html',
  styleUrl: './our-services.component.css',
})
export class OurServicesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('servicesSection') private servicesSection?: ElementRef<HTMLElement>;

  private readonly language = inject(LanguageService);
  private readonly siteContent = inject(SiteContentFacade);
  private gsap?: GsapApi;
  private context?: GsapContext;
  private destroyed = false;
  private reducedMotion = false;

  readonly content = computed(() => this.siteContent.content().services);

  readonly section = computed(() => ({
    kicker: this.language.text(this.content().section.kicker),
    title: this.language.text(this.content().section.title),
    description: this.language.text(this.content().section.description),
    levelLabel: this.language.text(this.content().levelLabel),
    sessionUnit: this.language.text(this.content().sessionUnit),
  }));

  readonly courses = computed<readonly Course[]>(() =>
    this.content().courses.map((course: any, index: number) => ({
      id: course.id,
      index,
      title: this.language.text(course.title),
      category: this.language.text(course.category),
      summary: this.language.text(course.summary),
      image: course.image,
      duration: this.language.text(course.duration),
      sessions: course.sessions,
      level: this.language.text(course.level),
      instructors: course.instructors.map((instructor: any) => this.language.text(instructor)),
      stats: course.stats.map((stat: any, statIndex: number) => ({
        label: this.language.text(stat.label),
        value: this.language.text(stat.value),
        labelPath: `services.courses.${index}.stats.${statIndex}.label`,
        valuePath: `services.courses.${index}.stats.${statIndex}.value`,
      })),
      tags: course.tags.map((tag: any) => this.language.text(tag)),
    })),
  );

  readonly featuredCourse = computed(() => this.courses()[0]);

  async ngAfterViewInit(): Promise<void> {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    if (this.destroyed) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.gsap = gsap;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.createEntranceAnimation(ScrollTrigger);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.context?.revert();
  }

  trackByCourseId(_: number, course: Course): number {
    return course.id;
  }

  private createEntranceAnimation(ScrollTrigger: ScrollTriggerPlugin): void {
    const section = this.servicesSection?.nativeElement;
    const gsap = this.gsap;
    if (!section || !gsap || this.reducedMotion) {
      return;
    }

    this.context = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            once: true,
          },
        })
        .from(section.querySelectorAll('.course-gsap-title'), {
          y: 44,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
        })
        .from(
          section.querySelector('.featured-course'),
          {
            y: 56,
            opacity: 0,
            scale: 0.97,
            duration: 0.75,
          },
          '-=0.34'
        )
        .from(
          section.querySelectorAll('.course-card'),
          {
            y: 56,
            opacity: 0,
            duration: 0.72,
            stagger: 0.08,
          },
          '-=0.36'
        );

      ScrollTrigger.refresh();
    }, section);
  }
}
