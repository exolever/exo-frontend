import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef,
  OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import * as MomentTZ from 'moment-timezone';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { PickerFileMetadata } from 'filestack-js';

import { CertificationModel } from '@core/modules/certifications/models';
import { KeywordModel } from '@applications/shared/models';
import { KeywordService } from '@applications/shared/services';
import { AppState } from '@core/store/reducers';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { positiveNumberValidator } from '@shared/custom-validations/';
import { convertDateToString } from '@shared/helpers/md2Datepicker.helper';
import {
  MarketPlaceService
} from '@applications/ecosystem/components/marketplace-conditions/marketplace-contitions.service';
import * as fromRoles from '@core/modules/roles/store/roles.reducer';
import { RolesService } from '@core/modules/roles/services/roles.service';
import {
  OpportunitiesFieldSharedService
} from '@shared/modules/opportunities-fields-shared/services/opportunities-fields-shared.service';
import * as fromCertifications from '@core/modules/certifications/store/certifications.reducer';
import { RoleCategoryModel, RoleModel } from '@core/modules/roles/models';
import { CertificationsService } from '@core/modules/certifications/services';
import { SetFocusOnInvalid } from '@shared/utils/form';
import { Urls } from '@core/services';
import { FILESTACK_SUCCESS_STATUS, FilestackService } from '@core/services/filestack.service';
import {
  QuestionsManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/questions-management/questions-management.component';
import {
  PaymentManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/payment-management/payment-management.component';
import {
  TargetManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/target-management/target-management.component';
import { ManagementOpportunityFormService } from '../../shared/services/management-opportunity-form.service';
import {
  ModeManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/mode-management/mode-management.component';
import {
  LanguagesManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/languages-management/languages-management.component';
import {
  OpportunityTarget, OpportunityDurationUnit
} from '../../models/opportunity.enum';
import { OpportunityModel } from '../../models/opportunity.model';
import * as OpportunitiesActions from '../../store/actions/opportunities.action';
import { OpportunitiesAdminService } from './../../modules/admin/service/opportunities-admin.service';
import { EventService } from '@ecosystem/modules/events/service/events.service';
import { Event } from '@ecosystem/modules/events/store/event.model';
import { ProjectService } from '@applications/workspace/projects/services/project.service';
import { GenericProject } from '@applications/workspace/projects/models/project.model';

@Component({
  selector: 'app-opportunity-form',
  templateUrl: './opportunity-form.component.html',
  providers: [EventService, ProjectService]
})
export class OpportunityFormComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild(QuestionsManagementComponent, {static: false}) questionFieldsComponent: QuestionsManagementComponent;
  @ViewChild(PaymentManagementComponent, {static: false}) paymentFieldsComponent: PaymentManagementComponent;
  @ViewChild(TargetManagementComponent, {static: false}) targetFieldsComponent: TargetManagementComponent;
  @ViewChild(ModeManagementComponent, {static: false}) modeFieldsComponent: ModeManagementComponent;
  @ViewChild(LanguagesManagementComponent, {static: false}) languagesFieldsComponent: LanguagesManagementComponent;
  @Input() opportunity?: OpportunityModel;
  form: FormGroup;
  isSubmitted = false; // Guard attribute
  allKeywords$: Observable<KeywordModel[]>;
  certifications$: Observable<CertificationModel[]>;
  checkCanExist = false;

  // Deadline field has a restriction about min value to show available and the datepicker needs
  // a Date not Moment for a restriction in an internal function.
  today = MomentTZ().toDate();
  keywordModel = KeywordModel;
  private subscription = new Subscription();
  startMinValue: Date;
  categories: RoleCategoryModel[];
  roles: RoleModel[];
  certifications: CertificationModel[];
  filteredCertifications: CertificationModel[];
  certifiedPeople: any;
  durationUnits = OpportunityDurationUnit;
  myEvents$: Observable<Event[]>;
  myProjects$: Observable<GenericProject[]>;
  isCustomCategory = false;
  isCustomRole = false;
  maxLengthForCustomCategory = 200;
  maxLengthForCustomRole = this.maxLengthForCustomCategory;

  constructor(
    private location: Location,
    private store: Store<AppState>,
    private keywordsService: KeywordService,
    private promptDialog: PromptDialogService,
    private translate: TranslateService,
    private marketPlaceService: MarketPlaceService,
    public managementOpportunityFormService: ManagementOpportunityFormService,
    public oppFieldSharedService: OpportunitiesFieldSharedService,
    private certificationsService: CertificationsService,
    private opportunitiesAdminService: OpportunitiesAdminService,
    private rolesService: RolesService,
    private elRef: ElementRef,
    public events: EventService,
    public projects: ProjectService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.myEvents$ = this.events.getEvents({pageSize: 100, pageIndex: 1}).pipe(map(response => response.results));
    this.myProjects$ = this.projects.getAllProjects();

    this.subscription.add(this.store.pipe(
      select((state) => fromCertifications.getOpportunityCertifications(state.certifications))).subscribe(data => {
        this.certifications = this.filteredCertifications = data;
      })
    );
    this.subscription.add(
      this.opportunitiesAdminService.getRoles().subscribe(data => {
        this.categories = this.sortCategories(data);
      })
    );
    this.allKeywords$ = this.keywordsService.getKeywords();
    this.initializeForm();
    this.manageChanges();
  }

  ngAfterViewInit() {
    this.manageCertficationChanges();
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form && changes.opportunity && changes.opportunity.currentValue) {
      this.populateForm(changes.opportunity.currentValue);
      this.initializeCertificationValidators(changes.opportunity.currentValue.target);
    }
  }

  populateForm(opportunity: OpportunityModel) {
    const oldValueDeadlineDate = opportunity.deadlineDate;
    opportunity.deadlineDate = undefined;
    const oldStartDate = opportunity.startDate;
    opportunity.startDate = undefined;
    this.form.patchValue(opportunity, { emitEvent: false });
    if (oldValueDeadlineDate) {
      this.form.get('deadlineDate').setValue(oldValueDeadlineDate.toDate());
    }
    if (oldStartDate) {
      this.form.get('startDate').setValue(oldStartDate.toDate());
    }
    this.initializeCategoryField();
    this.initializeRoleField();
    this.initializeCertificationField();
    this.managementOpportunityFormService.populateForm(this.opportunity);
  }

  private sortCategories(data): RoleCategoryModel[] {
    return data.sort((a, b) => b.isOtherCategory() ? -1 : 1);
  }

  private sortRoles(data): RoleModel[] {
    return data.sort((a, b) => b.isOtherRole() ? -1 : 1);
  }

  initializeForm() {
    this.managementOpportunityFormService.initializeForm(this.opportunity);
    this.form = this.managementOpportunityFormService.form;
    this.extendForm();
  }

  manageCertficationChanges() {
    this.subscription.add(
      this.targetFieldsComponent.form.get('target').valueChanges.subscribe(value => {
        this.initializeCertificationValidators(value);
      })
    );
  }

  initializeCertificationValidators(value) {
    value === OpportunityTarget.OPEN
      ? this.form.get('certification').setValidators(Validators.required)
      : this.form.get('certification').setValidators(null);
    this.form.get('certification').updateValueAndValidity();
  }

  manageChanges() {
    this.subscription.add(
      this.form.valueChanges.subscribe(() => {
        this.checkCanExist = true;
      })
    );

    this.subscription.add(
      this.form.get('deadlineDate').valueChanges.subscribe(value => {
        const startDate = this.form.get('startDate').value;
        if (startDate && startDate < value) {
          this.form.get('startDate').reset();
        }
        this.startMinValue = MomentTZ.isMoment(value) ? value.toDate() : value;
      })
    );

    this.subscription.add(
      this.form.get('category').valueChanges.subscribe((roleCategory: RoleCategoryModel)  => {
        this.updateRoles(roleCategory);
        roleCategory.isOtherCategory()
          ? this.form.get('customCategory').setValidators(Validators.required)
          : this.form.get('customCategory').setValidators(null);
        this.isCustomCategory = roleCategory.isOtherCategory();
        this.isCustomRole = false;
        this.resetCerfificationsField();
      })
    );

    this.subscription.add(
      this.form.get('role').valueChanges.subscribe((role: RoleModel) => {
        if (this.isOpen()) {
          const category = this.form.get('category').value;
          const roleCertifications = category.roles.find(r => r.code === role.code);
          if (roleCertifications.certifications.length > 0) {
            const requiredCertification = this.certifications.find(
              cert => cert.code === roleCertifications.certifications[0]);
            this.form.get('certification').setValue(requiredCertification.code);
            this.form.get('certification').updateValueAndValidity();
            this.filteredCertifications = requiredCertification
              ? this.certifications.filter(cert => cert.level >= requiredCertification.level)
              : this.certifications;
          }
          role.isOtherRole()
            ? this.form.get('customRole').setValidators(Validators.required)
            : this.form.get('customRole').setValidators(null);
          this.isCustomRole = role.isOtherRole();
        }
      })
    );

    this.subscription.add(
      this.form.get('certification').valueChanges.subscribe((certification: string) => {
        if (certification) {
          this.getCertifiedPeopleByCertification(certification);
        }
      })
    );
  }

  private updateRoles(roleCategory: RoleCategoryModel): void {
    this.subscription.add(this.store.pipe(
      select(state => fromRoles.getRolesByCategory(state.roles, roleCategory.code)),
    ).subscribe((res) => {
      this.roles = this.sortRoles(res);
    }));
  }

  private resetCerfificationsField(): void {
    this.form.get('certification').reset();
    this.filteredCertifications = this.certifications;
    // Hide the certified people info until one certification is selected
    this.certifiedPeople = undefined;
  }

  private getCertifiedPeopleByCertification(certification: string) {
    this.subscription.add(
      this.certificationsService.getCertifiedPeopleByCertification(certification).subscribe((res) => {
        this.certifiedPeople = res;
      }
    ));
  }

  extendForm() {
    if (this.opportunity && this.opportunity.customCategory) {
      this.isCustomCategory = true;
    }
    this.form.addControl('customCategory', new FormControl(
      this.opportunity && this.opportunity.customCategory ? this.opportunity.customCategory : '', )
    );
    if (this.opportunity && this.opportunity.customRole) {
      this.isCustomRole = true;
    }
    this.form.addControl('customRole', new FormControl(
      this.opportunity && this.opportunity.customRole ? this.opportunity.customRole : '', )
    );

    this.form.addControl('numPositions', new FormControl(
      this.opportunity ? this.opportunity.numPositions : '',
      [Validators.required, positiveNumberValidator()])
    );
    this.form.addControl('keywords', new FormControl(
      this.opportunity ? this.opportunity.keywords : '',
      [Validators.required, Validators.minLength(1)])
    );
    this.form.addControl(
      'startDate',
      new FormControl( this.opportunity ? this.opportunity.startDate : '')
    );
    this.form.addControl('deadlineDate', new FormControl(
      this.opportunity && this.opportunity.deadlineDate ? this.opportunity.deadlineDate.toDate() : '',
      Validators.required)
    );
    this.initializeCategoryField();
    this.initializeRoleField();
    this.initializeCertificationField();
  }

  initializeCertificationField() {
    let value, validators;
    if (this.opportunity) {
      value = this.opportunity.certificationRequired
        ? this.opportunity.certificationRequired.code
        : '';
      validators = this.opportunity.isTargetOpen()
        ? [Validators.required]
        : [];
    } else {
      value = '';
      validators = [Validators.required];
    }
    const certificationControl = new FormControl(value, validators);
    this.form.get('certification') ?
      this.form.setControl('certification', certificationControl) :
      this.form.addControl('certification', certificationControl);
  }

  initializeRoleField() {
    const roleControl = new FormControl(
        this.opportunity && this.opportunity.exoRole ?
        this.opportunity.exoRole.code :
        '',
      [Validators.required]
    );

    this.form.get('role') ?
      this.form.setControl('role', roleControl) :
      this.form.addControl('role', roleControl);
  }

  private initializeCategoryField(): void {
    const categoryControl = new FormControl(
      this.opportunity && this.opportunity.exoCategory ? this.opportunity.exoCategory.code : '',
      [Validators.required]);
    this.form.get('category') ?
      this.form.setControl('category', categoryControl) :
      this.form.addControl('category', categoryControl);
    if (this.opportunity && this.opportunity.exoCategory) {
      this.updateRoles(this.opportunity.exoCategory);
    }
  }

  isOpen(): boolean {
    return this.targetFieldsComponent && this.targetFieldsComponent.form.get('target').value === OpportunityTarget.OPEN;
  }

  getDataToSend() {
    let data = this.managementOpportunityFormService.getDataToSend();
    // 'T' is the divider between day and time
    if (data['startDate']) {
      data['startDate'] = data['startDate'].toISOString().split('T')[0];
    } else {
      delete data['startDate'];
    }
    data['deadlineDate'] = convertDateToString(data['deadlineDate']);
    if (data['relatedEntity']) {
      data['context_object_uuid'] = data['relatedEntity']['uuid'];
      data['context_content_type'] = data['relatedEntity'] instanceof GenericProject ? 'project' : 'event';
    }

    const initialQuestions = this.opportunity ? this.opportunity.questions : [];
    data['questions'] = this.oppFieldSharedService.getQuestionsToSend(
      this.questionFieldsComponent.form, initialQuestions
    );
    const targetData = this.oppFieldSharedService.getDataToSendFromTarget(this.targetFieldsComponent.form);
    data = {...data, ...targetData};

    const modeData = this.oppFieldSharedService.getDataToSendFromMode(this.modeFieldsComponent.form);
    data = {...data, ...modeData};

    const languageData = this.oppFieldSharedService.getDataToSendFromLanguages(this.languagesFieldsComponent.form);
    data = {...data, ...languageData};
    this.getDataToSendFromPosition(data);
    return data;
  }

  private getDataToSendFromPosition(data: any): void {
    if (data['customCategory']) {
      data['otherCategoryName'] = data['customCategory'];
      delete data['customCategory'];
    }
    delete data['category'];
    data['exoRole'] = data['role'].code;
    delete data['role'];
    if (data['customRole']) {
      data['otherRoleName'] = data['customRole'];
      delete data['customRole'];
    }
    data['certificationRequired'] = data['certification'];
    delete data['certification'];
  }

  private isValid(): boolean {
    return this.form.valid
      && this.questionFieldsComponent.form.valid
      && this.paymentFieldsComponent.form.valid
      && this.targetFieldsComponent.form.valid
      && this.modeFieldsComponent.form.valid
      && this.languagesFieldsComponent.form.valid;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.checkCanExist = false;
    if (this.isValid()) {
      const data = this.getDataToSend();
      if (!this.isEditing()) {
        this.store.dispatch(new OpportunitiesActions.PreviewOpportunity({
          data: data,
          baseUrls: {
            list: Urls.ECOSYSTEM_OPPORTUNITIES_PUBLISHED_YOU,
            viewDetails: Urls.ECOSYSTEM_OPPORTUNITY_ADMIN
          }
        }));
      } else {
        this.shouldShowDialog()
          ? this.subscription.add(this.notifyByEmail().subscribe(res => this.actionToEdit(data, res)))
          : this.actionToEdit(data);
      }
    } else {
      this.modeFieldsComponent.showLocationErrors();
      SetFocusOnInvalid(this.form, this.elRef);
    }
  }

  /**
   * If any field is modified except those related to the target, we should advise the user
   */
  private shouldShowDialog(): boolean {
    return Object.keys(this.form.controls).some(
      key => this.form.get(key).dirty && !(['recipients', 'target'].includes(key)));
  }

  private isEditing() {
    return this.opportunity;
  }

  actionToEdit(dataToSend: Object, notifyData?: Object) {
    const notificationData = notifyData ?
      notifyData === true ? { sendNotification: true } : { sendNotification: true, comment: notifyData } :
      { sendNotification: false };
    this.store.dispatch(new OpportunitiesActions.EditOpportunity({
      opportunityPk: this.opportunity.pk,
      data: {... dataToSend, ...notificationData },
      baseUrlViewDetails: Urls.ECOSYSTEM_OPPORTUNITY_ADMIN
    }));
    this.goBack();
  }

  goBack() {
    this.location.back();
  }

  seeMarketplaceConditions() {
    const newWindow = window.open('', '_blank');
    this.subscription.add(this.marketPlaceService.getMarketPlaceConditions().subscribe(
      agreement => newWindow.location.href = agreement.pdf
    ));
  }

  notifyByEmail(): Observable<boolean|string> {
    return this.promptDialog.open({
      title: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.NOTIFICATION_DIALOG.TITLE'),
      messages: [this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.NOTIFICATION_DIALOG.MESSAGE')],
      secondaryButton: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.NOTIFICATION_DIALOG.NOT_SEND'),
      primaryButton: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.NOTIFICATION_DIALOG.SEND'),
      textArea: {
        placeholder: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.NOTIFICATION_DIALOG.PLACEHOLDER')
      }
    }).pipe(filter(res => res !== undefined));
  }

  durationUnitsOrder = (): number => {
    return 1; // Order by minute -> hour -> day -> week -> month.
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get roleUrlHelpCenter() {
    return this.rolesService.urlHelpCenter(this.form.get('category').value);
  }

  addResource(file: PickerFileMetadata): void {
    if (!file.status) {
      file.status = FILESTACK_SUCCESS_STATUS;
    }
    const tmpValue = this.form.get('files').value;
    tmpValue.push(FilestackService.buildUploadedObject(file));
    this.form.get('files').setValue(tmpValue);
  }

}
