import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { OpportunityMode } from '@opportunities/models/opportunity.enum';

import { OpportunityModel } from '../../../models/opportunity.model';

@Component({
  selector: 'app-badgets-opportunity-info',
  templateUrl: './badgets-opportunity-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgetsOpportunityInfoComponent {
  @Input() opportunity: OpportunityModel;
  @Input() showId: boolean;
  mode = OpportunityMode;

  budgetInEuros(currency: string): boolean {
    return currency === 'E';
  }

  budgetInDollars(currency: string): boolean {
    return currency === 'D';
  }

  budgetInEXO(currency: string): boolean {
    return currency === 'X';
  }
}
