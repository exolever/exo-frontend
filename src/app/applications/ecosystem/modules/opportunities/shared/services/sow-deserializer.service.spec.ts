import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import * as MomentTZ from 'moment-timezone';

import { configTestBed } from '@testing/test.common.spec';

import { SowDeserializerService } from './sow-deserializer.service';

describe('SowDeserializerService', () => {
  let service: SowDeserializerService;

  const moduleDef: TestModuleMetadata = {
    providers: [SowDeserializerService]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    service = TestBed.get(SowDeserializerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should parse the dates received and build the start time from the start date', () => {
    const data = {
      startDate: '2019-10-30',
      startTime: '18:29:13',
      endDate: '2019-11-5',
      timezone: 'Europe/Madrid'
    };
    const sow = service.deserialize(data);
    expect(sow).toBeDefined();
    expect(sow.startDate instanceof MomentTZ).toBeTruthy();
    expect(sow.startTime instanceof MomentTZ).toBeTruthy();
    expect(sow.endDate instanceof MomentTZ).toBeTruthy();
    expect(sow.startDate.isSame(sow.startTime, 'day')).toBeTruthy();
  });

});
