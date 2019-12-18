import { MatIconRegistry } from '@angular/material';

import { EMPTY } from 'rxjs';

class MatIconRegistryStub {
  addSvgIcon(...params) {
    return null;
  }
  getNamedSvgIcon(...params) {
    return { pipe: () => EMPTY };
  }
}

export const MatIconRegistryStubProvider = {
  provide: MatIconRegistry, useClass: MatIconRegistryStub
};
