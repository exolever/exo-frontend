import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { UrlService, Urls, ApiResources } from '@core/services';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';

import { GenericProject } from '../../models/project.model';

@Component({
  selector: 'app-project-profile',
  templateUrl: './project-profile.component.html',
  styleUrls: ['./project-profile.component.scss']
})
export class ProjectProfileComponent extends ManageMatMenuComponent implements OnInit, OnDestroy {
  projectPk: number;
  project$: Observable<GenericProject>;

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private breadCrumbService: BreadCrumbService,
    private router: Router,
    private http: HttpClient,
    private urlService: UrlService,
  ) {
    super();
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectPk = +params.projectPk;
      this.project$ = this.getProjectData(this.projectPk).pipe(
        tap(project => {
          this.breadCrumbService.appendCrumb(project.name);
          this.breadCrumbService.updateBreadCrumb({
            label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.WORKSPACE.SUMMARY')
          });
        })
      );
    });
  }

  onEdit() {
    const url = this.urlService.getPath([Urls.ECOSYSTEM_WORKSPACE_PROJECTS_EDIT, this.projectPk.toString()]);
    this.router.navigate([url]);
  }

  getProjectData(pk: number): Observable<GenericProject> {
    const apiUrl = this.urlService.resolve(ApiResources.GET_GENERIC_PROJECT, pk);
    return this.http.get<GenericProject>(apiUrl).pipe(
      map(response => new GenericProject(response))
    );
  }

  ngOnDestroy() {
    this.breadCrumbService.popLastCrumb();
    this.breadCrumbService.popLastCrumb();
  }
}
