import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PageEvent, MatDialog } from '@angular/material';

import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime, filter, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';
import { CertificationModel } from '@core/modules/certifications/models';
import * as fromCertifications from '@core/modules/certifications/store/certifications.reducer';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { RequiredCertificationDialogComponent } from '@shared/components';

import * as ProjectsActions from '../../store/action/projects.action';
import * as fromStore from '../../store/reducer/index';
import { GenericProject } from '../../models/project.model';
import { ProjectActionsEnum } from '../../projects.enum';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';

@Component({
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent extends ManageMatMenuComponent implements OnInit, OnDestroy {
  searchBox = new FormControl('');
  subscriptions = new Subscription();
  projects$: Observable<GenericProject[]>;
  emptyMoment$: Observable<boolean>;
  loading$: Observable<boolean>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalProjects$: Observable<number>;
  text$: Observable<string>;
  sortBy$: Observable<string>;
  certification$: Observable<CertificationModel>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private promptDialogService: PromptDialogService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.store.dispatch(new ProjectsActions.RestoreState());
      this.store.dispatch(new ProjectsActions.Load());
    });

    this.subscriptions.add(
      this.searchBox.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((value: string) =>
        this.store.dispatch(new ProjectsActions.SetSearch(value)
        )
      )
    );

    this.projects$ = this.store.pipe(select(state => fromStore.selectAllProjects(state.workspaceProjects)));
    this.emptyMoment$ = this.store.pipe(select(state => fromStore.projectsEmptyMoment(state.workspaceProjects)));
    this.loading$ = this.store.pipe(select(state => fromStore.projectsAreLoading(state.workspaceProjects)));
    this.pageIndex$ = this.store.pipe(select(state => fromStore.selectPageIndexProject(state.workspaceProjects)));
    this.pageSize$ = this.store.pipe(select(state => fromStore.selectPageSizeProject(state.workspaceProjects)));
    this.totalProjects$ = this.store.pipe(select(state => fromStore.selectCountProjects(state.workspaceProjects)));
    this.text$ = this.store.pipe(select(state => fromStore.selectSearchBy(state.workspaceProjects)));
    this.sortBy$ = this.store.pipe(select(state => fromStore.selectSortBy(state.workspaceProjects)));
    this.certification$ = this.store.pipe(
      select(state => fromCertifications.getCertification(state.certifications,
        {code: CertificationEnum.SPRINT_COACH})),
      filter(certification => certification !== undefined));

  }

  onProjectAction(action: ProjectActionsEnum, project: GenericProject) {
    switch (action) {
      case ProjectActionsEnum.EDIT:
        this.onEdit(project);
        break;
      case ProjectActionsEnum.DELETE:
          this.onDelete(project);
          break;
      case ProjectActionsEnum.PUBLISH:
          this.onPublish(project);
          break;
    }
  }
  onEdit(project: GenericProject) {
    // Tracking: (ActionGA.EditionFromList, {
    //   label: LabelGA.edit_project,
    //   category: CategoryGA.Projects
    // });

    this.router.navigate([`${project.pk.toString()}/edit`], { relativeTo: this.route });
  }

  onCreate(certification: CertificationModel) {
    this.subscriptions.add(
      this.store.pipe(
        select(state => fromUser.getUser(state)),
        tap(user => {
          if (user) {
            if (user.isCertifiedIn(certification) || user.isSuperuser) {
              // Tracking: (ActionGA.CreateFromList, {
              //   label: LabelGA.create_project,
              //   category: CategoryGA.Projects
              // });
              this.router.navigate([`create`], { relativeTo: this.route });
            } else {
              this.dialog.open(RequiredCertificationDialogComponent, {
                data: {
                  certification: certification,
                  prefix: 'ECOSYSTEM.WORKSPACE.PROJECTS.CREATE.NEED_CERTIFICATE',
                },
              });
            }
          }
        })
      ).subscribe()
    );
  }

  onDelete(project: GenericProject) {
    this.subscriptions.add(
      this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.DELETE_TITLE'),
        messages: [this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.DELETE_MESSAGE')],
        secondaryButton: this.translate.instant('FORUM.CANCEL'),
        primaryButton: this.translate.instant('FORUM.DELETE')
      }).pipe(
        filter((result) => result === true),
        tap(() => this.store.dispatch(new ProjectsActions.Delete(project))),
        // tap(() => Tracking: (ActionGA.DeletionFromSummary, {
        //   label: LabelGA.delete_project,
        //   category: CategoryGA.Projects
        // }))
      ).subscribe()
    );
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

  onUpdateSortBy($event: any): void {
    const selectedSort = $event.value;
    this.store.dispatch(new ProjectsActions.SortBy(selectedSort));
  }

  paginatorChange(page: PageEvent): void {
    this.store.dispatch(new ProjectsActions.SetPagination({
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize
    }));
  }

  onClick(project: GenericProject) {
    if (project.canEdit()) {
      this.onEdit(project);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
