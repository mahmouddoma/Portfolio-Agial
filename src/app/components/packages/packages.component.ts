import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { PackagesService } from '../../services/packages.service';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
Swiper.use([Navigation, Pagination]);

@Component({
  selector: 'app-packages',
  imports: [CommonModule],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css',
})
export class PackagesComponent implements OnInit, AfterViewInit {
  packages: any[] = [];
  error: string | null = null;
  swiper: Swiper | null = null;

  constructor(
    // services for call API
    private PackagesService: PackagesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  loadPackages(): void {
    this.PackagesService.getPackages().subscribe({
      next: (data) => {
        this.packages = data.map((pkg) => ({
          name: pkg.name,
          totalMinutes: pkg.totalMinutes,
          priceLE: pkg.priceLE,
          priceDollar: pkg.priceDollar,
          priceReyal: pkg.priceReyal,
          subscriberCount: pkg.subscriberCount,
          subscribeType: pkg.subscribeType.name,
        }));
        this.cdr.detectChanges();
        this.initializeSwiper();
      },
      error: (err) => {
        this.error = 'Failed to load packages. Please try again later.';
        console.error(err);
      },
    });
  }

  initializeSwiper(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }

    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 2,
      spaceBetween: 20,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      loop: false,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      centeredSlides: true,
      breakpoints: {
        320: { slidesPerView: 2, centeredSlides: true },
        768: { slidesPerView: 3, centeredSlides: true },
        1024: { slidesPerView: 4, centeredSlides: false },
        1440: { slidesPerView: 6, centeredSlides: false },
      },
    });
  }
}
