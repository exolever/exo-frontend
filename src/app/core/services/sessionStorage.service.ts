import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  clear(): void {
    sessionStorage.clear();
  }

  removeItem(key): void {
    sessionStorage.removeItem(key);
  }

  setItem(key, data): void {
    sessionStorage.setItem(key, data);
  }

  getItem(key): string {
    return sessionStorage.getItem(key);
  }
}
