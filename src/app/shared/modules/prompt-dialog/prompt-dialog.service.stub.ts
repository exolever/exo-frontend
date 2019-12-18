
import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class PromptDialogServiceStub {

  public open(config): Observable<any> {
    return observableOf(true);
  }
}
