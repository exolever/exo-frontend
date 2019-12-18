import { ManagementOpportunitiesActionsService } from './management-opportunities-actions.service';

export class ManagementOpportunitiesActionsServiceStub {
  onDelete() {}
  onEdit() {}
}

export const MANAGEMENT_OPPORTUNITIES_ACTIONS_STUB_PROVIDER = {
  provide: ManagementOpportunitiesActionsService,
  useClass: ManagementOpportunitiesActionsServiceStub
};
