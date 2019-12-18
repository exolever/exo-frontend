import { Observable } from 'rxjs';
import { FakeKeywordFactory } from '../faker_factories/keywordFake.model';

export class StubKeywordService {
  /* tslint:disable:no-unused-expression */
  getKeywords(): Observable<Array<FakeKeywordFactory>> {
    return Observable.create(() => { [ new FakeKeywordFactory() ]; }
    );
  }
  /* tslint:disable:no-unused-expression */
  getKeywordsProfile(): Observable<Array<FakeKeywordFactory>> {
    return Observable.create(() => { [ new FakeKeywordFactory() ]; }
    );
  }
}
