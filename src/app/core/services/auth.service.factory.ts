import { LocalStorageService } from './localStorage.service';

export function jwtOptionsFactory(localStorage: LocalStorageService) {
  return {
    tokenGetter: () => {
      return localStorage.getToken(false);
    },
    whitelistedDomains: [
      'localhost:4200', 'localhost:8000', 'localhost:8001',
      '127.0.0.1:4200', '127.0.0.1:8000', '127.0.0.1:8001'
    ]
  };
}
