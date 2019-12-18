import { of as observableOf,  Observable } from 'rxjs';


class MatSnackBarRefStub {
  onAction(): Observable<void> {
    return observableOf();
  }
}
export class MatSnackBarStub {
  open( msg: string, options: any ): Observable<any> {
    return observableOf(new MatSnackBarRefStub());
  }
}
