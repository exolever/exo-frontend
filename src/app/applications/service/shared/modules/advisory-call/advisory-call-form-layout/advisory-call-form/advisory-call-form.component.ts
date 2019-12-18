import { CertificationModel } from '@core/modules/certifications/models';
import { Component, OnInit, OnDestroy, Input, ViewChild,
  AfterViewInit, ElementRef, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import * as MomentTZ from 'moment-timezone';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { PickerFileMetadata } from 'filestack-js';

import { positiveNumberValidator } from '@shared/custom-validations/';
import { KeywordModel } from '@applications/shared/models';
import { KeywordService } from '@applications/shared/services';
import { AppState } from '@core/store/reducers';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { convertDateToString } from '@shared/helpers/md2Datepicker.helper';
import * as fromCertifications from '@core/modules/certifications/store/certifications.reducer';
import { CertificationsService } from '@core/modules/certifications/services';
import { SetFocusOnInvalid, ShowErrors } from '@shared/utils/form';
import { OpportunityTarget } from '@opportunities/models/opportunity.enum';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import * as OpportunitiesActions from '@opportunities/store/actions/opportunities.action';
import { Urls, UrlService } from '@core/services';
import { ProjectModel } from '@applications/service/old-project/models/project.model';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { Team as GPTeam } from '@applications/workspace/projects/models/team.model';
import { TeamModel } from '@applications/service/old-project/models/team.model';
import { FILESTACK_SUCCESS_STATUS, FilestackService } from '@core/services/filestack.service';
import {
  OpportunitiesFieldSharedService
} from '@shared/modules/opportunities-fields-shared/services/opportunities-fields-shared.service';
import {
  QuestionsManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/questions-management/questions-management.component';
import {
  TargetManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/target-management/target-management.component';
import {
  ModeManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/mode-management/mode-management.component';
import {
  LanguagesManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/languages-management/languages-management.component';
import { SprintRoleEnum } from '@core/modules/roles/enums';


@Component({
  selector: 'app-advisory-call-form',
  templateUrl: './advisory-call-form.component.html',
  styleUrls: ['./advisory-call-form.component.scss']
})
export class AdvisoryCallFormComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild(QuestionsManagementComponent, {static: true}) questionFieldsComponent: QuestionsManagementComponent;
  @ViewChild(TargetManagementComponent, {static: false}) targetFieldsComponent: TargetManagementComponent;
  @ViewChild(ModeManagementComponent, {static: false}) modeFieldsComponent: ModeManagementComponent;
  @ViewChild(LanguagesManagementComponent, {static: false}) languagesFieldsComponent: LanguagesManagementComponent;
  @Input() opportunity?: OpportunityModel;
  @Input() groupPk: number;
  form: FormGroup;
  isSubmitted = false; // Guard attribute
  allKeywords$: Observable<KeywordModel[]>;
  certifications$: Observable<CertificationModel[]>;

  // Deadline field has a restriction about min value to show available and the datepicker needs
  // a Date not Moment for a restriction in an internal function.
  today = MomentTZ().toDate();
  keywordModel = KeywordModel;
  private subscription = new Subscription();
  startMinValue: Date;
  certifications: CertificationModel[];
  filteredCertifications: CertificationModel[];
  certifiedPeople: any;
  maxLengthForTitle = 200;
  team: GPTeam | TeamModel;
  project: ProjectModel | GenericProject;
  viewDetailUrl: string;
  listUrl: string;

  constructor(
    private location: Location,
    private store: Store<AppState>,
    private keywordsService: KeywordService,
    private promptDialog: PromptDialogService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private certificationsService: CertificationsService,
    public oppFieldSharedService: OpportunitiesFieldSharedService,
    private elRef: ElementRef,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.project = this.route.snapshot.data.project;
    this.team = this.route.snapshot.data.teamSelected;
    this.subscription.add(this.store.pipe(
      select((state) => fromCertifications.getOpportunityCertifications(state.certifications))).subscribe(data => {
        this.certifications = this.filteredCertifications = data;
      })
    );
    this.allKeywords$ = this.keywordsService.getKeywords();
    this.initializeForm();
    this.manageChanges();
    this.getUrls();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form && changes.opportunity && changes.opportunity.currentValue) {
      this.populateForm(changes.opportunity.currentValue);
      this.initializeCertificationValidators(changes.opportunity.currentValue.target);
    }
  }

  ngAfterViewInit() {
    this.manageCertficationChanges();
    this.cd.detectChanges();
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
    if (opportunity.certificationRequired) {
      this.form.get('certification').setValue(opportunity.certificationRequired.code);
    }
    this.initializeCertification();
    this.initializeFiles();
  }

  getUrls() {
    this.viewDetailUrl = this.project instanceof GenericProject ?
      this.urlService.getPath([Urls.GENERIC_ADVISOR_REQUEST_DETAIL, this.project.pk, this.team.pk]) :
      this.urlService.getPath([Urls.ADVISOR_REQUEST_DETAIL, this.project.pk, this.team.pk]);
    this.listUrl = this.project instanceof GenericProject ?
      this.urlService.getPath([Urls.GENERIC_ADVISOR_REQUEST, this.project.pk, this.team.pk]) :
      this.urlService.getPath([Urls.ADVISOR_REQUEST, this.project.pk, this.team.pk]);
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      title: [
        this.opportunity ? this.opportunity.subject : '',
        [Validators.required, Validators.maxLength(this.maxLengthForTitle)]
      ],
      description: [
        this.opportunity ? this.opportunity.description : '',
        Validators.required
      ],
      keywords: [
        this.opportunity ? this.opportunity.keywords : '',
        [Validators.required, Validators.minLength(1)]
      ],
      deadlineDate: [
        this.opportunity && this.opportunity.deadlineDate ? this.opportunity.deadlineDate.toDate() : '',
        Validators.required
      ],
      startDate: [this.opportunity ? this.opportunity.startDate : ''],
      numPositions: [
        this.opportunity ? this.opportunity.numPositions : 1,
        [Validators.required, positiveNumberValidator()]
      ],
    });
    this.initializeCertification();
    this.initializeFiles();
  }

  private initializeFiles(): void {
    const files = this.opportunity && this.opportunity.files ? this.opportunity.files.map(file => {
        return  {
          filename: file.name,
          mimetype: file.mimetype,
          url: file.link,
          filestackStatus: FILESTACK_SUCCESS_STATUS
        };
      }) : [];
    const fileControl = new FormControl(files);
    this.form.get('files') ?
      this.form.setControl('files', fileControl) :
      this.form.addControl('files', fileControl);
  }

  private initializeCertification() {
    const certificationControl = new FormControl(
        this.opportunity && this.opportunity.certificationRequired ?
        this.opportunity.certificationRequired.code :
        this.certifications.find(c => c.isFoundation()).code
    );

    this.form.get('certification') ?
      this.form.setControl('certification', certificationControl) :
      this.form.addControl('certification', certificationControl);
  }

  manageChanges() {
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
      this.form.get('certification').valueChanges.subscribe((certification: string) => {
        if (certification) {
          this.getCertifiedPeopleByCertification(certification);
        }
      })
    );
  }

  private getCertifiedPeopleByCertification(certification: string) {
    this.subscription.add(
      this.certificationsService.getCertifiedPeopleByCertification(certification).subscribe((res) => {
        this.certifiedPeople = res;
      }
    ));
  }

  getDataToSend() {
    let data = this.form.getRawValue();
    data['certificationRequired'] = data['certification'];
    delete data['certification'];
    // 'T' is the divider between day and time
    if (data['startDate']) {
      data['startDate'] = data['startDate'].toISOString().split('T')[0];
    } else {
      delete data['startDate'];
    }
    data['deadlineDate'] = convertDateToString(data['deadlineDate']);
    data['group'] = this.groupPk;
    data['exoRole'] = SprintRoleEnum.ADVISOR_SPRINT;
    data['numPositions'] = +data.numPositions;
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
    return data;
  }

  private isValid(): boolean {
    return this.form.valid
      && this.questionFieldsComponent.form.valid
      && this.targetFieldsComponent.form.valid
      && this.modeFieldsComponent.form.valid
      && this.languagesFieldsComponent.form.valid;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.isValid()) {
      const data = this.getDataToSend();
      if (!this.opportunity) { // Creation
        this.store.dispatch(new OpportunitiesActions.PreviewOpportunity({
          data: data,
          baseUrls: {
            list: this.listUrl,
            viewDetails: this.viewDetailUrl
          }
        }));
      } else { // Edition
        this.shouldShowDialog()
          ? this.subscription.add(this.notifyByEmail().subscribe(res => this.actionToEdit(data, res)))
          : this.actionToEdit(data);
      }
    } else {
      this.modeFieldsComponent.showLocationErrors();
      SetFocusOnInvalid(this.form, this.elRef);
    }
  }

  showErrors(field: string, isSubmitted: boolean): boolean {
    return ShowErrors(isSubmitted, this.form, field);
  }

  /**
   * If any field is modified except those related to the target, we should advise the user
   */
  private shouldShowDialog(): boolean {
    return Object.keys(this.form.controls).some(
      key => this.form.get(key).dirty && !(['recipients', 'target'].includes(key)));
  }

  actionToEdit(dataToSend: Object, notifyData?: Object) {
    const notificationData = notifyData ?
      notifyData === true ? { sendNotification: true } : { sendNotification: true, comment: notifyData } :
      { sendNotification: false };
    this.store.dispatch(new OpportunitiesActions.EditOpportunity({
      opportunityPk: this.opportunity.pk,
      data: {... dataToSend, ...notificationData },
      baseUrlViewDetails: this.viewDetailUrl
    }));
    this.goBack();
  }

  goBack() {
    this.location.back();
  }

  isOpen(): boolean {
    return this.targetFieldsComponent && this.targetFieldsComponent.form.get('target').value === OpportunityTarget.OPEN;
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

  addResource(file: PickerFileMetadata): void {
    if (!file.status) {
      file.status = FILESTACK_SUCCESS_STATUS;
    }
    const tmpValue = this.form.get('files').value;
    tmpValue.push(FilestackService.buildUploadedObject(file));
    this.form.get('files').setValue(tmpValue);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
