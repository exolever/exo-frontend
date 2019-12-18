import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { configTestBed } from '@testing/test.common.spec';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { OpportunityTypePayment } from '@opportunities/models/opportunity.enum';
import { OpportunitiesFieldSharedService } from './opportunities-fields-shared.service';

describe('PaymentManagementFormService', () => {
  let service: OpportunitiesFieldSharedService;

  const moduleDef: TestModuleMetadata = {
    imports: [ TranslateStubModule],
      providers: [
        OpportunitiesFieldSharedService,
        FormBuilder
      ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    service = TestBed.get(OpportunitiesFieldSharedService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });


  it('should create object of budgets to send', () => {
    const form = new FormGroup({});
    const bControl = new FormGroup({
      budget: new FormControl(300),
      currency: new FormControl('E')
    });
    form.addControl('typePayment', new FormControl());
    form.addControl('budgets', new FormArray([bControl]));

    form.get('typePayment').setValue(OpportunityTypePayment.single);
    const budgetsSend = service.getBudgetsToSend(form);
    expect(JSON.stringify(budgetsSend)).toEqual(JSON.stringify([{budget: 300, currency: 'E'}]));

    const bControl1 = new FormGroup({
      budget: new FormControl(300),
      currency: new FormControl('E')
    });
    const bControl2 = new FormGroup({
      budget: new FormControl(500),
      currency: new FormControl('X')
    });
    form.setControl('budgets', new FormArray([bControl1, bControl2]));
    form.get('typePayment').setValue(OpportunityTypePayment.combined);
    const budgetsSend3 = service.getBudgetsToSend(form);
    expect(JSON.stringify(budgetsSend3)).toEqual(JSON.stringify(
      [{budget: 300, currency: 'E'}, {budget: 500, currency: 'X'}]
    ));

    form.get('typePayment').setValue(OpportunityTypePayment.single);
    const budgetsSend2 = service.getBudgetsToSend(form);
    expect(JSON.stringify(budgetsSend2)).toEqual(JSON.stringify([{budget: 300, currency: 'E'}]));
  });

  it('should create object of questions to send', () => {
    const initialQuestions = [{id: 9, title: 'Question 1'}, {id: 10, title: 'Question 2'}];
    const form = new FormGroup({});
    // Adding question
    form.addControl('questions', new FormControl(['Question 1', 'Question 2', 'Question 3']));
    const questionsToAddedSend = service.getQuestionsToSend(form, initialQuestions);
    expect(questionsToAddedSend).toEqual(
      [{id: 9, title: 'Question 1'}, {id: 10, title: 'Question 2'}, {title: 'Question 3'}]
    );
    // Edit question
    form.get('questions').setValue(['Question 1 Modified', 'Question 2', '']);
    const questionsToEditedSend = service.getQuestionsToSend(form, initialQuestions);
    expect(questionsToEditedSend).toEqual(
      [{id: 9, title: 'Question 1 Modified'}, {id: 10, title: 'Question 2'}]
    );
    // Delete question
    form.get('questions').setValue(['Question 1 Modified', '', '']);
    const questionsToDeletedSend = service.getQuestionsToSend(form, initialQuestions);
    expect(questionsToDeletedSend).toEqual([{id: 9, title: 'Question 1 Modified'}]);
  });

});
