import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as MomentTZ from 'moment-timezone';
import { TranslateService } from '@ngx-translate/core';
import { PickerFileMetadata } from 'filestack-js';

import { AppState } from '@core/store/reducers';
import { IGooglePlace } from '@shared/directives/google-places/google-place.interface';
import { ShowErrors } from '@shared/utils/form';
import * as actions from '@ecosystem/modules/events/store/events.action';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { FollowTypeEnum, RoleMember, TypeEventEnum } from '@ecosystem/modules/events/store/event.enums';
import { ConsultantModel, LanguageModel } from '@applications/shared/models';
import { LanguageService } from '@applications/shared/services';
import * as fromUser from '@core/store/user/user.reducer';
import { EventService } from '@ecosystem/modules/events/service/events.service';
import { FilestackService } from '@core/services/filestack.service';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { RequiredCertificationDialogComponent } from '@shared/components';
import { UserModel } from '@app/core';
import {
  IEcosystemSearcherConsultantOptions
} from '@shared/modules/ecosystem-searcher/ecosystem-searcher-result.interface';
import { PromptDataInterface } from '@shared/modules/prompt-dialog/prompt-dialog.interface';
import { CertificationModel } from '@core/modules/certifications/models';

import { Event, EventPermissionType, Participant } from '../../../store/event.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() event = new Event({});
  @Input() isReviewer: boolean;
  @Output() formChanges = new EventEmitter();
  @ViewChild('mainSpeakerTemplate', {static: false}) tplRef: ElementRef;

  uuid: string;
  maxLengthEventInput = 200;
  form: FormGroup;
  isSubmitted = false;
  speakerList: any = [];
  speakerExtraOptions: IEcosystemSearcherConsultantOptions[] = [];
  typePermissions: EventPermissionType[];
  languages$: Observable<LanguageModel[]>;
  user$ = this.store.pipe(select(state => fromUser.getUser(state)));
  user: UserModel;
  private subscriptions = new Subscription();
  minValueForEndDate: Date;
  today = MomentTZ().toDate();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private languagesService: LanguageService,
    private translate: TranslateService,
    private eventService: EventService,
    private location: Location,
    private promptDialogService: PromptDialogService,
    private filestackService: FilestackService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.formBuilder.group({
      category: [{value: ''}, [Validators.required]],
      typeEventName: [''],
      title: ['', [Validators.required, Validators.maxLength(this.maxLengthEventInput)]],
      start: ['', Validators.required],
      end: ['', Validators.required],
      followType: [FollowTypeEnum.INPERSON, Validators.required],
      languages: ['', [Validators.required]],
      url: [''],
      showPrice: [false, [Validators.required]],
      location: [''],
      placeId: [''], // Google places id
      eventImage: [''],
    });
  }

  ngOnInit() {
    this.filestackService.init();
    this.eventService.getPermissionsEvent().subscribe(res => this.typePermissions = res);
    this.languages$ = this.languagesService.getLanguages();
    this.subscriptions.add(this.user$.subscribe(user => this.user = user));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const current = changes.event.currentValue;
    if (current) {
      current.start = MomentTZ.isMoment(current.start) ? current.start.toDate() : current.start;
      this.minValueForEndDate = current.start;
      current.end = MomentTZ.isMoment(current.end) ? current.end.toDate() : current.end;
      this.form.patchValue(current);
      this.speakerList = this.setSpeakers();
      this.uuid = this.event ? this.event.uuid : null;
      this.formChanges.emit({...this.event, participants: this.speakerList});

    } else {
      this.setOwnerAsSpeaker();
    }
    this.speakerExtraOptions = this.getSpeakerExtraOptions(this.speakerList);
    this.subscriptions.add(this.form.get('start').valueChanges.subscribe(
      value => this.minValueForEndDate = MomentTZ.isMoment(value) ? value.toDate() : value
    ));

    this.subscriptions.add(
      this.form.valueChanges.subscribe(newForm =>
        this.formChanges.emit({...this.event, ...newForm, participants: this.speakerList})
      )
    );
    this.subscriptions.add(this.form.get('category').valueChanges.subscribe(
      value => {
        if (value && !this.isReviewer && !this.event) {
        this.checkCertification(value);
      }
      })
    );
  }

  showErrors(field: string): boolean {
    return ShowErrors(this.isSubmitted, this.form, field);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const data = this.form.getRawValue();
      data.participants = this.parseList(this.speakerList, this.getRole());
      data.start = MomentTZ(data.start).format('YYYY-MM-DD');
      data.end = MomentTZ(data.end).format('YYYY-MM-DD');
      if (this.event) {
        this.onSaveDialog(data);
      } else {
        this.onCreateDialog(data);
      }
    } else {
      this.showLocationErrors();
    }
  }

  showLocationErrors() {
    if (!this.form.get('placeId').value.length) {
      this.form.get('location').setErrors({'autoCompleteValidator': true});
      this.form.get('location').markAsTouched();
    }
  }

  // onSelect event emitter Google Place location.
  setLocation(addrObj: IGooglePlace) {
    this.form.get('location').setValue(addrObj.name);
    this.form.get('placeId').setValue(addrObj.placeId);
    this.form.markAsDirty();
    this.showLocationErrors();
  }

  onUpdateSpeakerList(consultants: Array<ConsultantModel>) {
    this.speakerList = consultants;
    this.speakerExtraOptions = this.getSpeakerExtraOptions(this.speakerList);
    this.form.markAsDirty();
    // this.event.participants = this.speakerList;
    this.formChanges.emit({...this.form.value, ...this.event, participants: this.speakerList});
  }

  /**
   * Define the extra options for EcosystemSearcherComponent consultant items
   */
  private getSpeakerExtraOptions(speakers: Array<ConsultantModel>): IEcosystemSearcherConsultantOptions[] {
    // Just the first speaker will have a template pointing out that it is the main speaker
    return speakers.length
      ? [
          <IEcosystemSearcherConsultantOptions>{
            consultantPk: speakers[0].uuid,
            canBeDeleted: true,
            template: this.tplRef
          }
        ]
      : [];
  }

  goBack() {
    this.location.back();
  }

  onClose() {
    const d = new Date(this.form.get('end').value).toLocaleDateString();
    this.form.patchValue({end: d});
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  isDirtyForm() {
    return this.form.dirty && this.form.valid && this.speakerList.length;
  }

  private onSaveDialog(data) {
    this.subscriptions.add(
      this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.EVENTS.DIALOG.SAVE.TITLE'),
        messages: [
          this.translate.instant('ECOSYSTEM.EVENTS.DIALOG.SAVE.MESSAGE'),
        ],
        secondaryButton: this.translate.instant('ECOSYSTEM.EVENTS.PROMPT.CANCEL'),
        primaryButton: this.translate.instant('ECOSYSTEM.EVENTS.PROMPT.YES')
      }).pipe(
        filter(result => result === true),
        tap(() => {
            const action = new actions.UpdateEvent({uuid: this.uuid, data: data});
            this.store.dispatch(action);
            this.form.markAsPristine();
            if (this.event.category !== TypeEventEnum.WORKSHOP) {
              this.goBack();
            }
          }
        )
      ).subscribe());
  }

  onCreateDialog(data) {
    this.subscriptions.add(
      this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.EVENTS.DIALOG.PENDING.TITLE'),
        messages: [
          this.translate.instant('ECOSYSTEM.EVENTS.DIALOG.PENDING.MESSAGE'),
        ],
        secondaryButton: this.translate.instant('ECOSYSTEM.EVENTS.PROMPT.CANCEL'),
        primaryButton: this.translate.instant('ECOSYSTEM.EVENTS.PROMPT.YES')
      }).pipe(
        filter(result => result === true),
        tap(() => {
            const action = new actions.AddEvent(data);
            this.store.dispatch(action);
            this.form.markAsPristine();
          }
        )
      ).subscribe());
  }

  private setOwnerAsSpeaker() {
    this.subscriptions.add(
      this.user$.subscribe(user => {
        const {uuid, status, profilePictures, userTitle, fullName, profileUrl} = user;
        this.speakerList = [...this.speakerList, {
          uuid,
          status,
          thumbnail: profilePictures[profilePictures.length - 1].url,
          userTitle,
          fullName,
          profileUrl,
          role: RoleMember.SPEAKER_SUMMIT
        }
        ];
        this.formChanges.emit({...this.form.value, ...this.event, participants: this.speakerList});
      })
    );
  }

  private setSpeakers() {
    const speakerList = this.event.participants.filter(p => p.role === this.getRole());
    return speakerList.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
  }

  private parseList(list: Participant[], role) {
    return list.map((p, idx) => ({order: idx, status: p.status, exoRole: role, uuid: p.uuid}));
  }

  onAfterUpload($event: PickerFileMetadata) {
    this.form.patchValue({eventImage: $event ? $event.url : null});
  }

  isVirtual() {
    return this.form.get('followType').value === FollowTypeEnum.VIRTUAL;
  }

  isOther() {
    return this.form.get('category').value === TypeEventEnum.OTHER;
  }

  private checkCertification(type: TypeEventEnum) {
    let certRequired;
    switch (type) {
      case TypeEventEnum.TALK:
        certRequired = CertificationEnum.FOUNDATION;
        break;
      case TypeEventEnum.WORKSHOP:
        certRequired = CertificationEnum.TRAINER;
        break;
      case TypeEventEnum.SUMMIT:
        certRequired = TypeEventEnum.SUMMIT;
        break;
      default:
        certRequired = CertificationEnum.FOUNDATION;
    }
    const selectedType = this.typePermissions.find((p: EventPermissionType) => p.category === type);
    if (!selectedType.available) {
      if (certRequired === TypeEventEnum.SUMMIT) {
        this.createSummitDialog();
      } else {
        this.matDialog.open(RequiredCertificationDialogComponent, {
          data: {
            certification: new CertificationModel(certRequired, null, null, null),
            // Prefix will need in json file a TITLES and a MESSAGE object
            prefix: 'ECOSYSTEM.EVENTS.CERTIFICATION',
          },
          panelClass: 'mw-960'
        });
      }
      this.form.patchValue({category: null});
    }
  }

  private createSummitDialog() {
    const config: PromptDataInterface = {
      title: this.translate.instant('ECOSYSTEM.EVENTS.EMAIL.TITLE'),
      messages: [this.translate.instant('ECOSYSTEM.EVENTS.EMAIL.MESSAGE1'),
        this.translate.instant('ECOSYSTEM.EVENTS.EMAIL.MESSAGE2')
      ],
      primaryButton: this.translate.instant('ECOSYSTEM.EVENTS.EMAIL.SEND'),
      secondaryButton: this.translate.instant('COMMON.CANCEL'),
      textArea: {
        placeholder: '',
        isRequired: true
      }
    };
    this.subscriptions.add(
      this.promptDialogService.open(config).pipe(filter(res => res !== false)).subscribe(res => {
        const data = { comment: res };
        this.subscriptions.add(
          this.eventService.sendEmail(data).subscribe((r: any) => {
            this.snackBar.open(this.translate.instant('ECOSYSTEM.EVENTS.TOAST.SENT_EMAIL'),
              this.translate.instant('NOTIFICATION.CLOSE'));
          })
        );
      })
    );
  }

  private getRole(): RoleMember {
    let role;
    switch (this.form.get('category').value) {
      case TypeEventEnum.OTHER:
        role = RoleMember.SPEAKER_OTHER;
        break;
      case TypeEventEnum.SUMMIT:
        role = RoleMember.SPEAKER_SUMMIT;
        break;
      case TypeEventEnum.TALK:
        role = RoleMember.SPEAKER_TALK;
        break;
      case TypeEventEnum.WORKSHOP:
        role = RoleMember.SPEAKER_WORKSHOP;
        break;
    }
    return role;
  }
}
