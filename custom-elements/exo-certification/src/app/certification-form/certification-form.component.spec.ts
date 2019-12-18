import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material';

import { of } from 'rxjs';

import { CertificationFormComponent } from './certification-form.component';
import { ApiService } from '../api.service';
import { HumanizeFormErrorsPipe } from '../pipes/humanize-form-errors.pipe';
import { LevelEnum } from '../enumInterface';



describe('CertificationComponent', () => {
  let component: CertificationFormComponent;
  let fixture: ComponentFixture<CertificationFormComponent>;
  let service: ApiService;

  window['grecaptcha'] = {
    ready() {},
    execute() {}
  };

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          MatStepperModule
        ],
        declarations: [
          HumanizeFormErrorsPipe,
          CertificationFormComponent
        ],
        providers: [
          { provide: ApiService, useValue: {
              getCountries() {},
              getCohorts() {},
              getContractingData() {},
              goToPay() {}
          } },
        ],
        schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationFormComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create correct form for CERTIFICATION_LEVEL_2_FORM', () => {
    component.level = LevelEnum.LEVEL2;
    component.ngOnInit();
    expect(component.firstFormGroup.get('coupon').valid).toBeTruthy();
    expect(component.isNewUser).toBeTruthy();
    expect(component.showAlertGoToLevel2).toBeFalsy();
  });

  it('should create correct form for CERTIFICATION_LEVEL_3_FORM', () => {
    component.level = LevelEnum.LEVEL3;
    component.ngOnInit();
    expect(component.firstFormGroup.get('coupon').valid).toBeTruthy();
    expect(component.isNewUser).toBeFalsy();
    expect(component.showAlertGoToLevel2).toBeTruthy();
  });

  it('should create correct form for CERTIFICATION_LEVEL_2_FT', () => {
    component.level = LevelEnum.LEVELFT;
    component.ngOnInit();
    expect(component.firstFormGroup.get('coupon').valid).toBeFalsy(); // It's mandatory
    expect(component.isNewUser).toBeTruthy();
    expect(component.showAlertGoToLevel2).toBeFalsy();
  });

  it('should create properly the validators for forms', () => {
    component.initializeFormStep1();
    component.showRegisterForm();
    expect(component.firstFormGroup.get('firstName').validator).toBeDefined();
    expect(component.firstFormGroup.get('surname').validator).toBeDefined();
    expect(component.firstFormGroup.get('password').validator).toBeNull();
    component.showLoginForm();
    expect(component.firstFormGroup.get('firstName').validator).toBeNull();
    expect(component.firstFormGroup.get('surname').validator).toBeNull();
    expect(component.firstFormGroup.get('password').validator).toBeDefined();
  });

  it('should send the correct data for firstGroup', () => {
    component.initializeFormStep1();
    component.showRegisterForm();
    component.firstFormGroup.get('firstName').setValue('Anne');
    component.firstFormGroup.get('surname').setValue('Smith');
    component.firstFormGroup.get('email').setValue('anne@example.com');
    component.firstFormGroup.get('policy').setValue(true);
    const dataFirstGroup = component.getDataFirstFormGroup();
    expect(JSON.stringify(dataFirstGroup)).toEqual(JSON.stringify({
      email: 'anne@example.com',
      firstName: 'Anne',
      surname: 'Smith',
    }));

    component.initializeFormStep1();
    component.showLoginForm();
    component.firstFormGroup.get('email').setValue('anne@example.com');
    component.firstFormGroup.get('password').setValue('password');
    component.firstFormGroup.get('policy').setValue(true);
    const dataFirstGroup2 = component.getDataFirstFormGroup();
    expect(JSON.stringify(dataFirstGroup2)).toEqual(JSON.stringify({
      email: 'anne@example.com',
      password: 'password'
    }));
  });

  it('should send the correct data for secondGroup', () => {
    component.initializeFormStep2();
    component.secondFormGroup.get('cohort').setValue({pk: 1, label: '5 September 2019 - 500$'});
    component.secondFormGroup.get('applicationDetails').get('reasons').setValue('I want to apply ....');
    component.secondFormGroup.get('applicationDetails').get('describeYourself').setValue('C-level or leader of an organization');
    component.secondFormGroup.get('applicationDetails').get('linkedin').setValue('http://linkedin/anne');
    component.secondFormGroup.get('applicationDetails').get('whereMetUs').setValue('Google');
    const dataSecondGroup = component.getDataSecondFormGroup();
    expect(JSON.stringify(dataSecondGroup)).toEqual(JSON.stringify({
      cohort: 1,
      applicationDetails: {
        reasons: 'I want to apply ....',
        describeYourself: 'C-level or leader of an organization',
        linkedin: 'http://linkedin/anne',
        whereMetUs: 'Google'
      }
    }));
  });

  it('should send the correct data for thirdGroup', () => {
    component.initializeFormStep3();
    component.thirdFormGroup.get('billingName').setValue('Anne Smith');
    component.thirdFormGroup.get('taxId').setValue('876 543 210');
    component.thirdFormGroup.get('billingAddress').setValue('538-550 Boundary Street, Spring Hill QLD 4000');
    component.thirdFormGroup.get('country').setValue({code: 'CA', label: 'Canada'});
    const dataSecondGroup = component.getDataThirdFormGroup();
    expect(JSON.stringify(dataSecondGroup)).toEqual(JSON.stringify({
      billingName: 'Anne Smith',
      taxId: '876 543 210',
      billingAddress: '538-550 Boundary Street, Spring Hill QLD 4000',
      country: 'CA'
    }));
  });

  it('should create the object data to send', () => {
    component.initializeFormStep1();
    component.initializeFormStep2();
    component.initializeFormStep3();
    component.level = 'level_1';
    component.recaptcha = 'recaptcha';
    component.firstFormGroup.get('policy').setValue(true);
    component.secondFormGroup.get('cohort').setValue({pk: 1, label: '5 September 2019 - 500$'});
    component.thirdFormGroup.get('country').setValue({code: 'CA', label: 'Canada'});
    const data = component.buildAllData();
    expect('entryPoint' in data).toBeTruthy();
    expect('recaptcha' in data).toBeTruthy();
  });

  it('should check function getContractingData ', () => {
    spyOn(component.stepper, 'next').and.returnValue(true);
    spyOn(service, 'getContractingData').and.returnValue(
      of({
        email: 'anne@example.com',
        fullName: 'Anne',
        contractingData: {
          address: '538-550 Boundary Street, Spring Hill QLD 4000',
          taxId: '876 543 210',
          companyName: 'Company S.L',
          name: 'Anne Smith'
        }
      })
    );
    component.initializeFormStep1();
    component.initializeFormStep3();
    component.getContractingData();
    expect(component.thirdFormGroup.get('billingAddress').value).toEqual('538-550 Boundary Street, Spring Hill QLD 4000');
    expect(component.thirdFormGroup.get('taxId').value).toEqual('876 543 210');
    expect(component.thirdFormGroup.get('companyName').value).toEqual('Company S.L');
    expect(component.thirdFormGroup.get('billingName').value).toEqual('Anne Smith');
    expect(component.firstFormGroup.get('email').value).toEqual('anne@example.com');
    expect(component.firstFormGroup.get('firstName').value).toEqual('Anne');
  });

  it('should check function nextStep ', () => {
    const spyCohorts = spyOn(component, 'getCohorts').and.returnValue(true);
    const spyStepper = spyOn(component.stepper, 'next').and.returnValue(true);
    const spyContractingData = spyOn(component, 'getContractingData').and.returnValue(true);
    component.initializeFormStep1();
    component.initializeFormStep2();
    const firstGroup = component.firstFormGroup;
    component.isNewUser = true;
    component.onNextStep(firstGroup, 2);
    Object.keys(firstGroup.controls).forEach(field => expect(firstGroup.get(field).touched).toBeTruthy());
    expect(spyCohorts).toHaveBeenCalledTimes(1);
    expect(spyStepper).toHaveBeenCalledTimes(1);

    // Register form, with error in policy
    component.isNewUser = true;
    component.firstFormGroup.get('policy').setValue(false);
    component.onNextStep(firstGroup, 2);
    expect(component.step1.editable).toBeTruthy();
    expect(spyCohorts).toHaveBeenCalledTimes(2);
    expect('custom' in component.firstFormGroup.get('policy').errors).toBeTruthy();
    expect(spyStepper).toHaveBeenCalledTimes(2);
    expect(spyContractingData).toHaveBeenCalledTimes(0);

    // Register form, without error in policy, with error in policy
    component.isNewUser = true;
    component.firstFormGroup.get('policy').setValue(true);
    component.onNextStep(firstGroup, 2);
    expect(component.step1.editable).toBeTruthy();
    expect(component.firstFormGroup.get('policy').errors).toBeNull();
    expect(spyCohorts).toHaveBeenCalledTimes(3);
    expect(spyStepper).toHaveBeenCalledTimes(3);
    expect(spyContractingData).toHaveBeenCalledTimes(0);

    // Login form, with error in form
    component.showLoginForm();
    component.onNextStep(firstGroup, 2);
    expect(component.step1.editable).toBeFalsy();
    expect(spyCohorts).toHaveBeenCalledTimes(4);
    expect(spyStepper).toHaveBeenCalledTimes(3);
    expect(spyContractingData).toHaveBeenCalledTimes(0);

    // Login form, without error in policy, without error in form
    component.showLoginForm();
    component.firstFormGroup.get('email').setValue('anne@example.com');
    component.firstFormGroup.get('password').setValue('password');
    component.firstFormGroup.get('policy').setValue(true);
    component.isNewUser = false;
    component.onNextStep(firstGroup, 2);
    expect(component.step1.editable).toBeFalsy();
    expect(spyCohorts).toHaveBeenCalledTimes(5);
    expect(component.firstFormGroup.get('policy').errors).toBeNull();
    expect(spyStepper).toHaveBeenCalledTimes(3);
    expect(spyContractingData).toHaveBeenCalledTimes(1);

    // Go to step 3
    const secondGroup = component.secondFormGroup;
    component.onNextStep(secondGroup, 3);
    expect(spyStepper).toHaveBeenCalledTimes(4);
  });

  it('should show errors in the form', () => {
    component.initializeFormStep3();
    component.thirdFormGroup.get('country').setValue({code: 'XX', label: 'XXX'});
    const response1 = { status: 403 };
    component.setErrorsInForm(response1);
    expect(component.showAlertGoToLevel2).toBeTruthy();
    const response2 = {
      status: 400,
      error: { country: 'The country is not valid' }
    };
    component.setErrorsInForm(response2);
    expect('autoCompleteValidator' in component.thirdFormGroup.get('country').errors).toBeTruthy();
    const response3 = {
      status: 400,
      error: { coupon: 'The coupon is not valid' }
    };
    component.setErrorsInForm(response3);
    expect(component.genericError).not.toBeUndefined();
    const response4 = {
      status: 400,
      error: { 'billingName': 'Generic error' }
    };
    component.setErrorsInForm(response4);
    expect('custom' in component.thirdFormGroup.get('billingName').errors).toBeTruthy();
    component.genericError = undefined;
    const response5 = {
      status: 400,
      error: { 0: 'Generic error not associated any field' }
    };
    component.setErrorsInForm(response5);
    expect(component.genericError).not.toBeUndefined();
  });

  it('should check function changeStep', () => {
    const spy = spyOn(component, 'getCohorts').and.returnValue(true);
    component.changeStep({selectedIndex: 0}); // Step 1
    expect(component.showAlertGoToLevel2).toBeFalsy();
    expect(component.genericError).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(0);
    component.changeStep({selectedIndex: 1}); // Step 2
    expect(spy).toHaveBeenCalledTimes(1);
  });

});

