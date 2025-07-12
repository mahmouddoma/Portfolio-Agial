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
    this.http.get<{ country_name: string, country_code?: string, currency?: string }>('https://ipapi.co/json/').subscribe({
      next: (res: { country_name: string, country_code?: string, currency?: string }) => {
        this.userCountry = res.country_name;
        // Robust Saudi detection
        if (this.userCountry === 'Egypt') {
          this.currencyField = 'priceLE';
        } else if (
          this.userCountry === 'Saudi Arabia' ||
          res.country_code === 'SA' ||
          res.currency === 'SAR'
        ) {
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
      slidesPerView: 'auto',
      spaceBetween: 20,
      centeredSlides: true,
      observeParents: true,
      observer: true,
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
      breakpoints: {
        320: {
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 15
        },
        768: {
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 4,
          centeredSlides: false,
          spaceBetween: 20
        },
        1440: {
          slidesPerView: 6,
          centeredSlides: false,
          spaceBetween: 20
        }
      }
    });
  }
}
