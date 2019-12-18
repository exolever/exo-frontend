import { Injectable } from '@angular/core';

const SchemaAuthenticationJWT = 'Bearer';

@Injectable()
export class LocalStorageService {

  constructor() {}

  getToken(withSchema = true): string {
    if (withSchema) {
      return SchemaAuthenticationJWT + localStorage.getItem('token');
    }
    return localStorage.getItem('token');
  }

  setToken(token): void {
    localStorage.setItem('token', token);
  }
  clean(): void {
    localStorage.removeItem('token');
  }
  setItem(key, data): void {
    localStorage.setItem(key, data);
  }
  getItem(key): string {
    return localStorage.getItem(key);
  }
  isAuthorized(): boolean {
    return this.getToken(false) != null;
  }
}
