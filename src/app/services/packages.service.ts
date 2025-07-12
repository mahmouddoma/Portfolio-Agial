import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  private apiUrl = 'https://ajyalalquran.somee.com/api/Subscribe';

  constructor(private http: HttpClient) {}

  getPackages(currency: 'priceLE' | 'priceReyal' | 'priceDollar' = 'priceDollar'): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((packages) =>
        packages.map((pkg: any) => ({
          name: pkg.name,
          totalMinutes: pkg.totalMinutes,
          price: pkg[currency],
          currency: currency === 'priceLE' ? 'LE' : currency === 'priceReyal' ? 'SAR' : 'USD',
          subscriberCount: pkg.subscriberCount,
          subscribeType: pkg.subscribeType.name,
        }))
      )
    );
  }
  

}
