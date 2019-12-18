import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { TranslateService } from '@ngx-translate/core';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';

import { SectionsExqPipe } from './sections-exq.pipe';
import { SectionExqEnum } from './exq.enum';

describe('HumanizeFormErrorsPipe', () => {
  let pipe: SectionsExqPipe;
  let translateService: TranslateService;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule
    ],
    providers: [
      { provide: TranslateService, useClass: TranslateService }
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    translateService = TestBed.get(TranslateService);
    pipe = new SectionsExqPipe(translateService);
  });

  it('should transform the key of section into his translation', () => {
    const sectionTranslated = `${translateService.instant('ECOSYSTEM.EXQ.SECTION.ALGORITHMS_DATA')}`;
    expect(pipe.transform(SectionExqEnum.ALGORITHMS_DATA)).toEqual(sectionTranslated);
    const sectionTranslated2 = `${translateService.instant('ECOSYSTEM.EXQ.SECTION.MTP')}`;
    expect(pipe.transform(SectionExqEnum.MTP)).toEqual(sectionTranslated2);
  });

});
