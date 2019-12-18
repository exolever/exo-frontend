import {
  CURRENCY_EXO, OpportunityTypePayment
} from '@applications/ecosystem/modules/opportunities/models/opportunity.enum';

export class BudgetFormManagementServiceStub {
  currenciesToShow = {};
  currencyEXO = CURRENCY_EXO;
  typePayments = OpportunityTypePayment;
  initializeBudgetsField() {}
  manageChangesInForm() {}
  manageSinglePayment() {}
  manageCombinedPayment() {}
  isCombinedPaymentSelected() {}
  isToBeDefinedPaymentSelected () {}
  isSinglePayment () {}
  hasSelectedExos () {}
  getBudgetsToSend () {}
}
