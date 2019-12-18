import { inject, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { EffectRunner, EffectsTestingModule } from '@testing/modules/effects-testing.module';
import { configTestBed } from '@testing/test.common.spec';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

import * as stepsActions from '../action/steps.action';
import * as fromProjects from '../reducer/index';
import { INITIAL_VALUES } from '../reducer/projects.reducer';
import { StepsEffect } from './steps.effect';
import { ProjectsState } from '../reducer/index';
import { StepService } from '../../services/step.service';
import { FakeStepFactory } from '../../models/step-fake.model';


describe('StepsEffect', () => {
  let runnerEffect: EffectRunner;
  let stepsEffect: StepsEffect;
  let stepService: StepService;
  const fakeStep = new FakeStepFactory();

  const moduleDef: TestModuleMetadata = {
    imports: [
      EffectsTestingModule,
      TranslateStubModule,
      MatSnackBarModule,
      NoopAnimationsModule,
      RouterTestingModule,
      StoreModule.forRoot({}),
      StoreModule.forFeature('workspaceProjects',
        fromProjects.reducers,
        {
          initialState: <ProjectsState>{ projects: INITIAL_VALUES }
        }
      )
    ],
    providers: [
      TranslateService,
      { provide: StepService, useValue: {
          getSteps() {},
          editStep() {}
        }
      },
      StepsEffect,
      URL_SERVICE_STUB_PROVIDER
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(inject([EffectRunner, StepsEffect], (runner: EffectRunner, effect: StepsEffect) => {
    stepService = TestBed.get(StepService);
    runnerEffect = runner;
    stepsEffect = effect;
  }));

  it('Should return a LOAD_SUCCESS after OK execute a LOAD', () => {
    const spy = spyOn(stepService, 'getSteps').and.returnValue(observableOf([fakeStep]));

    stepsEffect.loadingSteps$.subscribe((result: any) => {
      expect(spy).toHaveBeenCalled();
      expect(result.type).toEqual(stepsActions.LoadSuccess);
    });

    runnerEffect.queue({
      type: stepsActions.Load
    });
  });

  it('Should return a EDIT_SUCCESS after OK execute a EDIT', () => {
    spyOn(stepService, 'editStep').and.returnValue(observableOf(fakeStep));

    stepsEffect.editingStep$.subscribe((result: any) => {
      expect(stepService.editStep).toHaveBeenCalled();
      expect(result.type).toEqual(stepsActions.EditSuccess);
    });

    runnerEffect.queue({
      type: stepsActions.Edit,
      payload: fakeStep
    });
  });

});

