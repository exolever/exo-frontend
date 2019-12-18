import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResourcesService } from '../services/resources.service';

export function ValidateVideoURL(resourceService: ResourcesService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return resourceService.checkURL(control.value).pipe(
      map( (response: string | boolean) => {
        const errors: ValidationErrors = {};
        errors[response.toString()] = true;
        return response === true ? null : errors;
      }
    ));
  };
}
