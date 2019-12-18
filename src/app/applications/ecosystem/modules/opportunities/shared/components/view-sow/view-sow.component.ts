import {
  Component, Inject, ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { getEnumValue } from '@shared/helpers/enum.helper';
import {
  AllCurrenciesEnum
} from '@ecosystem/modules/opportunities/models/opportunity.enum';
import { SowInterface } from '@opportunities/models/opportunity.interface';

@Component({
  templateUrl: './view-sow.component.html',
  styleUrls: ['./view-sow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewSowComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { sow: SowInterface }
  ) {}

  humanizedBudgets(): string[] {
    return this.data.sow && this.data.sow.budgets ? this.data.sow.budgets.map(b => {
      const value = !Number.isNaN(+b.budget) ? +b.budget : b.budget;
      return `${value} ${getEnumValue(AllCurrenciesEnum, b.currency)}`;
    }) : [];
  }

}
