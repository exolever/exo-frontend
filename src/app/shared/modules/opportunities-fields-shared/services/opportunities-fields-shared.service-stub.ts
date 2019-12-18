import { OpportunitiesFieldSharedService } from './opportunities-fields-shared.service';

class OpportunitiesFieldSharedServiceStub {
  getBudgetsToSend = () => {};
  getQuestionsToSend = () => {};
}

export const OpportunitiesFieldSharedServiceProvider = {
  provide: OpportunitiesFieldSharedService, useClass: OpportunitiesFieldSharedServiceStub
};
