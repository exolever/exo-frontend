import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { getEnumValue } from '@shared/helpers/enum.helper';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import {
  AllCurrenciesEnum, CURRENCY_EXO, OpportunityTypePayment
} from '@opportunities/models/opportunity.enum';
import { PipeModule } from '@shared/pipes/pipes.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PaymentManagementComponent } from './payment-management.component';

describe('PaymentManagementComponent', () => {
  let component: PaymentManagementComponent;
  let fixture: ComponentFixture<PaymentManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateStubModule,
        ReactiveFormsModule,
        SharedModule,
        PipeModule
      ],
      declarations: [ PaymentManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentManagementComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize budgetsFields properly', () => {
    // 500 €
    const budgets = [
      {budget: 500, currency: getEnumValue(AllCurrenciesEnum, AllCurrenciesEnum.E)}
    ];
    component.budgets = budgets;
    component.initializeBudgetsField();
    expect(JSON.stringify(component.form.get('budgets').value)).toEqual(JSON.stringify([
      {
        budget: budgets[0].budget,
        currency: budgets[0].currency
      },
      {
        budget: '',
        currency: CURRENCY_EXO
      }
    ]));
    expect(component.form.get('typePayment').value).toEqual(OpportunityTypePayment.single);
    // 300 EXOS
    const budgets2 = [
      { budget: 300, currency: getEnumValue(AllCurrenciesEnum, AllCurrenciesEnum.X) }
    ];
    component.budgets = budgets2;
    component.initializeBudgetsField();
    expect(JSON.stringify(component.form.get('budgets').value)).toEqual(JSON.stringify([
      {
        budget: budgets2[0].budget,
        currency: budgets2[0].currency
      },
      {
        budget: '',
        currency: CURRENCY_EXO
      }
    ]));
    expect(component.form.get('typePayment').value).toEqual(OpportunityTypePayment.single);
    // 500 € and 300 EXOS
    const budgets3 = [
      { budget: 300, currency: getEnumValue(AllCurrenciesEnum, AllCurrenciesEnum.E) },
      { budget: 500, currency: getEnumValue(AllCurrenciesEnum, AllCurrenciesEnum.X) }
    ];
    component.budgets = budgets3;
    component.initializeBudgetsField();
    expect(component.form.get('typePayment').value).toEqual(OpportunityTypePayment.combined);
    expect(JSON.stringify(component.form.get('budgets').value)).toEqual(JSON.stringify([
      {
        budget: budgets3[0].budget,
        currency: budgets3[0].currency
      },
      {
        budget: budgets3[1].budget,
        currency: CURRENCY_EXO
      }
    ]));
  });
  it('check when the user select single payment and combined payment', () => {
    component.initializeBudgetsField();
    component.form.get('typePayment').setValue(OpportunityTypePayment.single);
    expect(component.form.get('budgets')['controls'][1].validator).toBeNull();
    expect((Object.keys(component.currenciesToShow).length) / 2).toEqual(3); // USD, EUR, EXOS
    component.form.get('typePayment').setValue(OpportunityTypePayment.combined);
    expect(component.form.get('budgets')['controls'][1].validator).toBeDefined();
    expect((Object.keys(component.currenciesToShow).length) / 2).toEqual(2); // USD, EUR
  });
});
