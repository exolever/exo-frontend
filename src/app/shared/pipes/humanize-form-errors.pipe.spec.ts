import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { TranslateService } from '@ngx-translate/core';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';

import { HumanizeFormErrorsPipe } from './humanize-form-errors.pipe';

describe('HumanizeFormErrorsPipe', () => {
  let pipe: HumanizeFormErrorsPipe;
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
    // TranslateService from the root injector
    translateService = TestBed.get(TranslateService);
    pipe = new HumanizeFormErrorsPipe(translateService);
  });

  it('should transform maxLength errors', () => {
    const errorFromForm = [];
    const maxLength = 50;
    errorFromForm['maxlength'] = { requiredLength: maxLength };
    const errorToHuman = [`${translateService.instant('VALIDATORS_ERRORS.MAX_LENGTH', {'length': maxLength})}`];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transform minLength errors', () => {
    const errorFromForm = [];
    const minLength = 50;
    errorFromForm['minlength'] = { requiredLength: minLength };
    const errorToHuman = [`${translateService.instant('VALIDATORS_ERRORS.MIN_LENGTH', {'length': minLength})}`];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transform pattern errors', () => {
    const errorFromForm = [];
    const pattern = '%@%';
    errorFromForm['pattern'] = { pattern: '%@%' };
    const errorToHuman = [`${translateService.instant('VALIDATORS_ERRORS.PATTERN', {'pattern': pattern})}`];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transform nullValidator errors', () => {
    const errorFromForm = [];
    errorFromForm['nullvalidator'] = {};
    const errorToHuman = [translateService.instant('VALIDATORS_ERRORS.NULL')];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transform required errors', () => {
    const errorFromForm = [];
    errorFromForm['required'] = {};
    const errorToHuman = [translateService.instant('VALIDATORS_ERRORS.REQUIRED')];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transform max_length errors', () => {
    const errorFromForm = [];
    const maxLength = 50;
    errorFromForm['required'] = {};
    errorFromForm['maxlength'] = { requiredLength: maxLength };
    const errorToHuman = [
      translateService.instant('VALIDATORS_ERRORS.REQUIRED'),
      `${translateService.instant('VALIDATORS_ERRORS.MAX_LENGTH', {'length': maxLength})}`
    ];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transform custom errors', () => {
    const errorFromForm = [];
    const customError = 'My custom error';
    errorFromForm['custom'] = customError;
    const errorToHuman = [customError];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transform requiredEnter errors', () => {
    const errorFromForm = [];
    const keywords = 'keywords';
    errorFromForm['requiredEnter'] = keywords;
    const errorToHuman = [`${translateService.instant('VALIDATORS_ERRORS.REQUIRED_ENTER')} ${keywords}`];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transforms email errors', () => {
    const errorFromForm = [];
    errorFromForm['email'] = {};
    const errorToHuman = [translateService.instant('VALIDATORS_ERRORS.EMAIL')];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transform min date error', () => {
    const errorFromForm = [];
    const minDate = new Date('2018-10-11');
    const formattedMinDate = `${minDate.getDate() - 1}/${minDate.getMonth() + 1}/${minDate.getFullYear()}`;
    errorFromForm['md2DatepickerMin'] = { min: minDate };
    const errorToHuman = [`${translateService.instant('VALIDATORS_ERRORS.MIN_DATE')} ${formattedMinDate}`];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transform a duplicated url error', () => {
    const errorFromForm = [];
    errorFromForm['duplicated'] = true;
    const errorToHuman = [`${translateService.instant('VALIDATORS_ERRORS.DUPLICATED_URL')}`];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

  it('should transform a min selected checkboxes', () => {
    const errorFromForm = [];
    errorFromForm['minSelectedCheckboxes'] = true;
    const errorToHuman = [`${translateService.instant('VALIDATORS_ERRORS.MIN_SELECTED_CHECKBOXES')}`];
    expect(pipe.transform(errorFromForm)).toEqual(errorToHuman);
  });

});
