import { LocalStorageService } from '@app/core';

export class LocalStorageServiceStub {
  getToken(): string { return ''; }
  setToken(): void { }
  clean(): void { }
  setItem() { }
  getItem() {}
}

export const LocalStorageServiceStubProvider = {
  provide: LocalStorageService,
  useClass: LocalStorageServiceStub
};
