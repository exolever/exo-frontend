import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HasKnownErrors } from './form';

describe('Form helpers', () => {
  let builder: FormBuilder;
  let form: FormGroup;

  beforeEach(() => {
    builder = new FormBuilder();
    form = builder.group({
      name: ['', Validators.required],
      surname: ['']
    });
  });

  it('HasKnownErrors with errors =>', () => {
    const errors = {
      error: {
        surname: 'error from backend'
      }
    };
    const hasErrors = HasKnownErrors(form, errors);
    expect(hasErrors).toBeTruthy();
  });

  it('HasKnownErrors without errors =>', () => {
    const errors = {};
    const hasErrors = HasKnownErrors(form, errors);
    expect(hasErrors).toBeFalsy();
  });

  it('HasKnownErrors without known errors =>', () => {
    const errors = {
      error: {
        fakeField: 'error from backend'
      }
    };
    const hasErrors = HasKnownErrors(form, errors);
    expect(hasErrors).toBeFalsy();
  });

});
