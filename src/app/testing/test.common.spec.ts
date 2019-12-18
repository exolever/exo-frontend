import { TestBed, TestModuleMetadata } from '@angular/core/testing';
// PR: https://github.com/angular/angular/pull/17710
// Solution meanwhile..  // https://github.com/angular/angular/issues/12409#issuecomment-322832870

const resetTestingModule =
    TestBed.resetTestingModule,
    preventAngularFromResetting = () => TestBed.resetTestingModule = () => TestBed;

export const allowAngularToReset = (moduleDef?: TestModuleMetadata) => {
  if (moduleDef) {
    beforeEach(() => {
      TestBed.configureTestingModule(moduleDef);
    });
  } else {
    TestBed.resetTestingModule = resetTestingModule;
  }
};

export const configTestBed = (moduleDef: TestModuleMetadata, isComponent: boolean = true) => {
  beforeAll(done => (async () => {
    resetTestingModule();
    preventAngularFromResetting();
    TestBed.configureTestingModule(moduleDef);
    if (isComponent) {
      await TestBed.compileComponents();
    }

    // prevent Angular from resetting testing module
    TestBed.resetTestingModule = () => TestBed;
  })().then(done).catch(done.fail));

  afterAll(() => allowAngularToReset());
};
