import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';
import { positiveNumberValidator } from '@shared/custom-validations/';
import { getEnumValue } from '@shared/helpers/enum.helper';

import {
  AllCurrenciesEnum, CURRENCY_DOLLAR, CURRENCY_EXO, OpportunityFiatCurrencyEnum,
  OpportunityTypePayment
} from '@opportunities/models/opportunity.enum';
import { BudgetInterface } from '@applications/ecosystem/modules/opportunities/models/opportunity.interface';

@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.scss']
})
export class PaymentManagementComponent implements OnInit, OnChanges, OnDestroy {
  @Input() budgets: BudgetInterface[] = [];
  @Input() isRequired = false;
  @Input() isSubmitted = false;
  currenciesToShow = {};
  currencyEXO = CURRENCY_EXO;
  typePayments = OpportunityTypePayment;
  form = new FormGroup({});

  private subscription = new Subscription();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initializeBudgetsField();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form && changes.budgets && changes.budgets.currentValue) {
      this.initializeBudgetsField();
    }
    if (changes.isSubmitted && changes.isSubmitted.currentValue) {
      this.form.markAllAsTouched();
    }
  }

  /**
   * We have three modes of payment, to be defined, only EXOS/EUR/USD or combined EUR/USD + EXOS.
   * If only exists EUR or USD or EXOS they are shown in the first formGroup
   * If its a combination between several they are shown in both formGroup
  */
  initializeBudgetsField() {
    const dolarValue = getEnumValue(OpportunityFiatCurrencyEnum, CURRENCY_DOLLAR);
    const typePaymentControl = new FormControl(
      this.budgets && this.budgets.length > 1 ?
        OpportunityTypePayment.combined :
        OpportunityTypePayment.single
    );
    this.form.get('typePayment') ?
      this.form.setControl('typePayment', typePaymentControl) :
      this.form.addControl('typePayment', typePaymentControl);
    const exoValue = this.budgets && this.budgets.find(
      b => b.currency === getEnumValue(AllCurrenciesEnum, CURRENCY_EXO)
    );
    const fiatValue = this.budgets && this.budgets.find(
      b => b.currency !== getEnumValue(AllCurrenciesEnum, CURRENCY_EXO)
    );

    const budgetFirstFormGroup = fiatValue || exoValue ?
      fiatValue ? +fiatValue.budget : +exoValue.budget :
      '';
    const currencyFirstFormGroup = fiatValue || exoValue ?
      fiatValue ? fiatValue.currency : exoValue.currency :
      dolarValue;

    const controlsBudgets = [
      this.formBuilder.group({
        budget: this.isRequired ?
          new FormControl(budgetFirstFormGroup, [Validators.required, positiveNumberValidator()]) :
          new FormControl(budgetFirstFormGroup, positiveNumberValidator()),
        currency: new FormControl(currencyFirstFormGroup, Validators.required)
      }),
      this.formBuilder.group({
        budget: new FormControl(exoValue && this.isCombinedPaymentSelected() ? +exoValue.budget : '',
          positiveNumberValidator()),
        currency: new FormControl(CURRENCY_EXO)
      }),
    ];
    const budgetArrayControl = this.isRequired ?
      this.formBuilder.array(controlsBudgets, [Validators.required]) :
      this.formBuilder.array(controlsBudgets);

    this.form.get('budgets') ?
      this.form.setControl('budgets', budgetArrayControl) :
      this.form.addControl('budgets', budgetArrayControl);

    this.currenciesToShow = this.budgets && this.isCombinedPaymentSelected() ?
      OpportunityFiatCurrencyEnum :
      AllCurrenciesEnum;

    this.manageChanges();
  }

  manageChanges () {
    this.subscription.add(
      this.form.get('typePayment').valueChanges.subscribe(
        payment => {
          if (payment === OpportunityTypePayment.single) {
            this.manageSinglePayment();
          }

          if (payment === OpportunityTypePayment.combined) {
            this.manageCombinedPayment();
          }
        }
      )
    );
  }

  manageSinglePayment () {
    this.form.controls['budgets']['controls'][1].get('budget').setValidators(null);
    this.form.get('budgets')['controls'][1].get('budget').updateValueAndValidity();
    this.currenciesToShow = AllCurrenciesEnum;
  }

  manageCombinedPayment () {
    this.form.controls['budgets']['controls'][1].get('budget').setValidators([positiveNumberValidator()]);
    this.form.get('budgets')['controls'][1].get('budget').updateValueAndValidity();
    this.currenciesToShow = OpportunityFiatCurrencyEnum;
  }

  isCombinedPaymentSelected(): boolean {
    return this.form.get('typePayment').value === OpportunityTypePayment.combined;
  }

  isToBeDefinedPaymentSelected(): boolean {
    return this.form.get('typePayment').value === OpportunityTypePayment.toBeDefined;
  }

  isSinglePayment(): boolean {
    return !this.isCombinedPaymentSelected();
  }

  hasSelectedExos(): boolean {
    return this.isCombinedPaymentSelected() &&
      this.form.controls['budgets']['controls'][0].get('currency').value
      === getEnumValue(AllCurrenciesEnum, CURRENCY_EXO);
  }

  getBudgetsToSend() {
    const values = this.form.get('budgets').value.filter(control => control.budget !== '').map(
      control => {
        const selectedCurrency =
          control.currency === CURRENCY_EXO ?
          getEnumValue(AllCurrenciesEnum, CURRENCY_EXO) :
          control.currency;
        return {budget: control.budget, currency: selectedCurrency };
      }
    );
    // Return only the first value if the payment is single but the users insert several values
    return this.isSinglePayment() && values.length > 1 ? [values[0]] : values;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
