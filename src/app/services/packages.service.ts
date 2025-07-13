import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable , of} from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  private apiUrl = 'https://ajyalalquran.somee.com/api/Subscribe';

  constructor(private http: HttpClient) {}

  getPackages(currency: 'priceLE' | 'priceReyal' | 'priceDollar' = 'priceDollar'): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((packages) => {
        const hasValid = packages.some(pkg => pkg[currency] && pkg[currency] > 0);
        let usedCurrency = currency;

        if (!hasValid) {
          if (currency !== 'priceDollar' && packages.some(pkg => pkg['priceDollar'] && pkg['priceDollar'] > 0)) {
            usedCurrency = 'priceDollar';
          } else if (currency !== 'priceLE' && packages.some(pkg => pkg['priceLE'] && pkg['priceLE'] > 0)) {
            usedCurrency = 'priceLE';
          }
        }
        
        return packages.map((pkg: any) => ({
          name: pkg.name,
          totalMinutes: pkg.totalMinutes,
          price: pkg[usedCurrency],
          currency: usedCurrency === 'priceLE' ? 'LE' : usedCurrency === 'priceReyal' ? 'SAR' : 'USD',
          subscriberCount: pkg.subscriberCount,
          subscribeType: pkg.subscribeType.name,
        }));
      })
    );
  }
}
