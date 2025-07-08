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
      image: 'https://i.pinimg.com/736x/64/84/ef/6484eff71c4f79e50c9354d4f727c1f5.jpg',
      cssClass: 'swiper-slide--one',
    },
    {
      title: 'تعليم القرآن للفتيات',
      subtitle: 'برامج متخصصة لتحفيظ القرآن',
      image: 'https://i.pinimg.com/736x/01/9d/96/019d968fe8f67088ba03fe1bb57d418c.jpg',
      cssClass: 'swiper-slide--two',
    },
    {
      title: 'التجويد والتلاوة',
      subtitle: 'تعلم أحكام التجويد مع أفضل المعلمين',
      image: 'https://i.pinimg.com/736x/dd/10/27/dd102763a8e104f7d58a3a70017c9cee.jpg',
      cssClass: 'swiper-slide--three',
    },
    {
      title: 'دورات التفسير',
      subtitle: 'فهم معاني القرآن الكريم',
      image: 'https://i.pinimg.com/736x/1c/1f/03/1c1f03f78f4b053d1c541d0e61c197b4.jpg',
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
