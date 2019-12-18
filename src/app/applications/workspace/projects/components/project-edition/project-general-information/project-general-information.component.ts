import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromStore from '@applications/workspace/projects/store/reducer/index';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import * as ProjectActions from '@applications/workspace/projects/store/action/projects.action';
import { AppState } from '@core/store/reducers';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';


@Component({
  selector: 'app-project-general-information',
  templateUrl: './project-general-information.component.html',
  styleUrls: ['./project-general-information.component.scss']
})
export class ProjectGeneralInformationComponent implements OnInit {
  project$: Observable<GenericProject>;
  isDirty = false;
  constructor(
    private store: Store<AppState>,
    private breadCrumbService: BreadCrumbService
  ) { }

  ngOnInit() {
    this.project$ = this.store.pipe(select(state =>
      fromStore.selectProjectSelected(state.workspaceProjects.projects)));
  }

  onSubmit(data) {
    this.isDirty = false;
    this.store.dispatch(new ProjectActions.Edit(data));
    this.breadCrumbService.replaceLastCrumb(data.name);
  }

  changeDataForm(form: FormGroup) {
    this.isDirty = form.dirty;
  }
}
