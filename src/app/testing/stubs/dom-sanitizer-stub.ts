import { DomSanitizer } from '@angular/platform-browser';

class DomSanitizerStub {
  bypassSecurityTrustResourceUrl(...params) {
    return null;
  }

  sanitize() {
    return null;
  }
}

export const DomSanitizerStubProvider = {
  provide: DomSanitizer, useClass: DomSanitizerStub
};
