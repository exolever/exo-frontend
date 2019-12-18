import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { configTestBed } from '../../testing/test.common.spec';
import { TestingUtilityModule } from '../../testing/modules/testing-utility.module';
import { NavigationService } from './navigation.service';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

describe('NavigationService', () => {
  let service: NavigationService;

  const moduleDef: TestModuleMetadata = {
    imports: [TestingUtilityModule],
    providers: [
      URL_SERVICE_STUB_PROVIDER,
      NavigationService,
    ]
  };
  configTestBed(moduleDef, false);

  beforeEach(() => {
    service = TestBed.get(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
