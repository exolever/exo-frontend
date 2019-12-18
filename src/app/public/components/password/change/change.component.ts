import { ActivatedRoute, Params } from '@angular/router';
import {Component, Inject, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PasswordRecoverService } from '../services/password-recover.service';
import { PUBLIC_AREA_CONFIG, PublicAreaConfig } from '../../../public-area.config';

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.scss', '../../../public.scss']
})

export class ChangePasswordComponent implements OnInit {
  cipherEmail: string;
  changePasswordForm: FormGroup;
  private token: string;
  private passwordReset = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private recoverService: PasswordRecoverService,
    @Inject(PUBLIC_AREA_CONFIG) public config: PublicAreaConfig
  ) { }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      'new_password1': ['', [Validators.required, Validators.minLength(8)]],
      'new_password2': ['']
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.token = params['token'];
      this.cipherEmail = this.hex2a(params['mail']);
    });
  }

  onSubmit() {
    const token = this.token;
    const password1 = this.changePasswordForm.value.new_password1;
    const password2 = this.changePasswordForm.value.new_password2;
    if (this.changePasswordForm.valid) {
      this.recoverService.changePassword(token, password1, password2).subscribe(() => {
          this.passwordReset = true;
        },
        err => {
          this.changePasswordForm.get('new_password2').setErrors(err);
        }
        );
    }
  }


  isPasswordReset(): boolean {
    return this.passwordReset;
  }

  /**
   * Transform an hex string to readable one
   *
   */
  hex2a(hexx): string {
    const hex = hexx.toString(); // force conversion
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }

  /**
   * Transform a regular string to hex encoded string
   *
   */
  string2Hex(stringToEncode): string {
    let encodedString = '';
    let hex = null;
    for (let i = 0; i < stringToEncode.length; i++) {
      hex = stringToEncode.charCodeAt(i).toString(16);
      encodedString += (hex).slice(-4);
    }
    return encodedString;
  }

  getToken(): string {
    return this.token;
  }

  getCipherEmail(): string {
    return this.cipherEmail;
  }

  getChangePasswordForm(): FormGroup {
    return this.changePasswordForm;
  }

  getRecoverService(): PasswordRecoverService {
    return this.recoverService;
  }

}
