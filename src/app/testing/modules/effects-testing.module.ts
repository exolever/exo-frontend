import { Injectable, NgModule } from '@angular/core';

import { Actions } from '@ngrx/effects';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class EffectRunner extends ReplaySubject<any> {
  constructor() {
    super();
  }

  queue(action: any) {
    this.next(action);
  }
}

function createAction(runner: EffectRunner) {
  return new Actions(runner);
}

@NgModule({
  providers: [
    EffectRunner,
    { provide: Actions, deps: [ EffectRunner ], useFactory: createAction }
  ]
})
export class EffectsTestingModule {}
