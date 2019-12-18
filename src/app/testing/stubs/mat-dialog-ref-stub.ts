import { MatDialogRef } from '@angular/material';

class MatDialogRefStub {
  close: () => {};
}

export const matDialogRefStubProvider = {
  provide: MatDialogRef, useClass: MatDialogRefStub
};
