import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import Swiper from 'swiper';
import { Pagination, Navigation, Autoplay, Keyboard } from 'swiper/modules';

interface SlideItem {
  title: string;
  subtitle: string;
  image: string;
  cssClass: string;
}

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SliderComponent implements AfterViewInit, OnDestroy {
  private swiper: Swiper | null = null;

  @HostListener('keydown.arrowLeft', ['$event'])
  @HostListener('keydown.arrowRight', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.swiper) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.swiper.slidePrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.swiper.slideNext();
    }
  }

  slides: SlideItem[] = [
    {
      title: 'رحلة النجاح في حفظ القرآن',
      subtitle: 'طلابنا يتفوقون في حفظ كتاب الله',
      image: 'https://img.freepik.com/free-photo/muslims-reading-from-quran_53876-20958.jpg',
      cssClass: 'swiper-slide--one',
    },
    {
      title: 'تعليم القرآن للفتيات',
      subtitle: 'برامج متخصصة لتحفيظ القرآن',
      image: 'https://img.freepik.com/free-vector/muslim-girls-education-illustration_52683-130674.jpg',
      cssClass: 'swiper-slide--two',
    },
    {
      title: 'التجويد والتلاوة',
      subtitle: 'تعلم أحكام التجويد مع أفضل المعلمين',
      image: 'https://img.freepik.com/premium-photo/young-man-reading-quran-after-doing-salat_175634-15484.jpg',
      cssClass: 'swiper-slide--three',
    },
    {
      title: 'دورات التفسير',
      subtitle: 'فهم معاني القرآن الكريم',
      image: 'https://img.freepik.com/free-psd/islamic-new-year-celebration-template_23-2151559173.jpg',
      cssClass: 'swiper-slide--four',
    },
  ];

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  private initializeSwiper(): void {
    this.swiper = new Swiper('.swiper', {
      modules: [Pagination, Navigation, Autoplay, Keyboard],
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      centeredSlides: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }
}
