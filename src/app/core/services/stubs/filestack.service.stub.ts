import { FilestackService } from '../filestack.service';
import { EMPTY } from 'rxjs/internal/observable/empty';

class FilestackServiceStub {
  uploadedFiles$ = EMPTY;
  init = () => {};
}

export const FILESTACK_STUB_PROVIDER = {
  provide: FilestackService, useClass: FilestackServiceStub
};
