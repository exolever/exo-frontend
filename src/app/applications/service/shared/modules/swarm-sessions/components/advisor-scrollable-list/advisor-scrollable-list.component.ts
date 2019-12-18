import { Component, Inject, Input, OnChanges } from '@angular/core';

import { UI_CONFIG } from '@core/config/ui-config';
import { NavigationService } from '@shared/navigation/navigation.service';
import { UserReducedModel } from '@core/models/user/user.reduced.model';

import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';
import { SessionStatusService } from '@applications/swarm-sessions/sharedModule/services/session-status.service';

@Component({
  selector: 'app-advisor-scrollable-list',
  templateUrl: './advisor-scrollable-list.component.html',
  styleUrls: ['./advisor-scrollable-list.component.scss']
})
export class AdvisorScrollableListComponent implements OnChanges {
  @Input() selectedSession: SwarmSession;
  @Input() advisors: UserReducedModel[];
  startDateTime: string;
  timeRange: string;
  constructor(
    public sessionStatus: SessionStatusService,
    public navigationService: NavigationService,
    @Inject(UI_CONFIG) public config
  ) {}

  ngOnChanges() {
    this.setDateTimeStart();
  }

  /**
   * sets the proper values for date and time of start
   */
  setDateTimeStart(): void {
    this.startDateTime = this.selectedSession.startAt.format('Do MMM YYYY');
    this.timeRange = this.selectedSession.startAt.format('hh:mm a') + ' - ' +
                      this.selectedSession.endAt.format('hh:mm a');
  }

  showTime(): boolean {
    const started = this.sessionStatus.isSessionStarted(this.selectedSession);
    const expired = this.sessionStatus.isSessionExpired((this.selectedSession));
    return !(started && !expired);
  }
}
