import { Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';


@Pipe({ name: 'humanizeFormErrors' })
export class HumanizeFormErrorsPipe implements PipeTransform {
  constructor(public translate: TranslateService) { }
  transform(errors): Array<string> {
    const messages = [];
    for (let error in errors) {
      if (errors.hasOwnProperty(error)) {
        // It's message type Required from backend
        if (errors[error] === 'This field may not be blank.') {
          error = 'required';
        }
        switch (error) {
          case 'email':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.EMAIL'));
            break;
          case 'maxlength':
            messages.push(
              `${this.translate.instant('VALIDATORS_ERRORS.MAX_LENGTH', {'length': errors.maxlength.requiredLength})}`);
            break;
          case 'minlength':
            messages.push(
              `${this.translate.instant('VALIDATORS_ERRORS.MIN_LENGTH', {'length': errors.minlength.requiredLength})}`);
            break;
          case 'pattern':
            messages.push(
              `${this.translate.instant('VALIDATORS_ERRORS.PATTERN', {'pattern': errors.pattern.pattern})}`);
            break;
          case 'nullvalidator':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.NULL'));
            break;
          case 'requiredtrue':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.REQUIRED_TRUE'));
            break;
          case 'required':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.REQUIRED'));
            break;
          case 'custom':
            messages.push(errors[error]);
            break;
          case 'requiredEnter':
            messages.push(
              `${this.translate.instant('VALIDATORS_ERRORS.REQUIRED_ENTER')} ${errors[error]}`);
            break;
          case 'urlValidator':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.URL_VALIDATOR'));
            break;
          case 'positiveNumberValidator':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.NUMBER_VALIDATOR'));
            break;
          case 'duplicated':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.DUPLICATED_URL'));
            break;
          case 'autoCompleteValidator':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.AUTOCOMPLETE'));
            break;
          case 'autocompleteArrayValidator':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.AUTOCOMPLETE'));
            break;
          case 'autocompleteMaxItemsValidator':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.AUTOCOMPLETE_MAX_ITEMS'));
            break;
          case 'minSelectedCheckboxes':
            messages.push(this.translate.instant('VALIDATORS_ERRORS.MIN_SELECTED_CHECKBOXES'));
            break;
          case 'md2DatepickerMin':
            const minDate = errors.md2DatepickerMin.min;
            const formattedMinDate = `${minDate.getDate() - 1}/${minDate.getMonth() + 1}/${minDate.getFullYear()}`;
            messages.push(
              `${this.translate.instant('VALIDATORS_ERRORS.MIN_DATE')} ${formattedMinDate}`);
        }
      }
    }
    return messages.length > 0 ? messages : undefined;
  }
}
