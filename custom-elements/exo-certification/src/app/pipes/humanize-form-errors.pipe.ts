import { Pipe, PipeTransform } from '@angular/core';

const textsEnglish = {
  email: 'This is not a valid email',
  required: 'This field cannot be empty',
  autoCompleteValidator: 'You must choose from the provided list',
  coupon: 'The referral code you entered is not valid',
  maxlength1: 'The maximum length is',
  maxlength2: 'characters',
  badLogin: 'Email and password do not match',
  alreadyApplied: 'The user has already applied for this certification'
};

const textsSpanish = {
  email: 'Email no válido',
  required: 'Este campo es obligatorio',
  autoCompleteValidator: 'Debe elegir uno de la lista facilitada',
  coupon: 'El código que ha introducido no es válido',
  maxlength1: 'La longitud máxima es',
  maxlength2: 'caracteres',
  badLogin: 'Email y/o contraseña no coinciden con ningún usuario',
  alreadyApplied: 'El usuario ya ha realizado la certificación'
};

@Pipe({ name: 'humanizeFormErrors' })
export class HumanizeFormErrorsPipe implements PipeTransform {
  transform(errors, language?: string): Array<string> {
    const texts = language === 'es' ? textsSpanish : textsEnglish;
    const messages = [];
    for (let error in errors) {
      if (errors.hasOwnProperty(error)) {
        // It's message type Required from backend
        if (errors[error] === 'This field may not be blank.') {
          error = 'required';
        }
        switch (error) {
          case 'email':
            messages.push(texts.email);
            break;
          case 'required':
            messages.push(texts.required);
            break;
          case 'autoCompleteValidator':
            messages.push(texts.autoCompleteValidator);
            break;
          case 'badLogin':
            messages.push(texts.badLogin);
            break;
          case 'custom':
            messages.push(errors[error]);
            break;
          case 'coupon':
            messages.push(texts.coupon);
            break;
          case 'ALREADY_APPLIED_FOR_CERTIFICATION':
            messages.push(texts.alreadyApplied);
            break;
          case 'maxlength':
            messages.push(
              `${texts.maxlength1} ${errors.maxlength.requiredLength} ${texts.maxlength2}`);
            break;
        }
      }
    }
    return messages.length > 0 ? messages : undefined;
  }
}
