import { Injectable } from '@angular/core';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Urls, UrlService } from '@app/core';

@Injectable()
export class SwarmBreadcrumbManagerService {

  constructor(
    private breadCrumbService: BreadCrumbService,
    private urlService: UrlService,
    private route: ActivatedRoute,
  ) { }

  /**
   * sets the breadcrumb for the ecosystem general view
   */
  setBreadcrumbEcosystemMainView(pkSession: string): void {
    // get project name and update breadcrumbs
    const projectName = this.route.snapshot.queryParams['name'] ?
      decodeURIComponent(this.route.snapshot.queryParams['name']) : 'swarm session';
    const urlToMainView = this.urlService.getPath([Urls.SWARM_SESSIONS_ECOSYSTEM, pkSession]);
    this.breadCrumbService.updateBreadCrumb(
    { label: projectName, url: urlToMainView }
    );
  }

  /**
   * sets the breadcrumb for the ecosystem detail view
   */
  setBreadcrumbEcosystemQuestionDetailView(postTitle: string, pkSession: string): void {
    this.setBreadcrumbEcosystemMainView(pkSession);
    this.breadCrumbService.appendCrumb(postTitle);
  }
}
