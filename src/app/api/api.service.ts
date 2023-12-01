import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../model/counry.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private apiUrl = 'http://api.worldbank.org/v2/country/';

  constructor(private http: HttpClient) {}

  getCountryInfo(isoCode: string): Observable<Country> {
    const url = `${this.apiUrl}${isoCode}?format=json`;
  
    return this.http.get(url).pipe(
      map((data: any) => {
        if (data[1] && data[1].length > 0) {
          const countryInfo = data[1][0];
  
          const country: Country = {
            name: countryInfo.name,
            capital: countryInfo.capitalCity,
            region: countryInfo.region?.value || 'N/A',
            incomeLevel: countryInfo.incomeLevel?.value || 'N/A',
            longitude: countryInfo.longitude || 'N/A',
            latitude: countryInfo.latitude || 'N/A',
          };
  
          return country;
        } else {
          throw new Error('Country information not found in the API response.');
        }
      })
    );
  }
  
  
}
