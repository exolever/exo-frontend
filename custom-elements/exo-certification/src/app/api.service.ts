import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CountryInterface, CohortInterface, Contact } from './enumInterface';

const getAndDeleteCookie = (name: string) => {
  const cookiesArray = document.cookie.split(';');
  const cookie = cookiesArray.find(obj => obj.trim().startsWith(name));
  if (cookie) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    return cookie.split('=')[1];
  }
};

@Injectable()
export class ApiService {
  private domain: string;

  constructor(private http: HttpClient) {}

  getCountries(countryName?: string): Observable<CountryInterface[]> {
    const apiUrl = `${this.domain}api/core/country/`;
    let params = new HttpParams();
    if (countryName) {
      params = params.set('search', countryName);
    }
    return this.http.get(apiUrl, {params: params}).pipe(map(res => this.parseCountry(res)));
  }

  getCohort(level: string, coupon: string, language: string): Observable<CohortInterface[]> {
    const apiUrl = `${this.domain}api/exo-certification/cohort/`;
    let params = new HttpParams();
    params = params.set('level', level);
    params = params.set('coupon', coupon);
    return this.http.get(apiUrl, {params: params}).pipe(map(res => this.parseCohort(res, language)));
  }

  getContractingData(data: any): Observable<any> {
    const apiUrl = `${this.domain}api/exo-certification/application/auth/`;
    return this.http.post(apiUrl, data);
  }

  goToPay(data: Contact): Observable<any> {
    const apiUrl = `${this.domain}api/exo-certification/application/${data.pk}/`;
    return this.http.put(apiUrl, data);
  }

  saveDraft(data: Contact): Observable<Contact> {
    const cookieRhValue = getAndDeleteCookie('rh');
    const cookieCampaignIdValue = getAndDeleteCookie('campaignId');

    if (cookieRhValue && cookieCampaignIdValue) {
      data['referrer'] = `${cookieRhValue}:${cookieCampaignIdValue}`;
    }

    const apiUrl = `${this.domain}api/exo-certification/application/`;
    return this.http.post<Contact>(apiUrl, data);
  }

  private parseCountry(res): CountryInterface[] {
    return res.map((c: { name: string, code2: string }) => <CountryInterface>{name: c.name, code: c.code2});
  }

  private parseCohort(res, language: string): CohortInterface[] {

    const nameOfMonthEN = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const nameOfMonthES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const nameOfMonth = language === 'es' ? nameOfMonthES : nameOfMonthEN;

    return res.map(c => {
      const date = new Date(c.date);
      let label =  `${c.title} - ${date.getDate()} ${nameOfMonth[date.getMonth()]} ${date.getFullYear()}`;

      label = label.concat(` - ${c.finalPrice} ${c.currency}`);

      return {
        pk: c.pk,
        label: label,
        programLabel: label,
        coupon: c.referralCode,
        discount: c.discount,
        price: c.price,
        finalPrice: c.finalPrice,
        currency: c.currency
      };
    });
  }

  setDomain(domain: string) {
    this.domain = domain;
  }
}
