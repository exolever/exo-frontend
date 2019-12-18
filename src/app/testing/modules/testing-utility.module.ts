import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserTestingModule } from '@angular/platform-browser/testing';

import { LoaderModule } from '../../applications/loaders/loader.module';
import { SharedModule } from '../../shared/shared.module';
import { TranslateStubModule } from './translate-stub.module';

/**
 * module def template
 const moduleDef: TestModuleMetadata = {
    imports: [
      TestingUtilityModule
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };
 configTestBed(moduleDef);
 */

/** basic imports for testing purposes */
@NgModule({
  imports: [
    SharedModule,
    LoaderModule,
    BrowserTestingModule,
    RouterTestingModule,
    HttpClientTestingModule,
    NoopAnimationsModule,
    TranslateStubModule
  ],
  exports: [
    SharedModule,
    BrowserTestingModule,
    RouterTestingModule,
    HttpClientTestingModule,
    NoopAnimationsModule,
    TranslateStubModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ]
})
export class TestingUtilityModule {}
