import { UserModel } from '@core/models';

export class OpportunityRecipientModel extends UserModel {
  conversation: number;
  applied: boolean;

  hasApplied(): boolean {
    return this.applied;
  }
}
