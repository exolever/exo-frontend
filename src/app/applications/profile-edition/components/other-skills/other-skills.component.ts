import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '@core/store/reducers';
import { ApiResources } from '@core/services';
import { ProfileEditionService } from '@applications/profile-edition/services/profile-edition.service';
import { ConsultantModel, IndustryModel } from '@applications/shared/models';
import { KeywordModel } from '@applications/shared/models/keyword.model';
import { IndustriesService, KeywordService } from '@applications/shared/services';
import { ProfileEditSnackBarService } from '@applications/profile-edition/services/snack-bar.service';
import * as fromProfile from '@applications/profile/store/user-profile.reducer';
import * as profileActions from '@applications/profile/store/user-profile.actions';

enum SaveFormEnum {
  technologies,
  expertises,
  industries,
  all
}

@Component({
  templateUrl: './other-skills.component.html',
  styleUrls: ['./other-skills.component.scss']
})
export class OtherSkillsComponent implements OnInit, OnDestroy {

  user: ConsultantModel;
  form: FormGroup;

  expertiseList: Array<KeywordModel> = [];
  industriesList: Array<IndustryModel> = [];
  selectedExpertise;
  selectedIndustries;
  selectedTechnologies;
  technologiesList: Array<KeywordModel> = [];

  showTechnologiesButton = false;
  showExpertiseButton = false;
  showIndustriesButton = false;
  isDirty = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private profileEditionService: ProfileEditionService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private keywordService: KeywordService,
    private industriesService: IndustriesService,
    private snackBarService: ProfileEditSnackBarService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(state => fromProfile.getProfileUser(state)))
        .subscribe((profileUser: ConsultantModel) => {
          if (profileUser) {
            this.user = profileUser;
            if (!this.form) {
              this.form = this.buildForm();
            }
          }
        })
    );

    // TODO: Improve calling to one method that return the three keywords type and assign with destructuring
    this.subscriptions.push(
      this.keywordService.getKeywordsTechnologies().subscribe((res: KeywordModel[]) => {
        this.technologiesList = res || [];
      }),
      this.keywordService.getKeywordsExpertise().subscribe((res: KeywordModel[]) => {
        this.expertiseList = res || [];
      }),
      // TODO: Chat with backend and get keywords from industries in the same way that technlogies/expertise.
      this.industriesService.getIndustries().subscribe((res: IndustryModel[]) => {
        this.industriesList = res || [];
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  buildForm(): FormGroup {

    // Technologies
    this.selectedTechnologies = this.user.technologies.map(technology => this.createKeywords(technology));
    const technologiesForm = this.createFormGroup(this.selectedTechnologies);

    // Expertise
    this.selectedExpertise = this.user.expertises.map(expertise => this.createKeywords(expertise));
    const expertiseForm = this.createFormGroup(this.selectedExpertise);

    // Industries
    this.selectedIndustries = this.user.industries.map(industry => this.createKeywords(industry));
    const industriesForm = this.createFormGroup(this.selectedIndustries);

    return this.fb.group({
      technologies: technologiesForm,
      expertises: expertiseForm,
      industries: industriesForm
    });
  }

  createFormGroup(list: any): FormGroup {
    const formGroup = new FormGroup({});
    list.map((item, index) => {
      formGroup.addControl(index, new FormControl(item.level));
    });
    return formGroup;
  }

  createKeywords(item: KeywordModel | IndustryModel): KeywordModel {
    const newTechnology = new KeywordModel(item.name);
    newTechnology.setLevel(item.level);
    return newTechnology;
  }

  buildTechnologiesToSave() {
    const technologiesToSave = this.selectedTechnologies.map(k => {
      return { 'name': k.name, 'level': k.level };
    });
    return { 'technology': technologiesToSave };
  }

  buildTechnologiesUpdateUser() {
    return {'technologies': this.selectedTechnologies};
  }

  submitTechnologies() {
    this.submitTechnologiesExpertises(
      this.buildTechnologiesToSave(),
      this.buildTechnologiesUpdateUser(),
      SaveFormEnum.technologies
    );
  }

  buildExpertiseToSave() {
    const expertisesToSave = this.selectedExpertise.map(k => {
      return { 'name': k.name, 'level': k.level };
    });
    return { 'expertise': expertisesToSave };
  }

  buildExpertiseUpdateUser() {
    return {'expertises': this.selectedExpertise};
  }

  submitExpertise() {
    this.submitTechnologiesExpertises(
      this.buildExpertiseToSave(),
      this.buildExpertiseUpdateUser(),
      SaveFormEnum.expertises
    );
  }

  managementButtons(saveForm: SaveFormEnum) {
    switch (saveForm) {
      case SaveFormEnum.technologies:
        this.showTechnologiesButton = false;
        break;
      case SaveFormEnum.expertises:
        this.showExpertiseButton = false;
        break;
      case SaveFormEnum.industries:
        this.showIndustriesButton = false;
        break;
      case SaveFormEnum.all:
        this.showTechnologiesButton = false;
        this.showExpertiseButton = false;
        this.showIndustriesButton = false;
        break;
    }
  }

  submitTechnologiesExpertises(dataToSave: object, dataUpdateUser: object, formTosave: SaveFormEnum) {
    this.profileEditionService.saveData(
      this.user.pkConsultant,
      dataToSave,
      ApiResources.PROFILE_EDIT_KEYWORDS
    ).subscribe(
      () => {
        this.store.dispatch(new profileActions.UpdateUser(
          { user: this.user, data: dataUpdateUser})
        );
        this.managementButtons(formTosave);
        this.isDirty = false;
        this.snackBarService.success();
      },
      () => {
        this.snackBarService.error();
      }
    );
  }

  changeTechnologies() {
    this.showTechnologiesButton = true;
    this.isDirty = true;
  }

  changeExpertise() {
    this.showExpertiseButton = true;
    this.isDirty = true;
  }

  buildDataIndustriesToSave() {
    const industriesListToSave = this.selectedIndustries.map(i => {
      return { 'name': i.name, 'level': i.level };
    });
    return { 'industries': industriesListToSave };
  }

  submitIndustries() {
    const data = this.buildDataIndustriesToSave();
    this.profileEditionService.saveData(
      this.user.pkConsultant,
      data,
      ApiResources.PROFILE_EDIT_INDUSTRIES
    ).subscribe(
    () => {
      this.store.dispatch(new profileActions.UpdateUser(
        { user: this.user, data: {'industries': this.selectedIndustries}})
      );
      this.showIndustriesButton = false;
      this.isDirty = false;
      this.snackBarService.success();
    });
  }

  changeIndustries() {
    this.showIndustriesButton = true;
    this.isDirty = true;
  }
}
