import { Component, OnInit, SimpleChanges, OnChanges, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { OpportunityModel } from '@applications/ecosystem/modules/opportunities/models/opportunity.model';
import { LanguageModel } from '@applications/shared/models';
import { LanguageService } from '@applications/shared/services';

@Component({
  selector: 'app-languages-management',
  templateUrl: './languages-management.component.html',
  styleUrls: ['./languages-management.component.scss']
})
export class LanguagesManagementComponent implements OnInit, OnChanges {
  @Input() opportunity: OpportunityModel;
  @Input() isSubmitted = false;
  form = new FormGroup({});
  languages$: Observable<LanguageModel[]>;

  constructor(private languagesService: LanguageService) {}

  ngOnInit() {
    this.languages$ = this.languagesService.getLanguages();
    this.initializeLanguagesFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.opportunity && changes.opportunity.currentValue) {
      this.initializeLanguagesFields();
    }
    if (changes.isSubmitted && changes.isSubmitted.currentValue) {
      this.form.markAllAsTouched();
    }
  }

  initializeLanguagesFields(): void {
    const mainLanguageControl =  new FormControl(
      this.opportunity && this.opportunity.mainLanguage ? this.opportunity.mainLanguage.name : '',
      [Validators.required]);
    this.form.get('mainLanguage') ?
      this.form.setControl('mainLanguage', mainLanguageControl) :
      this.form.addControl('mainLanguage', mainLanguageControl);

    const secondaryLanguageControl = new FormControl(
      this.opportunity && this.opportunity.secondaryLanguage ? this.opportunity.secondaryLanguage.name : '');

    this.form.get('secondaryLanguage') ?
      this.form.setControl('secondaryLanguage', secondaryLanguageControl) :
      this.form.addControl('secondaryLanguage', secondaryLanguageControl);
  }

}
