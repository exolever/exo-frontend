import { Observable, of } from 'rxjs';

export class SocketServiceStub {

  messages$: Observable<any> = of();

  connect(): void { }
  on(): void { }
  emit(): void { }
  auth(): void { }
}
