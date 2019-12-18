import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, tap, switchMap, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '@core/store/reducers';
import * as fromStore from '@applications/workspace/projects/store/reducer/index';
import * as projectActions from '@applications/workspace/projects/store/action/projects.action';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { BreakPointService } from '@applications/break-point/break-point.service';
import { ProjectService } from '@applications/workspace/projects/services/project.service';
import { getEnumValue } from '@shared/helpers/enum.helper';
import { AllCurrenciesEnum } from '@applications/ecosystem/modules/opportunities/models/opportunity.enum';
import {
  AdvisoryCallSettingsDialogComponent
} from './advisory-call-settings-dialog/advisory-call-settings-dialog.component';
import { AdvisoryCallSettingsInterface } from '../../../models/project.interface';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subscriptions = new Subscription();
  project: GenericProject;
  isDirty = false;
  advisoryCallDescription: string;
  advisoryCallSettings: AdvisoryCallSettingsInterface;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private breakPointService: BreakPointService,
    private translate: TranslateService,
    private projectsService: ProjectService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      directoryEnabled: [undefined],
      teamCommunicationsModuleEnabled: [undefined],
      askEcosystemEnabled: [{value: undefined, disabled: true}],
      swarmSessionsModuleEnabled: [{value: undefined, disabled: true}],
      quizesEnabled: [undefined],
      feedbackEnabled: [undefined],
      ticketsModuleEnabled: [{value: undefined, disabled: true}]
    });

    this.subscriptions.add(
      this.store.pipe(
        select(state => fromStore.selectProjectSelected(state.workspaceProjects.projects)),
        filter(project => project !== undefined),
        tap(project => this.project = project),
        tap(project => {
          this.form.patchValue(project.settings, { emitEvent: false });
        }),
        take(1),
        switchMap(project => this.projectsService.getAdvisoryCallSettings(project.pk))
      ).subscribe(result => {
          this.advisoryCallSettings = result;
          this.humanizedAdvisoryCallDesription(result);
      })
    );
    this.subscriptions.add(
      this.form.get('ticketsModuleEnabled').valueChanges.subscribe((value) => this.manageAdvisoryCallSettings())
    );
  }

  manageAdvisoryCallSettings() {
    if (this.form.get('ticketsModuleEnabled').value) {
      this.initializeAdvisoryCallDialog();
    } else {
      this.advisoryCallDescription = '';
    }
  }

  initializeAdvisoryCallDialog() {
    const title = this.translate.instant(
      'ECOSYSTEM.WORKSPACE.PROJECTS.FORM.SETTINGS.ADVISORY_CALL_SETTINGS_DIALOG.TITLE');
    const data = {
      project: this.project,
      advisoryCallSettings: this.advisoryCallSettings
    };
    this.subscriptions.add(
      this.breakPointService.fsSmDialogLg(AdvisoryCallSettingsDialogComponent, {
        data,
        title,
      }).subscribe()
    );
    this.subscriptions.add(
      this.breakPointService.fsSmDialogLgClosed().subscribe(result => {
        if (result) {
          this.advisoryCallSettings = result;
          this.humanizedAdvisoryCallDesription(result);
        }
      })
    );
  }

  onToggle($event, control: AbstractControl) {
    control.setValue($event.status);
    const dataForm = <GenericProject>{...this.project, settings: this.form.getRawValue()};
    this.store.dispatch(new projectActions.Settings(dataForm));
  }

  onClickEditAdvisoryCallSettings() {
    this.initializeAdvisoryCallDialog();
  }

  humanizedAdvisoryCallDesription(data: AdvisoryCallSettingsInterface) {
    this.advisoryCallDescription =
      `${this.humanizedTotalAdvisoryCallSettings(data)} |
        ${this.humanizedDurationAdvisoryCallSettings(data)} |
        ${this.humanizedPriceAdvisoryCallSettings(data)}
      `;
  }

  humanizedTotalAdvisoryCallSettings(data: AdvisoryCallSettingsInterface): string {
    const totalLabel = this.translate.instant(
      'ECOSYSTEM.WORKSPACE.PROJECTS.FORM.SETTINGS.ENABLE_ADVISORY_CALL.SETTINGS.TOTAL');
    return `${data.total} ${totalLabel}`;
  }

  humanizedDurationAdvisoryCallSettings(data: AdvisoryCallSettingsInterface): string {
    const eachOneLabel = this.translate.instant(
      'ECOSYSTEM.WORKSPACE.PROJECTS.FORM.SETTINGS.ENABLE_ADVISORY_CALL.SETTINGS.EACH_ONE');
    const durationValueLabel = +data.durationValue === 1 ?
      this.translate.instant(
        'ECOSYSTEM.OPPORTUNITIES.CREATE.DURATION_UNITS.' + data.durationUnity) :
      this.translate.instant(
          'ECOSYSTEM.OPPORTUNITIES.CREATE.DURATION_UNITS_PLURAL.' + data.durationUnity);
    return `${data.durationValue} ${durationValueLabel} ${eachOneLabel}`;
  }

  humanizedPriceAdvisoryCallSettings(data: AdvisoryCallSettingsInterface): string {
    const eachOneLabel = this.translate.instant(
      'ECOSYSTEM.WORKSPACE.PROJECTS.FORM.SETTINGS.ENABLE_ADVISORY_CALL.SETTINGS.EACH_ONE');
    const budgetLabels = data.budgets.map(b => {
      const value = !Number.isNaN(+b.budget) ? +b.budget : b.budget;
      return `${value} ${getEnumValue(AllCurrenciesEnum, b.currency)}`;
    });
    return `${budgetLabels} ${eachOneLabel}`;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

