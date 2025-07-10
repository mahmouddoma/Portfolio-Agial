import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { PackagesService } from '../../services/packages.service';
import { HttpClient } from '@angular/common/http';

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
  userCountry: string = '';
  currencyField: 'priceLE' | 'priceReyal' | 'priceDollar' = 'priceDollar';

  constructor(
    private PackagesService: PackagesService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient 
  ) {}

  ngOnInit(): void {
    this.getUserCountry();
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  getUserCountry(): void {
    this.http.get<{ country_name: string }>('https://ipapi.co/json/').subscribe({
      next: (res: { country_name: string }) => {
        this.userCountry = res.country_name;
        if (this.userCountry === 'Egypt') {
          this.currencyField = 'priceLE';
        } else if (this.userCountry === 'Saudi Arabia') {
          this.currencyField = 'priceReyal';
        } else {
          this.currencyField = 'priceDollar';
        }
        this.loadPackages();
      },
      error: (err: any) => {
        console.warn('Failed to get location, defaulting to dollar', err);
        this.currencyField = 'priceDollar';
        this.loadPackages();
      },
    });
  }

  loadPackages(): void {
    this.PackagesService.getPackages().subscribe({
      next: (data) => {
        this.packages = data.map((pkg: any) => ({
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
        320: { slidesPerView: 1, centeredSlides: true },
        768: { slidesPerView: 2, centeredSlides: true },
        1024: { slidesPerView: 3, centeredSlides: false },
        1440: { slidesPerView: 4, centeredSlides: false },
      },
    });
  }
}
