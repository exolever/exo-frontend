import {TestBed} from '@angular/core/testing';

import {FeedbackService} from './feedback.service';
import {TranslateStubModule} from '@testing/modules/translate-stub.module';

describe('FeedbackService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateStubModule
    ],
  }));

  it('should be created', () => {
    const service: FeedbackService = TestBed.get(FeedbackService);
    expect(service).toBeTruthy();
  });
});
