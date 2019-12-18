import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { filter, tap, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';


import { UrlService, Urls } from '@core/services';
import { AppState } from '@core/store/reducers';
import { getEnumValue } from '@shared/helpers/enum.helper';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';

import * as TeamActions from '@applications/workspace/projects/store/action/team.action';
import * as ProjectsActions from '@applications/workspace/projects/store/action/projects.action';
import * as fromStore from '@applications/workspace/projects/store/reducer/index';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { StatusProjectEnum } from '@applications/workspace/projects/projects.enum';

@Component({
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  project$: Observable<GenericProject>;
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private urlService: UrlService,
    private promptDialogService: PromptDialogService,
    private breadCrumbService: BreadCrumbService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.store.dispatch(new ProjectsActions.LoadDetails(params.projectPk));
      this.store.dispatch(new TeamActions.Load(params.projectPk));
    });
    this.project$ = this.store.pipe(select(state => fromStore.selectProjectSelected(state.workspaceProjects.projects)));

    this.subscriptions.add(
      this.store.pipe(
        select(state => fromStore.selectProjectSelected(state.workspaceProjects.projects)),
        filter(project => project !== undefined),
        take(1),
        tap(project => this.breadCrumbService.appendCrumb(project.name))
      ).subscribe()
    );
  }

  onPreview(project: GenericProject) {
    this.subscriptions.add(
      this.store.pipe(
        select(state => fromStore.selectAllTeams(state.workspaceProjects)),
        take(1)
      ).subscribe(teams => {
        if (teams.length > 0) {
          const url = this.urlService.getPath(
            [
              Urls.STEP_GENERIC_PROJECT,
              project.pk.toString(),
              teams[0].pk.toString(),
              project.currentStep.pk.toString()
            ]);
          window.open(url, '_blank');
        }
      })
    );
  }

  disablePublishButton(project?: GenericProject) {
    return !project.canPublish();
  }

  onPublish(project: GenericProject) {
    this.subscriptions.add(
      this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.PUBLISH.TITLE'),
        messages: [
          this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.PUBLISH.MESSAGE1'),
          this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.PUBLISH.MESSAGE2')
        ],
        textArea: {
          isRequired: false,
          placeholder: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.PUBLISH.PLACEHOLDER')
        },
        secondaryButton: this.translate.instant('COMMON.ACTIONS.CANCEL'),
        primaryButton: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.PUBLISH.ACTION')
      }).pipe(
        filter((result) => result !== undefined && result !== false),
        tap((message) => this.store.dispatch(
          new ProjectsActions.Publish({projectPk: project.pk, message: message}))
        )
      ).subscribe()
    );
  }

  getStatusLabel(project: GenericProject): string {
    return 'ECOSYSTEM.WORKSPACE.PROJECTS.STATUS.' + getEnumValue(StatusProjectEnum, project.status);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
