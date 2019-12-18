import { of as observableOf,  Observable } from 'rxjs';


export class AuthServiceStub {
  post(): Observable<any> {
    return observableOf(true);
  }
  put(): Observable<any> {
    return observableOf(true);
  }
  get(): Observable<any> {
    return observableOf(true);
  }
  delete(): Observable<any> {
    return observableOf(true);
  }
}
