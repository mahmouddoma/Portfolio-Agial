import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

interface TestimonialSlide {
  image: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit, AfterViewInit {
  slides: TestimonialSlide[] = [
    {
      image: 'https://i.pinimg.com/736x/f2/fa/a4/f2faa44cc72d5d11d59f031962f3c7bc.jpg',
      title: 'أحمد محمد',
      subtitle: 'الحمد لله، أتممت حفظ القرآن الكريم كاملاً في عامين من الدراسة المنتظمة',
    },
    {
      image: 'https://i.pinimg.com/736x/cf/db/2f/cfdb2ffc2643584278cc7d91a67dc908.jpg',
      title: 'عبد الرحمن خالد',
      subtitle: 'تعلمت القراءة الصحيحة وأحكام التجويد بطريقة سهلة وميسرة',
    },
    {
      image: 'https://i.pinimg.com/736x/4d/1a/19/4d1a19621a8a37cedab32b234fafb26a.jpg',
      title: 'محمد عبد الله',
      subtitle: 'أشكر معلمي على صبره وحسن تعليمه، وأنصح كل من يريد تعلم القرآن بهذا المعهد',
    },
  ];

  private swiper: Swiper | undefined;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper(): void {
    this.swiper = new Swiper('.swiper', {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      navigation: {
        nextEl: '.next-button',
        prevEl: '.prev-button',
      },
      breakpoints: {
        768: {
          slidesPerView: 1,
        },
      },
    });
  }
}
