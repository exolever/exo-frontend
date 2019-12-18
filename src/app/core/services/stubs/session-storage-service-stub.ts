import { SessionStorageService } from '@core/services/sessionStorage.service';

export class SessionStorageServiceStub {
  clear(): void {
  }

  setItem() {
  }

  getItem() {
  }

  removeItem() {
  }
}

export const SessionStorageServiceStubProvider = {
  provide: SessionStorageService,
  useClass: SessionStorageServiceStub
};
