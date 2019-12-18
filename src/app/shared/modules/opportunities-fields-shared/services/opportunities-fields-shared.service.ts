import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { getEnumValue } from '@shared/helpers/enum.helper';
import {
  AllCurrenciesEnum, CURRENCY_EXO, OpportunityTypePayment, OpportunityTarget, OpportunityMode
} from '@opportunities/models/opportunity.enum';
import { QuestionInterface } from '@applications/ecosystem/modules/opportunities/models/opportunity.interface';
import { addHttpToLink } from '@shared/helpers/link.helper';


@Injectable()
export class OpportunitiesFieldSharedService {

  getBudgetsToSend(form: FormGroup) {
    if (form.get('typePayment').value === OpportunityTypePayment.toBeDefined) {
      return [];
    }
    const values = form.get('budgets').value.filter(control => control.budget !== '').map(
      (control, index) => {
        const selectedCurrency =
          control.currency === CURRENCY_EXO ?
          getEnumValue(AllCurrenciesEnum, CURRENCY_EXO) :
          control.currency;
        return {budget: control.budget, currency: selectedCurrency };
      }
    );
    // Return only the first value if the payment is single but the users insert several values
    const isSinglePayment = form.get('typePayment').value === OpportunityTypePayment.single;
    return isSinglePayment && values.length > 1 ? [values[0]] : values;
  }

  getQuestionsToSend(form: FormGroup, initialQuestions: QuestionInterface[]) {
    const questionsToSend = form.get('questions').value.map(
      (newQuestion, index) => {
        return newQuestion !== '' ?
          initialQuestions.length > index ? { ...initialQuestions[index], title: newQuestion } : {title: newQuestion} :
          undefined;
      }
    );
    return questionsToSend.filter(value => value !== undefined);
  }

  getDataToSendFromTarget(form: FormGroup) {
    const data = {};
    if (form.get('target').value === OpportunityTarget.TARGETED) {
      data['usersTagged'] = form.get('recipients').value.map(consultant => ({'user': consultant.uuid}));
    }
    data['target'] = form.get('target').value;
    return data;
  }

  getDataToSendFromMode(form: FormGroup) {
    const data = form.getRawValue();
    if (data['mode'] === OpportunityMode.toBeDefined) {
      delete data['mode'];
    }
    if (form.get('mode').value === OpportunityMode.onSite) {
      delete data['locationUrl'];
    } else {
      delete data['location'];
      delete data['placeId'];
      data['locationUrl'] = data['locationUrl'] ? addHttpToLink(data['locationUrl']) : undefined;
    }
    return data;
  }

  getDataToSendFromLanguages(form: FormGroup) {
    const data = form.getRawValue();
    data['languages'] = [];
    data['secondaryLanguage']
      ? data['languages'].push({'name': data['mainLanguage']}, {'name': data['secondaryLanguage']})
      : data['languages'].push({'name': data['mainLanguage']});
    delete data['mainLanguage'];
    delete data['secondaryLanguage'];
    return data;
  }

}
