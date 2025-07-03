import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import Swiper from 'swiper';
import { Pagination as PaginationModule } from 'swiper/modules';
import { Navigation as NavigationModule } from 'swiper/modules';
import { Autoplay as AutoplayModule } from 'swiper/modules';
Swiper.use([PaginationModule, NavigationModule]);

@Component({
  selector: 'app-slider',
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SliderComponent implements AfterViewInit {
  slides = [
    {
      title: 'Enjoy the exotic of sunny Hawaii',
      subtitle: 'Maui, Hawaii',
      image:
        'https://img.freepik.com/free-photo/muslims-reading-from-quran_53876-20958.jpg?t=st=1737227994~exp=1737231594~hmac=959e59d09450e9630d87f483edcdb7b4b8c221ace05029f0d758375615ad3a2d&w=740',
      cssClass: 'swiper-slide--one',
    },
    {
      title: 'Enjoy the exotic of sunny Hawaii',
      subtitle: 'Maui, Hawaii',
      image:
        'https://img.freepik.com/free-vector/muslim-girls-education-illustration_52683-130674.jpg?t=st=1737228020~exp=1737231620~hmac=6f9aa7906b3fbc3c711a726eb1fe2c8ceff2cf5419629f538a1fd7b428123f24&w=740',
      cssClass: 'swiper-slide--two',
    },
    {
      title: 'Enjoy the exotic of sunny Hawaii',
      subtitle: 'Maui, Hawaii',
      image:
        'https://img.freepik.com/premium-photo/young-man-reading-quran-after-doing-salat_175634-15484.jpg?w=740',
      cssClass: 'swiper-slide--three',
    },
    {
      title: 'Enjoy the exotic of sunny Hawaii',
      subtitle: 'Maui, Hawaii',
      image:
        'https://img.freepik.com/free-psd/islamic-new-year-celebration-template_23-2151559173.jpg?t=st=1737228066~exp=1737231666~hmac=e6204ee545af2cdb8c6a9453002e12119ab6b31df50ec46caf6decbf5caf6848&w=740',
      cssClass: 'swiper-slide--four',
    },
  ];

  ngAfterViewInit(): void {
    new Swiper('.swiper', {
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      grabCursor: true,
    });
  }
}
