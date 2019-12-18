import { Component, Input } from '@angular/core';

import { Job } from '@applications/my-jobs/models/job.model';
import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';

@Component({
  selector: 'app-my-jobs-card',
  templateUrl: './my-jobs-card.component.html',
  styleUrls: ['./my-jobs-card.component.scss']
})
export class MyJobsCardComponent extends ManageMatMenuComponent {
  @Input() job: Job;

  constructor() {
    super();
  }

  goTo(url: string) {
    window.open(url, '_blank');
  }

  canRedirect(): boolean {
    return !this.job.isUnstartedSwarm() && !!this.job.url;
  }
}
