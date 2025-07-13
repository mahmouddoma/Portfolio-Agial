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
  currencyField: 'priceLE' | 'priceReyal' | 'priceDollar' = 'priceDollar';

  constructor(
    private packagesService: PackagesService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.detectUserCurrencyAndLoadPackages();
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  detectUserCurrencyAndLoadPackages(): void {
    this.http.get<{ country_name: string, country_code?: string, currency?: string }>('https://ipapi.co/json/').subscribe({
      next: (res) => {
        const country = res.country_name;
        const code = res.country_code;
        const currency = res.currency;

        if (country === 'Egypt' || code === 'EG' || currency === 'EGP') {
          this.currencyField = 'priceLE';
        } 
        //  else if (
        //   country === 'Saudi Arabia' ||
        //   country === 'KSA' ||
        //   country.includes('Saudi') ||
        //   code === 'SA' ||
        //   currency === 'SAR'
        // )
        // {
        //   this.currencyField = 'priceReyal';
        
        // } 
        else {
          this.currencyField = 'priceDollar';
        }

        this.loadPackages();
      },
      error: () => {
        console.warn('Fallback to dollar');
        this.currencyField = 'priceDollar';
        this.loadPackages();
      }
    });
  }

  loadPackages(): void {
    this.packagesService.getPackages(this.currencyField).subscribe({
      next: (data) => {
        this.packages = data;
        this.error = null;
        this.cdr.detectChanges();
        this.initializeSwiper();
      },
      error: (err: any) => {
        this.error = 'فشل في تحميل الباقات. حاول لاحقًا.';
        console.error(err);
      }
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
        320: { slidesPerView: 'auto', centeredSlides: true, spaceBetween: 15 },
        768: { slidesPerView: 'auto', centeredSlides: true, spaceBetween: 20 },
        1024: { slidesPerView: 4, centeredSlides: false, spaceBetween: 20 },
        1440: { slidesPerView: 6, centeredSlides: false, spaceBetween: 20 }
      }
    });
  }
}