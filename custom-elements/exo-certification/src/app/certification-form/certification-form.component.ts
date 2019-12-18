import { Component, OnInit, Input, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper, MatStep } from '@angular/material';

import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { CountryInterface, CohortLevelEnum, CohortInterface, Contact} from '../enumInterface';
import { ApiService } from '../api.service';
import { HumanizeFormErrorsPipe } from '../pipes/humanize-form-errors.pipe';

declare var grecaptcha;

@Component({
  selector: 'app-certification-form',
  templateUrl: './certification-form.component.html',
  styleUrls: ['./certification-form.component.scss'],
  providers: [HumanizeFormErrorsPipe]
})
export class CertificationFormComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true }) stepper: MatStepper;
  @ViewChild('step1', { static: true }) step1: MatStep;
  @Input() domain: string;
  @Input() level: CohortLevelEnum;
  @Input() recaptcha: string;
  @Input() coupon = null;
  @Input() captchaKey;
  @Input() language = 'en';
  @Output() step = new EventEmitter<string>();

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  loginFormGroup: FormGroup;
  isNewUser = true;
  showAlertGoToLevel2 = false;
  filteredCountries$: Observable<CountryInterface>;
  cohorts$: Observable<CohortInterface[]>;
  token: string;
  genericError: string;
  subscription = new Subscription();
  contact: Contact = <Contact>{};

  labelsSpanish = {
    STEP1: 'Informacion básica',
    NAME_LABEL: 'Nombre',
    EMAIL_LABEL: 'Email',
    PASSWORD_LABEL: 'Contraseña',
    CODE_LABEL: 'Enlace de referencia',
    // tslint:disable-next-line: max-line-length
    POLICY: `Entiendo y acepto la <a href="https://platform.openexo.com/static/agreement/Privacy%20Policy%20Contact%20Information%20FORM.pdf" target="_blank"> Política de Privacidad </a>. Estoy de acuerdo con recibir un correo para unirme a la comunidad, así como boletines que sean interesantes y comunicaciones sobre OpenExO.`,
    STEP2: 'Datos de la inscripción',
    HI: 'Hola',
    PROGRAM_LABEL: 'Convocatoria',
    CONCEPT: 'Concepto',
    AMOUNT: 'Importe',
    DISCOUNT: 'descuento',
    TOTAL_AMOUNT: 'Importe total',
    FIRST_PAYMENT: 'Primer pago',
    SECOND_PAYMENT: 'El segundo pago puede depender de otros descuentos',
    WHY: '¿Por qué quieres certificarte?',
    WHERE: '¿Cómo nos conociste?',
    BILLING_NAME: 'Nombre de facturación',
    BILLING_NAME_HINT: 'Nombre de la persona o empresa que efectuarán el pago',
    BILLING_ADDRESS: 'Dirección de facturación',
    BILLING_ADDRESS_HINT: 'Tu dirección personal o el domicilio legal de la empresa',
    TAXID: 'Número de identificación fiscal',
    TAXID_HINT: 'Es obligatorio por motivos fiscales, puede ser el tuyo o el de la empresa., ej.: TIN, NIG, VAT',
    COUNTRY: 'País',
    COUNTRY_HINT: 'El lugar de tu domicilio legal, ej.: España. El nombre final del país aparecerá en inglés por motivos técnicos.',
    PROCEED_PAYMENT: 'PROCEDER AL PAGO',
    NEXT: 'Siguiente',
    LOGIN: 'Log in',
    meetUpList: [
      'Referenciado por otro miembro de la comunidad ExO',
      'Google',
      'LinkedIn',
      'Instagram',
      'Twitter',
      'Event',
      'Otros'
    ],
    CERTIFICATION_NEEDED: 'Para acceder a este nivel es necesaria la certificacion ExO Consultant',
    JOIN: 'Únete',
    PAYMENT_METHOD: 'Selecciona el método de pago',
    PAYMENT_CARD: 'Tarjeta de crédito/débito',
    PAYMENT_OTHER: 'Otros'
  };

  labelsEnglish = {
    STEP1: 'Application details',
    NAME_LABEL: 'Name',
    EMAIL_LABEL: 'Email',
    PASSWORD_LABEL: 'Password',
    CODE_LABEL: 'Referral code',
    // tslint:disable-next-line: max-line-length
    POLICY: 'I understand and agree with the <a href="https://platform.openexo.com/static/agreement/Privacy%20Policy%20Contact%20Information%20FORM.pdf" target="_blank">Privacy Policy</a>  I\'m happy to receive an email to join the community. Yes!, Send me genuinely useful newsletters and communication about everything current at OpenExO.',
    STEP2: 'Application Details',
    HI: 'Hi',
    PROGRAM_LABEL: 'Program',
    CONCEPT: 'Concept',
    AMOUNT: 'Amount',
    DISCOUNT: 'discount',
    TOTAL_AMOUNT: 'Total amount',
    FIRST_PAYMENT: 'First paymen',
    SECOND_PAYMENT: 'Second payment may depend on others discounts',
    WHY: 'Why would you like to take this certification?',
    WHERE: 'Where did you meet us?',
    BILLING_NAME: 'Billing Name',
    BILLING_NAME_HINT: 'Name of the person or company who will make the payment',
    BILLING_ADDRESS: 'Billing Address',
    BILLING_ADDRESS_HINT: 'Your personal address or company’s legal address',
    TAXID: 'TaxID',
    TAXID_HINT: 'This number is legally required for tax purposes, from you or the company, i.e. TIN, NIF, VAT.',
    COUNTRY: 'Country',
    COUNTRY_HINT: 'This is where your legal residence is, i.e. Denmark. Start typing to select your country',
    PROCEED_PAYMENT: 'Proceed with payment',
    NEXT: 'Next',
    LOGIN: 'Log in',
    meetUpList: [
      'Referal from another ExO Community member',
      'Google',
      'LinkedIn',
      'Instagram',
      'Twitter',
      'Event',
      'Other'
    ],
    CERTIFICATION_NEEDED: 'To access this level, the ExO Consultant certification is required',
    JOIN: 'Join now',
    PAYMENT_METHOD: 'Select the payment method',
    PAYMENT_CARD: 'Credit/debit card',
    PAYMENT_OTHER: 'Other'
  };

  labels;

  constructor(
    private fb: FormBuilder,
    private service: ApiService,
    private pipe: HumanizeFormErrorsPipe
  ) { }

  ngOnInit() {
    this.setUpDomain();
    this.initializeFormStep1();
    this.initializeFormStep2();

    if (this.isCertificationLevel3()) {
      this.showLoginForm();
      this.showAlertGoToLevel2 = true;
    }
  }

  setUpDomain() {
    if (!this.domain) {
      this.domain = window.location.origin + '/';
    }
    this.service.setDomain(this.domain);
    this.language = window.location.href.includes('es.openexo.com') ? 'es' : 'en';
    this.labels = this.language === 'es' ? this.labelsSpanish : this.labelsEnglish;
  }

  initializeFormStep1() {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('referral-code');

    this.firstFormGroup = this.fb.group({
      email: [null, [Validators.required, Validators.maxLength(200), Validators.email]],
      fullName: [null, [Validators.required, Validators.maxLength(150)]],
      password: [null],
      coupon: [code ? code : this.coupon, this.getValidationForCoupon()],
      policy: [false, [Validators.requiredTrue]]
    });
  }

  initializeFormStep2() {
    this.secondFormGroup = this.fb.group({
      cohort: [null, [Validators.required]],
      applicationDetails: this.fb.group({
        reasons: [null],
        whereMetUs: [null],
      }),
      paymentMethod: ['CARD', [Validators.required]],
      billingName: [null, [Validators.required, Validators.maxLength(200)]],
      taxId: [null, [Validators.maxLength(30)]],
      billingAddress: [null, [Validators.required]],
      country: [null, {
        validators: [Validators.required]
      }]
    });

    this.filteredCountries$ = this.secondFormGroup.get('country').valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(countryName => countryName ? this.service.getCountries(countryName) : [])
    );
  }

  getValidationForCoupon(): Validators[] {
    const validators = [Validators.maxLength(30)];
    if (this.isCertificationForFT()) {
      validators.push(Validators.required);
    }
    return validators;
  }

  isCertificationLevel2 (): boolean {
    return this.level === CohortLevelEnum.LEVEL2;
  }

  isCertificationLevel3 (): boolean {
    return this.level === CohortLevelEnum.LEVEL3;
  }

  isCertificationForFT (): boolean {
    return this.level === CohortLevelEnum.LEVELFT;
  }

  getCohorts() {
    const coupon = this.firstFormGroup.get('coupon').value;
    this.cohorts$ = this.service.getCohort(this.level, coupon, this.language);
  }

  showLoginForm () {
    this.isNewUser = false;
    this.firstFormGroup.get('fullName').setValidators(null);
    this.firstFormGroup.get('fullName').updateValueAndValidity();
  }

  showRegisterForm() {
    if (this.isCertificationLevel3()) {
      this.showAlertGoToLevel2 = true;
    } else {
      this.isNewUser = true;
      this.firstFormGroup.get('fullName').setValidators(Validators.required);
      this.firstFormGroup.get('fullName').updateValueAndValidity();
    }
  }

  showBillingTable(): boolean {
    return this.secondFormGroup.get('cohort').value && this.secondFormGroup.get('cohort').value.coupon;
  }

  goToLevel2 () {
    window.open('https://www.openexo.com/exo-consultant-certification', '_self');
  }

  displayForCountries(country: CountryInterface): string {
    return country ? country.name : '';
  }

  getDataFirstFormGroup() {
    const data = this.removeNullValues(this.firstFormGroup);
    delete data['policy'];
    return data;
  }

  getDataSecondFormGroup() {
    const data = this.removeNullValues(this.secondFormGroup);
    if (data.cohort) {
      data['cohort'] = data.cohort.pk;
    }
    if (data.country) {
      data['country'] = data.country.code;
    }
    return data;
  }

  checkIfStep1IsEditable() {
    this.step1.editable = this.isNewUser;
  }

  onNextStep(currentFormGroup: FormGroup, nextStep: number) {
    Object.keys(currentFormGroup.controls).forEach(field => currentFormGroup.get(field).markAsTouched({ onlySelf: true }));
    this.checkIfStep1IsEditable();
    switch (nextStep) {
      case 2:
        this.getCohorts();
        if (this.firstFormGroup.get('policy').value === false) {
          this.firstFormGroup.get('policy').setErrors({'custom': 'To go to the next step, tick the box'});
        }
        if (this.isNewUser) {
          this.onSaveDraft();
        } else if (currentFormGroup.valid) {
          this.getContractingData();
        }
        break;
    }
  }

  getContractingData() {
    grecaptcha.ready(() => grecaptcha.execute(this.recaptcha, {action: 'homepage'}).then(token => {
      this.token = token;
      const data = this.buildAllData();
      this.service.getContractingData(data).subscribe(
        (res: {
          email: string,
          fullName: string,
          contractingData: {address: string, companyName: string, name: string, taxId: string}
        }) => {
          this.secondFormGroup.get('billingAddress').setValue(res.contractingData.address);
          this.secondFormGroup.get('taxId').setValue(res.contractingData.taxId);
          this.secondFormGroup.get('billingName').setValue(res.contractingData.name);
          this.firstFormGroup.get('email').setValue(res.email);
          this.firstFormGroup.get('fullName').setValue(res.fullName);
          Object.assign(this.contact, res);
          this.stepper.next();
        },
        err => {
          this.setErrorsInForm(err);
          Object.keys(this.firstFormGroup.controls).forEach(field => this.firstFormGroup.get(field).markAsTouched({ onlySelf: true }));
        }
      );
    }));
  }

  buildAllData(): Contact {
    return <Contact>{
      ...this.contact,
      ...this.getDataFirstFormGroup(),
      ...this.getDataSecondFormGroup(),
      ... { level: this.level },
      ... { recaptcha: this.token }
    };
  }

  onSaveDraft() {
    grecaptcha.ready(() => grecaptcha.execute(this.recaptcha, {action: 'homepage'}).then(token => {
      this.token = token;
      const dataToSend = this.buildAllData();
      this.service.saveDraft(dataToSend).subscribe(resp => {
        this.contact = resp;
        this.stepper.next();
        },
        err => {
          this.setErrorsInForm(err);
          Object.keys(this.firstFormGroup.controls).forEach(field => this.firstFormGroup.get(field).markAsTouched({ onlySelf: true }));
        }
      );
    }));

  }

  onPay() {
    if (this.secondFormGroup.valid) {
      this.step.emit('pay');
      grecaptcha.ready(() => grecaptcha.execute(this.recaptcha, {action: 'homepage'}).then(token => {
        this.token = token;
        const dataToSend = this.buildAllData();
        this.service.goToPay(dataToSend).subscribe(
          res => window.open(res.nextUrl, '_self'),
          err => {
            this.setErrorsInForm(err);
            Object.keys(this.secondFormGroup.controls).forEach(field => this.secondFormGroup.get(field).markAsTouched({ onlySelf: true }));
          }
        );
      }));
    }
  }

  setErrorsInForm(response) {
    this.genericError = undefined;
    if (response.status === 403) {
      this.showAlertGoToLevel2 = true;
      if (response.error && response.error.custom) {
        const map = {};
        map[response.error.custom] = true;
        this.genericError = this.pipe.transform(map, this.language).pop();
      }
    } else {
      const errorMessage = response.error;
      for (const key in errorMessage) {
        if (errorMessage.hasOwnProperty(key)) {
          switch (key) {
            case 'nonFieldErrors':
              this.firstFormGroup.get('password').setErrors({'badLogin': errorMessage[key]});
              break;
            case 'country':
              this.secondFormGroup.get('country').setErrors({'autoCompleteValidator': true});
              break;
            case 'coupon':
              this.firstFormGroup.get('coupon').setErrors({'coupon': true });
              break;
            case 'email':
              this.firstFormGroup.get('email').setErrors({'email': true });
              break;
            case 'error':
              this.genericError = errorMessage[key];
              break;
            default:
              const value = Array.isArray(errorMessage[key]) ? errorMessage[key][0] : errorMessage[key];
              this.secondFormGroup.get(key) ?
                this.secondFormGroup.get(key).setErrors({ 'custom': value }) :
                this.genericError = value;
              break;
          }
        }
      }
    }
  }

  changeStep(step) {
    this.step.emit(step.selectedIndex + 1);
    this.showAlertGoToLevel2 = false;
    this.genericError = undefined;
    if (step.selectedIndex === 1) { // Step 2
      this.getCohorts();
    }
  }

  private removeNullValues(formGroup: FormGroup) {
    const data = formGroup.getRawValue();
    Object.keys(data).map(key => {
      if (data[key] === null) {
        delete data[key];
      }
    });
    return data;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
