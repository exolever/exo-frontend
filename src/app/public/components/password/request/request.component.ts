import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PUBLIC_AREA_CONFIG, PublicAreaConfig } from '@public/public-area.config';
import { PasswordRecoverService } from '../services/password-recover.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss', '../../../public.scss']
})
export class RequestPasswordComponent {

  requestForm: FormGroup;
  private formOk: boolean;

  constructor(
    private fb: FormBuilder,
    private recoverService: PasswordRecoverService,
    @Inject(PUBLIC_AREA_CONFIG) public config: PublicAreaConfig
  ) {
    this.requestForm = this.fb.group({ 'email': ['', [Validators.required]] });
    this.formOk = false;
  }

  isFormOk() {
    return this.formOk;
  }

  onSubmit() {
    if (this.requestForm.valid) {
      this.recoverService.requestPassword(this.requestForm.value.email).subscribe(() => {
          this.formOk = true;
        },
        err => {
          const errorMessage = err.error;
          for (const key in errorMessage) {
            if (errorMessage.hasOwnProperty(key)) {
              const value = errorMessage[key];
              this.requestForm.get(key).setErrors({ 'custom': value });
            }
          }
        }
      );
    }
  }

  getRecoverService(): PasswordRecoverService {
    return this.recoverService;
  }

  getRequestForm(): FormGroup {
    return this.requestForm;
  }
}
