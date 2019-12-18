import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '@core/store/reducers';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';

import * as ProjectActions from '../../store/action/projects.action';
import { FormGroup } from '@angular/forms';


@Component({
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  isDirty = false;
  constructor(
    private store: Store<AppState>,
    private translateService: TranslateService,
    private breadCrumbService: BreadCrumbService,
  ) { }

  ngOnInit() {
    this.breadCrumbService.updateBreadCrumb({
      label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.WORKSPACE.CREATE')
    });
  }

  onSubmit(data) {
    this.isDirty = false;
    this.store.dispatch(new ProjectActions.Create(data));
  }

  changeDataForm(form: FormGroup) {
    this.isDirty = form.dirty;
  }

  ngOnDestroy() {
    this.breadCrumbService.popLastCrumb();
  }
}
