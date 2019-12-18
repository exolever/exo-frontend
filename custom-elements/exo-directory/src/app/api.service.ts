import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  PeopleInterface,
  CertificateEnum,
  UserPictureInterface,
  SearchTermInterface,
  ResultInterface,
} from './enumInterface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  private domain: string;

  private static parseCertifications(certificatesList): CertificateEnum[] {
    return certificatesList.map(c => ({name: c.name, code: c.code}));
  }

  private static parsePictures(picturesList): UserPictureInterface {
    const pictures = picturesList.
    filter(p => p.width === 96).
    map(p => ({width: p.width, height: p.height, url: p.url}));
    return pictures.length === 1 ? pictures[0] : {};
  }

  private static parseUserTitle(certificatesList): string {
    let userTitle: string;
    if (certificatesList.length > 4) {
      userTitle = `${certificatesList.slice(0, 4).map(c => c.name).join(', ')}, <b>${certificatesList.length - 4}+</b>`;
    } else {
      userTitle = certificatesList.map(c => c.name).join(', ');
    }
    return userTitle;
  }

  private static parseLanguages(languagesList): string {
    return languagesList.map(l => l.name).join(', ');
  }

  setDomain(domain: string) {
    this.domain = domain;
  }

  getPeople(searchTerm: SearchTermInterface): Observable<ResultInterface> {
    const apiUrl = `${this.domain}/api/ecosystem-public/members/`;
    let params = new HttpParams();
    if (searchTerm) {
      Object.keys(searchTerm).map(key => params = params.set(key, searchTerm[key]));
    }
    return this.http.get(apiUrl, { params: params }).pipe(map((res: {
        count: number;
        next: string;
        previous: string;
        results: any[];
      }) => ({ count: res.count, results: this.parsePeople(res.results)})
    ));
  }

  private parsePeople(res): PeopleInterface[] {
    return res.map((person: PeopleInterface) => {
      const certificates = ApiService.parseCertifications(person.certifications);
      return {
        fullName: person.fullName,
        location: person.location,
        slug: person.slug,
        certifications: certificates,
        userTitle: ApiService.parseUserTitle(certificates),
        profilePictures: ApiService.parsePictures(person.profilePictures),
        languages: ApiService.parseLanguages(person.languages)
      };
    });
  }
}
